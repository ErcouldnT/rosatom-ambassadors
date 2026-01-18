<script lang="ts">
	import { invalidateAll } from '$app/navigation';

	import type { Stat } from '$lib/types';
	import { language } from '$lib/services/language';
	import { translations } from '$lib/services/translations';
	import { toasts } from '$lib/stores/toast';

	import { Edit, Plus, Trash2 } from '@lucide/svelte';
	import Modal from '$lib/components/Modal.svelte';
	import AdminInput from '$lib/components/admin/AdminInput.svelte';

	let { data } = $props();

	// stats state removed

	// Translation
	let t = $derived(translations[$language].admin);

	// Modal state
	let isModalOpen = $state(false);
	let editingStat = $state<Stat | null>(null); // null means creating
	let activeTab = $state<'en' | 'ru'>('en');
	let isSaving = $state(false);

	// Form state
	let formData = $state({
		key: '',
		value: '',
		icon: '',
		label_en: '',
		label_ru: ''
	});

	async function loadStats() {
		// Use invalidateAll to refresh
		await invalidateAll();
	}

	function openAddModal() {
		editingStat = null;
		formData = {
			key: '',
			value: '',
			icon: '',
			label_en: '',
			label_ru: ''
		};
		activeTab = 'en';
		isModalOpen = true;
	}

	function openEditModal(stat: Stat) {
		editingStat = stat;
		formData = {
			key: stat.key,
			value: stat.value,
			icon: stat.icon || '',
			label_en: stat.label_en,
			label_ru: stat.label_ru
		};
		activeTab = 'en';
		isModalOpen = true;
	}

	function closeModal() {
		isModalOpen = false;
		editingStat = null;
	}

	async function saveStat() {
		isSaving = true;
		try {
			const method = editingStat ? 'PUT' : 'POST';
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const body: any = { ...formData };

			if (editingStat) {
				body.id = editingStat.id;
			}

			const res = await fetch('/api/admin/stats', {
				method,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body)
			});

			if (res.ok) {
				await loadStats();
				closeModal();
				toasts.add(
					editingStat ? 'Statistic updated successfully' : 'Statistic created successfully',
					'success'
				);
			} else {
				toasts.add('Failed to save stat', 'error');
			}
		} catch {
			console.error('Failed to update stat');
			toasts.add('Error saving stat', 'error');
		} finally {
			isSaving = false;
		}
	}

	let deletingStatId = $state<string | null>(null);

	function promptDelete(id: string) {
		deletingStatId = id;
	}

	function cancelDelete() {
		deletingStatId = null;
	}

	async function confirmDelete() {
		if (!deletingStatId) return;

		try {
			const res = await fetch('/api/admin/stats', {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id: deletingStatId })
			});

			if (res.ok) {
				await loadStats();
				deletingStatId = null;
				toasts.add('Statistic deleted successfully', 'success');
			} else {
				toasts.add('Failed to delete stat', 'error');
			}
		} catch {
			toasts.add('Error deleting stat', 'error');
		}
	}
</script>

