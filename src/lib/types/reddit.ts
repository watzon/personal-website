// Core Response Types
export interface RedditListing<T extends ListingChild = ListingChild> {
    kind: "Listing";
    data: ListingData<T>;
}


// Core Listing Types
export interface RedditListing<T extends ListingChild = ListingChild> {
    kind: "Listing";
    data: ListingData<T>;
}

export interface ListingData<T extends ListingChild = ListingChild> {
    after: string | null;
    before: string | null;
    children: T[];
    dist: number | null;
    modhash: string;
    geo_filter: string;
}

// Base Child Type
export interface ListingChild {
    kind: "t1" | "t3";
    data: RedditPost | RedditComment;
}

// Specific Child Types
export interface PostChild extends ListingChild {
    kind: "t3";
    data: RedditPost;
}

export interface CommentChild extends ListingChild {
    kind: "t1";
    data: RedditComment;
}

// Post Structure (t3)
export interface RedditPost {
    // Core Metadata
    id: string;
    name: string;
    title: string;
    author: string;
    author_fullname: string;
    subreddit: string;
    subreddit_id: string;
    subreddit_name_prefixed: string;
    subreddit_type: "public" | "private";
    created: number;
    created_utc: number;
    domain: string;
    
    // Content
    selftext: string;
    selftext_html: string | null;
    url: string;
    permalink: string;
    thumbnail: string;
    thumbnail_height: number | null;
    thumbnail_width: number | null;
    post_hint?: "image" | "link" | "self" | "video" | "rich:video";
    is_self: boolean;
    is_video: boolean;
    is_reddit_media_domain: boolean;
    is_meta: boolean;
    is_original_content: boolean;
    
    // Engagement Metrics
    score: number;
    ups: number;
    downs: number;
    upvote_ratio: number;
    num_comments: number;
    view_count: number | null;
    visited: boolean;
    saved: boolean;
    
    // Media
    media: PostMedia | null;
    media_embed: MediaEmbed;
    media_metadata: MediaMetadata;
    secure_media: PostMedia | null;
    secure_media_embed: MediaEmbed;
    preview?: PostPreview;
    gif?: string;  // Removed in newer APIs
    mp4?: string;   // Removed in newer APIs
    
    // Awards
    gildings: Gildings;
    total_awards_received: number;
    all_awardings: Award[];
    
    // Moderation
    approved_at_utc: number | null;
    approved_by: string | null;
    banned_by: string | null;
    removal_reason: string | null;
    mod_note: string | null;
    mod_reason_by: string | null;
    mod_reason_title: string | null;
    removed_by_category: string | null;
    
    // NSFW/Content Flags
    over_18: boolean;
    spoiler: boolean;
    hidden: boolean;
    quarantined: boolean;
    contest_mode: boolean;
    
    // User Context
    clicked: boolean;
    likes: boolean | null;
    archived: boolean;
    pinned: boolean;
    stickied: boolean;
    can_gild: boolean;
    can_mod_post: boolean;
    author_premium: boolean;
    author_flair: AuthorFlair;
    link_flair: LinkFlair;
    
    // Technical Metadata
    distinguished: "moderator" | "admin" | "special" | null;
    edited: boolean | number;
    locked: boolean;
    no_follow: boolean;
    send_replies: boolean;
    report_reasons: string[] | null;
    treatment_tags: string[];
    
    // Gallery Data
    gallery_data?: GalleryData;
}

// Comment Structure (t1)
export interface RedditComment {
    // Core Metadata
    id: string;
    name: string;
    author: string;
    author_fullname: string;
    parent_id: string;
    subreddit_id: string;
    subreddit_name_prefixed: string;
    created: number;
    created_utc: number;
    
    // Content
    body: string;
    body_html: string;
    link_id: string;
    permalink: string;
    
    // Engagement Metrics
    score: number;
    ups: number;
    downs: number;
    controversiality: number;
    depth: number;
    collapsed: boolean;
    score_hidden: boolean;
    
    // Awards
    gildings: Gildings;
    total_awards_received: number;
    all_awardings: Award[];
    
    // Moderation
    approved_at_utc: number | null;
    approved_by: string | null;
    banned_by: string | null;
    removal_reason: string | null;
    mod_note: string | null;
    mod_reason_by: string | null;
    mod_reason_title: string | null;
    removed_by_category: string | null;
    
    // User Context
    is_submitter: boolean;
    author_premium: boolean;
    author_flair: AuthorFlair;
    can_gild: boolean;
    can_mod_post: boolean;
    collapsed_reason_code: string | null;
    collapsed_because_crowd_control: boolean | null;
    
    // Technical Metadata
    distinguished: "moderator" | "admin" | "special" | null;
    edited: boolean | number;
    locked: boolean;
    no_follow: boolean;
    send_replies: boolean;
    report_reasons: string[] | null;
    treatment_tags: string[];
    
    // Replies Structure
    replies: RepliesUnion;
}

// Union type for comment replies
export type RepliesUnion = "" | RedditListing<CommentChild>;

// Media Types
export interface PostMedia {
    type: "giphy" | "reddit_video" | "image";
    oembed?: {
        provider_url: string;
        version: string;
        title: string;
        html: string;
        thumbnail_url: string;
        thumbnail_width: number;
        thumbnail_height: number;
    };
    reddit_video?: {
        fallback_url: string;
        height: number;
        width: number;
        scrubber_media_url: string;
        dash_url: string;
        duration: number;
        hls_url: string;
        is_gif: boolean;
        transcoding_status: string;
    };
}

export interface MediaEmbed {
    content?: string;
    width?: number;
    height?: number;
    scrolling?: boolean;
}

export interface MediaMetadata {
    status: string;
    e: string;
    m: string;
    p: GalleryMediaSize[];
    s: GalleryMediaSize;
    id: string;
}

export interface GalleryMediaSize {
    y: number;
    x: number;
    u: string;
}

export interface GalleryData {
    items: {
        media_id: string;
        id: number;
    }[];
}

// Flair Types
export interface AuthorFlair {
    type: "richtext" | "text";
    text: string | null;
    text_color: string | null;
    background_color: string | null;
    richtext: FlairRichtext[];
    css_class: string | null;
    template_id: string | null;
}

export interface LinkFlair {
    type: "richtext" | "text";
    text: string | null;
    background_color: string;
    text_color: "dark" | "light";
    richtext: FlairRichtext[];
}

export interface FlairRichtext {
    e: "text" | "emoji";
    t?: string;
    a?: string;
    u?: string;
}

// Preview Types
export interface PostPreview {
    images: PreviewImage[];
    enabled: boolean;
}

export interface PreviewImage {
    source: MediaSize;
    resolutions: MediaSize[];
    variants: {
        gif?: MediaFormat;
        mp4?: MediaFormat;
    };
    id: string;
}

// Shared Utility Types
export interface MediaSize {
    url: string;
    width: number;
    height: number;
}

export interface MediaFormat {
    source: MediaSize;
    resolutions: MediaSize[];
}

export interface Gildings {
    gid_1?: number;
    gid_2?: number;
    gid_3?: number;
}

export interface Award {
    id: string;
    name: string;
    icon_url: string;
    static_icon_url: string;
    description: string;
    count: number;
}