# Origins of Biodiversity: course website

BIOS 4803 / BIOL 8803, Georgia Tech, Spring 2027. Dr. Sean Anderson and Dr. James Stroud.

**Live site:** https://www.thestroudlab.com/GToriginsofbiodiversity/ (the address jameststroud.github.io/GToriginsofbiodiversity/ redirects here, because the GitHub account uses the lab domain)

This is a plain website (HTML, CSS, and a little JavaScript). There is no build step. **Nearly everything you will ever change lives in one file: [`data/course.js`](data/course.js).** You can edit it in the browser on github.com, and the site updates on its own.

### Editing on github.com, in general

1. Open the file on github.com and click the **pencil icon** (Edit this file).
2. Make your change. In `course.js`, keep the quote marks around text and the comma at the end of each line. A missing comma or quote is the most common way to break the site.
3. Click **Commit changes**, add a short note (for example "Add Week 3 PDFs"), and commit to `main`.
4. Wait a minute or two, then reload the live site (see how-to 7).

If a page ever shows "Course data could not be loaded," the last edit to `course.js` has a typo. Open the file's **History**, look at the last change, and fix the stray comma or quote.

---

## 1. Add a reading PDF

1. Open the week's folder, for example [`readings/week-05/`](readings/week-05/). Its `README.md` lists every reading and the **exact filename** to use (for example `boag-grant-1981.pdf`).
2. Rename your PDF on your computer to that exact filename: lowercase, hyphens, no spaces.
3. In the folder on github.com click **Add file → Upload files**, drag the PDF in, and click **Commit changes**.

That's it. The "PDF coming soon" chip on the week page turns into a **PDF** button automatically once the file exists. Filenames follow `firstauthor-year.pdf` (two authors: `first-second-year.pdf`).

**Week 7, Wallace (1876)** is "selected reading TBD." When you choose the selection, find the Wallace entry in Week 7 of `course.js`, set `pdf: "readings/week-07/wallace-1876.pdf"`, change `source` to describe the selection, delete `tbd: true`, and upload the file.

## 2. Change a date, a reading, or a room

All in `data/course.js`:

- **Room:** near the top, `room: "TBA"`. Change to, for example, `room: "Clough 144"`.
- **Canvas link:** `canvasUrl: ""`. Paste the Canvas address between the quotes; a Canvas button then appears on the home page.
- **Class dates:** each week has `tue: "2027-02-09", thu: "2027-02-11"`. Dates are written YEAR-MONTH-DAY.
- **Midterm oral exam:** `midterm: { label: ..., date: "" }`. Put the date as text (for example `date: "Thu Mar 4"`), and update `label`. `afterWeek` sets where it appears on the schedule (currently after Week 8, a placeholder).
- **Final oral exam (Week 12):** change `datesLabel: "Dates TBA"`.
- **April 6 to 27 class days:** the `tbaBlock` entry. Edit its `label`, `note`, and `days`.
- **A reading:** each reading is one line with `authors`, `year`, `title`, `source`, `doi`, and `pdf`. Edit in place, or copy a whole line to add a reading (keep the comma between lines). The DOI is just the part after `https://doi.org/`.
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

## 4. Approve a drafted framing paragraph

Each of Weeks 1 to 11 has a drafted **framing paragraph** (`intro`). Drafts are **hidden from students**.

1. **Preview:** open [`drafts.html`](https://www.thestroudlab.com/GToriginsofbiodiversity/drafts.html) to read every draft on one page, or add `&drafts=1` to a week page address, for example `week.html?n=5&drafts=1`. Drafts appear with an amber "DRAFT, not visible to students" badge.
2. **Edit** the `text` in that week's `intro` in `course.js`.
3. **Approve:** change `status: "draft"` to `status: "approved"`. Commit. It now shows to everyone.

**Note:** drafts are hidden on the site, but anyone who opens `course.js` in this public repository can read them.

**Optional "What we don't know" panel.** Each week has `unknown: null`, so no panel shows. To add one, replace `null` with:

```js
unknown: { status: "approved", questions: [
  "First open question?",
  "Second open question?"
] },
```

## 5. Assign graduate presenters

At the bottom of `course.js`, `presentations` has one line per week:

```js
{ week: 5, presenter: "Jane Doe", paper: "Smith et al. 2026, Nature", doi: "10.1038/xxxx", slides: "" },
```

Fill in `presenter`; optionally `paper`, its `doi` (links the paper), and `slides` (a link). Blank presenters show as "To be assigned," on the Presentations page and on that week's page.

## 6. Add or replace an image

1. See [`images/README.md`](images/README.md) for every filename, a suggested subject, and the recommended size (about **1600 px wide**; instructor portraits square).
2. Upload to the `images/` folder with exactly that filename (**Add file → Upload files**). Uploading a file with the same name replaces the old one.
3. Edit the image's `caption` and `credit` for that week in `course.js`. Missing images simply don't show, so there is never a broken-image icon.

Four historical images still need downloading from Wikimedia Commons (the build was rate-limited; only the Gould finch plate came through); `images/README.md` has the links.

## 7. How long changes take

Usually **one to two minutes**. To check progress, open the repository's **Actions** tab: the "pages build and deployment" run shows yellow while it works and green when the site is live. If a page looks stale, do a hard reload (Shift + reload). **Settings → Pages** shows the live address and the last deployment.

## 8. Copyright caveat

The repository and the site are **public**. The course-use notice on every page, the `noindex` tag on week pages, and `nofollow` on PDF links discourage search engines from finding the PDFs, **but they do not restrict access**: anyone with the address can download a PDF. If that is a concern for a particular reading, link to it from Canvas instead of uploading it here (leave its `pdf` field blank so the site shows "Coming soon," or put a Canvas address in `pdf`).

---

## For reference

| File | What it is |
|---|---|
| `data/course.js` | **All content.** Edit this |
| `index.html`, `schedule.html`, `week.html`, `presentations.html`, `assessments.html`, `policies.html`, `concepts.html` | Page shells; content comes from `course.js` |
| `drafts.html` | Hidden draft-review page (not in the menu) |
| `404.html` | Not-found page |
| `assets/css/site.css`, `assets/js/site.js` | Styles and rendering (no routine edits needed) |
| `assets/img/schematics/` | SVG figures drawn for the course |
| `images/` | Photos and historical images, with `README.md` |
| `readings/week-01/` to `readings/week-12/` | PDFs, each with a `README.md` of expected filenames |
| `syllabus/Origins_of_Biodiversity_Syllabus.pdf` | The syllabus |
| `VERIFICATION.md` | Citation and fact checks |

**Testing a date:** add `?today=2027-02-10` to any page address to see the site as it would look on that day.

**Deployment:** GitHub Pages, from the `main` branch, root folder (**Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: main, folder: / (root) → Save**). The `.nojekyll` file tells Pages to serve files as they are.
