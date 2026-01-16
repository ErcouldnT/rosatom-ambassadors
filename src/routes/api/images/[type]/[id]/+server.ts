import { db } from '$lib/server/db';
import { ambassadors, events, news } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const { type, id } = params;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let record: any;

	try {
		if (type === 'ambassadors') {
			record = await db.select().from(ambassadors).where(eq(ambassadors.id, id!)).get();
		} else if (type === 'events') {
			record = await db.select().from(events).where(eq(events.id, id!)).get();
		} else if (type === 'news') {
			record = await db.select().from(news).where(eq(news.id, id!)).get();
		} else {
			throw error(400, 'Invalid image type');
		}

		if (!record || !record.image) {
			throw error(404, 'Image not found');
		}

		return new Response(record.image, {
			headers: {
				'Content-Type': record.image_mime_type || 'image/webp',
				'Cache-Control': 'public, max-age=31536000, immutable'
			}
		});
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (e: any) {
		if (e.status) throw e;
		console.error('Failed to serve image:', e);
		throw error(500, 'Internal server error');
	}
};
