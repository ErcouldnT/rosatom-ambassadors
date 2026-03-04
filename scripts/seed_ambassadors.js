import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from '../src/lib/server/db/schema.ts';
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

const SAMPLE_AMBASSADORS = [
	{ name_en: 'John Doe', name_ru: 'Иван Иванов', role_en: 'Student', role_ru: 'Студент' },
	{ name_en: 'Jane Smith', name_ru: 'Анна Смирнова', role_en: 'Professor', role_ru: 'Профессор' },
	{ name_en: 'Michael Johnson', name_ru: 'Михаил Петров', role_en: 'Engineer', role_ru: 'Инженер' },
	{
		name_en: 'Sarah Williams',
		name_ru: 'Сара Вильямс',
		role_en: 'Researcher',
		role_ru: 'Исследователь'
	},
	{ name_en: 'David Brown', name_ru: 'Дмитрий Козлов', role_en: 'Manager', role_ru: 'Менеджер' },
	{
		name_en: 'Emily Davis',
		name_ru: 'Елена Соколова',
		role_en: 'Coordinator',
		role_ru: 'Координатор'
	},
	{
		name_en: 'Daniel Miller',
		name_ru: 'Даниил Морозов',
		role_en: 'Specialist',
		role_ru: 'Специалист'
	},
	{ name_en: 'Jessica Wilson', name_ru: 'Юлия Волкова', role_en: 'Director', role_ru: 'Директор' },
	{
		name_en: 'Christopher Moore',
		name_ru: 'Кристофер Мур',
		role_en: 'Consultant',
		role_ru: 'Консультант'
	},
	{
		name_en: 'Amanda Taylor',
		name_ru: 'Аманда Тейлор',
		role_en: 'Developer',
		role_ru: 'Разработчик'
	},
	{
		name_en: 'Matthew Anderson',
		name_ru: 'Матвей Андреев',
		role_en: 'Analyst',
		role_ru: 'Аналитик'
	},
	{ name_en: 'Laura Thomas', name_ru: 'Лариса Томина', role_en: 'Scientist', role_ru: 'Ученый' },
	{
		name_en: 'Robert Jackson',
		name_ru: 'Роберт Джексон',
		role_en: 'Technician',
		role_ru: 'Техник'
	},
	{ name_en: 'Sophia White', name_ru: 'София Вайт', role_en: 'Expert', role_ru: 'Эксперт' },
	{
		name_en: 'James Harris',
		name_ru: 'Джеймс Харрис',
		role_en: 'Head of Dept',
		role_ru: 'Глава отдела'
	},
	{ name_en: 'Olivia Martin', name_ru: 'Оливия Мартин', role_en: 'Intern', role_ru: 'Интерн' },
	{
		name_en: 'William Thompson',
		name_ru: 'Вильям Томпсон',
		role_en: 'Volunteer',
		role_ru: 'Волонтер'
	},
	{
		name_en: 'Isabella Garcia',
		name_ru: 'Изабелла Гарсия',
		role_en: 'Member',
		role_ru: 'Участник'
	},
	{ name_en: 'Ethan Martinez', name_ru: 'Итан Мартинез', role_en: 'Alumni', role_ru: 'Выпускник' },
	{
		name_en: 'Mia Robinson',
		name_ru: 'Мия Робинсон',
		role_en: 'Representative',
		role_ru: 'Представитель'
	}
];

async function seedAmbassadors() {
	console.log('🌱 Seeding ambassadors...');
	try {
		// Clear existing ambassadors to avoid duplicates and remove old data
		await db.delete(schema.ambassadors);
		console.log('🗑️ Cleared existing ambassadors.');

		// Fetch all countries to assign ambassadors to them
		const countries = await db.select().from(schema.countries);
		if (countries.length === 0) {
			console.error('❌ No countries found! Please run the main seed script first.');
			return;
		}

		console.log(`Found ${countries.length} countries. Distributing ambassadors...`);

		// Shuffle countries to randomize distribution
		const shuffledCountries = countries.sort(() => 0.5 - Math.random());

		let totalAmbassadors = 0;
		const MAX_AMBASSADORS = 50;

		for (const country of shuffledCountries) {
			if (totalAmbassadors >= MAX_AMBASSADORS) break;

			console.log(`🌱 Seeding ambassadors for ${country.name_en}...`);

			// Generate 1-3 random ambassadors for this country, but don't exceed MAX_AMBASSADORS
			let count = Math.floor(Math.random() * 3) + 1;
			if (totalAmbassadors + count > MAX_AMBASSADORS) {
				count = MAX_AMBASSADORS - totalAmbassadors;
			}

			for (let i = 0; i < count; i++) {
				const sample = SAMPLE_AMBASSADORS[Math.floor(Math.random() * SAMPLE_AMBASSADORS.length)];

				// Fetch a random placeholder image
				let imageBuffer = null;
				let mimeType = 'image/jpeg';
				try {
					// Use a random image to ensure variety
					const response = await fetch(`https://picsum.photos/400/400?random=${Math.random()}`);
					const arrayBuffer = await response.arrayBuffer();
					imageBuffer = Buffer.from(arrayBuffer);
				} catch (imgError) {
					console.warn('Failed to fetch placeholder image for ambassador:', imgError);
				}

				const shouldHaveAwards = Math.random() < 0.15;
				const awards = shouldHaveAwards
					? Array.from({ length: Math.floor(Math.random() * 2) + 1 }, () => {
							const awardOptions = [
								{ title_en: 'Best Ambassador of the Year', title_ru: 'Лучший амбассадор года' },
								{
									title_en: 'Outstanding Research Contribution',
									title_ru: 'Выдающийся вклад в исследования'
								},
								{
									title_en: 'International Cooperation Award',
									title_ru: 'Награда за международное сотрудничество'
								},
								{
									title_en: 'Nuclear Science Excellence',
									title_ru: 'Награда за достижения в ядерной науке'
								},
								{
									title_en: 'Community Leadership Award',
									title_ru: 'Награда за лидерство в сообществе'
								}
							];
							const award = awardOptions[Math.floor(Math.random() * awardOptions.length)];
							return { ...award, year: String(2022 + Math.floor(Math.random() * 4)) };
						})
					: [];

				await db.insert(schema.ambassadors).values({
					id: crypto.randomUUID(),
					slug: `${sample.name_en.toLowerCase().replace(/\s+/g, '-')}-${Math.random().toString(36).substring(2, 6)}`,
					name_en: `${sample.name_en}`,
					name_ru: `${sample.name_ru}`,
					country_id: country.id,
					country_en: country.name_en,
					country_ru: country.name_ru,
					role_en: sample.role_en,
					role_ru: sample.role_ru,
					image: imageBuffer,
					image_mime_type: mimeType,
					isAlumni: Math.random() < 0.2,
					awards_json: awards.length > 0 ? JSON.stringify(awards) : null
				});
			}
			totalAmbassadors += count;
			console.log(
				`✅ Added ${count} ambassadors for ${country.name_en} (Total: ${totalAmbassadors})`
			);
		}
		console.log(`🎉 Finished seeding. Total ambassadors seeded: ${totalAmbassadors}`);
	} catch (error) {
		console.error('❌ Failed to seed ambassadors:', error);
	}
}

async function main() {
	await seedAmbassadors();
}

main();
