// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');
    });
}

// Typing animation
const roles = [
    'Business Central Developer',
    'Systems Administrator',
];
const typingEl = document.getElementById('typingRole');
if (typingEl) {
    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function type() {
        const current = roles[roleIndex];
        if (deleting) {
            typingEl.textContent = current.substring(0, charIndex--);
        } else {
            typingEl.textContent = current.substring(0, charIndex++);
        }

        if (!deleting && charIndex === current.length + 1) {
            setTimeout(() => { deleting = true; type(); }, 2200);
            return;
        }
        if (deleting && charIndex === 0) {
            deleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
        }

        setTimeout(type, deleting ? 45 : 90);
    }
    type();
}

// Skill bar animation
const skillFills = document.querySelectorAll('.skill-fill');
if (skillFills.length) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                el.style.width = el.dataset.width + '%';
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.3 });

    skillFills.forEach(el => observer.observe(el));
}

// Fade in on scroll
const fadeEls = document.querySelectorAll('.exp-item, .post-card, .skill-category, .stat-item, .timeline-item');
if (fadeEls.length) {
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, i * 60);
                fadeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    fadeEls.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(16px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        fadeObserver.observe(el);
    });
}
