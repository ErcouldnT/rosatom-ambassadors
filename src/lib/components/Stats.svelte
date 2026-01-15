<script lang="ts">
	import { getStats, type Stat } from '$lib/services/mockApi';
	import { Users, Globe, Calendar, GraduationCap } from '@lucide/svelte';
	import type { Component } from 'svelte';
	import { language } from '$lib/stores/language';
	import { translations } from '$lib/services/translations';

	// Reactive translations
	$: t = translations[$language].stats;

	const stats: Stat[] = getStats();

	const icons: Record<string, Component> = {
		users: Users,
		globe: Globe,
		calendar: Calendar,
		'academic-cap': GraduationCap
	};

	// Helper to get translated label based on stat id/icon
	function getLabel(stat: Stat): string {
		switch (stat.icon) {
			case 'users':
				return t.members;
			case 'globe':
				return t.countries;
			case 'calendar':
				return t.events;
			case 'academic-cap':
				return t.universities;
			default:
				return stat.label;
		}
	}
</script>

<section class="relative bg-base-100 py-16">
	<div class="container mx-auto px-6">
		<div class="grid grid-cols-2 gap-8 md:grid-cols-4">
			{#each stats as stat (stat.label)}
				<div
					class="group flex flex-col items-center rounded-2xl p-6 text-center transition-colors duration-300 hover:bg-base-200"
				>
					<div
						class="mb-4 rounded-full bg-primary/10 p-4 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-content"
					>
						{#if icons[stat.icon]}
							{@const Icon = icons[stat.icon]}
							<Icon class="h-8 w-8" />
						{/if}
					</div>
					<h3 class="mb-2 text-4xl font-bold text-base-content">{stat.value}</h3>
					<p class="font-medium text-base-content/70">{getLabel(stat)}</p>
				</div>
			{/each}
		</div>
	</div>
</section>
