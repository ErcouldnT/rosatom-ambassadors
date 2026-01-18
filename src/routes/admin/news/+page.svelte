<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { Plus, Pencil, Trash2, FileText, Upload } from '@lucide/svelte';
	import Modal from '$lib/components/Modal.svelte';
	import AdminInput from '$lib/components/admin/AdminInput.svelte';
	import AdminTextarea from '$lib/components/admin/AdminTextarea.svelte';
	import type { NewsItem } from '$lib/types';
	import { language } from '$lib/services/language';
	import { translations } from '$lib/services/translations';
	import { toasts } from '$lib/stores/toast';
	import { getImageUrl } from '$lib/utils';

	let { data } = $props();

	// news state removed

	let showModal = $state(false);
	let editingId = $state<string | null>(null);
	let activeTab = $state<'en' | 'ru'>('en');
	let formError = $state('');
	let submitting = $state(false);

	let t = $derived(translations[$language].admin);

	// Form fields
	let form = $state({
		category_en: '',
		slug: '',
		category_ru: '',
		date: '',
		title_en: '',
		title_ru: '',
		excerpt_en: '',
		excerpt_ru: '',
		image: null as File | null
	});

	let existingImageUrl = $state('');

	async function fetchNews() {
		await invalidateAll();
	}

	// function getImageUrl ... removed
	// function getImageUrl ... removed

	function openModal(item?: NewsItem) {
		if (item) {
			editingId = item.id;
			form.category_en = item.category_en;
			form.slug = item.slug || '';
			form.category_ru = item.category_ru;
			form.date = item.date;
			form.title_en = item.title_en;
			form.title_ru = item.title_ru;
			form.excerpt_en = item.excerpt_en;
			form.excerpt_ru = item.excerpt_ru;
			form.image = null; // Reset

			existingImageUrl = item.image ? getImageUrl('news', item.id, item.image) : '';
		} else {
			editingId = null;
			form.category_en = '';
			form.slug = '';
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
		submitting = true;
		formError = '';
		try {
			const formData = new FormData();
			if (editingId) formData.append('id', editingId);
			formData.append('category_en', form.category_en);
			if (form.slug) formData.append('slug', form.slug);
			formData.append('category_ru', form.category_ru);
			formData.append('date', form.date);
			formData.append('title_en', form.title_en);
			formData.append('title_ru', form.title_ru);
			formData.append('excerpt_en', form.excerpt_en);
			formData.append('excerpt_ru', form.excerpt_ru);

			if (form.image) {
				formData.append('image', form.image);
			}

			const res = await fetch('/api/admin/news', {
				method: editingId ? 'PUT' : 'POST',
				body: formData
			});

			if (!res.ok) {
				throw new Error('Failed to save article');
			}

			closeModal();
			await fetchNews();
			toasts.add(
				editingId ? 'Article updated successfully' : 'Article created successfully',
				'success'
			);
		} catch (error) {
			console.error('Submit error:', error);
			formError = error instanceof Error ? error.message : 'An error occurred';
			toasts.add('Failed to save article', 'error');
		} finally {
			submitting = false;
		}
	}

	async function handleDelete(id: string) {
		if (!confirm('Are you sure you want to delete this article?')) return;

		try {
			const res = await fetch('/api/admin/news', {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id })
			});

			if (!res.ok) {
				throw new Error('Failed to delete article');
			}

			await fetchNews();
			toasts.add('Article deleted successfully', 'success');
		} catch (error) {
			console.error('Delete error:', error);
			toasts.add('Failed to delete article', 'error');
		}
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
					{#await data.streamed.news}
						<tr>
							<td colspan="4" class="py-12 text-center">
								<span class="loading loading-lg loading-spinner text-primary"></span>
							</td>
						</tr>
					{:then streamedNews}
						{#each streamedNews as item (item.id)}
							<tr class="hover">
								<td>
									<div class="flex items-center gap-4">
										<div class="avatar">
											<div class="mask h-16 w-16 bg-base-300 mask-squircle">
												{#if item.image}
													<img
														src={getImageUrl('news', item.id, item.image)}
														alt={item.title_en}
														onerror={(e) =>
															((e.currentTarget as HTMLImageElement).src =
																'/images/placeholders/news.png')}
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
						{:else}
							<tr>
								<td colspan="4" class="py-12 text-center text-base-content/50">
									No articles found
								</td>
							</tr>
						{/each}
					{:catch error}
						<tr>
							<td colspan="4" class="py-12 text-center text-error">
								Failed to load headlines: {error.message}
							</td>
						</tr>
					{/await}
				</tbody>
			</table>
		</div>
	</div>
</div>

<!-- Modal -->
<Modal
	bind:open={showModal}
	title={editingId ? 'Edit Article' : 'New Article'}
	subtitle={editingId ? 'Update article details' : 'Create a new article'}
	onClose={closeModal}
	maxWidth="4xl"
>
	<form
		id="news-form"
		onsubmit={(e) => {
			e.preventDefault();
			handleSubmit();
		}}
		class="space-y-6"
	>
		<div class="grid grid-cols-1 gap-8 md:grid-cols-[250px_1fr]">
			<!-- Sidebar: Cover Image & Date -->
			<div class="space-y-6">
				<!-- Image Upload -->
				<fieldset class="fieldset w-full rounded-xl border border-white/5 bg-base-100/30 p-4">
					<legend class="fieldset-legend pb-2 text-sm font-medium text-base-content/70"
						>Cover Image</legend
					>
					<div class="flex flex-col items-center gap-4">
						<div class="avatar aspect-video w-full shadow-xl">
							<div
								class="mask h-full w-full rounded-2xl bg-base-300 object-cover ring-1 ring-white/10"
							>
								{#if form.image}
									<img
										src={URL.createObjectURL(form.image)}
										alt="Preview"
										class="h-full w-full object-cover"
									/>
								{:else if existingImageUrl}
									<img
										src={existingImageUrl}
										alt="Current"
										class="h-full w-full object-cover"
										onerror={(e) =>
											((e.currentTarget as HTMLImageElement).src = '/images/placeholders/news.png')}
									/>
								{:else}
									<div
										class="flex h-full w-full flex-col items-center justify-center text-base-content/20"
									>
										<Upload class="mb-2 h-8 w-8" />
										<span class="text-xs font-medium">No Image</span>
									</div>
								{/if}
							</div>
						</div>

						<label
							class="btn btn-block border-white/20 font-medium btn-outline btn-sm hover:border-white/40"
						>
							Choose File
							<input
								type="file"
								id="image"
								class="hidden"
								accept="image/*"
								onchange={handleFileChange}
							/>
						</label>
					</div>
				</fieldset>

				<!-- Date -->
				<AdminInput type="date" label="Date" bind:value={form.date} required />
			</div>

			<!-- Main Content -->
			<div class="space-y-6">
				<!-- Tabs -->
				<div role="tablist" class="tabs-lifted tabs tabs-lg">
					<button
						type="button"
						role="tab"
						class="tab {activeTab === 'en'
							? 'tab-active font-bold opacity-100 [--tab-bg:theme(colors.base.100)]'
							: 'opacity-60 hover:opacity-100'}"
						onclick={() => (activeTab = 'en')}
					>
						🇬🇧 English
					</button>
					<button
						type="button"
						role="tab"
						class="tab {activeTab === 'ru'
							? 'tab-active font-bold opacity-100 [--tab-bg:theme(colors.base.100)]'
							: 'opacity-60 hover:opacity-100'}"
						onclick={() => (activeTab = 'ru')}
					>
						🇷🇺 Russian
					</button>
					<!-- Filler -->
					<div role="tab" class="tab w-full cursor-default border-b-transparent"></div>
				</div>

				<div
					class="-mt-px space-y-6 rounded-tr-2xl rounded-b-2xl border border-white/5 bg-base-100/50 p-6"
				>
					<!-- EN Fields -->
					<div class={activeTab === 'en' ? 'block space-y-4' : 'hidden'}>
						<AdminInput
							id="title_en"
							label="Title (EN)"
							bind:value={form.title_en}
							placeholder="Article headline..."
							required
						/>
						<AdminInput
							id="slug"
							label="Slug (URL)"
							bind:value={form.slug}
							placeholder="article-headline"
						/>
						<AdminInput
							id="category_en"
							label="Category (EN)"
							bind:value={form.category_en}
							placeholder="e.g. Technology"
						/>
						<AdminTextarea
							id="excerpt_en"
							label="Excerpt (EN)"
							bind:value={form.excerpt_en}
							rows={3}
							placeholder="Short summary..."
						/>
					</div>

					<!-- RU Fields -->
					<div class={activeTab === 'ru' ? 'block space-y-4' : 'hidden'}>
						<AdminInput
							id="title_ru"
							label="Title (RU)"
							bind:value={form.title_ru}
							placeholder="Заголовок статьи..."
						/>
						<AdminInput
							id="category_ru"
							label="Category (RU)"
							bind:value={form.category_ru}
							placeholder="Например: Технологии"
						/>
						<AdminTextarea
							id="excerpt_ru"
							label="Excerpt (RU)"
							bind:value={form.excerpt_ru}
							rows={3}
							placeholder="Краткое содержание..."
						/>
					</div>
				</div>
			</div>
		</div>

		{#if formError}
			<div
				class="flex items-center gap-3 rounded-xl border border-error/20 bg-error/5 p-4 text-sm font-medium text-error"
			>
				<div class="h-2 w-2 rounded-full bg-error"></div>
				{formError}
			</div>
		{/if}
	</form>

	{#snippet actions()}
		<button
			type="button"
			class="btn text-base-content/70 btn-ghost hover:bg-white/5"
			onclick={closeModal}
			disabled={submitting}>Cancel</button
		>
		<button type="submit" form="news-form" class="btn px-8 btn-primary" disabled={submitting}>
			{#if submitting}
				<span class="loading loading-sm loading-spinner"></span>
			{/if}
			{editingId ? 'Save Article' : 'Create Article'}
		</button>
	{/snippet}
</Modal>
