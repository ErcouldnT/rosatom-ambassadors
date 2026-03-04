<script lang="ts">
	import {
		Globe,
		Handshake,
		Atom,
		GraduationCap,
		Calendar,
		Megaphone,
		FlaskConical,
		Newspaper
	} from '@lucide/svelte';

	import { language } from '$lib/services/language';
	import type { NewsItem } from '$lib/types';

	let { news = [] }: { news?: NewsItem[] } = $props();

	function getIconForCategory(category: string) {
		const lowerCategory = category.toLowerCase();
		if (lowerCategory.includes('education') || lowerCategory.includes('образование'))
			return GraduationCap;
		if (lowerCategory.includes('technology') || lowerCategory.includes('технологии')) return Atom;
		if (lowerCategory.includes('community') || lowerCategory.includes('сообщество'))
			return Handshake;
		if (lowerCategory.includes('events') || lowerCategory.includes('события')) return Calendar;
		if (lowerCategory.includes('announcements') || lowerCategory.includes('анонсы'))
			return Megaphone;
		if (lowerCategory.includes('research') || lowerCategory.includes('исследования'))
			return FlaskConical;
		if (lowerCategory.includes('global') || lowerCategory.includes('глобальные')) return Globe;
		return Newspaper;
	}

	let displayItems = $derived(
		news.map((n) => ({
			id: n.id,
			text: $language === 'ru' ? n.title_ru : n.title_en,
			icon: getIconForCategory(n.category_en),
			slug: n.slug
		}))
	);
</script>

{#if displayItems.length > 0}
	<div
		class="group relative flex overflow-x-hidden border-t border-base-content/5 bg-base-200 py-4 text-base-content"
	>
		<div class="animate-marquee flex items-center gap-16 whitespace-nowrap">
			{#each displayItems as item (item.id)}
				{@const Icon = item.icon}
				<a
					href={item.slug ? `/news/@${item.slug}` : '/news'}
					class="flex cursor-pointer items-center gap-3 text-lg font-medium opacity-80 transition-opacity hover:opacity-100"
				>
					<Icon class="h-6 w-6 text-primary" />
					<span>{item.text}</span>
				</a>
			{/each}
			{#each displayItems as item (item.id + 'dup1')}
				{@const Icon = item.icon}
				<a
					href={item.slug ? `/news/@${item.slug}` : '/news'}
					class="flex cursor-pointer items-center gap-3 text-lg font-medium opacity-80 transition-opacity hover:opacity-100"
				>
					<Icon class="h-6 w-6 text-primary" />
					<span>{item.text}</span>
				</a>
			{/each}
			{#each displayItems as item (item.id + 'dup2')}
				{@const Icon = item.icon}
				<a
					href={item.slug ? `/news/@${item.slug}` : '/news'}
					class="flex cursor-pointer items-center gap-3 text-lg font-medium opacity-80 transition-opacity hover:opacity-100"
				>
					<Icon class="h-6 w-6 text-primary" />
					<span>{item.text}</span>
				</a>
			{/each}
		</div>

		<div
			class="animate-marquee2 absolute top-0 ml-16 flex h-full items-center gap-16 whitespace-nowrap"
		>
			{#each displayItems as item (item.id + 'mq2')}
				{@const Icon = item.icon}
				<a
					href={item.slug ? `/news/@${item.slug}` : '/news'}
					class="flex cursor-pointer items-center gap-3 text-lg font-medium opacity-80 transition-opacity hover:opacity-100"
				>
					<Icon class="h-6 w-6 text-primary" />
					<span>{item.text}</span>
				</a>
			{/each}
			{#each displayItems as item (item.id + 'mq2-dup1')}
				{@const Icon = item.icon}
				<a
					href={item.slug ? `/news/@${item.slug}` : '/news'}
					class="flex cursor-pointer items-center gap-3 text-lg font-medium opacity-80 transition-opacity hover:opacity-100"
				>
					<Icon class="h-6 w-6 text-primary" />
					<span>{item.text}</span>
				</a>
			{/each}
			{#each displayItems as item (item.id + 'mq2-dup2')}
				{@const Icon = item.icon}
				<a
					href={item.slug ? `/news/@${item.slug}` : '/news'}
					class="flex cursor-pointer items-center gap-3 text-lg font-medium opacity-80 transition-opacity hover:opacity-100"
				>
					<Icon class="h-6 w-6 text-primary" />
					<span>{item.text}</span>
				</a>
			{/each}
		</div>
	</div>
{/if}

<style>
	.animate-marquee {
		animation: marquee 60s linear infinite;
	}
	.animate-marquee2 {
		animation: marquee2 60s linear infinite;
	}

	@keyframes marquee {
		0% {
			transform: translateX(0%);
		}
		100% {
			transform: translateX(-100%);
		}
	}
	@keyframes marquee2 {
		0% {
			transform: translateX(100%);
		}
		100% {
			transform: translateX(0%);
		}
	}

	.group:hover .animate-marquee,
	.group:hover .animate-marquee2 {
		animation-play-state: paused;
	}
</style>
