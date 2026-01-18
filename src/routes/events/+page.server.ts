import type { PageServerLoad } from './$types';
import { getEvents } from '$lib/server/data';

export const load: PageServerLoad = async () => {
	return {
		streamed: {
			events: getEvents()
		}
	};
};
