// Act 2 · Elegir modelo: tres familias, regla práctica, tabla de precios, benchmark vs set dorado.
(() => {
  Deck.css(`
    #s-cuantizacion .qz { display: grid; grid-template-columns: 1.15fr 1fr; gap: 64px; margin-top: 4px; }
    #s-cuantizacion .qb { list-style: none; padding: 0; margin: 0; }
    #s-cuantizacion .qb li { display: grid; grid-template-columns: 240px 1fr 120px; gap: 18px; align-items: center; padding: 12px 0; border-top: 2px solid var(--hair); }
    #s-cuantizacion .qb li:last-child { border-bottom: 2px solid var(--hair); }
    #s-cuantizacion .qb .n { font-size: 28px; }
    #s-cuantizacion .qb .n small { display: block; font-family: var(--mono); font-size: 19px; color: var(--dim); letter-spacing: .04em; margin-top: 4px; }
    #s-cuantizacion .qb .b { height: 26px; background: var(--fg); border-radius: 4px; }
    #s-cuantizacion .qb .acc .b { background: var(--accent); }
    #s-cuantizacion .qb .acc .n, #s-cuantizacion .qb .acc .v { color: var(--accent); }
    #s-cuantizacion .qb .v { font-family: var(--mono); font-size: 27px; text-align: right; }
    #s-cuantizacion .qz ol { list-style: none; padding: 0; margin: 0; counter-reset: q; }
    #s-cuantizacion .qz ol li { counter-increment: q; position: relative; padding: 0 0 24px 56px; font-size: 29px; line-height: 1.35; color: var(--dim); }
    #s-cuantizacion .qz ol li::before { content: counter(q, decimal-leading-zero); position: absolute; left: 0; top: 3px; font-family: var(--mono); font-size: 22px; color: var(--accent); }
    #s-cuantizacion .qz ol li b { color: var(--fg); font-weight: 500; }
    #s-cuantizacion .qnote { font-family: var(--mono); font-size: 21px; color: var(--dim); margin-top: 16px; line-height: 1.5; }

    #s-familias .fa { display: grid; grid-template-columns: repeat(3, 1fr); gap: 44px; margin-top: 10px; }
    #s-familias .fa > div { border-top: 3px solid var(--fg); padding-top: 22px; }
    #s-familias .fa h3 { font-size: 46px; font-weight: 500; margin: 12px 0 16px; letter-spacing: -0.01em; }
    #s-familias .fa p { font-size: 28px; color: var(--dim); line-height: 1.35; margin: 0 0 14px; }
    #s-familias .fa .ej { font-family: var(--mono); font-size: 24px; color: var(--fg); line-height: 1.5; }

    #s-regla .rg { list-style: none; padding: 0; margin: 0; max-width: 1680px; }
    #s-regla .rg li { display: grid; grid-template-columns: 560px 300px 1fr; gap: 36px; padding: 24px 0; border-top: 2px solid var(--hair); font-size: 34px; line-height: 1.3; align-items: baseline; }
    #s-regla .rg li:last-child { border-bottom: 2px solid var(--hair); }
    #s-regla .rg .h { font-family: var(--mono); font-size: 22px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--dim); }
    #s-regla .rg .u { color: var(--accent); font-weight: 500; }
    #s-regla .rg .e { font-size: 28px; color: var(--dim); }

    #s-precios .pc { display: grid; grid-template-columns: 1fr 1fr; gap: 72px; }
    #s-precios .pc ul { list-style: none; padding: 0; margin: 0; }
    #s-precios .pc li { padding: 18px 0; border-top: 2px solid var(--hair); font-size: 30px; line-height: 1.3; }
    #s-precios .pc li:last-child { border-bottom: 2px solid var(--hair); }
    #s-precios .pc li b { display: block; font-weight: 500; font-size: 34px; margin-bottom: 4px; }
    #s-precios .pc li span { color: var(--dim); }
    #s-precios .pc .eq { font-family: var(--mono); font-size: 30px; line-height: 1.6; }
    #s-precios .pc .eq .k { color: var(--dim); }

    #s-benchmark .bm { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; margin-top: 10px; }
    #s-benchmark .bm > div { border-top: 3px solid var(--fg); padding-top: 22px; }
    #s-benchmark .bm h3 { font-size: 44px; font-weight: 500; margin: 12px 0 18px; }
    #s-benchmark .bm ul { list-style: none; padding: 0; margin: 0; }
    #s-benchmark .bm li { font-size: 30px; color: var(--dim); line-height: 1.35; padding: 10px 0; }
    #s-benchmark .bm-foot { margin-top: 56px; font-size: 40px; max-width: 1600px; line-height: 1.3; }
  `);

  Deck.act(3, 'Elegir modelo', [
    {
      id: 'familias',
      title: 'Tres familias de modelos',
      time: 420,
      particles: { shape: 'scatter', opacity: 0.14 },
      html: `
        <div class="t-label">Elegir modelo · 1</div>
        <h2 class="t-title">Tres familias de modelos</h2>
        <div class="fa">
          <div>
            <div class="t-label accent">Frontera</div>
            <h3>Los más capaces</h3>
            <p>Por API. Pagas por token. El tamaño no es público. Tus datos salen de tu máquina.</p>
            <p class="ej">claude-haiku-5-5<br>gpt-6-luna</p>
          </div>
          <div data-step="1">
            <div class="t-label accent">Pequeños · pesos abiertos</div>
            <h3>Los que descargas</h3>
            <p>Corren en tu laptop, tu servidor o tu warehouse. Cuantizados caben en poca memoria. Más torpes.</p>
            <p class="ej">bonsai-2:9b<br>qwen · llama · gemma · gpt-oss</p>
          </div>
          <div data-step="2">
            <div class="t-label accent">Modelos de decisión · System One</div>
            <h3>Los que no escriben</h3>
            <p>Contestan preguntas tipadas: una etiqueta de una lista, un puntaje o una probabilidad. No generan texto.</p>
            <p class="ej">Jev · TypeSafe</p>
          </div>
        </div>`,
    },
    {
      id: 'cuantizacion',
      title: 'Cuantización',
      time: 300,
      particles: { shape: 'grid', opacity: 0.12 },
      html: `
        <div class="t-label">Cuantización · menos bits por peso</div>
        <h2 class="t-title" style="margin-bottom:30px">Cuánto pesa un modelo de 9 mil millones</h2>
        <div class="qz">
          <div>
            <ul class="qb">
              <li><span class="n">16 bits<small>como se entrena</small></span><span><div class="b" style="width:100%"></div></span><span class="v">18 GB</span></li>
              <li data-step="1"><span class="n">8 bits</span><span><div class="b" style="width:50%"></div></span><span class="v">9 GB</span></li>
              <li data-step="1"><span class="n">4 bits<small>lo común en Ollama</small></span><span><div class="b" style="width:25%"></div></span><span class="v">4.5 GB</span></li>
              <li data-step="2" class="acc"><span class="n">2 bits · ternario<small>−1, 0, +1 · bonsai</small></span><span><div class="b" style="width:12.5%"></div></span><span class="v">2.25 GB</span></li>
            </ul>
            <p class="qnote" data-step="2">9 mil millones de pesos × bits ÷ 8 = bytes. bonsai-2:9b en mi laptop: 2.5 GB en memoria (<span class="fg">ollama ps</span>).</p>
          </div>
          <ol>
            <li data-step="3"><b>Tiene que caber.</b> El modelo vive en tu memoria: con 16 bits, este modelo no cabe en una laptop de 16 GB.</li>
            <li data-step="4"><b>Escribir es leer todos los pesos.</b> Cada token del decode recorre el modelo entero: menos bits que leer, más rápido escribe.</li>
            <li data-step="5"><b>El precio es calidad.</b> Redondear los pesos pierde algo, y más en modelos chicos. bonsai se entrena desde el principio con tres valores, en lugar de redondear después.</li>
          </ol>
        </div>`,
    },
    {
      id: 'regla',
      title: 'Una regla práctica',
      time: 300,
      particles: { shape: 'grid', opacity: 0.14 },
      html: `
        <div class="t-label">Elegir modelo · 2</div>
        <h2 class="t-title" style="margin-bottom:28px">Una regla práctica</h2>
        <ul class="rg">
          <li class="h"><span>Si la pregunta es…</span><span>usa</span><span>ejemplo en nuestro caso</span></li>
          <li><span>Un juicio con categorías fijas</span><span class="u">modelo de decisión</span><span class="e">¿Esta reseña del comercio es una queja?</span></li>
          <li data-step="1"><span>Aritmética, conteo o fechas</span><span class="u">código · SQL</span><span class="e">¿Cuál es el ticket promedio con tarjeta?</span></li>
          <li data-step="2"><span>Lenguaje: redactar, explicar, traducir una pregunta a SQL</span><span class="u">LLM</span><span class="e">Escribe la consulta del ticket promedio · explícale al director por qué bajó</span></li>
        </ul>`,
    },
    {
      id: 'precios',
      title: 'Leer una tabla de precios',
      time: 360,
      particles: { shape: 'two', opacity: 0.14 },
      html: `
        <div class="t-label">Elegir modelo · 3</div>
        <h2 class="t-title" style="margin-bottom:32px">Leer una tabla de precios</h2>
        <div class="pc">
          <ul>
            <li><b>Entrada</b><span>Lo que tú mandas: instrucciones, tabla, pregunta.</span></li>
            <li data-step="1"><b>Salida</b><span>Lo que el modelo escribe. Suele costar varias veces más que la entrada.</span></li>
            <li data-step="2"><b>Razonamiento</b><span>Tokens que el modelo genera antes de contestar. No siempre los ves; se cobran como salida.</span></li>
            <li data-step="3"><b>Caché</b><span>Entrada repetida, como las mismas instrucciones en cada llamada, puede salir más barata.</span></li>
          </ul>
          <div data-step="4">
            <div class="t-label accent">Por respuesta</div>
<p class="eq">( tokens de entrada × precio de entrada<br>+ tokens de salida × precio de salida )<br>÷ 1,000,000<br><span class="k">= costo por respuesta</span></p>
            <p class="t-small dim" style="margin-top:30px">Precios en USD por millón de tokens. Ponlos en tu <span class="mono">.env</span> desde la página de tu proveedor; el lab hace la cuenta.</p>
          </div>
        </div>`,
    },
    {
      id: 'benchmark',
      title: 'El benchmark no es tu pregunta',
      time: 240,
      particles: { shape: 'split', opacity: 0.14 },
      html: `
        <div class="t-label">Elegir modelo · 4</div>
        <h2 class="t-title">El benchmark público no responde tu pregunta</h2>
        <div class="bm">
          <div>
            <div class="t-label">Un benchmark público mide</div>
            <h3>Sus preguntas</h3>
            <ul><li>Sus datos y su formato</li><li>Sus definiciones</li><li>Preguntas que el modelo pudo haber visto al entrenar</li></ul>
          </div>
          <div data-step="1">
            <div class="t-label accent">Tu set dorado mide</div>
            <h3>Tus preguntas</h3>
            <ul><li>Tu tabla, tus columnas, tus códigos (TDC, SPEI)</li><li>Tu definición de "tarjeta"</li><li>Respuestas que ya conoces, calculadas con código</li></ul>
          </div>
        </div>
        <p class="bm-foot" data-step="2">Diez preguntas tuyas con respuesta conocida dicen más de tu caso que cualquier leaderboard.</p>`,
    },
  ]);
})();
