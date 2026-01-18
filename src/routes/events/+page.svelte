<script lang="ts">
	import { ArrowRight, MapPin, Clock } from '@lucide/svelte';
	import { language } from '$lib/services/language';
	import { getImageUrl } from '$lib/utils';

	let { data } = $props();
</script>

<svelte:head>
	<title>Events | RNE Ambassadors</title>
</svelte:head>

<div class="min-h-screen bg-base-100 pt-24 pb-20">
	<div class="container mx-auto px-6">
		<div class="mb-12 text-center">
			<h1 class="mb-4 text-3xl font-bold tracking-tight text-base-content md:text-4xl lg:text-5xl">
				Upcoming Events
			</h1>
		</div>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#await data.streamed.events}
				<div class="col-span-full flex justify-center py-20">
					<span class="loading loading-lg loading-spinner text-primary"></span>
				</div>
			{:then events}
				{#each events as event (event.id)}
					<a
						href="/events/@{event.slug}"
						class="group card overflow-hidden bg-base-200 shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-primary/10"
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
									class="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-primary/10"
								>
									<span class="text-lg leading-none font-bold text-primary">{event.date_day}</span>
									<span class="text-[10px] font-bold text-primary/80 uppercase">
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
									View Details
									<ArrowRight class="h-4 w-4" />
								</span>
							</div>
						</div>
					</a>
				{:else}
					<div class="col-span-full py-12 text-center text-base-content/50">
						<p class="text-lg">No events found.</p>
					</div>
				{/each}
			{:catch error}
				<div class="col-span-full py-12 text-center text-error">
					<p>Error loading events: {error.message}</p>
				</div>
			{/await}
		</div>
	</div>
</div>
