<script lang="ts">
	import { onMount } from 'svelte';
	import { Plus, Pencil, Trash2, FileText, Upload } from '@lucide/svelte';
	import type { NewsItem } from '$lib/types';
	import { language } from '$lib/services/language';
	import { translations } from '$lib/services/translations';
	// import { PUBLIC_POCKETBASE_URL } from '$env/static/public';

	let news = $state<NewsItem[]>([]);
	let loading = $state(true);
	let showModal = $state(false);
	let editingId = $state<string | null>(null);
	let activeTab = $state<'en' | 'ru'>('en');

	let t = $derived(translations[$language].admin);

	// Form fields
	let form = $state({
		category_en: '',
		category_ru: '',
		date: '',
		title_en: '',
		title_ru: '',
		excerpt_en: '',
		excerpt_ru: '',
		image: null as File | null
	});

	let existingImageUrl = $state('');

	// Standard categories (EN) - we might want to map them or allow free text.
	// For now, let's allow free input or a predefined list for EN and RU.
	const categoryOptions = [
		{ en: 'Events', ru: 'События' },
		{ en: 'Education', ru: 'Образование' },
		{ en: 'Ambassadors', ru: 'Амбассадоры' },
		{ en: 'Technology', ru: 'Технологии' },
		{ en: 'Research', ru: 'Исследования' }
	];

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

	import { getImageUrl } from '$lib/utils';
	// function getImageUrl ... removed

	function openModal(item?: NewsItem) {
		if (item) {
			editingId = item.id;
			form.category_en = item.category_en;
			form.category_ru = item.category_ru;
			form.date = item.date;
			form.title_en = item.title_en;
			form.title_ru = item.title_ru;
			form.excerpt_en = item.excerpt_en;
			form.excerpt_ru = item.excerpt_ru;
			form.image = null; // Reset

			existingImageUrl = item.image
				? getImageUrl(item.collectionId || 'news', item.id, item.image)
				: '';
		} else {
			editingId = null;
			form.category_en = '';
			form.category_ru = '';
			form.date = '';
			form.title_en = '';
			form.title_ru = '';
			form.excerpt_en = '';
			form.excerpt_ru = '';
			form.image = null;
			existingImageUrl = '';
		}
		activeTab = 'en';
		showModal = true;
	}

	function closeModal() {
		showModal = false;
		editingId = null;
	}

	async function handleSubmit() {
		const formData = new FormData();
		if (editingId) formData.append('id', editingId);
		formData.append('category_en', form.category_en);
		formData.append('category_ru', form.category_ru);
		formData.append('date', form.date);
		formData.append('title_en', form.title_en);
		formData.append('title_ru', form.title_ru);
		formData.append('excerpt_en', form.excerpt_en);
		formData.append('excerpt_ru', form.excerpt_ru);

		if (form.image) {
			formData.append('image', form.image);
		}

		if (editingId) {
			await fetch('/api/admin/news', {
				method: 'PUT',
				body: formData
			});
		} else {
			await fetch('/api/admin/news', {
				method: 'POST',
				body: formData
			});
		}

		closeModal();
		await fetchNews();
	}

	async function handleDelete(id: string) {
		if (!confirm('Are you sure you want to delete this article?')) return;

		await fetch('/api/admin/news', {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id })
		});

		await fetchNews();
	}

	function handleFileChange(e: Event) {
		const target = e.target as HTMLInputElement;
		if (target.files && target.files.length > 0) {
			form.image = target.files[0];
		}
	}
</script>

