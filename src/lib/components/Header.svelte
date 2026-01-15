<script lang="ts">
	import { Menu, Sun, Moon, Atom } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import { language } from '$lib/stores/language';
	import { translations } from '$lib/services/translations';

	let theme: string = 'light';

	// Reactive translations
	$: t = translations[$language];

	$: navLinks = [
		{ name: t.nav.about, href: '#about' },
		{ name: t.nav.ambassadors, href: '#ambassadors' },
		{ name: t.nav.events, href: '#events' },
		{ name: t.nav.news, href: '#news' },
		{ name: t.nav.contact, href: '#contact' }
	];

	onMount(() => {
		// Sync local state with the theme applied by app.html
		const currentTheme = document.documentElement.getAttribute('data-theme');
		if (currentTheme) {
			theme = currentTheme;
		}
	});

	function toggleTheme() {
		theme = theme === 'light' ? 'dark' : 'light';
		document.documentElement.setAttribute('data-theme', theme);
		localStorage.setItem('theme', theme);
	}

	function toggleLanguage() {
		language.update((l) => (l === 'en' ? 'ru' : 'en'));
	}
</script>

<header
	class="fixed top-0 z-50 w-full border-b border-base-200/50 bg-base-100/80 backdrop-blur-md transition-all duration-300"
>
	<div class="container mx-auto px-4">
		<div class="flex h-16 items-center justify-between">
			<!-- Logo -->
			<div class="navbar-start">
				<div class="dropdown">
					<div role="button" tabindex="0" class="btn btn-ghost lg:hidden">
						<Menu class="h-5 w-5" />
					</div>
					<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
					<ul
						tabindex="0"
						class="dropdown-content menu z-[1] mt-3 w-52 menu-sm rounded-box bg-base-100 p-2 shadow"
					>
						{#each navLinks as link (link.href)}
							<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
							<li><a href={link.href}>{link.name}</a></li>
						{/each}
					</ul>
				</div>
				<!-- eslint-disable svelte/no-navigation-without-resolve -->
				<a
					href="/"
					class="btn flex items-center gap-2 text-xl font-bold text-base-content btn-ghost"
				>
					<div
						class="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary"
					>
						<Atom size={20} />
					</div>
					<span><span class="text-primary">RNE</span> Ambassadors</span>
				</a>
				<!-- eslint-enable svelte/no-navigation-without-resolve -->
			</div>
			<div class="navbar-center hidden lg:flex">
				<ul class="menu menu-horizontal px-1 font-medium">
					{#each navLinks as link (link.href)}
						<li>
							<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
							<a href={link.href} class="transition-colors hover:text-primary">{link.name}</a>
						</li>
					{/each}
				</ul>
			</div>
			<div class="navbar-end gap-2">
				<label class="btn swap btn-circle swap-rotate btn-ghost">
					<!-- this hidden checkbox controls the state -->
					<input
						type="checkbox"
						class="theme-controller"
						value="dark"
						checked={theme === 'dark'}
						on:change={toggleTheme}
					/>

					<!-- moon icon (show when light, to switch to dark) -->
					<Moon class="swap-off h-5 w-5" />

					<!-- sun icon (show when dark, to switch to light) -->
					<Sun class="swap-on h-5 w-5" />
				</label>

				<!-- Language Toggle -->
				<button class="btn w-10 font-bold btn-ghost btn-sm" on:click={toggleLanguage}>
					{$language === 'en' ? 'RU' : 'EN'}
				</button>
			</div>
		</div>
	</div>
</header>
