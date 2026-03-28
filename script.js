// script.js - Fixed Clickable Navigation
document.addEventListener("DOMContentLoaded", function () {
    // ========== FIXED: SMOOTH SCROLLING FOR ALL NAVIGATION LINKS ==========
    // Select all navigation links that point to sections
    const allNavLinks = document.querySelectorAll('.nav__bar a, .btn__box a');

    allNavLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Check if it's an internal section link (starts with #)
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    // Smooth scroll to target with offset for header
                    const offset = 80;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // Update URL without jumping
                    history.pushState(null, null, href);
                }
            }
            // External links (like GitHub) will work normally
        });
    });

    // ========== SECTION APPEARANCE ANIMATION ==========
    const sections = document.querySelectorAll('.fade-section');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                if (entry.target.id === 'skills') {
                    animateSkillBars();
                }
            }
        });
    }, {
        threshold: 0.2
    });

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Initial check for visible sections
    setTimeout(() => {
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight - 100 && rect.bottom > 0) {
                section.classList.add('visible');
                if (section.id === 'skills') {
                    animateSkillBars();
                }
            }
        });
    }, 200);

    // ========== SKILL BAR ANIMATION ==========
    let skillsAnimated = false;

    function animateSkillBars() {
        if (skillsAnimated) return;

        const skillBars = document.querySelectorAll(".skill-per");

        skillBars.forEach(bar => {
            const percentage = parseInt(bar.getAttribute("data-percent"));
            const tooltip = bar.querySelector(".tooltip");
            const percentageSpan = bar.closest(".skill-box")?.querySelector(".skill-percentage");

            bar.style.width = percentage + "%";

            let count = 0;
            const duration = 1500;
            const intervalTime = 20;
            const steps = duration / intervalTime;
            const increment = percentage / steps;

            const updateTooltip = setInterval(() => {
                if (count >= percentage) {
                    clearInterval(updateTooltip);
                    if (tooltip) tooltip.textContent = percentage + "%";
                    if (percentageSpan) percentageSpan.textContent = percentage + "%";
                } else {
                    count = Math.min(count + increment, percentage);
                    const displayCount = Math.floor(count);
                    if (tooltip) tooltip.textContent = displayCount + "%";
                    if (percentageSpan) percentageSpan.textContent = displayCount + "%";
                }
            }, intervalTime);
        });

        skillsAnimated = true;
    }

    // ========== TYPING EFFECT ==========
    const typingSpan = document.querySelector(".typing-span");
    if (typingSpan) {
        const words = ["Frontend Web Developer", "Web Designer", "UI/UX Enthusiast", "Problem Solver"];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function typeEffect() {
            const currentWord = words[wordIndex];
            if (isDeleting) {
                typingSpan.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingSpan.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
            }

            if (!isDeleting && charIndex === currentWord.length) {
                isDeleting = true;
                setTimeout(typeEffect, 2000);
                return;
            }

            if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                setTimeout(typeEffect, 500);
                return;
            }

            const speed = isDeleting ? 50 : 100;
            setTimeout(typeEffect, speed);
        }

        setTimeout(typeEffect, 1000);
    }

    // ========== CONTACT FORM ==========
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyvZtyPtwu8gibwPwlqam4KiYx8OUB3sLcBxF_WQmic7XJqwst0wqS4MYtI2UcjHm4Q5Q/exec";
    const contactForm = document.getElementById("contactForm");

    if (contactForm) {
        contactForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            document.getElementById("formMessage").innerHTML = "";
            document.getElementById("nameError").innerHTML = "";
            document.getElementById("emailError").innerHTML = "";
            document.getElementById("messageError").innerHTML = "";

            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const message = document.getElementById("message").value.trim();

            let isValid = true;
            if (!name) {
                document.getElementById("nameError").innerHTML = "Name is required";
                isValid = false;
            }
            if (!email) {
                document.getElementById("emailError").innerHTML = "Email is required";
                isValid = false;
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                document.getElementById("emailError").innerHTML = "Valid email required";
                isValid = false;
            }
            if (!message) {
                document.getElementById("messageError").innerHTML = "Message is required";
                isValid = false;
            }

            if (!isValid) return;

            const submitBtn = document.getElementById("submitBtn");
            submitBtn.disabled = true;
            submitBtn.innerHTML = "Sending... <i class='fas fa-spinner fa-pulse'></i>";
            document.getElementById("formMessage").innerHTML = '<div class="success-message">Sending your message...</div>';

            try {
                const formData = new URLSearchParams();
                formData.append("name", name);
                formData.append("email", email);
                formData.append("message", message);

                const response = await fetch(SCRIPT_URL, {
                    method: "POST",
                    body: formData
                });

                const result = await response.text();

                if (result === "Success") {
                    document.getElementById("formMessage").innerHTML = '<div class="success-message">✓ Message sent successfully! Thank you.</div>';
                    contactForm.reset();
                    setTimeout(() => {
                        document.getElementById("formMessage").innerHTML = "";
                    }, 5000);
                } else {
                    throw new Error("Server error");
                }
            } catch (error) {
                console.error("Error:", error);
                document.getElementById("formMessage").innerHTML = '<div class="error-message-display">❌ Failed to send. Please try again later.</div>';
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = "Send Message <i class='fas fa-paper-plane'></i>";
            }
        });
    }

    // Re-animate skills if needed
    const skillsSection = document.getElementById("skills");
    if (skillsSection) {
        const reanimateObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !skillsAnimated) {
                    animateSkillBars();
                }
            });
        }, { threshold: 0.5 });
        reanimateObserver.observe(skillsSection);
    }

    // Active link highlighting on scroll
    const sections2 = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', function () {
        let current = '';
        const scrollPosition = window.scrollY + 100;

        sections2.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.nav__bar a').forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
});
