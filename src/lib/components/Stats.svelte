<script lang="ts">
	import { Users, Globe, Calendar, GraduationCap } from '@lucide/svelte';
	import type { Component } from 'svelte';
	import { language } from '$lib/services/language';
	import { translations } from '$lib/services/translations';
	import type { Stat } from '$lib/types';

	interface Props {
		stats: Stat[];
	}

	let { stats = [] }: Props = $props();

	// Reactive translations
	let t = $derived(translations[$language].stats);

	const icons: Record<string, Component> = {
		Users: Users,
		Globe: Globe,
		Calendar: Calendar,
		GraduationCap: GraduationCap
	};

	// Helper to get translated label based on stat key/icon
	function getLabel(stat: Stat): string {
		switch (stat.key) {
			case 'ambassadors':
				return t.members;
			case 'countries':
				return t.countries;
			case 'events':
				return t.events;
			case 'universities':
				return t.universities;
			default:
				return $language === 'en' ? stat.label_en : stat.label_ru;
		}
	}
</script>

<section class="relative bg-base-100 py-16">
	<div class="container mx-auto px-6">
		<div class="grid grid-cols-2 gap-8 md:grid-cols-4">
			{#each stats as stat (stat.id)}
				<div
					class="group flex flex-col items-center rounded-2xl p-6 text-center transition-colors duration-300 hover:bg-base-200"
				>
					<div
						class="mb-4 rounded-full bg-primary/10 p-4 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-content"
					>
						{#if icons[stat.icon]}
							{@const Icon = icons[stat.icon]}
							<Icon class="h-8 w-8" />
						{:else}
							<Globe class="h-8 w-8" />
						{/if}
					</div>
					<h3 class="mb-2 text-4xl font-bold text-base-content">{stat.value}</h3>
					<p class="font-medium text-base-content/70">{getLabel(stat)}</p>
				</div>
			{/each}
		</div>
	</div>
</section>
