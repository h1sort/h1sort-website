// Act 3 · Formas de responder, dónde corre el modelo y los dos labs (formas.py y el warehouse).
(() => {
  Deck.css(`
    #s-tres-formas .tf { display: grid; grid-template-columns: repeat(3, 1fr); gap: 44px; margin-top: 10px; }
    #s-tres-formas .tf > div { border: var(--stroke) solid var(--faint); border-radius: 18px; padding: 28px 30px 32px; }
    #s-tres-formas .tf .n { font-family: var(--mono); font-size: 24px; color: var(--accent); }
    #s-tres-formas .tf h3 { font-size: 44px; font-weight: 500; margin: 14px 0 16px; letter-spacing: -0.01em; }
    #s-tres-formas .tf p { font-size: 28px; color: var(--dim); line-height: 1.35; margin: 0 0 14px; }
    #s-tres-formas .tf .flow { font-family: var(--mono); font-size: 22px; color: var(--fg); line-height: 1.6; }

    #s-contexto-local .cl { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; margin-top: 20px; align-items: end; }
    #s-contexto-local .cl .big { font-size: 150px; }
    #s-contexto-local .cl p { font-size: 32px; color: var(--dim); line-height: 1.35; margin: 18px 0 0; }
    #s-contexto-local .cl-foot { margin-top: 64px; font-size: 38px; max-width: 1600px; line-height: 1.3; }

    #s-donde .dn { width: 100%; border-collapse: collapse; margin-top: 6px; }
    #s-donde .dn th, #s-donde .dn td { text-align: left; padding: 18px 20px; border-top: 2px solid var(--hair); font-size: 29px; line-height: 1.3; vertical-align: top; }
    #s-donde .dn tr:last-child td { border-bottom: 2px solid var(--hair); }
    #s-donde .dn th { font-family: var(--mono); font-size: 22px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--dim); font-weight: 400; }
    #s-donde .dn td:first-child { font-size: 34px; font-weight: 500; width: 380px; }
    #s-donde .dn .m { font-family: var(--mono); font-size: 24px; color: var(--accent); display: block; margin-top: 6px; font-weight: 400; }

    #s-residencia .rs { display: grid; grid-template-columns: 1fr 1fr; gap: 72px; }
    #s-residencia .rs p { font-size: 32px; color: var(--dim); line-height: 1.38; margin: 0 0 22px; }
    #s-residencia .rs pre.code { font-size: 25px; }

    #s-lab-formas .lf { display: grid; grid-template-columns: 1.25fr 1fr; gap: 52px; }
    #s-lab-formas .lf pre.code { font-size: 22px; line-height: 1.5; }
    #s-lab-formas .lf .t-label { margin-bottom: 14px; }
    #s-lab-formas .lf ul { list-style: none; padding: 0; margin: 0; }
    #s-lab-formas .lf li { font-size: 28px; color: var(--dim); line-height: 1.35; padding: 12px 0; border-top: 2px solid var(--hair); }
    #s-lab-formas .lf li:last-child { border-bottom: 2px solid var(--hair); }
    #s-lab-formas .lf li b { color: var(--fg); font-weight: 500; }

    #s-que-ver .qv { list-style: none; padding: 0; margin: 0; max-width: 1640px; }
    #s-que-ver .qv li { display: grid; grid-template-columns: 90px 1fr; padding: 22px 0; border-top: 2px solid var(--hair); font-size: 36px; line-height: 1.3; }
    #s-que-ver .qv li:last-child { border-bottom: 2px solid var(--hair); }
    #s-que-ver .qv .n { font-family: var(--mono); font-size: 26px; color: var(--accent); padding-top: 6px; }
    #s-que-ver .qv small { display: block; font-size: 28px; color: var(--dim); margin-top: 6px; }

    #s-pausa .pa { font-size: 120px; font-weight: 500; letter-spacing: -0.03em; margin: 0; }

    #s-lab-warehouse .lw { display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px; margin-top: 10px; }
    #s-lab-warehouse .lw > div { border-top: 3px solid var(--fg); padding-top: 20px; }
    #s-lab-warehouse .lw .n { font-family: var(--mono); font-size: 24px; color: var(--accent); }
    #s-lab-warehouse .lw h3 { font-size: 38px; font-weight: 500; margin: 12px 0 12px; }
    #s-lab-warehouse .lw p { font-size: 27px; color: var(--dim); line-height: 1.35; margin: 0; }
    #s-lab-warehouse .lw-files { margin-top: 52px; font-size: 32px; line-height: 1.5; }
  `);

  Deck.act(3, 'Formas y lugares', [
    {
      id: 'tres-formas',
      title: 'Tres formas de responder',
      time: 300,
      particles: { shape: 'scatter', opacity: 0.14 },
      html: `
        <div class="t-label">Una pregunta de datos · tres caminos</div>
        <h2 class="t-title">Tres formas de responder</h2>
        <div class="tf">
          <div>
            <div class="n">01 · hoy</div>
            <h3>El modelo calcula</h3>
            <p>Le das las filas y la pregunta. Lee, suma y contesta.</p>
            <p class="flow">filas + pregunta → modelo → número</p>
          </div>
          <div data-step="1">
            <div class="n">02 · hoy</div>
            <h3>El modelo escribe SQL</h3>
            <p>Le das el esquema. Escribe la consulta; el warehouse la corre sobre todos los datos.</p>
            <p class="flow">esquema + pregunta → modelo → SQL → base → número</p>
          </div>
          <div data-step="2">
            <div class="n">03 · sesión 6</div>
            <h3>El modelo usa herramientas</h3>
            <p>Decide qué consultar, lo corre, lee el resultado y sigue: un agente.</p>
            <p class="flow">pregunta → modelo ⇄ herramientas → número</p>
          </div>
        </div>`,
    },
    {
      id: 'contexto-local',
      title: 'Lo que ve tu modelo local',
      time: 180,
      particles: { shape: 'two', opacity: 0.14 },
      html: `
        <div class="t-label">Antes del lab · Ollama</div>
        <h2 class="t-title">Lo que ve tu modelo local</h2>
        <div class="cl">
          <div><div class="t-label">Ventana de Ollama por defecto</div><div class="big accent">4,096</div><p>tokens. Por la API compatible con OpenAI no se puede cambiar por llamada.</p></div>
          <div data-step="1"><div class="t-label">Nuestra tabla completa</div><div class="big">~18,000</div><p>tokens. No le cabe: Ollama la corta y el modelo contesta igual, sin avisar.</p></div>
        </div>
        <p class="cl-foot" data-step="2">Por eso, en el modo <span class="mono accent">calcula</span> le damos 50 filas. Y la verdad se calcula sobre esas mismas 50.</p>
        <div class="cite foot">docs.ollama.com · FAQ y "OpenAI compatibility"</div>`,
    },
    {
      id: 'donde',
      title: 'Dónde corre el modelo',
      time: 300,
      particles: { shape: 'grid', opacity: 0.14 },
      html: `
        <div class="t-label">Dónde corre el modelo</div>
        <h2 class="t-title" style="margin-bottom:24px">Tres lugares, tres contratos</h2>
        <table class="dn">
          <tr><th></th><th>¿Tus datos salen?</th><th>Costo</th><th>Quién lo opera</th></tr>
          <tr><td>Tu máquina<span class="m">Ollama · qwen3</span></td><td>No</td><td>$0 por token; pagas en hardware y tiempo</td><td>Tú</td></tr>
          <tr data-step="1"><td>API pública<span class="m">OpenAI · Anthropic</span></td><td>Sí, al proveedor</td><td>Por token</td><td>El proveedor</td></tr>
          <tr data-step="2"><td>Dentro del warehouse<span class="m">AI_COMPLETE · ai_query</span></td><td>No salen de tu cuenta; la inferencia puede correr en otra región</td><td>Créditos del warehouse</td><td>El warehouse</td></tr>
        </table>`,
    },
    {
      id: 'residencia',
      title: 'Residencia de datos',
      time: 180,
      particles: { shape: 'split', opacity: 0.14 },
      html: `
        <div class="t-label">Industrias reguladas · Snowflake</div>
        <h2 class="t-title" style="margin-bottom:30px">¿En qué región piensa tu modelo?</h2>
        <div class="rs">
          <div>
            <p>Snowflake guarda tus datos en la región de tu cuenta, pero puede mandar la <em>inferencia</em> a otra región si ahí hay capacidad.</p>
            <p data-step="1">En cuentas nuevas desde marzo de 2026, eso viene encendido: <span class="mono fg">ANY_REGION</span>.</p>
          </div>
          <div data-step="2">
            <div class="t-label accent" style="margin-bottom:16px">Revísalo en tu cuenta</div>
<pre class="code">SHOW PARAMETERS LIKE
  'CORTEX_ENABLED_CROSS_REGION' IN ACCOUNT;</pre>
            <p style="margin-top:26px">Si tu regulador pide que todo se procese en una región, esto se decide con tu área de cumplimiento, no en el lab.</p>
          </div>
        </div>
        <div class="cite foot">docs.snowflake.com · Cortex AI, "Cross-region inference"</div>`,
    },
    {
      id: 'lab-formas',
      title: 'Lab · calcula vs SQL',
      time: 2100,
      label: 'Lab · 35 min',
      particles: { shape: 'swarm', opacity: 0.12 },
      html: `
        <div class="t-label">Lab · 35 minutos · sesiones/02/lab-formas</div>
        <h2 class="t-title" style="margin-bottom:28px">Calcula vs SQL, en tu modelo</h2>
        ${Timer.html(35)}
        <div class="lf">
          <div>
            <div class="t-label accent">Tu modelo (lo que diga tu .env)</div>
<pre class="code">uv run sesiones/02/lab-formas/formas.py --modo calcula
uv run sesiones/02/lab-formas/formas.py --modo sql</pre>
            <div class="t-label accent" style="margin-top:30px">Con tu llave (o la mía, en pantalla)</div>
<pre class="code">uv run sesiones/02/lab-formas/formas.py --modo calcula --claude
uv run sesiones/02/lab-formas/formas.py --modo sql --claude</pre>
            <div class="t-label accent" style="margin-top:30px">La tabla para tu memo</div>
<pre class="code">uv run sesiones/02/lab-formas/tabla.py</pre>
          </div>
          <ul>
            <li><b>10 preguntas × 2 corridas</b> del set dorado, en cada modo.</li>
            <li><b>calcula:</b> 50 filas en el prompt.</li>
            <li><b>sql:</b> solo el esquema; DuckDB corre la consulta sobre las 500 filas.</li>
            <li><b>¿Va lento?</b> <span class="mono">--sin-pensar</span> o <span class="mono">--k 1</span>.</li>
            <li><b>¿OpenAI?</b> <span class="mono">--openai</span> en lugar de <span class="mono">--claude</span>.</li>
          </ul>
        </div>`,
    },
    {
      id: 'que-ver',
      title: 'Qué mirar en tu tabla',
      time: 420,
      particles: { shape: 'grid', opacity: 0.14 },
      html: `
        <div class="t-label">Resultados · pega tu tabla en el chat</div>
        <h2 class="t-title" style="margin-bottom:28px">Qué mirar en tu tabla</h2>
        <ul class="qv">
          <li><span class="n">01</span><span>Exactitud: calcula vs sql, en el mismo modelo<small>¿El modelo chico mejora cuando solo escribe la consulta?</small></span></li>
          <li data-step="1"><span class="n">02</span><span>Tokens por respuesta<small>Leer filas cuesta miles; escribir una consulta, cientos.</small></span></li>
          <li data-step="2"><span class="n">03</span><span>Costo × 1,000 preguntas<small>Lo que pagarías si esto lo usara todo tu equipo un mes.</small></span></li>
          <li data-step="3"><span class="n">04</span><span>Latencia: tu laptop vs la API<small>¿Cuánto esperarías tú, y cuánto esperaría tu usuario?</small></span></li>
          <li data-step="4"><span class="n">05</span><span>Errores de SQL<small>Una consulta que no corre también es una respuesta incorrecta.</small></span></li>
        </ul>`,
    },
    {
      id: 'pausa',
      title: 'Pausa',
      time: 600,
      class: 'middle',
      particles: { shape: 'ring', opacity: 0.2 },
      html: `
        ${Timer.html(10)}
        <p class="pa">Pausa</p>
        <p class="t-small dim" style="margin-top:30px">Mientras tanto: carga <span class="mono">caso/transacciones.csv</span> como tabla en tu Snowflake o Databricks.</p>`,
    },
    {
      id: 'lab-warehouse',
      title: 'Lab · el modelo dentro del warehouse',
      time: 1500,
      label: 'Lab · 25 min',
      particles: { shape: 'swarm', opacity: 0.12 },
      html: `
        <div class="t-label">Lab · 25 minutos · sesiones/02/lab-warehouse</div>
        <h2 class="t-title" style="margin-bottom:28px">El modelo dentro del warehouse</h2>
        ${Timer.html(25)}
        <div class="lw">
          <div><div class="n">0</div><h3>Carga</h3><p><span class="mono">caso/transacciones.csv</span> como tabla <span class="mono">transacciones</span>.</p></div>
          <div><div class="n">1 · 2</div><h3>Verdad y modelo</h3><p>La verdad con SQL; el modelo calcula sobre 50 filas, en la misma consulta.</p></div>
          <div><div class="n">3</div><h3>Cinco veces</h3><p>La misma pregunta cinco veces. ¿Cuántas respuestas distintas?</p></div>
          <div><div class="n">4</div><h3>Escribe SQL</h3><p>El modelo escribe la consulta; tú la corres y comparas.</p></div>
        </div>
        <p class="lw-files">Abre <span class="mono accent">snowflake.sql</span> o <span class="mono accent">databricks.sql</span> y corre bloque por bloque.</p>`,
    },
  ]);
})();
