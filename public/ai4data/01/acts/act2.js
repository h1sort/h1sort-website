// Acts 3–5 · Tokens, no determinismo y salidas estructuradas.
// Token splits: lab-tokens/tokens.mjs (gpt-tokenizer, o200k_base and cl100k_base agree on every example).
(() => {
  const tk = (parts) => parts.map((p) => `<span class="tk">${p}</span>`).join('');
  const EX = [
    ['1234567', ['123', '456', '7'], 'agrupa de izquierda a derecha, no por miles'],
    ['2026-11-21', ['202', '6', '-', '11', '-', '21'], 'el año queda partido'],
    ['$1,249.50', ['$', '1', ',', '249', '.', '50'], 'seis piezas para un monto'],
    ['CLI-0164', ['CLI', '-', '016', '4'], 'el ID tampoco es una unidad'],
  ];

  Deck.css(`
    #s-tokens-numeros .tn { list-style: none; padding: 0; margin: 10px 0 0; }
    #s-tokens-numeros .tn li { display: grid; grid-template-columns: 420px 1fr 520px; align-items: center; padding: 20px 0; border-top: 2px solid var(--hair); }
    #s-tokens-numeros .tn li:last-child { border-bottom: 2px solid var(--hair); }
    #s-tokens-numeros .src { font-family: var(--mono); font-size: 44px; }
    #s-tokens-numeros .d { font-size: 28px; color: var(--dim); }
    .tk { display: inline-block; font-family: var(--mono); font-size: 38px; border: 2px solid var(--faint); border-radius: 10px; padding: 2px 14px; margin: 4px 8px 4px 0; }
    .tk:nth-child(even) { border-color: var(--accent); color: var(--accent); }

    #s-tokens-fila .row { display: flex; flex-wrap: wrap; font-family: var(--mono); margin: 6px 0 44px; max-width: 1680px; }
    #s-tokens-fila .row .tk { font-size: 28px; padding: 0 8px; margin: 3px 4px 3px 0; }
    #s-tokens-fila .tf { display: grid; grid-template-columns: repeat(3, 1fr); gap: 48px; }
    #s-tokens-fila .tf > div { border-top: 3px solid var(--fg); padding-top: 20px; }
    #s-tokens-fila .tf .big { font-size: 104px; font-weight: 500; letter-spacing: -0.03em; line-height: 1; margin: 14px 0 10px; }
    #s-tokens-fila .tf .d { font-size: 28px; color: var(--dim); line-height: 1.3; }

    #s-ddia .dd-svg { position: absolute; left: var(--pad-x); top: 190px; }
    #s-ddia .bk rect { fill: #000; stroke: var(--fg); stroke-width: 2; }
    #s-ddia .bk text { fill: var(--dim); font-family: var(--mono); font-size: 22px; letter-spacing: 0.08em; }
    #s-ddia .dd-cap { position: absolute; top: 778px; width: 440px; font-size: 26px; color: var(--dim); text-align: center; margin-left: 0; }
    #s-ddia .dd-cap b { display: block; font-size: 40px; font-weight: 500; color: var(--fg); margin-top: 4px; }
    #s-tokens-costo .f { font-size: 72px; font-weight: 500; letter-spacing: -0.02em; line-height: 1.2; margin: 40px 0 50px; }
    #s-tokens-costo .f .op { color: var(--faint); font-weight: 400; margin: 0 22px; }
    #s-tokens-costo .live { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; }
    #s-tokens-costo .live > div { border: var(--stroke) dashed var(--faint); border-radius: 18px; padding: 24px 30px; }
    #s-tokens-costo .live .k { font-family: var(--mono); font-size: 22px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--dim); }
    #s-tokens-costo .live .v { font-size: 64px; font-weight: 500; margin-top: 10px; }

    #s-no-sumes .ns { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; margin-top: 20px; }
    #s-no-sumes .ns > div { border-top: 3px solid var(--fg); padding-top: 22px; }
    #s-no-sumes .ns h3 { font-size: 46px; font-weight: 500; margin: 12px 0 20px; letter-spacing: -0.02em; }
    #s-no-sumes pre.code { font-size: 26px; }

    .lab2 { display: grid; grid-template-columns: 1.2fr 1fr; gap: 56px; }
    .lab2 pre.code { font-size: 22px; line-height: 1.55; }
    .lab2 pre.code .c { color: var(--faint); }
    .lab2 .r .t-small { color: var(--dim); }

    #s-modelos-de-otros .mo { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; margin-top: 10px; }
    #s-modelos-de-otros .mo > div { border-top: 3px solid var(--fg); padding-top: 20px; }
    #s-modelos-de-otros .mo .big { font-size: 130px; font-weight: 500; letter-spacing: -0.04em; line-height: 1; margin: 16px 0 12px; }
    #s-modelos-de-otros .mo p { font-size: 30px; color: var(--dim); line-height: 1.35; margin: 0; }
    #s-modelos-de-otros .mo-foot { margin-top: 50px; font-size: 36px; max-width: 1560px; line-height: 1.3; }
    #s-donde-corre .dc { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; }
    #s-donde-corre pre.code { font-size: 22px; line-height: 1.55; margin: 14px 0 18px; }
    #s-donde-corre pre.code .c { color: var(--faint); }
    #s-donde-corre .bullets li { margin-bottom: 10px; }
    #s-veinte .vq { font-size: 54px; font-weight: 500; letter-spacing: -0.02em; line-height: 1.15; max-width: 1500px; margin: 22px 0 26px; }
    #s-veinte .vcmd { font-size: 30px; display: inline-block; margin: 0 0 34px; padding: 14px 28px; }
    #s-veinte .vgrid { display: grid; grid-template-columns: repeat(10, 120px); gap: 18px; }
    #s-veinte .vgrid span { height: 86px; border: 2px dashed var(--faint); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-family: var(--mono); font-size: 26px; color: var(--faint); }

    #s-medir-varianza .mv { display: grid; grid-template-columns: repeat(3, 1fr); gap: 44px; margin-top: 20px; }
    #s-medir-varianza .mv > div { border: var(--stroke) solid var(--faint); border-radius: 18px; padding: 30px 32px; }
    #s-medir-varianza .mv .k { font-family: var(--mono); font-size: 22px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--accent); }
    #s-medir-varianza .mv h3 { font-size: 46px; font-weight: 500; margin: 16px 0 14px; }
    #s-medir-varianza .mv p { font-size: 29px; color: var(--dim); line-height: 1.35; margin: 0; }
    #s-medir-varianza .mv .f { font-family: var(--mono); font-size: 26px; color: var(--fg); margin-top: 18px; }

    #s-temperatura-cero .tc { display: grid; grid-template-columns: repeat(3, 1fr); gap: 48px; margin-top: 30px; }
    #s-temperatura-cero .tc > div { border-top: 3px solid var(--fg); padding-top: 20px; }
    #s-temperatura-cero .tc .big { font-size: 120px; font-weight: 500; letter-spacing: -0.03em; line-height: 1; margin: 14px 0 10px; }
    #s-temperatura-cero .tc .d { font-size: 29px; color: var(--dim); line-height: 1.3; }
    #s-temperatura-cero .why { margin-top: 56px; font-size: 36px; max-width: 1560px; line-height: 1.35; }

    #s-por-que-varia .pv { display: grid; grid-template-columns: repeat(3, 1fr); gap: 44px; margin-top: 10px; }
    #s-por-que-varia .pv > div { border-top: 3px solid var(--fg); padding-top: 20px; }
    #s-por-que-varia .pv .k { font-family: var(--mono); font-size: 22px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--accent); }
    #s-por-que-varia .pv h3 { font-size: 44px; font-weight: 500; margin: 14px 0 14px; letter-spacing: -0.01em; }
    #s-por-que-varia .pv p { font-size: 29px; color: var(--dim); line-height: 1.35; margin: 0; }
    #s-por-que-varia .pv-foot { margin-top: 46px; font-size: 36px; line-height: 1.3; max-width: 1560px; }
    #s-contrato .ct { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; }
    #s-contrato pre.code { font-size: 24px; line-height: 1.5; }
    #s-contrato pre.code .k { color: var(--accent); }

    #s-forma-verdad .fv { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; margin-top: 30px; }
    #s-forma-verdad .fv > div { border-top: 3px solid var(--fg); padding-top: 22px; }
    #s-forma-verdad .fv .k { font-size: 120px; font-weight: 500; line-height: 1; }
    #s-forma-verdad .fv h3 { font-size: 50px; font-weight: 500; margin: 18px 0 16px; }
    #s-forma-verdad .fv p { font-size: 31px; color: var(--dim); line-height: 1.35; margin: 0; }
  `);

  Deck.act(3, 'Tokens', [
    {
      id: 'tokens-numeros',
      title: 'Cómo ve un número',
      time: 360,
      particles: { shape: 'grid', opacity: 0.12 },
      html: `
        <div class="t-label">Antes de "pensar", el modelo parte el texto en tokens</div>
        <h2 class="t-title">Cómo ve un número un LLM</h2>
        <ul class="tn">
          ${EX.map(([s, parts, d], i) => `<li${i ? ` data-step="${i}"` : ''}><span class="src">${s}</span><span>${tk(parts)}</span><span class="d">${d}</span></li>`).join('')}
        </ul>
        <div class="cite foot">Tokenizadores o200k_base y cl100k_base (gpt-tokenizer). Mismos cortes en ambos.</div>`,
    },
    {
      id: 'tokens-fila',
      title: 'Una fila ≈ 37 tokens',
      time: 300,
      particles: { shape: 'grid', opacity: 0.12 },
      html: `
        <div class="t-label">Una fila del caso · o200k_base</div>
        <h2 class="t-title" style="margin-bottom:28px">Cada fila cuesta ~37 tokens</h2>
        <div class="row">${tk(['TX', '-', '003', '04', ',', '202', '6', '-', '01', '-', '01', ',', 'CLI', '-', '004', '9', ',A', 'bar', 'ro', 'tes', '·La', '·Esper', 'anza', ',T', 'DD', ',', '1', ',', '43', '.', '00', ',', '43', '.', '00', '↵'])}</div>
        <div class="tf">
          <div data-step="1"><div class="t-label">Ventana de 200 mil</div><div class="big">~5,450</div><div class="d">filas, sin contar instrucciones ni respuesta</div></div>
          <div data-step="2"><div class="t-label">Ventana de 1 millón</div><div class="big">~27,300</div><div class="d">filas, en el mejor caso</div></div>
          <div data-step="3"><div class="t-label">1 millón de filas</div><div class="big accent">37 M</div><div class="d">tokens: no cabe en ninguna ventana</div></div>
        </div>`,
    },
    {
      id: 'ddia',
      title: '¿Cuánto es una ventana?',
      time: 120,
      particles: { shape: 'scatter', opacity: 0.1 },
      html: `
        <div class="t-label">¿Cuánto es una ventana de contexto? · estimación</div>
        <h2 class="t-title" style="margin-bottom:0">Medido en <em>Designing Data-Intensive Applications</em></h2>
        <svg class="dd-svg" width="1680" height="570" viewBox="0 0 1680 570"><line class="ln-hair" x1="0" y1="560" x2="1680" y2="560"/><g><g class="bk" transform="translate(69.0 510)"><rect width="360" height="44" rx="4"/><text x="18" y="30">DDIA · Kleppmann</text></g></g><g data-step="1"><g class="bk" transform="translate(649.0 510)"><rect width="360" height="44" rx="4"/><text x="18" y="30">DDIA · Kleppmann</text></g><g class="bk" transform="translate(663.0 460)"><rect width="360" height="44" rx="4"/><text x="18" y="30">DDIA · Kleppmann</text></g><g class="bk" transform="translate(654.0 410)"><rect width="360" height="44" rx="4"/><text x="18" y="30">DDIA · Kleppmann</text></g><g class="bk" transform="translate(668.0 360)"><rect width="360" height="44" rx="4"/><text x="18" y="30">DDIA · Kleppmann</text></g><g class="bk" transform="translate(659.0 310)"><rect width="360" height="44" rx="4"/><text x="18" y="30">DDIA · Kleppmann</text></g></g><g data-step="2"><g class="bk" transform="translate(1229.0 510)"><rect width="360" height="44" rx="4"/><text x="18" y="30">DDIA · Kleppmann</text></g><g class="bk" transform="translate(1243.0 460)"><rect width="360" height="44" rx="4"/><text x="18" y="30">DDIA · Kleppmann</text></g><g class="bk" transform="translate(1234.0 410)"><rect width="360" height="44" rx="4"/><text x="18" y="30">DDIA · Kleppmann</text></g><g class="bk" transform="translate(1248.0 360)"><rect width="360" height="44" rx="4"/><text x="18" y="30">DDIA · Kleppmann</text></g><g class="bk" transform="translate(1239.0 310)"><rect width="360" height="44" rx="4"/><text x="18" y="30">DDIA · Kleppmann</text></g><g class="bk" transform="translate(1230.0 260)"><rect width="360" height="44" rx="4"/><text x="18" y="30">DDIA · Kleppmann</text></g><g class="bk" transform="translate(1244.0 210)"><rect width="360" height="44" rx="4"/><text x="18" y="30">DDIA · Kleppmann</text></g><g class="bk" transform="translate(1235.0 160)"><rect width="360" height="44" rx="4"/><text x="18" y="30">DDIA · Kleppmann</text></g><g class="bk" transform="translate(1249.0 110)"><rect width="360" height="44" rx="4"/><text x="18" y="30">DDIA · Kleppmann</text></g><g class="bk" transform="translate(1240.0 60)"><rect width="360" height="44" rx="4"/><text x="18" y="30">DDIA · Kleppmann</text></g><g class="bk" transform="translate(1231.0 10)"><rect width="360" height="44" rx="4"/><text x="18" y="30">DDIA · Kleppmann</text></g></g></svg>
        <div class="dd-cap" style="left:80px">200 mil tokens<b>≈ 1 DDIA</b></div>
        <div class="dd-cap" data-step="1" style="left:660px">1 millón de tokens<b>≈ 5 DDIAs</b></div>
        <div class="dd-cap" data-step="2" style="left:1240px">Tu tabla de 1 millón de filas<b class="accent">≈ 180 DDIAs</b></div>
        <div class="cite foot">DDIA: 616 páginas (O'Reilly, 2017). Regla de dedo: ~3 páginas por cada mil tokens → ~200 mil tokens por libro.</div>`,
    },
    {
      id: 'tokens-costo',
      title: 'Lo que cuesta',
      time: 240,
      particles: { shape: 'one', opacity: 0.15 },
      html: `
        <div class="t-label">Costo de meter una tabla al contexto · en vivo</div>
        <div class="f">filas <span class="op">×</span> 37 <span class="op">×</span> precio por token <span class="op">×</span> preguntas</div>
        <div class="live">
          <div><div class="k">Filas</div><div class="v">100,000</div></div>
          <div data-step="1"><div class="k">Precio · millón de tokens de entrada</div><div class="v">$ ___</div></div>
          <div data-step="2"><div class="k">Por cada pregunta</div><div class="v accent">$ ___</div></div>
        </div>`,
    },
    {
      id: 'no-sumes',
      title: 'El modelo no suma',
      time: 180,
      particles: { shape: 'two', opacity: 0.14 },
      html: `
        <div class="t-label">Regla práctica</div>
        <h2 class="t-title">No le pidas que sume. Pídele que escriba cómo sumar.</h2>
        <div class="ns">
          <div><div class="t-label faint">El modelo calcula</div><h3>92% en la tabla de sumas</h3><p class="t-small dim">Y paga por cada fila que lee.</p></div>
          <div data-step="1"><div class="t-label accent">El modelo escribe código</div><h3>La base de datos suma</h3>
<pre class="code">SELECT metodo, AVG(total)
FROM transacciones
GROUP BY metodo;</pre></div>
        </div>`,
    },
    {
      id: 'lab-tokens',
      title: 'Lab · tokens',
      time: 240,
      label: 'Lab · 4 min',
      particles: { shape: 'swarm', opacity: 0.12 },
      html: `
        ${Timer.html(4)}
        <div class="t-label">Lab · 4 minutos</div>
        <h2 class="t-title">Tokeniza tus propios datos</h2>
        <div class="lab2">
<pre class="code"><span class="c"># los ejemplos de la lámina y el caso</span>
uv run sesiones/01/lab-tokens/tokens.py

<span class="c"># tu propio CSV</span>
uv run sesiones/01/lab-tokens/tokens.py ruta/a/tu.csv</pre>
          <div class="r">
            <p class="t-small">Usa un CSV de tu trabajo, <strong>sin datos personales</strong>.</p>
            <p class="t-small">Anota en el chat: tokens por fila y cuántas filas caben en 200 mil.</p>
            <p class="t-small">¿Qué columna es la más cara?</p>
          </div>
        </div>`,
    },
  ]);

  Deck.act(4, 'No determinismo', [
    {
      id: 'modelos-de-otros',
      title: 'De tu modelo a los de otros',
      time: 180,
      particles: { shape: 'two', opacity: 0.15 },
      html: `
        <div class="t-label">De tu modelo a los de otros</div>
        <h2 class="t-title">Mismo objetivo, otra escala</h2>
        <div class="mo">
          <div><div class="t-label">Tu modelo de sumas</div><div class="big">0.79 M</div><p>parámetros · entrenado en 4 minutos en tu laptop · <span class="mono">out-sumas/ckpt.pt</span>, 3 MB</p></div>
          <div data-step="1"><div class="t-label accent">Inkling 2 Mini · Thinking Machines</div><div class="big">26.4 B</div><p>parámetros (3.4 B activos por token) · pesos abiertos, publicado el 20 nov 2026 · ~20 GB</p></div>
        </div>
        <p class="mo-foot" data-step="2">"Pesos abiertos" es eso: el mismo tipo de archivo que tu <span class="mono">ckpt.pt</span>, que cualquiera puede descargar y correr.</p>
        <div class="cite foot">Thinking Machines Lab, "Introducing Inkling 2 Mini" · ficha en Hugging Face: thinkingmachines/Inkling-2-Mini</div>`,
    },
    {
      id: 'donde-corre',
      title: 'Remoto o local',
      time: 240,
      particles: { shape: 'split', opacity: 0.14 },
      html: `
        <div class="t-label">Dónde corre el modelo · copia .env.ejemplo a .env y elige una opción</div>
        <h2 class="t-title" style="margin-bottom:28px">Remoto o en tu laptop</h2>
        <div class="dc">
          <div>
            <div class="t-label accent">A · Remoto · OpenRouter</div>
<pre class="code">LLM_BASE_URL=https://openrouter.ai/api/v1
LLM_MODEL=thinkingmachines/inkling-2-mini
LLM_API_KEY=tu-llave</pre>
            <ul class="bullets t-small"><li>Llave en openrouter.ai; pagas por token.</li><li>Tus datos salen de tu máquina.</li></ul>
          </div>
          <div data-step="1">
            <div class="t-label accent">B · Local · Ollama</div>
<pre class="code">ollama pull qwen3:4b
<span class="c"># y en .env:</span>
LLM_BASE_URL=http://localhost:11434/v1
LLM_MODEL=qwen3:4b</pre>
            <ul class="bullets t-small"><li>Gratis y privado; ollama.com/download.</li><li>8 GB RAM: <span class="mono">qwen3:1.7b</span> · 16 GB: <span class="mono">qwen3:4b</span> · Mac de 32 GB: <span class="mono">inkling-2-mini</span></li></ul>
          </div>
        </div>`,
    },
    {
      id: 'veinte',
      title: 'La misma pregunta 20 veces',
      time: 300,
      particles: { shape: 'swarm', opacity: 0.2 },
      html: `
        <div class="t-label">Experimento</div>
        <h2 class="t-title" style="margin-bottom:0">La misma pregunta, 20 veces</h2>
        <p class="vq">"Con estas 50 transacciones, ¿cuál es el ticket promedio de los pagos con tarjeta?"</p>
        <pre class="code vcmd">uv run sesiones/01/lab-veinte/veinte.py --n 20</pre>
        <div class="vgrid">${Array.from({ length: 20 }, (_, i) => `<span>${String(i + 1).padStart(2, '0')}</span>`).join('')}</div>`,
    },
    {
      id: 'medir-varianza',
      title: 'Cómo se mide',
      time: 300,
      particles: { shape: 'split', opacity: 0.15 },
      html: `
        <div class="t-label">Cómo se mide la varianza</div>
        <h2 class="t-title">Tres números por pregunta</h2>
        <div class="mv">
          <div><div class="k">01</div><h3>Distintas</h3><p>¿Cuántas respuestas diferentes dio en 20 corridas?</p><div class="f">ideal: 1</div></div>
          <div data-step="1"><div class="k">02</div><h3>Consenso</h3><p>¿Qué fracción coincide con la respuesta más común?</p><div class="f">ideal: 100%</div></div>
          <div data-step="2"><div class="k">03</div><h3>Exactitud</h3><p>¿Qué fracción coincide con la verdad, calculada con código?</p><div class="f">ideal: 100%</div></div>
        </div>`,
    },
    {
      id: 'temperatura-cero',
      title: 'Temperatura 0',
      time: 240,
      particles: { shape: 'ring', opacity: 0.15 },
      html: `
        <div class="t-label">Thinking Machines Lab · septiembre 2025</div>
        <h2 class="t-title">Ni a temperatura 0 contesta siempre lo mismo</h2>
        <div class="tc">
          <div><div class="big">1,000</div><div class="d">corridas del mismo prompt</div></div>
          <div data-step="1"><div class="big accent">80</div><div class="d">respuestas distintas</div></div>
          <div data-step="2"><div class="big">78</div><div class="d">veces salió la más común</div></div>
        </div>
        <p class="why" data-step="3">La causa: el servidor agrupa tu petición con las de otros, y el resultado cambia con el tamaño del grupo. Lo puedes arreglar en tu servidor; en una API ajena, <em>se mide</em>.</p>
        <div class="cite foot">Thinking Machines Lab, "Defeating Nondeterminism in LLM Inference", sep 2025 · Qwen3-235B</div>`,
    },
    {
      id: 'por-que-varia',
      title: '¿Por qué varía aquí?',
      time: 180,
      particles: { shape: 'swarm', opacity: 0.16 },
      html: `
        <div class="t-label">Entonces, ¿por qué varió en nuestra corrida?</div>
        <h2 class="t-title">Tres fuentes de variación</h2>
        <div class="pv">
          <div><div class="k">01 · Muestreo</div><h3>La temperatura</h3><p>Con temperatura mayor a 0, el modelo <em>elige al azar</em> entre los tokens probables. Igual que nuestro modelo de transacciones, a 0.8.</p></div>
          <div data-step="1"><div class="k">02 · El servidor</div><h3>El lote compartido</h3><p>Remoto, tu petición se procesa junto con las de otros. Que un laboratorio sepa arreglarlo no significa que el servicio lo tenga activado.</p></div>
          <div data-step="2"><div class="k">03 · El razonamiento</div><h3>Piensa antes de contestar</h3><p>Inkling 2 Mini genera cientos de tokens antes de la respuesta. Un token distinto al principio cambia todo el camino.</p></div>
        </div>
        <p class="pv-foot" data-step="3">En tu laptop, a temperatura 0 y sin nadie más, suele repetirse. <em>Suele</em>: pruébalo, no lo supongas.</p>`,
    },
    {
      id: 'lab-veinte',
      title: 'Lab · 20 corridas',
      time: 480,
      label: 'Lab · 8 min',
      particles: { shape: 'swarm', opacity: 0.12 },
      html: `
        ${Timer.html(8)}
        <div class="t-label">Lab · 8 minutos</div>
        <h2 class="t-title">Corre tus 20</h2>
        <div class="lab2">
<pre class="code"><span class="c"># .env listo: opción A (Inkling 2 Mini en
# OpenRouter) u opción B (Ollama local)</span>
uv run sesiones/01/lab-veinte/veinte.py --n 20

<span class="c"># ¿y a temperatura 0?</span>
uv run sesiones/01/lab-veinte/veinte.py --n 20 --temperatura 0</pre>
          <div class="r">
            <p class="t-small">Anota en el chat: modelo, remoto o local, distintas, consenso y exactitud.</p>
            <p class="t-small">¿A temperatura 0 quedó en una sola respuesta? ¿Remoto y local se comportan igual?</p>
          </div>
        </div>`,
    },
  ]);

  Deck.act(5, 'Salidas estructuradas', [
    {
      id: 'contrato',
      title: 'El contrato',
      time: 360,
      particles: { shape: 'grid', opacity: 0.12 },
      html: `
        <div class="t-label">Salidas estructuradas</div>
        <h2 class="t-title">La respuesta con contrato</h2>
        <div class="ct">
          <div>
            <p class="t-body dim" style="margin-top:0">El modelo ya no escribe prosa: llena un esquema. Si no cumple, la API lo rechaza.</p>
            <ul class="bullets t-small" style="margin-top:36px">
              <li data-step="1">La <strong>respuesta</strong> viene en su campo, sin prosa alrededor.</li>
              <li data-step="2">La <strong>definición</strong> que usó queda escrita.</li>
              <li data-step="3">Tu pipeline lo lee sin expresiones regulares.</li>
            </ul>
          </div>
<pre class="code">{
  <span class="k">"valor"</span>:      { "type": ["number", "string"] },
  <span class="k">"unidad"</span>:     { "enum": ["MXN", "conteo",
                          "%", "texto"] },
  <span class="k">"definicion"</span>: { "type": "string" },
  <span class="k">"supuestos"</span>:  { "type": "array",
                  "items": { "type": "string" } }
}</pre>
        </div>
        <div class="cite foot">JSON Schema · json-schema.org · OpenAI, "Introducing Structured Outputs in the API", ago 2024</div>`,
    },
    {
      id: 'forma-verdad',
      title: 'Forma no es verdad',
      time: 240,
      particles: { shape: 'two', opacity: 0.15 },
      html: `
        <div class="t-label">Lo que garantiza y lo que no</div>
        <h2 class="t-title">Forma no es verdad</h2>
        <div class="fv">
          <div><div class="k good">✓</div><h3>Garantiza la forma</h3><p>Siempre un número, siempre las columnas correctas, siempre parseable.</p></div>
          <div data-step="1"><div class="k bad">✗</div><h3>No garantiza la verdad</h3><p>Nuestro modelo de sumas ya contestaba siempre con un número. Las filas inventadas tenían siete columnas perfectas.</p></div>
        </div>`,
    },
    {
      id: 'lab-esquema',
      title: 'Lab · esquema',
      time: 480,
      label: 'Lab · 8 min',
      particles: { shape: 'swarm', opacity: 0.12 },
      html: `
        ${Timer.html(8)}
        <div class="t-label">Lab · 8 minutos</div>
        <h2 class="t-title">La misma pregunta, con esquema</h2>
        <div class="lab2">
<pre class="code">uv run sesiones/01/lab-veinte/veinte.py --n 20 --esquema</pre>
          <div class="r">
            <p class="t-small">¿Bajó el número de respuestas distintas?</p>
            <p class="t-small">¿Qué <span class="mono">definicion</span> usó para "tarjeta"? ¿Siempre la misma?</p>
            <p class="t-small">¿Subió la exactitud, o solo el consenso?</p>
          </div>
        </div>`,
    },
  ]);
})();
