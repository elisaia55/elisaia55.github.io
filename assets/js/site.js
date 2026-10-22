(function () {
  "use strict";

  document.documentElement.classList.add("js");

  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("nav-links");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /**
   * Header background once the page scrolls
   */
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /**
   * Mobile menu
   */
  const setMenu = (open) => {
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    toggle.querySelector("i").className = open ? "bi bi-x-lg" : "bi bi-list";
  };

  toggle.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenu(false);
  });

  /**
   * Highlight the nav link for the section in view
   */
  const links = new Map(
    [...nav.querySelectorAll('a[href^="#"]')].map((a) => [a.getAttribute("href").slice(1), a])
  );

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) => a.classList.remove("active"));
        const link = links.get(entry.target.id);
        if (link) link.classList.add("active");
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );

  document.querySelectorAll("main section[id]").forEach((s) => sectionObserver.observe(s));

  /**
   * Fade sections in as they scroll into view
   */
  document.querySelectorAll("[data-stagger]").forEach((group) => {
    [...group.children].forEach((child, i) => child.style.setProperty("--i", i));
  });

  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8% 0px" }
  );

  document.querySelectorAll(".reveal, [data-stagger]").forEach((el) => revealObserver.observe(el));

  /**
   * Count up the hero stats once the intro has played
   */
  const countUp = (el) => {
    const end = Number(el.dataset.count);
    const duration = 1600;
    const start = performance.now();

    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 4);
      el.textContent = Math.round(end * eased).toLocaleString();
      if (t < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  document.querySelectorAll("[data-count]").forEach((el) => {
    el.textContent = reduceMotion ? Number(el.dataset.count).toLocaleString() : "0";
    if (!reduceMotion) setTimeout(() => countUp(el), 800);
  });

  /**
   * Tech marquee: duplicate the list so it loops seamlessly
   */
  const track = document.querySelector(".marquee-track");
  if (track) {
    [...track.children].forEach((li) => {
      const clone = li.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      track.appendChild(clone);
    });
  }

  /**
   * Scroll-linked effects: progress bar and timeline line
   */
  const root = document.documentElement;
  const timeline = document.querySelector(".timeline");
  const timelineFill = document.querySelector(".timeline-track span");
  const roles = [...document.querySelectorAll(".role")];

  const onScrollFx = () => {
    const max = root.scrollHeight - window.innerHeight;
    root.style.setProperty("--progress", max > 0 ? window.scrollY / max : 0);

    if (timeline) {
      const box = timeline.getBoundingClientRect();
      const mark = window.innerHeight * 0.6;
      const fill = Math.min(Math.max((mark - box.top) / box.height, 0), 1);
      timelineFill.style.setProperty("--fill", fill);
      roles.forEach((role) => role.classList.toggle("lit", role.getBoundingClientRect().top + 43 < mark));
    }
  };

  let scrollQueued = false;
  window.addEventListener(
    "scroll",
    () => {
      if (scrollQueued) return;
      scrollQueued = true;
      requestAnimationFrame(() => {
        onScrollFx();
        scrollQueued = false;
      });
    },
    { passive: true }
  );
  onScrollFx();

  /**
   * Pointer effects (desktop only): cursor spotlight, card glow, portrait tilt
   */
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (finePointer && !reduceMotion) {
    const spotlight = document.querySelector(".spotlight");
    let px = 0;
    let py = 0;
    let pointerQueued = false;

    window.addEventListener(
      "pointermove",
      (e) => {
        px = e.clientX;
        py = e.clientY;
        if (pointerQueued) return;
        pointerQueued = true;
        requestAnimationFrame(() => {
          spotlight.style.setProperty("--x", px + "px");
          spotlight.style.setProperty("--y", py + "px");
          pointerQueued = false;
        });
      },
      { passive: true }
    );

    document.querySelectorAll(".glow").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", e.clientX - r.left + "px");
        card.style.setProperty("--my", e.clientY - r.top + "px");
      });
    });

    const portrait = document.querySelector(".hero-portrait");
    const hero = document.querySelector(".hero");
    if (portrait && hero) {
      hero.addEventListener("pointermove", (e) => {
        const r = portrait.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / window.innerWidth;
        const dy = (e.clientY - (r.top + r.height / 2)) / window.innerHeight;
        portrait.style.setProperty("--ry", (dx * 14).toFixed(2) + "deg");
        portrait.style.setProperty("--rx", (-dy * 14).toFixed(2) + "deg");
      });
      hero.addEventListener("pointerleave", () => {
        portrait.style.setProperty("--rx", "0deg");
        portrait.style.setProperty("--ry", "0deg");
      });
    }
  }

  document.getElementById("year").textContent = new Date().getFullYear();
})();
