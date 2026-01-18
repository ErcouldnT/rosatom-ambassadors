<script lang="ts">
	import { Mail, Share2, Check, Briefcase, Award, Sparkles, MapPin } from '@lucide/svelte';
	import { language } from '$lib/services/language';
	import { translations } from '$lib/services/translations';
	import { getImageUrl } from '$lib/utils';
	import { fly } from 'svelte/transition';
	import SEO from '$lib/components/SEO.svelte';

	let { data } = $props();

	let isCopied = $state(false);

	let t = $derived(translations[$language].ambassadorProfile);

	async function handleShare() {
		const shareData = {
			title: t.shareTitle,
			text: t.shareText,
			url: window.location.href
		};

		if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
			try {
				await navigator.share(shareData);
			} catch (err) {
				if ((err as Error).name !== 'AbortError') {
					console.error('Error sharing:', err);
				}
			}
		} else {
			// Fallback to clipboard
			try {
				await navigator.clipboard.writeText(window.location.href);
				isCopied = true;
				setTimeout(() => {
					isCopied = false;
				}, 2000);
			} catch (err) {
				console.error('Failed to copy:', err);
			}
		}
	}
</script>

{#await data.streamed.ambassador then ambassador}
	{#if ambassador}
		<SEO
			title={$language === 'en' ? ambassador.name_en : ambassador.name_ru}
			description={($language === 'en' ? ambassador.about_en : ambassador.about_ru) ||
				t.profileDossier}
			image={getImageUrl('ambassadors', ambassador.id, ambassador.image)}
			type="profile"
			jsonLd={{
				'@context': 'https://schema.org',
				'@type': 'Person',
				name: $language === 'en' ? ambassador.name_en : ambassador.name_ru,
				jobTitle: $language === 'en' ? ambassador.role_en : ambassador.role_ru,
				description: $language === 'en' ? ambassador.about_en : ambassador.about_ru,
				image: getImageUrl('ambassadors', ambassador.id, ambassador.image),
				nationality: {
					'@type': 'Country',
					name: $language === 'en' ? ambassador.country_en : ambassador.country_ru
				}
			}}
		/>
	{/if}
{/await}

<div class="min-h-screen bg-base-100 selection:bg-primary/20">
	{#await data.streamed.ambassador}
		<!-- Deluxe Loading State -->
		<div class="flex min-h-[80vh] items-center justify-center">
			<div class="flex flex-col items-center gap-6">
				<div class="relative h-24 w-24">
					<div class="absolute inset-0 animate-ping rounded-full bg-primary/20"></div>
					<div
						class="relative flex h-full w-full items-center justify-center rounded-full border border-base-200 bg-base-100 shadow-xl"
					>
						<span class="loading loading-lg loading-ring text-primary"></span>
					</div>
				</div>
				<p class="animate-pulse text-sm font-medium tracking-widest text-primary uppercase">
					{t.initializingProfile}
				</p>
			</div>
		</div>
	{:then ambassador}
		{#if !ambassador}
			<div class="hero min-h-[80vh] bg-base-100">
				<div class="hero-content text-center">
					<div class="max-w-md">
						<h1 class="text-9xl font-black opacity-10">404</h1>
						<h2 class="text-3xl font-bold">{t.profileUnavailable}</h2>
						<p class="py-6 text-lg opacity-60">
							{t.profileUnavailableDesc}
						</p>
						<a href="/ambassadors" class="btn btn-wide rounded-full btn-primary"
							>{t.backToNetwork}</a
						>
					</div>
				</div>
			</div>
		{:else}
			<!-- Background Layer for Atmosphere -->
			<div class="pointer-events-none absolute inset-0 z-0 h-[800px] overflow-hidden">
				<div
					class="absolute inset-0 scale-110 bg-cover bg-center opacity-10 blur-[80px]"
					style="background-image: url('{getImageUrl(
						'ambassadors',
						ambassador.id,
						ambassador.image
					)}')"
				></div>
				<div
					class="absolute inset-0 bg-gradient-to-b from-transparent via-base-100/50 to-base-100"
				></div>
			</div>

			<div class="relative z-10 pt-32 pb-32">
				<div class="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-24">
					<div class="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
						<!-- Left Side: Refined Portrait Card -->
						<div class="lg:sticky lg:top-32 lg:col-span-5 xl:col-span-4">
							<div class="group relative" in:fly={{ x: -20, duration: 1000 }}>
								<!-- Decorative Ring -->

								<div
									class="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-base-300 shadow-2xl ring-1 ring-white/10 lg:aspect-[3/4] lg:rounded-[2.5rem]"
								>
									<img
										src={getImageUrl('ambassadors', ambassador.id, ambassador.image)}
										alt={$language === 'en' ? ambassador.name_en : ambassador.name_ru}
										class="h-full w-full object-cover transition-all duration-700 group-hover:scale-105"
										onerror={(e) =>
											((e.currentTarget as HTMLImageElement).src =
												'/images/placeholders/ambassador.png')}
									/>

									<!-- Active Status Badge -->
									<div class="absolute bottom-4 left-4 lg:bottom-6 lg:left-6">
										<div
											class="flex items-center gap-2 rounded-full border border-white/20 glass px-3 py-1.5 shadow-xl backdrop-blur-md lg:px-4 lg:py-2"
										>
											<span class="relative flex h-2 w-2">
												{#if ambassador.isActive}
													<span
														class="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75"
													></span>
													<span class="relative inline-flex h-2 w-2 rounded-full bg-success"></span>
												{:else}
													<span class="relative inline-flex h-2 w-2 rounded-full bg-error"></span>
												{/if}
											</span>
											<span
												class="text-[9px] font-black tracking-widest text-white uppercase lg:text-[10px]"
											>
												{ambassador.isActive ? t.active : t.inactive}
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>

						<!-- Right Side: Content & Narrative -->
						<div class="contents lg:col-span-7 lg:block lg:space-y-16 xl:col-span-8">
							<!-- Header -->
							<header class="order-first lg:order-none" in:fly={{ y: 20, duration: 800 }}>
								<div class="mb-4 flex items-center gap-3 lg:gap-4">
									<span class="h-px w-8 bg-primary/50 lg:w-10"></span>
									<span
										class="text-[9px] font-black tracking-[0.3em] text-primary uppercase lg:text-[10px] lg:tracking-[0.4em]"
									>
										{t.profileDossier}
									</span>
								</div>

								<h1
									class="mb-6 text-4xl leading-[1.1] font-bold tracking-tight text-pretty text-base-content sm:text-6xl sm:leading-[0.9] lg:mb-8 xl:text-8xl"
								>
									{$language === 'en' ? ambassador.name_en : ambassador.name_ru}
								</h1>

								<div class="flex flex-wrap gap-2 lg:gap-3">
									<div
										class="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/10 px-3 py-1 text-primary lg:rounded-xl lg:px-4 lg:py-1.5"
									>
										<Award class="h-3.5 w-3.5 w-4 lg:h-4" />
										<span class="text-[10px] font-bold tracking-wider uppercase lg:text-xs"
											>{$language === 'en' ? ambassador.role_en : ambassador.role_ru}</span
										>
									</div>
									<div
										class="flex items-center gap-2 rounded-lg border border-secondary/20 bg-secondary/10 px-3 py-1 text-secondary lg:rounded-xl lg:px-4 lg:py-1.5"
									>
										<MapPin class="h-3.5 w-3.5 w-4 lg:h-4" />
										<span class="text-[10px] font-bold tracking-wider uppercase lg:text-xs"
											>{$language === 'en' ? ambassador.country_en : ambassador.country_ru}</span
										>
									</div>
								</div>
							</header>

							<!-- Bio Section -->
							<section class="space-y-4 lg:space-y-6" in:fly={{ y: 20, duration: 800, delay: 200 }}>
								<div class="flex items-center gap-2 opacity-30 lg:gap-3">
									<Briefcase class="h-3.5 w-3.5 w-4 lg:h-4" />
									<h2 class="text-[9px] font-black tracking-widest uppercase lg:text-[10px]">
										{t.professionalManifesto}
									</h2>
								</div>
								<div
									class="prose prose-lg max-w-none leading-relaxed font-medium text-base-content/80 sm:prose-xl"
								>
									{($language === 'en' ? ambassador.about_en : ambassador.about_ru) ||
										`A forward-thinking leader within the Rosatom Ambassador Program, dedicated to advancing sustainable energy and global innovation.`}
								</div>
							</section>

							<!-- Contributions -->
							{#if $language === 'en' ? ambassador.contributions_en : ambassador.contributions_ru}
								<section
									class="space-y-4 lg:space-y-6"
									in:fly={{ y: 20, duration: 800, delay: 400 }}
								>
									<div class="flex items-center gap-2 opacity-30 lg:gap-3">
										<Sparkles class="h-3.5 w-3.5 w-4 lg:h-4" />
										<h2 class="text-[9px] font-black tracking-widest uppercase lg:text-[10px]">
											{t.globalImpact}
										</h2>
									</div>
									<div
										class="rounded-2xl border border-base-content/5 bg-gradient-to-br from-base-200 to-base-100 p-6 shadow-inner lg:rounded-[2rem] lg:p-8"
									>
										<p class="text-base leading-relaxed text-base-content/70 italic sm:text-lg">
											{$language === 'en'
												? ambassador.contributions_en
												: ambassador.contributions_ru}
										</p>
									</div>
								</section>
							{/if}

							<!-- Actions -->
							<div class="pt-12" in:fly={{ y: 20, duration: 800, delay: 600 }}>
								<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
									<a
										href="mailto:{ambassador.email ||
											'ambassadors@rosatom.ru'}?subject=Inquiry to {$language === 'en'
											? ambassador.name_en
											: ambassador.name_ru}"
										class="btn h-16 gap-3 rounded-2xl font-black tracking-tight uppercase shadow-xl shadow-primary/20 transition-all btn-lg btn-primary hover:scale-[1.02]"
									>
										<Mail class="h-5 w-5" />
										<span class="text-base">{t.sendEmail}</span>
									</a>

									<button
										onclick={handleShare}
										class="btn h-16 gap-3 rounded-2xl font-black tracking-tight uppercase shadow-xl shadow-secondary/20 transition-all btn-lg btn-secondary hover:scale-[1.02] {isCopied
											? 'text-success-content btn-success'
											: ''}"
									>
										{#if isCopied}
											<Check class="h-5 w-5" />
										{:else}
											<Share2 class="h-5 w-5" />
										{/if}
										<span class="text-base">{isCopied ? t.copied : t.share}</span>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		{/if}
	{/await}
</div>

<style>
	:global(body) {
		overflow-x: hidden;
	}
</style>
