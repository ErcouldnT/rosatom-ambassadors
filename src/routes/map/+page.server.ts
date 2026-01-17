import type { PageServerLoad } from './$types';
import { getAmbassadors, getCountries } from '$lib/server/data';

export const load: PageServerLoad = async () => {
	const [ambassadors, countries] = await Promise.all([getAmbassadors(true), getCountries()]);

	// Enrich ambassadors with country coordinates
	const ambassadorsWithCoords = ambassadors.map((amb) => {
		// Try to find country by matching country_en name
		const country = countries.find(
			(c) =>
				c.name_en.toLowerCase() === amb.country_en?.toLowerCase() || c.name_ru === amb.country_ru
		);

		return {
			...amb,
			latitude: country?.latitude || null,
			longitude: country?.longitude || null,
			countryFlag: country?.flag || null
		};
	});

	return {
		ambassadors: ambassadorsWithCoords,
		countries
	};
};
