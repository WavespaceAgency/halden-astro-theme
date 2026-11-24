import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { siteConfig } from "@/config/site";
import { getPosts } from "@/lib/content";

/** Blog RSS feed at /rss.xml (linked in the page <head>). */
export async function GET(context: APIContext) {
  const posts = await getPosts();
  return rss({
    title: `${siteConfig.name} blog`,
    description: siteConfig.description,
    site: context.site ?? siteConfig.url,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.excerpt,
      pubDate: new Date(`${post.data.date}T00:00:00Z`),
      link: `/blog/${post.id}/`,
      categories: [post.data.category],
      author: post.data.author.name,
    })),
  });
}
