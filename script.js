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



/* ==========================================================================
   TESTIMONIALS PAGE — vanilla JS
   Sections:
   1. Data (edit these arrays to add/remove content — nothing else to touch)
   2. Render helpers
   3. Scroll reveal (IntersectionObserver)
   4. Card tilt (mouse position)
   5. Count-up stats
   6. Appreciation wall + lightbox
   7. Nav / misc chrome
   ========================================================================== */

/* -------------------------------------------------------------------- */
/* 1. DATA                                                               */
/* -------------------------------------------------------------------- */

// A small palette used to color the generated initials avatars.
const AVATAR_COLORS = ['#2b73c9', '#4d84b8', '#468a5c', '#e8935c', '#7a6bc4'];

const TESTIMONIALS = [
  {
    name: 'Amara Chen',
    role: 'VP of Product',
    company: 'Northlight',
    quote: "She has the rare ability to turn a messy, half-formed idea into something the whole team can rally around. Every review felt like it moved us forward, never sideways.",
    linkedin: '#'
  },
  {
    name: 'Diego Marín',
    role: 'Engineering Lead',
    company: 'Fieldnote',
    quote: "Working with her closed the usual gap between design and engineering. Specs were clear, edge cases were already thought through, and handoff never felt like a handoff.",
    linkedin: '#'
  },
  {
    name: 'Priya Anand',
    role: 'Founder',
    company: 'Loomwork',
    quote: "I've worked with a lot of designers. Few of them ask 'why' as often, or as kindly, as she does. The product is sharper for it, and so is the team.",
    linkedin: '#'
  },
  {
    name: "Sam O’Farrell",
    role: 'Design Director',
    company: 'Greenhollow',
    quote: "She mentored two juniors on my team without being asked to. That kind of generosity doesn't show up on a portfolio, but it's exactly why people want to work with her twice.",
    linkedin: '#'
  },
  {
    name: 'Keiko Tanaka',
    role: 'Head of Research',
    company: 'Northlight',
    quote: "Her instinct for what to test, and what to just decide, saved us weeks. She reads a room of stakeholders as well as she reads a usability session.",
    linkedin: '#'
  },
  {
    name: 'Michael Boateng',
    role: 'CEO',
    company: 'Fieldnote',
    quote: "We hired her for a redesign and got a partner who cared about the business as much as the pixels. Our activation rate is up 34% since launch.",
    linkedin: '#'
  }
];

// "Screenshots" for the appreciation wall. Swap `img` in for `mock: true`
// entries any time — see renderWallItem() below for how both are handled.
const WALL_NOTES = [
  { from: 'Slack · #design', text: "just wanted to say the new onboarding flow you shipped made our support tickets drop like a rock this week 🙌", float: true },
  { from: 'Text message', text: "loved working on this with you, seriously one of the smoothest projects I've been part of", float: false },
  { from: 'Email', text: "Quick note — the client called this morning specifically to compliment the prototype. Well done.", float: false },
  { from: 'Slack · DM', text: "ok the microinteractions on the checkout are so satisfying, well done 😭", float: true },
  { from: 'LinkedIn comment', text: "This case study is genuinely one of the clearest I've read all year. Bookmarking for the team.", float: false },
  { from: 'Slack · #general', text: "shoutout for staying late to fix the empty states before the demo, huge save", float: false },
  { from: 'Text message', text: "the client just said this is the best first draft they've ever seen from an agency", float: true },
  { from: 'Email', text: "Just a small thing, but thank you for actually documenting your handoff. Dev team is thrilled.", float: false }
];

const STATS_SELECTOR = '.metric-card';

/* -------------------------------------------------------------------- */
/* 2. RENDER HELPERS                                                     */
/* -------------------------------------------------------------------- */

function initials(name) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

function colorFor(name) {
  let sum = 0;
  for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
  return AVATAR_COLORS[sum % AVATAR_COLORS.length];
}

