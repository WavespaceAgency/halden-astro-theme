# Build decisions

Notes from turning the Halden Figma design into this Astro theme.

## Sources
- **Figma** (desktop frames, 1440px) is the source for layout, sizes, colours and type.
- **The Framer build of the same design** is the source for animations, the mobile/tablet layouts and the text of collapsed content (FAQ answers, blog posts, legal pages).
- Photos are AI-generated / owned by Wavespace and ship with the theme under the MIT licence.

## Global
- **Fonts:** Geist and Geist Mono (SIL OFL), self-hosted with Fontsource variable fonts. The Figma file uses the static Geist cuts; the variable font renders the giant footer wordmark about 1% narrower.
- **No mobile or tablet frames in Figma.** Breakpoints follow the Framer build: header becomes 64px with a two-line menu button below 1024px; the full-screen mobile menu also lists every page from the "Pages" dropdown.
- **Header:** full width at every screen size, white, sticky, 72px on desktop / 64px on phones – as on the Framer build (Figma shows an 84px header on a 1440 frame). No backdrop-filter on the header: it would trap the fixed mobile-menu layer inside the header.
- **Mobile menu:** drops down from the header like the Framer build (bars turn into ✕, links fade in one by one, full-width dark button). Page scroll is locked while it is open.
- **"Pages" dropdown:** not drawn open in Figma – built as a two-column panel listing every page of the template (useful for the demo).
- **Footer links** that point to pages that are not in the design (Integrations, How it works, Contact, Trust Center, HIPAA, BAA, SOC 2, Help Centre, System Status, Accessibility) go to the closest existing page or anchor (see `src/config/site.ts`).
- **Smooth scrolling:** Lenis (MIT) eases mouse-wheel scrolling; touch scrolling stays native and it is off for reduced motion. Scripts scroll with `scrollToY()` from `src/scripts/smooth-scroll.ts`.
- **Hover:** buttons grow to 102% with a spring (Framer value), press to 97% and their icons nudge; nav links get an underline that grows from the left; the Pages dropdown opens on hover.
- **Icons:** every small SVG icon below the first screen draws its strokes and pops its dots in when it scrolls into view (`src/scripts/motion.ts`, opt out with `data-no-draw`).
- **Animations:** no animation library (Lenis only handles scrolling). Reveals use IntersectionObserver + CSS transitions (`src/scripts/motion.ts`); richer motion lives in small component scripts. Everything respects `prefers-reduced-motion` and content is visible without JavaScript.
- **Placeholder data:** `hello@halden.health` → `hello@example.com`; social links point to the platform root domains. Names, quotes, stats and clinic names are fictional demo content.
- **URLs** match the Framer build: `/privacy-policy`, `/terms-of-service`, `/blog/<slug>`.

## Page notes

### Home page – build notes

Route `/` → `src/pages/index.astro`. Content: `src/config/pages/home.ts`. Sections: `src/components/home/`.

#### Sections (Figma height → built at 1440, reduced motion)
| # | Section | Component | Figma | Built | Mismatch |
|---|---|---|---|---|---|
| 1 | Hero (minus 84px header) | Hero.astro + HeroFlow.astro | 1124 | 1125 | 1.8% |
| 2 | 98% collage | Resolved.astro | 1015 | 1016 (2115 with motion) | 3.9% |
| 3 | Stats bento | Results.astro | 1070 | 1072 | 11% (sticky header overlays the element shot; layout matches) |
| 4 | How it works | HowItWorks.astro + JobVisual.astro + steps.ts | 1128 | 1129 (2629 with motion) | 1.9% |
| 5 | Platform cards | Platform.astro | 1505 | 1506 | 1.9% |
| 6 | Security | Security.astro + steps.ts | 1182 | 1189 (+1088 track with motion) | 9% (fan/glass AA, 7px extra in stats band) |
| 7 | FAQ | shared Faq | 796 | 797 | 1.0% |
| 8 | CTA | shared CtaBand | 660 | 661 | – |

