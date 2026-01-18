<script lang="ts">
	import { language } from '$lib/services/language';
	import { translations } from '$lib/services/translations';
	import { ArrowRight, Search, X } from '@lucide/svelte';
	import { getImageUrl } from '$lib/utils';
	import type { Ambassador } from '$lib/types';

	let { data } = $props();

	let searchQuery = $state('');
	let debouncedQuery = $state('');
	let timeoutId: ReturnType<typeof setTimeout> | undefined;

	// Debounce logic: update debouncedQuery when searchQuery changes
	$effect(() => {
		const query = searchQuery; // Synchronous read to establish dependency
		if (timeoutId) clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			debouncedQuery = query;
		}, 300);
		return () => {
			if (timeoutId) clearTimeout(timeoutId);
		};
	});

	let t = $derived(translations[$language].ambassadorsPage);
	function filteredAmbassadors(list: Ambassador[]) {
		return list.filter((ambassador) => {
			const query = debouncedQuery.toLowerCase().trim();
			if (!query) return true;

			return [
				ambassador.name_en,
				ambassador.name_ru,
				ambassador.country_en,
				ambassador.country_ru,
				ambassador.role_en,
				ambassador.role_ru
			].some((field) => field?.toLowerCase().includes(query));
		});
	}
	function focus(el: HTMLInputElement) {
		el.focus();
	}
</script>

<svelte:head>
	<title>{t.title} | RNE Ambassadors</title>
</svelte:head>

<div class="min-h-screen bg-base-100 pt-24 pb-20">
	<div class="container mx-auto px-6">
		<div class="mb-12 text-center">
			<h1 class="mb-4 text-3xl font-bold text-base-content md:text-4xl lg:text-5xl">{t.title}</h1>
			<p class="mx-auto mb-8 max-w-2xl text-lg text-base-content/70">
				{t.description}
			</p>

			<!-- Search Bar -->
			<div class="mx-auto max-w-xl">
				<div class="group relative">
					<div
						class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-base-content/40 transition-colors group-focus-within:text-primary"
					>
						<Search size={20} />
					</div>
					<input
						use:focus
						type="text"
						bind:value={searchQuery}
						placeholder={t.searchPlaceholder}
						class="w-full rounded-2xl border-2 border-transparent bg-base-200 py-4 pr-12 pl-12 text-base-content shadow-sm transition-all duration-300 outline-none hover:shadow-md focus:border-primary focus:bg-base-100"
					/>
					{#if searchQuery}
						<button
							onclick={() => (searchQuery = '')}
							class="absolute inset-y-0 right-0 flex items-center pr-4 text-base-content/40 transition-colors hover:text-error"
						>
							<X size={20} />
						</button>
					{/if}
				</div>
			</div>
		</div>

		<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
			{#await data.streamed.ambassadors}
				<div class="col-span-full flex justify-center py-20">
					<span class="loading loading-lg loading-spinner text-primary"></span>
				</div>
			{:then ambassadors}
				{#if filteredAmbassadors(ambassadors).length > 0}
					{#each filteredAmbassadors(ambassadors) as ambassador (ambassador.id)}
						<a
							href="/ambassadors/{ambassador.id}"
							class="group relative block h-[400px] overflow-hidden rounded-2xl bg-base-200 shadow-xl"
						>
							<img
								src={getImageUrl('ambassadors', ambassador.id, ambassador.image)}
								alt={$language === 'en' ? ambassador.name_en : ambassador.name_ru}
								class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
								loading="lazy"
								onerror={(e) =>
									((e.currentTarget as HTMLImageElement).src = '/placeholder-avatar.png')}
							/>
							<div
								class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-90 transition-opacity duration-300"
							></div>
							<div class="absolute bottom-0 left-0 w-full p-6 text-white">
								<h3 class="mb-1 text-xl font-bold">
									{$language === 'en' ? ambassador.name_en : ambassador.name_ru}
								</h3>
								<p class="mb-1 text-sm font-medium text-primary">
									{$language === 'en' ? ambassador.country_en : ambassador.country_ru}
								</p>
								<p class="mb-4 text-xs text-white/70">
									{$language === 'en' ? ambassador.role_en : ambassador.role_ru}
								</p>
								<span
									class="group/btn flex items-center gap-2 text-sm font-medium text-white/90 transition-colors hover:text-white"
								>
									{t.viewProfile}
									<ArrowRight class="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
								</span>
							</div>
						</a>
					{/each}
				{:else}
					<div class="col-span-full py-20 text-center">
						<div
							class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-base-200 text-base-content/20"
						>
							<Search size={32} />
						</div>
						<h3 class="text-xl font-bold text-base-content">{t.noResults}</h3>
						<p class="mt-2 text-base-content/50">Try searching for something else</p>
						{#if searchQuery}
							<button
								onclick={() => (searchQuery = '')}
								class="btn mt-6 rounded-xl btn-outline btn-primary"
							>
								Clear Search
							</button>
						{/if}
					</div>
				{/if}
			{:catch error}
				<div class="col-span-full py-20 text-center text-error">
					<p>Error loading ambassadors: {error.message}</p>
				</div>
			{/await}
		</div>
	</div>
</div>
