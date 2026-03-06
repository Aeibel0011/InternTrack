// ================= COUNTER =================
const counters = document.querySelectorAll('.counter');
let started = false;

window.addEventListener('scroll', () => {
  const stats = document.getElementById('stats');
  if (!stats) return;

  const top = stats.getBoundingClientRect().top;
  if (top < window.innerHeight && !started) {
    counters.forEach(counter => {
      const target = +counter.dataset.target;
      let count = 0;

      const interval = setInterval(() => {
        count += Math.ceil(target / 100);
        if (count >= target) {
          counter.innerText = target + "+";
          clearInterval(interval);
        } else {
          counter.innerText = count;
        }
      }, 20);
    });
    started = true;
  }
});

// ================= NAVBAR SCROLL =================
const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 20);
});

// ================= MOBILE MENU =================
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

menuToggle.addEventListener("click", () => {
  navMenu.classList.toggle("open");
});

// ================= TESTIMONIAL =================
const testimonials = [
  { text: "This system made my internship journey smooth and stress-free!", author: "Student" },
  { text: "Tracking students has never been this easy.", author: "Mentor" },
  { text: "Perfect solution for managing internships efficiently.", author: "Coordinator" }
];

let index = 0;
setInterval(() => {
  index = (index + 1) % testimonials.length;
  document.getElementById("testimonial-text").innerText = testimonials[index].text;
  document.getElementById("testimonial-author").innerText = "– " + testimonials[index].author;
}, 4000);


// ================= ROLE SELECTION =================
const roleCards = document.querySelectorAll(".role-card");

if (roleCards.length > 0) {
  const params = new URLSearchParams(window.location.search);
  const mode = params.get("mode") || "login";

  roleCards.forEach(card => {
    card.addEventListener("click", () => {
      const role = card.dataset.role;
      window.location.href = `/${role}/${mode}`;
    });
  });
}
