<script lang="ts">
	import type { Post } from '$lib/types';
  import { formatDate } from '$lib/utils';

  const props = $props();
  const { posts = [] }: { posts: Post[] } = props.data;
</script>

<h1 class="text-3xl font-bold mb-6">Blog Posts</h1>

<ul class="space-y-4">
  {#each posts as post}
    <li class="border-b border-gray-700 pb-4">
      <a href={post.link} class="text-xl text-teal-400 hover:underline"
        >{post.title}</a
      >
      <p class="text-sm text-gray-500 mt-1">{formatDate(post.date)}</p>
    </li>
  {/each}
</ul>
