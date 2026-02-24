<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { Plus, Pencil, Trash2, Calendar, MapPin, Upload } from '@lucide/svelte';
	import Modal from '$lib/components/Modal.svelte';
	import AdminInput from '$lib/components/admin/AdminInput.svelte';
	import AdminTextarea from '$lib/components/admin/AdminTextarea.svelte';
	import type { Event as AppEvent } from '$lib/types';
	import { language } from '$lib/services/language';
	import { translations } from '$lib/services/translations';
	import { toasts } from '$lib/stores/toast';

	let { data } = $props();

	// events state removed

	let showModal = $state(false);
	let editingId = $state<string | null>(null);
	let submitting = $state(false);
	let activeTab = $state<'en' | 'ru'>('en');

	let t = $derived(translations[$language].admin);

	// Form fields
	let form = $state({
		title_en: '',
		slug: '',
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

	async function fetchEvents() {
		await invalidateAll();
	}

	import { getImageUrl } from '$lib/utils';
	// function getImageUrl ... removed

	function openModal(event?: AppEvent) {
		if (event) {
			editingId = event.id;
			form.title_en = event.title_en;
			form.slug = event.slug || '';
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
			form.slug = '';
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
		submitting = true;
		try {
			const formData = new FormData();
			if (editingId) formData.append('id', editingId);
			formData.append('title_en', form.title_en);
			if (form.slug) formData.append('slug', form.slug);
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

			const res = await fetch('/api/admin/events', {
				method: editingId ? 'PUT' : 'POST',
				body: formData
			});

			if (!res.ok) {
				throw new Error('Failed to save event');
			}

			closeModal();
			await fetchEvents();
			toasts.add(
				editingId ? 'Event updated successfully' : 'Event created successfully',
				'success'
			);
		} catch (error) {
			console.error('Submit error:', error);
			toasts.add('Failed to save event', 'error');
		} finally {
			submitting = false;
		}
	}

	async function handleDelete(id: string) {
		if (!confirm('Are you sure you want to delete this event?')) return;

		try {
			const res = await fetch('/api/admin/events', {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id })
			});

			if (!res.ok) {
				throw new Error('Failed to delete event');
			}

			await fetchEvents();
			toasts.add('Event deleted successfully', 'success');
		} catch (error) {
			console.error('Delete error:', error);
			toasts.add('Failed to delete event', 'error');
		}
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
					{#await data.streamed.events}
						<tr>
							<td colspan="4" class="py-12 text-center">
								<span class="loading loading-lg loading-spinner text-primary"></span>
							</td>
						</tr>
					{:then streamedEvents}
						{#each streamedEvents as event (event.id)}
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
														onerror={(e) =>
															((e.currentTarget as HTMLImageElement).src =
																'/images/placeholders/event.png')}
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
						{:else}
							<tr>
								<td colspan="4" class="py-12 text-center text-base-content/50">
									No events found
								</td>
							</tr>
						{/each}
					{:catch error}
						<tr>
							<td colspan="4" class="py-12 text-center text-error">
								Failed to load events: {error.message}
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
	title={editingId ? 'Edit Event' : 'New Event'}
	subtitle={editingId ? 'Update event details' : 'Create a new event'}
	onClose={closeModal}
	maxWidth="4xl"
>
	<form
		id="event-form"
		onsubmit={(e) => {
			e.preventDefault();
			handleSubmit();
		}}
		class="space-y-6"
	>
		<div class="grid grid-cols-1 gap-8 md:grid-cols-[250px_1fr]">
			<!-- Sidebar: Image & Timing -->
			<div class="space-y-6">
				<!-- Image Upload -->
				<fieldset
					class="fieldset w-full rounded-xl border border-base-content/5 bg-base-100/30 p-4"
				>
					<legend class="fieldset-legend pb-2 text-sm font-medium text-base-content/70"
						>Event Image</legend
					>
					<div class="flex flex-col items-center gap-4">
						<div class="avatar aspect-video w-full shadow-xl">
							<div
								class="mask h-full w-full rounded-2xl bg-base-300 object-cover ring-1 ring-base-content/10"
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
											((e.currentTarget as HTMLImageElement).src =
												'/images/placeholders/event.png')}
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
							class="btn btn-block border-base-content/20 font-medium btn-outline btn-sm hover:border-base-content/40"
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

				<!-- Timing -->
				<fieldset
					class="fieldset w-full rounded-xl border border-base-content/5 bg-base-100/30 p-4"
				>
					<legend class="fieldset-legend pb-2 text-sm font-medium text-base-content/70"
						>Schedule</legend
					>
					<div class="space-y-4">
						<div class="grid grid-cols-2 gap-4">
							<AdminInput
								id="date_day"
								label="Day"
								bind:value={form.date_day}
								placeholder="21"
								class="text-center font-mono"
								required
							/>
							<AdminInput
								id="time"
								label="Time"
								bind:value={form.time}
								placeholder="10:00"
								class="text-center font-mono"
								required
							/>
						</div>
					</div>
				</fieldset>
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
					class="-mt-px space-y-6 rounded-tr-2xl rounded-b-2xl border border-base-content/5 bg-base-100/50 p-6"
				>
					<div class={activeTab === 'en' ? 'block space-y-4' : 'hidden'}>
						<AdminInput
							id="title_en"
							label="Event Title (EN)"
							bind:value={form.title_en}
							placeholder="Annual Exhibition"
							required
						/>
						<AdminInput
							id="slug"
							label="Slug (URL)"
							bind:value={form.slug}
							placeholder="annual-exhibition"
						/>
						<div class="grid grid-cols-2 gap-4">
							<AdminInput
								id="location_en"
								label="Location (EN)"
								bind:value={form.location_en}
								placeholder="Moscow, Russia"
								required
							/>
							<AdminInput
								id="date_month_en"
								label="Month (EN)"
								bind:value={form.date_month_en}
								placeholder="OCT"
								class="uppercase"
								required
							/>
						</div>
						<AdminTextarea
							id="description_en"
							label="Description (EN)"
							bind:value={form.description_en}
							rows={4}
							placeholder="Event details..."
						/>
					</div>

					<div class={activeTab === 'ru' ? 'block space-y-4' : 'hidden'}>
						<AdminInput
							id="title_ru"
							label="Event Title (RU)"
							bind:value={form.title_ru}
							placeholder="Ежегодная выставка"
							required
						/>
						<div class="grid grid-cols-2 gap-4">
							<AdminInput
								id="location_ru"
								label="Location (RU)"
								bind:value={form.location_ru}
								placeholder="Москва, Россия"
								required
							/>
							<AdminInput
								id="date_month_ru"
								label="Month (RU)"
								bind:value={form.date_month_ru}
								placeholder="ОКТ"
								class="uppercase"
								required
							/>
						</div>
						<AdminTextarea
							id="description_ru"
							label="Description (RU)"
							bind:value={form.description_ru}
							rows={4}
							placeholder="Детали события..."
						/>
					</div>
				</div>
			</div>
		</div>
	</form>

	{#snippet actions()}
		<button
			type="button"
			class="btn text-base-content/70 btn-ghost hover:bg-base-content/5"
			onclick={closeModal}
			disabled={submitting}>Cancel</button
		>
		<button type="submit" form="event-form" class="btn px-8 btn-primary" disabled={submitting}>
			{#if submitting}
				<span class="loading loading-sm loading-spinner"></span>
			{/if}
			{editingId ? 'Save Changes' : 'Create Event'}
		</button>
	{/snippet}
</Modal>
