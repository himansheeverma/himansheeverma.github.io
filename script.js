// ===== Typing animation (✏️ yahan apne roles badlo) =====
const roles = ["Web Developer", "Problem Solver", "C & Python Coder", "Lifelong Learner"];
const typedEl = document.getElementById("typed");
let roleIdx = 0, charIdx = 0, deleting = false;

function typeLoop() {
  const word = roles[roleIdx];
  typedEl.textContent = word.slice(0, charIdx);
  if (!deleting && charIdx < word.length) charIdx++;
  else if (deleting && charIdx > 0) charIdx--;
  else if (!deleting) { deleting = true; return setTimeout(typeLoop, 1500); }
  else { deleting = false; roleIdx = (roleIdx + 1) % roles.length; }
  setTimeout(typeLoop, deleting ? 45 : 90);
}
typeLoop();

// ===== Project thumbnails ke colour themes (code se bani images) =====
// bg = background, card = mock window, fg = heading, ac = accent, line = text lines
const THEMES = [
  { bg: "linear-gradient(135deg,#1b1856,#3b2a9a)", card: "#14123d", fg: "#ffffff", ac: "#8b6bff", line: "rgba(255,255,255,.18)" },
  { bg: "linear-gradient(135deg,#eef0ff,#dcd6ff)", card: "#ffffff", fg: "#14123d", ac: "#6d3cf5", line: "#e6e3f5" },
  { bg: "linear-gradient(135deg,#0f1a14,#1d3a28)", card: "#111d16", fg: "#f3efe2", ac: "#e0a340", line: "rgba(255,255,255,.15)" },
  { bg: "linear-gradient(135deg,#fff1e6,#ffd9c2)", card: "#ffffff", fg: "#3a1f12", ac: "#ff7a45", line: "#f3e6dc" },
  { bg: "linear-gradient(135deg,#e3f8ef,#c4eedb)", card: "#ffffff", fg: "#0f3326", ac: "#1fae5f", line: "#dcefe6" },
  { bg: "linear-gradient(135deg,#121630,#22305f)", card: "#0e1228", fg: "#ffffff", ac: "#4fb3ff", line: "rgba(255,255,255,.16)" },
];
const LABELS = { all: "All", web: "Web", python: "Python", c: "C", game: "Games", other: "Other" };
const CAT_NAMES = { web: "Web Development", python: "Python", c: "C Programming", game: "Game", other: "Experiment" };
const grid = document.getElementById("projectsGrid");
const filtersEl = document.getElementById("filters");

function escapeHTML(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

const ARROW = `<svg class="ic"><use href="#i-arrow"/></svg>`;

function renderProjects(filter = "all") {
  const list = filter === "all" ? PROJECTS : PROJECTS.filter(p => p.category === filter);
  grid.innerHTML = list.map((p, i) => {
    const idx = PROJECTS.indexOf(p);
    const t = THEMES[idx % THEMES.length];
    const done = p.status === "done";
    const mainLink = p.live || p.github;
    const links = [
      p.github ? `<a href="${escapeHTML(p.github)}" target="_blank" rel="noopener">Source code</a>` : "",
      p.live ? `<a href="${escapeHTML(p.live)}" target="_blank" rel="noopener">Live demo</a>` : "",
    ].join("");
    const go = mainLink
      ? `<a class="p-go" href="${escapeHTML(mainLink)}" target="_blank" rel="noopener" aria-label="Open ${escapeHTML(p.title)}">${ARROW}</a>`
      : `<span class="p-go" title="Links coming soon">${ARROW}</span>`;
    return `
      <article class="project" style="animation-delay:${i * 70}ms">
        <div class="thumb" style="--t-bg:${t.bg};--t-card:${t.card};--t-fg:${t.fg};--t-ac:${t.ac};--t-line:${t.line}">
          <span class="p-status${done ? "" : " building"}"><i></i>${done ? "Completed" : "In progress"}</span>
          <div class="mock">
            <div class="mock-bar"><i></i><i></i><i></i><span></span></div>
            <div class="mock-body">
              <div class="mock-text"><b>${escapeHTML(p.title)}</b><span class="ln"></span><span class="ln short"></span><span class="mbtn"></span></div>
              <div class="mock-art">${escapeHTML(p.emoji || "💡")}</div>
            </div>
          </div>
        </div>
        <div class="p-body">
          <div class="p-head">
            <div><h3>${escapeHTML(p.title)}</h3><span class="p-cat">${CAT_NAMES[p.category] || escapeHTML(p.category)}</span></div>
            ${go}
          </div>
          <p>${escapeHTML(p.desc)}</p>
          <div class="p-tags">${(p.tags || []).map(t => `<span>${escapeHTML(t)}</span>`).join("")}</div>
          ${links ? `<div class="p-links">${links}</div>` : ""}
        </div>
      </article>`;
  }).join("") || `<p class="empty">Is category mein abhi koi project nahi hai. Jaldi aayega!</p>`;
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

// ===== Skill % labels =====
document.querySelectorAll(".service").forEach(s => {
  s.querySelector("h3").insertAdjacentHTML("beforeend", `<small>${s.dataset.level}%</small>`);
});

// ===== Mobile menu =====
const nav = document.getElementById("navLinks");
const menuBtn = document.getElementById("menuBtn");
menuBtn.addEventListener("click", () => {
  nav.classList.toggle("open");
  menuBtn.classList.toggle("open");
});
nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
  nav.classList.remove("open");
  menuBtn.classList.remove("open");
}));

// ===== Scroll reveal + skill bars + project counter =====
const countEl = document.getElementById("projCount");
function countUp() {
  let n = 0;
  const timer = setInterval(() => {
    countEl.textContent = n;
    if (n++ >= PROJECTS.length) clearInterval(timer);
  }, 120);
}

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("visible");
    entry.target.querySelectorAll(".service").forEach(s => {
      s.querySelector(".bar i").style.width = s.dataset.level + "%";
    });
    if (entry.target.contains(countEl)) countUp();
    observer.unobserve(entry.target);
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

// ===== Active nav link on scroll =====
const sections = ["home", "projects", "skills", "journey", "contact"].map(id => document.getElementById(id));
const navLinks = nav.querySelectorAll("a");
const header = document.querySelector(".nav");
const toTop = document.getElementById("toTop");

window.addEventListener("scroll", () => {
  const y = window.scrollY;
  header.classList.toggle("scrolled", y > 10);
  toTop.classList.toggle("show", y > 500);
  let current = "home";
  sections.forEach(sec => { if (sec && sec.offsetTop - 140 <= y) current = sec.id; });
  if (window.innerHeight + y >= document.body.scrollHeight - 4) current = "contact";
  navLinks.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + current));
}, { passive: true });

toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
document.getElementById("year").textContent = new Date().getFullYear();
