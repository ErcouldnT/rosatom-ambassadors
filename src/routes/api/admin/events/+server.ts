import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getEvents, createEvent, updateEvent, deleteEvent } from '$lib/server/pocketbase';

export const GET: RequestHandler = async () => {
	const events = await getEvents();
	return json(events);
};

export const POST: RequestHandler = async ({ request, cookies }) => {
	const token = cookies.get('admin_session');
	const contentType = request.headers.get('content-type');

	let data: any;
	if (contentType?.includes('multipart/form-data')) {
		data = await request.formData();
	} else {
		data = await request.json();
	}

	const event = await createEvent(data, token);
	if (!event) {
		return json({ error: 'Failed to create' }, { status: 500 });
	}
	return json(event, { status: 201 });
};

export const PUT: RequestHandler = async ({ request, cookies }) => {
	const token = cookies.get('admin_session');
	const contentType = request.headers.get('content-type');

	let data: any;
	let id: string;

	if (contentType?.includes('multipart/form-data')) {
		const formData = await request.formData();
		id = formData.get('id') as string;
		data = formData;
	} else {
		const jsonData = await request.json();
		id = jsonData.id;
		data = jsonData;
	}

	if (!id) {
		return json({ error: 'Missing ID' }, { status: 400 });
	}

	const event = await updateEvent(id, data, token);
	if (!event) {
		return json({ error: 'Not found' }, { status: 404 });
	}
	return json(event);
};

export const DELETE: RequestHandler = async ({ request, cookies }) => {
	const { id } = await request.json();
	const token = cookies.get('admin_session');
	const success = await deleteEvent(id, token);
	if (!success) {
		return json({ error: 'Not found' }, { status: 404 });
	}
	return json({ success: true });
};
