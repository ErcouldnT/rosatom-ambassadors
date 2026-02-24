<script lang="ts">
	interface Props {
		label: string;
		value: string;
		placeholder?: string;
		required?: boolean;
		rows?: number;
		class?: string;
		name?: string;
		id?: string;
	}

	let {
		label,
		value = $bindable(),
		placeholder = '',
		required = false,
		rows = 3,
		class: className = '',
		name,
		id
	}: Props = $props();
</script>

<fieldset class="fieldset {className}">
	<legend class="fieldset-legend pb-2 text-sm font-medium text-base-content/70">{label}</legend>
	<textarea
		{id}
		{name}
		bind:value
		{placeholder}
		{required}
		{rows}
		class="textarea w-full resize-none border-base-content/10 bg-base-100/50 transition-all duration-300 focus:border-primary/50 focus:bg-base-100/80"
	></textarea>
</fieldset>
