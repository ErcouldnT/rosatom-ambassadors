export function getImageUrl(collectionId: string, recordId: string, filename: string): string {
	if (!filename) return '';
	return `/api/files/${collectionId}/${recordId}/${filename}`;
}
