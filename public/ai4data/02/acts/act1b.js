// Act 2 · Inferencia por dentro, con el nanoGPT de la sesión 01: cómo nace un token, temperatura,
// prefill/decode, y decodificación restringida. Números: sesiones/02/lab-inference (respaldo, 28 nov 2026).
(() => {
  Deck.css(`
    #s-nace-token .nt-flow { display: flex; align-items: center; gap: 18px; margin: 8px 0 44px; flex-wrap: wrap; }
    #s-nace-token .nt-flow span { border: var(--stroke) solid var(--faint); border-radius: 14px; padding: 14px 20px; font-size: 28px; }
    #s-nace-token .nt-flow span.acc { border-color: var(--accent); color: var(--accent); }
    #s-nace-token .nt-flow i { font-style: normal; color: var(--dim); font-size: 30px; }
    #s-nace-token .nt { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; }
    #s-nace-token .bars { list-style: none; padding: 0; margin: 0; }
    #s-nace-token .bars li { display: grid; grid-template-columns: 60px 130px 1fr; align-items: center; gap: 16px; font-family: var(--mono); font-size: 30px; padding: 6px 0; }
    #s-nace-token .bars .b { height: 22px; background: var(--fg); border-radius: 4px; }
    #s-nace-token .bars .b.acc { background: var(--accent); }
    #s-nace-token .nt p { font-size: 30px; color: var(--dim); line-height: 1.38; margin: 0 0 18px; }

    #s-temperatura .tp { display: grid; grid-template-columns: repeat(3, 1fr); gap: 44px; margin-top: 6px; }
    #s-temperatura .tp > div { border-top: 3px solid var(--fg); padding-top: 20px; }
    #s-temperatura .tp h3 { font-size: 44px; font-weight: 500; margin: 12px 0 12px; }
    #s-temperatura .tp p { font-size: 28px; color: var(--dim); line-height: 1.35; margin: 0 0 12px; }
    #s-temperatura .tp .r { font-family: var(--mono); font-size: 26px; color: var(--fg); }
    #s-temperatura .tp-foot { margin-top: 44px; font-size: 36px; max-width: 1640px; line-height: 1.3; }
    #s-temperatura .tp-foot + .tp-foot { margin-top: 22px; }
    #s-temperatura .cite { margin-top: 10px; }

    #s-ni-en-cero .nc { display: grid; grid-template-columns: 1fr 1.15fr; gap: 72px; margin-top: 4px; }
    #s-ni-en-cero .nc .big { font-size: 120px; font-weight: 500; letter-spacing: -0.03em; line-height: 1; }
    #s-ni-en-cero .nc .sub { font-size: 30px; color: var(--dim); margin: 14px 0 34px; }
    #s-ni-en-cero .nc .split { font-family: var(--mono); font-size: 27px; line-height: 1.6; }
    #s-ni-en-cero .nc .split b { color: var(--accent); font-weight: 400; }
    #s-ni-en-cero .nc ol { list-style: none; padding: 0; margin: 0; counter-reset: c; }
    #s-ni-en-cero .nc li { counter-increment: c; position: relative; padding: 0 0 22px 56px; font-size: 29px; line-height: 1.35; color: var(--dim); }
    #s-ni-en-cero .nc li::before { content: counter(c, decimal-leading-zero); position: absolute; left: 0; top: 3px; font-family: var(--mono); font-size: 22px; color: var(--accent); }
    #s-ni-en-cero .nc li b { color: var(--fg); font-weight: 500; }
    #s-ni-en-cero .cite { position: absolute; left: var(--pad-x); bottom: 150px; }

    #s-lab-kv .kv { display: grid; grid-template-columns: 1fr 1.1fr; gap: 56px; }
    #s-lab-kv .kv pre.code { font-size: 24px; }
    #s-lab-kv .kv table { width: 100%; border-collapse: collapse; font-size: 26px; }
    #s-lab-kv .kv td, #s-lab-kv .kv th { padding: 10px 12px; border-top: 2px solid var(--hair); text-align: right; }
    #s-lab-kv .kv td:first-child, #s-lab-kv .kv th:first-child { text-align: left; }
    #s-lab-kv .kv th { font-family: var(--mono); font-size: 19px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--dim); font-weight: 400; }
    #s-lab-kv .kv tr:last-child td { border-bottom: 2px solid var(--hair); }
    #s-lab-kv .kv .acc { color: var(--accent); }
    #s-lab-kv .kv ul { list-style: none; padding: 0; margin: 28px 0 0; }
    #s-lab-kv .kv li { font-size: 27px; color: var(--dim); line-height: 1.35; padding: 10px 0; border-top: 2px solid var(--hair); }
    #s-lab-kv .kv li:last-child { border-bottom: 2px solid var(--hair); }

    #s-prefill .pf { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; margin-top: 6px; }
    #s-prefill .pf > div { border-top: 3px solid var(--fg); padding-top: 20px; }
    #s-prefill .pf h3 { font-size: 48px; font-weight: 500; margin: 12px 0 14px; }
    #s-prefill .pf p { font-size: 29px; color: var(--dim); line-height: 1.38; margin: 0 0 14px; }
    #s-prefill .pf-foot { margin-top: 44px; font-size: 32px; max-width: 1640px; line-height: 1.35; }

    #s-lab-siguiente .ls { display: grid; grid-template-columns: 1.1fr 1fr; gap: 56px; }
    #s-lab-siguiente .ls pre.code { font-size: 24px; }
    #s-lab-siguiente .ls ul { list-style: none; padding: 0; margin: 0; }
    #s-lab-siguiente .ls li { font-size: 30px; color: var(--dim); line-height: 1.35; padding: 14px 0; border-top: 2px solid var(--hair); }
    #s-lab-siguiente .ls li:last-child { border-bottom: 2px solid var(--hair); }

    #s-seguro .sq { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: end; margin-top: 10px; }
    #s-seguro .sq .eq { font-family: var(--mono); font-size: 84px; letter-spacing: -0.02em; }
    #s-seguro .sq p { font-size: 32px; color: var(--dim); line-height: 1.35; margin: 16px 0 0; }
    #s-seguro .sq-foot { margin-top: 64px; font-size: 42px; max-width: 1600px; line-height: 1.28; }

    #s-restringir .rs { display: grid; grid-template-columns: 1fr 1fr; gap: 72px; }
    #s-restringir .rs p { font-size: 30px; color: var(--dim); line-height: 1.38; margin: 0 0 18px; }
    #s-restringir .mask { list-style: none; padding: 0; margin: 0; }
    #s-restringir .mask li { display: grid; grid-template-columns: 70px 1fr 120px; gap: 16px; align-items: center; font-family: var(--mono); font-size: 30px; padding: 8px 0; border-top: 2px solid var(--hair); }
    #s-restringir .mask li.x { color: var(--faint); text-decoration: line-through; }
    #s-restringir .mask li .w { color: var(--dim); font-size: 24px; text-decoration: none; }

    #s-lab-restringido .lr { display: grid; grid-template-columns: 1.1fr 1fr; gap: 56px; }
    #s-lab-restringido .lr pre.code { font-size: 24px; }
    #s-lab-restringido .lr ul { list-style: none; padding: 0; margin: 0; }
    #s-lab-restringido .lr li { font-size: 30px; color: var(--dim); line-height: 1.35; padding: 14px 0; border-top: 2px solid var(--hair); }
    #s-lab-restringido .lr li:last-child { border-bottom: 2px solid var(--hair); }

    #s-mascara-bonsai .mb { display: grid; grid-template-columns: 0.9fr 1.2fr; gap: 64px; margin-top: 4px; }
    #s-mascara-bonsai .mb table { width: 100%; border-collapse: collapse; }
    #s-mascara-bonsai .mb td, #s-mascara-bonsai .mb th { padding: 11px 14px; border-top: 2px solid var(--hair); font-size: 28px; text-align: right; }
    #s-mascara-bonsai .mb td:first-child, #s-mascara-bonsai .mb th:first-child { text-align: left; }
    #s-mascara-bonsai .mb th { font-family: var(--mono); font-size: 20px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--dim); font-weight: 400; }
    #s-mascara-bonsai .mb tr:last-child td { border-bottom: 2px solid var(--hair); }
    #s-mascara-bonsai .mb .hl td { color: var(--accent); }
    #s-mascara-bonsai .mb .inv { font-family: var(--mono); font-size: 24px; color: var(--dim); margin-top: 22px; line-height: 1.5; }
    #s-mascara-bonsai .forced { list-style: none; padding: 0; margin: 0; }
    #s-mascara-bonsai .forced li { padding: 16px 0; border-top: 2px solid var(--hair); }
    #s-mascara-bonsai .forced li:last-child { border-bottom: 2px solid var(--hair); }
    #s-mascara-bonsai .forced .ctx { font-family: var(--mono); font-size: 25px; color: var(--dim); }
    #s-mascara-bonsai .forced .ctx b { color: var(--fg); font-weight: 400; }
    #s-mascara-bonsai .forced .p { font-size: 27px; margin-top: 6px; }
    #s-mascara-bonsai .forced .p s { color: var(--faint); }
    #s-mascara-bonsai .mb-foot { margin-top: 36px; font-size: 32px; max-width: 1640px; line-height: 1.3; }

    #s-forma-verdad .fv { width: 100%; border-collapse: collapse; }
    #s-forma-verdad .fv td, #s-forma-verdad .fv th { padding: 12px 18px; border-top: 2px solid var(--hair); font-size: 30px; text-align: right; }
    #s-forma-verdad .fv td:first-child, #s-forma-verdad .fv th:first-child { text-align: left; }
    #s-forma-verdad .fv th { font-family: var(--mono); font-size: 22px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--dim); font-weight: 400; }
    #s-forma-verdad .fv tr:last-child td { border-bottom: 2px solid var(--hair); }
    #s-forma-verdad .fv .hl td { color: var(--accent); }
    #s-forma-verdad .fv-ex { font-family: var(--mono); font-size: 25px; margin-top: 36px; line-height: 1.5; }
    #s-forma-verdad .fv-ex .why { color: var(--accent); }
  `);

  const bar = (ch, p, acc) => `<li><span>${ch}</span><span>${p}</span><span class="b${acc ? ' acc' : ''}" style="width:${Math.max(parseFloat(p) * 5, 2)}px"></span></li>`;

  Deck.act(2, 'Inferencia', [
    {
      id: 'nace-token',
      title: 'Cómo nace un token',
      time: 360,
      particles: { shape: 'swarm', opacity: 0.12 },
      html: `
        <div class="t-label">Inferencia por dentro · con tu modelo de sumas</div>
        <h2 class="t-title" style="margin-bottom:28px">Cómo nace un token</h2>
        <div class="nt-flow"><span>texto</span><i>→</i><span>tokens</span><i>→</i><span>modelo</span><i>→</i><span>logits</span><i>→</i><span>softmax</span><i>→</i><span class="acc">elegir uno</span><i>→</i><span>agregar y repetir</span></div>
        <div class="nt">
          <div data-step="1">
            <div class="t-label" style="margin-bottom:14px">Después de <span class="mono fg">23+45=</span>, tu modelo dice</div>
            <ul class="bars">${bar('6', '96.0%', true)}${bar('5', '3.7%')}${bar('7', '0.2%')}</ul>
            <div class="t-label" style="margin:28px 0 14px">Y después de <span class="mono fg">23+45=6</span></div>
            <ul class="bars">${bar('8', '97.8%', true)}${bar('7', '1.7%')}${bar('9', '0.4%')}</ul>
          </div>
          <div data-step="2">
            <p><b class="fg">Logits:</b> un número por cada token del vocabulario. Tu modelo tiene 13: los dígitos, +, = y el salto de línea. Uno de frontera, más de cien mil.</p>
            <p><b class="fg">Softmax:</b> los convierte en probabilidades que suman 100%.</p>
            <p><b class="fg">Elegir:</b> el más probable (greedy) o una muestra al azar según esas probabilidades.</p>
            <p>Un token a la vez. Toda la respuesta sale de repetir esto.</p>
          </div>
        </div>`,
    },
    {
      id: 'temperatura',
      title: 'Temperatura',
      time: 240,
      particles: { shape: 'two', opacity: 0.12 },
      html: `
        <div class="t-label">Elegir uno · los logits se dividen entre la temperatura antes del softmax</div>
        <h2 class="t-title" style="margin-bottom:28px">Temperatura</h2>
        <div class="tp">
          <div><div class="t-label accent">0 · greedy</div><h3>Siempre el más probable</h3><p>Repetible en tu laptop. En un servidor, ni así: la siguiente lámina.</p><p class="r">23+45= → 68 ×10</p></div>
          <div data-step="1"><div class="t-label accent">0.7</div><h3>Afila</h3><p>Lo probable se vuelve más probable.</p><p class="r">23+45= → 68 ×10</p></div>
          <div data-step="2"><div class="t-label accent">1.5</div><h3>Aplana</h3><p>Lo improbable empieza a salir.</p><p class="r">23+45= → 68 ×7 · 67 ×2 · 63 ×1</p></div>
        </div>
        <p class="tp-foot" data-step="3">La temperatura no hace al modelo más listo ni más tonto: solo decide cuánto se arriesga al elegir.</p>
        <p class="tp-foot" data-step="4"><span class="accent">Para datos, lo repetible no sale de la temperatura:</span> sale del método (esquema, SQL, herramientas) y de medir el consenso.</p>`,
    },
    {
      id: 'ni-en-cero',
      title: 'Ni en cero',
      time: 240,
      particles: { shape: 'scatter', opacity: 0.12 },
      html: `
        <div class="t-label">Temperatura 0 en un servidor real</div>
        <h2 class="t-title" style="margin-bottom:30px">Ni en cero es repetible</h2>
        <div class="nc">
          <div>
            <div class="big">80<span class="dim" style="font-size:56px"> / 1,000</span></div>
            <p class="sub">respuestas distintas: el mismo prompt mil veces, a temperatura 0</p>
            <div class="split" data-step="1">"Tell me about Richard Feynman"<br>iguales hasta el token 102. En el 103:<br><b>"…in Queens, New York"</b> ×992<br><b>"…in New York City"</b> ×8</div>
          </div>
          <ol>
            <li data-step="2"><b>Tu petición viaja en un lote</b> con las de otros usuarios, y el tamaño del lote cambia con la carga del servidor.</li>
            <li data-step="3"><b>El tamaño del lote cambia el orden de las sumas</b> dentro de la GPU. En punto flotante, (a + b) + c no siempre es a + (b + c).</li>
            <li data-step="4"><b>Se puede arreglar:</b> con kernels que suman siempre en el mismo orden, 1,000 de 1,000 iguales. Más lento, y casi ningún servicio lo hace.</li>
          </ol>
        </div>
        <div class="cite">Horace He y Thinking Machines Lab, "Defeating Nondeterminism in LLM Inference", 10 sep 2025 · Qwen3-235B · thinkingmachines.ai/blog</div>`,
    },
    {
      id: 'prefill',
      title: 'Prefill y decode',
      time: 300,
      particles: { shape: 'split', opacity: 0.12 },
      html: `
        <div class="t-label">Por qué la salida cuesta más · ollama run --verbose</div>
        <h2 class="t-title" style="margin-bottom:28px">Leer es rápido. Escribir es lento.</h2>
        <div class="pf">
          <div>
            <div class="t-label accent">Prefill · prompt eval rate</div>
            <h3>Lee todo de golpe</h3>
            <p>Todos los tokens de entrada pasan por el modelo en paralelo, en una sola pasada.</p>
          </div>
          <div data-step="1">
            <div class="t-label accent">Decode · eval rate</div>
            <h3>Escribe de uno en uno</h3>
            <p>Cada token de salida es una pasada completa del modelo, y depende del anterior.</p>
          </div>
        </div>
        <p class="pf-foot" data-step="2">Por eso la salida cuesta varias veces más que la entrada, y la latencia la manda cuántos tokens escribe. El cálculo de lo ya leído se guarda (<em>KV cache</em>); reusarlo entre llamadas es la <em>caché de prompt</em> que te cobran más barata.</p>`,
    },
    {
      id: 'lab-kv',
      title: 'Lab · el KV cache',
      time: 480,
      label: 'Lab · 8 min',
      particles: { shape: 'swarm', opacity: 0.12 },
      html: `
        <div class="t-label">Lab · 8 minutos · sesiones/02/lab-inference · tu modelo local</div>
        <h2 class="t-title" style="margin-bottom:28px">Mide el KV cache</h2>
        ${Timer.html()}
        <div class="kv">
          <div>
<pre class="code">uv run sesiones/02/lab-inference/kv_cache.py</pre>
            <p class="t-small dim" style="margin-top:20px">Cuatro veces casi el mismo prompt: 20 filas del caso y una pregunta. Tarda poco más de un minuto.</p>
            <ul>
              <li>¿Qué fase ahorra el caché, y cuál no?</li>
              <li>¿Por qué un carácter al principio lo rompe todo?</li>
              <li>¿Qué va primero en tu prompt: lo fijo o lo que cambia?</li>
            </ul>
          </div>
          <div data-step="1">
            <table>
              <tr><th>bonsai-2:9b · mi laptop</th><th>Leídos</th><th>Del caché</th><th>Prefill</th><th>Decode</th></tr>
              <tr><td>1 · en frío</td><td>1,090</td><td>0</td><td>19.7 s</td><td>8.5 s</td></tr>
              <tr><td>2 · mismo prompt</td><td>1,090</td><td class="acc">1,086</td><td class="acc">0.27 s</td><td>8.1 s</td></tr>
              <tr><td>3 · otra pregunta al final</td><td>1,094</td><td>578</td><td>9.6 s</td><td>0.7 s</td></tr>
              <tr><td>4 · otra letra al inicio</td><td>1,090</td><td>0</td><td>20.6 s</td><td>9.8 s</td></tr>
            </table>
            <p class="t-small dim" style="margin-top:18px">Prefill: 55 tokens/s leídos. Decode: 9 tokens/s escritos.</p>
          </div>
        </div>`,
    },
    {
      id: 'lab-siguiente',
      title: 'Lab · el siguiente token',
      time: 720,
      label: 'Lab · 12 min',
      particles: { shape: 'swarm', opacity: 0.12 },
      html: `
        <div class="t-label">Lab · 12 minutos · sesiones/02/lab-inference</div>
        <h2 class="t-title" style="margin-bottom:28px">Mira a tu modelo elegir</h2>
        ${Timer.html()}
        <div class="ls">
          <div>
<pre class="code">uv run sesiones/02/lab-inference/next_token.py
uv run sesiones/02/lab-inference/next_token.py --prompt "359+481="
uv run sesiones/02/lab-inference/next_token.py --prompt "99+99="</pre>
            <p class="t-small dim" style="margin-top:22px">Usa tu modelo de la sesión 01; si no lo tienes, el respaldo del repo.</p>
          </div>
          <ul>
            <li>¿En qué paso duda más?</li>
            <li>¿Qué cambia entre temperatura 0, 0.7 y 1.5?</li>
            <li>Con 3 cifras: ¿qué tan seguro está? ¿Acierta?</li>
          </ul>
        </div>`,
    },
    {
      id: 'seguro',
      title: 'Seguro y equivocado',
      time: 180,
      particles: { shape: 'ring', opacity: 0.14 },
      html: `
        <div class="t-label">Lo que vimos</div>
        <h2 class="t-title">Seguro y equivocado</h2>
        <div class="sq">
          <div><div class="eq">359+481=<span class="accent">129</span></div><p>Es 840.</p></div>
          <div data-step="1"><div class="eq accent">97.7%</div><p>de probabilidad para el 9, en el paso que lo decidió. Y a temperatura 0 y 0.7, las diez veces lo mismo.</p></div>
        </div>
        <p class="sq-foot" data-step="2">Probabilidad alta no es verdad. Consenso alto tampoco: el modelo puede repetir el mismo error diez veces.</p>`,
    },
    {
      id: 'restringir',
      title: 'Decodificación restringida',
      time: 360,
      particles: { shape: 'grid', opacity: 0.12 },
      html: `
        <div class="t-label">Salidas estructuradas · JSON Schema por dentro</div>
        <h2 class="t-title" style="margin-bottom:30px">Decodificación restringida</h2>
        <div class="rs">
          <div>
            <p>Antes de elegir, se ponen en cero los tokens que romperían el formato. Se elige entre los que quedan.</p>
            <p data-step="2">Un JSON Schema se convierte en esa máscara: después de <span class="mono fg">{"valor":</span> solo caben números o comillas; un <span class="mono fg">enum</span> solo deja pasar sus opciones.</p>
            <p data-step="3">Cuando un proveedor ofrece modo estricto, hace esto. Si solo valida y reintenta, no.</p>
          </div>
          <div data-step="1">
            <div class="t-label" style="margin-bottom:12px">El método de pago, después de <span class="mono fg">…,Farmacia del Centro,</span></div>
            <ul class="mask">
              <li><span>T</span><span>TDC · TDD</span><span class="w">permitido</span></li>
              <li><span>E</span><span>EFECTIVO</span><span class="w">permitido</span></li>
              <li><span>S</span><span>SPEI</span><span class="w">permitido</span></li>
              <li class="x"><span>B</span><span>BITCOIN</span><span class="w">fuera</span></li>
              <li class="x"><span>,</span><span>método vacío</span><span class="w">fuera</span></li>
            </ul>
          </div>
        </div>`,
    },
    {
      id: 'lab-restringido',
      title: 'Lab · restringe a tu modelo, y a bonsai',
      time: 900,
      label: 'Lab · 15 min',
      particles: { shape: 'swarm', opacity: 0.12 },
      html: `
        <div class="t-label">Lab · 15 minutos · sesiones/02/lab-inference</div>
        <h2 class="t-title" style="margin-bottom:28px">Restringe a tu modelo, y a bonsai</h2>
        ${Timer.html()}
        <div class="lr">
          <div>
<div class="t-label accent" style="margin-bottom:12px">1 · tu modelo de la sesión 01</div>
<pre class="code">uv run sesiones/02/lab-inference/constrained_decoding.py</pre>
            <p class="t-small dim" style="margin-top:14px">200 filas libres y 200 con la máscara escrita a mano: fechas reales y el catálogo.</p>
            <div class="t-label accent" style="margin:30px 0 12px">2 · bonsai, con JSON Schema</div>
<pre class="code">uv run sesiones/02/lab-inference/schema_decoding.py</pre>
            <p class="t-small dim" style="margin-top:14px">La misma idea en un modelo de verdad: Ollama convierte el schema en la máscara. Y te enseña qué tokens le forzó.</p>
          </div>
          <ul>
            <li>¿Qué reglas llegan a 100%?</li>
            <li>¿Cuál no se mueve?</li>
            <li>¿Por qué la máscara no puede arreglarla?</li>
          <li>¿Qué quería escribir bonsai cuando el schema lo forzó?</li>
          </ul>
        </div>`,
    },
    {
      id: 'forma-verdad',
      title: 'Forma, no verdad',
      time: 300,
      particles: { shape: 'two', opacity: 0.12 },
      html: `
        <div class="t-label">Lo que vimos · 200 filas · respaldo del repo</div>
        <h2 class="t-title" style="margin-bottom:24px">La máscara garantiza forma, no verdad</h2>
        <table class="fv">
          <tr><th>Regla</th><th>Libre</th><th>Restringida</th></tr>
          <tr><td>Forma, cliente, comercio, método, fecha</td><td>99.5%</td><td>100%</td></tr>
          <tr class="hl" data-step="1"><td>total = cantidad × precio</td><td>97.0%</td><td>99.0%</td></tr>
        </table>
        <p class="fv-ex" data-step="2">2026-01-29,CLI-0067,Farmacia del Centro,SPEI,3,651.00,2953.00<br><span class="why">↳ válida en forma y catálogo · 3 × 651.00 = 1,953.00</span></p>`,
    },
    {
      id: 'mascara-bonsai',
      title: 'La máscara, en bonsai',
      time: 240,
      particles: { shape: 'grid', opacity: 0.12 },
      html: `
        <div class="t-label">Lo que vimos · bonsai-2:9b · 10 filas · temperatura 1.3</div>
        <h2 class="t-title" style="margin-bottom:30px">La máscara, en un modelo de verdad</h2>
        <div class="mb">
          <div>
            <table>
              <tr><th>Regla</th><th>Libre</th><th>Schema</th></tr>
              <tr><td>Comercio existe</td><td>4/10</td><td>10/10</td></tr>
              <tr><td>Método válido</td><td>5/10</td><td>10/10</td></tr>
              <tr class="hl"><td>Pasa todas</td><td>3/10</td><td>10/10</td></tr>
            </table>
            <p class="inv">libre: …,Mercado Central,FONAPOR,…<br>(ni el comercio ni el método existen)</p>
          </div>
          <ul class="forced" data-step="1">
            <li><div class="ctx">antes de escribir nada</div><div class="p">quería <s>"Aquí tienes…"</s> 90% · el schema: <span class="accent">{</span> 0.00003%</div></li>
            <li><div class="ctx">"comercio": "<b>Café Tres V</b>…</div><div class="p">quería <s>"…ías"</s> 25% · el schema: <span class="accent">"…olcanes"</span> 0.0002%</div></li>
            <li><div class="ctx">"comercio": "<b>Café T</b>…</div><div class="p">quería <s>"…ost…"</s> 25% · el schema: <span class="accent">"…res"</span> 0.005%</div></li>
          </ul>
        </div>
        <p class="mb-foot" data-step="2">El schema no convence al modelo: le quita las opciones. Y sigue sin saber si <span class="mono">total = cantidad × precio</span>.</p>`,
    },
    {
      id: 'pausa',
      title: 'Pausa',
      time: 600,
      class: 'middle',
      particles: { shape: 'ring', opacity: 0.2 },
      html: `
        ${Timer.html(10)}
        <p class="pa" style="font-size:120px;font-weight:500;letter-spacing:-0.03em;margin:0">Pausa</p>
        <p class="t-small dim" style="margin-top:30px">Si te da tiempo: carga <span class="mono">caso/transacciones.csv</span> como tabla <span class="mono">transacciones</span> en tu Databricks.</p>`,
    },
  ]);
})();
