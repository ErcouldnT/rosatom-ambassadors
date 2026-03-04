import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
	getUniversities,
	createUniversity,
	updateUniversity,
	deleteUniversity
} from '$lib/server/data';
import sharp from 'sharp';
import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';

const universitySchema = z.object({
	name_en: z.string().min(1),
	name_ru: z.string().min(1),
	city_en: z.string().optional().default(''),
	city_ru: z.string().optional().default(''),
	website: z.string().optional().default(''),
	founded: z.string().optional().default(''),
	student_count: z.coerce.number().optional(),
	intl_student_count: z.coerce.number().optional(),
	budget_places: z.coerce.number().optional(),
	program_count: z.coerce.number().optional()
});

export const GET: RequestHandler = async () => {
	const universities = await getUniversities();
	return json(universities);
};

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const formData = await request.formData();

		const rawData = {
			name_en: formData.get('name_en'),
			name_ru: formData.get('name_ru'),
			city_en: formData.get('city_en') || '',
			city_ru: formData.get('city_ru') || '',
			website: formData.get('website') || '',
			founded: formData.get('founded') || '',
			student_count: formData.get('student_count') || undefined,
			intl_student_count: formData.get('intl_student_count') || undefined,
			budget_places: formData.get('budget_places') || undefined,
			program_count: formData.get('program_count') || undefined
		};

		const validation = universitySchema.safeParse(rawData);
		if (!validation.success) {
			return json({ error: validation.error.issues[0].message }, { status: 400 });
		}

		const vData = validation.data;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const data: any = {
			name_en: DOMPurify.sanitize(vData.name_en),
			name_ru: DOMPurify.sanitize(vData.name_ru),
			city_en: DOMPurify.sanitize(vData.city_en),
			city_ru: DOMPurify.sanitize(vData.city_ru),
			website: DOMPurify.sanitize(vData.website),
			founded: DOMPurify.sanitize(vData.founded),
			student_count: vData.student_count || null,
			intl_student_count: vData.intl_student_count || null,
			budget_places: vData.budget_places || null,
			program_count: vData.program_count || null,
			image: null as Buffer | null,
			image_mime_type: null as string | null
		};

		const imageFile = formData.get('image') as File | null;
		if (imageFile && imageFile.size > 0) {
			const buffer = Buffer.from(await imageFile.arrayBuffer());
			data.image = await sharp(buffer)
				.resize(800, 600, { fit: 'inside', withoutEnlargement: true })
				.webp({ quality: 80 })
				.toBuffer();
			data.image_mime_type = 'image/webp';
		}

		const university = await createUniversity(data);
		if (!university) {
			return json({ error: 'Failed to create university' }, { status: 500 });
		}
		return json(university, { status: 201 });
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
			name_en: formData.get('name_en'),
			name_ru: formData.get('name_ru'),
			city_en: formData.get('city_en') || '',
			city_ru: formData.get('city_ru') || '',
			website: formData.get('website') || '',
			founded: formData.get('founded') || '',
			student_count: formData.get('student_count') || undefined,
			intl_student_count: formData.get('intl_student_count') || undefined,
			budget_places: formData.get('budget_places') || undefined,
			program_count: formData.get('program_count') || undefined
		};

		const validation = universitySchema.safeParse(rawData);
		if (!validation.success) {
			return json({ error: validation.error.issues[0].message }, { status: 400 });
		}

		const vData = validation.data;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const data: any = {
			name_en: DOMPurify.sanitize(vData.name_en),
			name_ru: DOMPurify.sanitize(vData.name_ru),
			city_en: DOMPurify.sanitize(vData.city_en),
			city_ru: DOMPurify.sanitize(vData.city_ru),
			website: DOMPurify.sanitize(vData.website),
			founded: DOMPurify.sanitize(vData.founded),
			student_count: vData.student_count || null,
			intl_student_count: vData.intl_student_count || null,
			budget_places: vData.budget_places || null,
			program_count: vData.program_count || null
		};

		const imageFile = formData.get('image') as File | null;
		if (imageFile && imageFile.size > 0) {
			const buffer = Buffer.from(await imageFile.arrayBuffer());
			data.image = await sharp(buffer)
				.resize(800, 600, { fit: 'inside', withoutEnlargement: true })
				.webp({ quality: 80 })
				.toBuffer();
			data.image_mime_type = 'image/webp';
		}

		const university = await updateUniversity(id, data);
		if (!university) {
			return json({ error: 'University not found' }, { status: 404 });
		}
		return json(university);
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
	const success = await deleteUniversity(id);
	if (!success) {
		return json({ error: 'Not found' }, { status: 404 });
	}
	return json({ success: true });
};