<svelte:head>
	<title>{t.news} - Admin</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold tracking-tight text-base-content">{t.news}</h1>
			<p class="mt-1 text-base-content/60">Manage news articles and updates</p>
		</div>
		<button class="btn btn-primary" onclick={() => openModal()}>
			<Plus class="h-5 w-5" />
			Add Article
		</button>
	</div>

	<!-- Table -->
	<div class="card overflow-hidden rounded-xl border border-base-200 bg-base-100 shadow-sm">
		<div class="overflow-x-auto">
			<table class="table table-lg">
				<thead class="bg-base-200/50">
					<tr>
						<th>Article</th>
						<th>Category</th>
						<th>Date</th>
						<th class="text-right">Actions</th>
					</tr>
				</thead>
				<tbody>
					{#if loading}
						<tr>
							<td colspan="4" class="py-12 text-center">
								<span class="loading loading-lg loading-spinner text-primary"></span>
							</td>
						</tr>
					{:else if news.length === 0}
						<tr>
							<td colspan="4" class="py-12 text-center text-base-content/50">
								No articles found
							</td>
						</tr>
					{:else}
						{#each news as item (item.id)}
							<tr class="hover">
								<td>
									<div class="flex items-center gap-4">
										<div class="avatar">
											<div class="mask h-16 w-16 bg-base-300 mask-squircle">
												{#if item.image}
													<img
														src={getImageUrl(item.collectionId || 'news', item.id, item.image)}
														alt={item.title_en}
													/>
												{:else}
													<div
														class="flex h-full w-full items-center justify-center text-base-content/30"
													>
														<FileText class="h-6 w-6" />
													</div>
												{/if}
											</div>
										</div>
										<div>
											<div class="max-w-xs truncate font-bold">{item.title_en}</div>
											<div class="max-w-xs truncate text-xs opacity-60">{item.title_ru}</div>
										</div>
									</div>
								</td>
								<td>
									<div class="flex flex-col gap-1">
										<span class="badge badge-outline badge-sm">{item.category_en}</span>
										<span class="pl-1 text-[10px] opacity-60">{item.category_ru}</span>
									</div>
								</td>
								<td class="font-mono text-sm">{item.date}</td>
								<td class="text-right">
									<div class="join">
										<button class="btn join-item btn-ghost btn-sm" onclick={() => openModal(item)}>
											<Pencil class="h-4 w-4" />
										</button>
										<button
											class="btn join-item text-error btn-ghost btn-sm"
											onclick={() => handleDelete(item.id)}
										>
											<Trash2 class="h-4 w-4" />
										</button>
									</div>
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
<dialog class="modal" class:modal-open={showModal}>
	<div class="modal-box w-11/12 max-w-3xl overflow-hidden bg-base-100 p-0">
		<div class="flex items-center justify-between border-b border-base-200 p-6">
			<h3 class="text-xl font-bold">
				{editingId ? 'Edit Article' : 'New Article'}
			</h3>
			<form method="dialog">
				<button class="btn btn-circle btn-ghost btn-sm" onclick={closeModal}>✕</button>
			</form>
		</div>

		<div class="max-h-[80vh] overflow-y-auto p-6">
			<form
				onsubmit={(e) => {
					e.preventDefault();
					handleSubmit();
				}}
				class="space-y-6"
			>
				<!-- Main Image Upload -->
				<div class="grid grid-cols-1 gap-6 md:grid-cols-[1fr_200px]">
					<div class="space-y-4">
						<div class="form-control">
							<label class="label pb-1 font-medium" for="image"> Cover Image </label>
							<input
								type="file"
								id="image"
								class="file-input-bordered file-input w-full"
								accept="image/*"
								onchange={handleFileChange}
							/>
							{#if existingImageUrl && !form.image}
								<div class="mt-2 text-xs opacity-60">
									Current file: <a href={existingImageUrl} target="_blank" class="link">View</a>
								</div>
							{/if}
						</div>

						<div class="form-control">
							<label class="label" for="date">
								<span class="label-text">Date (e.g. Oct 24, 2024)</span>
							</label>
							<input
								type="text"
								id="date"
								bind:value={form.date}
								class="input-bordered input w-full"
								placeholder="MMM DD, YYYY"
								required
							/>
						</div>
					</div>

					<div
						class="flex flex-col items-center justify-center rounded-box border border-dashed border-base-300 bg-base-200/50 p-4"
					>
						{#if existingImageUrl || form.image}
							<div class="avatar">
								<div class="mask h-32 w-40 rounded-xl mask-squircle object-cover">
									{#if form.image}
										<img
											src={URL.createObjectURL(form.image)}
											alt="Preview"
											class="h-full w-full object-cover"
										/>
									{:else if existingImageUrl}
										<img src={existingImageUrl} alt="Current" class="h-full w-full object-cover" />
									{/if}
								</div>
							</div>
						{:else}
							<div
								class="flex h-32 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-base-300 text-base-content/30"
							>
								<Upload class="mb-2 h-8 w-8" />
								<span class="text-xs">No image</span>
							</div>
						{/if}
					</div>
				</div>

				<div class="divider">Content</div>

				<div role="tablist" class="tabs-lifted tabs">
					<button
						type="button"
						role="tab"
						class="tab {activeTab === 'en'
							? 'tab-active font-medium [--tab-bg:var(--fallback-b1,oklch(var(--b1)))]'
							: ''}"
						onclick={() => (activeTab = 'en')}
					>
						🇬🇧 English
					</button>
					<button
						type="button"
						role="tab"
						class="tab {activeTab === 'ru'
							? 'tab-active font-medium [--tab-bg:var(--fallback-b1,oklch(var(--b1)))]'
							: ''}"
						onclick={() => (activeTab = 'ru')}
					>
						🇷🇺 Russian
					</button>
				</div>

				<div
					class="relative z-10 -mt-px rounded-tr-box rounded-b-box border border-base-300 bg-base-100 p-6"
				>
					<div class={activeTab === 'en' ? 'block space-y-4' : 'hidden'}>
						<div class="form-control">
							<label class="label" for="title_en">
								<span class="label-text">Title (EN)</span>
							</label>
							<input
								type="text"
								id="title_en"
								bind:value={form.title_en}
								class="input-bordered input w-full"
								placeholder="Article headline..."
								required
							/>
						</div>

						<div class="form-control">
							<label class="label" for="category_en">
								<span class="label-text">Category (EN)</span>
							</label>
							<input
								type="text"
								id="category_en"
								bind:value={form.category_en}
								class="input-bordered input w-full"
								list="cats-en"
								required
							/>
							<datalist id="cats-en">
								{#each categoryOptions as opt (opt.en)}
									<option value={opt.en}></option>
								{/each}
							</datalist>
						</div>

						<div class="form-control">
							<label class="label" for="excerpt_en">
								<span class="label-text">Excerpt (EN)</span>
							</label>
							<textarea
								id="excerpt_en"
								bind:value={form.excerpt_en}
								class="textarea-bordered textarea h-24"
								required
								placeholder="Short summary..."
							></textarea>
						</div>
					</div>

					<div class={activeTab === 'ru' ? 'block space-y-4' : 'hidden'}>
						<div class="form-control">
							<label class="label" for="title_ru">
								<span class="label-text">Title (RU)</span>
							</label>
							<input
								type="text"
								id="title_ru"
								bind:value={form.title_ru}
								class="input-bordered input w-full"
								placeholder="Заголовок статьи..."
								required
							/>
						</div>

						<div class="form-control">
							<label class="label" for="category_ru">
								<span class="label-text">Category (RU)</span>
							</label>
							<input
								type="text"
								id="category_ru"
								bind:value={form.category_ru}
								class="input-bordered input w-full"
								list="cats-ru"
								required
							/>
							<datalist id="cats-ru">
								{#each categoryOptions as opt (opt.ru)}
									<option value={opt.ru}></option>
								{/each}
							</datalist>
						</div>

						<div class="form-control">
							<label class="label" for="excerpt_ru">
								<span class="label-text">Excerpt (RU)</span>
							</label>
							<textarea
								id="excerpt_ru"
								bind:value={form.excerpt_ru}
								class="textarea-bordered textarea h-24"
								required
								placeholder="Краткое содержание..."
							></textarea>
						</div>
					</div>
				</div>

				<div class="modal-action pt-4">
					<button type="button" class="btn" onclick={closeModal}>Cancel</button>
					<button type="submit" class="btn px-8 btn-primary">
						{editingId ? 'Save Changes' : 'Create Article'}
					</button>
				</div>
			</form>
		</div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button onclick={closeModal}>close</button>
	</form>
</dialog>
