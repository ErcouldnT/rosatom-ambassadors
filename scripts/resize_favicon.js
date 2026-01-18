import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function resizeFavicon() {
	const inputPath = path.join(__dirname, '../static/favicon.png');
	const outputPath32 = path.join(__dirname, '../static/favicon-32x32.png');
	const outputPath192 = path.join(__dirname, '../static/favicon-192x192.png');

	try {
		await sharp(inputPath).resize(32, 32).toFile(outputPath32);

		await sharp(inputPath).resize(192, 192).toFile(outputPath192);

		console.log('✅ Favicons resized successfully.');
	} catch (error) {
		console.error('❌ Error resizing favicon:', error);
	}
}

resizeFavicon();
