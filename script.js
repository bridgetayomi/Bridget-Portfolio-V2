// ============================================================================
// Shared interactivity for the portfolio (index + project pages)
// ============================================================================

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initReveals();
  initChecklist();
  initHeroLog();
  initCopyEmail();
  initBackToTop();
  initFooterYear();
});

/* ---------------------------------------------------------------------- */
/* Nav: scroll shadow, mobile toggle, active-link tracking                */
/* ---------------------------------------------------------------------- */
function initNav() {
  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav__toggle");
  const links = document.querySelector(".nav__links");

  if (nav) {
    const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const isOpen = links.classList.toggle("is-open");
      toggle.classList.toggle("is-open", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    links.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        links.classList.remove("is-open");
        toggle.classList.remove("is-open");
        document.body.style.overflow = "";
      });
    });
  }

  // Highlight the nav link matching the section currently in view
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav__links a");
  if (sections.length && navLinks.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            navLinks.forEach((link) => {
              link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
            });
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((section) => observer.observe(section));
  }
}

/* ---------------------------------------------------------------------- */
/* Scroll reveal animations                                               */
/* ---------------------------------------------------------------------- */
function initReveals() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  items.forEach((item) => observer.observe(item));
}

/* ---------------------------------------------------------------------- */
/* "What I can do now" checklist — checks itself off as it enters view    */
/* ---------------------------------------------------------------------- */
function initChecklist() {
  const list = document.querySelector(".checklist");
  if (!list) return;
  const items = list.querySelectorAll("li");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          items.forEach((li, i) => {
            setTimeout(() => li.classList.add("is-checked"), i * 160);
          });
          observer.disconnect();
        }
      });
    },
    { threshold: 0.4 }
  );

  observer.observe(list);
}

/* ---------------------------------------------------------------------- */
/* Hero "log" line — types out rotating status lines                      */
/* ---------------------------------------------------------------------- */
function initHeroLog() {
  const el = document.querySelector("[data-hero-log]");
  if (!el) return;

  let lines;
  try {
    lines = JSON.parse(el.getAttribute("data-hero-log"));
  } catch (e) {
    lines = null;
  }
  if (!lines || !lines.length) return;

  const textNode = document.createElement("span");
  const cursor = document.createElement("span");
  cursor.className = "cursor";
  el.textContent = "";
  el.append(textNode, cursor);

  let lineIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function tick() {
    const current = lines[lineIndex];

    if (!deleting) {
      charIndex++;
      textNode.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(tick, 1400);
        return;
      }
    } else {
      charIndex--;
      textNode.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        lineIndex = (lineIndex + 1) % lines.length;
      }
    }
    setTimeout(tick, deleting ? 22 : 38);
  }

  tick();
}

/* ---------------------------------------------------------------------- */
/* Copy email to clipboard                                                */
/* ---------------------------------------------------------------------- */
function initCopyEmail() {
  const button = document.querySelector("[data-copy-email]");
  if (!button) return;
  const feedback = document.querySelector("[data-copy-feedback]");
  const email = button.getAttribute("data-copy-email");

  button.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(email);
    } catch (err) {
      // Clipboard API unavailable — fall back silently, mailto still works via href
    }
    if (feedback) {
      feedback.classList.add("is-visible");
      setTimeout(() => feedback.classList.remove("is-visible"), 2200);
    }
  });
}

/* ---------------------------------------------------------------------- */
/* Back to top                                                            */
/* ---------------------------------------------------------------------- */
function initBackToTop() {
  const button = document.querySelector("[data-back-to-top]");
  if (!button) return;
  button.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ---------------------------------------------------------------------- */
/* Footer year                                                            */
/* ---------------------------------------------------------------------- */
function initFooterYear() {
  const el = document.querySelector("[data-year]");
  if (el) el.textContent = new Date().getFullYear();
}