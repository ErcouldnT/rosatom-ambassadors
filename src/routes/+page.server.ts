import type { PageServerLoad } from './$types';
import { getEvents, getNews, getStats, getCountries } from '$lib/server/data';

export const load: PageServerLoad = async () => {
	const [events, news, stats, countries] = await Promise.all([
		getEvents(),
		getNews(),
		getStats(),
		getCountries()
	]);

	return { events, news, stats, countries };
};
