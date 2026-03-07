<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { Plus, Pencil, Trash2, Upload, GraduationCap } from '@lucide/svelte';
	import Modal from '$lib/components/Modal.svelte';
	import AdminInput from '$lib/components/admin/AdminInput.svelte';
	import type { University } from '$lib/types';
	import { toasts } from '$lib/stores/toast';
	import { getImageUrl } from '$lib/utils';

	let { data } = $props();

	let showModal = $state(false);
	let editingId = $state<string | null>(null);

	let form = $state({
		name_en: '',
		name_ru: '',
		city_en: '',
		city_ru: '',
		website: '',
		founded: '',
		student_count: '',
		intl_student_count: '',
		budget_places: '',
		program_count: '',
		image: null as File | null
	});

	let existingImageUrl = $state('');

	function openModal(uni?: University) {
		if (uni) {
			editingId = uni.id;
			form.name_en = uni.name_en;
			form.name_ru = uni.name_ru;
			form.city_en = uni.city_en || '';
			form.city_ru = uni.city_ru || '';
			form.website = uni.website || '';
			form.founded = uni.founded || '';
			form.student_count = uni.student_count?.toString() || '';
			form.intl_student_count = uni.intl_student_count?.toString() || '';
			form.budget_places = uni.budget_places?.toString() || '';
			form.program_count = uni.program_count?.toString() || '';
			form.image = null;
			existingImageUrl = uni.image ? getImageUrl('universities', uni.id, uni.image) : '';
		} else {
			editingId = null;
			form.name_en = '';
			form.name_ru = '';
			form.city_en = '';
			form.city_ru = '';
			form.website = '';
			form.founded = '';
			form.student_count = '';
			form.intl_student_count = '';
			form.budget_places = '';
			form.program_count = '';
			form.image = null;
			existingImageUrl = '';
		}
		showModal = true;
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
			formData.append('city_en', form.city_en);
			formData.append('city_ru', form.city_ru);
			formData.append('website', form.website);
			formData.append('founded', form.founded);
			if (form.student_count) formData.append('student_count', form.student_count);
			if (form.intl_student_count) formData.append('intl_student_count', form.intl_student_count);
			if (form.budget_places) formData.append('budget_places', form.budget_places);
			if (form.program_count) formData.append('program_count', form.program_count);

			if (form.image) {
				formData.append('image', form.image);
			}

			const res = await fetch('/api/admin/universities', {
				method: editingId ? 'PUT' : 'POST',
				body: formData
			});

			if (!res.ok) {
				const errData = await res.json().catch(() => ({}));
				throw new Error(errData.error || 'Failed to save university');
			}

			const wasEditing = !!editingId;
			closeModal();
			await invalidateAll();
			toasts.add(
				wasEditing ? 'University updated successfully' : 'University created successfully',
				'success'
			);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			console.error('Submit error:', error);
			formError = error.message || 'An unexpected error occurred';
			toasts.add('Failed to save university', 'error');
		} finally {
			submitting = false;
		}
	}

	async function handleDelete(id: string) {
		if (!confirm('Are you sure you want to delete this university?')) return;
		try {
			const res = await fetch('/api/admin/universities', {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id })
			});
			if (!res.ok) throw new Error('Failed to delete university');
			await invalidateAll();
			toasts.add('University deleted successfully', 'success');
		} catch (error) {
			console.error('Delete error:', error);
			toasts.add('Failed to delete university', 'error');
		}
	}

	function handleFileChange(e: Event) {
		const target = e.target as HTMLInputElement;
		if (target.files && target.files.length > 0) {
			form.image = target.files[0];
		}
	}
</script>

