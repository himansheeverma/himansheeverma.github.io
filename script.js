// ===== Typing animation (✏️ yahan apne roles badlo) =====
const roles = ["B.Tech Student 🎓", "Web Developer 🌐", "Problem Solver 🧩", "Lifelong Learner 📚"];
const typedEl = document.getElementById("typed");
let roleIdx = 0, charIdx = 0, deleting = false;

function typeLoop() {
  const word = roles[roleIdx];
  typedEl.textContent = word.slice(0, charIdx);
  if (!deleting && charIdx < word.length) charIdx++;
  else if (deleting && charIdx > 0) charIdx--;
  else if (!deleting) { deleting = true; return setTimeout(typeLoop, 1400); }
  else { deleting = false; roleIdx = (roleIdx + 1) % roles.length; }
  setTimeout(typeLoop, deleting ? 45 : 90);
}
typeLoop();

// ===== Projects render + filter =====
const COLORS = ["#ffc2dc", "#ffe58f", "#bfe0ff", "#b5f2d6", "#e2d4ff", "#ffd3b0"];
const LABELS = { all: "All ✨", web: "Web 🌐", python: "Python 🐍", c: "C 🔵", game: "Games 🎮", other: "Other 🧪" };
const grid = document.getElementById("projectsGrid");
const filtersEl = document.getElementById("filters");

function escapeHTML(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function renderProjects(filter = "all") {
  const list = filter === "all" ? PROJECTS : PROJECTS.filter(p => p.category === filter);
  grid.innerHTML = list.map((p, i) => {
    const links = [
      p.github ? `<a href="${escapeHTML(p.github)}" target="_blank" rel="noopener">Code</a>` : "",
      p.live ? `<a href="${escapeHTML(p.live)}" target="_blank" rel="noopener">Live ↗</a>` : "",
    ].join("");
    return `
      <article class="card project" style="animation-delay:${i * 60}ms">
        <div class="p-top" style="background:${COLORS[PROJECTS.indexOf(p) % COLORS.length]}">
          ${escapeHTML(p.emoji || "💡")}
          <span class="p-status">${p.status === "done" ? "✅ Done" : "🚧 Building"}</span>
        </div>
        <div class="p-body">
          <h3>${escapeHTML(p.title)}</h3>
          <p>${escapeHTML(p.desc)}</p>
          <div class="p-tags">${(p.tags || []).map(t => `<span>${escapeHTML(t)}</span>`).join("")}</div>
          <div class="p-links">${links || '<span class="soon">Links coming soon…</span>'}</div>
        </div>
      </article>`;
  }).join("") || `<p class="section-sub">Is category mein abhi koi project nahi hai. Jaldi aayega! 🚀</p>`;
}

function renderFilters() {
  const cats = ["all", ...new Set(PROJECTS.map(p => p.category))];
  filtersEl.innerHTML = cats.map(c =>
    `<button class="filter-btn${c === "all" ? " active" : ""}" data-cat="${c}">${LABELS[c] || c}</button>`
  ).join("");
  filtersEl.addEventListener("click", e => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;
    filtersEl.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderProjects(btn.dataset.cat);
  });
}

renderFilters();
renderProjects();

// Project count animation
const countEl = document.getElementById("projCount");
let n = 0;
const countTimer = setInterval(() => {
  countEl.textContent = n;
  if (n++ >= PROJECTS.length) clearInterval(countTimer);
}, 120);

// ===== Mobile menu =====
const nav = document.getElementById("navLinks");
document.getElementById("menuBtn").addEventListener("click", () => nav.classList.toggle("open"));
nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));

// ===== Scroll reveal + skill bars =====
document.querySelectorAll(".section, .t-item").forEach(el => el.classList.add("reveal"));
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("visible");
    entry.target.querySelectorAll(".skill").forEach(s => {
      s.querySelector(".bar i").style.width = s.dataset.level + "%";
    });
    observer.unobserve(entry.target);
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

// ===== Back to top + footer year =====
const toTop = document.getElementById("toTop");
window.addEventListener("scroll", () => toTop.classList.toggle("show", window.scrollY > 500));
toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
document.getElementById("year").textContent = new Date().getFullYear();
