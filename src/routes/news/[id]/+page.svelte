<script lang="ts">
	import { ArrowLeft, Calendar, Tag, Share2, Bookmark, Clock, ArrowRight } from '@lucide/svelte';
	import type { NewsItem } from '$lib/types';
	import { language } from '$lib/services/language';
	import { getImageUrl } from '$lib/utils';

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
		<a href="/news" class="btn mb-8 gap-2 pl-0 text-base-content/70 btn-ghost hover:text-primary">
			<ArrowLeft class="h-4 w-4" />
			Back to News
		</a>

		<article class="mx-auto max-w-4xl">
			<!-- Article Header -->
			<header class="mb-10 text-center">
				<div class="mb-6 flex flex-wrap items-center justify-center gap-3">
					<span class="badge border-none badge-lg shadow-sm badge-primary">
						{$language === 'en' ? newsItem.category_en : newsItem.category_ru}
					</span>
					<div class="flex items-center gap-2 text-sm font-medium text-base-content/60">
						<Calendar class="h-4 w-4" />
						<span>{newsItem.date}</span>
					</div>
					<div class="flex items-center gap-2 text-sm font-medium text-base-content/60">
						<Clock class="h-4 w-4" />
						<span>5 min read</span>
					</div>
				</div>

				<h1
					class="mb-6 text-4xl leading-tight font-extrabold tracking-tight text-base-content lg:text-6xl"
				>
					{$language === 'en' ? newsItem.title_en : newsItem.title_ru}
				</h1>

				<p class="mx-auto max-w-2xl text-xl leading-relaxed text-base-content/70">
					{$language === 'en' ? newsItem.excerpt_en : newsItem.excerpt_ru}
				</p>
			</header>

			<!-- Featured Image -->
			<figure class="relative mb-12 aspect-video overflow-hidden rounded-3xl shadow-2xl">
				<img
					src={getImageUrl('news', newsItem.id, newsItem.image)}
					alt={$language === 'en' ? newsItem.title_en : newsItem.title_ru}
					class="h-full w-full object-cover"
					loading="lazy"
				/>
				<div class="absolute inset-0 rounded-3xl ring-1 ring-black/10 ring-inset"></div>
			</figure>

			<!-- Article Content -->
			<div
				class="prose prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary"
			>
				<p class="lead text-2xl font-medium text-base-content/80">
					The international community continues to show growing interest in nuclear education and
					the development of sustainable energy solutions. This article explores the latest
					developments and initiatives in this rapidly evolving field.
				</p>

				<h2 class="mt-12 mb-6 text-3xl text-base-content">Key Highlights</h2>
				<p class="text-base-content/80">
					Recent conferences and events have brought together experts from around the world to
					discuss the future of nuclear energy. These gatherings have produced important insights
					and recommendations for the industry.
				</p>

				<blockquote
					class="my-8 rounded-r-xl border-l-4 border-primary bg-base-200/50 p-6 font-serif text-xl text-base-content/90 italic"
				>
					"Nuclear energy remains one of the most promising solutions for addressing climate change
					while meeting the world's growing energy demands."
					<footer class="mt-2 font-sans text-sm text-base-content/60 not-italic">
						— International Energy Agency
					</footer>
				</blockquote>

				<h2 class="mt-12 mb-6 text-3xl text-base-content">Looking Forward</h2>
				<p class="text-base-content/80">
					As we move forward, the role of education becomes increasingly important. The RNE
					Ambassadors program continues to play a vital role in fostering international cooperation
					and knowledge sharing in the nuclear energy sector.
				</p>

				<ul class="my-6 space-y-2 text-base-content/80">
					<li class="flex items-start gap-2">
						<span class="font-bold text-primary">•</span>
						Expanded educational programs in developing countries
					</li>
					<li class="flex items-start gap-2">
						<span class="font-bold text-primary">•</span>
						New scholarship opportunities for STEM students
					</li>
					<li class="flex items-start gap-2">
						<span class="font-bold text-primary">•</span>
						Increased collaboration between universities and industry
					</li>
					<li class="flex items-start gap-2">
						<span class="font-bold text-primary">•</span>
						Growing emphasis on safety and sustainability
					</li>
				</ul>

				<h2 class="mt-12 mb-6 text-3xl text-base-content">Conclusion</h2>
				<p class="text-base-content/80">
					The future of nuclear energy education looks bright, with continued investment and
					international cooperation driving progress. Stay tuned for more updates and developments
					from the RNE Ambassadors network.
				</p>
			</div>

			<!-- Article Footer -->
			<footer class="mt-16 border-t border-base-200 pt-8">
				<div class="flex flex-wrap items-center justify-between gap-6">
					<!-- Tags -->
					<div class="flex flex-wrap items-center gap-2">
						<Tag class="h-4 w-4 text-base-content/60" />
						<span class="badge cursor-pointer badge-outline transition-colors hover:bg-base-200"
							>Nuclear Energy</span
						>
						<span class="badge cursor-pointer badge-outline transition-colors hover:bg-base-200"
							>Education</span
						>
						<span class="badge cursor-pointer badge-outline transition-colors hover:bg-base-200"
							>Sustainability</span
						>
					</div>

					<!-- Share Buttons -->
					<div class="flex items-center gap-2">
						<button class="btn gap-2 btn-ghost btn-sm hover:text-primary">
							<Share2 class="h-4 w-4" />
							Share
						</button>
						<button class="btn gap-2 btn-ghost btn-sm hover:text-primary">
							<Bookmark class="h-4 w-4" />
							Save
						</button>
					</div>
				</div>
			</footer>

			<!-- Related Articles Section -->
			<section class="mt-20">
				<div class="mb-8 flex items-center justify-between">
					<h2 class="text-2xl font-bold text-base-content">Related Articles</h2>
					<button class="btn text-base-content/60 btn-link no-underline hover:text-primary"
						>View All <ArrowRight class="ml-1 h-4 w-4" /></button
					>
				</div>
				<div class="grid gap-6 md:grid-cols-2">
					<div
						class="group card cursor-pointer border border-base-200 bg-base-100 shadow-md transition-all duration-300 hover:shadow-xl"
					>
						<div class="card-body">
							<div class="mb-2 flex items-start justify-between">
								<span class="badge badge-outline badge-sm badge-secondary">Education</span>
								<span class="text-xs text-base-content/50">2 days ago</span>
							</div>
							<h3 class="card-title text-base-content transition-colors group-hover:text-primary">
								Latest Developments in Nuclear Science
							</h3>
							<p class="line-clamp-2 text-base-content/70">
								Exploring new research frontiers and what they mean for the future of energy
								production worldwide.
							</p>
						</div>
					</div>
					<div
						class="group card cursor-pointer border border-base-200 bg-base-100 shadow-md transition-all duration-300 hover:shadow-xl"
					>
						<div class="card-body">
							<div class="mb-2 flex items-start justify-between">
								<span class="badge badge-outline badge-sm badge-accent">Events</span>
								<span class="text-xs text-base-content/50">5 days ago</span>
							</div>
							<h3 class="card-title text-base-content transition-colors group-hover:text-primary">
								Upcoming International Forums
							</h3>
							<p class="line-clamp-2 text-base-content/70">
								Mark your calendar for these key events happening in Q3 and Q4 2024.
							</p>
						</div>
					</div>
				</div>
			</section>
		</article>
	</div>
</div>