<svelte:head>
	<title>Universities - Admin</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold tracking-tight text-base-content">Universities</h1>
			<p class="mt-1 text-base-content/60">Manage partner universities</p>
		</div>
		<button class="btn btn-primary" onclick={() => openModal()}>
			<Plus class="h-5 w-5" />
			Add University
		</button>
	</div>

	<!-- Table -->
	<div class="card overflow-hidden rounded-xl border border-base-200 bg-base-100 shadow-sm">
		<div class="overflow-x-auto">
			<table class="table table-lg">
				<thead class="bg-base-200/50">
					<tr>
						<th>University</th>
						<th>City</th>
						<th>Students</th>
						<th>Programs</th>
						<th class="text-right">Actions</th>
					</tr>
				</thead>
				<tbody>
					{#await data.streamed.universities}
						<tr>
							<td colspan="5" class="py-12 text-center">
								<span class="loading loading-lg loading-spinner text-primary"></span>
							</td>
						</tr>
					{:then universities}
						{#if universities.length === 0}
							<tr>
								<td colspan="5" class="py-12 text-center text-base-content/50">
									No universities found. Create one to get started.
								</td>
							</tr>
						{:else}
							{#each universities as uni (uni.id)}
								<tr class="hover">
									<td>
										<div class="flex items-center gap-4">
											<div class="avatar">
												<div class="mask h-12 w-12 rounded-lg bg-base-300">
													{#if uni.image}
														<img
															src={getImageUrl('universities', uni.id, uni.image)}
															alt={uni.name_en}
														/>
													{:else}
														<div
															class="flex h-full w-full items-center justify-center text-base-content/30"
														>
															<GraduationCap class="h-6 w-6" />
														</div>
													{/if}
												</div>
											</div>
											<div>
												<div class="font-bold">{uni.name_en}</div>
												<div class="text-sm opacity-60">{uni.name_ru}</div>
											</div>
										</div>
									</td>
									<td>{uni.city_en || '—'}</td>
									<td>{uni.student_count?.toLocaleString() || '—'}</td>
									<td>{uni.program_count || '—'}</td>
									<td class="text-right">
										<div class="join">
											<button class="btn join-item btn-ghost btn-sm" onclick={() => openModal(uni)}>
												<Pencil class="h-4 w-4" />
											</button>
											<button
												class="btn join-item text-error btn-ghost btn-sm"
												onclick={() => handleDelete(uni.id)}
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
								Failed to load universities: {error.message}
							</td>
						</tr>
					{/await}
				</tbody>
			</table>
		</div>
	</div>
</div>

<!-- Modal -->
<Modal
	bind:open={showModal}
	title={editingId ? 'Edit University' : 'New University'}
	subtitle={editingId ? 'Update university details' : 'Add a new partner university'}
	onClose={closeModal}
	maxWidth="2xl"
>
	<form
		id="university-form"
		onsubmit={(e) => {
			e.preventDefault();
			handleSubmit();
		}}
		class="space-y-6"
	>
		<!-- Image Upload -->
		<fieldset class="fieldset w-full rounded-xl border border-base-content/5 bg-base-100/30 p-4">
			<legend class="fieldset-legend pb-2 text-sm font-medium text-base-content/70">Photo</legend>
			<div class="flex items-center gap-4">
				<div class="avatar">
					<div class="h-20 w-20 rounded-xl bg-base-300">
						{#if form.image}
							<img
								src={URL.createObjectURL(form.image)}
								alt="Preview"
								class="h-full w-full object-cover"
							/>
						{:else if existingImageUrl}
							<img src={existingImageUrl} alt="Current" class="h-full w-full object-cover" />
						{:else}
							<div class="flex h-full w-full items-center justify-center text-base-content/20">
								<Upload class="h-8 w-8" />
							</div>
						{/if}
					</div>
				</div>
				<label class="btn border-base-content/20 font-medium btn-outline btn-sm">
					Choose File
					<input type="file" class="hidden" accept="image/*" onchange={handleFileChange} />
				</label>
			</div>
		</fieldset>

		<!-- Names -->
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
			<AdminInput
				id="name_en"
				label="Name (EN)"
				bind:value={form.name_en}
				placeholder="e.g. Moscow State University"
			/>
			<AdminInput id="name_ru" label="Name (RU)" bind:value={form.name_ru} placeholder="МГУ" />
		</div>

		<!-- Cities -->
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
			<AdminInput id="city_en" label="City (EN)" bind:value={form.city_en} placeholder="Moscow" />
			<AdminInput id="city_ru" label="City (RU)" bind:value={form.city_ru} placeholder="Москва" />
		</div>

		<!-- Website & Founded -->
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
			<AdminInput
				id="website"
				label="Website"
				bind:value={form.website}
				placeholder="www.university.ru"
			/>
			<AdminInput id="founded" label="Founded" bind:value={form.founded} placeholder="01.01.1920" />
		</div>

		<!-- Stats -->
		<div class="grid grid-cols-2 gap-4 md:grid-cols-4">
			<AdminInput
				id="student_count"
				label="Students"
				bind:value={form.student_count}
				placeholder="57000"
				type="number"
			/>
			<AdminInput
				id="intl_student_count"
				label="Intl Students"
				bind:value={form.intl_student_count}
				placeholder="1290"
				type="number"
			/>
			<AdminInput
				id="budget_places"
				label="Budget Places"
				bind:value={form.budget_places}
				placeholder="5000"
				type="number"
			/>
			<AdminInput
				id="program_count"
				label="Programs"
				bind:value={form.program_count}
				placeholder="319"
				type="number"
			/>
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
			class="btn text-base-content/70 btn-ghost hover:bg-base-content/5"
			onclick={closeModal}
			disabled={submitting}>Cancel</button
		>
		<button type="submit" form="university-form" class="btn px-8 btn-primary" disabled={submitting}>
			{#if submitting}
				<span class="loading loading-sm loading-spinner"></span>
			{/if}
			{editingId ? 'Save Changes' : 'Create University'}
		</button>
	{/snippet}
</Modal>
