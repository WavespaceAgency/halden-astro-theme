import { cn } from "./utils";

export type ButtonVariant = "primary" | "dark" | "outline" | "glass" | "light";
export type ButtonSize = "sm" | "md" | "lg" | "xl";

const base =
  "inline-flex shrink-0 items-center justify-center gap-2.5 rounded-button font-medium whitespace-nowrap transition-[color,background-color,box-shadow,transform] duration-150 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:pointer-events-none disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
  /** Blue – main action on dark and light backgrounds (Figma "Book a demo", hero). */
  primary: "bg-brand text-white shadow-brand hover:bg-brand-hover",
  /** Navy – header button. */
  dark: "bg-ink-2 text-canvas hover:bg-ink-2/85",
  /** Thin border on light backgrounds. */
  outline: "border border-line bg-surface text-ink hover:bg-canvas-2",
  /** Frosted outline on dark backgrounds (Figma "Live Demo"). */
  glass: "border border-white/30 bg-white/10 text-white backdrop-blur-md hover:bg-white/15",
  /** White on dark or coloured backgrounds. */
  light: "bg-surface text-ink hover:bg-canvas-2",
};

const sizes: Record<ButtonSize, string> = {
  sm: "min-h-10 px-4 text-sm",
  /** 44px – header (Figma: 12/18 padding, 15px text). */
  md: "min-h-11 px-[18px] text-[15px] leading-5",
  /** 52px – hero and CTA buttons (Figma: 16/24 padding, 17px text). */
  lg: "min-h-[52px] px-6 text-[17px] leading-6",
  /** 52px with 16px text (Figma CTA, "Load more", "View all", 404 buttons). */
  xl: "min-h-[52px] px-6 text-base leading-6",
};

/** Button classes – use on <a>, <button> or anything that should look like a button. */
export function buttonClasses({
  variant = "primary",
  size = "md",
  className,
}: { variant?: ButtonVariant; size?: ButtonSize; className?: string } = {}) {
  return cn(base, variants[variant], sizes[size], className);
}
