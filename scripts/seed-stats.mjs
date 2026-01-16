
import PocketBase from 'pocketbase';
import 'dotenv/config';

// Use environment variables or defaults
const POCKETBASE_URL = process.env.PUBLIC_POCKETBASE_URL || 'http://localhost:8090';
const ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL || 'admin@rosatom-ambassadors.com';
const ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD || 'RneAdmin2024!';

async function seedStats() {
    console.log(`Connecting to ${POCKETBASE_URL}...`);
    const pb = new PocketBase(POCKETBASE_URL);

    try {
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
        console.log('✅ Authenticated as admin');

        const stats = [
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

        for (const stat of stats) {
            try {
                // Check if exists
                const existing = await pb.collection('stats').getList(1, 1, {
                    filter: `key = "${stat.key}"`
                });

                if (existing.items.length > 0) {
                    console.log(`Stat "${stat.key}" already exists. Skipping.`);
                    // Optionally update:
                    // await pb.collection('stats').update(existing.items[0].id, stat);
                } else {
                    await pb.collection('stats').create(stat);
                    console.log(`✅ Created stat: ${stat.key}`);
                }
            } catch (err) {
                console.error(`Error processing ${stat.key}:`, err.message);
            }
        }

    } catch (err) {
        console.error('❌ Failed:', err);
    }
}

seedStats();
