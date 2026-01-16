import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
	getAllAmbassadors,
	createAmbassador,
	editAmbassador,
	removeAmbassador
} from '$lib/server/dataStore';

export const GET: RequestHandler = async () => {
	return json(getAllAmbassadors());
};

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.json();
	const ambassador = createAmbassador(data);
	return json(ambassador, { status: 201 });
};

export const PUT: RequestHandler = async ({ request }) => {
	const { id, ...data } = await request.json();
	const ambassador = editAmbassador(id, data);
	if (!ambassador) {
		return json({ error: 'Not found' }, { status: 404 });
	}
	return json(ambassador);
};

export const DELETE: RequestHandler = async ({ request }) => {
	const { id } = await request.json();
	const success = removeAmbassador(id);
	if (!success) {
		return json({ error: 'Not found' }, { status: 404 });
	}
	return json({ success: true });
};
