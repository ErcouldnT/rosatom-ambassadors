<script lang="ts">
	import { ArrowLeft, MapPin, Clock, Calendar, Users, Share2 } from '@lucide/svelte';
	import type { Event } from '$lib/types';
	import { language } from '$lib/services/language';
	import { getImageUrl } from '$lib/utils';

	interface Props {
		data: {
			streamed: {
				event: Promise<Event>;
			};
		};
	}

	import SEO from '$lib/components/SEO.svelte';

	let { data }: Props = $props();
</script>

{#await data.streamed.event then event}
	<SEO
		title={$language === 'en' ? event.title_en : event.title_ru}
		description={$language === 'en' ? event.description_en : event.description_ru}
		image={getImageUrl('events', event.id, event.image)}
		type="article"
	/>
{/await}

{#await data.streamed.event}
	<div class="flex min-h-screen items-center justify-center bg-base-100">
		<span class="loading loading-lg loading-spinner text-primary"></span>
	</div>
{:then event}
	<div class="min-h-screen bg-base-100 pt-20 pb-16">
		<div class="container mx-auto px-6">
			<!-- Back Button -->
			<a
				href="/events"
				class="btn mb-8 gap-2 pl-0 text-base-content/70 btn-ghost hover:text-primary"
			>
				<ArrowLeft class="h-4 w-4" />
				Back to Events
			</a>

			<div class="grid gap-8 lg:grid-cols-3">
				<!-- Main Content -->
				<div class="lg:col-span-2">
					<!-- Event Header Card -->
					<div class="card overflow-hidden border border-base-200 bg-base-100 shadow-xl">
						<!-- Event Image -->
						<figure class="relative h-64 md:h-80">
							<img
								src={getImageUrl('events', event.id, event.image)}
								alt={$language === 'en' ? event.title_en : event.title_ru}
								class="h-full w-full object-cover"
								loading="lazy"
								onerror={(e) =>
									((e.currentTarget as HTMLImageElement).src = '/images/placeholders/event.png')}
							/>
							<div class="absolute inset-0 bg-gradient-to-t from-base-100/90 to-transparent"></div>
							<div class="absolute right-6 bottom-6 left-6">
								<div class="mb-3 flex flex-wrap gap-2">
									<span class="badge border-none shadow-sm badge-primary">Upcoming</span>
									<span
										class="badge border-none bg-base-100/30 text-base-content backdrop-blur-sm badge-neutral"
										>Nuclear Education</span
									>
								</div>
								<h1
									class="card-title text-3xl font-bold text-base-content drop-shadow-sm md:text-4xl"
								>
									{$language === 'en' ? event.title_en : event.title_ru}
								</h1>
							</div>
						</figure>

						<div class="card-body">
							<div class="mb-6 flex flex-wrap gap-6 text-base-content/70">
								<div class="flex items-center gap-2">
									<Calendar class="h-5 w-5 text-primary" />
									<span class="font-medium">
										{$language === 'en' ? event.date_month_en : event.date_month_ru}
										{event.date_day}, 2024
									</span>
								</div>
								<div class="flex items-center gap-2">
									<Clock class="h-5 w-5 text-secondary" />
									<span class="font-medium">{event.time}</span>
								</div>
								<div class="flex items-center gap-2">
									<MapPin class="h-5 w-5 text-accent" />
									<span class="font-medium"
										>{$language === 'en' ? event.location_en : event.location_ru}</span
									>
								</div>
							</div>

							<div class="divider my-2"></div>

							<!-- Event Description -->
							<div class="prose prose-lg max-w-none pt-4">
								<h3 class="mb-4 text-xl font-bold text-base-content">About This Event</h3>
								<p class="leading-relaxed text-base-content/80">
									{$language === 'en' ? event.description_en : event.description_ru}
								</p>

								<h3 class="mt-8 mb-4 text-xl font-bold text-base-content">What to Expect</h3>
								<ul class="space-y-2 text-base-content/80">
									<li>Keynote speeches from industry leaders</li>
									<li>Interactive workshops and panel discussions</li>
									<li>Networking opportunities with global ambassadors</li>
									<li>Exhibition of latest nuclear technology advancements</li>
								</ul>

								<h3 class="mt-8 mb-4 text-xl font-bold text-base-content">Who Should Attend</h3>
								<p class="leading-relaxed text-base-content/80">
									This event is ideal for students, researchers, professionals, and anyone
									interested in the future of nuclear energy and sustainable development.
								</p>
							</div>

							<!-- Action Buttons -->
							<div class="mt-8 card-actions justify-start">
								<button class="btn gap-2 shadow-md transition-all btn-primary hover:shadow-lg">
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
					<div class="card border border-base-200 bg-base-100 shadow-lg">
						<div class="card-body">
							<h3 class="mb-4 card-title text-base-content">Event Details</h3>

							<div class="space-y-6">
								<div class="flex items-start gap-4">
									<div class="rounded-xl bg-primary/10 p-3 text-primary">
										<Calendar class="h-6 w-6" />
									</div>
									<div>
										<p
											class="text-sm font-semibold tracking-wide text-base-content uppercase opacity-70"
										>
											Date
										</p>
										<p class="font-medium text-base-content">
											{$language === 'en' ? event.date_month_en : event.date_month_ru}
											{event.date_day}, 2024
										</p>
									</div>
								</div>

								<div class="flex items-start gap-4">
									<div class="rounded-xl bg-secondary/10 p-3 text-secondary">
										<Clock class="h-6 w-6" />
									</div>
									<div>
										<p
											class="text-sm font-semibold tracking-wide text-base-content uppercase opacity-70"
										>
											Time
										</p>
										<p class="font-medium text-base-content">{event.time}</p>
									</div>
								</div>

								<div class="flex items-start gap-4">
									<div class="rounded-xl bg-accent/10 p-3 text-accent">
										<MapPin class="h-6 w-6" />
									</div>
									<div>
										<p
											class="text-sm font-semibold tracking-wide text-base-content uppercase opacity-70"
										>
											Location
										</p>
										<p class="font-medium text-base-content">
											{$language === 'en' ? event.location_en : event.location_ru}
										</p>
									</div>
								</div>

								<div class="flex items-start gap-4">
									<div class="rounded-xl bg-info/10 p-3 text-info">
										<Users class="h-6 w-6" />
									</div>
									<div>
										<p
											class="text-sm font-semibold tracking-wide text-base-content uppercase opacity-70"
										>
											Attendees
										</p>
										<p class="font-medium text-base-content">150+ Expected</p>
									</div>
								</div>
							</div>
						</div>
					</div>

					<!-- Organizer Card -->
					<div class="card border border-base-200 bg-base-100 shadow-lg">
						<div class="card-body">
							<h3 class="mb-4 card-title text-base-content">Organizer</h3>
							<div class="flex items-center gap-4">
								<div class="placeholder avatar">
									<div
										class="w-14 rounded-full bg-primary text-primary-content ring ring-primary ring-offset-2 ring-offset-base-100"
									>
										<span class="text-xl font-bold">RNE</span>
									</div>
								</div>
								<div>
									<p class="text-lg font-bold text-base-content">RNE Ambassadors</p>
									<p class="text-sm text-base-content/70">Official Organizer</p>
								</div>
							</div>
							<div class="mt-4">
								<button class="btn w-full btn-ghost btn-sm">View Profile</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{:catch error}
	<div class="flex min-h-screen items-center justify-center bg-base-100">
		<div class="alert max-w-md alert-error shadow-lg">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6 shrink-0 stroke-current"
				fill="none"
				viewBox="0 0 24 24"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
				/></svg
			>
			<span>Error loading event: {error.message}</span>
		</div>
	</div>
{/await}
