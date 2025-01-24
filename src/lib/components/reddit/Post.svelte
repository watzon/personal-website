<script lang="ts">
    import type { MediaSize, RedditPost } from "$lib/types/reddit";
    import { formatDistanceToNow } from "date-fns";
    import { processMediaUrl, urlToBase64 } from "$lib/utils";

    const props = $props<{
        post: RedditPost;
        darkMode?: boolean;
    }>();

    const timeAgo = $derived(formatDistanceToNow(new Date(props.post.created_utc * 1000), { addSuffix: true }));

    // Get the best image to display
    const imageData = $derived.by(() => {
        const post = props.post;
        if (!post.preview?.images[0]) return null;

        const image = post.preview.images[0];
        // Find the best resolution that's not too large
        const bestResolution = image.resolutions
            .filter((r: MediaSize) => r.width <= 800)
            .sort((a: MediaSize, b: MediaSize) => b.width - a.width)[0];

        const source = bestResolution || image.source;
        const processed = processMediaUrl(source.url);
        
        if (processed) {
            return {
                ...source,
                url: processed.url
            };
        }

        return null;
    });

    let base64Image = $state<string | undefined>(undefined);
    let loading = $state(false);

    // Load base64 image when imageData changes
    $effect(() => {
        if (!imageData) {
            base64Image = undefined;
            return;
        }

        loading = true;
        urlToBase64(imageData.url)
            .then(base64 => {
                base64Image = base64;
                loading = false;
            })
            .catch(error => {
                console.error('Failed to load image:', error);
                loading = false;
            });
    });
</script>

<div class="reddit-post" class:dark={props.darkMode}>
    <!-- Vote buttons -->
    <div class="vote-buttons">
        <button class="upvote">
            ▲
        </button>
        <span class="score">{props.post.score}</span>
        <button class="downvote">
            ▼
        </button>
    </div>

    <!-- Post content -->
    <div class="content">
        <div class="metadata">
            <a href="/r/{props.post.subreddit}" class="subreddit">r/{props.post.subreddit}</a>
            <span class="separator">•</span>
            <span class="author">Posted by u/{props.post.author}</span>
            {#if props.post.all_awardings?.length}
                <span class="separator">•</span>
                <span class="awards">
                    {#each props.post.all_awardings as award}
                        <img
                            src={award.icon_url}
                            alt={award.name}
                            title={award.name}
                            class="award-icon"
                            width="16"
                            height="16"
                        />
                        {#if award.count > 1}
                            <span class="award-count">{award.count}</span>
                        {/if}
                    {/each}
                </span>
            {/if}
            <span class="separator">•</span>
            <span class="time">{timeAgo}</span>
        </div>

        <h2 class="title">{props.post.title}</h2>

        {#if props.post.selftext}
            <div class="selftext">{props.post.selftext}</div>
        {/if}

        {#if imageData}
            <div class="media-container" class:loading>
                {#if base64Image}
                    <img
                        src={base64Image}
                        alt={props.post.title}
                        width={imageData.width}
                        height={imageData.height}
                        loading="lazy"
                        class="post-image"
                    />
                {:else}
                    <div class="loading-placeholder">Loading image...</div>
                {/if}
            </div>
        {:else if props.post.is_video && props.post.media?.reddit_video}
            <div class="media-container">
                <video
                    src={props.post.media.reddit_video.fallback_url}
                    controls
                    class="post-video"
                >
                    <track kind="captions" />
                </video>
            </div>
        {/if}

        <div class="actions">
            <button class="action-button">
                💬 {props.post.num_comments} Comments
            </button>
            <button class="action-button">
                ↗️ Share
            </button>
            <button class="action-button">
                ⭐ Save
            </button>
            <button class="action-button">
                ••• More
            </button>
        </div>
    </div>
</div>

<style>
    .reddit-post {
        display: flex;
        gap: 1rem;
        padding: 1rem;
        background: white;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }

    .reddit-post.dark {
        background: #1a1a1b;
        border-color: #343536;
        color: #d7dadc;
    }

    .vote-buttons {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.25rem;
        color: #878a8c;
    }

    .score {
        font-size: 0.75rem;
        font-weight: 600;
    }

    .content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .metadata {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        font-size: 0.75rem;
        color: #787c7e;
    }

    .dark .metadata {
        color: #818384;
    }

    .subreddit {
        color: #1a1a1b;
        font-weight: 600;
        text-decoration: none;
    }

    .dark .subreddit {
        color: #d7dadc;
    }

    .author {
        color: #787c7e;
    }

    .dark .author {
        color: #818384;
    }

    .separator {
        font-size: 0.5rem;
    }

    .title {
        font-size: 1.125rem;
        font-weight: 500;
        color: #222;
        margin: 0;
    }

    .dark .title {
        color: #d7dadc;
    }

    .selftext {
        font-size: 0.875rem;
        color: #1a1a1b;
        white-space: pre-wrap;
    }

    .dark .selftext {
        color: #d7dadc;
    }

    .actions {
        display: flex;
        gap: 1rem;
        margin-top: 0.5rem;
    }

    .action-button {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        padding: 0.25rem 0.5rem;
        border-radius: 2px;
        font-size: 0.75rem;
        font-weight: 600;
        color: #878a8c;
        background: transparent;
        border: none;
        cursor: pointer;
    }

    .dark .action-button {
        color: #818384;
    }

    .action-button:hover {
        background: rgba(0, 0, 0, 0.05);
    }

    .dark .action-button:hover {
        background: rgba(255, 255, 255, 0.05);
    }

    .media-container {
        margin: 0.5rem 0;
        border-radius: 4px;
        overflow: hidden;
        max-height: 512px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.025);
    }

    .dark .media-container {
        background: rgba(255, 255, 255, 0.025);
    }

    .loading-placeholder {
        color: #787c7e;
        font-size: 0.875rem;
        text-align: center;
    }

    .dark .loading-placeholder {
        color: #818384;
    }

    .loading {
        min-height: 200px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.05);
    }

    .dark .loading {
        background: rgba(255, 255, 255, 0.05);
    }

    .post-image {
        max-width: 100%;
        height: auto;
        max-height: 512px;
        object-fit: contain;
        opacity: 1;
        transition: opacity 0.2s ease-in-out;
    }

    .post-video {
        max-width: 100%;
        max-height: 512px;
    }

    .awards {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        margin: 0 0.25rem;
    }

    .award-icon {
        width: 16px;
        height: 16px;
        object-fit: contain;
    }

    .award-count {
        font-size: 0.75rem;
        color: #787c7e;
    }

    .dark .award-count {
        color: #818384;
    }
</style> 