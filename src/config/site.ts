/**
 * Site-wide settings.
 * ------------------------------------------------------------
 * Edit this file to rebrand the template: name, URL, navigation,
 * footer links, social profiles and the main call to action.
 * Page text lives in src/config/pages/*.ts.
 */

export type NavLink = {
  label: string;
  href: string;
};

export type FooterColumn = { title: string; links: NavLink[] };

const year = new Date().getFullYear();
const name = "Halden";
const legalName = "Halden Health, Inc.";

export const siteConfig = {
  name,
  legalName,
  /** Public URL – set `site` in astro.config.mjs (or the SITE_URL env var). */
  url: (import.meta.env.SITE ?? "https://example.com").replace(/\/$/, ""),
  /** Default title for the home page and pages without their own title. */
  title: "Halden – AI front desk for clinics",
  description:
    "Halden is an AI front desk for clinics: it answers, triages and books every patient call, text and web chat, then writes it straight into your clinic's systems.",
  email: "hello@example.com",
  locale: "en_US",

  /** Main call to action, used in the header and mobile menu. */
  cta: { label: "Book a demo", href: "/book-a-demo" },

  /** "Live Demo" buttons (hero, about, closing CTA band). An external link opens in a new tab. */
  liveDemo: { label: "Live Demo", href: "https://halden-web-dashboard.vercel.app/" },

  nav: {
    /** Header links. */
    main: [
      { label: "Platform", href: "/platform" },
      { label: "Security", href: "/security" },
      { label: "Pricing", href: "/pricing" },
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
    ],
    /** Links in the "Pages" dropdown – every page in the template. */
    pages: [
      { label: "Home", href: "/" },
      { label: "Platform", href: "/platform" },
      { label: "Security", href: "/security" },
      { label: "Pricing", href: "/pricing" },
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Blog post", href: "/blog/how-a-dermatology-clinic-stopped-losing-monday-mornings" },
      { label: "Book a demo", href: "/book-a-demo" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Service", href: "/terms-of-service" },
      { label: "404", href: "/404" },
    ],
    /** Label of the dropdown button in the header. */
    pagesLabel: "Pages",
  },

  footer: {
    columns: [
      {
        title: "Product",
        links: [
          { label: "Platform", href: "/platform" },
          { label: "Security", href: "/security" },
          { label: "Pricing", href: "/pricing" },
          { label: "Integrations", href: "/platform#integrations" },
        ],
      },
      {
        title: "Company",
        links: [
          { label: "About", href: "/about" },
          { label: "Blog", href: "/blog" },
          { label: "How it works", href: "/platform" },
          { label: "Contact", href: "/book-a-demo" },
        ],
      },
      {
        title: "Compliance",
        links: [
          { label: "Trust Center", href: "/security" },
          { label: "HIPAA", href: "/security#compliance" },
          { label: "BAA", href: "/security#compliance" },
          { label: "SOC 2", href: "/security#standards" },
        ],
      },
      {
        title: "Support",
        links: [
          { label: "Help Centre", href: "mailto:hello@example.com" },
          { label: "System Status", href: "/security" },
          { label: "Book a demo", href: "/book-a-demo" },
        ],
      },
      {
        title: "Legal",
        links: [
          { label: "Privacy Policy", href: "/privacy-policy" },
          { label: "Terms of Service", href: "/terms-of-service" },
          { label: "Accessibility", href: "/privacy-policy#your-rights-and-choices" },
        ],
      },
    ] satisfies FooterColumn[],
    copyright: `© ${year} ${legalName}`,
    /** Template credit in the footer. Remove it or point it at your own studio. */
    credit: { label: "Template by Wavespace →", href: "https://www.wavespace.agency" },
  },

  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/" },
    { label: "X (Twitter)", href: "https://x.com/" },
  ] satisfies NavLink[],
} as const;

export type SiteConfig = typeof siteConfig;
