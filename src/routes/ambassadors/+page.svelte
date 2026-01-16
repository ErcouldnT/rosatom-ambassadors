<script>
	import { language } from '$lib/stores/language';
	import { translations } from '$lib/services/translations';
	import { ArrowRight } from '@lucide/svelte';

	let { data } = $props();

	let t = $derived(translations[$language].ambassadorsPage);
	let ambassadors = $derived(data.ambassadors);
</script>

<svelte:head>
	<title>Ambassadors | RNE Ambassadors</title>
</svelte:head>

<div class="min-h-screen bg-base-100 pt-24 pb-20">
	<div class="container mx-auto px-6">
		<div class="mb-16 text-center">
			<h1 class="mb-4 text-3xl font-bold text-base-content md:text-4xl lg:text-5xl">{t.title}</h1>
			<p class="mx-auto max-w-2xl text-lg text-base-content/70">
				{t.description}
			</p>
		</div>

		<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
			{#each ambassadors as ambassador (ambassador.id)}
				<a
					href="/ambassadors/{ambassador.id}"
					class="group relative block h-[400px] overflow-hidden rounded-2xl bg-base-200 shadow-xl"
				>
					<img
						src={ambassador.image}
						alt={ambassador.name}
						class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
						loading="lazy"
					/>
					<div
						class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-90 transition-opacity duration-300"
					></div>
					<div class="absolute bottom-0 left-0 w-full p-6 text-white">
						<h3 class="mb-1 text-xl font-bold">{ambassador.name}</h3>
						<p class="mb-1 text-sm font-medium text-primary">{ambassador.country}</p>
						<p class="mb-4 text-xs text-white/70">{ambassador.role}</p>
						<span
							class="group/btn flex items-center gap-2 text-sm font-medium text-white/90 transition-colors hover:text-white"
						>
							{t.viewProfile}
							<ArrowRight class="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
						</span>
					</div>
				</a>
			{/each}
		</div>
	</div>
</div>
