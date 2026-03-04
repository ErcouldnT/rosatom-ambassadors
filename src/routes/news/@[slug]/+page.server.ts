import type { PageServerLoad } from './$types';
import { getNewsBySlug, getRelatedContent } from '$lib/server/data';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const newsItemPromise = getNewsBySlug(params.slug).then((newsItem) => {
		if (!newsItem) throw error(404, 'News article not found');
		return newsItem;
	});

	return {
		streamed: {
			newsItem: newsItemPromise,
			relatedContent: newsItemPromise.then((newsItem) => getRelatedContent(newsItem.id))
		}
	};
};
