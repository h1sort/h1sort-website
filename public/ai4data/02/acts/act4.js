// Act 4 · Cierre: memo de selección de modelo, siguiente sesión, gracias, fuentes.
(() => {
  Deck.css(`
    #s-memo .mm { display: grid; grid-template-columns: 1fr 1fr; gap: 72px; }
    #s-memo .mm ol { margin: 0; padding-left: 40px; }
    #s-memo .mm li { font-size: 32px; line-height: 1.35; padding: 10px 0; }
    #s-memo .mm li small { display: block; font-size: 26px; color: var(--dim); margin-top: 4px; }
    #s-memo .mm pre.code { font-size: 23px; }
    #s-memo .mm .t-small { margin-top: 26px; color: var(--dim); }

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

  Deck.act(5, 'Cierre', [
    {
      id: 'memo',
      title: 'Entregable · memo de selección',
      time: 300,
      particles: { shape: 'timeline', opacity: 0.14 },
      html: `
        <div class="t-label">Entregable · sesiones/02/memo-plantilla.md</div>
        <h2 class="t-title" style="margin-bottom:30px">Tu memo de selección de modelo</h2>
        <div class="mm">
          <ol>
            <li>La pregunta y quién la hace<small>¿Conteo, monto, juicio, explicación?</small></li>
            <li>Tu tabla de <span class="mono">compare.py</span><small>Modelos × estrategias, con los cuatro números.</small></li>
            <li>Tu elección: modelo, estrategia y lugar<small>Local, API o warehouse, y por qué.</small></li>
            <li>Costo por 1,000 preguntas<small>Y la latencia que vas a aceptar.</small></li>
            <li>Qué te haría cambiar de opinión<small>Datos sensibles, volumen, una pregunta nueva.</small></li>
          </ol>
          <div>
            <div class="t-label accent" style="margin-bottom:16px">Empieza aquí</div>
<pre class="code">uv run sesiones/02/lab-answer-strategies/compare.py</pre>
            <p class="t-small">Una página basta. Súbelo a tu fork del repo; lo retomamos cuando lleguemos a evals.</p>
          </div>
        </div>`,
    },
    {
      id: 'siguiente',
      title: 'Siguiente sesión',
      time: 90,
      particles: { shape: 'split', opacity: 0.14 },
      html: `
        <div class="t-label">Sesión 03 · LLMs vía chat e ingeniería de prompts para datos</div>
        <h2 class="t-title">Lo que sigue</h2>
        <div class="sg">
          <div><div class="t-label accent">Contexto</div><h3>Esquema y diccionario</h3><p>Lo que el modelo necesita saber de tus datos para escribir buen SQL desde el chat.</p></div>
          <div><div class="t-label accent">Ejemplos</div><h3>Few-shot</h3><p>Preguntas resueltas como guía, y cuánto mueven el marcador.</p></div>
          <div><div class="t-label accent">Ambigüedad</div><h3>"Cliente activo"</h3><p>Dos definiciones, dos números: el modelo debe preguntar en lugar de escoger.</p></div>
        </div>`,
    },
    {
      id: 'gracias',
      title: 'Gracias',
      time: 60,
      particles: { shape: 'converge', opacity: 0.3 },
      html: `
        <div class="g-l">
          <p class="g-line">El mejor modelo para tus datos no está en un leaderboard.</p>
          <p class="g-line" style="margin-top:36px">Está en tu tabla, con <em>tus</em> preguntas.</p>
          <div class="t-label" style="margin-top:70px">Gracias · Carlos Haro · @h1sort</div>
        </div>
        <div class="g-qrs">
          <div class="g-qr"><div class="tile"><img src="assets/qr-repo.svg" alt="QR del repositorio"></div><div class="url">github.com/h1sort/ai4data</div></div>
          <div class="g-qr"><div class="tile"><img src="assets/qr-slides.svg" alt="QR de las diapositivas"></div><div class="url">h1sort.com/ai4data/02</div></div>
          <div class="g-qr"><div class="tile"><img src="assets/qr-linkedin.svg" alt="QR LinkedIn"></div><div class="url">linkedin.com/in/h1sort</div></div>
          <div class="g-qr"><div class="tile"><img src="assets/qr-x.svg" alt="QR X"></div><div class="url">x.com/h1sort</div></div>
        </div>`,
    },
    {
      id: 'fuentes',
      title: 'Fuentes',
      time: 30,
      particles: { shape: 'grid', opacity: 0.1 },
      html: `
        <div class="t-label">Fuentes</div>
        <h2 class="t-title" style="margin-bottom:30px">Fuentes</h2>
        <ol>
          <li><b>Ollama</b>: docs.ollama.com, FAQ (ventana de contexto por defecto de 4,096 tokens, <span class="mono">OLLAMA_CONTEXT_LENGTH</span>) y "OpenAI compatibility" (la API compatible no permite fijar la ventana por llamada).</li>
          <li><b>Temperatura cero no es repetible</b>: Horace He y Thinking Machines Lab, "Defeating Nondeterminism in LLM Inference", 10 sep 2025, thinkingmachines.ai/blog (Qwen3-235B, 1,000 corridas a temperatura 0: 80 respuestas distintas; causa: kernels que no son invariantes al tamaño del lote).</li>
          <li><b>bonsai 2</b> (Prism ML): ollama.com/library/bonsai-2 (pesos ternarios; 9b, 3.2 GB; 4b, 1.6 GB; 256K de contexto; arquitectura qwen3.5 según <span class="mono">ollama show</span>; Ollama ≥ 0.40.6).</li>
          <li><b>Databricks</b>: docs.databricks.com, ai_query; foros de la comunidad: en Free Edition, ai_query funciona con modelos hospedados por Databricks.</li>
          <li><b>Modelos de decisión</b>: Jev, TypeSafe.</li>
          <li><b>Caso y set dorado</b>: caso/transacciones.csv y caso/set_dorado.jsonl de este repo.</li>
        </ol>`,
    },
  ]);
})();
