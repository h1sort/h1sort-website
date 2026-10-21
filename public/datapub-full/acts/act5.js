// Acts 5 + 6 (slides 24–29): valor real vs. hype, predictions, close. See CONTRACT.md.
Deck.css(`
.a5-list { list-style: none; margin: 0; padding: 0; }
.a5-list li { display: grid; grid-template-columns: 110px 1fr; align-items: baseline; padding: 22px 0; border-top: 2px solid var(--hair); }
.a5-list li:last-child { border-bottom: 2px solid var(--hair); }
.a5-list .n { font-family: var(--mono); font-size: 24px; letter-spacing: 0.2em; color: var(--accent); }
.a5-list .tx { font-size: 42px; line-height: 1.2; letter-spacing: -0.01em; }
.a5-list .tx small { display: block; margin-top: 8px; font-family: var(--mono); font-size: 24px; letter-spacing: 0.06em; color: var(--dim); }
.a5-head { margin-bottom: 36px; }
.a5-head .t-label { margin-bottom: 18px; }
.a5-head h2 { margin: 0; font-size: 84px; font-weight: 500; letter-spacing: -0.025em; line-height: 1.05; }

/* 25: horror story */
#s-no-todo-llm { padding-top: 96px; }
#s-no-todo-llm .trail { position: absolute; left: 120px; right: 120px; top: 96px; display: flex; gap: 20px; flex-wrap: wrap; }
#s-no-todo-llm .stagebox { position: absolute; left: 120px; right: 120px; top: 190px; bottom: 150px; display: flex; flex-direction: column; justify-content: center; }
#s-no-todo-llm .panel { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: center; }
#s-no-todo-llm .big { font-size: 280px; font-weight: 500; letter-spacing: -0.045em; line-height: 0.95; margin: 0; }
#s-no-todo-llm .big.xl { font-size: 340px; }
#s-no-todo-llm .big.md { font-size: 200px; }
#s-no-todo-llm .cap { font-size: 44px; color: var(--dim); margin-top: 28px; line-height: 1.25; max-width: 1400px; }
#s-no-todo-llm .cap b { color: var(--fg); font-weight: 500; }
#s-no-todo-llm .two { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: end; }
#s-no-todo-llm .pun { font-size: 120px; font-weight: 500; letter-spacing: -0.035em; line-height: 1.02; margin: 0; }
#s-no-todo-llm .bench { display: flex; gap: 56px; margin-top: 48px; align-items: baseline; font-family: var(--mono); }
#s-no-todo-llm .bench .v { font-size: 64px; }
#s-no-todo-llm .bench .k { font-size: 22px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--dim); display: block; margin-bottom: 8px; }
#s-no-todo-llm .src { position: absolute; left: 0; bottom: 0; }

/* 27: predictions */
#s-predicciones-2029 .a5-list .tx { font-size: 36px; line-height: 1.22; }
#s-predicciones-2029 .a5-list li { padding: 17px 0; }
#s-predicciones-2029 .a5-list .tx small { font-size: 22px; margin-top: 6px; }
#s-predicciones-2029 .a5-head h2 { font-size: 64px; }
#s-predicciones-2029 .a5-head { margin-bottom: 20px; }
#s-predicciones-2029 .vf { position: absolute; inset: 40px; pointer-events: none; }
#s-predicciones-2029 .vf i { position: absolute; width: 90px; height: 90px; border: 0 solid var(--accent); }
#s-predicciones-2029 .vf i:nth-child(1) { left: 0; top: 0; border-width: 4px 0 0 4px; }
#s-predicciones-2029 .vf i:nth-child(2) { right: 0; top: 0; border-width: 4px 4px 0 0; }
#s-predicciones-2029 .vf i:nth-child(3) { left: 0; bottom: 0; border-width: 0 0 4px 4px; }
#s-predicciones-2029 .vf i:nth-child(4) { right: 0; bottom: 0; border-width: 0 4px 4px 0; }
#s-predicciones-2029 .shotlbl { position: absolute; right: 120px; top: 96px; }
#s-predicciones-2029 .shotlbl span { display: inline-block; background: #000; border: 2px solid var(--accent); border-radius: 999px; padding: 14px 36px;
   font-family: var(--mono); font-size: 32px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--accent); }
#s-predicciones-2029[data-at="6"] .a5-list > li { opacity: 1 !important; } /* room photo: all five bright */
#s-predicciones-2029 .a5-list { transition: opacity 0.5s var(--ease); }

/* 28: closing */
#s-cierre-birdman .ln1, #s-cierre-birdman .ln2 { font-size: 64px; line-height: 1.18; letter-spacing: -0.015em; max-width: 1500px; margin: 0; font-weight: 400; transition: opacity .5s var(--ease), color .5s; }
#s-cierre-birdman .ln3 { font-size: 112px; line-height: 1.04; letter-spacing: -0.03em; font-weight: 500; max-width: 1600px; margin: 0; }
#s-cierre-birdman .gap { height: 56px; }
#s-cierre-birdman[data-at="1"] .ln1 { opacity: 0.65; }
#s-cierre-birdman[data-at="2"] .ln1, #s-cierre-birdman[data-at="2"] .ln2 { opacity: 0.55; }
#s-cierre-birdman .yr { font-family: var(--mono); font-size: 24px; letter-spacing: 0.3em; color: var(--accent); display: block; margin-bottom: 14px; }

/* 29: thanks */
#s-gracias .qrwrap { position: absolute; right: 150px; top: 50%; transform: translateY(-50%); text-align: center; }
#s-gracias .qrbox { width: 440px; height: 440px; padding: 36px; border-radius: 22px; background: #fff; }
#s-gracias .qrbox img { width: 100%; height: 100%; display: block; image-rendering: pixelated; }
#s-gracias .qrwrap .t-label { margin-top: 24px; }
#s-gracias .url { font-family: var(--mono); font-size: 52px; letter-spacing: 0.01em; margin-top: 36px; }
#s-gracias .who { margin-top: 56px; line-height: 1.5; }
`);

