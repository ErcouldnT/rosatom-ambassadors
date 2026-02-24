<script lang="ts">
	interface Props {
		label: string;
		value: string;
		options?: { value: string; label: string }[];
		placeholder?: string;
		required?: boolean;
		class?: string;
		children?: import('svelte').Snippet;
		name?: string;
		id?: string;
	}

	let {
		label,
		value = $bindable(),
		options = [],
		placeholder = 'Select an option',
		required = false,
		class: className = '',
		children,
		name,
		id
	}: Props = $props();
</script>

<fieldset class="fieldset {className}">
	<legend class="fieldset-legend pb-2 text-sm font-medium text-base-content/70">{label}</legend>
	<select
		{id}
		{name}
		bind:value
		{required}
		class="select w-full border-base-content/10 bg-base-100/50 transition-all duration-300 focus:border-primary/50 focus:bg-base-100/80"
	>
		<option value="" disabled selected>{placeholder}</option>
		{#if options.length > 0}
			{#each options as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		{:else if children}
			{@render children()}
		{/if}
	</select>
</fieldset>
