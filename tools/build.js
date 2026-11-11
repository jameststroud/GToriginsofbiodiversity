/* Builds the finished HTML for every page from data/course.js.

   It runs the site's own renderer (assets/js/site.js) inside jsdom, so there
   is only one copy of the page logic. Drafts are never written into the HTML.

   Writes:
     index.html, schedule.html, presentations.html, assessments.html,
     policies.html, concepts.html, drafts.html, 404.html,
     week.html (forwards old week.html?n=5 links), week-01.html ... week-12.html,
     data/generated-files.js (image sizes and which reading PDFs exist),
     readings/week-NN/README.md (what to upload where).

   Run:  npm run build      (GitHub Actions runs this automatically on main) */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { JSDOM } = require("jsdom");
const sizeOf = require("image-size");

const ROOT = path.resolve(__dirname, "..");
const read = (p) => fs.readFileSync(path.join(ROOT, p), "utf8");
const exists = (p) => fs.existsSync(path.join(ROOT, p));
const pad2 = (n) => (n < 10 ? "0" : "") + n;

/* ---------- 1. Load the course data ---------- */
const courseSrc = read("data/course.js");
const sandbox = { window: {} };
vm.runInNewContext(courseSrc, sandbox, { filename: "data/course.js" });
const C = sandbox.window.COURSE;
if (!C) throw new Error("data/course.js did not define window.COURSE. Run `npm run check` for details.");

/* ---------- 2. Record image sizes and uploaded PDFs ---------- */
function referencedImages() {
  const list = [];
  if (C.home && C.home.banner && C.home.banner.file) list.push(C.home.banner.file);
  (C.instructors || []).forEach((i) => i.photo && list.push(i.photo));
  (C.weeks || []).forEach((w) => {
    (w.images || (w.image ? [w.image] : [])).forEach((im) => im && im.file && list.push(im.file));
    if (w.schematic && w.schematic.file) list.push(w.schematic.file);
  });
  return [...new Set(list)];
}
const images = {};
for (const file of referencedImages()) {
  if (!exists(file)) continue;
  try {
    const d = sizeOf(path.join(ROOT, file));
    if (d.width && d.height) images[file] = [d.width, d.height];
  } catch (e) {
    console.warn(`Could not read the size of ${file}: ${e.message}`);
  }
}
const pdfs = [];
(C.weeks || []).forEach((w) => (w.readings || []).forEach((r) => { if (r.pdf && exists(r.pdf)) pdfs.push(r.pdf); }));
const SITE_FILES = { images, pdfs };
const filesSrc =
  "/* Generated automatically by tools/build.js. Do not edit by hand.\n" +
  "   Image sizes (width, height) and which reading PDFs have been uploaded. */\n" +
  "window.SITE_FILES = " + JSON.stringify(SITE_FILES, null, 2).replace(/\[\n\s+(\d+),\n\s+(\d+)\n\s+\]/g, "[$1, $2]") + ";\n";
fs.writeFileSync(path.join(ROOT, "data/generated-files.js"), filesSrc);

/* ---------- 3. Today's date in Atlanta, for "This week" ---------- */
const todayISO = new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());

/* ---------- 4. Render each page with the site's own renderer ---------- */
const siteSrc = read("assets/js/site.js");
function render(templateFile, outFile, bodyAttrs) {
  const html = read(path.join("templates", templateFile));
  const dom = new JSDOM(html, { url: "https://example.org/site/" + outFile, runScripts: "outside-only", pretendToBeVisual: false });
  const { window } = dom;
  Object.entries(bodyAttrs || {}).forEach(([k, v]) => window.document.body.setAttribute(k, v));
  window.__SITE_BUILD__ = { today: todayISO };
  window.eval(courseSrc);
  window.eval(filesSrc);
  window.eval(siteSrc);
  window.__siteBoot();
  // Build-only markers are removed so the browser starts clean.
  window.document.body.removeAttribute("data-built");
  const out = dom.serialize().replace(/^<!DOCTYPE html>/i, "<!doctype html>");
  fs.writeFileSync(path.join(ROOT, outFile), out + (out.endsWith("\n") ? "" : "\n"));
  window.close();
  return outFile;
}

const written = [];
[["index.html", "index.html"], ["schedule.html", "schedule.html"], ["presentations.html", "presentations.html"],
 ["assessments.html", "assessments.html"], ["policies.html", "policies.html"], ["concepts.html", "concepts.html"],
 ["drafts.html", "drafts.html"], ["404.html", "404.html"], ["week-redirect.html", "week.html"]]
  .forEach(([t, o]) => written.push(render(t, o)));
C.weeks.forEach((w) => written.push(render("week.html", "week-" + pad2(w.n) + ".html", { "data-week": String(w.n) })));

/* Guard: no draft text may appear in any built page. */
const drafts = [];
C.weeks.forEach((w) => {
  if (w.intro && w.intro.status !== "approved" && w.intro.text) drafts.push(w.intro.text);
  if (w.unknown && w.unknown.status !== "approved") (w.unknown.questions || []).forEach((q) => drafts.push(q));
});
const escHTML = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
for (const f of written) {
  const html = read(f);
  for (const d of drafts) {
    const probe = d.slice(0, 60);
    if (html.includes(probe) || html.includes(escHTML(probe))) throw new Error(`Draft text found in ${f}; refusing to publish drafts.`);
  }
}

/* ---------- 5. Reading folder READMEs (what to upload where) ---------- */
const CHECKLIST = [
  "## Before you upload a PDF",
  "",
  "1. **The PDF must have selectable text, not a scanned picture of the pages.** Screen readers, search and copy-paste all need real text.",
  "2. **How to check:** open the PDF and try to select a sentence with your cursor. If you can highlight words, it is fine. If the whole page selects as one picture, it is a scan.",
  "3. **How to fix a scan:** download the text-based version from the publisher's website (usually the best option); or in Adobe Acrobat use **Scan & OCR** (or **Accessibility → Make accessible**); or ask Georgia Tech's accessibility services for help.",
  "4. Name the file exactly as listed below, then upload it here (**Add file → Upload files**).",
  "",
  "The automatic site check also warns about image-only PDFs after you upload.",
  ""
].join("\n");
C.weeks.forEach((w) => {
  const dir = "readings/week-" + pad2(w.n);
  if (!exists(dir)) fs.mkdirSync(path.join(ROOT, dir), { recursive: true });
  let s = "> **" + C.pdfNotice + "**\n\n# Week " + w.n + " readings: " + w.title + "\n\n";
  if (!w.readings.length) {
    s += "No readings this week (final oral exam). This folder is kept so the structure matches the schedule.\n";
  } else {
    s += CHECKLIST + "\n";
    s += "| # | Reading | Filename to upload |\n|---|---|---|\n";
    w.readings.forEach((r, i) => {
      const file = r.pdf ? "`" + r.pdf.split("/").pop() + "`" + (exists(r.pdf) ? " (uploaded)" : "")
        : "Reading still TBD. When it is chosen, add a `pdf` path in `data/course.js` (for example `" + dir + "/wallace-1876.pdf`) and remove `tbd: true`.";
      s += "| " + (i + 1) + " | " + r.authors + " (" + r.year + "). " + r.title + ". " + r.source + " | " + file + " |\n";
    });
  }
  fs.writeFileSync(path.join(ROOT, dir, "README.md"), s);
});

console.log(`Built ${written.length} pages for ${todayISO}: ${written.join(", ")}`);
