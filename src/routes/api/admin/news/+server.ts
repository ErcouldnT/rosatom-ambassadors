import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getNews, createNews, updateNews, deleteNews } from '$lib/server/data';
import sharp from 'sharp';
import slugify from 'slugify';
import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';

const newsSchema = z.object({
	category_en: z.string().min(1),
	category_ru: z.string().min(1),
	date: z.string().min(1),
	title_en: z.string().min(1),
	title_ru: z.string().min(1),
	slug: z.string().optional(),
	excerpt_en: z.string().min(1),
	excerpt_ru: z.string().min(1)
});

export const GET: RequestHandler = async () => {
	const news = await getNews();
	return json(news);
};

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const formData = await request.formData();

		const rawData = {
			category_en: formData.get('category_en'),
			category_ru: formData.get('category_ru'),
			date: formData.get('date'),
			title_en: formData.get('title_en'),
			title_ru: formData.get('title_ru'),
			slug: formData.get('slug'),
			excerpt_en: formData.get('excerpt_en'),
			excerpt_ru: formData.get('excerpt_ru')
		};

		const validation = newsSchema.safeParse(rawData);

		if (!validation.success) {
			return json({ error: validation.error.issues[0].message }, { status: 400 });
		}

		const vData = validation.data;

		// Sanitize inputs
		const data = {
			category_en: DOMPurify.sanitize(vData.category_en),
			category_ru: DOMPurify.sanitize(vData.category_ru),
			date: DOMPurify.sanitize(vData.date),
			title_en: DOMPurify.sanitize(vData.title_en),
			title_ru: DOMPurify.sanitize(vData.title_ru),
			slug: vData.slug
				? DOMPurify.sanitize(vData.slug)
				: slugify(vData.title_en, { lower: true, strict: true }),
			excerpt_en: DOMPurify.sanitize(vData.excerpt_en),
			excerpt_ru: DOMPurify.sanitize(vData.excerpt_ru),
			image: null as Buffer | null,
			image_mime_type: null as string | null
		};

		// Handle Image
		const imageFile = formData.get('image') as File | null;
		if (imageFile && imageFile.size > 0) {
			const buffer = Buffer.from(await imageFile.arrayBuffer());
			data.image = await sharp(buffer)
				.resize(1200, 630, { fit: 'cover', withoutEnlargement: true }) // Larger for news covers
				.webp({ quality: 80 })
				.toBuffer();
			data.image_mime_type = 'image/webp';
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const news = await createNews(data as any);
		if (!news) {
			return json({ error: 'Failed to create' }, { status: 500 });
		}
		return json(news, { status: 201 });
	} catch (error) {
		console.error('API POST Error:', error);
		const message = error instanceof Error ? error.message : 'Server error';
		return json({ error: message }, { status: 500 });
	}
};

export const PUT: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const formData = await request.formData();
		const id = formData.get('id') as string;

		if (!id) {
			return json({ error: 'Missing ID' }, { status: 400 });
		}

		const rawData = {
			category_en: formData.get('category_en'),
			category_ru: formData.get('category_ru'),
			date: formData.get('date'),
			title_en: formData.get('title_en'),
			title_ru: formData.get('title_ru'),
			slug: formData.get('slug'),
			excerpt_en: formData.get('excerpt_en'),
			excerpt_ru: formData.get('excerpt_ru')
		};

		const validation = newsSchema.safeParse(rawData);

		if (!validation.success) {
			return json({ error: validation.error.issues[0].message }, { status: 400 });
		}

		const vData = validation.data;

		// Sanitize inputs
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const data: any = {
			category_en: DOMPurify.sanitize(vData.category_en),
			category_ru: DOMPurify.sanitize(vData.category_ru),
			date: DOMPurify.sanitize(vData.date),
			title_en: DOMPurify.sanitize(vData.title_en),
			title_ru: DOMPurify.sanitize(vData.title_ru),
			excerpt_en: DOMPurify.sanitize(vData.excerpt_en),
			excerpt_ru: DOMPurify.sanitize(vData.excerpt_ru)
		};

		if (vData.slug) {
			data.slug = DOMPurify.sanitize(vData.slug);
		}

		// Handle Image
		const imageFile = formData.get('image') as File | null;
		if (imageFile && imageFile.size > 0) {
			const buffer = Buffer.from(await imageFile.arrayBuffer());
			data.image = await sharp(buffer)
				.resize(1200, 630, { fit: 'cover', withoutEnlargement: true })
				.webp({ quality: 80 })
				.toBuffer();
			data.image_mime_type = 'image/webp';
		}

		const news = await updateNews(id, data);
		if (!news) {
			return json({ error: 'Not found' }, { status: 404 });
		}
		return json(news);
	} catch (error) {
		console.error('API PUT Error:', error);
		const message = error instanceof Error ? error.message : 'Server error';
		return json({ error: message }, { status: 500 });
	}
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
