import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
    const imageUrl = url.searchParams.get('url');
    if (!imageUrl) {
        error(400, 'Missing URL parameter');
    }

    try {
        const response = await fetch(imageUrl, {
            headers: {
                // Some sites check the User-Agent
                'User-Agent': 'Mozilla/5.0 (compatible; RedditScreenshotBot/1.0)'
            }
        });

        if (!response.ok) {
            error(response.status, 'Failed to fetch image');
        }

        const contentType = response.headers.get('content-type');
        const blob = await response.blob();

        return new Response(blob, {
            headers: {
                'Content-Type': contentType || 'image/jpeg',
                'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
            }
        });
    } catch (err) {
        console.error('Error proxying image:', err);
        error(500, 'Failed to proxy image');
    }
}; 