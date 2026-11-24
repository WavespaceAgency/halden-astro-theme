/**
 * Smooth (eased) mouse-wheel scrolling with Lenis. Touch scrolling stays native.
 * Off when the visitor prefers reduced motion. The real page scroll position is used,
 * so sticky sections, scroll-linked animations and anchors keep working.
 * Other scripts can pause it with window events: "scroll-lock" / "scroll-unlock".
 */
import Lenis from "lenis";
import "lenis/dist/lenis.css";

const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
let instance: Lenis | null = null;

/** Scroll the page to `y` px – eased with Lenis when it runs, native otherwise. */
export function scrollToY(y: number) {
  if (instance) instance.scrollTo(y, { duration: 1.1 });
  else window.scrollTo({ top: y, behavior: reduce.matches ? "auto" : "smooth" });
}

if (!reduce.matches) {
  const lenis = new Lenis({
    lerp: 0.1,
    wheelMultiplier: 1,
    anchors: { offset: -88 },
    autoRaf: true,
  });
  instance = lenis;

  window.addEventListener("scroll-lock", () => {
    lenis.stop();
    document.documentElement.style.overflow = "hidden";
  });
  window.addEventListener("scroll-unlock", () => {
    document.documentElement.style.overflow = "";
    lenis.start();
  });
  reduce.addEventListener("change", (e) => {
    if (!e.matches) return;
    lenis.destroy();
    instance = null;
  });
} else {
  window.addEventListener("scroll-lock", () => (document.documentElement.style.overflow = "hidden"));
  window.addEventListener("scroll-unlock", () => (document.documentElement.style.overflow = ""));
}
