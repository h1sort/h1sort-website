// One answer: the period after the big "1" on the consensus slide.
Particles.define('a4-one', (u) => [1272 + u.g(1) * 3, 344 + u.g(2) * 3]);
Particles.define('a4-agreed', (u) => [147 + u.g(1) * 3, 490 + u.g(2) * 3]);
// Act 4 · El giro (slides 19-23). See CONTRACT.md.
// window.METRIC_A is written by data/metric-a.js; read it at onEnter time only.
window.METRIC_A = window.METRIC_A || null;

Deck.css(`
/* 19 */
#s-boundary-2026 .a4-head { display: flex; justify-content: space-between; align-items: baseline; }
#s-boundary-2026 boundary-diagram { display: block; margin: 36px auto 0; }
#s-boundary-2026 .a4-fallback { display: none; margin: 36px auto 0; width: 1680px; height: 560px; padding: 56px 64px;
  border: 2px solid var(--accent); border-radius: 18px; }
#s-boundary-2026 boundary-diagram:not(:defined) + .a4-fallback { display: block; }
#s-boundary-2026 .a4-cap { margin-top: 28px; }

/* 20 */
#s-cita-ian .quote { max-width: 1560px; font-size: 72px; line-height: 1.2; }
#s-cita-ian .a4-pair { display: flex; gap: 120px; margin-top: 72px; }
#s-cita-ian .a4-pair > div { border-top: 2px solid var(--faint); padding-top: 22px; min-width: 520px; }
#s-cita-ian .a4-pair .big { font-size: 64px; font-weight: 500; margin-top: 8px; }

/* 21 */
#s-escalera-confianza .a4-rungs { margin-top: 56px; }
#s-escalera-confianza .a4-rung { display: grid; grid-template-columns: 560px 1fr; align-items: center; gap: 48px;
  border-left: 2px solid var(--faint); padding: 44px 0 44px 40px; margin-bottom: 30px; position: relative; }
#s-escalera-confianza .a4-rung:nth-child(2) { margin-left: 100px; }
#s-escalera-confianza .a4-rung:nth-child(3) { margin-left: 200px; }
#s-escalera-confianza .a4-rung::before { content: ""; position: absolute; left: 0; top: 0; width: 28px; height: 2px; background: var(--faint); }
#s-escalera-confianza .a4-stage { font-family: var(--mono); font-size: 24px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--dim); }
#s-escalera-confianza .a4-swap { display: grid; }
#s-escalera-confianza .a4-swap > * { grid-area: 1 / 1; align-self: center; }
#s-escalera-confianza .a4-time { font-size: 72px; font-weight: 500; letter-spacing: -0.02em; }
#s-escalera-confianza .a4-q { font-size: 48px; line-height: 1.15; color: var(--accent); }

/* 22 */
#s-metrica-a .a4-q { font-size: 48px; line-height: 1.3; max-width: 1680px; transition: font-size 0.5s var(--ease); }
#s-metrica-a[data-at="2"] .a4-q, #s-metrica-a[data-at="3"] .a4-q { font-size: 36px; }
#s-metrica-a .u { text-decoration: underline; text-decoration-thickness: 3px; text-underline-offset: 10px;
  text-decoration-color: transparent; transition: text-decoration-color 0.5s var(--ease), color 0.5s var(--ease); }
#s-metrica-a[data-at="1"] .u, #s-metrica-a[data-at="2"] .u { text-decoration-color: var(--accent); color: var(--accent); }
#s-metrica-a .a4-amb { margin-top: 56px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 48px; }
#s-metrica-a .a4-amb > div { border-top: 2px solid var(--accent); padding-top: 18px; font-size: 40px; line-height: 1.2; }
#s-metrica-a .a4-amb .t-label { display: block; margin-bottom: 8px; color: var(--accent); }
#s-metrica-a[data-at="2"] .a4-amb, #s-metrica-a[data-at="3"] .a4-amb { display: none; }
#s-metrica-a .a4-defs { margin-top: 36px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
#s-metrica-a .a4-def { min-width: 0; }
#s-metrica-a .a4-def .a4-name { font-size: 28px; min-height: 76px; line-height: 1.25; margin-bottom: 14px; }
#s-metrica-a .a4-sql { max-height: 330px; overflow: hidden; font-size: 22px; white-space: pre; padding: 20px 12px; letter-spacing: -0.03em;
  transition: max-height 0.6s var(--ease), opacity 0.5s var(--ease), padding 0.6s var(--ease), border-width 0.6s var(--ease); }
#s-metrica-a[data-at="3"] .a4-sql { max-height: 0; opacity: 0; padding-top: 0; padding-bottom: 0; border-width: 0; }
#s-metrica-a .a4-num { font-size: 84px; font-weight: 500; letter-spacing: -0.02em; margin-top: 18px; line-height: 1; transition: opacity 0.5s, font-size 0.5s var(--ease); }
#s-metrica-a .a4-num small { font-size: 32px; color: var(--dim); letter-spacing: 0; font-weight: 400; }
#s-metrica-a[data-at="3"] .a4-def { opacity: 0.6; }
#s-metrica-a[data-at="3"] .a4-num { font-size: 56px; }
#s-metrica-a .a4-agreed { margin-top: 44px; display: grid; grid-template-columns: 1fr 760px; gap: 56px; align-items: center;
  border: 2px solid var(--accent); border-radius: 18px; padding: 32px 44px; }
#s-metrica-a .a4-agreed .a4-num { font-size: 150px; margin-top: 0; color: var(--accent); }
#s-metrica-a .a4-agreed .a4-num small { color: var(--dim); }
#s-metrica-a .a4-agreed .a4-sql { max-height: none; opacity: 1; border-width: 2px; font-size: 22px; }
#s-metrica-a .a4-agreed-l { font-size: 34px; line-height: 1.25; }

/* 23 */
#s-consenso .a4-wrap { position: relative; height: 760px; margin-top: 8px; }
#s-consenso .a4-grid { position: absolute; left: 0; top: 0; display: grid; grid-template-columns: 190px repeat(3, 230px);
  grid-template-rows: 48px repeat(3, 150px); gap: 14px; }
#s-consenso .a4-grid .h { font-family: var(--mono); font-size: 22px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--dim);
  display: flex; align-items: center; }
#s-consenso .a4-cell { border: 2px solid var(--faint); border-radius: 14px; display: flex; align-items: center; justify-content: center;
  font-family: var(--mono); font-size: 44px; transition: color 0.5s var(--ease), border-color 0.5s var(--ease), background 0.5s var(--ease); }
#s-consenso .a4-cell span { position: absolute; opacity: 0; transition: opacity 0.4s; }
#s-consenso .a4-cell { position: relative; }
#s-consenso[data-at="0"] .a4-cell .s0, #s-consenso[data-at="1"] .a4-cell .s1,
#s-consenso[data-at="2"] .a4-cell .s2 { opacity: 1; }
#s-consenso[data-at="2"] .a4-cell { border-color: var(--accent); color: var(--accent); background: rgba(245,197,66,0.08); }
#s-consenso .a4-side { position: absolute; left: 1060px; top: 0; width: 560px; }
#s-consenso .a4-count { font-size: 200px; font-weight: 500; line-height: 1; letter-spacing: -0.04em; }
#s-consenso .a4-count .c { display: none; }
#s-consenso[data-at="0"] .a4-count .c0, #s-consenso[data-at="1"] .a4-count .c1, #s-consenso[data-at="2"] .a4-count .c2 { display: inline; }
#s-consenso[data-at="2"] .a4-count { color: var(--accent); }
#s-consenso .a4-step { margin-top: 36px; font-size: 36px; line-height: 1.3; min-height: 140px; }
#s-consenso .a4-step > div { display: none; }
#s-consenso[data-at="0"] .a4-step .p0, #s-consenso[data-at="1"] .a4-step .p1, #s-consenso[data-at="2"] .a4-step .p2 { display: block; }
#s-consenso .a4-loop { position: absolute; inset: 0; }
#s-consenso .a4-ger { position: absolute; left: 0; right: 0; top: 40px; }
#s-consenso .a4-ger .big { font-size: 64px; line-height: 1.15; letter-spacing: -0.015em; font-weight: 500; max-width: 1500px; }
#s-consenso .a4-final { position: absolute; left: 0; right: 0; top: 150px; text-align: left; }
#s-consenso .a4-final .big { font-size: 96px; line-height: 1.1; letter-spacing: -0.02em; font-weight: 500; }
`);

