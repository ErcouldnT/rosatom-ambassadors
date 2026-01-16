<script lang="ts">
	import { onMount } from 'svelte';
	import { Plus, Pencil, Trash2, X } from '@lucide/svelte';
	import type { Ambassador } from '$lib/services/mockApi';

	let ambassadors: Ambassador[] = [];
	let loading = true;
	let showModal = false;
	let editingId: number | null = null;

	// Form fields
	let name = '';
	let country = '';
	let role = '';
	let image = '';

	onMount(async () => {
		await fetchAmbassadors();
	});

	async function fetchAmbassadors() {
		loading = true;
		try {
			const res = await fetch('/api/admin/ambassadors');
			ambassadors = await res.json();
		} catch (error) {
			console.error('Failed to fetch ambassadors:', error);
		} finally {
			loading = false;
		}
	}

	function openModal(ambassador?: Ambassador) {
		if (ambassador) {
			editingId = ambassador.id;
			name = ambassador.name;
			country = ambassador.country;
			role = ambassador.role;
			image = ambassador.image;
		} else {
			editingId = null;
			name = '';
			country = '';
			role = '';
			image = '';
		}
		showModal = true;
	}

	function closeModal() {
		showModal = false;
		editingId = null;
	}

	async function handleSubmit() {
		const data = { name, country, role, image };

		if (editingId) {
			await fetch('/api/admin/ambassadors', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id: editingId, ...data })
			});
		} else {
			await fetch('/api/admin/ambassadors', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data)
			});
		}

		closeModal();
		await fetchAmbassadors();
	}

	async function handleDelete(id: number) {
		if (!confirm('Are you sure you want to delete this ambassador?')) return;

		await fetch('/api/admin/ambassadors', {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id })
		});

		await fetchAmbassadors();
	}
</script>

<svelte:head>
	<title>Ambassadors - Admin</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Ambassadors</h1>
			<p class="text-base-content/70">Manage your ambassador profiles</p>
		</div>
		<button class="btn btn-primary" on:click={() => openModal()}>
			<Plus class="h-4 w-4" />
			Add Ambassador
		</button>
	</div>

	<!-- Table -->
	<div class="card bg-base-100 shadow-sm">
		<div class="overflow-x-auto">
			<table class="table">
				<thead>
					<tr>
						<th>Name</th>
						<th>Country</th>
						<th>Role</th>
						<th class="text-right">Actions</th>
					</tr>
				</thead>
				<tbody>
					{#if loading}
						<tr>
							<td colspan="4" class="py-8 text-center">
								<span class="loading loading-md loading-spinner"></span>
							</td>
						</tr>
					{:else if ambassadors.length === 0}
						<tr>
							<td colspan="4" class="py-8 text-center text-base-content/50">
								No ambassadors found
							</td>
						</tr>
					{:else}
						{#each ambassadors as ambassador (ambassador.id)}
							<tr>
								<td>
									<div class="flex items-center gap-3">
										<div class="avatar">
											<div class="mask h-12 w-12 mask-squircle">
												<img src={ambassador.image} alt={ambassador.name} />
											</div>
										</div>
										<div class="font-medium">{ambassador.name}</div>
									</div>
								</td>
								<td>{ambassador.country}</td>
								<td>{ambassador.role}</td>
								<td class="text-right">
									<button class="btn btn-ghost btn-sm" on:click={() => openModal(ambassador)}>
										<Pencil class="h-4 w-4" />
									</button>
									<button
										class="btn text-error btn-ghost btn-sm"
										on:click={() => handleDelete(ambassador.id)}
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
				{editingId ? 'Edit Ambassador' : 'Add Ambassador'}
			</h3>

			<form on:submit|preventDefault={handleSubmit} class="mt-4 space-y-4">
				<div class="form-control">
					<label class="label" for="name">
						<span class="label-text">Name</span>
					</label>
					<input type="text" id="name" bind:value={name} class="input-bordered input" required />
				</div>

				<div class="form-control">
					<label class="label" for="country">
						<span class="label-text">Country</span>
					</label>
					<input
						type="text"
						id="country"
						bind:value={country}
						class="input-bordered input"
						required
					/>
				</div>

				<div class="form-control">
					<label class="label" for="role">
						<span class="label-text">Role</span>
					</label>
					<input type="text" id="role" bind:value={role} class="input-bordered input" required />
				</div>

				<div class="form-control">
					<label class="label" for="image">
						<span class="label-text">Image URL</span>
					</label>
					<input
						type="url"
						id="image"
						bind:value={image}
						class="input-bordered input"
						placeholder="https://..."
						required
					/>
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
