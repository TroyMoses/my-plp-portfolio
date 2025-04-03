/**
 * Portfolio Website - Main JavaScript File
 *
 * This script handles:
 * - Preloader functionality
 * - Mobile navigation toggle
 * - Smooth scrolling for navigation links
 * - Active navigation link highlighting
 * - Back to top button
 * - Portfolio filtering
 * - Skill progress bars animation
 * - Contact form submission
 * - Current year in footer
 */

document.addEventListener('DOMContentLoaded', function() {
    // ===== Preloader =====
    const preloader = document.querySelector('.preloader');
    
    window.addEventListener('load', function() {
        preloader.classList.add('fade-out');
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    });

    // ===== Mobile Navigation =====
    const hamburger = document.querySelector('.hamburger');
    const navList = document.querySelector('.nav-list');
    
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navList.classList.toggle('active');
    });
    
    // Close mobile menu when clicking a nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navList.classList.remove('active');
        });
    });

    // ===== Sticky Header on Scroll =====
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Show/hide back to top button
        const backToTop = document.querySelector('.back-to-top');
        if (window.scrollY > 300) {
            backToTop.classList.add('active');
        } else {
            backToTop.classList.remove('active');
        }
    });

    // ===== Smooth Scrolling for Navigation Links =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== Active Navigation Link on Scroll =====
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // ===== Portfolio Filtering =====
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.classList.add('fade-in');
                    }, 100);
                } else {
                    item.classList.remove('fade-in');
                    item.style.display = 'none';
                }
            });
        });
    });

    // ===== Animate Skill Progress Bars on Scroll =====
    const skillSection = document.querySelector('#skills');
    const progressBars = document.querySelectorAll('.progress');
    
    function animateProgressBars() {
        if (window.scrollY > skillSection.offsetTop - 400) {
            progressBars.forEach(bar => {
                const width = bar.style.width;
                bar.style.width = '0';
                setTimeout(() => {
                    bar.style.width = width;
                }, 100);
            });
            
            // Remove event listener after animation
            window.removeEventListener('scroll', animateProgressBars);
        }
    }
    
    window.addEventListener('scroll', animateProgressBars);

    // ===== Contact Form Submission =====
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();
            
            // Get submit button and set loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            
            try {
                const response = await fetch('https://my-plp-portfolio.onrender.com/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name, email, subject, message }),
                });
                
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.error || 'Failed to send message');
                }
                
                // Show success message
                showAlert('success', 'Message sent successfully! You should receive a confirmation email shortly. If you do not see it, please check your spam folder.');
                contactForm.reset();
            } catch (error) {
                console.error('Error submitting form:', error);
                showAlert('error', error.message || 'There was an error sending your message. Please try again.');
            } finally {
                // Reset button state
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        });
    }

    // ===== Newsletter Form Submission =====
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            
            // Set loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            
            try {
                const response = await fetch('https://my-plp-portfolio.onrender.com/api/newsletter', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email }),
                });
                
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.error || 'Failed to subscribe');
                }
                
                // Show success message
                showAlert('success', 'Thank you for subscribing! Please check your email, or spam folder for confirmation.');
                emailInput.value = '';
            } catch (error) {
                console.error('Error subscribing:', error);
                showAlert('error', error.message || 'There was an error subscribing. Please try again.');
            } finally {
                // Reset button state
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        });
    }

    // Helper function to show alerts
    function showAlert(type, message) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.textContent = message;
        
        // Add to top of body
        document.body.prepend(alertDiv);
        
        // Remove after 5 seconds
        setTimeout(() => {
            alertDiv.classList.add('fade-out');
            setTimeout(() => alertDiv.remove(), 300);
        }, 5000);
    }

    // Add some basic CSS for alerts
    const alertStyles = document.createElement('style');
    alertStyles.textContent = `
        .alert {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 15px 25px;
            border-radius: 5px;
            color: white;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            opacity: 0;
            animation: fadeIn 0.3s forwards;
        }
        .alert-success {
            background-color: #48bb78;
        }
        .alert-error {
            background-color: #f56565;
        }
        .fade-out {
            animation: fadeOut 0.3s forwards;
        }
        @keyframes fadeIn {
            to { opacity: 1; top: 30px; }
        }
        @keyframes fadeOut {
            to { opacity: 0; top: 20px; }
        }
    `;
    document.head.appendChild(alertStyles);

    // ===== Set Current Year in Footer =====
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
});
