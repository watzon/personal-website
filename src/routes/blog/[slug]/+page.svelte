<script lang="ts">
  import { createDarkMode } from "$lib/stores/darkMode.svelte";
  import type { Post } from "$lib/types";
  import { formatDate } from "$lib/utils";

  const { data }: { data: { content: string; meta: Post } } = $props();
  const darkMode = createDarkMode();
</script>

<!-- SEO -->
<svelte:head>
  <title>{data.meta.title}</title>
  <meta name="description" content={data.meta.description} />
  <meta name="keywords" content={data.meta.tags.join(', ')} />
  <meta name="author" content="Chris Watson" />

  <meta property="og:type" content="article" />
  <meta property="og:title" content={data.meta.title} />
  <meta property="og:description" content={data.meta.description} />
  <meta property="og:image" content={data.meta.thumbnail} />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
</svelte:head>

<article class="prose prose-xl dark:prose-invert">
  <!-- Featured Image -->
  {#if data.meta.thumbnail}
    <figure>
      <img
        src={data.meta.thumbnail}
        alt={data.meta.title}
        class="w-full rounded-lg"
      />
    </figure>
  {/if}

  <!-- Title -->
  <hgroup>
    <h1 class="mb-0">{data.meta.title}</h1>
    <p class="!text-gray-400">{formatDate(data.meta.date)}</p>
  </hgroup>

  <!-- Tags -->
  <div class="tags space-x-2">
    {#each data.meta.tags as tag}
      <span class="!text-teal-600 dark:text-teal-400">&num;{tag}</span>
    {/each}
  </div>

  <!-- Post -->
  <div class="">
    <svelte:component this={data.content} />
  </div>
</article>

<style>
  article {
    max-inline-size: var(--size-content-3);
    margin-inline: auto;
  }

  h1 {
    text-transform: capitalize;
  }

  h1 + p {
    margin-top: var(--size-2);
    color: var(--text-2);
  }

  .tags {
    display: flex;
    gap: var(--size-3);
    margin-top: var(--size-7);
  }

  .tags > * {
    padding: var(--size-2) var(--size-3);
    border-radius: var(--radius-round);
  }
</style>
