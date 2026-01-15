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

export interface Ambassador {
	id: number;
	name: string;
	country: string;
	role: string;
	image: string;
}

export const getAmbassadors = (): Ambassador[] => [
	{
		id: 1,
		name: 'Seyyid Abdullah Büker',
		country: 'Turkey',
		role: 'Nuclear Physics Student',
		image:
			'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop'
	},
	{
		id: 2,
		name: 'Samed',
		country: 'Turkey',
		role: 'Engineering Ambassador',
		image:
			'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop'
	},
	{
		id: 3,
		name: 'fgfsd',
		country: 'Turkey',
		role: 'Student',
		image:
			'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop'
	},
	{
		id: 4,
		name: 'CAnsss',
		country: 'Turkey',
		role: 'Researcher',
		image:
			'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop'
	},
	{
		id: 5,
		name: 'Sohyla Montasser Aboudeif',
		country: 'Egypt',
		role: 'Nuclear Engineer',
		image:
			'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=800&auto=format&fit=crop'
	},
	{
		id: 6,
		name: 'CANSIN',
		country: 'Turkey',
		role: 'Physics Major',
		image:
			'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop'
	},
	{
		id: 7,
		name: 'Maria',
		country: 'Brazil',
		role: 'International Relations',
		image:
			'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop'
	},
	{
		id: 8,
		name: 'Samiru',
		country: 'India',
		role: 'Tech Lead',
		image:
			'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=800&auto=format&fit=crop'
	}
];

export interface Event {
	id: number;
	title: string;
	date: {
		day: string;
		month: string;
	};
	time: string;
	location: string;
	description: string;
}

export const getEventsList = (): Event[] => [
	{
		id: 1,
		title: 'International Nuclear Science Forum 2024',
		date: { day: '21', month: 'OCT' },
		time: '10:00 AM',
		location: 'Moscow, Russia',
		description:
			'Join us for a comprehensive discussion on the future of nuclear energy education and global cooperation.'
	},
	{
		id: 2,
		title: 'International Nuclear Science Forum 2024',
		date: { day: '22', month: 'OCT' },
		time: '10:00 AM',
		location: 'Moscow, Russia',
		description:
			'Join us for a comprehensive discussion on the future of nuclear energy education and global cooperation.'
	},
	{
		id: 3,
		title: 'International Nuclear Science Forum 2024',
		date: { day: '23', month: 'OCT' },
		time: '10:00 AM',
		location: 'Moscow, Russia',
		description:
			'Join us for a comprehensive discussion on the future of nuclear energy education and global cooperation.'
	}
];
