/**
 * Site-wide scroll reveals – plain JavaScript, no library.
 *
 * Use them with data attributes – no JavaScript needed in components:
 *   <div data-reveal>                   fade + rise once in view
 *   <div data-reveal style="--delay: 0.2s">   start later
 *   <ul data-stagger>                   direct children appear one by one (0.08s apart)
 *   <span data-count="412">412</span>   counts up when in view (keeps prefix/suffix, e.g. "$12k", "94%")
 *   Icons (SVGs up to 96px in <main> and <footer>) draw their strokes and pop their dots in when
 *   they scroll into view. Opt out with data-no-draw on the svg or any parent.
 *
 * The start state lives in global.css (only when JS runs and motion is allowed),
 * so content is always visible without JavaScript or with "reduce motion".
 */

export const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function countUp(el: HTMLElement) {
  const target = el.dataset.count ?? el.textContent ?? "";
  const match = target.match(/^(\D*)([\d,.]+)(.*)$/);
  if (!match || reduceMotion()) return;
  const [, prefix, digits, suffix] = match;
  const end = Number.parseFloat(digits.replace(/,/g, ""));
  const decimals = digits.includes(".") ? digits.split(".")[1].length : 0;
  const start = performance.now();
  const duration = 1400;
  const tick = (now: number) => {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    const value = (end * eased).toFixed(decimals);
    el.textContent = `${prefix}${digits.includes(",") ? Number(value).toLocaleString("en-US") : value}${suffix}`;
    if (t < 1) requestAnimationFrame(tick);
    else el.textContent = target;
  };
  requestAnimationFrame(tick);
}

function init() {
  document.querySelectorAll<HTMLElement>("[data-stagger]").forEach((list) => {
    Array.from(list.children).forEach((child, i) => {
      const item = child as HTMLElement;
      if (!item.style.getPropertyValue("--delay")) item.style.setProperty("--delay", `${i * 0.08}s`);
    });
  });

  const targets = document.querySelectorAll<HTMLElement>("[data-reveal], [data-stagger], [data-count]");
  if (!("IntersectionObserver" in window)) {
    targets.forEach((el) => el.setAttribute("data-revealed", ""));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        el.setAttribute("data-revealed", "");
        if (el.dataset.count !== undefined) countUp(el);
        io.unobserve(el);
      }
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
  );
  targets.forEach((el) => io.observe(el));
}

const SHAPES = "path, line, polyline, polygon, circle, ellipse, rect";

/** Stroke "draw-in" + fill "pop" for icons that start below the fold. */
function initIconDraw() {
  if (reduceMotion() || !("IntersectionObserver" in window)) return;
  const fold = window.innerHeight;
  const icons = [...document.querySelectorAll<SVGSVGElement>("main svg, footer svg")].filter((svg) => {
    if (svg.closest("[data-no-draw], [hidden], [data-split]")) return false;
    const r = svg.getBoundingClientRect();
    if (!r.width || r.width > 96 || r.height > 96) return false;
    if (r.top + window.scrollY < fold) return false; // visible on load: leave it alone
    return svg.getAnimations({ subtree: true }).length === 0;
  });

  const prepared = new Map<SVGSVGElement, { strokes: SVGGeometryElement[]; fills: SVGGeometryElement[] }>();
  for (const svg of icons) {
    const strokes: SVGGeometryElement[] = [];
    const fills: SVGGeometryElement[] = [];
    svg.querySelectorAll<SVGGeometryElement>(SHAPES).forEach((el) => {
      const cs = getComputedStyle(el);
      const stroked = cs.stroke !== "none" && parseFloat(cs.strokeWidth) > 0;
      if (stroked && cs.strokeDasharray === "none") strokes.push(el);
      else if (!stroked && cs.fill !== "none" && el.tagName !== "rect") fills.push(el);
    });
    if (!strokes.length && !fills.length) continue;
    strokes.forEach((el) => {
      el.setAttribute("pathLength", "1");
      el.style.strokeDasharray = "1";
      el.style.strokeDashoffset = "1";
    });
    fills.forEach((el) => {
      el.style.transformBox = "fill-box";
      el.style.transformOrigin = "center";
      el.style.opacity = "0";
      el.style.scale = "0.4";
    });
    prepared.set(svg, { strokes, fills });
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const svg = entry.target as SVGSVGElement;
        io.unobserve(svg);
        const parts = prepared.get(svg);
        if (!parts) continue;
        parts.strokes.forEach((el, i) => {
          const a = el.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], {
            duration: 900,
            delay: 120 + i * 70,
            easing: "cubic-bezier(0.65, 0, 0.35, 1)",
            fill: "forwards",
          });
          a.onfinish = () => {
            a.cancel();
            el.style.strokeDasharray = "";
            el.style.strokeDashoffset = "";
            el.removeAttribute("pathLength");
          };
        });
        parts.fills.forEach((el, i) => {
          const a = el.animate([{ opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1 }], {
            duration: 650,
            delay: 380 + i * 60,
            easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
            fill: "forwards",
          });
          a.onfinish = () => {
            a.cancel();
            el.style.opacity = "";
            el.style.scale = "";
          };
        });
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.6 },
  );
  prepared.forEach((_, svg) => io.observe(svg));
}

init();
// After layout settles (fonts, images) so sizes and positions are right.
window.addEventListener("load", () => requestAnimationFrame(initIconDraw), { once: true });
