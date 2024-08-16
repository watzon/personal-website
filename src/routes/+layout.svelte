<script>
    import '../app.css';
    import Sun from '$lib/icons/Sun.svelte';
    import Moon from '$lib/icons/Moon.svelte';
  
    const { children } = $props();
    let darkMode = $state(true);
  
    function toggleDarkMode() {
      darkMode = !darkMode;
    }
</script>

<svelte:head>
    <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
</svelte:head>

<div class={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-800'}`}>
    <div class="max-w-screen-lg mx-auto px-4">
        <header class="py-6">
        <nav class="flex justify-between items-center">
            <div class="text-2xl font-mono font-bold text-teal-400">Watzon</div>
            <ul class="flex space-x-6">
            <li><a href="/" class="hover:text-teal-400">Home</a></li>
            <li><a href="/blog" class="hover:text-teal-400">Blog</a></li>
            <li><a href="/resume" class="hover:text-teal-400">Resume</a></li>
            <li><a href="/contact" class="hover:text-teal-400">Contact</a></li>
            </ul>
            <button onclick={toggleDarkMode} class="p-2 rounded-full hover:bg-gray-800">
            {#if darkMode}
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
        <footer class="mt-12 text-center text-sm text-gray-500">
        <p>
            Copyright 2024 Chris Watson. All opinions are my own and not representative
            of any of my employers, past or present.
        </p>
        <p class="mt-2">
            Like what you see? Support me on <a
            href="https://patreon.com/watzon"
            class="text-teal-400 hover:underline">Patreon</a
            >!
        </p>
        </footer>
    </div>
</div>

<script>
    if (typeof window !== 'undefined' && window.netlifyIdentity) {
      window.netlifyIdentity.on("init", user => {
        if (!user) {
          window.netlifyIdentity.on("login", () => {
            document.location.href = "/admin/";
          });
        }
      });
    }
</script>