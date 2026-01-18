import type { PageServerLoad } from './$types';
import { getAmbassadors } from '$lib/server/data';

export const load: PageServerLoad = async () => {
	return {
		streamed: {
			ambassadors: getAmbassadors()
		}
	};
};
