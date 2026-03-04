<script lang="ts">
</script>

<svelte:head>
	<title>Settings - Admin</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Settings</h1>
			<p class="text-base-content/70">Manage site configuration</p>
		</div>
	</div>

	<!-- Admin Info -->
	<div class="card bg-base-100 shadow-sm">
		<div class="card-body">
			<h2 class="card-title">Admin Information</h2>
			<div class="mt-4 space-y-2 text-sm">
				<p><strong>Email:</strong> admin@rneambassadors.org</p>
				<p><strong>Password:</strong> admin123 (demo only)</p>
				<p class="text-base-content/50">
					In production, use environment variables and a proper database for credentials.
				</p>
			</div>
		</div>
	</div>
</div>
