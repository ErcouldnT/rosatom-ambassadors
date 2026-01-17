<script lang="ts">
	import { onMount } from 'svelte';
	import { Plus, Pencil, Trash2, MapPin, Globe, X } from '@lucide/svelte';
	import type { Country } from '$lib/types';

	let countries = $state<Country[]>([]);
	let loading = $state(true);
	let showModal = $state(false);
	let editingId = $state<string | null>(null);

	// Form fields
	let form = $state({
		name_en: '',
		name_ru: '',
		code: '',
		flag: '',
		latitude: '',
		longitude: ''
	});

	onMount(async () => {
		await fetchCountries();
	});

	async function fetchCountries() {
		loading = true;
		try {
			const res = await fetch('/api/admin/countries');
			countries = await res.json();
		} catch (error) {
			console.error('Failed to fetch countries:', error);
		} finally {
			loading = false;
		}
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
</script>

<svelte:head>
	<title>Countries - Admin</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold tracking-tight text-base-content">Countries</h1>
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
					{#if loading}
						<tr>
							<td colspan="6" class="py-12 text-center">
								<span class="loading loading-lg loading-spinner text-primary"></span>
							</td>
						</tr>
					{:else if countries.length === 0}
						<tr>
							<td colspan="6" class="py-12 text-center text-base-content/50">
								No countries found. Add one to get started.
							</td>
						</tr>
					{:else}
						{#each countries as country (country.id)}
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
											<span class="font-mono text-xs">{country.latitude}, {country.longitude}</span>
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
				</tbody>
			</table>
		</div>
	</div>
</div>

<!-- Modal -->
{#if showModal}
	<dialog
		class="modal-open modal modal-bottom sm:modal-middle"
		onkeydown={(e) => e.key === 'Escape' && closeModal()}
	>
		<div class="modal-box w-full max-w-lg p-0 sm:w-11/12">
			<div class="flex items-center justify-between border-b border-base-200 px-4 py-4 sm:px-6">
				<div>
					<h3 class="text-lg font-bold sm:text-xl">
						{editingId ? 'Edit Country' : 'Add New Country'}
					</h3>
					<p class="mt-0.5 text-sm text-base-content/60">
						{editingId
							? 'Update country details and coordinates'
							: 'Add a new country with coordinates for the interactive map'}
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

			<form
				onsubmit={(e) => {
					e.preventDefault();
					handleSubmit();
				}}
				class="mt-6 space-y-4"
			>
				{#if formError}
					<div class="alert alert-error">
						<span>{formError}</span>
					</div>
				{/if}

				<div class="grid grid-cols-2 gap-4">
					<div class="form-control">
						<label class="label" for="name_en">
							<span class="label-text">Name (English) *</span>
						</label>
						<input
							type="text"
							id="name_en"
							bind:value={form.name_en}
							class="input-bordered input w-full"
							placeholder="e.g. Turkey"
							required
						/>
					</div>

					<div class="form-control">
						<label class="label" for="name_ru">
							<span class="label-text">Name (Russian) *</span>
						</label>
						<input
							type="text"
							id="name_ru"
							bind:value={form.name_ru}
							class="input-bordered input w-full"
							placeholder="e.g. Турция"
							required
						/>
					</div>
				</div>

				<div class="grid grid-cols-2 gap-4">
					<div class="form-control">
						<label class="label" for="code">
							<span class="label-text">ISO Code (2 letter)</span>
						</label>
						<input
							type="text"
							id="code"
							bind:value={form.code}
							class="input-bordered input w-full uppercase"
							placeholder="e.g. TR"
							maxlength="2"
						/>
					</div>

					<div class="form-control">
						<label class="label" for="flag">
							<span class="label-text">Flag Emoji</span>
						</label>
						<input
							type="text"
							id="flag"
							bind:value={form.flag}
							class="input-bordered input w-full text-2xl"
							placeholder="🇹🇷"
						/>
					</div>
				</div>

				<div class="divider">Map Coordinates</div>

				<div class="grid grid-cols-2 gap-4">
					<div class="form-control">
						<label class="label" for="latitude">
							<span class="label-text">Latitude</span>
						</label>
						<input
							type="text"
							id="latitude"
							bind:value={form.latitude}
							class="input-bordered input w-full font-mono"
							placeholder="e.g. 39.9334"
						/>
					</div>

					<div class="form-control">
						<label class="label" for="longitude">
							<span class="label-text">Longitude</span>
						</label>
						<input
							type="text"
							id="longitude"
							bind:value={form.longitude}
							class="input-bordered input w-full font-mono"
							placeholder="e.g. 32.8597"
						/>
					</div>
				</div>

				<p class="text-xs text-base-content/50">
					💡 Tip: You can find coordinates by searching for "[Capital City Name] coordinates" on
					Google.
				</p>

				<div class="modal-action">
					<button type="button" class="btn btn-ghost" onclick={closeModal}>Cancel</button>
					<button type="submit" class="btn btn-primary" disabled={submitting}>
						{#if submitting}
							<span class="loading loading-sm loading-spinner"></span>
						{/if}
						{editingId ? 'Update' : 'Create'}
					</button>
				</div>
			</form>
		</div>
		<form method="dialog" class="modal-backdrop">
			<button onclick={closeModal}>close</button>
		</form>
	</dialog>
{/if}
