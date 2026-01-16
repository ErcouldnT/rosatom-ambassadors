import type { PageServerLoad } from './$types';
import { getEventById } from '$lib/server/pocketbase';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const event = await getEventById(params.id);

	if (!event) {
		throw error(404, 'Event not found');
	}

	return { event };
};
