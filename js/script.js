document.addEventListener("DOMContentLoaded", function () {
// ===== Navbar scroll =====
  const navbar = document.querySelector(".navbar");
  const scrollTopBtn = document.getElementById("scrollTop");

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  window.addEventListener("scroll", function () {
    if (window.scrollY > 100) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    if (scrollTopBtn) {
      if (window.scrollY > 500) {
        scrollTopBtn.classList.add("show");
      } else {
        scrollTopBtn.classList.remove("show");
      }
    }
  });

  // ===== Mobile menu toggle =====
  const toggler = document.querySelector(".mobile-toggler");
  const navLinks = document.querySelector(".nav-links");

if (toggler && navLinks) {
    toggler.addEventListener("click", function () {
      this.classList.toggle("active");
      const isOpen = navLinks.classList.toggle("open");
      document.body.classList.toggle("menu-open", isOpen);
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        toggler.classList.remove("active");
        navLinks.classList.remove("open");
        document.body.classList.remove("menu-open");
        document.body.style.overflow = "";
      });
    });
  }

  // ===== Testimonial slider =====
  const slides = document.querySelectorAll(".testimonial-slide");
  const dotsContainer = document.querySelector(".slider-dots");

  if (slides.length > 0) {
    let currentSlide = 0;

    slides.forEach(function (_, index) {
      const dot = document.createElement("button");
      dot.classList.add("slider-dot");
      if (index === 0) dot.classList.add("active");
      dot.dataset.slide = index;
      dot.addEventListener("click", function () {
        goToSlide(index);
      });
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll(".slider-dot");

    function goToSlide(index) {
      slides[currentSlide].classList.remove("active");
      dots[currentSlide].classList.remove("active");
      currentSlide = index;
      slides[currentSlide].classList.add("active");
      dots[currentSlide].classList.add("active");
    }

    setInterval(function () {
      const next = (currentSlide + 1) % slides.length;
      goToSlide(next);
    }, 6000);
  }

  // ===== Gallery lightbox =====
  const galleryItems = document.querySelectorAll(".gallery-item");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxClose = document.querySelector(".lightbox-close");

  if (galleryItems.length > 0 && lightbox) {
    galleryItems.forEach(function (item) {
      item.addEventListener("click", function () {
        const img = this.querySelector("img");
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add("active");
        document.body.style.overflow = "hidden";
      });
    });

    function closeLightbox() {
      lightbox.classList.remove("active");
      document.body.style.overflow = "";
    }

    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox || e.target.closest(".lightbox-close")) {
        closeLightbox();
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        closeLightbox();
      }
    });
  }

  // ===== Stats counting animation =====
  const statNums = document.querySelectorAll(".stat-num");

  if (statNums.length > 0) {
    const animateCount = function (el) {
      const target = parseInt(el.dataset.target);
      const suffix = el.dataset.suffix || "";
      let current = 0;
      const increment = target / 60;
      const interval = setInterval(function () {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(interval);
        }
        el.textContent = Math.floor(current) + suffix;
      }, 30);
    };

    const statsSection = document.querySelector(".stats");
    if (statsSection) {
      const observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              statNums.forEach(animateCount);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.3 }
      );
      observer.observe(statsSection);
    }
  }

  // ===== Badge & mini-stat counting animation =====
  const countEls = document.querySelectorAll(".num[data-count], .mini-num[data-count]");

  if (countEls.length > 0 && "IntersectionObserver" in window) {
    const formatCount = function (value, comma) {
      return comma ? value.toLocaleString("en-US") : String(value);
    };

    const runCount = function (el) {
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.countSuffix || "";
      const comma = el.dataset.comma === "true";
      const duration = 1600;
      const start = performance.now();

      function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);
        el.textContent = formatCount(current, comma) + suffix;
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = formatCount(target, comma) + suffix;
        }
      }

      requestAnimationFrame(step);
    };

    const countObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            runCount(entry.target);
            countObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    countEls.forEach(function (el) {
      countObserver.observe(el);
    });
  }

  // ===== FAQ accordion =====
  const faqItems = document.querySelectorAll(".faq-item");

  if (faqItems.length > 0) {
    faqItems.forEach(function (item) {
      const question = item.querySelector(".faq-question");
      question.addEventListener("click", function () {
        const isActive = item.classList.contains("active");
        faqItems.forEach(function (i) {
          i.classList.remove("active");
        });
        if (!isActive) {
          item.classList.add("active");
        }
      });
    });
  }

