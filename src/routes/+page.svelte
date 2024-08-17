<script lang="ts">
	import type { Post } from '$lib/types';
  import { formatDate } from '$lib/utils';
  import { onMount } from "svelte";

  const props = $props();
  const { posts = [] }: { posts: Post[] } = props.data;

  let highlightedProjects = $state([
    {
      name: "Cadmium",
      description: "NLP (natural language processing) library for Crystal",
      link: "https://github.com/cadmiumcr/cadmium",
    },
    {
      name: "Crecto",
      description:
        "Ecto like ORM for Crystal with support for PostgreSQL, MySQL, and SQLite",
      link: "https://github.com/Crecto/crecto",
    },
    {
      name: "Tourmaline",
      description:
        "Crystal based Telegram Bot framework",
      link: "https://github.com/protoncr/tourmaline",
    },
    {
      name: "Paste69",
      description: "Fast, efficient, and minimalist pastebin service",
      link: "https://github.com/watzon/paste69",
    },
    {
      name: "WSL Proxy",
      description: "WSL proxy files for editor/linux interop",
      link: "https://github.com/watzon/wsl-proxy",
    },
  ]);

  onMount(() => {
    // Any client-side initialization can go here
  });
</script>

<div class="space-y-8">
  <section class="bg-neutral-300 dark:bg-gray-800 p-6 rounded-lg">
    <div class="flex items-start space-x-4">
      <img
        src="/images/avatar.png"
        alt="Chris Watson"
        class="w-20 h-20 rounded-full"
      />
      <div>
        <h1 class="text-2xl font-bold mb-2">Chris Watson (Watzon)</h1>
        <p class="text-xl text-teal-600 dark:text-teal-400 mb-2">
          Senior Software Engineer - Salt Lake City, UT
        </p>
        <p class="text-sm mb-4">
          I'm Chris Watson, a seasoned software engineer, 3d printing content creator,
          and lover of open source focused on creating efficient, scalable, and
          user-friendly web applications. With over a decade of experience, I
          specialize in full-stack development and performance optimization.
        </p>
        <p class="text-sm">
          I'm passionate about sharing knowledge and regularly write about
          software development on my <a
            href="/blog"
            class="text-teal-600 dark:text-teal-400 hover:underline">blog</a
          >. When I'm not coding, you can find me exploring new technologies or
          contributing to open-source projects.
        </p>
      </div>
    </div>
  </section>

  <section>
    <h2 class="text-2xl font-bold mb-4">Recent Articles</h2>
    <ul class="space-y-2">
      {#each posts as post}
        <li>
          <span class="text-gray-500">{formatDate(post.date)}</span> -
          <a href={post.link} class="text-teal-600 dark:text-teal-400 hover:underline"
            >{post.title}</a
          >
        </li>
      {/each}
    </ul>
  </section>

  <section>
    <h2 class="text-2xl font-bold mb-4">Highlighted Projects</h2>
    <ul class="space-y-2">
      {#each highlightedProjects as project}
        <li>
          <a href={project.link} class="text-teal-600 dark:text-teal-400 hover:underline"
            >{project.name}</a
          >
          - {project.description}
        </li>
      {/each}
    </ul>
  </section>

  <section>
    <h2 class="text-2xl font-bold mb-4">Quick Links</h2>
    <div class="flex flex-wrap gap-4">
      <a href="https://github.com/watzon" class="text-teal-600 dark:text-teal-400 hover:underline"
        >GitHub</a
      >
      <a href="https://watzonmanor.com/@watzon" class="text-teal-600 dark:text-teal-400 hover:underline"
        >Mastodon</a
      >
      <a
        href="https://linkedin.com/in/watzon1993"
        class="text-teal-600 dark:text-teal-400 hover:underline">LinkedIn</a
      >
      <a href="/blog" class="text-teal-600 dark:text-teal-400 hover:underline">Blog</a>
      <a href="/resume" class="text-teal-600 dark:text-teal-400 hover:underline">Resume</a>
    </div>
  </section>
</div>
