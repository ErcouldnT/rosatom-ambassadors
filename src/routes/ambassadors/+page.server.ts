import type { PageServerLoad } from './$types';
import { getAmbassadors } from '$lib/server/data';

export const load: PageServerLoad = async () => {
	const ambassadors = await getAmbassadors();
	return { ambassadors };
};
