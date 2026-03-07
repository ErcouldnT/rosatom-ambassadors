import { db } from '$lib/server/db';
import {
	ambassadors,
	events,
	news,
	countries,
	cms_content,
	messages,
	universities
} from '$lib/server/db/schema';
import { eq, ne, sql, asc, desc, and, isNotNull } from 'drizzle-orm';
import type {
	Ambassador,
	Event,
	NewsItem,
	Country,
	CMSContent,
	Message,
	University
} from '$lib/types';

// ... (getAmbassadors same)

export async function getCountries(onlyWithAmbassadors = false): Promise<Country[]> {
	try {
		if (onlyWithAmbassadors) {
			const records = await db
				.select({
					id: countries.id,
					name_en: countries.name_en,
					name_ru: countries.name_ru,
					flag: countries.flag,
					code: countries.code,
					latitude: countries.latitude,
					longitude: countries.longitude,
					created: countries.created,
					updated: countries.updated,
					ambassador_count: sql<number>`count(${ambassadors.id})`
				})
				.from(countries)
				.innerJoin(ambassadors, eq(countries.name_en, ambassadors.country_en))
				.groupBy(countries.id)
				.orderBy(asc(countries.name_en));

			return records.map((r) => ({
				...r,
				ambassador_count: Number(r.ambassador_count)
			})) as unknown as Country[];
		}
		const records = await db.select().from(countries).orderBy(asc(countries.name_en)).all();
		return records as unknown as Country[];
	} catch (error) {
		console.error('Failed to fetch countries:', error);
		return [];
	}
}
export async function getAmbassadors(onlyActive = true): Promise<Ambassador[]> {
	try {
		const results = await db
			.select({
				id: ambassadors.id,
				slug: ambassadors.slug,
				email: ambassadors.email,
				name_en: ambassadors.name_en,
				name_ru: ambassadors.name_ru,
				country_en: ambassadors.country_en,
				country_ru: ambassadors.country_ru,
				role_en: ambassadors.role_en,
				role_ru: ambassadors.role_ru,
				about_en: ambassadors.about_en,
				about_ru: ambassadors.about_ru,
				contributions_en: ambassadors.contributions_en,
				contributions_ru: ambassadors.contributions_ru,
				isAlumni: ambassadors.isAlumni,
				awards_json: ambassadors.awards_json,
				image_mime_type: ambassadors.image_mime_type,
				created: ambassadors.created,
				updated: ambassadors.updated,
				image: sql<boolean>`CASE WHEN ${ambassadors.image} IS NOT NULL THEN 1 ELSE 0 END`
			})
			.from(ambassadors)
			.where(onlyActive ? eq(ambassadors.isAlumni, false) : sql`1=1`);

		return results as unknown as Ambassador[];
	} catch (error) {
		console.error('Failed to fetch ambassadors:', error);
		return [];
	}
}

export async function getAlumni(): Promise<Ambassador[]> {
	try {
		const results = await db
			.select({
				id: ambassadors.id,
				slug: ambassadors.slug,
				email: ambassadors.email,
				name_en: ambassadors.name_en,
				name_ru: ambassadors.name_ru,
				country_en: ambassadors.country_en,
				country_ru: ambassadors.country_ru,
				role_en: ambassadors.role_en,
				role_ru: ambassadors.role_ru,
				about_en: ambassadors.about_en,
				about_ru: ambassadors.about_ru,
				contributions_en: ambassadors.contributions_en,
				contributions_ru: ambassadors.contributions_ru,
				isAlumni: ambassadors.isAlumni,
				awards_json: ambassadors.awards_json,
				image_mime_type: ambassadors.image_mime_type,
				created: ambassadors.created,
				updated: ambassadors.updated,
				image: sql<boolean>`CASE WHEN ${ambassadors.image} IS NOT NULL THEN 1 ELSE 0 END`
			})
			.from(ambassadors)
			.where(eq(ambassadors.isAlumni, true));

		return results as unknown as Ambassador[];
	} catch (error) {
		console.error('Failed to fetch alumni:', error);
		return [];
	}
}

