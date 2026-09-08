/* Canvas engine — pan, zoom, momentum, minimap, chrome. */

const { useState, useEffect, useRef, useCallback, useMemo } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "cool",
  "grid": "dots",
  "parallax": true,
  "autoOrbit": false
}/*EDITMODE-END*/;

const MIN_ZOOM = 0.25;
const MAX_ZOOM = 2.2;
const prefersReducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

function useCanvasEngine() {
  const [t, setT] = useState({ x: 0, y: 0, z: 1 });
  const tRef = useRef(t);
  tRef.current = t;
  const stageRef = useRef(null);
  const vel = useRef({ x: 0, y: 0 });
  const rafId = useRef(null);
  const panning = useRef(false);
  const lastPt = useRef({ x: 0, y: 0, time: 0 });
  const [isPanning, setIsPanning] = useState(false);

  const setTransform = useCallback((next) => {
    const el = stageRef.current;
    if (!el) return;
    if (!el.clientWidth) return;
    const maxX = 2200, minX = -3800;
    const maxY = 800, minY = -8200;
    next.x = Math.min(maxX, Math.max(minX, next.x));
    next.y = Math.min(maxY, Math.max(minY, next.y));
    next.z = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, next.z));
    setT(next);
  }, []);

  const zoomTo = useCallback((target, cx, cy) => {
    const el = stageRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    cx = cx ?? rect.width / 2;
    cy = cy ?? rect.height / 2;
    const prev = tRef.current;
    const worldX = (cx - prev.x) / prev.z;
    const worldY = (cy - prev.y) / prev.z;
    const nz = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, target));
    const nx = cx - worldX * nz;
    const ny = cy - worldY * nz;
    setTransform({ x: nx, y: ny, z: nz });
  }, [setTransform]);

  const panTo = useCallback((worldX, worldY, zoom, animate = true) => {
    const el = stageRef.current;
    if (!el) return;
    const z = zoom ?? tRef.current.z;
    const nx = el.clientWidth / 2 - worldX * z;
    const ny = el.clientHeight / 2 - worldY * z;
    if (!animate || prefersReducedMotion()) { setTransform({ x: nx, y: ny, z }); return; }
    const from = { ...tRef.current };
    const to = { x: nx, y: ny, z };
    const start = performance.now();
    const dist = Math.hypot(to.x - from.x, to.y - from.y);
    // Distance-aware duration with gentle floor/ceiling
    const dur = Math.max(650, Math.min(1400, 500 + dist * 0.45));
    // Smooth in-out with a hint of settle — no sharp deceleration
    const ease = (u) => {
      // easeInOutQuint — symmetric, silky
      return u < 0.5
        ? 16 * u * u * u * u * u
        : 1 - Math.pow(-2 * u + 2, 5) / 2;
    };
    const step = (now) => {
      const u = Math.min(1, (now - start) / dur);
      const e = ease(u);
      setTransform({
        x: from.x + (to.x - from.x) * e,
        y: from.y + (to.y - from.y) * e,
        z: from.z + (to.z - from.z) * e,
      });
      if (u < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [setTransform]);

  // momentum decay
  useEffect(() => {
    const tick = () => {
      if (Math.abs(vel.current.x) > 0.05 || Math.abs(vel.current.y) > 0.05) {
        setTransform({
          x: tRef.current.x + vel.current.x,
          y: tRef.current.y + vel.current.y,
          z: tRef.current.z,
        });
        vel.current.x *= 0.92;
        vel.current.y *= 0.92;
      }
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId.current);
  }, [setTransform]);

  // events
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onDown = (e) => {
      if (e.target.closest('[data-interactive]')) return;
      panning.current = true;
      setIsPanning(true);
      lastPt.current = { x: e.clientX, y: e.clientY, time: performance.now() };
      vel.current = { x: 0, y: 0 };
    };
    const onMove = (e) => {
      if (!panning.current) return;
      const now = performance.now();
      const dx = e.clientX - lastPt.current.x;
      const dy = e.clientY - lastPt.current.y;
      const dt = Math.max(1, now - lastPt.current.time);
      vel.current = { x: dx * 16 / dt, y: dy * 16 / dt };
      lastPt.current = { x: e.clientX, y: e.clientY, time: now };
      setTransform({ x: tRef.current.x + dx, y: tRef.current.y + dy, z: tRef.current.z });
    };
    const onUp = () => {
      panning.current = false;
      setIsPanning(false);
      if (prefersReducedMotion()) vel.current = { x: 0, y: 0 };
    };
    // Wheel handling is now done at the App level (snap-to-section).
    // Keep only pinch-to-zoom via ctrl/meta+wheel here.
    const onWheel = (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const rect = el.getBoundingClientRect();
        const cx = e.clientX - rect.left;
        const cy = e.clientY - rect.top;
        const factor = Math.exp(-e.deltaY * 0.0015);
        zoomTo(tRef.current.z * factor, cx, cy);
      }
    };
    el.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    el.addEventListener('wheel', onWheel, { passive: false });

    // touch
    let touchStart = null;
    let pinchStart = null;
    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY, tx: tRef.current.x, ty: tRef.current.y };
      } else if (e.touches.length === 2) {
        const [a, b] = e.touches;
        pinchStart = {
          d: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY),
          z: tRef.current.z,
          cx: (a.clientX + b.clientX) / 2,
          cy: (a.clientY + b.clientY) / 2,
        };
      }
    };
    const onTouchMove = (e) => {
      if (e.touches.length === 2 && pinchStart) {
        e.preventDefault();
        const [a, b] = e.touches;
        const d = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
        const rect = el.getBoundingClientRect();
        zoomTo(pinchStart.z * (d / pinchStart.d), pinchStart.cx - rect.left, pinchStart.cy - rect.top);
      } else if (e.touches.length === 1 && touchStart) {
        const dx = e.touches[0].clientX - touchStart.x;
        const dy = e.touches[0].clientY - touchStart.y;
        setTransform({ x: touchStart.tx + dx, y: touchStart.ty + dy, z: tRef.current.z });
      }
    };
    const onTouchEnd = () => { touchStart = null; pinchStart = null; };
    el.addEventListener('touchstart', onTouchStart, { passive: false });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd);

    return () => {
      el.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [setTransform, zoomTo]);

  return { t, setTransform, zoomTo, panTo, stageRef, isPanning, tRef };
}

