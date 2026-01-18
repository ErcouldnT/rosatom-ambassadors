import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import fs from 'fs';
import * as schema from '../src/lib/server/db/schema.ts';
import { eq } from 'drizzle-orm';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Argon2id } from 'oslo/password';

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
// Load countries from the generated JSON file
const COUNTRIES_DATA = JSON.parse(
	fs.readFileSync(path.resolve(__dirname, '../src/lib/data/countries.json'), 'utf-8')
);

async function _seedAdmin() {
	console.log('🌱 Seeding admin user...');
	try {
		const argon2id = new Argon2id();
		const hashedPassword = await argon2id.hash(ADMIN_PASSWORD);

		const existing = await db
			.select()
			.from(schema.user)
			.where(eq(schema.user.username, ADMIN_EMAIL))
			.get();
		if (existing) {
			console.log('Admin user already exists. Updating password...');
			await db
				.update(schema.user)
				.set({ password_hash: hashedPassword })
				.where(eq(schema.user.id, existing.id));
			console.log('✅ Admin password updated (hashed).');
		} else {
			await db.insert(schema.user).values({
				id: crypto.randomUUID(),
				username: ADMIN_EMAIL,
				password_hash: hashedPassword
			});
			console.log(`✅ Admin user created: ${ADMIN_EMAIL}`);
		}
	} catch (error) {
		console.error('❌ Failed to seed admin:', error);
	}
}

async function _seedStats() {
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

async function _seedCountries() {
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

async function _seedEvents() {
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

async function _seedNews() {
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

const TICKER_DATA = [
	{ text_en: 'Global Nuclear Education', text_ru: 'Глобальное Ядерное Образование', icon: 'Globe' },
	{ text_en: 'Sustainable Energy', text_ru: 'Устойчивая Энергетика', icon: 'Zap' },
	{
		text_en: 'International Cooperation',
		text_ru: 'Международное Сотрудничество',
		icon: 'Handshake'
	},
	{ text_en: 'Rosatom', text_ru: 'Росатом', icon: 'Atom' },
	{ text_en: 'MEPhI', text_ru: 'НИЯУ МИФИ', icon: 'GraduationCap' },
	{ text_en: 'MPEI', text_ru: 'МЭИ', icon: 'Radiation' },
	{ text_en: 'Tomsk Polytechnic', text_ru: 'Томский Политех', icon: 'BookOpen' }
];

async function _seedTickers() {
	console.log('🌱 Seeding tickers...');
	try {
		for (const item of TICKER_DATA) {
			const existing = await db
				.select()
				.from(schema.tickers)
				.where(eq(schema.tickers.text_en, item.text_en))
				.get();

			if (existing) {
				console.log(`Ticker "${item.text_en}" already exists. Skipping.`);
			} else {
				await db.insert(schema.tickers).values({
					id: crypto.randomUUID(),
					...item
				});
				console.log(`✅ Created ticker: ${item.text_en}`);
			}
		}
	} catch (error) {
		console.error('❌ Failed to seed tickers:', error);
	}
}

async function main() {
	// await _seedAdmin();
	// await _seedStats();
	// await _seedCountries();
	// await _seedEvents();
	// await _seedNews();
	// await _seedTickers();
	console.log('🎉 Seeding completed!');
}

main();