export async function getAmbassadorsWithAwards(): Promise<Ambassador[]> {
	try {
		const results = await db
			.select({
				id: ambassadors.id,
				slug: ambassadors.slug,
				email: ambassadors.email,
				name_en: ambassadors.name_en,
				name_ru: ambassadors.name_ru,
				country_en: ambassadors.country_en,
				country_ru: ambassadors.country_ru,
				role_en: ambassadors.role_en,
				role_ru: ambassadors.role_ru,
				about_en: ambassadors.about_en,
				about_ru: ambassadors.about_ru,
				contributions_en: ambassadors.contributions_en,
				contributions_ru: ambassadors.contributions_ru,
				isAlumni: ambassadors.isAlumni,
				awards_json: ambassadors.awards_json,
				image_mime_type: ambassadors.image_mime_type,
				created: ambassadors.created,
				updated: ambassadors.updated,
				image: sql<boolean>`CASE WHEN ${ambassadors.image} IS NOT NULL THEN 1 ELSE 0 END`
			})
			.from(ambassadors)
			.where(isNotNull(ambassadors.awards_json));

		// Parse awards_json and filter out ambassadors with empty arrays
		return (results as unknown as Ambassador[]).filter((a) => {
			try {
				const awards = JSON.parse(a.awards_json || '[]');
				a.awards = awards;
				return awards.length > 0;
			} catch {
				return false;
			}
		});
	} catch (error) {
		console.error('Failed to fetch ambassadors with awards:', error);
		return [];
	}
}

export async function getAmbassadorCount(): Promise<number> {
	try {
		const [result] = await db
			.select({ count: sql<number>`count(*)` })
			.from(ambassadors)
			.where(eq(ambassadors.isAlumni, false));
		return result.count;
	} catch (error) {
		console.error('Failed to fetch ambassador count:', error);
		return 0;
	}
}

export async function getRandomAmbassadorsWithImages(limit = 4): Promise<Ambassador[]> {
	try {
		const results = await db
			.select({
				id: ambassadors.id,
				name_en: ambassadors.name_en,
				name_ru: ambassadors.name_ru,
				image: sql<boolean>`1`
			})
			.from(ambassadors)
			.where(isNotNull(ambassadors.image))
			.orderBy(sql`RANDOM()`)
			.limit(limit);

		return results as unknown as Ambassador[];
	} catch (error) {
		console.error('Failed to fetch random ambassadors:', error);
		return [];
	}
}

