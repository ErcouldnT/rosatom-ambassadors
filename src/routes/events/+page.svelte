<script>
	import { getEventsList } from '$lib/services/mockApi';
	import { ArrowRight, MapPin, Clock } from '@lucide/svelte';

	const events = getEventsList();
</script>

<div class="min-h-screen bg-base-100 pt-24 pb-20">
	<div class="container mx-auto px-6">
		<div class="mb-16 text-center">
			<h1 class="mb-4 text-3xl font-bold tracking-tight text-base-content md:text-4xl lg:text-5xl">
				Upcoming Events
			</h1>
		</div>

		<div class="mx-auto flex max-w-4xl flex-col gap-6">
			{#each events as event (event.id)}
				<div
					class="group relative overflow-hidden rounded-2xl border border-base-content/10 bg-base-200 p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 lg:p-8"
				>
					<div class="flex flex-col items-start gap-8 md:flex-row md:items-center">
						<!-- Date Badge -->
						<div
							class="flex h-20 w-16 flex-shrink-0 flex-col items-center justify-center rounded-xl border border-primary/20 bg-gradient-to-br from-primary/20 to-primary/5"
						>
							<span class="text-2xl font-bold text-primary">{event.date.day}</span>
							<span class="text-xs font-bold tracking-wider text-primary/80 uppercase"
								>{event.date.month}</span
							>
						</div>

						<!-- Content -->
						<div class="flex-grow">
							<h3
								class="mb-2 text-xl font-bold text-base-content transition-colors group-hover:text-primary lg:text-2xl"
							>
								{event.title}
							</h3>

							<div class="mb-3 flex flex-wrap gap-4 text-sm text-base-content/70">
								<div class="flex items-center gap-1.5">
									<Clock class="h-4 w-4 text-primary" />
									<span>{event.time}</span>
								</div>
								<div class="flex items-center gap-1.5">
									<MapPin class="h-4 w-4 text-primary" />
									<span>{event.location}</span>
								</div>
							</div>

							<p class="text-sm leading-relaxed text-base-content/70 lg:text-base">
								{event.description}
							</p>
						</div>

						<!-- Action -->
						<div class="mt-4 flex-shrink-0 md:mt-0">
							<button
								class="flex items-center gap-2 rounded-full border border-base-content/10 bg-base-300 px-6 py-2.5 font-medium text-base-content transition-all group-hover:border-primary group-hover:bg-primary group-hover:text-primary-content"
							>
								Register
								<ArrowRight class="h-4 w-4" />
							</button>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
