<script lang="ts">
	import {
		Users,
		Calendar,
		Newspaper,
		Globe,
		Eye,
		MessageSquare,
		ArrowRight
	} from '@lucide/svelte';
	import { browser } from '$app/environment';
	import { translations } from '$lib/services/translations';
	import { language } from '$lib/services/language';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let stats = $derived(data.stats);
	let recentMessages = $derived(data.recentMessages);
	let topCountries = $derived(data.topCountries);
	let upcomingEvents = $derived(data.upcomingEvents);
	let recentNews = $derived(data.recentNews);
	let ambassadorRoles = $derived(data.ambassadorRoles);

	// Access nested translations helper - prioritize server language
	let currentLang = $derived(!browser && data.lang ? data.lang : $language);
	let t = $derived(translations[currentLang].admin);

	const statCards = $derived([
		{
			label: t.totalAmbassadors,
			value: stats.ambassadors,
			icon: Users,
			color: 'bg-primary/10 text-primary',
			sub: `${stats.activeAmbassadors} ${t.sub.active}`
		},
		{
			label: t.activeEvents,
			value: stats.events,
			icon: Calendar,
			color: 'bg-success/10 text-success',
			sub: t.sub.upcoming
		},
		{
			label: t.newsArticles,
			value: stats.news,
			icon: Newspaper,
			color: 'bg-info/10 text-info',
			sub: t.sub.published
		},
		{
			label: t.countries,
			value: stats.countries,
			icon: Globe,
			color: 'bg-warning/10 text-warning',
			sub: t.sub.represented
		},
		{
			label: t.messages,
			value: stats.messages,
			icon: MessageSquare,
			color: 'bg-error/10 text-error',
			sub: `${stats.unreadMessages} ${t.sub.unread}`
		}
	]);
</script>

