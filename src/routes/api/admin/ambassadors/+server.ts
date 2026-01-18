import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
	getAmbassadors,
	createAmbassador,
	updateAmbassador,
	deleteAmbassador
} from '$lib/server/data';
import sharp from 'sharp';
import slugify from 'slugify';

export const GET: RequestHandler = async () => {
	const ambassadors = await getAmbassadors(false);
	return json(ambassadors);
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
			.resize(800, 800, { fit: 'inside', withoutEnlargement: true })
			.webp({ quality: 80 })
			.toBuffer();
		mimeType = 'image/webp';
	}

	const name_en = formData.get('name_en') as string;
	const slug = (formData.get('slug') as string) || slugify(name_en, { lower: true, strict: true });

	const data = {
		name_en,
		name_ru: formData.get('name_ru') as string,
		slug,
		country_en: formData.get('country_en') as string,
		country_ru: formData.get('country_ru') as string,
		role_en: formData.get('role_en') as string,
		role_ru: formData.get('role_ru') as string,
		about_en: formData.get('about_en') as string,
		about_ru: formData.get('about_ru') as string,
		contributions_en: formData.get('contributions_en') as string,
		contributions_ru: formData.get('contributions_ru') as string,
		email: formData.get('email') as string,
		isActive: formData.get('isActive') === 'true',
		image: imageData,
		image_mime_type: mimeType
	};

	try {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const ambassador = await createAmbassador(data as any);
		if (!ambassador) {
			return json({ error: 'Failed to create ambassador' }, { status: 500 });
		}
		return json(ambassador, { status: 201 });
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		console.error('API POST Error:', error);
		return json({ error: error.message || 'Server error' }, { status: 500 });
	}
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
			.resize(800, 800, { fit: 'inside', withoutEnlargement: true })
			.webp({ quality: 80 })
			.toBuffer();
		mimeType = 'image/webp';
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const data: any = {
		name_en: formData.get('name_en') as string,
		name_ru: formData.get('name_ru') as string,
		country_en: formData.get('country_en') as string,
		country_ru: formData.get('country_ru') as string,
		role_en: formData.get('role_en') as string,
		role_ru: formData.get('role_ru') as string,
		about_en: formData.get('about_en') as string,
		about_ru: formData.get('about_ru') as string,
		contributions_en: formData.get('contributions_en') as string,
		contributions_ru: formData.get('contributions_ru') as string,
		email: formData.get('email') as string,
		isActive: formData.get('isActive') === 'true'
	};

	const slug = formData.get('slug') as string;
	if (slug) data.slug = slug;

	if (imageData) {
		data.image = imageData;
		data.image_mime_type = mimeType;
	}

	try {
		const ambassador = await updateAmbassador(id, data);
		if (!ambassador) {
			return json({ error: 'Ambassador not found' }, { status: 404 });
		}
		return json(ambassador);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		console.error('API PUT Error:', error);
		return json({ error: error.message || 'Server error' }, { status: 500 });
	}
};

export const DELETE: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { id } = await request.json();
	const success = await deleteAmbassador(id);
	if (!success) {
		return json({ error: 'Not found' }, { status: 404 });
	}
	return json({ success: true });
};
