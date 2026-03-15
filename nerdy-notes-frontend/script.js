// Frontend script.js

document.addEventListener("DOMContentLoaded", () => {
  // THEME TOGGLE
  const toggleBtn = document.getElementById("themeToggle");

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      document.body.classList.toggle("light-mode");

      if (document.body.classList.contains("light-mode")) {
        localStorage.setItem("theme", "light");
      } else {
        localStorage.setItem("theme", "dark");
      }
    });
  }

  // APPLY SAVED THEME
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.body.classList.add("light-mode");
  }

  // FILTER + SEARCH SYSTEM
  const filterButtons = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".note-card");
  const searchInput = document.getElementById("searchInput");

  let currentFilter = "all";

function applyFilters() {
  const searchValue = searchInput.value.toLowerCase();
  const flow = document.getElementById("noteFlow");

  if(flow){
    flow.style.display = searchValue.length > 0 ? "none" : "flex";
  }

  cards.forEach((card) => {
    const category = card.getAttribute("data-category");
    const title = card.querySelector("h3").textContent.toLowerCase();

    const matchesFilter =
      currentFilter === "all" || category === currentFilter;

    const matchesSearch = title.includes(searchValue);

    if (matchesFilter && matchesSearch) {
      card.style.display = "flex";
    } else {
      card.style.display = "none";
    }
  });
}
  // Filter button click
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      currentFilter = button.getAttribute("data-filter");
      applyFilters();
    });
  });

  // Search input
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      applyFilters();
    });
  }
const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));
const welcomeText = document.getElementById("welcome-text");

if (token && user && welcomeText) {

  let displayName = user.name;

  if (displayName.length > 10) {
    displayName = displayName.substring(0,10) + "...";
  }

  const firstLetter = user.name.charAt(0).toUpperCase();

  welcomeText.innerHTML = `
    <div class="user-avatar">${firstLetter}</div>
    <span>Welcome, ${displayName}</span>
  `;
}
});

const reveals = document.querySelectorAll(".reveal");

function revealOnScroll() {
  const windowHeight = window.innerHeight;

  reveals.forEach((el) => {
    const elementTop = el.getBoundingClientRect().top;

    if (elementTop < windowHeight - 100) {
      el.classList.add("active");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);

// document.querySelectorAll(".note-card").forEach((card) => {
//   card.addEventListener("click", function (e) {
//     const circle = document.createElement("span");
//     const diameter = Math.max(card.clientWidth, card.clientHeight);
//     const radius = diameter / 2;

//     circle.style.width = circle.style.height = `${diameter}px`;
//     circle.style.left = `${e.offsetX - radius}px`;
//     circle.style.top = `${e.offsetY - radius}px`;
//     circle.classList.add("ripple");

//     const oldRipple = card.querySelector(".ripple");
//     if (oldRipple) oldRipple.remove();

//     card.appendChild(circle);

//     const link = card.getAttribute("data-link");

//     if (link) {
//       setTimeout(() => {
//         window.location.href = link;
//       }, 300);
//     }
//   });
// });

const counters = document.querySelectorAll(".counter");

function startCounters() {
  counters.forEach((counter) => {
    const target = parseInt(counter.getAttribute("data-target"));
    let current = 0;

    const increment = target / 90;

    const update = () => {
      current += increment;

      if (current < target) {
        counter.innerText = Math.floor(current);
        requestAnimationFrame(update);
      } else {
        counter.innerText = target + "+";
      }
    };

    update();
  });
}
async function loadNotes() {
  try {
    const subject = document.body.dataset.subject;

  const res = await fetch(
  `https://nerdy-notes-backend.onrender.com/api/notes?subject=${subject}`
);
    const notes = await res.json();
    const container = document.getElementById("notes-container");
    if (!container) return;
    container.innerHTML = "";

    notes.forEach((note) => {
      const card = document.createElement("div");
      card.classList.add("note-card");
      const token = localStorage.getItem("token");

card.innerHTML = `
<h3>${note.title}</h3>
<p>${note.subject}</p>

<div class="note-actions">

${
  note.isPremium
    ? `<a class="download-btn" href="premium.html">Buy ₹19</a>`
    : token
      ? `<a target="_blank" class="download-btn" href="https://nerdy-notes-backend.onrender.com${note.fileUrl}" download>Download</a>`
      : `
      <a class="preview-btn" href="../preview.html?file=${note.fileUrl}" target="_blank">Preview</a>
      <a class="login-btn" href="login.html">Login</a>
      `
}

</div>
`;
      container.appendChild(card);
    });
  } catch (error) {
    console.error("Failed to load notes", error);
  }
}

loadNotes();
window.addEventListener("load", startCounters);

const userData = JSON.parse(localStorage.getItem("user"));

if (userData && userData.role === "admin") {
  const adminBtn = document.getElementById("adminBtn");
  if (adminBtn) {
    adminBtn.style.display = "inline-block";
  }
}

//animations

document.querySelectorAll(".note-card").forEach(card => {

card.addEventListener("click", function(e){

const link = this.getAttribute("href");

if(!link) return;

e.preventDefault();

this.classList.add("tap");

setTimeout(()=>{
window.location.href = link;
},120);

});

});


