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
    .lab2 pre.code { font-size: 24px; line-height: 1.55; }
    .lab2 pre.code .c { color: var(--faint); }
    .lab2 .r .t-small { color: var(--dim); }

    #s-veinte .vq { font-size: 58px; font-weight: 500; letter-spacing: -0.02em; line-height: 1.15; max-width: 1500px; margin: 26px 0 50px; }
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
          <div data-step="1"><div class="t-label">Ventana de 200 mil</div><div class="big">~5,400</div><div class="d">filas, sin contar instrucciones ni respuesta</div></div>
          <div data-step="2"><div class="t-label">Ventana de 1 millón</div><div class="big">~26,800</div><div class="d">filas, en el mejor caso</div></div>
          <div data-step="3"><div class="t-label">1 millón de filas</div><div class="big accent">37 M</div><div class="d">tokens: no cabe en ninguna ventana</div></div>
        </div>`,
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
        <div class="t-label">Lab · 4 minutos</div>
        <h2 class="t-title">Tokeniza tus propios datos</h2>
        <div class="lab2">
<pre class="code">cd ai4data/sesiones/01/lab-tokens
npm install
node tokens.mjs tu_archivo.csv

<span class="c"># o sin archivo: los ejemplos de la lámina</span>
node tokens.mjs</pre>
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
      id: 'veinte',
      title: 'La misma pregunta 20 veces',
      time: 300,
      particles: { shape: 'swarm', opacity: 0.2 },
      html: `
        <div class="t-label">Experimento</div>
        <h2 class="t-title" style="margin-bottom:0">La misma pregunta, 20 veces</h2>
        <p class="vq">"Con estas 50 transacciones, ¿cuál es el ticket promedio de los pagos con tarjeta?"</p>
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
      id: 'lab-veinte',
      title: 'Lab · 20 corridas',
      time: 480,
      label: 'Lab · 8 min',
      particles: { shape: 'swarm', opacity: 0.12 },
      html: `
        <div class="t-label">Lab · 8 minutos</div>
        <h2 class="t-title">Corre tus 20</h2>
        <div class="lab2">
<pre class="code"><span class="c"># cualquier API compatible con OpenAI:
# OpenAI, OpenRouter u Ollama local</span>
export LLM_BASE_URL=http://localhost:11434/v1
export LLM_MODEL=qwen3:4b
export LLM_API_KEY=...   <span class="c"># si aplica</span>

cd ai4data/sesiones/01/lab-veinte
python veinte.py --n 20</pre>
          <div class="r">
            <p class="t-small">Anota en el chat: modelo, distintas, consenso y exactitud.</p>
            <p class="t-small">Corre otra vez con <span class="mono">--temperatura 0</span>. ¿Cambia?</p>
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
        <div class="t-label">Lab · 8 minutos</div>
        <h2 class="t-title">La misma pregunta, con esquema</h2>
        <div class="lab2">
<pre class="code">cd ai4data/sesiones/01/lab-veinte
python veinte.py --n 20 --esquema</pre>
          <div class="r">
            <p class="t-small">¿Bajó el número de respuestas distintas?</p>
            <p class="t-small">¿Qué <span class="mono">definicion</span> usó para "tarjeta"? ¿Siempre la misma?</p>
            <p class="t-small">¿Subió la exactitud, o solo el consenso?</p>
          </div>
        </div>`,
    },
  ]);
})();
