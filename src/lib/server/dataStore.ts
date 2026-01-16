// Server-side data store (in-memory mock database)
import type { Ambassador, Event, NewsItem, Stat, Country } from '$lib/services/mockApi';
import {
	getAmbassadors,
	getEventsList,
	getNews,
	getStats,
	getCountries
} from '$lib/services/mockApi';

// Initialize with mock data
let ambassadors: Ambassador[] = getAmbassadors();
let events: Event[] = getEventsList();
let news: NewsItem[] = getNews();
const stats: Stat[] = getStats();
let countries: Country[] = getCountries();

// Admin credentials
const ADMIN_EMAIL = 'admin@rneambassadors.org';
const ADMIN_PASSWORD = 'admin123';

// Session management (in-memory)
const sessions = new Map<string, { email: string; name: string; expiresAt: number }>();

export function validateAdmin(email: string, password: string): string | null {
	if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
		const sessionId = crypto.randomUUID();
		sessions.set(sessionId, {
			email,
			name: 'Admin User',
			expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
		});
		return sessionId;
	}
	return null;
}

export function validateSession(sessionId: string): boolean {
	const session = sessions.get(sessionId);
	if (!session) return false;
	if (session.expiresAt < Date.now()) {
		sessions.delete(sessionId);
		return false;
	}
	return true;
}

export function destroySession(sessionId: string): void {
	sessions.delete(sessionId);
}

// Ambassadors CRUD
export function getAllAmbassadors(): Ambassador[] {
	return ambassadors;
}

export function createAmbassador(data: Omit<Ambassador, 'id'>): Ambassador {
	const newId = Math.max(...ambassadors.map((a) => a.id), 0) + 1;
	const ambassador = { ...data, id: newId };
	ambassadors = [...ambassadors, ambassador];
	return ambassador;
}

export function editAmbassador(id: number, data: Partial<Ambassador>): Ambassador | null {
	const index = ambassadors.findIndex((a) => a.id === id);
	if (index === -1) return null;
	ambassadors[index] = { ...ambassadors[index], ...data };
	return ambassadors[index];
}

export function removeAmbassador(id: number): boolean {
	const length = ambassadors.length;
	ambassadors = ambassadors.filter((a) => a.id !== id);
	return ambassadors.length < length;
}

// Events CRUD
export function getAllEvents(): Event[] {
	return events;
}

export function createEvent(data: Omit<Event, 'id'>): Event {
	const newId = Math.max(...events.map((e) => e.id), 0) + 1;
	const event = { ...data, id: newId };
	events = [...events, event];
	return event;
}

export function editEvent(id: number, data: Partial<Event>): Event | null {
	const index = events.findIndex((e) => e.id === id);
	if (index === -1) return null;
	events[index] = { ...events[index], ...data };
	return events[index];
}

export function removeEvent(id: number): boolean {
	const length = events.length;
	events = events.filter((e) => e.id !== id);
	return events.length < length;
}

// News CRUD
export function getAllNews(): NewsItem[] {
	return news;
}

export function createNews(data: Omit<NewsItem, 'id'>): NewsItem {
	const newId = Math.max(...news.map((n) => n.id), 0) + 1;
	const item = { ...data, id: newId };
	news = [...news, item];
	return item;
}

export function editNews(id: number, data: Partial<NewsItem>): NewsItem | null {
	const index = news.findIndex((n) => n.id === id);
	if (index === -1) return null;
	news[index] = { ...news[index], ...data };
	return news[index];
}

export function removeNews(id: number): boolean {
	const length = news.length;
	news = news.filter((n) => n.id !== id);
	return news.length < length;
}

// Stats
export function getAllStats(): Stat[] {
	return stats;
}

export function editStat(index: number, data: Partial<Stat>): Stat | null {
	if (index < 0 || index >= stats.length) return null;
	stats[index] = { ...stats[index], ...data };
	return stats[index];
}

// Countries
export function getAllCountries(): Country[] {
	return countries;
}

export function createCountry(data: Country): Country {
	countries = [...countries, data];
	return data;
}

export function removeCountry(name: string): boolean {
	const length = countries.length;
	countries = countries.filter((c) => c.name !== name);
	return countries.length < length;
}
