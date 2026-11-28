// Act 3 · Formas de responder, dónde corre el modelo y los dos labs (score.py y el warehouse).
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

    #s-una-cadena .uc { display: grid; grid-template-columns: 0.62fr 1.38fr; gap: 48px; }
    #s-una-cadena .uc p { font-size: 28px; color: var(--dim); line-height: 1.38; margin: 0 0 18px; }
    #s-una-cadena .uc pre.raw { font-family: var(--mono); font-size: 23px; line-height: 1.45; margin: 0; white-space: pre; border: var(--stroke) solid var(--hair); border-radius: 14px; padding: 20px 24px; }
    #s-una-cadena .uc pre.raw .s { color: var(--faint); }
    #s-una-cadena .uc pre.raw .t { color: var(--accent); }

    #s-tool-loop .tl { list-style: none; padding: 0; margin: 0; max-width: 1680px; }
    #s-tool-loop .tl li { display: grid; grid-template-columns: 90px 260px 1fr; gap: 24px; padding: 20px 0; border-top: 2px solid var(--hair); font-size: 32px; line-height: 1.3; align-items: baseline; }
    #s-tool-loop .tl li:last-child { border-bottom: 2px solid var(--hair); }
    #s-tool-loop .tl .n { font-family: var(--mono); font-size: 26px; color: var(--accent); }
    #s-tool-loop .tl .who { font-family: var(--mono); font-size: 24px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--dim); }
    #s-tool-loop .tl-foot { margin-top: 40px; font-size: 36px; max-width: 1640px; line-height: 1.3; }
  `);

  Deck.act(4, 'Formas y lugares', [
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
            <div class="n">03 · hoy</div>
            <h3>El modelo usa herramientas</h3>
            <p>Decide qué consultar, tu código lo corre, el modelo lee el resultado y sigue: un agente.</p>
            <p class="flow">pregunta → modelo ⇄ herramientas → número</p>
          </div>
        </div>`,
    },
    {
      id: 'una-cadena',
      title: 'Para el modelo, todo es una cadena',
      time: 300,
      particles: { shape: 'grid', opacity: 0.12 },
      html: `
        <div class="t-label">Tool calling por dentro · plantilla de chat de qwen, la de bonsai (simplificada)</div>
        <h2 class="t-title" style="margin-bottom:26px">Para el modelo, todo es una cadena</h2>
        <div class="uc">
          <div>
            <p>Tus mensajes (system, user, assistant) se pegan en un solo texto con tokens especiales.</p>
            <p data-step="1">Las herramientas también: su descripción en JSON va dentro del texto.</p>
            <p data-step="2">Y el modelo "llama" a una herramienta escribiendo texto: un JSON entre etiquetas. Predice el siguiente token, como siempre.</p>
          </div>
<pre class="raw"><span class="s">&lt;|im_start|&gt;</span>system
Eres un analista de datos…
<span class="t">&lt;tools&gt;</span>{"name": "run_sql", "parameters": …}<span class="t">&lt;/tools&gt;</span><span class="s">&lt;|im_end|&gt;</span>
<span class="s">&lt;|im_start|&gt;</span>user
¿Cuántas transacciones hay?<span class="s">&lt;|im_end|&gt;</span>
<span class="s">&lt;|im_start|&gt;</span>assistant
<span class="t">&lt;tool_call&gt;</span>
{"name": "run_sql",
 "arguments": {"sql": "SELECT COUNT(*) FROM t"}}
<span class="t">&lt;/tool_call&gt;</span><span class="s">&lt;|im_end|&gt;</span>
<span class="s">&lt;|im_start|&gt;</span>user
<span class="t">&lt;tool_response&gt;</span>[[500]]<span class="t">&lt;/tool_response&gt;</span><span class="s">&lt;|im_end|&gt;</span>
<span class="s">&lt;|im_start|&gt;</span>assistant
500<span class="s">&lt;|im_end|&gt;</span></pre>
        </div>`,
    },
    {
      id: 'tool-loop',
      title: 'El ciclo',
      time: 240,
      particles: { shape: 'ring', opacity: 0.12 },
      html: `
        <div class="t-label">Tool calling · quién hace qué</div>
        <h2 class="t-title" style="margin-bottom:26px">El modelo pide. Tu código ejecuta.</h2>
        <ul class="tl">
          <li><span class="n">01</span><span class="who">Tu código</span><span>Manda la pregunta y la lista de herramientas.</span></li>
          <li data-step="1"><span class="n">02</span><span class="who">Modelo</span><span>Escribe una llamada: <span class="mono">run_sql({"sql": "…"})</span>. No ejecuta nada.</span></li>
          <li data-step="2"><span class="n">03</span><span class="who">Tu código</span><span>Corre el SQL en DuckDB y agrega el resultado a la conversación.</span></li>
          <li data-step="3"><span class="n">04</span><span class="who">Tu código</span><span>Reenvía <em>toda</em> la conversación. El modelo pide otra cosa, o contesta.</span></li>
        </ul>
        <p class="tl-foot" data-step="4">Repetir hasta que conteste: eso es un agente. Lo que el modelo puede tocar lo decides tú, en el paso 3.</p>`,
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
        <p class="cl-foot" data-step="2">Por eso, en la estrategia <span class="mono accent">compute</span> le damos 50 filas. Y la verdad se calcula sobre esas mismas 50.</p>
        <div class="cite foot">docs.ollama.com · FAQ y "OpenAI compatibility"</div>`,
    },
    {
      id: 'lab-formas',
      title: 'Lab · tres estrategias',
      time: 2100,
      label: 'Lab · 35 min',
      particles: { shape: 'swarm', opacity: 0.12 },
      html: `
        <div class="t-label">Lab · 35 minutos · sesiones/02/lab-answer-strategies</div>
        <h2 class="t-title" style="margin-bottom:28px">Tres estrategias, en tu modelo</h2>
        ${Timer.html()}
        <div class="lf">
          <div>
            <div class="t-label accent">Tu modelo (lo que diga tu .env)</div>
<pre class="code">uv run sesiones/02/lab-answer-strategies/score.py --strategy compute
uv run sesiones/02/lab-answer-strategies/score.py --strategy sql
uv run sesiones/02/lab-answer-strategies/score.py --strategy tool</pre>
            <div class="t-label accent" style="margin-top:30px">Con tu API key</div>
<pre class="code">uv run sesiones/02/lab-answer-strategies/score.py --strategy tool --claude
uv run sesiones/02/lab-answer-strategies/score.py --strategy tool --openai</pre>
            <div class="t-label accent" style="margin-top:30px">La tabla para tu memo</div>
<pre class="code">uv run sesiones/02/lab-answer-strategies/compare.py</pre>
          </div>
          <ul>
            <li><b>10 preguntas × 2 corridas</b> del set dorado, con cada estrategia.</li>
            <li><b>compute:</b> 50 filas en el prompt.</li>
            <li><b>sql:</b> solo el esquema; DuckDB corre la consulta sobre las 500 filas.</li>
            <li><b>tool:</b> te imprime la primera traza completa; <span class="mono">--trace</span> para todas.</li>
            <li><b>¿Va lento?</b> <span class="mono">--no-thinking</span> o <span class="mono">--runs 1</span>.</li>
            <li><b>API key</b> en tu <span class="mono">.env</span>: <span class="mono">ANTHROPIC_API_KEY</span> u <span class="mono">OPENAI_API_KEY</span>.</li>
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
          <li><span class="n">01</span><span>Exactitud: compute vs sql vs tool, en el mismo modelo<small>¿El modelo chico mejora cuando no tiene que sumar?</small></span></li>
          <li data-step="1"><span class="n">02</span><span>Tokens por respuesta<small>Leer filas cuesta miles; escribir una consulta, cientos.</small></span></li>
          <li data-step="2"><span class="n">03</span><span>Costo × 1,000 preguntas<small>Lo que pagarías si esto lo usara todo tu equipo un mes.</small></span></li>
          <li data-step="3"><span class="n">04</span><span>Latencia: tu laptop vs la API<small>¿Cuánto esperarías tú, y cuánto esperaría tu usuario?</small></span></li>
          <li data-step="4"><span class="n">05</span><span>Errores de SQL y vueltas<small>Con tool, el modelo ve el error y puede corregirse; cada vuelta reenvía toda la conversación.</small></span></li>
        </ul>`,
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
          <tr><td>Tu máquina<span class="m">Ollama · bonsai</span></td><td>No</td><td>$0 por token; pagas en hardware y tiempo</td><td>Tú</td></tr>
          <tr data-step="1"><td>API pública<span class="m">OpenAI · Anthropic</span></td><td>Sí, al proveedor</td><td>Por token</td><td>El proveedor</td></tr>
          <tr data-step="2"><td>Dentro del warehouse<span class="m">Databricks · ai_query</span></td><td>No salen de tu cuenta</td><td>Créditos del warehouse</td><td>El warehouse</td></tr>
        </table>`,
    },
    {
      id: 'lab-warehouse',
      title: 'Lab · el modelo dentro del warehouse',
      time: 1200,
      label: 'Lab · 20 min',
      particles: { shape: 'swarm', opacity: 0.12 },
      html: `
        <div class="t-label">Lab · 20 minutos · sesiones/02/lab-warehouse</div>
        <h2 class="t-title" style="margin-bottom:28px">El modelo dentro del warehouse</h2>
        ${Timer.html()}
        <div class="lw">
          <div><div class="n">0</div><h3>Carga</h3><p><span class="mono">caso/transacciones.csv</span> como tabla <span class="mono">transacciones</span>.</p></div>
          <div><div class="n">1 · 2</div><h3>Verdad y modelo</h3><p>La verdad con SQL; el modelo calcula sobre 50 filas, en la misma consulta.</p></div>
          <div><div class="n">3</div><h3>Cinco veces</h3><p>La misma pregunta cinco veces. ¿Cuántas respuestas distintas?</p></div>
          <div><div class="n">4</div><h3>Escribe SQL</h3><p>El modelo escribe la consulta; tú la corres y comparas.</p></div>
        </div>
        <p class="lw-files">Abre <span class="mono accent">databricks_ai_query.sql</span> y corre bloque por bloque.</p>`,
    },
  ]);
})();
