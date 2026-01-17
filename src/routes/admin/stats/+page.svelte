<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import type { Stat } from '$lib/types';
	import { language } from '$lib/services/language';

	import { Edit, Plus, Trash2, X } from '@lucide/svelte';

	let stats = $state<Stat[]>([]);
	let loading = $state(true);
	let error = $state<string | null>(null);

	// Translation

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

	onMount(async () => {
		await loadStats();
	});

	async function loadStats() {
		try {
			const res = await fetch('/api/admin/stats');
			if (res.ok) {
				stats = await res.json();
			} else {
				error = 'Failed to load stats';
			}
		} catch {
			error = 'Error loading stats';
		} finally {
			loading = false;
		}
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
			} else {
				alert('Failed to save stat');
			}
		} catch {
			console.error('Failed to update stat');
			alert('Error saving stat');
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
			} else {
				alert('Failed to delete stat');
			}
		} catch {
			alert('Error deleting stat');
		}
	}
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h1 class="text-3xl font-bold text-base-content">
			{$language === 'en' ? 'Statistics' : 'Статистика'}
		</h1>
		<button class="btn btn-primary" onclick={openAddModal}>
			<Plus size={20} />
			{$language === 'en' ? 'Add Stat' : 'Добавить'}
		</button>
	</div>

	{#if loading}
		<div class="flex justify-center p-12">
			<span class="loading loading-lg loading-spinner text-primary"></span>
		</div>
	{:else if error}
		<div class="alert alert-error">
			<span>{error}</span>
		</div>
	{:else}
		<div class="overflow-x-auto rounded-box border border-base-300 bg-base-100 shadow-sm">
			<table class="table">
				<thead class="bg-base-200">
					<tr>
						<th>Key</th>
						<th>Value</th>
						<th>Label (EN)</th>
						<th>Label (RU)</th>
						<th class="w-24 text-right">Actions</th>
					</tr>
				</thead>
				<tbody>
					{#each stats as stat (stat.id)}
						<tr class="hover">
							<td class="font-mono text-sm opacity-50">{stat.key}</td>
							<td class="font-bold">{stat.value}</td>
							<td>{stat.label_en}</td>
							<td>{stat.label_ru}</td>
							<td class="flex justify-end gap-2">
								<button class="btn btn-square btn-ghost btn-sm" onclick={() => openEditModal(stat)}>
									<Edit size={18} />
								</button>
								<button
									class="btn btn-square text-error btn-ghost btn-sm"
									onclick={() => promptDelete(stat.id)}
								>
									<Trash2 size={18} />
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>

<!-- Edit/Add Modal -->
<dialog
	class="modal modal-bottom sm:modal-middle"
	class:modal-open={isModalOpen}
	onkeydown={(e) => e.key === 'Escape' && closeModal()}
>
	<div class="modal-box w-full max-w-lg p-0 sm:w-11/12">
		<div class="flex items-center justify-between border-b border-base-200 px-4 py-4 sm:px-6">
			<div>
				<h3 class="text-lg font-bold sm:text-xl">
					{editingStat ? 'Edit Statistic' : 'Add Statistic'}
				</h3>
				<p class="mt-0.5 text-sm text-base-content/60">
					{editingStat ? 'Update statistic value and labels' : 'Create a new statistic'}
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

		<div class="px-4 py-4 sm:px-6">
			<!-- Tabs -->
			<div role="tablist" class="tabs-bordered mt-4 tabs">
				<button
					role="tab"
					class="tab"
					class:tab-active={activeTab === 'en'}
					onclick={() => (activeTab = 'en')}
				>
					English
				</button>
				<button
					role="tab"
					class="tab"
					class:tab-active={activeTab === 'ru'}
					onclick={() => (activeTab = 'ru')}
				>
					Russian
				</button>
			</div>

			<div class="space-y-4 py-4">
				<!-- Common Fields -->
				<div class="form-control">
					<label class="label" for="key">
						<span class="label-text">Key (Unique ID)</span>
					</label>
					<input
						id="key"
						type="text"
						bind:value={formData.key}
						class="input-bordered input w-full font-mono"
						disabled={!!editingStat}
						placeholder="e.g. active_members"
					/>
					<label class="label" for="key">
						<span class="label-text-alt text-base-content/60"
							>Used in code to identify this stat</span
						>
					</label>
				</div>

				<div class="form-control">
					<label class="label" for="value">
						<span class="label-text">Value</span>
					</label>
					<input
						id="value"
						type="text"
						bind:value={formData.value}
						class="input-bordered input w-full"
						placeholder="e.g. 150+"
					/>
				</div>

				<div class="form-control">
					<label class="label" for="icon">
						<span class="label-text">Icon (Lucide Name)</span>
					</label>
					<input
						id="icon"
						type="text"
						bind:value={formData.icon}
						class="input-bordered input w-full"
						placeholder="e.g. Users"
					/>
					<div class="mt-1 flex items-center gap-2 text-xs text-base-content/60">
						<span>Preview:</span>
						{#if formData.icon}
							<!-- Dynamic icon check would go here, simplistic for now -->
							<span class="badge badge-neutral">{formData.icon}</span>
						{/if}
					</div>
				</div>

				<!-- Language Specific Fields -->
				{#if activeTab === 'en'}
					<div class="form-control" in:fade={{ duration: 200 }}>
						<label class="label" for="label_en">
							<span class="label-text">Label (English)</span>
						</label>
						<input
							id="label_en"
							type="text"
							bind:value={formData.label_en}
							class="input-bordered input w-full"
							placeholder="e.g. Active Members"
						/>
					</div>
				{/if}

				{#if activeTab === 'ru'}
					<div class="form-control" in:fade={{ duration: 200 }}>
						<label class="label" for="label_ru">
							<span class="label-text">Label (Russian)</span>
						</label>
						<input
							id="label_ru"
							type="text"
							bind:value={formData.label_ru}
							class="input-bordered input w-full"
							placeholder="e.g. Активных Участников"
						/>
					</div>
				{/if}
			</div>

			<div class="modal-action">
				<button class="btn" onclick={closeModal} disabled={isSaving}>Cancel</button>
				<button class="btn btn-primary" onclick={saveStat} disabled={isSaving}>
					{#if isSaving}
						<span class="loading loading-sm loading-spinner"></span>
					{/if}
					Save
				</button>
			</div>
		</div>
		<form method="dialog" class="modal-backdrop">
			<button onclick={closeModal}>close</button>
		</form>
	</div>
</dialog>

<!-- Delete Confirmation Modal -->
<dialog
	class="modal modal-bottom sm:modal-middle"
	class:modal-open={!!deletingStatId}
	onkeydown={(e) => e.key === 'Escape' && cancelDelete()}
>
	<div class="modal-box w-full max-w-sm p-0 sm:w-11/12">
		<div class="px-4 py-4 sm:px-6">
			<h3 class="text-lg font-bold text-error">Delete Statistic</h3>
			<p class="mt-2 text-sm text-base-content/70">
				Are you sure you want to delete this statistic? This action cannot be undone.
			</p>
			<div class="modal-action">
				<button class="btn" onclick={cancelDelete}>Cancel</button>
				<button class="btn btn-error" onclick={confirmDelete}>Delete</button>
			</div>
		</div>
	</div>

	<form method="dialog" class="modal-backdrop">
		<button onclick={cancelDelete}>close</button>
	</form>
</dialog>
