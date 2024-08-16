<script>
  import { onMount } from "svelte";

  let recentArticles = $state([
    {
      date: "08/14/2024",
      title: "Optimizing React Applications for Performance",
      link: "/blog/optimizing-react-applications",
    },
    {
      date: "08/01/2024",
      title: "The Future of TypeScript: What's Coming in 5.0",
      link: "/blog/typescript-5-preview",
    },
    {
      date: "07/15/2024",
      title: "Building Scalable Microservices with Go",
      link: "/blog/scalable-microservices-go",
    },
    {
      date: "07/01/2024",
      title: "Mastering CSS Grid: Advanced Layout Techniques",
      link: "/blog/mastering-css-grid",
    },
    {
      date: "06/15/2024",
      title: "Serverless Architecture: Pros, Cons, and Best Practices",
      link: "/blog/serverless-architecture-guide",
    },
  ]);

  let highlightedProjects = $state([
    {
      name: "DevFlow",
      description: "An AI-powered development workflow optimization tool",
      link: "https://github.com/watzon/devflow",
    },
    {
      name: "ReactiveUI",
      description:
        "A lightweight, reactive UI library for modern web applications",
      link: "https://github.com/watzon/reactiveui",
    },
    {
      name: "GoMicro",
      description:
        "A Go-based microservices framework with built-in service discovery",
      link: "https://github.com/watzon/gomicro",
    },
    {
      name: "TypeSafe",
      description: "A runtime type-checking library for JavaScript",
      link: "https://github.com/watzon/typesafe",
    },
    {
      name: "CloudScale",
      description: "An auto-scaling solution for containerized applications",
      link: "https://github.com/watzon/cloudscale",
    },
  ]);

  onMount(() => {
    // Any client-side initialization can go here
  });
</script>

<div class="space-y-8">
  <section class="bg-gray-800 p-6 rounded-lg">
    <div class="flex items-start space-x-4">
      <img
        src="/path/to/your/avatar.jpg"
        alt="Chris Watson"
        class="w-20 h-20 rounded-full"
      />
      <div>
        <h1 class="text-2xl font-bold mb-2">Chris Watson (Watzon)</h1>
        <p class="text-xl text-teal-400 mb-2">
          Senior Software Engineer - Salt Lake City, UT
        </p>
        <p class="text-sm mb-4">
          I'm Chris Watson, a seasoned software engineer, conference speaker,
          and avid blogger focused on creating efficient, scalable, and
          user-friendly web applications. With over a decade of experience, I
          specialize in full-stack development and performance optimization.
        </p>
        <p class="text-sm">
          I'm passionate about sharing knowledge and regularly write about
          software development on my <a
            href="/blog"
            class="text-teal-400 hover:underline">blog</a
          >. When I'm not coding, you can find me exploring new technologies or
          contributing to open-source projects.
        </p>
      </div>
    </div>
  </section>

  <section>
    <h2 class="text-2xl font-bold mb-4">Recent Articles</h2>
    <ul class="space-y-2">
      {#each recentArticles as article}
        <li>
          <span class="text-gray-500">{article.date}</span> -
          <a href={article.link} class="text-teal-400 hover:underline"
            >{article.title}</a
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
          <a href={project.link} class="text-teal-400 hover:underline"
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
      <a href="https://github.com/watzon" class="text-teal-400 hover:underline"
        >GitHub</a
      >
      <a href="https://twitter.com/watzon" class="text-teal-400 hover:underline"
        >Twitter</a
      >
      <a
        href="https://linkedin.com/in/watzon1993"
        class="text-teal-400 hover:underline">LinkedIn</a
      >
      <a href="/blog" class="text-teal-400 hover:underline">Blog</a>
      <a href="/resume" class="text-teal-400 hover:underline">Resume</a>
    </div>
  </section>
</div>
