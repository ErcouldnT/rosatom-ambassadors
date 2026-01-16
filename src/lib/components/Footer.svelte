<script>
	import { Facebook, Twitter, Linkedin } from '@lucide/svelte';
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
		<a href="#blog" class="link link-hover">{t.links.blog}</a>
		<a href="#faq" class="link link-hover">{t.links.faq}</a>
		<a href="#contact" class="link link-hover">{t.links.contact}</a>
	</nav>
	<nav>
		<h6 class="footer-title">{t.headers.connect}</h6>
		<div class="flex gap-4">
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
			<a href="/" class="btn btn-square rounded-full btn-ghost">
				<Facebook class="h-6 w-6" />
			</a>
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
			<a href="/" class="btn btn-square rounded-full btn-ghost">
				<Twitter class="h-6 w-6" />
			</a>
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
			<a href="/" class="btn btn-square rounded-full btn-ghost">
				<Linkedin class="h-6 w-6" />
			</a>
		</div>
	</nav>
</footer>
<footer class="footer border-t border-base-300 bg-base-200 px-10 py-4 text-base-content">
	<aside class="grid-flow-col items-center">
		<p>© {new Date().getFullYear()} {t.copyright}</p>
	</aside>
</footer>