#### Decisions
- Hero bottom gap of 165px kept from Figma (frame is 1208 incl. header). Mobile: 40px.
- Hero photo: Figma image adjustments approximated with `filter: brightness(.8) contrast(1.15) saturate(.4)`.
- Flow diagram is the fixed 1248×390 Figma drawing scaled with `--flow-s` (0.5 / 0.66 / 0.85 / 1 at md / lg / xl / 1440). Hidden on phones (as Framer).
- Waveform in the h1 is decorative (aria-hidden) and hidden on phones (Framer does the same).
- Collage photos and cards hidden below 1024px (Framer hides them on tablet/phone). 1024–1439: composition scaled 0.71 / 0.85.
- Patient-outdoors photo: Framer original had white bars top/bottom → cropped and saved as JPEG.
- "How it works": Figma only has job 1; jobs 2–4 built from the Figma component set `494:1710` variants. Below 1024px (and without JS) the four jobs are stacked (text + mock-up each) – Framer's mobile version was mostly empty space.
- Security: tabs on every width (Framer mobile does the same). First card has no number (as Framer), others 02/03/04. Stats dividers: equal thirds (Framer), Figma's middle divider is off by ~50px.
- Security stat label is uppercase (Framer). Quote highlight in Results is underlined (Figma screenshot shows it).
- FAQ answers taken from Framer.

#### Animations (from Framer bundle)
- Headings: per-letter pop (scale .1→1, spring, 0.03s stagger, start .15s); paragraphs: per-word blur(8px)+12px rise (0.025s stagger, start .3s). `TextEffects.astro`, `data-split="chars|words"`. Screen readers get the plain text.
- Hero flow: connectors fade (.5s delay, .9s), inputs slide from −16px (.30/.38/.46s), steps pop from .92 (.62/.74/.86s), outputs from +16px (.98/1.06/1.14s), note (1.05s), call card (1.25s), bubble (1.55s). Loops: triage scale 1.035 (1.8s mirror), LIVE opacity .45 (1.1s mirror). Waveform bars scaleY loop.
- Collage: scroll-linked keyframes at 0/275/550/825/1100px (scale .82→.91→1→1.05→1.1 + per-item x/y), smoothed like Framer's spring; stage sticky top −80px.
- Jobs: sticky, switch every 500px; Security: sticky, every 300px. Tabs click / arrow keys also work. Mock-up rows slide from −10px, pills pop from .6.
- Count-ups (98%, $12k, 30+, 94%, 100%) via `data-count`.
- Reduced motion: all static (no sticky tracks, tabs still work on desktop).
- Simplified: Framer's per-step inner choreography in "How it works" is approximated by one stagger; hover micro-animations on flow nodes skipped.

### Platform page (/platform) – build notes

Figma frame `372:7247` (1440×8431). Sections: Hero 372:7248 · How it works 660:9939 · Built for clinics 660:9700 ·
Integrations 372:7585 · Setup 379:368 · Channels 379:323 · Testimonials 372:7640 · FAQ 377:669 (shared Faq) · CTA 660:10243 (shared CtaBand).

#### Decisions
- **How it works = sticky scroll (from Framer, not in Figma).** Framer: 600px job row sticks (top 40px) over a 1500px
  track; the active job changes every quarter. Built the same (lg+ with JS only). Section is 2628px tall on desktop
  (Framer 2629) vs Figma 1128 (static frame of job 1). Tabs are real `role="tab"` buttons: click / arrows scroll to the job.
  Phones/tablets/no-JS: four jobs stacked (mockup, then title + text) like Framer mobile.
- Job 2–4 mockups (Schedule / Verify / Follow up) are not in Figma – rebuilt from the Framer DOM (exact px).
- All mockups are drawn on an 828×520 canvas and scaled with a ResizeObserver (`--s`) to the column; without JS the
  canvas is clipped (overflow hidden) so the page never scrolls sideways.
- Bento cards: grid is 1424 wide (8px from the page edge at 1440) like Figma; max-width 1424 above.
  Compositions scale to 0.8–0.85 on narrow cards (Framer also scales them).
- Integrations: two marquee rows, 3 copies each (like Figma), row 1 left / row 2 right at 40px/s (measured on Framer);
  200px edge fades. Footer link target `#integrations` is on this section.
- Avatars / hero photo downloaded from Framer (originals). Dr. Kim uses the same photo as Jess (as on Framer).
- Hero overlay: Figma's gradient frame is 962px tall on a 600px card, so the stops were rescaled to the visible 62%.

