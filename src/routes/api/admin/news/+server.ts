import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getNews, createNews, updateNews, deleteNews } from '$lib/server/data';
import sharp from 'sharp';
import slugify from 'slugify';

export const GET: RequestHandler = async () => {
	const news = await getNews();
	return json(news);
};

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const formData = await request.formData();
	const imageFile = formData.get('image') as File | null;

	let imageData: Buffer | null = null;
	let mimeType: string | null = null;

	if (imageFile && imageFile.size > 0) {
		const buffer = Buffer.from(await imageFile.arrayBuffer());
		imageData = await sharp(buffer)
			.resize(1200, 630, { fit: 'cover', withoutEnlargement: true }) // Larger for news covers
			.webp({ quality: 80 })
			.toBuffer();
		mimeType = 'image/webp';
	}

	const title_en = formData.get('title_en') as string;
	const slug = (formData.get('slug') as string) || slugify(title_en, { lower: true, strict: true });

	const data = {
		category_en: formData.get('category_en') as string,
		category_ru: formData.get('category_ru') as string,
		date: formData.get('date') as string,
		title_en,
		slug,
		title_ru: formData.get('title_ru') as string,
		excerpt_en: formData.get('excerpt_en') as string,
		excerpt_ru: formData.get('excerpt_ru') as string,
		image: imageData,
		image_mime_type: mimeType
	};

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const news = await createNews(data as any);
	if (!news) {
		return json({ error: 'Failed to create' }, { status: 500 });
	}
	return json(news, { status: 201 });
};

export const PUT: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const formData = await request.formData();
	const id = formData.get('id') as string;

	if (!id) {
		return json({ error: 'Missing ID' }, { status: 400 });
	}

	const imageFile = formData.get('image') as File | null;
	let imageData: Buffer | null = null;
	let mimeType: string | null = null;

	if (imageFile && imageFile.size > 0) {
		const buffer = Buffer.from(await imageFile.arrayBuffer());
		imageData = await sharp(buffer)
			.resize(1200, 630, { fit: 'cover', withoutEnlargement: true })
			.webp({ quality: 80 })
			.toBuffer();
		mimeType = 'image/webp';
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const data: any = {
		category_en: formData.get('category_en') as string,
		category_ru: formData.get('category_ru') as string,
		date: formData.get('date') as string,
		title_en: formData.get('title_en') as string,
		title_ru: formData.get('title_ru') as string,
		excerpt_en: formData.get('excerpt_en') as string,
		excerpt_ru: formData.get('excerpt_ru') as string
	};

	const slug = formData.get('slug') as string;
	if (slug) data.slug = slug;

	if (imageData) {
		data.image = imageData;
		data.image_mime_type = mimeType;
	}

	const news = await updateNews(id, data);
	if (!news) {
		return json({ error: 'Not found' }, { status: 404 });
	}
	return json(news);
};

export const DELETE: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { id } = await request.json();
	const success = await deleteNews(id);
	if (!success) {
		return json({ error: 'Not found' }, { status: 404 });
	}
	return json({ success: true });
};
