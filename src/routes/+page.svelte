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
      language: "crystal",
    },
    {
      name: "0x45",
      description:
        "Modern, high-performance file sharing and URL shortening service built with Go.",
      link: "https://github.com/watzon/0x45",
      language: "go",
    },
    {
      name: "Goshot",
      description:
        "Create beautiful code screenshots with customizable styles ",
      link: "https://github.com/watzon/goshot",
      language: "go",
    },
    {
      name: "Inkify",
      description: "API based replacement for carbon.now.sh",
      link: "https://github.com/watzon/inkify",
      language: "rust",
    },
    {
      name: "PostPilot",
      description: " Local SMTP testing made easy",
      link: "https://github.com/watzon/postpilot",
      language: "go",
    },
  ]);

  let languageClassMap = $state({
    go: "bg-cyan-600 dark:bg-cyan-400",
    rust: "bg-orange-600 dark:bg-orange-400",
    crystal: "bg-stone-950 dark:bg-stone-300",
  });

  onMount(() => {
    // Any client-side initialization can go here
  });
</script>

<svelte:head>
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://watzon.tech">
  <meta property="og:title" content="Chris Watson">
  <meta property="og:description" content="Senior Software Engineer - Salt Lake City, UT">
  <meta property="og:image" content="https://watzon.tech/images/og-image.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Chris Watson - Senior Software Engineer - Salt Lake City, UT">
  <meta property="og:site_name" content="watzon.tech">
</svelte:head>

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
        <p class="text-xl text-teal-700 dark:text-teal-400 mb-2">
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
            class="text-teal-700 dark:text-teal-400 hover:underline">blog</a
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
          <span class="text-gray-700 dark:text-gray-300">{formatDate(post.date)}</span> -
          <a href={post.link} class="text-teal-700 dark:text-teal-400 hover:underline"
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
          <h3 class="flex items-center gap-2" title="{project.name} - written in {project.language}">
            <span class="w-2 h-2 rounded-full inline-block {languageClassMap[project.language as keyof typeof languageClassMap]}"></span>
            <a href={project.link} class="text-teal-700 dark:text-teal-400 hover:underline">{project.name}</a>
          </h3>
          <p class="text-sm text-gray-700 dark:text-gray-300 ml-4">{project.description}</p>
        </li>
      {/each}
    </ul>
  </section>

  <section>
    <h2 class="text-2xl font-bold mb-4">Quick Links</h2>
    <div class="flex flex-wrap gap-4">
      <a href="https://github.com/watzon" class="text-teal-700 dark:text-teal-400 hover:underline"
        >GitHub</a
      >
      <a href="https://tty0.social/@watzon" class="text-teal-700 dark:text-teal-400 hover:underline"
        >Mastodon</a
      >
      <a href="https://bsky.app/profile/watzon.tech" class="text-teal-700 dark:text-teal-400 hover:underline"
        >Bluesky</a
      >
      <a
        href="https://linkedin.com/in/watzon1993"
        class="text-teal-700 dark:text-teal-400 hover:underline">LinkedIn</a
      >
      <a href="/blog" class="text-teal-700 dark:text-teal-400 hover:underline">Blog</a>
      <a href="/resume" class="text-teal-700 dark:text-teal-400 hover:underline">Resume</a>
    </div>
  </section>
</div>
