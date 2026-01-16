import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type Language = 'en' | 'ru';

// Helper to detect system language
function detectLanguage(): Language {
	if (!browser) return 'en';

	// 1. Try to get from HTML lang attribute (set by server to avoid FOUC)
	const htmlLang = document.documentElement.lang as Language;
	if (htmlLang === 'en' || htmlLang === 'ru') return htmlLang;

	// 2. Try to get from local storage
	const persisted = localStorage.getItem('language') as Language | null;
	if (persisted && (persisted === 'en' || persisted === 'ru')) return persisted;

	// 3. Fallback to system language
	const system = navigator.language.toLowerCase();
	return system.startsWith('ru') ? 'ru' : 'en';
}

export const language = writable<Language>(detectLanguage());

// Subscribe to changes and update local storage and document
if (browser) {
	language.subscribe((value) => {
		localStorage.setItem('language', value);
		document.cookie = `lang=${value}; path=/; max-age=31536000`; // 1 year
		document.documentElement.lang = value;
	});
}
