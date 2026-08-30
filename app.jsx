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
    const maxX = 2000, minX = -3400;
    const maxY = 800, minY = -3200;
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
    if (!animate) { setTransform({ x: nx, y: ny, z }); return; }
    const from = { ...tRef.current };
    const to = { x: nx, y: ny, z };
    const start = performance.now();
    const dur = 900;
    const ease = (u) => 1 - Math.pow(1 - u, 4);
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
  const [tweaksOpen, setTweaksOpen] = useState(false);
  const [tweaks, setTweaks] = useState(TWEAK_DEFAULTS);

  // Responsive fit zoom based on viewport width
  const computeFitZoom = useCallback(() => {
    const el = engine.stageRef.current;
    if (!el) return 0.65;
    const w = el.clientWidth;
    if (w < 520) return 0.32;
    if (w < 760) return 0.42;
    if (w < 1100) return 0.55;
    if (w < 1500) return 0.65;
    return 0.72;
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

  // Snap-scroll: wheel/trackpad jumps to next/prev section
  const snapLock = useRef(false);
  const snapIdx = useRef(0);
  useEffect(() => {
    const el = engine.stageRef.current;
    if (!el) return;
    const onWheelSnap = (e) => {
      if (e.ctrlKey || e.metaKey) return; // let pinch-zoom through
      if (openCase) return; // let case study scroll normally
      e.preventDefault();
      if (snapLock.current) return;
      const dir = (Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX);
      if (Math.abs(dir) < 8) return;
      const cur = SECTIONS.findIndex(s => s.id === activeSectionRef.current);
      const next = Math.max(0, Math.min(SECTIONS.length - 1, cur + (dir > 0 ? 1 : -1)));
      if (next === cur) return;
      snapLock.current = true;
      snapIdx.current = next;
      const s = SECTIONS[next];
      engine.panTo(s.center.x, s.center.y, computeFitZoom());
      setTimeout(() => { snapLock.current = false; }, 950);
    };
    el.addEventListener('wheel', onWheelSnap, { passive: false });
    return () => el.removeEventListener('wheel', onWheelSnap);
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

  // hide hint after first interaction
  useEffect(() => {
    const hide = () => setShowHint(false);
    const t = setTimeout(hide, 6000);
    window.addEventListener('mousedown', hide, { once: true });
    window.addEventListener('wheel', hide, { once: true });
    return () => clearTimeout(t);
  }, []);

  // keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
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
  }, [engine.t.z, computeFitZoom]); // eslint-disable-line

  // tweaks edit-mode protocol
  useEffect(() => {
    const onMsg = (e) => {
      if (e.data?.type === '__activate_edit_mode') setTweaksOpen(true);
      if (e.data?.type === '__deactivate_edit_mode') setTweaksOpen(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);

  const updateTweak = (k, v) => {
    setTweaks(prev => {
      const next = { ...prev, [k]: v };
      window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { [k]: v } }, '*');
      return next;
    });
  };

  const openProject = (id) => {
    const p = PROJECTS.find(p => p.id === id);
    if (p) setOpenCase(p);
  };

  const nextProject = () => {
    if (!openCase) return;
    const idx = PROJECTS.findIndex(p => p.id === openCase.id);
    setOpenCase(PROJECTS[(idx + 1) % PROJECTS.length]);
    document.querySelector('.cs-panel')?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const jumpTo = (sid) => {
    const s = SECTIONS.find(s => s.id === sid);
    if (s) engine.panTo(s.center.x, s.center.y, computeFitZoom());
  };

  const renderIsland = (it) => {
    const common = { key: it.id, className: 'island', style: { left: it.x, top: it.y } };
    const withCoord = (node) => (
      <div {...common}>
        <div className="coord">{it.kind.toUpperCase()} · [{it.x}, {it.y}]</div>
        {node}
      </div>
    );
    switch (it.kind) {
      case 'hero':     return withCoord(<Hero/>);
      case 'section':  return withCoord(<SectionHead num={it.num} h1={it.h1} em={it.em}/>);
      case 'about':    return withCoord(<About/>);
      case 'sticky':   return <div {...common}><Sticky/></div>;
      case 'stats':    return withCoord(<Stats/>);
      case 'photo':    return <div {...common}><Photo/></div>;
      case 'tools':    return withCoord(<Tools/>);
      case 'project':  return withCoord(<div data-interactive><ProjectCard project={it.project} onOpen={openProject} /></div>);
      case 'timeline': return withCoord(<Timeline/>);
      case 'contact':  return <div {...common} data-interactive><div className="coord">CONTACT · [{it.x}, {it.y}]</div><Contact/></div>;
      case 'marquee':  return <div {...common}><Marquee text={it.text}/></div>;
      default: return null;
    }
  };

  const canvasStyle = {
    transform: `translate(${engine.t.x}px, ${engine.t.y}px) scale(${engine.t.z})`,
  };

  return (
    <>
      {/* Parallax grid - independent from canvas transform but influenced */}
      {tweaks.parallax && (
        <div
          className={`grid-layer grid-${tweaks.grid || 'dots'}`}
          style={{
            backgroundSize: `${28 * engine.t.z}px ${28 * engine.t.z}px`,
            backgroundPosition: `${engine.t.x * 0.5}px ${engine.t.y * 0.5}px`,
          }}
        />
      )}

      {/* Ambient dust */}
      <div className="dust">
        {Array.from({length: 12}).map((_, i) => (
          <span key={i} style={{
            left: `${(i * 37) % 100}%`,
            top: `${(i * 53) % 100}%`,
            animationDuration: `${8 + (i % 5)}s`,
            animationDelay: `${-i * 0.7}s`,
          }}/>
        ))}
      </div>

      <div
        className={`stage ${engine.isPanning ? 'is-panning' : ''}`}
        ref={engine.stageRef}
      >
        <div className="canvas" style={canvasStyle}>
          <Connectors/>
          {ISLANDS.map(renderIsland)}
        </div>
      </div>

      <div className="topbar">
        <div className="brand">
          <span className="bdot"/> Chintan Jat — Infinite Canvas
        </div>
        <div className="section-jumps">
          {SECTIONS.map((s, i) => (
            <button
              key={s.id}
              className={activeSection === s.id ? 'active' : ''}
              onClick={() => jumpTo(s.id)}
            >
              <span style={{opacity:0.5,marginRight:6}}>{i+1}</span>{s.label}
            </button>
          ))}
        </div>
      </div>

      <button
        className="fab tweaks-fab"
        onClick={() => setTweaksOpen(o => !o)}
        data-interactive
        title="Tweaks"
        style={{display: 'none'}}
      >⚙</button>

      {tweaksOpen && (
        <div className="tweaks-panel" data-interactive>
          <header>
            Tweaks
            <span style={{cursor:'pointer', fontSize:14}} onClick={() => setTweaksOpen(false)}>×</span>
          </header>
          <div className="tw-body">
            <div className="tw-row">
              <div className="tw-lab">Palette</div>
              <div className="tw-swatches">
                {['cool','warm','mono'].map(th => (
                  <div key={th}
                    className={`tw-swatch ${tweaks.theme === th ? 'active' : ''}`}
                    style={{
                      background: th === 'cool' ? 'oklch(0.58 0.13 235)' :
                                  th === 'warm' ? 'oklch(0.62 0.14 50)' :
                                                  'oklch(0.35 0 0)'
                    }}
                    onClick={() => updateTweak('theme', th)}
                    title={th}
                  />
                ))}
              </div>
            </div>
            <div className="tw-row">
              <div className="tw-lab">Grid style</div>
              <div className="tw-options">
                {['dots','lines','none'].map(g => (
                  <div key={g}
                    className={`tw-opt ${(tweaks.grid || 'dots') === g ? 'active' : ''}`}
                    onClick={() => updateTweak('grid', g)}
                  >{g}</div>
                ))}
              </div>
            </div>
            <div className="tw-row">
              <div className="tw-lab">Parallax grid</div>
              <div className="tw-options">
                <div className={`tw-opt ${tweaks.parallax ? 'active' : ''}`} onClick={() => updateTweak('parallax', true)}>on</div>
                <div className={`tw-opt ${!tweaks.parallax ? 'active' : ''}`} onClick={() => updateTweak('parallax', false)}>off</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="zoom-ctrl" data-interactive>
        <button onClick={() => engine.zoomTo(engine.t.z * 1.25)}>+</button>
        <div className="lvl">{Math.round(engine.t.z * 100)}%</div>
        <button onClick={() => engine.zoomTo(engine.t.z * 0.8)}>−</button>
        <button onClick={() => engine.panTo(SECTIONS[0].center.x, SECTIONS[0].center.y, computeFitZoom())} title="Fit">◉</button>
      </div>

      <Minimap t={engine.t} stageRef={engine.stageRef} islands={ISLANDS} onJump={(x,y) => engine.panTo(x,y)}/>

      <div className={`hint ${!showHint ? 'hidden' : ''}`}>
        <span className="hk">scroll</span><span>to jump sections</span>
        <span className="hk">⌘/ctrl+scroll</span><span>to zoom</span>
        <span className="hk">1–5</span><span>to jump directly</span>
      </div>

      {openCase && <CaseStudy project={openCase} onClose={() => setOpenCase(null)} onNext={nextProject}/>}
    </>
  );
};

/* Minimap */
const Minimap = ({ t, stageRef, islands, onJump }) => {
  const W = 220, H = 140;
  // canvas world bounds (approx)
  const bounds = { x: -500, y: 0, w: 3200, h: 3200 };
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
    <div className="minimap" data-interactive onClick={(e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left - ox) / scale;
      const y = (e.clientY - rect.top - oy) / scale;
      onJump(x, y);
    }}>
      <div className="mm-label">Canvas Map</div>
      <div className="mm-canvas">
        {islands.map(it => {
          const sizes = {
            hero: [820, 360], section: [440, 150], about: [520, 260],
            sticky: [260, 140], stats: [420, 160], photo: [280, 340],
            tools: [400, 160], project: [460, 500], timeline: [560, 380],
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
  <svg className="connectors" width="3500" height="3500" viewBox="0 0 3500 3500">
    {/* hero to about */}
    <path d="M 610 480 Q 500 700 500 900" />
    {/* about cluster to work */}
    <path d="M 1420 1250 Q 1600 1200 1760 1150" />
    <path d="M 1890 1580 Q 2100 1700 2250 1780" />
    {/* work to contact */}
    <path d="M 1930 2300 Q 1800 2400 1600 2500" />
  </svg>
);

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
