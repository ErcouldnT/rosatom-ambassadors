import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getNews } from '$lib/server/pocketbase';

export const GET: RequestHandler = async () => {
	const news = await getNews();
	return json(news);
};
