import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { THE_USER_CHAT_ID, TELEGRAM_BOT_TOKEN } from '$env/static/private';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { name, contact, message } = await request.json();

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
			return json({ success: false, error: 'Failed to send telegram message' }, { status: 502 });
		}

		return json({ success: true });
	} catch (error) {
		console.error('Server Error:', error);
		return json({ success: false, error: 'Internal Server Error' }, { status: 500 });
	}
};
