// ===== DOM Elements =====
const navbar = document.querySelector('.navbar');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contactForm');
const themeToggle = document.getElementById('themeToggle');
const backToTopBtn = document.getElementById('backToTop');

// ===== Three.js 3D Section Backgrounds =====
function create3DBackground(canvasId, config) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || typeof THREE === 'undefined') return;
    
    const section = canvas.parentElement;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, section.offsetWidth / section.offsetHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    
    renderer.setSize(section.offsetWidth, section.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Create particles with dark colors
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = config.particleCount || 1500;
    const posArray = new Float32Array(particlesCount * 3);
    const colorsArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i += 3) {
        posArray[i] = (Math.random() - 0.5) * 20;
        posArray[i + 1] = (Math.random() - 0.5) * 20;
        posArray[i + 2] = (Math.random() - 0.5) * 10;
        
        // Dark muted colors
        const t = Math.random();
        colorsArray[i] = config.color1.r + t * (config.color2.r - config.color1.r);
        colorsArray[i + 1] = config.color1.g + t * (config.color2.g - config.color1.g);
        colorsArray[i + 2] = config.color1.b + t * (config.color2.b - config.color1.b);
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
        size: config.particleSize || 0.02,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    // Add dark wireframe shapes
    const shapes = [];
    const geometries = [
        new THREE.IcosahedronGeometry(0.4, 0),
        new THREE.OctahedronGeometry(0.35, 0),
        new THREE.TetrahedronGeometry(0.4, 0),
        new THREE.BoxGeometry(0.3, 0.3, 0.3)
    ];
    
    for (let i = 0; i < 6; i++) {
        const geometry = geometries[i % geometries.length];
        const material = new THREE.MeshBasicMaterial({
            color: config.shapeColors[i % config.shapeColors.length],
            wireframe: true,
            transparent: true,
            opacity: 0.15
        });
        const shape = new THREE.Mesh(geometry, material);
        
        shape.position.x = (Math.random() - 0.5) * 12;
        shape.position.y = (Math.random() - 0.5) * 8;
        shape.position.z = (Math.random() - 0.5) * 5 - 3;
        
        shape.userData = {
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.01,
                y: (Math.random() - 0.5) * 0.01,
                z: (Math.random() - 0.5) * 0.01
            },
            floatSpeed: Math.random() * 0.3 + 0.2,
            floatOffset: Math.random() * Math.PI * 2
        };
        
        shapes.push(shape);
        scene.add(shape);
    }
    
    camera.position.z = 6;
    
    let mouseX = 0, mouseY = 0;
    
    section.addEventListener('mousemove', (e) => {
        const rect = section.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    });
    
    const clock = new THREE.Clock();
    
    function animate() {
        requestAnimationFrame(animate);
        
        const elapsedTime = clock.getElapsedTime();
        
        particlesMesh.rotation.x = elapsedTime * 0.03 + mouseY * 0.2;
        particlesMesh.rotation.y = elapsedTime * 0.05 + mouseX * 0.2;
        
        shapes.forEach((shape) => {
            shape.rotation.x += shape.userData.rotationSpeed.x;
            shape.rotation.y += shape.userData.rotationSpeed.y;
            shape.rotation.z += shape.userData.rotationSpeed.z;
            shape.position.y += Math.sin(elapsedTime * shape.userData.floatSpeed + shape.userData.floatOffset) * 0.001;
        });
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Handle resize
    const resizeObserver = new ResizeObserver(() => {
        camera.aspect = section.offsetWidth / section.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(section.offsetWidth, section.offsetHeight);
    });
    resizeObserver.observe(section);
}

// Initialize 3D backgrounds for sections with DARK colors
if (typeof THREE !== 'undefined') {
    // Skills section - very dark purple/blue tones
    create3DBackground('skills-canvas', {
        particleCount: 1200,
        particleSize: 0.025,
        color1: { r: 0.15, g: 0.08, b: 0.25 },  // Dark purple
        color2: { r: 0.08, g: 0.15, b: 0.2 },   // Dark blue
        shapeColors: [0x1a0a2e, 0x0a1628, 0x150820, 0x0d1520]  // Very dark purples/blues
    });
    
    // Projects section - dark gray/charcoal tones
    create3DBackground('projects-canvas', {
        particleCount: 1000,
        particleSize: 0.02,
        color1: { r: 0.1, g: 0.1, b: 0.12 },    // Dark charcoal
        color2: { r: 0.15, g: 0.1, b: 0.18 },   // Dark purple-gray
        shapeColors: [0x1a1a1f, 0x12121a, 0x18141e, 0x101015]  // Very dark grays
    });
}

