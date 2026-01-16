import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, fetch }) => {
	const { collection, record, filename } = params;
	const POCKETBASE_URL = env.POCKETBASE_URL || 'http://pocketbase:8090'; // Default to internal docker name if not set

	const fileUrl = `${POCKETBASE_URL}/api/files/${collection}/${record}/${filename}`;

	try {
		const response = await fetch(fileUrl);

		if (!response.ok) {
			return new Response('File not found', { status: 404 });
		}

		const headers = new Headers(response.headers);
		// Ensure we don't accidentally expose sensitive headers, though PB usually strips them.
		// We definitely want cache control and content type.

		return new Response(response.body, {
			status: response.status,
			headers
		});
	} catch (error) {
		console.error('Error fetching file from PocketBase:', error);
		return new Response('Internal Server Error', { status: 500 });
	}
};
