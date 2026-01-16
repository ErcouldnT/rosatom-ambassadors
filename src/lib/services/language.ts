import { writable } from 'svelte/store';
import { browser } from '$app/environment';

type Language = 'en' | 'ru';

// Get initial language from browser storage or default to 'en'
const storedLanguage = browser ? (localStorage.getItem('language') as Language) : 'en';
const initialLanguage: Language = storedLanguage === 'ru' ? 'ru' : 'en';

export const language = writable<Language>(initialLanguage);

// Subscribe to changes and update local storage
if (browser) {
    language.subscribe((value) => {
        localStorage.setItem('language', value);
        // Update connection with cookie for SSR
        document.cookie = `lang=${value}; path=/; max-age=31536000`; // 1 year
    });
}
