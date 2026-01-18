<script lang="ts">
	import { Trash2, Eye, Mail, MessageSquare } from '@lucide/svelte';
	import { toasts } from '$lib/stores/toast';
	import Modal from '$lib/components/Modal.svelte';
	import type { Message } from '$lib/types';

	interface Props {
		data: {
			messages: Message[];
		};
	}

	let { data }: Props = $props();
	let messages = $state(data.messages);
	let viewingMessage = $state<Message | null>(null);
	let viewModalOpen = $state(false);

	async function toggleRead(id: string, currentStatus: boolean) {
		if (currentStatus) return; // Already read

		try {
			const res = await fetch('/api/admin/messages', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id })
			});

			if (res.ok) {
				messages = messages.map((m) => (m.id === id ? { ...m, is_read: true } : m));
			}
		} catch (e) {
			console.error(e);
		}
	}

	async function deleteMessage(id: string) {
		if (!confirm('Are you sure you want to delete this message?')) return;

		try {
			const res = await fetch('/api/admin/messages', {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id })
			});

			if (res.ok) {
				messages = messages.filter((m) => m.id !== id);
				toasts.add('Message deleted', 'success');
			} else {
				toasts.add('Failed to delete message', 'error');
			}
		} catch (_e) {
			toasts.add('Error deleting message', 'error');
		}
	}

	function viewMessage(msg: Message) {
		viewingMessage = msg;
		viewModalOpen = true;
		if (!msg.is_read) {
			toggleRead(msg.id, false);
		}
	}
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold tracking-tight text-base-content">Messages</h1>
			<p class="mt-1 text-sm text-base-content/70">Manage contact form submissions.</p>
		</div>
		<div class="badge badge-primary">{messages.filter((m) => !m.is_read).length} Unread</div>
	</div>

	<div class="overflow-x-auto rounded-xl border border-base-200 bg-base-100 shadow-xl">
		<table class="table">
			<thead class="bg-base-200/50 text-base-content">
				<tr>
					<th>Status</th>
					<th>Name</th>
					<th>Contact</th>
					<th>Date</th>
					<th class="text-right">Actions</th>
				</tr>
			</thead>
			<tbody>
				{#if messages.length === 0}
					<tr>
						<td colspan="5" class="py-8 text-center text-base-content/60"> No messages found. </td>
					</tr>
				{/if}
				{#each messages as msg (msg.id)}
					<tr class="hover:bg-base-200/50 {msg.is_read ? 'opacity-70' : 'font-medium'}">
						<td>
							{#if msg.is_read}
								<div class="badge gap-2 badge-ghost">Read</div>
							{:else}
								<div class="badge gap-2 badge-primary">New</div>
							{/if}
						</td>
						<td>{msg.name}</td>
						<td>{msg.contact}</td>
						<td class="text-sm opacity-70">
							{new Date(msg.created).toLocaleDateString()}
						</td>
						<td class="text-right">
							<div class="flex justify-end gap-2">
								<button
									class="btn btn-square btn-ghost btn-sm"
									onclick={() => viewMessage(msg)}
									aria-label="View message"
								>
									<Eye class="h-4 w-4" />
								</button>
								<button
									class="btn btn-square text-error btn-ghost btn-sm"
									onclick={() => deleteMessage(msg.id)}
									aria-label="Delete message"
								>
									<Trash2 class="h-4 w-4" />
								</button>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<Modal bind:open={viewModalOpen} title="Message Details" onClose={() => (viewModalOpen = false)}>
	{#if viewingMessage}
		<div class="space-y-6">
			<div class="grid grid-cols-2 gap-4">
				<div>
					<h3 class="text-sm font-medium text-base-content/60">From</h3>
					<p class="mt-1 text-lg font-semibold">{viewingMessage.name}</p>
				</div>
				<div>
					<h3 class="text-sm font-medium text-base-content/60">Date</h3>
					<p class="mt-1 text-base">{new Date(viewingMessage.created).toLocaleString()}</p>
				</div>
			</div>

			<div>
				<h3 class="flex items-center gap-2 text-sm font-medium text-base-content/60">
					<Mail class="h-4 w-4" /> Contact
				</h3>
				<p class="mt-1 rounded-lg bg-base-200/50 p-3 text-base select-all">
					{viewingMessage.contact}
				</p>
			</div>

			<div>
				<h3 class="flex items-center gap-2 text-sm font-medium text-base-content/60">
					<MessageSquare class="h-4 w-4" /> Message
				</h3>
				<div
					class="mt-2 rounded-xl bg-base-200/30 p-4 text-base leading-relaxed whitespace-pre-wrap"
				>
					{viewingMessage.message}
				</div>
			</div>
		</div>
	{/if}
</Modal>
