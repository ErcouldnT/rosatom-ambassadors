import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { updateCMSContent } from '$lib/server/data';
import sharp from 'sharp';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const formData = await request.formData();
	const key = formData.get('key') as string;
	const imageFile = formData.get('image') as File | null;

	if (!key) {
		return json({ error: 'Missing key' }, { status: 400 });
	}

	let imageData: Buffer | null = null;
	let mimeType: string | null = null;

	if (imageFile && imageFile.size > 0) {
		const buffer = Buffer.from(await imageFile.arrayBuffer());
		// Optimize image, convert to WebP
		// For hero images and other CMS assets, we ensure they don't exceed Full HD resolution
		imageData = await sharp(buffer)
			.resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
			.webp({ quality: 85 })
			.toBuffer();
		mimeType = 'image/webp';
	} else {
		return json({ error: 'Missing image file' }, { status: 400 });
	}

	const content = await updateCMSContent(key, {
		image: imageData,
		image_mime_type: mimeType
	});

	if (!content) {
		return json({ error: 'Failed to update content' }, { status: 500 });
	}
	return json({ success: true, content });
};