<svelte:head>
	<title>{t.stats} - Admin</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold text-base-content">
				{t.stats}
			</h1>
			<p class="mt-1 text-base-content/60">Manage homepage statistics numbers</p>
		</div>
		<button class="btn btn-primary" onclick={openAddModal}>
			<Plus size={20} />
			Add Stat
		</button>
	</div>

	{#await data.streamed.stats}
		<div class="flex justify-center p-12">
			<span class="loading loading-lg loading-spinner text-primary"></span>
		</div>
	{:then streamedStats}
		<div class="overflow-x-auto rounded-xl border border-base-200 bg-base-100 shadow-sm">
			<table class="table table-lg">
				<thead class="bg-base-200/50">
					<tr>
						<th>Key</th>
						<th>Value</th>
						<th>Label (EN)</th>
						<th>Label (RU)</th>
						<th class="w-24 text-right">Actions</th>
					</tr>
				</thead>
				<tbody>
					{#each streamedStats as stat (stat.id)}
						<tr class="hover">
							<td class="font-mono text-sm opacity-50">{stat.key}</td>
							<td class="font-bold">{stat.value}</td>
							<td>{stat.label_en}</td>
							<td>{stat.label_ru}</td>
							<td>
								<div class="join justify-end">
									<button
										class="btn join-item btn-square btn-ghost btn-sm"
										onclick={() => openEditModal(stat)}
									>
										<Edit size={16} />
									</button>
									<button
										class="btn join-item btn-square text-error btn-ghost btn-sm"
										onclick={() => promptDelete(stat.id)}
									>
										<Trash2 size={16} />
									</button>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{:catch error}
		<div class="alert alert-error">
			<span>Failed to load stats: {error.message}</span>
		</div>
	{/await}
</div>

<!-- Edit/Add Modal -->
<Modal
	bind:open={isModalOpen}
	title={editingStat ? 'Edit Statistic' : 'Add Statistic'}
	subtitle={editingStat ? 'Update statistic value and labels' : 'Create a new statistic'}
	onClose={closeModal}
	maxWidth="lg"
>
	<form
		id="stats-form"
		onsubmit={(e) => {
			e.preventDefault();
			saveStat();
		}}
		class="space-y-6"
	>
		<!-- Common Fields -->
		<fieldset class="fieldset w-full rounded-xl border border-white/5 bg-base-100/30 p-4">
			<legend class="fieldset-legend pb-2 text-sm font-medium text-base-content/70"
				>Configuration</legend
			>
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<div class="form-control">
					<AdminInput
						id="key"
						label="Key (Unique ID)"
						bind:value={formData.key}
						class="font-mono"
						disabled={!!editingStat}
						placeholder="e.g. active_members"
						required
					/>
					<label class="label pt-1" for="key">
						<span class="label-text-alt text-base-content/40"
							>Used in code to identify this stat</span
						>
					</label>
				</div>

				<div class="form-control">
					<AdminInput
						id="icon"
						label="Icon (Lucide Name)"
						bind:value={formData.icon}
						placeholder="e.g. Users"
					/>
					<label class="label pt-1" for="icon">
						<span class="label-text-alt text-base-content/40">Name of the Lucide icon</span>
					</label>
				</div>
			</div>

			<div class="mt-4">
				<AdminInput
					id="value"
					label="Value"
					bind:value={formData.value}
					placeholder="e.g. 150+"
					required
				/>
			</div>
		</fieldset>

		<div class="space-y-6">
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
					<AdminInput
						id="label_en"
						label="Label (English)"
						bind:value={formData.label_en}
						placeholder="e.g. Active Members"
						required
					/>
				</div>
				<div class={activeTab === 'ru' ? 'block' : 'hidden'}>
					<AdminInput
						id="label_ru"
						label="Label (Russian)"
						bind:value={formData.label_ru}
						placeholder="e.g. Активных Участников"
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
			disabled={isSaving}>Cancel</button
		>
		<button type="submit" form="stats-form" class="btn px-8 btn-primary" disabled={isSaving}>
			{#if isSaving}
				<span class="loading loading-sm loading-spinner"></span>
			{/if}
			Save
		</button>
	{/snippet}
</Modal>

<!-- Delete Confirmation Modal -->
<!-- Note: We use a separate snippet or boolean but since Modal uses a bound open prop, we can just wrap this -->
{#if deletingStatId}
	<Modal open={true} title="Delete Statistic" onClose={cancelDelete} maxWidth="sm">
		<p class="text-base-content/70">
			Are you sure you want to delete this statistic? This action cannot be undone.
		</p>

		{#snippet actions()}
			<button class="btn btn-ghost" onclick={cancelDelete}>Cancel</button>
			<button class="btn btn-error" onclick={confirmDelete}>Delete</button>
		{/snippet}
	</Modal>
{/if}
