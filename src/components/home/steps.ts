/**
 * Scroll-driven tabs for the home page ("How it works", "Security"), like the Framer site.
 *
 * Markup (inside the section passed in):
 *   [data-steps-track]   wrapper that gets extra height in scroll mode
 *   [data-steps-stage]   the part that sticks (CSS gives it `position: sticky` + `top`)
 *   [role=tab]           one button per step, in order (aria-controls → the panel id)
 *   [data-step="0..n"]   anything that belongs to a step; gets `data-active` when it is the current one
 *   [data-step-panel]    the step's tab panel (gets role="tabpanel" in tab mode)
 *
 * Modes (set as attributes on the section, styled in the component):
 *   data-tabs    desktop (1024px+): tabs visible, one step at a time
 *   data-scroll  desktop + motion allowed: the stage sticks and steps switch every `step` px of scroll
 *   (none)       phones/tablets: everything stacked; each step animates in when scrolled into view
 *                (with `tabsOnMobile` the tabs are used on every width instead)
 */
import { reduceMotion } from "@/scripts/motion";

export function initSteps(section: HTMLElement, step = 500, { tabsOnMobile = false } = {}) {
  const track = section.querySelector<HTMLElement>("[data-steps-track]");
  const stage = section.querySelector<HTMLElement>("[data-steps-stage]");
  const tabs = Array.from(section.querySelectorAll<HTMLButtonElement>("[role=tab]"));
  const parts = Array.from(section.querySelectorAll<HTMLElement>("[data-step]"));
  const panels = Array.from(section.querySelectorAll<HTMLElement>("[data-step-panel]"));
  const labels = panels.map((p) => p.getAttribute("aria-labelledby"));
  if (!track || !stage || !tabs.length) return;
  const desktop = window.matchMedia("(min-width: 1024px)");
  let active = 0;

  const select = (i: number, focus = false) => {
    active = i;
    tabs.forEach((tab, t) => {
      tab.setAttribute("aria-selected", String(t === i));
      tab.tabIndex = t === i ? 0 : -1;
    });
    parts.forEach((el) => el.toggleAttribute("data-active", Number(el.dataset.step) === i));
    if (focus) tabs[i].focus();
  };

  const stickyTop = () => parseFloat(getComputedStyle(stage).top) || 0;
  /** Scroll distance since the stage started sticking. */
  const progress = () => stickyTop() - (track.getBoundingClientRect().top + (parseFloat(getComputedStyle(track).paddingTop) || 0));
  const scrollMode = () => section.hasAttribute("data-scroll");

  const onScroll = () => {
    if (!scrollMode()) return;
    const i = Math.max(0, Math.min(tabs.length - 1, Math.floor((progress() + step / 2) / step)));
    if (i !== active) select(i);
  };

  const go = (i: number, focus = false) => {
    if (scrollMode()) window.scrollTo({ top: window.scrollY - progress() + i * step + 1, behavior: "smooth" });
    select(i, focus);
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => go(i));
    tab.addEventListener("keydown", (e) => {
      const keys: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
      let next = -1;
      if (e.key in keys) next = (i + keys[e.key] + tabs.length) % tabs.length;
      if (e.key === "Home") next = 0;
      if (e.key === "End") next = tabs.length - 1;
      if (next < 0) return;
      e.preventDefault();
      go(next, true);
    });
  });

  // Stacked layout: animate each step when it scrolls into view.
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) if (e.isIntersecting && !desktop.matches) e.target.setAttribute("data-active", "");
    },
    { threshold: 0.3 },
  );

  const setMode = () => {
    if (desktop.matches || tabsOnMobile) {
      io.disconnect();
      section.setAttribute("data-tabs", "");
      section.toggleAttribute("data-scroll", desktop.matches && !reduceMotion());
      panels.forEach((p, i) => {
        p.setAttribute("role", "tabpanel");
        p.setAttribute("aria-labelledby", tabs[i].id);
      });
      select(active);
      onScroll();
    } else {
      section.removeAttribute("data-tabs");
      section.removeAttribute("data-scroll");
      panels.forEach((p, i) => {
        p.removeAttribute("role");
        const label = labels[i];
        if (label) p.setAttribute("aria-labelledby", label);
        else p.removeAttribute("aria-labelledby");
      });
      parts.forEach((el) => {
        el.removeAttribute("data-active");
        io.observe(el);
      });
    }
  };
  setMode();
  desktop.addEventListener("change", setMode);
  window.addEventListener("scroll", onScroll, { passive: true });
}
