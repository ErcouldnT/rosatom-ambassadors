import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { validateSession } from '$lib/server/pocketbase';

// Language handling hook
const languageHandle: Handle = async ({ event, resolve }) => {
	// Try to get language from cookie, otherwise fallback to accept-language header or default to 'en'
	const lang =
		event.cookies.get('lang') ||
		(event.request.headers.get('accept-language')?.toLowerCase().startsWith('ru') ? 'ru' : 'en');

	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%lang%', lang)
	});
};

// Admin authentication hook
const authHandle: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get('admin_session');

	// Check if authenticated
	const isAuthenticated = sessionId ? await validateSession(sessionId) : false;

	// Store auth state in locals
	event.locals.isAuthenticated = isAuthenticated;

	// Protect admin routes (except login page)
	if (event.url.pathname.startsWith('/admin')) {
		// Allow access to login page
		if (event.url.pathname === '/admin/login') {
			// If already authenticated, redirect to dashboard
			if (isAuthenticated) {
				throw redirect(303, '/admin');
			}
		} else {
			// All other admin pages require authentication
			if (!isAuthenticated) {
				throw redirect(303, '/admin/login');
			}
		}
	}

	// Protect admin API routes
	if (event.url.pathname.startsWith('/api/admin')) {
		const publicApiRoutes = ['/api/admin/login'];
		if (!publicApiRoutes.includes(event.url.pathname)) {
			if (!isAuthenticated) {
				return new Response(JSON.stringify({ error: 'Unauthorized' }), {
					status: 401,
					headers: { 'Content-Type': 'application/json' }
				});
			}
		}
	}

	return resolve(event);
};

// Combine hooks with sequence
export const handle = sequence(languageHandle, authHandle);
