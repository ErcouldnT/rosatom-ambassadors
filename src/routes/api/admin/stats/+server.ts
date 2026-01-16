import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getAllStats, editStat } from '$lib/server/dataStore';

export const GET: RequestHandler = async () => {
	return json(getAllStats());
};

export const PUT: RequestHandler = async ({ request }) => {
	const { index, ...data } = await request.json();
	const stat = editStat(index, data);
	if (!stat) {
		return json({ error: 'Not found' }, { status: 404 });
	}
	return json(stat);
};
