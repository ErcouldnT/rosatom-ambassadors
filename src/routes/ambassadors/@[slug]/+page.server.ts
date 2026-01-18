import type { PageServerLoad } from './$types';
import { getAmbassadorBySlug } from '$lib/server/data';

export const load: PageServerLoad = async ({ params }) => {
	const { slug } = params;

	// Use streaming to allow showing a loading spinner on the client
	return {
		streamed: {
			ambassador: getAmbassadorBySlug(slug)
		}
	};
};