/* ---------- Main App ---------- */

const App = () => {
  const { ISLANDS, SECTIONS, PROJECTS } = window.PORTFOLIO_DATA;
  const engine = useCanvasEngine();
  const [openCase, setOpenCase] = useState(null);
  const [activeSection, setActiveSection] = useState('hero');
  const [showHint, setShowHint] = useState(true);
  const tweaks = TWEAK_DEFAULTS;

  // Responsive fit zoom based on viewport width
  const computeFitZoom = useCallback(() => {
    const el = engine.stageRef.current;
    if (!el) return 0.72;
    const w = el.clientWidth;
    if (w <= 1024) return 1;
    if (w < 1500) return 0.72;
    return 0.78;
  }, [engine.stageRef]);

  // initial positioning — center on hero at responsive zoom
  useEffect(() => {
    const el = engine.stageRef.current;
    if (!el) return;
    const hero = SECTIONS[0];
    requestAnimationFrame(() => {
      engine.panTo(hero.center.x, hero.center.y, computeFitZoom(), false);
    });
    const onResize = () => {
      const s = SECTIONS.find(s => s.id === activeSectionRef.current) || SECTIONS[0];
      engine.panTo(s.center.x, s.center.y, computeFitZoom(), false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []); // eslint-disable-line

  const activeSectionRef = useRef('hero');
  useEffect(() => { activeSectionRef.current = activeSection; });

  // On compact screens the canvas becomes a readable linear document.
  useEffect(() => {
    if (!window.matchMedia('(max-width: 1024px)').matches || !('IntersectionObserver' in window)) return;
    const sections = Array.from(document.querySelectorAll('.mobile-flow [data-section]'));
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target.dataset.section) setActiveSection(visible.target.dataset.section);
    }, { rootMargin: '-25% 0px -60% 0px', threshold: [0.1, 0.4, 0.7] });
    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // Snap-scroll: wheel/trackpad jumps to next/prev section
  const snapLock = useRef(false);
  const wheelAccum = useRef(0);
  const wheelIdleTimer = useRef(null);
  const lastWheelDir = useRef(0);
  useEffect(() => {
    const el = engine.stageRef.current;
    if (!el) return;
    const THRESHOLD = 60; // accumulated wheel delta before a snap fires
    const COOLDOWN  = 700; // must be < panTo duration so next gesture can queue while settling

    const onWheelSnap = (e) => {
      if (e.ctrlKey || e.metaKey) return; // pinch-zoom
      if (openCase) return;
      e.preventDefault();

      const dy = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (dy === 0) return;

      if (snapLock.current) return;

      // Reset accumulation if direction reversed
      if (lastWheelDir.current !== 0 && Math.sign(dy) !== lastWheelDir.current) {
        wheelAccum.current = 0;
      }
      lastWheelDir.current = Math.sign(dy);
      wheelAccum.current += dy;

      // Reset accumulation after gesture idle (250ms with no wheel)
      clearTimeout(wheelIdleTimer.current);
      wheelIdleTimer.current = setTimeout(() => {
        wheelAccum.current = 0;
        lastWheelDir.current = 0;
      }, 250);
      if (Math.abs(wheelAccum.current) < THRESHOLD) return;

      const dir = wheelAccum.current > 0 ? 1 : -1;
      const cur = SECTIONS.findIndex(s => s.id === activeSectionRef.current);
      const next = Math.max(0, Math.min(SECTIONS.length - 1, cur + dir));
      wheelAccum.current = 0;
      if (next === cur) return;

      snapLock.current = true;
      const s = SECTIONS[next];
      engine.panTo(s.center.x, s.center.y, computeFitZoom());
      setTimeout(() => { snapLock.current = false; }, COOLDOWN);
    };
    el.addEventListener('wheel', onWheelSnap, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheelSnap);
      clearTimeout(wheelIdleTimer.current);
    };
  }, [openCase, computeFitZoom]); // eslint-disable-line

  // Touch swipe snap
  useEffect(() => {
    const el = engine.stageRef.current;
    if (!el) return;
    let sy = 0, st = 0, active = false;
    const onStart = (e) => {
      if (e.touches.length !== 1) { active = false; return; }
      if (openCase) return;
      sy = e.touches[0].clientY; st = performance.now(); active = true;
    };
    const onEnd = (e) => {
      if (!active) return;
      active = false;
      const ey = (e.changedTouches[0] || {}).clientY ?? sy;
      const dy = sy - ey;
      const dt = performance.now() - st;
      if (Math.abs(dy) < 40 || dt > 800) return;
      const cur = SECTIONS.findIndex(s => s.id === activeSectionRef.current);
      const nxt = Math.max(0, Math.min(SECTIONS.length - 1, cur + (dy > 0 ? 1 : -1)));
      if (nxt === cur) return;
      const s = SECTIONS[nxt];
      engine.panTo(s.center.x, s.center.y, computeFitZoom());
    };
    el.addEventListener('touchstart', onStart, { passive: true });
    el.addEventListener('touchend', onEnd);
    return () => {
      el.removeEventListener('touchstart', onStart);
      el.removeEventListener('touchend', onEnd);
    };
  }, [openCase, computeFitZoom]); // eslint-disable-line

  // theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', tweaks.theme || 'cool');
  }, [tweaks.theme]);

  // active section tracker based on canvas center
  useEffect(() => {
    const el = engine.stageRef.current;
    if (!el) return;
    const cx = (el.clientWidth / 2 - engine.t.x) / engine.t.z;
    const cy = (el.clientHeight / 2 - engine.t.y) / engine.t.z;
    let best = SECTIONS[0], bestD = Infinity;
    for (const s of SECTIONS) {
      const d = Math.hypot(s.center.x - cx, s.center.y - cy);
      if (d < bestD) { bestD = d; best = s; }
    }
    setActiveSection(best.id);
  }, [engine.t]);

  // Keep onboarding available until the visitor interacts or dismisses it.
  useEffect(() => {
    const hide = () => setShowHint(false);
    window.addEventListener('mousedown', hide, { once: true });
    window.addEventListener('wheel', hide, { once: true });
    window.addEventListener('touchstart', hide, { once: true });
    return () => {
      window.removeEventListener('mousedown', hide);
      window.removeEventListener('wheel', hide);
      window.removeEventListener('touchstart', hide);
    };
  }, []);

  // keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
      if (openCase) return;
      const idx = ['1','2','3','4','5'].indexOf(e.key);
      if (idx >= 0) {
        const s = SECTIONS[idx];
        if (s) engine.panTo(s.center.x, s.center.y, computeFitZoom());
      } else if (e.key === '0') {
        engine.panTo(SECTIONS[0].center.x, SECTIONS[0].center.y, computeFitZoom());
      } else if (e.key === '=' || e.key === '+') {
        engine.zoomTo(engine.t.z * 1.2);
      } else if (e.key === '-' || e.key === '_') {
        engine.zoomTo(engine.t.z * 0.8);
      } else if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        const cur = SECTIONS.findIndex(s => s.id === activeSectionRef.current);
        const n = Math.min(SECTIONS.length - 1, cur + 1);
        const s = SECTIONS[n];
        engine.panTo(s.center.x, s.center.y, computeFitZoom());
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        const cur = SECTIONS.findIndex(s => s.id === activeSectionRef.current);
        const n = Math.max(0, cur - 1);
        const s = SECTIONS[n];
        engine.panTo(s.center.x, s.center.y, computeFitZoom());
      } else if (e.key === 'Escape') {
        setOpenCase(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [engine.t.z, computeFitZoom, openCase]); // eslint-disable-line

  const openProject = (id) => {
    const p = PROJECTS.find(p => p.id === id);
    if (p) setOpenCase(p);
  };

  const closeProject = useCallback(() => setOpenCase(null), []);

  const nextProject = () => {
    if (!openCase) return;
    const idx = PROJECTS.findIndex(p => p.id === openCase.id);
    setOpenCase(PROJECTS[(idx + 1) % PROJECTS.length]);
    // scroll handled inside CaseStudy component
  };

  const jumpTo = (sid) => {
    if (window.matchMedia('(max-width: 1024px)').matches) {
      document.getElementById(`mobile-${sid}`)?.scrollIntoView({
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        block: 'start',
      });
      setActiveSection(sid);
      return;
    }
    const s = SECTIONS.find(s => s.id === sid);
    if (s) engine.panTo(s.center.x, s.center.y, computeFitZoom());
  };

  const renderIsland = (it) => {
    const common = { key: it.id, className: 'island', style: { left: it.x, top: it.y } };
    const wrap = (node) => <div {...common}>{node}</div>;
    switch (it.kind) {
      case 'hero':     return wrap(<Hero/>);
      case 'section':  return wrap(<SectionHead num={it.num} h1={it.h1} em={it.em}/>);
      case 'about':    return wrap(<About/>);
      case 'sticky':   return wrap(<Sticky/>);
      case 'stats':    return wrap(<Stats/>);
      case 'photo':    return wrap(<Photo/>);
      case 'tools':    return wrap(<Tools/>);
      case 'project':  return <div {...common} data-interactive><ProjectCard project={it.project} onOpen={openProject} compact={it.compact} /></div>;
      case 'timeline': return wrap(<Timeline/>);
      case 'contact':  return <div {...common} data-interactive><Contact/></div>;
      case 'marquee':  return wrap(<Marquee text={it.text}/>);
      default: return null;
    }
  };

  const canvasStyle = {
    transform: `translate(${engine.t.x}px, ${engine.t.y}px) scale(${engine.t.z})`,
  };

  return (
    <>
      <a
        className="skip-link"
        href="#main-content"
        aria-hidden={openCase ? 'true' : undefined}
        tabIndex={openCase ? -1 : undefined}
      >
        Skip to portfolio content
      </a>
      <div className="site-shell" aria-hidden={openCase ? 'true' : undefined}>
      {/* Parallax grid - independent from canvas transform but influenced */}
      {tweaks.parallax && (
        <div
          className={`grid-layer grid-${tweaks.grid || 'dots'}`}
          aria-hidden="true"
          style={{
            backgroundSize: `${28 * engine.t.z}px ${28 * engine.t.z}px`,
            backgroundPosition: `${engine.t.x * 0.5}px ${engine.t.y * 0.5}px`,
          }}
        />
      )}

      {/* Ambient dust */}
      <div className="dust" aria-hidden="true">
        {Array.from({length: 12}).map((_, i) => (
          <span key={i} style={{
            left: `${(i * 37) % 100}%`,
            top: `${(i * 53) % 100}%`,
            animationDuration: `${8 + (i % 5)}s`,
            animationDelay: `${-i * 0.7}s`,
          }}/>
        ))}
      </div>

      <main id="main-content" tabIndex="-1">
        <div
          className={`stage ${engine.isPanning ? 'is-panning' : ''}`}
          ref={engine.stageRef}
          aria-label="Interactive portfolio canvas. Use the section navigation, arrow keys, or numbered shortcuts to move."
          aria-describedby="canvas-help"
        >
          <div className="canvas" style={canvasStyle}>
            <Connectors/>
            {ISLANDS.map(renderIsland)}
          </div>
        </div>

        <div className="mobile-flow">
          <section id="mobile-hero" data-section="hero" aria-label="Introduction"><Hero/></section>
          <section id="mobile-about" data-section="about" aria-label="About">
            <SectionHead num="About" h1="About my" em="work"/>
            <About/><Photo/><Tools/>
          </section>
          <section id="mobile-work" data-section="work" aria-label="Selected work">
            <SectionHead num="Work" h1="Selected" em="work"/>
            <div className="mobile-projects">{PROJECTS.map(project => <ProjectCard key={project.id} project={project} onOpen={openProject} compact/>)}</div>
          </section>
          <section id="mobile-exp" data-section="exp" aria-label="Experience">
            <SectionHead num="Experience" h1="Where I have" em="worked"/>
            <Timeline/>
          </section>
          <section id="mobile-contact" data-section="contact" aria-label="Contact">
            <SectionHead num="Contact" h1="Get in" em="touch"/>
            <Contact/>
          </section>
        </div>
      </main>

      <header className="topbar">
        <div className="brand">
          <span className="bdot" aria-hidden="true"/> Chintan Jat · designing in the void
        </div>
        <nav className="section-jumps" aria-label="Portfolio sections">
          {SECTIONS.map((s, i) => (
            <button
              type="button"
              key={s.id}
              className={activeSection === s.id ? 'active' : ''}
              aria-current={activeSection === s.id ? 'page' : undefined}
              onClick={() => jumpTo(s.id)}
            >
              <span style={{opacity:0.5,marginRight:6}}>{i+1}</span>{s.label}
            </button>
          ))}
        </nav>
        <a
          className="resume-btn"
          href="uploads/Chintanjat_cv-3a0f1e72.pdf"
          download="Chintan-Jat-Resume.pdf"
          title="Download resume (PDF)"
        >
          <span className="rdown">↓</span>
          <span><span className="rlabel-full">Download </span>Resume</span>
        </a>
      </header>

      <div className="zoom-ctrl" data-interactive aria-label="Canvas zoom controls">
        <button type="button" onClick={() => engine.zoomTo(engine.t.z * 1.25)} aria-label="Zoom in">+</button>
        <div className="lvl" aria-live="polite" aria-atomic="true">{Math.round(engine.t.z * 100)}%</div>
        <button type="button" onClick={() => engine.zoomTo(engine.t.z * 0.8)} aria-label="Zoom out">−</button>
        <button type="button" onClick={() => engine.panTo(SECTIONS[0].center.x, SECTIONS[0].center.y, computeFitZoom())} aria-label="Reset canvas view">⌂</button>
      </div>

      <Minimap t={engine.t} stageRef={engine.stageRef} islands={ISLANDS}/>

      <div className={`hint ${!showHint ? 'hidden' : ''}`} id="canvas-help">
        <span className="hk">scroll</span><span>to move between sections</span>
        <span className="hk">⌘/ctrl+scroll</span><span>to zoom the canvas</span>
        <span className="hk">1–5</span><span>to teleport</span>
        <button type="button" className="hint-close" onClick={() => setShowHint(false)} aria-label="Dismiss canvas instructions">×</button>
      </div>

      <div className="sr-only" role="status" aria-live="polite">Current section: {SECTIONS.find(section => section.id === activeSection)?.label}</div>
      </div>

      {openCase && (openCase.id === 'tech'
        ? <TechCaseStudy project={openCase} onClose={closeProject} onNext={nextProject}/>
        : openCase.extended
          ? <ExtendedCaseStudy project={openCase} onClose={closeProject} onNext={nextProject}/>
          : <CaseStudy project={openCase} onClose={closeProject} onNext={nextProject}/>)}
    </>
  );
};

