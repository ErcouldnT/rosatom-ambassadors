<script lang="ts">
	import Hero from '$lib/components/Hero.svelte';
	import Stats from '$lib/components/Stats.svelte';
	import About from '$lib/components/About.svelte';
	import GlobalPresence from '$lib/components/GlobalPresence.svelte';
	import Events from '$lib/components/Events.svelte';
	import NewsSlider from '$lib/components/NewsSlider.svelte';
	import Contact from '$lib/components/Contact.svelte';
	import CTA from '$lib/components/CTA.svelte';

	import SEO from '$lib/components/SEO.svelte';

	let { data } = $props();
</script>

<SEO
	jsonLd={{
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name: 'RNE Ambassadors',
		url: 'https://rosatom-ambassadors.vercel.app',
		logo: 'https://rosatom-ambassadors.vercel.app/favicon.png',
		description:
			'Rosatom Nuclear Education Ambassadors program connecting students and professionals globally.'
	}}
/>

<Hero
	stats={data.stats}
	ambassadors={data.heroAmbassadors}
	totalAmbassadors={data.totalAmbassadors}
	totalCountries={data.totalCountries}
	tickers={data.streamed.tickers}
/>
<Stats stats={data.stats} />
<About />
<GlobalPresence
	countries={data.countries}
	stats={data.stats}
	totalAmbassadors={data.totalAmbassadors}
	totalCountries={data.totalCountries}
/>
{#await data.streamed.events}
	<div class="flex justify-center bg-base-100 py-20">
		<span class="loading loading-lg loading-spinner text-primary"></span>
	</div>
{:then events}
	<Events {events} />
{:catch}
	<Events events={[]} />
{/await}

{#await data.streamed.news}
	<div class="flex justify-center bg-base-200 py-20">
		<span class="loading loading-lg loading-spinner text-primary"></span>
	</div>
{:then news}
	<NewsSlider {news} />
{:catch}
	<NewsSlider news={[]} />
{/await}
<CTA />
<Contact />
