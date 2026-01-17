<script lang="ts">
	import { onMount } from 'svelte';
	import { Plus, Pencil, Trash2, Upload, X } from '@lucide/svelte';
	import type { Ambassador } from '$lib/types';
	import { language } from '$lib/services/language';
	import { translations } from '$lib/services/translations';
	// import { PUBLIC_POCKETBASE_URL } from '$env/static/public';

	let ambassadors = $state<Ambassador[]>([]);
	let countries = $state<
		{ id: string; name_en: string; name_ru: string; flag: string; code: string }[]
	>([]);
	let loading = $state(true);
	let showModal = $state(false);
	let editingId = $state<string | null>(null);
	let activeTab = $state<'en' | 'ru'>('en');
	let countrySearch = $state('');

	let t = $derived(translations[$language].admin);

	// Form fields
	let form = $state({
		name_en: '',
		name_ru: '',
		country_en: '',
		country_ru: '',
		role_en: '',
		role_ru: '',
		image: null as File | null,
		isActive: true
	});

	// For previewing existing image
	let existingImageUrl = $state('');

	onMount(async () => {
		await Promise.all([fetchAmbassadors(), fetchCountries()]);
	});

	async function fetchCountries() {
		try {
			const res = await fetch('/api/admin/countries');
			countries = await res.json();
		} catch (error) {
			console.error('Failed to fetch countries:', error);
		}
	}

	async function fetchAmbassadors() {
		loading = true;
		try {
			const res = await fetch('/api/admin/ambassadors');
			ambassadors = await res.json();
		} catch (error) {
			console.error('Failed to fetch ambassadors:', error);
		} finally {
			loading = false;
		}
	}

	import { getImageUrl } from '$lib/utils';
	// function getImageUrl ... removed

	function openModal(ambassador?: Ambassador) {
		if (ambassador) {
			editingId = ambassador.id;
			form.name_en = ambassador.name_en;
			form.name_ru = ambassador.name_ru;
			form.country_en = ambassador.country_en;
			form.country_ru = ambassador.country_ru;
			form.role_en = ambassador.role_en;
			form.role_ru = ambassador.role_ru;
			form.isActive = ambassador.isActive;
			form.image = null; // Reset file input

			// Construct existing image URL if available
			existingImageUrl = ambassador.image
				? getImageUrl('ambassadors', ambassador.id, ambassador.image)
				: '';
		} else {
			editingId = null;
			form.name_en = '';
			form.name_ru = '';
			form.country_en = '';
			form.country_ru = '';
			form.role_en = '';
			form.role_ru = '';
			form.isActive = true;
			form.image = null;
			existingImageUrl = '';
		}
		activeTab = 'en';
		countrySearch = '';
		showModal = true;
	}

	let filteredCountries = $derived(
		countries.filter(
			(c) =>
				c.name_en.toLowerCase().includes(countrySearch.toLowerCase()) ||
				c.name_ru.toLowerCase().includes(countrySearch.toLowerCase()) ||
				c.code.toLowerCase().includes(countrySearch.toLowerCase())
		)
	);

	function selectCountry(country: (typeof countries)[0]) {
		form.country_en = country.name_en;
		form.country_ru = country.name_ru;
		countrySearch = '';
	}

	function closeModal() {
		showModal = false;
		editingId = null;
	}

	let submitting = $state(false);
	let formError = $state('');

	async function handleSubmit() {
		submitting = true;
		formError = '';
		try {
			const formData = new FormData();
			if (editingId) formData.append('id', editingId);
			formData.append('name_en', form.name_en);
			formData.append('name_ru', form.name_ru);
			formData.append('country_en', form.country_en);
			formData.append('country_ru', form.country_ru);
			formData.append('role_en', form.role_en);
			formData.append('role_ru', form.role_ru);
			formData.append('isActive', form.isActive.toString());

			if (form.image) {
				formData.append('image', form.image);
			} else if (editingId && existingImageUrl) {
				// Pass the relative path back if no new image is selected
				const url = new URL(existingImageUrl, window.location.origin);
				const path = url.pathname.startsWith('/') ? url.pathname.substring(1) : url.pathname;
				formData.append('existingImage', path);
			}

			const res = await fetch('/api/admin/ambassadors', {
				method: editingId ? 'PUT' : 'POST',
				body: formData
			});

			if (!res.ok) {
				const errData = await res.json().catch(() => ({}));
				throw new Error(errData.error || 'Failed to save ambassador');
			}

			closeModal();
			await fetchAmbassadors();
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			console.error('Submit error:', error);
			formError = error.message || 'An unexpected error occurred';
		} finally {
			submitting = false;
		}
	}

	async function handleDelete(id: string) {
		if (!confirm('Are you sure you want to delete this ambassador?')) return;

		await fetch('/api/admin/ambassadors', {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id })
		});

		await fetchAmbassadors();
	}

	function handleFileChange(e: Event) {
		const target = e.target as HTMLInputElement;
		if (target.files && target.files.length > 0) {
			form.image = target.files[0];
		}
	}