/* Minimap */
const Minimap = ({ t, stageRef, islands }) => {
  const W = 220, H = 140;
  // canvas world bounds (approx)
  const bounds = { x: -500, y: 0, w: 3200, h: 8400 };
  const scale = Math.min((W - 20) / bounds.w, (H - 20) / bounds.h);
  const ox = (W - bounds.w * scale) / 2 - bounds.x * scale;
  const oy = (H - bounds.h * scale) / 2 - bounds.y * scale;

  const view = (() => {
    const el = stageRef.current;
    if (!el) return null;
    const vw = el.clientWidth, vh = el.clientHeight;
    const wx = -t.x / t.z;
    const wy = -t.y / t.z;
    const ww = vw / t.z;
    const wh = vh / t.z;
    return {
      left: wx * scale + ox,
      top: wy * scale + oy,
      width: ww * scale,
      height: wh * scale,
    };
  })();

  return (
    <div className="minimap" data-interactive aria-hidden="true">
      <div className="mm-label">You are here</div>
      <div className="mm-canvas">
        {islands.map(it => {
          const sizes = {
            hero: [820, 360], section: [440, 150], about: [520, 260],
            sticky: [260, 140], stats: [420, 160], photo: [280, 340],
            tools: [400, 160], project: [310, 445], timeline: [560, 380],
            contact: [620, 380], marquee: [1200, 220],
          };
          const [w, h] = sizes[it.kind] || [200, 100];
          const accent = ['hero','project','contact'].includes(it.kind);
          return (
            <div key={it.id} className={`mm-dot ${accent ? 'accent' : ''}`} style={{
              left: it.x * scale + ox,
              top: it.y * scale + oy,
              width: Math.max(2, w * scale),
              height: Math.max(2, h * scale),
              opacity: it.kind === 'marquee' ? 0.2 : 0.6,
            }}/>
          );
        })}
        {view && <div className="mm-view" style={view}/>}
      </div>
    </div>
  );
};

