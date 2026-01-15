<script lang="ts">
	import { language } from '$lib/stores/language';
	import { translations } from '$lib/services/translations';
	import { Send } from '@lucide/svelte';

	import { toasts } from '$lib/stores/toast';

	$: t = translations[$language].contact;

	let loading = false;

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

<section id="contact" class="relative bg-base-100 py-24">
	<div class="container mx-auto max-w-2xl px-6">
		<div class="mb-12 text-center">
			<h2 class="mb-4 text-4xl font-bold">{t.title}</h2>
			<p class="text-lg text-base-content/70">
				{t.description}
			</p>
		</div>

		<div class="card border border-base-300 bg-base-100 shadow-xl">
			<div class="card-body gap-6 p-8">
				<form on:submit|preventDefault={handleSubmit} class="flex flex-col gap-6">
					<label class="floating-label w-full">
						<input
							type="text"
							name="name"
							required
							placeholder="John Doe"
							class="input input-lg w-full bg-base-100/50"
						/>
						<span>{t.name}</span>
					</label>

					<label class="floating-label w-full">
						<input
							type="text"
							name="contact"
							required
							placeholder="@username or email"
							class="input input-lg w-full bg-base-100/50"
						/>
						<span>{t.contact}</span>
					</label>

					<label class="floating-label w-full">
						<textarea
							name="message"
							required
							rows="4"
							class="textarea h-40 w-full bg-base-100/50 textarea-lg"
							placeholder="Hello..."
						></textarea>
						<span>{t.message}</span>
					</label>

					<div class="mt-2 card-actions justify-end">
						<button
							type="submit"
							class="btn w-full transition-all duration-200 btn-soft btn-xl btn-primary hover:scale-[1.01] active:scale-98"
							disabled={loading}
						>
							{#if loading}
								<span class="loading loading-spinner"></span>
							{:else}
								{t.send}
								<Send class="ml-2 h-5 w-5" />
							{/if}
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</section>
