// ─── THEME ───
function switchTheme(e) {
    const theme = e.target.checked ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

// ─── TYPEWRITER ───
const typewriterTexts = [
    "Validating AI-powered early prediction systems for agriculture.",
    "Detecting insect pests and diseases across diverse geographies.",
    "Deploying UAVs for bio-pesticide spraying and field sensing.",
    "Building Digital Twins for agricultural data and prediction.",
    "Enabling privacy-preserving federated learning on farm data.",
    "Scaling Vision-Language Models for crop diagnostics.",
    "Connecting maize and rice farmers across four nations.",
    "Standardizing cross-regional agricultural validation protocols.",
    "Integrating IoT sensors, drones, and AI at the field edge.",
    "Sustaining food systems through transparent data governance.",
    "Bridging US, Australia, India, and Japan through Quad AI.",
    "Innovating for resilient and sustainable agriculture."
];

let typewriterElement;
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 50;
const delayAfterTyping = 3000;
const delayAfterDeleting = 500;

function typeWriter() {
    if (!typewriterElement) {
        typewriterElement = document.getElementById('typewriter-text');
        if (!typewriterElement) return;
    }
    const currentText = typewriterTexts[textIndex];

    if (isDeleting) {
        typewriterElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 30;
    } else {
        typewriterElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 50;
    }

    if (!isDeleting && charIndex === currentText.length) {
        typingSpeed = delayAfterTyping;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % typewriterTexts.length;
        typingSpeed = delayAfterDeleting;
    }

    setTimeout(typeWriter, typingSpeed);
}

// ─── IMAGE SLIDER ───
let currentSlide = 0;
let sliderInterval;
let isSliderPaused = false;

function moveSlide(dir) {
    const track = document.querySelector('.slider-track');
    if (!track) return;
    const total = track.querySelectorAll('img').length;
    currentSlide = (currentSlide + dir + total) % total;
    updateSlider();
}

function goToSlide(index) {
    currentSlide = index;
    updateSlider();
}

function updateSlider() {
    const track = document.querySelector('.slider-track');
    if (!track) return;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    document.querySelectorAll('.dot').forEach((d, i) =>
        d.classList.toggle('active', i === currentSlide)
    );
}

function initSlider() {
    const track = document.querySelector('.slider-track');
    if (!track) return;

    // Static event binding for navigation targets
    document.getElementById('slider-prev')?.addEventListener('click', () => moveSlide(-1));
    document.getElementById('slider-next')?.addEventListener('click', () => moveSlide(1));
    
    document.querySelectorAll('.dot').forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });

    // Auto-advance checking paused flag states
    sliderInterval = setInterval(() => {
        if (!isSliderPaused) moveSlide(1);
    }, 4000);

    // Pause on hover overrides
    const sliderEl = document.querySelector('.about-slider');
    if (sliderEl) {
        sliderEl.addEventListener('mouseenter', () => { isSliderPaused = true; });
        sliderEl.addEventListener('mouseleave', () => { isSliderPaused = false; });
    }

    // Touch swipe support
    let touchStartX = 0;
    track.addEventListener('touchstart', e => {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });
    
    track.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) moveSlide(diff > 0 ? 1 : -1);
    }, { passive: true });
}

// ─── SCROLL FADE-IN ───
function initFadeIn() {
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.12 });
    document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));
}

// ─── SMOOTH SCROLL ───
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const attr = this.getAttribute('href');
            const target = document.querySelector(attr === '#top' ? '#top' : attr);
            if (target) {
                window.scrollTo({
                    top: attr === '#top' ? 0 : target.offsetTop - 64,
                    behavior: 'smooth'
                });
                document.getElementById('nav-links')?.classList.remove('open');
            }
        });
    });
}

// ─── MOBILE MENU ───
function initMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const links = document.getElementById('nav-links');
    if (btn && links) {
        btn.addEventListener('click', () => links.classList.toggle('open'));
    }
}

// ─── INIT ───
document.addEventListener('DOMContentLoaded', () => {
    // Theme setup configuration defaults
    const cb = document.getElementById('checkbox');
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (saved === 'dark' || (!saved && prefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        if (cb) cb.checked = true;
    }
    if (cb) cb.addEventListener('change', switchTheme);

    initMobileMenu();
    initSmoothScroll();
    initSlider();
    initFadeIn();

    if (document.getElementById('typewriter-text')) typeWriter();
});