function linkedinIcon() {
  return `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5C4.98 4.88 3.9 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V23h-4V8zM8.5 8h3.8v2.05h.05c.53-1 1.83-2.05 3.77-2.05C20.5 8 22 10.2 22 14v9h-4v-8c0-1.9-.03-4.35-2.65-4.35-2.65 0-3.05 2.07-3.05 4.2V23h-4V8z"/></svg>`;
}

function quoteMarkSVG() {
  return `<svg viewBox="0 0 32 24"><path d="M13.6 0C7.2 3.6 3.2 9.2 3.2 15.6 3.2 20.4 6.4 24 10.8 24c3.6 0 6.4-2.8 6.4-6.4 0-3.2-2.4-5.6-5.6-5.6-.4 0-.8 0-1.2.1C11.2 8.4 13.6 4.8 17.2 2.4L13.6 0zm16 0c-6.4 3.6-10.4 9.2-10.4 15.6 0 4.8 3.2 8.4 7.6 8.4 3.6 0 6.4-2.8 6.4-6.4 0-3.2-2.4-5.6-5.6-5.6-.4 0-.8 0-1.2.1C27.2 8.4 29.6 4.8 33.2 2.4L29.6 0z"/></svg>`;
}

function renderTestimonialCard(t, index) {
  const card = document.createElement('article');
  card.className = 'testimonial-card reveal';
  card.style.setProperty('--stagger', `${index * 90}ms`);
  card.dataset.glow = ['blue', 'coral', 'green'][index % 3];

  card.innerHTML = `
    <span class="testimonial-card__quote-mark">${quoteMarkSVG()}</span>
    <p class="testimonial-card__quote">${t.quote}</p>
    <div class="testimonial-card__person">
      <div class="t-avatar" style="background:${colorFor(t.name)}">${initials(t.name)}</div>
      <div>
        <div class="testimonial-card__name">${t.name}</div>
        <div class="testimonial-card__role">${t.role} · ${t.company}</div>
      </div>
      ${t.linkedin ? `<a class="t-linkedin" href="${t.linkedin}" target="_blank" rel="noopener" aria-label="${t.name} on LinkedIn">${linkedinIcon()}</a>` : ''}
    </div>
  `;
  return card;
}

function renderWallItem(note, index) {
  const item = document.createElement('figure');
  item.className = 'wall-item';
  if (note.float) item.classList.add('is-floating');
  item.tabIndex = 0;
  item.dataset.index = index;

  item.innerHTML = `
    <div class="wall-item__frame">
      <div class="mock-shot">
        <div class="mock-shot__bar"><span></span><span></span><span></span></div>
        <div class="mock-shot__bubble">${note.text}</div>
        <div class="mock-shot__from">${note.from}</div>
      </div>
    </div>
  `;
  return item;
}

/* -------------------------------------------------------------------- */
/* 3. SCROLL REVEAL                                                      */
/* -------------------------------------------------------------------- */

function setupReveal(selector = '.reveal') {
  const items = document.querySelectorAll(selector);
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => entry.target.classList.add('is-visible'), Number(delay));
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  items.forEach(el => io.observe(el));
}

/* -------------------------------------------------------------------- */
/* 4. CARD TILT (mouse position)                                        */
/* -------------------------------------------------------------------- */

function setupTilt() {
  const cards = document.querySelectorAll('.testimonial-card');
  const glowMap = { blue: 'var(--glow-blue)', coral: 'var(--glow-coral)', green: 'var(--glow-green)' };

  cards.forEach(card => {
    card.style.setProperty('--card-glow', glowMap[card.dataset.glow] || glowMap.blue);

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;  // 0..1
      const py = (e.clientY - rect.top) / rect.height;  // 0..1
      const max = 6; // degrees
      const tiltY = (px - 0.5) * max * 2;
      const tiltX = (0.5 - py) * max * 2;
      card.style.setProperty('--tiltX', `${tiltX}deg`);
      card.style.setProperty('--tiltY', `${tiltY}deg`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--tiltX', '0deg');
      card.style.setProperty('--tiltY', '0deg');
    });
  });
}

