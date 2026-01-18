<script lang="ts">
	import { page } from '$app/stores';
	import { language } from '$lib/services/language';

	interface Props {
		title?: string;
		description?: string;
		image?: string;
		type?: 'website' | 'article' | 'profile';
		ogTitle?: string;
		ogDescription?: string;
		canonical?: string;
	}

	let {
		title,
		description,
		image,
		type = 'website',
		ogTitle,
		ogDescription,
		canonical
	}: Props = $props();

	const siteName = 'RNE Ambassadors';
	const fullTitle = $derived(title ? `${title} | ${siteName}` : siteName);
	const siteUrl = $derived($page.url.origin);
	const currentUrl = $derived($page.url.href);

	// Default meta values
	const defaultDescription =
		$language === 'en'
			? 'Rosatom Nuclear Education Ambassadors program - Connecting students and professionals in the nuclear industry globally.'
			: 'Программа амбассадоров российского ядерного образования - объединение студентов и профессионалов атомной отрасли по всему миру.';

	const defaultImage = `${siteUrl}/images/global_network_map.png`;

	const finalDescription = $derived(description || defaultDescription);
	const finalImage = $derived(image || defaultImage);
	const finalOgTitle = $derived(ogTitle || fullTitle);
	const finalOgDescription = $derived(ogDescription || finalDescription);
	const finalCanonical = $derived(canonical || currentUrl);
</script>

<svelte:head>
	<!-- Standard Meta Tags -->
	<title>{fullTitle}</title>
	<meta name="description" content={finalDescription} />
	<link rel="canonical" href={finalCanonical} />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content={type} />
	<meta property="og:url" content={currentUrl} />
	<meta property="og:title" content={finalOgTitle} />
	<meta property="og:description" content={finalOgDescription} />
	<meta property="og:image" content={finalImage} />
	<meta property="og:site_name" content={siteName} />

	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content={currentUrl} />
	<meta property="twitter:title" content={finalOgTitle} />
	<meta property="twitter:description" content={finalOgDescription} />
	<meta property="twitter:image" content={finalImage} />

	<!-- Mobile / Theme -->
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta name="theme-color" content="#3b82f6" />
</svelte:head>