const LI = (n, tx, sm, step) => `<li data-step="${step}"><span class="n">${n}</span><span class="tx">${tx}${sm ? `<small>${sm}</small>` : ''}</span></li>`;

Deck.act(5, 'Acto 5 · Valor real vs. hype', [
  {
    id: 'valor-real',
    title: 'Aporta valor real',
    time: 60,
    class: 'middle',
    particles: { shape: 'grid', opacity: 0.16 },
    html: `
      <div class="a5-head"><div class="t-label">Acto 5 · cinco señales</div><h2>Aporta <em>valor real</em></h2></div>
      <ul class="a5-list focus-last">
        ${LI('01', 'Definiciones con <em>dueño</em> y versión', 'capa semántica', 1)}
        ${LI('02', 'Herramientas que <em>cualquier agente</em> puede operar', 'APIs · MCP', 2)}
        ${LI('03', 'Evals que leen <em>trazas</em>, no solo respuestas', '', 3)}
        ${LI('04', 'Formatos <em>abiertos</em> + DuckDB', '', 4)}
        ${LI('05', 'Clasificadores <em>tipados</em> cuando la pregunta es un juicio, no un texto', 'Jev', 5)}
      </ul>`,
  },
  {
    id: 'no-todo-llm',
    title: 'No todo necesita un LLM',
    time: 100,
    class: '',
    steps: 5,
    particles: [{ shape: 'swarm', opacity: 0.18 }, { shape: 'swarm', opacity: 0.18 }, { shape: 'swarm', opacity: 0.18 }, { shape: 'swarm', opacity: 0.18 }, { shape: 'swarm', opacity: 0.18 }, { shape: 'swarm', opacity: 0.18 }],
    html: `
      <div class="trail">
        <span class="chip" data-step="2">250 mil títulos</span>
        <span class="chip" data-step="3">NULL · reintento / 30 min</span>
        <span class="chip" data-step="4">2 semanas</span>
        <span class="chip" data-step="5">tokens · créditos</span>
      </div>
      <div class="stagebox">
        <div class="panel" data-step-only="0">
          <div class="t-label" style="margin-bottom:28px">Una historia de terror · Snowflake AI_CLASSIFY</div>
          <h2 class="t-hero" style="font-size:150px">No todo necesita <em>un LLM</em></h2>
        </div>
        <div class="panel" data-step-only="1">
          <p class="big xl">~250 mil</p>
          <p class="cap"><b>títulos de puesto</b> por clasificar en persona y función.</p>
        </div>
        <div class="panel" data-step-only="2">
          <p class="big xl"><em>NULL</em></p>
          <p class="cap">Un bug devuelve vacíos. El reintento <b>los manda otra vez al modelo, cada 30 minutos</b>. En dev.</p>
        </div>
        <div class="panel" data-step-only="3">
          <p class="big xl">2 semanas</p>
          <p class="cap">Reintentando <b>cada 30 minutos</b>. En un ambiente de dev.</p>
        </div>
        <div class="panel" data-step-only="4">
          <p class="big md">~44 mil millones</p>
          <p class="cap" style="margin-top:8px;font-size:56px"><b>de tokens</b></p>
          <p class="big md" style="margin-top:40px"><em>~61,600</em></p>
          <p class="cap" style="margin-top:8px;font-size:56px"><b>créditos</b></p>
        </div>
        <div class="panel" data-step-only="5">
          <p class="pun">Un clasificador tipado hace el mismo trabajo por <em>centavos</em>.</p>
          <div class="bench">
            <span><span class="k">4 mil títulos · Jev</span><span class="v accent">$0.16</span></span>
            <span><span class="k">el LLM</span><span class="v">$11–21</span></span>
          </div>
        </div>
      </div>
      <div class="cite foot" style="left:120px">ASTRONOMER · "WHAT JEV WILL DO TO DATA ENGINEERING" · SEP 2026</div>`,
  },
  {
    id: 'vive-del-hype',
    title: 'Vive del hype',
    time: 60,
    class: 'middle',
    particles: { shape: 'scatter', opacity: 0.2 },
    html: `
      <div class="a5-head"><div class="t-label">Acto 5 · desconfía cuando…</div><h2>Vive del <em>hype</em></h2></div>
      <ul class="a5-list focus-last">
        ${LI('01', 'Un proveedor quiere que uses <em>su</em> agente', '', 1)}
        ${LI('02', 'Agentes conectados a datos crudos, <em>sin definiciones</em>', '', 2)}
        ${LI('03', '"Migra todo, <em>ahora hay IA</em>"', '', 3)}
        ${LI('04', 'Zombie reviews: <em>todos aprueban, nadie lee</em>', 'Gergely Orosz · LDX3 2026', 4)}
        ${LI('05', 'Su gemelo de datos: <em>zombie dashboards</em>', '', 5)}
      </ul>`,
  },
  {
    id: 'predicciones-2029',
    title: 'Predicciones para el episodio 3 (2029)',
    time: 80,
    class: 'middle',
    particles: { shape: 'grid', opacity: 0.18 },
    html: `
      <div class="a5-head"><div class="t-label">Episodio 3 · 2029 · manos arriba</div><h2>Predicciones para <em>2029</em></h2></div>
      <ul class="a5-list focus-last">
        ${LI('01', 'Aprender un lenguaje de programación seguirá siendo útil.', 'ref: Gergely Orosz · LDX3 2026', 1)}
        ${LI('02', 'Todos van a necesitar habilidades de ingeniería y ciencia de datos.', 'ref: swyx', 2)}
        ${LI('03', 'La IA frenará temporalmente la contratación de talento nuevo, y se ajustará cuando quede claro que ser AI-native es una habilidad profunda.', 'ref: Gergely Orosz · LDX3 2026', 3)}
        ${LI('04', 'Los roles se reorganizan por arquetipo, no por función.', 'ref: Boris Cherny', 4)}
        ${LI('05', 'Democratización de stacks: competencia feroz y proveedores de datos convertidos en commodity.', '', 5)}
      </ul>
      <div data-step="6"><div class="vf"><i></i><i></i><i></i><i></i></div><div class="shotlbl"><span>Foto del público</span></div></div>`,
  },
]);

