import { generateFeed } from "$lib/feed";

export async function GET() {
    const feed = await generateFeed()
    return new Response(feed.atom1(), {
        headers: {
            'Content-Type': 'application/atom+xml',
            'Cache-Control': 'max-age=3600'
        }
    })
}