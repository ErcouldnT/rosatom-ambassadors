import { db } from '$lib/server/db';
import { ambassadors, events, news, stats, countries, tickers } from '$lib/server/db/schema';
import { eq, sql } from 'drizzle-orm';
import type { Ambassador, Event, NewsItem, Stat, Country, Ticker } from '$lib/types';

// Helper functions for data fetching
export async function getAmbassadors(onlyActive = true): Promise<Ambassador[]> {
	try {
		const results = await db
			.select({
				id: ambassadors.id,
				name_en: ambassadors.name_en,
				name_ru: ambassadors.name_ru,
				country_en: ambassadors.country_en,
				country_ru: ambassadors.country_ru,
				role_en: ambassadors.role_en,
				role_ru: ambassadors.role_ru,
				isActive: ambassadors.isActive,
				image_mime_type: ambassadors.image_mime_type,
				created: ambassadors.created,
				updated: ambassadors.updated,
				image: sql<boolean>`CASE WHEN ${ambassadors.image} IS NOT NULL THEN 1 ELSE 0 END`
			})
			.from(ambassadors)
			.where(onlyActive ? eq(ambassadors.isActive, true) : sql`1=1`);

		return results as unknown as Ambassador[];
	} catch (error) {
		console.error('Failed to fetch ambassadors:', error);
		return [];
	}
}

export async function getAmbassadorById(id: string): Promise<Ambassador | null> {
	try {
		const record = await db
			.select({
				id: ambassadors.id,
				name_en: ambassadors.name_en,
				name_ru: ambassadors.name_ru,
				country_en: ambassadors.country_en,
				country_ru: ambassadors.country_ru,
				role_en: ambassadors.role_en,
				role_ru: ambassadors.role_ru,
				isActive: ambassadors.isActive,
				image_mime_type: ambassadors.image_mime_type,
				created: ambassadors.created,
				updated: ambassadors.updated,
				image: sql<boolean>`CASE WHEN ${ambassadors.image} IS NOT NULL THEN 1 ELSE 0 END`
			})
			.from(ambassadors)
			.where(eq(ambassadors.id, id))
			.get();
		return (record as unknown as Ambassador) || null;
	} catch (error) {
		console.error('Failed to fetch ambassador:', error);
		return null;
	}
}

export async function getEvents(): Promise<Event[]> {
	try {
		const records = await db
			.select({
				id: events.id,
				title_en: events.title_en,
				title_ru: events.title_ru,
				date_day: events.date_day,
				date_month_en: events.date_month_en,
				date_month_ru: events.date_month_ru,
				time: events.time,
				location_en: events.location_en,
				location_ru: events.location_ru,
				description_en: events.description_en,
				description_ru: events.description_ru,
				created: events.created,
				updated: events.updated,
				image: sql<boolean>`CASE WHEN ${events.image} IS NOT NULL THEN 1 ELSE 0 END`
			})
			.from(events)
			.all();
		return records as unknown as Event[];
	} catch (error) {
		console.error('Failed to fetch events:', error);
		return [];
	}
}

export async function getEventById(id: string): Promise<Event | null> {
	try {
		const record = await db
			.select({
				id: events.id,
				title_en: events.title_en,
				title_ru: events.title_ru,
				date_day: events.date_day,
				date_month_en: events.date_month_en,
				date_month_ru: events.date_month_ru,
				time: events.time,
				location_en: events.location_en,
				location_ru: events.location_ru,
				description_en: events.description_en,
				description_ru: events.description_ru,
				created: events.created,
				updated: events.updated,
				image: sql<boolean>`CASE WHEN ${events.image} IS NOT NULL THEN 1 ELSE 0 END`
			})
			.from(events)
			.where(eq(events.id, id))
			.get();
		return (record as unknown as Event) || null;
	} catch (error) {
		console.error('Failed to fetch event:', error);
		return null;
	}
}

