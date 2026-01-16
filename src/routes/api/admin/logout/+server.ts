import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { destroySession } from '$lib/server/dataStore';

export const POST: RequestHandler = async ({ cookies }) => {
	const sessionId = cookies.get('admin_session');

	if (sessionId) {
		destroySession(sessionId);
		cookies.delete('admin_session', { path: '/' });
	}

	return json({ success: true });
};
