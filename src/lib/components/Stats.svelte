<script lang="ts">
	import { Users, Globe, Calendar, GraduationCap } from '@lucide/svelte';
	import { language } from '$lib/services/language';
	import { translations } from '$lib/services/translations';

	interface Props {
		totalCountries?: number;
		totalAmbassadors?: number;
		totalEvents?: number;
		totalUniversities?: number;
	}

	let {
		totalCountries = 0,
		totalAmbassadors = 0,
		totalEvents = 0,
		totalUniversities = 0
	}: Props = $props();

	// Reactive translations
	let t = $derived(translations[$language].stats);
</script>

<section class="relative bg-base-100 py-16">
	<div class="container mx-auto px-6">
		<div class="grid grid-cols-2 gap-8 md:grid-cols-4">
			<!-- Ambassadors -->
			<div
				class="group flex flex-col items-center rounded-2xl p-6 text-center transition-colors duration-300 hover:bg-base-200"
			>
				<div
					class="mb-4 rounded-full bg-primary/10 p-4 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-content"
				>
					<Users class="h-8 w-8" />
				</div>
				<h3 class="mb-2 text-4xl font-bold text-base-content">{totalAmbassadors}+</h3>
				<p class="font-medium text-base-content/70">{t.members}</p>
			</div>

			<!-- Countries -->
			<div
				class="group flex flex-col items-center rounded-2xl p-6 text-center transition-colors duration-300 hover:bg-base-200"
			>
				<div
					class="mb-4 rounded-full bg-primary/10 p-4 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-content"
				>
					<Globe class="h-8 w-8" />
				</div>
				<h3 class="mb-2 text-4xl font-bold text-base-content">{totalCountries}+</h3>
				<p class="font-medium text-base-content/70">{t.countries}</p>
			</div>

			<!-- Events -->
			<div
				class="group flex flex-col items-center rounded-2xl p-6 text-center transition-colors duration-300 hover:bg-base-200"
			>
				<div
					class="mb-4 rounded-full bg-primary/10 p-4 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-content"
				>
					<Calendar class="h-8 w-8" />
				</div>
				<h3 class="mb-2 text-4xl font-bold text-base-content">{totalEvents}+</h3>
				<p class="font-medium text-base-content/70">{t.events}</p>
			</div>

			<!-- Universities -->
			<div
				class="group flex flex-col items-center rounded-2xl p-6 text-center transition-colors duration-300 hover:bg-base-200"
			>
				<div
					class="mb-4 rounded-full bg-primary/10 p-4 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-content"
				>
					<GraduationCap class="h-8 w-8" />
				</div>
				<h3 class="mb-2 text-4xl font-bold text-base-content">{totalUniversities}+</h3>
				<p class="font-medium text-base-content/70">{t.universities}</p>
			</div>
		</div>
	</div>
</section>
