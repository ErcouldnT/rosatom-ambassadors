import type { PageServerLoad } from './$types';
import { getAmbassadorsWithAwards } from '$lib/server/data';

export const load: PageServerLoad = async () => {
	return {
		streamed: {
			ambassadors: getAmbassadorsWithAwards()
		}
	};
};
