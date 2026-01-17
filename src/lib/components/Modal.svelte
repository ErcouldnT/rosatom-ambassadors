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
	<div
		class="modal-box w-full {maxWidthClasses[
			maxWidth
		]} flex max-h-[90vh] flex-col overflow-hidden p-0"
	>
		<!-- Header -->
		<div
			class="flex shrink-0 items-center justify-between border-b border-base-200 bg-base-100 px-4 py-4 sm:px-6"
		>
			<div>
				<h3 class="text-lg font-bold text-base-content sm:text-xl">{title}</h3>
				{#if subtitle}
					<p class="mt-0.5 text-sm text-base-content/60">{subtitle}</p>
				{/if}
			</div>
			<button
				type="button"
				class="btn btn-circle btn-ghost btn-sm"
				onclick={onClose}
				aria-label="Close modal"
			>
				<X class="h-5 w-5" />
			</button>
		</div>

		<!-- Content -->
		<div class="grow overflow-y-auto px-4 py-4 sm:px-6 sm:py-6">
			{@render children()}
		</div>

		<!-- Actions -->
		{#if actions}
			<div
				class="flex shrink-0 flex-col-reverse gap-2 border-t border-base-200 bg-base-100 px-4 py-4 sm:flex-row sm:justify-end sm:px-6"
			>
				{@render actions()}
			</div>
		{/if}
	</div>

	<form method="dialog" class="modal-backdrop bg-black/50">
		<button onclick={onClose}>close</button>
	</form>
</dialog>
