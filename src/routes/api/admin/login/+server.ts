import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { lucia } from '$lib/server/auth';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const { email, password } = await request.json();

	// Find user by username configuration
	const existingUser = await db.select().from(user).where(eq(user.username, email)).get();

	if (!existingUser) {
		return json({ success: false, error: 'Invalid credentials' }, { status: 401 });
	}

	// Verify password (simplistic comparison for migration)
	const validPassword = existingUser.password_hash === password;

	if (!validPassword) {
		return json({ success: false, error: 'Invalid credentials' }, { status: 401 });
	}

	const session = await lucia.createSession(existingUser.id, {});
	const sessionCookie = lucia.createSessionCookie(session.id);

	cookies.set(sessionCookie.name, sessionCookie.value, {
		path: '/',
		...sessionCookie.attributes
	});

	return json({ success: true });
};
