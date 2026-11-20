// Act 1 · Seis hechos estilizados. Each: the fact (headline) · the evidence (visual) · the labor reading.
(() => {
  Deck.css(`
    .f-slide { padding-top: 84px; }
    .f-head .t-label { margin-bottom: 14px; }
    .f-head h2 { font-size: 92px; font-weight: 500; letter-spacing: -0.035em; line-height: 1.02; margin: 0; max-width: 1650px; }
    .f-read { position: absolute; left: var(--pad-x); right: 440px; top: 776px; font-size: 36px; line-height: 1.25; letter-spacing: -0.01em; }
    .f-read .t-label { display: block; font-size: 20px; color: var(--accent); margin-bottom: 8px; letter-spacing: 0.24em; }
    .f-src { position: absolute; left: var(--pad-x); right: 440px; bottom: 92px; font-family: var(--mono); font-size: 19px; color: var(--faint); letter-spacing: 0.03em; line-height: 1.35; }
    .tag-own { display: inline-block; font-family: var(--mono); font-size: 20px; letter-spacing: 0.16em; text-transform: uppercase; border: var(--stroke) solid var(--accent); color: var(--accent); border-radius: 999px; padding: 4px 14px; margin-left: 16px; vertical-align: middle; }

    /* 01 adopción: 100 people, ~5 pay */
    #s-h1 .ppl { position: absolute; left: var(--pad-x); top: 310px; }
    #s-h1 .ppl circle { fill: var(--faint); opacity: 0.55; transition: fill .6s var(--ease), opacity .6s var(--ease), transform .8s var(--ease); transform-box: fill-box; transform-origin: center; }
    #s-h1:not([data-at="0"]) .ppl .pay { fill: var(--accent); opacity: 1; transform: scale(1.35); }
    #s-h1 .nums { position: absolute; left: 1010px; right: var(--pad-x); top: 310px; display: grid; gap: 0; }
    #s-h1 .nums > div { border-top: 2px solid var(--hair); padding: 16px 0 18px; display: grid; grid-template-columns: 330px 1fr; align-items: baseline; }
    #s-h1 .nums > div:last-child { border-bottom: 2px solid var(--hair); }
    #s-h1 .nums .big { font-size: 84px; font-weight: 500; letter-spacing: -0.035em; line-height: 1; }
    #s-h1 .nums .acc .big { color: var(--accent); }
    #s-h1 .nums .cap { font-size: 28px; color: var(--dim); line-height: 1.25; }

    /* 02 tarea: one job, five tasks; some get cheap, the job stays */
    #s-h2 .job { position: absolute; left: var(--pad-x); right: var(--pad-x); top: 360px; }
    #s-h2 .job .lbl { font-family: var(--mono); font-size: 22px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--dim); margin-bottom: 14px; }
    #s-h2 .bar { display: flex; height: 150px; gap: 8px; }
    #s-h2 .bar > div { flex: var(--w); border: var(--stroke) solid var(--faint); border-radius: 12px; padding: 16px 18px; font-size: 30px; line-height: 1.15;
      display: flex; flex-direction: column; justify-content: space-between; transition: flex 1.1s var(--ease), border-color .6s, color .6s; overflow: hidden; white-space: nowrap; }
    #s-h2 .bar > div small { font-family: var(--mono); font-size: 20px; letter-spacing: 0.1em; color: var(--faint); }
    #s-h2:not([data-at="0"]) .bar .cheap { flex: calc(var(--w) * 0.5); font-size: 26px; border-color: var(--accent); color: var(--accent); }
    #s-h2 .bar .cheap small { transition: opacity .4s; }
    #s-h2:not([data-at="0"]) .bar .cheap small { opacity: 0; }
    #s-h2 .free { display: flex; align-items: center; justify-content: center; border: var(--stroke) dashed var(--hair) !important; color: var(--faint); font-family: var(--mono); font-size: 22px !important; letter-spacing: 0.14em; text-transform: uppercase; flex: 0 !important; padding: 0 !important; opacity: 0; }
    #s-h2:not([data-at="0"]) .free { flex: 2.3 !important; opacity: 1; padding: 16px 18px !important; }
    #s-h2 .q { position: absolute; left: var(--pad-x); right: var(--pad-x); top: 600px; font-size: 44px; letter-spacing: -0.015em; line-height: 1.2; }

    /* 03 primer escalón: the ladder loses its bottom rung */
    #s-h3 .lad { position: absolute; left: 150px; top: 290px; width: 360px; height: 425px; }
    #s-h3 .lad .rail { stroke: var(--faint); stroke-width: 4; }
    #s-h3 .lad .rung { stroke: var(--fg); stroke-width: 6; stroke-linecap: round; }
    #s-h3 .lad .gone { stroke: var(--bad); stroke-width: 6; stroke-dasharray: 14 12; stroke-linecap: round; transition: opacity .8s var(--ease); }
    #s-h3[data-at="0"] .lad .gone { stroke: var(--fg); stroke-dasharray: none; }
    #s-h3 .lad .new { stroke: var(--accent); stroke-width: 7; stroke-linecap: round; transition: opacity .8s var(--ease); }
    #s-h3 .lad .newlbl { fill: var(--accent); font-family: var(--mono); font-size: 26px; letter-spacing: 0.08em; }
    #s-h3 .lad .nwrap { opacity: 0; transition: opacity .8s var(--ease); }
    #s-h3[data-at="3"] .lad .nwrap { opacity: 1; }
    #s-h3 .lad { overflow: visible; }
    #s-h3 .nums { position: absolute; left: 720px; right: var(--pad-x); top: 300px; }
    #s-h3 .nums .row2 { display: grid; grid-template-columns: 300px 1fr; align-items: baseline; padding: 12px 0; border-top: 2px solid var(--hair); }
    #s-h3 .nums .row2:last-child { border-bottom: 2px solid var(--hair); }
    #s-h3 .nums .good2 .big { color: var(--good); }
    #s-h3 .nums .big { font-size: 92px; font-weight: 500; letter-spacing: -0.04em; line-height: 1; }
    #s-h3 .nums .bad2 .big { color: var(--bad); }
    #s-h3 .nums .cap { font-size: 31px; color: var(--dim); line-height: 1.25; }
    #s-h3 .nums .cap b { color: var(--fg); font-weight: 500; }
    #s-h3 .aug { position: absolute; left: 720px; right: var(--pad-x); top: 640px; font-size: 38px; letter-spacing: -0.01em; line-height: 1.2; }

    /* 04 producir → juzgar */
    #s-h4 .chain { position: absolute; left: var(--pad-x); right: var(--pad-x); top: 380px; display: grid; grid-template-columns: 1fr 70px 1fr 70px 1fr; align-items: stretch; }
    #s-h4 .chain .b { border: var(--stroke) solid var(--faint); border-radius: 18px; padding: 26px 30px; }
    #s-h4 .chain .b .t-label { display: block; font-size: 20px; margin-bottom: 10px; }
    #s-h4 .chain .b .v { font-size: 54px; font-weight: 500; letter-spacing: -0.02em; }
    #s-h4 .chain .b p { font-size: 28px; color: var(--dim); margin: 10px 0 0; line-height: 1.25; }
    #s-h4 .chain .b.acc { border-color: var(--accent); box-shadow: 0 0 0 6px var(--accent-dim); }
    #s-h4 .chain .b.acc .v { color: var(--accent); }
    #s-h4 .chain .ar { display: flex; align-items: center; justify-content: center; font-family: var(--mono); font-size: 34px; color: var(--faint); }
    #s-h4 .then { position: absolute; left: var(--pad-x); right: var(--pad-x); top: 660px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; font-size: 36px; line-height: 1.25; }
    #s-h4 .then .t-label { display: block; font-size: 20px; margin-bottom: 8px; }
    #s-h4 .then .now .t-label { color: var(--accent); }
    #s-h4 .then .before { color: var(--dim); }

    /* 05 construir */
    #s-h5 .f-head h2 { font-size: 76px; }
    #s-h5 .f-read { top: 790px; }
    #s-h5 .two { position: absolute; left: var(--pad-x); right: var(--pad-x); top: 318px; display: grid; grid-template-columns: 1fr 1fr; gap: 56px; }
    #s-h5 .two .t-label { display: block; font-size: 20px; margin-bottom: 14px; }
    #s-h5 pre.code { font-size: 23px; line-height: 1.42; border-color: var(--faint); }
    #s-h5 pre.code .c { color: var(--faint); }
    #s-h5 pre.code .warn { color: var(--bad); font-weight: 700; }
    #s-h5 .right .t-label { color: var(--accent); }
    #s-h5 .glass { border: var(--stroke) solid var(--accent); border-radius: 14px; padding: 18px 28px 22px; }
    #s-h5 .glass .nm { font-size: 36px; font-weight: 500; }
    #s-h5 .glass .nm small { font-size: 26px; color: var(--dim); font-weight: 400; }
    #s-h5 .glass .st { display: grid; grid-template-columns: repeat(3, 1fr); margin-top: 16px; }
    #s-h5 .glass .st div { border-top: 2px solid var(--hair); padding-top: 12px; }
    #s-h5 .glass .st b { display: block; font-size: 64px; font-weight: 500; letter-spacing: -0.03em; line-height: 1; }
    #s-h5 .glass .st span { font-size: 24px; color: var(--dim); }
    #s-h5 .glass .quote { margin-top: 16px; font-size: 26px; color: var(--dim); line-height: 1.3; }

    /* 06 la entrada pone el techo: the same receipt, three scans */
    #s-h6 .scans { position: absolute; left: var(--pad-x); right: var(--pad-x); top: 330px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 48px; }
    #s-h6 .sc .t-label { display: block; font-size: 20px; margin-bottom: 12px; }
    #s-h6 .doc { position: relative; height: 270px; border-radius: 6px; background: #f2efe6; color: #111; padding: 22px 26px; font-family: var(--mono); font-size: 21px; line-height: 1.45; overflow: hidden; }
    #s-h6 .doc .h { font-weight: 700; font-size: 23px; margin-bottom: 6px; }
    #s-h6 .doc .r { display: flex; justify-content: space-between; }
    #s-h6 .doc .tot { border-top: 2px solid #111; margin-top: 8px; padding-top: 6px; font-weight: 700; }
    #s-h6 .m .doc { filter: blur(1.4px) contrast(0.75) brightness(0.92); transform: rotate(-2.2deg); background: #e4dfd2; }
    #s-h6 .b .doc { filter: blur(3.6px) contrast(0.5) brightness(0.8); transform: rotate(4deg) scale(1.03); background: #cfc8b6; }
    #s-h6 .b .doc::after { content: ""; position: absolute; inset: 0; background: linear-gradient(115deg, transparent 30%, rgba(0,0,0,0.45) 55%, transparent 75%); }
    #s-h6 .cer { margin-top: 18px; font-size: 32px; }
    #s-h6 .cer b { font-size: 56px; font-weight: 500; letter-spacing: -0.02em; display: block; line-height: 1.05; }
    #s-h6 .g .cer b { color: var(--good); }
    #s-h6 .m .cer b { color: var(--accent); }
    #s-h6 .b .cer b { color: var(--bad); }
    #s-h6 .cer span { font-size: 24px; color: var(--dim); }
  `);

  const head = (n, txt, own = false) => `<div class="f-head"><div class="t-label">Hecho estilizado ${n} · de 06${own ? '<span class="tag-own">observación propia</span>' : ''}</div><h2>${txt}</h2></div>`;
  const read = (tx, step) => `<div class="f-read" data-step="${step}"><span class="t-label">Lectura laboral</span>${tx}</div>`;

  const people = (() => {
    const pay = new Set([7, 23, 41, 66, 88]); let o = '';
    for (let i = 0; i < 100; i++) {
      const x = 22 + (i % 10) * 84, y = 22 + Math.floor(i / 10) * 44;
      o += `<circle${pay.has(i) ? ' class="pay"' : ''} cx="${x}" cy="${y}" r="15"/>`;
    }
    return `<svg class="ppl" width="820" height="440" viewBox="0 0 820 440">${o}</svg>`;
  })();

  const ladder = `<svg class="lad" width="440" height="520" viewBox="0 0 440 520">
      <line class="rail" x1="80" y1="0" x2="80" y2="520"/><line class="rail" x1="360" y1="0" x2="360" y2="520"/>
      ${[40, 140, 240, 340].map((y) => `<line class="rung" x1="80" y1="${y}" x2="360" y2="${y}"/>`).join('')}
      <line class="gone" x1="80" y1="460" x2="360" y2="460"/>
      <g class="nwrap"><line class="new" x1="80" y1="90" x2="360" y2="90"/><text class="newlbl" x="378" y="62">revisar</text><text class="newlbl" x="378" y="98">evaluar</text><text class="newlbl" x="378" y="134">medir</text></g>
    </svg>`;

  const receipt = `<div class="h">TIENDA LA ESQUINA</div><div>RFC XAXX010101000</div><div>20/11/2026 09:41</div>
      <div class="r"><span>CAFE AMERICANO</span><span>45.00</span></div>
      <div class="r"><span>PAN DULCE x2</span><span>36.00</span></div>
      <div class="r tot"><span>TOTAL</span><span>$81.00</span></div>`;

  Deck.act(1, 'Seis hechos estilizados', [
    {
      id: 'h1',
      title: '01 · La adopción es ancha y poco profunda',
      time: 150,
      class: 'f-slide',
      particles: { shape: 'scatter', opacity: 0.12 },
      counter: '01 / 06',
      html: `
        ${head('01', 'La adopción es ancha <em>y poco profunda</em>.')}
        ${people}
        <div class="nums">
          <div><span class="big">1,000 M</span><span class="cap">usuarios semanales de ChatGPT (ago. 2026)</span></div>
          <div class="acc" data-step="1"><span class="big">50 M</span><span class="cap">pagan una suscripción (feb. 2026)</span></div>
          <div class="acc" data-step="1"><span class="big">3–6 %</span><span class="cap">de los usuarios de IA pagan, según la fuente</span></div>
        </div>
        ${read('La brecha no es entre quien usa IA y quien no. Es entre quien la usa a fondo, con buenas herramientas, y todos los demás.', 2)}
        <div class="f-src">OpenAI (feb. y ago. 2026) · Menlo Ventures, 2025: The State of Consumer AI (≈3%, encuesta EE. UU. extrapolada)</div>`,
    },
    {
      id: 'h2',
      title: '02 · Se abarata la tarea, no el puesto',
      time: 150,
      class: 'f-slide',
      particles: { shape: 'grid', opacity: 0.1 },
      counter: '02 / 06',
      html: `
        ${head('02', 'Se abarata la tarea, <em>no el puesto</em>.')}
        <div class="job">
          <div class="lbl">Un puesto de análisis · ilustrativo</div>
          <div class="bar">
            <div class="cheap" style="--w:2.2">Buscar<small>tarea</small></div>
            <div class="cheap" style="--w:2.4">Redactar<small>tarea</small></div>
            <div style="--w:2">Analizar<small>tarea</small></div>
            <div style="--w:1.6">Decidir<small>tarea</small></div>
            <div style="--w:1.6">Explicar<small>tarea</small></div>
            <div class="free">tiempo liberado</div>
          </div>
        </div>
        <div class="q" data-step="1">El puesto sigue ahí. Cambia <em>cuántos</em> se contratan y <em>quiénes</em>.</div>
        ${read('El ajuste se ve en el empleo, no en los salarios. La IA no está borrando ocupaciones: cambia a quién contratan.', 2)}
        <div class="f-src">Brynjolfsson, Chandar y Chen, «Canaries in the Coal Mine?» (Stanford, 2025): el ajuste ocurre sobre todo por empleo, no por compensación</div>`,
    },
    {
      id: 'h3',
      title: '03 · El ajuste cae en el primer escalón',
      time: 150,
      class: 'f-slide',
      particles: { shape: 'scatter', opacity: 0.1 },
      counter: '03 / 06',
      html: `
        ${head('03', 'El ajuste cae en el <em>primer escalón</em>.')}
        ${ladder}
        <div class="nums">
          <div class="row2 bad2" data-step="1"><span class="big">−13 %</span><span class="cap">empleo relativo de <b>22 a 25 años</b> en las ocupaciones más expuestas a IA</span></div>
          <div class="row2" data-step="1"><span class="big">≈ 0</span><span class="cap"><b>Con más experiencia</b>, mismas ocupaciones: estable o creciendo</span></div>
          <div class="row2 good2" data-step="3"><span class="big">↑</span><span class="cap">Donde la IA <b>aumenta</b> en vez de automatizar, el empleo <b>crece</b></span></div>
        </div>
        ${read('El primer escalón cambia de forma: ya no es hacer el trabajo pesado, es demostrar que sabes revisarlo. <em>Llega con historial.</em>', 2)}

        <div class="f-src">Brynjolfsson, Chandar y Chen (Stanford, ago. 2025), datos de nómina de ADP, EE. UU.: programación, atención a clientes, análisis de datos</div>`,
    },
    {
      id: 'h4',
      title: '04 · El valor se mueve de producir a juzgar',
      time: 150,
      class: 'f-slide',
      particles: { shape: 'ring', opacity: 0.12 },
      counter: '04 / 06',
      html: `
        ${head('04', 'El valor se mueve de producir <em>a juzgar</em>.', true)}
        <div class="chain">
          <div class="b"><span class="t-label">El modelo</span><div class="v">propone</div><p>Barato, rápido, abundante</p></div><div class="ar">→</div>
          <div class="b" data-step="1"><span class="t-label">El sistema</span><div class="v">dispone</div><p>Qué se permite, qué se mide</p></div><div class="ar" data-step="1">→</div>
          <div class="b acc" data-step="2"><span class="t-label">Una persona</span><div class="v">responde</div><p>Por el resultado</p></div>
        </div>
        <div class="then" data-step="3">
          <div class="before"><span class="t-label">Antes</span>Hacer el análisis, escribir el código, armar el reporte.</div>
          <div class="now"><span class="t-label">Ahora</span>Definir qué se permite, medir si funciona y saber cuándo una respuesta que se ve bien está mal.</div>
        </div>`,
    },
    {
      id: 'h5',
      title: '05 · Construir parece descentralizarse; lo serio se centraliza',
      time: 180,
      class: 'f-slide',
      particles: [{ shape: 'swarm', opacity: 0.25 }, { shape: 'swarm', opacity: 0.25 }, { shape: 'one', opacity: 0.2 }],
      counter: '05 / 06',
      html: `
        ${head('05', 'Construir parece descentralizarse. <em>Lo serio se centraliza.</em>')}
        <div class="two">
          <div>
            <span class="t-label">Lo que construye cada quien</span>
            <pre class="code"><span class="c"># skill: conciliar_pagos.md</span>
1. Descarga el reporte del día
2. Cruza contra el estado de cuenta
...
<span class="warn">8. ⚠ CUIDADO CON EL PASO 8.
   NUNCA ENVÍES SIN REVISAR.</span></pre>
            <p style="font-size:30px;margin:14px 0 0;line-height:1.22" data-step="1">Las mayúsculas no son un control. Son la confesión de que <em>el control no existe</em>.</p>
          </div>
          <div class="right" data-step="2">
            <span class="t-label">Lo que construye la empresa</span>
            <div class="glass"><div class="nm">Ramp · Glass <small>espacio interno de IA, abierto en oct. 2026</small></div>
              <div class="st"><div><b>323</b><span>personas</span></div><div><b>6,500+</b><span>ediciones</span></div><div><b>350+</b><span>skills</span></div></div>
              <div class="quote">Glyman: cuando alguien encuentra un mejor flujo, todo su equipo lo obtiene.</div></div>
          </div>
        </div>
        ${read('Tu mejor flujo de trabajo es de la empresa en cuanto lo compartes. El valor se mueve al equipo que construye la plataforma.', 3)}
        <div class="f-src">Cifras reportadas por Ramp (E. Glyman, oct. 2026), sin auditoría externa · Ejemplo de skill: ilustrativo</div>`,
    },
    {
      id: 'h6',
      title: '06 · La calidad de la entrada pone el techo',
      time: 150,
      class: 'f-slide',
      particles: { shape: 'scatter', opacity: 0.1 },
      counter: '06 / 06',
      html: `
        ${head('06', 'La calidad de la entrada <em>pone el techo</em>.')}
        <div class="scans">
          <div class="sc g"><span class="t-label">Foto buena</span><div class="doc">${receipt}</div>
            <div class="cer" data-step="1"><b>&lt; 1 %</b><span>error por carácter</span></div></div>
          <div class="sc m"><span class="t-label">Foto media</span><div class="doc">${receipt}</div>
            <div class="cer" data-step="1"><b>varía</b><span>difícil de predecir sin probar</span></div></div>
          <div class="sc b"><span class="t-label">Foto mala</span><div class="doc">${receipt}</div>
            <div class="cer" data-step="1"><b>5–20 %</b><span>error por carácter</span></div></div>
        </div>
        ${read('El OCR está resuelto en la foto buena. Estratificar, decidir qué va a una persona y pedir una mejor foto sigue siendo trabajo humano.', 2)}
        <div class="f-src">Rangos típicos de error por carácter: CodeSOTA, OCR capabilities · GlotOCR Bench (2026): todos los modelos caen con imágenes degradadas · Recibo: ilustrativo</div>`,
    },
  ]);
})();
