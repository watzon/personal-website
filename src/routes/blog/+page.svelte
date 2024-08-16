<script>
  let blogPosts = $state([
    { id: 1, title: "Getting Started with Svelte 5", date: "2024-08-15" },
    { id: 2, title: "The Power of Runes in Svelte", date: "2024-08-10" },
    {
      id: 3,
      title: "Building a Personal Website with SvelteKit",
      date: "2024-08-05",
    },
  ]);
</script>

<h1 class="text-3xl font-bold mb-6">Blog Posts</h1>

<ul class="space-y-4">
  {#each blogPosts as post}
    <li class="border-b border-gray-700 pb-4">
      <a href={`/blog/${post.id}`} class="text-xl text-teal-400 hover:underline"
        >{post.title}</a
      >
      <p class="text-sm text-gray-500 mt-1">{post.date}</p>
    </li>
  {/each}
</ul>
