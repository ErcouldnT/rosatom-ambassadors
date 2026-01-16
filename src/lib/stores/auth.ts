import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';

interface AdminUser {
	email: string;
	name: string;
}

// Check localStorage for existing session
const storedUser = browser ? localStorage.getItem('adminUser') : null;
const initialUser: AdminUser | null = storedUser ? JSON.parse(storedUser) : null;

export const adminUser = writable<AdminUser | null>(initialUser);
export const isAuthenticated = derived(adminUser, ($user) => $user !== null);

// Mock admin credentials
const ADMIN_CREDENTIALS = {
	email: 'admin@rneambassadors.org',
	password: 'admin123',
	name: 'Admin User'
};

export function login(email: string, password: string): boolean {
	if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
		const user: AdminUser = {
			email: ADMIN_CREDENTIALS.email,
			name: ADMIN_CREDENTIALS.name
		};
		adminUser.set(user);
		if (browser) {
			localStorage.setItem('adminUser', JSON.stringify(user));
		}
		return true;
	}
	return false;
}

export function logout(): void {
	adminUser.set(null);
	if (browser) {
		localStorage.removeItem('adminUser');
	}
}
