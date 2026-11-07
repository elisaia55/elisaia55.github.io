(function () {
  "use strict";

  document.documentElement.classList.add("js");

  const root = document.documentElement;
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("nav-links");

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  /**
   * Hero editor: type each line out in sequence, then run the terminal
   */
  const editor = document.querySelector(".editor");
  if (editor && !reduceMotion) {
    const PER_CHAR = 16;
    const GAP = 60;
    let t = 700;
    editor.querySelectorAll(".cl").forEach((line) => {
      const n = Math.max(line.textContent.length, 1);
      line.style.setProperty("--n", n);
      line.style.setProperty("--t", t + "ms");
      t += n * PER_CHAR + GAP;
    });
    editor.style.setProperty("--done", t + 200 + "ms");
    editor.classList.add("typing");
  }

  /**
   * Hero jersey: fill the "99" with code. The block is rendered twice
   * so the scroll loops seamlessly.
   */
  const nineCode = document.querySelector("[data-nine-code]");
  if (nineCode) {
    const SVG = "http://www.w3.org/2000/svg";
    const LINE_H = 15;
    const lines = [
      [["k", "export async function "], ["p", "ship"], ["", "(build) {"]],
      [["", "  await "], ["p", "lint"], ["", "(build);"]],
      [["", "  await "], ["p", "test"], ["", "(build, { coverage: "], ["s", "true"], ["", " });"]],
      [["k", "  for "], ["", "(const env of ["], ["s", "\"staging\", \"uat\", \"prod\""], ["", "]) {"]],
      [["", "    await "], ["p", "deploy"], ["", "(build, env);"]],
      [["", "  }"]],
      [["c", "  // same work ethic, different playbook"]],
      [["k", "  return "], ["s", "\"shipped\""], ["", ";"]],
      [["", "}"]],
      [["", ""]],
      [["k", "const "], ["p", "stack"], ["", " = ["], ["s", "\"ts\", \"react\", \"node\", \"aws\""], ["", "];"]],
      [["k", "type "], ["p", "Player"], ["", " = { pos: "], ["s", "\"DT\""], ["", "; no: 99 };"]],
      [["k", "type "], ["p", "Engineer"], ["", " = Player & { ships: true };"]],
      [["", ""]],
      [["c", "// cal poly → sf 49ers → consensus"]],
      [["k", "app"], ["", ".get("], ["s", "\"/api/plays\""], ["", ", "], ["k", "async "], ["", "(req, res) => {"]],
      [["k", "  const "], ["", "rows = "], ["k", "await "], ["", "db.query(sql);"]],
      [["", "  res.json({ rows, ok: "], ["s", "true"], ["", " });"]],
      [["", "});"]],
      [["", ""]],
      [["k", "export default function "], ["p", "Hero"], ["", "() {"]],
      [["k", "  return "], ["", "<Jersey number={"], ["s", "99"], ["", "} />;"]],
      [["", "}"]],
      [["c", "// 4th & inches. run it again."]],
      [["k", "while "], ["", "(!done) "], ["p", "grind"], ["", "();"]],
      [["k", "git "], ["", "commit -m "], ["s", "\"from the trenches\""]],
      [["k", "git "], ["", "push origin main"]],
      [["", ""]],
      [["k", "const "], ["p", "tackle"], ["", " = (bug) => bug.fix();"]],
      [["k", "await "], ["p", "Promise"], ["", ".all(prs.map(review));"]],
      [["c", "// #99 · fremont, ca"]],
      [["", ""]],
    ];
    const block = lines.length * LINE_H;
    for (let copy = 0; copy < 2; copy++) {
      // Two columns, offset by half the file, so both digits are full
      [150, 326].forEach((x, col) => {
        lines.forEach((_, i) => {
          const parts = lines[(i + col * 16) % lines.length];
          const t = document.createElementNS(SVG, "text");
          t.setAttribute("x", x);
          t.setAttribute("y", 212 + copy * block + i * LINE_H);
          parts.forEach(([cls, str]) => {
            const ts = document.createElementNS(SVG, "tspan");
            if (cls) ts.setAttribute("class", cls);
            ts.textContent = str;
            t.appendChild(ts);
          });
          nineCode.appendChild(t);
        });
      });
    }
    nineCode.style.setProperty("--scroll-h", block + "px");
    if (!reduceMotion) nineCode.classList.add("scrolling");
  }

  /**
   * Pointer effects: page spotlight, editor tilt, card spotlights
   */
  if (finePointer && !reduceMotion) {
    let pointerQueued = false;
    let px = 0;
    let py = 0;

    window.addEventListener(
      "pointermove",
      (e) => {
        px = e.clientX;
        py = e.clientY;
        if (pointerQueued) return;
        pointerQueued = true;
        requestAnimationFrame(() => {
          root.style.setProperty("--mx", px + "px");
          root.style.setProperty("--my", py + "px");
          pointerQueued = false;
        });
      },
      { passive: true }
    );

    if (editor) {
      editor.addEventListener("pointermove", (e) => {
        const r = editor.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        editor.style.setProperty("--ry", (x - 0.5) * 6 + "deg");
        editor.style.setProperty("--rx", (0.5 - y) * 6 + "deg");
        editor.style.setProperty("--gx", x * 100 + "%");
        editor.style.setProperty("--gy", y * 100 + "%");
      });
      editor.addEventListener("pointerleave", () => {
        editor.style.setProperty("--rx", "0deg");
        editor.style.setProperty("--ry", "0deg");
      });
    }

    const jersey = document.querySelector("[data-jersey]");
    if (jersey) {
      jersey.addEventListener("pointermove", (e) => {
        const r = jersey.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        jersey.style.setProperty("--ry", (x - 0.5) * 14 + "deg");
        jersey.style.setProperty("--rx", (0.5 - y) * 10 + "deg");
      });
      jersey.addEventListener("pointerleave", () => {
        jersey.style.setProperty("--rx", "0deg");
        jersey.style.setProperty("--ry", "0deg");
      });
    }

    document.querySelectorAll(".bento-card").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--x", e.clientX - r.left + "px");
        card.style.setProperty("--y", e.clientY - r.top + "px");
      });
    });
  }

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

  console.log("%c ae_ %c Thanks for reading the source. #99 says hi.", "background:#7ee7c1;color:#062b1f;font-weight:700;padding:2px 4px;border-radius:3px", "color:inherit");
})();
