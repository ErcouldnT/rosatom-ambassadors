<script lang="ts">
	import { X } from '@lucide/svelte';

	interface Props {
		open: boolean;
		title: string;
		subtitle?: string;
		maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full';
		onClose: () => void;
		children: import('svelte').Snippet;
		actions?: import('svelte').Snippet;
	}

	let {
		open = $bindable(),
		title,
		subtitle = '',
		maxWidth = '2xl',
		onClose,
		children,
		actions
	}: Props = $props();

	let dialogEl: HTMLDialogElement;

	// Watch for open changes
	$effect(() => {
		if (open && dialogEl && !dialogEl.open) {
			dialogEl.showModal();
		} else if (!open && dialogEl?.open) {
			dialogEl.close();
		}
	});

	function handleBackdropClick(e: MouseEvent) {
		const target = e.target as HTMLElement;
		if (target.classList.contains('modal-backdrop')) {
			onClose();
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			e.preventDefault();
			onClose();
		}
	}

	const maxWidthClasses: Record<string, string> = {
		sm: 'max-w-sm',
		md: 'max-w-md',
		lg: 'max-w-lg',
		xl: 'max-w-xl',
		'2xl': 'max-w-2xl',
		'3xl': 'max-w-3xl',
		'4xl': 'max-w-4xl',
		'5xl': 'max-w-5xl',
		full: 'max-w-full'
	};
</script>

<dialog
	bind:this={dialogEl}
	class="modal modal-bottom sm:modal-middle"
	onkeydown={handleKeydown}
	onclick={handleBackdropClick}
>
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
		<div
			class="relative modal-box flex max-h-[90vh] w-full flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[#121212]/80 p-0 shadow-2xl backdrop-blur-3xl {maxWidthClasses[
				maxWidth
			]}"
			style="animation: modal-pop 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)"
		>
			<!-- Header -->
			<div
				class="flex shrink-0 items-center justify-between border-b border-white/5 bg-white/5 px-8 py-6 backdrop-blur-md"
			>
				<div class="space-y-1">
					<h3 class="text-2xl font-bold tracking-tight text-white">{title}</h3>
					{#if subtitle}
						<p class="text-sm font-medium text-white/50">{subtitle}</p>
					{/if}
				</div>
				<button
					type="button"
					class="btn btn-circle text-white/40 btn-ghost btn-sm hover:bg-white/10 hover:text-white"
					onclick={onClose}
					aria-label="Close modal"
				>
					<X class="h-5 w-5" />
				</button>
			</div>

			<!-- Content -->
			<div
				class="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20 grow overflow-y-auto px-8 py-8"
			>
				{@render children()}
			</div>

			<!-- Actions -->
			{#if actions}
				<div
					class="flex shrink-0 flex-col-reverse gap-3 border-t border-white/5 bg-white/5 px-8 py-6 backdrop-blur-md sm:flex-row sm:justify-end"
				>
					{@render actions()}
				</div>
			{/if}
		</div>
	</div>

	<form method="dialog" class="modal-backdrop bg-black/60 backdrop-blur-sm">
		<button onclick={onClose}>close</button>
	</form>
</dialog>

<style>
	@keyframes modal-pop {
		0% {
			opacity: 0;
			transform: scale(0.95) translateY(10px);
		}
		100% {
			opacity: 1;
			transform: scale(1) translateY(0);
		}
	}
</style>
