# Origins of Biodiversity: course website

BIOS 4803 / BIOL 8803, Georgia Tech, Spring 2027. Dr. Sean Anderson and Dr. James Stroud.

**Live site:** https://www.thestroudlab.com/GToriginsofbiodiversity/ (the address jameststroud.github.io/GToriginsofbiodiversity/ redirects here, because the GitHub account uses the lab domain)

This is a plain website (HTML, CSS, and a little JavaScript). **Nearly everything you will ever change lives in one file: [`data/course.js`](data/course.js).** You can edit it in the browser on github.com, and the site updates on its own: an automatic check reads your edit, then rebuilds the pages (see how-to 7). You never need to edit the `.html` files; they are regenerated from `course.js`.

### Editing on github.com, in general

1. Open the file on github.com and click the **pencil icon** (Edit this file).
2. Make your change. In `course.js`, keep the quote marks around text and the comma at the end of each line. A missing comma or quote is the most common way to break the site.
3. Click **Commit changes**, add a short note (for example "Add Week 3 PDFs"), and commit to `main`.
4. Wait a minute or two, then reload the live site (see how-to 7).

**If the check fails.** After every commit, GitHub runs a check on `course.js`. If you made a typo, you will see a red **X** next to your commit (and usually an email). Click the X, then **Details**: the message says in plain English what is wrong and on which line, for example "course.js line 196: the file has a typo... usually a missing comma or quote mark at the end of the line above." Fix that line and commit again. Until then the live pages keep showing the last good version.

---

## 1. Add a reading PDF

1. Open the week's folder, for example [`readings/week-05/`](readings/week-05/). Its `README.md` lists every reading and the **exact filename** to use (for example `boag-grant-1981.pdf`).
2. Rename your PDF on your computer to that exact filename: lowercase, hyphens, no spaces.
3. In the folder on github.com click **Add file → Upload files**, drag the PDF in, and click **Commit changes**.

That's it. The "PDF coming soon" chip on the week page turns into a **PDF** button automatically once the file exists. Filenames follow `firstauthor-year.pdf` (two authors: `first-second-year.pdf`).

### Before you upload a PDF

1. **The PDF must have selectable text, not a scanned picture of the pages.** Screen readers, search and copy-paste all need real text.
2. **How to check:** open the PDF and try to select a sentence with your cursor. If you can highlight words, it is fine. If the whole page selects as one picture, it is a scan.
3. **How to fix a scan:** download the text-based version from the publisher's website (usually the best option); or in Adobe Acrobat use **Scan & OCR** (or **Accessibility → Make accessible**); or ask Georgia Tech's accessibility services for help.

The automatic check warns you (a yellow note, not a failure) if an uploaded PDF looks like a scan.

**Week 7, Wallace (1876)** is "selected reading TBD." When you choose the selection, find the Wallace entry in Week 7 of `course.js`, set `pdf: "readings/week-07/wallace-1876.pdf"`, change `source` to describe the selection, delete `tbd: true`, and upload the file.

## 2. Change a date, a reading, or a room

All in `data/course.js`:

- **Room:** near the top, `room: "TBA"`. Change to, for example, `room: "Clough 144"`.
- **Canvas link:** `canvasUrl: ""`. Paste the Canvas address between the quotes; a Canvas button then appears on the home page.
- **Class dates:** each week has `tue: "2027-02-09", thu: "2027-02-11"`. Dates are written YEAR-MONTH-DAY.
- **Midterm oral exam:** `midterm: { label: ..., date: "" }`. Put the date as text (for example `date: "Thu Mar 4"`), and update `label`. `afterWeek` sets where it appears on the schedule (currently after Week 8, a placeholder).
- **Final oral exam (Week 12):** change `datesLabel: "Dates TBA"`.
- **April 6 to 27 class days:** the `tbaBlock` entry. Edit its `label`, `note`, and `days`.
- **A reading:** each reading is one line with `short`, `authors`, `year`, `title`, `source`, `doi`, and `pdf`. Edit in place, or copy a whole line to add a reading (keep the comma between lines). The DOI is just the part after `https://doi.org/`. `short` is a few-word title shown on the home page's "This week" card (for example `short: "Homage to Santa Rosalia"`); if it is blank the card shows just the author and year.
- **Concept index:** every week's `concepts` appear on the Concept index, except those listed in `conceptIndexExclude` (lecture section headings). They still show on their week page. Copy the wording exactly.
- **Last updated** (shown in the footer): `lastUpdated` near the top. Edit by hand.

## 3. Post or remove an announcement

Near the top of `course.js`:

