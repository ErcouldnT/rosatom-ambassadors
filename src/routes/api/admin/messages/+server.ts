import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getMessages, markMessageRead, deleteMessage } from '$lib/server/data';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const messages = await getMessages();
	return json(messages);
};

export const PUT: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { id } = await request.json();
	if (!id) {
		return json({ error: 'Missing ID' }, { status: 400 });
	}

	const message = await markMessageRead(id);
	if (!message) {
		return json({ error: 'Failed to update message' }, { status: 500 });
	}
	return json(message);
};

export const DELETE: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { id } = await request.json();
	if (!id) {
		return json({ error: 'Missing ID' }, { status: 400 });
	}

	const success = await deleteMessage(id);
	if (!success) {
		return json({ error: 'Failed to delete message' }, { status: 500 });
	}
	return json({ success: true });
};
