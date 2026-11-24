import { getCollection, type CollectionEntry } from "astro:content";

/**
 * Helpers for blog posts (content collections in src/content.config.ts).
 * Add a post: create src/content/blog/<slug>.mdx with frontmatter. The file name is the URL.
 */

export type Post = CollectionEntry<"blog">;

/** All posts, newest first. */
export async function getPosts(): Promise<Post[]> {
  return (await getCollection("blog")).sort((a, b) => b.data.date.localeCompare(a.data.date));
}


/** "2026-09-02" → "Sep 2, 2026" */
export function formatDate(iso: string, month: "short" | "long" = "short") {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", { month, day: "numeric", year: "numeric", timeZone: "UTC" });
}
