import { writable } from 'svelte/store';
import type { Ambassador, Event, NewsItem, Stat, Country } from '$lib/services/mockApi';
import {
	getAmbassadors,
	getEventsList,
	getNews,
	getStats,
	getCountries
} from '$lib/services/mockApi';

// Initialize stores with mock data
export const ambassadorsStore = writable<Ambassador[]>(getAmbassadors());
export const eventsStore = writable<Event[]>(getEventsList());
export const newsStore = writable<NewsItem[]>(getNews());
export const statsStore = writable<Stat[]>(getStats());
export const countriesStore = writable<Country[]>(getCountries());

// Ambassadors CRUD
export function addAmbassador(ambassador: Omit<Ambassador, 'id'>): void {
	ambassadorsStore.update((items) => {
		const newId = Math.max(...items.map((i) => i.id), 0) + 1;
		return [...items, { ...ambassador, id: newId }];
	});
}

export function updateAmbassador(id: number, data: Partial<Ambassador>): void {
	ambassadorsStore.update((items) =>
		items.map((item) => (item.id === id ? { ...item, ...data } : item))
	);
}

export function deleteAmbassador(id: number): void {
	ambassadorsStore.update((items) => items.filter((item) => item.id !== id));
}

// Events CRUD
export function addEvent(event: Omit<Event, 'id'>): void {
	eventsStore.update((items) => {
		const newId = Math.max(...items.map((i) => i.id), 0) + 1;
		return [...items, { ...event, id: newId }];
	});
}

export function updateEvent(id: number, data: Partial<Event>): void {
	eventsStore.update((items) =>
		items.map((item) => (item.id === id ? { ...item, ...data } : item))
	);
}

export function deleteEvent(id: number): void {
	eventsStore.update((items) => items.filter((item) => item.id !== id));
}

// News CRUD
export function addNews(news: Omit<NewsItem, 'id'>): void {
	newsStore.update((items) => {
		const newId = Math.max(...items.map((i) => i.id), 0) + 1;
		return [...items, { ...news, id: newId }];
	});
}

export function updateNews(id: number, data: Partial<NewsItem>): void {
	newsStore.update((items) => items.map((item) => (item.id === id ? { ...item, ...data } : item)));
}

export function deleteNews(id: number): void {
	newsStore.update((items) => items.filter((item) => item.id !== id));
}

// Stats update
export function updateStat(index: number, data: Partial<Stat>): void {
	statsStore.update((items) => items.map((item, i) => (i === index ? { ...item, ...data } : item)));
}

// Countries CRUD
export function addCountry(country: Country): void {
	countriesStore.update((items) => [...items, country]);
}

export function deleteCountry(name: string): void {
	countriesStore.update((items) => items.filter((item) => item.name !== name));
}
