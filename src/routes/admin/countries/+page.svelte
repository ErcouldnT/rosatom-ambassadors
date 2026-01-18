<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { Plus, Pencil, Trash2, MapPin, Globe, Search } from '@lucide/svelte';
	import Modal from '$lib/components/Modal.svelte';
	import AdminInput from '$lib/components/admin/AdminInput.svelte';
	import type { Country } from '$lib/types';
	import { language } from '$lib/services/language';
	import { translations } from '$lib/services/translations';

	let { data } = $props();

	// countries state removed

	let showModal = $state(false);
	let editingId = $state<string | null>(null);

	let t = $derived(translations[$language].admin);

	// Form fields
	let form = $state({
		name_en: '',
		name_ru: '',
		code: '',
		flag: '',
		latitude: '',
		longitude: ''
	});

	async function fetchCountries() {
		await invalidateAll();
	}
	function openModal(country?: Country) {
		if (country) {
			editingId = country.id;
			form.name_en = country.name_en;
			form.name_ru = country.name_ru;
			form.code = country.code || '';
			form.flag = country.flag || '';
			form.latitude = country.latitude || '';
			form.longitude = country.longitude || '';
		} else {
			editingId = null;
			form.name_en = '';
			form.name_ru = '';
			form.code = '';
			form.flag = '';
			form.latitude = '';
			form.longitude = '';
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
			const method = editingId ? 'PUT' : 'POST';
			const body = JSON.stringify({
				...(editingId && { id: editingId }),
				name_en: form.name_en,
				name_ru: form.name_ru,
				code: form.code.toUpperCase(),
				flag: form.flag,
				latitude: form.latitude,
				longitude: form.longitude
			});

			const res = await fetch('/api/admin/countries', {
				method,
				headers: { 'Content-Type': 'application/json' },
				body
			});

			if (!res.ok) throw new Error('Failed to save');

			await fetchCountries();
			closeModal();
		} catch (error) {
			formError = error instanceof Error ? error.message : 'An error occurred';
		} finally {
			submitting = false;
		}
	}

	async function handleDelete(id: string) {
		if (
			!confirm(
				'Are you sure you want to delete this country? This may affect ambassadors linked to it.'
			)
		)
			return;
		try {
			await fetch('/api/admin/countries', {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id })
			});
			await fetchCountries();
		} catch (error) {
			console.error('Failed to delete country:', error);
		}
	}

	let searchQuery = $state('');
	// filteredCountries removed
</script>

