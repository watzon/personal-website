import { onMount } from 'svelte';

export function createDarkMode() {
    let darkMode = $state(true);

    onMount(() => {
        // Check localStorage for saved preference when component mounts
        const savedMode = localStorage.getItem('darkMode');
        if (savedMode !== null) {
            darkMode = savedMode === 'true';
        }
    });

    function toggleDarkMode() {
        darkMode = !darkMode;
        // Save the new preference to localStorage
        if (typeof window !== 'undefined') {
            localStorage.setItem('darkMode', darkMode.toString());
        }
    }

    return {
        get darkMode() {
            return darkMode;
        },
        toggleDarkMode
    }
}