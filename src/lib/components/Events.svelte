<script lang="ts">
	import { MapPin, ArrowRight } from '@lucide/svelte';
	import { language } from '$lib/services/language';
	import { translations } from '$lib/services/translations';
	import type { Event } from '$lib/types';

	interface Props {
		events: Event[];
	}

	let { events }: Props = $props();

	let t = $derived(translations[$language].events);
</script>

<section id="events" class="bg-base-100 py-20">
	<div class="container mx-auto px-6">
		<div class="mb-12 text-center">
			<h2 class="mb-4 text-4xl font-bold text-base-content">{t.title}</h2>
			<p class="mx-auto max-w-2xl text-lg text-base-content/70">
				{t.description}
			</p>
		</div>

		<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
			{#each events as event (event.id)}
				<div
					class="group card border border-base-200 bg-base-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
				>
					<div class="card-body p-6">
						<div class="mb-4 flex items-start justify-between">
							<div class="flex flex-col items-center rounded-xl bg-primary/10 p-3 text-primary">
								<span class="text-xl leading-none font-bold">{event.date_day}</span>
								<span class="text-xs font-bold uppercase">
									{$language === 'en' ? event.date_month_en : event.date_month_ru}
								</span>
							</div>
							<div class="badge badge-ghost">{event.time}</div>
						</div>

						<h3 class="mb-2 card-title text-xl">
							{$language === 'en' ? event.title_en : event.title_ru}
						</h3>

						<div class="mb-4 flex items-center gap-2 text-sm text-base-content/60">
							<MapPin class="h-4 w-4" />
							<span>{$language === 'en' ? event.location_en : event.location_ru}</span>
						</div>

						<div class="mt-auto card-actions justify-end">
							<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
							<a href="/events" class="btn btn-ghost btn-sm group-hover:text-primary">
								Register
								<ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-1" />
							</a>
						</div>
					</div>
				</div>
			{/each}
		</div>

		<div class="mt-12 text-center">
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
			<a href="/events" class="btn rounded-full btn-outline">View Full Calendar</a>
		</div>
	</div>
</section>
