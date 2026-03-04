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
		name: 'RNEA',
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
	latestNewsSlug={data.latestNewsSlug}
	latestNewsTitle_en={data.latestNewsTitle_en}
	latestNewsTitle_ru={data.latestNewsTitle_ru}
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
	{@const today = new Date().toISOString().split('T')[0]}
	{@const upcomingEvents = events.filter((e) => e.event_date && e.event_date >= today)}
	<Events events={upcomingEvents} />
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
