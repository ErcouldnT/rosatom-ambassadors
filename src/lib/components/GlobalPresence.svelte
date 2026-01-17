<script lang="ts">
	import { language } from '$lib/services/language';
	import { translations } from '$lib/services/translations';
	import type { Country } from '$lib/types';
	import { Globe, Users, Award, MapPin } from '@lucide/svelte';

	let { countries = [] } = $props<{ countries: Country[] }>();

	let t = $derived(translations[$language].impact);

	let showAll = $state(false);
	let displayedCountries = $derived(showAll ? countries : countries.slice(0, 15));
</script>

<section id="ambassadors" class="relative overflow-hidden bg-base-100 py-24 lg:py-32">
	<!-- Background Image with proper dark/light mode handling -->
	<div class="absolute inset-0 z-0">
		<img
			src="/images/global_network_map.png"
			alt=""
			class="h-full w-full object-cover opacity-50 dark:opacity-40"
		/>
		<div
			class="absolute inset-0 bg-gradient-to-b from-base-100/50 via-base-100/20 to-base-100/50"
		></div>
		<div
			class="absolute inset-0 bg-gradient-to-r from-base-100/50 via-transparent to-base-100/50"
		></div>
	</div>

	<div class="relative z-10 container mx-auto px-4 lg:px-6">
		<!-- Header -->
		<div class="mx-auto mb-16 max-w-3xl text-center">
			<div
				class="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary"
			>
				<Globe size={16} />
				<span>Global Network</span>
			</div>
			<h2 class="mb-4 text-4xl font-extrabold tracking-tight text-base-content lg:text-5xl">
				{t.title}
			</h2>
			<p class="text-lg leading-relaxed text-base-content/70">
				{t.description}
			</p>
		</div>

		<!-- Stats Cards -->
		<div class="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
			<div
				class="group card border border-base-200 bg-base-100/80 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
			>
				<div class="card-body items-center py-8 text-center">
					<div
						class="rounded-full bg-primary/10 p-4 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-content"
					>
						<Globe size={28} />
					</div>
					<div class="mt-4 text-4xl font-black text-primary">{countries.length}+</div>
					<div class="text-sm font-medium text-base-content/60">Countries</div>
				</div>
			</div>

			<div
				class="group card border border-base-200 bg-base-100/80 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
			>
				<div class="card-body items-center py-8 text-center">
					<div
						class="rounded-full bg-secondary/10 p-4 text-secondary transition-colors group-hover:bg-secondary group-hover:text-secondary-content"
					>
						<Users size={28} />
					</div>
					<div class="mt-4 text-4xl font-black text-secondary">150+</div>
					<div class="text-sm font-medium text-base-content/60">Ambassadors</div>
				</div>
			</div>

			<div
				class="group card border border-base-200 bg-base-100/80 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
			>
				<div class="card-body items-center py-8 text-center">
					<div
						class="rounded-full bg-accent/10 p-4 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-content"
					>
						<Award size={28} />
					</div>
					<div class="mt-4 text-4xl font-black text-accent">50+</div>
					<div class="text-sm font-medium text-base-content/60">Universities</div>
				</div>
			</div>
		</div>

		<!-- Countries Grid -->
		<div
			class="card overflow-hidden border border-base-200 bg-base-100/90 shadow-2xl backdrop-blur-md"
		>
			<div class="card-body p-6 lg:p-10">
				<div class="mb-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
					<h3 class="flex items-center gap-2 text-xl font-bold text-base-content">
						<MapPin size={20} class="text-primary" />
						Member Nations
					</h3>
					<div class="badge badge-outline badge-lg badge-primary">
						{countries.length} Active Regions
					</div>
				</div>

				<div
					class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
				>
					{#each displayedCountries as country (country.id)}
						<div
							class="group bg-base-50 flex cursor-default flex-col items-center justify-center gap-2 rounded-xl border border-base-200 p-4 transition-all duration-300 hover:border-primary/40 hover:bg-primary/5 hover:shadow-md"
						>
							<span class="text-3xl transition-transform duration-300 group-hover:scale-110">
								{country.flag}
							</span>
							<span
								class="line-clamp-1 text-center text-xs font-medium text-base-content/70 group-hover:text-primary"
							>
								{$language === 'ru' ? country.name_ru : country.name_en}
							</span>
						</div>
					{/each}
				</div>

				{#if countries.length > 15}
					<div class="mt-6 text-center">
						<button
							class="btn text-primary btn-ghost btn-sm hover:bg-primary/10"
							onclick={() => (showAll = !showAll)}
						>
							{showAll ? '← Show Less' : `Show All (${countries.length})`}
						</button>
					</div>
				{/if}

				<!-- CTA -->
				<div class="mt-10 border-t border-base-200 pt-8 text-center">
					<p class="mb-6 text-base-content/60">
						Explore our global community of nuclear energy ambassadors
					</p>
					<a
						href="/map"
						class="btn gap-2 rounded-full px-8 shadow-lg transition-all btn-lg btn-primary hover:-translate-y-0.5 hover:shadow-xl"
					>
						<Globe size={20} />
						View Interactive Map
					</a>
				</div>
			</div>
		</div>
	</div>
</section>
