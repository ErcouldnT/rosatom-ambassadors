import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { THE_USER_CHAT_ID, TELEGRAM_BOT_TOKEN } from '$env/static/private';
import { createMessage } from '$lib/server/data';
import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';

const contactSchema = z.object({
	name: z.string().min(1).max(100),
	contact: z.string().min(1).max(200),
	message: z.string().min(1).max(5000)
});

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();
		const validation = contactSchema.safeParse(body);

		if (!validation.success) {
			return json({ success: false, error: validation.error.issues[0].message }, { status: 400 });
		}

		// Sanitize inputs
		const name = DOMPurify.sanitize(validation.data.name);
		const contact = DOMPurify.sanitize(validation.data.contact);
		const message = DOMPurify.sanitize(validation.data.message);

		// 1. Save to database
		await createMessage({
			name,
			contact,
			message
		});

		if (!THE_USER_CHAT_ID) {
			return json(
				{ success: false, error: 'Configuration Error: Chat ID not set.' },
				{ status: 500 }
			);
		}

		const text = `
🌟 **New Contact Form Submission**

👤 **Name:** ${name}
📧 **Contact:** ${contact}
📝 **Message:**
${message}
        `;

		const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

		const response = await fetch(telegramUrl, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				chat_id: THE_USER_CHAT_ID,
				text: text,
				parse_mode: 'Markdown'
			})
		});

		if (!response.ok) {
			console.error('Telegram API Error:', await response.text());
			// Even if telegram fails, we saved to DB, so we can consider it partial success?
			// But for now let's return error so user knows.
			// Or maybe just warn.
			return json({ success: false, error: 'Failed to send telegram message' }, { status: 502 });
		}

		return json({ success: true });
	} catch (error) {
		console.error('Server Error:', error);
		return json({ success: false, error: 'Internal Server Error' }, { status: 500 });
	}
};
