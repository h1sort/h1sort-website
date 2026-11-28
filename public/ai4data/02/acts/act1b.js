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
    #s-temperatura .tp-foot { margin-top: 52px; font-size: 38px; max-width: 1640px; line-height: 1.3; }

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
          <div><div class="t-label accent">0 · greedy</div><h3>Siempre el más probable</h3><p>Repetible en teoría. En un servicio con lotes, ya vimos que no.</p><p class="r">23+45= → 68 ×10</p></div>
          <div data-step="1"><div class="t-label accent">0.7</div><h3>Afila</h3><p>Lo probable se vuelve más probable.</p><p class="r">23+45= → 68 ×10</p></div>
          <div data-step="2"><div class="t-label accent">1.5</div><h3>Aplana</h3><p>Lo improbable empieza a salir.</p><p class="r">23+45= → 68 ×7 · 67 ×2 · 63 ×1</p></div>
        </div>
        <p class="tp-foot" data-step="3">La temperatura no hace al modelo más listo ni más tonto: solo decide cuánto se arriesga al elegir.</p>`,
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
      id: 'lab-siguiente',
      title: 'Lab · el siguiente token',
      time: 720,
      label: 'Lab · 12 min',
      particles: { shape: 'swarm', opacity: 0.12 },
      html: `
        <div class="t-label">Lab · 12 minutos · sesiones/02/lab-inference</div>
        <h2 class="t-title" style="margin-bottom:28px">Mira a tu modelo elegir</h2>
        ${Timer.html(12)}
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
      title: 'Lab · restringe a tu modelo',
      time: 720,
      label: 'Lab · 12 min',
      particles: { shape: 'swarm', opacity: 0.12 },
      html: `
        <div class="t-label">Lab · 12 minutos · sesiones/02/lab-inference</div>
        <h2 class="t-title" style="margin-bottom:28px">Restringe a tu modelo de transacciones</h2>
        ${Timer.html(12)}
        <div class="lr">
          <div>
<pre class="code">uv run sesiones/02/lab-inference/constrained_decoding.py</pre>
            <p class="t-small dim" style="margin-top:22px">Genera 200 filas libres y 200 restringidas a fechas reales y al catálogo de clientes, comercios y métodos. Tarda un par de minutos.</p>
          </div>
          <ul>
            <li>¿Qué reglas llegan a 100%?</li>
            <li>¿Cuál no se mueve?</li>
            <li>¿Por qué la máscara no puede arreglarla?</li>
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