export async function getNews(): Promise<NewsItem[]> {
	try {
		const records = await db
			.select({
				id: news.id,
				category_en: news.category_en,
				category_ru: news.category_ru,
				date: news.date,
				title_en: news.title_en,
				title_ru: news.title_ru,
				excerpt_en: news.excerpt_en,
				excerpt_ru: news.excerpt_ru,
				created: news.created,
				updated: news.updated,
				image: sql<boolean>`CASE WHEN ${news.image} IS NOT NULL THEN 1 ELSE 0 END`
			})
			.from(news)
			.all();
		return records as unknown as NewsItem[];
	} catch (error) {
		console.error('Failed to fetch news:', error);
		return [];
	}
}

export async function getNewsById(id: string): Promise<NewsItem | null> {
	try {
		const record = await db
			.select({
				id: news.id,
				category_en: news.category_en,
				category_ru: news.category_ru,
				date: news.date,
				title_en: news.title_en,
				title_ru: news.title_ru,
				excerpt_en: news.excerpt_en,
				excerpt_ru: news.excerpt_ru,
				created: news.created,
				updated: news.updated,
				image: sql<boolean>`CASE WHEN ${news.image} IS NOT NULL THEN 1 ELSE 0 END`
			})
			.from(news)
			.where(eq(news.id, id))
			.get();
		return (record as unknown as NewsItem) || null;
	} catch (error) {
		console.error('Failed to fetch news item:', error);
		return null;
	}
}

export async function getStats(): Promise<Stat[]> {
	try {
		const records = await db.select().from(stats).all();
		return records as unknown as Stat[];
	} catch (error) {
		console.error('Failed to fetch stats:', error);
		return [];
	}
}

export async function getCountries(): Promise<Country[]> {
	try {
		const records = await db.select().from(countries).all();
		return records as unknown as Country[];
	} catch (error) {
		console.error('Failed to fetch countries:', error);
		return [];
	}
}

// Admin CRUD operations (No token needed, auth check should be done in route)
export async function createAmbassador(data: Partial<Ambassador>): Promise<Ambassador | null> {
	try {
		const [record] = await db
			.insert(ambassadors)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.values(data as any)
			.returning();
		return record as unknown as Ambassador;
	} catch (error) {
		console.error('Failed to create ambassador:', error);
		return null;
	}
}

export async function updateAmbassador(
	id: string,
	data: Partial<Ambassador>
): Promise<Ambassador | null> {
	try {
		const [record] = await db
			.update(ambassadors)
			.set({ ...data, updated: new Date().toISOString() })
			.where(eq(ambassadors.id, id))
			.returning();
		return record as unknown as Ambassador;
	} catch (error) {
		console.error('Failed to update ambassador:', error);
		return null;
	}
}

export async function deleteAmbassador(id: string): Promise<boolean> {
	try {
		await db.delete(ambassadors).where(eq(ambassadors.id, id));
		return true;
	} catch (error) {
		console.error('Failed to delete ambassador:', error);
		return false;
	}
}

export async function createEvent(data: Partial<Event>): Promise<Event | null> {
	try {
		const [record] = await db
			.insert(events)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.values(data as any)
			.returning();
		return record as unknown as Event;
	} catch (error) {
		console.error('Failed to create event:', error);
		return null;
	}
}

export async function updateEvent(id: string, data: Partial<Event>): Promise<Event | null> {
	try {
		const [record] = await db
			.update(events)
			.set({ ...data, updated: new Date().toISOString() })
			.where(eq(events.id, id))
			.returning();
		return record as unknown as Event;
	} catch (error) {
		console.error('Failed to update event:', error);
		return null;
	}
}

export async function deleteEvent(id: string): Promise<boolean> {
	try {
		await db.delete(events).where(eq(events.id, id));
		return true;
	} catch (error) {
		console.error('Failed to delete event:', error);
		return false;
	}
}

