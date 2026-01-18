import { getAmbassadors, getEvents, getNews, getCountries, getMessages } from '$lib/server/data';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// Ensure user is authenticated (though layout handles this, it's good practice)
	if (!locals.user) {
		return {
			stats: {
				ambassadors: 0,
				activeAmbassadors: 0,
				events: 0,
				news: 0,
				countries: 0,
				messages: 0,
				unreadMessages: 0
			},
			recentMessages: [],
			topCountries: [],
			upcomingEvents: [],
			recentNews: [],
			ambassadorRoles: []
		};
	}

	const [ambassadors, events, news, countries, messages] = await Promise.all([
		getAmbassadors(false), // Fetch all to count active/inactive if needed
		getEvents(),
		getNews(),
		getCountries(true), // Only countries with ambassadors for the "Top Countries" list
		getMessages()
	]);

	const unreadMessagesString = messages.filter((m) => !m.is_read).length;
	// Fix: messages.filter might return numbers if is_read is 0/1, ensure type safety if needed.
	// Assuming is_read is boolean or 0/1.

	// Helper to parse event dates for sorting
	const monthMap: Record<string, number> = {
		January: 0,
		February: 1,
		March: 2,
		April: 3,
		May: 4,
		June: 5,
		July: 6,
		August: 7,
		September: 8,
		October: 9,
		November: 10,
		December: 11
	};

	const upcomingEvents = events
		.map((e) => {
			const month = monthMap[e.date_month_en] ?? 0;
			// Extract first number from day string (e.g. "12-14" -> 12)
			const day = parseInt(e.date_day.match(/\d+/)?.[0] || '1', 10);
			// Assume current year as we don't have year in DB for events yet (legacy schema)

			// If date is in the past, maybe it's next year? Or just show as is?
			// For this simple dashboard, let's just sort by month/day index to show "upcoming" in calendar year.
			return { ...e, sortValue: month * 100 + day };
		})
		.sort((a, b) => {
			// Sort by calendar order (Jan -> Dec)
			// Ideally we should filter out past events, but without year it's ambiguous.
			// Let's just show next events relative to "now"?
			// No, let's just sort simply for now:
			return a.sortValue - b.sortValue; // Ascending Order Jan -> Dec
		})
		// If we want "upcoming" relative to today, we'd filter:
		// .filter(e => e.sortValue >= (new Date().getMonth() * 100 + new Date().getDate()))
		// But let's keep all for visibility.
		.slice(0, 5);

	const stats = {
		ambassadors: ambassadors.length,
		activeAmbassadors: ambassadors.filter((a) => a.isActive).length,
		events: events.length,
		news: news.length,
		countries: new Set(ambassadors.map((a) => a.country_en)).size,
		messages: messages.length,
		unreadMessages: unreadMessagesString
	};

	// Get 5 recent messages
	const recentMessages = messages.slice(0, 5);

	// Get top 5 countries by ambassador count
	const topCountries = countries
		.sort((a, b) => (b.ambassador_count || 0) - (a.ambassador_count || 0))
		.slice(0, 5);

	// Get 5 recent news
	const recentNews = news
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
		.slice(0, 5);

	// Aggregate ambassador roles
	const roleCounts: Record<string, number> = {};
	ambassadors.forEach((a) => {
		if (a.isActive && a.role_en) {
			roleCounts[a.role_en] = (roleCounts[a.role_en] || 0) + 1;
		}
	});

	const ambassadorRoles = Object.entries(roleCounts)
		.map(([role, count]) => ({ role, count }))
		.sort((a, b) => b.count - a.count);

	return {
		stats,
		recentMessages,
		topCountries,
		upcomingEvents,
		recentNews,
		ambassadorRoles
	};
};
