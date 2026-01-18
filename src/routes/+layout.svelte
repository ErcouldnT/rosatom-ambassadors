<script lang="ts">
	import './app.css';
	import { page, navigating } from '$app/stores';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import ToastContainer from '$lib/components/ToastContainer.svelte';
	import { language } from '$lib/services/language';

	let { children, data } = $props();

	// Sync language with server data to avoid FOUC
	$effect.pre(() => {
		if (data.lang) {
			language.set(data.lang);
		}
	});

	// Hide header/footer on admin pages and map page
	let isImmersiveRoute = $derived(
		$page.url.pathname.startsWith('/admin') || $page.url.pathname === '/map'
	);

	// Navigation progress bar
	const progress = tweened(0, {
		duration: 400,
		easing: cubicOut
	});

	$effect(() => {
		if ($navigating) {
			progress.set(0, { duration: 0 });
			progress.set(0.8, { duration: 3000 });
		} else {
			progress.set(1, { duration: 400 }).then(() => {
				setTimeout(() => progress.set(0, { duration: 0 }), 100);
			});
		}
	});
</script>

{#if $navigating}
	<div class="fixed top-0 left-0 z-[60] h-1 w-full bg-base-200">
		<div
			class="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
			style="width: {$progress * 100}%"
		></div>
	</div>
{/if}

{#if isImmersiveRoute}
	<!-- Admin pages have their own layout -->
	{@render children()}
{:else}
	<div class="flex min-h-screen flex-col bg-base-100 font-sans text-base-content antialiased">
		<Header />
		<main class="flex-grow">
			{@render children()}
		</main>
		<Footer />
		<ToastContainer />
	</div>
{/if}
