<script lang="ts">
	import { onMount } from 'svelte';
	import { Plus, Pencil, Trash2, X } from '@lucide/svelte';
	import type { NewsItem } from '$lib/services/mockApi';

	let news: NewsItem[] = [];
	let loading = true;
	let showModal = false;
	let editingId: number | null = null;

	// Form fields
	let category = '';
	let date = '';
	let title = '';
	let excerpt = '';
	let image = '';

	onMount(async () => {
		await fetchNews();
	});

	async function fetchNews() {
		loading = true;
		try {
			const res = await fetch('/api/admin/news');
			news = await res.json();
		} catch (error) {
			console.error('Failed to fetch news:', error);
		} finally {
			loading = false;
		}
	}

	function openModal(item?: NewsItem) {
		if (item) {
			editingId = item.id;
			category = item.category;
			date = item.date;
			title = item.title;
			excerpt = item.excerpt;
			image = item.image;
		} else {
			editingId = null;
			category = '';
			date = '';
			title = '';
			excerpt = '';
			image = '';
		}
		showModal = true;
	}

	function closeModal() {
		showModal = false;
		editingId = null;
	}

	async function handleSubmit() {
		const data = { category, date, title, excerpt, image };

		if (editingId) {
			await fetch('/api/admin/news', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id: editingId, ...data })
			});
		} else {
			await fetch('/api/admin/news', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data)
			});
		}

		closeModal();
		await fetchNews();
	}

	async function handleDelete(id: number) {
		if (!confirm('Are you sure you want to delete this article?')) return;

		await fetch('/api/admin/news', {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id })
		});

		await fetchNews();
	}

	const categories = ['Events', 'Education', 'Ambassadors', 'Technology', 'Research'];
</script>

<svelte:head>
	<title>News - Admin</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold text-base-content">News</h1>
			<p class="text-base-content/70">Manage your news articles</p>
		</div>
		<button class="btn btn-primary" on:click={() => openModal()}>
			<Plus class="h-4 w-4" />
			Add Article
		</button>
	</div>

	<!-- Table -->
	<div class="card bg-base-100 shadow-sm">
		<div class="overflow-x-auto">
			<table class="table">
				<thead>
					<tr>
						<th>Title</th>
						<th>Category</th>
						<th>Date</th>
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
					{:else if news.length === 0}
						<tr>
							<td colspan="4" class="py-8 text-center text-base-content/50"> No articles found </td>
						</tr>
					{:else}
						{#each news as item (item.id)}
							<tr>
								<td>
									<div class="flex items-center gap-3">
										<div class="avatar">
											<div class="mask h-12 w-12 mask-squircle">
												<img src={item.image} alt={item.title} />
											</div>
										</div>
										<div class="max-w-xs truncate font-medium">{item.title}</div>
									</div>
								</td>
								<td>
									<span class="badge badge-outline">{item.category}</span>
								</td>
								<td>{item.date}</td>
								<td class="text-right">
									<button class="btn btn-ghost btn-sm" on:click={() => openModal(item)}>
										<Pencil class="h-4 w-4" />
									</button>
									<button
										class="btn text-error btn-ghost btn-sm"
										on:click={() => handleDelete(item.id)}
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
				{editingId ? 'Edit Article' : 'Add Article'}
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
						<label class="label" for="category">
							<span class="label-text">Category</span>
						</label>
						<select id="category" bind:value={category} class="select-bordered select" required>
							<option value="" disabled>Select category</option>
							{#each categories as cat (cat)}
								<option value={cat}>{cat}</option>
							{/each}
						</select>
					</div>
					<div class="form-control">
						<label class="label" for="date">
							<span class="label-text">Date</span>
						</label>
						<input
							type="text"
							id="date"
							bind:value={date}
							class="input-bordered input"
							placeholder="Oct 24, 2024"
							required
						/>
					</div>
				</div>

				<div class="form-control">
					<label class="label" for="excerpt">
						<span class="label-text">Excerpt</span>
					</label>
					<textarea
						id="excerpt"
						bind:value={excerpt}
						class="textarea-bordered textarea"
						rows="3"
						required
					></textarea>
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