/* Connectors — dashed lines between work cards */
const Connectors = () => (
  <svg className="connectors" width="3500" height="3500" viewBox="0 0 3500 3500" aria-hidden="true">
    {/* hero → about */}
    <path d="M 610 520 Q 480 1000 360 1560" />
    {/* about → work */}
    <path d="M 760 2580 Q 1200 2900 1760 3260" />
    {/* work strip → exp */}
    <path d="M 2400 3960 Q 1600 4800 760 5660" />
    {/* exp → contact */}
    <path d="M 820 6500 Q 1280 6820 1720 7060" />
  </svg>
);

/* ---------- Password gate ---------- */
const Gate = ({ onUnlock }) => {
  const [val, setVal] = React.useState('');
  const [err, setErr] = React.useState('');
  const submit = (e) => {
    e.preventDefault();
    if (val === 'designinginthevoid') {
      onUnlock();
    } else {
      setErr('Incorrect password. Try again.');
    }
  };
  return (
    <div className="gate">
      <div className="gate-card">
        <div className="gate-eyebrow"><span className="bdot"/> Chintan Jat · Portfolio</div>
        <h1>Enter the <em>canvas</em></h1>
        <p>This portfolio is private. Enter the password to continue.</p>
        <form onSubmit={submit}>
          <label htmlFor="portfolio-password">Password</label>
          <input id="portfolio-password" type="password" value={val} autoFocus autoComplete="current-password" placeholder="Enter password"
            onChange={(e) => { setVal(e.target.value); setErr(''); }} />
          <div className="err" role="alert" aria-live="assertive">{err}</div>
          <button type="submit">Unlock</button>
        </form>
      </div>
    </div>
  );
};

const GATE_ENABLED = true;

const Root = () => {
  const [unlocked, setUnlocked] = React.useState(!GATE_ENABLED);
  return unlocked ? <App/> : <Gate onUnlock={() => setUnlocked(true)}/>;
};

ReactDOM.createRoot(document.getElementById('root')).render(<Root/>);
