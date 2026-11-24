import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

/**
 * Content collections. Add a post by adding an .md/.mdx file to the folder –
 * the file name is the URL (src/content/blog/my-post.mdx → /blog/my-post).
 * Images are paths relative to the file (../../assets/images/...).
 */

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD");

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      /** Short summary for cards, RSS and the meta description. */
      excerpt: z.string(),
      /** Optional longer intro under the post title (defaults to the excerpt). */
      subtitle: z.string().optional(),
      /** Must match one of the tabs in src/config/pages/blog.ts. */
      category: z.string(),
      /** Extra tags shown at the end of the post. */
      tags: z.array(z.string()).default([]),
      date: isoDate,
      readingTime: z.string(),
      image: image(),
      imageAlt: z.string(),
      author: z.object({
        name: z.string(),
        role: z.string(),
        bio: z.string().optional(),
        /** Optional photo. Without it the initials are shown. */
        avatar: image().optional(),
      }),
      /** Shown large at the top of the blog page. */
      featured: z.boolean().optional(),
    }),
});

const legal = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/legal" }),
  schema: z.object({
    title: z.string(),
    /** Meta description. */
    description: z.string(),
    /** "Last updated" date in the page header. */
    updated: isoDate,
  }),
});

export const collections = { blog, legal };
