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
			zoomControl: false,
			scrollWheelZoom: true,
			attributionControl: false
		});

		L.control
			.zoom({
				position: 'bottomright'
			})
			.addTo(map);

		// Define tile layers
		const lightTiles = L.tileLayer(
			'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
			{
				subdomains: 'abcd',
				maxZoom: 20
			}
		);

		const darkTiles = L.tileLayer(
			'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
			{
				attribution:
					'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community',
				maxZoom: 16
			}
		);

		let currentTiles = lightTiles;

		const updateTiles = (theme: string) => {
			if (!map) return;
			map.removeLayer(currentTiles);
			currentTiles = theme === 'dark' ? darkTiles : lightTiles;
			currentTiles.addTo(map);
		};

		// Initial sync
		const initialTheme = document.documentElement.getAttribute('data-theme') || 'light';
		updateTiles(initialTheme);

		// Watch for theme changes
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.attributeName === 'data-theme') {
					const newTheme = document.documentElement.getAttribute('data-theme') || 'light';
					updateTiles(newTheme);
				}
			});
		});

		observer.observe(document.documentElement, { attributes: true });

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
					<div class="relative flex items-center justify-center w-10 h-10 transition-transform duration-200 ease-out hover:scale-110">
						<!-- Shadow -->
						<div class="absolute bottom-0 w-8 h-1.5 bg-black/30 blur-[2px] rounded-full"></div>
						
						<!-- Ping Animation -->
						<div class="absolute w-[34px] h-[34px] bg-primary rounded-full opacity-40 animate-ping"></div>
						
						<!-- Main Circle -->
						<div class="relative z-10 flex items-center justify-center w-[34px] h-[34px] bg-primary rounded-full shadow-xl">
							<span class="text-primary-content text-[13px] font-black tracking-tight leading-none pt-[1px]">${ambs.length}</span>
						</div>
					</div>
				`,
				iconSize: [40, 40],
				iconAnchor: [20, 20]
			});

			const marker = L.marker([lat, lng], { icon: ambassadorIcon }).addTo(map!);

			// Create popup content
			const popupContent = `
				<div class="map-popup transition-all duration-300">
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
							<a href="/ambassadors/@${amb.slug}" class="popup-ambassador-link">
								<div class="popup-ambassador">
									<img src="${getImageUrl('ambassadors', amb.id, amb.image)}" onerror="this.src='/images/placeholders/ambassador.png'" alt="${$language === 'ru' ? amb.name_ru : amb.name_en}" class="popup-avatar" />
									<div class="popup-info">
										<div class="popup-name">${$language === 'ru' ? amb.name_ru : amb.name_en}</div>
										<div class="popup-role">${$language === 'ru' ? amb.role_ru : amb.role_en}</div>
									</div>
									<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="popup-arrow"><path d="m9 18 6-6-6-6"/></svg>
								</div>
							</a>
						`
							)
							.join('')}
						${ambs.length > 5 ? `<div class="popup-more">+${ambs.length - 5} more</div>` : ''}
					</div>
					<a href="/ambassadors" class="popup-link">${translations[$language].map.viewAll}</a>
				</div>
			`;

			marker.bindPopup(popupContent, {
				maxWidth: 320,
				className: 'ambassador-popup',
				closeButton: false,
				autoPanPaddingTopLeft: [50, 150],
				autoPanPaddingBottomRight: [50, 50]
			});
		});
	});
	let activeCountryCount = $derived(
		new Set(data.ambassadors.map((a: { country_en: string }) => a.country_en)).size
	);
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
	<!-- Header (Floating) -->
	<header
		class="absolute top-4 right-4 left-4 z-[1000] rounded-2xl border border-white/20 bg-base-100/60 shadow-xl backdrop-blur-xl transition-all sm:top-6 sm:right-6 sm:left-6"
	>
		<div class="flex items-center justify-between px-4 py-3 sm:px-5 sm:py-4">
			<a
				href="/#ambassadors"
				class="group flex items-center gap-2 text-sm font-bold text-base-content/80 transition-colors hover:text-primary sm:text-base"
			>
				<div
					class="flex h-8 w-8 items-center justify-center rounded-full bg-base-content/5 transition-colors group-hover:bg-primary/10 group-hover:text-primary sm:h-10 sm:w-10"
				>
					<ArrowLeft size={18} class="sm:h-5 sm:w-5" />
				</div>
				<span class="hidden sm:inline">{translations[$language].map.back}</span>
			</a>

			<div
				class="absolute top-1/2 left-1/2 flex max-w-[50%] -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-2 overflow-hidden"
			>
				<div
					class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary sm:h-10 sm:w-10"
				>
					<MapPin size={18} class="sm:h-5 sm:w-5" />
				</div>
				<h1 class="truncate text-sm font-extrabold tracking-tight text-base-content sm:text-xl">
					{translations[$language].map.title}
				</h1>
			</div>

			<div
				class="badge h-8 gap-1.5 border-none bg-primary/10 px-3 text-primary transition-all hover:bg-primary hover:text-white sm:h-10 sm:px-4"
			>
				<Users size={14} class="sm:h-4 sm:w-4" />
				<span class="text-sm font-black sm:text-base">{data.ambassadors.length}</span>
				<span class="hidden text-xs font-bold sm:inline sm:text-sm"
					>{translations[$language].map.count}</span
				>
			</div>
		</div>
	</header>

	<!-- Map Container -->
	<!-- Map Container -->
	<div class="relative h-screen w-full overflow-hidden">
		<div
			class="pointer-events-none absolute inset-0 z-10 shadow-[inner_0_0_100px_rgba(0,0,0,0.1)]"
		></div>
		<div bind:this={mapContainer} class="h-full w-full bg-[#1a1a1a]"></div>

		<!-- Legend -->
		<!-- Legend -->
		<div
			class="absolute bottom-4 left-4 z-[1000] flex flex-col items-start gap-2 transition-all sm:bottom-6 sm:left-6"
		>
			<!-- Legend Toggle (Mobile) -->
			<button
				class="btn btn-circle border-white/20 bg-base-100/60 shadow-lg backdrop-blur-xl btn-sm hover:bg-base-100/80 sm:hidden"
				aria-label="Toggle Legend"
				onclick={() => {
					const legendContent = document.getElementById('legend-content');
					if (legendContent) legendContent.classList.toggle('hidden');
				}}
			>
				<div class="h-4 w-4 rounded-full bg-primary"></div>
			</button>

			<!-- Legend Content -->
			<div
				id="legend-content"
				class="hidden min-w-[180px] flex-col gap-3 rounded-2xl border border-white/20 bg-base-100/60 p-4 shadow-2xl backdrop-blur-xl transition-all hover:bg-base-100/80 sm:flex sm:min-w-[200px] sm:p-5"
			>
				<h3 class="text-[10px] font-bold tracking-tight text-base-content/90 uppercase sm:text-xs">
					{translations[$language].map.legend}
				</h3>

				<div class="flex items-center gap-3">
					<div class="relative">
						<div class="h-4 w-4 rounded-full bg-primary shadow-lg sm:h-5 sm:w-5"></div>
						<div
							class="absolute inset-0 h-4 w-4 animate-ping rounded-full bg-primary opacity-40 sm:h-5 sm:w-5"
						></div>
					</div>
					<div class="flex flex-col">
						<span class="text-xs font-bold text-base-content sm:text-sm"
							>{translations[$language].map.location}</span
						>
						<span class="text-[10px] font-medium text-base-content/60">
							{activeCountryCount}
							{translations[$language].map.countries || 'Countries'}
						</span>
					</div>
				</div>

				<div class="border-t border-white/10 pt-3">
					<p class="text-[10px] leading-relaxed font-medium text-base-content/60">
						{translations[$language].map.clickInfo}
					</p>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	/* Hide Leaflet attribution prefix (flag) */
	:global(.leaflet-container) {
		background: transparent !important;
	}

	:global(.leaflet-control-attribution) {
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
		/* Deprecated: Replaced with Tailwind utility classes in JS */
		display: none;
	}

	:global(.ambassador-popup .leaflet-popup-content-wrapper) {
		background: rgba(20, 20, 20, 0.75) !important;
		backdrop-filter: blur(12px) saturate(180%);
		-webkit-backdrop-filter: blur(12px) saturate(180%);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 1.5rem;
		padding: 0;
		overflow: hidden;
		box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
	}

	:global(.ambassador-popup .leaflet-popup-tip) {
		background: rgba(20, 20, 20, 0.75) !important;
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
	}

	:global(.ambassador-popup .leaflet-popup-content) {
		margin: 0;
	}

	:global(.map-popup) {
		padding: 1.25rem;
		min-width: 240px;
	}

	:global(.popup-header) {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 0.75rem;
	}

	:global(.popup-flag) {
		font-size: 1.75rem;
		filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
	}

	:global(.popup-title) {
		font-weight: 800;
		font-size: 1.1rem;
		color: white;
		letter-spacing: -0.02em;
	}

	:global(.popup-count) {
		font-size: 0.825rem;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.6);
		margin-bottom: 1rem;
		padding-bottom: 0.75rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
		display: flex;
		align-items: baseline;
		gap: 0.25rem;
	}

	:global(.popup-count strong) {
		font-weight: 700;
		color: oklch(var(--p));
		font-size: 1rem;
	}

	:global(.popup-list) {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	:global(.popup-ambassador-link) {
		text-decoration: none;
		border-radius: 0.75rem;
		transition: background-color 0.2s;
	}

	:global(.popup-ambassador-link:hover) {
		background: white/5;
	}

	:global(.popup-ambassador) {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.5rem;
	}

	:global(.popup-avatar) {
		width: 36px;
		height: 36px;
		border-radius: 12px;
		object-fit: cover;
		border: 1.5px solid white/10;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
	}

	:global(.popup-info) {
		flex: 1;
		min-width: 0;
	}

	:global(.popup-name) {
		font-weight: 700;
		font-size: 0.825rem;
		color: white;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	:global(.popup-role) {
		font-size: 0.675rem;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.6);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	:global(.popup-arrow) {
		color: rgba(255, 255, 255, 0.3);
		transition:
			transform 0.2s,
			color 0.2s;
	}

	:global(.popup-ambassador-link:hover .popup-arrow) {
		transform: translateX(2px);
		color: oklch(var(--p));
	}

	:global(.popup-more) {
		font-size: 0.75rem;
		font-weight: 600;
		color: oklch(var(--p) / 0.7);
		margin-top: 0.25rem;
		text-align: center;
	}

	:global(.popup-link) {
		display: block;
		text-align: center;
		margin-top: 1rem;
		padding: 0.75rem;
		background: oklch(var(--p) / 0.1);
		border-radius: 1rem;
		font-size: 0.8rem;
		font-weight: 700;
		color: oklch(var(--p));
		text-decoration: none;
		transition: all 0.2s;
	}

	:global(.popup-link:hover) {
		background: oklch(var(--p));
		color: white;
		transform: translateY(-1px);
		box-shadow: 0 4px 12px oklch(var(--p) / 0.2);
	}
</style>
