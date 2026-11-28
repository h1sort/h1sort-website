// Act 0 · Hora de instalación (opcional): Ollama + qwen3, primera llamada desde Python, cuentas de warehouse.
(() => {
  Deck.css(`
    .slide pre.code .c { color: var(--faint); }
    .slide .fg { color: var(--fg); }
    .slide .big { font-size: 96px; font-weight: 500; letter-spacing: -0.03em; line-height: 1; }

    #s-instalar .in { display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px; margin-top: 10px; }
    #s-instalar .in > div { border-top: 3px solid var(--fg); padding-top: 22px; }
    #s-instalar .in .n { font-family: var(--mono); font-size: 24px; color: var(--accent); }
    #s-instalar .in h3 { font-size: 40px; font-weight: 500; margin: 12px 0 12px; letter-spacing: -0.01em; }
    #s-instalar .in p { font-size: 28px; color: var(--dim); line-height: 1.35; margin: 0; }
    #s-instalar .in-foot { margin-top: 64px; font-size: 40px; max-width: 1500px; line-height: 1.3; }

    #s-ollama .ol { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; }
    #s-ollama .ol .t-label { margin-bottom: 18px; }
    #s-ollama .ol pre.code { font-size: 28px; }
    #s-ollama .ol .t-small { margin-top: 22px; color: var(--dim); }

    #s-hola .ho { display: grid; grid-template-columns: 1.1fr 1fr; gap: 56px; }
    #s-hola .ho pre.code { font-size: 26px; }
    #s-hola .ho pre.out { font-family: var(--mono); font-size: 24px; line-height: 1.45; color: var(--dim); margin: 0; white-space: pre; }

    #s-cuentas .cu { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; margin-top: 10px; }
    #s-cuentas .cu > div { border-top: 3px solid var(--fg); padding-top: 24px; }
    #s-cuentas .cu h3 { font-size: 52px; font-weight: 500; margin: 12px 0 18px; }
    #s-cuentas .cu p { font-size: 30px; color: var(--dim); line-height: 1.35; margin: 0 0 14px; }

    #s-problemas .pr { list-style: none; padding: 0; margin: 0; max-width: 1680px; }
    #s-problemas .pr li { display: grid; grid-template-columns: 620px 1fr; gap: 40px; padding: 20px 0; border-top: 2px solid var(--hair); font-size: 30px; line-height: 1.3; }
    #s-problemas .pr li:last-child { border-bottom: 2px solid var(--hair); }
    #s-problemas .pr .m { font-family: var(--mono); font-size: 26px; color: var(--accent); }
  `);

  Deck.act(0, 'Instalación', [
    {
      id: 'instalar',
      title: 'Hora de instalación',
      time: 300,
      label: 'Instalación · opcional',
      particles: { shape: 'grid', opacity: 0.14 },
      html: `
        <div class="t-label">Sesión 02 · hora de instalación · opcional</div>
        <h2 class="t-title">Antes de empezar: tu modelo local</h2>
        ${Timer.html(15)}
        <div class="in">
          <div><div class="n">01</div><h3>Actualiza el repo</h3><p><span class="mono">git pull</span> dentro de <span class="mono">AI4DATA/ai4data</span>. Hoy hay labs nuevos.</p></div>
          <div><div class="n">02</div><h3>Ollama + qwen3</h3><p>Instala Ollama y descarga <span class="mono">qwen3:1.7b</span>: 1.4 GB.</p></div>
          <div><div class="n">03</div><h3>Primera llamada</h3><p>Tu modelo contesta desde Python con <span class="mono">hola.py</span>.</p></div>
          <div><div class="n">04</div><h3>Un warehouse</h3><p>Cuenta de prueba de Snowflake o Databricks Free Edition.</p></div>
        </div>
        <p class="in-foot">Cuando <span class="mono accent">hola.py</span> te conteste, terminaste. Si terminamos antes, descanso hasta la clase.</p>`,
    },
    {
      id: 'ollama',
      title: 'Ollama',
      time: 600,
      label: 'Instalación · opcional',
      particles: { shape: 'two', opacity: 0.12 },
      html: `
        <div class="t-label">ollama.com/download · Windows, Mac o Linux</div>
        <h2 class="t-title" style="margin-bottom:32px">Instala Ollama y descarga qwen3</h2>
        <div class="ol">
          <div>
            <div class="t-label accent">1 · Actualiza el repo</div>
<pre class="code">cd AI4DATA/ai4data
git pull</pre>
            <div class="t-label accent" style="margin-top:40px">2 · Descarga el modelo</div>
<pre class="code">ollama pull qwen3:1.7b</pre>
            <div class="t-small">¿Poca memoria? <span class="mono">qwen3:0.6b</span>, 523 MB.</div>
          </div>
          <div>
            <div class="t-label accent">3 · Platica con él en la terminal</div>
<pre class="code">ollama run qwen3:1.7b --verbose</pre>
            <div class="t-small"><span class="mono">--verbose</span> imprime la velocidad (<em>eval rate</em>, tokens por segundo). Sal con <span class="mono">/bye</span>.</div>
            <div class="t-label accent" style="margin-top:40px">4 · ¿Qué está cargado y cuánto pesa?</div>
<pre class="code">ollama ps</pre>
          </div>
        </div>`,
    },
    {
      id: 'hola',
      title: 'Primera llamada desde Python',
      time: 300,
      label: 'Instalación · opcional',
      particles: { shape: 'swarm', opacity: 0.12 },
      html: `
        <div class="t-label">sesiones/02/lab-local/hola.py</div>
        <h2 class="t-title" style="margin-bottom:32px">Tu modelo, desde Python</h2>
        <div class="ho">
          <div>
            <div class="t-label accent">Local (lo que diga tu .env)</div>
<pre class="code">uv run sesiones/02/lab-local/hola.py</pre>
            <div class="t-label accent" style="margin-top:34px">Sin razonar antes de contestar</div>
<pre class="code">uv run sesiones/02/lab-local/hola.py --sin-pensar</pre>
            <div class="t-label accent" style="margin-top:34px">Con tu llave, para comparar</div>
<pre class="code">uv run sesiones/02/lab-local/hola.py --claude</pre>
          </div>
          <div>
            <div class="t-label">Te imprime</div>
<pre class="out">modelo qwen3:1.7b · en tu laptop

Un token es un pedazo de texto…

tokens    … de entrada · … de salida
tiempo    …
velocidad … tokens de salida por segundo
costo     $0: corre en tu máquina</pre>
            <div class="t-small dim" style="margin-top:26px">Compara la velocidad con y sin <span class="mono">--sin-pensar</span>: qwen3 razona antes de contestar, y esos tokens también tardan.</div>
          </div>
        </div>`,
    },
    {
      id: 'cuentas',
      title: 'Una cuenta de warehouse',
      time: 300,
      label: 'Instalación · opcional',
      particles: { shape: 'split', opacity: 0.12 },
      html: `
        <div class="t-label">Para el lab de hoy · elige una</div>
        <h2 class="t-title">Un warehouse con modelos adentro</h2>
        <div class="cu">
          <div>
            <div class="t-label accent">Snowflake</div>
            <h3>Cuenta de prueba</h3>
            <p>Gratis por tiempo limitado, con créditos de regalo.</p>
            <p>El modelo se llama desde SQL con <span class="mono">AI_COMPLETE</span>.</p>
          </div>
          <div>
            <div class="t-label accent">Databricks</div>
            <h3>Free Edition</h3>
            <p>Gratis, con límites de uso.</p>
            <p>El modelo se llama desde SQL con <span class="mono">ai_query</span>.</p>
          </div>
        </div>
        <p class="t-small dim" style="margin-top:56px">Con una basta. Si ya tienes una de tu trabajo, usa una de prueba: hoy subimos datos del curso, no del trabajo.</p>`,
    },
    {
      id: 'problemas',
      title: 'Problemas comunes',
      time: 300,
      label: 'Instalación · opcional',
      particles: { shape: 'scatter', opacity: 0.12 },
      html: `
        <div class="t-label">Si algo falla</div>
        <h2 class="t-title" style="margin-bottom:28px">Problemas comunes</h2>
        <ul class="pr">
          <li><span class="m">No encuentro Ollama en…</span><span>Abre la app de Ollama (o corre <span class="mono">ollama serve</span>) y vuelve a intentar.</span></li>
          <li><span class="m">Ollama no tiene el modelo…</span><span><span class="mono">ollama pull qwen3:1.7b</span>, o el modelo que pusiste en tu .env.</span></li>
          <li><span class="m">Tarda muchísimo</span><span><span class="mono">--sin-pensar</span>, o el modelo de 0.6b. Cierra lo que no uses: el modelo vive en tu RAM.</span></li>
          <li><span class="m">git pull se queja</span><span>Tienes cambios locales: <span class="mono">git stash</span>, luego <span class="mono">git pull</span>.</span></li>
          <li><span class="m">uv o ollama: no se reconoce</span><span>Cierra y vuelve a abrir la terminal después de instalar.</span></li>
        </ul>`,
    },
  ]);
})();
