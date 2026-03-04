import type { PageServerLoad } from './$types';
import { getUniversities } from '$lib/server/data';

export const load: PageServerLoad = async () => {
	return {
		streamed: {
			universities: getUniversities()
		}
	};
};
