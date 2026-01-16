import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getStats, updateStat } from '$lib/server/pocketbase';

export const GET: RequestHandler = async () => {
	const stats = await getStats();
	return json(stats);
};

export const PUT: RequestHandler = async ({ request, cookies }) => {
	const { id, ...data } = await request.json();
	const token = cookies.get('admin_session');
	const stat = await updateStat(id, data, token);
	if (!stat) {
		return json({ error: 'Not found' }, { status: 404 });
	}
	return json(stat);
};
