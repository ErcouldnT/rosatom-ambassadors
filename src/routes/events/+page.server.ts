import type { PageServerLoad } from './$types';
import { getEvents } from '$lib/server/data';

export const load: PageServerLoad = async () => {
	const events = await getEvents();
	return { events };
};
