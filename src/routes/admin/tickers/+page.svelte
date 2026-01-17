<script lang="ts">
	import { onMount } from 'svelte';
	import { Plus, Pencil, Trash2 } from '@lucide/svelte';
	import Modal from '$lib/components/Modal.svelte';
	import AdminTextarea from '$lib/components/admin/AdminTextarea.svelte';
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

	let submitting = $state(false);

	async function handleSubmit() {
		submitting = true;
		try {
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
		} catch (error) {
			console.error('Failed to save ticker:', error);
		} finally {
			submitting = false;
		}
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
			<h1 class="text-3xl font-bold tracking-tight text-base-content">{t.tickers}</h1>
			<p class="mt-1 text-base-content/60">Manage homepage ticker messages</p>
		</div>
		<button class="btn btn-primary" onclick={() => openModal()}>
			<Plus class="h-5 w-5" />
			Add Ticker
		</button>
	</div>

	<!-- Table -->
	<div class="card overflow-hidden rounded-xl border border-base-200 bg-base-100 shadow-sm">
		<div class="overflow-x-auto">
			<table class="table table-lg">
				<thead class="bg-base-200/50">
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
							<td colspan="4" class="py-12 text-center">
								<span class="loading loading-lg loading-spinner text-primary"></span>
							</td>
						</tr>
					{:else if tickers.length === 0}
						<tr>
							<td colspan="4" class="py-12 text-center text-base-content/50"> No tickers found </td>
						</tr>
					{:else}
						{#each tickers as ticker (ticker.id)}
							<tr class="hover">
								<td class="max-w-xs truncate">{ticker.text_en}</td>
								<td class="max-w-xs truncate">{ticker.text_ru}</td>
								<td>
									{#if ticker.isActive}
										<div class="badge gap-2 text-white badge-success">Active</div>
									{:else}
										<div class="badge gap-2 badge-neutral">Inactive</div>
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
<Modal
	bind:open={showModal}
	title={editingId ? 'Edit Ticker' : 'Add Ticker'}
	subtitle={editingId ? 'Update ticker message' : 'Create a new ticker message for the homepage'}
	onClose={closeModal}
	maxWidth="3xl"
>
	<form
		id="ticker-form"
		onsubmit={(e) => {
			e.preventDefault();
			handleSubmit();
		}}
		class="space-y-6"
	>
		<!-- Status Switch -->
		<fieldset class="fieldset w-full rounded-xl border border-white/5 bg-base-100/30 p-4">
			<legend class="fieldset-legend pb-2 text-sm font-medium text-base-content/70">Status</legend>
			<label class="label cursor-pointer justify-between">
				<span class="label-text font-medium">Active Status</span>
				<input
					type="checkbox"
					bind:checked={form.isActive}
					class="toggle toggle-sm toggle-success"
				/>
			</label>
			<p class="mt-1 text-xs text-base-content/40">Controls visibility on the homepage ticker.</p>
		</fieldset>

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
				<!-- Filler -->
				<div role="tab" class="tab w-full cursor-default border-b-transparent"></div>
			</div>

			<div
				class="-mt-px space-y-6 rounded-tr-2xl rounded-b-2xl border border-white/5 bg-base-100/50 p-6"
			>
				<div class={activeTab === 'en' ? 'block' : 'hidden'}>
					<AdminTextarea
						id="text_en"
						label="Message (EN)"
						bind:value={form.text_en}
						rows={3}
						placeholder="Ticker message..."
						required
					/>
				</div>
				<div class={activeTab === 'ru' ? 'block' : 'hidden'}>
					<AdminTextarea
						id="text_ru"
						label="Message (RU)"
						bind:value={form.text_ru}
						rows={3}
						placeholder="Сообщение..."
						required
					/>
				</div>
			</div>
		</div>
	</form>

	{#snippet actions()}
		<button
			type="button"
			class="btn text-base-content/70 btn-ghost hover:bg-white/5"
			onclick={closeModal}
			disabled={submitting}>Cancel</button
		>
		<button type="submit" form="ticker-form" class="btn px-8 btn-primary" disabled={submitting}>
			{#if submitting}
				<span class="loading loading-sm loading-spinner"></span>
			{/if}
			{editingId ? 'Update' : 'Create'}
		</button>
	{/snippet}
</Modal>
