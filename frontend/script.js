// Dark Mode
const toggle = document.getElementById("themeToggle");
toggle.onclick = () => {
    document.body.classList.toggle("dark");
    toggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
};

// Login Modal
function toggleModal() {
    const modal = document.getElementById("loginModal");
    modal.style.display = (modal.style.display === "flex") ? "none" : "flex";
}

// Global Close for Modal
window.onclick = (e) => {
    const modal = document.getElementById("loginModal");
    if (e.target == modal) modal.style.display = "none";
};

// Smooth Scroll
function scrollToForm() {
    document.getElementById("form").scrollIntoView({ behavior: "smooth" });
}

// AI Result Simulation
const eligibilityForm = document.getElementById("eligibilityForm");
if(eligibilityForm) {
    eligibilityForm.addEventListener("submit", e => {
        e.preventDefault();
        alert("🤖 Analyzing eligibility...");
        setTimeout(() => {
            alert("Match Found! You qualify for 5 schemes.");
            document.getElementById("dashboard").scrollIntoView({ behavior: "smooth" });
        }, 1500);
    });
}

// Reveal Animation
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = "translateY(0)";
        }
    });
});

document.querySelectorAll(".card, .scheme-card, .testimonial").forEach(el => {
    el.style.opacity = 0;
    el.style.transform = "translateY(40px)";
    el.style.transition = "0.6s ease-out";
    observer.observe(el);
});