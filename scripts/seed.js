import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from '../src/lib/server/db/schema.ts';
import { eq } from 'drizzle-orm';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const client = createClient({
	url: process.env.TURSO_CONNECTION_URL,
	authToken: process.env.TURSO_AUTH_TOKEN
});

const db = drizzle(client, { schema });

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'adminpassword123';

const STATS_DATA = [
	{
		key: 'members',
		value: '150+',
		label_en: 'Active Members',
		label_ru: 'Активных Участников',
		icon: 'Users'
	},
	{
		key: 'countries',
		value: '28+',
		label_en: 'Countries',
		label_ru: 'Стран',
		icon: 'Globe'
	},
	{
		key: 'events',
		value: '45+',
		label_en: 'Events Held',
		label_ru: 'Проведенных Событий',
		icon: 'Calendar'
	},
	{
		key: 'universities',
		value: '12',
		label_en: 'Universities',
		label_ru: 'Университетов',
		icon: 'GraduationCap'
	}
];

// Countries with capital city coordinates for map display
const COUNTRIES_DATA = [
	{
		name_en: 'Russia',
		name_ru: 'Россия',
		code: 'RU',
		flag: '🇷🇺',
		latitude: '55.7558',
		longitude: '37.6173'
	},
	{
		name_en: 'Turkey',
		name_ru: 'Турция',
		code: 'TR',
		flag: '🇹🇷',
		latitude: '39.9334',
		longitude: '32.8597'
	},
	{
		name_en: 'Egypt',
		name_ru: 'Египет',
		code: 'EG',
		flag: '🇪🇬',
		latitude: '30.0444',
		longitude: '31.2357'
	},
	{
		name_en: 'Bangladesh',
		name_ru: 'Бангладеш',
		code: 'BD',
		flag: '🇧🇩',
		latitude: '23.8103',
		longitude: '90.4125'
	},
	{
		name_en: 'India',
		name_ru: 'Индия',
		code: 'IN',
		flag: '🇮🇳',
		latitude: '28.6139',
		longitude: '77.2090'
	},
	{
		name_en: 'Vietnam',
		name_ru: 'Вьетнам',
		code: 'VN',
		flag: '🇻🇳',
		latitude: '21.0285',
		longitude: '105.8542'
	},
	{
		name_en: 'China',
		name_ru: 'Китай',
		code: 'CN',
		flag: '🇨🇳',
		latitude: '39.9042',
		longitude: '116.4074'
	},
	{
		name_en: 'Brazil',
		name_ru: 'Бразилия',
		code: 'BR',
		flag: '🇧🇷',
		latitude: '-15.8267',
		longitude: '-47.9218'
	},
	{
		name_en: 'South Africa',
		name_ru: 'ЮАР',
		code: 'ZA',
		flag: '🇿🇦',
		latitude: '-25.7461',
		longitude: '28.1881'
	},
	{
		name_en: 'Nigeria',
		name_ru: 'Нигерия',
		code: 'NG',
		flag: '🇳🇬',
		latitude: '9.0765',
		longitude: '7.3986'
	},
	{
		name_en: 'Kazakhstan',
		name_ru: 'Казахстан',
		code: 'KZ',
		flag: '🇰🇿',
		latitude: '51.1605',
		longitude: '71.4704'
	},
	{
		name_en: 'Belarus',
		name_ru: 'Беларусь',
		code: 'BY',
		flag: '🇧🇾',
		latitude: '53.9006',
		longitude: '27.5590'
	},
	{
		name_en: 'Armenia',
		name_ru: 'Армения',
		code: 'AM',
		flag: '🇦🇲',
		latitude: '40.1792',
		longitude: '44.4991'
	},
	{
		name_en: 'Uzbekistan',
		name_ru: 'Узбекистан',
		code: 'UZ',
		flag: '🇺🇿',
		latitude: '41.2995',
		longitude: '69.2401'
	},
	{
		name_en: 'Tajikistan',
		name_ru: 'Таджикистан',
		code: 'TJ',
		flag: '🇹🇯',
		latitude: '38.5598',
		longitude: '68.7738'
	},
	{
		name_en: 'Kyrgyzstan',
		name_ru: 'Кыргызстан',
		code: 'KG',
		flag: '🇰🇬',
		latitude: '42.8746',
		longitude: '74.5698'
	},
	{
		name_en: 'Mongolia',
		name_ru: 'Монголия',
		code: 'MN',
		flag: '🇲🇳',
		latitude: '47.8864',
		longitude: '106.9057'
	},
	{
		name_en: 'Iran',
		name_ru: 'Иран',
		code: 'IR',
		flag: '🇮🇷',
		latitude: '35.6892',
		longitude: '51.3890'
	},
	{
		name_en: 'Pakistan',
		name_ru: 'Пакистан',
		code: 'PK',
		flag: '🇵🇰',
		latitude: '33.6844',
		longitude: '73.0479'
	},
	{
		name_en: 'Indonesia',
		name_ru: 'Индонезия',
		code: 'ID',
		flag: '🇮🇩',
		latitude: '-6.2088',
		longitude: '106.8456'
	},
	{
		name_en: 'Philippines',
		name_ru: 'Филиппины',
		code: 'PH',
		flag: '🇵🇭',
		latitude: '14.5995',
		longitude: '120.9842'
	},
	{
		name_en: 'Thailand',
		name_ru: 'Таиланд',
		code: 'TH',
		flag: '🇹🇭',
		latitude: '13.7563',
		longitude: '100.5018'
	},
	{
		name_en: 'Malaysia',
		name_ru: 'Малайзия',
		code: 'MY',
		flag: '🇲🇾',
		latitude: '3.1390',
		longitude: '101.6869'
	},
	{
		name_en: 'Sri Lanka',
		name_ru: 'Шри-Ланка',
		code: 'LK',
		flag: '🇱🇰',
		latitude: '6.9271',
		longitude: '79.8612'
	},
	{
		name_en: 'Nepal',
		name_ru: 'Непал',
		code: 'NP',
		flag: '🇳🇵',
		latitude: '27.7172',
		longitude: '85.3240'
	},
	{
		name_en: 'Ethiopia',
		name_ru: 'Эфиопия',
		code: 'ET',
		flag: '🇪🇹',
		latitude: '9.0320',
		longitude: '38.7469'
	},
	{
		name_en: 'Kenya',
		name_ru: 'Кения',
		code: 'KE',
		flag: '🇰🇪',
		latitude: '-1.2921',
		longitude: '36.8219'
	},
	{
		name_en: 'Ghana',
		name_ru: 'Гана',
		code: 'GH',
		flag: '🇬🇭',
		latitude: '5.6037',
		longitude: '-0.1870'
	},
	{
		name_en: 'Morocco',
		name_ru: 'Марокко',
		code: 'MA',
		flag: '🇲🇦',
		latitude: '34.0209',
		longitude: '-6.8416'
	},
	{
		name_en: 'Algeria',
		name_ru: 'Алжир',
		code: 'DZ',
		flag: '🇩🇿',
		latitude: '36.7538',
		longitude: '3.0588'
	}
];

