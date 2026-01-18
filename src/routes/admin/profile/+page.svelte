<script lang="ts">
	import AdminInput from '$lib/components/admin/AdminInput.svelte';
	import { toasts } from '$lib/stores/toast';
	import { Shield, Key } from '@lucide/svelte';

	let form = $state({
		currentPassword: '',
		newPassword: '',
		confirmNewPassword: ''
	});

	let submitting = $state(false);
	let error = $state('');

	async function handleSubmit() {
		if (form.newPassword !== form.confirmNewPassword) {
			error = "New passwords don't match";
			return;
		}

		submitting = true;
		error = '';

		try {
			const res = await fetch('/api/admin/profile/password', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(form)
			});

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.error || 'Failed to update password');
			}

			toasts.add('Password updated successfully', 'success');
			form = {
				currentPassword: '',
				newPassword: '',
				confirmNewPassword: ''
			};
		} catch (err) {
			console.error(err);
			if (err instanceof Error) {
				error = err.message;
			} else {
				error = 'An unexpected error occurred';
			}
		} finally {
			submitting = false;
		}
	}
</script>

<svelte:head>
	<title>Admin Profile - RNE Ambassadors</title>
</svelte:head>

<div class="mx-auto max-w-2xl space-y-8">
	<!-- Header -->
	<div class="flex items-center gap-4">
		<div class="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
			<Shield class="h-6 w-6" />
		</div>
		<div>
			<h1 class="text-3xl font-bold tracking-tight text-base-content">Admin Profile</h1>
			<p class="mt-1 text-base-content/60">Manage your account security and settings</p>
		</div>
	</div>

	<!-- Password Change Card -->
	<div class="card overflow-hidden rounded-xl border border-base-200 bg-base-100 shadow-sm">
		<div class="border-b border-base-200 bg-base-200/30 p-6">
			<h2 class="flex items-center gap-2 text-lg font-semibold">
				<Key class="h-5 w-5 text-primary" />
				Change Password
			</h2>
			<p class="mt-1 text-sm text-base-content/60">
				Ensure your account is secure by using a strong, unique password.
			</p>
		</div>

		<div class="p-6">
			<form
				onsubmit={(e) => {
					e.preventDefault();
					handleSubmit();
				}}
				class="space-y-6"
			>
				<AdminInput
					id="currentPassword"
					label="Current Password"
					type="password"
					bind:value={form.currentPassword}
					placeholder="Enter your current password"
					required
				/>

				<div class="grid gap-6 md:grid-cols-2">
					<AdminInput
						id="newPassword"
						label="New Password"
						type="password"
						bind:value={form.newPassword}
						placeholder="Min. 8 characters"
						required
					/>

					<AdminInput
						id="confirmNewPassword"
						label="Confirm New Password"
						type="password"
						bind:value={form.confirmNewPassword}
						placeholder="Re-enter new password"
						required
					/>
				</div>

				{#if error}
					<div
						class="flex items-center gap-3 rounded-xl border border-error/20 bg-error/5 p-4 text-sm font-medium text-error"
					>
						<div class="h-2 w-2 rounded-full bg-error"></div>
						{error}
					</div>
				{/if}

				<div class="flex justify-end pt-4">
					<button type="submit" class="btn px-8 btn-primary" disabled={submitting}>
						{#if submitting}
							<span class="loading loading-sm loading-spinner"></span>
						{/if}
						Update Password
					</button>
				</div>
			</form>
		</div>
	</div>
</div>
