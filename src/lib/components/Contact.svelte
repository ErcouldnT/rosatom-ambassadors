<script lang="ts">
	import { language } from '$lib/services/language';
	import { translations } from '$lib/services/translations';
	import { Send, Sparkles, User, Mail, MessageSquare } from '@lucide/svelte';
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	import { toasts } from '$lib/stores/toast';

	$: t = translations[$language].contact;

	let loading = false;
	let focusedField: string | null = null;

	async function handleSubmit(e: SubmitEvent) {
		loading = true;

		const formData = new FormData(e.target as HTMLFormElement);
		const data = Object.fromEntries(formData);

		try {
			const response = await fetch('/api/contact', {
				method: 'POST',
				body: JSON.stringify(data),
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (response.ok) {
				(e.target as HTMLFormElement).reset();
				toasts.add(t.success, 'success', 5000);
			} else {
				toasts.add(t.error, 'error', 5000);
			}
		} catch {
			toasts.add(t.error, 'error', 5000);
		} finally {
			loading = false;
		}
	}
</script>

<section id="contact" class="relative overflow-hidden bg-base-100 py-24 sm:py-32">
	<!-- Enhanced Decorative Background -->
	<div
		class="pointer-events-none absolute top-0 left-1/2 -z-10 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-primary/20 via-secondary/10 to-transparent opacity-60 blur-[120px]"
	></div>
	<div
		class="pointer-events-none absolute right-0 bottom-0 -z-10 h-[600px] w-[600px] translate-x-1/3 translate-y-1/3 rounded-full bg-gradient-to-tl from-secondary/20 via-primary/10 to-transparent opacity-50 blur-[100px]"
	></div>

	<!-- Grid Pattern Overlay - Removed due to missing asset -->

	<div class="relative z-10 container mx-auto max-w-6xl px-6">
		<div class="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
			<!-- Header / Info Side -->
			<div
				class="flex flex-col justify-center space-y-8"
				in:fly={{ y: 20, duration: 800, delay: 200, easing: cubicOut }}
			>
				<div
					class="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary shadow-lg ring-1 shadow-primary/10 ring-white/20 backdrop-blur-xl"
				>
					<Sparkles class="h-8 w-8" />
				</div>

				<div class="space-y-4">
					<h2
						class="bg-gradient-to-r from-base-content to-base-content/70 bg-clip-text text-4xl font-black tracking-tight text-transparent sm:text-6xl"
					>
						{t.title}
					</h2>
					<p class="max-w-lg text-lg leading-relaxed text-base-content/60">
						{t.description}
					</p>
				</div>

				<div class="flex flex-col gap-6 pt-4">
					<div class="flex items-center gap-4 text-base-content/80">
						<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-base-200/50">
							<Mail class="h-5 w-5 text-primary" />
						</div>
						<div class="flex flex-col">
							<span class="text-xs font-semibold tracking-wider text-base-content/50 uppercase"
								>Email Us</span
							>
							<span class="font-medium">contact@rosatom-ambassadors.com</span>
						</div>
					</div>
				</div>
			</div>

			<!-- Premium Glassmorphic Form -->
			<div
				class="group perspective-1000 relative"
				in:fly={{ y: 30, duration: 1000, delay: 400, easing: cubicOut }}
			>
				<!-- Animated Glow effect behind card -->
				<div
					class="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-r from-primary/40 to-secondary/40 opacity-40 blur-2xl transition-all duration-700 group-hover:opacity-70 group-hover:blur-3xl"
				></div>

				<div
					class="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl backdrop-blur-3xl dark:border-white/5 dark:bg-black/20"
				>
					<div class="card-body gap-8 p-8 sm:p-12">
						<form on:submit|preventDefault={handleSubmit} class="flex flex-col gap-6">
							<!-- Name Input -->
							<div class="group/input relative">
								<label
									for="name"
									class="mb-2 ml-1 block text-sm font-semibold text-base-content/70"
								>
									{t.name}
								</label>
								<div
									class="relative transform-gpu transition-all duration-300 {focusedField === 'name'
										? 'scale-[1.01]'
										: ''}"
								>
									<div
										class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-base-content/40 transition-colors duration-300 {focusedField ===
										'name'
											? 'text-primary'
											: ''}"
									>
										<User class="h-5 w-5" />
									</div>
									<input
										type="text"
										id="name"
										name="name"
										required
										placeholder="John Doe"
										on:focus={() => (focusedField = 'name')}
										on:blur={() => (focusedField = null)}
										class="input input-lg w-full rounded-2xl border-white/10 bg-base-100/30 pl-12 transition-all duration-300 hover:bg-base-100/50 focus:border-primary focus:bg-base-100/60 focus:ring-4 focus:ring-primary/10"
									/>
								</div>
							</div>

							<!-- Contact Input -->
							<div class="group/input relative">
								<label
									for="contact"
									class="mb-2 ml-1 block text-sm font-semibold text-base-content/70"
								>
									{t.contact}
								</label>
								<div
									class="relative transform-gpu transition-all duration-300 {focusedField ===
									'contact'
										? 'scale-[1.01]'
										: ''}"
								>
									<div
										class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-base-content/40 transition-colors duration-300 {focusedField ===
										'contact'
											? 'text-primary'
											: ''}"
									>
										<Mail class="h-5 w-5" />
									</div>
									<input
										type="text"
										id="contact"
										name="contact"
										required
										placeholder="@username or email"
										on:focus={() => (focusedField = 'contact')}
										on:blur={() => (focusedField = null)}
										class="input input-lg w-full rounded-2xl border-white/10 bg-base-100/30 pl-12 transition-all duration-300 hover:bg-base-100/50 focus:border-primary focus:bg-base-100/60 focus:ring-4 focus:ring-primary/10"
									/>
								</div>
							</div>

							<!-- Message Input -->
							<div class="group/input relative">
								<label
									for="message"
									class="mb-2 ml-1 block text-sm font-semibold text-base-content/70"
								>
									{t.message}
								</label>
								<div
									class="relative transform-gpu transition-all duration-300 {focusedField ===
									'message'
										? 'scale-[1.01]'
										: ''}"
								>
									<div
										class="pointer-events-none absolute top-4 left-0 flex pl-4 text-base-content/40 transition-colors duration-300 {focusedField ===
										'message'
											? 'text-primary'
											: ''}"
									>
										<MessageSquare class="h-5 w-5" />
									</div>
									<textarea
										id="message"
										name="message"
										required
										rows="4"
										on:focus={() => (focusedField = 'message')}
										on:blur={() => (focusedField = null)}
										class="textarea h-40 w-full resize-none rounded-2xl border-white/10 bg-base-100/30 py-4 pl-12 text-base leading-relaxed transition-all duration-300 hover:bg-base-100/50 focus:border-primary focus:bg-base-100/60 focus:ring-4 focus:ring-primary/10"
										placeholder="How can we help you?"
									></textarea>
								</div>
							</div>

							<div class="mt-2 flex justify-center">
								<button
									type="submit"
									class="group relative w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 px-8 py-4 font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-primary/25 active:scale-95 disabled:opacity-70 disabled:hover:translate-y-0 sm:w-auto"
									disabled={loading}
								>
									<!-- Shine effect -->
									<div
										class="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full"
									></div>

									<span class="relative z-10 flex items-center justify-center gap-2">
										{#if loading}
											<span class="loading loading-md loading-spinner"></span>
										{:else}
											<span>{t.send}</span>
											<Send
												class="h-5 w-5 transition-transform duration-500 group-hover:scale-110"
											/>
										{/if}
									</span>
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	/* Force placeholder styling to ensure visibility contrast */
	input::placeholder,
	textarea::placeholder {
		color: rgba(255, 255, 255, 0.3) !important;
		font-weight: 300 !important;
		opacity: 1 !important; /* Firefox needs this to override default opacity */
	}
</style>
