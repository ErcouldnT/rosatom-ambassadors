<script lang="ts">
	import { onMount } from 'svelte';
	import { Users, Calendar, Newspaper, Globe, TrendingUp, Eye } from '@lucide/svelte';

	interface Stats {
		ambassadors: number;
		events: number;
		news: number;
		countries: number;
	}

	let stats: Stats = { ambassadors: 0, events: 0, news: 0, countries: 0 };
	let loading = true;

	onMount(async () => {
		try {
			const [ambassadorsRes, eventsRes, newsRes] = await Promise.all([
				fetch('/api/admin/ambassadors'),
				fetch('/api/admin/events'),
				fetch('/api/admin/news')
			]);

			const [ambassadors, events, news] = await Promise.all([
				ambassadorsRes.json(),
				eventsRes.json(),
				newsRes.json()
			]);

			stats = {
				ambassadors: ambassadors.length,
				events: events.length,
				news: news.length,
				countries: new Set(ambassadors.map((a: { country: string }) => a.country)).size
			};
		} catch (error) {
			console.error('Failed to fetch stats:', error);
		} finally {
			loading = false;
		}
	});

	const statCards = [
		{ label: 'Total Ambassadors', icon: Users, color: 'bg-primary/10 text-primary' },
		{ label: 'Active Events', icon: Calendar, color: 'bg-success/10 text-success' },
		{ label: 'News Articles', icon: Newspaper, color: 'bg-info/10 text-info' },
		{ label: 'Countries', icon: Globe, color: 'bg-warning/10 text-warning' }
	];
</script>

<svelte:head>
	<title>Dashboard - Admin</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div>
		<h1 class="text-2xl font-bold text-base-content">Dashboard</h1>
		<p class="text-base-content/70">Welcome back! Here's an overview of your site.</p>
	</div>

	<!-- Stats Grid -->
	<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
		{#each statCards as card, i (card.label)}
			<div class="card bg-base-100 shadow-sm">
				<div class="card-body">
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm text-base-content/70">{card.label}</p>
							{#if loading}
								<div class="mt-1 h-8 w-16 animate-pulse rounded bg-base-200"></div>
							{:else}
								<p class="mt-1 text-3xl font-bold text-base-content">
									{i === 0
										? stats.ambassadors
										: i === 1
											? stats.events
											: i === 2
												? stats.news
												: stats.countries}
								</p>
							{/if}
						</div>
						<div class="rounded-full p-3 {card.color}">
							<svelte:component this={card.icon} class="h-6 w-6" />
						</div>
					</div>
				</div>
			</div>
		{/each}
	</div>

	<!-- Quick Actions -->
	<div class="card bg-base-100 shadow-sm">
		<div class="card-body">
			<h2 class="card-title text-lg">Quick Actions</h2>
			<div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<!-- eslint-disable svelte/no-navigation-without-resolve -->
				<a href="/admin/ambassadors" class="btn btn-outline">
					<Users class="h-4 w-4" />
					Manage Ambassadors
				</a>
				<a href="/admin/events" class="btn btn-outline">
					<Calendar class="h-4 w-4" />
					Manage Events
				</a>
				<a href="/admin/news" class="btn btn-outline">
					<Newspaper class="h-4 w-4" />
					Manage News
				</a>
				<a href="/" target="_blank" class="btn btn-outline">
					<Eye class="h-4 w-4" />
					View Live Site
				</a>
				<!-- eslint-enable svelte/no-navigation-without-resolve -->
			</div>
		</div>
	</div>

	<!-- Recent Activity Placeholder -->
	<div class="card bg-base-100 shadow-sm">
		<div class="card-body">
			<div class="flex items-center gap-2">
				<TrendingUp class="h-5 w-5 text-primary" />
				<h2 class="card-title text-lg">Site Overview</h2>
			</div>
			<div class="mt-4 space-y-4">
				<div class="flex items-center justify-between border-b border-base-200 pb-4">
					<span class="text-base-content/70">Active ambassadors representing nuclear education</span
					>
					<span class="badge badge-primary">{loading ? '...' : stats.ambassadors}</span>
				</div>
				<div class="flex items-center justify-between border-b border-base-200 pb-4">
					<span class="text-base-content/70">Upcoming events scheduled</span>
					<span class="badge badge-success">{loading ? '...' : stats.events}</span>
				</div>
				<div class="flex items-center justify-between">
					<span class="text-base-content/70">Published news articles</span>
					<span class="badge badge-info">{loading ? '...' : stats.news}</span>
				</div>
			</div>
		</div>
	</div>
</div>
