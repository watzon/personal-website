<script lang="ts">
    import type { MediaSize, GalleryMediaSize, RedditPost } from "$lib/types/reddit";
    import { formatDistanceToNow } from "date-fns";
    import { processMediaUrl, urlToBase64 } from "$lib/utils";

    const props = $props<{
        post: RedditPost;
        darkMode?: boolean;
        voteState?: 'up' | 'down' | null;
        onVote?: (vote: 'up' | 'down' | null) => void;
        saved?: boolean;
        onSave?: () => void;
    }>();

    const timeAgo = $derived(formatDistanceToNow(new Date(props.post.created_utc * 1000), { addSuffix: true }));

    // Get the best image to display
    const imageData = $derived.by(() => {
        const post = props.post;
        
        // Handle gallery posts
        if (post.gallery_data && post.media_metadata) {
            // Get the first image from the gallery
            const firstItem = post.gallery_data.items[0];
            if (firstItem) {
                const metadata = post.media_metadata[firstItem.media_id];
                if (metadata && metadata.p) {
                    // Find the best resolution that's not too large
                    const bestResolution = metadata.p
                        .filter((r: GalleryMediaSize) => r.x <= 800)
                        .sort((a: GalleryMediaSize, b: GalleryMediaSize) => b.x - a.x)[0];

                    if (bestResolution) {
                        const processed = processMediaUrl(bestResolution.u);
                        if (processed) {
                            return {
                                width: bestResolution.x,
                                height: bestResolution.y,
                                url: processed.url
                            };
                        }
                    }
                }
            }
            return null;
        }

        // Handle regular posts with preview
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
        <button 
            class="upvote" 
            class:active={props.voteState === 'up'}
            onclick={() => props.onVote?.(props.voteState === 'up' ? null : 'up')}
        >
            ▲
        </button>
        <span class="score">{props.post.score + (props.voteState === 'up' ? 1 : props.voteState === 'down' ? -1 : 0)}</span>
        <button 
            class="downvote"
            class:active={props.voteState === 'down'}
            onclick={() => props.onVote?.(props.voteState === 'down' ? null : 'down')}
        >
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
            <div 
                class="media-container" 
                class:loading
            >
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
            <button 
                class="action-button save-button" 
                class:saved={props.saved}
                onclick={() => props.onSave?.()}
            >
                {props.saved ? '⭐' : '☆'} {props.saved ? 'Saved' : 'Save'}
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
        width: 100%;
        height: 512px; /* Fixed height */
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
        max-height: 100%;
        width: auto;
        height: auto;
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

    .upvote, .downvote {
        border: none;
        background: none;
        cursor: pointer;
        padding: 2px;
        font-size: 1.25rem;
        line-height: 1;
        color: #878a8c;
        transition: color 0.2s ease;
    }

    .dark .upvote, .dark .downvote {
        color: #818384;
    }

    .upvote:hover {
        color: #ff4500;
    }

    .downvote:hover {
        color: #7193ff;
    }

    .upvote.active {
        color: #ff4500;
    }

    .downvote.active {
        color: #7193ff;
    }

    .save-button {
        transition: color 0.2s ease;
    }

    .save-button.saved {
        color: #ff4500;
    }

    .dark .save-button.saved {
        color: #ff4500;
    }
</style> 