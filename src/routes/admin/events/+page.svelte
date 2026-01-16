<script lang="ts">
	import { onMount } from 'svelte';
	import { Plus, Pencil, Trash2, X } from '@lucide/svelte';
	import type { Event } from '$lib/services/mockApi';

	let events: Event[] = [];
	let loading = true;
	let showModal = false;
	let editingId: number | null = null;

	// Form fields
	let title = '';
	let day = '';
	let month = '';
	let time = '';
	let location = '';
	let description = '';

	onMount(async () => {
		await fetchEvents();
	});

	async function fetchEvents() {
		loading = true;
		try {
			const res = await fetch('/api/admin/events');
			events = await res.json();
		} catch (error) {
			console.error('Failed to fetch events:', error);
		} finally {
			loading = false;
		}
	}

	function openModal(event?: Event) {
		if (event) {
			editingId = event.id;
			title = event.title;
			day = event.date.day;
			month = event.date.month;
			time = event.time;
			location = event.location;
			description = event.description;
		} else {
			editingId = null;
			title = '';
			day = '';
			month = '';
			time = '';
			location = '';
			description = '';
		}
		showModal = true;
	}

	function closeModal() {
		showModal = false;
		editingId = null;
	}

	async function handleSubmit() {
		const data = {
			title,
			date: { day, month },
			time,
			location,
			description
		};

		if (editingId) {
			await fetch('/api/admin/events', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id: editingId, ...data })
			});
		} else {
			await fetch('/api/admin/events', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data)
			});
		}

		closeModal();
		await fetchEvents();
	}

	async function handleDelete(id: number) {
		if (!confirm('Are you sure you want to delete this event?')) return;

		await fetch('/api/admin/events', {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id })
		});

		await fetchEvents();
	}
</script>

<svelte:head>
	<title>Events - Admin</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Events</h1>
			<p class="text-base-content/70">Manage your upcoming events</p>
		</div>
		<button class="btn btn-primary" on:click={() => openModal()}>
			<Plus class="h-4 w-4" />
			Add Event
		</button>
	</div>

	<!-- Table -->
	<div class="card bg-base-100 shadow-sm">
		<div class="overflow-x-auto">
			<table class="table">
				<thead>
					<tr>
						<th>Date</th>
						<th>Title</th>
						<th>Location</th>
						<th>Time</th>
						<th class="text-right">Actions</th>
					</tr>
				</thead>
				<tbody>
					{#if loading}
						<tr>
							<td colspan="5" class="py-8 text-center">
								<span class="loading loading-md loading-spinner"></span>
							</td>
						</tr>
					{:else if events.length === 0}
						<tr>
							<td colspan="5" class="py-8 text-center text-base-content/50"> No events found </td>
						</tr>
					{:else}
						{#each events as event (event.id)}
							<tr>
								<td>
									<div class="badge badge-lg badge-primary">
										{event.date.day}
										{event.date.month}
									</div>
								</td>
								<td class="font-medium">{event.title}</td>
								<td>{event.location}</td>
								<td>{event.time}</td>
								<td class="text-right">
									<button class="btn btn-ghost btn-sm" on:click={() => openModal(event)}>
										<Pencil class="h-4 w-4" />
									</button>
									<button
										class="btn text-error btn-ghost btn-sm"
										on:click={() => handleDelete(event.id)}
									>
										<Trash2 class="h-4 w-4" />
									</button>
								</td>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>
	</div>
</div>

<!-- Modal -->
{#if showModal}
	<div class="modal-open modal">
		<div class="modal-box">
			<button class="btn absolute top-2 right-2 btn-circle btn-ghost btn-sm" on:click={closeModal}>
				<X class="h-4 w-4" />
			</button>

			<h3 class="text-lg font-bold">
				{editingId ? 'Edit Event' : 'Add Event'}
			</h3>

			<form on:submit|preventDefault={handleSubmit} class="mt-4 space-y-4">
				<div class="form-control">
					<label class="label" for="title">
						<span class="label-text">Title</span>
					</label>
					<input type="text" id="title" bind:value={title} class="input-bordered input" required />
				</div>

				<div class="grid grid-cols-2 gap-4">
					<div class="form-control">
						<label class="label" for="day">
							<span class="label-text">Day</span>
						</label>
						<input
							type="text"
							id="day"
							bind:value={day}
							class="input-bordered input"
							placeholder="21"
							required
						/>
					</div>
					<div class="form-control">
						<label class="label" for="month">
							<span class="label-text">Month</span>
						</label>
						<input
							type="text"
							id="month"
							bind:value={month}
							class="input-bordered input"
							placeholder="OCT"
							required
						/>
					</div>
				</div>

				<div class="form-control">
					<label class="label" for="time">
						<span class="label-text">Time</span>
					</label>
					<input
						type="text"
						id="time"
						bind:value={time}
						class="input-bordered input"
						placeholder="10:00 AM"
						required
					/>
				</div>

				<div class="form-control">
					<label class="label" for="location">
						<span class="label-text">Location</span>
					</label>
					<input
						type="text"
						id="location"
						bind:value={location}
						class="input-bordered input"
						required
					/>
				</div>

				<div class="form-control">
					<label class="label" for="description">
						<span class="label-text">Description</span>
					</label>
					<textarea
						id="description"
						bind:value={description}
						class="textarea-bordered textarea"
						rows="3"
						required
					></textarea>
				</div>

				<div class="modal-action">
					<button type="button" class="btn btn-ghost" on:click={closeModal}>Cancel</button>
					<button type="submit" class="btn btn-primary">
						{editingId ? 'Update' : 'Create'}
					</button>
				</div>
			</form>
		</div>
		<button class="modal-backdrop" on:click={closeModal}></button>
	</div>
{/if}
