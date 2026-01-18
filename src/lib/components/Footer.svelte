<script>
	import { Instagram } from '@lucide/svelte';
	import { language } from '$lib/services/language';
	import { translations } from '$lib/services/translations';

	$: t = translations[$language].footer;
</script>

<footer class="footer bg-base-200 p-10 text-base-content md:grid-cols-4">
	<aside class="col-span-1">
		<div class="mb-4 flex items-center gap-2">
			<span
				class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-2xl font-bold text-transparent"
				>RNE</span
			>
			<span class="text-xl font-semibold">Ambassadors</span>
		</div>
		<p class="">
			{t.desc}
		</p>
	</aside>
	<nav>
		<h6 class="footer-title">{t.headers.project}</h6>
		<a href="#about" class="link link-hover">{t.links.about}</a>
		<a href="#ambassadors" class="link link-hover">{t.links.ambassadors}</a>
		<a href="#universities" class="link link-hover">{t.links.universities}</a>
		<a href="#careers" class="link link-hover">{t.links.careers}</a>
	</nav>
	<nav>
		<h6 class="footer-title">{t.headers.resources}</h6>
		<a href="#news" class="link link-hover">{t.links.news}</a>
		<a href="#events" class="link link-hover">{t.links.events}</a>
		<a href="#faq" class="link link-hover">{t.links.faq}</a>
		<a href="#contact" class="link link-hover">{t.links.contact}</a>
	</nav>
	<nav>
		<h6 class="footer-title">{t.headers.connect}</h6>
		<div class="flex gap-4">
			<!-- Telegram -->
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
			<a href="/" class="btn btn-square rounded-full btn-ghost" aria-label="Telegram">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M21.5 2L2 11.5L9.5 14L21.5 2Z" />
					<path d="M21.5 2L14.5 21.5L9.5 14" />
					<path d="M9.5 14L15.5 8" />
				</svg>
			</a>
			<!-- Instagram -->
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
			<a href="/" class="btn btn-square rounded-full btn-ghost" aria-label="Instagram">
				<Instagram class="h-6 w-6" />
			</a>
			<!-- VK -->
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
			<a href="/" class="btn btn-square rounded-full btn-ghost" aria-label="VK">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6"
					viewBox="3 6 18 12"
					fill="currentColor"
				>
					<path
						d="M6.79 7.3H4.05c.13 6.24 3.25 9.99 8.72 9.99h.31v-3.57c2.01.2 3.53 1.67 4.14 3.57h2.84c-.78-2.84-2.83-4.41-4.11-5.01 1.28-.74 3.08-2.54 3.51-4.98h-2.58c-.56 1.98-2.22 3.78-3.8 3.95V7.3H10.5v6.92c-1.6-.4-3.62-2.34-3.71-6.92Z"
					/>
				</svg>
			</a>
		</div>
	</nav>
</footer>
<footer class="footer border-t border-base-300 bg-base-200 px-10 py-4 text-base-content">
	<aside class="grid-flow-col items-center">
		<p>© {new Date().getFullYear()} {t.copyright}</p>
	</aside>
</footer>