async function seedAdmin() {
	console.log('🌱 Seeding admin user...');
	try {
		const existing = await db
			.select()
			.from(schema.user)
			.where(eq(schema.user.username, ADMIN_EMAIL))
			.get();
		if (existing) {
			console.log('Admin user already exists. Updating password...');
			await db
				.update(schema.user)
				.set({ password_hash: ADMIN_PASSWORD })
				.where(eq(schema.user.id, existing.id));
			console.log('✅ Admin password updated.');
		} else {
			await db.insert(schema.user).values({
				id: crypto.randomUUID(),
				username: ADMIN_EMAIL,
				password_hash: ADMIN_PASSWORD
			});
			console.log(`✅ Admin user created: ${ADMIN_EMAIL}`);
		}
	} catch (error) {
		console.error('❌ Failed to seed admin:', error);
	}
}

async function seedStats() {
	console.log('🌱 Seeding stats...');
	try {
		for (const stat of STATS_DATA) {
			const existing = await db
				.select()
				.from(schema.stats)
				.where(eq(schema.stats.key, stat.key))
				.get();
			if (existing) {
				console.log(`Stat "${stat.key}" already exists. Skipping.`);
			} else {
				await db.insert(schema.stats).values({
					id: crypto.randomUUID(),
					...stat
				});
				console.log(`✅ Created stat: ${stat.key}`);
			}
		}
	} catch (error) {
		console.error('❌ Failed to seed stats:', error);
	}
}

async function seedCountries() {
	console.log('🌱 Seeding countries...');
	try {
		for (const country of COUNTRIES_DATA) {
			const existing = await db
				.select()
				.from(schema.countries)
				.where(eq(schema.countries.code, country.code))
				.get();
			if (existing) {
				console.log(`Country "${country.name_en}" already exists. Skipping.`);
			} else {
				await db.insert(schema.countries).values({
					id: crypto.randomUUID(),
					...country
				});
				console.log(`✅ Created country: ${country.name_en} ${country.flag}`);
			}
		}
	} catch (error) {
		console.error('❌ Failed to seed countries:', error);
	}
}

