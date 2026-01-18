<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { Plus, Pencil, Trash2, Upload, X, Search } from '@lucide/svelte';
	import Modal from '$lib/components/Modal.svelte';
	import AdminInput from '$lib/components/admin/AdminInput.svelte';
	import AdminTextarea from '$lib/components/admin/AdminTextarea.svelte';
	import type { Ambassador, Country } from '$lib/types';
	import { language } from '$lib/services/language';
	import { translations } from '$lib/services/translations';
	// import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
	import slugify from 'slugify';

	let { data } = $props();

	// ambassadors state removed as we use data.streamed
	let countries = $state<Country[]>([]);

	let showModal = $state(false);
	let editingId = $state<string | null>(null);
	let activeTab = $state<'en' | 'ru'>('en');
	let countrySearch = $state('');
	let adminSearchQuery = $state('');

	let t = $derived(translations[$language].admin);

	// Form fields
	let form = $state({
		name_en: '',
		name_ru: '',
		slug: '',
		email: '', // Added
		country_en: '',
		country_ru: '',
		role_en: '',
		role_ru: '',
		about_en: '',
		about_ru: '',
		contributions_en: '',
		contributions_ru: '',
		image: null as File | null,
		isActive: true
	});

	// For previewing existing image
	let existingImageUrl = $state('');

	$effect(() => {
		data.streamed.countries.then((res) => {
			countries = res;
		});
	});

	$effect(() => {
		if (form.name_en) {
			form.slug = slugify(form.name_en, { lower: true, strict: true });
		}
	});

	async function fetchAmbassadors() {
		// Use SvelteKit invalidation to refresh streamed data
		await invalidateAll();
	}

	import { getImageUrl } from '$lib/utils';
	// function getImageUrl ... removed

	function openModal(ambassador?: Ambassador) {
		if (ambassador) {
			editingId = ambassador.id;
			form.name_en = ambassador.name_en;
			form.name_ru = ambassador.name_ru;
			form.slug = ambassador.slug || '';
			form.email = ambassador.email || ''; // Added
			form.country_en = ambassador.country_en;
			form.country_ru = ambassador.country_ru;
			form.role_en = ambassador.role_en;
			form.role_ru = ambassador.role_ru;
			form.about_en = ambassador.about_en || '';
			form.about_ru = ambassador.about_ru || '';
			form.contributions_en = ambassador.contributions_en || '';
			form.contributions_ru = ambassador.contributions_ru || '';
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
			form.slug = '';
			form.email = ''; // Added
			form.country_en = '';
			form.country_ru = '';
			form.role_en = '';
			form.role_ru = '';
			form.about_en = '';
			form.about_ru = '';
			form.contributions_en = '';
			form.contributions_ru = '';
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
				(c.code?.toLowerCase().includes(countrySearch.toLowerCase()) ?? false)
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
			formData.append('slug', form.slug);
			formData.append('email', form.email); // Added
			formData.append('country_en', form.country_en);
			formData.append('country_ru', form.country_ru);
			formData.append('role_en', form.role_en);
			formData.append('role_ru', form.role_ru);
			formData.append('about_en', form.about_en);
			formData.append('about_ru', form.about_ru);
			formData.append('contributions_en', form.contributions_en);
			formData.append('contributions_ru', form.contributions_ru);
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

	<!-- Search -->
	<div class="card border border-base-200 bg-base-100 shadow-sm">
		<div class="card-body flex-row items-center gap-4 p-4">
			<Search class="h-5 w-5 text-base-content/40" />
			<input
				type="text"
				class="input w-full border-none input-ghost p-0 text-base focus:bg-transparent"
				placeholder="Search by name, country or role..."
				bind:value={adminSearchQuery}
			/>
		</div>
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
					{#await data.streamed.ambassadors}
						<tr>
							<td colspan="5" class="py-12 text-center">
								<span class="loading loading-lg loading-spinner text-primary"></span>
							</td>
						</tr>
					{:then streamedAmbassadors}
						{@const filtered = streamedAmbassadors.filter(
							(a) =>
								a.name_en.toLowerCase().includes(adminSearchQuery.toLowerCase()) ||
								a.name_ru.toLowerCase().includes(adminSearchQuery.toLowerCase()) ||
								a.country_en.toLowerCase().includes(adminSearchQuery.toLowerCase()) ||
								a.country_ru.toLowerCase().includes(adminSearchQuery.toLowerCase()) ||
								a.role_en.toLowerCase().includes(adminSearchQuery.toLowerCase()) ||
								a.role_ru.toLowerCase().includes(adminSearchQuery.toLowerCase())
						)}
						{#if filtered.length === 0}
							<tr>
								<td colspan="5" class="py-12 text-center text-base-content/50">
									{adminSearchQuery
										? 'No results found matching your search.'
										: 'No ambassadors found. Create one to get started.'}
								</td>
							</tr>
						{:else}
							{#each filtered as ambassador (ambassador.id)}
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
					{:catch error}
						<tr>
							<td colspan="5" class="py-12 text-center text-error">
								Failed to load ambassadors: {error.message}
							</td>
						</tr>
					{/await}
				</tbody>
			</table>
		</div>
	</div>
</div>

<!-- Modal -->
<!-- Modal -->
<Modal
	bind:open={showModal}
	title={editingId ? 'Edit Ambassador' : 'New Ambassador'}
	subtitle={editingId ? 'Update ambassador details' : 'Add a new ambassador to the program'}
	onClose={closeModal}
	maxWidth="4xl"
>
	<form
		id="ambassador-form"
		onsubmit={(e) => {
			e.preventDefault();
			handleSubmit();
		}}
		class="space-y-6"
	>
		<!-- Main Grid -->
		<div class="grid grid-cols-1 gap-8 md:grid-cols-[250px_1fr]">
			<!-- Sidebar: Photo & Status -->
			<div class="space-y-6">
				<!-- Image Upload -->
				<fieldset class="fieldset w-full rounded-xl border border-white/5 bg-base-100/30 p-4">
					<legend class="fieldset-legend pb-2 text-sm font-medium text-base-content/70"
						>Profile Photo</legend
					>

					<div class="flex flex-col items-center gap-4">
						<div class="avatar shadow-xl">
							<div
								class="mask h-40 w-40 rounded-2xl bg-base-300 mask-squircle object-cover ring-4 ring-white/10"
							>
								{#if form.image}
									<img
										src={URL.createObjectURL(form.image)}
										alt="Preview"
										class="h-full w-full object-cover"
									/>
								{:else if existingImageUrl}
									<img src={existingImageUrl} alt="Current" class="h-full w-full object-cover" />
								{:else}
									<div
										class="flex h-full w-full flex-col items-center justify-center text-base-content/20"
									>
										<Upload class="mb-2 h-10 w-10" />
										<span class="text-xs font-medium">No Image</span>
									</div>
								{/if}
							</div>
						</div>

						<label
							class="btn btn-block border-white/20 font-medium btn-outline btn-sm hover:border-white/40"
						>
							Choose File
							<input
								type="file"
								id="image"
								class="hidden"
								accept="image/*"
								onchange={handleFileChange}
							/>
						</label>
						{#if existingImageUrl && !form.image}
							<a href={existingImageUrl} target="_blank" class="link text-xs link-hover opacity-60"
								>View Current</a
							>
						{/if}
					</div>
				</fieldset>

				<!-- Status Switch -->
				<fieldset class="fieldset w-full rounded-xl border border-white/5 bg-base-100/30 p-4">
					<legend class="fieldset-legend pb-2 text-sm font-medium text-base-content/70"
						>Status</legend
					>
					<label class="label cursor-pointer justify-between">
						<span class="label-text font-medium">Public Visibility</span>
						<input
							type="checkbox"
							bind:checked={form.isActive}
							class="toggle toggle-sm toggle-success"
						/>
					</label>
					<p class="mt-1 text-xs text-base-content/40">
						Controls profile visibility on the public map.
					</p>
				</fieldset>
			</div>

			<!-- Main Content Area -->
			<div class="space-y-6">
				<!-- Tabs -->
				<div role="tablist" class="tabs-lifted tabs tabs-lg">
					<button
						type="button"
						role="tab"
						class="tab {activeTab === 'en'
							? 'tab-active font-bold opacity-100 [--tab-bg:theme(colors.base.100)]'
							: 'opacity-60 hover:opacity-100'}"
						onclick={() => (activeTab = 'en')}
					>
						🇬🇧 English
					</button>
					<button
						type="button"
						role="tab"
						class="tab {activeTab === 'ru'
							? 'tab-active font-bold opacity-100 [--tab-bg:theme(colors.base.100)]'
							: 'opacity-60 hover:opacity-100'}"
						onclick={() => (activeTab = 'ru')}
					>
						🇷🇺 Russian
					</button>
					<!-- Filler Tab for border continuity -->
					<div role="tab" class="tab w-full cursor-default border-b-transparent"></div>
				</div>

				<div
					class="-mt-px space-y-6 rounded-tr-2xl rounded-b-2xl border border-white/5 bg-base-100/50 p-6"
				>
					<!-- English Fields -->
					<div class={activeTab === 'en' ? 'block space-y-6' : 'hidden'}>
						<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
							<AdminInput
								id="name_en"
								label="Full Name (EN)"
								bind:value={form.name_en}
								placeholder="e.g. John Doe"
							/>

							<!-- Country Selector with Dropdown Override -->
							<fieldset class="fieldset">
								<legend class="fieldset-legend pb-2 text-sm font-medium text-base-content/70"
									>Country</legend
								>
								<div class="dropdown w-full">
									<input
										type="text"
										placeholder="Search countries..."
										class="input w-full border-white/10 bg-base-100/50 transition-all duration-300 focus:border-primary/50 focus:bg-base-100/80"
										bind:value={countrySearch}
										onfocus={() => (countrySearch = '')}
									/>
									{#if countrySearch && filteredCountries.length > 0}
										<ul
											class="dropdown-content menu z-50 mt-1 max-h-48 w-full overflow-y-auto rounded-box border border-white/10 bg-[#1a1a1a] p-2 shadow-2xl"
										>
											{#each filteredCountries.slice(0, 10) as country (country.id)}
												<li>
													<button
														type="button"
														onclick={() => selectCountry(country)}
														class="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-white/5"
													>
														<span class="text-xl">{country.flag}</span>
														<div class="text-left leading-tight">
															<div class="font-medium">{country.name_en}</div>
															<div class="text-[10px] text-white/40">{country.name_ru}</div>
														</div>
													</button>
												</li>
											{/each}
										</ul>
									{/if}
								</div>
								{#if form.country_en}
									<div class="mt-2 flex items-center gap-2">
										<div
											class="badge gap-2 border-white/10 bg-white/5 py-4 pr-1 pl-3 badge-lg badge-neutral"
										>
											<span class="font-medium">{form.country_en}</span>
											<span class="px-1 opacity-40">/</span>
											<span class="opacity-60">{form.country_ru}</span>
											<button
												type="button"
												class="btn btn-circle text-white/50 btn-ghost btn-xs hover:text-white"
												onclick={() => {
													form.country_en = '';
													form.country_ru = '';
												}}><X size={14} /></button
											>
										</div>
									</div>
								{/if}
							</fieldset>
						</div>

						<AdminInput
							id="role_en"
							label="Role / Title (EN)"
							bind:value={form.role_en}
							placeholder="e.g. Student, Nuclear Physics"
						/>

						<AdminInput
							id="slug"
							label="Slug (Auto-generated from name)"
							bind:value={form.slug}
							placeholder="e.g. john-doe"
							disabled={true}
							class="opacity-70"
						/>

						<AdminInput
							id="email"
							label="Email (for Contact button)"
							bind:value={form.email}
							placeholder="e.g. ambassador@example.com"
							type="email"
						/>

						<AdminTextarea
							id="about_en"
							label="About (EN)"
							bind:value={form.about_en}
							placeholder="Brief biography..."
						/>

						<AdminTextarea
							id="contributions_en"
							label="Contributions (EN)"
							bind:value={form.contributions_en}
							placeholder="Key achievements..."
						/>
					</div>

					<!-- Russian Fields -->
					<div class={activeTab === 'ru' ? 'block space-y-6' : 'hidden'}>
						<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
							<AdminInput
								id="name_ru"
								label="Full Name (RU)"
								bind:value={form.name_ru}
								placeholder="Иван Иванов"
							/>
							<AdminInput
								id="country_ru"
								label="Country (RU)"
								bind:value={form.country_ru}
								placeholder="Россия"
								disabled={true}
								class="opacity-70"
							/>
						</div>
						<AdminInput
							id="role_ru"
							label="Role / Title (RU)"
							bind:value={form.role_ru}
							placeholder="Студент"
						/>

						<AdminTextarea
							id="about_ru"
							label="About (RU)"
							bind:value={form.about_ru}
							placeholder="Биография..."
						/>

						<AdminTextarea
							id="contributions_ru"
							label="Contributions (RU)"
							bind:value={form.contributions_ru}
							placeholder="Достижения..."
						/>
					</div>
				</div>
			</div>
		</div>

		{#if formError}
			<div
				class="flex items-center gap-3 rounded-xl border border-error/20 bg-error/5 p-4 text-sm font-medium text-error"
			>
				<div class="h-2 w-2 rounded-full bg-error"></div>
				{formError}
			</div>
		{/if}
	</form>

	{#snippet actions()}
		<button
			type="button"
			class="btn text-base-content/70 btn-ghost hover:bg-white/5"
			onclick={closeModal}
			disabled={submitting}>Cancel</button
		>
		<button type="submit" form="ambassador-form" class="btn px-8 btn-primary" disabled={submitting}>
			{#if submitting}
				<span class="loading loading-sm loading-spinner"></span>
			{/if}
			{editingId ? 'Save Changes' : 'Create Ambassador'}
		</button>
	{/snippet}
</Modal>
