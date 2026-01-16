import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
	getAmbassadors,
	createAmbassador,
	updateAmbassador,
	deleteAmbassador
} from '$lib/server/pocketbase';

export const GET: RequestHandler = async () => {
	// Don't filter by active in admin
	const ambassadors = await getAmbassadors(false);
	return json(ambassadors);
};

export const POST: RequestHandler = async ({ request, cookies }) => {
	const token = cookies.get('admin_session');
	console.log('Ambassador POST: Retrieved token from cookie:', token ? token.substring(0, 10) + '...' : 'null');

	const contentType = request.headers.get('content-type');

	let data: any;
	if (contentType?.includes('multipart/form-data')) {
		data = await request.formData();
	} else {
		data = await request.json();
	}

	const ambassador = await createAmbassador(data, token);
	if (!ambassador) {
		console.error('Ambassador POST failed: createAmbassador returned null');
		return json({ error: 'Failed to create' }, { status: 500 });
	}
	return json(ambassador, { status: 201 });
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

	const ambassador = await updateAmbassador(id, data, token);
	if (!ambassador) {
		return json({ error: 'Not found' }, { status: 404 });
	}
	return json(ambassador);
};

export const DELETE: RequestHandler = async ({ request, cookies }) => {
	const { id } = await request.json();
	const token = cookies.get('admin_session');
	const success = await deleteAmbassador(id, token);
	if (!success) {
		return json({ error: 'Not found' }, { status: 404 });
	}
	return json({ success: true });
};
