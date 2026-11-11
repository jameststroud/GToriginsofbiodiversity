/* =====================================================================
   ORIGINS OF BIODIVERSITY: ALL COURSE CONTENT LIVES IN THIS FILE
   =====================================================================

   How to edit (see README.md for step-by-step instructions):
   - Change text between the quote marks "like this". Keep the quotes.
   - Keep the commas at the end of lines. A missing comma breaks the site.
   - Dates are written YYYY-MM-DD, for example "2027-02-09".
   - Leave a field as "" (empty quotes) when there is nothing to show yet.
   - After you commit, the live site updates in a minute or two.

   Draft text:
   Every "intro" and "unknown" has a status: "draft" (hidden from students)
   or "approved" (shown). Drafts are
   hidden from students. Preview them by adding ?drafts=1 to a page
   address, or open drafts.html. When a draft is ready, edit the text and
   change "draft" to "approved".
   ===================================================================== */

window.COURSE = {

  /* ---------------- Course basics ---------------- */
  course: {
    codes: "BIOS 4803 / BIOL 8803",
    title: "Origins of Biodiversity",
    term: "Spring 2027",
    institution: "Georgia Tech",
    credits: 3,
    meets: "Tuesdays and Thursdays, 2:00 to 3:15 pm",
    room: "TBA",
    canvasUrl: "",            // paste the Canvas course address here; the Canvas link stays hidden while blank
    syllabusPdf: "syllabus/Origins_of_Biodiversity_Syllabus.pdf",
    lastUpdated: "November 11, 2026"   // edit by hand whenever you make changes
  },

  /* ---------------- Announcement banner (top of every page) ---------------- */
  announcement: {
    show: false,              // change to true to show the banner
    text: ""
  },

  /* ---------------- Instructors ---------------- */
  instructors: [
    { name: "Dr. Sean Anderson", email: "sean.anderson@gatech.edu", office: "CE 235",
      hours: "By appointment", photo: "images/anderson.jpg" },
    { name: "Dr. James Stroud", email: "stroud@gatech.edu", office: "ES&T 2240",
      hours: "By appointment", photo: "images/stroud.jpg" }
  ],

  /* ---------------- Home page text (from the syllabus) ---------------- */
  home: {
    heroQuestion: "Why are there so many kinds of animals?",
    heroCredit: "G. Evelyn Hutchinson, 1959. Nearly 70 years later, still open.",
    banner: {
      file: "images/banner-darwin-i-think-1837.jpg",
      alt: "Charles Darwin's 1837 notebook sketch of a branching tree of descent, headed with the words I think.",
      caption: "Darwin's \"I think\" sketch (1837), his first drawing of a branching tree of descent.",
      credit: "Charles Darwin, Notebook B, p. 36 (1837). Cambridge University Library. Public domain."
    },
    scope: [
      "In this course, you will explore the fundamental ecological and evolutionary processes that generate and maintain biological diversity across scales, from genes to ecosystems. Students will examine how species originate, interact, and adapt to their environments through a modern synthesis of evolutionary theory and ecological principles. The course emphasizes both conceptual frameworks and empirical research, providing graduate students and advanced undergraduates with fundamental tools to understand biodiversity patterns and processes.",
      "Each class will revolve around a basic concept, from which we have identified a set of core concepts that we think all biology graduate students leaving with a PhD from our department should have a working understanding of. Each class will have required readings, a short lecture portion, and student activity (e.g., higher level journal discussion, or some other effective active learning technique that will engage students)."
    ],
    objectivesLead: "By the end of this course, you will be able to:",
    objectives: [
      "Identify and evaluate the major ecological and evolutionary processes responsible for generating and maintaining biodiversity",
      "Read and critically analyze primary literature spanning ecology, evolutionary biology, biogeography, and behavior",
      "Develop and articulate your own position on active debates in the field, supported by evidence",
      "Connect short-term micro-scale processes to macro-scale patterns, and recognize where those connections remain contested",
      "Identify unresolved questions at the leading edge of contemporary ecological and evolutionary research, and evaluate what kinds of evidence would advance them"
    ],
    unknownCallout: "Critically, each class will end with what we don't know. Unresolved questions are as important as settled ones, and learning to identify the frontier is a core skill for any research biologist.",
    aiCallout: "AI writing tools are not permitted in this course."
  },

  /* ---------------- Course-use notice for PDFs ---------------- */
  pdfNotice: "These PDFs are provided solely for students enrolled in BIOS 4803 / BIOL 8803 at Georgia Tech, for use in this course. Do not share, post, or distribute them.",

  /* ---------------- Calendar items that are not regular weeks ----------------
     "afterWeek" places the item in the schedule directly after that week.   */
  noClass: [
    { label: "Spring break", dates: "March 8 to 12", start: "2027-03-08", end: "2027-03-12", afterWeek: 8, note: "No class." }
  ],
  midterm: { label: "Midterm oral exam, date TBA", date: "", afterWeek: 8,
             note: "10 minutes with Drs. Anderson and Stroud. See Assessments for the format and rubric." },
  tbaBlock: { label: "To be announced", dates: "April 6 to April 27", start: "2027-04-06", end: "2027-04-27", afterWeek: 11,
              days: ["Tue Apr 6", "Thu Apr 8", "Tue Apr 13", "Thu Apr 15", "Tue Apr 20", "Thu Apr 22", "Tue Apr 27"],
              note: "Class days not yet assigned in the syllabus. Details to come." },

  /* ---------------- Theme color bands ---------------- */
  themes: {
    speciation: { label: "Speciation and contact", color: "#2F5D50" },
    communities: { label: "Communities", color: "#5B7F3A" },
    rates: { label: "Rates and radiations", color: "#B3A369" },
    space: { label: "Space and islands", color: "#3F6E8C" },
    history: { label: "History, behavior, and feedbacks", color: "#6B4E8C" },
    exam: { label: "Final oral exam", color: "#54585A" }
  },

  /* ---------------- Concept index exclusions ----------------
     Concepts listed here still show on their week page but are left out of
     the Concept index (they are lecture section headings, not terms).
     Copy the wording exactly as it appears in the week's "concepts" list.   */
  conceptIndexExclude: [
    "Darwin's insight and what he lacked",
    "secondary contact as the \"moment of truth\"",
    "pre-Darwinian views",
    "taxonomy vs. evolutionary biology",
    "community definition",
    "major biogeographic patterns",
    "historical explanations",
    "geology and biodiversity (Wallace's Line, plate tectonics)",
    "ecological and evolutionary consequences of behavior",
    "historical development of eco-evolutionary dynamics",
    "community and ecosystem consequences of evolution"
  ],

  /* ---------------- Weekly "before class" note (from the syllabus) ---------------- */
  beforeClass: "Submit a brief (1-2 paragraph) reading response on Canvas before each class. Each class opens with a short hand-written quiz on the pre-class readings.",

  /* =====================================================================
     WEEKS
     One entry per week. Readings: one entry per reading.
     pdf: the expected file path. Upload a PDF with exactly that name and
     it goes live automatically. Until then the site shows "Coming soon".
     ===================================================================== */
  weeks: [

    /* ---------- Week 1 ---------- */
    {
      n: 1, title: "An Introduction to Biodiversity", tue: "2027-01-12", thu: "2027-01-14", theme: "speciation",
      concepts: ["unequal distribution of biodiversity", "measures of diversity", "pre-Darwinian views",
                 "Darwin's insight and what he lacked", "natural selection", "the Modern Synthesis"],
      intro: { status: "approved", text: "In many different ways, life is not spread evenly across the planet. Before Darwin, most naturalists saw that variety as fixed (Linnaeus) or as directed toward ever greater complexity (Lamarck), rather than as the product of an undirected process. Darwin (1859) famously supplied that process: evolution by natural selection. Yet Darwin lacked a working theory of inheritance, which was a critical piece of information to provide a complete theory. In the early to mid-20th century, with the rise of genetics, the architects of the Modern Synthesis closed this gap, fully formalizing a “neo-Darwinian” theory of evolution. A century after Darwin, G. Evelyn Hutchinson (1959) asked the question this course is built around: why are there so many kinds of animals? Whether the Modern Synthesis, built around genes and natural selection, is enough to answer it remains an active debate, and one we will return to all semester." },
      unknown: { status: "draft", questions: [
        "Is the unequal distribution of biodiversity the product of a few general processes, or of many separate histories?",
        "Is a theory built around genes and natural selection enough to explain why there are so many kinds of animals, or does it need a rethink (Laland et al. 2014)?"
      ] },
      image: { file: "images/week01-origin-diagram-1859.jpg",
               alt: "Darwin's branching diagram from On the Origin of Species: lettered lineages splitting over time, with many branches ending in extinction.",
               caption: "The only figure in On the Origin of Species (1859): Darwin's diagram of lineages diverging over time, with many ending in extinction.",
               credit: "Charles Darwin, On the Origin of Species (1859). Public domain." },
      schematic: null,
      readings: [
        { short: "Origin of Species, Introduction", authors: "Darwin, C.", year: 1859, title: "Introduction", source: "In: On the Origin of Species", doi: "", pdf: "readings/week-01/darwin-1859-introduction.pdf" },
        { short: "Origin of Species, Chapter IV", authors: "Darwin, C.", year: 1859, title: "Chapter IV: Natural Selection", source: "In: On the Origin of Species", doi: "", pdf: "readings/week-01/darwin-1859-ch4.pdf" },
        { short: "Homage to Santa Rosalia", authors: "Hutchinson, G.E.", year: 1959, title: "Homage to Santa Rosalia or why are there so many kinds of animals?", source: "The American Naturalist 93(870):145-159", doi: "10.1086/282070", pdf: "readings/week-01/hutchinson-1959.pdf" },
        { short: "Does evolutionary theory need a rethink?", authors: "Laland, K. et al.", year: 2014, title: "Does evolutionary theory need a rethink?", source: "Nature 514(7521):161-164", doi: "10.1038/514161a", pdf: "readings/week-01/laland-2014.pdf" }
      ]
    },

    /* ---------- Week 2 ---------- */
    {
      n: 2, title: "What Is a Species and How Are They Formed?", tue: "2027-01-19", thu: "2027-01-21", theme: "speciation",
      concepts: ["species concepts", "speciation mechanisms", "reproductive isolation (pre- vs. post-zygotic; intrinsic vs. extrinsic)",
                 "the speciation continuum", "geography of speciation", "taxonomy vs. evolutionary biology"],
      intro: { status: "approved", text: "Species are the currency of biodiversity, yet biologists still disagree about what a species actually is. Ernst Mayr defined species by reproductive isolation, coining the term “biological species concept,” while other concepts emphasize ecology, morphology, or ancestry, revealing that the needs of taxonomy and of evolutionary biology do not always align. Speciation is best viewed as a continuum, from populations that interbreed freely to lineages that never will. Along it, reproductive isolation accumulates through barriers that act before or after fertilization (prezygotic and postzygotic), arising either from intrinsic genetic incompatibilities or from the external environment. However, geography is also of fundamental importance: allopatric speciation (divergence in geographic isolation) has long been treated as the default, due to ongoing debates on the degree to which sympatric speciation may occur. But, how often is speciation the result of divergent natural selection between environments, rather than separation alone, that drives two populations apart?" },
      unknown: { status: "draft", questions: [
        "Is there a point along the speciation continuum beyond which divergence can no longer be reversed?",
        "How often does divergent natural selection between environments, rather than geographic separation alone, drive reproductive isolation?",
        "Can a single species concept serve both taxonomy and evolutionary biology?"
      ] },
      image: { file: "images/week02-species-pair.jpg",
               alt: "Two small, nearly identical olive-brown flycatchers held side by side in a hand.",
               caption: "Sibling species: the Alder Flycatcher (Empidonax alnorum) and the Willow Flycatcher (Empidonax traillii). The two look almost identical and were once treated as a single species; they are told apart mainly by song.",
               credit: "Photo: The Ohio State University Museum of Biological Diversity, \"Examples of sibling species\" (blog post, September 28, 2015)." },
      schematic: { file: "assets/img/schematics/speciation-continuum.svg",
                   alt: "Diagram of the speciation continuum: from a single population, through ecotypes and incipient species, to full species, as reproductive isolation increases.",
                   caption: "The speciation continuum: populations, ecotypes, incipient species, and full species along a gradient of increasing reproductive isolation. Schematic drawn for this course." },
      readings: [
        { short: "Differentiation of populations", authors: "Ehrlich, P.R. & Raven, P.H.", year: 1969, title: "Differentiation of populations: Gene flow seems to be less important in speciation than the neo-Darwinians thought", source: "Science 165(3899):1228-1232", doi: "10.1126/science.165.3899.1228", pdf: "readings/week-02/ehrlich-raven-1969.pdf" },
        { short: "Ecology and the origin of species", authors: "Schluter, D.", year: 2001, title: "Ecology and the origin of species", source: "Trends in Ecology & Evolution 16(7):372-380", doi: "10.1016/S0169-5347(01)02198-X", pdf: "readings/week-02/schluter-2001.pdf" },
        { short: "Speciation, Chapters 1 and 2", authors: "Coyne, J.A. & Orr, H.A.", year: 2004, title: "Speciation, Chapters 1 and 2", source: "Book chapters", doi: "", pdf: "readings/week-02/coyne-orr-2004-ch1-2.pdf" },
        { short: "Divergent ecological adaptation during allopatric speciation", authors: "Anderson, S.A.S. & Weir, J.T.", year: 2022, title: "The role of divergent ecological adaptation during allopatric speciation in vertebrates", source: "Science 378(6625):1214-1218", doi: "10.1126/science.abo7719", pdf: "readings/week-02/anderson-weir-2022.pdf" }
      ]
    },

    /* ---------- Week 3 ---------- */
    {
      n: 3, title: "The Outcomes of Secondary Contact", tue: "2027-01-26", thu: "2027-01-28", theme: "speciation",
      concepts: ["secondary contact as the \"moment of truth\"", "species fusion", "competitive and reproductive exclusion",
                 "character displacement", "reinforcement", "species sorting", "hybridization", "genomic introgression"],
      intro: { status: "approved", text: "Divergence in isolation (i.e., allopatry) is only half the story. When diverged populations meet again in space, secondary contact becomes the moment of truth. Perhaps, the most exciting situation any evolutionary biologist can witness. These two “incipient species” (i.e., populations) may hybridize and fuse back into one species, one may exclude the other through competition or reproductive interference, or both may persist side by side. But, importantly, interactions during secondary contact can themselves drive evolution. Brown and Wilson (1956) described character displacement, in which coexisting species diverge where they overlap, and Dobzhansky championed reinforcement, in which selection against unfit hybrids completes reproductive isolation. However, one curiosity revealed in contemporary evolutionary biology is that even species that remain distinct may occasionally exchange genes through introgression. Increasingly, we suspect that the patterns we see in nature reflect species sorting as much as evolutionary change: contact may determine which species pairs persist at all, not just how they evolve once they meet." },
      unknown: { status: "draft", questions: [
        "When we see character displacement in nature, how often is it divergence after contact, and how often is it the sorting of species that were already different?",
        "How common is reinforcement, and how would we recognize it in the wild?",
        "When does genomic introgression fuel diversification, and when does it collapse species back together?"
      ] },
      image: { file: "images/week03-character-displacement.jpg",
               alt: "Three-panel figure: two threespine sticklebacks of different shapes on a palm; two spadefoot toad tadpoles, one with a much broader head; and five weasel skulls arranged from smallest to largest.",
               caption: "Classic examples of ecological character displacement, in which competing species diverge where they live together. (A) Benthic (i) and limnetic (ii) threespine sticklebacks, which have diverged in body shape and size where they co-occur. (B) Where Mexican and Plains spadefoot toads share ponds, Mexican spadefoot tadpoles more often develop into omnivore morphs (i) and Plains spadefoot tadpoles into carnivore morphs (ii). (C) Skulls of North American weasels, with each sex treated as a separate \"morphospecies\": (i) female least weasel, (ii) female ermine, (iii) male ermine, (iv) female long-tailed weasel, and (v) male long-tailed weasel. Neighboring sizes differ by roughly equal ratios.",
               credit: "Figure I from Stuart, Y.E. & Losos, J.B. (2013). Ecological character displacement: glass half full or half empty? Trends in Ecology & Evolution 28(7):402-408. Photos: L. Southcott (A), D. Pfennig (B), S. Meiri (C)." },
      schematic: null,
      readings: [
        { short: "Character displacement", authors: "Brown, W.L. & Wilson, E.O.", year: 1956, title: "Character displacement", source: "Systematic Zoology 5(2):49-64", doi: "10.2307/2411924", pdf: "readings/week-03/brown-wilson-1956.pdf" }
        { short: "The role of reinforcement in speciation", authors: "Servedio, M.R. & Noor, M.A.F.", year: 2003, title: "The role of reinforcement in speciation: theory and data", source: "Annual Review of Ecology, Evolution, and Systematics 34:339-364", doi: "10.1146/annurev.ecolsys.34.011802.132412", pdf: "readings/week-03/servedio-noor-2003.pdf" },
        { short: "African cichlid fish", authors: "Seehausen, O.", year: 2006, title: "African cichlid fish: a model system in adaptive radiation research", source: "Proceedings of the Royal Society B: Biological Sciences 273(1597):1987-1998", doi: "10.1098/rspb.2006.3539", pdf: "readings/week-03/seehausen-2006.pdf" },
        { short: "Secondary sympatry as a sorting process", authors: "Anderson, S.A.S. & Matute, D.R.", year: 2025, title: "Secondary sympatry as a sorting process", source: "Ecology Letters 28(4):e70108", doi: "10.1111/ele.70108", pdf: "readings/week-03/anderson-matute-2025.pdf" }
      ]
    },

    /* ---------- Week 4 ---------- */
    {
      n: 4, title: "How Are Communities Assembled?", tue: "2027-02-02", thu: "2027-02-04", theme: "communities",
      concepts: ["community definition", "niche theory", "ecological community assembly", "priority effects", "forbidden pairs",
                 "environmental filtering", "null models", "neutral theory", "modern coexistence theory",
                 "niche and resource partitioning", "beta vs. alpha diversity"],
      intro: { status: "approved", text: "Why do some species occur together while others never do? Stemming from Hutchinson's concept of an ecological “niche”, and MacArthur's (1958) subsequent example of warblers foraging in different parts of the same spruce trees, suggested that competition sorts species into communities by their differences. Yet patterns such as forbidden pairs (ecologically similar species that appear never to co-occur) sparked a heated debate through the late 1970s and early 1980s over whether chance alone could produce them, establishing null models as a standard tool of community ecology (the “null model wars”!) Hubbell's neutral theory pushed the question further: how much of community structure can we explain if species are treated as ecologically equivalent? Most recently, greater recognition has been given to the role of history, as the order in which species arrive (priority effects) may shape a community as much as environmental filtering does, helping explain why sites with similar conditions can differ so much in which species they hold (beta diversity)." },
      unknown: { status: "draft", questions: [
        "Are communities assembled mainly by niche differences or by neutral processes, or is that the wrong way to frame the question?",
        "If priority effects can send similar sites down different paths, how predictable is community assembly?",
        "How can modern coexistence theory be tested in diverse communities, where measuring every interaction is impossible?"
      ] },
      image: { file: "images/week04-bci-plot.jpg",
               alt: "Stacked maps of a 50-hectare forest plot; each layer shows the positions of individual trees of one species.",
               caption: "Each layer maps every tree of one species in the 50-hectare forest dynamics plot on Barro Colorado Island, Panama. Some species grow in tight clusters; others are scattered across the whole plot.",
               credit: "" },
      schematic: null,
      readings: [
        { short: "Chance or competition?", authors: "Connor, E.F. & Simberloff, D.", year: 1979, title: "The assembly of species communities: chance or competition?", source: "Ecology 60(6):1132-1140", doi: "10.2307/1936961", pdf: "readings/week-04/connor-simberloff-1979.pdf" },
        { short: "Resource partitioning in ecological communities", authors: "Schoener, T.W.", year: 1974, title: "Resource partitioning in ecological communities", source: "Science 185(4145):27-39", doi: "10.1126/science.185.4145.27", pdf: "readings/week-04/schoener-1974.pdf" },
        { short: "Santa Rosalia was a goat", authors: "Lewin, R.", year: 1983, title: "Santa Rosalia was a goat", source: "Science 221(4611):636-639", doi: "10.1126/science.221.4611.636", pdf: "readings/week-04/lewin-1983.pdf" },
        { short: "The unified neutral theory at age ten", authors: "Rosindell, J., Hubbell, S.P. & Etienne, R.S.", year: 2011, title: "The unified neutral theory of biodiversity and biogeography at age ten", source: "Trends in Ecology & Evolution 26(7):340-348", doi: "10.1016/j.tree.2011.03.024", pdf: "readings/week-04/rosindell-2011.pdf" },
        { short: "Historical contingency in community assembly", authors: "Fukami, T.", year: 2015, title: "Historical contingency in community assembly: integrating niches, species pools, and priority effects", source: "Annual Review of Ecology, Evolution, and Systematics 46:1-23", doi: "10.1146/annurev-ecolsys-110411-160340", pdf: "readings/week-04/fukami-2015.pdf" }
      ]
    },

    /* ---------- Week 5 ---------- */
    {
      n: 5, title: "Evolution on Ecological Timescales", tue: "2027-02-09", thu: "2027-02-11", theme: "rates",
      concepts: ["natural selection", "local adaptation", "the Lande-Arnold statistical framework", "selection gradients",
                 "heritability", "phenotypic plasticity", "measuring selection in the wild", "paradox of stasis"],
      intro: { status: "approved", text: "Darwin thought natural selection far too slow to watch: “We see nothing of these slow changes in progress, until the hand of time has marked the long lapse of ages.” Contemporary evolutionary biology has surprisingly suggested Darwin was wrong. From the 1970s onward, field biologists such as Peter and Rosemary Grant documented intense selection and adaptive change on observable timescales. Pivotal to the development of these ideas, Lande and Arnold (1983) provided a statistical framework for measuring the form and strength of selection directly in the wild. However, this revelation that strong natural selection can be detected in wild populations leaves an enduring puzzle: if selection in the wild can be strong, and many traits are heritable, why do many (most?) populations change far less than these measurements predict? Resolving this “paradox of stasis”, and understanding where phenotypic plasticity fits into it, is one of the central challenges in evolutionary biology today." },
      unknown: { status: "draft", questions: [
        "If selection in the wild can be strong and many traits are heritable, why do so many populations change so little?",
        "Where does phenotypic plasticity fit into the paradox of stasis?",
        "Does selection always beget evolution? If not, what stops it?"
      ] },
      image: { file: "images/week05-gould-finches-1845.jpg",
               alt: "John Gould's engraving of four Galapagos finch heads with beaks of different sizes, from Darwin's Journal of Researches.",
               caption: "Galapagos finch heads, from the second edition of Darwin's Journal of Researches (1845).",
               credit: "John Gould, in Charles Darwin, Journal of Researches, 2nd ed. (1845). Public domain." },
      schematic: { file: "assets/img/schematics/modes-of-selection.svg",
                   alt: "Three panels showing directional, stabilizing, and disruptive selection, each a bell-shaped trait distribution overlaid with a fitness function.",
                   caption: "Modes of selection. Each panel shows a trait distribution (shaded) and a fitness function (line): directional, stabilizing, and disruptive. Schematic drawn for this course." },
      readings: [
        { short: "Intense natural selection in Darwin's finches", authors: "Boag, P.T. & Grant, P.R.", year: 1981, title: "Intense natural selection in a population of Darwin's finches (Geospizinae) in the Galápagos", source: "Science 214(4516):82-85", doi: "10.1126/science.214.4516.82", pdf: "readings/week-05/boag-grant-1981.pdf" },
        { short: "Adaptive differentiation after island colonization", authors: "Losos, J.B., Warheit, K.I. & Schoener, T.W.", year: 1997, title: "Adaptive differentiation following experimental island colonization in Anolis lizards", source: "Nature 387(6628):70-73", doi: "10.1038/387070a0", pdf: "readings/week-05/losos-1997.pdf" },
        { short: "From low to high gear", authors: "Reznick, D.N., Losos, J. & Travis, J.", year: 2019, title: "From low to high gear: there has been a paradigm shift in our understanding of evolution", source: "Ecology Letters 22(2):233-244", doi: "10.1111/ele.13189", pdf: "readings/week-05/reznick-2019.pdf" },
        { short: "Phenotypic selection in natural populations", authors: "Svensson, E.I.", year: 2023, title: "Phenotypic selection in natural populations: what have we learned in 40 years?", source: "Evolution 77(7):1493-1504", doi: "10.1093/evolut/qpad077", pdf: "readings/week-05/svensson-2023.pdf" }
      ]
    },

    /* ---------- Week 6 ---------- */
    {
      n: 6, title: "Evolutionary Radiations", tue: "2027-02-16", thu: "2027-02-18", theme: "rates",
      concepts: ["ecological theory of adaptive radiation", "ecological opportunity", "ecological release", "key innovations",
                 "adaptive divergence", "resource partitioning", "parallel and convergent evolution", "adaptive landscape",
                 "non-adaptive radiation"],
      intro: { status: "approved", text: "Why do some lineages diversify into dozens of ecologically distinct species while their close relatives do not? The answer canonized by George Gaylord Simpson, and made the centerpiece of an ecological theory of adaptive radiation by Dolph Schluter, is ecological opportunity: access to evolutionarily-accessible resources (i.e., those unused, or underused, by competitors). Simpson regarded access to “ecological opportunity” occurring in various scenarios: the colonization of a new depauperate region (e.g., a newly-formed island), surviving a mass extinction, or evolving a “key innovation” that allowed a lineage to use a new part of the environment or resource spectrum. But opportunity does not always lead to radiation, and not every radiation is adaptive. Why?" },
      unknown: { status: "draft", questions: [
        "Why does ecological opportunity lead to adaptive radiation in some lineages but not in others?",
        "How much of the diversity produced by radiations reflects ecological divergence, and how much reflects non-adaptive processes (Rundell and Price 2009)?",
        "Can selection measured in single populations explain the radiation of an entire clade (Grant and Grant 2024)?"
      ] },
      image: { file: "images/week06-cichlids.jpg",
               alt: "Map of Africa ringed by cichlid fishes from West, Southern and East Africa and Lakes Tanganyika, Malawi and Victoria, above an evolutionary tree scaled in millions of years.",
               caption: "African cichlid fishes, a model system for adaptive radiation: lineages from rivers across the continent and from the three great East African lakes (Tanganyika, Malawi, and Victoria), with their evolutionary tree beneath, scaled in millions of years.",
               credit: "" },
      schematic: { file: "assets/img/schematics/adaptive-landscape.svg",
                   alt: "Contour map of a fitness landscape over two trait axes, with two adaptive peaks separated by a valley.",
                   caption: "An adaptive landscape: mean fitness across two traits, with two peaks separated by a valley of low fitness. Schematic drawn for this course." },
      readings: [
        { short: "Ecological causes of adaptive radiation", authors: "Schluter, D.", year: 1996, title: "Ecological causes of adaptive radiation", source: "The American Naturalist 148(Supplement):S40-S64", doi: "10.1086/285901", pdf: "readings/week-06/schluter-1996.pdf" },
        { short: "The Ecology of Adaptive Radiation, Chapter 1", authors: "Schluter, D.", year: 2000, title: "The Ecology of Adaptive Radiation, Chapter 1: The origins of ecological diversity", source: "Oxford University Press, pp. 1-9", doi: "10.1093/oso/9780198505235.003.0001", pdf: "readings/week-06/schluter-2000-ch1.pdf" },
        { short: "Ecological opportunity and adaptive radiation", authors: "Stroud, J.T. & Losos, J.B.", year: 2016, title: "Ecological opportunity and adaptive radiation", source: "Annual Review of Ecology, Evolution, and Systematics 47:507-532", doi: "10.1146/annurev-ecolsys-121415-032254", pdf: "readings/week-06/stroud-losos-2016.pdf" },
        { short: "Adaptive radiation, nonadaptive radiation", authors: "Rundell, R.J. & Price, T.D.", year: 2009, title: "Adaptive radiation, nonadaptive radiation, ecological speciation and nonecological speciation", source: "Trends in Ecology & Evolution 24(7):394-399", doi: "10.1016/j.tree.2009.02.007", pdf: "readings/week-06/rundell-price-2009.pdf" },
        { short: "From microcosm to macrocosm", authors: "Grant, P.R. & Grant, B.R.", year: 2024, title: "From microcosm to macrocosm: adaptive radiation of Darwin's finches", source: "Evolutionary Journal of the Linnean Society 3(1):kzae006", doi: "10.1093/evolinnean/kzae006", pdf: "readings/week-06/grant-grant-2024.pdf" }
      ]
    },

    /* ---------- Week 7 ---------- */
    {
      n: 7, title: "Biological Patterns Across Space", tue: "2027-02-23", thu: "2027-02-25", theme: "space",
      concepts: ["major biogeographic patterns", "historical explanations", "latitudinal diversity gradient", "elevational gradients",
                 "endemism", "dispersal limitation", "vicariance", "range expansions and contractions",
                 "geology and biodiversity (Wallace's Line, plate tectonics)"],
      intro: { status: "approved", text: "Alfred Russel Wallace divided the world into zoogeographical regions, recognizing that where species live carries the signature of geological history. His line through the Malay Archipelago, separating Asian from Australasian faunas across a strait only a few dozen kilometers wide, remains one of biogeography’s starkest boundaries, a divide later explained by plate tectonics and by deep water that stayed open even when Ice Age sea levels fell. At the global scale, the latitudinal diversity gradient (more species toward the tropics) is one of the most general patterns in ecology, yet ecologists have weighed competing explanations for much of the past century. In the late 1960’s, Dan Janzen argued that because tropical organisms experience little seasonal change in temperature, they should be physiologically constrained to tropical environments and so unable to disperse out into temperate regions. In doing so, Janzen presented an important new hypothesis that may explain the latitudinal diversity gradient, linking thermal physiology to dispersal limitation and, potentially, to endemism. These ideas continue to be important today as we consider the role of contemporary climate change on the redistribution of global biodiversity." },
      unknown: { status: "draft", questions: [
        "Why are there more species toward the tropics, and can the competing explanations ever be separated?",
        "How strongly do thermal tolerances limit dispersal, and through it, where species occur?",
        "How will contemporary climate change redistribute the biodiversity patterns that Wallace mapped?"
      ] },
      images: [
        { file: "images/week07-wallace-regions-1876.jpg",
          alt: "Wallace's world map, colored by zoogeographical region, with ocean depths shaded in blue.",
          caption: "Wallace's world map of zoogeographical regions, from the German edition of The Geographical Distribution of Animals.",
          credit: "Alfred Russel Wallace, The Geographical Distribution of Animals (German edition). Public domain." },
        { file: "images/week07-humboldt-chimborazo-1807.jpg",
          alt: "Cross-section of the volcano Chimborazo, with plant names written at the elevations where they grow, flanked by tables of measurements.",
          caption: "Humboldt and Bonpland's Tableau physique des Andes (1807): Chimborazo in cross-section, with plants placed at the elevations where they grow. An early picture of an elevational gradient.",
          credit: "Alexander von Humboldt and Aimé Bonpland (1807). Public domain." }
      ],
      schematic: null,
      readings: [
        { short: "The Geographical Distribution of Animals", authors: "Wallace, A.R.", year: 1876, title: "The Geographical Distribution of Animals", source: "Selected reading TBD", doi: "", pdf: "", tbd: true },
        { short: "Patterns of species diversity", authors: "MacArthur, R.H.", year: 1965, title: "Patterns of species diversity", source: "Biological Reviews 40(4):510-533", doi: "10.1111/j.1469-185X.1965.tb00815.x", pdf: "readings/week-07/macarthur-1965.pdf" },
        { short: "Latitudinal gradients in species diversity", authors: "Pianka, E.R.", year: 1966, title: "Latitudinal gradients in species diversity: a review of concepts", source: "The American Naturalist 100(910):33-46", doi: "10.1086/282398", pdf: "readings/week-07/pianka-1966.pdf" },
        { short: "Why mountain passes are higher in the tropics", authors: "Janzen, D.H.", year: 1967, title: "Why mountain passes are higher in the tropics", source: "The American Naturalist 101(919):233-249", doi: "10.1086/282487", pdf: "readings/week-07/janzen-1967.pdf" }
      ]
    },

    /* ---------- Week 8 ---------- */
    {
      n: 8, title: "Island Biogeography Theory", tue: "2027-03-02", thu: "2027-03-04", theme: "space",
      concepts: ["dispersal", "colonization", "extinction", "island syndrome", "equilibrium theory", "species-area relationships",
                 "isolation effects", "disharmonious faunas", "relaxation curves", "nested subsets"],
      intro: { status: "approved", text: "Unlike other science fields such as maths and physics, ecology and evolution hold few laws. One of them may be the species-area rule, in which species richness increases with area. However, this is not true of all regions. Some islands of the same size can have different numbers of species; why? MacArthur and Wilson (1963) reduced the answer to a balance between colonization and extinction, predicting that species number depends on island area and isolation rather than on which species are present. Islands represent a filtered, not random, sample of mainland diversity: good dispersers arrive while poor ones rarely do, producing disharmonious faunas (missing whole groups common on the mainland) and the nested subsets that biogeographers have long recognized. Once established, colonists often evolve in predictable ways (the island syndrome of giants, dwarfs, and tameness), and on large enough islands speciation begins to add species from within (an “evolutionary” species-area concept). Today, as humans carry species from island to island, does the equilibrium MacArthur and Wilson envisioned still hold?" },
      unknown: { status: "draft", questions: [
        "Is island diversity ever truly at equilibrium, or are many islands still adjusting to past changes in area and isolation?",
        "At what island size does speciation within the island begin to outpace colonization from outside (Losos and Schluter 2000)?",
        "As humans carry species from island to island, what now sets the number of species an island holds?"
      ] },
      image: { file: "images/week08-bahamas-cay.jpg",
               alt: "A tiny, low, rocky island in shallow water, with a person standing on it.",
               caption: "A small Bahamian cay. Islands like this act as natural replicates for testing island biogeography.",
               credit: "" },
      schematic: { file: "assets/img/schematics/island-equilibrium.svg",
                   alt: "Graph of immigration and extinction rate curves against number of species. Immigration curves for near and far islands fall with species number; extinction curves for small and large islands rise. Their crossings mark the equilibrium number of species.",
                   caption: "The equilibrium theory of island biogeography (MacArthur and Wilson). Immigration falls and extinction rises as species accumulate; where they cross is the equilibrium number of species, S. Near and large islands hold more species than far and small ones. Schematic drawn for this course." },
      readings: [
        { short: "An equilibrium theory of insular zoogeography", authors: "MacArthur, R.H. & Wilson, E.O.", year: 1963, title: "An equilibrium theory of insular zoogeography", source: "Evolution 17(4):373-387", doi: "10.1111/j.1558-5646.1963.tb03295.x", pdf: "readings/week-08/macarthur-wilson-1963.pdf" },
        { short: "An evolutionary species-area relationship", authors: "Losos, J.B. & Schluter, D.", year: 2000, title: "Analysis of an evolutionary species-area relationship", source: "Nature 408(6814):847-850", doi: "10.1038/35048558", pdf: "readings/week-08/losos-schluter-2000.pdf" },
        { short: "Island biogeography of the Anthropocene", authors: "Helmus, M.R., Mahler, D.L. & Losos, J.B.", year: 2014, title: "Island biogeography of the Anthropocene", source: "Nature 513(7519):543-546", doi: "10.1038/nature13739", pdf: "readings/week-08/helmus-2014.pdf" },
        { short: "The diversity of island birds worldwide", authors: "Valente, L. et al.", year: 2020, title: "A simple dynamic model explains the diversity of island birds worldwide", source: "Nature 579(7797):92-96", doi: "10.1038/s41586-020-2022-5", pdf: "readings/week-08/valente-2020.pdf" }
      ]
    },

    /* ---------- Week 9 ---------- */
    {
      n: 9, title: "Phylogenetics and Macroevolution", tue: "2027-03-16", thu: "2027-03-18", theme: "history",
      concepts: ["phylogenetic reconstruction", "measuring phylogenetic diversity", "trait evolution", "over- and underdispersion",
                 "phylogenetic signal", "comparative methods", "diversification rates", "key innovations and diversity"],
      intro: { status: "approved", text: "Species are not independent data points. Because relatives share traits through common ancestry, Felsenstein (1985) showed that any comparison across species must account for phylogeny, turning comparative biology into a phylogenetic discipline. Phylogenies now let us reconstruct how traits evolved, measure phylogenetic diversity and signal, ask whether communities are phylogenetically clustered or overdispersed (made up of closer or more distant relatives than expected by chance), and estimate rates of speciation and extinction from the shape of the tree. However, each of these tasks come with assumptions and caveats, which are important to be aware of and discuss." },
      unknown: { status: "draft", questions: [
        "Do key innovations cause bursts of diversification, or do we mostly notice them in lineages that happened to radiate (Rabosky 2017)?",
        "How reliably can rates of speciation and extinction be estimated from trees of living species alone?",
        "When a community is phylogenetically clustered or overdispersed, how can we tell which process produced the pattern?"
      ] },
      image: { file: "images/week09-haeckel-tree-1866.jpg",
               alt: "Ernst Haeckel's 1866 branching tree of the plant kingdom, drawn as a gnarled trunk with labeled branches.",
               caption: "Haeckel's 1866 tree of the plant kingdom (Stammbaum des Pflanzenreichs), shown here as a historical object. Haeckel also promoted racist and eugenic ideas, which this course does not endorse.",
               credit: "Ernst Haeckel, Generelle Morphologie der Organismen (1866). Public domain." },
      schematic: null,
      readings: [
        { short: "Phylogenies and the comparative method", authors: "Felsenstein, J.", year: 1985, title: "Phylogenies and the comparative method", source: "The American Naturalist 125(1):1-15", doi: "10.1086/284325", pdf: "readings/week-09/felsenstein-1985.pdf" },
        { short: "Seeing the forest for the trees", authors: "Losos, J.B.", year: 2011, title: "Seeing the forest for the trees: the limitations of phylogenies in comparative biology", source: "The American Naturalist 177(6):709-727", doi: "10.1086/660020", pdf: "readings/week-09/losos-2011.pdf" },
        { short: "Phylogenetic tests for evolutionary innovation", authors: "Rabosky, D.L.", year: 2017, title: "Phylogenetic tests for evolutionary innovation: the problematic link between key innovations and exceptional diversification", source: "Philosophical Transactions of the Royal Society B: Biological Sciences 372(1735):20160417", doi: "10.1098/rstb.2016.0417", pdf: "readings/week-09/rabosky-2017.pdf" }
      ]
    },

    /* ---------- Week 10 ---------- */
    {
      n: 10, title: "The Ecology and Evolution of Behavior", tue: "2027-03-23", thu: "2027-03-25", theme: "history",
      concepts: ["Tinbergen's four questions", "adaptive behavior", "phenotypic plasticity", "behavioral syndromes",
                 "ecological and evolutionary consequences of behavior", "sociality", "altruism", "inclusive fitness", "kin selection"],
      intro: { status: "approved", text: "Why do birds sing, lizards perform push-up displays, and gazelles stot (leap stiff-legged in front of predators)? Each question has four correct answers, which Niko Tinbergen famously separated into mechanism, development, function, and evolutionary history, arguing that a full account of behavior needs all four. Behavior is often the most flexible part of the phenotype, allowing animals to respond to new conditions and, in doing so, to alter the selection they experience. Sociality poses a sharper puzzle, one that troubled Darwin: how can selection favor behavior that helps others at a cost to the actor? W. D. Hamilton’s answer, inclusive fitness and kin selection, transformed the study of social behavior. Yet Gould and Lewontin’s (1979) warning against assuming that every trait is an adaptation still hangs over adaptive explanations of behavior." },
      unknown: { status: "draft", questions: [
        "Does behavior speed up evolution by exposing animals to new selection, or slow it down by letting them avoid selection?",
        "How do we test whether a behavior is an adaptation rather than a by-product, as Gould and Lewontin (1979) urged?",
        "When is inclusive fitness the most useful framework for explaining sociality?"
      ] },
      image: { file: "images/week10-san-marco-pendentives.jpg",
               alt: "Sculpted spandrels above an arched doorway at the Basilica of San Marco in Venice.",
               caption: "Spandrels in the architect's sense: the curved spaces left between an arch and its rectangular frame, here filled with sculpture. Gould and Lewontin (1979) used the spandrels of San Marco to argue that some features are by-products of structure rather than adaptations.",
               credit: "Photo: © 2008 Branislav L. Slantchev." },
      schematic: null,
      readings: [
        { short: "On aims and methods of ethology", authors: "Tinbergen, N.", year: 1963, title: "On aims and methods of ethology", source: "Zeitschrift für Tierpsychologie 20(4):410-433", doi: "10.1111/j.1439-0310.1963.tb01161.x", pdf: "readings/week-10/tinbergen-1963.pdf" },
        { short: "The evolution of altruistic behavior", authors: "Hamilton, W.D.", year: 1963, title: "The evolution of altruistic behavior", source: "The American Naturalist 97(896):354-356", doi: "10.1086/497114", pdf: "readings/week-10/hamilton-1963.pdf" },
        { short: "The spandrels of San Marco", authors: "Gould, S.J. & Lewontin, R.C.", year: 1979, title: "The spandrels of San Marco and the Panglossian paradigm: a critique of the adaptationist programme", source: "Proceedings of the Royal Society of London. Series B, Biological Sciences 205(1161):581-598", doi: "10.1098/rspb.1979.0086", pdf: "readings/week-10/gould-lewontin-1979.pdf" }
      ]
    },

    /* ---------- Week 11 ---------- */
    {
      n: 11, title: "Eco-Evolutionary Dynamics", tue: "2027-03-30", thu: "2027-04-01", theme: "history",
      concepts: ["historical development of eco-evolutionary dynamics", "ecological feedbacks from rapid evolution",
                 "contemporary evolution", "community and ecosystem consequences of evolution",
                 "anthropogenic selective pressures", "predictive frameworks"],
      intro: { status: "approved", text: "If evolution can happen on ecological timescales, can evolution in turn change ecology? Hutchinson (1965) pictured an ecological theater hosting an evolutionary play, an image long read as ecology setting the stage on which evolution slowly unfolds. The discovery of contemporary evolution blurred that division, raising the possibility of eco-evolutionary feedbacks, in which ecological change drives evolution and evolution in turn reshapes populations, communities, and ecosystems. Guppies in the streams of Trinidad, where predation differs sharply above and below waterfalls, have become a flagship test of the idea, however even in this system it is unclear to what extent such “eco-evolutionary dynamics” occur at a meaningful level. With human activity now imposing strong selection on many species, the central question is practical as well as theoretical: when is evolutionary change large enough, and fast enough, to matter ecologically, and can we predict it?" },
      unknown: { status: "draft", questions: [
        "How common are eco-evolutionary feedbacks in nature, and when are they strong enough to matter ecologically?",
        "Can we predict evolution under human-imposed selection, or is contemporary evolution too contingent to forecast?",
        "When ecology and evolution change on the same timescale, which one is driving the other?"
      ] },
      image: { file: "images/week11-trinidad-stream.jpg",
               alt: "Two photos of shaded, rocky forest streams.",
               caption: "Forest streams in Trinidad, where guppies have become a model system for studying eco-evolutionary dynamics.",
               credit: "" },
      schematic: { file: "assets/img/schematics/eco-evo-feedback.svg",
                   alt: "Two-node loop diagram: ecological change drives evolutionary change, and evolutionary change feeds back to drive ecological change.",
                   caption: "An eco-evolutionary feedback loop: ecological change alters selection, and the resulting evolutionary change alters ecology in turn. Schematic drawn for this course." },
      readings: [
        { short: "Do eco-evo feedbacks help us understand nature?", authors: "Travis, J. et al.", year: 2014, title: "Do eco-evo feedbacks help us understand nature? Answers from studies of the Trinidadian guppy", source: "Advances in Ecological Research 50:1-40", doi: "10.1016/B978-0-12-801374-8.00001-3", pdf: "readings/week-11/travis-2014.pdf" },
        { short: "Eco-evolutionary dynamics", authors: "Pelletier, F., Garant, D. & Hendry, A.P.", year: 2009, title: "Eco-evolutionary dynamics", source: "Philosophical Transactions of the Royal Society B: Biological Sciences 364(1523):1483-1489", doi: "10.1098/rstb.2009.0027", pdf: "readings/week-11/pelletier-2009.pdf" },
        { short: "Towards a more precise and accurate view of eco-evolution", authors: "Bassar, R.D. et al.", year: 2021, title: "Towards a more precise and accurate view of eco-evolution", source: "Ecology Letters 24(4):623-625", doi: "10.1111/ele.13712", pdf: "readings/week-11/bassar-2021.pdf" }
      ]
    },

    /* ---------- Week 12: Final oral exam ---------- */
    {
      n: 12, title: "Final oral exam", tue: "", thu: "", datesLabel: "Dates TBA", theme: "exam", isExam: true,
      concepts: [],
      intro: null, unknown: null,
      image: null,
      schematic: null,
      examText: [
        "Students will be tested orally in Qualifying Exam style by the course instructors.",
        "In the final exam, the presentation will be 8-10 minutes followed by 10-12 minutes of question/discussion."
      ],
      readings: []
    }
  ],

  /* =====================================================================
     GRADUATE SYNTHESIS PRESENTATIONS
     Fill in presenter, paper (a short citation), doi, and slides (a link).
     Blank presenters show as "To be assigned".
     ===================================================================== */
  presentations: [
    { week: 1, presenter: "", paper: "", doi: "", slides: "" },
    { week: 2, presenter: "", paper: "", doi: "", slides: "" },
    { week: 3, presenter: "", paper: "", doi: "", slides: "" },
    { week: 4, presenter: "", paper: "", doi: "", slides: "" },
    { week: 5, presenter: "", paper: "", doi: "", slides: "" },
    { week: 6, presenter: "", paper: "", doi: "", slides: "" },
    { week: 7, presenter: "", paper: "", doi: "", slides: "" },
    { week: 8, presenter: "", paper: "", doi: "", slides: "" },
    { week: 9, presenter: "", paper: "", doi: "", slides: "" },
    { week: 10, presenter: "", paper: "", doi: "", slides: "" },
    { week: 11, presenter: "", paper: "", doi: "", slides: "" }
  ],

  /* =====================================================================
     ASSESSMENTS (text from the syllabus)
     ===================================================================== */
  assessments: {
    grading: {
      undergraduate: [
        ["Class quizzes", 15], ["Participation and Discussion", 20], ["Weekly Reading Responses", 35],
        ["Midterm Oral Exam", 5], ["Final Oral Exam", 25]
      ],
      graduate: [
        ["Class quizzes", 15], ["Participation and Discussion", 20], ["Weekly Reading Responses", 25],
        ["In-class graduate synthesis presentation", 10], ["Midterm Oral Exam", 5], ["Final Oral Exam", 25]
      ]
    },
    letterGrades: [
      ["A", "89.5 to 100%"], ["B", "79.5 to 89.4%"], ["C", "69.5 to 79.4%"], ["D", "59.5 to 69.4%"], ["F", "0 to 59.4%"]
    ],
    components: [
      { title: "Participation and discussion", id: "participation", paragraphs: [
        "Active engagement in discussion is the core of this course. You are expected to arrive having read the assigned papers and prepared to discuss them. Strong participation means asking probing questions, engaging with your classmates' arguments, and being willing to revise your thinking based on evidence and discussion. Most of the credit for participation is awarded for good-faith engagement, not for having the \"correct\" answer (which, in many cases, we won't know)."
      ] },
      { title: "Weekly reading responses", id: "reading-responses", paragraphs: [
        "Each student is expected to read two papers of the required reading prior to class. From these readings, before each class, submit a brief (1-2 paragraph) written response to the assigned readings via Canvas. These should identify the central question each paper addresses, what you found most interesting or most surprising, and at least one question you still have after reading. Responses are graded on completion and good-faith engagement. Late responses will not be accepted."
      ] },
      { title: "Class quizzes", id: "quizzes", paragraphs: [
        "There will be a hand-written quiz at the start of each class pertaining to the pre-class readings. Each quiz will be approximately 5 questions long and contain a mixture of multiple choice and short-answer questions."
      ] },
      { title: "In-class graduate synthesis presentation", id: "presentation", paragraphs: [
        "Each week, one graduate student will present a short 5-8 minute Powerpoint presentation on a recently published paper on the topic of that week's classes that the student will find themselves. The 5-8 minute presentation will come after the general introduction delivered by Dr. Anderson/Dr. Stroud and will be graded on (a) placing the recent study into the historical context of the topic [why did the scientists do the study], (b) identifying the advance(s) that the recent study has made [what did they find], and (c) review what is still unanswered [what should they do next]."
      ] },
      { title: "Midterm and final oral exams", id: "oral-exams", paragraphs: [
        "All students will complete a 10 minute midterm oral exam and a 20 minute final oral exam with Drs. Anderson and Stroud.",
        "In the oral exams, students will deliver a short seminar-style presentation on an unresolved question that they have chosen. Presentations should end with an explicit identification of what remains unknown and what immediate research priorities the student thinks will be most productive going forward. There is no single correct answer to either question; we are asking for the students to make a reasonable case for their recommendations. Following the presentation, students will be asked discussion-prompting questions on topics that have been raised in class. We are looking for (1) reasonable familiarity with the material, (2) the ability to think critically about existing data, (3) the ability to suggest or identify competing hypotheses, and (4) the ability to distinguish between hypotheses and their predictions.",
        "In the midterm exam, the presentation will be 5 minutes followed by an additional 5 minutes of question/discussion. In the final exam, the presentation will be 8-10 minutes followed by 10-12 minutes of question/discussion.",
        "We recognize that the oral exam will be new to many students. The purpose of the midterm is to help students acclimate to the oral evaluation format when the stakes are low (5% of grade). Our intention is not to grill students or trip them up in any way; it is rather to invite students to demonstrate their grasp of the material and to think aloud (with us) about various aspects surrounding the origins of biodiversity."
      ] }
    ],
    rubricNote: "Points for each category ranked 1-5, 5 being strongest.",
    rubric: [
      { section: "Presentation", items: [
        "Presentation is well-organized and clearly explained",
        "Student has identified an unanswered question",
        "Question is placed in an appropriate broader context",
        "Alternative hypotheses articulated",
        "Student can correctly distinguish question, hypotheses, and predictions",
        "Student has provided logical suggestions for future research"
      ] },
      { section: "Oral Examination", items: [
        "Student shows basic grasp of most core concepts covered in syllabus",
        "Student can use this understanding as basis for a wide-ranging informal discussion",
        "Student shows a strong understanding of at least one topic covered in the course"
      ] }
    ]
  },

  /* =====================================================================
     POLICIES (verbatim from the syllabus)
     ===================================================================== */
  policies: [
    { id: "ai", title: "AI policy", paragraphs: [
      "AI writing tools are not permitted. The key skills you will develop in this class are how to critically review, synthesize, and identify unresolved topics in the fields of ecology and evolution. AI will not help you develop those skills. Growing empirical work suggests that it actively hinders your ability to do so. We will be reading for evidence of genuine (human) thinking."
    ] },
    { id: "attendance", title: "Attendance policy", paragraphs: [
      "Class attendance is an essential component of this course, which is based on dialogue. Absence is excused for legitimate reason communicated in a timely manner (sickness, emergencies, etc.). Unexcused absences will affect your grade via missed quizzes and participation/discussion marks. Students should enter each class having read the material and being prepared to speak and listen and engage with their classmates."
    ] },
    { id: "integrity", title: "Academic integrity", paragraphs: [
      "Georgia Tech aims to cultivate a community based on trust, academic integrity, and honor. Students are expected to act according to the highest ethical standards. For details, see Georgia Tech's Academic Honor Code ({link:https://policylibrary.gatech.edu/student-life/academic-honor-code|policylibrary.gatech.edu/student-life/academic-honor-code}).",
      "Any student suspected of plagiarism, academic dishonesty (including violation of the AI policy) will be reported to the Office of Student Integrity. Any time information or ideas are drawn from a source, that source must be cited.",
      "We must stress that all of science runs on the honor system. When you submit a work to a scientific journal for publication, it is taken on good faith that you conducted the work as claimed. For this reason, accusations against your academic integrity can result in lasting damage to your prospects in science. Don't risk it."
    ] },
    { id: "inclusivity", title: "Statement of intent for inclusivity", paragraphs: [
      "As members of the Georgia Tech community, we are committed to creating a learning environment in which all students feel safe and included. We welcome your feedback on what we can stop, start, and continue doing to make this a seminar where every participant feels valued and can contribute fully."
    ] },
    { id: "accommodations", title: "Learning accommodations", paragraphs: [
      "If you require special accommodations, contact the Office of Disability Services at {link:tel:+14048942563|(404) 894-2563} or {link:https://disabilityservices.gatech.edu|disabilityservices.gatech.edu} to obtain an accommodations letter. Please also {email:Stroud|email Dr. Stroud} as early as possible so we can discuss your needs."
    ] }
  ],

  /* Graduate presentation page text (from the syllabus) */
  presentationInfo: {
    paragraph: "Each week, one graduate student will present a short 5-8 minute Powerpoint presentation on a recently published paper on the topic of that week's classes that the student will find themselves. The 5-8 minute presentation will come after the general introduction delivered by Dr. Anderson/Dr. Stroud.",
    criteriaLead: "Presentations will be graded on:",
    criteria: [
      "(a) placing the recent study into the historical context of the topic [why did the scientists do the study]",
      "(b) identifying the advance(s) that the recent study has made [what did they find]",
      "(c) review what is still unanswered [what should they do next]"
    ],
    assignmentNote: "Presenters are assigned at random by the instructors."
  }
};
