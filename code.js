// ===== Code Diary: programs.js se entries banana aur unhe run karna =====

// Code Compiler Explorer (godbolt.org) ke GCC compiler pe chalta hai
const COMPILER_URL = "https://godbolt.org/api/compiler/cg132/compile";

const diary = document.getElementById("diary");
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function escapeHTML(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function slug(p) {
  return p.date + "-" + p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
function parseDate(s) {
  const [y, m, d] = s.split("-").map(Number);
  return { y, m, d };
}

// Naye programs sabse upar
const programs = [...PROGRAMS].sort((a, b) => b.date.localeCompare(a.date));

// Stats
document.getElementById("cdStats").innerHTML = `
  <span><b>${programs.length}</b> program${programs.length === 1 ? "" : "s"}</span>
  <span><b>${new Set(programs.map(p => p.date)).size}</b> coding day${new Set(programs.map(p => p.date)).size === 1 ? "" : "s"}</span>
  <span>Last entry <b>${programs[0] ? (d => `${d.d} ${MONTHS[d.m - 1]} ${d.y}`)(parseDate(programs[0].date)) : "-"}</b></span>`;

// Entries render karo
diary.innerHTML = programs.map((p, i) => {
  const d = parseDate(p.date);
  const id = slug(p);
  const fileName = p.file.split("/").pop();
  const inputBox = p.input
    ? `<label class="run-input"><span>${escapeHTML(p.input.label)}</span>
         <textarea rows="1" spellcheck="false">${escapeHTML(p.input.value)}</textarea></label>`
    : `<p class="run-noinput">Is program ko koi input nahi chahiye.</p>`;
  return `
    <article class="entry reveal" id="${id}" data-idx="${i}">
      <div class="entry-date"><b>${d.d}</b><span>${MONTHS[d.m - 1]} <br />${d.y}</span></div>
      <div class="entry-card">
        <div class="entry-head">
          <div>
            <span class="lang-tag">C</span>
            <h2>${escapeHTML(p.title)}</h2>
            <p>${escapeHTML(p.desc)}</p>
            <div class="p-tags">${(p.tags || []).map(t => `<span>${escapeHTML(t)}</span>`).join("")}</div>
          </div>
          <a class="icon-link" href="#${id}" title="Is program ka link"><svg class="ic"><use href="#i-link"/></svg></a>
        </div>
        <div class="entry-body">
          <div class="win code-win">
            <div class="win-bar">
              <i></i><i></i><i></i>
              <span class="win-title">${escapeHTML(fileName)}</span>
              <button class="win-btn copy-btn" type="button"><svg class="ic"><use href="#i-copy"/></svg><span>Copy</span></button>
            </div>
            <pre class="code-pre"><code class="language-c">Loading code…</code></pre>
          </div>
          <div class="win run-win">
            <div class="win-bar">
              <span class="win-title">Run it yourself</span>
            </div>
            <div class="run-controls">
              ${inputBox}
              <button class="btn btn-grad run-btn" type="button" disabled><svg class="ic fill"><use href="#i-play"/></svg> Run</button>
            </div>
            <div class="terminal">
              <div class="term-head"><span>Output</span><span class="term-status"></span></div>
              <pre class="term-out"><span class="term-hint">Input daalo aur Run dabao. Output yahan aayega ✨</span></pre>
            </div>
          </div>
        </div>
      </div>
    </article>`;
}).join("") || `<p class="empty">Abhi koi program nahi hai. programs.js mein pehla program jodo!</p>`;

// Har entry ka code file se load karo
document.querySelectorAll(".entry").forEach(entry => {
  const p = programs[entry.dataset.idx];
  const codeEl = entry.querySelector("code");
  const runBtn = entry.querySelector(".run-btn");
  let source = "";

  fetch(p.file)
    .then(r => { if (!r.ok) throw new Error(r.status); return r.text(); })
    .then(text => {
      source = text;
      codeEl.textContent = text.replace(/\n$/, "");
      if (window.Prism) Prism.highlightElement(codeEl);
      addLineNumbers(entry.querySelector(".code-pre"), codeEl.textContent.split("\n").length);
      runBtn.disabled = false;
    })
    .catch(() => { codeEl.textContent = `Code load nahi hua (${p.file}). File ka naam check karo.`; });

  // Copy button
  const copyBtn = entry.querySelector(".copy-btn");
  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(source);
      copyBtn.classList.add("done");
      copyBtn.querySelector("span").textContent = "Copied!";
      copyBtn.querySelector("use").setAttribute("href", "#i-check");
      setTimeout(() => {
        copyBtn.classList.remove("done");
        copyBtn.querySelector("span").textContent = "Copy";
        copyBtn.querySelector("use").setAttribute("href", "#i-copy");
      }, 1600);
    } catch (e) { copyBtn.querySelector("span").textContent = "Copy failed"; }
  });

  // Run button
  const out = entry.querySelector(".term-out");
  const status = entry.querySelector(".term-status");
  const inputEl = entry.querySelector("textarea");
  if (inputEl) inputEl.addEventListener("keydown", e => {
    if (e.key === "Enter" && !e.shiftKey && inputEl.rows === 1) { e.preventDefault(); runBtn.click(); }
  });

  runBtn.addEventListener("click", async () => {
    const stdin = inputEl ? inputEl.value : "";
    runBtn.disabled = true;
    runBtn.classList.add("loading");
    status.className = "term-status busy";
    status.textContent = "Compiling & running…";
    out.innerHTML = `<span class="term-hint">gcc ${escapeHTML(p.file.split("/").pop())} && ./a.out</span>`;
    const started = performance.now();
    try {
      const res = await fetch(COMPILER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          source,
          lang: "c",
          options: {
            userArguments: "-O1",
            executeParameters: { args: [], stdin },
            compilerOptions: { executorRequest: true },
            filters: { execute: true },
            tools: [], libraries: [],
          },
          allowStoreCodeDebug: false,
        }),
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      const secs = ((performance.now() - started) / 1000).toFixed(1);
      const lines = arr => (arr || []).map(x => x.text).join("\n");
      const build = data.buildResult || {};
      if (build.code && build.code !== 0) {
        out.innerHTML = `<span class="term-err">${escapeHTML(lines(build.stderr) || "Compile error")}</span>`;
        status.className = "term-status err";
        status.textContent = "Compile error";
      } else {
        const stdout = lines(data.stdout);
        const stderr = lines(data.stderr);
        out.innerHTML = escapeHTML(stdout) + (stderr ? `\n<span class="term-err">${escapeHTML(stderr)}</span>` : "") +
          `\n\n<span class="term-hint">Program exited with code ${data.code}</span>`;
        status.className = "term-status " + (data.code === 0 ? "ok" : "warn");
        status.textContent = `Done in ${secs}s`;
      }
    } catch (err) {
      out.innerHTML = `<span class="term-err">Compiler se connect nahi ho paya. Internet check karke dobara try karo.</span>`;
      status.className = "term-status err";
      status.textContent = "Failed";
    } finally {
      runBtn.disabled = false;
      runBtn.classList.remove("loading");
    }
  });
});

function addLineNumbers(pre, count) {
  const gutter = document.createElement("span");
  gutter.className = "line-nums";
  gutter.setAttribute("aria-hidden", "true");
  gutter.textContent = Array.from({ length: count }, (_, i) => i + 1).join("\n");
  pre.prepend(gutter);
}

// ===== Mobile menu =====
const nav = document.getElementById("navLinks");
const menuBtn = document.getElementById("menuBtn");
menuBtn.addEventListener("click", () => { nav.classList.toggle("open"); menuBtn.classList.toggle("open"); });

// ===== Reveal, back to top, year =====
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); observer.unobserve(e.target); } });
}, { threshold: 0.08 });
document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

const header = document.querySelector(".nav");
const toTop = document.getElementById("toTop");
window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", scrollY > 10);
  toTop.classList.toggle("show", scrollY > 500);
}, { passive: true });
toTop.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));
document.getElementById("year").textContent = new Date().getFullYear();

// Link se aaye ho (#date-title) to us program tak scroll karo
if (location.hash) {
  const target = document.getElementById(location.hash.slice(1));
  if (target) setTimeout(() => target.scrollIntoView({ behavior: "smooth" }), 300);
}
