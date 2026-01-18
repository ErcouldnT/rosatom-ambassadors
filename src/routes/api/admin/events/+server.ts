import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getEvents, createEvent, updateEvent, deleteEvent } from '$lib/server/data';
import sharp from 'sharp';
import slugify from 'slugify';
import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';

const eventSchema = z.object({
	title_en: z.string().min(1),
	title_ru: z.string().min(1),
	slug: z.string().optional(),
	date_day: z.string().min(1),
	date_month_en: z.string().min(1),
	date_month_ru: z.string().min(1),
	time: z.string().min(1),
	location_en: z.string().min(1),
	location_ru: z.string().min(1),
	description_en: z.string().min(1),
	description_ru: z.string().min(1)
});

export const GET: RequestHandler = async () => {
	const events = await getEvents();
	return json(events);
};

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const formData = await request.formData();

		const rawData = {
			title_en: formData.get('title_en'),
			title_ru: formData.get('title_ru'),
			slug: formData.get('slug'),
			date_day: formData.get('date_day'),
			date_month_en: formData.get('date_month_en'),
			date_month_ru: formData.get('date_month_ru'),
			time: formData.get('time'),
			location_en: formData.get('location_en'),
			location_ru: formData.get('location_ru'),
			description_en: formData.get('description_en'),
			description_ru: formData.get('description_ru')
		};

		const validation = eventSchema.safeParse(rawData);

		if (!validation.success) {
			return json({ error: validation.error.issues[0].message }, { status: 400 });
		}

		const vData = validation.data;

		// Sanitize inputs
		const data = {
			title_en: DOMPurify.sanitize(vData.title_en),
			title_ru: DOMPurify.sanitize(vData.title_ru),
			slug: vData.slug
				? DOMPurify.sanitize(vData.slug)
				: slugify(vData.title_en, { lower: true, strict: true }),
			date_day: DOMPurify.sanitize(vData.date_day),
			date_month_en: DOMPurify.sanitize(vData.date_month_en),
			date_month_ru: DOMPurify.sanitize(vData.date_month_ru),
			time: DOMPurify.sanitize(vData.time),
			location_en: DOMPurify.sanitize(vData.location_en),
			location_ru: DOMPurify.sanitize(vData.location_ru),
			description_en: DOMPurify.sanitize(vData.description_en),
			description_ru: DOMPurify.sanitize(vData.description_ru),
			image: null as Buffer | null,
			image_mime_type: null as string | null
		};

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

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const event = await createEvent(data as any);
		if (!event) {
			return json({ error: 'Failed to create' }, { status: 500 });
		}
		return json(event, { status: 201 });
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
			title_en: formData.get('title_en'),
			title_ru: formData.get('title_ru'),
			slug: formData.get('slug'),
			date_day: formData.get('date_day'),
			date_month_en: formData.get('date_month_en'),
			date_month_ru: formData.get('date_month_ru'),
			time: formData.get('time'),
			location_en: formData.get('location_en'),
			location_ru: formData.get('location_ru'),
			description_en: formData.get('description_en'),
			description_ru: formData.get('description_ru')
		};

		const validation = eventSchema.safeParse(rawData);

		if (!validation.success) {
			return json({ error: validation.error.issues[0].message }, { status: 400 });
		}

		const vData = validation.data;

		// Sanitize inputs
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const data: any = {
			title_en: DOMPurify.sanitize(vData.title_en),
			title_ru: DOMPurify.sanitize(vData.title_ru),
			date_day: DOMPurify.sanitize(vData.date_day),
			date_month_en: DOMPurify.sanitize(vData.date_month_en),
			date_month_ru: DOMPurify.sanitize(vData.date_month_ru),
			time: DOMPurify.sanitize(vData.time),
			location_en: DOMPurify.sanitize(vData.location_en),
			location_ru: DOMPurify.sanitize(vData.location_ru),
			description_en: DOMPurify.sanitize(vData.description_en),
			description_ru: DOMPurify.sanitize(vData.description_ru)
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

		const event = await updateEvent(id, data);
		if (!event) {
			return json({ error: 'Not found' }, { status: 404 });
		}
		return json(event);
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
	const success = await deleteEvent(id);
	if (!success) {
		return json({ error: 'Not found' }, { status: 404 });
	}
	return json({ success: true });
};
