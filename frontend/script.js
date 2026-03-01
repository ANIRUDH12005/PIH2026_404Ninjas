// Dark Mode
const toggle = document.getElementById("themeToggle");
toggle.onclick = () => {
    document.body.classList.toggle("dark");
    toggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
};

// Smooth Scroll
function scrollToForm() {
    document.getElementById("form").scrollIntoView({ behavior: "smooth" });
}

// Backend Integration
const eligibilityForm = document.getElementById("eligibilityForm");

eligibilityForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const age = parseInt(document.getElementById("age").value);
    const income = parseInt(document.getElementById("income").value);
    const occupation = document.getElementById("occupation").value;
    const state = document.getElementById("state").value;

    try {
        const response = await fetch("http://127.0.0.1:8000/check", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ age, income, occupation, state })
        });

        const data = await response.json();

        console.log("Backend Response:", data);

        if (data.status === "Success" && data.best_scheme) {

            const scheme = data.best_scheme;

            document.getElementById("resultScheme").innerText =
                `Best Scheme: ${scheme.scheme_name} (${scheme.eligible ? "Eligible ✅" : "Not Eligible ❌"})`;

            document.getElementById("resultReason").innerText =
                scheme.reason;

            document.getElementById("resultScore").innerText =
                scheme.eligibility_score;

            document.getElementById("resultConfidence").innerText =
                data.confidence;

            const docsList = document.getElementById("resultDocs");
            docsList.innerHTML = "";

            if (scheme.required_documents && scheme.required_documents.length > 0) {
                scheme.required_documents.forEach(doc => {
                    const li = document.createElement("li");
                    li.innerText = doc;
                    docsList.appendChild(li);
                });
            } else {
                const li = document.createElement("li");
                li.innerText = "No specific documents mentioned.";
                docsList.appendChild(li);
            }

            document.getElementById("resultSection").style.display = "block";
            document.getElementById("resultSection").scrollIntoView({ behavior: "smooth" });

        } else {
            alert("No matching schemes found.");
        }

    } catch (error) {
        console.error("Error:", error);
        alert("Backend connection failed. Open browser console (F12) to see error.");
    }
});

// Reveal Animation
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = "translateY(0)";
        }
    });
});

document.querySelectorAll(".card, .scheme-card").forEach(el => {
    el.style.opacity = 0;
    el.style.transform = "translateY(40px)";
    el.style.transition = "0.6s ease-out";
    observer.observe(el);
});