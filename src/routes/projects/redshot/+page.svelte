<script lang="ts">
    import { onMount } from "svelte";
    import { fetchRedditData } from "$lib/services/reddit";
    import type { RedditPost, RedditComment } from "$lib/types/reddit";
    import Post from "$lib/components/reddit/Post.svelte";
    import Comment from "$lib/components/reddit/Comment.svelte";
    import Counter from "$lib/components/Counter.svelte";
    import html2canvas from "html2canvas";

    let url = $state("");
    let isValidUrl = $state(false);
    let isLoading = $state(false);
    let error = $state<string | null>(null);
    let previewCanvas = $state<HTMLCanvasElement | null>(null);
    let rawRedditData = $state<{ post: RedditPost; comments: RedditComment[] } | null>(null);
    let redditData = $state<{ post: RedditPost; comments: RedditComment[] } | null>(null);
    let darkMode = $state(false);
    let previewElement = $state<HTMLDivElement | null>(null);
    let maxComments = $state(5);
    let voteStates = $state<Record<string, 'up' | 'down' | null>>({});
    let savedStates = $state<Record<string, boolean>>({});
    let lastGeneratedUrl = $state<string>("");
    let isInitialized = $state(false);

    // Clean Reddit URL by removing query params and fragments
    function cleanRedditUrl(url: string): string {
        try {
            const parsed = new URL(url);
            // Remove query parameters and hash
            parsed.search = '';
            parsed.hash = '';
            // Remove trailing slashes
            return parsed.toString().replace(/\/+$/, '');
        } catch {
            return url;
        }
    }

    // Validate Reddit URL
    function validateRedditUrl(url: string): boolean {
        try {
            const parsed = new URL(url);
            // Check if it's a reddit.com URL
            if (!parsed.hostname.match(/^(?:www\.)?reddit\.com$/)) {
                return false;
            }
            
            const path = parsed.pathname.replace(/\/+$/, ''); // Remove trailing slashes
            
            // Check for post or comment URLs
            return path.includes('/comments/') || 
                   (path.includes('/r/') && path.split('/').length >= 3);
        } catch {
            return false;
        }
    }

    // Initial load from URL params
    $effect(() => {
        if (!isInitialized) {
            isInitialized = true;
        }
    });

    // Watch URL changes only for validation
    $effect(() => {
        const currentUrl = url;
        isValidUrl = validateRedditUrl(currentUrl);
        error = null;
    });

    // Watch display options for screenshot regeneration
    $effect(() => {
        // Track all display options
        const currentDarkMode = darkMode;
        const currentVoteStates = voteStates;
        const currentSavedStates = savedStates; // Track saved states

        // Update display if we have data
        if (rawRedditData) {
            updateDisplay();
        }
    });

    async function fetchRedditContent() {
        if (!isValidUrl) return;
        
        isLoading = true;
        error = null;

        try {
            // Clean URL before fetching
            const cleanedUrl = cleanRedditUrl(url);
            rawRedditData = await fetchRedditData(cleanedUrl, maxComments);
            lastGeneratedUrl = url;
            updateDisplay();
        } catch (err) {
            error = err instanceof Error ? err.message : "An unknown error occurred";
            rawRedditData = null;
            redditData = null;
        } finally {
            isLoading = false;
        }
    }

    async function updateDisplay() {
        if (!rawRedditData) return;

        // Apply current display options to the raw data
        if (rawRedditData.comments.length > maxComments) {
            // Keep only the most recent comments up to maxComments
            const trimmedComments = rawRedditData.comments.slice(-maxComments);
            // Adjust levels to start from 0 if needed
            const levels = trimmedComments.map(c => (c as RedditComment & { level: number }).level);
            const minLevel = levels.length > 0 ? Math.min(...levels) : 0;
            redditData = {
                post: rawRedditData.post,
                comments: trimmedComments.map(c => ({
                    ...(c as RedditComment & { level: number }),
                    level: (c as RedditComment & { level: number }).level - minLevel
                }))
            };
        } else {
            redditData = rawRedditData;
        }

        // Wait for the next tick to ensure components are rendered
        await new Promise(resolve => setTimeout(resolve, 100));

        // Generate screenshot
        if (previewElement) {
            const canvas = await html2canvas(previewElement, {
                backgroundColor: darkMode ? "#1a1a1b" : "#ffffff",
                scale: 2, // Higher quality
                allowTaint: true,
                useCORS: true // Add this to ensure images load correctly
            });
            previewCanvas = canvas;
        }
    }

    function handleUrlInput(e: Event) {
        const input = e.target as HTMLInputElement;
        url = input.value;
    }

    function handleDarkModeChange(e: Event) {
        const input = e.target as HTMLInputElement;
        darkMode = input.checked;
    }

    async function saveImage() {
        if (!previewCanvas) return;

        const link = document.createElement("a");
        link.download = "reddit-screenshot.png";
        link.href = previewCanvas.toDataURL("image/png");
        link.click();
    }

    async function copyImage() {
        if (!previewCanvas) return;

        try {
            const blob = await new Promise<Blob>((resolve) => {
                if (!previewCanvas) return;
                previewCanvas.toBlob((b) => {
                    if (b) resolve(b);
                });
            });

            await navigator.clipboard.write([
                new ClipboardItem({
                    [blob.type]: blob,
                }),
            ]);
        } catch (err) {
            console.error("Failed to copy image:", err);
            error = "Failed to copy image to clipboard";
        }
    }

    // Function to update vote state
    function updateVoteState(id: string, vote: 'up' | 'down' | null) {
        voteStates = {
            ...voteStates,
            [id]: vote
        };
    }

    // Function to toggle saved state
    function toggleSavedState(id: string) {
        savedStates = {
            ...savedStates,
            [id]: !savedStates[id]
        };
    }
