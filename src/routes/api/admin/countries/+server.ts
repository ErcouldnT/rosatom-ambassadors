import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getCountries, createCountry, updateCountry, deleteCountry } from '$lib/server/data';

export const GET: RequestHandler = async () => {
	const countries = await getCountries();
	return json(countries);
};

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}
	const data = await request.json();
	const country = await createCountry(data);
	if (!country) {
		return json({ error: 'Failed to create' }, { status: 500 });
	}
	return json(country, { status: 201 });
};

export const PUT: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}
	const { id, ...data } = await request.json();
	const country = await updateCountry(id, data);
	if (!country) {
		return json({ error: 'Not found' }, { status: 404 });
	}
	return json(country);
};

export const DELETE: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}
	const { id } = await request.json();
	const success = await deleteCountry(id);
	if (!success) {
		return json({ error: 'Not found' }, { status: 404 });
	}
	return json({ success: true });
};
