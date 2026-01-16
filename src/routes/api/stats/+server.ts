import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getStats } from '$lib/server/pocketbase';

export const GET: RequestHandler = async () => {
	const stats = await getStats();
	return json(stats);
};
