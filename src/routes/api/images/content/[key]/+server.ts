import { getCMSContent } from '$lib/server/data';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, setHeaders, request }) => {
	const { key } = params;
	const ifNoneMatch = request.headers.get('if-none-match');

	if (!key) {
		throw error(400, 'Invalid key');
	}

	try {
		const content = await getCMSContent(key);

		if (!content || !content.image) {
			throw error(404, 'Image not found');
		}

		const etag = `"${content.updated}"`;
		if (ifNoneMatch === etag) {
			return new Response(null, { status: 304 });
		}

		setHeaders({
			'Content-Type': content.image_mime_type || 'image/webp',
			'Cache-Control': 'public, max-age=3600, must-revalidate',
			ETag: etag
		});

		return new Response(content.image as unknown as BodyInit);
	} catch (e: unknown) {
		if (e && typeof e === 'object' && 'status' in e) throw e;
		console.error('Failed to serve content image:', e);
		throw error(500, 'Internal server error');
	}
};
