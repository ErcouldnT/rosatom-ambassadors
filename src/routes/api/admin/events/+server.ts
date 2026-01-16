import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getAllEvents, createEvent, editEvent, removeEvent } from '$lib/server/dataStore';

export const GET: RequestHandler = async () => {
	return json(getAllEvents());
};

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.json();
	const event = createEvent(data);
	return json(event, { status: 201 });
};

export const PUT: RequestHandler = async ({ request }) => {
	const { id, ...data } = await request.json();
	const event = editEvent(id, data);
	if (!event) {
		return json({ error: 'Not found' }, { status: 404 });
	}
	return json(event);
};

export const DELETE: RequestHandler = async ({ request }) => {
	const { id } = await request.json();
	const success = removeEvent(id);
	if (!success) {
		return json({ error: 'Not found' }, { status: 404 });
	}
	return json({ success: true });
};
