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

async function main() {
	await seedAdmin();
	await seedStats();
	console.log('🎉 Seeding completed!');
}

main();
