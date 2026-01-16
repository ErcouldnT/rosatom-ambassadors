<script lang="ts">
	import { onMount } from 'svelte';
	import { Plus, Pencil, Trash2, X, Check, X as XIcon } from '@lucide/svelte';
	import type { Ticker } from '$lib/types';
	import { language } from '$lib/services/language';
	import { translations } from '$lib/services/translations';

	let tickers = $state<Ticker[]>([]);
	let loading = $state(true);
	let showModal = $state(false);
	let editingId = $state<string | null>(null);
	let activeTab = $state<'en' | 'ru'>('en');

	let t = $derived(translations[$language].admin);

	// Form fields
	let form = $state({
		text_en: '',
		text_ru: '',
		isActive: true
	});

	onMount(async () => {
		await fetchTickers();
	});

	async function fetchTickers() {
		loading = true;
		try {
			const res = await fetch('/api/admin/tickers');
			if (res.ok) {
				tickers = await res.json();
			} else {
				console.error('Failed to fetch tickers');
			}
		} catch (error) {
			console.error('Failed to fetch tickers:', error);
		} finally {
			loading = false;
		}
	}

	function openModal(ticker?: Ticker) {
		if (ticker) {
			editingId = ticker.id;
			form.text_en = ticker.text_en;
			form.text_ru = ticker.text_ru;
			form.isActive = ticker.isActive;
		} else {
			editingId = null;
			form.text_en = '';
			form.text_ru = '';
			form.isActive = true;
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
			await fetch('/api/admin/tickers', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id: editingId, ...form })
			});
		} else {
			await fetch('/api/admin/tickers', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(form)
			});
		}

		closeModal();
		await fetchTickers();
	}

	async function handleDelete(id: string) {
		if (!confirm('Are you sure you want to delete this ticker?')) return;

		await fetch('/api/admin/tickers', {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id })
		});

		await fetchTickers();
	}
</script>

<svelte:head>
	<title>{t.tickers} - Admin</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold text-base-content">{t.tickers}</h1>
			<p class="text-base-content/70">Manage homepage ticker messages</p>
		</div>
		<button class="btn btn-primary" onclick={() => openModal()}>
			<Plus class="h-4 w-4" />
			Add Ticker
		</button>
	</div>

	<!-- Table -->
	<div class="card border border-base-200 bg-base-100 shadow-sm">
		<div class="overflow-x-auto">
			<table class="table">
				<thead>
					<tr>
						<th>Text (EN)</th>
						<th>Text (RU)</th>
						<th>Status</th>
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
					{:else if tickers.length === 0}
						<tr>
							<td colspan="4" class="py-8 text-center text-base-content/50"> No tickers found </td>
						</tr>
					{:else}
						{#each tickers as ticker (ticker.id)}
							<tr>
								<td class="max-w-xs truncate">{ticker.text_en}</td>
								<td class="max-w-xs truncate">{ticker.text_ru}</td>
								<td>
									{#if ticker.isActive}
										<div class="badge gap-1 text-white badge-success">Active</div>
									{:else}
										<div class="badge gap-1 badge-ghost">Inactive</div>
									{/if}
								</td>
								<td class="text-right">
									<div class="join">
										<button
											class="btn join-item btn-ghost btn-sm"
											onclick={() => openModal(ticker)}
										>
											<Pencil class="h-4 w-4" />
										</button>
										<button
											class="btn join-item text-error btn-ghost btn-sm"
											onclick={() => handleDelete(ticker.id)}
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
	<div class="modal-box w-11/12 max-w-3xl">
		<form method="dialog">
			<button class="btn absolute top-2 right-2 btn-circle btn-ghost btn-sm" onclick={closeModal}
				>✕</button
			>
		</form>

		<h3 class="mb-6 text-lg font-bold">
			{editingId ? 'Edit Ticker' : 'Add Ticker'}
		</h3>

		<form
			onsubmit={(e) => {
				e.preventDefault();
				handleSubmit();
			}}
			class="space-y-6"
		>
			<div class="form-control">
				<label class="label cursor-pointer justify-start gap-4">
					<span class="label-text">Active Status</span>
					<input type="checkbox" bind:checked={form.isActive} class="toggle toggle-success" />
				</label>
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
						<label class="label" for="text_en">
							<span class="label-text">Text (EN)</span>
						</label>
						<textarea
							id="text_en"
							bind:value={form.text_en}
							class="textarea-bordered textarea h-24"
							required
						></textarea>
					</div>
				</div>

				<div class={activeTab === 'ru' ? 'block' : 'hidden'}>
					<div class="form-control">
						<label class="label" for="text_ru">
							<span class="label-text">Text (RU)</span>
						</label>
						<textarea
							id="text_ru"
							bind:value={form.text_ru}
							class="textarea-bordered textarea h-24"
							required
						></textarea>
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