```js
announcement: {
  show: true,
  text: "Thursday's class moves to Room 152."
},
```

Set `show: true` to display a slim gold banner at the top of every page. Set `show: false` to hide it.

## 4. Week summaries

Each of Weeks 1 to 11 has a summary paragraph (`intro`) with a status:

- `status: "approved"`: shown to everyone. All 11 summaries are approved.
- `status: "draft"`: hidden from students.

**To edit,** change the `text` between the quote marks. If your text needs a double quote inside it, type `\"`; apostrophes are fine as they are.

**To hide** a summary while you rework it, change `"approved"` to `"draft"`. You can still preview it on [`drafts.html`](https://www.thestroudlab.com/GToriginsofbiodiversity/drafts.html), or by adding `?drafts=1` to the week's address (for example `week-05.html?drafts=1`), where it carries an amber "DRAFT" badge. Drafts are never written into the published pages, but anyone who opens `course.js` in this public repository can read them. Change it back to `"approved"` to publish.

## 5. Assign graduate presenters

At the bottom of `course.js`, `presentations` has one line per week:

```js
{ week: 5, presenter: "Jane Doe", paper: "Smith et al. 2026, Nature", doi: "10.1038/xxxx", slides: "" },
```

Fill in `presenter`; optionally `paper`, its `doi` (links the paper), and `slides` (a link). Blank presenters show as "To be assigned," on the Presentations page and on that week's page.

## 6. Add or replace an image

1. See [`images/README.md`](images/README.md) for every filename, a suggested subject, and the recommended size (about **1600 px wide**; instructor portraits square).
2. Upload to the `images/` folder with exactly that filename (**Add file → Upload files**). Uploading a file with the same name replaces the old one.
3. Edit the image's `caption` and `credit` for that week in `course.js`.

Image sizes are read automatically when the pages are rebuilt. If `course.js` names an image that has not been uploaded, the check fails and tells you which file is missing; upload it, or fix the name. A week can show several images: use `images: [ {...}, {...} ]` in place of `image: {...}` (see Week 7).

## 7. How long changes take

Usually **one to two minutes**. Two things happen after you commit, both visible in the repository's **Actions** tab:

1. **Check and build site** reads `course.js`, rebuilds the pages, and saves them back to `main` as a commit named "Rebuild pages" (from github-actions). This takes about a minute. The same check also runs once a day so "This week" stays current.
2. **pages build and deployment** then publishes the site. Yellow means working, green means live.

If a page looks stale, do a hard reload (Shift + reload). **Settings → Pages** shows the live address and the last deployment.

## 8. Copyright caveat

The repository and the site are **public**. The course-use notice under every reading list, the `noindex` tag on week pages, and `nofollow` on PDF links discourage search engines from finding the PDFs, **but they do not restrict access**: anyone with the address can download a PDF. If that is a concern for a particular reading, link to it from Canvas instead of uploading it here (leave its `pdf` field blank so the site shows "Coming soon," or put a Canvas address in `pdf`).

---

## For reference

| File | What it is |
|---|---|
| `data/course.js` | **All content.** Edit this |
| `index.html`, `schedule.html`, `week-01.html` to `week-12.html`, `presentations.html`, `assessments.html`, `policies.html`, `concepts.html`, `404.html` | **Generated pages: do not edit.** Rebuilt automatically from `course.js` |
| `week.html` | Forwards old links such as `week.html?n=5` to `week-05.html` |
| `drafts.html` | Hidden draft-review page (not in the menu) |
| `templates/` | Page shells the build fills in (no routine edits needed) |
| `tools/check.js`, `tools/build.js`, `.github/workflows/site.yml` | The automatic check and rebuild |
| `data/generated-files.js` | Generated: image sizes and uploaded PDFs. Do not edit |
| `assets/css/site.css`, `assets/js/site.js` | Styles and rendering (no routine edits needed) |
| `assets/img/schematics/` | SVG figures drawn for the course |
| `images/` | Photos and historical images, with `README.md` |
| `readings/week-01/` to `readings/week-12/` | PDFs, each with a `README.md` of expected filenames |
| `syllabus/Origins_of_Biodiversity_Syllabus.pdf` | The syllabus |
| `VERIFICATION.md` | Citation and fact checks |

**Testing a date:** add `?today=2027-02-10` to any page address (for example `schedule.html?today=2027-02-10`) to see the site as it would look on that day.

**Deployment:** GitHub Pages, from the `main` branch, root folder (**Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: main, folder: / (root) → Save**). The `.nojekyll` file tells Pages to serve files as they are. To rebuild by hand on your own computer: `npm install`, then `npm run check` and `npm run build`.
