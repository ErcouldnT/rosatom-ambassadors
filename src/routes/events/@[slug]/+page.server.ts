import type { PageServerLoad } from './$types';
import { getEventBySlug } from '$lib/server/data';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	return {
		streamed: {
			event: getEventBySlug(params.slug).then((event) => {
				if (!event) throw error(404, 'Event not found');
				return event;
			})
		}
	};
};
