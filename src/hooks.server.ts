import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// Try to get language from cookie, otherwise fallback to accept-language header or default to 'en'
	const lang =
		event.cookies.get('lang') ||
		(event.request.headers.get('accept-language')?.toLowerCase().startsWith('ru') ? 'ru' : 'en');

	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%lang%', lang)
	});
};
