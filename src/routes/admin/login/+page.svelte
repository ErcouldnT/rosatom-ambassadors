<script lang="ts">
	import { goto } from '$app/navigation';
	import { Atom, Eye, EyeOff, Lock, Mail, Shield, Sparkles } from '@lucide/svelte';

	let email = '';
	let password = '';
	let showPassword = false;
	let error = '';
	let loading = false;

	async function handleLogin() {
		loading = true;
		error = '';

		try {
			const response = await fetch('/api/admin/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password })
			});

			const data = await response.json();

			if (data.success) {
				goto('/admin');
			} else {
				error = 'Invalid email or password';
			}
		} catch {
			error = 'An error occurred. Please try again.';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Admin Login - RNE Ambassadors</title>
</svelte:head>

<!-- Background with animated gradient -->
<div
	class="relative flex min-h-screen items-center justify-center overflow-hidden bg-base-300 px-4"
>
	<!-- Animated gradient orbs -->
	<div
		class="absolute -top-32 -left-32 h-96 w-96 animate-pulse rounded-full bg-primary/20 blur-3xl"
	></div>
	<div
		class="absolute -right-32 -bottom-32 h-96 w-96 animate-pulse rounded-full bg-secondary/20 blur-3xl"
		style="animation-delay: 1s;"
	></div>
	<div
		class="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-accent/10 blur-3xl"
		style="animation-delay: 0.5s;"
	></div>

	<!-- Grid pattern overlay -->
	<div
		class="absolute inset-0 opacity-5"
		style="background-image: linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px); background-size: 50px 50px;"
	></div>

	<div class="relative z-10 w-full max-w-md">
		<!-- Floating badge -->
		<div class="mb-6 flex justify-center">
			<div
				class="badge gap-2 border-primary/30 bg-primary/10 px-4 py-3 badge-lg text-primary backdrop-blur-sm"
			>
				<Shield class="h-4 w-4" />
				<span class="text-xs font-medium tracking-wide uppercase">Secure Admin Portal</span>
			</div>
		</div>

		<!-- Main card with glassmorphism -->
		<div
			class="card relative overflow-hidden border border-base-content/10 bg-base-100/80 shadow-2xl backdrop-blur-xl"
		>
			<!-- Top gradient line -->
			<div
				class="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent"
			></div>

			<!-- Decorative elements -->
			<div class="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-primary/5"></div>
			<div class="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-secondary/5"></div>

			<div class="relative z-10 card-body p-8">
				<!-- Logo section -->
				<div class="mb-6 text-center">
					<div class="relative mx-auto mb-4 inline-block">
						<!-- Outer glow ring -->
						<div
							class="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-primary to-secondary opacity-20 blur-lg"
						></div>
						<!-- Icon container -->
						<div
							class="relative flex h-20 w-20 items-center justify-center rounded-full border border-primary/20 bg-gradient-to-br from-primary/10 to-secondary/10"
						>
							<div
								class="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80"
							>
								<Atom class="h-7 w-7 text-primary-content" />
							</div>
						</div>
						<!-- Sparkle decoration -->
						<div class="absolute -top-1 -right-1">
							<Sparkles class="h-5 w-5 text-warning" />
						</div>
					</div>
					<h1 class="text-2xl font-bold text-base-content">Welcome Back</h1>
					<p class="mt-1 text-sm text-base-content/60">Sign in to your admin dashboard</p>
				</div>

				<!-- Login form -->
				<form on:submit|preventDefault={handleLogin} class="space-y-5">
					{#if error}
						<div class="alert alert-soft alert-error">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5 shrink-0"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<span class="text-sm">{error}</span>
						</div>
					{/if}

					<!-- Email field -->
					<div class="form-control">
						<label class="label pb-1" for="email">
							<span class="label-text font-medium text-base-content/70">Email Address</span>
						</label>
						<label
							class="input input-lg flex w-full items-center gap-3 border-base-content/10 bg-base-200/50 transition-all duration-200 focus-within:border-primary focus-within:bg-base-100"
						>
							<Mail class="h-5 w-5 text-base-content/40" />
							<input
								type="email"
								id="email"
								bind:value={email}
								class="grow bg-transparent text-sm text-base-content outline-none"
								required
							/>
						</label>
					</div>

					<!-- Password field -->
					<div class="form-control">
						<label class="label pb-1" for="password">
							<span class="label-text font-medium text-base-content/70">Password</span>
						</label>
						<label
							class="input input-lg flex w-full items-center gap-3 border-base-content/10 bg-base-200/50 transition-all duration-200 focus-within:border-primary focus-within:bg-base-100"
						>
							<Lock class="h-5 w-5 text-base-content/40" />
							<input
								type={showPassword ? 'text' : 'password'}
								id="password"
								bind:value={password}
								class="grow bg-transparent text-sm text-base-content outline-none"
								required
							/>
							<button
								type="button"
								class="text-base-content/40 transition-colors hover:text-base-content/70"
								on:click={() => (showPassword = !showPassword)}
							>
								{#if showPassword}
									<EyeOff class="h-5 w-5" />
								{:else}
									<Eye class="h-5 w-5" />
								{/if}
							</button>
						</label>
					</div>

					<!-- Submit button -->
					<button
						type="submit"
						class="group btn relative w-full overflow-hidden transition-all duration-300 btn-lg btn-primary hover:shadow-lg hover:shadow-primary/25"
						disabled={loading}
					>
						<!-- Button gradient overlay -->
						<div
							class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
						></div>

						<span class="relative flex items-center justify-center gap-2">
							{#if loading}
								<span class="loading loading-sm loading-spinner"></span>
								<span>Signing in...</span>
							{:else}
								<span>Sign In</span>
							{/if}
						</span>
					</button>
				</form>

				<!-- Divider -->
				<div class="divider my-6 text-xs text-base-content/40">PROTECTED AREA</div>

				<!-- Security note -->
				<div class="rounded-xl border border-base-content/5 bg-base-200/30 p-4">
					<div class="flex items-start gap-3">
						<div
							class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-info/10 text-info"
						>
							<Shield class="h-6 w-6" />
						</div>
						<div>
							<p class="text-xs font-medium text-base-content/80">Secure Connection</p>
							<p class="mt-0.5 text-xs text-base-content/50">
								Your connection is encrypted and secure. Only authorized administrators can access
								this portal.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Footer text -->
		<div class="mt-6 text-center">
			<p class="text-xs text-base-content/40">
				RNE Ambassadors Dashboard &copy; {new Date().getFullYear()}
			</p>
		</div>
	</div>
</div>

<style>
	/* Custom animation for smoother pulse */
	@keyframes gentle-pulse {
		0%,
		100% {
			opacity: 0.2;
			transform: scale(1);
		}
		50% {
			opacity: 0.3;
			transform: scale(1.05);
		}
	}

	/* Override browser autofill styles */
	input:-webkit-autofill,
	input:-webkit-autofill:hover,
	input:-webkit-autofill:focus,
	input:-webkit-autofill:active {
		-webkit-background-clip: text;
		-webkit-text-fill-color: var(--fallback-bc, oklch(var(--bc) / 1));
		transition: background-color 5000s ease-in-out 0s;
		box-shadow: inset 0 0 20px 20px transparent;
		font-size: 14px !important;
		font-family: inherit !important;
	}

	/* Enforce font size on specific inputs */
	#email,
	#password {
		font-size: 14px !important;
	}
</style>
