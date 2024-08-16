import { json } from '@sveltejs/kit'
import type { Post } from '$lib/types'

async function getPosts() {
	let posts: Post[] = []

	const paths = import.meta.glob('/src/posts/*.md', { eager: true })

	for (const path in paths) {
		const file = paths[path]

		if (file && typeof file === 'object' && 'metadata' in file) {
			const metadata = file.metadata as Post
            const slug = path.split('/').at(-1)?.replace('.md', '')
			const post = { ...metadata, slug, link: `/blog/${slug}` }
			// TODO: determine if the post is draft or not
            posts.push(post)
		}
	}

	posts = posts.sort((first, second) =>
    new Date(second.date).getTime() - new Date(first.date).getTime()
	)

	return posts
}

export async function GET() {
	const posts = await getPosts()
	return json(posts)
}