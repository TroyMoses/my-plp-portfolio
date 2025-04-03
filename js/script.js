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

document.addEventListener("DOMContentLoaded", function () {
  // ===== Preloader =====
  const preloader = document.querySelector(".preloader");

  window.addEventListener("load", function () {
    preloader.classList.add("fade-out");
    setTimeout(() => {
      preloader.style.display = "none";
    }, 500);
  });

  // ===== Mobile Navigation =====
  const hamburger = document.querySelector(".hamburger");
  const navList = document.querySelector(".nav-list");

  hamburger.addEventListener("click", function () {
    this.classList.toggle("active");
    navList.classList.toggle("active");
  });

  // Close mobile menu when clicking a nav link
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", function () {
      hamburger.classList.remove("active");
      navList.classList.remove("active");
    });
  });

  // ===== Sticky Header on Scroll =====
  const header = document.querySelector(".header");

  window.addEventListener("scroll", function () {
    if (window.scrollY > 100) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    // Show/hide back to top button
    const backToTop = document.querySelector(".back-to-top");
    if (window.scrollY > 300) {
      backToTop.classList.add("active");
    } else {
      backToTop.classList.remove("active");
    }
  });

  // ===== Smooth Scrolling for Navigation Links =====
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: "smooth",
        });
      }
    });
  });

  // ===== Active Navigation Link on Scroll =====
  const sections = document.querySelectorAll("section");

  window.addEventListener("scroll", function () {
    let current = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;

      if (pageYOffset >= sectionTop - 200) {
        current = section.getAttribute("id");
      }
    });

    document.querySelectorAll(".nav-link").forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });

  // ===== Portfolio Filtering =====
  const filterButtons = document.querySelectorAll(".filter-btn");
  const portfolioItems = document.querySelectorAll(".portfolio-item");

  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Remove active class from all buttons
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      // Add active class to clicked button
      this.classList.add("active");

      const filterValue = this.getAttribute("data-filter");

      portfolioItems.forEach((item) => {
        if (
          filterValue === "all" ||
          item.getAttribute("data-category") === filterValue
        ) {
          item.style.display = "block";
          setTimeout(() => {
            item.classList.add("fade-in");
          }, 100);
        } else {
          item.classList.remove("fade-in");
          item.style.display = "none";
        }
      });
    });
  });

  // ===== Animate Skill Progress Bars on Scroll =====
  const skillSection = document.querySelector("#skills");
  const progressBars = document.querySelectorAll(".progress");

  function animateProgressBars() {
    if (window.scrollY > skillSection.offsetTop - 400) {
      progressBars.forEach((bar) => {
        const width = bar.style.width;
        bar.style.width = "0";
        setTimeout(() => {
          bar.style.width = width;
        }, 100);
      });

      // Remove event listener after animation
      window.removeEventListener("scroll", animateProgressBars);
    }
  }

  window.addEventListener("scroll", animateProgressBars);

  // ===== Contact Form Submission =====
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      // Get form values
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const subject = document.getElementById("subject").value;
      const message = document.getElementById("message").value;

      try {
        const response = await fetch("http://localhost:5000/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, subject, message }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to send message");
        }

        alert(
          `Thank you, ${name} for your message! I will get back to you soon.`
        );
        contactForm.reset();
      } catch (error) {
        console.error("Error submitting form:", error);
        alert(
          error.message ||
            "There was an error sending your message. Please try again."
        );
      }
    });
  }

  // ===== Newsletter Form Submission =====
  const newsletterForm = document.querySelector(".newsletter-form");

  if (newsletterForm) {
    newsletterForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const emailInput = this.querySelector('input[type="email"]');
      const email = emailInput.value;

      try {
        const response = await fetch("http://localhost:5000/api/newsletter", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to subscribe");
        }

        alert("Thank you for subscribing to my newsletter!");
        emailInput.value = "";
      } catch (error) {
        console.error("Error subscribing:", error);
        alert(
          error.message || "There was an error subscribing. Please try again."
        );
      }
    });
  }

  // ===== Set Current Year in Footer =====
  const yearElement = document.getElementById("year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // ===== Initialize Animations =====
  // You could add more animations here using libraries like AOS or your own
});
