export interface PocketBaseModel {
	id: string;
	collectionId: string;
	collectionName: string;
	created: string;
	updated: string;
}

export interface Ambassador extends PocketBaseModel {
	name_en: string;
	name_ru: string;
	country_en: string;
	country_ru: string;
	role_en: string;
	role_ru: string;
	image: string;
	isActive: boolean;
}

export interface Event extends PocketBaseModel {
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
	image: string;
}

export interface NewsItem extends PocketBaseModel {
	category_en: string;
	category_ru: string;
	date: string;
	title_en: string;
	title_ru: string;
	excerpt_en: string;
	excerpt_ru: string;
	image: string;
}

export interface Stat extends PocketBaseModel {
	key: string;
	value: string;
	label_en: string;
	label_ru: string;
	icon: string;
}

export interface Country extends PocketBaseModel {
	name_en: string;
	name_ru: string;
	flag_emoji: string;
}

export interface Ticker extends PocketBaseModel {
	text_en: string;
	text_ru: string;
	isActive: boolean;
}
