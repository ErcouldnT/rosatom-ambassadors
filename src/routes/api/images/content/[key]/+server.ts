import { getCMSContent } from '$lib/server/data';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, setHeaders }) => {
	const { key } = params;

	if (!key) {
		throw error(400, 'Invalid key');
	}

	try {
		const content = await getCMSContent(key);

		if (!content || !content.image) {
			throw error(404, 'Image not found');
		}

		setHeaders({
			'Content-Type': content.image_mime_type || 'image/webp',
			// Lower cache age since these might change more often via admin panel interaction
			// but still cacheable. Maybe 1 hour or 1 day.
			// Using 'no-cache' might be safer if we want instant updates, or using ETag.
			// Let's use a moderate cache time.
			'Cache-Control': 'public, max-age=3600, must-revalidate'
		});

		return new Response(content.image as BodyInit);
	} catch (e: unknown) {
		if (e && typeof e === 'object' && 'status' in e) throw e;
		console.error('Failed to serve content image:', e);
		throw error(500, 'Internal server error');
	}
};
