/* Portfolio data — islands positioned on the infinite canvas.
   Coordinates are in canvas-space px. The canvas auto-centers on load. */

const PROJECTS = [
  {
    id: 'parakh',
    name: 'Legal verification',
    extended: true,
    title: 'Legal verification journey redesign',
    client: 'Piramal Capital',
    audience: 'For 400+ branches & 510 external advocates',
    year: '2022',
    role: 'Sole UX designer (end-to-end IC)',
    duration: '20 days',
    team: '1 designer + 1 business SPOC',
    tags: ['Legal-tech', 'B2B', 'Vendor ecosystem'],
    figma: '',
    thumbLabel: 'Legal verification',
    summary: 'A clearer way for external advocates to complete legal reports and for branch teams to review them.',
  },
  {
    id: 'tech',
    name: 'Technical verification',
    extended: true,
    title: 'Technical verification',
    client: 'Piramal Capital',
    audience: 'For field verifiers, vendor managers & BTMs',
    year: '2022',
    role: 'Solo UX designer',
    duration: '30 days',
    team: 'Business SPOC for research and requirements',
    tags: ['Field ops', 'Mobile capture', 'Fintech'],
    figma: '',
    thumbLabel: 'Technical verification',
    summary: 'A mobile workflow for property verifiers to record site findings and submit a complete report for approval.',
  },
];


const EXPERIENCE = [
  { year: 'May 2024 — Now',  role: 'UX lead — credit',        co: 'Piramal Finance', note: 'Scaling AI adoption in credit decisioning from 13% → 67%; institutionalizing MVP scoping, design systems and coded prototypes.' },
  { year: 'May 2023 — Apr 2024', role: 'Senior UX designer',  co: 'Piramal Finance', note: 'Shipped Credit Central (SFDC sunset, ₹10 Cr saved) and Parakh legal verification (TAT −70%).' },
  { year: 'Jan 2022 — Apr 2023', role: 'UX designer',         co: 'Piramal Finance', note: 'Cross-persona workflows across CPA / Legal / Tech; loan TAT 5–6 days → 2 days. Designed Project Vaani CRM.' },
  { year: 'Mar 2021 — Jan 2022', role: 'Sr. product designer', co: 'Vahak',           note: 'India\'s largest transport marketplace — dashboard for 1M users, retention-first landing pages.' },
  { year: 'May 2018 — Feb 2021', role: 'UX / UI designer',    co: 'Ansh Enterprises', note: 'Insurance agent portal, bank economic research desk, shopping and services apps.' },
  { year: 'Aug 2017 — May 2018', role: 'UX / UI designer',    co: 'Pandit Ventures',  note: 'Astrology mobile app + high-converting landing pages via Unbounce and hand-coded HTML/CSS.' },
  { year: 'Sep 2014 — Nov 2016', role: 'UX / UI designer',    co: 'AppsOnRoll TechStudio', note: 'End-to-end product design of the All Deals app — UX, UI, illustration and brand.' },
  { year: '2014',                 role: 'B.E., Computer Engineering', co: 'Gujarat Technological University', note: 'Foundation in engineering before pivoting fully into design.' },
];

/* Island positions on the canvas — coordinates on an infinite plane. */
const ISLANDS = [
  { id: 'marquee-bg', kind: 'marquee',   x: -400, y: 220,  text: 'designing in the void' },

  // ── Hero cluster (snap ~y:400) ───────────────────────────────────────────
  { id: 'hero',       kind: 'hero',      x: 200,  y: 120 },
  { id: 'sticky',     kind: 'sticky',    x: 1100, y: 160 },
  { id: 'stats',      kind: 'stats',     x: 1100, y: 440 },

  // ── About cluster — left side (snap ~y:2000) ─────────────────────────────
  { id: 'sec-about',  kind: 'section',   x: 200,  y: 1560, num: 'About',  h1: 'About my', em: 'work' },
  { id: 'about',      kind: 'about',     x: 200,  y: 1760 },
  { id: 'photo',      kind: 'photo',     x: 790,  y: 1780 },
  { id: 'tools',      kind: 'tools',     x: 200,  y: 2500 },

  // ── Work cluster — single-row filmstrip, 3 projects in one snap ─
  { id: 'sec-work',   kind: 'section',   x: 1700, y: 3280, num: 'Work',  h1: 'Selected', em: 'work' },
  { id: 'proj-1',     kind: 'project',   x: 1700, y: 3480, project: PROJECTS[1], compact: true },
  { id: 'proj-2',     kind: 'project',   x: 2160, y: 3480, project: PROJECTS[0], compact: true },

  // ── Experience cluster — left side (snap ~y:6060) ────────────────────────
  { id: 'sec-exp',    kind: 'section',   x: 200,  y: 5660, num: 'Experience', h1: 'Where I have', em: 'worked' },
  { id: 'timeline',   kind: 'timeline',  x: 240,  y: 5860 },

  // ── Contact cluster — right side (snap ~y:7300) ──────────────────────────
  { id: 'sec-contact',kind: 'section',   x: 1720, y: 7060, num: 'Contact', h1: 'Get in', em: 'touch' },
  { id: 'contact',    kind: 'contact',   x: 1700, y: 7260 },
];

/* Section anchors — where the canvas should jump when a nav button is clicked. */
const SECTIONS = [
  { id: 'hero',    label: 'Home',  center: { x: 560,  y: 350  } },
  { id: 'about',   label: 'About', center: { x: 620,  y: 2020 } },
  { id: 'work',    label: 'Work',  center: { x: 2090, y: 3640 } },
  { id: 'exp',     label: 'Path',  center: { x: 600,  y: 6020 } },
  { id: 'contact', label: 'Talk',  center: { x: 2060, y: 7380 } },
];

window.PORTFOLIO_DATA = { PROJECTS, EXPERIENCE, ISLANDS, SECTIONS };
