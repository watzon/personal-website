<script>
    import '../app.css';
    import { createDarkMode } from '$lib/stores/darkMode.svelte';
    import Sun from '$lib/icons/Sun.svelte';
    import Moon from '$lib/icons/Moon.svelte';
  
    const { children } = $props();
    const darkMode = createDarkMode();
</script>

<div class={`${darkMode.darkMode ? 'dark' : ''}`}>
    <div class={`min-h-screen dark:bg-gray-900 dark:text-gray-300 bg-gray-200 text-gray-800`}>
        <div class="max-w-screen-lg mx-auto px-4">
            <header class="py-6">
            <nav class="flex justify-between items-center">
                <div class="text-2xl font-mono font-bold text-teal-600 dark:text-teal-400">Watzon</div>
                <ul class="flex space-x-6">
                <li><a href="/" class="hover:text-teal-600 dark:text-teal-400">Home</a></li>
                <li><a href="/blog" class="hover:text-teal-600 dark:text-teal-400">Blog</a></li>
                <li><a href="/resume" class="hover:text-teal-600 dark:text-teal-400">Resume</a></li>
                <li><a href="/contact" class="hover:text-teal-600 dark:text-teal-400">Contact</a></li>
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
            <footer class="mt-12 py-4 text-center text-sm text-gray-500">
            <p>
                Copyright &copy; 2024 Christopher Watson. All opinions are my own and not representative
                of any of my employers, past or present.
            </p>
            <p class="mt-2">
                Like what you see? Support me on <a
                href="https://patreon.com/watzon"
                class="text-teal-600 dark:text-teal-400 hover:underline">Patreon</a
                >!
            </p>
            </footer>
        </div>
    </div>
</div>