# Images

Every image slot on the site hides cleanly when its file is missing, so the site looks finished with no photos at all. To add an image, upload a file here with **exactly** the filename below (see README.md, how-to 6). Recommended size: about **1600 px wide**, JPEG for photos, PNG for line art. Keep files under about 500 KB.

Captions, credits, and alt text for each image live in `data/course.js` (the `image` entry for each week). If you supply your own photo, edit its `caption` and `credit` there.

## Historical images (public domain, from Wikimedia Commons)

| Filename | Subject | Commons source | License | Status |
|---|---|---|---|---|
| `banner-darwin-i-think-1837.png` | Darwin's "I think" sketch, Notebook B (1837 to 1838), p. 36. **Home banner.** | https://commons.wikimedia.org/wiki/File:Darwin_Tree_1837.png (alternative: `File:Darwins_first_tree.jpg`) | Public domain | **Still needed.** Download was rate-limited (HTTP 429). Save the original from the Commons page. |
| `week01-origin-diagram-1859.png` | The only figure in *On the Origin of Species* (1859) | https://commons.wikimedia.org/wiki/File:On_the_Origin_of_Species_diagram.PNG (alternative: `File:Darwin_divergence.jpg`) | Public domain | **Still needed.** Rate-limited (HTTP 429). |
| `week05-gould-finches-1845.jpg` | Gould's finch heads, Darwin's *Journal of Researches*, 2nd ed. (1845) | https://commons.wikimedia.org/wiki/File:Darwin%27s_finches_by_Gould.jpg | Public domain (Commons: "Public domain"; artist John Gould) | **Downloaded** (1748 x 1319 px). |
| `week07-wallace-regions-1876.jpg` | Wallace's map of zoogeographical regions, frontispiece of *The Geographical Distribution of Animals* (1876) | Not yet located. Search Commons for "Wallace 1876 zoogeographical regions" or take the frontispiece from a scanned copy of the book on Commons or the Biodiversity Heritage Library. | Public domain (1876) | **Still needed.** |
| `week09-haeckel-tree-1866.jpg` | Haeckel's 1866 tree of life (*Generelle Morphologie der Organismen*) | Candidates: `File:Haeckel_arbol_bn.png`; `File:Haeckel,_Generelle_Morphologie_...,_1866_Wellcome_L0028827.jpg` (check the license line: Wellcome scans are often CC BY 4.0, which needs a credit). | Public domain (1866), check the scan's license | **Still needed.** The caption already notes it is a historical object and that Haeckel promoted racist and eugenic ideas. |

The licenses above are as listed on each Commons file page (checked through the Commons API on November 10, 2026), except the two not yet located.

## Images the instructors will supply

| Filename | Suggested subject | Notes |
|---|---|---|
| `week02-species-pair.jpg` | A sister-species pair from Dr. Anderson's study system | Add the species names to the caption |
| `week03-cichlids.jpg` | African cichlid fishes | |
| `week04-bci-plot.jpg` | The Barro Colorado Island forest plot, Panama | |
| `week06-anolis-ecomorphs.jpg` | *Anolis* ecomorphs | |
| `week07-humboldt-chimborazo-1807.jpg` | Humboldt's Chimborazo profile (1807) | Optional, public domain. Not wired to a page yet; to use it, swap it into Week 7's `image` in `data/course.js` |
| `week08-bahamas-cay.jpg` | A small Bahamian cay | |
| `week10-san-marco-pendentives.jpg` | Pendentives of the Basilica of San Marco, Venice | **Needs a Creative Commons credit line** in `credit` |
| `week11-trinidad-stream.jpg` | A Trinidad stream (guppy habitat) | |
| `week12-santa-rosalia-pond.jpg` | Santa Rosalia pond | Optional |
| `anderson.jpg` | Portrait, Dr. Anderson | Square, at least 300 x 300 px. Initials show until uploaded |
| `stroud.jpg` | Portrait, Dr. Stroud | Square, at least 300 x 300 px |

Schematic figures (SVG) live in `assets/img/schematics/`; they were drawn for this course.
