// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getImageUrl(type: string, id: string, image: any): string {
	if (!image) return '/placeholder-avatar.png';
	if (typeof image === 'string' && image.startsWith('http')) return image;
	return `/api/images/${type}/${id}`;
}
