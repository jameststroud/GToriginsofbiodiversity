# Images

Every image slot on the site hides cleanly when its file is missing, so the site looks finished with no photos at all. To add an image, upload a file here with **exactly** the filename below (see README.md, how-to 6). Recommended size: about **1600 px wide**, JPEG for photos, PNG for line art. Keep files under about 500 KB.

Captions, credits, and alt text for each image live in `data/course.js` (the `image` entry for each week). If you supply your own photo, edit its `caption` and `credit` there.

## Current images (November 11, 2026)

All files were resized (max 1600 px wide; portraits 600 px square) and saved under the names below. Captions, credits and alt text are in `data/course.js`.

| File | Used on | Credit / license | Status |
|---|---|---|---|
| `banner-darwin-i-think-1837.jpg` | Home, beside the hero question | Darwin, Notebook B p. 36 (1837), Cambridge University Library. Public domain | Done |
| `week01-origin-diagram-1859.jpg` | Week 1 | Darwin, *On the Origin of Species* (1859). Public domain | Done |
| `week02-species-pair.jpg` | Week 2 | **Needs credit and species names** | Caption is generic until species are named |
| `week03-cichlids.jpg` | Week 3 | **Published figure: needs a source credit and permission check** | Posted without credit |
| `week04-bci-plot.jpg` | Week 4 (shown taller: `tall: true`) | **Published figure: needs a source credit and permission check** | Posted without credit |
| `week05-gould-finches-1845.jpg` | Week 5 | John Gould, in Darwin, *Journal of Researches* 2nd ed. (1845). Public domain (Wikimedia Commons) | Done |
| `week06-anolis-ecomorphs.png` | Week 6 | **Published figure: needs a source credit and permission check** | Posted without credit |
| `week07-wallace-regions-1876.jpg` | Week 7 (first image) | Wallace, *The Geographical Distribution of Animals*, German edition (title on the map is in German). Public domain | Done |
| `week07-humboldt-chimborazo-1807.jpg` | Week 7 (second image) | Humboldt and Bonpland, *Tableau physique des Andes* (1807). Public domain | Done |
| `week08-bahamas-cay.jpg` | Week 8 | **Needs photo credit** | Posted without credit |
| `week09-haeckel-tree-1866.jpg` | Week 9 | Haeckel, *Generelle Morphologie* (1866); this is the plant-kingdom tree. Public domain | Done |
| `week10-san-marco-pendentives.jpg` | Week 10 | "© 2008 Branislav L. Slantchev" (printed on the image). **Check the license** before the course starts | Credited |
| `week11-trinidad-stream.jpg` | Week 11 | **Needs photo credit** (looks like a two-panel published figure) | Posted without credit |
| `anderson.jpg`, `stroud.jpg` | Home, instructor cards | Instructors' own | Done |
| `anolis research small bahamian key.webp` | Not used | | Uploaded without an expected name; tell Claude where it should go, or delete it |
| `week12-santa-rosalia-pond.jpg` | Week 12 | | Not uploaded (optional); the slot stays hidden |

To add a credit, find the image's `credit: ""` in `data/course.js` and type the credit between the quotes.

**A week can show more than one image:** use `images: [ {...}, {...} ]` in place of `image: {...}` (see Week 7).

Schematic figures (SVG) live in `assets/img/schematics/`; they were drawn for this course.
