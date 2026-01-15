import { writable } from 'svelte/store';
import { browser } from '$app/environment';

type Language = 'en' | 'ru';

// Helper to detect system language
function detectLanguage(): Language {
	if (!browser) return 'en';

	const persisted = localStorage.getItem('lang') as Language | null;
	if (persisted && (persisted === 'en' || persisted === 'ru')) return persisted;

	const system = navigator.language.toLowerCase();
	return system.startsWith('ru') ? 'ru' : 'en';
}

export const language = writable<Language>(detectLanguage());

// Subscriber to persist change
if (browser) {
	language.subscribe((value) => {
		localStorage.setItem('lang', value);
		document.documentElement.lang = value;
	});
}
