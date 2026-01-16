import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	return {
		lang: locals.lang,
		user: locals.user
	};
};
