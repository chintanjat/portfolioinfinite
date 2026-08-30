/* Portfolio data — islands positioned on the infinite canvas.
   Coordinates are in canvas-space px. The canvas auto-centers on load. */

const PROJECTS = [
  {
    id: 'legal',
    code: '01',
    name: 'Veritas',
    title: 'Legal verification, re-imagined',
    client: 'Legal Verification Portal',
    audience: 'For litigators & in-house counsel',
    year: '2024',
    role: 'Lead Designer',
    duration: '14 weeks',
    team: '1 PM · 2 Eng · 1 Designer',
    tags: ['Legal-tech', 'Workflow', 'Research-heavy'],
    thumbLabel: 'VERITAS · DOCUMENT REVIEW',
    summary: 'A verification portal that cuts a 4-day paralegal review down to 40 minutes, with an evidence-chain a judge can follow.',
    lede: 'Lawyers were drowning in PDFs and stamp-verified scans. We rebuilt the verification flow around one question: can this be trusted in court?',
    problem: 'Verification was a manual patchwork of email, spreadsheets and physical stamps. A single property title took 3–5 business days and audit trails were stitched together after the fact.',
    research: 'Shadowed 12 paralegals across 4 firms. Observed that 78% of review time was spent correlating documents, not reading them. We mapped 41 distinct "trust checkpoints" that were never formalized.',
    design: 'A stacked evidence timeline with source-of-truth badges, inline annotation, and a verifier confidence slider. Every action emits a cryptographic breadcrumb that composes into a court-admissible report.',
    outcomes: [
      { big: '−91%', lab: 'Review time' },
      { big: '+4.2×', lab: 'Throughput / week' },
      { big: '0', lab: 'Audit failures in yr 1' },
    ],
    quote: '"It\'s the first tool that didn\'t feel like a spreadsheet pretending to be software."',
    quoteWho: 'Senior Partner, test firm',
  },
  {
    id: 'crm',
    code: '02',
    name: 'Relay',
    title: 'A CRM shaped around the telecaller',
    client: 'Fintech Telecaller CRM',
    audience: 'For 400+ agents at a growing lender',
    year: '2025',
    role: 'Product Designer',
    duration: '22 weeks',
    team: '1 PM · 6 Eng · 2 Designers',
    tags: ['Fintech', 'CRM', 'Ops'],
    thumbLabel: 'RELAY · AGENT CONSOLE',
    summary: 'A call-centric dashboard built for the human on the phone, not the manager in a spreadsheet. Context, dispositions and next-best-action in one breath.',
    lede: 'We threw out the tabs-and-tickets model and built a single-screen console where the call is the primary object.',
    problem: 'Agents juggled 6 tabs per call: customer profile, loan history, dispositions, scripts, compliance, and callback calendar. Average handle time was 11 minutes; switching cost was eating conversion.',
    research: 'Paired with 20 agents for 3 days each. Recorded screen + audio. Top finding: the *first 15 seconds* of a call determined 72% of outcomes — and agents were still searching for the customer record when those 15 seconds expired.',
    design: 'A T-shaped layout: customer identity pinned left, real-time call intelligence across the top, and a single-column action stack right. Dispositions live behind a hotkey ring that never steals focus from the call.',
    outcomes: [
      { big: '−38%', lab: 'Avg handle time' },
      { big: '+19%', lab: 'First-call resolution' },
      { big: '9.1/10', lab: 'Agent CSAT' },
    ],
    quote: '"I stopped clicking. I can finally just talk to the customer."',
    quoteWho: 'Senior agent, week 2 of rollout',
  },
  {
    id: 'tech',
    code: '03',
    name: 'Fieldline',
    title: 'Technical verification on the ground',
    client: 'Technical Verification for Verifiers',
    audience: 'For field verifiers inspecting collateral',
    year: '2025',
    role: 'Lead Designer',
    duration: '11 weeks',
    team: '1 PM · 3 Eng · 1 Designer · 1 Ops Lead',
    tags: ['Mobile-first', 'Field Ops', 'Fintech'],
    thumbLabel: 'FIELDLINE · FIELD CHECK',
    summary: 'A mobile-first tool that guides verifiers through a collateral inspection with structured capture, offline-first sync, and fraud signals baked in.',
    lede: 'Verifiers were asked to be inspectors, photographers, auditors and fraud detectors — with a form that hadn\'t changed since 2011.',
    problem: 'The legacy app was a long scrollable form. Verifiers in the field — often in low-connectivity areas — would lose data, skip steps, and produce inconsistent photos that the risk team couldn\'t trust.',
    research: 'Ride-alongs in 3 cities. We discovered that "a good verification" was really a narrative the verifier constructed on-site: location → structure → fixtures → occupancy → anomalies. The old form fought that narrative.',
    design: 'A chaptered capture flow with a persistent map anchor, guided photo frames with live-glare detection, and an anomaly chip that lets verifiers flag intuition without breaking the flow. Everything queues offline and syncs opportunistically.',
    outcomes: [
      { big: '+96%', lab: 'Submissions complete on first try' },
      { big: '−64%', lab: 'Re-verification requests' },
      { big: '2.1×', lab: 'Fraud flags caught early' },
    ],
    quote: '"I finish reports before I\'m back at the bike."',
    quoteWho: 'Verifier, Nashik',
  },
];

