<script>
	import Hero from '$lib/components/Hero.svelte';
	import Stats from '$lib/components/Stats.svelte';
	import About from '$lib/components/About.svelte';
	import GlobalPresence from '$lib/components/GlobalPresence.svelte';
	import Events from '$lib/components/Events.svelte';
	import NewsSlider from '$lib/components/NewsSlider.svelte';
	import Contact from '$lib/components/Contact.svelte';
	import CTA from '$lib/components/CTA.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>RNE Ambassadors - Russian Nuclear Education</title>
</svelte:head>

<Hero />
<Stats stats={data.stats} />
<About />
<GlobalPresence countries={data.countries} />
<Events events={data.events} />
<NewsSlider news={data.news} />
<CTA />
<Contact />
