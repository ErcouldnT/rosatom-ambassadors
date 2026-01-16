<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import type { Stat } from '$lib/types';
	import { language } from '$lib/services/language';

	import { Edit } from '@lucide/svelte';

	let stats = $state<Stat[]>([]);
	let loading = $state(true);
	let error = $state<string | null>(null);

	// Translation

	// Modal state
	let isModalOpen = $state(false);
	let editingStat = $state<Stat | null>(null);
	let activeTab = $state<'en' | 'ru'>('en');
	let isSaving = $state(false);

	// Form state
	let formData = $state({
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

	function openEditModal(stat: Stat) {
		editingStat = stat;
		formData = {
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
		if (!editingStat) return;

		isSaving = true;
		try {
			const res = await fetch('/api/admin/stats', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					id: editingStat.id,
					...formData
				})
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
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h1 class="text-3xl font-bold text-base-content">
			{$language === 'en' ? 'Statistics' : 'Статистика'}
		</h1>
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
						<th class="w-16">Actions</th>
					</tr>
				</thead>
				<tbody>
					{#each stats as stat (stat.id)}
						<tr class="hover">
							<td class="font-mono text-sm opacity-50">{stat.key}</td>
							<td class="font-bold">{stat.value}</td>
							<td>{stat.label_en}</td>
							<td>{stat.label_ru}</td>
							<td>
								<button class="btn btn-square btn-ghost btn-sm" onclick={() => openEditModal(stat)}>
									<Edit size={18} />
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>

<!-- Edit Modal -->
<dialog class="modal" class:modal-open={isModalOpen}>
	<div class="modal-box">
		<h3 class="text-lg font-bold">Edit Statistic</h3>

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
				<label class="label" for="value">
					<span class="label-text">Value</span>
				</label>
				<input
					id="value"
					type="text"
					bind:value={formData.value}
					class="input-bordered input w-full"
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
				/>
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
</dialog>
