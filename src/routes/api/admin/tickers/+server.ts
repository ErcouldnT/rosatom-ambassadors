import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getTickers, createTicker, updateTicker, deleteTicker } from '$lib/server/pocketbase';

export const GET: RequestHandler = async () => {
	const tickers = await getTickers();
	return json(tickers);
};

export const POST: RequestHandler = async ({ request, cookies }) => {
	const data = await request.json();
	const token = cookies.get('admin_session');
	const ticker = await createTicker(data, token);
	if (!ticker) {
		return json({ error: 'Failed to create' }, { status: 500 });
	}
	return json(ticker, { status: 201 });
};

export const PUT: RequestHandler = async ({ request, cookies }) => {
	const { id, ...data } = await request.json();
	const token = cookies.get('admin_session');
	const ticker = await updateTicker(id, data, token);
	if (!ticker) {
		return json({ error: 'Not found' }, { status: 404 });
	}
	return json(ticker);
};

export const DELETE: RequestHandler = async ({ request, cookies }) => {
	const { id } = await request.json();
	const token = cookies.get('admin_session');
	const success = await deleteTicker(id, token);
	if (!success) {
		return json({ error: 'Not found' }, { status: 404 });
	}
	return json({ success: true });
};
