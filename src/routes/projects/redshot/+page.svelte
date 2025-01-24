<script lang="ts">
    import { onMount } from "svelte";
    import { fetchRedditData } from "$lib/services/reddit";
    import type { RedditPost, RedditComment } from "$lib/types/reddit";
    import Post from "$lib/components/reddit/Post.svelte";
    import Comment from "$lib/components/reddit/Comment.svelte";
    import html2canvas from "html2canvas";

    let url = $state("");
    let isValidUrl = $state(false);
    let isLoading = $state(false);
    let error = $state<string | null>(null);
    let previewCanvas = $state<HTMLCanvasElement | null>(null);
    let redditData = $state<{ post: RedditPost; comments: RedditComment[] } | null>(null);
    let darkMode = $state(false);
    let previewElement = $state<HTMLDivElement | null>(null);
    let showUpvoted = $state(false);
    let maxComments = $state(5);
    let upvotedCommentId = $state<string | undefined>(undefined);

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

    // Watch URL changes
    $effect(() => {
        isValidUrl = validateRedditUrl(url);
        error = null;
        if (showUpvoted) {
            upvotedCommentId = url.split('/comment/')[1]?.split('/')[0];
        }
    });

    async function generateScreenshot() {
        if (!isValidUrl) return;
        
        isLoading = true;
        error = null;

        try {
            // Clean URL before fetching
            const cleanedUrl = cleanRedditUrl(url);
            redditData = await fetchRedditData(cleanedUrl, maxComments);

            // Wait for the next tick to ensure components are rendered
            await new Promise(resolve => setTimeout(resolve, 100));

            // Generate screenshot
            if (previewElement) {
                const canvas = await html2canvas(previewElement, {
                    backgroundColor: darkMode ? "#1a1a1b" : "#ffffff",
                    scale: 2, // Higher quality
                    allowTaint: true
                });
                previewCanvas = canvas;
            }
        } catch (err) {
            error = err instanceof Error ? err.message : "An unknown error occurred";
            redditData = null;
        } finally {
            isLoading = false;
        }
    }

    function handleUrlInput(e: Event) {
        const input = e.target as HTMLInputElement;
        url = input.value;
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
</script>

<div class="max-w-3xl px-4 my-8 mx-auto">
    <h1 class="text-center mb-2 font-semibold text-2xl text-gray-800 dark:text-gray-300">
        Generate Reddit Screenshots
    </h1>
    <p class="text-center text-teal-700 dark:text-teal-400 mb-2">
        Create beautiful screenshots of Reddit posts and comments.
    </p>
    <p class="text-center text-gray-700 dark:text-gray-300 mb-8 text-sm">
        Just paste a Reddit URL and we'll do the rest
    </p>

    <div class="flex flex-col gap-6">
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
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Theme Toggle -->
            <div class="flex items-center gap-2">
                <label class="inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        bind:checked={darkMode}
                        class="sr-only peer"
                    />
                    <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 dark:peer-focus:ring-teal-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-teal-600"></div>
                    <span class="ms-3 text-sm font-medium text-gray-700 dark:text-gray-300">Dark Mode</span>
                </label>
            </div>

            <!-- Upvote Toggle -->
            <div class="flex items-center gap-2">
                <label class="inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        bind:checked={showUpvoted}
                        class="sr-only peer"
                    />
                    <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 dark:peer-focus:ring-teal-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-teal-600"></div>
                    <span class="ms-3 text-sm font-medium text-gray-700 dark:text-gray-300">Show as Upvoted</span>
                </label>
            </div>

            <!-- Max Comments -->
            <div class="flex flex-col gap-2 sm:col-span-2">
                <label 
                    for="max-comments" 
                    class="text-teal-700 dark:text-teal-400 text-sm font-medium"
                >
                    Max Comments ({maxComments})
                </label>
                <input
                    type="range"
                    id="max-comments"
                    min="1"
                    max="20"
                    bind:value={maxComments}
                    class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
            </div>
        </div>

        <!-- Generate Button -->
        <button
            class="px-6 py-3 rounded-lg cursor-pointer transition-all font-medium bg-teal-700 dark:bg-teal-600 text-white hover:bg-teal-800 dark:hover:bg-teal-700 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            disabled={!isValidUrl || isLoading}
            onclick={generateScreenshot}
        >
            {#if isLoading}
                Generating...
            {:else}
                Generate Screenshot
            {/if}
        </button>

        <!-- Preview Area -->
        {#if redditData}
            <div 
                bind:this={previewElement}
                class="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-8 overflow-hidden bg-white"
                class:dark-theme={darkMode}
            >
                <Post post={redditData.post} {darkMode} />
                {#each redditData.comments as comment}
                {console.log(upvotedCommentId)}
                    <Comment 
                        {comment} 
                        {darkMode}
                        upvoted={upvotedCommentId} 
                    />
                {/each}
            </div>

            {#if previewCanvas}
                <!-- Action Buttons -->
                <div class="grid grid-cols-2 gap-4">
                    <button
                        class="px-3 py-3 rounded-lg cursor-pointer transition-all font-medium bg-teal-700 dark:bg-teal-600 text-white hover:bg-teal-800 dark:hover:bg-teal-700 hover:-translate-y-0.5"
                        onclick={saveImage}
                    >
                        Save Image
                    </button>
                    <button
                        class="px-3 py-3 rounded-lg cursor-pointer transition-all font-medium bg-orange-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-300 hover:border-teal-700 dark:hover:border-teal-400 hover:text-teal-700 dark:hover:text-teal-400 hover:-translate-y-0.5"
                        onclick={copyImage}
                    >
                        Copy Image
                    </button>
                </div>
            {/if}
        {/if}
    </div>
</div>

<style>
    .dark-theme {
        background: #1a1a1b !important;
    }
</style> 