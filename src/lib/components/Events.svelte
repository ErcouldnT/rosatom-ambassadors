<script>
	import { MapPin, ArrowRight } from '@lucide/svelte';
	import { language } from '$lib/stores/language';
	import { translations } from '$lib/services/translations';

	$: t = translations[$language].events;

	// Placeholder events data - usually this would come from an API or the translation file
	const events = [
		{
			day: '15',
			month: 'OCT',
			title: 'Nuclear Science Week',
			location: 'Moscow, Russia',
			time: '10:00 AM'
		},
		{
			day: '22',
			month: 'NOV',
			title: 'Global Energy Summit',
			location: 'Dubai, UAE',
			time: '09:00 AM'
		},
		{
			day: '05',
			month: 'DEC',
			title: 'Youth Ambassadors Meetup',
			location: 'Online',
			time: '14:00 PM'
		}
	];
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
			{#each events as event (event.title)}
				<div
					class="group card border border-base-200 bg-base-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
				>
					<div class="card-body p-6">
						<div class="mb-4 flex items-start justify-between">
							<div class="flex flex-col items-center rounded-xl bg-primary/10 p-3 text-primary">
								<span class="text-xl leading-none font-bold">{event.day}</span>
								<span class="text-xs font-bold uppercase">{event.month}</span>
							</div>
							<div class="badge badge-ghost">{event.time}</div>
						</div>

						<h3 class="mb-2 card-title text-xl">{event.title}</h3>

						<div class="mb-4 flex items-center gap-2 text-sm text-base-content/60">
							<MapPin class="h-4 w-4" />
							<span>{event.location}</span>
						</div>

						<div class="mt-auto card-actions justify-end">
							<button class="btn btn-ghost btn-sm group-hover:text-primary">
								Register
								<ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-1" />
							</button>
						</div>
					</div>
				</div>
			{/each}
		</div>

		<div class="mt-12 text-center">
			<button class="btn rounded-full btn-outline">View Full Calendar</button>
		</div>
	</div>
</section>
