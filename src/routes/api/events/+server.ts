import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getEvents } from '$lib/server/data';

export const GET: RequestHandler = async () => {
	const events = await getEvents();
	return json(events);
};