// ===== Custom Cursor =====
const cursor = document.querySelector('.custom-cursor');
if (cursor) {
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
    // Hover effect on interactive elements
    document.querySelectorAll('a, button, .btn, .project-card, .skill-group, input, textarea').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
    
    // Click effect
    document.addEventListener('mousedown', () => cursor.classList.add('clicking'));
    document.addEventListener('mouseup', () => cursor.classList.remove('clicking'));
}

// ===== BIG SCROLL ANIMATIONS - Repeat Every Time =====
function initScrollAnimations() {
    // Add animation classes to elements
    document.querySelectorAll('.section-title').forEach(el => {
        el.classList.add('scroll-animate', 'fade-up');
    });
    
    document.querySelectorAll('.about-text').forEach(el => {
        el.classList.add('scroll-animate', 'slide-left');
    });
    
    document.querySelectorAll('.about-stats').forEach(el => {
        el.classList.add('scroll-animate', 'slide-right');
    });
    
    document.querySelectorAll('.skill-group').forEach((el, i) => {
        el.classList.add('scroll-animate', 'scale-up');
        el.classList.add('stagger-delay-' + ((i % 6) + 1));
    });
    
    document.querySelectorAll('.project-card').forEach((el, i) => {
        el.classList.add('scroll-animate', 'flip-in');
        el.classList.add('stagger-delay-' + ((i % 4) + 1));
    });
    
    document.querySelectorAll('.timeline-item').forEach((el, i) => {
        el.classList.add('scroll-animate', 'slide-left');
        el.classList.add('stagger-delay-' + ((i % 4) + 1));
    });
    
    document.querySelectorAll('.education-card').forEach((el, i) => {
        el.classList.add('scroll-animate', 'rotate-in');
        el.classList.add('stagger-delay-' + ((i % 2) + 1));
    });
    
    document.querySelectorAll('.cert-item').forEach((el, i) => {
        el.classList.add('scroll-animate', 'fade-up');
        el.classList.add('stagger-delay-' + ((i % 4) + 1));
    });
    
    document.querySelectorAll('.contact-item').forEach((el, i) => {
        el.classList.add('scroll-animate', 'slide-left');
        el.classList.add('stagger-delay-' + ((i % 3) + 1));
    });
    
    document.querySelectorAll('.contact-form').forEach(el => {
        el.classList.add('scroll-animate', 'slide-right');
    });
    
    document.querySelectorAll('.stat-card').forEach((el, i) => {
        el.classList.add('scroll-animate', 'scale-up');
        el.classList.add('stagger-delay-' + ((i % 3) + 1));
    });
}

// Intersection Observer that triggers animations on EVERY scroll (in and out)
function setupScrollObserver() {
    const animatedElements = document.querySelectorAll('.scroll-animate');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Element is in view - animate in
                entry.target.classList.add('animate-in');
            } else {
                // Element is out of view - reset animation so it plays again
                entry.target.classList.remove('animate-in');
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => observer.observe(el));
}

// Initialize animations
initScrollAnimations();
setupScrollObserver();

// ===== Dark Mode Toggle =====
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        updateThemeIcon(true);
    }
}

function toggleTheme() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    
    if (isDark) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        updateThemeIcon(false);
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        updateThemeIcon(true);
    }
}

function updateThemeIcon(isDark) {
    const icon = themeToggle.querySelector('i');
    if (isDark) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// Initialize theme on page load
initTheme();

// Theme toggle click handler
themeToggle.addEventListener('click', toggleTheme);

// ===== Back to Top Button =====
function handleBackToTop() {
    if (window.scrollY > 500) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
}

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

window.addEventListener('scroll', handleBackToTop);

// ===== Navigation =====
// Toggle mobile menu
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===== Active Navigation Link =====
const sections = document.querySelectorAll('section[id]');

function highlightNavLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) navLink.classList.add('active');
        }
    });
}

window.addEventListener('scroll', highlightNavLink);

// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Contact Form =====
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };

    // Simple validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }

    // Simulate form submission (replace with actual backend integration)
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        // In a real application, you would send this data to a backend server
        // For now, we'll create a mailto link as a fallback
        const mailtoLink = `mailto:shejadavid11@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`)}`;
        
        showNotification('Opening email client...', 'success');
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Reset form
        contactForm.reset();
        
        // Open mailto link
        window.location.href = mailtoLink;
    }, 1000);
});

// ===== Notification System =====
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
        color: white;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
        display: flex;
        align-items: center;
        gap: 1rem;
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;

    // Add animation keyframes
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Add to DOM
    document.body.appendChild(notification);

    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.25rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    `;
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// ===== Intersection Observer for Animations =====
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe elements for animation with staggered delays
document.querySelectorAll('.skill-card, .project-card, .timeline-item, .education-card, .stat-card, .cert-item').forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(el);
});

// Observe section titles
document.querySelectorAll('.section-title').forEach(el => {
    observer.observe(el);
});

// Add animation class styles
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(animationStyles);

// ===== Typing Effect for Hero Title =====
const heroTitle = document.querySelector('.hero-title');
const titles = [
    'Software Engineer & Full-Stack Developer',
    'Data Science Enthusiast',
    'IT Systems Specialist'
];
let titleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeEffect() {
    const currentTitle = titles[titleIndex];
    
    if (isDeleting) {
        heroTitle.textContent = currentTitle.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
    } else {
        heroTitle.textContent = currentTitle.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentTitle.length) {
        isDeleting = true;
        typingSpeed = 2000; // Pause at end
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        titleIndex = (titleIndex + 1) % titles.length;
        typingSpeed = 500; // Pause before typing next
    }

    setTimeout(typeEffect, typingSpeed);
}

// Start typing effect after page load
setTimeout(typeEffect, 1500);

// ===== Button Ripple Effect =====
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = e.clientX - rect.left - size / 2 + 'px';
        ripple.style.top = e.clientY - rect.top - size / 2 + 'px';
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// ===== Parallax Effect on Mouse Move =====
const heroImage = document.querySelector('.hero-image');
const heroContent = document.querySelector('.hero-content');

if (heroContent) {
    heroContent.addEventListener('mousemove', (e) => {
        const rect = heroContent.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        
        if (heroImage) {
            heroImage.style.transform = `translate(${x * 20}px, ${y * 20}px)`;
        }
    });
    
    heroContent.addEventListener('mouseleave', () => {
        if (heroImage) {
            heroImage.style.transform = 'translate(0, 0)';
            heroImage.style.transition = 'transform 0.5s ease';
        }
    });
}

// ===== Animate Numbers on Scroll =====
function animateNumber(el, target) {
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (target - start) * easeOut);
        
        el.textContent = current + (el.dataset.suffix || '');
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            el.textContent = target + (el.dataset.suffix || '');
        }
    }
    
    requestAnimationFrame(update);
}

// Observe stat numbers for animation
const statNumbers = document.querySelectorAll('.stat-number');
const numberObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
            entry.target.dataset.animated = 'true';
            const text = entry.target.textContent;
            const number = parseInt(text);
            const suffix = text.replace(/[0-9]/g, '');
            entry.target.dataset.suffix = suffix;
            animateNumber(entry.target, number);
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(num => numberObserver.observe(num));

// ===== Tilt Effect on Cards =====
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 30;
        const rotateY = (centerX - x) / 30;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        card.style.transition = 'transform 0.5s ease';
    });
});

// ===== Skill Category Scroll Animation =====
const skillCategories = document.querySelectorAll('.skill-category');
const categoryObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, index * 100);
        }
    });
}, { threshold: 0.2 });

skillCategories.forEach(category => categoryObserver.observe(category));

// ===== Skill Tags Stagger Animation =====
document.querySelectorAll('.skill-category').forEach(category => {
    const tags = category.querySelectorAll('.skill-tag');
    category.addEventListener('mouseenter', () => {
        tags.forEach((tag, index) => {
            setTimeout(() => {
                tag.style.transform = 'translateY(-3px) scale(1.05)';
            }, index * 30);
        });
    });
    
    category.addEventListener('mouseleave', () => {
        tags.forEach(tag => {
            tag.style.transform = '';
        });
    });
});

// ===== Page Load Animation =====
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});
