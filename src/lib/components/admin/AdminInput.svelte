<script lang="ts">
	interface Props {
		label: string;
		value: string | number;
		type?: string;
		placeholder?: string;
		required?: boolean;
		disabled?: boolean;
		class?: string;
		name?: string;
		id?: string;
		maxlength?: number;
	}

	let {
		label,
		value = $bindable(),
		type = 'text',
		placeholder = '',
		required = false,
		disabled = false,
		class: className = '',
		name,
		id,
		maxlength
	}: Props = $props();
</script>

<fieldset class="fieldset {className}">
	<legend class="fieldset-legend pb-2 text-sm font-medium text-base-content/70">{label}</legend>
	<input
		{id}
		{name}
		{type}
		bind:value
		{placeholder}
		{required}
		{disabled}
		{maxlength}
		class="input w-full border-base-content/10 bg-base-100/50 transition-all duration-300 focus:border-primary/50 focus:bg-base-100/80"
	/>
</fieldset>