const EXPERIENCE = [
  { year: '2024 — Now', role: 'Senior Product Designer', co: 'Fintech (confidential)', note: 'Leading CRM + verification platforms.' },
  { year: '2022 — 2024', role: 'Product Designer', co: 'Legaltech startup', note: 'Shipped Veritas from 0 → 1.' },
  { year: '2020 — 2022', role: 'UX Designer', co: 'Design studio, Pune', note: 'Agency work across fintech, healthtech, B2B.' },
  { year: '2019', role: 'BDes, Visual Communication', co: 'Design school', note: 'Graduated with distinction.' },
];

/* Island positions on the canvas. Grouped loosely so related things cluster. */
const ISLANDS = [
  { id: 'marquee-bg', kind: 'marquee',   x: -300, y: 260,  text: 'designing in the void' },

  { id: 'hero',       kind: 'hero',      x: 200,  y: 120 },
  { id: 'sticky',     kind: 'sticky',    x: 1080, y: 180 },
  { id: 'stats',      kind: 'stats',     x: 1100, y: 480 },

  { id: 'sec-about',  kind: 'section',   x: 280,  y: 900, num: '01 / About',  h1: 'A designer,', em: 'mostly curious' },
  { id: 'about',      kind: 'about',     x: 320,  y: 1180 },
  { id: 'photo',      kind: 'photo',     x: 920,  y: 1200 },
  { id: 'tools',      kind: 'tools',     x: 320,  y: 1660 },

  { id: 'sec-work',   kind: 'section',   x: 1680, y: 900, num: '02 / Selected Work',  h1: 'Three problems,', em: 'in detail' },
  { id: 'proj-1',     kind: 'project',   x: 1680, y: 1260, project: PROJECTS[0] },
  { id: 'proj-2',     kind: 'project',   x: 2240, y: 1440, project: PROJECTS[1] },
  { id: 'proj-3',     kind: 'project',   x: 1700, y: 1960, project: PROJECTS[2] },

  { id: 'sec-exp',    kind: 'section',   x: 320,  y: 2200, num: '03 / Experience', h1: 'Six years of', em: 'learning loudly' },
  { id: 'timeline',   kind: 'timeline',  x: 360,  y: 2560 },

  { id: 'sec-contact',kind: 'section',   x: 1400, y: 2500, num: '04 / Contact', h1: 'Let us', em: 'make something' },
  { id: 'contact',    kind: 'contact',   x: 1380, y: 2860 },
];

/* Section anchors — where the canvas should jump when a nav button is clicked. */
const SECTIONS = [
  { id: 'hero',    label: 'Intro',      center: { x: 600,  y: 400  } },
  { id: 'about',   label: 'About',      center: { x: 700,  y: 1400 } },
  { id: 'work',    label: 'Work',       center: { x: 2100, y: 1600 } },
  { id: 'exp',     label: 'Experience', center: { x: 640,  y: 2700 } },
  { id: 'contact', label: 'Contact',    center: { x: 1690, y: 3000 } },
];

window.PORTFOLIO_DATA = { PROJECTS, EXPERIENCE, ISLANDS, SECTIONS };
