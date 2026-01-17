import type { PageServerLoad } from './$types';
import {
	getEvents,
	getNews,
	getStats,
	getCountries,
	getRandomAmbassadorsWithImages,
	getAmbassadorCount,
	getTickers
} from '$lib/server/data';

export const load: PageServerLoad = async () => {
	const [events, news, stats, countries, heroAmbassadors, totalAmbassadors, tickers] =
		await Promise.all([
			getEvents(),
			getNews(),
			getStats(),
			getCountries(true),
			getRandomAmbassadorsWithImages(4),
			getAmbassadorCount(),
			getTickers()
		]);

	return {
		events,
		news,
		stats,
		countries,
		heroAmbassadors,
		totalAmbassadors,
		totalCountries: countries.length,
		tickers
	};
};
