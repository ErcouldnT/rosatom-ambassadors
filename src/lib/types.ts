export interface BaseModel {
	id: string;
	created: string;
	updated: string;
}

export interface Ambassador extends BaseModel {
	name_en: string;
	name_ru: string;
	country_en: string;
	country_ru: string;
	role_en: string;
	role_ru: string;
	image: string | Uint8Array | null;
	image_mime_type?: string | null;
	isActive: boolean;
}

export interface Event extends BaseModel {
	title_en: string;
	title_ru: string;
	date_day: string;
	date_month_en: string;
	date_month_ru: string;
	time: string;
	location_en: string;
	location_ru: string;
	description_en: string;
	description_ru: string;
	image: string | Uint8Array | null;
	image_mime_type?: string | null;
}

export interface NewsItem extends BaseModel {
	category_en: string;
	category_ru: string;
	date: string;
	title_en: string;
	title_ru: string;
	excerpt_en: string;
	excerpt_ru: string;
	image: string | Uint8Array | null;
	image_mime_type?: string | null;
}

export interface Stat extends BaseModel {
	key: string;
	value: string;
	label_en: string;
	label_ru: string;
	icon: string;
}

export interface Country extends BaseModel {
	name_en: string;
	name_ru: string;
	flag?: string; // emoji
	code?: string; // ISO 3166-1 alpha-2
	latitude?: string;
	longitude?: string;
}

export interface Ticker extends BaseModel {
	text_en: string;
	text_ru: string;
	isActive: boolean;
}
