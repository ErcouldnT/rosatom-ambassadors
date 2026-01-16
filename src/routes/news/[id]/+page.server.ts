import type { PageServerLoad } from './$types';
import { getNewsById } from '$lib/server/pocketbase';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const newsItem = await getNewsById(params.id);

	if (!newsItem) {
		throw error(404, 'News article not found');
	}

	return { newsItem };
};
