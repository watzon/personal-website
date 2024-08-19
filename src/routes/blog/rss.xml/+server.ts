import { generateFeed } from "$lib/feed";

export async function GET() {
    const feed = await generateFeed()
    return new Response(feed.rss2(), {
        headers: {
            'Content-Type': 'application/rss+xml',
            'Cache-Control': 'max-age=3600'
        }
    })
}