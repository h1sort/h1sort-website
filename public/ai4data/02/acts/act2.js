// Act 2 · Elegir modelo: tres familias, regla práctica, tabla de precios, benchmark vs set dorado.
(() => {
  Deck.css(`
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

  Deck.act(2, 'Elegir modelo', [
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
            <p class="ej">qwen3:1.7b<br>llama · gemma · gpt-oss</p>
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
