/**
 * Site-wide scroll reveals – plain JavaScript, no library.
 *
 * Use them with data attributes – no JavaScript needed in components:
 *   <div data-reveal>                   fade + rise once in view
 *   <div data-reveal style="--delay: 0.2s">   start later
 *   <ul data-stagger>                   direct children appear one by one (0.08s apart)
 *   <span data-count="412">412</span>   counts up when in view (keeps prefix/suffix, e.g. "$12k", "94%")
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

init();
