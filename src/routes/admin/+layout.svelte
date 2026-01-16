<script lang="ts">
	import { page } from '$app/stores';
	import {
		Atom,
		LayoutDashboard,
		Users,
		Calendar,
		Newspaper,
		Settings,
		LogOut,
		Menu,
		X,
		Globe,
		ScrollText,
		BarChart3
	} from '@lucide/svelte';
	import { language } from '$lib/services/language';
	import { translations } from '$lib/services/translations';

	let { children } = $props();
	let sidebarOpen = $state(false);

	let t = $derived(translations[$language].admin);

	let navItems = $derived([
		{ name: t.dashboard, href: '/admin', icon: LayoutDashboard },
		{ name: t.ambassadors, href: '/admin/ambassadors', icon: Users },
		{ name: t.events, href: '/admin/events', icon: Calendar },
		{ name: t.news, href: '/admin/news', icon: Newspaper },
		{ name: t.stats, href: '/admin/stats', icon: BarChart3 },
		{ name: t.countries, href: '/admin/countries', icon: Globe },
		{ name: t.tickers, href: '/admin/tickers', icon: ScrollText }
	]);

	async function handleLogout() {
		await fetch('/api/admin/logout', { method: 'POST' });
		// Force a hard redirect to clear client state
		window.location.href = '/admin/login';
	}

	function isActive(href: string): boolean {
		if (href === '/admin') {
			return $page.url.pathname === '/admin';
		}
		return $page.url.pathname.startsWith(href);
	}

	// Check if we're on the login page
	let isLoginPage = $derived($page.url.pathname === '/admin/login');
</script>

{#if isLoginPage}
	<!-- Login page: minimal layout, just render the content -->
	{@render children()}
{:else}
	<!-- Authenticated admin pages: full admin layout with sidebar -->
	<div class="flex min-h-screen bg-base-200">
		<!-- Mobile sidebar backdrop -->
		{#if sidebarOpen}
			<button
				class="fixed inset-0 z-40 bg-black/50 lg:hidden"
				onclick={() => (sidebarOpen = false)}
				aria-label="Close sidebar"
			></button>
		{/if}

		<!-- Sidebar -->
		<aside
			class="fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-base-100 shadow-lg transition-transform duration-300 lg:static lg:translate-x-0 {sidebarOpen
				? 'translate-x-0'
				: '-translate-x-full'}"
		>
			<!-- Logo -->
			<div class="flex h-16 items-center gap-3 border-b border-base-200 px-6">
				<div class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
					<Atom class="h-5 w-5 text-primary" />
				</div>
				<div>
					<span class="font-bold text-base-content"
						><span class="text-primary">RNE</span> Admin</span
					>
				</div>
			</div>

			<!-- Navigation -->
			<nav class="flex-1 space-y-1 p-4">
				{#each navItems as item (item.href)}
					{@const Icon = item.icon}
					<!-- eslint-disable svelte/no-navigation-without-resolve -->
					<a
						href={item.href}
						class="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors {isActive(
							item.href
						)
							? 'bg-primary text-primary-content'
							: 'text-base-content/70 hover:bg-base-200 hover:text-base-content'}"
						onclick={() => (sidebarOpen = false)}
					>
						<Icon class="h-5 w-5" />
						{item.name}
					</a>
					<!-- eslint-enable svelte/no-navigation-without-resolve -->
				{/each}
			</nav>

			<!-- Logout -->
			<div class="border-t border-base-200 p-4">
				<button
					onclick={handleLogout}
					class="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-error hover:bg-error/10"
				>
					<LogOut class="h-5 w-5" />
					{t.logout}
				</button>
			</div>
		</aside>

		<!-- Main content -->
		<div class="flex flex-1 flex-col">
			<!-- Top bar -->
			<header
				class="flex h-16 items-center justify-between border-b border-base-200 bg-base-100 px-6"
			>
				<button class="btn btn-ghost btn-sm lg:hidden" onclick={() => (sidebarOpen = !sidebarOpen)}>
					{#if sidebarOpen}
						<X class="h-5 w-5" />
					{:else}
						<Menu class="h-5 w-5" />
					{/if}
				</button>

				<div class="flex items-center gap-4">
					<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
					<!-- Language Switcher -->
					<div class="flex items-center gap-2">
						<button
							class="btn btn-sm {$language === 'en' ? 'btn-primary' : 'btn-ghost'}"
							onclick={() => language.set('en')}
						>
							EN
						</button>
						<button
							class="btn btn-sm {$language === 'ru' ? 'btn-primary' : 'btn-ghost'}"
							onclick={() => language.set('ru')}
						>
							RU
						</button>
					</div>

					<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
					<a href="/" target="_blank" class="btn btn-ghost btn-sm">View Site →</a>
				</div>
			</header>

			<!-- Page content -->
			<main class="flex-1 overflow-auto p-6">
				{@render children()}
			</main>
		</div>
	</div>
{/if}
