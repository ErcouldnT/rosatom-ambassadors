export interface Ambassador {
	id: string;
	name_en: string;
	name_ru: string;
	country_en: string;
	country_ru: string;
	role_en: string;
	role_ru: string;
	image: string;
	isActive: boolean;
}

export interface Event {
	id: string;
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

export interface NewsItem {
	id: string;
	category_en: string;
	category_ru: string;
	date: string;
	title_en: string;
	title_ru: string;
	excerpt_en: string;
	excerpt_ru: string;
	image: string;
}

export interface Stat {
	id: string;
	key: string;
	value: string;
	label_en: string;
	label_ru: string;
	icon: string;
}

export interface Country {
	id: string;
	name_en: string;
	name_ru: string;
	flag: string;
}

export interface Ticker {
	id: string;
	text_en: string;
	text_ru: string;
	isActive: boolean;
}
