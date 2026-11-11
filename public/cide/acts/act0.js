// Act 0 · Apertura: title, who, Carver's kitchen table, map, the case. See datapub deck/CONTRACT.md for the slide API.
(() => {
  const TAU = Math.PI * 2;

  // ---- particle shapes used across the deck (prefix c-) ----------------------
  // A heart that beats: "Love", before it gets struck out.
  Particles.define('c-heart', (u, t) => {
    const a = u.r(1) * TAU, s = 13 * (1 + 0.035 * Math.sin(t * 2.4)) * (1 - 0.1 * u.r(2) * u.r(3));
    const hx = 16 * Math.pow(Math.sin(a), 3);
    const hy = -(13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a));
    return [1500 + hx * s + u.g(4) * 2.5, 650 + hy * s + u.g(5) * 2.5];
  });
  // Four people around a table (Carver's kitchen): four clusters on the chairs, a faint ring on the table edge.
  const TABLE = { x: 1280, y: 560, r: 190 };
  Particles.define('c-table', (u, t) => {
    if (u.i % 6 === 0) {
      const a = u.r(1) * TAU + t * 0.03;
      return [TABLE.x + Math.cos(a) * (TABLE.r + u.g(2) * 3), TABLE.y + Math.sin(a) * (TABLE.r + u.g(3) * 3)];
    }
    const k = u.i % 4, a = -Math.PI * 0.75 + k * Math.PI / 2, R = 262;
    return [TABLE.x + Math.cos(a) * R + u.g(1) * 26 + Math.sin(t * 0.5 + u.r(5) * TAU) * 4,
            TABLE.y + Math.sin(a) * R + u.g(2) * 26 + Math.cos(t * 0.5 + u.r(6) * TAU) * 4];
  });
  // The agent loop: everything flows clockwise around one ellipse (see #s-agente).
  Particles.define('c-loop', (u, t) => {
    const a = u.r(1) * TAU + t * (0.16 + 0.05 * u.r(2));
    return [960 + Math.cos(a) * (640 + u.g(3) * 5), 690 + Math.sin(a) * (170 + u.g(4) * 5)];
  });
  // Three stacked planes (the three data layers of art. 76); the top one is dense, the others sparse.
  Particles.define('c-layers', (u) => {
    const k = u.i % 9 < 7 ? 0 : (u.i % 9 === 7 ? 1 : 2);
    const p = u.r(1) * 2 - 1, q = u.r(2) * 2 - 1;        // diamond coords
    return [440 + (p - q) * 140, 430 + k * 150 + (p + q) * 45];
  });

  const pt = (a, R) => [TABLE.x + Math.cos(a) * R, TABLE.y + Math.sin(a) * R];
  const arc = (deg, span, R) => {
    const a0 = (deg - span) * Math.PI / 180, a1 = (deg + span) * Math.PI / 180;
    const [x0, y0] = pt(a0, R), [x1, y1] = pt(a1, R);
    return `M${x0.toFixed(1)} ${y0.toFixed(1)} A${R} ${R} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
  };
  const tableSvg = `
    <svg class="tbl" viewBox="0 0 1920 1080" width="1920" height="1080">
      <circle class="ln draw" pathLength="1" cx="${TABLE.x}" cy="${TABLE.y}" r="${TABLE.r}"/>
      <circle class="ln-hair" cx="${TABLE.x}" cy="${TABLE.y}" r="${TABLE.r - 16}"/>
      ${[-135, -45, 45, 135].map((d) => `<path class="ln-dim draw" pathLength="1" stroke-linecap="round" style="stroke-width:5" d="${arc(d, 26, 252)}"/>`).join('')}
      ${[-111, -21, 69, 159].map((d) => { const [x, y] = pt(d * Math.PI / 180, 150); return `<circle class="ln-dim" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="13"/>`; }).join('')}
      <g class="bottle"><circle class="ln" cx="${TABLE.x - 70}" cy="${TABLE.y - 96}" r="22"/><circle class="ln-acc" cx="${TABLE.x - 70}" cy="${TABLE.y - 96}" r="8"/></g>
    </svg>`;

  Deck.css(`
    #s-title .a0-ep { margin-bottom: 40px; color: var(--accent); font-size: 26px; }
    #s-title .a0-name { font-size: 132px; font-weight: 500; line-height: 1.0; letter-spacing: -0.035em; margin: 0 0 56px; max-width: 1650px; }
    #s-title .a0-name .strike { position: relative; color: var(--faint); }
    #s-title .a0-name .strike::after { content: ""; position: absolute; left: -4px; right: -4px; top: 54%; height: 8px; background: var(--fg);
      transform: scaleX(0); transform-origin: left; transition: transform 0.7s var(--ease); }
    #s-title:not([data-at="0"]) .a0-name .strike::after { transform: scaleX(1); }
    #s-title .a0-name .new { color: var(--accent); }
    #s-title .a0-name .swap { display: inline-grid; }
    #s-title .a0-name .swap > * { grid-area: 1 / 1; justify-self: start; }
    #s-title .a0-by { display: flex; gap: 28px; align-items: center; flex-wrap: wrap; }
    #s-title .a0-by .bar { width: 64px; height: 2px; background: var(--faint); }

    #s-quien .a0-who-l { position: absolute; left: var(--pad-x); top: var(--pad-y); width: 860px; }
    #s-quien .a0-title { font-family: var(--mono); font-size: 72px; font-weight: 500; letter-spacing: -0.02em; margin: 0; }
    #s-quien .a0-id { display: flex; align-items: center; gap: 40px; margin-top: 56px; }
    #s-quien .a0-portrait { flex: none; width: 260px; height: 260px; border-radius: 50%; overflow: hidden;
      border: var(--stroke) solid var(--faint); box-shadow: 0 0 0 10px #000, 0 0 0 12px var(--hair); }
    #s-quien .a0-portrait img { width: 100%; height: 100%; object-fit: cover; display: block; filter: grayscale(1); }
    #s-quien .a0-nm { font-size: 68px; font-weight: 500; letter-spacing: -0.02em; line-height: 1.05; }
    #s-quien .a0-role { font-size: 34px; line-height: 1.3; margin-top: 14px; }
    #s-quien .a0-stats { display: flex; gap: 80px; margin-top: 64px; }
    #s-quien .a0-stats .big { font-size: 120px; font-weight: 500; letter-spacing: -0.03em; line-height: 1; }
    #s-quien .a0-stats .cap { font-size: 32px; color: var(--dim); margin-top: 12px; }
    #s-quien .a0-take { margin-top: 56px; }
    #s-quien .a0-take .txt { font-size: 38px; line-height: 1.25; margin-top: 10px; }
    #s-quien .a0-qrs { position: absolute; right: var(--pad-x); top: var(--pad-y);
      display: grid; grid-template-columns: repeat(2, 360px); gap: 24px 40px; }
    #s-quien .a0-qr { text-align: center; }
    #s-quien .a0-qr .tile { width: 360px; height: 360px; padding: 22px; border-radius: 20px; background: #fff; }
    #s-quien .a0-qr img { width: 100%; height: 100%; display: block; image-rendering: pixelated; }
    #s-quien .a0-qr .url { margin-top: 12px; font-family: var(--mono); font-size: 26px; color: var(--fg); }

    /* Carver: the kitchen table, seen from above */
    #s-carver .tbl { position: absolute; inset: 0; }
    #s-carver .left { position: absolute; left: var(--pad-x); top: 110px; width: 690px; }
    #s-carver .left .t-label { color: var(--accent); }
    #s-carver .book { font-size: 58px; font-weight: 500; letter-spacing: -0.025em; line-height: 1.08; margin: 18px 0 30px; font-style: italic; }
    #s-carver .scene { font-size: 35px; line-height: 1.3; color: var(--dim); margin: 0; }
    #s-carver .nadie { font-size: 35px; line-height: 1.3; margin: 18px 0 0; }
    #s-carver .end { position: absolute; left: var(--pad-x); top: 760px; width: 700px; font-size: 62px; font-weight: 500; letter-spacing: -0.025em; line-height: 1.06; }
    #s-carver .word { position: absolute; left: ${TABLE.x - 150}px; top: ${TABLE.y - 36}px; width: 300px; height: 72px; text-align: center; }
    #s-carver .word span { position: absolute; inset: 0; font-size: 58px; font-weight: 500; letter-spacing: -0.03em; line-height: 72px; }
    #s-carver .word .w1 { color: var(--dim); }
    #s-carver .word .w2 { color: var(--accent); }
    #s-carver .say { position: absolute; font-size: 30px; line-height: 1.22; }
    #s-carver .say.ne { left: ${TABLE.x + 215}px; width: ${1800 - TABLE.x - 215}px; top: 165px; height: 130px; display: flex; align-items: flex-end; }
    #s-carver .say.se { left: ${TABLE.x + 215}px; width: ${1800 - TABLE.x - 215}px; top: 825px; }
    #s-carver .say.nw { left: ${TABLE.x - 215 - 240}px; width: 240px; top: 165px; height: 130px; display: flex; align-items: flex-end; justify-content: flex-end; text-align: right; }
    #s-carver .say.sw { left: ${TABLE.x - 215 - 240}px; width: 240px; top: 825px; text-align: right; }
    #s-carver .say.love { color: var(--dim); font-style: italic; }
    #s-carver .say.ag { color: var(--fg); }
    #s-carver .bottle { transition: opacity .6s var(--ease); }
    #s-carver:not([data-at="0"]):not([data-at="1"]) .bottle { opacity: 0.25; }

    #s-mapa .steps { display: grid; grid-template-columns: 1.25fr 1fr 1fr; gap: 40px; margin-top: 8px; }
    #s-mapa .st { border-top: 3px solid var(--faint); padding-top: 28px; }
    #s-mapa .st.on { border-top-color: var(--accent); }
    #s-mapa .st .n { font-family: var(--mono); font-size: 24px; letter-spacing: 0.24em; color: var(--accent); }
    #s-mapa .st h3 { font-size: 56px; font-weight: 500; letter-spacing: -0.02em; margin: 14px 0 12px; }
    #s-mapa .st p { font-size: 32px; color: var(--dim); margin: 0; line-height: 1.3; }
    #s-mapa .tmpl { margin-top: 72px; display: flex; gap: 0; align-items: stretch; }
    #s-mapa .tmpl .cell { flex: 1; border: var(--stroke) solid var(--faint); padding: 26px 32px; }
    #s-mapa .tmpl .cell + .cell { border-left: 0; }
    #s-mapa .tmpl .cell.acc { border-color: var(--accent); border-left: var(--stroke) solid var(--accent); }
    #s-mapa .tmpl .cell .t-label { font-size: 20px; }
    #s-mapa .tmpl .cell div:last-child { font-size: 36px; margin-top: 10px; }

    /* The case: an alert on an analyst's screen, with the clock running */
    #s-caso .card { position: absolute; left: var(--pad-x); top: 100px; width: 900px; border: var(--stroke) solid var(--faint); border-radius: 22px; background: rgba(0,0,0,0.78); overflow: hidden; }
    #s-caso .bar { display: flex; align-items: center; gap: 16px; padding: 18px 30px; border-bottom: var(--stroke) solid var(--hair); font-family: var(--mono); font-size: 21px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--dim); }
    #s-caso .bar .dot { width: 16px; height: 16px; border-radius: 50%; background: var(--bad); animation: k-pulse 1.4s ease-in-out infinite; }
    #s-caso .bar .tm { margin-left: auto; color: var(--fg); letter-spacing: 0.1em; }
    @keyframes k-pulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(255,107,95,0.7); } 50% { box-shadow: 0 0 0 14px rgba(255,107,95,0); } }
    #s-caso .body { padding: 26px 30px 8px; }
    #s-caso .k-amt { font-size: 168px; font-weight: 500; letter-spacing: -0.045em; line-height: 1; }
    #s-caso .k-amt small { display: block; font-size: 32px; color: var(--dim); letter-spacing: 0; margin-top: 12px; font-weight: 400; }
    #s-caso .k-sig { list-style: none; padding: 0; margin: 28px 0 0; }
    #s-caso .k-sig li { font-size: 36px; padding: 11px 0; border-top: 2px solid var(--hair); display: flex; justify-content: space-between; }
    #s-caso .k-sig .v { font-family: var(--mono); font-size: 25px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--bad); align-self: center; }
    #s-caso .k-sig .v.ok { color: var(--good); }
    #s-caso .drain { height: 8px; background: var(--hair); position: relative; }
    #s-caso .drain i { position: absolute; left: 0; top: 0; bottom: 0; width: 100%; background: var(--accent); transform-origin: left; animation: k-drain 30s linear infinite; }
    @keyframes k-drain { from { transform: scaleX(1); } to { transform: scaleX(0); } }
    .shot #s-caso .drain i { animation: none; transform: scaleX(0.62); }
    #s-caso .foot3 { padding: 12px 30px 16px; font-family: var(--mono); font-size: 20px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--accent); }
    #s-caso .k-vote { position: absolute; left: 1110px; right: var(--pad-x); top: 400px; font-size: 84px; line-height: 1.06; letter-spacing: -0.025em; font-weight: 500; }
    #s-caso .k-vote .t-label { display: block; margin-bottom: 20px; color: var(--accent); font-weight: 400; }
    #s-caso .k-note { position: absolute; left: 1110px; right: var(--pad-x); top: 700px; font-family: var(--mono); font-size: 21px; color: var(--faint); letter-spacing: 0.04em; line-height: 1.4; }
  `);

  Deck.act(0, 'Apertura', [
    {
      id: 'title',
      title: 'What We Talk About When We Talk About Agentic Banking',
      time: 30,
      class: 'middle',
      particles: [{ shape: 'c-heart', opacity: 0.75 }, { shape: 'scatter', opacity: 0.3 }, { shape: 'swarm', opacity: 0.45 }],
      label: '',
      html: `
        <div class="t-label a0-ep">Taller · IA y Fintech en acción</div>
        <h1 class="a0-name">What We Talk About When We Talk About
          <span class="swap"><span class="strike" data-step-hide="2">Love</span><span class="new" data-step="2">Agentic Banking</span></span></h1>
        <div class="a0-by t-label"><span>Carlos Haro</span><span class="bar"></span><span>Facilita Christian García</span><span class="bar"></span><span>CIDE · 11 nov 2026</span></div>`,
    },
    {
      id: 'quien',
      title: 'who_is_this_dude?',
      time: 60,
      class: 'middle',
      particles: { shape: 'scatter', opacity: 0.2 },
      html: `
        <div class="a0-who-l">
          <h1 class="a0-title">who_is_this_dude?</h1>
          <div class="a0-id">
            <div class="a0-portrait"><img src="assets/carlos-portrait.jpg" alt="Carlos Haro"></div>
            <div>
              <div class="a0-nm">Carlos Haro</div>
              <div class="a0-role">AI Engineer<br>Santander México <span class="dim">· Data &amp; AI</span></div>
            </div>
          </div>
          <div class="a0-stats">
            <div><div class="big">~10</div><div class="cap">años lidiando con datos</div></div>
            <div><div class="big">@h1sort</div><div class="cap">en todos lados</div></div>
          </div>
          <div class="a0-take"><div class="t-label">Mi take</div>
            <div class="txt">La educación es el 2do mejor motor de cambio de una sociedad.</div></div>
        </div>
        <div class="a0-qrs">
          <div class="a0-qr"><div class="tile"><img src="assets/qr-linkedin.svg" alt="QR LinkedIn"></div><div class="url">linkedin.com/in/h1sort</div></div>
          <div class="a0-qr"><div class="tile"><img src="assets/qr-x.svg" alt="QR X"></div><div class="url">x.com/h1sort</div></div>
          <div class="a0-qr"><div class="tile"><img src="assets/qr-github.svg" alt="QR GitHub"></div><div class="url">github.com/h1sort</div></div>
          <div class="a0-qr"><div class="tile"><img src="assets/qr-slides.svg" alt="QR diapositivas"></div><div class="url">h1sort.com/cide</div></div>
        </div>`,
    },
    {
      id: 'carver',
      title: 'Carver · la mesa de la cocina',
      time: 100,
      particles: [{ shape: 'c-table', opacity: 0.5 }, { shape: 'c-table', opacity: 0.5 }, { shape: 'c-table', opacity: 0.5 }, { shape: 'swarm', opacity: 0.3 }],
      html: `
        ${tableSvg}
        <div class="left">
          <div class="t-label">Un cuento · Raymond Carver, 1981</div>
          <div class="book">What We Talk About When We Talk About Love</div>
          <p class="scene">Dos parejas, una mesa de cocina, una botella de ginebra. Una tarde entera discutiendo qué es el amor.</p>
          <p class="nadie" data-step="1">Cada quien habla de una cosa distinta. <em>Nadie se da cuenta.</em></p>
        </div>
        <div class="word"><span class="w1" data-step-hide="2">amor</span><span class="w2" data-step="2">agéntico</span></div>
        <div class="say love nw" data-step-only="1">«Es devoción.»</div>
        <div class="say love ne" data-step-only="1">«Es obsesión.»</div>
        <div class="say love se" data-step-only="1">«Es costumbre.»</div>
        <div class="say love sw" data-step-only="1">«Ya no lo sé.»</div>
        <div class="say ag nw" data-step="2">«Un chatbot con otro nombre.»</div>
        <div class="say ag ne" data-step="2">«El banco decidiendo solo.»</div>
        <div class="say ag se" data-step="2">«Automatización, pero con IA.»</div>
        <div class="say ag sw" data-step="2">«Lo que venda el proveedor.»</div>
        <div class="end" data-step="3">Antes de discutir, <em>definamos</em>.</div>`,
    },
    {
      id: 'mapa',
      title: 'Cómo va a funcionar',
      time: 60,
      class: 'middle',
      particles: { shape: 'grid', opacity: 0.16 },
      html: `
        <div class="t-label" style="margin-bottom:40px">Cómo va a funcionar</div>
        <div class="steps">
          <div class="st on"><div class="n">01</div><h3>1 caso, 6 conceptos</h3><p>La misma transferencia, vista seis veces</p></div>
          <div class="st" data-step="1"><div class="n">02</div><h3>Laboratorio</h3><p>Ustedes deciden quién aprueba</p></div>
          <div class="st" data-step="1"><div class="n">03</div><h3>Debate</h3><p>Con Christian, sin piedad</p></div>
        </div>
        <div class="tmpl" data-step="2">
          <div class="cell"><div class="t-label">Definición</div><div>Formal, sin adornos</div></div>
          <div class="cell"><div class="t-label">En el caso</div><div>Qué cambia en la transferencia</div></div>
          <div class="cell acc"><div class="t-label accent">Para debatir</div><div>Una pregunta abierta</div></div>
        </div>`,
    },
    {
      id: 'caso',
      title: 'El caso · primera votación',
      time: 150,
      particles: [{ shape: 'scatter', opacity: 0.2 }, { shape: 'split', opacity: 0.35 }],
      label: 'El caso',
      html: `
        <div class="card">
          <div class="bar"><span class="dot"></span><span>Operación en revisión</span><span class="tm">Vie · 23:40</span></div>
          <div class="body">
            <div class="k-amt">$148,000<small>MXN · SPEI a una cuenta nueva</small></div>
            <ul class="k-sig">
              <li>SIM <span class="v">⚠ cambió hoy</span></li>
              <li>Dispositivo <span class="v">⚠ nuevo hoy</span></li>
              <li>Ubicación <span class="v">⚠ otra ciudad</span></li>
              <li>Código por SMS <span class="v ok">✓ correcto</span></li>
            </ul>
          </div>
          <div class="foot3">La transferencia sale en 30 segundos</div>
          <div class="drain"><i></i></div>
        </div>
        <div class="k-vote" data-step="1"><span class="t-label">Primera votación</span>¿La frenas<br>o la dejas pasar?</div>
        <div class="k-note" data-step="1">Caso ilustrativo. No es un cliente real.</div>`,
    },
  ]);
})();
