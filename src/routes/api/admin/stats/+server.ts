import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getStats, createStat, updateStat, deleteStat } from '$lib/server/data';

export const GET: RequestHandler = async () => {
	const stats = await getStats();
	return json(stats);
};

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const data = await request.json();
	const stat = await createStat(data);
	if (!stat) {
		return json({ error: 'Failed to create' }, { status: 500 });
	}
	return json(stat, { status: 201 });
};

export const PUT: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { id, ...data } = await request.json();
	const stat = await updateStat(id, data);
	if (!stat) {
		return json({ error: 'Not found' }, { status: 404 });
	}
	return json(stat);
};

export const DELETE: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { id } = await request.json();
	const success = await deleteStat(id);
	if (!success) {
		return json({ error: 'Not found' }, { status: 404 });
	}
	return json({ success: true });
};