// ---- helpers ---------------------------------------------------------------
const a4fmt = (d) => (d && typeof d.value === 'number')
  ? `${d.value.toFixed(1)} <small>${d.unit || 'días'}</small>` : '—';
const a4esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
const A4_PLACEHOLDER = [
  { label: 'Suscrito: hoy', sql: "WHERE s.status = 'active'\n  AND s.start >= :cutoff - 365", value: null },
  { label: 'Suscrito: alguna vez en el año', sql: 'WHERE s.start <= :cutoff\n  AND s.end >= :cutoff - 365', value: null },
  { label: 'Suscrito: desde el año', sql: 'WHERE s.start >= :cutoff - 365', value: null },
];

Deck.act(4, 'Acto 4 · El giro', [
  // ---------------------------------------------------------------- 19
  {
    id: 'boundary-2026',
    title: 'El boundary de 2026',
    time: 90,
    particles: { shape: 'swarm', opacity: 0.22 },
    html: `
      <div class="a4-head">
        <div class="t-label">Boundary · 2026</div>
        <div class="t-label accent">Todo adentro</div>
      </div>
      <boundary-diagram state="2026"></boundary-diagram>
      <div class="a4-fallback">
        <div class="t-label accent">Boundary · 2026</div>
        <ul class="bullets t-body" style="margin-top:36px">
          <li>Todo el stack adentro de una sola frontera</li>
          <li>Un <em>agente</em> que camina por todo el stack</li>
          <li>El contexto de la empresa lo alimenta</li>
          <li>Evals cierran el ciclo de retroalimentación</li>
        </ul>
      </div>
      <div class="a4-cap t-body dim" data-step="1">Cualquier agente llega a cualquier dato. <em>¿Y quién decide qué significa?</em></div>`,
  },

  // ---------------------------------------------------------------- 20
  {
    id: 'cita-ian',
    title: 'La cita (Ian Macomber)',
    time: 60,
    class: 'middle',
    particles: { shape: 'swarm', opacity: 0.15 },
    html: `
      <div class="t-label" style="margin-bottom:40px">Ian Macomber</div>
      <div class="quote">La IA vuelve barato producir análisis. No vuelve barato <em>ponernos de acuerdo sobre la realidad.</em></div>
      <div class="a4-pair" data-step="1">
        <div><div class="t-label">Producir</div><div class="big">barato</div></div>
        <div><div class="t-label accent">Acordar qué es verdad</div><div class="big accent">no</div></div>
      </div>
      <div class="cite foot">Ian Macomber · The Shape and Feel of the Post-AI Data Stack, 2026 · iandmacomber.com · traducción propia</div>`,
  },

  // ---------------------------------------------------------------- 21
  {
    id: 'escalera-confianza',
    title: 'La escalera renace',
    time: 100,
    particles: { shape: 'swarm', opacity: 0.15 },
    html: `
      <div class="a4-swap">
        <div class="t-label" data-step-hide="1">2023 · Escalera de tiempo</div>
        <div class="t-label accent" data-step="1">2026 · Escalera de confianza</div>
      </div>
      <div class="a4-rungs">
        <div class="a4-rung">
          <div class="a4-stage">Visualización</div>
          <div class="a4-swap">
            <div class="a4-time" data-step-hide="1">5 min</div>
            <div class="a4-q" data-step="1">¿Con qué definición respondió?</div>
          </div>
        </div>
        <div class="a4-rung">
          <div class="a4-stage">Modelo semántico</div>
          <div class="a4-swap">
            <div class="a4-time" data-step-hide="1">0.5 días</div>
            <div class="a4-q" data-step="1">¿Con qué fecha de corte?</div>
          </div>
        </div>
        <div class="a4-rung">
          <div class="a4-stage">Sistema fuente</div>
          <div class="a4-swap">
            <div class="a4-time" data-step-hide="1">3 meses</div>
            <div class="a4-q" data-step="1">¿Quién lo puede detener?</div>
          </div>
        </div>
      </div>`,
  },

  // ---------------------------------------------------------------- 22
  {
    id: 'metrica-a',
    title: 'Métrica A, otra vez [D3 fallback]',
    time: 180,
    particles: [
      { shape: 'scatter', opacity: 0.18 },
      { shape: 'scatter', opacity: 0.18 },
      { shape: 'split', opacity: 0.3 },
      { shape: 'a4-agreed', opacity: 0.3 },
    ],
    html: `
      <div class="t-label" style="margin-bottom:28px">Métrica A · 2023, otra vez · datos sintéticos</div>
      <div class="a4-q">Frecuencia promedio en días de los clientes <span class="u" id="a4-u1">suscritos</span> en el <span class="u" id="a4-u2">último año</span></div>
      <div class="a4-amb" data-step="1" data-step-hide="2">
        <div><span class="t-label">Ambigüedad 1</span>Suscrito, ¿<em>cuándo</em>?</div>
        <div><span class="t-label">Ambigüedad 2</span>Último año, ¿<em>desde qué corte</em>?</div>
        <div><span class="t-label">Ambigüedad 3</span>Promedio, ¿<em>de qué</em>?</div>
      </div>
      <div class="a4-defs" data-step="2" id="a4-defs"></div>
      <div class="a4-agreed" data-step="3" id="a4-agreed"></div>`,
    onEnter(el) { a4RenderMetric(el); },
  },

  // ---------------------------------------------------------------- 23
  {
    id: 'consenso',
    title: 'El consenso como prueba',
    time: 80,
    particles: [
      { shape: 'split', opacity: 0.25 },
      { shape: 'split', opacity: 0.25 },
      { shape: 'a4-one', opacity: 0.3 },
      { shape: 'converge', opacity: 0.22 },
      { shape: 'converge', opacity: 0.35 },
    ],
    html: `
      <div class="t-label" style="margin-bottom:24px">El consenso como prueba · el ciclo de Ian · ilustrativo</div>
      <div class="a4-wrap">
        <div class="a4-loop" data-step-hide="3">
          <div class="a4-grid" id="a4-grid"></div>
          <div class="a4-side">
            <div class="t-label">Respuestas distintas</div>
            <div class="a4-count"><span class="c c0">4</span><span class="c c1">2</span><span class="c c2">1</span></div>
            <div class="a4-step">
              <div class="p0">Misma pregunta, cada interfaz y cada modelo.</div>
              <div class="p1">Lees cada traza. <em>Arreglas el contexto.</em> Repites.</div>
              <div class="p2"><em>Una sola.</em> Ahí sí, celebras.</div>
            </div>
          </div>
        </div>
        <div class="a4-ger" data-step="3" data-step-hide="4">
          <div class="t-label accent" style="margin-bottom:24px">Lo mismo en software</div>
          <div class="big">La IA también escribe las pruebas.</div>
          <div class="big dim" style="margin-top:28px">Pero la proporción de tiempo en pruebas vs. código <em>no cambió.</em></div>
          <div class="cite" style="margin-top:36px">Jarred Sumner, vía Gergely Orosz · LDX3 2026</div>
        </div>
        <div class="a4-final" data-step="4">
          <div class="big dim">La verificación no se abarató.</div>
          <div class="big accent" style="margin-top:12px">La producción sí.</div>
        </div>
      </div>`,
    onEnter(el) { a4RenderGrid(el); },
  },
]);