</script>

<div class="container mx-auto px-4 my-8 {!redditData ? 'max-w-3xl' : 'max-w-[1400px]'}">
    <h1 class="text-center mb-2 font-semibold text-2xl text-gray-800 dark:text-gray-300">
        Generate Reddit Screenshots
    </h1>
    <p class="text-center text-teal-700 dark:text-teal-400 mb-2">
        Create beautiful screenshots of Reddit posts and comments.
    </p>
    <p class="text-center text-gray-700 dark:text-gray-300 mb-8 text-sm">
        Just paste a Reddit URL and we'll do the rest
    </p>

    <div class="flex flex-col {redditData ? 'lg:flex-row' : ''} gap-8">
        <!-- Controls Section -->
        <div class="flex flex-col gap-6 {redditData ? 'lg:w-[400px] lg:flex-none lg:sticky lg:top-8 lg:h-fit' : ''}">
            <!-- URL Input -->
            <div class="flex flex-col gap-2">
                <label 
                    for="reddit-url" 
                    class="text-teal-700 dark:text-teal-400 text-sm font-medium"
                >
                    Reddit URL
                </label>
                <input
                    type="url"
                    id="reddit-url"
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-orange-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 transition-all hover:border-teal-700 dark:hover:border-teal-400"
                    placeholder="https://reddit.com/r/..."
                    value={url}
                    oninput={handleUrlInput}
                />
                {#if error}
                    <p class="text-red-500 text-sm">{error}</p>
                {/if}
            </div>

            <!-- Configuration Options -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <!-- Theme Toggle -->
                <div class="flex flex-col gap-2 items-center h-24 justify-between">
                    <label 
                        for="dark-mode"
                        class="text-teal-700 dark:text-teal-400 text-sm font-medium text-center"
                    >
                        Dark Mode
                    </label>
                    <div class="h-10 flex items-center">
                        <button 
                            class="inline-flex items-center w-11 h-6 cursor-pointer"
                            onclick={() => darkMode = !darkMode}
                            aria-label="Toggle dark mode"
                        >
                            <input
                                id="dark-mode"
                                type="checkbox"
                                bind:checked={darkMode}
                                class="sr-only peer"
                            />
                            <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 dark:peer-focus:ring-teal-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-teal-600"></div>
                        </button>
                    </div>
                </div>

                <!-- Max Comments -->
                <div class="flex flex-col gap-2 items-center h-24 justify-between">
                    <label for="max-comments" class="text-teal-700 dark:text-teal-400 text-sm font-medium text-center">
                        Max Comments
                    </label>
                    <div class="h-10 flex items-center">
                        <Counter
                            id="max-comments"
                            bind:value={maxComments}
                            min={1}
                            max={20}
                            labelClass="sr-only"
                        />
                    </div>
                </div>
            </div>

            <!-- Generate Button -->
            <button
                class="px-6 py-3 rounded-lg cursor-pointer transition-all font-medium bg-teal-700 dark:bg-teal-600 text-white hover:bg-teal-800 dark:hover:bg-teal-700 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                disabled={!isValidUrl || isLoading}
                onclick={fetchRedditContent}
                aria-label={isLoading ? "Generating screenshot" : "Generate screenshot"}
            >
                {#if isLoading}
                    Generating...
                {:else}
                    Generate Screenshot
                {/if}
            </button>

            {#if previewCanvas}
                <!-- Action Buttons -->
                <div class="grid grid-cols-2 gap-4">
                    <button
                        class="px-3 py-3 rounded-lg cursor-pointer transition-all font-medium bg-teal-700 dark:bg-teal-600 text-white hover:bg-teal-800 dark:hover:bg-teal-700 hover:-translate-y-0.5"
                        onclick={saveImage}
                        aria-label="Save screenshot as image file"
                    >
                        Save Image
                    </button>
                    <button
                        class="px-3 py-3 rounded-lg cursor-pointer transition-all font-medium bg-orange-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-300 hover:border-teal-700 dark:hover:border-teal-400 hover:text-teal-700 dark:hover:text-teal-400 hover:-translate-y-0.5"
                        onclick={copyImage}
                        aria-label="Copy screenshot to clipboard"
                    >
                        Copy Image
                    </button>
                </div>
            {/if}
        </div>

        <!-- Preview Section -->
        {#if redditData}
            <div class="lg:w-1/2 lg:min-w-[600px]">
                <div 
                    bind:this={previewElement}
                    class="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-8 overflow-hidden bg-white lg:sticky lg:top-8 w-full"
                    class:dark-theme={darkMode}
                >
                    <Post 
                        post={redditData.post} 
                        {darkMode} 
                        voteState={voteStates[redditData.post.id]} 
                        onVote={(vote) => updateVoteState(redditData.post.id, vote)}
                        saved={savedStates[redditData.post.id]}
                        onSave={() => toggleSavedState(redditData.post.id)}
                    />
                    {#each redditData.comments as comment (comment.id)}
                        <Comment 
                            comment={comment as RedditComment & { level: number }}
                            {darkMode}
                            voteState={voteStates[comment.id]}
                            onVote={(vote) => updateVoteState(comment.id, vote)}
                            saved={savedStates[comment.id]}
                            onSave={() => toggleSavedState(comment.id)}
                        />
                    {/each}
                </div>
            </div>
        {/if}
    </div>
</div>

<style>
    .dark-theme {
        background: #1a1a1b !important;
    }
</style> 