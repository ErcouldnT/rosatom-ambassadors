<script lang="ts">
	import { toasts } from '$lib/stores/toast';
	import { fly } from 'svelte/transition';
	import { CheckCircle, AlertCircle, Info, X } from '@lucide/svelte';
</script>

<div class="toast toast-center toast-top z-[9999] min-w-[400px]">
	{#each $toasts as toast (toast.id)}
		<div
			class="alert gap-4 border border-base-content/5 alert-soft p-6 shadow-xl"
			class:alert-info={toast.type === 'info'}
			class:alert-primary={toast.type === 'success'}
			class:alert-warning={toast.type === 'warning'}
			class:alert-error={toast.type === 'error'}
			transition:fly={{ y: -20, duration: 300 }}
			role="alert"
		>
			{#if toast.type === 'success'}
				<CheckCircle class="h-8 w-8" />
			{:else if toast.type === 'error'}
				<AlertCircle class="h-8 w-8" />
			{:else}
				<Info class="h-8 w-8" />
			{/if}

			<div class="flex flex-col">
				<span class="text-lg leading-tight font-semibold">{toast.message}</span>
				{#if toast.type === 'success'}
					<span class="text-sm opacity-80">Thank you for reaching out!</span>
				{/if}
			</div>

			<button class="btn btn-circle btn-ghost btn-sm" on:click={() => toasts.remove(toast.id)}>
				<X class="h-5 w-5" />
			</button>
		</div>
	{/each}
</div>
