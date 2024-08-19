export type Post = {
	layout: 'blog'
    title: string
    description: string
    date: string
    tags: string[]
    thumbnail?: string
    link: string
    slug: string
}