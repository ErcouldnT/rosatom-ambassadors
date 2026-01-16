import type { PageServerLoad } from './$types';
import { getAmbassadors } from '$lib/server/pocketbase';

export const load: PageServerLoad = async () => {
	const ambassadors = await getAmbassadors();
	return { ambassadors };
};
