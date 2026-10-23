document.addEventListener("DOMContentLoaded", () => {

    // ── 0. Path depth detection for correct relative links ──
    const path = window.location.pathname;
    let root = '/';
    if (path.includes('/Case-studies/') || path.includes('/pages/')) {
        root = '../';
    }

    // ── 1. Universal Theme Toggle ──
    function updateThemeUI(isDark) {
        if (isDark) {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light');
        } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.classList.add('light');
        }
        document.querySelectorAll('.theme-toggle-dark-icon').forEach(icon => {
            icon.classList.toggle('hidden', isDark);
        });
        document.querySelectorAll('.theme-toggle-light-icon').forEach(icon => {
            icon.classList.toggle('hidden', !isDark);
        });
    }

    function initTheme() {
        const saved = localStorage.getItem('color-theme');
        const sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        updateThemeUI(saved === 'dark' || (!saved && sysDark));
    }
    initTheme();

    document.querySelectorAll('#theme-toggle, .theme-toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const isDark = document.documentElement.classList.contains('dark');
            localStorage.setItem('color-theme', isDark ? 'light' : 'dark');
            updateThemeUI(!isDark);
        });
    });

    // ── 2. Mobile Hamburger Menu ──
    const navbar = document.getElementById('navbar');
    if (navbar) {
        const navInner = navbar.querySelector('div');

        // --- Build hamburger button ---
        const hamburger = document.createElement('button');
        hamburger.id = 'mobile-menu-btn';
        hamburger.setAttribute('aria-label', 'Toggle navigation menu');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.className = [
            'md:hidden flex flex-col justify-center items-center',
            'w-9 h-9 gap-[5px] rounded-lg',
            'border border-gray-200 dark:border-border',
            'bg-gray-100 dark:bg-[#1A1A1A]',
            'hover:bg-gray-200 dark:hover:bg-[#2A2A2A]',
            'transition-colors duration-200 flex-shrink-0'
        ].join(' ');
        hamburger.innerHTML = `
            <span class="hb-line block h-[2px] bg-gray-800 dark:bg-gray-200 rounded-full transition-all duration-300 origin-center" style="width:18px"></span>
            <span class="hb-line block h-[2px] bg-gray-800 dark:bg-gray-200 rounded-full transition-all duration-300" style="width:18px"></span>
            <span class="hb-line block h-[2px] bg-gray-800 dark:bg-gray-200 rounded-full transition-all duration-300 origin-center" style="width:18px"></span>
        `;

        // Insert before right controls
        const rightControls = navInner && navInner.querySelector('.flex.items-center.gap-3');
        if (rightControls) {
            navInner.insertBefore(hamburger, rightControls);
        } else if (navInner) {
            navInner.appendChild(hamburger);
        }

        // --- Build mobile dropdown ---
        const mobileMenu = document.createElement('div');
        mobileMenu.id = 'mobile-menu';
        mobileMenu.className = 'md:hidden hidden border-t border-gray-200 dark:border-border bg-white/97 dark:bg-[#0a0a0a]/97 backdrop-blur-md';

        const currentHref = window.location.href;
        function isActive(href) {
            const slug = href.replace('../', '').replace('.html', '').split('/').pop();
            return slug && currentHref.includes(slug);
        }

        const navLinks = [
            { href: root + 'Index.html', label: 'Home' },
            { href: root + 'pages/projects.html', label: 'Projects' },
            { href: root + 'pages/explorations.html', label: 'Explorations' },
            { href: root + 'about.html', label: 'About' },
            { href: root + 'pages/contact.html', label: 'Contact' },
        ];

        mobileMenu.innerHTML = `
            <nav class="max-w-7xl mx-auto px-6 py-5 flex flex-col gap-1" aria-label="Mobile navigation">
                ${navLinks.map(l => `
                    <a href="${l.href}"
                       class="flex items-center py-3 px-4 rounded-xl text-sm font-semibold transition-colors duration-150
                              ${isActive(l.href)
                                ? 'text-black dark:text-accent bg-black/5 dark:bg-white/5'
                                : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5'}">
                        ${l.label}
                    </a>`).join('')}
                <a href="${root}pages/contact.html"
                   class="mt-3 block w-full text-center bg-black dark:bg-accent text-white dark:text-dark py-3 px-6 rounded-xl font-bold text-sm hover:bg-gray-800 dark:hover:bg-white transition-colors">
                    Get in touch &rarr;
                </a>
            </nav>
        `;

        navbar.appendChild(mobileMenu);

        // --- Toggle logic ---
        let menuOpen = false;

        function openMenu() {
            menuOpen = true;
            mobileMenu.classList.remove('hidden');
            hamburger.setAttribute('aria-expanded', 'true');
            const [l1, l2, l3] = hamburger.querySelectorAll('.hb-line');
            l1.style.transform = 'translateY(7px) rotate(45deg)';
            l2.style.opacity = '0';
            l3.style.transform = 'translateY(-7px) rotate(-45deg)';
        }

        function closeMenu() {
            menuOpen = false;
            mobileMenu.classList.add('hidden');
            hamburger.setAttribute('aria-expanded', 'false');
            const [l1, l2, l3] = hamburger.querySelectorAll('.hb-line');
            l1.style.transform = '';
            l2.style.opacity = '';
            l3.style.transform = '';
        }

        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            menuOpen ? closeMenu() : openMenu();
        });

        // Close on link click
        mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (menuOpen && !navbar.contains(e.target)) closeMenu();
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menuOpen) closeMenu();
        });

        // Navbar scroll shadow
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('shadow-md', window.scrollY > 10);
        }, { passive: true });
    }

    // ── 3. Custom Cursor ──
    const cursorDot = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');

    if (cursorDot && cursorRing) {
        let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.left = mouseX + 'px';
            cursorDot.style.top = mouseY + 'px';
        });

        (function animateCursor() {
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;
            cursorRing.style.left = ringX + 'px';
            cursorRing.style.top = ringY + 'px';
            requestAnimationFrame(animateCursor);
        })();
    }

    // ── 4. Scroll Reveal Animations ──
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('active');
        });
    }, { root: null, rootMargin: '0px 0px -50px 0px', threshold: 0.1 });

    const revealEls = document.querySelectorAll('.reveal-up, .reveal');
    revealEls.forEach(el => revealObserver.observe(el));

    // Trigger elements already in view on load
    setTimeout(() => {
        revealEls.forEach(el => {
            const r = el.getBoundingClientRect();
            if (r.top < window.innerHeight && r.bottom >= 0) el.classList.add('active');
        });
    }, 100);

});

// ── 5. Accordion Toggle (global, for inline onclick) ──
function toggleAccordion(button) {
    const item = button.parentElement;
    const content = item.querySelector('.accordion-content');

    document.querySelectorAll('.accordion-item').forEach(i => {
        if (i !== item) {
            i.classList.remove('active');
            i.querySelector('.accordion-content').style.maxHeight = null;
            const bold = i.querySelector('.font-bold');
            if (bold) bold.classList.remove('text-accent');
        }
    });

    item.classList.toggle('active');
    if (item.classList.contains('active')) {
        content.style.maxHeight = content.scrollHeight + 'px';
        const bold = button.querySelector('.font-bold');
        if (bold) bold.classList.add('text-accent');
    } else {
        content.style.maxHeight = null;
        const bold = button.querySelector('.font-bold');
        if (bold) bold.classList.remove('text-accent');
    }
}