<script lang="ts">
	import { onMount } from 'svelte';
	import { Plus, Pencil, Trash2, Calendar, MapPin, Upload } from '@lucide/svelte';
	import type { Event as AppEvent } from '$lib/types';
	import { language } from '$lib/services/language';
	import { translations } from '$lib/services/translations';
	// import { PUBLIC_POCKETBASE_URL } from '$env/static/public';

	let events = $state<AppEvent[]>([]);
	let loading = $state(true);
	let showModal = $state(false);
	let editingId = $state<string | null>(null);
	let activeTab = $state<'en' | 'ru'>('en');

	let t = $derived(translations[$language].admin);

	// Form fields
	let form = $state({
		title_en: '',
		title_ru: '',
		date_day: '',
		date_month_en: '',
		date_month_ru: '',
		time: '',
		location_en: '',
		location_ru: '',
		description_en: '',
		description_ru: '',
		image: null as File | null
	});

	let existingImageUrl = $state('');

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

	import { getImageUrl } from '$lib/utils';
	// function getImageUrl ... removed

	function openModal(event?: AppEvent) {
		if (event) {
			editingId = event.id;
			form.title_en = event.title_en;
			form.title_ru = event.title_ru;
			form.date_day = event.date_day;
			form.date_month_en = event.date_month_en;
			form.date_month_ru = event.date_month_ru;
			form.time = event.time;
			form.location_en = event.location_en;
			form.location_ru = event.location_ru;
			form.description_en = event.description_en;
			form.description_ru = event.description_ru;
			form.image = null;

			existingImageUrl = event.image ? getImageUrl('events', event.id, event.image) : '';
		} else {
			editingId = null;
			form.title_en = '';
			form.title_ru = '';
			form.date_day = '';
			form.date_month_en = '';
			form.date_month_ru = '';
			form.time = '';
			form.location_en = '';
			form.location_ru = '';
			form.description_en = '';
			form.description_ru = '';
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
		formData.append('title_en', form.title_en);
		formData.append('title_ru', form.title_ru);
		formData.append('date_day', form.date_day);
		formData.append('date_month_en', form.date_month_en);
		formData.append('date_month_ru', form.date_month_ru);
		formData.append('time', form.time);
		formData.append('location_en', form.location_en);
		formData.append('location_ru', form.location_ru);
		formData.append('description_en', form.description_en);
		formData.append('description_ru', form.description_ru);

		if (form.image) {
			formData.append('image', form.image);
		}

		if (editingId) {
			await fetch('/api/admin/events', {
				method: 'PUT',
				body: formData
			});
		} else {
			await fetch('/api/admin/events', {
				method: 'POST',
				body: formData
			});
		}

		closeModal();
		await fetchEvents();
	}

	async function handleDelete(id: string) {
		if (!confirm('Are you sure you want to delete this event?')) return;

		await fetch('/api/admin/events', {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id })
		});

		await fetchEvents();
	}

	function handleFileChange(e: globalThis.Event) {
		const target = e.target as HTMLInputElement;
		if (target.files && target.files.length > 0) {
			form.image = target.files[0];
		}
	}
</script>

