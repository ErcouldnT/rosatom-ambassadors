import type { PageServerLoad } from './$types';
import { getNews } from '$lib/server/pocketbase';

export const load: PageServerLoad = async () => {
	const news = await getNews();
	return { news };
};