export async function getAmbassadorById(id: string): Promise<Ambassador | null> {
	try {
		const record = await db
			.select({
				id: ambassadors.id,
				slug: ambassadors.slug,
				email: ambassadors.email,
				name_en: ambassadors.name_en,
				name_ru: ambassadors.name_ru,
				country_en: ambassadors.country_en,
				country_ru: ambassadors.country_ru,
				role_en: ambassadors.role_en,
				role_ru: ambassadors.role_ru,
				about_en: ambassadors.about_en,
				about_ru: ambassadors.about_ru,
				contributions_en: ambassadors.contributions_en,
				contributions_ru: ambassadors.contributions_ru,
				isAlumni: ambassadors.isAlumni,
				awards_json: ambassadors.awards_json,
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

export async function getAmbassadorBySlug(slug: string): Promise<Ambassador | null> {
	try {
		const record = await db
			.select({
				id: ambassadors.id,
				slug: ambassadors.slug,
				email: ambassadors.email,
				name_en: ambassadors.name_en,
				name_ru: ambassadors.name_ru,
				country_en: ambassadors.country_en,
				country_ru: ambassadors.country_ru,
				role_en: ambassadors.role_en,
				role_ru: ambassadors.role_ru,
				about_en: ambassadors.about_en,
				about_ru: ambassadors.about_ru,
				contributions_en: ambassadors.contributions_en,
				contributions_ru: ambassadors.contributions_ru,
				isAlumni: ambassadors.isAlumni,
				awards_json: ambassadors.awards_json,
				image_mime_type: ambassadors.image_mime_type,
				created: ambassadors.created,
				updated: ambassadors.updated,
				image: sql<boolean>`CASE WHEN ${ambassadors.image} IS NOT NULL THEN 1 ELSE 0 END`
			})
			.from(ambassadors)
			.where(eq(ambassadors.slug, slug))
			.get();
		if (!record) return null;
		const amb = record as unknown as Ambassador;
		try {
			amb.awards = JSON.parse(amb.awards_json || '[]');
		} catch {
			amb.awards = [];
		}
		return amb;
	} catch (error) {
		console.error('Failed to fetch ambassador by slug:', error);
		return null;
	}
}

export async function getEvents(): Promise<Event[]> {
	try {
		const records = await db
			.select({
				id: events.id,
				slug: events.slug,
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
				event_date: events.event_date,
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
				slug: events.slug,
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
				event_date: events.event_date,
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

export async function getEventBySlug(slug: string): Promise<Event | null> {
	try {
		const record = await db
			.select({
				id: events.id,
				slug: events.slug,
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
			.where(eq(events.slug, slug))
			.get();
		return (record as unknown as Event) || null;
	} catch (error) {
		console.error('Failed to fetch event by slug:', error);
		return null;
	}
}

export async function getEventCount(): Promise<number> {
	try {
		const [result] = await db.select({ count: sql<number>`count(*)` }).from(events);
		return result.count;
	} catch (error) {
		console.error('Failed to fetch event count:', error);
		return 0;
	}
}

export async function getNews(): Promise<NewsItem[]> {
	try {
		const records = await db
			.select({
				id: news.id,
				slug: news.slug,
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

export async function getLatestNewsInfo(): Promise<{
	slug: string;
	title_en: string;
	title_ru: string;
} | null> {
	try {
		const record = await db
			.select({ slug: news.slug, title_en: news.title_en, title_ru: news.title_ru })
			.from(news)
			.orderBy(desc(news.created))
			.limit(1)
			.get();
		return record && record.slug
			? (record as { slug: string; title_en: string; title_ru: string })
			: null;
	} catch (error) {
		console.error('Failed to fetch latest news info:', error);
		return null;
	}
}

export async function getNewsById(id: string): Promise<NewsItem | null> {
	try {
		const record = await db
			.select({
				id: news.id,
				slug: news.slug,
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

export async function getNewsBySlug(slug: string): Promise<NewsItem | null> {
	try {
		const record = await db
			.select({
				id: news.id,
				slug: news.slug,
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
			.where(eq(news.slug, slug))
			.get();
		return (record as unknown as NewsItem) || null;
	} catch (error) {
		console.error('Failed to fetch news item by slug:', error);
		return null;
	}
}

export async function getRelatedContent(currentNewsId: string): Promise<{
	relatedNews: NewsItem | null;
	upcomingEvent: Event | null;
	fallbackNews: NewsItem | null;
}> {
	try {
		const today = new Date().toISOString().split('T')[0];

		// Get one other news item, most recent first, excluding current
		const relatedNewsRecord = await db
			.select({
				id: news.id,
				slug: news.slug,
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
			.where(ne(news.id, currentNewsId))
			.orderBy(desc(news.created))
			.limit(1)
			.get();

		// Get one upcoming event (event_date >= today)
		const upcomingEventRecord = await db
			.select({
				id: events.id,
				slug: events.slug,
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
				event_date: events.event_date,
				created: events.created,
				updated: events.updated,
				image: sql<boolean>`CASE WHEN ${events.image} IS NOT NULL THEN 1 ELSE 0 END`
			})
			.from(events)
			.where(sql`${events.event_date} >= ${today}`)
			.orderBy(asc(events.event_date))
			.limit(1)
			.get();

		// If no upcoming event, get a second news item as fallback
		let fallbackNewsRecord = null;
		if (!upcomingEventRecord && relatedNewsRecord) {
			fallbackNewsRecord = await db
				.select({
					id: news.id,
					slug: news.slug,
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
				.where(and(ne(news.id, currentNewsId), ne(news.id, relatedNewsRecord.id)))
				.orderBy(desc(news.created))
				.limit(1)
				.get();
		}

		return {
			relatedNews: (relatedNewsRecord as unknown as NewsItem) || null,
			upcomingEvent: (upcomingEventRecord as unknown as Event) || null,
			fallbackNews: (fallbackNewsRecord as unknown as NewsItem) || null
		};
	} catch (error) {
		console.error('Failed to fetch related content:', error);
		return { relatedNews: null, upcomingEvent: null, fallbackNews: null };
	}
}

export async function getUniversityCount(): Promise<number> {
	try {
		const [result] = await db.select({ count: sql<number>`count(*)` }).from(universities);
		return result.count;
	} catch (error) {
		console.error('Failed to fetch university count:', error);
		return 0;
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

// Admin CRUD operations (No token needed, auth check should be done in route)
export async function createAmbassador(data: Partial<Ambassador>): Promise<{ id: string } | null> {
	try {
		const [record] = await db
			.insert(ambassadors)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.values(data as any)
			.returning({ id: ambassadors.id });
		return record;
	} catch (error) {
		console.error('Failed to create ambassador:', error);
		return null;
	}
}

export async function updateAmbassador(
	id: string,
	data: Partial<Ambassador>
): Promise<{ id: string } | null> {
	try {
		const [record] = await db
			.update(ambassadors)
			.set({ ...data, updated: new Date().toISOString() })
			.where(eq(ambassadors.id, id))
			.returning({ id: ambassadors.id });
		return record;
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

export async function createEvent(data: Partial<Event>): Promise<{ id: string } | null> {
	try {
		const [record] = await db
			.insert(events)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.values(data as any)
			.returning({ id: events.id });
		return record;
	} catch (error) {
		console.error('Failed to create event:', error);
		return null;
	}
}

export async function updateEvent(
	id: string,
	data: Partial<Event>
): Promise<{ id: string } | null> {
	try {
		const [record] = await db
			.update(events)
			.set({ ...data, updated: new Date().toISOString() })
			.where(eq(events.id, id))
			.returning({ id: events.id });
		return record;
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

export async function createNews(data: Partial<NewsItem>): Promise<{ id: string } | null> {
	try {
		const [record] = await db
			.insert(news)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.values(data as any)
			.returning({ id: news.id });
		return record;
	} catch (error) {
		console.error('Failed to create news:', error);
		return null;
	}
}

export async function updateNews(
	id: string,
	data: Partial<NewsItem>
): Promise<{ id: string } | null> {
	try {
		const [record] = await db
			.update(news)
			.set({ ...data, updated: new Date().toISOString() })
			.where(eq(news.id, id))
			.returning({ id: news.id });
		return record;
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

export async function getCMSContent(key: string): Promise<CMSContent | null> {
	try {
		const record = await db
			.select({
				id: cms_content.id,
				key: cms_content.key,
				image: cms_content.image, // Keep as blob/buffer
				image_mime_type: cms_content.image_mime_type,
				created: sql<string>`CURRENT_TIMESTAMP`, // derived
				updated: cms_content.updated
			})
			.from(cms_content)
			.where(eq(cms_content.key, key))
			.get();
		return (record as unknown as CMSContent) || null;
	} catch (error) {
		console.error('Failed to fetch CMS content:', error);
		return null;
	}
}

export async function updateCMSContent(
	key: string,
	data: Partial<CMSContent>
): Promise<CMSContent | null> {
	try {
		// Check if exists
		const existing = await db.select().from(cms_content).where(eq(cms_content.key, key)).get();

		let record;
		if (existing) {
			[record] = await db
				.update(cms_content)
				.set({ ...data, updated: new Date().toISOString() })
				.where(eq(cms_content.key, key))
				.returning();
		} else {
			[record] = await db
				.insert(cms_content)
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				.values({ key, ...data } as any)
				.returning();
		}

		return record as unknown as CMSContent;
	} catch (error) {
		console.error('Failed to update CMS content:', error);
		return null;
	}
}

export async function createMessage(data: Partial<Message>): Promise<Message | null> {
	try {
		const [record] = await db
			.insert(messages)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.values(data as any)
			.returning();
		return record as unknown as Message;
	} catch (error) {
		console.error('Failed to create message:', error);
		return null;
	}
}

export async function getMessages(): Promise<Message[]> {
	try {
		const records = await db
			.select()
			.from(messages)
			.orderBy(sql`${messages.created} DESC`)
			.all();
		return records as unknown as Message[];
	} catch (error) {
		console.error('Failed to fetch messages:', error);
		return [];
	}
}

export async function markMessageRead(id: string): Promise<Message | null> {
	try {
		const [record] = await db
			.update(messages)
			.set({ is_read: true })
			.where(eq(messages.id, id))
			.returning();
		return record as unknown as Message;
	} catch (error) {
		console.error('Failed to mark message as read:', error);
		return null;
	}
}

export async function deleteMessage(id: string): Promise<boolean> {
	try {
		await db.delete(messages).where(eq(messages.id, id));
		return true;
	} catch (error) {
		console.error('Failed to delete message:', error);
		return false;
	}
}

// Universities CRUD
export async function getUniversities(): Promise<University[]> {
	try {
		const records = await db
			.select({
				id: universities.id,
				name_en: universities.name_en,
				name_ru: universities.name_ru,
				city_en: universities.city_en,
				city_ru: universities.city_ru,
				website: universities.website,
				founded: universities.founded,
				student_count: universities.student_count,
				intl_student_count: universities.intl_student_count,
				budget_places: universities.budget_places,
				program_count: universities.program_count,
				created: universities.created,
				updated: universities.updated,
				image: sql<boolean>`CASE WHEN ${universities.image} IS NOT NULL THEN 1 ELSE 0 END`
			})
			.from(universities)
			.orderBy(asc(universities.name_en))
			.all();
		return records as unknown as University[];
	} catch (error) {
		console.error('Failed to fetch universities:', error);
		return [];
	}
}

export async function createUniversity(data: Partial<University>): Promise<{ id: string } | null> {
	try {
		const [record] = await db
			.insert(universities)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.values(data as any)
			.returning({ id: universities.id });
		return record;
	} catch (error) {
		console.error('Failed to create university:', error);
		return null;
	}
}

export async function updateUniversity(
	id: string,
	data: Partial<University>
): Promise<{ id: string } | null> {
	try {
		const [record] = await db
			.update(universities)
			.set({ ...data, updated: new Date().toISOString() })
			.where(eq(universities.id, id))
			.returning({ id: universities.id });
		return record;
	} catch (error) {
		console.error('Failed to update university:', error);
		return null;
	}
}

export async function deleteUniversity(id: string): Promise<boolean> {
	try {
		await db.delete(universities).where(eq(universities.id, id));
		return true;
	} catch (error) {
		console.error('Failed to delete university:', error);
		return false;
	}
}
