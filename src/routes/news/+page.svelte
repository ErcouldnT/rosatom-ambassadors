<script>
	import { getNews } from '$lib/services/mockApi';
	import { ArrowRight, Calendar } from '@lucide/svelte';

	const news = getNews();
</script>

<div class="min-h-screen bg-base-100 pt-24 pb-20">
	<div class="container mx-auto px-6">
		<div class="mb-16 text-center">
			<div
				class="mb-6 inline-block rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary"
			>
				News & Updates
			</div>
			<h1 class="mb-4 text-3xl font-bold tracking-tight text-base-content md:text-4xl lg:text-5xl">
				Latest from RNE Ambassadors
			</h1>
			<p class="mx-auto max-w-2xl text-lg text-base-content/70">
				Stay informed about our latest activities, events, and success stories from around the
				globe.
			</p>
		</div>

		<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
			{#each news as item (item.id)}
				<div
					class="group relative flex h-[400px] flex-col overflow-hidden rounded-2xl border border-base-content/10 bg-base-200 transition-all duration-300 hover:border-primary/30"
				>
					<!-- Content Container -->
					<div class="relative z-10 flex h-full flex-col p-8 text-base-content">
						<!-- Category Badge -->
						<div class="mb-auto">
							<span
								class="inline-block rounded-lg bg-base-300 px-3 py-1 text-xs font-bold tracking-wider text-base-content/90 uppercase transition-colors group-hover:bg-primary group-hover:text-primary-content"
							>
								{item.category}
							</span>
						</div>

						<!-- Date -->
						<div class="mb-3 flex items-center gap-2 text-sm font-medium text-primary">
							<Calendar class="h-4 w-4" />
							<span>{item.date}</span>
						</div>

						<!-- Title -->
						<h3
							class="mb-2 line-clamp-2 text-xl leading-tight font-bold transition-colors group-hover:text-primary"
						>
							{item.title}
						</h3>

						<!-- Excerpt -->
						<p class="mb-6 line-clamp-2 text-sm text-base-content/70">
							{item.excerpt}
						</p>

						<!-- Link -->
						<div
							class="flex items-center gap-2 text-sm font-medium text-base-content/70 transition-colors group-hover:text-primary"
						>
							Read Article
							<ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-1" />
						</div>
					</div>

					<!-- Subtle Gradient Background -->
					<div
						class="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
					></div>
				</div>
			{/each}
		</div>
	</div>
</div>
