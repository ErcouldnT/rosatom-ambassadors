import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { lucia } from '$lib/server/auth';

// Language handling hook
const languageHandle: Handle = async ({ event, resolve }) => {
	// Try to get language from cookie, otherwise fallback to accept-language header or default to 'en'
	let lang = event.cookies.get('lang') as 'en' | 'ru' | undefined;

	if (!lang || (lang !== 'en' && lang !== 'ru')) {
		lang = event.request.headers.get('accept-language')?.toLowerCase().startsWith('ru')
			? 'ru'
			: 'en';
	}

	event.locals.lang = lang;

	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%lang%', lang)
	});
};

// Admin authentication hook
const authHandle: Handle = async ({ event, resolve }) => {
	// CSRF Protection
	if (event.request.method !== 'GET') {
		const origin = event.request.headers.get('Origin');
		const url = new URL(event.request.url);

		if (origin) {
			const originUrl = new URL(origin);
			// Relaxed check for dev: allow localhost regardless of port if needed,
			// but better to be strict and handle port correctly.
			if (originUrl.origin !== url.origin) {
				console.error(`CSRF Blocked: Origin ${originUrl.origin} !== URL Origin ${url.origin}`);
				return new Response('Forbidden', { status: 403 });
			}
		}
	}

	const sessionId = event.cookies.get(lucia.sessionCookieName);
	if (!sessionId) {
		event.locals.user = null;
		event.locals.session = null;
	} else {
		const { session, user } = await lucia.validateSession(sessionId);
		if (session && session.fresh) {
			const sessionCookie = lucia.createSessionCookie(session.id);
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '/', // Ensure path is /
				...sessionCookie.attributes
			});
		}
		if (!session) {
			const sessionCookie = lucia.createBlankSessionCookie();
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '/', // Ensure path is /
				...sessionCookie.attributes
			});
		}
		event.locals.user = user;
		event.locals.session = session;
	}

	// Protect admin routes (except login page)
	if (event.url.pathname.startsWith('/admin')) {
		// Allow access to login page
		if (event.url.pathname === '/admin/login') {
			// If already authenticated, redirect to dashboard
			if (event.locals.user) {
				throw redirect(303, '/admin');
			}
		} else {
			// All other admin pages require authentication
			if (!event.locals.user) {
				throw redirect(303, '/admin/login');
			}
		}
	}

	// Protect admin API routes
	if (event.url.pathname.startsWith('/api/admin')) {
		const publicApiRoutes = ['/api/admin/login'];
		if (!publicApiRoutes.includes(event.url.pathname)) {
			if (!event.locals.user) {
				return new Response(JSON.stringify({ error: 'Unauthorized' }), {
					status: 401,
					headers: { 'Content-Type': 'application/json' }
				});
			}
		}
	}

	return resolve(event);
};

// Security Headers Hook
const securityHeadersHandle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);

	response.headers.set('X-Frame-Options', 'DENY');
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
	// Note: CSP is best handled via svelte.config.js or meta tags for this static adapter setup,
	// but can be enforced here if needed.

	return response;
};

// Combine hooks with sequence
export const handle = sequence(securityHeadersHandle, languageHandle, authHandle);
