export interface Stat {
	label: string;
	value: string;
	icon: string;
}

export interface NewsItem {
	id: number;
	category: string;
	date: string;
	title: string;
	excerpt: string;
	image: string;
}

export interface Country {
	name: string;
	region: string;
}

export const getStats = (): Stat[] => [
	{ label: 'Ambassadors', value: '50+', icon: 'users' },
	{ label: 'Countries', value: '28', icon: 'globe' },
	{ label: 'Events Held', value: '20+', icon: 'calendar' },
	{ label: 'Students Reached', value: '1000+', icon: 'academic-cap' }
];

export const getCountries = (): Country[] => [
	{ name: 'Russia', region: 'Europe' },
	{ name: 'Turkey', region: 'Europe/Asia' },
	{ name: 'Egypt', region: 'Africa' },
	{ name: 'India', region: 'Asia' },
	{ name: 'China', region: 'Asia' },
	{ name: 'Brazil', region: 'South America' },
	{ name: 'South Africa', region: 'Africa' },
	{ name: 'Bangladesh', region: 'Asia' },
	{ name: 'Bolivia', region: 'South America' },
	{ name: 'Hungary', region: 'Europe' }
];

export const getNews = (): NewsItem[] => [
	{
		id: 1,
		category: 'Events',
		date: 'Oct 24, 2024',
		title: 'International Youth Nuclear Congress in Sochi',
		excerpt: 'Ambassadors gathered to discuss the future of nuclear education and sustainability.',
		image:
			'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=800&auto=format&fit=crop'
	},
	{
		id: 2,
		category: 'Education',
		date: 'Nov 12, 2024',
		title: 'New Scholarship Opportunities for 2025',
		excerpt: 'Rosatom announces new funding for international students in STEM fields.',
		image:
			'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop'
	},
	{
		id: 3,
		category: 'Ambassadors',
		date: 'Dec 05, 2024',
		title: 'Meet Our New Ambassador from Ghana',
		excerpt: 'Interview with Kwame, who is bringing nuclear science to schools in Accra.',
		image:
			'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop'
	}
];
