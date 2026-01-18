<script lang="ts">
	import { Info, GraduationCap, Users } from '@lucide/svelte';
	import { language } from '$lib/services/language';
	import { translations } from '$lib/services/translations';

	$: t = translations[$language].about;

	// Using a placeholder image for the about section
	const defaultAboutImage =
		'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop';
	const aboutImage = '/api/images/content/about_main_image';
</script>

<section id="about" class="overflow-hidden bg-base-200 py-20 lg:py-32">
	<div class="container mx-auto px-6">
		<div class="flex flex-col items-center gap-16 lg:flex-row">
			<!-- Image Side -->
			<div class="relative lg:w-1/2">
				<div class="relative z-10 overflow-hidden rounded-[2rem] shadow-2xl">
					<img
						src={aboutImage}
						alt="About RNE Ambassadors"
						class="h-auto w-full object-cover"
						onerror={(e) => ((e.currentTarget as HTMLImageElement).src = defaultAboutImage)}
					/>
				</div>

				<!-- Decorative Elements -->
				<div
					class="absolute -top-10 -left-10 z-0 hidden h-full w-full rounded-[2rem] border-2 border-primary/20 lg:block"
				></div>
				<div
					class="absolute -right-10 -bottom-10 z-0 h-40 w-40 rounded-full bg-secondary/20 blur-2xl"
				></div>
			</div>

			<!-- Content Side -->
			<div class="lg:w-1/2">
				<div
					class="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary"
				>
					<Info class="h-4 w-4" />
					{t.title}
				</div>

				<h2 class="mb-6 text-4xl leading-tight font-bold text-base-content lg:text-5xl">
					Building a Global <span
						class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
						>Nuclear Education</span
					> Network
				</h2>

				<p class="mb-6 text-lg leading-relaxed text-base-content/80">
					{t.description_p1}
				</p>

				<p class="mb-8 text-lg leading-relaxed text-base-content/80">
					{t.description_p2}
				</p>

				<div class="flex flex-col gap-4 sm:flex-row">
					<div
						class="flex items-start gap-4 rounded-xl border border-base-content/5 bg-base-100 p-4 shadow-sm"
					>
						<div class="rounded-lg bg-primary/10 p-2 text-primary">
							<GraduationCap class="h-6 w-6" />
						</div>
						<div>
							<h4 class="font-bold text-base-content">{t.education}</h4>
							<p class="mt-1 text-sm text-base-content/60">{t.education_desc}</p>
						</div>
					</div>

					<div
						class="flex items-start gap-4 rounded-xl border border-base-content/5 bg-base-100 p-4 shadow-sm"
					>
						<div class="rounded-lg bg-secondary/10 p-2 text-secondary">
							<Users class="h-6 w-6" />
						</div>
						<div>
							<h4 class="font-bold text-base-content">{t.community}</h4>
							<p class="mt-1 text-sm text-base-content/60">{t.community_desc}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
