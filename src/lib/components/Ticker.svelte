<script lang="ts">
	import { Globe, Zap, Handshake, Atom, GraduationCap, BookOpen, Radiation } from '@lucide/svelte';

	import { language } from '$lib/services/language';

	/** @type {{tickers?: import('$lib/types').Ticker[]}} */
	let { tickers = [] } = $props();

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const iconMap: any = {
		Globe,
		Zap,
		Handshake,
		Atom,
		GraduationCap,
		Radiation,
		BookOpen
	};

	let displayItems = $derived(
		tickers
			.filter((t) => t.isActive)
			.map((t) => ({
				text: $language === 'ru' ? t.text_ru : t.text_en,
				icon: t.icon && iconMap[t.icon] ? iconMap[t.icon] : Atom
			}))
	);
</script>

<div
	class="group relative flex overflow-x-hidden border-t border-base-content/5 bg-base-200 py-4 text-base-content"
>
	<div class="animate-marquee flex items-center gap-16 whitespace-nowrap">
		{#each displayItems as item (item.text)}
			{@const Icon = item.icon}
			<div
				class="flex cursor-default items-center gap-3 text-lg font-medium opacity-80 transition-opacity hover:opacity-100"
			>
				<Icon class="h-6 w-6 text-primary" />
				<span>{item.text}</span>
			</div>
		{/each}
		{#each displayItems as item (item.text + 'dup1')}
			{@const Icon = item.icon}
			<div
				class="flex cursor-default items-center gap-3 text-lg font-medium opacity-80 transition-opacity hover:opacity-100"
			>
				<Icon class="h-6 w-6 text-primary" />
				<span>{item.text}</span>
			</div>
		{/each}
		{#each displayItems as item (item.text + 'dup2')}
			{@const Icon = item.icon}
			<div
				class="flex cursor-default items-center gap-3 text-lg font-medium opacity-80 transition-opacity hover:opacity-100"
			>
				<Icon class="h-6 w-6 text-primary" />
				<span>{item.text}</span>
			</div>
		{/each}
	</div>

	<div
		class="animate-marquee2 absolute top-0 ml-16 flex h-full items-center gap-16 whitespace-nowrap"
	>
		{#each displayItems as item (item.text + 'mq2')}
			{@const Icon = item.icon}
			<div
				class="flex cursor-default items-center gap-3 text-lg font-medium opacity-80 transition-opacity hover:opacity-100"
			>
				<Icon class="h-6 w-6 text-primary" />
				<span>{item.text}</span>
			</div>
		{/each}
		{#each displayItems as item (item.text + 'mq2-dup1')}
			{@const Icon = item.icon}
			<div
				class="flex cursor-default items-center gap-3 text-lg font-medium opacity-80 transition-opacity hover:opacity-100"
			>
				<Icon class="h-6 w-6 text-primary" />
				<span>{item.text}</span>
			</div>
		{/each}
		{#each displayItems as item (item.text + 'mq2-dup2')}
			{@const Icon = item.icon}
			<div
				class="flex cursor-default items-center gap-3 text-lg font-medium opacity-80 transition-opacity hover:opacity-100"
			>
				<Icon class="h-6 w-6 text-primary" />
				<span>{item.text}</span>
			</div>
		{/each}
	</div>
</div>

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
