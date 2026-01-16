<script lang="ts">
	import { language } from '$lib/services/language';
	import { translations } from '$lib/services/translations';
	import type { Country } from '$lib/types';

	let { countries = [] } = $props<{ countries: Country[] }>();

	let t = $derived(translations[$language].impact);
</script>

<section id="ambassadors" class="relative overflow-hidden bg-base-100 py-20">
	<!-- Background Map/Globe placeholder (CSS radial gradient for now) -->
	<div
		class="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-primary/5"
	></div>

	<div class="relative z-10 container mx-auto px-6">
		<div class="mx-auto mb-16 max-w-2xl text-center">
			<h2 class="mb-4 text-4xl font-bold text-base-content">{t.title}</h2>
			<p class="text-lg text-base-content/70">
				{t.description}
			</p>
		</div>

		<div
			class="rounded-[2rem] border border-base-200 bg-base-100/70 p-8 shadow-xl backdrop-blur-xl lg:p-12"
		>
			<div class="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
				{#each countries as country (country.id)}
					<div
						class="flex cursor-default items-center gap-3 rounded-lg p-3 transition-all duration-300 hover:bg-base-200 hover:shadow-md"
					>
						<div class="h-2 w-2 rounded-full bg-primary"></div>
						<span class="font-medium text-base-content">{country.name} {country.flag}</span>
					</div>
				{/each}
			</div>

			<div class="mt-12 text-center">
				<a
					href="#map"
					class="hover:bg-base-CONTENT btn btn-wide rounded-full text-base-content btn-outline hover:text-base-100"
					>View Interactive Map</a
				>
			</div>
		</div>
	</div>
</section>
