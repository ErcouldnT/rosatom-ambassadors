import { sqliteTable, text, integer, blob } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	username: text('username').notNull().unique(),
	password_hash: text('password_hash').notNull()
});

export const session = sqliteTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: integer('expires_at').notNull()
});

export const ambassadors = sqliteTable('ambassadors', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	slug: text('slug').unique(),
	email: text('email'),
	name_en: text('name_en').notNull(),
	name_ru: text('name_ru').notNull(),
	country_id: text('country_id').references(() => countries.id),
	country_en: text('country_en').notNull(),
	country_ru: text('country_ru').notNull(),
	role_en: text('role_en').notNull(),
	role_ru: text('role_ru').notNull(),
	about_en: text('about_en'),
	about_ru: text('about_ru'),
	contributions_en: text('contributions_en'),
	contributions_ru: text('contributions_ru'),
	image: blob('image'), // Binary data
	image_mime_type: text('image_mime_type'), // e.g. image/webp
	isActive: integer('is_active', { mode: 'boolean' }).default(true),
	created: text('created').default(sql`CURRENT_TIMESTAMP`),
	updated: text('updated').default(sql`CURRENT_TIMESTAMP`)
});

export const events = sqliteTable('events', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	slug: text('slug').unique(),
	title_en: text('title_en').notNull(),
	title_ru: text('title_ru').notNull(),
	date_day: text('date_day').notNull(),
	date_month_en: text('date_month_en').notNull(),
	date_month_ru: text('date_month_ru').notNull(),
	time: text('time').notNull(),
	location_en: text('location_en').notNull(),
	location_ru: text('location_ru').notNull(),
	description_en: text('description_en'),
	description_ru: text('description_ru'),
	image: blob('image'), // Binary data
	image_mime_type: text('image_mime_type'),
	created: text('created').default(sql`CURRENT_TIMESTAMP`),
	updated: text('updated').default(sql`CURRENT_TIMESTAMP`)
});

export const news = sqliteTable('news', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	slug: text('slug').unique(),
	category_en: text('category_en').notNull(),
	category_ru: text('category_ru').notNull(),
	date: text('date').notNull(),
	title_en: text('title_en').notNull(),
	title_ru: text('title_ru').notNull(),
	excerpt_en: text('excerpt_en'),
	excerpt_ru: text('excerpt_ru'),
	image: blob('image'), // Binary data
	image_mime_type: text('image_mime_type'),
	created: text('created').default(sql`CURRENT_TIMESTAMP`),
	updated: text('updated').default(sql`CURRENT_TIMESTAMP`)
});

export const stats = sqliteTable('stats', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	key: text('key').notNull(),
	value: text('value').notNull(),
	label_en: text('label_en').notNull(),
	label_ru: text('label_ru').notNull(),
	icon: text('icon'),
	created: text('created').default(sql`CURRENT_TIMESTAMP`),
	updated: text('updated').default(sql`CURRENT_TIMESTAMP`)
});

export const countries = sqliteTable('countries', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name_en: text('name_en').notNull(),
	name_ru: text('name_ru').notNull(),
	flag: text('flag'), // emoji
	code: text('code'), // ISO 3166-1 alpha-2 (e.g. "RU", "TR")
	latitude: text('latitude'), // e.g. "55.7558"
	longitude: text('longitude'), // e.g. "37.6173"
	created: text('created').default(sql`CURRENT_TIMESTAMP`),
	updated: text('updated').default(sql`CURRENT_TIMESTAMP`)
});

export const tickers = sqliteTable('tickers', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	text_en: text('text_en').notNull(),
	text_ru: text('text_ru').notNull(),
	icon: text('icon'), // Lucide icon name
	isActive: integer('is_active', { mode: 'boolean' }).default(true),
	created: text('created').default(sql`CURRENT_TIMESTAMP`),
	updated: text('updated').default(sql`CURRENT_TIMESTAMP`)
});
