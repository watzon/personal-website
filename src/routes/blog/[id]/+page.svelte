<script>
  const { id } = $props();

  // In a real application, you'd fetch the post data based on the id
  let post = $state({
    title: "Example Blog Post",
    date: "2024-08-15",
    content:
      "This is the content of the blog post. In a real application, this would be fetched from a database or CMS based on the post id.",
  });
</script>

<article class="prose prose-invert max-w-none">
  <h1>{post.title}</h1>
  <p class="text-gray-500">{post.date}</p>
  <div>{post.content}</div>
</article>

<a href="/blog" class="text-teal-400 hover:underline mt-8 inline-block"
  >← Back to all posts</a
>
