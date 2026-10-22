(function () {
  "use strict";

  document.documentElement.classList.add("js");

  const root = document.documentElement;
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("nav-links");

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
  document.addEventListener("click", (e) => {
    if (nav.classList.contains("open") && !header.contains(e.target)) setMenu(false);
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
   * Reveal content as it scrolls into view
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
    { rootMargin: "0px 0px -10% 0px" }
  );

  document.querySelectorAll(".reveal, [data-stagger]").forEach((el) => revealObserver.observe(el));

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
   * Scroll: header pill and progress bar
   */
  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 24);
    const max = root.scrollHeight - window.innerHeight;
    root.style.setProperty("--progress", max > 0 ? window.scrollY / max : 0);
  };

  let scrollQueued = false;
  window.addEventListener(
    "scroll",
    () => {
      if (scrollQueued) return;
      scrollQueued = true;
      requestAnimationFrame(() => {
        onScroll();
        scrollQueued = false;
      });
    },
    { passive: true }
  );
  onScroll();

  /**
   * Copy email to clipboard
   */
  const status = document.querySelector(".copy-status");
  document.querySelectorAll("[data-copy]").forEach((btn) => {
    const label = btn.querySelector("span");
    const icon = btn.querySelector("i");
    let timer;

    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
      } catch {
        window.location.href = "mailto:" + btn.dataset.copy;
        return;
      }
      btn.classList.add("copied");
      label.textContent = "Copied";
      icon.className = "bi bi-check2";
      if (status) status.textContent = "Email copied. Talk soon.";

      clearTimeout(timer);
      timer = setTimeout(() => {
        btn.classList.remove("copied");
        label.textContent = "Copy";
        icon.className = "bi bi-clipboard";
        if (status) status.textContent = "";
      }, 2400);
    });
  });

  /**
   * Local time in the Bay Area
   */
  const clock = document.getElementById("local-time");
  if (clock) {
    const fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Los_Angeles",
      hour: "numeric",
      minute: "2-digit",
    });
    const tick = () => {
      const now = new Date();
      clock.textContent = fmt.format(now);
      clock.dateTime = now.toISOString();
    };
    tick();
    setInterval(tick, 15000);
  }

  document.getElementById("year").textContent = new Date().getFullYear();
})();
