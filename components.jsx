/* Island content components — presentational only. */

const Hero = () => (
  <div className="card hero">
    <div className="eyebrow">
      <span className="dot" /> <span>Available · Q3 2026</span>
      <span style={{marginLeft:'auto'}}>CJ · PORTFOLIO · v4.2</span>
    </div>
    <h1>
      Chintan<br/>
      <span className="ital">Jat</span>
      <span style={{fontFamily:'var(--f-mono)',fontSize:18,verticalAlign:'super',marginLeft:12,color:'var(--ink-3)',letterSpacing:'0.1em'}}>/ CJ</span>
    </h1>
    <p className="tag">
      Creative Designer crafting immersive <em>digital experiences</em> in the void.
    </p>
    <div className="meta-row">
      <div>Based in<strong>Pune, IN</strong></div>
      <div>Working<strong>Globally, remote</strong></div>
      <div>Focus<strong>Fintech · Legaltech · Ops</strong></div>
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
    <h3>Ten years in, still chasing the click.</h3>
    <p>
      I'm Chintan — a creative designer who builds interfaces for people who don't have time to read them. I spend most of my weeks with fintech ops teams, legal reviewers and field verifiers. The work is unglamorous. I like it that way.
    </p>
    <p>
      I care about the first fifteen seconds of a workflow, the sentence a user tells a coworker afterwards, and the audit trail no one sees. Shortcuts and hotkeys are a love language. Pan anywhere with <span className="kbd">drag</span>, zoom with <span className="kbd">scroll</span>, jump with <span className="kbd">1–5</span>.
    </p>
  </div>
);

const Sticky = () => (
  <div className="sticky">
    "Good design is a quiet victory — you only hear about it when it breaks."
    <span className="attrib">— Pinned above my desk</span>
  </div>
);

const Stats = () => (
  <div className="card stats">
    <div>
      <div className="s-num"><em>24</em></div>
      <div className="s-lab">Products shipped</div>
    </div>
    <div>
      <div className="s-num">6<em>yrs</em></div>
      <div className="s-lab">Deep in fintech</div>
    </div>
    <div>
      <div className="s-num">120k<em>+</em></div>
      <div className="s-lab">Daily end users</div>
    </div>
    <div>
      <div className="s-num"><em>3</em></div>
      <div className="s-lab">Detailed case studies below</div>
    </div>
  </div>
);

const Photo = () => (
  <div className="card photo-frame">
    <div className="ph">PORTRAIT · PLACEHOLDER</div>
    <div className="caption">Chintan, mid-deadline</div>
  </div>
);

const Tools = () => (
  <div className="card tools">
    <h4>Tools of the trade</h4>
    <ul>
      <li className="accent">Figma</li>
      <li className="accent">Protopie</li>
      <li>Framer</li>
      <li>After Effects</li>
      <li>Rive</li>
      <li>HTML / CSS</li>
      <li>Notion</li>
      <li>FigJam</li>
      <li>Maze</li>
      <li>Dovetail</li>
      <li className="accent">Claude</li>
    </ul>
  </div>
);

