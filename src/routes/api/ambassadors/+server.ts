import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getAmbassadors } from '$lib/server/pocketbase';

export const GET: RequestHandler = async () => {
	const ambassadors = await getAmbassadors();
	return json(ambassadors);
};
