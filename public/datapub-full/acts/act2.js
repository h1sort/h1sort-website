// Act 2: El ejemplo mínimo, recargado (slides 7-9). See CONTRACT.md
(() => {
  // ---- shared pipeline geometry (SVG viewBox 1680 × 700) --------------------
  const NODES = [
    ['SISTEMAS', 'FUENTE'], ['DATOS', 'RAW'], ['DATOS', 'LIMPIOS'],
    ['DATOS', 'TRANSFORMADOS'], ['MODELO', 'SEMÁNTICO'], ['ANALYTICS'],
  ];
  const NW = 220, NH = 100, STEP = 292, NY = 250;
  const cx = (i) => i * STEP + NW / 2;

  const pipeline = () => NODES.map((l, i) => {
    const x = i * STEP;
    const text = l.length === 1
      ? `<text class="a2-nl" x="${cx(i)}" y="${NY + NH / 2 + 8}" text-anchor="middle">${l[0]}</text>`
      : `<text class="a2-nl" x="${cx(i)}" y="${NY + NH / 2 - 8}" text-anchor="middle">${l[0]}</text>
         <text class="a2-nl" x="${cx(i)}" y="${NY + NH / 2 + 24}" text-anchor="middle">${l[1]}</text>`;
    const arrow = i < NODES.length - 1
      ? `<path class="ln-dim" d="M${x + NW + 8} ${NY + NH / 2} H${x + STEP - 8}"/>
         <path class="ln-dim" d="M${x + STEP - 20} ${NY + NH / 2 - 9} L${x + STEP - 8} ${NY + NH / 2} L${x + STEP - 20} ${NY + NH / 2 + 9}"/>`
      : '';
    return `<g class="a2-node n${i}"><rect class="ln" x="${x}" y="${NY}" width="${NW}" height="${NH}" rx="10"/>${text}</g>${arrow}`;
  }).join('');

  Particles.define('a2-flow', (u, t) => {
    if (u.i % 2) return [u.r(1) * 1920 + Math.sin(t * 0.07 + u.r(2) * 6.28) * 40,
                         u.r(3) * 1080 + Math.cos(t * 0.05 + u.r(4) * 6.28) * 40];
    const x = 120 + ((u.r(1) * 1680 + t * 90) % 1680);
    return [x, 485 + u.g(2) * 5];
  });

  Deck.css(`
    .a2-nl { font-family: var(--mono); font-size: 22px; letter-spacing: 0.1em; fill: var(--fg); }
    .a2-big { font-family: var(--sans); font-weight: 500; letter-spacing: -0.02em; fill: var(--accent); }
    .a2-time { font-family: var(--sans); font-weight: 500; fill: var(--fg); }
    .a2-node rect { fill: #000; transition: stroke 0.5s var(--ease); }

    /* slide 7 */
    #s-a2-diagrama .a2-img { position: absolute; left: 120px; top: 170px; width: 1680px; border: var(--stroke) solid var(--hair);
      border-radius: 14px; overflow: hidden; background: #fff; transition: opacity 0.7s var(--ease); }
    #s-a2-diagrama .a2-img img { display: block; width: 100%; }
    #s-a2-diagrama[data-at="1"] .a2-img, #s-a2-diagrama[data-at="2"] .a2-img { opacity: 0; }
    #s-a2-diagrama .a2-kick { position: absolute; left: 120px; top: 96px; }
    #s-a2-diagrama .a2-metrics { position: absolute; left: 120px; right: 120px; top: 250px; display: flex; flex-direction: column; gap: 56px; }
    #s-a2-diagrama .a2-m { display: flex; gap: 48px; align-items: baseline; background: #000; border: var(--stroke) solid var(--faint);
      border-radius: 18px; padding: 40px 56px; font-size: 62px; line-height: 1.2; }
    #s-a2-diagrama .a2-m b { font-family: var(--mono); font-weight: 500; color: var(--accent); font-size: 88px; }

    /* slide 8 */
    #s-a2-respuestas .m { transition: opacity 0.6s var(--ease); }
    #s-a2-respuestas[data-at="2"] .m1, #s-a2-respuestas[data-at="3"] .m1,
    #s-a2-respuestas[data-at="3"] .m2 { opacity: 0.55; }
    #s-a2-respuestas[data-at="1"] .n5 rect, #s-a2-respuestas[data-at="2"] .n4 rect,
    #s-a2-respuestas[data-at="3"] .n0 rect { stroke: var(--accent); stroke-width: 3; }
    #s-a2-respuestas .a2-bar { fill: var(--fg); }
    #s-a2-respuestas .a2-bar.hot { fill: var(--accent); }

    /* slide 9 */
    #s-a2-2026 .a2-pipe { transition: opacity 0.8s var(--ease); }
    #s-a2-2026[data-at="4"] .a2-pipe { opacity: 0.18; }
    #s-a2-2026 .a2-agent { transition: opacity 0.8s var(--ease); }
    #s-a2-2026[data-at="4"] .a2-agent { opacity: 0.2; }
    #s-a2-2026:is([data-at="2"],[data-at="3"],[data-at="4"]) .n0 rect { stroke: var(--accent); stroke-width: 3; }
    #s-a2-2026 .a2-verdad { position: absolute; left: 0; right: 0; top: 400px; text-align: center; font-size: 230px;
      font-weight: 500; letter-spacing: -0.03em; color: var(--accent); line-height: 1; }
  `);

  const svgOpen = (extra = '') => `<svg viewBox="0 0 1680 700" width="1680" height="700" ${extra}>`;

  const marker = (cls, step, i, anchor, big, tag, sub) => {
    const x = anchor === 'end' ? 1680 : anchor === 'start' ? 0 : cx(i);
    return `<g class="m ${cls}" data-step="${step}">
      <text class="lbl fill-acc" x="${x}" y="40" text-anchor="${anchor}" style="fill:var(--accent)">${tag}</text>
      <text class="a2-big" x="${x}" y="${sub ? 118 : 120}" text-anchor="${anchor}" font-size="${i === 0 ? 96 : 84}">${big}</text>
      ${sub ? `<text class="lbl" x="${x}" y="168" text-anchor="${anchor}" style="font-size:26px">${sub}</text>` : ''}
      <path class="ln-acc" d="M${cx(i)} ${sub ? 190 : 150} V${NY - 12}"/>
      <path class="ln-acc" d="M${cx(i) - 10} ${NY - 24} L${cx(i)} ${NY - 10} L${cx(i) + 10} ${NY - 24}"/>
    </g>`;
  };

  Deck.act(2, 'Acto 2 · El ejemplo mínimo', [
    // ------------------------------------------------------------------ 7
    {
      id: 'a2-diagrama',
      title: 'El diagrama de 2023: ¿puedes solo añadirle…?',
      time: 90,
      particles: { shape: 'scatter', opacity: 0.2 },
      html: `
        <div class="t-label a2-kick">Julio 2023 · Un ejemplo mínimo</div>
        <div class="a2-img" data-step-hide="1"><img src="assets/2023/ejemplo-minimo-diagrama.webp" alt="Diagrama de 2023: de sistemas fuente a analytics"></div>
        <div class="a2-metrics">
          <div class="a2-m" data-step="1"><b>A</b><span>Frecuencia promedio en días de los clientes suscritos en el último año</span></div>
          <div class="a2-m" data-step="2"><b>B</b><span>Cuántas veces un cliente ha visitado la página de documentación del producto</span></div>
        </div>`,
    },
    // ------------------------------------------------------------------ 8
    {
      id: 'a2-respuestas',
      title: 'Las respuestas de 2023: 5 min, 0.5 días, 3 meses',
      time: 90,
      particles: { shape: 'scatter', opacity: 0.2 },
      html: `
        <div class="t-label" style="position:absolute;left:120px;top:96px">2023 · ¿Dónde vive la métrica?</div>
        <div style="position:absolute;left:120px;top:190px">
        ${svgOpen()}
          ${pipeline()}
          ${marker('m1', 1, 5, 'end', '5 min', 'A Y B AQUÍ')}
          ${marker('m2', 2, 4, 'middle', '0.5 días', 'A AQUÍ')}
          ${marker('m3', 3, 0, 'start', '3 meses', 'B AQUÍ', '5+ PERSONAS')}
          <g data-step="1"><rect class="a2-bar" x="0" y="430" width="70" height="52"/>
            <text class="txt" x="94" y="468" style="font-size:36px">5 min</text></g>
          <g data-step="2"><rect class="a2-bar" x="0" y="520" width="620" height="52"/>
            <text class="txt" x="644" y="558" style="font-size:36px">0.5 días</text></g>
          <g data-step="3"><rect class="a2-bar hot" x="0" y="610" width="1680" height="52"/>
            <text class="txt" x="1656" y="648" text-anchor="end" style="font-size:36px;fill:#000;font-weight:600">3 meses · 5+ personas</text></g>
          <text class="lbl" x="1680" y="412" text-anchor="end" style="font-size:20px;fill:var(--dim)">escala ilustrativa</text>
        </svg></div>`,
    },
    // ------------------------------------------------------------------ 9
    {
      id: 'a2-2026',
      title: 'El mismo diagrama en 2026: ≈ minutos… ¿y es verdad?',
      time: 120,
      particles: [
        { shape: 'a2-flow', opacity: 0.55 }, { shape: 'a2-flow', opacity: 0.55 },
        { shape: 'a2-flow', opacity: 0.55 }, { shape: 'a2-flow', opacity: 0.55 },
        { shape: 'scatter', opacity: 0.3 },
      ],
      html: `
        <div class="t-label" style="position:absolute;left:120px;top:96px">El mismo diagrama · <span class="accent">2026</span></div>
        <div style="position:absolute;left:120px;top:190px">
        ${svgOpen()}
          <g class="a2-pipe">
            ${pipeline()}
            <!-- 2023 times -->
            <g data-step="1"><g data-step-hide="3">
              <text class="a2-time" x="${cx(0)}" y="420" text-anchor="middle" font-size="48" style="fill:var(--dim)">3 meses</text>
              <text class="a2-time" x="${cx(4)}" y="420" text-anchor="middle" font-size="48" style="fill:var(--dim)">0.5 días</text>
              <text class="a2-time" x="${cx(5)}" y="420" text-anchor="middle" font-size="48" style="fill:var(--dim)">5 min</text>
            </g></g>
            <!-- 2026 times -->
            <g data-step="3">
              ${NODES.map((_, i) => `<text class="a2-time" x="${cx(i)}" y="420" text-anchor="middle" font-size="44" style="fill:var(--accent)">≈ minutos</text>`).join('')}
            </g>
          </g>
          <!-- the question and the agent's straight line to the source -->
          <g class="a2-agent" data-step="2">
            <rect class="ln-acc" x="1230" y="14" width="450" height="64" rx="32" style="fill:#000"/>
            <text class="a2-nl" x="1455" y="56" text-anchor="middle" style="fill:var(--accent)">¿PUEDES SOLO AÑADIRLE…?</text>
            <path class="ln-acc draw shown" pathLength="1" d="M1226 46 H${cx(0)} V${NY - 14}"/>
            <path class="ln-acc" d="M${cx(0) - 12} ${NY - 28} L${cx(0)} ${NY - 12} L${cx(0) + 12} ${NY - 28}"/>
            <text class="lbl" x="${cx(0) + 28}" y="108" style="fill:var(--accent)">AGENTE · directo a la fuente</text>
          </g>
        </svg></div>
        <div class="a2-verdad" data-step="4">¿y es verdad?</div>`,
    },
  ]);
})();