<svelte:head>
	<title>{t.events} - Admin</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold tracking-tight text-base-content">{t.events}</h1>
			<p class="mt-1 text-base-content/60">Manage upcoming company events and schedule</p>
		</div>
		<button class="btn btn-primary" onclick={() => openModal()}>
			<Plus class="h-5 w-5" />
			Add Event
		</button>
	</div>

	<!-- Table -->
	<div class="card overflow-hidden rounded-xl border border-base-200 bg-base-100 shadow-sm">
		<div class="overflow-x-auto">
			<table class="table table-lg">
				<thead class="bg-base-200/50">
					<tr>
						<th>Event Info</th>
						<th>Location</th>
						<th>Date & Time</th>
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
					{:else if events.length === 0}
						<tr>
							<td colspan="4" class="py-12 text-center text-base-content/50"> No events found </td>
						</tr>
					{:else}
						{#each events as event (event.id)}
							<tr class="hover">
								<td>
									<div class="flex items-center gap-4">
										<div class="avatar">
											<div class="mask h-16 w-16 rounded-lg bg-base-300 mask-squircle">
												{#if event.image}
													<img
														src={getImageUrl('events', event.id, event.image)}
														alt={event.title_en}
														class="object-cover"
													/>
												{:else}
													<div
														class="flex h-full w-full flex-col items-center justify-center text-base-content/30"
													>
														<Calendar class="h-6 w-6" />
													</div>
												{/if}
											</div>
										</div>
										<div>
											<div class="font-bold">{event.title_en}</div>
											<div class="text-xs opacity-60">{event.title_ru}</div>
										</div>
									</div>
								</td>
								<td>
									<div class="flex items-center gap-2">
										<MapPin class="h-4 w-4 text-base-content/40" />
										<div>
											<div>{event.location_en}</div>
											<div class="text-xs opacity-60">{event.location_ru}</div>
										</div>
									</div>
								</td>
								<td>
									<div class="badge font-mono badge-lg badge-neutral">
										{event.date_day}
										{event.date_month_en}
									</div>
									<div class="mt-1 text-center font-mono text-xs opacity-60">
										{event.time}
									</div>
								</td>
								<td class="text-right">
									<div class="join">
										<button class="btn join-item btn-ghost btn-sm" onclick={() => openModal(event)}>
											<Pencil class="h-4 w-4" />
										</button>
										<button
											class="btn join-item text-error btn-ghost btn-sm"
											onclick={() => handleDelete(event.id)}
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
				{editingId ? 'Edit Event' : 'New Event'}
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
							<label class="label pb-1 font-medium" for="image"> Event Image </label>
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

						<div class="grid grid-cols-2 gap-4">
							<div class="form-control">
								<label class="label" for="date_day">
									<span class="label-text">Day (e.g. 21)</span>
								</label>
								<input
									type="text"
									id="date_day"
									bind:value={form.date_day}
									class="input-bordered input w-full"
									placeholder="21"
									required
								/>
							</div>
							<div class="form-control">
								<label class="label" for="time">
									<span class="label-text">Time (e.g. 10:00 AM)</span>
								</label>
								<input
									type="text"
									id="time"
									bind:value={form.time}
									class="input-bordered input w-full"
									placeholder="10:00 AM"
									required
								/>
							</div>
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

				<div class="divider">Language & Details</div>

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
								<span class="label-text">Event Title (EN)</span>
							</label>
							<input
								type="text"
								id="title_en"
								bind:value={form.title_en}
								class="input-bordered input w-full"
								placeholder="Annual Exhibition"
								required
							/>
						</div>

						<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
							<div class="form-control">
								<label class="label" for="location_en">
									<span class="label-text">Location (EN)</span>
								</label>
								<input
									type="text"
									id="location_en"
									bind:value={form.location_en}
									class="input-bordered input w-full"
									placeholder="Moscow, Russia"
									required
								/>
							</div>
							<div class="form-control">
								<label class="label" for="date_month_en">
									<span class="label-text">Month (EN)</span>
								</label>
								<input
									type="text"
									id="date_month_en"
									bind:value={form.date_month_en}
									class="input-bordered input w-full"
									placeholder="OCT"
									required
								/>
							</div>
						</div>

						<div class="form-control">
							<label class="label" for="description_en">
								<span class="label-text">Description (EN)</span>
							</label>
							<textarea
								id="description_en"
								bind:value={form.description_en}
								class="textarea-bordered textarea h-24"
								placeholder="Event details..."
							></textarea>
						</div>
					</div>

					<div class={activeTab === 'ru' ? 'block space-y-4' : 'hidden'}>
						<div class="form-control">
							<label class="label" for="title_ru">
								<span class="label-text">Event Title (RU)</span>
							</label>
							<input
								type="text"
								id="title_ru"
								bind:value={form.title_ru}
								class="input-bordered input w-full"
								placeholder="Ежегодная выставка"
								required
							/>
						</div>

						<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
							<div class="form-control">
								<label class="label" for="location_ru">
									<span class="label-text">Location (RU)</span>
								</label>
								<input
									type="text"
									id="location_ru"
									bind:value={form.location_ru}
									class="input-bordered input w-full"
									placeholder="Москва, Россия"
									required
								/>
							</div>
							<div class="form-control">
								<label class="label" for="date_month_ru">
									<span class="label-text">Month (RU)</span>
								</label>
								<input
									type="text"
									id="date_month_ru"
									bind:value={form.date_month_ru}
									class="input-bordered input w-full"
									placeholder="ОКТ"
									required
								/>
							</div>
						</div>

						<div class="form-control">
							<label class="label" for="description_ru">
								<span class="label-text">Description (RU)</span>
							</label>
							<textarea
								id="description_ru"
								bind:value={form.description_ru}
								class="textarea-bordered textarea h-24"
								placeholder="Детали события..."
							></textarea>
						</div>
					</div>
				</div>

				<div class="modal-action pt-4">
					<button type="button" class="btn" onclick={closeModal}>Cancel</button>
					<button type="submit" class="btn px-8 btn-primary">
						{editingId ? 'Save Changes' : 'Create Event'}
					</button>
				</div>
			</form>
		</div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button onclick={closeModal}>close</button>
	</form>
</dialog>
