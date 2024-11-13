<script lang="ts">
  import RssIcon from "$lib/icons/RSS.svelte";
  import type { Post } from "$lib/types";
  import { formatDate } from "$lib/utils";

  const props = $props();
  const { posts = [] }: { posts: Post[] } = props.data;
</script>

<svelte:head>
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://watzon.tech/blog">
  <meta property="og:title" content="Chris Watson - Blog">
  <meta property="og:description" content="Read Chris Watson's blog posts about software development, 3d printing, and more">
  <meta property="og:image" content="https://watzon.tech/images/og-image.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Chris Watson - Senior Software Engineer - Salt Lake City, UT">
  <meta property="og:site_name" content="watzon.tech">
</svelte:head>

<div class="flex justify-between items-center mb-6">
  <h1 class="text-3xl font-bold">Blog Posts</h1>
  <a
    rel="external"
    href="/blog/rss.xml"
    class="text-teal-600 dark:text-teal-400 hover:underline"><RssIcon /></a
  >
</div>

<ul class="space-y-4">
  {#each posts as post}
    <li class="border-b border-gray-700 pb-4">
      <a
        href={post.link}
        class="text-xl text-teal-600 dark:text-teal-400 hover:underline"
        >{post.title}</a
      >
      <p class="text-sm text-gray-500 mt-1">{formatDate(post.date)}</p>
    </li>
  {/each}
</ul>
