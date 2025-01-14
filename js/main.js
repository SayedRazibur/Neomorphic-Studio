// DOM Elements
const themeToggle = document.getElementById('theme-toggle-btn');
const body = document.body;
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const scrollRevealElements = document.querySelectorAll('.scroll-reveal');
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-links a');

// Theme Toggle
function toggleTheme() {
    body.classList.toggle('dark-mode');
    const isDarkMode = body.classList.contains('dark-mode');
    
    // Update icon
    const icon = themeToggle.querySelector('i');
    icon.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
    
    // Save preference
    localStorage.setItem('darkMode', isDarkMode);
}

// Check for saved theme preference
const savedTheme = localStorage.getItem('darkMode');
if (savedTheme === 'true') {
    body.classList.add('dark-mode');
    themeToggle.querySelector('i').className = 'fas fa-sun';
}

// Event Listeners
themeToggle.addEventListener('click', toggleTheme);

// Mobile Menu Toggle
navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    
    // Animate hamburger menu
    const spans = navToggle.querySelectorAll('span');
    spans.forEach(span => span.classList.toggle('active'));
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
    }
});

// Scroll Reveal Animation
function revealOnScroll() {
    scrollRevealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight * 0.85) {
            element.classList.add('active');
        }
    });
}

// Initial check for visible elements
revealOnScroll();

// Scroll event listener with debounce
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
    }
    scrollTimeout = window.requestAnimationFrame(revealOnScroll);
});

// Update active nav link based on scroll position
function updateActiveNavLink() {
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - sectionHeight/3)) {
            currentSection = section.getAttribute('id');
        }
    });

    navItems.forEach(navItem => {
        navItem.classList.remove('active');
        if (navItem.getAttribute('href') === `#${currentSection}`) {
            navItem.classList.add('active');
        }
    });
}

// Add scroll event listener for active nav update
window.addEventListener('scroll', updateActiveNavLink);

// Update click handler for nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        // Remove active class from all links
        navItems.forEach(item => item.classList.remove('active'));
        // Add active class to clicked link
        this.classList.add('active');
        
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            navLinks.classList.remove('active');
        }
    });
});

// Form Animation
const formGroups = document.querySelectorAll('.form-group');
formGroups.forEach(group => {
    const input = group.querySelector('input, textarea');
    const label = group.querySelector('label');
    
    if (input && label) {
        // Handle initial state
        if (input.value) {
            label.classList.add('active');
        }
        
        // Handle input events
        input.addEventListener('focus', () => {
            label.classList.add('active');
        });
        
        input.addEventListener('blur', () => {
            if (!input.value) {
                label.classList.remove('active');
            }
        });
    }
});

// Add fade-in animation to sections
document.querySelectorAll('section').forEach(section => {
    section.classList.add('fade-in');
});

// Handle form submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual form handling)
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            alert('Message sent successfully!');
            contactForm.reset();
        } catch (error) {
            alert('Failed to send message. Please try again.');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Testimonial Carousel
const testimonialSlider = document.querySelector('.testimonials-slider');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const testimonialCards = document.querySelectorAll('.testimonial-card');

if (testimonialSlider && prevBtn && nextBtn) {
    let currentIndex = 0;
    const cardWidth = testimonialCards[0].offsetWidth + 32; // Including margin

    function scrollToCard(index) {
        testimonialSlider.scrollTo({
            left: index * cardWidth,
            behavior: 'smooth'
        });
    }

    prevBtn.addEventListener('click', () => {
        currentIndex = Math.max(currentIndex - 1, 0);
        scrollToCard(currentIndex);
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = Math.min(currentIndex + 1, testimonialCards.length - 1);
        scrollToCard(currentIndex);
    });

    // Auto scroll
    let autoScrollInterval;
    
    function startAutoScroll() {
        autoScrollInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % testimonialCards.length;
            scrollToCard(currentIndex);
        }, 5000);
    }

    function stopAutoScroll() {
        clearInterval(autoScrollInterval);
    }

    testimonialSlider.addEventListener('mouseenter', stopAutoScroll);
    testimonialSlider.addEventListener('mouseleave', startAutoScroll);

    // Start auto scroll
    startAutoScroll();

    // Update currentIndex on scroll
    testimonialSlider.addEventListener('scroll', () => {
        const scrollPosition = testimonialSlider.scrollLeft;
        currentIndex = Math.round(scrollPosition / cardWidth);
    });
} 

// Portfolio Filtering
const filterButtons = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(button => button.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        
        const filterValue = btn.getAttribute('data-filter');
        
        portfolioItems.forEach(item => {
            // Reset animation
            item.style.animation = 'none';
            item.offsetHeight; // Trigger reflow
            item.style.animation = null;
            
            if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                item.style.display = 'block';
                // Add animation with delay based on index
                item.style.animationDelay = `${Array.from(portfolioItems).indexOf(item) * 0.1}s`;
            } else {
                item.style.display = 'none';
            }
        });
    });
}); 

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal-text').forEach(el => observer.observe(el)); 

// Add parallax effect
const handleParallax = () => {
    const parallaxElements = document.querySelectorAll('.parallax');
    
    window.addEventListener('scroll', () => {
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const rect = element.getBoundingClientRect();
            const inView = rect.top <= window.innerHeight && rect.bottom >= 0;
            
            if (inView) {
                const yPos = (window.scrollY * speed);
                element.style.transform = `translate3d(0, ${yPos}px, 0)`;
            }
        });
    });
};

// Initialize parallax
handleParallax();

// Mouse trail effect
function createParticle(x, y) {
    const particle = document.createElement('div');
    particle.className = 'mouse-particle';
    
    // Random size between 5 and 15 pixels
    const size = Math.random() * 10 + 5;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    // Position at mouse coordinates
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    
    document.body.appendChild(particle);
    
    // Remove particle after animation
    setTimeout(() => particle.remove(), 1500);
}

// Add mousemove event listener
document.addEventListener('mousemove', (e) => {
    // Create particle with 10% chance on each mouse move
    if (Math.random() > 0.5) {
        createParticle(e.clientX, e.clientY);
    }
});