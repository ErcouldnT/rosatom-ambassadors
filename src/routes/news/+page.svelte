<script lang="ts">
	import { ArrowRight, Calendar } from '@lucide/svelte';
	import { language } from '$lib/services/language';
	import { getImageUrl } from '$lib/utils';

	let { data } = $props();
</script>

<svelte:head>
	<title>News | RNE Ambassadors</title>
</svelte:head>

<div class="min-h-screen bg-base-100 pt-24 pb-20">
	<div class="container mx-auto px-6">
		<div class="mb-12 text-center">
			<div
				class="mb-4 inline-block rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary"
			>
				News & Updates
			</div>
			<h1 class="mb-4 text-3xl font-bold tracking-tight text-base-content md:text-4xl lg:text-5xl">
				Latest from RNE Ambassadors
			</h1>
			<p class="mx-auto max-w-2xl text-base text-base-content/70 md:text-lg">
				Stay informed about our latest activities, events, and success stories.
			</p>
		</div>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#await data.streamed.news}
				<div class="col-span-full flex justify-center py-20">
					<span class="loading loading-lg loading-spinner text-primary"></span>
				</div>
			{:then news}
				{#each news as item (item.id)}
					<a
						href="/news/@{item.slug}"
						class="group card overflow-hidden bg-base-200 shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-primary/10"
					>
						<!-- News Image -->
						<figure class="h-40 md:h-48">
							<img
								src={getImageUrl('news', item.id, item.image)}
								alt={$language === 'en' ? item.title_en : item.title_ru}
								class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
								loading="lazy"
								onerror={(e) =>
									((e.currentTarget as HTMLImageElement).src = '/images/placeholders/news.png')}
							/>
						</figure>

						<div class="card-body p-4 md:p-6">
							<!-- Category Badge -->
							<div class="mb-2">
								<span
									class="inline-block rounded-lg bg-base-300 px-2 py-1 text-xs font-bold tracking-wider text-base-content/80 uppercase transition-colors group-hover:bg-primary group-hover:text-primary-content"
								>
									{$language === 'en' ? item.category_en : item.category_ru}
								</span>
							</div>

							<!-- Date -->
							<div class="mb-2 flex items-center gap-2 text-xs text-base-content/60">
								<Calendar class="h-3 w-3" />
								<span>{item.date}</span>
							</div>

							<!-- Title -->
							<h3
								class="card-title line-clamp-2 text-base font-bold text-base-content transition-colors group-hover:text-primary md:text-lg"
							>
								{$language === 'en' ? item.title_en : item.title_ru}
							</h3>

							<!-- Excerpt -->
							<p class="line-clamp-2 text-sm text-base-content/70">
								{$language === 'en' ? item.excerpt_en : item.excerpt_ru}
							</p>

							<!-- Action -->
							<div class="mt-auto card-actions pt-3">
								<span
									class="flex items-center gap-1 text-sm font-medium text-primary transition-transform group-hover:translate-x-1"
								>
									Read Article
									<ArrowRight class="h-4 w-4" />
								</span>
							</div>
						</div>
					</a>
				{:else}
					<div class="col-span-full py-12 text-center text-base-content/50">
						<p class="text-lg">No news found.</p>
					</div>
				{/each}
			{:catch error}
				<div class="col-span-full py-12 text-center text-error">
					<p>Error loading news: {error.message}</p>
				</div>
			{/await}
		</div>
	</div>
</div>
