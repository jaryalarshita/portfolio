// ---------- Helpers ----------
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------- Hero title: split into words that slide up ----------
$$("[data-split]").forEach((el) => {
  const words = el.textContent.trim().split(/\s+/);
  el.setAttribute("aria-label", words.join(" "));
  el.innerHTML = words
    .map((w, i) => `<span class="word" aria-hidden="true"><span style="--i:${i}">${w}</span></span>`)
    .join(" ");
});

// ---------- Scroll reveal ----------
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);
$$(".reveal").forEach((el) => revealObserver.observe(el));

// ---------- Stats: count up from 0 when they scroll into view ----------
const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      countObserver.unobserve(entry.target);
      const el = entry.target;
      const end = parseFloat(el.dataset.count);
      const decimals = parseInt(el.dataset.decimals || "0", 10);
      const duration = 1600;
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 4);
        el.textContent = (end * eased).toFixed(decimals);
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  },
  { threshold: 0.6 }
);
if (!reduceMotion) $$("[data-count]").forEach((el) => countObserver.observe(el));

// ---------- Nav: background on scroll + progress bar ----------
const nav = $(".nav");
const progress = $(".progress");
const onScroll = () => {
  const y = window.scrollY;
  nav.classList.toggle("scrolled", y > 10);
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
};
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// ---------- Nav: highlight the section you're looking at ----------
const navLinks = $$(".nav__links a");
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((a) =>
        a.classList.toggle("active", a.getAttribute("href") === `#${entry.target.id}`)
      );
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);
$$("section[id]").forEach((s) => sectionObserver.observe(s));

// ---------- Mobile menu ----------
const menuBtn = $("#menu-toggle");
const linksPanel = $("#nav-links");
const setMenu = (open) => {
  menuBtn.setAttribute("aria-expanded", String(open));
  menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  linksPanel.classList.toggle("open", open);
};
menuBtn.addEventListener("click", () => setMenu(menuBtn.getAttribute("aria-expanded") !== "true"));
navLinks.forEach((a) => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));

// ---------- Theme toggle with a circular reveal ----------
const root = document.documentElement;
const themeBtn = $("#theme-toggle");
const applyTheme = (theme) => {
  root.setAttribute("data-theme", theme);
  try { localStorage.setItem("theme", theme); } catch (e) {}
};
themeBtn.addEventListener("click", (e) => {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  if (!document.startViewTransition || reduceMotion) return applyTheme(next);

  // Start the circle from the click point (or the button's center for keyboard users)
  const rect = themeBtn.getBoundingClientRect();
  const x = e.clientX || rect.left + rect.width / 2;
  const y = e.clientY || rect.top + rect.height / 2;
  const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

  document.startViewTransition(() => applyTheme(next)).ready.then(() => {
    root.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
      { duration: 650, easing: "cubic-bezier(.22,1,.36,1)", pseudoElement: "::view-transition-new(root)" }
    );
  });
});

// ---------- Project cards: spotlight follows the cursor ----------
$$(".card").forEach((card) => {
  card.addEventListener("pointermove", (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty("--x", `${e.clientX - r.left}px`);
    card.style.setProperty("--y", `${e.clientY - r.top}px`);
  });
});

// ---------- Copy email button ----------
const copyBtn = $("#copy-email");
if (copyBtn) {
  const label = $(".copy-label", copyBtn);
  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(copyBtn.dataset.email);
      label.textContent = "Copied ✓";
    } catch {
      label.textContent = copyBtn.dataset.email;
    }
    setTimeout(() => (label.textContent = "Copy email"), 2000);
  });
}

// ---------- Footer year ----------
$("#year").textContent = new Date().getFullYear();
