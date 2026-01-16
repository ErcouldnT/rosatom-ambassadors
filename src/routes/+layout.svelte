<script lang="ts">
	import './app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/stores';

	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import ToastContainer from '$lib/components/ToastContainer.svelte';

	let { children } = $props();

	// Hide header/footer on admin pages
	let isAdminRoute = $derived($page.url.pathname.startsWith('/admin'));
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#if isAdminRoute}
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
