<script lang="ts">
	import { onMount } from 'svelte';
	import { Save, RefreshCw } from '@lucide/svelte';
	import type { Stat } from '$lib/types';

	let stats: Stat[] = [];
	let loading = true;
	let saving = false;

	onMount(async () => {
		await fetchStats();
	});

	async function fetchStats() {
		loading = true;
		try {
			const res = await fetch('/api/admin/stats');
			stats = await res.json();
		} catch (error) {
			console.error('Failed to fetch stats:', error);
		} finally {
			loading = false;
		}
	}

	async function updateStat(id: string) {
		const stat = stats.find((s) => s.id === id);
		if (!stat) return;

		saving = true;
		try {
			await fetch('/api/admin/stats', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(stat)
			});
		} catch (error) {
			console.error('Failed to update stat:', error);
		} finally {
			saving = false;
		}
	}
</script>

<svelte:head>
	<title>Settings - Admin</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Settings</h1>
			<p class="text-base-content/70">Manage site statistics and configuration</p>
		</div>
		<button class="btn btn-ghost" on:click={fetchStats}>
			<RefreshCw class="h-4 w-4" />
			Refresh
		</button>
	</div>

	<!-- Site Statistics -->
	<div class="card bg-base-100 shadow-sm">
		<div class="card-body">
			<h2 class="card-title">Site Statistics</h2>
			<p class="text-sm text-base-content/70">
				These values are displayed on the homepage stats section.
			</p>

			{#if loading}
				<div class="flex justify-center py-8">
					<span class="loading loading-md loading-spinner"></span>
				</div>
			{:else}
				<div class="mt-4 grid gap-4 md:grid-cols-2">
					{#each stats as stat, i (stat.label)}
						<div class="rounded-lg border border-base-200 p-4">
							<div class="mb-4 flex items-center gap-2">
								<span class="badge badge-primary">{stat.icon}</span>
								<span class="font-medium">{stat.label}</span>
							</div>

							<div class="form-control">
								<label class="label" for="stat-{i}">
									<span class="label-text">Display Value</span>
								</label>
								<div class="flex gap-2">
									<input
										type="text"
										id="stat-{i}"
										bind:value={stats[i].value}
										class="input-bordered input flex-1"
									/>
									<button
										class="btn btn-primary"
										on:click={() => updateStat(stat.id)}
										disabled={saving}
									>
										<Save class="h-4 w-4" />
									</button>
								</div>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>

	<!-- Admin Info -->
	<div class="card bg-base-100 shadow-sm">
		<div class="card-body">
			<h2 class="card-title">Admin Information</h2>
			<div class="mt-4 space-y-2 text-sm">
				<p><strong>Email:</strong> admin@rneambassadors.org</p>
				<p><strong>Password:</strong> admin123 (demo only)</p>
				<p class="text-base-content/50">
					In production, use environment variables and a proper database for credentials.
				</p>
			</div>
		</div>
	</div>
</div>
