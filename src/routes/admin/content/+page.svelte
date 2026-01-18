<script lang="ts">
	import { Upload, Image as ImageIcon } from '@lucide/svelte';
	import { toasts } from '$lib/stores/toast';

	let uploading = $state(false);

	// Previews
	let heroPreview = $state('/api/images/content/hero_main_image');
	let aboutPreview = $state('/api/images/content/about_main_image');

	async function handleUpload(key: string, file: File) {
		uploading = true;
		const formData = new FormData();
		formData.append('key', key);
		formData.append('image', file);

		try {
			const res = await fetch('/api/admin/content', {
				method: 'POST',
				body: formData
			});

			if (res.ok) {
				// Update preview with timestamp to bust cache
				const timestamp = new Date().getTime();
				if (key === 'hero_main_image') {
					heroPreview = `/api/images/content/hero_main_image?t=${timestamp}`;
				} else if (key === 'about_main_image') {
					aboutPreview = `/api/images/content/about_main_image?t=${timestamp}`;
				}
				toasts.add('Image updated successfully', 'success');
			} else {
				toasts.add('Failed to update image', 'error');
			}
		} catch (error) {
			toasts.add('Error uploading image', 'error');
			console.error(error);
		} finally {
			uploading = false;
		}
	}

	function onFileChange(e: Event, key: string) {
		const target = e.target as HTMLInputElement;
		if (target.files && target.files[0]) {
			handleUpload(key, target.files[0]);
		}
	}
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold tracking-tight text-base-content">Homepage Content</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Manage images and content for the landing page.
			</p>
		</div>
	</div>

	<div class="grid gap-6 md:grid-cols-2">
		<!-- Hero Section -->
		<div class="card border border-base-200 bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title flex items-center gap-2">
					<ImageIcon class="h-5 w-5 text-primary" />
					Hero Image
				</h2>
				<p class="text-sm text-base-content/60">Main image displayed in the hero section.</p>

				<div class="group relative mt-4 aspect-video w-full overflow-hidden rounded-xl bg-base-200">
					<img
						src={heroPreview}
						alt="Hero Preview"
						class="h-full w-full object-cover transition-opacity duration-300"
						onerror={(e) =>
							((e.currentTarget as HTMLImageElement).src =
								'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop')}
					/>
					<div
						class="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
					>
						<label class="btn cursor-pointer gap-2 btn-primary">
							<Upload class="h-4 w-4" />
							Change Image
							<input
								type="file"
								class="hidden"
								accept="image/*"
								onchange={(e) => onFileChange(e, 'hero_main_image')}
								disabled={uploading}
							/>
						</label>
					</div>
				</div>
			</div>
		</div>

		<!-- About Section -->
		<div class="card border border-base-200 bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title flex items-center gap-2">
					<ImageIcon class="h-5 w-5 text-secondary" />
					About Image
				</h2>
				<p class="text-sm text-base-content/60">Image displayed in the about section.</p>

				<div class="group relative mt-4 aspect-video w-full overflow-hidden rounded-xl bg-base-200">
					<img
						src={aboutPreview}
						alt="About Preview"
						class="h-full w-full object-cover transition-opacity duration-300"
						onerror={(e) =>
							((e.currentTarget as HTMLImageElement).src =
								'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop')}
					/>
					<div
						class="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
					>
						<label class="btn cursor-pointer gap-2 btn-secondary">
							<Upload class="h-4 w-4" />
							Change Image
							<input
								type="file"
								class="hidden"
								accept="image/*"
								onchange={(e) => onFileChange(e, 'about_main_image')}
								disabled={uploading}
							/>
						</label>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
