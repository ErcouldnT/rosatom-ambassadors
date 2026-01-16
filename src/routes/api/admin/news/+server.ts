import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getAllNews, createNews, editNews, removeNews } from '$lib/server/dataStore';

export const GET: RequestHandler = async () => {
	return json(getAllNews());
};

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.json();
	const news = createNews(data);
	return json(news, { status: 201 });
};

export const PUT: RequestHandler = async ({ request }) => {
	const { id, ...data } = await request.json();
	const news = editNews(id, data);
	if (!news) {
		return json({ error: 'Not found' }, { status: 404 });
	}
	return json(news);
};

export const DELETE: RequestHandler = async ({ request }) => {
	const { id } = await request.json();
	const success = removeNews(id);
	if (!success) {
		return json({ error: 'Not found' }, { status: 404 });
	}
	return json({ success: true });
};
