/**
 * 404 page content (src/pages/404.astro).
 */
import { siteConfig } from "@/config/site";

export const notFound = {
  seo: {
    title: "Page not found",
    description: "The page you are looking for may have moved. Head back home or book a demo.",
  },
  code: "404",
  title: "This page missed its appointment",
  description: "The link may be old or the page has moved. Halden still answers every call, though.",
  primary: { label: "Back to home", href: "/" },
  secondary: { label: siteConfig.cta.label, href: siteConfig.cta.href },
};