export async function createNews(data: Partial<NewsItem>): Promise<NewsItem | null> {
	try {
		const [record] = await db
			.insert(news)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.values(data as any)
			.returning();
		return record as unknown as NewsItem;
	} catch (error) {
		console.error('Failed to create news:', error);
		return null;
	}
}

export async function updateNews(id: string, data: Partial<NewsItem>): Promise<NewsItem | null> {
	try {
		const [record] = await db
			.update(news)
			.set({ ...data, updated: new Date().toISOString() })
			.where(eq(news.id, id))
			.returning();
		return record as unknown as NewsItem;
	} catch (error) {
		console.error('Failed to update news:', error);
		return null;
	}
}

export async function deleteNews(id: string): Promise<boolean> {
	try {
		await db.delete(news).where(eq(news.id, id));
		return true;
	} catch (error) {
		console.error('Failed to delete news:', error);
		return false;
	}
}

export async function createStat(data: Partial<Stat>): Promise<Stat | null> {
	try {
		const [record] = await db
			.insert(stats)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.values(data as any)
			.returning();
		return record as unknown as Stat;
	} catch (error) {
		console.error('Failed to create stat:', error);
		return null;
	}
}

export async function updateStat(id: string, data: Partial<Stat>): Promise<Stat | null> {
	try {
		const [record] = await db
			.update(stats)
			.set({ ...data, updated: new Date().toISOString() })
			.where(eq(stats.id, id))
			.returning();
		return record as unknown as Stat;
	} catch (error) {
		console.error('Failed to update stat:', error);
		return null;
	}
}

export async function deleteStat(id: string): Promise<boolean> {
	try {
		await db.delete(stats).where(eq(stats.id, id));
		return true;
	} catch (error) {
		console.error('Failed to delete stat:', error);
		return false;
	}
}

export async function createCountry(data: Partial<Country>): Promise<Country | null> {
	try {
		const [record] = await db
			.insert(countries)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.values(data as any)
			.returning();
		return record as unknown as Country;
	} catch (error) {
		console.error('Failed to create country:', error);
		return null;
	}
}

export async function updateCountry(id: string, data: Partial<Country>): Promise<Country | null> {
	try {
		const [record] = await db
			.update(countries)
			.set({ ...data, updated: new Date().toISOString() })
			.where(eq(countries.id, id))
			.returning();
		return record as unknown as Country;
	} catch (error) {
		console.error('Failed to update country:', error);
		return null;
	}
}

export async function deleteCountry(id: string): Promise<boolean> {
	try {
		await db.delete(countries).where(eq(countries.id, id));
		return true;
	} catch (error) {
		console.error('Failed to delete country:', error);
		return false;
	}
}

export async function getTickers(): Promise<Ticker[]> {
	try {
		const records = await db.select().from(tickers).all();
		return records as unknown as Ticker[];
	} catch (error) {
		console.error('Failed to fetch tickers:', error);
		return [];
	}
}

export async function createTicker(data: Partial<Ticker>): Promise<Ticker | null> {
	try {
		const [record] = await db
			.insert(tickers)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.values(data as any)
			.returning();
		return record as unknown as Ticker;
	} catch (error) {
		console.error('Failed to create ticker:', error);
		return null;
	}
}

export async function updateTicker(id: string, data: Partial<Ticker>): Promise<Ticker | null> {
	try {
		const [record] = await db
			.update(tickers)
			.set({ ...data, updated: new Date().toISOString() })
			.where(eq(tickers.id, id))
			.returning();
		return record as unknown as Ticker;
	} catch (error) {
		console.error('Failed to update ticker:', error);
		return null;
	}
}

export async function deleteTicker(id: string): Promise<boolean> {
	try {
		await db.delete(tickers).where(eq(tickers.id, id));
		return true;
	} catch (error) {
		console.error('Failed to delete ticker:', error);
		return false;
	}
}
