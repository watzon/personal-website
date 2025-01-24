<script lang="ts">
    import type { RedditComment } from "$lib/types/reddit";
    import { formatDistanceToNow } from "date-fns";
    import { processMediaUrl, urlToBase64 } from "$lib/utils";
    import Self from './Comment.svelte';

    interface ContentPart {
        type: 'text' | 'image' | 'video';
        content: string;
        url?: string;
        base64?: string;
    }

    const props = $props<{
        comment: RedditComment;
        darkMode?: boolean;
        depth?: number;
        upvoted?: string;
        maxComments?: number;
    }>();

    const timeAgo = $derived(formatDistanceToNow(new Date(props.comment.created_utc * 1000), { addSuffix: true }));

    // Store for loaded content
    let loadedContent = $state<ContentPart[]>([]);
    let loading = $state(false);

    // Load content when comment body changes
    $effect(() => {
        loading = true;
        const loadContent = async () => {
            const body = props.comment.body;
            const parts: ContentPart[] = [];
            
            // Split the body into lines to handle GIF embeds
            const lines = body.split('\n');
            
            for (const line of lines) {
                // Check if this line is a GIF embed
                const gifMatch = line.match(/^(?:giphy|tenor|imgur)\|\w+\|[\w-]+$/);
                if (gifMatch) {
                    const processed = processMediaUrl(line);
                    if (processed) {
                        const base64 = await urlToBase64(processed.url);
                        parts.push({
                            type: processed.type,
                            content: line,
                            url: processed.url,
                            base64
                        });
                    } else {
                        parts.push({
                            type: 'text',
                            content: line
                        });
                    }
                    continue;
                }

                // Handle regular text with links
                let lastIndex = 0;
                const regex = /(?:!\[(?:[^\]]*)\]\(([^)]+)\))|(?:https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif|webp)(?:\?[^\s]*)?)|(?:https?:\/\/(?:(?:i\.)?imgur\.com|gfycat\.com)[^\s]+)/g;
                let match;

                while ((match = regex.exec(line)) !== null) {
                    // Add text before the match
                    if (match.index > lastIndex) {
                        parts.push({
                            type: 'text',
                            content: line.slice(lastIndex, match.index)
                        });
                    }

                    // Process the URL
                    const mediaUrl = match[1] || match[0];
                    const processed = processMediaUrl(mediaUrl);
                    
                    if (processed) {
                        const base64 = await urlToBase64(processed.url);
                        parts.push({
                            type: processed.type,
                            content: mediaUrl,
                            url: processed.url,
                            base64
                        });
                    } else {
                        parts.push({
                            type: 'text',
                            content: mediaUrl
                        });
                    }

                    lastIndex = regex.lastIndex;
                }

                // Add remaining text from this line
                if (lastIndex < line.length) {
                    parts.push({
                        type: 'text',
                        content: line.slice(lastIndex)
                    });
                }

                // Add newline if this isn't the last line
                if (line !== lines[lines.length - 1]) {
                    parts.push({
                        type: 'text',
                        content: '\n'
                    });
                }
            }

            loadedContent = parts;
            loading = false;
        };

        loadContent().catch(error => {
            console.error('Failed to load content:', error);
            loading = false;
        });
    });
</script>

<div class="comment" class:dark={props.darkMode} style="margin-left: {(props.depth || 0) * 20}px">
    <div class="metadata">
        <span class="author">u/{props.comment.author}</span>
        {#if props.comment.all_awardings?.length}
            <span class="awards">
                {#each props.comment.all_awardings as award}
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
        <span class="score">{props.comment.score} points</span>
        <span class="separator">•</span>
        <span class="time">{timeAgo}</span>
    </div>

    <div class="body">
        {#if loading && loadedContent.length === 0}
            <div class="loading-placeholder">Loading content...</div>
        {:else}
            {#each loadedContent as part}
                {#if part.type === 'text'}
                    {part.content}
                {:else if (part.type === 'image' || part.type === 'video') && part.base64}
                    <div class="media-container">
                        <img
                            src={part.base64}
                            alt="Comment media"
                            loading="lazy"
                            class="comment-image"
                        />
                    </div>
                {:else if part.type === 'image' || part.type === 'video'}
                    <div class="media-container loading">
                        <div class="loading-placeholder">Loading media...</div>
                    </div>
                {/if}
            {/each}
        {/if}
    </div>

    <div class="actions">
        <button class="action-button" class:upvoted={props.upvoted && props.comment.id === props.upvoted}>
            ▲
        </button>
        <button class="action-button">
            ▼
        </button>
        <button class="action-button">
            💬 Reply
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

    {#if props.comment.replies}
        {#each props.comment.replies as reply}
            <Self comment={reply} darkMode={props.darkMode} depth={(props.depth || 0) + 1} upvoted={props.upvoted} />
        {/each}
    {/if}
</div>

<style>
    .comment {
        padding: 0.5rem 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        border-left: 2px solid #edeff1;
        margin-top: 0.5rem;
        padding-left: 1rem;
    }

    .comment.dark {
        color: #d7dadc;
        border-left-color: #343536;
    }

    .metadata {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        font-size: 0.75rem;
        color: #787c7e;
        margin-bottom: 0.25rem;
    }

    .dark .metadata {
        color: #818384;
    }

    .author {
        font-weight: 600;
        color: #1a1a1b;
    }

    .dark .author {
        color: #d7dadc;
    }

    .separator {
        font-size: 0.5rem;
    }

    .score {
        color: #1a1a1b;
    }

    .dark .score {
        color: #d7dadc;
    }

    .body {
        font-size: 0.875rem;
        color: #1a1a1b;
        white-space: pre-wrap;
        margin-bottom: 0.5rem;
    }

    .dark .body {
        color: #d7dadc;
    }

    .actions {
        display: flex;
        gap: 0.5rem;
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

    .upvoted {
        color: #ff4500 !important;
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
        min-height: 100px; /* Ensure there's space while loading */
    }

    .dark .media-container {
        background: rgba(255, 255, 255, 0.025);
    }

    .comment-image {
        max-width: 100%;
        height: auto;
        max-height: 512px;
        object-fit: contain;
        opacity: 1;
        transition: opacity 0.2s ease-in-out;
    }

    .comment-video {
        max-width: 100%;
        height: auto;
        max-height: 512px;
        object-fit: contain;
    }

    .gif-container {
        max-width: 400px;
        margin: 0.5rem auto;
        background: transparent;
    }

    .gif-container video {
        width: 100%;
        height: 100%;
        border-radius: 8px;
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
</style> 