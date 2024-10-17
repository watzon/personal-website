import type { Post } from "./types"

type DateStyle = Intl.DateTimeFormatOptions['dateStyle']

// Format a date that looks like "2023-10-18T13:39:00.000Z" as a human-readable date
export function formatDate(date: string, dateStyle: DateStyle = 'medium', locales = 'en') {
	const dateTime = new Date(date)
	return new Intl.DateTimeFormat(locales, { dateStyle }).format(dateTime)
}

export async function getPosts() {
	let posts: Post[] = []

	const paths = import.meta.glob('/src/posts/*.md', { eager: true })

	for (const path in paths) {
		const file = paths[path]

		if (file && typeof file === 'object' && 'metadata' in file) {
			const metadata = file.metadata as Post
			const slug = path.split('/').at(-1)!.replace('.md', '')
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
