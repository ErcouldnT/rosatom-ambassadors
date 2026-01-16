import type { PageServerLoad } from './$types';
import { getAmbassadorById } from '$lib/server/data';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	// Prevents requests for images/files falling through to this dynamic route
	if (params.id.includes('.')) {
		throw error(404, 'Not found');
	}

	const ambassador = await getAmbassadorById(params.id);

	if (!ambassador) {
		throw error(404, 'Ambassador not found');
	}

	return { ambassador };
};