<svelte:head>
	<title>{t.dashboard} - Admin</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div>
		<h1 class="text-2xl font-bold text-base-content">{t.dashboard}</h1>
		<p class="text-base-content/70">{t.welcome}</p>
	</div>

	<!-- Stats Grid -->
	<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
		{#each statCards as card (card.label)}
			<div class="card bg-base-100 shadow-sm transition-shadow hover:shadow-md">
				<div class="card-body p-6">
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm font-medium text-base-content/70">{card.label}</p>
							<p class="mt-2 text-3xl font-bold text-base-content">{card.value}</p>
							<p class="mt-1 text-xs text-base-content/50">{card.sub}</p>
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
		<div class="card-body p-6">
			<h2 class="card-title text-lg">{t.quickActions}</h2>
			<div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<!-- eslint-disable svelte/no-navigation-without-resolve -->
				<a href="/admin/ambassadors" class="btn btn-outline hover:btn-primary">
					<Users class="h-4 w-4" />
					{t.manageAmbassadors}
				</a>
				<a href="/admin/events" class="btn btn-outline hover:btn-primary">
					<Calendar class="h-4 w-4" />
					{t.manageEvents}
				</a>
				<a href="/admin/news" class="btn btn-outline hover:btn-primary">
					<Newspaper class="h-4 w-4" />
					{t.manageNews}
				</a>
				<a href="/" target="_blank" class="btn btn-outline hover:btn-primary">
					<Eye class="h-4 w-4" />
					{t.viewLiveSite}
				</a>
				<!-- eslint-enable svelte/no-navigation-without-resolve -->
			</div>
		</div>
	</div>

	<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
		<!-- Recent Messages -->
		<div class="card bg-base-100 shadow-sm">
			<div class="card-body p-6">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-2">
						<MessageSquare class="h-5 w-5 text-primary" />
						<h2 class="card-title text-lg">{t.recentMessages}</h2>
					</div>
					<a href="/admin/messages" class="btn btn-ghost btn-xs"
						>{t.viewAll} <ArrowRight class="h-3 w-3" /></a
					>
				</div>

				<div class="mt-4 space-y-4">
					{#if recentMessages.length > 0}
						{#each recentMessages as msg (msg.id)}
							<div
								class="flex items-start gap-3 border-b border-base-200 pb-3 last:border-0 last:pb-0"
							>
								<div class="min-w-0 flex-1">
									<div class="flex items-center justify-between">
										<p class="truncate text-sm font-medium">{msg.name}</p>
										<span class="text-xs text-base-content/50"
											>{new Date(msg.created).toLocaleDateString()}</span
										>
									</div>
									<p class="truncate text-xs text-base-content/70">{msg.message}</p>
								</div>
								{#if !msg.is_read}
									<span class="badge badge-xs badge-primary"></span>
								{/if}
							</div>
						{/each}
					{:else}
						<p class="py-4 text-center text-sm text-base-content/50">{t.empty.noMessages}</p>
					{/if}
				</div>
			</div>
		</div>

		<!-- Top Countries -->
		<div class="card bg-base-100 shadow-sm">
			<div class="card-body p-6">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-2">
						<Globe class="h-5 w-5 text-warning" />
						<h2 class="card-title text-lg">{t.topCountries}</h2>
					</div>
					<a href="/admin/countries" class="btn btn-ghost btn-xs"
						>{t.viewAll} <ArrowRight class="h-3 w-3" /></a
					>
				</div>

				<div class="mt-4 space-y-4">
					{#if topCountries.length > 0}
						{#each topCountries as country, i (i)}
							<div
								class="flex items-center justify-between border-b border-base-200 pb-3 last:border-0 last:pb-0"
							>
								<div class="flex items-center gap-3">
									<span
										class="flex h-6 w-6 items-center justify-center rounded-full bg-base-200 text-xs font-bold text-base-content/50"
									>
										{i + 1}
									</span>
									<span class="text-2xl">{country.flag}</span>
									<span class="text-sm font-medium">{country.name_en}</span>
								</div>
								<span class="badge badge-ghost font-mono">{country.ambassador_count}</span>
							</div>
						{/each}
					{:else}
						<p class="py-4 text-center text-sm text-base-content/50">{t.empty.noData}</p>
					{/if}
				</div>
			</div>
		</div>

		<!-- Upcoming Events -->
		<div class="card bg-base-100 shadow-sm">
			<div class="card-body p-6">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-2">
						<Calendar class="h-5 w-5 text-success" />
						<h2 class="card-title text-lg">{t.upcomingEvents}</h2>
					</div>
					<a href="/admin/events" class="btn btn-ghost btn-xs"
						>{t.viewAll} <ArrowRight class="h-3 w-3" /></a
					>
				</div>

				<div class="mt-4 space-y-4">
					{#if upcomingEvents.length > 0}
						{#each upcomingEvents as event (event.id)}
							<div
								class="flex items-center justify-between border-b border-base-200 pb-3 last:border-0 last:pb-0"
							>
								<div class="min-w-0 flex-1">
									<p class="truncate text-sm font-medium">{event.title_en}</p>
									<p class="text-xs text-base-content/50">{event.location_en}, {event.time}</p>
								</div>
								<div class="text-right">
									<span class="block text-sm font-bold text-primary">{event.date_day}</span>
									<span class="block text-xs text-base-content/50 uppercase"
										>{event.date_month_en.slice(0, 3)}</span
									>
								</div>
							</div>
						{/each}
					{:else}
						<p class="py-4 text-center text-sm text-base-content/50">{t.empty.noEvents}</p>
					{/if}
				</div>
			</div>
		</div>
	</div>

	<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
		<!-- Recent News -->
		<div class="card bg-base-100 shadow-sm">
			<div class="card-body p-6">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-2">
						<Newspaper class="h-5 w-5 text-info" />
						<h2 class="card-title text-lg">{t.recentNews}</h2>
					</div>
					<a href="/admin/news" class="btn btn-ghost btn-xs"
						>{t.viewAll} <ArrowRight class="h-3 w-3" /></a
					>
				</div>

				<div class="mt-4 space-y-4">
					{#if recentNews.length > 0}
						{#each recentNews as news (news.id)}
							<div
								class="flex items-start gap-3 border-b border-base-200 pb-3 last:border-0 last:pb-0"
							>
								<div class="min-w-0 flex-1">
									<div class="flex items-center justify-between">
										<p class="truncate text-sm font-medium">{news.title_en}</p>
										<span class="text-xs text-base-content/50"
											>{new Date(news.date).toLocaleDateString()}</span
										>
									</div>
									<p class="truncate text-xs text-base-content/70">{news.category_en}</p>
								</div>
							</div>
						{/each}
					{:else}
						<p class="py-4 text-center text-sm text-base-content/50">{t.empty.noNews}</p>
					{/if}
				</div>
			</div>
		</div>

		<!-- Ambassador Roles -->
		<div class="card bg-base-100 shadow-sm">
			<div class="card-body p-6">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-2">
						<Users class="h-5 w-5 text-primary" />
						<h2 class="card-title text-lg">{t.ambassadorRoles}</h2>
					</div>
					<a href="/admin/ambassadors" class="btn btn-ghost btn-xs"
						>{t.manage} <ArrowRight class="h-3 w-3" /></a
					>
				</div>

				<div class="mt-4 space-y-4">
					{#if ambassadorRoles.length > 0}
						{#each ambassadorRoles as role (role.role)}
							<div class="flex items-center justify-between">
								<span class="text-sm font-medium">{role.role}</span>
								<div class="flex items-center gap-3">
									<progress
										class="progress w-32 progress-primary"
										value={role.count}
										max={stats.activeAmbassadors}
									></progress>
									<span class="w-6 text-right text-sm font-bold">{role.count}</span>
								</div>
							</div>
						{/each}
					{:else}
						<p class="py-4 text-center text-sm text-base-content/50">{t.empty.noData}</p>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
