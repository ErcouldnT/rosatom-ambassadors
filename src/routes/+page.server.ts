import type { PageServerLoad } from './$types';
import {
	getEvents,
	getNews,
	getStats,
	getCountries,
	getRandomAmbassadorsWithImages,
	getAmbassadorCount,
	getTickers,
	getLatestNewsInfo
} from '$lib/server/data';

export const load: PageServerLoad = async () => {
	// Await only absolute essentials for first paint
	const [stats, countriesData, heroAmbassadors, totalAmbassadors, latestNewsInfo] =
		await Promise.all([
			getStats(),
			getCountries(true),
			getRandomAmbassadorsWithImages(4),
			getAmbassadorCount(),
			getLatestNewsInfo()
		]);

	return {
		stats,
		countries: countriesData,
		heroAmbassadors,
		totalAmbassadors,
		totalCountries: countriesData.length,
		latestNewsSlug: latestNewsInfo?.slug ?? null,
		latestNewsTitle_en: latestNewsInfo?.title_en ?? null,
		latestNewsTitle_ru: latestNewsInfo?.title_ru ?? null,
		// Stream non-critical data
		streamed: {
			events: getEvents(),
			news: getNews(),
			tickers: getTickers()
		}
	};
};
