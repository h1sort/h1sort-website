// Act 3 · Las eras del mundo vs. las eras que me tocaron (slides 10–18).
// Era framing and boundary diagrams: Ian Macomber, "The Shape and Feel of the
// Post-AI Data Stack" (Aug 30, 2026). Components: components/timeline.js,
// components/boundary.js. See CONTRACT.md.
(() => {
  // ---- helpers -------------------------------------------------------------

  // Panels fade in/out by step: <div class="a3-p" data-on="0 5">.
  // Components follow a step map: data-map='{"0":3,"5":4}' (+ data-pre = value to animate from).
  function sync(el, step, ctx) {
    const first = el._fresh;
    el._fresh = false;
    el.querySelectorAll('[data-on]').forEach((n) =>
      n.classList.toggle('on', n.dataset.on.split(' ').includes(String(step))));
    el.querySelectorAll('[data-map]').forEach((n) => {
      const map = JSON.parse(n.dataset.map);
      let v = null;
      for (const k of Object.keys(map).map(Number).sort((a, b) => a - b)) if (k <= step) v = map[k];
      if (v === null) return;
      const attr = n.tagName === 'DOUBLE-TIMELINE' ? 'at' : 'state';
      clearTimeout(n._t);
      if (first && !ctx.shot && n.dataset.pre != null) {
        n.setAttribute(attr, n.dataset.pre);
        n._t = setTimeout(() => n.setAttribute(attr, v), 700);
      } else n.setAttribute(attr, v);
    });
  }
  const hooks = {
    onEnter(el) { el._fresh = true; },
    onStep(el, step, ctx) { sync(el, step, ctx); },
  };

  const head = (label, title) =>
    `<div class="a3-head"><div class="t-label">${label}</div><h2 class="a3-title">${title}</h2></div>`;
  const P = (on, inner, cls = '') => `<div class="a3-p ${cls}" data-on="${[].concat(on).join(' ')}">${inner}</div>`;
  const TL = (map, pre) => `<double-timeline data-map='${JSON.stringify(map)}' ${pre != null ? `data-pre="${pre}"` : ''} at="${Object.values(map)[0]}"></double-timeline>`;
  const BD = (map) => `<boundary-diagram data-map='${JSON.stringify(map)}' state="${Object.values(map)[0]}"></boundary-diagram>`;
  const stage = (inner) => `<div class="a3-stage">${inner}</div>`;
  const lines = (inner) => `<div class="a3-line">${inner}</div>`;

  // two tracks matching the double timeline (stage y 322 / 582, x 160..1760)
  Particles.define('a3-tracks', (u, t) => {
    const top = u.i % 2 === 0, span = 1600;
    return [160 + ((u.r(1) * span + t * (top ? 18 : 10)) % span), (top ? 322 : 582) + u.g(2) * 3];
  });

  // ---- tiny transformer (slide 18): 41 + 26 = 67 ---------------------------
  function transformer() {
    let seed = 7;
    const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    const f = (n) => n.toFixed(1);
    const g = (k, inner) => `<g class="a3-tf" style="--k:${k}">${inner}</g>`;

    // embedded input: three columns of 128-d bars (drawn as 30 rows)
    const cols = [90, 170, 250];
    let bars = '';
    cols.forEach((cx) => {
      for (let r = 0; r < 30; r++) {
        const y = 100 + r * 14.2, w = 6 + rnd() * rnd() * 58, off = (rnd() - 0.5) * 20;
        bars += `<line x1="${f(cx - w / 2 + off)}" x2="${f(cx + w / 2 + off)}" y1="${f(y)}" y2="${f(y)}" class="a3-bar"/>`;
      }
    });
    const tokens = ['41', '26', '='];
    const tok = cols.map((cx, i) => `<text x="${cx}" y="62" class="a3-tok">${tokens[i]}</text>`).join('');
    const hubY = [150, 295, 440], hubX = 390;
    const shape = (i, x, y, r = 10) => i === 0
      ? `<circle cx="${x}" cy="${y}" r="${r}" class="a3-sh"/>`
      : i === 1 ? `<rect x="${x - r}" y="${y - r}" width="${2 * r}" height="${2 * r}" class="a3-sh"/>`
      : `<path d="M${x},${y - r - 3} L${x + r + 3},${y} L${x},${y + r + 3} L${x - r - 3},${y} Z" class="a3-sh"/>`;
    let hubs = '';
    cols.forEach((cx, i) => {
      hubs += `<path d="M${cx + 44},${295} C${cx + 120},295 ${hubX - 60},${hubY[i]} ${hubX - 14},${hubY[i]}" class="a3-hair"/>` + shape(i, hubX, hubY[i]);
    });

    // attention: 4 heads, 12 lines; the "=" token attends to 41 and 26
    const headY = [0, 1, 2, 3].map((i) => 100 + i * 115);
    const hx = 700, hw = 74, hh = 92;
    let heads = '', att = '';
    headY.forEach((y, i) => {
      heads += `<rect x="${hx}" y="${y}" width="${hw}" height="${hh}" rx="16" class="a3-head-box"/>`;
      for (let k = 0; k < 3; k++) heads += shape(k, hx + hw / 2, y + 20 + k * 25, 8);
    });
    const strong = new Set(['2-0', '2-1', '2-2', '1-3', '0-3', '2-3', '1-1']);
    hubY.forEach((hy, i) => headY.forEach((y, j) => {
      const s = strong.has(`${i}-${j}`);
      att += `<line x1="${hubX + 14}" y1="${hy}" x2="${hx}" y2="${y + hh / 2}" class="${s ? 'a3-att' : 'a3-hair'}"/>`;
    }));

    // MLP: 12 units, dense web from the heads
    const mx = 1010, mY = Array.from({ length: 12 }, (_, i) => 110 + i * 39);
    let web = '', units = '';
    headY.forEach((y) => mY.forEach((my) => {
      web += `<line x1="${hx + hw}" y1="${f(y + hh / 2 + (rnd() - 0.5) * 60)}" x2="${mx - 14}" y2="${my}" class="a3-web"/>`;
    }));
    const lit = new Set([2, 5, 6, 9]);
    mY.forEach((my, i) => { units += `<circle cx="${mx}" cy="${my}" r="14" class="a3-unit${lit.has(i) ? ' lit' : ''}"/>`; });

    // readout: 0..99, the 67 mark
    const rx = 1290, y0 = 100, y1 = 540, y67 = y0 + (67 / 99) * (y1 - y0);
    let ro = '';
    mY.forEach((my, i) => {
      for (let k = 0; k < 3; k++) {
        const ty = y0 + rnd() * (y1 - y0);
        ro += `<line x1="${mx + 14}" y1="${my}" x2="${rx}" y2="${f(ty)}" class="a3-web"/>`;
      }
      if (lit.has(i)) ro += `<line x1="${mx + 14}" y1="${my}" x2="${rx}" y2="${f(y67)}" class="a3-att acc"/>`;
    });
    const axis = `<line x1="${rx}" x2="${rx}" y1="${y0}" y2="${y1}" class="a3-axis"/>
      <text x="${rx + 16}" y="${y0 + 6}" class="a3-tick">0</text><text x="${rx + 16}" y="${y1 + 6}" class="a3-tick">99</text>
      <circle cx="${rx}" cy="${f(y67)}" r="11" class="a3-hit"/>`;

    const result = `<line x1="${rx + 12}" y1="${f(y67)}" x2="1440" y2="330" class="a3-att acc"/>
      <rect x="1440" y="250" width="200" height="160" rx="22" class="a3-result"/>
      <text x="1540" y="358" class="a3-67">67</text>
      <text x="1540" y="214" class="a3-eq">41 + 26 =</text>`;

    const lbl = (x, t, k) => `<text x="${x}" y="596" class="a3-cl" style="--k:${k}">${t}</text>`;
    return `<svg viewBox="0 0 1680 620" class="a3-tfsvg" role="img" aria-label="Un transformer diminuto calcula 41 + 26 = 67">
      ${g(0, tok + bars)}
      ${g(1, hubs + att + heads)}
      ${g(2, web + units)}
      ${g(3, ro + axis)}
      ${g(4, result)}
      ${lbl(170, 'Embedded input', 0)}${lbl(740, 'Attention · 4 heads', 1)}${lbl(1010, 'MLP', 2)}${lbl(1290, 'Readout', 3)}${lbl(1540, 'Result', 4)}
    </svg>`;
  }

  Deck.css(`
  .a3-head { position: absolute; left: 120px; top: 78px; right: 120px; }
  .a3-title { font-size: 76px; font-weight: 500; line-height: 1.05; letter-spacing: -0.02em; margin: 14px 0 0; }
  .a3-stage { position: absolute; left: 120px; top: 262px; width: 1680px; height: 570px; }
  .a3-line { position: absolute; left: 120px; top: 846px; width: 1680px; height: 90px; font-size: 38px; line-height: 1.25; }
  .a3-p { position: absolute; inset: 0; opacity: 0; visibility: hidden; transition: opacity .5s var(--ease), visibility 0s .5s; }
  .a3-p.on { opacity: 1; visibility: visible; transition: opacity .6s var(--ease) .15s, visibility 0s; }
  .a3-line .a3-p { display: flex; align-items: flex-start; }
  .a3-big { font-size: 80px; font-weight: 500; line-height: 1.1; letter-spacing: -0.02em; }
  .a3-mid { font-size: 56px; line-height: 1.2; }
  .a3-center { display: flex; flex-direction: column; justify-content: center; align-items: flex-start; gap: 22px; padding-left: 60px; }
  .a3-code { margin: 0; font-size: 30px; line-height: 1.5; padding: 32px 40px; border: 2px solid var(--faint); border-radius: 16px;
             background: rgba(0,0,0,.7); }
  .a3-code .c { color: var(--faint); } .a3-code .err { color: var(--accent); } .a3-code .k { color: var(--dim); }
  .a3-cite { position: absolute; left: 120px; bottom: 108px; font-family: var(--mono); font-size: 22px; letter-spacing: .06em; color: var(--dim); }
  .a3-photo { position: absolute; border: 2px solid var(--hair); border-radius: 14px; overflow: hidden; background: #000; }
  .a3-photo img { display: block; width: 100%; height: 100%; object-fit: cover; }
  .a3-cap { position: absolute; font-size: 54px; line-height: 1.2; font-weight: 500; }
  .a3-cap .src { display: block; margin-top: 18px; font-family: var(--mono); font-size: 22px; letter-spacing: .12em; color: var(--dim); font-weight: 400; text-transform: uppercase; }
  #s-escenario-2023 .a3-photo { left: 0; top: 0; width: 996px; height: 560px; }
  #s-escenario-2023 .a3-cap { left: 1060px; top: 150px; width: 620px; }
  #s-escenario-2023 .nophoto .a3-photo { display: none; }
  #s-escenario-2023 .nophoto .a3-cap { left: 120px; top: 90px; width: 1440px; padding: 90px 80px; border: 2px dashed var(--faint); border-radius: 22px; font-size: 76px; text-align: center; }
  #s-era-2026 .a3-photo { left: 0; top: 0; width: 420px; height: 560px; }
  #s-era-2026 .a3-photo img { object-position: 50% 88%; }
  #s-era-2026 .a3-cap { left: 500px; top: 40px; width: 1180px; }

  /* slide 17: counters collapse */
  .a3-rows { display: flex; flex-direction: column; justify-content: center; height: 100%; gap: 38px; }
  .a3-row { display: grid; grid-template-columns: 380px 1fr; align-items: center; border-bottom: 2px solid var(--hair); padding-bottom: 26px; }
  .a3-row .k { font-family: var(--mono); font-size: 24px; letter-spacing: .24em; color: var(--dim); text-transform: uppercase; }
  .a3-row .v { position: relative; height: 72px; font-size: 62px; font-weight: 500; line-height: 72px; letter-spacing: -0.01em; }
  .a3-row .v span { position: absolute; left: 0; top: 0; white-space: nowrap; transition: opacity .7s var(--ease), filter .7s var(--ease), transform .7s var(--ease); transition-delay: calc(var(--i) * .35s); }
  .a3-row .v .new { opacity: 0; filter: blur(14px); color: var(--accent); transform: translateY(18px); }
  #s-colapso[data-at="1"] .a3-row .v .old, #s-colapso[data-at="2"] .a3-row .v .old { opacity: 0; filter: blur(14px); transform: translateY(-18px); }
  #s-colapso[data-at="1"] .a3-row .v .new, #s-colapso[data-at="2"] .a3-row .v .new { opacity: 1; filter: none; transform: none; }

  /* slide 18: tiny transformer */
  #s-caja-magica .a3-stage { top: 250px; height: 640px; }
  .a3-tfsvg { display: block; width: 1680px; height: auto; }
  .a3-tf { opacity: 0; transition: opacity 1s var(--ease); }
  .slide.active .a3-tf { opacity: 1; transition-delay: calc(var(--k) * 1.2s + .3s); }
  .a3-cl { font-family: var(--mono); font-size: 20px; letter-spacing: .24em; fill: var(--dim); text-transform: uppercase; text-anchor: middle; opacity: 0; transition: opacity .8s var(--ease); }
  .slide.active .a3-cl { opacity: 1; transition-delay: calc(var(--k) * 1.2s + .3s); }
  .a3-bar { stroke: var(--fg); stroke-width: 3; opacity: .85; }
  .a3-tok { font-family: var(--sans); font-size: 46px; fill: var(--fg); text-anchor: middle; }
  .a3-sh { fill: #000; stroke: var(--fg); stroke-width: 2; }
  .a3-hair { fill: none; stroke: var(--fg); stroke-width: 1.5; opacity: .2; }
  .a3-web { stroke: var(--fg); stroke-width: 1.5; opacity: .1; }
  .a3-att { stroke: var(--fg); stroke-width: 2.5; opacity: .9; stroke-dasharray: 10 8; animation: a3-flow 1.2s linear infinite; }
  .a3-att.acc { stroke: var(--accent); opacity: .95; }
  @keyframes a3-flow { to { stroke-dashoffset: -18; } }
  .a3-head-box { fill: none; stroke: var(--faint); stroke-width: 2; }
  .a3-unit { fill: #000; stroke: var(--faint); stroke-width: 2; }
  .a3-unit.lit { fill: var(--fg); stroke: var(--fg); }
  .a3-axis { stroke: var(--fg); stroke-width: 3; stroke-dasharray: 2 8; stroke-linecap: round; }
  .a3-tick { font-family: var(--mono); font-size: 22px; fill: var(--dim); }
  .a3-hit { fill: var(--accent); }
  .a3-result { fill: none; stroke: var(--accent); stroke-width: 3; }
  .a3-67 { font-family: var(--sans); font-size: 110px; font-weight: 500; fill: var(--accent); text-anchor: middle; }
  .a3-eq { font-family: var(--mono); font-size: 40px; fill: var(--dim); text-anchor: middle; }
  `);

  const CODE_ERR = `<span class="c">-- orders_db vs. payments_db: dos servidores, dos mundos</span>
<span class="k">SELECT</span> o.id, p.amount
<span class="k">FROM</span>   orders_db.public.orders   o
<span class="k">JOIN</span>   payments_db.public.payments p
       <span class="k">ON</span> p.order_id = o.id;

<span class="err">ERROR:  cross-database references are not implemented:
        "payments_db.public.payments"</span>`;
  const CODE_OK = `<span class="c">-- warehouse: todo en un lugar (filas de ejemplo)</span>
<span class="k">SELECT</span> o.id, p.amount, c.sessions
<span class="k">FROM</span>   orders   o
<span class="k">JOIN</span>   payments p <span class="k">ON</span> p.order_id = o.id
<span class="k">JOIN</span>   clicks   c <span class="k">ON</span> c.order_id = o.id;

<span class="c"> id | amount | sessions</span>
<span class="c">----+--------+---------</span>
  1 |    129 |        4
  2 |     60 |        1
  3 |     85 |        7   <span class="err">← funciona.</span>`;

  Deck.act(3, 'Acto 3 · Las eras', [
    // ---- 10 ----------------------------------------------------------------
    {
      id: 'mapa-eras', title: 'Mapa de eras (Ian Macomber)', time: 90, class: 'bleed', particles: 'a3-tracks',
      html: head('El mundo · cuatro eras', 'Las eras del data stack') +
        stage(P([0, 1], TL({ 0: 0 }), 'on-always')) +
        lines(P(1, `<span class="dim">Abajo, vacío todavía: <em>las eras que me tocaron a mí.</em></span>`)) +
        `<div class="a3-cite">Era framing: Ian Macomber · «The Shape and Feel of the Post-AI Data Stack» · ago 2026</div>`,
      steps: 1,
      ...hooks,
    },

    // ---- 11 ----------------------------------------------------------------
    {
      id: 'era-2013', title: 'Era 2013 → 2018 · SAT', time: 150, class: 'bleed', particles: 'two',
      counter: '3 gráficas pulidas = 1 día', steps: 3,
      html: head('Era 2013 · Pre-modern <span class="faint">→ me llegó en 2018</span>', 'Preguntas que caben en un servidor') +
        stage(
          P([0], TL({ 0: 1 }, 0)) +
          P([1], BD({ 1: '2013' })) +
          P([2], `<div class="a3-center"><div class="a3-mid dim">Terminé el notebook. Mi pregunta:</div>
            <div class="a3-big">«¿y mi ML engineer?»</div><div class="a3-big accent">«Somos tres.»</div></div>`) +
          P([3], `<pre class="a3-code">${CODE_ERR}</pre>`)) +
        lines(
          P([0], `<span class="dim">SAT · Data Scientist · <strong style="color:var(--fg)">R</strong>.</span>`) +
          P([1], `<span class="dim">Dos bases OLTP que no se pueden unir. <em>El clickstream, afuera.</em></span>`) +
          P([3], `<span class="dim">Así se veía un JOIN entre bases.</span>`)),
      ...hooks,
    },

    // ---- 12 ----------------------------------------------------------------
    {
      id: 'bancomext', title: 'El desvío full-stack → 2020 · Bancomext', time: 110, class: 'bleed',
      counter: '∞ · nunca llegó a producción', steps: 2,
      html: head('Desvío · 2020 · Bancomext', 'Un data person de software engineer') +
        stage(
          P([0], TL({ 0: 2 }, 1)) +
          P([1, 2], `<ul class="bullets a3-mid" style="margin-top:60px;max-width:1400px">
              <li><strong>React</strong> en el front.</li>
              <li>Un backend a mano.</li>
              <li data-step="2">Nunca llegó a producción.</li></ul>`)) +
        lines(
          P([0], `<span class="dim">Una rama fuera de mi carrera de datos.</span>`) +
          P([2], `<em>Hoy ese código es casi gratis.</em>`)),
      ...hooks,
      // step 2 reveals the last bullet; the bullets panel itself is on from step 1
    },

    // ---- 13 ----------------------------------------------------------------
    {
      id: 'era-2021', title: 'Eras 2016 + 2020 → 2021 · Accenture', time: 210, class: 'bleed', particles: 'one',
      counter: 'jornadas de 18 horas', steps: 5,
      html: head('Eras 2016 + 2020 · <span class="faint">→ me llegaron juntas en 2021</span>', 'Todo en un lugar, y de reportero a operador') +
        stage(
          P([0, 5], TL({ 0: 3, 5: 4 }, 2)) +
          P([1, 3], BD({ 1: '2016', 3: '2020' })) +
          P([2], `<pre class="a3-code">${CODE_OK}</pre>`) +
          P([4], `<div class="a3-center"><div class="a3-mid dim">Accenture · Data & ML Engineer</div>
            <div class="a3-big"><strong>Databricks</strong> ETLs + <strong>Power BI</strong></div>
            <div class="a3-mid dim">Sin tiempo para tests. Y la pregunta que nadie contestó:</div>
            <div class="a3-big accent">«¿cómo testeas un bookmark?»</div></div>`)) +
        lines(
          P([0], `<span class="dim">Dos eras, un mismo año: 2021. Me llegaron <em>al mismo tiempo.</em></span>`) +
          P([1], `<span class="dim">2016 · todo el negocio en un lugar. <em>El clickstream, adentro.</em></span>`) +
          P([2], `<span class="dim">El mismo JOIN, ahora en un solo lugar.</span>`) +
          P([3], `<span class="dim">2020 · ETL gestionado entra, <em>reverse ETL sale.</em></span>`) +
          P([5], `<span class="dim">2023–2025 · Sr. <strong style="color:var(--fg)">Terraform</strong> + <strong style="color:var(--fg)">SageMaker</strong>: <em>las abstracciones son tus amigas.</em></span>`)),
      ...hooks,
    },

    // ---- 15 ----------------------------------------------------------------
    {
      id: 'escenario-2023', title: 'Julio 2023 · este escenario', time: 90, class: 'bleed', particles: { shape: 'scatter', opacity: 0.22 },
      steps: 2,
      html: head('Julio 2023 · <span class="faint">este escenario</span>', 'Aquí mismo, hace tres años') +
        stage(
          P([0], TL({ 0: 4 }, 4)) +
          P([1], `<div class="a3-photo"><img src="assets/2023/stills/00-escenario.jpg" alt="El escenario de The Data Pub, julio 2023" onerror="this.closest('.a3-p').classList.add('nophoto')"></div>
            <div class="a3-cap">Les dije que la virtud era la ignorancia.<span class="src">The Data Pub · julio 2023</span></div>`) +
          P([2], BD({ 2: '2023' }))) +
        lines(
          P([0], `<span class="dim">En el medio de mi línea: <em>este mismo escenario.</em></span>`) +
          P([2], `<span class="dim">El stack de 2020, sin cambios: «esto es marketing».</span>`)),
      ...hooks,
    },

    // ---- 16 ----------------------------------------------------------------
    {
      id: 'era-2026', title: 'Era 2026 → 2026 · el avión', time: 180, class: 'bleed',
      particles: { shape: 'swarm', opacity: 0.3 }, counter: '1 vuelo', steps: 1,
      html: head('Era 2026 · Post-AI <span class="faint">→ me llegó en 2026</span>', 'La primera flecha vertical') +
        stage(
          P([0], TL({ 0: 5 }, 4)) +
          P([1], `<div class="a3-photo"><img src="assets/2026/avion-5-agentes.webp" alt="Cinco agentes construyendo un deck en un vuelo"></div>
            <div class="a3-cap">Cinco agentes.<br>Un deck. <em>Un vuelo.</em></div>
            <div class="a3-cap" style="top:280px;font-size:48px;font-weight:400;color:var(--dim)">Por primera vez, la era me llegó al mismo tiempo que a San Francisco.</div>`)) +
        lines(P([0], `<span class="dim">2013 → 5 años. 2016 → 5. 2020 → 1. <em>2026 → 0.</em></span>`)),
      ...hooks,
    },

    // ---- 17 ----------------------------------------------------------------
    {
      id: 'colapso', title: 'Todos los contadores colapsan a «minutos»', time: 160, class: 'bleed',
      particles: { shape: 'swarm', opacity: 0.3 }, counter: ['1 vuelo', 'minutos'], steps: 2,
      html: head('Cuánto me tardé', 'Todos los contadores') +
        stage(`<div class="a3-rows">
          ${[['2018 · SAT', '3 gráficas pulidas = 1 día'], ['2020 · Bancomext', '∞ · nunca llegó a producción'],
             ['2021 · Accenture', 'jornadas de 18 horas'], ['2026 · el avión', '1 vuelo']]
            .map(([k, v], i) => `<div class="a3-row" style="--i:${i}"><div class="k">${k}</div>
              <div class="v"><span class="old">${v}</span><span class="new">minutos</span></div></div>`).join('')}
        </div>`) +
        lines(P([2], `<span class="dim">Producir se volvió barato. <em>¿Qué sigue siendo caro?</em></span>`)),
      ...hooks,
    },

    // ---- 18 ----------------------------------------------------------------
    {
      id: 'caja-magica', title: 'Interludio · la caja mágica', time: 30, class: 'bleed', particles: 'none', label: '',
      html: head('Interludio', '¿Qué hay dentro de la caja mágica?') + stage(transformer()),
    },
  ]);
})();
