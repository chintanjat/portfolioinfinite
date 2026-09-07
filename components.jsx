/* Island content components — presentational only. */

const Hero = () => (
  <div className="card hero">
    <h1>
      Chintan<br/>
      <span className="ital">Jat</span>
      <span style={{fontFamily:'var(--f-mono)',fontSize:18,verticalAlign:'super',marginLeft:12,color:'var(--ink-3)',letterSpacing:'0.1em'}}></span>
    </h1>
    <p className="tag">
      Designer living on an <em>infinite canvas</em> — sketching quiet software in the void.
    </p>
    <div className="meta-row">
      <div>Based in<strong>Bengaluru, India</strong></div>
      <div>Total Experience<strong>11+ years</strong></div>
    </div>
  </div>
);

const SectionHead = ({num, h1, em}) => (
  <div className="section-head">
    <div className="num">{num}</div>
    <h2>{h1} <em>{em}</em></h2>
    <div className="rule" />
  </div>
);

const About = () => (
  <div className="card about">
    <h3>The canvas is where I live.</h3>
    <p>
      I'm Chintan — a designer who lives on blank screens and empty frames. Every product I work on starts the same way: nothing. Then slowly, through research and a lot of staring, something real takes shape.
    </p>
    <p>
      Most of my time is spent with fintech ops teams, legal reviewers and field workers — people who use software all day and hate most of it. I try to make things they actually enjoy using. The work is quiet. That's the point.
    </p>
    <p>
      This whole portfolio is a canvas too. Scroll to move between sections, or press <span className="kbd">1–5</span> to jump anywhere.
    </p>
  </div>
);

const Sticky = () => (
  <div className="sticky">
    "An empty canvas isn't nothing — it's everything that hasn't happened yet."
    <span className="attrib">— Note to self, always</span>
  </div>
);

const Stats = () => (
  <div className="card stats">
    <div>
      <div className="s-num"><em>20+</em></div>
      <div className="s-lab">Products shipped</div>
    </div>
    <div>
      <div className="s-num">4<em>yrs</em></div>
      <div className="s-lab">Deep in fintech</div>
    </div>
    <div>
      <div className="s-num">10k<em>+</em></div>
      <div className="s-lab">People use what I make daily</div>
    </div>
    <div>
      <div className="s-num"><em>2</em></div>
      <div className="s-lab">Case studies on this canvas</div>
    </div>
  </div>
);

const Photo = () => (
  <div className="card photo-frame">
    <div className="ph"><img src="uploads/pasted-1788262895975-0.jpeg" alt="Chintan Jat" loading="lazy"/></div>
    <div className="caption">Chintan, mid-blank-canvas</div>
  </div>
);

const Tools = () => (
  <div className="card tools">
    <h4>What I draw with</h4>
    <ul>
      <li className="accent">Figma</li>
      <li>Notion</li>
      <li>FigJam</li>
      <li className="accent">Claude</li>
      <li>Make</li>
    </ul>
  </div>
);

const ProjectCard = ({ project, onOpen, compact }) => (
  <div className={`card project${compact ? ' compact' : ''}`} onClick={() => onOpen(project.id)}>
    <div className="thumb">
      <div className="ph">{project.thumbLabel}</div>
      <div className="badge">{project.code} · {project.name}</div>
    </div>
    <div className="body">
      <div className="tags">
        {project.tags.map(t => <span key={t} className="tag">{t}</span>)}
      </div>
      <h4>{project.title.split(',')[0]}, <em>{project.title.split(',').slice(1).join(',').trim()}</em></h4>
      <p className="desc">{project.summary}</p>
      <span className="cta">Read case study <span>→</span></span>
    </div>
  </div>
);

