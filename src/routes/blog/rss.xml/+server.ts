import { generateFeed } from "$lib/feed";
import type { RequestEvent } from '@sveltejs/kit';

export async function GET({ request }: RequestEvent): Promise<Response> {
    const feed = await generateFeed()
    const accept = request.headers.get('Accept') || '';
    
    // If the client accepts text/xml or */* (but doesn't specifically want application/rss+xml)
    // then we'll serve it as text/xml for browser viewing
    const contentType = accept.includes('text/xml') || 
        (accept.includes('*/*') && !accept.includes('application/rss+xml'))
        ? 'text/xml; charset=utf-8'
        : 'application/rss+xml';

    return new Response(feed.rss2(), {
        headers: {
            'Content-Type': contentType,
            'Cache-Control': 'max-age=3600'
        }
    })
}