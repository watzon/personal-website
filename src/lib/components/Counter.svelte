<script lang="ts">
    let { id, value = $bindable(0), min = 0, max = 100, label = "", labelClass = "text-sm font-medium text-gray-700 dark:text-gray-300" } = $props();
</script>

<div class="flex items-center gap-2">
    {#if label && labelClass !== "sr-only"}
        <label for={id} class={labelClass}>{label}</label>
    {:else}
        <label for={id} class="sr-only">{label}</label>
    {/if}
    <button
        id={id}
        class="w-10 h-10 flex items-center justify-center rounded-lg cursor-pointer transition-all font-medium bg-orange-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-300 hover:border-teal-700 dark:hover:border-teal-400 hover:text-teal-700 dark:hover:text-teal-400 disabled:opacity-50 disabled:cursor-not-allowed"
        onclick={() => value = Math.max(min, value - 1)}
        disabled={value <= min}
    >
        -
    </button>
    <span class="text-gray-700 dark:text-gray-300 min-w-[2ch] text-center">{value}</span>
    <button
        id={`${id}-plus`}
        class="w-10 h-10 flex items-center justify-center rounded-lg cursor-pointer transition-all font-medium bg-orange-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-300 hover:border-teal-700 dark:hover:border-teal-400 hover:text-teal-700 dark:hover:text-teal-400 disabled:opacity-50 disabled:cursor-not-allowed"
        onclick={() => value = Math.min(max, value + 1)}
        disabled={value >= max}
    >
        +
    </button>
</div> 