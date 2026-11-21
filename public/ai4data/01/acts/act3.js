// Acts 6–7 · Marcador v0 y cierre. Set dorado: caso/set_dorado.jsonl (answers checked in Python and SQL).
(() => {
  Deck.css(`
    #s-set-dorado .sd { display: grid; grid-template-columns: 640px 1fr; gap: 80px; }
    #s-set-dorado .sd-l p { font-size: 34px; color: var(--dim); line-height: 1.35; margin: 0 0 26px; }
    #s-set-dorado .sd-q { list-style: none; padding: 0; margin: 0; }
    #s-set-dorado .sd-q li { display: grid; grid-template-columns: 90px 1fr; padding: 20px 0; border-top: 2px solid var(--hair); font-size: 32px; line-height: 1.3; }
    #s-set-dorado .sd-q li:last-child { border-bottom: 2px solid var(--hair); }
    #s-set-dorado .sd-q .n { font-family: var(--mono); font-size: 24px; color: var(--accent); padding-top: 4px; }
    #s-set-dorado .sd-q .x { font-family: var(--mono); font-size: 22px; color: var(--faint); display: block; margin-top: 6px; }

    #s-lab-marcador pre.code { font-size: 23px; line-height: 1.55; }
    #s-lab-marcador pre.code .c { color: var(--faint); }

    #s-plantilla .pl { display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px; margin-top: 20px; }
    #s-plantilla .pl > div { border: var(--stroke) solid var(--faint); border-radius: 18px; padding: 28px 30px 34px; }
    #s-plantilla .pl .k { font-family: var(--mono); font-size: 22px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--accent); }
    #s-plantilla .pl .v { font-size: 88px; font-weight: 500; letter-spacing: -0.03em; margin: 18px 0 8px; color: var(--faint); }
    #s-plantilla .pl .d { font-size: 26px; color: var(--dim); line-height: 1.3; }
    #s-plantilla .pl-foot { margin-top: 48px; font-size: 34px; max-width: 1560px; line-height: 1.35; }

    #s-entregable .en { list-style: none; padding: 0; margin: 20px 0 0; max-width: 1500px; }
    #s-entregable .en li { display: grid; grid-template-columns: 80px 1fr; padding: 24px 0; border-top: 2px solid var(--hair); font-size: 40px; }
    #s-entregable .en li:last-child { border-bottom: 2px solid var(--hair); }
    #s-entregable .en .n { font-family: var(--mono); font-size: 26px; color: var(--accent); padding-top: 8px; }
    #s-entregable .en small { display: block; font-size: 28px; color: var(--dim); margin-top: 6px; }

    #s-siguiente .sg { display: grid; grid-template-columns: repeat(3, 1fr); gap: 44px; margin-top: 20px; }
    #s-siguiente .sg > div { border-top: 3px solid var(--fg); padding-top: 22px; }
    #s-siguiente .sg h3 { font-size: 44px; font-weight: 500; margin: 14px 0 14px; letter-spacing: -0.01em; }
    #s-siguiente .sg p { font-size: 29px; color: var(--dim); line-height: 1.35; margin: 0; }

    #s-gracias .g-l { position: absolute; left: var(--pad-x); top: 200px; width: 940px; }
    #s-gracias .g-line { font-size: 74px; font-weight: 500; letter-spacing: -0.03em; line-height: 1.08; margin: 0; }
    #s-gracias .g-qrs { position: absolute; right: var(--pad-x); top: 110px; display: grid; grid-template-columns: repeat(2, 300px); gap: 20px 56px; }
    #s-gracias .g-qr { text-align: center; }
    #s-gracias .g-qr .tile { width: 300px; height: 300px; padding: 18px; border-radius: 20px; background: #fff; }
    #s-gracias .g-qr img { width: 100%; height: 100%; display: block; image-rendering: pixelated; }
    #s-gracias .g-qr .url { margin-top: 12px; font-family: var(--mono); font-size: 20px; }

    #s-fuentes ol { margin: 0; padding-left: 36px; columns: 2; column-gap: 72px; }
    #s-fuentes li { font-size: 22px; line-height: 1.4; color: var(--dim); margin: 0 0 16px; break-inside: avoid; }
    #s-fuentes li b { color: var(--fg); font-weight: 500; }
  `);

  Deck.act(6, 'Marcador v0', [
    {
      id: 'set-dorado',
      title: 'El set dorado',
      time: 300,
      particles: { shape: 'grid', opacity: 0.14 },
      html: `
        <div class="t-label">caso/set_dorado.jsonl</div>
        <h2 class="t-title">El set dorado</h2>
        <div class="sd">
          <div class="sd-l">
            <p>Preguntas de negocio cuya respuesta <strong>ya conocemos</strong>, calculada con código.</p>
            <p data-step="1">Cada respuesta se calcula dos veces, en Python y en SQL, y deben coincidir.</p>
            <p data-step="2">Hoy son 10 sobre 500 transacciones. Crece cada módulo. Una parte se queda <em>escondida</em> para el proyecto final.</p>
          </div>
          <ul class="sd-q">
            <li><span class="n">P03</span><span>¿Cuál es el monto total vendido en marzo de 2026?<span class="x">suma con filtro de fecha</span></span></li>
            <li><span class="n">P05</span><span>¿Ticket promedio de los pagos con tarjeta, crédito o débito?<span class="x">promedio con filtro</span></span></li>
            <li><span class="n">P08</span><span>¿Qué fecha tuvo más transacciones?<span class="x">agrupar y ordenar</span></span></li>
            <li><span class="n">P10</span><span>¿Qué cliente gastó más en total?<span class="x">agrupar, sumar y ordenar</span></span></li>
          </ul>
        </div>`,
    },
    {
      id: 'lab-marcador',
      title: 'Lab · marcador v0',
      time: 900,
      label: 'Lab · 15 min',
      particles: { shape: 'swarm', opacity: 0.12 },
      html: `
        <div class="t-label">Lab · 15 minutos</div>
        <h2 class="t-title">Primera corrida contra el set dorado</h2>
        <div class="lab2">
<pre class="code"><span class="c"># la tabla completa (500 filas ≈ 18 mil tokens)
# va en el prompt de cada pregunta</span>
cd ai4data/sesiones/01/lab-marcador
python marcador.py \\
  --precio-entrada 0.15 \\
  --precio-salida 0.60 \\
  --k 3

<span class="c"># precios en USD por millón de tokens:
# los de tu proveedor y tu modelo</span></pre>
          <div class="r">
            <p class="t-small">10 preguntas × 3 corridas = 30 llamadas.</p>
            <p class="t-small">Sale <span class="mono accent">marcador_v0.json</span> con tus cuatro números. Súbelo a tu fork: es tu entregable.</p>
            <p class="t-small">¿Cuál pregunta falló más? ¿Por qué crees?</p>
          </div>
        </div>`,
    },
    {
      id: 'plantilla',
      title: 'Tu marcador v0',
      time: 240,
      particles: { shape: 's1-four', opacity: 0.25 },
      html: `
        <div class="t-label">marcador_v0.json · método: tabla completa en el prompt</div>
        <h2 class="t-title">Tu marcador v0</h2>
        <div class="pl">
          <div><div class="k">Exactitud</div><div class="v">__%</div><div class="d">de 30 respuestas</div></div>
          <div><div class="k">Consenso</div><div class="v">__%</div><div class="d">promedio entre preguntas</div></div>
          <div><div class="k">Costo</div><div class="v">$__</div><div class="d">por respuesta</div></div>
          <div><div class="k">Latencia</div><div class="v">__ s</div><div class="d">por respuesta</div></div>
        </div>
        <p class="pl-foot" data-step="1">Esta es tu <em>línea base</em>: el peor método razonable. Todo lo que construyas en el programa se compara contra estos cuatro números.</p>`,
    },
  ]);

  Deck.act(7, 'Cierre', [
    {
      id: 'entregable',
      title: 'Entregable',
      time: 120,
      particles: { shape: 'timeline', opacity: 0.15 },
      html: `
        <div class="t-label">Entregable de la sesión 01</div>
        <h2 class="t-title">Lo que entregas hoy</h2>
        <ol class="en">
          <li><span class="n">01</span><span>Tu modelo de sumas entrenado y su evaluación<small>la salida de evaluar_sumas.py, con tus tres porcentajes</small></span></li>
          <li><span class="n">02</span><span>Tu marcador v0<small>marcador_v0.json, en tu fork del repo</small></span></li>
          <li><span class="n">03</span><span>Una frase: ¿qué pregunta falló más y por qué?<small>en el README de tu fork</small></span></li>
        </ol>`,
    },
    {
      id: 'siguiente',
      title: 'Sesión 02',
      time: 120,
      particles: { shape: 'split', opacity: 0.15 },
      html: `
        <div class="t-label">Sesión 02</div>
        <h2 class="t-title">Elegir modelo para datos: costo, contexto y exactitud</h2>
        <div class="sg">
          <div><div class="t-label accent">01</div><h3>Tres familias</h3><p>Frontera, pequeños y abiertos, y modelos de decisión como Jev, que contestan con una etiqueta o una probabilidad, no con texto.</p></div>
          <div data-step="1"><div class="t-label accent">02</div><h3>Tres formas de contestar</h3><p>El modelo calcula, escribe SQL o llama una herramienta. Cuándo usar cada una.</p></div>
          <div data-step="2"><div class="t-label accent">03</div><h3>Tu memo</h3><p>Qué modelo, para qué pregunta y a qué costo, con tu marcador como evidencia.</p></div>
        </div>`,
    },
    {
      id: 'gracias',
      title: 'Gracias',
      time: 60,
      particles: { shape: 'converge', opacity: 0.3 },
      html: `
        <div class="g-l">
          <p class="g-line">El modelo aprendió cómo se ven los datos.</p>
          <p class="g-line" style="margin-top:36px">Saber si son <em>verdad</em> es trabajo nuestro. Hoy empezamos a medirlo.</p>
          <div class="t-label" style="margin-top:70px">Gracias · Carlos Haro · @h1sort</div>
        </div>
        <div class="g-qrs">
          <div class="g-qr"><div class="tile"><img src="assets/qr-repo.svg" alt="QR del repositorio"></div><div class="url">github.com/h1sort/ai4data</div></div>
          <div class="g-qr"><div class="tile"><img src="assets/qr-slides.svg" alt="QR de las diapositivas"></div><div class="url">h1sort.com/ai4data/01</div></div>
          <div class="g-qr"><div class="tile"><img src="assets/qr-linkedin.svg" alt="QR LinkedIn"></div><div class="url">linkedin.com/in/h1sort</div></div>
          <div class="g-qr"><div class="tile"><img src="assets/qr-x.svg" alt="QR X"></div><div class="url">x.com/h1sort</div></div>
        </div>`,
    },
    {
      id: 'fuentes',
      title: 'Fuentes',
      time: 0,
      particles: { shape: 'scatter', opacity: 0.1 },
      label: 'Fuentes',
      html: `
        <div class="t-label">Fuentes</div>
        <h2 class="t-title" style="font-size:64px;margin-bottom:30px">Fuentes</h2>
        <ol>
          <li><b>nanoGPT</b>, Andrej Karpathy, github.com/karpathy/nanoGPT (MIT). Su README recomienda nanochat desde nov 2025.</li>
          <li><b>Resultados del lab de nanoGPT</b>: corrida propia, 21 nov 2026, CPU de 2 núcleos, semillas fijas. Scripts en sesiones/01/lab-nanogpt.</li>
          <li><b>Tokenización</b>: medición propia con gpt-tokenizer (npm), codificaciones o200k_base y cl100k_base. sesiones/01/lab-tokens.</li>
          <li><b>Filas que caben</b>: aritmética propia con 37.3 tokens por fila del caso (200,000 / 37.3 y 1,000,000 / 37.3), sin instrucciones ni respuesta.</li>
          <li><b>No determinismo a temperatura 0</b>: Horace He y Thinking Machines Lab, "Defeating Nondeterminism in LLM Inference", 10 sep 2025. thinkingmachines.ai</li>
          <li><b>Salidas estructuradas</b>: OpenAI, "Introducing Structured Outputs in the API", 6 ago 2024; JSON Schema, json-schema.org.</li>
          <li><b>Caso y set dorado</b>: datos sintéticos generados para el programa. caso/generar_caso.py.</li>
          <li><b>Jev</b>: TypeSafe; detalle y fuentes en la sesión 02.</li>
        </ol>`,
    },
  ]);
})();
