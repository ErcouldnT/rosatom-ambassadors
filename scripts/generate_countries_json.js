import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_PATH = path.resolve(__dirname, '../src/lib/data/countries.json');

async function fetchCountries() {
	console.log('🌍 Fetching countries from GitHub (mledoze/countries)...');
	try {
		const response = await fetch(
			'https://raw.githubusercontent.com/mledoze/countries/master/countries.json'
		);
		if (!response.ok) {
			throw new Error(`Failed to fetch countries: ${response.status} ${response.statusText}`);
		}
		const data = await response.json();

		console.log(`✅ Fetched ${data.length} countries. Processing...`);

		const countries = data
			.map((country) => {
				return {
					name_en: country.name.common,
					name_ru: country.translations?.rus?.common || country.name.common, // Fallback to EN if RU missing
					code: country.cca2,
					flag: country.flag,
					// Some countries might not have latlng populated correctly, handle safely
					latitude: country.latlng ? String(country.latlng[0]) : null,
					longitude: country.latlng ? String(country.latlng[1]) : null
				};
			})
			.filter((c) => c.name_en && c.code); // Basic validation

		// Sort alphabetically by English name
		countries.sort((a, b) => a.name_en.localeCompare(b.name_en));

		fs.writeFileSync(OUTPUT_PATH, JSON.stringify(countries, null, 2));
		console.log(`💾 Saved ${countries.length} countries to ${OUTPUT_PATH}`);
	} catch (error) {
		console.error('❌ Error generating countries JSON:', error);
		process.exit(1);
	}
}

fetchCountries();
