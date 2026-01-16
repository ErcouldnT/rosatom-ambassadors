import type { PageServerLoad } from './$types';
import { getAmbassadorById } from '$lib/server/pocketbase';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const ambassador = await getAmbassadorById(params.id);

	if (!ambassador) {
		throw error(404, 'Ambassador not found');
	}

	return { ambassador };
};