Deck.act(6, 'Cierre', [
  {
    id: 'cierre-birdman',
    title: 'Birdman · el criterio',
    time: 90,
    class: 'middle',
    particles: { shape: 'scatter', opacity: 0.3 },
    html: `
      <div class="t-label" style="margin-bottom:44px">Birdman · Riggan · The Data Pub</div>
      <p class="ln1"><span class="yr">2023</span>En 2023 les dije que la ignorancia tenía una virtud inesperada.</p>
      <div class="gap"></div>
      <p class="ln2" data-step="1"><span class="yr">2026</span>En 2026 la ignorancia se cura en una tarde.</p>
      <div class="gap"></div>
      <p class="ln3" data-step="2">Lo que no se cura en una tarde es <em>el criterio.</em></p>`,
  },
  {
    id: 'gracias',
    title: 'Gracias',
    time: 30,
    class: 'middle',
    particles: { shape: 'scatter', opacity: 0.3 },
    html: `
      <div>
        <div class="t-label" style="margin-bottom:28px">Post-AI Data Stack · Episodio 2</div>
        <h2 class="t-hero" style="font-size:230px">Gracias</h2>
        <div class="url accent">h1sort.com/datapub</div>
        <div class="who t-small dim">Carlos Haro · The Data Pub · CDMX · 21 oct 2026</div>
      </div>
      <div class="qrwrap" data-step="1">
        <div class="qrbox"><img src="assets/qr-slides.svg" alt="QR h1sort.com/datapub"></div>
        <div class="t-label">Escanea</div>
      </div>`,
  },
]);
