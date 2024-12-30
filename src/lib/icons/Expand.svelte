<script lang="ts">
  const { size = 24, color = "currentColor", class: className = "" } = $props();
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="none"
  stroke={color}
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class={className}
>
  <path d="M15 3h6v6" />
  <path d="M9 21H3v-6" />
  <path d="M21 3l-7 7" />
  <path d="M3 21l7-7" />
</svg> 