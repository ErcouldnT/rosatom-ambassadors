import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { loginAdmin } from '$lib/server/pocketbase';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const { email, password } = await request.json();

	const sessionId = await loginAdmin(email, password);

	if (sessionId) {
		cookies.set('admin_session', sessionId, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			maxAge: 60 * 60 * 24 // 24 hours
		});
		return json({ success: true });
	}

	return json({ success: false, error: 'Invalid credentials' }, { status: 401 });
};
