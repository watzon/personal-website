import type { Post } from "./types"

type DateStyle = Intl.DateTimeFormatOptions['dateStyle']

export function processMediaUrl(url: string): { type: 'image' | 'video', url: string } | null {
	// Handle Reddit's inline GIF format (e.g., "giphy|uXbXCQ9c3irpC|downsized")
	if (!url.startsWith('http')) {
		const parts = url.split('|');
		if (parts.length === 3) {
			const [provider, id] = parts;
			switch (provider) {
				case 'giphy':
					return {
						type: 'image',
						url: `https://i.giphy.com/${id}.gif`
					};
				// Add other providers as needed
			}
		}
		return null;
	}
	
	// Decode HTML entities
	const txt = document.createElement("textarea");
	txt.innerHTML = url;
	url = txt.value;

	// Reddit image handling
	if (url.includes('preview.redd.it') || url.includes('external-preview.redd.it')) {
		// Keep external previews as is
		if (url.includes('external-preview.redd.it')) {
			return {
				type: 'image',
				url
			};
		}
		// Handle regular previews
		return {
			type: 'image',
			url: url.replace('preview.redd.it', 'i.redd.it').split('?')[0]
		};
	}

	// Imgur handling
	if (url.includes('imgur.com')) {
		// Convert gallery URLs to direct image URLs
		if (url.includes('imgur.com/gallery/') || url.includes('imgur.com/a/')) {
			return null; // Skip galleries for now
		}
		// Convert regular imgur URLs to direct URLs
		if (!url.includes('i.imgur.com')) {
			url = url.replace('imgur.com', 'i.imgur.com');
			if (!url.match(/\.(jpg|jpeg|png|gif)$/i)) {
				url += '.jpg';
			}
		}
		return { type: 'image', url };
	}

	// Gfycat handling
	if (url.includes('gfycat.com')) {
		const gfyId = url.split('/').pop()?.split('-')[0];
		if (gfyId) {
			return {
				type: 'video',
				url: `https://thumbs.gfycat.com/${gfyId}-size_restricted.gif`
			};
		}
	}

	// Direct image URL handling
	if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
		return { type: 'image', url };
	}

	return null;
}

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

// Add utility function to proxy image URLs
export async function urlToBase64(url: string): Promise<string | undefined> {
	try {
		// Use our own API endpoint to proxy the image request
		const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(url)}`;
		const response = await fetch(proxyUrl);
		const blob = await response.blob();
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onloadend = () => resolve(reader.result as string);
			reader.onerror = reject;
			reader.readAsDataURL(blob);
		});
	} catch (error) {
		console.error('Failed to convert image to base64:', error);
		return undefined;
	}
}
