// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getImageUrl(type: string, id: string, image: any): string {
	if (!image) {
		if (type === 'events') return '/images/placeholders/event.png';
		if (type === 'news') return '/images/placeholders/news.png';
		return '/images/placeholders/ambassador.png';
	}
	if (typeof image === 'string' && image.startsWith('http')) return image;
	return `/api/images/${type}/${id}`;
}
