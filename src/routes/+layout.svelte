<script>
    import '../app.css';
    import { createDarkMode } from '$lib/stores/darkMode.svelte';
    import Sun from '$lib/icons/Sun.svelte';
    import Moon from '$lib/icons/Moon.svelte';
    import PixelFox from '$lib/components/PixelFox.svelte';

    const { children } = $props();
    const darkMode = createDarkMode();
</script>

<svelte:head>
  <title>Chris Watson - Senior Software Engineer - Salt Lake City, UT</title>
  <meta name="description" content="Welcome to my personal website. I'm Chris Watson, a seasoned software engineer, 3d printing content creator, and lover of open source focused on creating efficient, scalable, and user-friendly web applications. With over a decade of experience, I specialize in full-stack development and performance optimization.">

  <!-- Favicon -->
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
  <link rel="manifest" href="/site.webmanifest">
  <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5">
  <meta name="msapplication-TileColor" content="#da532c">
  <meta name="theme-color" content="#ffffff">

  <!-- Umami -->
  <script async src="https://analytics.watzon.tech/script.js" data-website-id="2641feab-38f1-4ce2-9162-2fc85e78b4bd"></script>
</svelte:head>

<div class={`${darkMode.darkMode ? 'dark' : ''}`}>
    <div class={`min-h-screen dark:bg-gray-900 dark:text-gray-300 bg-orange-50 text-gray-800`}>
        <div class="max-w-screen-lg mx-auto px-4">
            <header class="py-6">
            <nav class="flex justify-between items-center">
                <div class="text-2xl font-mono font-bold text-teal-600 dark:text-teal-400">Watzon</div>
                <ul class="flex space-x-6">
                <li><a href="/" class="text-gray-800 hover:text-teal-600 dark:text-teal-400">Home</a></li>
                <li><a href="/blog" class="text-gray-800 hover:text-teal-600 dark:text-teal-400">Blog</a></li>
                <li><a href="/resume" class="text-gray-800 hover:text-teal-600 dark:text-teal-400">Resume</a></li>
                <li><a href="/contact" class="text-gray-800 hover:text-teal-600 dark:text-teal-400">Contact</a></li>
                </ul>
                <button onclick={darkMode.toggleDarkMode} class="p-2 rounded-full hover:bg-gray-800">
                {#if darkMode.darkMode}
                    <Sun size={20} color="currentColor" />
                {:else}
                    <Moon size={20} color="currentColor" />
                {/if}
                </button>
            </nav>
            </header>
            <main class="py-8">
            {@render children()}
            </main>
            <PixelFox />
            <footer class="mt-12 py-4 text-center text-sm text-gray-500">
            <p>
                Copyright &copy; 2024 Christopher Watson. All opinions are my own and not representative
                of any of my employers, past or present.
            </p>
            <p class="mt-2">
                Like what you see? Support me on <a
                href="https://ko-fi.com/watzon"
                class="text-teal-600 dark:text-teal-400 hover:underline">Ko-fi</a
                > or <a
                href="https://github.com/sponsors/watzon"
                class="text-teal-600 dark:text-teal-400 hover:underline">GitHub Sponsors</a
                >.
            </p>
            </footer>
        </div>
    </div>

    <!-- Mastodon verification link -->
    <a class="hidden" rel="me" href="https://tty0.social/@watzon">Mastodon</a>
</div>
