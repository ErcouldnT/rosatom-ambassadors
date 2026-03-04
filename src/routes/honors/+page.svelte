<script lang="ts">
	import { language } from '$lib/services/language';
	import { translations } from '$lib/services/translations';
	import { Trophy, Award, Star, Sparkles } from '@lucide/svelte';
	import { getImageUrl } from '$lib/utils';
	import SEO from '$lib/components/SEO.svelte';

	let { data } = $props();

	let t = $derived(translations[$language].honorsPage);
</script>

<SEO title={t.title} description={t.description} />

<div class="min-h-screen bg-base-100 pt-24 pb-20">
	<div class="container mx-auto px-6">
		<!-- Header -->
		<div class="mb-16 text-center">
			<div
				class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-warning/20 to-primary/20"
			>
				<Trophy class="h-10 w-10 text-warning" />
			</div>
			<h1 class="mb-4 text-3xl font-bold tracking-tight text-base-content md:text-4xl lg:text-5xl">
				{t.title}
			</h1>
			<p class="mx-auto max-w-2xl text-lg text-base-content/70">
				{t.description}
			</p>
		</div>

		{#await data.streamed.ambassadors}
			<div class="flex justify-center py-20">
				<span class="loading loading-lg loading-spinner text-primary"></span>
			</div>
		{:then ambassadors}
			{#if ambassadors.length > 0}
				<div class="space-y-16">
					{#each ambassadors as ambassador (ambassador.id)}
						{@const awards = ambassador.awards || []}
						<div
							class="group relative overflow-hidden rounded-3xl border border-base-200 bg-base-200/30 shadow-xl transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5"
						>
							<div class="grid grid-cols-1 md:grid-cols-[350px_1fr] lg:grid-cols-[400px_1fr]">
								<!-- Large Photo -->
								<div class="relative h-[300px] overflow-hidden md:h-full md:min-h-[400px]">
									<img
										src={getImageUrl('ambassadors', ambassador.id, ambassador.image)}
										alt={$language === 'en' ? ambassador.name_en : ambassador.name_ru}
										class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
										loading="lazy"
										onerror={(e) =>
											((e.currentTarget as HTMLImageElement).src =
												'/images/placeholders/ambassador.png')}
									/>
									<div
										class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:bg-gradient-to-r"
									></div>

									<!-- Decorative badge -->
									<div class="absolute top-4 left-4">
										<div
											class="flex items-center gap-2 rounded-full bg-warning/90 px-3 py-1.5 text-xs font-bold text-warning-content shadow-lg backdrop-blur-sm"
										>
											<Star size={14} class="fill-current" />
											{awards.length}
											{t.awards}
										</div>
									</div>
								</div>

								<!-- Content -->
								<div class="flex flex-col justify-center p-8 lg:p-12">
									<div class="mb-2 flex items-center gap-2">
										<Sparkles size={16} class="text-warning" />
										<span class="text-xs font-bold tracking-widest text-warning uppercase">
											{t.awards}
										</span>
									</div>

									<h2
										class="mb-2 text-2xl font-extrabold tracking-tight text-base-content lg:text-3xl"
									>
										{$language === 'en' ? ambassador.name_en : ambassador.name_ru}
									</h2>

									<p class="mb-1 text-sm font-medium text-primary">
										{$language === 'en' ? ambassador.country_en : ambassador.country_ru}
									</p>
									<p class="mb-6 text-sm text-base-content/60">
										{$language === 'en' ? ambassador.role_en : ambassador.role_ru}
									</p>

									<!-- Awards List -->
									<div class="space-y-3">
										{#each awards as award (award.title_en)}
											<div
												class="flex items-start gap-3 rounded-xl border border-warning/20 bg-warning/5 p-4 transition-colors hover:bg-warning/10"
											>
												<div
													class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-warning/10"
												>
													<Award size={20} class="text-warning" />
												</div>
												<div class="flex-1">
													<h4 class="font-bold text-base-content">
														{$language === 'en' ? award.title_en : award.title_ru}
													</h4>
													{#if award.year}
														<span class="text-xs font-medium text-base-content/50"
															>{award.year}</span
														>
													{/if}
												</div>
											</div>
										{/each}
									</div>

									<!-- Profile Link -->
									<a
										href="/ambassadors/@{ambassador.slug}"
										class="btn mt-8 w-fit gap-2 rounded-xl border-none bg-primary/10 text-primary hover:bg-primary hover:text-primary-content"
									>
										<Trophy size={16} />
										{translations[$language].ambassadorsPage.viewProfile}
									</a>
								</div>
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<div class="py-20 text-center">
					<div
						class="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-base-200 text-base-content/20"
					>
						<Trophy size={40} />
					</div>
					<h3 class="text-xl font-bold text-base-content">{t.noAwards}</h3>
				</div>
			{/if}
		{:catch error}
			<div class="py-20 text-center text-error">
				<p>Error loading honors: {error.message}</p>
			</div>
		{/await}
	</div>
</div>
