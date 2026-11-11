/* Origins of Biodiversity: shared renderer.
   Reads window.COURSE (data/course.js) and builds every page.
   The same file runs in two places:
   - in the browser, where it refreshes each page on load (date-dependent
     parts such as "This week", and drafts when ?drafts=1 is in the address);
   - at build time (tools/build.js, in Node with jsdom), where it writes the
     finished HTML so pages work without JavaScript. Drafts are never built.
   No editing needed here for routine course changes. */
(function () {
  "use strict";

  var C = window.COURSE;
  var BUILD = window.__SITE_BUILD__ || null;      // set only by tools/build.js
  var FILES = window.SITE_FILES || null;          // data/generated-files.js
  var params = new URLSearchParams(window.location.search);
  var SHOW_DRAFTS = !BUILD && params.get("drafts") === "1";
  var IS_HTTP = /^https?:$/.test(window.location.protocol);

  /* ---------- Small helpers ---------- */
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  // Escapes text, then turns {link:URL|label} into a link and
  // {email:Name|label} into a mailto: link for the instructor whose name contains Name.
  function rich(s) {
    return esc(s)
      .replace(/\{link:([^|}]+)\|([^}]+)\}/g, function (_, url, label) {
        return '<a href="' + url + '">' + label + "</a>";
      })
      .replace(/\{email:([^|}]+)\|([^}]+)\}/g, function (_, who, label) {
        var person = C.instructors.filter(function (i) { return i.name.indexOf(who) >= 0; })[0];
        return person ? '<a href="mailto:' + esc(person.email) + '">' + label + "</a>" : label;
      });
  }
  function $(sel) { return document.querySelector(sel); }
  function slug(s) {
    return "c-" + String(s).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }
  function conceptKey(s) { return String(s).toLowerCase().trim(); }
  function pad2(n) { return (n < 10 ? "0" : "") + n; }
  var ARROW_L = '<span aria-hidden="true">←</span> ';
  var ARROW_R = ' <span aria-hidden="true">→</span>';

  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  function parseDate(iso) {
    if (!iso) return null;
    var p = iso.split("-").map(Number);
    return new Date(p[0], p[1] - 1, p[2]);
  }
  function addDays(d, n) { var x = new Date(d.getTime()); x.setDate(x.getDate() + n); return x; }
  function fmt(iso) {
    var d = parseDate(iso);
    return d ? DAYS[d.getDay()] + " " + MONTHS[d.getMonth()] + " " + d.getDate() : "TBA";
  }
  function weekDates(w) {
    if (w.datesLabel) return w.datesLabel;
    return fmt(w.tue) + " and " + fmt(w.thu);
  }

  // "Today": the build date at build time; in the browser it can be faked
  // for testing with ?today=YYYY-MM-DD
  function today() {
    if (BUILD && BUILD.today) return parseDate(BUILD.today);
    var t = params.get("today");
    if (t && /^\d{4}-\d{2}-\d{2}$/.test(t)) return parseDate(t);
    var n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), n.getDate());
  }

  // Keep ?drafts=1 and ?today= on internal links so previews stay in preview mode.
  function carry(href) {
    var extra = [];
    if (SHOW_DRAFTS) extra.push("drafts=1");
    if (!BUILD && params.get("today")) extra.push("today=" + encodeURIComponent(params.get("today")));
    if (!extra.length) return href;
    var hash = "";
    var i = href.indexOf("#");
    if (i >= 0) { hash = href.slice(i); href = href.slice(0, i); }
    return href + (href.indexOf("?") >= 0 ? "&" : "?") + extra.join("&") + hash;
  }
  // "Rosindell, J., Hubbell, S.P. & Etienne, R.S." becomes "Rosindell et al."
  function shortAuthors(a) {
    var first = a.split(",")[0].trim();
    if (/et al\./.test(a)) return first + " et al.";
    var parts = a.split(" & ");
    if (parts.length < 2) return first;
    var n = (parts[0].match(/\.,/g) || []).length + 2;
    return n === 2 ? first + " and " + parts[1].split(",")[0].trim() : first + " et al.";
  }
  function authorYear(r) { return shortAuthors(r.authors) + " (" + r.year + ")"; }
  // Each week has its own page: week-01.html ... week-12.html
  function weekFile(n) { return "week-" + pad2(n) + ".html"; }
  function weekHref(n) { return carry(weekFile(n)); }

  function themeColor(key) { return (C.themes[key] || {}).color || "#2F5D50"; }
  function themeLabel(w) { return w.theme !== "exam" && C.themes[w.theme] ? C.themes[w.theme].label : ""; }
  function getWeek(n) {
    for (var i = 0; i < C.weeks.length; i++) if (C.weeks[i].n === n) return C.weeks[i];
    return null;
  }
  function datedWeeks() { return C.weeks.filter(function (w) { return w.tue && w.thu; }); }
  // A week runs from the Sunday before its Tuesday through the Saturday after its Thursday.
  function weekStart(w) { return addDays(parseDate(w.tue), -2); }
  function weekEnd(w) { return addDays(parseDate(w.thu), 2); }

  /* Where are we in the semester? */
  function semesterStatus() {
    var t = today();
    var ws = datedWeeks();
    if (!ws.length) return { kind: "upcoming", week: C.weeks[0] };
    if (t < weekStart(ws[0])) return { kind: "upcoming", week: ws[0] };
    for (var i = 0; i < ws.length; i++) {
      if (t >= weekStart(ws[i]) && t <= weekEnd(ws[i])) return { kind: "current", week: ws[i] };
    }
    var brk = (C.noClass || [])[0];
    if (brk && brk.start && t >= addDays(parseDate(brk.start), -1) && t <= addDays(parseDate(brk.end), 1)) {
      var next = ws.filter(function (w) { return weekStart(w) > t; })[0];
      return { kind: "break", item: brk, next: next };
    }
    if (t > weekEnd(ws[ws.length - 1])) {
      var exam = C.weeks.filter(function (w) { return w.isExam; })[0];
      return { kind: "final", week: exam };
    }
    var up = ws.filter(function (w) { return weekStart(w) > t; })[0];
    return { kind: "upcoming", week: up };
  }

  function isApproved(block) { return block && block.status === "approved"; }
  function visible(block) { return block && (isApproved(block) || SHOW_DRAFTS); }
  function draftBadge(block) {
    return isApproved(block) ? "" : '<span class="draft-badge">DRAFT, not visible to students</span><br>';
  }

  /* ---------- Known files (from data/generated-files.js) ---------- */
  function imageSize(path) { return FILES && FILES.images ? FILES.images[path] : null; }
  function imageKnownMissing(path) { return !!(FILES && FILES.images && !FILES.images[path]); }
  function pdfKnown(path) { return !!(FILES && FILES.pdfs && FILES.pdfs.indexOf(path) >= 0); }
  function dims(path) {
    var d = imageSize(path);
    return d ? ' width="' + d[0] + '" height="' + d[1] + '"' : "";
  }

  /* ---------- Icons (inline SVG, no libraries) ---------- */
  var ICON = {
    pdf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M8.5 16.5v-4h1.2a1.2 1.2 0 0 1 0 2.4H8.5M13 12.5v4h.8a1.6 1.6 0 0 0 1.6-1.6v-.8a1.6 1.6 0 0 0-1.6-1.6zM17.5 12.5h-1.5v4M16 14.5h1.2"/></svg>',
    link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></svg>',
    help: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>'
  };

  /* ---------- Site chrome: announcement, header, nav, footer ---------- */
  var NAV = [
    ["home", "index.html", "Home"],
    ["schedule", "schedule.html", "Schedule"],
    ["presentations", "presentations.html", "Presentations"],
    ["assessments", "assessments.html", "Assessments"],
    ["policies", "policies.html", "Policies"],
    ["concepts", "concepts.html", "Concepts"]
  ];

  function renderChrome(page) {
    var header = $("#site-header");
    if (header) {
      var navSection = page === "week" || page === "weekredirect" ? "schedule" : page;
      var items = NAV.map(function (n) {
        var cur = n[0] === navSection ? (page === n[0] ? ' aria-current="page"' : ' aria-current="true"') : "";
        return '<li><a href="' + n[1] + '"' + cur + ">" + n[2] + "</a></li>";
      }).join("");
      var ann = "";
      if (C.announcement && C.announcement.show && C.announcement.text) {
        ann = '<div class="announcement" role="region" aria-label="Announcement"><div class="wrap"><p>' + rich(C.announcement.text) + "</p></div></div>";
      }
      header.innerHTML =
        '<a class="skip-link" href="#main">Skip to content</a>' + ann +
        '<header class="site-header"><div class="wrap header-inner">' +
        '<a class="brand" href="index.html"><span class="brand-title">' + esc(C.course.title) + '</span>' +
        '<span class="brand-sub">' + esc(C.course.codes) + " · " + esc(C.course.term) + "</span></a>" +
        '<button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">Menu</button>' +
        '<nav class="site-nav" id="site-nav" aria-label="Main"><ul>' + items + "</ul></nav>" +
        "</div></header>";
      if (!BUILD) wireMenu(header);
    }
    var footer = $("#site-footer");
    if (footer) {
      var contact = C.instructors.map(function (i) {
        return '<a href="mailto:' + esc(i.email) + '">' + esc(i.name) + "</a>";
      }).join(" and ");
      footer.innerHTML =
        '<footer class="site-footer"><div class="wrap">' +
        "<p><strong>" + esc(C.course.codes) + " · " + esc(C.course.title) + " · " + esc(C.course.term) + "</strong></p>" +
        "<p>Contact " + contact + (C.course.canvasUrl ? ' · <a href="' + esc(C.course.canvasUrl) + '">Canvas</a>' : "") + "</p>" +
        '<p><a href="' + esc(C.course.syllabusPdf) + '">Syllabus (PDF)</a> · Last updated ' + esc(C.course.lastUpdated) + "</p>" +
        "</div></footer>";
    }
  }
  // Phone menu: toggle with the button; Escape closes it and returns focus to the button.
  function wireMenu(header) {
    var btn = header.querySelector(".nav-toggle");
    var nav = header.querySelector(".site-nav");
    function setOpen(open) {
      nav.classList.toggle("open", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    }
    btn.addEventListener("click", function () { setOpen(!nav.classList.contains("open")); });
    header.addEventListener("keydown", function (e) {
      if ((e.key === "Escape" || e.key === "Esc") && nav.classList.contains("open")) {
        setOpen(false);
        btn.focus();
      }
    });
  }
  function backToTop() { return '<p class="to-top"><a href="#top">Back to top</a></p>'; }

  /* ---------- Images: sized, linked to the full file, hidden when missing ---------- */
  function figureHTML(img, cls) {
    if (!img || !img.file || imageKnownMissing(img.file)) return "";
    var cap = "";
    if (img.caption || img.credit) {
      cap = "<figcaption>" + esc(img.caption) + (img.credit ? '<span class="credit">' + esc(img.credit) + "</span>" : "") + "</figcaption>";
    }
    var alt = img.alt || img.caption || "";
    return '<figure class="figure-img ' + (cls || "") + '" data-hide-if-missing>' +
      '<a class="img-link" href="' + esc(img.file) + '"><span class="visually-hidden">Open full-size image: </span>' +
      '<img src="' + esc(img.file) + '" alt="' + esc(alt) + '"' + dims(img.file) + ' loading="lazy"></a>' + cap + "</figure>";
  }
  function wireMissingImages(root) {
    (root || document).querySelectorAll("[data-hide-if-missing] img").forEach(function (im) {
      function hide() { var f = im.closest("[data-hide-if-missing]"); if (f) f.hidden = true; }
      if (im.complete && im.naturalWidth === 0 && im.getAttribute("src")) hide();
      im.addEventListener("error", hide);
    });
    (root || document).querySelectorAll("img[data-avatar]").forEach(function (im) {
      function swap() { var a = im.parentNode; if (!a) return; a.removeChild(im); a.textContent = a.getAttribute("data-initials"); }
      im.addEventListener("error", swap);
    });
  }

  /* ---------- Readings ---------- */
  function citationHTML(r) {
    var title = esc(r.title);
    if (!/[?.!]$/.test(r.title)) title += ".";
    var s = esc(r.authors) + " (" + esc(r.year) + "). " + '<span class="title">' + title + "</span> ";
    if (r.source) s += '<span class="source">' + esc(r.source) + "</span>.";
    if (r.doi) s += ' <span class="doi-text">doi:' + esc(r.doi) + "</span>";
    return s;
  }
  function pdfButton(r) {
    return '<a class="btn" href="' + esc(r.pdf) + '" rel="nofollow">' + ICON.pdf + 'PDF<span class="visually-hidden">: ' + esc(authorYear(r)) + " (PDF)</span></a>";
  }
  function readingActions(r) {
    if (r.tbd) return '<span class="chip-soon">Selected reading TBD</span>';
    var out = "";
    if (r.pdf && pdfKnown(r.pdf)) {
      out += pdfButton(r);
    } else if (r.pdf) {
      // Not uploaded when the pages were last built; the browser checks again.
      out += '<span class="pdf-slot" data-reading="' + esc(r.pdf) + '"><span class="chip-soon">PDF coming soon</span></span>';
    } else {
      out += '<span class="chip-soon">PDF coming soon</span>';
    }
    if (r.doi) {
      out += '<a class="btn" href="https://doi.org/' + esc(r.doi) + '" rel="noopener">' + ICON.link + 'DOI<span class="visually-hidden">: ' + esc(authorYear(r)) + "</span></a>";
    }
    return out;
  }
  // Upgrade "coming soon" chips to PDF buttons when the file has been uploaded since the last build.
  function checkPDFs(root, readings) {
    (root || document).querySelectorAll(".pdf-slot").forEach(function (slot) {
      var path = slot.getAttribute("data-reading");
      var r = readings.filter(function (x) { return x.pdf === path; })[0];
      if (!r) return;
      if (!IS_HTTP) { if (!FILES) slot.innerHTML = pdfButton(r); return; }
      fetch(path, { method: "HEAD", cache: "no-store" }).then(function (res) {
        if (res.ok) slot.innerHTML = pdfButton(r);
      }).catch(function () { /* leave "coming soon" */ });
    });
  }
  function allReadings() { return C.weeks.reduce(function (a, w) { return a.concat(w.readings || []); }, []); }

  /* =====================================================================
     PAGES
     ===================================================================== */

  /* ---------- Home ---------- */
  function thisWeekCard() {
    var st = semesterStatus();
    function readingSummary(w) {
      var n = w.readings.length;
      if (!n) return "";
      return '<p class="small muted" style="margin:0">' + n + " required reading" + (n === 1 ? "" : "s") + ":</p><ul class=\"small card-readings\">" +
        w.readings.map(function (r) {
          return "<li>" + esc(authorYear(r)) + (r.short ? ", <cite>" + esc(r.short) + "</cite>" : "") + "</li>";
        }).join("") + "</ul>";
    }
    if (st.kind === "break") {
      return '<p class="eyebrow">This week</p><h2>' + esc(st.item.label) + "</h2><p>" + esc(st.item.dates) + ". " + esc(st.item.note) + "</p>" +
        (st.next ? '<p>Next up: <a href="' + weekHref(st.next.n) + '">Week ' + st.next.n + ", " + esc(st.next.title) + "</a>, " + weekDates(st.next) + ".</p>" : "");
    }
    if (!st.week) return "";
    var w = st.week;
    var label = st.kind === "current" ? "This week" : (st.kind === "upcoming" ? "Coming up" : "Final oral exam");
    return '<p class="eyebrow"><span class="status">' + label + "</span> · Week " + w.n + "</p>" +
      "<h2>" + esc(w.title) + "</h2>" +
      '<p class="muted">' + esc(weekDates(w)) + "</p>" + readingSummary(w) +
      '<a class="btn" href="' + weekHref(w.n) + '">Go to Week ' + w.n + "</a>";
  }
  function renderHome(main) {
    var h = C.home, c = C.course;
    var instr = C.instructors.map(function (i) {
      var initials = i.name.replace(/^Dr\.?\s*/, "").split(/\s+/).map(function (p) { return p[0]; }).join("");
      var photo = i.photo && !imageKnownMissing(i.photo) ? '<img src="' + esc(i.photo) + '" alt=""' + dims(i.photo) + " data-avatar>" : initials;
      return '<div class="card instructor"><div class="avatar" data-initials="' + esc(initials) + '">' + photo + "</div><div>" +
        "<h3>" + esc(i.name) + "</h3>" +
        '<p><a href="mailto:' + esc(i.email) + '">' + esc(i.email) + "</a></p>" +
        "<p>Office: " + esc(i.office) + "</p><p>Office hours: " + esc(i.hours) + "</p></div></div>";
    }).join("");
    var links = "";
    if (c.canvasUrl) links += '<li><a class="btn" href="' + esc(c.canvasUrl) + '">Canvas</a></li>';
    links += '<li><a class="btn" href="' + esc(c.syllabusPdf) + '">' + ICON.pdf + "Syllabus (PDF)</a></li>";
    links += '<li><a class="btn" href="schedule.html">Schedule</a></li>';

    var facts = "<li>" + esc(c.meets) + "</li><li>Room: " + esc(c.room) + "</li>" +
      (c.canvasUrl ? '<li><a href="' + esc(c.canvasUrl) + '">Canvas</a></li>' : "") +
      '<li><a href="' + esc(c.syllabusPdf) + '">Syllabus (PDF)</a></li>';

    var b = h.banner;
    var banner = b && b.file && !imageKnownMissing(b.file) ?
      '<figure class="hero-fig" data-hide-if-missing><img src="' + esc(b.file) + '" alt="' + esc(b.alt) + '"' + dims(b.file) + ">" +
      "<figcaption>" + esc(b.caption) + ' <span class="credit">' + esc(b.credit) + "</span></figcaption></figure>" : "";
    main.innerHTML =
      '<div class="wrap">' +
      '<ul class="key-facts" aria-label="Key facts">' + facts + "</ul>" +
      '<section class="hero" aria-labelledby="hero-q">' + banner +
      '<h1 class="hero-q" id="hero-q">' + esc(h.heroQuestion) + '</h1><p class="hero-credit">' + esc(h.heroCredit) + "</p></section>" +
      '<section class="card this-week" aria-label="This week" data-live="this-week">' + thisWeekCard() + "</section>" +
      '<section aria-labelledby="scope-h"><h2 id="scope-h">Course scope and objectives</h2><div class="prose">' +
      h.scope.map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("") +
      "<p>" + esc(h.objectivesLead) + '</p><ul class="objectives">' + h.objectives.map(function (o) { return "<li>" + esc(o) + "</li>"; }).join("") + "</ul></div>" +
      '<div class="callout"><p>' + esc(h.unknownCallout) + "</p></div></section>" +
      '<section aria-labelledby="inst-h"><h2 id="inst-h">Instructors</h2><div class="instructors">' + instr + "</div></section>" +
      '<div class="callout"><p>' + esc(h.aiCallout) + ' <a href="policies.html#ai">Read the AI policy</a>.</p></div>' +
      '<section aria-labelledby="links-h"><h2 id="links-h">Quick links</h2><ul class="quick-links">' + links + "</ul></section>" +
      "</div>";
  }

  /* ---------- Schedule ---------- */
  function renderSchedule(main) {
    var st = semesterStatus();
    var t = today();
    var items = [];
    var jump = "";
    if (st.kind === "current") jump = '<p><a class="btn jump" href="#week-' + st.week.n + '">Jump to this week</a></p>';
    if (st.kind === "break") jump = '<p><a class="btn jump" href="#spring-break">Jump to this week</a></p>';
    C.weeks.forEach(function (w) {
      var cls = "week-card linked";
      var flag = "";
      if (w.tue && t > weekEnd(w)) cls += " past";
      if (st.kind === "current" && st.week === w) { cls += " current"; flag = '<span class="now-flag">This week</span>'; }
      else if (st.kind === "final" && w.isExam) { cls += " current"; flag = '<span class="now-flag">Coming up</span>'; }
      var nr = w.readings.length;
      var meta = w.isExam ? "Oral exam, Qualifying Exam style" : nr + " required reading" + (nr === 1 ? "" : "s");
      var dates = w.tue ? "Tue " + fmt(w.tue).slice(4) + "<br>Thu " + fmt(w.thu).slice(4) : esc(w.datesLabel || "TBA");
      var theme = themeLabel(w);
      items.push('<li class="' + cls + '" id="week-' + w.n + '" style="--band:' + themeColor(w.theme) + '">' +
        '<div><div class="wk">Week ' + w.n + '</div><div class="dates">' + dates + "</div></div>" +
        '<div><h2><a class="card-link" href="' + weekHref(w.n) + '">' + esc(w.title) + "</a>" + flag + "</h2>" +
        (theme ? '<p class="theme-label">' + esc(theme) + "</p>" : "") +
        '<p class="meta">' + meta + "</p></div></li>");

      if (C.midterm && C.midterm.afterWeek === w.n) {
        items.push('<li class="week-card exam-item" style="--band:' + themeColor("exam") + '"><div><div class="wk">Exam</div><div class="dates">' + esc(C.midterm.date || "Date TBA") + "</div></div>" +
          "<div><h2>" + esc(C.midterm.label) + '</h2><p class="meta">' + esc(C.midterm.note).replace("Assessments", '<a href="assessments.html#oral-exams">Assessments</a>') + "</p></div></li>");
      }
      (C.noClass || []).forEach(function (b) {
        if (b.afterWeek !== w.n) return;
        var on = st.kind === "break" && st.item === b;
        var bpast = b.end && t > addDays(parseDate(b.end), 1);
        items.push('<li class="week-card break' + (on ? " current" : "") + (bpast ? " past" : "") + '" id="spring-break"><div><div class="wk">No class</div><div class="dates">' + esc(b.dates) + "</div></div>" +
          "<div><h2>" + esc(b.label) + (on ? '<span class="now-flag">This week</span>' : "") + "</h2></div></li>");
      });
      if (C.tbaBlock && C.tbaBlock.afterWeek === w.n) {
        var tb = C.tbaBlock;
        items.push('<li class="week-card tba"><div><div class="wk">TBA</div><div class="dates">' + esc(tb.dates) + "</div></div>" +
          "<div><h2>" + esc(tb.label) + '</h2><p class="meta">' + esc(tb.note) + "</p><ul>" +
          tb.days.map(function (d) { return "<li>" + esc(d) + "</li>"; }).join("") + "</ul></div></li>");
      }
    });
    main.innerHTML = '<div class="wrap"><h1>Schedule</h1>' +
      '<p class="muted prose">' + esc(C.course.meets) + ". This is a dynamic schedule and will be updated as the semester progresses.</p>" +
      jump + '<ol class="week-list">' + items.join("") + "</ol>" + backToTop() + "</div>";
  }

  /* ---------- Week page ---------- */
  function renderWeek(main) {
    var n = parseInt(document.body.getAttribute("data-week") || params.get("n"), 10);
    var w = getWeek(n);
    if (!w) {
      document.title = "Week not found · " + C.course.title;
      main.innerHTML = '<div class="wrap narrow"><h1>Week not found</h1><p>There is no such week. <a href="schedule.html">Back to the schedule</a>.</p></div>';
      return;
    }
    document.title = "Week " + w.n + ": " + w.title + " · " + C.course.title;
    var parts = [];
    var theme = themeLabel(w);
    parts.push('<p class="breadcrumb"><a href="' + carry("schedule.html") + '">' + ARROW_L + "Schedule</a></p>");
    parts.push('<header class="week-head" style="--band:' + themeColor(w.theme) + '"><p class="dates-line">Week ' + w.n + " · " + esc(weekDates(w)) + "</p>" +
      "<h1>" + esc(w.title) + "</h1>" + (theme ? '<p class="theme-name">' + esc(theme) + "</p>" : "") + "</header>");

    // At a glance: dates, readings, before class, presenter (or exam details on Week 12)
    var g = ['<section class="card glance" aria-labelledby="glance-h"><h2 id="glance-h">At a glance</h2>',
      "<h3>Class dates</h3><p>" + esc(weekDates(w)) + "</p>"];
    if (w.isExam) {
      g.push('<h3>Oral exam rubric</h3><p><a href="assessments.html#rubric">See how the oral exam is scored</a></p>');
    } else {
      g.push('<h3 id="rr-h">Required reading</h3><ol class="readings" aria-labelledby="rr-h">' +
        w.readings.map(function (r) { return '<li><p class="cite">' + citationHTML(r) + '</p><div class="cite-actions">' + readingActions(r) + "</div></li>"; }).join("") +
        '</ol><p class="notice">' + esc(C.pdfNotice) + "</p>");
      g.push("<h3>Before class</h3><p>" + esc(C.beforeClass) + "</p>");
      var pres = (C.presentations || []).filter(function (p) { return p.week === w.n; })[0];
      var presText = pres && pres.presenter ? esc(pres.presenter) + (pres.paper ? ": " + (pres.doi ? '<a href="https://doi.org/' + esc(pres.doi) + '">' + esc(pres.paper) + "</a>" : esc(pres.paper)) : "") : '<span class="tba-text">To be assigned</span>';
      g.push("<h3>In-class graduate synthesis presentation</h3><p>" + presText + ' · <a href="presentations.html">About the presentations</a></p>');
    }
    g.push("</section>");
    parts.push(g.join(""));

    if (visible(w.intro)) {
      parts.push('<div class="intro' + (isApproved(w.intro) ? "" : " is-draft") + '">' + draftBadge(w.intro) + "<p>" + esc(w.intro.text) + "</p></div>");
    }
    if (w.isExam) {
      var oral = C.assessments.components.filter(function (x) { return x.id === "oral-exams"; })[0];
      parts.push('<section aria-labelledby="ex-h"><h2 id="ex-h">The final oral exam</h2><div class="prose">' +
        w.examText.map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("") +
        (oral ? oral.paragraphs.filter(function (p, i) { return i === 1; }).map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("") : "") +
        "</div></section>");
    }
    (w.images || (w.image ? [w.image] : [])).forEach(function (im) { parts.push(figureHTML(im)); });
    if (w.schematic && w.schematic.file) {
      parts.push(figureHTML({ file: w.schematic.file, alt: w.schematic.alt, caption: w.schematic.caption }, "schematic"));
    }
    if (w.concepts.length) {
      var excluded = (C.conceptIndexExclude || []).map(conceptKey);
      parts.push('<section aria-labelledby="cc-h"><h2 id="cc-h">Core concepts</h2><div>' +
        w.concepts.map(function (cn) {
          return excluded.indexOf(conceptKey(cn)) >= 0 ? '<span class="tag">' + esc(cn) + "</span>" :
            '<a class="tag" href="concepts.html#' + slug(cn) + '">' + esc(cn) + "</a>";
        }).join("") + "</div></section>");
    }
    if (visible(w.unknown) && w.unknown.questions && w.unknown.questions.length) {
      parts.push('<section class="unknown-panel' + (isApproved(w.unknown) ? "" : " is-draft") + '" aria-labelledby="wk-h">' + draftBadge(w.unknown) +
        '<div class="panel-head">' + ICON.help + '<h2 id="wk-h">What we don\'t know</h2></div><ol>' +
        w.unknown.questions.map(function (q) { return "<li>" + esc(q) + "</li>"; }).join("") + "</ol></section>");
    }
    var prev = getWeek(w.n - 1), next = getWeek(w.n + 1);
    parts.push('<nav class="pager" aria-label="Week navigation">' +
      (prev ? '<a class="prev" href="' + weekHref(prev.n) + '"><span class="dir">' + ARROW_L + "Previous week</span>Week " + prev.n + ": " + esc(prev.title) + "</a>" : "") +
      (next ? '<a class="next" href="' + weekHref(next.n) + '"><span class="dir">Next week' + ARROW_R + "</span>Week " + next.n + ": " + esc(next.title) + "</a>" : "") + "</nav>");
    parts.push(backToTop());
    main.innerHTML = '<div class="wrap">' + parts.join("") + "</div>";
  }

  /* ---------- week.html: old addresses (week.html?n=5) forward to week-05.html ---------- */
  function renderWeekRedirect(main) {
    main.innerHTML = '<div class="wrap narrow"><h1>Weeks</h1><p>Each week now has its own page:</p><ul>' +
      C.weeks.map(function (w) { return '<li><a href="' + weekFile(w.n) + '">Week ' + w.n + ": " + esc(w.title) + "</a></li>"; }).join("") +
      "</ul></div>";
  }

  /* ---------- Presentations ---------- */
  function renderPresentations(main) {
    var P = C.presentationInfo;
    var rows = C.presentations.map(function (p) {
      var w = getWeek(p.week) || { title: "" };
      var paper = p.paper ? (p.doi ? '<a href="https://doi.org/' + esc(p.doi) + '">' + esc(p.paper) + "</a>" : esc(p.paper)) : '<span class="tba-text">To be assigned</span>';
      var slides = p.slides ? '<a href="' + esc(p.slides) + '">Slides</a>' : '<span class="tba-text">None yet</span>';
      return "<tr><td data-label=\"Week\">" + p.week + '</td><td data-label="Topic"><a href="' + weekHref(p.week) + '">' + esc(w.title) + "</a></td>" +
        '<td data-label="Presenter">' + (p.presenter ? esc(p.presenter) : '<span class="tba-text">To be assigned</span>') + "</td>" +
        '<td data-label="Paper">' + paper + '</td><td data-label="Slides">' + slides + "</td></tr>";
    }).join("");
    main.innerHTML = '<div class="wrap"><h1>In-class graduate synthesis presentation</h1><div class="prose">' +
      "<p>" + esc(P.paragraph) + "</p><p>" + esc(P.criteriaLead) + '</p><ul class="plain-list">' +
      P.criteria.map(function (c) { return "<li>" + esc(c) + "</li>"; }).join("") + "</ul>" +
      '<div class="callout"><p>' + esc(P.assignmentNote) + "</p></div></div>" +
      '<h2>Presentation schedule</h2><div class="table-wrap"><table class="stack-table"><thead><tr><th scope="col">Week</th><th scope="col">Topic</th><th scope="col">Presenter</th><th scope="col">Paper</th><th scope="col">Slides</th></tr></thead><tbody>' +
      rows + "</tbody></table></div></div>";
  }

  /* ---------- Assessments ---------- */
  function renderAssessments(main) {
    var A = C.assessments;
    function scheme(title, list) {
      var total = list.reduce(function (s, r) { return s + r[1]; }, 0);
      return '<section class="card"><h3>' + title + '</h3><table><tbody>' +
        list.map(function (r) { return '<tr><th scope="row" style="font-weight:400">' + esc(r[0]) + '</th><td class="num">' + r[1] + "%</td></tr>"; }).join("") +
        '<tr><th scope="row">Total</th><td class="num"><strong>' + total + "%</strong></td></tr></tbody></table></section>";
    }
    var toc = [["grading", "Grading"], ["letter-grades", "Letter grades"], ["participation", "Participation"], ["reading-responses", "Reading responses"],
      ["quizzes", "Quizzes"], ["presentation", "Presentation"], ["oral-exams", "Oral exams"], ["rubric", "Rubric"]];
    var rubricRows = A.rubric.map(function (sec) {
      return '<tr class="rubric-section"><th colspan="2" scope="colgroup">' + esc(sec.section) + "</th></tr>" +
        sec.items.map(function (it) { return "<tr><td>" + esc(it) + '</td><td class="score-cell"></td></tr>'; }).join("");
    }).join("");
    main.innerHTML = '<div class="wrap"><h1>Assessments</h1>' +
      '<nav class="toc" aria-label="On this page"><ul>' + toc.map(function (x) { return '<li><a href="#' + x[0] + '">' + x[1] + "</a></li>"; }).join("") + "</ul></nav>" +
      '<section id="grading" aria-labelledby="grading-h"><h2 id="grading-h">Grading</h2><div class="grid-2">' +
      scheme("Undergraduate grading", A.grading.undergraduate) + scheme("Graduate grading", A.grading.graduate) + "</div></section>" +
      '<section id="letter-grades" aria-labelledby="lg-h"><h2 id="lg-h">Final letter grades</h2><div class="table-wrap" style="max-width:420px"><table><thead><tr><th scope="col">Grade</th><th scope="col">Range</th></tr></thead><tbody>' +
      A.letterGrades.map(function (g) { return "<tr><td><strong>" + esc(g[0]) + "</strong></td><td>" + esc(g[1]) + "</td></tr>"; }).join("") + "</tbody></table></div></section>" +
      A.components.map(function (cpt) {
        return "<section" + (cpt.id ? ' id="' + cpt.id + '"' : "") + "><h2>" + esc(cpt.title) + '</h2><div class="prose">' +
          cpt.paragraphs.map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("") + "</div></section>";
      }).join("") +
      '<section id="rubric" aria-labelledby="rubric-h"><h2 id="rubric-h">Oral exam rubric</h2><p class="muted">' + esc(A.rubricNote) + "</p>" +
      '<div class="table-wrap"><table class="rubric"><thead><tr><th scope="col">Category</th><th scope="col">Score: 1 (weakest) to 5 (strongest)</th></tr></thead><tbody>' + rubricRows + "</tbody></table></div></section>" +
      backToTop() + "</div>";
  }

  /* ---------- Policies ---------- */
  function renderPolicies(main) {
    main.innerHTML = '<div class="wrap"><h1>Policies</h1><div class="prose">' +
      C.policies.map(function (p) {
        return '<section id="' + p.id + '"><h2>' + esc(p.title) + "</h2>" + p.paragraphs.map(function (x) { return "<p>" + rich(x) + "</p>"; }).join("") + "</section>";
      }).join("") + "</div></div>";
  }

  /* ---------- Concept index ---------- */
  function conceptIndex() {
    var map = {}, order = [];
    var excluded = (C.conceptIndexExclude || []).map(conceptKey);
    C.weeks.forEach(function (w) {
      w.concepts.forEach(function (cn) {
        var k = conceptKey(cn);
        if (excluded.indexOf(k) >= 0) return;
        if (!map[k]) { map[k] = { text: cn.trim(), weeks: [] }; order.push(k); }
        if (map[k].weeks.indexOf(w.n) < 0) map[k].weeks.push(w.n);
      });
    });
    function sortKey(s) { return s.toLowerCase().replace(/^the\s+/, "").replace(/^["']/, ""); }
    return order.map(function (k) { return map[k]; }).sort(function (a, b) { return sortKey(a.text) < sortKey(b.text) ? -1 : 1; })
      .map(function (e) { e.letter = sortKey(e.text).charAt(0).toUpperCase(); return e; });
  }
  function renderConcepts(main) {
    var list = conceptIndex();
    var groups = {};
    list.forEach(function (e) { (groups[e.letter] = groups[e.letter] || []).push(e); });
    var letters = Object.keys(groups).sort();
    var az = letters.map(function (L) { return '<li><a href="#letter-' + L + '">' + L + "</a></li>"; }).join("");
    var body = letters.map(function (L) {
      return '<section class="concept-group" data-letter="' + L + '"><h2 class="concept-letter" id="letter-' + L + '">' + L + '</h2><ul class="concept-list">' +
        groups[L].map(function (e) {
          return '<li id="' + slug(e.text) + '" data-term="' + esc(e.text.toLowerCase()) + '"><span class="term">' + esc(e.text) + '</span> <span class="weeks">' +
            e.weeks.map(function (n) { return '<a href="' + weekHref(n) + '">Week ' + n + "</a>"; }).join(", ") + "</span></li>";
        }).join("") + "</ul></section>";
    }).join("");
    main.innerHTML = '<div class="wrap"><h1>Concept index</h1><p class="muted prose">Every core concept in the syllabus, with the weeks where it appears. ' + list.length + " concepts.</p>" +
      '<label class="visually-hidden" for="concept-filter">Filter concepts</label><input id="concept-filter" class="filter" type="search" placeholder="Filter concepts" autocomplete="off">' +
      '<p id="filter-status" class="visually-hidden" aria-live="polite"></p>' +
      '<nav aria-label="Jump to letter"><ul class="az">' + az + "</ul></nav>" + body + '<p id="no-match" class="muted" hidden>No concepts match.</p>' + backToTop() + "</div>";
    if (BUILD) return;
    var input = $("#concept-filter");
    var status = $("#filter-status");
    var timer = null;
    input.addEventListener("input", function () {
      var q = input.value.toLowerCase().trim();
      var total = 0;
      main.querySelectorAll(".concept-group").forEach(function (g) {
        var shown = 0;
        g.querySelectorAll("li").forEach(function (li) {
          var ok = !q || li.getAttribute("data-term").indexOf(q) >= 0;
          li.hidden = !ok; if (ok) shown++;
        });
        g.hidden = shown === 0; total += shown;
      });
      $("#no-match").hidden = total > 0;
      clearTimeout(timer);
      timer = setTimeout(function () {
        status.textContent = total === 0 ? "No concepts match." : total + (total === 1 ? " concept" : " concepts") + " shown";
      }, 400);
    });
  }

  /* ---------- Drafts review page (not in the nav; never built with drafts) ---------- */
  function renderDrafts(main) {
    if (BUILD) {
      main.innerHTML = '<div class="wrap narrow"><h1>Draft review</h1><p>This instructor page shows drafts only in the browser, with JavaScript turned on.</p></div>';
      return;
    }
    var blocks = C.weeks.filter(function (w) { return w.intro || w.unknown; }).map(function (w) {
      function status(b) { return b ? (isApproved(b) ? '<span class="tag">approved</span>' : '<span class="draft-badge">DRAFT</span>') : ""; }
      return '<section class="draft-week"><h2><a href="' + weekFile(w.n) + '?drafts=1">Week ' + w.n + ": " + esc(w.title) + "</a></h2>" +
        (w.intro ? "<h3>Framing paragraph " + status(w.intro) + '</h3><p class="intro">' + esc(w.intro.text) + "</p>" : "") +
        (w.unknown ? "<h3>What we don't know " + status(w.unknown) + '</h3><div class="unknown-panel" style="margin-top:0.5rem"><div class="panel-head">' + ICON.help + "<h4>What we don't know</h4></div><ol>" +
          w.unknown.questions.map(function (q) { return "<li>" + esc(q) + "</li>"; }).join("") + "</ol></div>" : "") + "</section>";
    }).join("");
    var nDraft = 0;
    C.weeks.forEach(function (w) { [w.intro, w.unknown].forEach(function (b) { if (b && !isApproved(b)) nDraft++; }); });
    main.innerHTML = '<div class="wrap narrow"><h1>Draft review</h1><p class="notice">Instructor page, not linked from the site. ' + nDraft +
      ' items are still drafts and hidden from students. To approve one, edit its text in <code>data/course.js</code> and change <code>"draft"</code> to <code>"approved"</code>. See README.md, section 4.</p>' + blocks + "</div>";
  }

  /* ---------- 404 ---------- */
  function renderNotFound(main) {
    main.innerHTML = '<div class="wrap narrow"><h1>Page not found</h1><p>That page does not exist, or it has moved.</p><p><a class="btn" href="index.html">Go to the home page</a> <a class="btn" href="schedule.html">See the schedule</a></p></div>';
  }

  /* ---------- Boot ---------- */
  var PAGES = {
    home: renderHome, schedule: renderSchedule, week: renderWeek, weekredirect: renderWeekRedirect,
    presentations: renderPresentations, assessments: renderAssessments, policies: renderPolicies,
    concepts: renderConcepts, drafts: renderDrafts, notfound: renderNotFound
  };
  function boot() {
    var page = document.body.getAttribute("data-page");
    if (page === "drafts" && !BUILD) SHOW_DRAFTS = true;
    renderChrome(page);
    var main = $("#main");
    if (main && PAGES[page]) PAGES[page](main);
    if (BUILD) return;
    wireMissingImages(document);
    checkPDFs(document, allReadings());
    // Jump to a #hash target after rendering (the browser re-renders the page on load).
    if (window.location.hash && window.location.hash !== "#top") {
      var target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
      if (target) target.scrollIntoView();
    }
  }
  if (!C) {
    if (BUILD) throw new Error("window.COURSE is missing");
    document.addEventListener("DOMContentLoaded", function () {
      var m = $("#main");
      if (m && !m.querySelector("h1")) m.innerHTML = '<div class="wrap"><p>Course data could not be loaded. Check data/course.js for a typo (often a missing comma or quote).</p></div>';
    });
    return;
  }
  if (BUILD) { window.__siteBoot = boot; return; }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
