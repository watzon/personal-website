import type { RedditPost, RedditComment, RedditListing, PostChild, PreviewImage, MediaSize, ListingChild } from "$lib/types/reddit";

export async function fetchRedditData(url: string, maxComments: number): Promise<{ 
    post: RedditPost, 
    comments: (RedditComment & { level: number })[] 
}> {
    try {
        // Convert URL to JSON endpoint and add context
        const jsonUrl = url.replace(/\/?$/, '.json') + '?context=10';
        
        // Fetch data from Reddit
        const response = await fetch(jsonUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch Reddit data');
        }

        const data = await response.json() as [RedditListing<PostChild>, RedditListing<ListingChild>];
        if (!Array.isArray(data) || data.length < 2) {
            throw new Error('Invalid Reddit data format');
        }

        // Extract post data
        const postData = data[0].data.children[0].data;
        const post: RedditPost = {
            ...postData,
            preview: postData.preview && {
                images: postData.preview.images.map((img: PreviewImage) => ({
                    source: {
                        ...img.source,
                        url: decodeHTML(img.source.url),
                    },
                    resolutions: img.resolutions.map((res: MediaSize) => ({
                        ...res,
                        url: decodeHTML(res.url),
                    })),
                    variants: img.variants,
                    id: img.id
                })),
                enabled: postData.preview.enabled
            }
        };

        // Extract comments - only for comment URLs
        let comments: (RedditComment & { level: number })[] = [];
        const commentData = data[1].data.children;

        console.log('Raw comment data:', commentData);

        // Check if this is a comment URL
        const isCommentUrl = url.includes('/comment/');
        const targetCommentId = url.split('/comment/')[1]?.split('/')[0];

        if (isCommentUrl && targetCommentId && commentData.length > 0) {
            // Find the target comment and build its parent chain
            comments = findCommentChain(commentData, targetCommentId);
            console.log('Full comment chain:', comments);

            // If maxComments is specified, keep only the most recent comments
            if (maxComments > 0 && comments.length > maxComments) {
                comments = comments.slice(comments.length - maxComments);
                // Adjust levels to start from 0
                const minLevel = Math.min(...comments.map(c => c.level));
                comments = comments.map(c => ({
                    ...c,
                    level: c.level - minLevel
                }));
            }

            console.log('Trimmed comment chain:', comments);
        }

        console.log('Final comments:', comments);
        return { post, comments };
    } catch (error) {
        console.error('Error fetching Reddit data:', error);
        throw error;
    }
}

function findCommentChain(
    children: ListingChild[],
    targetId: string,
    level: number = 0,
    chain: (RedditComment & { level: number })[] = []
): (RedditComment & { level: number })[] {
    for (const child of children) {
        if (child.kind !== 't1') continue;

        const comment = child.data as RedditComment;
        const currentComment = { ...comment, level };

        if (comment.id === targetId) {
            // Found the target comment, add it to the chain and return
            return [...chain, currentComment];
        }

        // Check replies if they exist
        if (comment.replies && typeof comment.replies !== 'string') {
            const foundInReplies = findCommentChain(
                comment.replies.data.children,
                targetId,
                level + 1,
                [...chain, currentComment]
            );
            if (foundInReplies.length > 0) {
                return foundInReplies;
            }
        }
    }

    return [];
}

// Helper function to decode HTML entities in URLs
function decodeHTML(url: string): string {
    const txt = document.createElement("textarea");
    txt.innerHTML = url;
    return txt.value;
} 