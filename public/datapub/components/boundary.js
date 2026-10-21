// <boundary-diagram state="2013|2016|2020|2023|2026">
// One SVG (viewBox 1680×560) that animates between the five boundary states
// of Ian Macomber's "The Shape and Feel of the Post-AI Data Stack" (2026).
// Accent (--accent) = inside the boundary. Works standalone (Act 4, slide 19).
// Size it with CSS (width/height); it scales. Change `state` to animate.
(() => {
  const STATES = ['2013', '2016', '2020', '2023', '2026'];
  const OY = 44;                 // vertical offset inside the viewBox
  const R = (i) => i * 84;       // source rows
  const H = 60;                  // box height

  const css = `
  boundary-diagram { display: block; width: 1680px; }
  boundary-diagram svg { display: block; width: 100%; height: auto; overflow: visible; }
  .bd-rect { fill: rgba(245,197,66,0.045); stroke: var(--accent); stroke-width: 3; stroke-dasharray: 14 10; rx: 22px; ry: 22px;
             transition: x .9s var(--ease), y .9s var(--ease), width .9s var(--ease), height .9s var(--ease); }
  .bd-tag { font-family: var(--mono); font-size: 22px; letter-spacing: .24em; fill: var(--accent); text-transform: uppercase; }
  .bd-node { transition: transform .9s var(--ease), opacity .6s var(--ease); }
  .bd-node rect { fill: #000; stroke: var(--fg); stroke-width: 2; rx: 12px; ry: 12px;
                  transition: width .9s var(--ease), height .9s var(--ease), stroke .6s; }
  .bd-node .l { transition: transform .9s var(--ease); }
  .bd-node text { font-family: var(--mono); font-size: 22px; letter-spacing: .08em; fill: var(--fg); text-anchor: middle; transition: fill .6s; }
  .bd-node.out rect { stroke: var(--faint); stroke-dasharray: 7 7; }
  .bd-node.out text { fill: var(--faint); }
  .bd-node.hot rect { stroke: var(--accent); stroke-width: 3; }
  .bd-node.hot text { fill: var(--accent); }
  .bd-edge { opacity: 0; transition: opacity .7s var(--ease); }
  .bd-edge.on { opacity: 1; }
  .bd-edge path { fill: none; stroke: var(--dim); stroke-width: 2; }
  .bd-edge.acc path { stroke: var(--accent); stroke-width: 2.5; }
  .bd-edge.flow path { stroke-dasharray: 10 8; animation: bd-flow 1.4s linear infinite; }
  .bd-edge text { font-family: var(--mono); font-size: 20px; letter-spacing: .12em; fill: var(--dim); }
  .bd-edge.acc text { fill: var(--accent); }
  .bd-edge.big text { font-size: 22px; fill: var(--fg); letter-spacing: .1em; }
  @keyframes bd-flow { to { stroke-dashoffset: -18; } }
  `;

  const def = (map) => {
    const o = {};
    for (const k in map) for (const s of k.split('|')) o[s] = map[k];
    return o;
  };
  // [x, y, w, h, inside(1|0), hot(1|0)]
  const NODES = [
    { id: 'orders', t: ['ORDERS · OLTP'], p: def({ '2013|2016|2020|2023|2026': [20, R(0), 280, H, 1] }) },
    { id: 'payments', t: ['PAYMENTS · OLTP'], p: def({ '2013|2016|2020|2023|2026': [20, R(1), 280, H, 1] }) },
    { id: 'click', t: ['CLICKSTREAM'], p: def({ '2013': [20, R(2), 280, H, 0], '2016|2020|2023|2026': [20, R(2), 280, H, 1] }) },
    { id: 'saas', t: ['SAAS DE TERCEROS'], p: def({ '2013|2016': [20, R(3), 280, H, 0], '2020|2023|2026': [20, R(3), 280, H, 1] }) },
    { id: 'unstr', t: ['NO ESTRUCTURADO'], p: def({ '2013|2016|2020|2023': [20, R(4), 280, H, 0], '2026': [20, R(4), 280, H, 1] }) },
    { id: 'etl', t: ['ETL', 'GESTIONADO'], p: def({ '2020|2023': [380, R(0), 170, R(3) + H, 1] }) },
    { id: 'wh', t: ['WAREHOUSE'], p: def({
      '2016': [640, R(0), 240, R(2) + H, 1],
      '2020|2023': [640, R(0), 240, R(3) + H, 1],
      '2026': [380, R(0), 220, R(4) + H, 1] }) },
    { id: 'bi', t: ['BI Y NOTEBOOKS'], p: def({ '2016|2020|2023': [1060, R(0), 290, H, 1] }) },
    { id: 'ops', t: ['APPS OPERATIVAS'], p: def({ '2020|2023': [1060, R(3), 290, H, 1] }) },
    { id: 'harness', t: ['AGENT', 'HARNESS'], hot: 1, p: def({ '2026': [680, R(0), 280, R(4) + H, 1, 1] }) },
    { id: 'ctx', t: ['CONTEXTO', 'DE LA EMPRESA'], hot: 1, p: def({ '2026': [680, 424, 280, 66, 1, 1] }) },
    { id: 'if1', t: ['EQUIPO'], p: def({ '2026': [1060, R(0), 300, H, 1] }) },
    { id: 'if2', t: ['CODING AGENTS'], p: def({ '2026': [1060, R(1), 300, H, 1] }) },
    { id: 'if3', t: ['BOTS DE CHAT'], p: def({ '2026': [1060, R(2), 300, H, 1] }) },
    { id: 'if4', t: ['BI NATIVO IA'], p: def({ '2026': [1060, R(3), 300, H, 1] }) },
  ];

  // [x, y, w, h] of the dashed boundary per state
  const RECT = {
    '2013': [6, -14, 326, R(1) + H + 28],
    '2016': [6, -14, 1360, R(2) + H + 28],
    '2020': [6, -14, 1360, R(3) + H + 28],
    '2023': [6, -14, 1360, R(3) + H + 28],
    '2026': [6, -14, 1404, 518],
  };

  const mid = (i) => R(i) + H / 2;
  const line = (x1, y1, x2, y2) => `M${x1},${y1} L${x2},${y2}`;
  const srcs = (n, x2) => Array.from({ length: n }, (_, i) => line(300, mid(i), x2, mid(i))).join(' ');

  // edges: { s: states where visible, d: path, acc, flow, text:[x,y,str] }
  const EDGES = [
    { s: ['2013'], d: line(160, R(0) + H + 4, 160, R(1) - 4), x: true, text: [350, 80, '✕ NO SE PUEDEN UNIR'], big: 1 },
    { s: ['2013'], d: '', text: [350, mid(2) + 7, 'FUERA DEL BOUNDARY'] },
    { s: ['2016'], d: srcs(3, 636) },
    { s: ['2016'], d: line(880, mid(0), 1056, mid(0)) },
    { s: ['2020', '2023'], d: srcs(4, 376) },
    { s: ['2020', '2023'], d: line(550, mid(1) + 40, 636, mid(1) + 40) },
    { s: ['2020', '2023'], d: line(880, mid(0), 1056, mid(0)) },
    { s: ['2020', '2023'], d: line(880, mid(3), 1056, mid(3)), acc: 1, text: [886, mid(3) - 18, 'REVERSE ETL'] },
    { s: ['2023'], d: '', text: [640, 396, 'JULIO 2023 · «ESTO ES MARKETING»'], big: 1 },
    { s: ['2026'], d: srcs(5, 376) },
    { s: ['2026'], d: line(600, mid(2), 676, mid(2)) },
    { s: ['2026'], d: [0, 1, 2, 3].map((i) => line(960, mid(i), 1056, mid(i))).join(' ') },
    { s: ['2026'], d: line(820, 424, 820, R(4) + H + 4), acc: 1 },
    { s: ['2026'], d: `M1210,${R(3) + H + 4} C1210,420 1100,457 964,457`, acc: 1, flow: 1, text: [1150, 440, 'EVALS'] },
  ];

  let injected = false;
  const NS = 'http://www.w3.org/2000/svg';

  class BoundaryDiagram extends HTMLElement {
    static get observedAttributes() { return ['state']; }
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
    get state() { return STATES.includes(this.getAttribute('state')) ? this.getAttribute('state') : '2026'; }
    set state(v) { this.setAttribute('state', v); }

    _build() {
      this._built = true;
      const mk = (name, attrs = {}, parent) => {
        const e = document.createElementNS(NS, name);
        for (const k in attrs) e.setAttribute(k, attrs[k]);
        if (parent) parent.appendChild(e);
        return e;
      };
      const svg = mk('svg', { viewBox: '0 0 1680 560', role: 'img', 'aria-label': 'Boundary del data stack' });
      const defs = mk('defs', {}, svg);
      for (const [id, color] of [['bd-ah', '#d6d6d6'], ['bd-aha', '#f5c542']]) {
        const m = mk('marker', { id, viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 8, markerHeight: 8, orient: 'auto' }, defs);
        mk('path', { d: 'M0,0 L10,5 L0,10 z', fill: color, stroke: 'none' }, m);
      }
      const g = mk('g', { transform: `translate(14,${OY})` }, svg);
      this._rect = mk('rect', { class: 'bd-rect' }, g);
      this._tag = mk('text', { class: 'bd-tag', x: 6, y: -26 }, g);
      this._tag.textContent = 'Boundary';
      this._tagX = null;

      this._edges = EDGES.map((e) => {
        const gg = mk('g', { class: 'bd-edge' + (e.acc ? ' acc' : '') + (e.flow ? ' flow' : '') + (e.big ? ' big' : '') }, g);
        if (e.d) {
          for (const d of e.d.split(/(?=M)/)) {
            const p = mk('path', { d: d.trim() }, gg);
            if (!e.x) p.setAttribute('marker-end', e.acc ? 'url(#bd-aha)' : 'url(#bd-ah)');
          }
        }
        if (e.text) {
          const t = mk('text', { x: e.text[0], y: e.text[1] }, gg);
          t.textContent = e.text[2];
        }
        return { e, el: gg };
      });

      this._nodes = NODES.map((n) => {
        const gg = mk('g', { class: 'bd-node' }, g);
        const r = mk('rect', { x: 0, y: 0 }, gg);
        const l = mk('g', { class: 'l' }, gg);
        const t = mk('text', {}, l);
        n.t.forEach((line, i) => {
          const ts = mk('tspan', { x: 0, dy: i === 0 ? `${-(n.t.length - 1) * 0.6 + 0.35}em` : '1.2em' }, t);
          ts.textContent = line;
        });
        gg.style.opacity = 0;
        return { n, el: gg, r, l };
      });
      this.appendChild(svg);
      this._last = null;
    }

    _apply() {
      const s = this.state;
      const [rx, ry, rw, rh] = RECT[s];
      const st = this._rect.style;
      st.x = rx + 'px'; st.y = ry + 'px'; st.width = rw + 'px'; st.height = rh + 'px';
      const tagX = s === '2013' ? rx + rw + 20 : rx + 6;
      this._tag.setAttribute('x', tagX);
      this._tag.setAttribute('y', s === '2013' ? ry + 30 : ry - 12);
      for (const { n, el, r, l } of this._nodes) {
        const p = n.p[s];
        if (!p) { el.style.opacity = 0; continue; }
        const [x, y, w, h, inside, hot] = p;
        el.style.opacity = 1;
        el.style.transform = `translate(${x}px,${y}px)`;
        r.style.width = w + 'px'; r.style.height = h + 'px';
        l.style.transform = `translate(${w / 2}px,${h / 2}px)`;
        el.classList.toggle('out', !inside);
        el.classList.toggle('hot', !!hot);
      }
      for (const { e, el } of this._edges) el.classList.toggle('on', e.s.includes(s));
      this._last = s;
    }
  }

  if (!customElements.get('boundary-diagram')) customElements.define('boundary-diagram', BoundaryDiagram);
})();
