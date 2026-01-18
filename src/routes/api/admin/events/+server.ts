import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getEvents, createEvent, updateEvent, deleteEvent } from '$lib/server/data';
import sharp from 'sharp';
import slugify from 'slugify';

export const GET: RequestHandler = async () => {
	const events = await getEvents();
	return json(events);
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
			.resize(1200, 630, { fit: 'cover', withoutEnlargement: true })
			.webp({ quality: 80 })
			.toBuffer();
		mimeType = 'image/webp';
	}

	const title_en = formData.get('title_en') as string;
	const slug = (formData.get('slug') as string) || slugify(title_en, { lower: true, strict: true });

	const data = {
		title_en,
		title_ru: formData.get('title_ru') as string,
		slug,
		date_day: formData.get('date_day') as string,
		date_month_en: formData.get('date_month_en') as string,
		date_month_ru: formData.get('date_month_ru') as string,
		time: formData.get('time') as string,
		location_en: formData.get('location_en') as string,
		location_ru: formData.get('location_ru') as string,
		description_en: formData.get('description_en') as string,
		description_ru: formData.get('description_ru') as string,
		image: imageData,
		image_mime_type: mimeType
	};

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const event = await createEvent(data as any);
	if (!event) {
		return json({ error: 'Failed to create' }, { status: 500 });
	}
	return json(event, { status: 201 });
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
		title_en: formData.get('title_en') as string,
		title_ru: formData.get('title_ru') as string,
		date_day: formData.get('date_day') as string,
		date_month_en: formData.get('date_month_en') as string,
		date_month_ru: formData.get('date_month_ru') as string,
		time: formData.get('time') as string,
		location_en: formData.get('location_en') as string,
		location_ru: formData.get('location_ru') as string,
		description_en: formData.get('description_en') as string,
		description_ru: formData.get('description_ru') as string
	};

	const slug = formData.get('slug') as string;
	if (slug) data.slug = slug;

	if (imageData) {
		data.image = imageData;
		data.image_mime_type = mimeType;
	}

	const event = await updateEvent(id, data);
	if (!event) {
		return json({ error: 'Not found' }, { status: 404 });
	}
	return json(event);
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