// ---- slide 22 renderer ------------------------------------------------------
function a4RenderMetric(el) {
  const M = window.METRIC_A;
  const defs = (M && Array.isArray(M.definitions) && M.definitions.length ? M.definitions : A4_PLACEHOLDER).slice(0, 3);
  el.querySelector('#a4-defs').innerHTML = defs.map((d, i) => `
    <div class="a4-def">
      <div class="a4-name"><span class="t-label accent">Definición ${'ABC'[i]}</span><br>${a4esc(d.label || '')}</div>
      <pre class="code a4-sql">${a4esc(d.sql || '')}</pre>
      <div class="a4-num">${a4fmt(d)}</div>
    </div>`).join('');
  const agreed = (M && M.defined) || { label: 'Definición acordada', sql: '-- definición con dueño y versión', value: null };
  el.querySelector('#a4-agreed').innerHTML = `
    <div>
      <div class="t-label accent">Definición acordada</div>
      <div class="a4-agreed-l" style="margin:10px 0 18px">${a4esc(agreed.label || '')}</div>
      <div class="a4-num">${a4fmt(agreed)}</div>
    </div>
    <pre class="code a4-sql">${a4esc(agreed.sql || '')}</pre>`;
}

// ---- slide 23 renderer ------------------------------------------------------
// Rows = interfaces, columns = models. Each cell shows an answer id per step:
// 4 distinct -> 2 distinct -> 1. Real values come from METRIC_A when present.
function a4RenderGrid(el) {
  const M = window.METRIC_A;
  const vals = (M && M.definitions) ? M.definitions.map((d) => d.value) : [];
  const word = (k) => (typeof vals[k] === 'number' ? vals[k].toFixed(1)
    : (M && M.defined && k === 9 ? a4fmt(M.defined) : ['a', 'b', 'c', 'd'][k]));
  const agreed = (M && M.defined && typeof M.defined.value === 'number') ? M.defined.value.toFixed(1) : 'a';
  const s0 = [0, 1, 2, 1, 0, 3, 2, 3, 1];
  const s1 = [0, 1, 0, 1, 0, 1, 0, 1, 1];
  const rows = ['Chat', 'Agente', 'BI'];
  let h = '<div></div>' + ['Modelo 1', 'Modelo 2', 'Modelo 3'].map((m) => `<div class="h">${m}</div>`).join('');
  rows.forEach((r, i) => {
    h += `<div class="h">${r}</div>`;
    for (let j = 0; j < 3; j++) {
      const k = i * 3 + j;
      h += `<div class="a4-cell"><span class="s0">${word(s0[k])}</span><span class="s1">${word(s1[k])}</span><span class="s2">${agreed}</span></div>`;
    }
  });
  el.querySelector('#a4-grid').innerHTML = h;
}
