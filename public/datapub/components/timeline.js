// <double-timeline at="0..5">
// Top track: Ian Macomber's eras. Bottom track: Carlos's jobs. `at` advances
// the build (animated): 0 eras only · 1 SAT + arrow 2013→2018 · 2 Bancomext
// branch · 3 Accenture + arrows 2016/2020→2021 · 4 Accenture Sr + Julio 2023
// marker · 5 Santander + vertical arrow 2026→2026. viewBox 1680×510.
(() => {
  const NS = 'http://www.w3.org/2000/svg';
  const X = (y) => 40 + (y - 2012) * 95;
  const TOP = 60, BOT = 320;

  const css = `
  double-timeline { display: block; width: 1680px; }
  double-timeline svg { display: block; width: 100%; height: auto; overflow: visible; }
  .tl-i { opacity: 0; transition: opacity .6s var(--ease); }
  .tl-i.on { opacity: 1; }
  .tl-draw { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 1.2s var(--ease) .1s; }
  .tl-i.on .tl-draw { stroke-dashoffset: 0; }
  .tl-head { opacity: 0; transition: opacity .3s 1.1s; }
  .tl-i.on .tl-head { opacity: 1; }
  .tl-arrow { fill: none; stroke: var(--dim); stroke-width: 2.5; transition: stroke .5s; }
  .tl-headp { fill: var(--dim); transition: fill .5s; }
  .tl-i.cur .tl-arrow { stroke: var(--accent); }
  .tl-i.cur .tl-headp { fill: var(--accent); }
  .tl-bar { fill: none; stroke: var(--fg); stroke-width: 6; stroke-linecap: round; transition: stroke .5s; }
  .tl-branch { fill: none; stroke: var(--dim); stroke-width: 4; stroke-dasharray: 2 9; stroke-linecap: round; transition: stroke .5s; }
  .tl-i.cur .tl-bar, .tl-i.cur .tl-branch { stroke: var(--accent); }
  .tl-name { font-family: var(--sans); font-size: 30px; fill: var(--fg); font-weight: 500; transition: fill .5s; }
  .tl-sub { font-family: var(--mono); font-size: 20px; letter-spacing: .06em; fill: var(--dim); }
  .tl-lag { font-family: var(--mono); font-size: 22px; letter-spacing: .1em; fill: var(--dim); paint-order: stroke; stroke: #000; stroke-width: 8px; transition: fill .5s; }
  .tl-i.cur .tl-lag { fill: var(--accent); }
  .tl-i.cur .tl-name { fill: var(--accent); }
  .tl-era { font-family: var(--mono); font-size: 22px; letter-spacing: .1em; fill: var(--dim); text-transform: uppercase; transition: fill .5s; }
  .tl-era b { fill: var(--fg); font-weight: 700; }
  .tl-era.hl, .tl-era.hl b { fill: var(--accent); }
  .tl-dot { fill: var(--fg); transition: fill .5s; }
  .tl-dot.hl { fill: var(--accent); }
  .tl-desc { font-family: var(--sans); font-size: 30px; fill: var(--dim); opacity: 0; transition: opacity .6s var(--ease); }
  .tl-desc.on { opacity: 1; }
  .tl-cap { font-family: var(--mono); font-size: 20px; letter-spacing: .28em; fill: var(--faint); }
  .tl-mark { stroke: var(--accent); stroke-width: 3; }
  .tl-marklbl { font-family: var(--mono); font-size: 22px; letter-spacing: .12em; fill: var(--accent); text-anchor: middle; text-transform: uppercase; paint-order: stroke; stroke: #000; stroke-width: 8px; }
  `;

  // eras: [year, name, step at which it is "reached", description lines]
  const ERAS = [
    [2013, 'Pre-modern', 1, ['preguntas que', 'caben en un', 'servidor']],
    [2016, 'Cloud warehouse', 3, ['preguntas de todo', 'el negocio']],
    [2020, 'Modern data stack', 3, ['de reportero', 'a operador']],
    [2026, 'Post-AI', 5, ['codificar el criterio', 'como infraestructura', 'para agentes']],
  ];
  // jobs: step, x0, x1, name, sub, row
  const JOBS = [
    [1, 2018, 2020, 'SAT', ['Data Scientist', '2018–2019'], 0],
    [3, 2021, 2023, 'Accenture', ['Data & ML Eng.', '2021–2023'], 0],
    [4, 2023, 2025, 'Sr.', ['Accenture', '2023–2025'], 0],
    [5, 2025, 2026.95, 'Santander', ['AI Engineer', '2025–'], 0],
  ];
  const ARROWS = [
    [1, 2013, 2018, '+5 AÑOS'],
    [3, 2016, 2021, '+5 AÑOS'],
    [3, 2020, 2021, '+1 AÑO'],
    [5, 2026, 2026, '+0'],
  ];

  let injected = false;

  class DoubleTimeline extends HTMLElement {
    static get observedAttributes() { return ['at']; }
    connectedCallback() {
      if (!injected) {
        injected = true;
        const st = document.createElement('style');
        st.textContent = css;
        document.head.appendChild(st);
      }
      if (!this._built) this._build();
      this._apply();
    }
    attributeChangedCallback() { if (this._built) this._apply(); }
    get at() { return Math.max(0, Math.min(5, +this.getAttribute('at') || 0)); }
    set at(v) { this.setAttribute('at', v); }

    _build() {
      this._built = true;
      const mk = (name, attrs = {}, parent, text) => {
        const e = document.createElementNS(NS, name);
        for (const k in attrs) e.setAttribute(k, attrs[k]);
        if (text != null) e.textContent = text;
        if (parent) parent.appendChild(e);
        return e;
      };
      const svg = mk('svg', { viewBox: '0 0 1680 540', role: 'img', 'aria-label': 'Eras del mundo y eras que me tocaron' });
      this._items = [];
      const item = (s, parent = svg) => {
        const g = mk('g', { class: 'tl-i' }, parent);
        this._items.push({ s, g });
        return g;
      };

      // tracks
      mk('line', { x1: 40, x2: 1640, y1: TOP, y2: TOP, class: 'ln-dim', style: 'stroke:var(--faint);stroke-width:2' }, svg);
      mk('line', { x1: 40, x2: 1640, y1: BOT, y2: BOT, style: 'stroke:var(--hair);stroke-width:2' }, svg);
      mk('text', { class: 'tl-cap', x: 40, y: BOT + 38 }, svg, 'LO QUE ME TOCÓ');

      // eras
      this._eras = ERAS.map(([yr, name, hl, desc]) => {
        const x = X(yr);
        const dot = mk('circle', { class: 'tl-dot', cx: x, cy: TOP, r: 9 }, svg);
        const t = mk('text', { class: 'tl-era', x: x - 9, y: 30 }, svg);
        mk('tspan', {}, t, yr + ' · ').setAttribute('style', 'font-weight:700');
        mk('tspan', {}, t, name);
        const d = mk('text', { class: 'tl-desc', x: x - 9, y: 134 }, svg);
        desc.forEach((ln, i) => mk('tspan', { x: x - 9, dy: i ? '1.3em' : 0 }, d, ln));
        return { hl, dot, t, d };
      });

      // arrows
      for (const [s, y0, y1, lag] of ARROWS) {
        const g = item(s);
        const x0 = X(y0), x1 = X(y1), ya = TOP + 20, yb = BOT - 24;
        const ang = Math.atan2(yb - ya, x1 - x0);
        mk('line', { class: 'tl-arrow tl-draw', pathLength: 1, x1: x0, y1: ya, x2: x1, y2: yb }, g);
        const tx = x1, ty = yb + 6, L = 22, Wd = 10;
        const bx = tx - L * Math.cos(ang), by = ty - L * Math.sin(ang), px = -Math.sin(ang), py = Math.cos(ang);
        const p = [[tx, ty], [bx + Wd * px, by + Wd * py], [bx - Wd * px, by - Wd * py]];
        mk('polygon', { class: 'tl-head tl-headp', points: p.map((q) => q.map((n) => n.toFixed(1)).join(',')).join(' ') }, g);
        const mx = (x0 + x1) / 2, my = (ya + yb) / 2;
        const side = y0 === y1 || y0 === 2020;
        mk('text', { class: 'tl-lag', x: side ? mx + 20 : mx - 34, y: side ? my + 8 : my + 50, 'text-anchor': side ? 'start' : 'middle' }, g, lag);
      }

      // Bancomext detour: a branch hanging off the bottom track (step 2)
      {
        const g = item(2);
        const a = X(2020), b = X(2021);
        mk('path', { class: 'tl-branch', d: `M${a},${BOT} C${a + 8},${BOT + 52} ${b - 8},${BOT + 52} ${b},${BOT}` }, g);
        mk('text', { class: 'tl-name', x: a, y: BOT + 172 }, g, 'Bancomext');
        mk('text', { class: 'tl-sub', x: a, y: BOT + 202 }, g, 'Software Engineer');
        mk('text', { class: 'tl-sub', x: a, y: BOT + 228 }, g, '2020');
      }

      // jobs
      for (const [s, y0, y1, name, sub, row] of JOBS) {
        const g = item(s);
        const x0 = X(y0), x1 = X(y1);
        mk('line', { class: 'tl-bar tl-draw', pathLength: 1, x1: x0 + 3, x2: x1 - 3, y1: BOT, y2: BOT }, g);
        const y = BOT + 66, tx = x0 + (name === 'Sr.' ? 20 : 0);
        mk('text', { class: 'tl-name', x: tx, y }, g, name);
        sub.forEach((ln, i) => mk('text', { class: 'tl-sub', x: tx, y: y + 30 + i * 26 }, g, ln));
      }

      // Julio 2023 marker (step 4)
      {
        const g = item(4);
        const x = X(2023.5);
        mk('line', { class: 'tl-mark', x1: x, x2: x, y1: BOT - 46, y2: BOT + 22 }, g);
        mk('circle', { cx: x, cy: BOT, r: 11, fill: '#000', stroke: 'var(--accent)', 'stroke-width': 3 }, g);
        mk('text', { class: 'tl-marklbl', x, y: BOT - 62 }, g, 'Julio 2023 · este escenario');
      }
      this.appendChild(svg);
    }

    _apply() {
      const at = this.at;
      for (const { s, g } of this._items) {
        g.classList.toggle('on', s <= at);
        g.classList.toggle('cur', s === at);
      }
      for (const e of this._eras) {
        const hl = e.hl === at;
        e.dot.classList.toggle('hl', hl);
        e.t.classList.toggle('hl', hl);
        e.d.classList.toggle('on', at === 0);
      }
    }
  }

  if (!customElements.get('double-timeline')) customElements.define('double-timeline', DoubleTimeline);
})();
