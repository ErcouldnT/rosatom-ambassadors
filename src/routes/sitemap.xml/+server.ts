import { getAmbassadors, getEvents, getNews } from '$lib/server/data';

export async function GET({ url }) {
	const origin = url.origin;

	const [ambassadors, events, news] = await Promise.all([
		getAmbassadors(true),
		getEvents(),
		getNews()
	]);

	const routes = ['', '/ambassadors', '/events', '/news', '/map'];

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	${routes
		.map(
			(route) => `
	<url>
		<loc>${origin}${route}</loc>
		<changefreq>daily</changefreq>
		<priority>${route === '' ? '1.0' : '0.8'}</priority>
	</url>`
		)
		.join('')}
	${ambassadors
		.map(
			(a) => `
	<url>
		<loc>${origin}/ambassadors/@${a.slug}</loc>
		<changefreq>weekly</changefreq>
		<priority>0.7</priority>
	</url>`
		)
		.join('')}
	${events
		.map(
			(e) => `
	<url>
		<loc>${origin}/events/@${e.slug}</loc>
		<changefreq>weekly</changefreq>
		<priority>0.6</priority>
	</url>`
		)
		.join('')}
	${news
		.map(
			(n) => `
	<url>
		<loc>${origin}/news/@${n.slug}</loc>
		<changefreq>weekly</changefreq>
		<priority>0.6</priority>
	</url>`
		)
		.join('')}
</urlset>`.trim();

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=0, s-maxage=3600'
		}
	});
}
