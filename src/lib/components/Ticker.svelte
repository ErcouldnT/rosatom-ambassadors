<script lang="ts">
	import { Globe, Zap, Handshake, Atom, GraduationCap, BookOpen } from '@lucide/svelte';

	import { language } from '$lib/stores/language';
	import { translations } from '$lib/services/translations';

	$: t = translations[$language].ticker;

	$: items = [
		{ text: t.globalEducation, icon: Globe },
		{ text: t.sustainableEnergy, icon: Zap },
		{ text: t.internationalCoop, icon: Handshake },
		{ text: t.rosatom, icon: Atom },
		{ text: t.mephi, icon: GraduationCap },
		{ text: t.tomsk, icon: BookOpen }
	];
</script>

<div
	class="group relative flex overflow-x-hidden border-t border-base-content/5 bg-base-200 py-4 text-base-content"
>
	<div class="animate-marquee flex items-center gap-16 whitespace-nowrap">
		{#each items as item (item.text)}
			<div
				class="flex cursor-default items-center gap-3 text-lg font-medium opacity-80 transition-opacity hover:opacity-100"
			>
				<svelte:component this={item.icon} class="h-6 w-6 text-primary" />
				<span>{item.text}</span>
			</div>
		{/each}
		{#each items as item (item.text + 'dup1')}
			<div
				class="flex cursor-default items-center gap-3 text-lg font-medium opacity-80 transition-opacity hover:opacity-100"
			>
				<svelte:component this={item.icon} class="h-6 w-6 text-primary" />
				<span>{item.text}</span>
			</div>
		{/each}
		{#each items as item (item.text + 'dup2')}
			<div
				class="flex cursor-default items-center gap-3 text-lg font-medium opacity-80 transition-opacity hover:opacity-100"
			>
				<svelte:component this={item.icon} class="h-6 w-6 text-primary" />
				<span>{item.text}</span>
			</div>
		{/each}
	</div>

	<div
		class="animate-marquee2 absolute top-0 ml-16 flex h-full items-center gap-16 whitespace-nowrap"
	>
		{#each items as item (item.text + 'mq2')}
			<div
				class="flex cursor-default items-center gap-3 text-lg font-medium opacity-80 transition-opacity hover:opacity-100"
			>
				<svelte:component this={item.icon} class="h-6 w-6 text-primary" />
				<span>{item.text}</span>
			</div>
		{/each}
		{#each items as item (item.text + 'mq2-dup1')}
			<div
				class="flex cursor-default items-center gap-3 text-lg font-medium opacity-80 transition-opacity hover:opacity-100"
			>
				<svelte:component this={item.icon} class="h-6 w-6 text-primary" />
				<span>{item.text}</span>
			</div>
		{/each}
		{#each items as item (item.text + 'mq2-dup2')}
			<div
				class="flex cursor-default items-center gap-3 text-lg font-medium opacity-80 transition-opacity hover:opacity-100"
			>
				<svelte:component this={item.icon} class="h-6 w-6 text-primary" />
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