#### Animations (copied from Framer)
- Headings: per-letter pop (scale 0.1→1, overshoot 1.08, 35ms stagger); paragraphs: per-word un-blur (8px→0, 50ms stagger).
  Hero on load, everything else on scroll into view. Job titles replay on each job change.
- Job switch: mockup fades/scales 0.96→1; children scale 0.9→1, rows slide from −10px, pills pop from 0.6.
- Loops: voice bars, status dots, dashed connectors flowing, status pills nudge (Answer).
- Bento: parts rise 12px / pop from 0.6, skeleton lines grow from the left, waveform + dot loops.
- All respect reduced motion (final state shown).

#### Guessed / simplified
- Exact Framer job-switch thresholds unknown → equal quarters of the 1500px track.
- Framer conversation-card loop simplified to a small pill nudge.
- Eyebrow tile colours: Figma uses #c8defb / #bcd4f4 (sky) – shared Eyebrow "sky" is #c3dffe. Results label is #c8defb in
  Figma, white with the shared light Eyebrow.

### Security page (/security) – build notes

Files: src/pages/security.astro, src/config/pages/security.ts, src/components/security/{PageHero,SectionIntro,Standards,Privacy,Compliance}.astro, src/assets/images/security/hero.png (Framer original).
PageHero + SectionIntro are also used by /pricing.

#### Decisions
- Hero: Figma "Hero" 716 includes the 84px header → built as 632px section (600 card + 32 bottom). Overlay gradient taken from Figma (162% tall frame, clipped).
- Privacy section = Figma component set "Privacy / Step" (Protect / Limit / Record / Review). Text for the other 3 steps + card rows from the variants (498:1281/1354/1427) and Framer. Instance overrides the button to "Book a Demo" (variants say "Visit the trust center") – kept the instance text.
- Status colours: Locked/Current/On file/Ready = #0c1a2f, Allowed/Logged = brand-text #0a4fbf, Blocked = #b03f44 (from the Limit variant).
- Glass fan: 15 CSS blades (152×264, r24) rotated -84°…84° around their bottom centre – matches the Figma vector export 1:1, no image.
- Stats row: Figma middle column hugs (322px) and leaves a 51px gap before column 3 – replicated at lg.
- Tabs: real ARIA tablist (click, arrows, Home/End). All panels share one grid cell (no height jump), inactive panels visibility:hidden. Without JS the first step shows.
- Ids: #standards, #compliance (footer links), #faq (shared Faq).

#### Animations (from Framer)
- Headings: per-letter pop (scale .1 → 1, spring); paragraphs / card titles: per-word un-blur + rise 12px. Uses components/home/TextEffects.astro (data-split="chars|words").
- Tab switch: panel + card fade in and rise 8px (Framer SSR: opacity 0, translateY(8px)); inactive tabs dimmed.
- Stats "0" / "100%" count up (data-count). Fan is static on Framer too.

#### Mobile (Framer 390 / 810)
- Badges: 1 col (<640), 3+2 (640–1023), 5 (lg). Compliance cards 1/2/3 cols.
- Privacy: tabs → text → illustration (scaled .5/.58/.85) → note → stats as stacked rows.

### Pricing page (/pricing) – build notes

Files: src/pages/pricing.astro, src/config/pages/pricing.ts, src/components/pricing/{Plans,Compare,Included}.astro, src/assets/images/pricing/hero.png (Framer original). Hero + section headings reuse src/components/security/{PageHero,SectionIntro}.astro.

#### Decisions
- No monthly/yearly toggle on Framer or Figma → none built.
- Plans: equal-height cards (602px at lg). Growth = dark card; "Most popular" pill approximates the Figma multi-radial fill with 3 radial gradients.
- Compare: semantic <table> (thead plan headers, tbody per group, row headers, sr-only "Included"/"Not included"). Growth column tint rgba(200,222,251,.28), group rows cover it (as in Figma).
  Mobile (<768): the table scrolls sideways inside its rounded card (same as Framer), feature column pinned (sticky) – the page itself never scrolls sideways. Container is `relative` so sr-only text can't widen the page.