const Timeline = () => {
  const { EXPERIENCE } = window.PORTFOLIO_DATA;
  // Group consecutive entries at the same company into one chapter.
  const groups = [];
  EXPERIENCE.forEach((e) => {
    const last = groups[groups.length - 1];
    if (last && last.co === e.co) last.items.push(e);
    else groups.push({ co: e.co, items: [e] });
  });
  return (
    <div className="card timeline">
      <div className="tl-head">
        <h3>The path so far</h3>
        <span className="tl-count">{groups.length} chapters</span>
      </div>
      <div className="tline">
        {groups.map((g, gi) => (
          <div className={"tl-group" + (g.items.length > 1 ? " is-multi" : "")} key={gi}>
            <div className="tl-co">{g.co}</div>
            {g.items.map((e, i) => (
              <div className="tline-item" key={i}>
                <div className="year">{e.year}</div>
                <div className="role">{e.role}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

const Contact = () => (
  <div className="card contact">
    <p>If you have a problem that needs a fresh canvas, I want to hear it. Half-baked ideas are welcome — I've built full products from worse starting points.</p>
    <div className="contact-links">
      <a className="clink" href="mailto:jatchintan@gmail.com">
        <span><span className="label">Email</span>jatchintan@gmail.com</span>
        <span className="arrow">↗</span>
      </a>
      <a className="clink" href="tel:+919033495724">
        <span><span className="label">Phone</span>+91 90334 95724</span>
        <span className="arrow">↗</span>
      </a>
      <a className="clink" href="https://linkedin.com/in/chintanjat" target="_blank" rel="noopener">
        <span><span className="label">LinkedIn</span>linkedin.com/in/chintanjat</span>
        <span className="arrow">↗</span>
      </a>
      <a className="clink" href="https://chintanjat.com" target="_blank" rel="noopener">
        <span><span className="label">Website</span>chintanjat.com</span>
        <span className="arrow">↗</span>
      </a>
    </div>
  </div>
);

const Marquee = ({ text }) => (
  <div className="marquee">designing<br/>in the void</div>
);

/* ---------- Case study panel ---------- */

const CaseStudy = ({ project, onClose, onNext }) => {
  const contentRef = React.useRef(null);
  const sectionRefs = [React.useRef(null), React.useRef(null), React.useRef(null), React.useRef(null)];
  const [progress, setProgress] = React.useState(0);
  const [activeSection, setActiveSection] = React.useState(0);

  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleScroll = () => {
    const el = contentRef.current;
    if (!el) return;
    const pct = el.scrollTop / Math.max(1, el.scrollHeight - el.clientHeight);
    setProgress(Math.min(100, pct * 100));
    const top = el.scrollTop + el.clientHeight * 0.35;
    let active = 0;
    sectionRefs.forEach((ref, i) => {
      if (ref.current && ref.current.offsetTop <= top) active = i;
    });
    setActiveSection(active);
  };

  const scrollTo = (ref) => {
    if (ref.current && contentRef.current)
      contentRef.current.scrollTop = ref.current.offsetTop - 32;
  };

  const handleNext = () => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
    onNext();
  };

  const tocLabels = ['The problem', 'Research', 'The design', 'Outcomes'];
  const titleParts = project.title.split(',');
  const titleMain = titleParts[0];
  const titleEm = titleParts.slice(1).join(',').trim();

  return (
    <div className="cs-fullscreen">
      {/* Sidebar */}
      <div className="cs-sidebar">
        <button className="cs-back" onClick={onClose}>← Back to canvas</button>
        <div className="cs-sidebar-num">{project.code} · {project.name}</div>
        <h2>{titleMain}, <em>{titleEm}</em></h2>
        <div className="cs-meta-list">
          <div className="cs-meta-item">Client<strong>{project.client}</strong></div>
          <div className="cs-meta-item">Role<strong>{project.role}</strong></div>
          <div className="cs-meta-item">Duration<strong>{project.duration}</strong></div>
          <div className="cs-meta-item">Team<strong>{project.team}</strong></div>
          <div className="cs-meta-item">Year<strong>{project.year}</strong></div>
        </div>
        <div className="cs-toc">
          {tocLabels.map((label, i) => (
            <button key={i}
              className={`cs-toc-btn ${activeSection === i ? 'active' : ''}`}
              onClick={() => scrollTo(sectionRefs[i])}>
              {String(i + 1).padStart(2, '0')} · {label}
            </button>
          ))}
        </div>
        <div className="cs-proj-nav">
          <button className="cs-proj-btn" onClick={handleNext}>Next project →</button>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="cs-content" ref={contentRef} onScroll={handleScroll}>
        <div className="cs-progress">
          <div className="cs-progress-fill" style={{width: `${progress}%`}} />
        </div>

        <div className="cs-hero">
          <div className="cs-eyebrow">
            <span>{project.audience}</span>
            <span>{project.year}</span>
            <span>{project.tags.join(' · ')}</span>
          </div>
          <h1>{titleMain}, <em>{titleEm}</em></h1>
          <p className="cs-lede">{project.lede}</p>
        </div>

        <div className="cs-section" ref={sectionRefs[0]}>
          <div className="cs-num">Layer 01 · The blank canvas</div>
          <h2>What was <em>missing</em></h2>
          <p>{project.problem}</p>
          <div className="cs-ph short">PROBLEM DIAGRAM · PLACEHOLDER</div>
        </div>

        <div className="cs-section" ref={sectionRefs[1]}>
          <div className="cs-num">Layer 02 · Tracing</div>
          <h2>What we <em>uncovered</em></h2>
          <p>{project.research}</p>
          <div className="cs-grid2">
            <div className="cs-tile"><h4>Methods</h4><p>Contextual inquiry · Diary studies · Session replays · Stakeholder interviews</p></div>
            <div className="cs-tile"><h4>Artifacts</h4><p>Journey maps · Service blueprints · Opportunity matrix · Jobs-to-be-done</p></div>
          </div>
          <div className="cs-big">
            "{project.quote.replace(/^"|"$/g, '')}"
            <br/>
            <span style={{fontFamily:'var(--f-mono)',fontStyle:'normal',fontSize:17,color:'var(--ink-3)',letterSpacing:'0.12em',textTransform:'uppercase'}}>— {project.quoteWho}</span>
          </div>
        </div>

        <div className="cs-section" ref={sectionRefs[2]}>
          <div className="cs-num">Layer 03 · Drawing</div>
          <h2>What we <em>built</em></h2>
          <p>{project.design}</p>
          <div className="cs-ph tall">HERO DESIGN · PLACEHOLDER</div>
          <div className="cs-grid2">
            <div className="cs-ph short" style={{margin:0}}>FLOW 01</div>
            <div className="cs-ph short" style={{margin:0}}>FLOW 02</div>
          </div>
        </div>

        <div className="cs-section" ref={sectionRefs[3]}>
          <div className="cs-num">Layer 04 · The finished canvas</div>
          <h2>What <em>shifted</em></h2>
          <div className="cs-outcomes">
            {project.outcomes.map((o, i) => (
              <div key={i} className="cs-outcome">
                <div className="big"><em>{o.big}</em></div>
                <div className="lab">{o.lab}</div>
              </div>
            ))}
          </div>
          <p style={{marginTop:44}}>
            The numbers matter, but what I remember is the first week of rollout — users stopped asking for the old version, and someone emailed to say they finished a report before coffee. That's the click.
          </p>
        </div>
      </div>
    </div>
  );
};

/* ---------- Extended case study (16-section long-scroll) ---------- */

const Shot = ({ label }) => (
  <div className="cs-shot"><span>{label ? `[SCREENSHOT: ${label}]` : ''}</span></div>
);

/* Phase-1 workflow diagrams — the legal-verification relay, drawn whiteboard-style.
   variant="before" (grey panel) and variant="after" (green panel). */
const FlowDiagram = ({ variant }) => {
  const NODE = '#ffffff', STROKE = '#6b6b6b', TXT = '#2b2b2b';
  const CFG = {
    before: {
      panel: '#e9e9e9', border: '#d3d3d3', badgeBg: '#6f6f6f', badgeFg: '#ffffff', label: 'Before',
      vb: '0 0 1040 690', nw: 250, nh: 120,
      nodes: [
        { cx: 155, cy: 130, lines: ['CPA assigns the case', 'to Agency'] },
        { cx: 520, cy: 130, lines: ['Manager assigns the', 'Verifier at the branch', 'and forwards the', 'email to it'] },
        { cx: 885, cy: 130, lines: ['Verifier does the title', 'search and does the', 'data entry for the LSR'] },
        { cx: 885, cy: 350, lines: ['Verifier mails the LSR', 'file back to the', 'Manager'] },
        { cx: 520, cy: 350, lines: ['Report printed, signed', 'and stamped by hand,', 'scanned again'] },
        { cx: 155, cy: 350, lines: ['CPA downloads', 'scanned Reports'] },
        { cx: 155, cy: 570, lines: ['CPA re-uploads into', 'Salesforce'] },
        { cx: 520, cy: 570, lines: ['Approver reads PDF'] },
        { cx: 885, cy: 570, lines: ['LSR is sent to Credit', 'Underwriter for', 'sanctioning the case'] },
      ],
      edges: [
        { d: 'M280,130 L395,130', lx: 337.5, ly: 130, label: 'Case sent via email' },
        { d: 'M645,130 L760,130', lx: 702.5, ly: 130, label: 'Follow-up' },
        { d: 'M885,190 L885,290', lx: 885,   ly: 240, label: 'Report drafted' },
        { d: 'M760,350 L645,350', lx: 702.5, ly: 350, label: 'File received' },
        { d: 'M395,350 L280,350', lx: 337.5, ly: 350, label: 'Scan uploaded' },
        { d: 'M155,410 L155,510', lx: 155,   ly: 460, label: 'Manual re-upload' },
        { d: 'M280,570 L395,570' },
        { d: 'M645,570 L760,570' },
        { d: 'M520,630 L520,656 L16,656 L16,130 L30,130', lx: 258, ly: 656, label: 'Approver replies with changes over email if needed' },
      ],
    },
    after: {
      panel: '#e6f6e2', border: '#c3e6ba', badgeBg: '#bfe9b6', badgeFg: '#2f5d2a', label: 'After',
      vb: '0 0 1180 700', nw: 230, nh: 180,
      nodes: [
        { cx: 145,     cy: 160, lines: ['CPA assigns the case', 'to Agency'] },
        { cx: 441.67,  cy: 160, lines: ['Manager assigns the', 'Verifier through the', 'system via multi', 'select'] },
        { cx: 738.33,  cy: 160, lines: ['Advocate Writes', 'Report in Rich-Text', 'Editor and submits', 'in Platform'] },
        { cx: 1035,    cy: 160, lines: ['Manager Verifies the', 'LSR and Submits the', 'Report or sends back', 'if any changes', 'needed'] },
        { cx: 1035,    cy: 570, lines: ['Sign and Stamp', 'automatically applied', '(Uploaded Once at', 'Onboarding)'] },
        { cx: 441.67,  cy: 570, shape: 'diamond', w: 270, h: 230, lines: ['Approver', 'Reviews', 'In-Platform'] },
        { cx: 145,     cy: 570, lines: ['LSR is sent to Credit', 'Underwriter for', 'sanctioning the case'] },
      ],
      edges: [
        { d: 'M260,160 L326.67,160',       lx: 293,    ly: 160, label: ['Case assigned', 'via system'] },
        { d: 'M556.67,160 L623.33,160',    lx: 590,    ly: 160, label: 'Assigned' },
        { d: 'M853.33,160 L920,160' },
        { d: 'M1035,250 L1035,480',        lx: 1035,   ly: 365, label: 'Submit the case' },
        { d: 'M920,570 L576.67,570' },
        { d: 'M306.67,570 L260,570' },
        { d: 'M441.67,455 L441.67,250',    lx: 441.67, ly: 352, label: 'If any change is needed' },
      ],
    },
  };
  const c = CFG[variant];
  const LH = 20;
  const mk = 'arr-' + variant;
  const label = (lx, ly, lines) => {
    const arr = Array.isArray(lines) ? lines : [lines];
    const w = Math.max(...arr.map(s => s.length)) * 7.2 + 12;
    const h = arr.length * 17 + 6;
    const start = ly - ((arr.length - 1) * 17) / 2;
    return (
      <g>
        <rect x={lx - w / 2} y={ly - h / 2} width={w} height={h} fill={c.panel} />
        <text x={lx} y={start} textAnchor="middle" dominantBaseline="middle" fontSize="15" fill="#3a3a3a" fontFamily="'Geist', sans-serif">
          {arr.map((s, i) => <tspan key={i} x={lx} dy={i === 0 ? 0 : 17}>{s}</tspan>)}
        </text>
      </g>
    );
  };
  return (
    <div style={{ position: 'relative', background: c.panel, border: '1px solid ' + c.border, borderRadius: 16, padding: '44px 26px 24px', marginTop: 16 }}>
      <span style={{ position: 'absolute', top: 14, left: 16, fontFamily: "'Geist', sans-serif", fontSize: 14, fontWeight: 500, color: c.badgeFg, background: c.badgeBg, padding: '3px 11px', borderRadius: 6 }}>{c.label}</span>
      <svg viewBox={c.vb} style={{ width: '100%', height: 'auto', display: 'block' }}>
        <defs>
          <marker id={mk} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill={STROKE} /></marker>
        </defs>
        {c.edges.map((e, i) => <path key={'e' + i} d={e.d} fill="none" stroke={STROKE} strokeWidth="2" markerEnd={'url(#' + mk + ')'} />)}
        {c.nodes.map((n, i) => {
          const start = n.cy - ((n.lines.length - 1) * LH) / 2;
          const txt = (
            <text x={n.cx} y={start} textAnchor="middle" dominantBaseline="middle" fontSize="15.5" fill={TXT} fontFamily="'Geist', sans-serif">
              {n.lines.map((ln, li) => <tspan key={li} x={n.cx} dy={li === 0 ? 0 : LH}>{ln}</tspan>)}
            </text>
          );
          if (n.shape === 'diamond') {
            const hw = n.w / 2, hh = n.h / 2;
            const pts = `${n.cx},${n.cy - hh} ${n.cx + hw},${n.cy} ${n.cx},${n.cy + hh} ${n.cx - hw},${n.cy}`;
            return <g key={i}><polygon points={pts} fill={NODE} stroke={STROKE} strokeWidth="2" strokeLinejoin="round" />{txt}</g>;
          }
          return <g key={i}><rect x={n.cx - c.nw / 2} y={n.cy - c.nh / 2} width={c.nw} height={c.nh} rx={7} fill={NODE} stroke={STROKE} strokeWidth="2" />{txt}</g>;
        })}
        {c.edges.map((e, i) => e.label ? <g key={'l' + i}>{label(e.lx, e.ly, e.label)}</g> : null)}
      </svg>
    </div>
  );
};

const ExtendedCaseStudy = ({ project, onClose, onNext }) => {
  const contentRef = React.useRef(null);
  const [progress, setProgress] = React.useState(0);
  const [active, setActive] = React.useState(0);

  const sections = React.useMemo(() => [
    { key:'hero',    label:'Overview' },
    { key:'brief',   label:'What I was asked to do' },
    { key:'phase1',  label:'Phase 1 — the workflow fix' },
    { key:'observe', label:'What I saw on the ground' },
    { key:'phase2',  label:'Phase 2 — the ideal version' },
    { key:'align',   label:'Getting everyone on board' },
    { key:'impact',  label:'Impact' },
  ], []);
  const refs = React.useRef(sections.map(() => React.createRef()));

  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const onScroll = () => {
    const el = contentRef.current; if (!el) return;
    const pct = el.scrollTop / Math.max(1, el.scrollHeight - el.clientHeight);
    setProgress(Math.min(100, pct * 100));
    const top = el.scrollTop + el.clientHeight * 0.30;
    let a = 0;
    refs.current.forEach((r, i) => { if (r.current && r.current.offsetTop <= top) a = i; });
    setActive(a);
  };

  const scrollTo = (i) => {
    const r = refs.current[i];
    if (r.current && contentRef.current) contentRef.current.scrollTop = r.current.offsetTop - 32;
  };

  const handleNext = () => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
    onNext();
  };

  return (
    <div className="cs-fullscreen">
      <div className="cs-sidebar">
        <button className="cs-back" onClick={onClose}>← Back to canvas</button>
        <div className="cs-sidebar-num">{project.code} · {project.name}</div>
        <h2>Piramal Parakh, <em>legal verification redesign</em></h2>
        <div className="cs-meta-list">
          <div className="cs-meta-item">Client<strong>{project.client}</strong></div>
          <div className="cs-meta-item">Role<strong>{project.role}</strong></div>
          <div className="cs-meta-item">Team<strong>{project.team}</strong></div>
          <div className="cs-meta-item">Timeline<strong>20 days · Aug 2022</strong></div>
          {project.figma && <div className="cs-meta-item">File<a className="cs-figma-link" href={project.figma} target="_blank" rel="noopener noreferrer">Open in Figma →</a></div>}
        </div>
        <div className="cs-toc" style={{maxHeight:'42vh',overflowY:'auto'}}>
          {sections.map((s, i) => (
            <button key={s.key}
              className={`cs-toc-btn ${active === i ? 'active' : ''}`}
              onClick={() => scrollTo(i)}>
              {String(i+1).padStart(2,'0')} · {s.label}
            </button>
          ))}
        </div>
        <div className="cs-proj-nav">
          <button className="cs-proj-btn" onClick={handleNext}>Next project →</button>
        </div>
      </div>

      <div className="cs-content" ref={contentRef} onScroll={onScroll}>
        <div className="cs-progress"><div className="cs-progress-fill" style={{width:`${progress}%`}}/></div>

        {/* 01 — Hero */}
        <div className="cs-hero" ref={refs.current[0]}>
          <div className="cs-eyebrow">
            <span>{project.audience}</span>
            <span>{project.year}</span>
            <span>{project.tags.join(' · ')}</span>
          </div>
          <h1>Piramal Parakh — <em>from 3 days to 2 hours</em></h1>
          <p className="cs-lede">Redesigning legal verification for India's lending industry as a solo IC across 400+ branches and 510 external advocates.</p>
          <div className="cs-macbook-stage">
            <img className="cs-hero-img" src="uploads/legal-verification-hero.jpg" alt="Parakh Collateral Sanctions — Legal Scrutiny Report approver view shown on a MacBook" loading="lazy"/>
          </div>
        </div>

        {/* 02 — The brief */}
        <div className="cs-section" ref={refs.current[1]}>
          <div className="cs-num">02 · The brief</div>
          <h2>Replace Salesforce for <em>three roles</em></h2>
          <p>I joined the project in April. I was walked through the current Salesforce workflow and told to rebuild it for CPAs and Approvers, and to build something new for Verifiers, who had never been in the system at all — their entire process ran on email, WhatsApp and printed paper.</p>
          <p>The Salesforce licences renewed in August. Design had to be done in 15 days so there was time for development and UAT. Seven role workflows in that window. This story follows one of them: the Agency <strong style={{color:'var(--ink)'}}>Legal Verifier</strong> and the agency manager who signs off their reports.</p>
        </div>

        {/* 03 — Phase 1 */}
        <div className="cs-section" ref={refs.current[2]}>
          <div className="cs-num">03 · Phase 1</div>
          <h2>I shipped the <em>obvious fix first</em></h2>
          <p>The workflow itself was clearly broken, and I could see how without any study. So I redrew the path a case takes — where the report is written, how it gets signed, who moves it along — and handed it to the developers straight away.</p>

          <div className="cs-subhead">The workflow, before and after</div>
          <img src="uploads/pasted-1788718640538-0.png" alt="Before — the paper-and-inbox legal-verification relay" loading="lazy" style={{width:'100%',height:'auto',display:'block',borderRadius:14,marginTop:16}}/>
          <img src="uploads/pasted-1788718650932-0.png" alt="After — one case, one thread, in-platform" loading="lazy" style={{width:'100%',height:'auto',display:'block',borderRadius:14,marginTop:20}}/>
          <p style={{marginTop:20}}>With that, CPA and Approver Salesforce licences could be sunset.</p>

          <div className="cs-subhead">What it still didn't fix</div>
          <p>It moved the same work onto a screen. The report was still whatever the vendor wanted it to be, and still just as long to fill in and just as hard to read.</p>
          <div className="cs-big">I wasn't satisfied with this. I had solved it from a walkthrough and my own judgement, not from anything I had seen a verifier or an approver actually do.</div>
        </div>

        {/* 04 — Observations + problems (merged) */}
        <div className="cs-section" ref={refs.current[3]}>
          <div className="cs-num">04 · What I saw on the ground</div>
          <h2>Watching the work changed <em>the problem</em></h2>
          <p>Phase 1 was built from a walkthrough. Before Phase 2 I went and watched the work itself: I sat with national legal heads and branch approvers while they read live reports and made a call, watched external verifiers fill their own Word files section by section, and pulled 15–20 real reports from different vendors to read side by side.</p>
          <p>What I found on the ground wasn't the problem I'd been handed. The brief was "rebuild the workflow." The work pointed somewhere else entirely — at the report itself, and how much of it was people re-doing work that had already been done.</p>

          <img src="uploads/Frame 12 compressed.jpg" alt="Legal approver working at a whiteboard, beside a spread of vendor reports in inconsistent formats from different agencies" loading="lazy" style={{width:'100%',height:'auto',display:'block',borderRadius:14,marginTop:8,marginBottom:4}}/>

          <div className="cs-cols2">
            <div className="cs-tile">
              <h4>What I saw approvers do</h4>
              <p>Scan six or seven pages to find four or five answers — and never in the same place twice, because every vendor ordered the report differently.</p>
            </div>
            <div className="cs-tile">
              <h4>What I saw verifiers do</h4>
              <p>Re-type detail that already existed upstream — property and collateral facts the CPA had entered days earlier — into a Word file, by hand.</p>
            </div>
          </div>

          <div className="cs-frame">
            <div className="kicker">What the observation told me</div>
            <p className="stmt">The task wasn't to move a broken workflow onto a screen. It was to stop everyone re-typing work that had already been done, and to make every report land in the same shape.</p>
          </div>

          <div className="cs-subhead">The four problems it surfaced</div>
          <ul className="cs-list">
            <li><strong style={{color:'var(--ink)'}}>Every vendor's report was ordered differently</strong> — approvers could never build a reading habit.</li>
            <li><strong style={{color:'var(--ink)'}}>Data entry was far longer than it needed to be</strong> — verifiers re-typed what the CPA already knew.</li>
            <li><strong style={{color:'var(--ink)'}}>Approvers read 6–7 pages per case</strong> to find a handful of answers.</li>
            <li><strong style={{color:'var(--ink)'}}>Managers could cherry-pick the easy cases</strong> — the one problem a report format couldn't touch.</li>
          </ul>

          <div className="cs-big">Three of those four had the same answer: one standard report format, with everything already known filled in. So I chose to templatize the report — and that became Phase 2.</div>
        </div>

        {/* 05 — Phase 2 */}
        <div className="cs-section" ref={refs.current[4]}>
          <div className="cs-num">05 · Phase 2</div>
          <h2>One format, <em>a third of the typing</em></h2>

          <div className="cs-subhead">Fixed the order of the sections</div>
          <p>Across the reports I read, the sections were jumbled — B sitting near E, D near A. I settled one order with the national heads and approvers and built it into the screen, the same for every vendor.</p>
          <img src="uploads/section_order compressed.jpg" alt="Report with a fixed, ordered list of sections — Part 1 Basic details through Part 7" loading="lazy" style={{width:'100%',height:'auto',display:'block',borderRadius:14,marginTop:8}}/>

          <div className="cs-subhead">Cut the entry to what only the verifier knows</div>
          <p>Most of the property and collateral detail in the report had already been entered upstream by the CPA. For each section I separated what the system already knows — from the CPA's entry, the transaction type and the property type — from what only the verifier can find on site. The first is shown to them. The second is all they fill.</p>
          <img src="uploads/data_entry_optimize compressed.jpg" alt="Part 2 Documents submitted — pre-filled document list the verifier adds to" loading="lazy" style={{width:'100%',height:'auto',display:'block',borderRadius:14,marginTop:8}}/>

          <div className="cs-subhead">Answered the approver's questions upfront</div>
          <p>Watching approvers read, they were scanning six or seven pages for four or five answers — is the title clear, are the LSR provisions met, and a few more of that kind. I turned those into a short set of questions the verifier answers directly, and put the answers at the top of the approver's screen. The full report stays one click away.</p>
          <img src="uploads/conclusion compressed.jpg" alt="Part 11 Conclusion — the approver's key questions answered upfront" loading="lazy" style={{width:'100%',height:'auto',display:'block',borderRadius:14,marginTop:8}}/>
        </div>

        {/* 06 — Alignment */}
        <div className="cs-section" ref={refs.current[5]}>
          <div className="cs-num">06 · Alignment</div>
          <h2>Getting everyone <em>on board</em></h2>
          <p>Fixing the format meant telling 510 vendors their report was changing. I put the two problems to the stakeholders first: your approvers can't build a habit because every report is ordered differently, and your verifiers spend so long typing that it pushes the case TAT out.</p>
          <p>Then the trade. Yes, the order is fixed now, but the typing drops by about 70% — because everything the CPA enters is carried forward. I walked the national legal manager, the branch legal manager and a verifier through the whole flow in Figma.</p>
        </div>

        {/* 07 — Impact */}
        <div className="cs-section" ref={refs.current[6]}>
          <div className="cs-num">07 · Impact</div>
          <h2><em>Impact</em></h2>
          <div className="cs-outcomes" style={{gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))'}}>
            <div className="cs-outcome"><div className="big"><em>3d → 2h</em></div><div className="lab">Report turnaround (p75)</div></div>
            <div className="cs-outcome"><div className="big"><em>~70%</em></div><div className="lab">Of verifier typing removed</div></div>
            <div className="cs-outcome"><div className="big"><em>15–20</em> min</div><div className="lab">Approver decision time per case</div></div>
            <div className="cs-outcome"><div className="big"><em>510</em></div><div className="lab">Vendors on one format</div></div>
          </div>
          <div className="cs-subhead">Steps that no longer exist</div>
          <ul className="cs-list">
            <li>The manager printing, signing, stamping and scanning every report</li>
            <li>The CPA downloading the report and uploading it into Salesforce</li>
            <li>The report being passed around by email and WhatsApp</li>
          </ul>
          <div className="cs-savings">
            <h5>Licence savings</h5>
            <ul className="cs-list">
              <li>400+ branches × 2 Salesforce licences (1 CPA + 1 Legal Manager each) — sunset</li>
              <li>510 vendor licences avoided as the network grows</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------- Technical Verification: extended case study (8 sections) ---------- */

const TechCaseStudy = ({ project, onClose, onNext }) => {
  const contentRef = React.useRef(null);
  const [progress, setProgress] = React.useState(0);
  const [active, setActive] = React.useState(0);

  const sections = React.useMemo(() => [
    { key:'hero',    label:'Overview' },
    { key:'tldr',    label:'TL;DR' },
    { key:'before',  label:'The before' },
    { key:'reframe', label:'The existing SFDC flow' },
    { key:'moves',   label:'Eight moves' },
    { key:'capture', label:'Field-first capture' },
    { key:'intel',   label:'The intelligence layer' },
    { key:'impact',  label:'Before → after & impact' },
  ], []);
  const refs = React.useRef(sections.map(() => React.createRef()));

  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const onScroll = () => {
    const el = contentRef.current; if (!el) return;
    const pct = el.scrollTop / Math.max(1, el.scrollHeight - el.clientHeight);
    setProgress(Math.min(100, pct * 100));
    const top = el.scrollTop + el.clientHeight * 0.30;
    let a = 0;
    refs.current.forEach((r, i) => { if (r.current && r.current.offsetTop <= top) a = i; });
    setActive(a);
  };
  const scrollTo = (i) => {
    const r = refs.current[i];
    if (r.current && contentRef.current) contentRef.current.scrollTop = r.current.offsetTop - 32;
  };
  const handleNext = () => { if (contentRef.current) contentRef.current.scrollTop = 0; onNext(); };

  return (
    <div className="cs-fullscreen">
      <div className="cs-sidebar">
        <button className="cs-back" onClick={onClose}>← Back to canvas</button>
        <div className="cs-sidebar-num">{project.code} · {project.name}</div>
        <h2>Technical verification, <em>field-first</em></h2>
        <div className="cs-meta-list">
          <div className="cs-meta-item">Client<strong>{project.client}</strong></div>
          <div className="cs-meta-item">Role<strong>{project.role}</strong></div>
          <div className="cs-meta-item">Team<strong>{project.team}</strong></div>
          <div className="cs-meta-item">Timeline<strong>30 days · Sept 2022</strong></div>
          {project.figma && <div className="cs-meta-item">File<a className="cs-figma-link" href={project.figma} target="_blank" rel="noopener noreferrer">Open in Figma →</a></div>}
        </div>
        <div className="cs-toc">
          {sections.map((s, i) => (
            <button key={s.key}
              className={`cs-toc-btn ${active === i ? 'active' : ''}`}
              onClick={() => scrollTo(i)}>
              {String(i+1).padStart(2,'0')} · {s.label}
            </button>
          ))}
        </div>
        <div className="cs-proj-nav">
          <button className="cs-proj-btn" onClick={handleNext}>Next project →</button>
        </div>
      </div>

      <div className="cs-content" ref={contentRef} onScroll={onScroll}>
        <div className="cs-progress"><div className="cs-progress-fill" style={{width:`${progress}%`}}/></div>

        {/* 01 — Overview */}
        <div className="cs-hero" ref={refs.current[0]}>
          <div className="cs-eyebrow">
            <span>{project.audience}</span>
            <span>{project.year}</span>
            <span>{project.tags.join(' · ')}</span>
          </div>
          <h1>Technical verification — <em>from a 60-field Excel to the field</em></h1>
          <p className="cs-lede">The technical valuation of pledged property ran as an email-and-Excel relay. I rebuilt it into a field-first mobile flow that auto-generates a signed, scored report and hands it straight to underwriting — deleting two entire manual "download-and-re-upload" legs.</p>
        </div>

        {/* 02 — TL;DR */}
        <div className="cs-section" ref={refs.current[1]}>
          <div className="cs-num">02 · The short version</div>
          <h2>TL;<em>DR</em></h2>
          <div className="cs-cols3">
            <div className="cs-tile">
              <h4>Problem</h4>
              <p>A 60–70 field Excel was the "system." Reports were hand-typed, printed, physically signed and stamped, scanned, and re-uploaded — then a CPA re-keyed fields into Salesforce.</p>
            </div>
            <div className="cs-tile">
              <h4>Approach</h4>
              <p>Reuse every field that already exists, delete the physical detours, let the system decide the boring stuff (case priority), and move quality control upstream — as a structured mobile capture flow.</p>
            </div>
            <div className="cs-tile">
              <h4>Impact</h4>
              <p>Two full manual legs eliminated: the print/sign/stamp/scan, and the CPA's download-and-re-upload. Data is structured from the point of observation, so it flows to credit on its own.</p>
            </div>
          </div>
          <div className="tv-note"><strong>Numbers:</strong> TAT, rework-rate and touch-count figures are placeholders below — drop your real / projected values in and I'll format them.</div>
        </div>

        {/* 03 — The before */}
        <div className="cs-section" ref={refs.current[2]}>
          <div className="cs-num">03 · The before</div>
          <h2>The "system" was a <em>spreadsheet</em></h2>
          <p>Technical verification ran as a long chain of manual handoffs stitched together over email and WhatsApp, across two routes — internal (verifier → BTM approval) and external (vendor manager → field verifier → sign & stamp). Both leaked time at every seam.</p>
          <ul className="cs-list">
            <li>A <strong style={{color:'var(--ink)'}}>60–70 field Excel</strong> was filled by hand to produce each report. Long, error-prone, no validation.</li>
            <li><strong style={{color:'var(--ink)'}}>Physical sign &amp; stamp theatre</strong> — download, print, sign, stamp, scan, re-upload. A digital document taking a detour through a printer.</li>
            <li>The <strong style={{color:'var(--ink)'}}>CPA as a human file-transfer service</strong> — downloading from email, extracting fields, re-keying into Salesforce.</li>
            <li><strong style={{color:'var(--ink)'}}>Vendor allocation by vibes</strong> — assigned on the BTM's word of mouth, with no data on accuracy or punctuality.</li>
            <li>Communication scattered across <strong style={{color:'var(--ink)'}}>email + WhatsApp</strong>, and <strong style={{color:'var(--ink)'}}>no prioritisation</strong> of cases by urgency or value.</li>
          </ul>
          <div className="tv-panel" style={{marginTop:32,maxWidth:820}}>
            <div className="cap"><span className="tv-pill-b">Before</span> The legacy 60–70 field Excel — one report, one sheet</div>
            <div className="tv-scroll"><img src="uploads/pasted-1788100753214-0.png" alt="Legacy Excel valuation report — a single sprawling spreadsheet with 60–70 fields across many sections" loading="lazy"/></div>
          </div>
          <p style={{marginTop:16,fontSize:15,color:'var(--ink-3)'}}>Scroll it. Every verifier filled this by hand, back at a desk, from memory — the gap where errors crept in.</p>
        </div>

        {/* 04 — The problems in the existing SFDC flow */}
        <div className="cs-section" ref={refs.current[3]}>
          <div className="cs-num">04 · The problems</div>
          <h2>The existing <em>SFDC flow</em></h2>
          <p>This is how technical verification ran inside Salesforce before the redesign — a long chain of handoffs stitched together over email. Mapping it end to end surfaced where it broke.</p>
          <div className="tv-panel" style={{marginTop:32}}>
            <div className="cap"><span className="tv-pill-b">Before</span> The existing SFDC flow, end to end</div>
            <div className="tv-panel-pad" style={{padding:'22px'}}><img src="uploads/pasted-1788798606683-0.png" alt="The existing SFDC technical-verification flow, mapped end to end" loading="lazy" style={{width:'100%',height:'auto',display:'block'}}/></div>
          </div>
          <div className="cs-cols3" style={{marginTop:32}}>
            <div className="cs-tile"><h4>01 · Physical steps in a digital process</h4><p>Print, sign, stamp, scan, re-upload — a digital document taking a detour through a printer.</p></div>
            <div className="cs-tile"><h4>02 · No prioritisation of cases</h4><p>No sense of which case to do first — verifiers picked from a raw queue with no ordering by urgency or value.</p></div>
            <div className="cs-tile"><h4>03 · No feedback signal</h4><p>Nothing flagged a weak report before credit saw it — quality problems surfaced only after underwriting.</p></div>
          </div>
        </div>

        {/* 05 — Eight moves */}
        <div className="cs-section" ref={refs.current[4]}>
          <div className="cs-num">05 · The solution</div>
          <h2>Seven connected <em>moves</em></h2>
          <p>Roughly following a case's life — from the CPA opening it to the report landing in underwriting. The four highlighted below are the load-bearing ones.</p>
          <div className="cs-numlist">
            <div className="cs-numcard tv-focus"><span className="tv-chip">Focus</span><div className="n">Move 01</div><h5>Smart case prioritisation — one button, not a list</h5><p>A single "Start a new case" ranks cases by loan amount and sanction-readiness, and surfaces the highest-priority one. Search overrides when Sales flags something urgent.</p></div>
            <div className="cs-numcard"><div className="n">Move 02</div><h5>Leverage the data Sales already captured</h5><p>The CPA screen pre-fills collateral details; the CPA only adds the 2–3 fields Sales can't know (Revenue Office, SRO name).</p></div>
            <div className="cs-numcard"><div className="n">Move 03</div><h5>Unified document handling</h5><p>One upload serves both legal and technical verification; documents can be marked for physical pickup where originals are needed.</p></div>
            <div className="cs-numcard tv-focus"><span className="tv-chip">Focus</span><div className="n">Move 04</div><h5>Field-first mobile capture — killing the Excel</h5><p>The 60–70 Excel fields become native inputs grouped into the same sections. On "Start verification" the app auto-captures lat/long; photos and details are captured on location.</p></div>
            <div className="cs-numcard tv-focus"><span className="tv-chip">Focus</span><div className="n">Move 05</div><h5>Auto-generated, digitally signed report</h5><p>On submit, the report builds itself from structured entry and the pre-stored sign &amp; stamp PNG is appended — deleting the download → print → sign → stamp → scan → re-upload leg.</p></div>
            <div className="cs-numcard"><div className="n">Move 06</div><h5>Manager review — approve or send back</h5><p>Send-back returns the case to the verifier with a remark; the correction loop lives inside the system instead of over email.</p></div>
            <div className="cs-numcard tv-focus"><span className="tv-chip">Focus</span><div className="n">Move 07</div><h5>Scoring engine + straight-to-credit hand-off</h5><p>The BTM sees a generated score, red flags and good areas with a recommend, and the structured data flows directly into the credit underwriting grid.</p></div>
          </div>
        </div>

        {/* 06 — Field-first capture (centerpiece) */}
        <div className="cs-section" ref={refs.current[5]}>
          <div className="cs-num">06 · The heart of it</div>
          <h2>The Excel becomes <em>the field</em></h2>
          <p>The verifier's spreadsheet turns into a structured mobile app: the same sections, now native input fields captured at the point of observation. The gap where "fill the Excel back at the desk" invited errors is gone.</p>

          <div className="tv-ba">
            <div className="tv-panel">
              <div className="cap"><span className="tv-pill-b">Before</span> 60–70 fields, one sheet, by hand</div>
              <div className="tv-scroll"><img src="uploads/pasted-1788100753214-0.png" alt="Legacy Excel valuation report" loading="lazy"/></div>
            </div>
            <div className="tv-panel">
              <div className="cap"><span className="tv-pill-a">After</span> Structured mobile capture, on site</div>
              <div className="tv-scroll-phone"><img src="uploads/pasted-1788100779950-0.png" alt="Rebuilt mobile verifier — Data Entry section list" loading="lazy"/></div>
            </div>
          </div>

          <div className="cs-subhead">Inside a section — native fields, geo-proof, photos on location</div>
          <div className="tv-phones">
            <img className="tv-shot-phone" src="uploads/pasted-1788102984042-0.png" alt="Rebuilt mobile verifier — Basic Details with location auto-captured from GPS (lat/long shown on map)" loading="lazy"/>
            <div style={{flex:1,minWidth:280,display:'flex',flexDirection:'column',gap:16,alignSelf:'center'}}>
              <div className="cs-tile"><h4>Native fields, not cells</h4><p>Every Excel cell becomes a typed input in the same section — unlocking validation and, later, scoring.</p></div>
              <div className="cs-tile"><h4>Auto lat/long geo-proof</h4><p>Tapping "Start verification" auto-captures coordinates — no manual entry, and tamper-resistant proof the verifier was on site.</p></div>
              <div className="cs-tile"><h4>Captured on location</h4><p>Photos and every detail are entered on the ground and submitted — structured data instead of a spreadsheet reconstructed from memory.</p></div>
            </div>
          </div>

          <div className="cs-subhead">On submit — the report signs itself</div>
          <p>The vendor manager uploads their sign &amp; stamp once at onboarding. On submission the report is generated from the structured entry and the stored signature is appended — the printer detour is gone.</p>
          <div className="tv-sign">
            <div className="sigwrap">
              <span className="sig">Chintan J.</span>
              <div className="sigcap">Auto-appended · pre-stored sign &amp; stamp (PNG)</div>
            </div>
            <div className="tv-stamp"><span>Verified</span><span>Approved</span></div>
          </div>
        </div>

        {/* 07 — Intelligence layer */}
        <div className="cs-section" ref={refs.current[6]}>
          <div className="cs-num">07 · Intelligence</div>
          <h2>Let the system decide the <em>boring stuff</em></h2>

          <div className="cs-subhead">Case prioritisation — one button, not a queue</div>
          <p>Instead of a raw queue that invites cherry-picking, one action surfaces the highest-priority case — ranked by loan value and sanction-readiness. A list is a decision-fatigue tax; a single prioritised action quietly enforces the business's order.</p>
          <div className="tv-panel" style={{marginTop:16}}>
            <div className="cap"><span className="tv-pill-a">After</span> Up next — the single prioritised action</div>
            <div className="tv-panel-pad" style={{padding:'22px'}}><img src="uploads/pasted-1788801695405-0.png" alt="Up next for you — a single prioritised case surfaced with a Start Case action, ranked by TAT remaining, loan amount and processing risk" loading="lazy" style={{width:'100%',height:'auto',display:'block'}}/></div>
          </div>

          <div className="cs-subhead">BTM scoring — read the signal, not the whole report</div>
          <p>After the manager submits, the BTM doesn't wade through the full report — they see a generated score, its red flags and good areas, and an approve/reject recommendation. On approval the structured data flows directly into the credit underwriting grid.</p>
          <div className="tv-browser">
            <div className="bar">
              <span className="d" style={{background:'#f2655f'}}/><span className="d" style={{background:'#f5bf4f'}}/><span className="d" style={{background:'#5bc46b'}}/>
              <span className="addr">parakh.piramal.com / collateral / technical-report</span>
            </div>
            <div className="win"><img src="uploads/pasted-1788100816590-0.png" alt="BTM desktop approver — technical scrutiny report with report rating score, valuations, full report and approve / send back actions" loading="lazy"/></div>
          </div>
          <div className="cs-cols3" style={{marginTop:24}}>
            <div className="cs-tile"><h4>Score + red flags</h4><p>Report strength surfaced up front with its weak and strong areas — quality control moved upstream of a human read.</p></div>
            <div className="cs-tile"><h4>Approve / send back</h4><p>A clean decision. Send-back returns to the verifier with a remark; the loop stays in-system.</p></div>
            <div className="cs-tile"><h4>Straight to credit</h4><p>Structured from the start, the data just moves — no CPA download, extract, re-upload.</p></div>
          </div>
        </div>

        {/* 08 — Before → after & impact */}
        <div className="cs-section" ref={refs.current[7]}>
          <div className="cs-num">08 · Before → after</div>
          <h2>What <em>shifted</em></h2>
          <table className="tv-table">
            <thead><tr><th></th><th>Before</th><th>After</th></tr></thead>
            <tbody>
              <tr><td>Report authoring</td><td className="dim">60–70 field Excel, by hand</td><td className="hi">Structured mobile fields, on-site</td></tr>
              <tr><td>Sign &amp; stamp</td><td className="dim">Print → sign → stamp → scan → upload</td><td className="hi">Pre-stored PNG auto-appended</td></tr>
              <tr><td>Geo proof</td><td className="dim">None / manual</td><td className="hi">Auto lat/long on "Start verification"</td></tr>
              <tr><td>CPA → Salesforce</td><td className="dim">Manual download, extract, re-upload</td><td className="hi">Structured data flows to credit</td></tr>
              <tr><td>Prioritisation</td><td className="dim">None</td><td className="hi">Ranked by loan value + readiness</td></tr>
              <tr><td>Query &amp; rectification</td><td className="dim">Email + WhatsApp</td><td className="hi">In-system loops with remarks</td></tr>
              <tr><td>Quality check</td><td className="dim">Human reads full report</td><td className="hi">Auto-score + red flags + recommend</td></tr>
            </tbody>
          </table>
          <div className="cs-big">Two full manual legs eliminated: the vendor manager's print/sign/stamp/scan, and the CPA's download-and-re-upload to Salesforce.</div>
          <div className="cs-outcomes" style={{gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))'}}>
            <div className="cs-outcome"><div className="big"><em>2</em></div><div className="lab">Manual legs removed</div></div>
            <div className="cs-outcome"><div className="big"><em>[TAT]</em></div><div className="lab">Report TAT, before → after</div></div>
            <div className="cs-outcome"><div className="big"><em>[%]</em></div><div className="lab">Rework rate reduction</div></div>
          </div>
          <div className="tv-note"><strong>Bracketed metrics are placeholders.</strong> Send me your real or projected numbers and I'll drop them in (labelled as targets if not yet measured).</div>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { Hero, SectionHead, About, Sticky, Stats, Photo, Tools, ProjectCard, Timeline, Contact, Marquee, CaseStudy, ExtendedCaseStudy, TechCaseStudy });

