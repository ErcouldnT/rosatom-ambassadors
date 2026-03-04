<script lang="ts">
	import { ArrowRight, MapPin, Clock, CalendarCheck, History } from '@lucide/svelte';
	import { language } from '$lib/services/language';
	import { translations } from '$lib/services/translations';
	import { getImageUrl } from '$lib/utils';
	import type { Event } from '$lib/types';
	import SEO from '$lib/components/SEO.svelte';

	let { data } = $props();
	let activeTab = $state<'upcoming' | 'past'>('upcoming');
	let t = $derived(translations[$language]);

	function splitEvents(events: Event[]) {
		const today = new Date().toISOString().split('T')[0];
		const upcoming: Event[] = [];
		const past: Event[] = [];

		for (const event of events) {
			if (event.event_date && event.event_date >= today) {
				upcoming.push(event);
			} else {
				past.push(event);
			}
		}

		// Sort upcoming by date ascending, past by date descending
		upcoming.sort((a, b) => (a.event_date || '').localeCompare(b.event_date || ''));
		past.sort((a, b) => (b.event_date || '').localeCompare(a.event_date || ''));

		return { upcoming, past };
	}
</script>

<SEO
	title={t.events.title}
	description="Join our upcoming nuclear education events and global ambassador meetups."
/>

<div class="min-h-screen bg-base-100 pt-24 pb-20">
	<div class="container mx-auto px-6">
		<div class="mb-12 text-center">
			<h1 class="mb-4 text-3xl font-bold tracking-tight text-base-content md:text-4xl lg:text-5xl">
				{t.events.title}
			</h1>
		</div>

		<!-- Tab Switcher -->
		<div class="mb-8 flex justify-center">
			<div role="tablist" class="tabs-boxed tabs bg-base-200 p-1">
				<button
					role="tab"
					class="tab gap-2 transition-all {activeTab === 'upcoming' ? 'tab-active font-bold' : ''}"
					onclick={() => (activeTab = 'upcoming')}
				>
					<CalendarCheck size={16} />
					{t.eventsPage.upcoming}
				</button>
				<button
					role="tab"
					class="tab gap-2 transition-all {activeTab === 'past' ? 'tab-active font-bold' : ''}"
					onclick={() => (activeTab = 'past')}
				>
					<History size={16} />
					{t.eventsPage.past}
				</button>
			</div>
		</div>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#await data.streamed.events}
				<div class="col-span-full flex justify-center py-20">
					<span class="loading loading-lg loading-spinner text-primary"></span>
				</div>
			{:then events}
				{@const split = splitEvents(events)}
				{@const displayEvents = activeTab === 'upcoming' ? split.upcoming : split.past}

				{#if displayEvents.length > 0}
					{#each displayEvents as event (event.id)}
						<a
							href="/events/@{event.slug}"
							class="group card overflow-hidden bg-base-200 shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 {activeTab ===
							'past'
								? 'opacity-80 hover:opacity-100'
								: ''}"
						>
							<!-- Event Image -->
							<figure class="h-40 md:h-48">
								<img
									src={getImageUrl('events', event.id, event.image)}
									alt={$language === 'en' ? event.title_en : event.title_ru}
									class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
									onerror={(e) =>
										((e.currentTarget as HTMLImageElement).src = '/images/placeholders/event.png')}
								/>
							</figure>

							<div class="card-body p-4 md:p-6">
								<!-- Date Badge -->
								<div class="mb-2 flex items-center gap-3">
									<div
										class="flex h-12 w-12 flex-col items-center justify-center rounded-lg {activeTab ===
										'upcoming'
											? 'bg-primary/10'
											: 'bg-base-300'}"
									>
										<span
											class="text-lg leading-none font-bold {activeTab === 'upcoming'
												? 'text-primary'
												: 'text-base-content/60'}">{event.date_day}</span
										>
										<span
											class="text-[10px] font-bold uppercase {activeTab === 'upcoming'
												? 'text-primary/80'
												: 'text-base-content/40'}"
										>
											{$language === 'en' ? event.date_month_en : event.date_month_ru}
										</span>
									</div>
									<div class="flex flex-col gap-1 text-xs text-base-content/60">
										<div class="flex items-center gap-1">
											<Clock class="h-3 w-3" />
											<span>{event.time}</span>
										</div>
										<div class="flex items-center gap-1">
											<MapPin class="h-3 w-3" />
											<span>{$language === 'en' ? event.location_en : event.location_ru}</span>
										</div>
									</div>
								</div>

								<!-- Title -->
								<h3
									class="card-title line-clamp-2 text-base font-bold text-base-content transition-colors group-hover:text-primary md:text-lg"
								>
									{$language === 'en' ? event.title_en : event.title_ru}
								</h3>

								<!-- Description -->
								<p class="line-clamp-2 text-sm text-base-content/70">
									{$language === 'en' ? event.description_en : event.description_ru}
								</p>

								<!-- Action -->
								<div class="mt-auto card-actions pt-3">
									<span
										class="flex items-center gap-1 text-sm font-medium text-primary transition-transform group-hover:translate-x-1"
									>
										{t.eventsPage.viewDetails}
										<ArrowRight class="h-4 w-4" />
									</span>
								</div>
							</div>
						</a>
					{/each}
				{:else}
					<div class="col-span-full py-12 text-center text-base-content/50">
						<p class="text-lg">
							{activeTab === 'upcoming' ? t.eventsPage.noUpcoming : t.eventsPage.noPast}
						</p>
					</div>
				{/if}
			{:catch error}
				<div class="col-span-full py-12 text-center text-error">
					<p>Error loading events: {error.message}</p>
				</div>
			{/await}
		</div>
	</div>
</div>
