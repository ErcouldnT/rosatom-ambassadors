import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	css: {
		lightningcss: {
			drafts: {
				customMedia: true
			}
		}
	},
	build: {
		// Use esbuild for CSS minification to avoid @property warnings from Lightning CSS
		cssMinify: 'esbuild'
	}
});
