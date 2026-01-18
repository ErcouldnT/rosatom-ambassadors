import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { updateCMSContent } from '$lib/server/data';
import sharp from 'sharp';
import { z } from 'zod';

const contentSchema = z.object({
	key: z.string().min(1)
});

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const formData = await request.formData();
	const key = formData.get('key');
	const validation = contentSchema.safeParse({ key });

	if (!validation.success) {
		return json({ error: validation.error.issues[0].message }, { status: 400 });
	}

	const validKey = validation.data.key;
	const imageFile = formData.get('image') as File | null;

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

	const content = await updateCMSContent(validKey, {
		image: imageData,
		image_mime_type: mimeType
	});

	if (!content) {
		return json({ error: 'Failed to update content' }, { status: 500 });
	}
	return json({ success: true, content });
};
