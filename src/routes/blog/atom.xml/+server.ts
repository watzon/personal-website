import { generateFeed } from "$lib/feed";
import type { RequestEvent } from '@sveltejs/kit';

export async function GET({ request }: RequestEvent): Promise<Response> {
    const feed = await generateFeed()
    const accept = request.headers.get('Accept') || '';
    
    // If the client accepts text/xml or */* (but doesn't specifically want application/atom+xml)
    // then we'll serve it as text/xml for browser viewing
    const contentType = accept.includes('text/xml') || 
        (accept.includes('*/*') && !accept.includes('application/atom+xml'))
        ? 'text/xml; charset=utf-8'
        : 'application/atom+xml';

    return new Response(feed.atom1(), {
        headers: {
            'Content-Type': contentType,
            'Cache-Control': 'max-age=3600'
        }
    })
}