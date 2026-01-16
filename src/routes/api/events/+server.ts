import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getEvents } from '$lib/server/pocketbase';

export const GET: RequestHandler = async () => {
	const events = await getEvents();
	return json(events);
};
