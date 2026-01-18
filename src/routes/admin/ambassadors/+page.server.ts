import { getAmbassadors, getCountries } from '$lib/server/data';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		streamed: {
			ambassadors: getAmbassadors(false),
			countries: getCountries()
		}
	};
};
