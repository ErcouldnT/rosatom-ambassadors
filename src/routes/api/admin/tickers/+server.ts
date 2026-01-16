import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getTickers, createTicker, updateTicker, deleteTicker } from '$lib/server/data';

export const GET: RequestHandler = async () => {
	const tickers = await getTickers();
	return json(tickers);
};

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}
	const data = await request.json();
	const ticker = await createTicker(data);
	if (!ticker) {
		return json({ error: 'Failed to create' }, { status: 500 });
	}
	return json(ticker, { status: 201 });
};

export const PUT: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}
	const { id, ...data } = await request.json();
	const ticker = await updateTicker(id, data);
	if (!ticker) {
		return json({ error: 'Not found' }, { status: 404 });
	}
	return json(ticker);
};

export const DELETE: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}
	const { id } = await request.json();
	const success = await deleteTicker(id);
	if (!success) {
		return json({ error: 'Not found' }, { status: 404 });
	}
	return json({ success: true });
};
