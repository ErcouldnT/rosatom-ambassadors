<script>
	import { language } from '$lib/stores/language';
	import { translations } from '$lib/services/translations';

	$: t = translations[$language].cta;
</script>

<section class="relative overflow-hidden bg-neutral py-24 text-neutral-content">
	<!-- Background Accents -->
	<div
		class="absolute top-0 right-0 filter -mt-20 -mr-20 h-[500px] w-[500px] rounded-full bg-primary opacity-20 mix-blend-overlay blur-3xl"
	></div>
	<div
		class="absolute bottom-0 left-0 filter -mb-20 -ml-20 h-[500px] w-[500px] rounded-full bg-secondary opacity-20 mix-blend-overlay blur-3xl"
	></div>

	<div class="relative z-10 container mx-auto px-6 text-center">
		<h2 class="mb-6 text-4xl font-bold lg:text-5xl">{t.title}</h2>
		<p class="mx-auto mb-10 max-w-2xl text-xl text-neutral-content/80">
			{t.description}
		</p>
		<div class="flex flex-col items-center justify-center gap-4 sm:flex-row">
			<a
				href="#join"
				class="btn rounded-full border-none px-10 text-primary-content shadow-lg shadow-primary/30 transition-transform btn-lg btn-primary hover:scale-105"
				>{t.apply}</a
			>
			<a
				href="#contact"
				class="btn rounded-full border-neutral-content px-10 text-neutral-content transition-all btn-outline btn-lg hover:bg-neutral-content hover:text-neutral"
				>{t.contact}</a
			>
		</div>
	</div>
</section>
