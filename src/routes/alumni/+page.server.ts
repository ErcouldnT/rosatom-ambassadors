import type { PageServerLoad } from './$types';
import { getAlumni } from '$lib/server/data';

export const load: PageServerLoad = async () => {
	return {
		streamed: {
			alumni: getAlumni()
		}
	};
};
