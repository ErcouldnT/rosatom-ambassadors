<script lang="ts">
	import { ArrowLeft, MapPin, Clock, Calendar, Users, Share2 } from '@lucide/svelte';
	import type { Event } from '$lib/types';
	import { language } from '$lib/stores/language';

	interface Props {
		data: { event: Event };
	}

	let { data }: Props = $props();
	let event = $derived(data.event);
</script>

<svelte:head>
	<title>{$language === 'en' ? event.title_en : event.title_ru} | RNE Ambassadors</title>
</svelte:head>

<div class="min-h-screen bg-base-100 pt-20 pb-16">
	<div class="container mx-auto px-6">
		<!-- Back Button -->
		<a href="/events" class="btn mb-8 gap-2 text-base-content/70 btn-ghost hover:text-primary">
			<ArrowLeft class="h-4 w-4" />
			Back to Events
		</a>

		<div class="grid gap-8 lg:grid-cols-3">
			<!-- Main Content -->
			<div class="lg:col-span-2">
				<!-- Event Header Card -->
				<div class="card bg-base-200 shadow-xl">
					<!-- Event Image -->
					<figure class="h-48 md:h-64">
						<img
							src={event.image}
							alt={$language === 'en' ? event.title_en : event.title_ru}
							class="h-full w-full object-cover"
							loading="lazy"
						/>
					</figure>

					<div class="card-body">
						<div class="mb-2 flex flex-wrap gap-2">
							<span class="badge badge-primary">Upcoming</span>
							<span class="badge badge-outline">Nuclear Education</span>
						</div>

						<h1 class="card-title text-3xl font-bold text-base-content">
							{$language === 'en' ? event.title_en : event.title_ru}
						</h1>

						<div class="mt-4 flex flex-wrap gap-6 text-base-content/70">
							<div class="flex items-center gap-2">
								<Calendar class="h-5 w-5 text-primary" />
								<span>
									{$language === 'en' ? event.date_month_en : event.date_month_ru}
									{event.date_day}, 2024
								</span>
							</div>
							<div class="flex items-center gap-2">
								<Clock class="h-5 w-5 text-secondary" />
								<span>{event.time}</span>
							</div>
							<div class="flex items-center gap-2">
								<MapPin class="h-5 w-5 text-accent" />
								<span>{$language === 'en' ? event.location_en : event.location_ru}</span>
							</div>
						</div>

						<div class="divider"></div>

						<!-- Event Description -->
						<div class="prose prose-lg max-w-none">
							<h3 class="text-base-content">About This Event</h3>
							<p class="text-base-content/80">
								{$language === 'en' ? event.description_en : event.description_ru}
							</p>

							<h3 class="text-base-content">What to Expect</h3>
							<ul class="text-base-content/80">
								<li>Keynote speeches from industry leaders</li>
								<li>Interactive workshops and panel discussions</li>
								<li>Networking opportunities with global ambassadors</li>
								<li>Exhibition of latest nuclear technology advancements</li>
							</ul>

							<h3 class="text-base-content">Who Should Attend</h3>
							<p class="text-base-content/80">
								This event is ideal for students, researchers, professionals, and anyone interested
								in the future of nuclear energy and sustainable development.
							</p>
						</div>

						<!-- Action Buttons -->
						<div class="mt-6 card-actions justify-start">
							<button class="btn gap-2 btn-primary">
								<Users class="h-4 w-4" />
								Register Now
							</button>
							<button class="btn gap-2 btn-outline">
								<Share2 class="h-4 w-4" />
								Share Event
							</button>
						</div>
					</div>
				</div>
			</div>

			<!-- Sidebar -->
			<div class="space-y-6">
				<!-- Event Details Card -->
				<div class="card bg-base-200 shadow-lg">
					<div class="card-body">
						<h3 class="card-title text-base-content">Event Details</h3>

						<div class="space-y-4">
							<div class="flex items-start gap-3">
								<Calendar class="mt-1 h-5 w-5 text-primary" />
								<div>
									<p class="font-semibold text-base-content">Date</p>
									<p class="text-base-content/70">
										{$language === 'en' ? event.date_month_en : event.date_month_ru}
										{event.date_day}, 2024
									</p>
								</div>
							</div>

							<div class="flex items-start gap-3">
								<Clock class="mt-1 h-5 w-5 text-secondary" />
								<div>
									<p class="font-semibold text-base-content">Time</p>
									<p class="text-base-content/70">{event.time}</p>
								</div>
							</div>

							<div class="flex items-start gap-3">
								<MapPin class="mt-1 h-5 w-5 text-accent" />
								<div>
									<p class="font-semibold text-base-content">Location</p>
									<p class="text-base-content/70">
										{$language === 'en' ? event.location_en : event.location_ru}
									</p>
								</div>
							</div>

							<div class="flex items-start gap-3">
								<Users class="mt-1 h-5 w-5 text-info" />
								<div>
									<p class="font-semibold text-base-content">Attendees</p>
									<p class="text-base-content/70">150+ Expected</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Organizer Card -->
				<div class="card bg-base-200 shadow-lg">
					<div class="card-body">
						<h3 class="card-title text-base-content">Organizer</h3>
						<div class="flex items-center gap-4">
							<div class="placeholder avatar">
								<div class="w-12 rounded-full bg-primary text-primary-content">
									<span>RNE</span>
								</div>
							</div>
							<div>
								<p class="font-semibold text-base-content">RNE Ambassadors</p>
								<p class="text-sm text-base-content/70">Official Organizer</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
