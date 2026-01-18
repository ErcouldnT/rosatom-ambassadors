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
import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';

const ambassadorSchema = z.object({
	name_en: z.string().min(1),
	name_ru: z.string().min(1),
	slug: z.string().optional(),
	email: z.string().email().optional().or(z.literal('')),
	country_en: z.string().min(1),
	country_ru: z.string().min(1),
	role_en: z.string().min(1),
	role_ru: z.string().min(1),
	about_en: z.string().optional().default(''),
	about_ru: z.string().optional().default(''),
	contributions_en: z.string().optional().default(''),
	contributions_ru: z.string().optional().default(''),
	isActive: z.union([z.boolean(), z.string().transform((val) => val === 'true')]).default(true)
});

export const GET: RequestHandler = async () => {
	const ambassadors = await getAmbassadors(false);
	return json(ambassadors);
};

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const formData = await request.formData();

		// Parse and validate fields
		const rawData = {
			name_en: formData.get('name_en'),
			name_ru: formData.get('name_ru'),
			slug: formData.get('slug') || undefined,
			email: formData.get('email') || '',
			country_en: formData.get('country_en'),
			country_ru: formData.get('country_ru'),
			role_en: formData.get('role_en'),
			role_ru: formData.get('role_ru'),
			about_en: formData.get('about_en'),
			about_ru: formData.get('about_ru'),
			contributions_en: formData.get('contributions_en'),
			contributions_ru: formData.get('contributions_ru'),
			isActive: formData.get('isActive')
		};

		const validation = ambassadorSchema.safeParse(rawData);

		if (!validation.success) {
			return json({ error: validation.error.issues[0].message }, { status: 400 });
		}

		const vData = validation.data;

		// Sanitize inputs
		const data = {
			name_en: DOMPurify.sanitize(vData.name_en),
			name_ru: DOMPurify.sanitize(vData.name_ru),
			slug: vData.slug
				? DOMPurify.sanitize(vData.slug)
				: slugify(vData.name_en, { lower: true, strict: true }),
			email: DOMPurify.sanitize(vData.email || ''),
			country_en: DOMPurify.sanitize(vData.country_en),
			country_ru: DOMPurify.sanitize(vData.country_ru),
			role_en: DOMPurify.sanitize(vData.role_en),
			role_ru: DOMPurify.sanitize(vData.role_ru),
			about_en: DOMPurify.sanitize(vData.about_en),
			about_ru: DOMPurify.sanitize(vData.about_ru),
			contributions_en: DOMPurify.sanitize(vData.contributions_en),
			contributions_ru: DOMPurify.sanitize(vData.contributions_ru),
			isActive: vData.isActive,
			image: null as Buffer | null,
			image_mime_type: null as string | null
		};

		// Handle Image
		const imageFile = formData.get('image') as File | null;
		if (imageFile && imageFile.size > 0) {
			const buffer = Buffer.from(await imageFile.arrayBuffer());
			data.image = await sharp(buffer)
				.resize(800, 800, { fit: 'inside', withoutEnlargement: true })
				.webp({ quality: 80 })
				.toBuffer();
			data.image_mime_type = 'image/webp';
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const ambassador = await createAmbassador(data as any);
		if (!ambassador) {
			return json({ error: 'Failed to create ambassador' }, { status: 500 });
		}
		return json(ambassador, { status: 201 });
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

		// Parse and validate fields
		const rawData = {
			name_en: formData.get('name_en'),
			name_ru: formData.get('name_ru'),
			slug: formData.get('slug') || undefined,
			email: formData.get('email') || '',
			country_en: formData.get('country_en'),
			country_ru: formData.get('country_ru'),
			role_en: formData.get('role_en'),
			role_ru: formData.get('role_ru'),
			about_en: formData.get('about_en'),
			about_ru: formData.get('about_ru'),
			contributions_en: formData.get('contributions_en'),
			contributions_ru: formData.get('contributions_ru'),
			isActive: formData.get('isActive')
		};

		const validation = ambassadorSchema.safeParse(rawData);

		if (!validation.success) {
			return json({ error: validation.error.issues[0].message }, { status: 400 });
		}

		const vData = validation.data;

		// Sanitize inputs
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const data: any = {
			name_en: DOMPurify.sanitize(vData.name_en),
			name_ru: DOMPurify.sanitize(vData.name_ru),
			country_en: DOMPurify.sanitize(vData.country_en),
			country_ru: DOMPurify.sanitize(vData.country_ru),
			role_en: DOMPurify.sanitize(vData.role_en),
			role_ru: DOMPurify.sanitize(vData.role_ru),
			about_en: DOMPurify.sanitize(vData.about_en),
			about_ru: DOMPurify.sanitize(vData.about_ru),
			contributions_en: DOMPurify.sanitize(vData.contributions_en),
			contributions_ru: DOMPurify.sanitize(vData.contributions_ru),
			isActive: vData.isActive,
			email: DOMPurify.sanitize(vData.email || '')
		};

		if (vData.slug) {
			data.slug = DOMPurify.sanitize(vData.slug);
		}

		// Handle Image
		const imageFile = formData.get('image') as File | null;
		if (imageFile && imageFile.size > 0) {
			const buffer = Buffer.from(await imageFile.arrayBuffer());
			data.image = await sharp(buffer)
				.resize(800, 800, { fit: 'inside', withoutEnlargement: true })
				.webp({ quality: 80 })
				.toBuffer();
			data.image_mime_type = 'image/webp';
		}

		const ambassador = await updateAmbassador(id, data);
		if (!ambassador) {
			return json({ error: 'Ambassador not found' }, { status: 404 });
		}
		return json(ambassador);
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
	const success = await deleteAmbassador(id);
	if (!success) {
		return json({ error: 'Not found' }, { status: 404 });
	}
	return json({ success: true });
};
