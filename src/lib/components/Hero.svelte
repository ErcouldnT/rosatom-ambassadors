<script>
	import Ticker from './Ticker.svelte';
	import { language } from '$lib/services/language';
	import { translations } from '$lib/services/translations';

	/** @type {{
		stats: import('$lib/types').Stat[], 
		ambassadors?: import('$lib/types').Ambassador[],
		totalAmbassadors?: number,
		totalCountries?: number,
		tickers?: import('$lib/types').Ticker[]
	}} */
	let {
		stats = [],
		ambassadors = [],
		totalAmbassadors = 0,
		totalCountries = 0,
		tickers = []
	} = $props();

	// Placeholder for hero image. Using a high-quality academic/global themed image.
	const heroImage =
		'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop';

	let t = $derived(translations[$language].hero);

	let countriesStat = $derived(
		totalCountries > 0
			? `${totalCountries}+`
			: stats.find((s) => s.key === 'countries')?.value || '50+'
	);
	let ambassadorsStat = $derived(
		totalAmbassadors > 0
			? `${totalAmbassadors}+`
			: stats.find((s) => s.key === 'members')?.value || '150+'
	);

	let displayAmbassadors = $derived(ambassadors.length > 0 ? ambassadors : []);
</script>

<section
	class="relative flex min-h-screen flex-col justify-center overflow-hidden bg-base-100 pt-16 pb-16"
>
	<!-- Background decoration -->
	<div
		class="absolute top-0 right-0 -mt-20 -mr-20 h-96 w-96 rounded-full bg-primary opacity-10 blur-3xl"
	></div>
	<div
		class="absolute bottom-0 left-0 -mb-20 -ml-20 h-80 w-80 rounded-full bg-secondary opacity-10 blur-3xl"
	></div>

	<!-- Grid Pattern Overlay -->
	<div
		class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"
	></div>

	<div class="relative z-10 container mx-auto px-6 py-10">
		<div class="flex flex-col items-center gap-12 lg:flex-row">
			<!-- Text Content -->
			<div class="text-center lg:w-1/2 lg:text-left">
				<div
					class="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-semibold text-primary shadow-sm"
				>
					<span class="badge badge-xs badge-primary">{t.new}</span>
					{t.initiative}
				</div>

				<h1
					class="mb-6 text-5xl leading-tight font-extrabold tracking-tight text-base-content lg:text-7xl"
				>
					{t.titleLine1} <br />
					<span
						class="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent"
					>
						{t.titleLine2}
					</span>
				</h1>

				<p class="mx-auto mb-8 max-w-2xl text-lg text-base-content/70 lg:mx-0 lg:text-xl">
					{t.description}
				</p>

				<div class="flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
					<a
						href="#about"
						class="btn h-auto rounded-full px-8 py-3 text-lg transition-all duration-300 btn-primary hover:-translate-y-1 hover:shadow-xl"
					>
						{t.learnMore}
					</a>
					<a
						href="#ambassadors"
						class="btn h-auto rounded-full px-8 py-3 text-lg text-base-content backdrop-blur-sm transition-all duration-300 btn-outline hover:bg-base-200"
					>
						{t.ourAmbassadors}
					</a>
				</div>

				<div
					class="mt-10 flex items-center justify-center gap-4 text-sm text-base-content/60 lg:justify-start"
				>
					<div class="flex -space-x-3">
						{#each displayAmbassadors as ambassador (ambassador.id)}
							<div
								class="h-10 w-10 overflow-hidden rounded-full border-2 border-base-100 bg-base-300"
							>
								<img
									src={`/api/images/ambassadors/${ambassador.id}`}
									alt={$language === 'ru' ? ambassador.name_ru : ambassador.name_en}
									class="h-full w-full object-cover"
								/>
							</div>
						{/each}
						<div
							class="flex h-10 w-10 items-center justify-center rounded-full border-2 border-base-100 bg-base-200 text-xs font-bold text-base-content"
						>
							{ambassadorsStat}
						</div>
					</div>
					<p>{t.ambassadorsCount.replace('{n}', countriesStat)}</p>
				</div>
			</div>

			<!-- Image/Visual Content -->
			<div class="relative lg:w-1/2">
				<!-- Floating Card -->
				<div
					class="animate-bounce-slow absolute -bottom-10 -left-10 z-20 hidden max-w-xs rounded-2xl border border-base-200 bg-base-100/60 p-4 shadow-xl backdrop-blur-md md:block"
				>
					<div class="flex items-center gap-4">
						<div class="rounded-full bg-primary/10 p-3 text-primary">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								><path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/></svg
							>
						</div>
						<div>
							<p class="text-lg font-bold text-base-content">{countriesStat} {t.countries}</p>
							<p class="text-xs text-base-content/60">{t.cardTag}</p>
						</div>
					</div>
				</div>

				<div
					class="relative skew-y-3 transform overflow-hidden rounded-3xl shadow-2xl transition-transform duration-700 ease-out hover:skew-y-0"
				>
					<img src={heroImage} alt="Students" class="h-auto w-full object-cover" />
					<div
						class="absolute inset-0 flex items-end bg-gradient-to-t from-black/50 to-transparent p-8"
					>
						<p class="font-medium text-white">{t.imageTag}</p>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Ticker at Bottom -->
	<div class="absolute bottom-0 z-20 w-full">
		<Ticker {tickers} />
	</div>
</section>

<style>
	.animate-bounce-slow {
		animation: bounce 3s infinite;
	}
	@keyframes bounce {
		0%,
		100% {
			transform: translateY(-5%);
			animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
		}
		50% {
			transform: translateY(0);
			animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
		}
	}
</style>
