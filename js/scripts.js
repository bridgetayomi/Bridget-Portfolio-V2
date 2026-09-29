document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. Universal Theme Toggle Logic ---
    function updateThemeUI(isDark) {
        if (isDark) {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light');
        } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.classList.add('light');
        }

        const darkIcons = document.querySelectorAll('#theme-toggle-dark-icon, .theme-toggle-dark-icon');
        const lightIcons = document.querySelectorAll('#theme-toggle-light-icon, .theme-toggle-light-icon');

        darkIcons.forEach(icon => {
            if (isDark) icon.classList.add('hidden');
            else icon.classList.remove('hidden');
        });

        lightIcons.forEach(icon => {
            if (isDark) icon.classList.remove('hidden');
            else icon.classList.add('hidden');
        });
    }

    function initTheme() {
        const savedTheme = localStorage.getItem('color-theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const isDark = savedTheme === 'dark' || (!savedTheme && systemPrefersDark);
        updateThemeUI(isDark);
    }

    // Initialize theme state on DOM load
    initTheme();

    const themeToggleBtns = document.querySelectorAll('#theme-toggle, .theme-toggle-btn');
    themeToggleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const isCurrentlyDark = document.documentElement.classList.contains('dark');
            const newTheme = isCurrentlyDark ? 'light' : 'dark';
            localStorage.setItem('color-theme', newTheme);
            updateThemeUI(newTheme === 'dark');
        });
    });

    // --- 2. Custom Cursor Logic (Case Study Page) ---
    const cursorDot = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');
    
    if (cursorDot && cursorRing) {
        let mouseX = 0, mouseY = 0;
        let ringX = 0, ringY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            // Move dot instantly
            cursorDot.style.left = mouseX + 'px';
            cursorDot.style.top = mouseY + 'px';
        });

        // Smooth follow for the ring
        function animateCursor() {
            let distX = mouseX - ringX;
            let distY = mouseY - ringY;
            ringX += distX * 0.15; 
            ringY += distY * 0.15;
            
            cursorRing.style.left = ringX + 'px';
            cursorRing.style.top = ringY + 'px';
            requestAnimationFrame(animateCursor);
        }
        animateCursor();
    }

    // --- 3. Scroll Reveal Animations (Both Pages) ---
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: Stop observing once revealed
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal-up, .reveal');
    revealElements.forEach(el => revealObserver.observe(el));
    
    // Trigger animation for elements initially in view on load
    setTimeout(() => {
        revealElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom >= 0) {
                el.classList.add('active');
            }
        });
    }, 100);

});

// --- 4. Accordion Toggle Logic (Case Study Page) ---
// Kept outside DOMContentLoaded so it remains globally accessible to inline onclick handlers
function toggleAccordion(button) {
    const item = button.parentElement;
    const content = item.querySelector('.accordion-content');
    const allItems = document.querySelectorAll('.accordion-item');
    
    allItems.forEach(i => {
        if (i !== item) {
            i.classList.remove('active');
            i.querySelector('.accordion-content').style.maxHeight = null;
            i.querySelector('.font-bold').classList.remove('text-accent');
        }
    });

    item.classList.toggle('active');
    
    if (item.classList.contains('active')) {
        content.style.maxHeight = content.scrollHeight + "px";
        button.querySelector('.font-bold').classList.add('text-accent');
    } else {
        content.style.maxHeight = null;
        button.querySelector('.font-bold').classList.remove('text-accent');
    }
}