</script>

<svelte:head>
	<title>{t.ambassadors} - Admin</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold tracking-tight text-base-content">{t.ambassadors}</h1>
			<p class="mt-1 text-base-content/60">Manage your ambassador profiles and content</p>
		</div>
		<button class="btn btn-primary" onclick={() => openModal()}>
			<Plus class="h-5 w-5" />
			Add Ambassador
		</button>
	</div>

	<!-- Table -->
	<div class="card overflow-hidden rounded-xl border border-base-200 bg-base-100 shadow-sm">
		<div class="overflow-x-auto">
			<table class="table table-lg">
				<thead class="bg-base-200/50">
					<tr>
						<th>Name</th>
						<th>Location</th>
						<th>Role</th>
						<th>Status</th>
						<th class="text-right">Actions</th>
					</tr>
				</thead>
				<tbody>
					{#if loading}
						<tr>
							<td colspan="5" class="py-12 text-center">
								<span class="loading loading-lg loading-spinner text-primary"></span>
							</td>
						</tr>
					{:else if ambassadors.length === 0}
						<tr>
							<td colspan="5" class="py-12 text-center text-base-content/50">
								No ambassadors found. Create one to get started.
							</td>
						</tr>
					{:else}
						{#each ambassadors as ambassador (ambassador.id)}
							<tr class="hover">
								<td>
									<div class="flex items-center gap-4">
										<div class="avatar">
											<div class="mask h-12 w-12 bg-base-300 mask-squircle">
												{#if ambassador.image}
													<img
														src={getImageUrl('ambassadors', ambassador.id, ambassador.image)}
														alt={ambassador.name_en}
													/>
												{:else}
													<div
														class="flex h-full w-full items-center justify-center text-base-content/30"
													>
														<Upload class="h-6 w-6" />
													</div>
												{/if}
											</div>
										</div>
										<div>
											<div class="font-bold">{ambassador.name_en}</div>
											<div class="text-sm opacity-60">{ambassador.name_ru}</div>
										</div>
									</div>
								</td>
								<td>
									<div class="font-medium">{ambassador.country_en}</div>
									<div class="text-xs opacity-60">{ambassador.country_ru}</div>
								</td>
								<td>
									<div class="badge badge-ghost badge-sm">{ambassador.role_en}</div>
								</td>
								<td>
									{#if ambassador.isActive}
										<div class="badge gap-2 text-white badge-success">Active</div>
									{:else}
										<div class="badge gap-2 badge-neutral">Inactive</div>
									{/if}
								</td>
								<td class="text-right">
									<div class="join">
										<button
											class="btn join-item btn-ghost btn-sm"
											onclick={() => openModal(ambassador)}
										>
											<Pencil class="h-4 w-4" />
										</button>
										<button
											class="btn join-item text-error btn-ghost btn-sm"
											onclick={() => handleDelete(ambassador.id)}
										>
											<Trash2 class="h-4 w-4" />
										</button>
									</div>
								</td>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>
	</div>
</div>

<!-- Modal -->
<dialog
	class="modal modal-bottom sm:modal-middle"
	class:modal-open={showModal}
	onkeydown={(e) => e.key === 'Escape' && closeModal()}
>
	<div class="modal-box w-full max-w-2xl overflow-hidden bg-base-100 p-0 sm:w-11/12">
		<div class="flex items-center justify-between border-b border-base-200 px-4 py-4 sm:px-6">
			<div>
				<h3 class="text-lg font-bold sm:text-xl">
					{editingId ? 'Edit Ambassador' : 'New Ambassador'}
				</h3>
				<p class="mt-0.5 text-sm text-base-content/60">
					{editingId ? 'Update ambassador details' : 'Add a new ambassador to the program'}
				</p>
			</div>
			<button
				class="btn btn-circle btn-ghost btn-sm"
				onclick={closeModal}
				type="button"
				aria-label="Close"
			>
				<X class="h-5 w-5" />
			</button>
		</div>

		<div class="max-h-[80vh] overflow-y-auto p-6">
			<form
				onsubmit={(e) => {
					e.preventDefault();
					handleSubmit();
				}}
				class="space-y-6"
			>
				<!-- Main Status & Image -->
				<div class="grid grid-cols-1 gap-6 md:grid-cols-[1fr_200px]">
					<div class="space-y-4">
						<div class="form-control">
							<label class="label pb-1 font-medium" for="image"> Profile Photo </label>
							<input
								type="file"
								id="image"
								class="file-input-bordered file-input w-full"
								accept="image/*"
								onchange={handleFileChange}
							/>
							{#if existingImageUrl && !form.image}
								<div class="mt-2 text-xs opacity-60">
									Current file: <a href={existingImageUrl} target="_blank" class="link">View</a>
								</div>
							{/if}
						</div>

						<div class="form-control">
							<label class="label cursor-pointer justify-start gap-3">
								<span class="label-text font-medium">Active Status</span>
								<input type="checkbox" bind:checked={form.isActive} class="toggle toggle-success" />
							</label>
							<p class="ml-1 text-xs text-base-content/50">
								Only active ambassadors are visible to the public.
							</p>
						</div>
					</div>

					<div
						class="flex flex-col items-center justify-center rounded-box border border-dashed border-base-300 bg-base-200/50 p-4"
					>
						{#if existingImageUrl || form.image}
							<div class="avatar">
								<div class="mask h-32 w-32 rounded-xl mask-squircle">
									{#if form.image}
										<img src={URL.createObjectURL(form.image)} alt="Preview" />
									{:else if existingImageUrl}
										<img src={existingImageUrl} alt="Current" />
									{/if}
								</div>
							</div>
						{:else}
							<div
								class="flex h-32 w-32 flex-col items-center justify-center rounded-xl border-2 border-dashed border-base-300 text-base-content/30"
							>
								<Upload class="mb-2 h-8 w-8" />
								<span class="text-xs">No image</span>
							</div>
						{/if}
					</div>
				</div>

				<div class="divider">Details</div>

				<div role="tablist" class="tabs-lifted tabs">
					<button
						type="button"
						role="tab"
						class="tab {activeTab === 'en'
							? 'tab-active font-medium [--tab-bg:var(--fallback-b1,oklch(var(--b1)))]'
							: ''}"
						onclick={() => (activeTab = 'en')}
					>
						🇬🇧 English
					</button>
					<button
						type="button"
						role="tab"
						class="tab {activeTab === 'ru'
							? 'tab-active font-medium [--tab-bg:var(--fallback-b1,oklch(var(--b1)))]'
							: ''}"
						onclick={() => (activeTab = 'ru')}
					>
						🇷🇺 Russian
					</button>
				</div>

				<div
					class="relative z-10 -mt-px rounded-tr-box rounded-b-box border border-base-300 bg-base-100 p-6"
				>
					<div class={activeTab === 'en' ? 'block space-y-4' : 'hidden'}>
						<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
							<div class="form-control">
								<label class="label" for="name_en">
									<span class="label-text">Full Name (EN)</span>
								</label>
								<input
									type="text"
									id="name_en"
									bind:value={form.name_en}
									class="input-bordered input w-full"
									placeholder="e.g. John Doe"
								/>
							</div>

							<div class="form-control">
								<label class="label" for="country_en">
									<span class="label-text">Country</span>
								</label>
								<div class="dropdown w-full">
									<input
										type="text"
										placeholder="Search countries..."
										class="input-bordered input w-full"
										bind:value={countrySearch}
										onfocus={() => (countrySearch = '')}
									/>
									{#if countrySearch && filteredCountries.length > 0}
										<ul
											class="dropdown-content menu z-50 max-h-48 w-full overflow-y-auto rounded-box border border-base-200 bg-base-100 p-2 shadow-lg"
										>
											{#each filteredCountries.slice(0, 10) as country (country.id)}
												<li>
													<button
														type="button"
														onclick={() => selectCountry(country)}
														class="flex items-center gap-2"
													>
														<span class="text-lg">{country.flag}</span>
														<span>{country.name_en}</span>
														<span class="text-xs opacity-50">({country.name_ru})</span>
													</button>
												</li>
											{/each}
										</ul>
									{/if}
								</div>
								{#if form.country_en}
									<div class="mt-2 badge gap-2 badge-primary">
										{form.country_en} / {form.country_ru}
										<button
											type="button"
											class="btn btn-ghost btn-xs"
											onclick={() => {
												form.country_en = '';
												form.country_ru = '';
											}}>×</button
										>
									</div>
								{/if}
							</div>
						</div>

						<div class="form-control">
							<label class="label" for="role_en">
								<span class="label-text">Role/Title (EN)</span>
							</label>
							<input
								type="text"
								id="role_en"
								bind:value={form.role_en}
								class="input-bordered input w-full"
								placeholder="e.g. Student"
							/>
						</div>
					</div>

					<div class={activeTab === 'ru' ? 'block space-y-4' : 'hidden'}>
						<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
							<div class="form-control">
								<label class="label" for="name_ru">
									<span class="label-text">Full Name (RU)</span>
								</label>
								<input
									type="text"
									id="name_ru"
									bind:value={form.name_ru}
									class="input-bordered input w-full"
									placeholder="Иван Иванов"
								/>
							</div>

							<div class="form-control">
								<label class="label" for="country_ru">
									<span class="label-text">Country (RU)</span>
								</label>
								<input
									type="text"
									id="country_ru"
									bind:value={form.country_ru}
									class="input-bordered input w-full"
									placeholder="Россия"
								/>
							</div>
						</div>

						<div class="form-control">
							<label class="label" for="role_ru">
								<span class="label-text">Role/Title (RU)</span>
							</label>
							<input
								type="text"
								id="role_ru"
								bind:value={form.role_ru}
								class="input-bordered input w-full"
								placeholder="Студент"
							/>
						</div>
					</div>
				</div>

				<div class="modal-action pt-4">
					{#if formError}
						<div class="mb-4 rounded-lg bg-error/10 p-3 text-sm text-error">
							{formError}
						</div>
					{/if}
					<button type="button" class="btn" onclick={closeModal} disabled={submitting}
						>Cancel</button
					>
					<button type="submit" class="btn px-8 btn-primary" disabled={submitting}>
						{#if submitting}
							<span class="loading loading-sm loading-spinner"></span>
						{/if}
						{editingId ? 'Save Changes' : 'Create Ambassador'}
					</button>
				</div>
			</form>
		</div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button onclick={closeModal}>close</button>
	</form>
</dialog>
