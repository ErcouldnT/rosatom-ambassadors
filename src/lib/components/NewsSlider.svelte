<script>
	import { getNews } from '$lib/services/mockApi';
	import { ChevronLeft, ChevronRight, ArrowRight } from '@lucide/svelte';
	import { language } from '$lib/stores/language';
	import { translations } from '$lib/services/translations';

	$: t = translations[$language].news;

	const newsItems = getNews();
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
					><ChevronLeft class="h-4 w-4" /></button
				>
				<button
					class="btn btn-circle text-base-content btn-outline btn-sm hover:bg-base-300 hover:text-base-content"
					><ChevronRight class="h-4 w-4" /></button
				>
			</div>
		</div>

		<div class="carousel max-w-full carousel-center space-x-6 rounded-box p-4">
			{#each newsItems as item (item.id)}
				<div class="carousel-item">
					<div
						class="group card w-96 border border-base-200 bg-base-100 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
					>
						<figure class="relative overflow-hidden px-4 pt-4">
							<img
								src={item.image}
								alt={item.title}
								class="h-56 w-full rounded-xl object-cover transition-transform duration-500 group-hover:scale-105"
							/>
							<div class="absolute top-6 left-6 badge badge-primary">{item.category}</div>
						</figure>
						<div class="card-body">
							<div class="mb-1 text-sm text-base-content/60">{item.date}</div>
							<h2
								class="mb-2 card-title cursor-pointer text-lg leading-tight text-base-content transition-colors hover:text-primary"
							>
								{item.title}
							</h2>
							<p class="line-clamp-2 text-sm text-base-content/70">{item.excerpt}</p>
							<div class="mt-4 card-actions justify-end">
								<button
									class="btn flex items-center gap-1 px-0 text-base-content/70 btn-link no-underline hover:text-primary"
								>
									{t.readMore}
									<ArrowRight class="h-4 w-4" />
								</button>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>

		<div class="mt-8 text-center md:hidden">
			<a href="#news-archive" class="btn rounded-full btn-outline btn-sm">View All News</a>
		</div>
	</div>
</section>
