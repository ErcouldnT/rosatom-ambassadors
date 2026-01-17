<script lang="ts">
	import { onMount } from 'svelte';
	import { language } from '$lib/services/language';
	import { translations } from '$lib/services/translations';
	import { getImageUrl } from '$lib/utils';
	import { ArrowLeft, MapPin, Users } from '@lucide/svelte';
	import { SvelteMap } from 'svelte/reactivity';
	import type { PageData } from './$types';

	let { data } = $props<{ data: PageData }>();

	let mapContainer: HTMLDivElement;
	let map: L.Map | null = null;

	onMount(async () => {
		// Dynamically import Leaflet (client-side only)
		const L = await import('leaflet');

		// Import Leaflet CSS
		await import('leaflet/dist/leaflet.css');

		// Initialize map centered on Eurasia
		map = L.map(mapContainer, {
			center: [35, 60],
			zoom: 3,
			minZoom: 2,
			maxZoom: 10,
			zoomControl: true,
			scrollWheelZoom: true,
			attributionControl: false
		});

		// Use light theme tiles (voyager) for all modes
		L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
			subdomains: 'abcd',
			maxZoom: 20
		}).addTo(map);

		// Group ambassadors by country coordinates
		type AmbassadorWithCoords = (typeof data.ambassadors)[0];
		const groupedByCoords = new SvelteMap<string, AmbassadorWithCoords[]>();

		data.ambassadors.forEach((amb: AmbassadorWithCoords) => {
			if (amb.latitude && amb.longitude) {
				const key = `${amb.latitude},${amb.longitude}`;
				if (!groupedByCoords.has(key)) {
					groupedByCoords.set(key, []);
				}
				groupedByCoords.get(key)!.push(amb);
			}
		});

		// Add markers for each country with ambassadors
		groupedByCoords.forEach((ambs, coordKey) => {
			const [lat, lng] = coordKey.split(',').map(Number);
			const countryName = $language === 'ru' ? ambs[0].country_ru : ambs[0].country_en;
			const flag = ambs[0].countryFlag || '🌍';

			// Custom marker icon with count
			const ambassadorIcon = L.divIcon({
				className: 'ambassador-marker',
				html: `
					<div class="marker-container">
						<div class="marker-pulse"></div>
						<div class="marker-badge">${ambs.length}</div>
					</div>
				`,
				iconSize: [32, 32],
				iconAnchor: [16, 16]
			});

			const marker = L.marker([lat, lng], { icon: ambassadorIcon }).addTo(map!);

			// Create popup content
			const popupContent = `
				<div class="map-popup">
					<div class="popup-header">
						<span class="popup-flag">${flag}</span>
						<span class="popup-title">${countryName}</span>
					</div>
					<div class="popup-count">
						<strong>${ambs.length}</strong> ${ambs.length === 1 ? translations[$language].map.ambassador : translations[$language].map.ambassadors}
					</div>
					<div class="popup-list">
						${ambs
							.slice(0, 5)
							.map(
								(amb: AmbassadorWithCoords) => `
							<div class="popup-ambassador">
								<img src="${amb.image ? getImageUrl('ambassadors', amb.id, amb.image) : '/placeholder-avatar.png'}" alt="${$language === 'ru' ? amb.name_ru : amb.name_en}" class="popup-avatar" />
								<div class="popup-info">
									<div class="popup-name">${$language === 'ru' ? amb.name_ru : amb.name_en}</div>
									<div class="popup-role">${$language === 'ru' ? amb.role_ru : amb.role_en}</div>
								</div>
							</div>
						`
							)
							.join('')}
						${ambs.length > 5 ? `<div class="popup-more">+${ambs.length - 5} more</div>` : ''}
					</div>
					<a href="/ambassadors" class="popup-link">${translations[$language].map.viewAll}</a>
				</div>
			`;

			marker.bindPopup(popupContent, {
				maxWidth: 300,
				className: 'ambassador-popup'
			});
		});
	});
</script>

<svelte:head>
	<title>{translations[$language].map.title} | ROSATOM Ambassadors</title>
	<meta
		name="description"
		content="Interactive world map showing ROSATOM ambassador locations around the globe."
	/>
</svelte:head>

