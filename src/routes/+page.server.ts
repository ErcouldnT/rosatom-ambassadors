import type { PageServerLoad } from './$types';
import {
	getEvents,
	getNews,
	getCountries,
	getRandomAmbassadorsWithImages,
	getAmbassadorCount,
	getTickers,
	getLatestNewsInfo,
	getUniversityCount,
	getEventCount
} from '$lib/server/data';

export const load: PageServerLoad = async () => {
	// Await only absolute essentials for first paint
	const [
		countriesData,
		heroAmbassadors,
		totalAmbassadors,
		totalUniversities,
		totalEvents,
		latestNewsInfo
	] = await Promise.all([
		getCountries(true),
		getRandomAmbassadorsWithImages(4),
		getAmbassadorCount(),
		getUniversityCount(),
		getEventCount(),
		getLatestNewsInfo()
	]);

	return {
		countries: countriesData,
		heroAmbassadors,
		totalAmbassadors,
		totalCountries: countriesData.length,
		totalUniversities,
		totalEvents,
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
