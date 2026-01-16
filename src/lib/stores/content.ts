import { writable } from 'svelte/store';
import type { Ambassador, Event, NewsItem, Stat, Country } from '$lib/types';

// Initialize stores with empty data (will be populated from serverside or client fetch)
export const ambassadorsStore = writable<Ambassador[]>([]);
export const eventsStore = writable<Event[]>([]);
export const newsStore = writable<NewsItem[]>([]);
export const statsStore = writable<Stat[]>([]);
export const countriesStore = writable<Country[]>([]);

// CRUD functions for optimistic UI updates if needed
export function addAmbassador(ambassador: Ambassador): void {
	ambassadorsStore.update((items) => [...items, ambassador]);
}

export function updateAmbassador(id: string, data: Partial<Ambassador>): void {
	ambassadorsStore.update((items) =>
		items.map((item) => (item.id === id ? { ...item, ...data } : item))
	);
}

export function deleteAmbassador(id: string): void {
	ambassadorsStore.update((items) => items.filter((item) => item.id !== id));
}

export function addEvent(event: Event): void {
	eventsStore.update((items) => [...items, event]);
}

export function updateEvent(id: string, data: Partial<Event>): void {
	eventsStore.update((items) =>
		items.map((item) => (item.id === id ? { ...item, ...data } : item))
	);
}

export function deleteEvent(id: string): void {
	eventsStore.update((items) => items.filter((item) => item.id !== id));
}

export function addNews(news: NewsItem): void {
	newsStore.update((items) => [...items, news]);
}

export function updateNews(id: string, data: Partial<NewsItem>): void {
	newsStore.update((items) => items.map((item) => (item.id === id ? { ...item, ...data } : item)));
}

export function deleteNews(id: string): void {
	newsStore.update((items) => items.filter((item) => item.id !== id));
}

export function updateStat(id: string, data: Partial<Stat>): void {
	statsStore.update((items) => items.map((item) => (item.id === id ? { ...item, ...data } : item)));
}

export function addCountry(country: Country): void {
	countriesStore.update((items) => [...items, country]);
}

export function deleteCountry(id: string): void {
	countriesStore.update((items) => items.filter((item) => item.id !== id));
}
