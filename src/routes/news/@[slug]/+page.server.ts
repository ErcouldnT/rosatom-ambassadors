import type { PageServerLoad } from './$types';
import { getNewsBySlug } from '$lib/server/data';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	return {
		streamed: {
			newsItem: getNewsBySlug(params.slug).then((newsItem) => {
				if (!newsItem) throw error(404, 'News article not found');
				return newsItem;
			})
		}
	};
};
