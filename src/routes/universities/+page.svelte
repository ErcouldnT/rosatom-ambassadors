<script lang="ts">
	import { language } from '$lib/services/language';
	import { translations } from '$lib/services/translations';
	import { GraduationCap, MapPin, Globe, Users, BookOpen, Calendar } from '@lucide/svelte';
	import { getImageUrl } from '$lib/utils';
	import SEO from '$lib/components/SEO.svelte';

	let { data } = $props();

	let t = $derived(translations[$language].universitiesPage);
</script>

<SEO title={t.title} description={t.description} />

<div class="min-h-screen bg-base-100 pt-24 pb-20">
	<div class="container mx-auto px-6">
		<!-- Header -->
		<div class="mb-12 text-center">
			<div
				class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"
			>
				<GraduationCap class="h-8 w-8 text-primary" />
			</div>
			<h1 class="mb-4 text-3xl font-bold tracking-tight text-base-content md:text-4xl lg:text-5xl">
				{t.title}
			</h1>
			<p class="mx-auto max-w-2xl text-lg text-base-content/70">
				{t.description}
			</p>
		</div>

		{#await data.streamed.universities}
			<div class="flex justify-center py-20">
				<span class="loading loading-lg loading-spinner text-primary"></span>
			</div>
		{:then universities}
			{#if universities.length > 0}
				<!-- University Count -->
				<div class="mb-8">
					<span class="text-lg font-bold text-primary">
						{universities.length}
						{$language === 'ru' ? 'университетов' : 'universities'}
					</span>
				</div>

				<div class="space-y-6">
					{#each universities as uni (uni.id)}
						<div
							class="card overflow-hidden border border-base-200 bg-base-100 shadow-lg transition-all duration-300 hover:shadow-xl"
						>
							<div class="card-body p-0">
								<div class="grid grid-cols-1 md:grid-cols-[1fr_2fr]">
									<!-- Left: Image + Name Overlay -->
									<div class="relative h-[220px] overflow-hidden md:h-auto md:min-h-[280px]">
										<img
											src={getImageUrl('universities', uni.id, uni.image)}
											alt={$language === 'en' ? uni.name_en : uni.name_ru}
											class="h-full w-full object-cover"
											loading="lazy"
											onerror={(e) =>
												((e.currentTarget as HTMLImageElement).src =
													'/images/placeholders/university.png')}
										/>
										<div
											class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
										></div>
										<div class="absolute bottom-0 left-0 w-full p-6 text-white">
											<h2 class="mb-2 text-xl leading-tight font-extrabold drop-shadow-lg">
												{$language === 'en' ? uni.name_en : uni.name_ru}
											</h2>
											{#if uni.city_en}
												<div class="flex items-center gap-2 text-sm text-white/80">
													<MapPin size={14} />
													<span>{$language === 'en' ? uni.city_en : uni.city_ru}</span>
												</div>
											{/if}
											{#if uni.website}
												<div class="mt-1 flex items-center gap-2 text-sm text-white/70">
													<Globe size={14} />
													<a
														href={uni.website.startsWith('http')
															? uni.website
															: `https://${uni.website}`}
														target="_blank"
														class="underline decoration-white/40 underline-offset-2 hover:text-white"
														>{uni.website}</a
													>
												</div>
											{/if}
										</div>
									</div>

									<!-- Right: Stats Grid -->
									<div class="border-t border-base-200 p-6 md:border-t-0 md:border-l">
										<div class="grid grid-cols-2 gap-4">
											{#if uni.founded}
												<div class="rounded-xl bg-base-200/50 p-4">
													<div
														class="mb-1 flex items-center gap-2 text-xs font-medium text-base-content/60"
													>
														<Calendar size={12} />
														{t.founded}
													</div>
													<div class="text-lg font-bold text-base-content">{uni.founded}</div>
												</div>
											{/if}
											{#if uni.student_count}
												<div class="rounded-xl bg-base-200/50 p-4">
													<div
														class="mb-1 flex items-center gap-2 text-xs font-medium text-base-content/60"
													>
														<Users size={12} />
														{t.students}
													</div>
													<div class="text-lg font-bold text-base-content">
														{uni.student_count?.toLocaleString()}
													</div>
												</div>
											{/if}
											{#if uni.budget_places}
												<div class="rounded-xl bg-base-200/50 p-4">
													<div class="mb-1 text-xs font-medium text-base-content/60">
														{t.budgetPlaces}
													</div>
													<div class="text-lg font-bold text-base-content">
														{uni.budget_places?.toLocaleString()}
													</div>
												</div>
											{/if}
											{#if uni.intl_student_count}
												<div class="rounded-xl bg-base-200/50 p-4">
													<div class="mb-1 text-xs font-medium text-base-content/60">
														{t.intlStudents}
													</div>
													<div class="text-lg font-bold text-base-content">
														{uni.intl_student_count?.toLocaleString()}
													</div>
												</div>
											{/if}
										</div>

										{#if uni.program_count}
											<div class="mt-4 flex items-center gap-2 text-sm font-medium text-primary">
												<BookOpen size={14} />
												{uni.program_count}
												{$language === 'ru' ? 'образовательных программ' : 'educational programs'}
											</div>
										{/if}

										{#if uni.website}
											<div class="mt-4">
												<a
													href={uni.website.startsWith('http')
														? uni.website
														: `https://${uni.website}`}
													target="_blank"
													class="btn gap-2 rounded-xl btn-sm btn-primary"
												>
													<Globe size={14} />
													{t.visitWebsite}
												</a>
											</div>
										{/if}
									</div>
								</div>
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<div class="py-20 text-center">
					<div
						class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-base-200 text-base-content/20"
					>
						<GraduationCap size={32} />
					</div>
					<h3 class="text-xl font-bold text-base-content">{t.noUniversities}</h3>
				</div>
			{/if}
		{:catch error}
			<div class="py-20 text-center text-error">
				<p>Error loading universities: {error.message}</p>
			</div>
		{/await}
	</div>
</div>