<div class="min-h-screen bg-base-100">
	<!-- Header -->
	<header class="sticky top-0 z-50 border-b border-base-200 bg-base-100/80 backdrop-blur-lg">
		<div class="container mx-auto flex items-center justify-between px-4 py-4">
			<a href="/#ambassadors" class="btn gap-2 btn-ghost">
				<ArrowLeft size={20} />
				{translations[$language].map.back}
			</a>
			<h1 class="hidden items-center gap-2 text-xl font-bold text-base-content sm:flex">
				<MapPin size={24} class="text-primary" />
				{translations[$language].map.title}
			</h1>
			<div class="badge gap-2 badge-lg badge-primary">
				<Users size={16} />
				{data.ambassadors.length}
				{translations[$language].map.count}
			</div>
		</div>
	</header>

	<!-- Map Container -->
	<div class="relative h-[calc(100vh-73px)]">
		<div bind:this={mapContainer} class="h-full w-full"></div>

		<!-- Legend -->
		<div
			class="absolute bottom-6 left-6 z-[1000] rounded-xl border border-base-200 bg-base-100/90 p-4 shadow-xl backdrop-blur-md"
		>
			<h3 class="mb-3 text-sm font-bold text-base-content">{translations[$language].map.legend}</h3>
			<div class="flex items-center gap-3 text-sm">
				<div class="relative">
					<div class="h-4 w-4 rounded-full bg-primary"></div>
					<div
						class="absolute inset-0 h-4 w-4 animate-ping rounded-full bg-primary opacity-50"
					></div>
				</div>
				<span class="text-base-content/70">{translations[$language].map.location}</span>
			</div>
			<div class="mt-2 text-xs text-base-content/50">{translations[$language].map.clickInfo}</div>
		</div>
	</div>
</div>

<style>
	/* Hide Leaflet attribution prefix (flag) */
	:global(.leaflet-control-attribution a[href='https://leafletjs.com']) {
		display: none !important;
	}
	:global(.leaflet-control-attribution) {
		font-size: 10px;
	}

	:global(.ambassador-marker) {
		background: transparent;
		border: none;
	}

	:global(.marker-container) {
		position: relative;
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	:global(.marker-pulse) {
		position: absolute;
		width: 16px;
		height: 16px;
		background: oklch(var(--p));
		border-radius: 50%;
		box-shadow: 0 0 0 4px oklch(var(--p) / 0.3);
		animation: pulse 2s ease-out infinite;
	}

	:global(.marker-badge) {
		position: absolute;
		top: -4px;
		right: -4px;
		background: oklch(var(--p));
		color: oklch(var(--pc));
		font-size: 10px;
		font-weight: 800;
		padding: 2px 6px;
		border-radius: 10px;
		border: 2px solid oklch(var(--b1));
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
		z-index: 10;
		pointer-events: none;
	}

	@keyframes pulse {
		0% {
			box-shadow: 0 0 0 0 oklch(var(--p) / 0.5);
		}
		70% {
			box-shadow: 0 0 0 12px oklch(var(--p) / 0);
		}
		100% {
			box-shadow: 0 0 0 0 oklch(var(--p) / 0);
		}
	}

	:global(.ambassador-popup .leaflet-popup-content-wrapper) {
		border-radius: 1rem;
		padding: 0;
		overflow: hidden;
	}

	:global(.ambassador-popup .leaflet-popup-content) {
		margin: 0;
	}

	:global(.map-popup) {
		padding: 1rem;
		min-width: 220px;
	}

	:global(.popup-header) {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.75rem;
	}

	:global(.popup-flag) {
		font-size: 1.5rem;
	}

	:global(.popup-title) {
		font-weight: 700;
		font-size: 1rem;
		color: oklch(var(--bc));
	}

	:global(.popup-count) {
		font-size: 0.875rem;
		color: oklch(var(--bc) / 0.7);
		margin-bottom: 0.75rem;
		padding-bottom: 0.75rem;
		border-bottom: 1px solid oklch(var(--bc) / 0.1);
	}

	:global(.popup-list) {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	:global(.popup-ambassador) {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	:global(.popup-avatar) {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		object-fit: cover;
		border: 2px solid oklch(var(--b2));
	}

	:global(.popup-info) {
		flex: 1;
		min-width: 0;
	}

	:global(.popup-name) {
		font-weight: 600;
		font-size: 0.75rem;
		color: oklch(var(--bc));
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	:global(.popup-role) {
		font-size: 0.625rem;
		color: oklch(var(--bc) / 0.5);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	:global(.popup-more) {
		font-size: 0.75rem;
		color: oklch(var(--p));
		margin-top: 0.25rem;
	}

	:global(.popup-link) {
		display: block;
		text-align: center;
		margin-top: 0.75rem;
		padding-top: 0.75rem;
		border-top: 1px solid oklch(var(--bc) / 0.1);
		font-size: 0.75rem;
		font-weight: 600;
		color: oklch(var(--p));
		text-decoration: none;
	}

	:global(.popup-link:hover) {
		text-decoration: underline;
	}
</style>