<svelte:head>
	<title>{t.countries} - Admin</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold tracking-tight text-base-content">{t.countries}</h1>
			<p class="mt-1 text-base-content/60">
				Manage countries with coordinates for the interactive map
			</p>
		</div>
		<button class="btn gap-2 btn-primary" onclick={() => openModal()}>
			<Plus class="h-5 w-5" />
			Add Country
		</button>
	</div>

	<!-- Info Alert -->
	<div class="alert alert-info shadow-lg">
		<Globe class="h-6 w-6" />
		<div>
			<h3 class="font-bold">Interactive Map Integration</h3>
			<p class="text-sm">
				Countries must have valid coordinates (latitude/longitude) to display ambassadors on the
				world map. If a country is not in the list, add it manually with its capital city
				coordinates.
			</p>
		</div>
	</div>

	<!-- Search -->
	<div class="card border border-base-200 bg-base-100 shadow-sm">
		<div class="card-body flex-row items-center gap-4 p-4">
			<Search class="h-5 w-5 text-base-content/40" />
			<input
				type="text"
				class="input w-full border-none input-ghost p-0 text-base focus:bg-transparent"
				placeholder="Search by name or code..."
				bind:value={searchQuery}
			/>
			<!-- Count removed as it depends on streamed data -->
		</div>
	</div>

	<!-- Table -->
	<div class="card overflow-hidden rounded-xl border border-base-200 bg-base-100 shadow-sm">
		<div class="overflow-x-auto">
			<table class="table table-lg">
				<thead class="bg-base-200/50">
					<tr>
						<th>Flag</th>
						<th>Name (EN)</th>
						<th>Name (RU)</th>
						<th>Code</th>
						<th>Coordinates</th>
						<th class="text-right">Actions</th>
					</tr>
				</thead>
				<tbody>
					{#await data.streamed.countries}
						<tr>
							<td colspan="6" class="py-12 text-center">
								<span class="loading loading-lg loading-spinner text-primary"></span>
							</td>
						</tr>
					{:then streamedCountries}
						{@const currentList = streamedCountries.filter(
							(c) =>
								c.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
								c.name_ru.toLowerCase().includes(searchQuery.toLowerCase()) ||
								(c.code && c.code.toLowerCase().includes(searchQuery.toLowerCase()))
						)}

						{#if currentList.length === 0}
							<tr>
								<td colspan="6" class="py-12 text-center text-base-content/50">
									No countries found.
								</td>
							</tr>
						{:else}
							{#each currentList as country (country.id)}
								<tr class="hover">
									<td>
										<span class="text-2xl">{country.flag || '🌍'}</span>
									</td>
									<td>
										<div class="font-bold">{country.name_en}</div>
									</td>
									<td>
										<div class="text-base-content/70">{country.name_ru}</div>
									</td>
									<td>
										<div class="badge badge-ghost">{country.code || '-'}</div>
									</td>
									<td>
										{#if country.latitude && country.longitude}
											<div class="flex items-center gap-2 text-sm">
												<MapPin class="h-4 w-4 text-success" />
												<span class="font-mono text-xs"
													>{country.latitude}, {country.longitude}</span
												>
											</div>
										{:else}
											<span class="badge badge-sm badge-warning">No coords</span>
										{/if}
									</td>
									<td class="text-right">
										<div class="join">
											<button
												class="btn join-item btn-ghost btn-sm"
												onclick={() => openModal(country)}
											>
												<Pencil class="h-4 w-4" />
											</button>
											<button
												class="btn join-item text-error btn-ghost btn-sm"
												onclick={() => handleDelete(country.id)}
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
							<td colspan="6" class="py-12 text-center text-error">
								Failed to load countries: {error.message}
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
	title={editingId ? 'Edit Country' : 'Add New Country'}
	subtitle={editingId
		? 'Update country details and coordinates'
		: 'Add a new country with coordinates for the interactive map'}
	onClose={closeModal}
	maxWidth="lg"
>
	<form
		id="country-form"
		onsubmit={(e) => {
			e.preventDefault();
			handleSubmit();
		}}
		class="space-y-6"
	>
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<!-- Names -->
			<fieldset
				class="fieldset w-full rounded-xl border border-white/5 bg-base-100/30 p-4 md:col-span-2"
			>
				<legend class="fieldset-legend pb-2 text-sm font-medium text-base-content/70">Names</legend>
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<AdminInput
						id="name_en"
						label="Name (English)"
						bind:value={form.name_en}
						placeholder="e.g. Turkey"
						required
					/>
					<AdminInput
						id="name_ru"
						label="Name (Russian)"
						bind:value={form.name_ru}
						placeholder="e.g. Турция"
						required
					/>
				</div>
			</fieldset>

			<!-- Details -->
			<fieldset
				class="fieldset w-full rounded-xl border border-white/5 bg-base-100/30 p-4 md:col-span-2"
			>
				<legend class="fieldset-legend pb-2 text-sm font-medium text-base-content/70"
					>Details</legend
				>
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<AdminInput
						id="code"
						label="ISO Code (2 letter)"
						bind:value={form.code}
						class="font-mono uppercase"
						placeholder="e.g. TR"
						maxlength={2}
						required
					/>
					<AdminInput
						id="flag"
						label="Flag Emoji"
						bind:value={form.flag}
						class="text-2xl"
						placeholder="🇹🇷"
					/>
				</div>
			</fieldset>

			<!-- Map Coordinates -->
			<fieldset
				class="fieldset w-full rounded-xl border border-white/5 bg-base-100/30 p-4 md:col-span-2"
			>
				<legend class="fieldset-legend pb-2 text-sm font-medium text-base-content/70"
					>Coordinates</legend
				>
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<AdminInput
						id="latitude"
						label="Latitude"
						bind:value={form.latitude}
						class="font-mono"
						placeholder="e.g. 39.9334"
					/>
					<AdminInput
						id="longitude"
						label="Longitude"
						bind:value={form.longitude}
						class="font-mono"
						placeholder="e.g. 32.8597"
					/>
				</div>
				<p class="mt-2 px-1 text-xs text-base-content/40">
					💡 Tip: Find coordinates by searching "[Capital Name] coordinates" on Google.
				</p>
			</fieldset>
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
			onclick={closeModal}>Cancel</button
		>
		<button type="submit" form="country-form" class="btn px-8 btn-primary" disabled={submitting}>
			{#if submitting}
				<span class="loading loading-sm loading-spinner"></span>
			{/if}
			{editingId ? 'Update' : 'Create'}
		</button>
	{/snippet}
</Modal>
