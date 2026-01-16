import PocketBase from 'pocketbase';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const POCKETBASE_URL = process.env.POCKETBASE_URL || 'http://localhost:8090';
const ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD || 'adminpassword123';

const pb = new PocketBase(POCKETBASE_URL);

// Collection definitions for PocketBase v0.23+
// Note: "schema" renamed to "fields"
// Collection definitions for PocketBase v0.23+
// Note: "schema" renamed to "fields"
const collections = [
	{
		name: 'ambassadors',
		type: 'base',
		fields: [
			{ name: 'name_en', type: 'text', required: true },
			{ name: 'name_ru', type: 'text', required: true },
			{ name: 'country_en', type: 'text', required: true },
			{ name: 'country_ru', type: 'text', required: true },
			{ name: 'role_en', type: 'text', required: true },
			{ name: 'role_ru', type: 'text', required: true },
			{
				name: 'image',
				type: 'file',
				required: false,
				maxSelect: 1,
				maxSize: 5242880,
				mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
			},
			{ name: 'isActive', type: 'bool', required: false }
		],
		listRule: '',
		viewRule: '',
		createRule: null,
		updateRule: null,
		deleteRule: null
	},
	{
		name: 'events',
		type: 'base',
		fields: [
			{ name: 'title_en', type: 'text', required: true },
			{ name: 'title_ru', type: 'text', required: true },
			{ name: 'date_day', type: 'text', required: true },
			{ name: 'date_month_en', type: 'text', required: true },
			{ name: 'date_month_ru', type: 'text', required: true },
			{ name: 'time', type: 'text', required: true },
			{ name: 'location_en', type: 'text', required: true },
			{ name: 'location_ru', type: 'text', required: true },
			{ name: 'description_en', type: 'text', required: false },
			{ name: 'description_ru', type: 'text', required: false },
			{
				name: 'image',
				type: 'file',
				required: false,
				maxSelect: 1,
				maxSize: 5242880,
				mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
			}
		],
		listRule: '',
		viewRule: '',
		createRule: null,
		updateRule: null,
		deleteRule: null
	},
	{
		name: 'news',
		type: 'base',
		fields: [
			{ name: 'category_en', type: 'text', required: true },
			{ name: 'category_ru', type: 'text', required: true },
			{ name: 'date', type: 'text', required: true },
			{ name: 'title_en', type: 'text', required: true },
			{ name: 'title_ru', type: 'text', required: true },
			{ name: 'excerpt_en', type: 'text', required: false },
			{ name: 'excerpt_ru', type: 'text', required: false },
			{
				name: 'image',
				type: 'file',
				required: false,
				maxSelect: 1,
				maxSize: 5242880,
				mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
			}
		],
		listRule: '',
		viewRule: '',
		createRule: null,
		updateRule: null,
		deleteRule: null
	},
	{
		name: 'stats',
		type: 'base',
		fields: [
			{ name: 'key', type: 'text', required: true },
			{ name: 'value', type: 'text', required: true },
			{ name: 'label_en', type: 'text', required: true },
			{ name: 'label_ru', type: 'text', required: true },
			{ name: 'icon', type: 'text', required: false }
		],
		listRule: '',
		viewRule: '',
		createRule: null,
		updateRule: null,
		deleteRule: null
	},
	{
		name: 'countries',
		type: 'base',
		fields: [
			{ name: 'name_en', type: 'text', required: true },
			{ name: 'name_ru', type: 'text', required: true },
			{ name: 'flag', type: 'text', required: false }
		],
		listRule: '',
		viewRule: '',
		createRule: null,
		updateRule: null,
		deleteRule: null
	},
	{
		name: 'tickers',
		type: 'base',
		fields: [
			{ name: 'text_en', type: 'text', required: true },
			{ name: 'text_ru', type: 'text', required: true },
			{ name: 'isActive', type: 'bool', required: false }
		],
		listRule: '',
		viewRule: '',
		createRule: null,
		updateRule: null,
		deleteRule: null
	}
];

async function waitForPocketBase(maxAttempts = 30) {
	console.log('⏳ Waiting for PocketBase to be ready...');
	for (let i = 0; i < maxAttempts; i++) {
		try {
			const response = await fetch(`${POCKETBASE_URL}/api/health`);
			if (response.ok) {
				console.log('✅ PocketBase is ready!');
				return true;
			}
		} catch (_e) {
			// Connection refused, wait and retry
		}
		await new Promise((resolve) => setTimeout(resolve, 1000));
	}
	throw new Error('PocketBase did not become ready in time');
}

async function authenticateAdmin() {
	console.log('🔐 Authenticating as admin...');
	try {
		await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
		console.log('✅ Authenticated successfully');
		return true;
	} catch (error) {
		console.log('⚠️  Authentication failed:', error.message);
		return false;
	}
}

async function setupCollections() {
	console.log('📦 Setting up collections...');

	for (const collectionDef of collections) {
		try {
			// Check if collection already exists
			try {
				const existing = await pb.collections.getOne(collectionDef.name);
				console.log(`  Collection "${collectionDef.name}" exists. Updating schema...`);

				// Update existing collection
				await pb.collections.update(existing.id, collectionDef);
				console.log(`  ✅ Updated collection "${collectionDef.name}"`);
				continue;
			} catch (_e) {
				// Collection doesn't exist, proceed to create
			}

			// Create the collection with "fields" instead of "schema"
			await pb.collections.create(collectionDef);
			console.log(`  ✅ Created collection "${collectionDef.name}" with fields`);
		} catch (error) {
			console.error(`  ❌ Failed to setup "${collectionDef.name}":`, error.message);
			if (error.data) {
				console.error('     Error details:', JSON.stringify(error.data));
			}
		}
	}
}

async function main() {
	console.log('🚀 PocketBase Setup Script (v0.23+ compatible)');
	console.log(`   URL: ${POCKETBASE_URL}`);
	console.log(`   Admin: ${ADMIN_EMAIL}`);
	console.log('');

	try {
		await waitForPocketBase();

		const authenticated = await authenticateAdmin();

		if (authenticated) {
			await setupCollections();
			console.log('\n✅ Setup completed successfully!');
		} else {
			console.log('\n⚠️  Could not authenticate as admin.');
			console.log('Please verify credentials in .env');
		}
	} catch (error) {
		console.error('\n❌ Setup failed:', error.message);
		process.exit(1);
	}
}

main();
