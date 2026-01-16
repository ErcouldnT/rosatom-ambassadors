import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';
import { env } from '$env/dynamic/private';

if (!env.TURSO_CONNECTION_URL) throw new Error('TURSO_CONNECTION_URL is not set');

const client = createClient({
	url: env.TURSO_CONNECTION_URL,
	authToken: env.TURSO_AUTH_TOKEN
});

export const db = drizzle(client, { schema });
