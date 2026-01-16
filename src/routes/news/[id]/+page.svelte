<script lang="ts">
	import { ArrowLeft, Calendar, Tag, Share2, Bookmark, Clock } from '@lucide/svelte';
	import type { NewsItem } from '$lib/types';
	import { language } from '$lib/stores/language';

	interface Props {
		data: { newsItem: NewsItem };
	}

	let { data }: Props = $props();
	let newsItem = $derived(data.newsItem);
</script>

<svelte:head>
	<title>{$language === 'en' ? newsItem.title_en : newsItem.title_ru} | RNE News</title>
</svelte:head>

<div class="min-h-screen bg-base-100 pt-20 pb-16">
	<div class="container mx-auto px-6">
		<!-- Back Button -->
		<a href="/news" class="btn mb-8 gap-2 text-base-content/70 btn-ghost hover:text-primary">
			<ArrowLeft class="h-4 w-4" />
			Back to News
		</a>

		<article class="mx-auto max-w-4xl">
			<!-- Article Header -->
			<header class="mb-8">
				<div class="mb-4 flex flex-wrap items-center gap-3">
					<span class="badge badge-lg badge-primary">
						{$language === 'en' ? newsItem.category_en : newsItem.category_ru}
					</span>
					<div class="flex items-center gap-2 text-base-content/60">
						<Calendar class="h-4 w-4" />
						<span>{newsItem.date}</span>
					</div>
					<div class="flex items-center gap-2 text-base-content/60">
						<Clock class="h-4 w-4" />
						<span>5 min read</span>
					</div>
				</div>

				<h1 class="mb-6 text-4xl leading-tight font-bold text-base-content lg:text-5xl">
					{$language === 'en' ? newsItem.title_en : newsItem.title_ru}
				</h1>

				<p class="text-xl text-base-content/70">
					{$language === 'en' ? newsItem.excerpt_en : newsItem.excerpt_ru}
				</p>
			</header>

			<!-- Featured Image -->
			<figure class="mb-10 overflow-hidden rounded-2xl">
				<img
					src={newsItem.image}
					alt={$language === 'en' ? newsItem.title_en : newsItem.title_ru}
					class="h-auto w-full object-cover"
					loading="lazy"
				/>
			</figure>

			<!-- Article Content -->
			<div class="prose prose-lg max-w-none">
				<p class="text-base-content/80">
					The international community continues to show growing interest in nuclear education and
					the development of sustainable energy solutions. This article explores the latest
					developments and initiatives in this rapidly evolving field.
				</p>

				<h2 class="text-base-content">Key Highlights</h2>
				<p class="text-base-content/80">
					Recent conferences and events have brought together experts from around the world to
					discuss the future of nuclear energy. These gatherings have produced important insights
					and recommendations for the industry.
				</p>

				<blockquote class="border-l-primary bg-base-200 text-base-content/80">
					"Nuclear energy remains one of the most promising solutions for addressing climate change
					while meeting the world's growing energy demands." — International Energy Agency
				</blockquote>

				<h2 class="text-base-content">Looking Forward</h2>
				<p class="text-base-content/80">
					As we move forward, the role of education becomes increasingly important. The RNE
					Ambassadors program continues to play a vital role in fostering international cooperation
					and knowledge sharing in the nuclear energy sector.
				</p>

				<ul class="text-base-content/80">
					<li>Expanded educational programs in developing countries</li>
					<li>New scholarship opportunities for STEM students</li>
					<li>Increased collaboration between universities and industry</li>
					<li>Growing emphasis on safety and sustainability</li>
				</ul>

				<h2 class="text-base-content">Conclusion</h2>
				<p class="text-base-content/80">
					The future of nuclear energy education looks bright, with continued investment and
					international cooperation driving progress. Stay tuned for more updates and developments
					from the RNE Ambassadors network.
				</p>
			</div>

			<!-- Article Footer -->
			<footer class="mt-10 border-t border-base-300 pt-8">
				<div class="flex flex-wrap items-center justify-between gap-4">
					<!-- Tags -->
					<div class="flex flex-wrap items-center gap-2">
						<Tag class="h-4 w-4 text-base-content/60" />
						<span class="badge badge-outline">Nuclear Energy</span>
						<span class="badge badge-outline">Education</span>
						<span class="badge badge-outline">Sustainability</span>
					</div>

					<!-- Share Buttons -->
					<div class="flex items-center gap-2">
						<button class="btn gap-2 btn-ghost btn-sm">
							<Share2 class="h-4 w-4" />
							Share
						</button>
						<button class="btn gap-2 btn-ghost btn-sm">
							<Bookmark class="h-4 w-4" />
							Save
						</button>
					</div>
				</div>
			</footer>

			<!-- Related Articles Section -->
			<section class="mt-16">
				<h2 class="mb-8 text-2xl font-bold text-base-content">Related Articles</h2>
				<div class="grid gap-6 md:grid-cols-2">
					<div class="card bg-base-200 shadow-md">
						<div class="card-body">
							<span class="badge badge-sm badge-secondary">Education</span>
							<h3 class="card-title text-base-content">Latest Developments in Nuclear Science</h3>
							<p class="text-base-content/70">Exploring new research frontiers...</p>
						</div>
					</div>
					<div class="card bg-base-200 shadow-md">
						<div class="card-body">
							<span class="badge badge-sm badge-accent">Events</span>
							<h3 class="card-title text-base-content">Upcoming International Forums</h3>
							<p class="text-base-content/70">Mark your calendar for these events...</p>
						</div>
					</div>
				</div>
			</section>
		</article>
	</div>
</div>