/* -------------------------------------------------------------------- */
/* 5. COUNT-UP STATS                                                     */
/* -------------------------------------------------------------------- */

function animateCount(el, target, duration = 1400) {
  const start = performance.now();
  const numEl = el.querySelector('.count');

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    numEl.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function setupCountUp() {
  const cards = document.querySelectorAll(STATS_SELECTOR);
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = Number(entry.target.dataset.count || 0);
        animateCount(entry.target, target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  cards.forEach(el => io.observe(el));
}

/* -------------------------------------------------------------------- */
/* 6. APPRECIATION WALL + LIGHTBOX                                       */
/* -------------------------------------------------------------------- */

function setupWall() {
  const grid = document.getElementById('wallGrid');
  WALL_NOTES.forEach((note, i) => grid.appendChild(renderWallItem(note, i)));

  // fade-in-on-scroll for wall items specifically (separate from .reveal
  // so masonry items animate independently as they enter view)
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('is-visible'), i * 40);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  grid.querySelectorAll('.wall-item').forEach(el => io.observe(el));

  setupLightbox(grid);
}

function setupLightbox(grid) {
  const lightbox = document.getElementById('lightbox');
  const stage = document.getElementById('lightboxStage');
  const backdrop = document.getElementById('lightboxBackdrop');
  const btnClose = document.getElementById('lightboxClose');
  const btnPrev = document.getElementById('lightboxPrev');
  const btnNext = document.getElementById('lightboxNext');

  let currentIndex = 0;

  function open(index) {
    currentIndex = index;
    renderStage();
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function renderStage() {
    const note = WALL_NOTES[currentIndex];
    stage.innerHTML = `
      <div class="mock-shot" style="border-radius:16px;">
        <div class="mock-shot__bar"><span></span><span></span><span></span></div>
        <div class="mock-shot__bubble" style="font-size:16px;">${note.text}</div>
        <div class="mock-shot__from">${note.from}</div>
      </div>
    `;
  }

  function step(dir) {
    currentIndex = (currentIndex + dir + WALL_NOTES.length) % WALL_NOTES.length;
    renderStage();
  }

  grid.addEventListener('click', (e) => {
    const item = e.target.closest('.wall-item');
    if (item) open(Number(item.dataset.index));
  });

  grid.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const item = e.target.closest('.wall-item');
      if (item) { e.preventDefault(); open(Number(item.dataset.index)); }
    }
  });

  btnClose.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  btnPrev.addEventListener('click', () => step(-1));
  btnNext.addEventListener('click', () => step(1));

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });
}

/* -------------------------------------------------------------------- */
/* 7. NAV / MISC CHROME                                                  */
/* -------------------------------------------------------------------- */

function setupChrome() {
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  const backToTop = document.getElementById('backToTop');
  const yearEl = document.getElementById('year');

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  window.addEventListener('scroll', () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 8);
  }, { passive: true });

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('is-open');
    links.classList.toggle('is-open');
  });

  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    toggle.classList.remove('is-open');
    links.classList.remove('is-open');
  }));

  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // gentle mouse-parallax on the hero's floating field
  const field = document.getElementById('heroField');
  if (field && window.matchMedia('(pointer: fine)').matches) {
    document.querySelector('.t-hero').addEventListener('mousemove', (e) => {
      const { innerWidth: w, innerHeight: h } = window;
      const x = (e.clientX / w - 0.5) * 16;
      const y = (e.clientY / h - 0.5) * 16;
      field.style.transform = `translate(${x}px, ${y}px)`;
    });
  }
}

/* -------------------------------------------------------------------- */
/* INIT                                                                  */
/* -------------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('testimonialGrid');
  if (grid) {
    TESTIMONIALS.forEach((t, i) => grid.appendChild(renderTestimonialCard(t, i)));
    setupReveal();
    setupTilt();
    setupCountUp();
    setupWall();
    setupChrome();
  }
});