// ===== Contact form submit =====
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const errorMsg = document.getElementById("formError");
      const successMsg = document.getElementById("formSuccess");
      if (errorMsg) errorMsg.classList.remove("show");
      if (successMsg) successMsg.classList.remove("show");

      const name = document.getElementById("name");
      const email = document.getElementById("email");
      const phone = document.getElementById("phone");
      const eventType = document.getElementById("eventType");
      const eventDate = document.getElementById("eventDate");
      const guests = document.getElementById("guests");
      const message = document.getElementById("message");
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      function showError(text) {
        if (errorMsg) {
          errorMsg.innerHTML = '<i class="fas fa-exclamation-circle"></i> ' + text;
          errorMsg.classList.add("show");
        }
      }

      if (!name || !name.value.trim()) {
        showError("Please fill in your full name.");
        return;
      }

      if (!email || !email.value.trim()) {
        showError("Please fill in your email address.");
        return;
      }

      if (!emailRe.test(email.value.trim())) {
        showError("Please enter a valid email address.");
        return;
      }

      if (!phone || !phone.value.trim()) {
        showError("Please fill in your phone number.");
        return;
      }

      const phoneDigits = phone.value.replace(/\D/g, "");
      if (phoneDigits.length !== 10) {
        showError("Phone number must be exactly 10 digits.");
        return;
      }

      if (!eventType || !eventType.value) {
        showError("Please select an event type.");
        return;
      }

      if (!eventDate || !eventDate.value) {
        showError("Please select an event date.");
        return;
      }

      if (!guests || !guests.value.trim()) {
        showError("Please fill in the number of guests.");
        return;
      }

      if (!parseInt(guests.value, 10) || parseInt(guests.value, 10) <= 0) {
        showError("Please enter a valid number of guests (at least 1).");
        return;
      }

      if (!message || !message.value.trim()) {
        showError("Please fill in your message.");
        return;
      }

      window.location.href = "404.html";
    });
  }

// ===== Newsletter forms =====
  const newsletterForms = document.querySelectorAll(".newsletter-form, .newsletter-form-large");

  newsletterForms.forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const input = form.querySelector("input[type='email']") || form.querySelector("input");
      const value = input ? input.value.trim() : "";
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!value) {
        alert("Please enter your email address to subscribe.");
        if (input) input.focus();
        return;
      }

      if (!emailRe.test(value)) {
        alert("Please enter a valid email address.");
        if (input) input.focus();
        return;
      }

      window.location.href = "404.html";
    });
  });

  // ===== Reveal on scroll =====
  const revealElements = document.querySelectorAll(
    ".feature-card, .service-card, .dish-item, .pricing-card, .blog-card, .value-card, .team-member, .why-item, .contact-info-item, .mv-card, .timeline-item"
  );

  if (revealElements.length > 0 && "IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealElements.forEach(function (el, index) {
      el.style.opacity = "0";
      el.style.transform = "translateY(30px)";
      el.style.transition = "all 0.6s ease " + index * 0.08 + "s";
      revealObserver.observe(el);
    });
  }
});

// ===== Auth pages: password visibility toggle =====
document.querySelectorAll(".auth-password-toggle").forEach(function (btn) {
  btn.addEventListener("click", function () {
    const input = document.getElementById(this.dataset.target);
    if (!input) return;
    const type = input.type === "password" ? "text" : "password";
    input.type = type;
    this.innerHTML = type === "password"
      ? '<i class="fas fa-eye"></i>'
      : '<i class="fas fa-eye-slash"></i>';
  });
});

// ===== Password rules: min 8 chars, 1 uppercase, 1 number, 1 letter, 1 special =====
function isValidPassword(pw) {
  return (
    pw.length >= 8 &&
    /[A-Z]/.test(pw) &&
    /[a-z]/.test(pw) &&
    /[0-9]/.test(pw) &&
    /[^A-Za-z0-9]/.test(pw)
  );
}

const PASSWORD_REQUIREMENT_MSG =
  '<i class="fas fa-exclamation-circle"></i> Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and a special character.';

// ===== Sign Up: password strength meter =====
const signupPassword = document.getElementById("signupPassword");
const strengthBar = document.querySelector(".password-strength-bar");
const strengthText = document.querySelector(".password-strength-text");

if (signupPassword && strengthBar) {
  signupPassword.addEventListener("input", function () {
    const val = this.value;
    let score = 0;

    if (val.length >= 8) score++;
    if (val.length >= 12) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;

    const pct = Math.min((score / 5) * 100, 100);
    strengthBar.style.width = pct + "%";

    let label = "Too Weak";
    let color = "#d32f2f";
    if (score === 1) { label = "Weak"; color = "#ff9800"; }
    else if (score === 2) { label = "Fair"; color = "#ffc107"; }
    else if (score === 3) { label = "Good"; color = "#8bc34a"; }
    else if (score >= 4) { label = "Strong"; color = "#4caf50"; }

    strengthBar.style.background = color;
    if (strengthText) {
      strengthText.textContent = label;
      strengthText.style.color = color;
    }
  });
}

