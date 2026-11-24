# AGENTS.md – notes for AI coding agents

Halden is a static Astro theme (marketing site for an AI front desk for clinics). Read this before changing code.

## Stack

- Astro 7, static output (no adapter, no server code, no environment variables required)
- Tailwind CSS 4 via `@tailwindcss/vite`; design tokens in `src/styles/global.css`
- TypeScript strict; MDX via `@astrojs/mdx`; sitemap and RSS
- Fonts: Geist + Geist Mono (Fontsource, self-hosted)
- Animations: CSS + small vanilla `<script>` tags. **No React or other UI framework, no animation library** – keep it that way.

## Commands

```bash
npm run dev       # dev server on http://localhost:4321
npm run check     # astro check – must report 0 errors
npm run build     # static build into dist/ – must finish without warnings
npm run preview   # serve dist/
```

Run `npm run check` and `npm run build` after every change.

## Where things live

| What | Where |
| --- | --- |
| Site name, nav, "Pages" dropdown, footer, socials, CTA | `src/config/site.ts` |
| Page text and data | `src/config/pages/*.ts` (one file per page; `shared.ts` = closing CTA band + eyebrow icons) |
| Colours, fonts, type scale, radii, shadows | `src/styles/global.css` |
| Blog posts / legal pages | `src/content/{blog,legal}/*.mdx` (schemas in `src/content.config.ts`) |
| Pages and routes | `src/pages/` |
| `<head>`, SEO, JSON-LD, header and footer | `src/layouts/BaseLayout.astro` |
| Shared UI (Button, Container, Eyebrow, SectionHeading, Logo) | `src/components/ui/` |
| Header, mobile menu, footer | `src/components/layout/` |
| Shared sections (FAQ, closing CTA band) | `src/components/sections/` |
| Page-specific sections | `src/components/<page>/` |
| MDX element styles | `src/components/mdx/` |
| Scroll reveals and count-ups (data attributes) | `src/scripts/motion.ts` |
| Images (optimised) | `src/assets/images/<page>/`, looked up by path with `getImage()` from `src/lib/images.ts` |
| Build and design decisions | `docs/DECISIONS.md` |

## Rules

1. **Config-driven:** never hard-code visible text in components. Put it in `src/config/` or a content file and pass it as props.
2. **Use the tokens:** use the Tailwind classes generated from the tokens (`bg-brand`, `text-ink`, `text-body`, `bg-canvas`,
   `text-h1`, `rounded-card` …) instead of new hex values.
3. **Images:** put new images in `src/assets/images/` and render them with `<Image />` from `astro:assets` (set `widths` and `sizes`).
4. **Animations:** prefer the data attributes (`data-reveal`, `data-stagger`, `data-count`).
   New scripts must respect reduced motion (`reduceMotion()` from `src/scripts/motion.ts`) and must not hide content without JavaScript.
5. **Accessibility:** one `h1` per page, headings in order, real `<a>` and `<button>`, labels on inputs, `aria-*` on toggles,
   visible focus. Keep the skip link.
6. **Whitespace in templates:** inside `{ … }` expressions Astro follows JSX whitespace rules – write `{" "}` between
   text and a following tag.
7. **Placeholder data only:** emails and URLs use `example.com`; social links point to the platform home page.
8. Keep the theme dependency-light and every dependency public and MIT-compatible.

## Astro docs

https://docs.astro.build – routing, components, content collections, images, styling.
