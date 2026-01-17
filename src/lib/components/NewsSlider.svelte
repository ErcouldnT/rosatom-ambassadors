<script lang="ts">
	import { ChevronLeft, ChevronRight, ArrowRight } from '@lucide/svelte';
	import { language } from '$lib/services/language';
	import { translations } from '$lib/services/translations';
	import type { NewsItem } from '$lib/types';
	import { getImageUrl } from '$lib/utils';

	interface Props {
		news: NewsItem[];
	}

	let { news }: Props = $props();

	let t = $derived(translations[$language].news);
	let carousel: HTMLElement;

	function scrollLeft() {
		if (carousel) {
			carousel.scrollBy({ left: -400, behavior: 'smooth' });
		}
	}

	function scrollRight() {
		if (carousel) {
			carousel.scrollBy({ left: 400, behavior: 'smooth' });
		}
	}
</script>

<section id="news" class="bg-base-200 py-20">
	<div class="container mx-auto px-6">
		<div class="mb-12 flex items-center justify-between">
			<div>
				<h2 class="mb-2 text-4xl font-bold text-base-content">{t.title}</h2>
				<p class="text-base-content/70">Stay updated with our latest activities around the world</p>
			</div>
			<div class="hidden gap-2 md:flex">
				<button
					class="btn btn-circle text-base-content btn-outline btn-sm hover:bg-base-300 hover:text-base-content"
					onclick={scrollLeft}
					aria-label="Scroll left"><ChevronLeft class="h-4 w-4" /></button
				>
				<button
					class="btn btn-circle text-base-content btn-outline btn-sm hover:bg-base-300 hover:text-base-content"
					onclick={scrollRight}
					aria-label="Scroll right"><ChevronRight class="h-4 w-4" /></button
				>
			</div>
		</div>

		<div
			class="carousel max-w-full carousel-center space-x-6 rounded-box p-4 pt-8"
			bind:this={carousel}
		>
			{#each news as item (item.id)}
				<div class="carousel-item">
					<a
						href="/news/{item.id}"
						class="group card w-96 border border-base-200 bg-base-100 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-primary/20 hover:shadow-2xl"
					>
						<figure class="relative overflow-hidden px-4 pt-4">
							<img
								src={getImageUrl('news', item.id, item.image)}
								alt={$language === 'en' ? item.title_en : item.title_ru}
								class="h-56 w-full rounded-xl object-cover transition-transform duration-500 group-hover:scale-105"
								loading="lazy"
							/>
							<div class="absolute top-6 left-6 badge shadow-sm badge-primary">
								{$language === 'en' ? item.category_en : item.category_ru}
							</div>
						</figure>
						<div class="card-body">
							<div class="mb-1 text-sm font-medium text-base-content/60">{item.date}</div>
							<h2
								class="mb-2 card-title text-lg leading-tight text-base-content transition-colors group-hover:text-primary"
							>
								{$language === 'en' ? item.title_en : item.title_ru}
							</h2>
							<p class="line-clamp-2 text-sm text-base-content/70">
								{$language === 'en' ? item.excerpt_en : item.excerpt_ru}
							</p>
							<div class="mt-4 card-actions justify-end">
								<span
									class="btn flex items-center gap-1 px-0 text-base-content/70 btn-link no-underline transition-colors group-hover:text-primary"
								>
									{t.readMore}
									<ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-1" />
								</span>
							</div>
						</div>
					</a>
				</div>
			{/each}
		</div>

		<div class="mt-8 text-center md:hidden">
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
			<a href="/news" class="btn rounded-full btn-outline btn-sm">View All News</a>
		</div>
	</div>
</section>