- Included: tile colours mapped to tokens (violet-tint, mint-tint, lime-tint; sky tile #c8defb as arbitrary value).
- FAQ: Figma has it on the page colour (#fcfbf8), shared Faq is bg-canvas-2 → overridden from the page with a wrapper `[&>section]:bg-canvas` (see shared change request).
- FAQ description: Figma "…every location gets" → used Framer's version with a full stop.

#### Animations (from Framer)
- Letter pop on headings, word un-blur on paragraphs / feature lists / card copy (TextEffects).
- Plan prices count up from $0 (Framer shows "$0" before view) via data-count.

### About page – build notes

Route `/about`. Figma frame `372:14233` ("Final design"). Framer: /about.

#### Sections (Figma → component)
| # | Figma | Component | Figma h | Built h (1440) |
|---|---|---|---|---|
| 01 | Hero / Content `448:1014` | `about/AboutHero.astro` | 700 | 700 |
| 02 | Story `465:20382` | `about/Story.astro` | 996 | 997 |
| 03 | Our values `465:20274` | `about/Values.astro` | 687 | 688 |
| 04 | History `432:1014` | `about/History.astro` | 976 | 977 |
| 05 | Trusted by `431:1140` | `about/TrustedBy.astro` | 468 | 469 |
| 06 | Press `431:1170` | `about/Press.astro` | 969 | 971 |
| 07 | Frame 11 (CTA) | shared `CtaBand` | 660 | – |

#### Decisions
- **Hero heading**: Figma 88px / 1.02 / -4.5%. Browser Geist renders ~2% wider than Figma, so "The front-desk partner" wrapped at 832px. Used -5.5% tracking at lg and a 880px box so the two lines match Figma.
- **Hero mesh**: the five Figma radial fills converted to CSS radial-gradients (centres/radii computed from gradientTransform).
- **Story photo crop**: Figma zooms the wide photo (1106×829 at -143,-25 in an 820×460 frame) – reproduced at ≥1024px; below that plain object-cover (as Framer).
- **History**: dial = 59 ticks every 4° (r 400–428, centre at section y = -50), opacity fade from the Figma export, extrapolated for the ticks that are off-canvas in Figma. Blue needle stays with the dial (as Framer). Track slides 364px (card + 24 gap) per step, dial turns -4° per step (Framer measurements: matrix(0.9976,-0.0698…) per step). Autoplay every 3s (Framer), wraps around; pauses on hover over cards / focus, off-screen and with reduced motion. Prev/next wrap. Touch swipe. Card body text needed -0.01em tracking so "The idea" fits 3 lines like Figma (otherwise card grows; cards are min-h 312 and grow with content instead of clipping).
- Far cards (more than 1 step from the centre) dim their progress meter to 50% (Figma). Framer dims the whole card to 0.88/0.95 – not copied (Figma wins for static look).
- **Press**: shows the newest blog posts (content collection), 3 per page, page buttons only when JS runs and there is more than one page (8 posts → 3 pages; Figma shows 5 dummy buttons). Framer shows the same 3 newest posts (no pagination). Avatar photo if the post has one, else initials on a #c8defb circle (Figma).
- **Trusted by**: 6 columns ≥1024, 3 at sm, 2 on mobile (Framer).
- Values: 4 columns ≥1024, 2 at sm, 1 on mobile (Framer).

#### Animations (from Framer)
- Headings (hero h1, history card titles, press card titles): per-letter pop – scale 0.1→1.08→1, opacity 0→1, 0.03s apart (0.015s for press titles). Hero plays on load, others in view.
- Paragraphs (hero description, story paragraphs): per-word un-blur – blur 8px→0, y 12→0, 0.025–0.03s apart.
- Hero buttons: fade-up (`hero-reveal`, 0.6s delay).
- Text split happens at build time (`about/SplitText.astro`), so there is no layout shift; screen readers read an sr-only copy.
- Framer also word-animates some random card texts ("Staff stay in charge", 3 clinic tiles) – looked like accidents, skipped.

#### Open
- Home has its own runtime `TextEffects.astro` doing the same effect – worth merging into one shared component later.

### Blog + blog post – decisions

- 8 posts in src/content/blog/*.mdx (slugs = Framer). Only the dermatology post has full text on Framer; the other 7 bodies were written for the template (same structure: intro, ## sections, check list, <Quote>, sometimes <Stats>).
- Schema: added optional `subtitle` (post-hero intro; Figma hero text differs from the card excerpt). Falls back to `excerpt`.
- Avatars: only Priya Shah has a photo (as in Figma); everyone else shows initials (Framer had photos for all – Figma wins).
- Covers: Framer images (one per post). Figma reused the dermatology photo for "Fill same-day…" – Framer has its own photo, used that.
- Hero: 2 newest `featured: true` posts. Grid "All" hides featured posts (as Framer); a category tab shows all posts of that category.
- "Load more posts": page size 6, shown only when more posts match. With 8 posts / 2 featured it is hidden → Posts section 1522 vs Figma 1621 (button + gap = 100px).
- Filter chips are toggle buttons (aria-pressed) in a role=group.
- Newsletter: client-side email validation + thank-you message, TODO for the real provider.
- Post page: sticky aside (TOC with scroll-spy via TocSpy.astro, share LinkedIn/X/copy-link, author). Mobile: TOC hidden, share + author above the article (Framer mobile).
- Related: same category first, then newest; 3 per page with the Figma pagination (pages = ceil(others/3), max 5). Figma shows 5 pages – sample.
- Row layouts of blog hero switch at xl (1280) – at 1024 the 368+808 columns don't fit.
- Text effects: reuses src/components/home/TextEffects.astro (data-split chars/words) – same Framer effect on every page.

### Book a demo – decisions
- Mesh background: Figma's 5 radial gradients converted to CSS (src/components/demo/mesh.ts) – also used by the legal headers.
- Form: labels, required fields, inline errors (aria-invalid + aria-describedby), sr-only alert summary, focus first invalid field; success panel gets focus; "Send another request" resets. Phone needs ≥7 digits. TODO for a real endpoint – no third-party keys.
- Select options from Framer (1 location / 2–5 / 6–20 / 20+).
- Two-column layout from xl (1280); stacked below (Framer mobile order: intro, logos, form). Logo badges 2 columns on mobile, 4 from sm.
- Error red #b42318 is a one-off colour (no token).

### Legal + 404 – decisions
- privacy.mdx / terms.mdx: text from Framer. privacy@halden.health → privacy@example.com (mailto link).
- One layout: src/components/legal/LegalPage.astro (hero + sticky Contents with scroll-spy + MDX). Section ids are MDX heading slugs (#your-rights-and-choices works).
- Mobile: Contents card above the text, not sticky (Framer mobile).
- 404: noindex, gradient "404" (aria-hidden), h1 = "This page missed its appointment". Text in src/config/pages/not-found.ts.

## Final QA fixes
- **Text effects:** one shared runtime letter/word splitter (`src/components/ui/TextEffects.astro`, `data-split`). About (`SplitText`, split at build time) and Platform (`TextFx`, manual/auto triggers for the scroll-driven jobs) keep their own variants because they need extra options.
- Split headings use `font-kerning: none` from the first paint so the width and line breaks never change when the letters are split (no layout shift). Underlines inside split text are inherited by the letter spans.
- The Geist font file is preloaded so the first paint already uses it (no re-wrap when it loads).
- Greyed-out calendar slots in the product mockups use #656e78 instead of Figma's #a3abb3 to pass WCAG AA (4.5:1).
- Blog hero cards use `h2` (they sit right under the page `h1`); grid cards use `h3`.

## Round 2 (motion + width pass)
- Header hides on scroll down and shows on scroll up (Framer: 320ms, ease 0.22/1/0.36/1). Footer is full width with 96px sides (as Framer); identical to Figma at 1440.
- Hero cards (Home, Platform, Security, Pricing) span the viewport with 32px margins above 1440, like Framer. Home hero: text and flow diagram share one centred 1248px column; full diagram from 1024px, compact animated call-card visual below.
- Section headings are 34px on phones (Framer) → 54px at 1440 (Figma).
- "Live Demo" buttons use `siteConfig.liveDemo` (external link, new tab).
- Every page got Framer's load/scroll timings plus extra hover interactions (card lifts, image zooms, sliding tab indicators, pointer glows). All of it is off with reduced motion.
- Hover effects only run on devices that can hover (`@media (hover: hover)`), and keyboard focus gets the same highlight.
