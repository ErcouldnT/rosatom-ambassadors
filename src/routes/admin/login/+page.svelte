<script lang="ts">
	import { goto } from '$app/navigation';
	import { Atom, Lock, Mail } from '@lucide/svelte';

	let email = '';
	let password = '';
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

<div class="flex min-h-screen items-center justify-center bg-base-200 px-4">
	<div class="w-full max-w-md">
		<!-- Logo -->
		<div class="mb-8 text-center">
			<div
				class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"
			>
				<Atom class="h-8 w-8 text-primary" />
			</div>
			<h1 class="text-2xl font-bold text-base-content">Admin Dashboard</h1>
			<p class="mt-2 text-base-content/70">Sign in to manage your site</p>
		</div>

		<!-- Login Form -->
		<div class="card bg-base-100 shadow-xl">
			<div class="card-body">
				<form on:submit|preventDefault={handleLogin} class="space-y-4">
					{#if error}
						<div class="alert alert-error">
							<span>{error}</span>
						</div>
					{/if}

					<div class="form-control">
						<label class="label" for="email">
							<span class="label-text">Email</span>
						</label>
						<label class="input-bordered input flex items-center gap-2">
							<Mail class="h-4 w-4 opacity-70" />
							<input
								type="email"
								id="email"
								bind:value={email}
								placeholder="admin@example.com"
								class="grow"
								required
							/>
						</label>
					</div>

					<div class="form-control">
						<label class="label" for="password">
							<span class="label-text">Password</span>
						</label>
						<label class="input-bordered input flex items-center gap-2">
							<Lock class="h-4 w-4 opacity-70" />
							<input
								type="password"
								id="password"
								bind:value={password}
								placeholder="••••••••"
								class="grow"
								required
							/>
						</label>
					</div>

					<button type="submit" class="btn w-full btn-primary" disabled={loading}>
						{#if loading}
							<span class="loading loading-sm loading-spinner"></span>
						{/if}
						Sign In
					</button>
				</form>
			</div>
		</div>
	</div>
</div>
