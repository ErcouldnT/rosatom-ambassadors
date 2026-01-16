import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getCountries, createCountry, updateCountry, deleteCountry } from '$lib/server/pocketbase';

export const GET: RequestHandler = async () => {
	const countries = await getCountries();
	return json(countries);
};

export const POST: RequestHandler = async ({ request, cookies }) => {
	const data = await request.json();
	const token = cookies.get('admin_session');
	const country = await createCountry(data, token);
	if (!country) {
		return json({ error: 'Failed to create' }, { status: 500 });
	}
	return json(country, { status: 201 });
};

export const PUT: RequestHandler = async ({ request, cookies }) => {
	const { id, ...data } = await request.json();
	const token = cookies.get('admin_session');
	const country = await updateCountry(id, data, token);
	if (!country) {
		return json({ error: 'Not found' }, { status: 404 });
	}
	return json(country);
};

export const DELETE: RequestHandler = async ({ request, cookies }) => {
	const { id } = await request.json();
	const token = cookies.get('admin_session');
	const success = await deleteCountry(id, token);
	if (!success) {
		return json({ error: 'Not found' }, { status: 404 });
	}
	return json({ success: true });
};
