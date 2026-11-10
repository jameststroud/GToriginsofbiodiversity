/* Origins of Biodiversity: shared renderer.
   Reads window.COURSE (data/course.js) and builds every page.
   No editing needed here for routine course changes. */
(function () {
  "use strict";

  var C = window.COURSE;
  var params = new URLSearchParams(window.location.search);
  var SHOW_DRAFTS = params.get("drafts") === "1";
  var IS_HTTP = /^https?:$/.test(window.location.protocol);

  /* ---------- Small helpers ---------- */
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  // Escapes text, then turns {link:URL|label} into a link.
  function rich(s) {
    return esc(s).replace(/\{link:([^|}]+)\|([^}]+)\}/g, function (_, url, label) {
      return '<a href="' + url + '">' + label + "</a>";
    });
  }
  function $(sel) { return document.querySelector(sel); }
  function slug(s) {
    return "c-" + String(s).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }
  function conceptKey(s) { return String(s).toLowerCase().trim(); }

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

  // "Today", which can be faked for testing with ?today=YYYY-MM-DD
  function today() {
    var t = params.get("today");
    if (t && /^\d{4}-\d{2}-\d{2}$/.test(t)) return parseDate(t);
    var n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), n.getDate());
  }

  // Keep ?drafts=1 and ?today= on internal week links so previews stay in preview mode.
  function carry(href) {
    var extra = [];
    if (SHOW_DRAFTS) extra.push("drafts=1");
    if (params.get("today")) extra.push("today=" + encodeURIComponent(params.get("today")));
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
  function weekHref(n) { return carry("week.html?n=" + n); }

  function themeColor(key) { return (C.themes[key] || {}).color || "#2F5D50"; }
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

  /* ---------- Icons (inline SVG, no libraries) ---------- */
  var ICON = {
    pdf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M8.5 16.5v-4h1.2a1.2 1.2 0 0 1 0 2.4H8.5M13 12.5v4h.8a1.6 1.6 0 0 0 1.6-1.6v-.8a1.6 1.6 0 0 0-1.6-1.6zM17.5 12.5h-1.5v4M16 14.5h1.2"/></svg>',
    link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></svg>',
    help: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>'
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
      var navSection = page === "week" ? "schedule" : page;
      var items = NAV.map(function (n) {
        var cur = n[0] === navSection ? (page === "week" ? ' aria-current="true"' : ' aria-current="page"') : "";
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
      var btn = header.querySelector(".nav-toggle");
      var nav = header.querySelector(".site-nav");
      btn.addEventListener("click", function () {
        var open = nav.classList.toggle("open");
        btn.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }
    var footer = $("#site-footer");
    if (footer) {
      footer.innerHTML =
        '<footer class="site-footer"><div class="wrap">' +
        "<p><strong>" + esc(C.course.codes) + " · " + esc(C.course.title) + " · " + esc(C.course.term) + "</strong></p>" +
        "<p>" + C.instructors.map(function (i) { return esc(i.name); }).join(" and ") + "</p>" +
        "<p>" + esc(C.pdfNotice) + "</p>" +
        '<p><a href="' + esc(C.course.syllabusPdf) + '">Syllabus (PDF)</a> · Last updated ' + esc(C.course.lastUpdated) + "</p>" +
        "</div></footer>";
    }
  }

  /* ---------- Images that hide cleanly when missing ---------- */
  function figureHTML(img, cls) {
    if (!img || !img.file) return "";
    var cap = "";
    if (img.caption || img.credit) {
      cap = "<figcaption>" + esc(img.caption) + (img.credit ? '<span class="credit">' + esc(img.credit) + "</span>" : "") + "</figcaption>";
    }
    return '<figure class="figure-img ' + (cls || "") + '" data-hide-if-missing><img src="' + esc(img.file) + '" alt="' + esc(img.alt || img.caption || "") + '" loading="lazy">' + cap + "</figure>";
  }
  function wireMissingImages(root) {
    (root || document).querySelectorAll("[data-hide-if-missing] img").forEach(function (im) {
      function hide() { var f = im.closest("[data-hide-if-missing]"); if (f) f.hidden = true; }
      if (im.complete && im.naturalWidth === 0) hide();
      im.addEventListener("error", hide);
    });
    (root || document).querySelectorAll("img[data-avatar]").forEach(function (im) {
      function swap() { var a = im.parentNode; a.removeChild(im); a.textContent = a.getAttribute("data-initials"); }
      if (im.complete && im.naturalWidth === 0) swap();
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
  function readingActions(r) {
    if (r.tbd) return '<span class="chip-soon">Selected reading TBD</span>';
    var out = "";
    if (r.pdf) {
      out += '<span class="pdf-slot" data-pdf="' + esc(r.pdf) + '"><span class="chip-soon">PDF coming soon</span></span>';
    } else {
      out += '<span class="chip-soon">PDF coming soon</span>';
    }
    if (r.doi) {
      out += '<a class="btn" href="https://doi.org/' + esc(r.doi) + '" rel="noopener">' + ICON.link + "DOI</a>";
    }
    return out;
  }
  function pdfButton(path) {
    return '<a class="btn" href="' + esc(path) + '" rel="nofollow">' + ICON.pdf + "PDF</a>";
  }
  // Upgrade "coming soon" chips to PDF buttons when the file exists.
  function checkPDFs(root) {
    (root || document).querySelectorAll(".pdf-slot").forEach(function (slot) {
      var path = slot.getAttribute("data-pdf");
      if (!IS_HTTP) { slot.innerHTML = pdfButton(path); return; } // opened from disk: cannot check
      fetch(path, { method: "HEAD", cache: "no-store" }).then(function (res) {
        if (res.ok) slot.innerHTML = pdfButton(path);
      }).catch(function () { /* leave "coming soon" */ });
    });
  }

  /* =====================================================================
     PAGES
     ===================================================================== */

  /* ---------- Home ---------- */
  function renderHome(main) {
    var h = C.home, c = C.course;
    var st = semesterStatus();
    var card = "";
    function readingSummary(w) {
      var n = w.readings.length;
      if (!n) return "";
      return "<p class=\"small muted\" style=\"margin:0\">" + n + " required reading" + (n === 1 ? "" : "s") + ":</p><ul class=\"small\">" +
        w.readings.map(function (r) { return "<li>" + esc(shortAuthors(r.authors)) + " (" + esc(r.year) + ")</li>"; }).join("") + "</ul>";
    }
    if (st.kind === "break") {
      card = '<p class="eyebrow">This week</p><h2>' + esc(st.item.label) + "</h2><p>" + esc(st.item.dates) + ". " + esc(st.item.note) + "</p>" +
        (st.next ? '<p>Next up: <a href="' + weekHref(st.next.n) + '">Week ' + st.next.n + ", " + esc(st.next.title) + "</a>, " + weekDates(st.next) + ".</p>" : "");
    } else if (st.week) {
      var w = st.week;
      var label = st.kind === "current" ? "This week" : (st.kind === "upcoming" ? "Coming up" : "Final oral exam");
      card = '<p class="eyebrow"><span class="status">' + label + "</span> · Week " + w.n + "</p>" +
        "<h2>" + esc(w.title) + "</h2>" +
        "<p class=\"muted\">" + esc(weekDates(w)) + "</p>" + readingSummary(w) +
        '<a class="btn" href="' + weekHref(w.n) + '">Go to Week ' + w.n + "</a>";
    }
    var instr = C.instructors.map(function (i) {
      var initials = i.name.replace(/^Dr\.?\s*/, "").split(/\s+/).map(function (p) { return p[0]; }).join("");
      var photo = i.photo ? '<img src="' + esc(i.photo) + '" alt="Photo of ' + esc(i.name) + '" data-avatar>' : initials;
      return '<div class="card instructor"><div class="avatar" data-initials="' + esc(initials) + '">' + photo + "</div><div>" +
        "<h3>" + esc(i.name) + "</h3>" +
        '<p><a href="mailto:' + esc(i.email) + '">' + esc(i.email) + "</a></p>" +
        "<p>Office: " + esc(i.office) + "</p><p>Office hours: " + esc(i.hours) + "</p></div></div>";
    }).join("");
    var links = "";
    if (c.canvasUrl) links += '<li><a class="btn" href="' + esc(c.canvasUrl) + '">Canvas</a></li>';
    links += '<li><a class="btn" href="' + esc(c.syllabusPdf) + '">' + ICON.pdf + "Syllabus PDF</a></li>";
    links += '<li><a class="btn" href="schedule.html">Schedule</a></li>';

    var b = h.banner;
    main.innerHTML =
      '<div class="wrap">' +
      '<figure class="home-banner" data-hide-if-missing><div class="frame"><img src="' + esc(b.file) + '" alt="' + esc(b.alt) + '"></div>' +
      "<figcaption>" + esc(b.caption) + ' <span class="credit">' + esc(b.credit) + "</span></figcaption></figure>" +
      '<p class="course-line"><strong>' + esc(c.codes) + " · " + esc(c.term) + " · " + esc(c.institution) + "</strong></p>" +
      '<p class="course-line">' + esc(c.meets) + " · Room: " + esc(c.room) + "</p>" +
      '<section class="hero" aria-label="Course question"><p class="hero-q">' + esc(h.heroQuestion) + '</p><p class="hero-credit">' + esc(h.heroCredit) + "</p></section>" +
      '<section class="card this-week" aria-label="This week">' + card + "</section>" +
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
    var legend = Object.keys(C.themes).filter(function (k) { return k !== "exam"; }).map(function (k) {
      return '<li><span class="swatch" style="background:' + C.themes[k].color + '"></span>' + esc(C.themes[k].label) + "</li>";
    }).join("");
    var items = [];
    C.weeks.forEach(function (w) {
      var cls = "week-card";
      var flag = "";
      if (w.tue && t > weekEnd(w)) cls += " past";
      if (st.kind === "current" && st.week === w) { cls += " current"; flag = '<span class="now-flag">This week</span>'; }
      else if (st.kind === "final" && w.isExam) { cls += " current"; flag = '<span class="now-flag">Coming up</span>'; }
      var tags = "";
      if (w.concepts.length) {
        var shown = w.concepts.slice(0, 4).map(function (cn) { return '<span class="tag">' + esc(cn) + "</span>"; }).join("");
        var more = w.concepts.length > 4 ? '<span class="tag tag-more">+' + (w.concepts.length - 4) + " more</span>" : "";
        tags = "<div>" + shown + more + "</div>";
      }
      var nr = w.readings.length;
      var meta = w.isExam ? "Oral exam, Qualifying Exam style" : nr + " required reading" + (nr === 1 ? "" : "s");
      var dates = w.tue ? "Tue " + fmt(w.tue).slice(4) + "<br>Thu " + fmt(w.thu).slice(4) : esc(w.datesLabel || "TBA");
      items.push('<li class="' + cls + '" style="--band:' + themeColor(w.theme) + '">' +
        '<div><div class="wk">Week ' + w.n + '</div><div class="dates">' + dates + "</div></div>" +
        '<div><h2><a href="' + weekHref(w.n) + '">' + esc(w.title) + "</a>" + flag + "</h2>" + tags + '<p class="meta">' + meta + "</p></div></li>");

      if (C.midterm && C.midterm.afterWeek === w.n) {
        items.push('<li class="week-card exam-item" style="--band:' + themeColor("exam") + '"><div><div class="wk">Exam</div><div class="dates">' + esc(C.midterm.date || "Date TBA") + "</div></div>" +
          "<div><h2>" + esc(C.midterm.label) + '</h2><p class="meta">' + esc(C.midterm.note).replace("Assessments", '<a href="assessments.html#oral-exams">Assessments</a>') + "</p></div></li>");
      }
      (C.noClass || []).forEach(function (b) {
        if (b.afterWeek !== w.n) return;
        var on = st.kind === "break" && st.item === b;
        var bpast = b.end && t > addDays(parseDate(b.end), 1);
        items.push('<li class="week-card break' + (on ? " current" : "") + (bpast ? " past" : "") + '"><div><div class="wk">No class</div><div class="dates">' + esc(b.dates) + "</div></div>" +
          "<div><h2>" + esc(b.label) + (on ? '<span class="now-flag">This week</span>' : "") + '</h2><p class="meta">' + esc(b.note) + "</p></div></li>");
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
      '<ul class="legend" aria-label="Theme colors">' + legend + "</ul>" +
      '<ol class="week-list">' + items.join("") + "</ol></div>";
  }

  /* ---------- Week page ---------- */
  function renderWeek(main) {
    var n = parseInt(params.get("n"), 10);
    var w = getWeek(n);
    if (!w) {
      document.title = "Week not found · " + C.course.title;
      main.innerHTML = '<div class="wrap narrow"><h1>Week not found</h1><p>There is no week ' + esc(params.get("n") || "") + '. <a href="schedule.html">Back to the schedule</a>.</p></div>';
      return;
    }
    document.title = "Week " + w.n + ": " + w.title + " · " + C.course.title;
    var parts = [];
    parts.push('<p class="breadcrumb"><a href="' + carry("schedule.html") + '">← Schedule</a></p>');
    parts.push('<header class="week-head" style="--band:' + themeColor(w.theme) + '"><p class="dates-line">Week ' + w.n + " · " + esc(weekDates(w)) + "</p>" +
      "<h1>" + esc(w.title) + "</h1>" + (C.themes[w.theme] && w.theme !== "exam" ? '<p class="theme-name">' + esc(C.themes[w.theme].label) + "</p>" : "") + "</header>");
    parts.push(figureHTML(w.image));
    if (visible(w.intro)) {
      parts.push('<div class="intro' + (isApproved(w.intro) ? "" : " is-draft") + '">' + draftBadge(w.intro) + "<p>" + esc(w.intro.text) + "</p></div>");
    }
    if (w.concepts.length) {
      parts.push('<section aria-labelledby="cc-h"><h2 id="cc-h">Core concepts</h2><div>' +
        w.concepts.map(function (cn) { return '<a class="tag" href="concepts.html#' + slug(cn) + '">' + esc(cn) + "</a>"; }).join("") + "</div></section>");
    }
    if (w.isExam) {
      var oral = C.assessments.components.filter(function (x) { return x.id === "oral-exams"; })[0];
      parts.push('<section aria-labelledby="ex-h"><h2 id="ex-h">The final oral exam</h2><div class="prose">' +
        w.examText.map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("") +
        (oral ? oral.paragraphs.filter(function (p, i) { return i === 1; }).map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("") : "") +
        '<p><a class="btn" href="assessments.html#rubric">See the oral exam rubric</a></p></div></section>');
    } else {
      parts.push('<section aria-labelledby="rr-h"><h2 id="rr-h">Required reading</h2><ol class="readings">' +
        w.readings.map(function (r) { return '<li><p class="cite">' + citationHTML(r) + '</p><div class="cite-actions">' + readingActions(r) + "</div></li>"; }).join("") +
        '</ol><p class="notice">' + esc(C.pdfNotice) + "</p></section>");
    }
    if (w.schematic && w.schematic.file) {
      parts.push(figureHTML({ file: w.schematic.file, alt: w.schematic.alt, caption: w.schematic.caption }, "schematic"));
    }
    if (!w.isExam) {
      var pres = (C.presentations || []).filter(function (p) { return p.week === w.n; })[0];
      var presText = pres && pres.presenter ? esc(pres.presenter) + (pres.paper ? ": " + (pres.doi ? '<a href="https://doi.org/' + esc(pres.doi) + '">' + esc(pres.paper) + "</a>" : esc(pres.paper)) : "") : '<span class="tba-text">To be assigned</span>';
      parts.push('<div class="info-cards"><section class="card" aria-labelledby="gp-h"><h2 id="gp-h">Graduate synthesis presenter</h2><p>' + presText + '</p><p class="small muted"><a href="presentations.html">About the presentations</a></p></section>' +
        '<section class="card" aria-labelledby="bc-h"><h2 id="bc-h">Before class</h2><p>' + esc(C.beforeClass) + "</p></section></div>");
    }
    var prev = getWeek(w.n - 1), next = getWeek(w.n + 1);
    parts.push('<nav class="pager" aria-label="Week navigation">' +
      (prev ? '<a class="prev" href="' + weekHref(prev.n) + '"><span class="dir">← Previous week</span>Week ' + prev.n + ": " + esc(prev.title) + "</a>" : "") +
      (next ? '<a class="next" href="' + weekHref(next.n) + '"><span class="dir">Next week →</span>Week ' + next.n + ": " + esc(next.title) + "</a>" : "") + "</nav>");
    if (visible(w.unknown) && w.unknown.questions && w.unknown.questions.length) {
      parts.push('<section class="unknown-panel' + (isApproved(w.unknown) ? "" : " is-draft") + '" aria-labelledby="wk-h">' + draftBadge(w.unknown) +
        '<div class="panel-head">' + ICON.help + '<h2 id="wk-h">What we don\'t know</h2></div><ol>' +
        w.unknown.questions.map(function (q) { return "<li>" + esc(q) + "</li>"; }).join("") + "</ol></section>");
    }
    main.innerHTML = '<div class="wrap">' + parts.join("") + "</div>";
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
    main.innerHTML = '<div class="wrap"><h1>Graduate synthesis presentations</h1><div class="prose">' +
      "<p>" + esc(P.paragraph) + "</p><p>" + esc(P.criteriaLead) + '</p><ul class="objectives">' +
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
      return '<section class="card"><h2>' + title + '</h2><table><tbody>' +
        list.map(function (r) { return '<tr><th scope="row" style="font-weight:400">' + esc(r[0]) + '</th><td class="num">' + r[1] + "%</td></tr>"; }).join("") +
        '<tr><th scope="row">Total</th><td class="num"><strong>' + total + "%</strong></td></tr></tbody></table></section>";
    }
    var rubricRows = A.rubric.map(function (sec) {
      return '<tr class="rubric-section"><th colspan="2" scope="colgroup">' + esc(sec.section) + "</th></tr>" +
        sec.items.map(function (it) {
          return '<tr><td data-label="Category">' + esc(it) + '</td><td data-label="Score (1 to 5)"><span class="scale" aria-label="Scored 1 to 5"><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span></span></td></tr>';
        }).join("");
    }).join("");
    main.innerHTML = '<div class="wrap"><h1>Assessments</h1>' +
      '<div class="grid-2">' + scheme("Undergraduate grading", A.grading.undergraduate) + scheme("Graduate grading", A.grading.graduate) + "</div>" +
      '<h2>Final letter grades</h2><div class="table-wrap" style="max-width:420px"><table><thead><tr><th scope="col">Grade</th><th scope="col">Range</th></tr></thead><tbody>' +
      A.letterGrades.map(function (g) { return "<tr><td><strong>" + esc(g[0]) + "</strong></td><td>" + esc(g[1]) + "</td></tr>"; }).join("") + "</tbody></table></div>" +
      A.components.map(function (cpt) {
        return "<section" + (cpt.id ? ' id="' + cpt.id + '"' : "") + "><h2>" + esc(cpt.title) + '</h2><div class="prose">' +
          cpt.paragraphs.map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("") + "</div></section>";
      }).join("") +
      '<section id="rubric"><h2>Oral exam rubric</h2><p class="muted">' + esc(A.rubricNote) + "</p>" +
      '<div class="table-wrap"><table class="rubric"><thead><tr><th scope="col">Category</th><th scope="col">Score (1 to 5)</th></tr></thead><tbody>' + rubricRows + "</tbody></table></div></section></div>";
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
    C.weeks.forEach(function (w) {
      w.concepts.forEach(function (cn) {
        var k = conceptKey(cn);
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
    var az = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(function (L) {
      return groups[L] ? '<li><a href="#letter-' + L + '">' + L + "</a></li>" : '<li><span aria-hidden="true">' + L + "</span></li>";
    }).join("");
    var body = Object.keys(groups).sort().map(function (L) {
      return '<section class="concept-group" data-letter="' + L + '"><h2 class="concept-letter" id="letter-' + L + '">' + L + '</h2><ul class="concept-list">' +
        groups[L].map(function (e) {
          return '<li id="' + slug(e.text) + '" data-term="' + esc(e.text.toLowerCase()) + '"><span class="term">' + esc(e.text) + '</span> <span class="weeks">' +
            e.weeks.map(function (n) { return '<a href="' + weekHref(n) + '">Week ' + n + "</a>"; }).join(", ") + "</span></li>";
        }).join("") + "</ul></section>";
    }).join("");
    main.innerHTML = '<div class="wrap"><h1>Concept index</h1><p class="muted prose">Every core concept in the syllabus, with the weeks where it appears. ' + list.length + " concepts.</p>" +
      '<label class="visually-hidden" for="concept-filter">Filter concepts</label><input id="concept-filter" class="filter" type="search" placeholder="Filter concepts" autocomplete="off">' +
      '<ul class="az" aria-label="Jump to letter">' + az + "</ul>" + body + '<p id="no-match" class="muted" hidden>No concepts match.</p></div>';
    var input = $("#concept-filter");
    input.addEventListener("input", function () {
      var q = input.value.toLowerCase().trim();
      var any = false;
      main.querySelectorAll(".concept-group").forEach(function (g) {
        var shown = 0;
        g.querySelectorAll("li").forEach(function (li) {
          var ok = !q || li.getAttribute("data-term").indexOf(q) >= 0;
          li.hidden = !ok; if (ok) shown++;
        });
        g.hidden = shown === 0; if (shown) any = true;
      });
      $("#no-match").hidden = any;
    });
  }

  /* ---------- Drafts review page (not in the nav) ---------- */
  function renderDrafts(main) {
    var blocks = C.weeks.filter(function (w) { return w.intro || w.unknown; }).map(function (w) {
      function status(b) { return b ? (isApproved(b) ? '<span class="tag">approved</span>' : '<span class="draft-badge">DRAFT</span>') : ""; }
      return '<section class="draft-week"><h2><a href="week.html?n=' + w.n + '&amp;drafts=1">Week ' + w.n + ": " + esc(w.title) + "</a></h2>" +
        (w.intro ? "<h3>Framing paragraph " + status(w.intro) + '</h3><p class="intro">' + esc(w.intro.text) + "</p>" : "") +
        (w.unknown ? "<h3>What we don't know " + status(w.unknown) + '</h3><div class="unknown-panel" style="margin-top:0.5rem"><div class="panel-head">' + ICON.help + "<h2>What we don't know</h2></div><ol>" +
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
    home: renderHome, schedule: renderSchedule, week: renderWeek, presentations: renderPresentations,
    assessments: renderAssessments, policies: renderPolicies, concepts: renderConcepts,
    drafts: renderDrafts, notfound: renderNotFound
  };
  function boot() {
    var page = document.body.getAttribute("data-page");
    if (page === "drafts") SHOW_DRAFTS = true;
    renderChrome(page);
    var main = $("#main");
    if (main && PAGES[page]) PAGES[page](main);
    wireMissingImages(document);
    checkPDFs(document);
    // Jump to a #hash target after rendering (content is built by script).
    if (window.location.hash) {
      var target = document.getElementById(window.location.hash.slice(1));
      if (target) target.scrollIntoView();
    }
  }
  if (!C) {
    document.addEventListener("DOMContentLoaded", function () {
      var m = $("#main");
      if (m) m.innerHTML = '<div class="wrap"><p>Course data could not be loaded. Check data/course.js for a typo (often a missing comma or quote).</p></div>';
    });
    return;
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
