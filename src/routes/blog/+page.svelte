<script lang="ts">
  import RssIcon from "$lib/icons/RSS.svelte";
  import type { Post } from "$lib/types";
  import { formatDate } from "$lib/utils";

  const props = $props();
  const { posts = [] }: { posts: Post[] } = props.data;
</script>

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
