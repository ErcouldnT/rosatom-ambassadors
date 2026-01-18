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
	// Await only absolute essentials for first paint
	const [stats, countriesData, heroAmbassadors, totalAmbassadors] = await Promise.all([
		getStats(),
		getCountries(true),
		getRandomAmbassadorsWithImages(4),
		getAmbassadorCount()
	]);

	return {
		stats,
		countries: countriesData,
		heroAmbassadors,
		totalAmbassadors,
		totalCountries: countriesData.length,
		// Stream non-critical data
		streamed: {
			events: getEvents(),
			news: getNews(),
			tickers: getTickers()
		}
	};
};
