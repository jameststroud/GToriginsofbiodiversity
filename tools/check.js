/* Safety-net check for the course website. GitHub Actions runs it on every
   change. It explains problems in plain English.

   Fails (red X) when:
     - data/course.js has a typo and cannot be read;
     - required parts of the course data are missing;
     - an image named in course.js has not been uploaded.
   Warns (yellow, does not fail) when:
     - an uploaded reading PDF has no selectable text (an image-only scan).

   Run:  npm run check */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { execFileSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const IN_ACTIONS = !!process.env.GITHUB_ACTIONS;
let errors = 0, warnings = 0;

function report(kind, message, file, line) {
  if (kind === "error") errors++; else warnings++;
  if (IN_ACTIONS) {
    const loc = file ? ` file=${file}${line ? ",line=" + line : ""}` : "";
    console.log(`::${kind}${loc}::${message}`);
  } else {
    console.log(`${kind === "error" ? "PROBLEM" : "Warning"}: ${message}`);
  }
}
const error = (m, f, l) => report("error", m, f, l);
const warn = (m, f, l) => report("warning", m, f, l);
const exists = (p) => fs.existsSync(path.join(ROOT, p));

/* ---------- 1. Can course.js be read at all? ---------- */
const FILE = "data/course.js";
const src = fs.readFileSync(path.join(ROOT, FILE), "utf8");
const lines = src.split("\n");
let C = null;
try {
  const script = new vm.Script(src, { filename: FILE });
  const sandbox = { window: {} };
  script.runInNewContext(sandbox);
  C = sandbox.window.COURSE;
} catch (e) {
  const m = String(e.stack || "").match(/data\/course\.js:(\d+)/);
  const line = m ? Number(m[1]) : null;
  const near = line ? lines[line - 1].trim().slice(0, 80) : "";
  const prev = line && line > 1 ? lines[line - 2].trim().slice(0, 80) : "";
  error(
    `course.js${line ? " line " + line : ""}: the file has a typo, so the site cannot read it. ` +
    `This is usually a missing comma or quote mark at the end of the line above, or an extra one. ` +
    (line ? `Line ${line - 1} reads: ${prev}  Line ${line} reads: ${near}  ` : "") +
    `(Technical detail: ${e.message})`,
    FILE, line
  );
  finish();
}
if (!C) { error("course.js loaded, but it no longer sets window.COURSE. The first line of content must start with: window.COURSE = {", FILE, 1); finish(); }

/* Find the line where some text appears, to point people at the right place. */
function lineOf(text) {
  if (!text) return null;
  const i = lines.findIndex((l) => l.includes(text));
  return i >= 0 ? i + 1 : null;
}

/* ---------- 2. Required parts ---------- */
const need = (cond, msg, hint) => { if (!cond) error(msg, FILE, lineOf(hint)); };
need(C.course && typeof C.course === "object", "course.js: the \"course\" section (title, term, meeting time) is missing.");
if (C.course) {
  ["title", "codes", "term", "meets", "syllabusPdf"].forEach((k) =>
    need(typeof C.course[k] === "string" && C.course[k].trim(), `course.js: the course section is missing its "${k}".`, "course: {"));
}
need(Array.isArray(C.weeks) && C.weeks.length > 0, "course.js: the list of weeks (\"weeks: [ ... ]\") is missing or empty.");
(C.weeks || []).forEach((w, wi) => {
  const label = `Week ${w && w.n != null ? w.n : "number " + (wi + 1)}`;
  const at = w && w.n != null ? `n: ${w.n},` : null;
  if (!w || typeof w.n !== "number") { error(`course.js: entry ${wi + 1} in the weeks list has no week number ("n: 5," for example).`, FILE); return; }
  need(typeof w.title === "string" && w.title.trim(), `course.js: ${label} has no title.`, at);
  need(Array.isArray(w.concepts), `course.js: ${label} is missing its "concepts" list (use concepts: [] if there are none).`, at);
  need(Array.isArray(w.readings), `course.js: ${label} is missing its "readings" list (use readings: [] if there are none).`, at);
  (w.readings || []).forEach((r, ri) => {
    const where = `${label}, reading ${ri + 1}`;
    ["authors", "title"].forEach((k) => need(r && typeof r[k] === "string" && r[k].trim(), `course.js: ${where} is missing its "${k}".`, r && r.title));
    need(r && r.year, `course.js: ${where} is missing its "year".`, r && r.title);
  });
  [["intro", w.intro]].forEach(([k, b]) => {
    if (b && b.status !== "draft" && b.status !== "approved")
      error(`course.js: ${label} ${k} has status "${b.status}". It must be exactly "draft" or "approved".`, FILE, lineOf(`status: "${b.status}"`));
  });
});

/* ---------- 3. Images named in course.js must exist ---------- */
const imgs = [];
if (C.home && C.home.banner && C.home.banner.file) imgs.push(["the home page banner", C.home.banner.file]);
(C.instructors || []).forEach((i) => i.photo && imgs.push([`${i.name}'s photo`, i.photo]));
(C.weeks || []).forEach((w) => {
  (w.images || (w.image ? [w.image] : [])).forEach((im) => im && im.file && imgs.push([`Week ${w.n} image`, im.file]));
  if (w.schematic && w.schematic.file) imgs.push([`Week ${w.n} schematic`, w.schematic.file]);
});
imgs.forEach(([what, file]) => {
  if (!exists(file)) error(`${what}: the file "${file}" was not found. Upload it with exactly that name (names are case-sensitive), or correct the file name in course.js.`, FILE, lineOf(file));
});

/* ---------- 4. Uploaded PDFs should have selectable text ---------- */
let havePdftotext = true;
try { execFileSync("pdftotext", ["-v"], { stdio: "ignore" }); } catch (e) { havePdftotext = false; }
const pdfFiles = [];
const readingsDir = path.join(ROOT, "readings");
if (fs.existsSync(readingsDir)) {
  for (const d of fs.readdirSync(readingsDir)) {
    const full = path.join(readingsDir, d);
    if (!fs.statSync(full).isDirectory()) continue;
    for (const f of fs.readdirSync(full)) if (/\.pdf$/i.test(f)) pdfFiles.push(path.join("readings", d, f));
  }
}
if (pdfFiles.length && !havePdftotext) {
  console.log("Note: pdftotext is not installed here, so PDFs were not checked for selectable text.");
} else {
  for (const f of pdfFiles) {
    let text = "";
    try { text = execFileSync("pdftotext", ["-l", "3", path.join(ROOT, f), "-"], { encoding: "utf8" }); } catch (e) { text = ""; }
    if (text.replace(/\s+/g, "").length < 100) {
      warn(`${f} looks like a scanned image with no selectable text. Screen readers cannot read it. Replace it with the publisher's text version, or run Acrobat "Scan & OCR" (see the checklist in this folder's README).`, f);
    }
  }
}
// Also flag reading PDFs with names course.js does not expect (they will never show on the site).
const expected = new Set();
(C.weeks || []).forEach((w) => (w.readings || []).forEach((r) => r.pdf && expected.add(r.pdf)));
for (const f of pdfFiles) {
  if (!expected.has(f.split(path.sep).join("/"))) warn(`${f} is not linked from any week. Check the file name against the list in that folder's README.`, f);
}

finish();

function finish() {
  console.log(errors ? `\n${errors} problem(s) found. The pages will not be rebuilt until they are fixed.` :
    `\nAll checks passed${warnings ? ` with ${warnings} warning(s)` : ""}.`);
  process.exit(errors ? 1 : 0);
}