// ===== Sign Up: confirm password match =====
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const pw = document.getElementById("signupPassword");
    const confirm = document.getElementById("signupConfirm");
    const errorMsg = document.getElementById("signupError");
    const successMsg = document.getElementById("signupSuccess");

    if (errorMsg) errorMsg.classList.remove("show");
    if (successMsg) successMsg.classList.remove("show");

    const signupEmail = document.getElementById("signupEmail");
    const localEmail = signupEmail ? signupEmail.value.trim().toLowerCase() : "";
    const gmailPattern = /^[a-z0-9][a-z0-9._%+-]*@gmail\.com$/;
    if (!localEmail || !gmailPattern.test(localEmail)) {
      if (errorMsg) {
        errorMsg.innerHTML = '<i class="fas fa-exclamation-circle"></i> Email must be a valid Gmail address (name@gmail.com).';
        errorMsg.classList.add("show");
      }
      return;
    }

if (pw.value !== confirm.value) {
      if (errorMsg) {
        errorMsg.innerHTML = '<i class="fas fa-exclamation-circle"></i> Passwords do not match.';
        errorMsg.classList.add("show");
      }
      return;
    }

    if (!isValidPassword(pw.value)) {
      if (errorMsg) {
        errorMsg.innerHTML = PASSWORD_REQUIREMENT_MSG;
        errorMsg.classList.add("show");
      }
      return;
    }

    if (successMsg) {
      successMsg.innerHTML = '<i class="fas fa-check-circle"></i> Account created successfully! Redirecting...';
      successMsg.classList.add("show");
    }
    const selectedRole = document.querySelector('input[name="signupRole"]:checked');
    localStorage.setItem("StacklyUser", JSON.stringify({
      email: (document.getElementById("signupEmail") || {}).value ? document.getElementById("signupEmail").value.trim() : "",
      role: selectedRole && selectedRole.value === "admin" ? "admin" : "user"
    }));
    const redirectTo = selectedRole && selectedRole.value === "admin" ? "admindashboard.html" : "signin.html";
    setTimeout(function () {
      window.location.href = redirectTo;
    }, 1500);
  });
}

// ===== Sign In form =====
const signinForm = document.getElementById("signinForm");
if (signinForm) {
  signinForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("signinEmail");
    const password = document.getElementById("signinPassword");
    const errorMsg = document.getElementById("signinError");

    if (errorMsg) errorMsg.classList.remove("show");

    if (!email.value || !password.value) {
      if (errorMsg) {
        errorMsg.innerHTML = '<i class="fas fa-exclamation-circle"></i> Please enter both email and password.';
        errorMsg.classList.add("show");
      }
      return;
    }

    const localizedEmail = email.value.trim().toLowerCase();
    const gmailPattern = /^[a-z0-9][a-z0-9._%+-]*@gmail\.com$/;
    if (!localizedEmail || !gmailPattern.test(localizedEmail)) {
      if (errorMsg) {
        errorMsg.style.background = "";
        errorMsg.style.color = "";
        errorMsg.style.borderColor = "";
        errorMsg.innerHTML = '<i class="fas fa-exclamation-circle"></i> Email must be a valid Gmail address (name@gmail.com).';
        errorMsg.classList.add("show");
      }
      return;
    }

    if (!isValidPassword(password.value)) {
      if (errorMsg) {
        errorMsg.style.background = "";
        errorMsg.style.color = "";
        errorMsg.style.borderColor = "";
        errorMsg.innerHTML = PASSWORD_REQUIREMENT_MSG;
        errorMsg.classList.add("show");
      }
      return;
    }

    if (errorMsg) {
      errorMsg.style.background = "#e8f5e9";
      errorMsg.style.color = "#2e7d32";
      errorMsg.style.borderColor = "#a5d6a7";
      errorMsg.innerHTML = '<i class="fas fa-check-circle"></i> Signing in successfully...';
      errorMsg.classList.add("show");
    }
    const selectedRole = document.querySelector('input[name="signinRole"]:checked');
    localStorage.setItem("StacklyUser", JSON.stringify({
      email: email.value.trim(),
      role: selectedRole && selectedRole.value === "admin" ? "admin" : "user"
    }));
    const redirectTo = selectedRole && selectedRole.value === "admin" ? "admindashboard.html" : "userdashboard.html";
    setTimeout(function () {
      window.location.href = redirectTo;
    }, 1500);
  });
}

