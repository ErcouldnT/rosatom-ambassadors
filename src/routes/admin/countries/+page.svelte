<script lang="ts">
	import { onMount } from 'svelte';
	import { Plus, Pencil, Trash2 } from '@lucide/svelte';
	import type { Country } from '$lib/types';
	import { language } from '$lib/services/language';
	import { translations } from '$lib/services/translations';

	let countries = $state<Country[]>([]);
	let loading = $state(true);
	let showModal = $state(false);
	let editingId = $state<string | null>(null);
	let activeTab = $state<'en' | 'ru'>('en');

	let t = $derived(translations[$language].admin);

	// Form fields
	let form = $state({
		name_en: '',
		name_ru: '',
		flag_emoji: ''
	});

	onMount(async () => {
		await fetchCountries();
	});

	async function fetchCountries() {
		loading = true;
		try {
			const res = await fetch('/api/admin/countries');
			if (res.ok) {
				countries = await res.json();
			} else {
				console.error('Failed to fetch countries');
			}
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
			form.flag_emoji = country.flag_emoji;
		} else {
			editingId = null;
			form.name_en = '';
			form.name_ru = '';
			form.flag_emoji = '';
		}
		activeTab = 'en';
		showModal = true;
	}

	function closeModal() {
		showModal = false;
		editingId = null;
	}

	async function handleSubmit() {
		if (editingId) {
			await fetch('/api/admin/countries', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id: editingId, ...form })
			});
		} else {
			await fetch('/api/admin/countries', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(form)
			});
		}

		closeModal();
		await fetchCountries();
	}

	async function handleDelete(id: string) {
		if (!confirm('Are you sure you want to delete this country?')) return;

		await fetch('/api/admin/countries', {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id })
		});

		await fetchCountries();
	}
</script>

<svelte:head>
	<title>{t.countries} - Admin</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold text-base-content">{t.countries}</h1>
			<p class="text-base-content/70">Manage available countries</p>
		</div>
		<button class="btn btn-primary" onclick={() => openModal()}>
			<Plus class="h-4 w-4" />
			Add Country
		</button>
	</div>

	<!-- Table -->
	<div class="card border border-base-200 bg-base-100 shadow-sm">
		<div class="overflow-x-auto">
			<table class="table">
				<thead>
					<tr>
						<th>Flag</th>
						<th>Name (EN)</th>
						<th>Name (RU)</th>
						<th class="text-right">Actions</th>
					</tr>
				</thead>
				<tbody>
					{#if loading}
						<tr>
							<td colspan="4" class="py-8 text-center">
								<span class="loading loading-md loading-spinner"></span>
							</td>
						</tr>
					{:else if countries.length === 0}
						<tr>
							<td colspan="4" class="py-8 text-center text-base-content/50">
								No countries found
							</td>
						</tr>
					{:else}
						{#each countries as country (country.id)}
							<tr>
								<td class="text-2xl">{country.flag_emoji}</td>
								<td class="font-medium">{country.name_en}</td>
								<td class="text-base-content/70">{country.name_ru}</td>
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
<dialog class="modal" class:modal-open={showModal}>
	<div class="modal-box w-11/12 max-w-2xl">
		<form method="dialog">
			<button class="btn absolute top-2 right-2 btn-circle btn-ghost btn-sm" onclick={closeModal}
				>✕</button
			>
		</form>

		<h3 class="mb-6 text-lg font-bold">
			{editingId ? 'Edit Country' : 'Add Country'}
		</h3>

		<form
			onsubmit={(e) => {
				e.preventDefault();
				handleSubmit();
			}}
			class="space-y-6"
		>
			<div class="form-control w-full max-w-xs">
				<label class="label" for="flag_emoji">
					<span class="label-text">Flag Emoji</span>
				</label>
				<input
					type="text"
					id="flag_emoji"
					bind:value={form.flag_emoji}
					class="input-bordered input text-2xl"
					placeholder="🇬🇧"
					required
				/>
			</div>

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
				<div class={activeTab === 'en' ? 'block' : 'hidden'}>
					<div class="form-control">
						<label class="label" for="name_en">
							<span class="label-text">Country Name (EN)</span>
						</label>
						<input
							type="text"
							id="name_en"
							bind:value={form.name_en}
							class="input-bordered input w-full"
							placeholder="United Kingdom"
							required
						/>
					</div>
				</div>

				<div class={activeTab === 'ru' ? 'block' : 'hidden'}>
					<div class="form-control">
						<label class="label" for="name_ru">
							<span class="label-text">Country Name (RU)</span>
						</label>
						<input
							type="text"
							id="name_ru"
							bind:value={form.name_ru}
							class="input-bordered input w-full"
							placeholder="Великобритания"
							required
						/>
					</div>
				</div>
			</div>

			<div class="modal-action">
				<button type="button" class="btn" onclick={closeModal}>Cancel</button>
				<button type="submit" class="btn px-8 btn-primary">
					{editingId ? 'Update' : 'Create'}
				</button>
			</div>
		</form>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button onclick={closeModal}>close</button>
	</form>
</dialog>
