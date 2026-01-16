import type { PageServerLoad } from './$types';
import { getNews } from '$lib/server/data';

export const load: PageServerLoad = async () => {
	const news = await getNews();
	return { news };
};
