import type { RedditPost, RedditComment, RedditListing, PostChild, PreviewImage, MediaSize, ListingChild, RepliesUnion } from "$lib/types/reddit";

export async function fetchRedditData(url: string, maxComments: number): Promise<{ post: RedditPost, comments: RedditComment[] }> {
    try {
        // Convert URL to JSON endpoint and add context
        const jsonUrl = url.replace(/\/?$/, '.json') + '?context=10';
        
        // Fetch data from Reddit
        const response = await fetch(jsonUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch Reddit data');
        }

        const data = await response.json() as RedditListing<PostChild>;
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
                    }))
                }))
            }
        };

        maxComments = Math.max(0, maxComments);

        // Extract comments - for comment URLs, we want the context chain
        let comments: RedditComment[] = [];
        const commentData = data[1].data.children;

        // Check if this is a direct comment URL
        const isCommentUrl = url.includes('/comment/');
        const targetCommentId = url.split('/comment/')[1];
        if (isCommentUrl && commentData.length > 0) {
            // Get the last comment in the chain (the target comment)
            const rootComment: ListingChild = commentData[commentData.length - 1];
            if (rootComment.kind === 't1') {
                // First, get the parent chain in chronological order
                const parentChain = commentData
                    .filter((child: ListingChild) => child.kind === 't1')
                    .map((child: ListingChild) => child.data as RedditComment)
                    .reverse();

                // Then, for each comment in the chain, parse its replies
                comments = parentChain.map((comment: RedditComment, index: number) => {
                    // Only parse replies up and including the target comment (last in chain)
                    if (index === parentChain.length - 1) {
                        const rawComment = commentData.find((c: ListingChild) => c.data.id === comment.id);
                        if (rawComment && rawComment.data.replies) {
                            comment.replies = parseComments(rawComment.data.replies.data.children, targetCommentId, maxComments) as unknown as RepliesUnion;
                        }
                    } else {
                        // Clear replies for parent comments to keep the chain clean
                        comment.replies = null as unknown as RepliesUnion;
                    }
                    return comment;
                });
            }
        } else {
            // Regular post - no comments
            comments = [];
        }

        return { post, comments };
    } catch (error) {
        console.error('Error fetching Reddit data:', error);
        throw error;
    }
}

function parseComments(children: ListingChild[], stopAtId: string, maxComments: number): RedditComment[] {
    maxComments -= 1;
    if (maxComments <= 0) {
        return [];
    }

    return children
        .filter(child => child.kind === 't1')
        .map(child => {
            const comment = child.data as RedditComment;
            
            // Parse replies recursively if they exist, but stop at the target comment
            if (comment.replies && comment.replies.data?.children) {
                if (comment.id === stopAtId) {
                    comment.replies = null as unknown as RepliesUnion;
                } else {
                    comment.replies = parseComments(comment.replies.data.children, stopAtId, maxComments) as unknown as RepliesUnion;
                }
            }

            return comment;
        }) as RedditComment[];
}

// Helper function to decode HTML entities in URLs
function decodeHTML(url: string): string {
    const txt = document.createElement("textarea");
    txt.innerHTML = url;
    return txt.value;
} 