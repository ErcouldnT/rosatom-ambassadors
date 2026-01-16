<script lang="ts">
	import { ArrowLeft, MapPin, Briefcase, Mail, Globe } from '@lucide/svelte';
	import type { Ambassador } from '$lib/types';

	interface Props {
		data: { ambassador: Ambassador };
	}

	let { data }: Props = $props();
	let ambassador = $derived(data.ambassador);
</script>

<svelte:head>
	<title>{ambassador.name} | RNE Ambassadors</title>
</svelte:head>

<div class="min-h-screen bg-base-100 pt-20 pb-16">
	<div class="container mx-auto px-6">
		<!-- Back Button -->
		<a href="/ambassadors" class="btn mb-8 gap-2 text-base-content/70 btn-ghost hover:text-primary">
			<ArrowLeft class="h-4 w-4" />
			Back to Ambassadors
		</a>

		<!-- Profile Card -->
		<div class="card bg-base-200 shadow-xl lg:card-side">
			<!-- Profile Image -->
			<figure class="lg:w-1/3">
				<img
					src={ambassador.image}
					alt={ambassador.name}
					class="h-80 w-full object-cover lg:h-full"
					loading="lazy"
				/>
			</figure>

			<!-- Profile Content -->
			<div class="card-body lg:w-2/3">
				<div class="mb-4">
					<span class="badge badge-lg badge-primary">{ambassador.role}</span>
				</div>

				<h1 class="card-title text-4xl font-bold text-base-content">
					{ambassador.name}
				</h1>

				<div class="mt-4 flex flex-wrap gap-4 text-base-content/70">
					<div class="flex items-center gap-2">
						<MapPin class="h-5 w-5 text-primary" />
						<span>{ambassador.country}</span>
					</div>
					<div class="flex items-center gap-2">
						<Briefcase class="h-5 w-5 text-secondary" />
						<span>{ambassador.role}</span>
					</div>
				</div>

				<div class="divider"></div>

				<!-- Bio Section -->
				<div class="prose prose-lg max-w-none">
					<h3 class="text-base-content">About</h3>
					<p class="text-base-content/80">
						{ambassador.name} is a dedicated ambassador from {ambassador.country}, working as a {ambassador.role}.
						They are committed to promoting nuclear education and fostering international
						cooperation in the field of sustainable energy.
					</p>

					<h3 class="text-base-content">Contributions</h3>
					<ul class="text-base-content/80">
						<li>Active participant in international nuclear education forums</li>
						<li>Mentor for new students entering the nuclear science field</li>
						<li>Organizer of local awareness campaigns about clean energy</li>
					</ul>
				</div>

				<!-- Action Buttons -->
				<div class="mt-6 card-actions justify-start">
					<button class="btn gap-2 btn-primary">
						<Mail class="h-4 w-4" />
						Contact
					</button>
					<button class="btn gap-2 btn-outline">
						<Globe class="h-4 w-4" />
						View Profile
					</button>
				</div>
			</div>
		</div>
	</div>
</div>