const ProjectCard = ({ project, onOpen }) => (
  <div className="card project" onClick={() => onOpen(project.id)}>
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
  return (
    <div className="card timeline">
      <h3>Experience</h3>
      <div className="sub">A selected timeline</div>
      <div className="tline">
        {EXPERIENCE.map((e, i) => (
          <div className="tline-item" key={i}>
            <div className="year">{e.year}</div>
            <div className="role">{e.role}</div>
            <div className="co">{e.co} — {e.note}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Contact = () => (
  <div className="card contact">
    <h3>Say hi, <em>or something bigger.</em></h3>
    <p>I reply to every good email. If you have a problem worth untangling, send it over — even half-formed.</p>
    <div className="contact-links">
      <a className="clink" href="mailto:chintan@example.com">
        <span><span className="label">Email</span>chintan@example.com</span>
        <span className="arrow">↗</span>
      </a>
      <a className="clink" href="#">
        <span><span className="label">LinkedIn</span>/in/chintanjat</span>
        <span className="arrow">↗</span>
      </a>
      <a className="clink" href="#">
        <span><span className="label">Dribbble</span>@chintanjat</span>
        <span className="arrow">↗</span>
      </a>
      <a className="clink" href="#">
        <span><span className="label">Read.cv</span>/chintanjat</span>
        <span className="arrow">↗</span>
      </a>
      <a className="clink" href="#">
        <span><span className="label">X / Twitter</span>@chintan_jat</span>
        <span className="arrow">↗</span>
      </a>
      <a className="clink" href="#">
        <span><span className="label">Calendar</span>Book 20 min</span>
        <span className="arrow">↗</span>
      </a>
    </div>
  </div>
);

const Marquee = ({ text }) => (
  <div className="marquee">{text}</div>
);

/* ---------- Case study panel ---------- */

const CaseStudy = ({ project, onClose, onNext }) => {
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="cs-overlay" onClick={onClose}>
      <div className="cs-panel" onClick={(e) => e.stopPropagation()}>
        <button className="cs-close" onClick={onClose} title="Close (Esc)">×</button>

        <div className="cs-hero">
          <div className="cs-eyebrow">
            <span>{project.code} · {project.name}</span>
            <span>{project.year}</span>
            <span>{project.audience}</span>
          </div>
          <h1>
            {project.title.split(',')[0]}, <em>{project.title.split(',').slice(1).join(',').trim()}</em>
          </h1>
          <p className="cs-lede">{project.lede}</p>
          <div className="cs-meta">
            <div>Client<strong>{project.client}</strong></div>
            <div>Role<strong>{project.role}</strong></div>
            <div>Duration<strong>{project.duration}</strong></div>
            <div>Team<strong>{project.team}</strong></div>
          </div>
        </div>

        <div className="cs-section">
          <div className="cs-num">01 · Problem</div>
          <h2>What was <em>broken</em></h2>
          <p>{project.problem}</p>
          <div className="cs-ph short">PROBLEM DIAGRAM · PLACEHOLDER</div>
        </div>

        <div className="cs-section">
          <div className="cs-num">02 · Research</div>
          <h2>What we <em>learned</em></h2>
          <p>{project.research}</p>
          <div className="cs-grid2">
            <div className="cs-tile"><h4>Methods</h4><p>Contextual inquiry · Diary studies · Session replays · Stakeholder interviews</p></div>
            <div className="cs-tile"><h4>Artifacts</h4><p>Journey maps · Service blueprints · Opportunity matrix · Jobs-to-be-done</p></div>
          </div>
          <div className="cs-big">"{project.quote.replace(/^"|"$/g,'')}"<br/><span style={{fontFamily:'var(--f-mono)',fontStyle:'normal',fontSize:11,color:'var(--ink-3)',letterSpacing:'0.12em',textTransform:'uppercase'}}>— {project.quoteWho}</span></div>
        </div>

        <div className="cs-section">
          <div className="cs-num">03 · Design</div>
          <h2>How we <em>solved it</em></h2>
          <p>{project.design}</p>
          <div className="cs-ph tall">HERO DESIGN · PLACEHOLDER</div>
          <div className="cs-grid2">
            <div className="cs-ph short" style={{margin:0}}>FLOW 01</div>
            <div className="cs-ph short" style={{margin:0}}>FLOW 02</div>
          </div>
        </div>

        <div className="cs-section">
          <div className="cs-num">04 · Outcome</div>
          <h2>What <em>shifted</em></h2>
          <div className="cs-outcomes">
            {project.outcomes.map((o, i) => (
              <div key={i} className="cs-outcome">
                <div className="big"><em>{o.big}</em></div>
                <div className="lab">{o.lab}</div>
              </div>
            ))}
          </div>
          <p style={{marginTop:32}}>The numbers matter, but what I remember is the first week of rollout: agents stopped asking for the old version back, and a legal partner emailed to say she finished a report before coffee. That's the click.</p>
        </div>

        <div className="cs-foot">
          <a onClick={onClose}><span>←</span> Back to canvas</a>
          <a onClick={onNext}>Next case study <span>→</span></a>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { Hero, SectionHead, About, Sticky, Stats, Photo, Tools, ProjectCard, Timeline, Contact, Marquee, CaseStudy });
