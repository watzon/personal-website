// Generate a feed that can be consumed by RSS readers
import { Feed } from 'feed'
import { getPosts } from './utils';

export async function generateFeed() {
    const posts = await getPosts()

    const feed = new Feed({
        title: 'Watzon Tech',
        description: 'Senior Software Engineer - Salt Lake City, UT',
        id: 'https://watzon.tech',
        link: 'https://watzon.tech',
        language: 'en',
        image: 'https://watzon.tech/images/og-image.png',
        favicon: 'https://watzon.tech/favicon.png',
        copyright: 'Copyright © 2024 Christopher Watson',
        updated: new Date(posts[0].date),
        generator: 'Feed for Node.js',
        feedLinks: {
            rss2: 'https://watzon.tech/blog/rss.xml',
            json1: 'https://watzon.tech/blog/rss.json',
            atom1: 'https://watzon.tech/blog/atom.xml'
        }
    })

    for (const post of posts) {
        feed.addItem({
            title: post.title,
            id: post.link,
            link: post.link,
            content: post.description,
            author: [
                {
                    name: 'Chris Watson',
                    link: 'https://watzon.tech'
                }
            ],
            date: new Date(post.date)
        });
    }

    return feed
}