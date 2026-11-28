// Act 0 · Hora de instalación (opcional): Ollama + bonsai, primera llamada desde Python, cuentas de warehouse.
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

    #s-ollama-instalar .os { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; margin-top: 6px; }
    #s-ollama-instalar .os > div { border-top: 3px solid var(--fg); padding-top: 22px; }
    #s-ollama-instalar .os h3 { font-size: 46px; font-weight: 500; margin: 10px 0 14px; }
    #s-ollama-instalar .os p { font-size: 28px; color: var(--dim); line-height: 1.35; margin: 0 0 14px; }
    #s-ollama-instalar .os pre.code { font-size: 20px; padding: 18px 20px; margin-top: 18px; }
    #s-ollama-instalar .os .url { font-family: var(--mono); font-size: 24px; color: var(--accent); }
    #s-ollama-instalar .check { display: flex; align-items: center; gap: 32px; margin-top: 44px; }
    #s-ollama-instalar .check pre.code { font-size: 26px; }
    #s-ollama-instalar .check p { font-size: 30px; margin: 0; }

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

    .slide .ws { display: grid; grid-template-columns: 660px 1fr; gap: 56px; align-items: start; }
    .slide .ws ol { list-style: none; padding: 0; margin: 0; counter-reset: paso; }
    .slide .ws ol li { counter-increment: paso; position: relative; padding: 0 0 26px 64px; font-size: 30px; line-height: 1.35; }
    .slide .ws ol li::before { content: counter(paso, decimal-leading-zero); position: absolute; left: 0; top: 2px;
        font-family: var(--mono); font-size: 24px; color: var(--accent); }
    .slide .ws ol li small { display: block; font-size: 24px; color: var(--dim); margin-top: 6px; }
    .slide .ws pre.code { font-size: 24px; margin-top: 12px; }
    .slide .ws .shot { border: 2px solid var(--hair); border-radius: 14px; overflow: hidden; background: #fff; }
    .slide .ws .shot img { display: block; width: 100%; height: auto; }
    .slide .ws .shots2 { display: grid; grid-template-columns: 1.35fr 1fr; gap: 28px; align-items: start; }
    .slide .ws .cap { font-family: var(--mono); font-size: 20px; color: var(--dim); margin-top: 12px; letter-spacing: 0.04em; }
    .slide .aviso { border-left: 4px solid var(--accent); padding: 6px 0 6px 24px; font-size: 27px; line-height: 1.35; margin-top: 8px; }

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
          <div><div class="n">02</div><h3>Ollama + bonsai</h3><p>Instala Ollama y descarga <span class="mono">bonsai-2:9b</span>: 3.2 GB.</p></div>
          <div><div class="n">03</div><h3>Primera llamada</h3><p>Tu modelo contesta desde Python con <span class="mono">ask.py</span>.</p></div>
          <div><div class="n">04</div><h3>Un warehouse</h3><p>Databricks Free Edition, con tu Gmail.</p></div>
        </div>
        <p class="in-foot">Cuando <span class="mono accent">ask.py</span> te conteste, terminaste. Si terminamos antes, descanso hasta la clase.</p>`,
    },
    {
      id: 'ollama-instalar',
      title: 'Instala Ollama',
      time: 300,
      label: 'Instalación · opcional',
      particles: { shape: 'two', opacity: 0.12 },
      html: `
        <div class="t-label">ollama.com/download · elige tu sistema</div>
        <h2 class="t-title" style="margin-bottom:30px">Instala Ollama</h2>
        <div class="os">
          <div>
            <div class="t-label accent">Windows</div>
            <h3>Instalador</h3>
            <p><span class="url">ollama.com/download/windows</span></p>
            <p>Descarga <span class="mono">OllamaSetup.exe</span> y ábrelo. O en PowerShell:</p>
<pre class="code">irm https://ollama.com/install.ps1 | iex</pre>
          </div>
          <div>
            <div class="t-label accent">Mac</div>
            <h3>Instalador</h3>
            <p><span class="url">ollama.com/download/mac</span></p>
            <p>Descarga <span class="mono">Ollama.dmg</span>, ábrelo y arrastra Ollama a Aplicaciones.</p>
          </div>
          <div>
            <div class="t-label accent">Linux</div>
            <h3>Un comando</h3>
            <p><span class="url">ollama.com/download/linux</span></p>
<pre class="code">curl -fsSL https://ollama.com/install.sh | sh</pre>
          </div>
        </div>
        <div class="check">
<pre class="code">ollama --version</pre>
          <p>Cierra y vuelve a abrir la terminal. Necesitas <span class="accent">0.40.6</span> o más nuevo.</p>
        </div>`,
    },
    {
      id: 'ollama',
      title: 'Descarga bonsai',
      time: 600,
      label: 'Instalación · opcional',
      particles: { shape: 'two', opacity: 0.12 },
      html: `
        <div class="t-label">ollama.com/library/bonsai-2</div>
        <h2 class="t-title" style="margin-bottom:32px">Descarga bonsai y platica con él</h2>
        <div class="ol">
          <div>
            <div class="t-label accent">1 · Actualiza el repo</div>
<pre class="code">cd AI4DATA/ai4data
git pull</pre>
            <div class="t-label accent" style="margin-top:40px">2 · Descarga el modelo</div>
<pre class="code">ollama pull bonsai-2:9b</pre>
            <div class="t-small">En tu <span class="mono">.env</span>: <span class="mono accent">LLM_MODEL=bonsai-2:9b</span> (venías con qwen3).</div>
            <div class="t-small">¿Poca memoria? <span class="mono">bonsai-2:4b</span>, 1.6 GB.</div>
          </div>
          <div>
            <div class="t-label accent">3 · Platica con él en la terminal</div>
<pre class="code">ollama run bonsai-2:9b --verbose</pre>
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
        <div class="t-label">sesiones/02/lab-local-model/ask.py</div>
        <h2 class="t-title" style="margin-bottom:32px">Tu modelo, desde Python</h2>
        <div class="ho">
          <div>
            <div class="t-label accent">Local (lo que diga tu .env)</div>
<pre class="code">uv run sesiones/02/lab-local-model/ask.py</pre>
            <div class="t-label accent" style="margin-top:34px">Sin razonar antes de contestar</div>
<pre class="code">uv run sesiones/02/lab-local-model/ask.py --no-thinking</pre>
            <div class="t-label accent" style="margin-top:34px">Con tu llave, para comparar</div>
<pre class="code">uv run sesiones/02/lab-local-model/ask.py --claude</pre>
          </div>
          <div>
            <div class="t-label">Te imprime</div>
<pre class="out">modelo bonsai-2:9b · en tu laptop

Un token es un pedazo de texto…

tokens    … de entrada · … de salida
tiempo    …
velocidad … tokens de salida por segundo
costo     $0: corre en tu máquina</pre>
            <div class="t-small dim" style="margin-top:26px">Compara la velocidad con y sin <span class="mono">--no-thinking</span>: bonsai razona antes de contestar, y esos tokens también tardan.</div>
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
        <div class="t-label">Para el lab de hoy</div>
        <h2 class="t-title">Un warehouse con modelos adentro</h2>
        <div class="cu">
          <div>
            <div class="t-label accent">Databricks</div>
            <h3>Free Edition</h3>
            <p>Gratis, entras con tu Gmail, con límites de uso.</p>
          </div>
          <div>
            <div class="t-label accent">El modelo, desde SQL</div>
            <h3><span class="mono">ai_query</span></h3>
            <p>Los datos no salen de tu cuenta: el modelo corre dentro de la plataforma.</p>
          </div>
        </div>
        <p class="t-small dim" style="margin-top:56px">Si ya tienes una cuenta de tu trabajo, abre una personal: hoy subimos datos del curso, no del trabajo.</p>`,
    },
    {
      id: 'databricks-cuenta',
      title: 'Databricks · tu cuenta',
      time: 180,
      label: 'Instalación · opcional',
      particles: { shape: 'grid', opacity: 0.10 },
      html: `
        <div class="t-label">Databricks Free Edition · paso a paso · 1 de 3</div>
        <h2 class="t-title" style="margin-bottom:36px">Abre tu cuenta</h2>
        <div class="ws">
          <ol>
            <li>Entra a<small class="mono" style="font-size:26px;white-space:nowrap;color:var(--accent)">databricks.com/learn/free-edition</small></li>
            <li><b>Sign up for Free Edition</b><small>Continúa con Google: tu Gmail personal.</small></li>
            <li>Te deja en tu <b>workspace</b><small>Es tu espacio: catálogo, editor de SQL y modelos.</small></li>
          </ol>
          <div><div class="shot"><img src="assets/wh-databricks-1-free-edition.jpg" alt="Página de Databricks Free Edition con el botón Sign up for Free Edition"></div></div>
        </div>`,
    },
    {
      id: 'databricks-tabla',
      title: 'Databricks · tu tabla',
      time: 240,
      label: 'Instalación · opcional',
      particles: { shape: 'grid', opacity: 0.10 },
      html: `
        <div class="t-label">Databricks Free Edition · paso a paso · 2 de 3</div>
        <h2 class="t-title" style="margin-bottom:36px">Sube el caso como tabla</h2>
        <div class="ws">
          <ol>
            <li><b>+ New</b> → <b>Add or upload data</b><small>O desde <b>Catalog</b> en el menú de la izquierda.</small></li>
            <li>Sube <span class="mono accent">caso/transacciones.csv</span><small>Del repo. Destino: <span class="mono">workspace.default</span>.</small></li>
            <li>Nombre de la tabla: <span class="mono accent">transacciones</span><small>Antes de crearla, revisa que <span class="mono">fecha</span> quede como DATE.</small></li>
            <li>Abre <b>SQL Editor</b> y prueba:
<pre class="code">SELECT COUNT(*) FROM transacciones;</pre>
              <small>Debe dar 500.</small></li>
          </ol>
          <div><div class="shot"><img src="assets/wh-databricks-2-workspace.jpg" alt="Workspace de Databricks: menú con Catalog y SQL Editor"></div>
            <div class="cap">Catalog y SQL Editor están en el menú de la izquierda</div></div>
        </div>`,
    },
    {
      id: 'databricks-token',
      title: 'Databricks · token (opcional)',
      time: 120,
      label: 'Instalación · opcional',
      particles: { shape: 'grid', opacity: 0.10 },
      html: `
        <div class="t-label">Databricks Free Edition · paso a paso · 3 de 3 · opcional</div>
        <h2 class="t-title" style="margin-bottom:36px">Un token, para entrar desde código</h2>
        <div class="ws">
          <ol>
            <li>Busca <b>Access tokens</b><small>Settings → Developer → Access tokens.</small></li>
            <li><b>Generate new token</b><small>Ponle nombre y vencimiento corto.</small></li>
            <li>Cópialo en ese momento<small>No se vuelve a mostrar. Guárdalo en tu <span class="mono">.env</span>: nunca en el chat, nunca en git.</small></li>
          </ol>
          <div><div class="shot"><img src="assets/wh-databricks-3-token.jpg" alt="Pantalla de Access tokens en Databricks"></div>
            <div class="cap">Hoy no lo necesitas: el lab corre en el SQL Editor</div></div>
        </div>`,
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
          <li><span class="m">Ollama no tiene el modelo…</span><span><span class="mono">ollama pull bonsai-2:9b</span>, o el modelo que pusiste en tu .env.</span></li>
          <li><span class="m">bonsai no carga / versión</span><span>Actualiza Ollama (0.40.6 o más): <span class="mono">ollama.com/download</span>.</span></li>
          <li><span class="m">Tarda muchísimo</span><span><span class="mono">--no-thinking</span>, o <span class="mono">bonsai-2:4b</span>. Cierra lo que no uses: el modelo vive en tu RAM.</span></li>
          <li><span class="m">git pull se queja</span><span>Tienes cambios locales: <span class="mono">git stash</span>, luego <span class="mono">git pull</span>.</span></li>
          <li><span class="m">uv o ollama: no se reconoce</span><span>Cierra y vuelve a abrir la terminal después de instalar.</span></li>
        </ul>`,
    },
  ]);
})();
