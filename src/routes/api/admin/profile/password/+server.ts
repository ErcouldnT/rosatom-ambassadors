import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { Argon2id } from 'oslo/password';
import { z } from 'zod';

const passwordChangeSchema = z
	.object({
		currentPassword: z.string().min(1, 'Current password is required'),
		newPassword: z.string().min(8, 'New password must be at least 8 characters long'),
		confirmNewPassword: z.string().min(1, 'Confirm new password is required')
	})
	.refine((data) => data.newPassword === data.confirmNewPassword, {
		message: "Passwords don't match",
		path: ['confirmNewPassword']
	});

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}

	const body = await request.json();
	const validation = passwordChangeSchema.safeParse(body);

	if (!validation.success) {
		return json(
			{
				success: false,
				error: validation.error.issues[0].message
			},
			{ status: 400 }
		);
	}

	const { currentPassword, newPassword } = validation.data;

	try {
		// Get current user with password hash
		const currentUser = await db.select().from(user).where(eq(user.id, locals.user.id)).get();

		if (!currentUser) {
			throw error(404, 'User not found');
		}

		// Verify current password
		const argon2id = new Argon2id();
		const validPassword = await argon2id.verify(currentUser.password_hash, currentPassword);

		if (!validPassword) {
			return json({ success: false, error: 'Incorrect current password' }, { status: 401 });
		}

		// Hash new password
		const newHashedPassword = await argon2id.hash(newPassword);

		// Update database
		await db
			.update(user)
			.set({ password_hash: newHashedPassword })
			.where(eq(user.id, locals.user.id));

		return json({ success: true });
	} catch (err) {
		console.error('Password change error:', err);
		return json({ success: false, error: 'Internal server error' }, { status: 500 });
	}
};