const EVENTS_DATA = [
	{
		title_en: 'Global Nuclear Education Summit 2024',
		title_ru: 'Глобальный саммит по ядерному образованию 2024',
		date_day: '15',
		date_month_en: 'Aug',
		date_month_ru: 'Авг',
		time: '10:00 AM - 4:00 PM',
		location_en: 'Moscow, Russia',
		location_ru: 'Москва, Россия',
		description_en:
			'Join us for the annual summit bringing together leading experts in nuclear education.',
		description_ru:
			'Присоединяйтесь к ежегодному саммиту, собирающему ведущих экспертов в области ядерного образования.'
	},
	{
		title_en: 'International Student Exchange Forum',
		title_ru: 'Международный форум студенческого обмена',
		date_day: '22',
		date_month_en: 'Sep',
		date_month_ru: 'Сен',
		time: '09:00 AM - 6:00 PM',
		location_en: 'Istanbul, Turkey',
		location_ru: 'Стамбул, Турция',
		description_en:
			'A platform for students to share experiences and opportunities in nuclear studies.',
		description_ru:
			'Платформа для студентов для обмена опытом и возможностями в области ядерных исследований.'
	},
	{
		title_en: 'Sustainable Energy Workshop',
		title_ru: 'Воркшоп по устойчивой энергетике',
		date_day: '05',
		date_month_en: 'Oct',
		date_month_ru: 'Окт',
		time: '11:00 AM - 3:00 PM',
		location_en: 'Cairo, Egypt',
		location_ru: 'Каир, Египет',
		description_en:
			'Hands-on workshop focusing on the role of nuclear energy in sustainable development.',
		description_ru: 'Практический семинар, посвященный роли ядерной энергии в устойчивом развитии.'
	}
];

const NEWS_DATA = [
	{
		category_en: 'Education',
		category_ru: 'Образование',
		date: 'July 28, 2024',
		title_en: 'New Scholarship Opportunities Announced',
		title_ru: 'Объявлены новые возможности получения стипендий',
		excerpt_en: 'RNE Ambassadors launches a new scholarship program for international students.',
		excerpt_ru:
			'RNE Ambassadors запускает новую стипендиальную программу для иностранных студентов.'
	},
	{
		category_en: 'Technology',
		category_ru: 'Технологии',
		date: 'August 10, 2024',
		title_en: 'Advances in Nuclear Safety Systems',
		title_ru: 'Достижения в системах ядерной безопасности',
		excerpt_en: 'Recent developments ensuring the highest standards of safety in modern reactors.',
		excerpt_ru:
			'Последние разработки, обеспечивающие высочайшие стандарты безопасности в современных реакторах.'
	},
	{
		category_en: 'Community',
		category_ru: 'Сообщество',
		date: 'August 15, 2024',
		title_en: 'Ambassador Meetup in Latin America',
		title_ru: 'Встреча амбассадоров в Латинской Америке',
		excerpt_en: 'Our ambassadors gathered in Brazil to discuss regional initiatives.',
		excerpt_ru: 'Наши амбассадоры собрались в Бразилии, чтобы обсудить региональные инициативы.'
	}
];

async function seedEvents() {
	console.log('🌱 Seeding events...');
	try {
		// Optional: Clear existing events to avoid duplicates if running multiple times without unique constraints
		// await db.delete(schema.events);

		for (const event of EVENTS_DATA) {
			const existing = await db
				.select()
				.from(schema.events)
				.where(eq(schema.events.title_en, event.title_en))
				.get();

			if (existing) {
				console.log(`Event "${event.title_en}" already exists. Skipping.`);
			} else {
				// Fetch a random placeholder image
				let imageBuffer = null;
				let mimeType = 'image/jpeg';
				try {
					const response = await fetch('https://picsum.photos/800/600');
					const arrayBuffer = await response.arrayBuffer();
					imageBuffer = Buffer.from(arrayBuffer);
				} catch (imgError) {
					console.warn('Failed to fetch placeholder image for event:', imgError);
				}

				await db.insert(schema.events).values({
					id: crypto.randomUUID(),
					...event,
					image: imageBuffer,
					image_mime_type: mimeType
				});
				console.log(`✅ Created event: ${event.title_en}`);
			}
		}
	} catch (error) {
		console.error('❌ Failed to seed events:', error);
	}
}

async function seedNews() {
	console.log('🌱 Seeding news...');
	try {
		// Optional: Clear existing news
		// await db.delete(schema.news);

		for (const item of NEWS_DATA) {
			const existing = await db
				.select()
				.from(schema.news)
				.where(eq(schema.news.title_en, item.title_en))
				.get();

			if (existing) {
				console.log(`News "${item.title_en}" already exists. Skipping.`);
			} else {
				// Fetch a random placeholder image
				let imageBuffer = null;
				let mimeType = 'image/jpeg';
				try {
					const response = await fetch('https://picsum.photos/800/600');
					const arrayBuffer = await response.arrayBuffer();
					imageBuffer = Buffer.from(arrayBuffer);
				} catch (imgError) {
					console.warn('Failed to fetch placeholder image for news:', imgError);
				}

				await db.insert(schema.news).values({
					id: crypto.randomUUID(),
					...item,
					image: imageBuffer,
					image_mime_type: mimeType
				});
				console.log(`✅ Created news: ${item.title_en}`);
			}
		}
	} catch (error) {
		console.error('❌ Failed to seed news:', error);
	}
}

async function main() {
	await seedAdmin();
	await seedStats();
	await seedCountries();
	await seedEvents();
	await seedNews();
	console.log('🎉 Seeding completed!');
}

main();
