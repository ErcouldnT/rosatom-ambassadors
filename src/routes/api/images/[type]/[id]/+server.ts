import { db } from '$lib/server/db';
import { ambassadors, events, news } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, request }) => {
	const { type, id } = params;
	const ifNoneMatch = request.headers.get('if-none-match');

	type ImageTable = typeof ambassadors | typeof events | typeof news;

	const getMetaAndImage = async (table: ImageTable) => {
		const meta = await db
			.select({
				updated: table.updated,
				mimeType: table.image_mime_type
			})
			.from(table)
			.where(eq(table.id, id!))
			.get();

		if (!meta) return null;

		const etag = `"${meta.updated}"`;
		if (ifNoneMatch === etag) {
			return { status: 304, image: null, mimeType: null, etag };
		}

		const result = await db
			.select({ image: table.image })
			.from(table)
			.where(eq(table.id, id!))
			.get();

		if (!result || !result.image) return null;

		return {
			image: result.image as Uint8Array,
			mimeType: meta.mimeType,
			etag,
			status: 200
		};
	};

	try {
		let result: {
			image: Uint8Array | null;
			mimeType: string | null;
			etag: string;
			status: number;
		} | null = null;

		if (type === 'ambassadors') {
			result = await getMetaAndImage(ambassadors);
		} else if (type === 'events') {
			result = await getMetaAndImage(events);
		} else if (type === 'news') {
			result = await getMetaAndImage(news);
		} else {
			throw error(400, 'Invalid image type');
		}

		if (!result) {
			throw error(404, 'Image not found');
		}

		if (result.status === 304) {
			return new Response(null, { status: 304 });
		}

		return new Response(result.image as unknown as BodyInit, {
			headers: {
				'Content-Type': result.mimeType || 'image/webp',
				'Cache-Control': 'public, max-age=31536000, immutable',
				ETag: result.etag
			}
		});
	} catch (e: unknown) {
		if (e && typeof e === 'object' && 'status' in e) throw e;
		console.error('Failed to serve image:', e);
		throw error(500, 'Internal server error');
	}
};
