// Act 0 · Apertura y repaso. Deck shell from h1sort/udlap (cide/datapub engine).
(() => {
  // Four clusters: the four numbers of the scorecard.
  Particles.define('s1-four', (u, t) => {
    const k = u.i % 4, cx = 1060 + (k % 2) * 420, cy = 380 + Math.floor(k / 2) * 300;
    return [cx + u.g(1) * 40 + Math.sin(t * 0.6 + u.r(3) * 6.28) * 4, cy + u.g(2) * 26 + Math.cos(t * 0.5 + u.r(4) * 6.28) * 4];
  });

  Deck.css(`
    #s-title .a0-ep { margin-bottom: 40px; color: var(--accent); font-size: 26px; }
    #s-title .a0-name { font-size: 140px; font-weight: 500; line-height: 0.98; letter-spacing: -0.04em; margin: 0 0 30px; max-width: 1400px; }
    #s-title .a0-sub { font-size: 44px; color: var(--dim); margin: 0 0 56px; max-width: 1300px; }
    #s-title .a0-by { display: flex; gap: 28px; align-items: center; flex-wrap: wrap; }
    #s-title .a0-by .bar { width: 64px; height: 2px; background: var(--faint); }

    #s-quien .a0-who-l { position: absolute; left: var(--pad-x); top: var(--pad-y); width: 860px; }
    #s-quien .a0-title { font-family: var(--mono); font-size: 72px; font-weight: 500; letter-spacing: -0.02em; margin: 0; }
    #s-quien .a0-id { display: flex; align-items: center; gap: 40px; margin-top: 56px; }
    #s-quien .a0-portrait { flex: none; width: 240px; height: 240px; border-radius: 50%; overflow: hidden;
      border: var(--stroke) solid var(--faint); box-shadow: 0 0 0 10px #000, 0 0 0 12px var(--hair); }
    #s-quien .a0-portrait img { width: 100%; height: 100%; object-fit: cover; display: block; filter: grayscale(1); }
    #s-quien .a0-nm { font-size: 68px; font-weight: 500; letter-spacing: -0.02em; line-height: 1.05; }
    #s-quien .a0-role { font-size: 34px; line-height: 1.3; margin-top: 14px; }
    #s-quien .a0-stats { display: flex; gap: 80px; margin-top: 60px; }
    #s-quien .a0-stats .big { font-size: 110px; font-weight: 500; letter-spacing: -0.03em; line-height: 1; }
    #s-quien .a0-stats .cap { font-size: 32px; color: var(--dim); margin-top: 12px; }
    #s-quien .a0-qrs { position: absolute; right: var(--pad-x); top: var(--pad-y); display: grid; grid-template-columns: repeat(2, 340px); gap: 24px 40px; }
    #s-quien .a0-qr { text-align: center; }
    #s-quien .a0-qr .tile { width: 340px; height: 340px; padding: 22px; border-radius: 20px; background: #fff; }
    #s-quien .a0-qr img { width: 100%; height: 100%; display: block; image-rendering: pixelated; }
    #s-quien .a0-qr .url { margin-top: 12px; font-family: var(--mono); font-size: 22px; color: var(--fg); }

    #s-programa .cmp { display: grid; grid-template-columns: 260px 1fr 1fr; margin-top: 8px; border-top: 2px solid var(--hair); }
    #s-programa .cmp > div { padding: 22px 0; border-bottom: 2px solid var(--hair); font-size: 34px; line-height: 1.25; }
    #s-programa .cmp .k { font-family: var(--mono); font-size: 22px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--faint); padding-top: 30px; }
    #s-programa .cmp .h { font-family: var(--mono); font-size: 22px; letter-spacing: 0.2em; text-transform: uppercase; padding: 18px 0; }
    #s-programa .cmp .a { color: var(--faint); padding-right: 48px; }
    #s-programa .cmp .b { padding-left: 48px; border-left: 2px solid var(--hair); }

    #s-marcador .m-l { position: absolute; left: var(--pad-x); top: 130px; width: 760px; }
    #s-marcador .m-grid { position: absolute; left: 900px; top: 220px; display: grid; grid-template-columns: 380px 380px; gap: 40px; }
    #s-marcador .m-cell { border: var(--stroke) solid var(--faint); border-radius: 18px; padding: 28px 30px; background: rgba(0,0,0,.75); min-height: 230px; }
    #s-marcador .m-cell .n { font-family: var(--mono); font-size: 22px; letter-spacing: 0.2em; color: var(--accent); }
    #s-marcador .m-cell .w { font-size: 52px; font-weight: 500; letter-spacing: -0.02em; margin: 14px 0 10px; }
    #s-marcador .m-cell .d { font-size: 28px; color: var(--dim); line-height: 1.3; }

    #s-hoy .h-list { list-style: none; margin: 0; padding: 0; max-width: 1640px; }
    #s-hoy .h-list li { display: grid; grid-template-columns: 110px 1fr 220px; align-items: baseline; padding: 18px 0; border-top: 2px solid var(--hair); font-size: 38px; }
    #s-hoy .h-list li:last-child { border-bottom: 2px solid var(--hair); }
    #s-hoy .h-list .n { font-family: var(--mono); font-size: 24px; color: var(--accent); }
    #s-hoy .h-list .t { font-family: var(--mono); font-size: 24px; color: var(--faint); text-align: right; }
    #s-hoy .h-list .s { color: var(--dim); font-size: 30px; }

    #s-repaso .r-cols { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; margin-top: 30px; }
    #s-repaso .r-c { border-top: 3px solid var(--fg); padding-top: 28px; }
    #s-repaso .r-c .n { font-family: var(--mono); font-size: 24px; color: var(--accent); letter-spacing: 0.2em; }
    #s-repaso .r-c h3 { font-size: 46px; font-weight: 500; letter-spacing: -0.02em; line-height: 1.1; margin: 16px 0 18px; }
    #s-repaso .r-c p { font-size: 30px; color: var(--dim); line-height: 1.35; margin: 0; }
    #s-repaso .r-foot { position: absolute; left: var(--pad-x); bottom: 160px; font-size: 28px; color: var(--faint); }

    #s-pregunta .q { font-size: 112px; font-weight: 500; letter-spacing: -0.035em; line-height: 1.02; max-width: 1500px; margin: 0; }
    #s-pregunta .q-seq { font-family: var(--mono); font-size: 64px; margin-top: 70px; color: var(--dim); }
    #s-pregunta .q-seq .tk { display: inline-block; border: 2px solid var(--faint); border-radius: 10px; padding: 4px 18px; margin-right: 10px; }
    #s-pregunta .q-seq .tk.next { border-color: var(--accent); color: var(--accent); }
  `);

  Deck.act(0, 'Apertura', [
    {
      id: 'title',
      title: 'Sesión 01 · El LLM como instrumento de medición',
      time: 60,
      class: 'middle',
      particles: { shape: 'scatter', opacity: 0.3 },
      label: '',
      html: `
        <div class="t-label a0-ep">Experto en IA Agéntica para Datos · Sesión 01</div>
        <h1 class="a0-name">El LLM como instrumento de <em>medición</em></h1>
        <p class="a0-sub">Si lo que sale es un número, ¿cuánto vale ese número?</p>
        <div class="a0-by t-label"><span>Carlos Haro</span><span class="bar"></span><span>Código Facilito</span><span class="bar"></span><span>Módulo 1 · Fundamentos de LLMs para Análisis de Datos</span></div>`,
    },
    {
      id: 'quien',
      title: 'who_is_this_dude?',
      time: 120,
      class: 'middle',
      particles: { shape: 'scatter', opacity: 0.2 },
      html: `
        <div class="a0-who-l">
          <h1 class="a0-title">who_is_this_dude?</h1>
          <div class="a0-id">
            <div class="a0-portrait"><img src="assets/carlos-portrait.jpg" alt="Carlos Haro"></div>
            <div>
              <div class="a0-nm">Carlos Haro</div>
              <div class="a0-role">IA en Santander México<br><span class="dim">Data &amp; AI</span></div>
            </div>
          </div>
          <div class="a0-stats">
            <div><div class="big">~10</div><div class="cap">años lidiando con datos</div></div>
            <div><div class="big">@h1sort</div><div class="cap">en todos lados</div></div>
          </div>
        </div>
        <div class="a0-qrs">
          <div class="a0-qr"><div class="tile"><img src="assets/qr-repo.svg" alt="QR del repositorio"></div><div class="url">github.com/h1sort/ai4data</div></div>
          <div class="a0-qr"><div class="tile"><img src="assets/qr-slides.svg" alt="QR de las diapositivas"></div><div class="url">h1sort.com/ai4data/01</div></div>
          <div class="a0-qr"><div class="tile"><img src="assets/qr-linkedin.svg" alt="QR LinkedIn"></div><div class="url">linkedin.com/in/h1sort</div></div>
          <div class="a0-qr"><div class="tile"><img src="assets/qr-x.svg" alt="QR X"></div><div class="url">x.com/h1sort</div></div>
        </div>`,
    },
    {
      id: 'programa',
      title: 'Construir y medir',
      time: 180,
      particles: { shape: 'two', opacity: 0.18 },
      html: `
        <div class="t-label">El programa</div>
        <h2 class="t-title">Construir y medir, <em>no mostrar y explicar</em></h2>
        <div class="cmp">
          <div class="h"></div><div class="h faint">Curso gratuito</div><div class="h accent" style="padding-left:48px">Este programa</div>
          <div class="k">Pregunta</div><div class="a">¿Qué cambió en el rol de datos?</div><div class="b">¿Cómo construyo algo confiable y lo demuestro?</div>
          <div class="k" data-step="1">Formato</div><div class="a" data-step="1">Demo del profesor</div><div class="b" data-step="1">Lab con entregable en cada sesión</div>
          <div class="k" data-step="2">Medición</div><div class="a" data-step="2">"Se ve bien" o "está mal"</div><div class="b" data-step="2">Cuatro números, cada sesión</div>
        </div>`,
    },
    {
      id: 'marcador',
      title: 'El marcador',
      time: 180,
      particles: { shape: 's1-four', opacity: 0.3 },
      html: `
        <div class="m-l">
          <div class="t-label">Tu marcador</div>
          <h2 class="t-title" style="margin-top:18px">Cuatro números que te siguen las 12 sesiones</h2>
          <p class="t-sub" style="font-size:36px">Hoy creas la versión 0. Cada sesión intenta moverlos. Al final muestras cuánto mejoró tu sistema y <em>por qué</em>.</p>
        </div>
        <div class="m-grid">
          <div class="m-cell" data-step="1"><div class="n">01</div><div class="w">Exactitud</div><div class="d">¿Cuántas respuestas son correctas?</div></div>
          <div class="m-cell" data-step="2"><div class="n">02</div><div class="w">Varianza</div><div class="d">¿Contesta lo mismo si le preguntas otra vez?</div></div>
          <div class="m-cell" data-step="3"><div class="n">03</div><div class="w">Costo</div><div class="d">¿Cuánto pagas por respuesta?</div></div>
          <div class="m-cell" data-step="4"><div class="n">04</div><div class="w">Latencia</div><div class="d">¿Cuánto esperas por respuesta?</div></div>
        </div>`,
    },
    {
      id: 'hoy',
      title: 'Hoy',
      time: 120,
      particles: { shape: 'timeline', opacity: 0.18 },
      html: `
        <div class="t-label">Hoy · 3 horas</div>
        <h2 class="t-title">Tres experimentos y un marcador</h2>
        <ol class="h-list">
          <li><span class="n">01</span><span>Entrenamos un modelo <span class="s">· nanoGPT, en tu laptop</span></span><span class="t">55 min</span></li>
          <li><span class="n">02</span><span>Cómo ve un número <span class="s">· tokens y costo</span></span><span class="t">22 min</span></li>
          <li><span class="n">03</span><span>La misma pregunta 20 veces <span class="s">· varianza</span></span><span class="t">22 min</span></li>
          <li><span class="n">04</span><span>La respuesta con contrato <span class="s">· salidas estructuradas</span></span><span class="t">18 min</span></li>
          <li><span class="n">05</span><span>Tu marcador v0 <span class="s">· primera corrida</span></span><span class="t">25 min</span></li>
        </ol>`,
    },
  ]);

  Deck.act(1, 'Repaso', [
    {
      id: 'repaso',
      title: 'Lo que ya sabemos',
      time: 300,
      particles: { shape: 'scatter', opacity: 0.15 },
      html: `
        <div class="t-label">Repaso · clase 3 del curso gratuito</div>
        <h2 class="t-title">Tres cosas que ya sabemos</h2>
        <div class="r-cols">
          <div class="r-c" data-step="1"><div class="n">01</div><h3>Un LLM predice el siguiente token</h3><p>Se entrena con texto para adivinar lo que sigue. Después se ajusta para seguir instrucciones.</p></div>
          <div class="r-c" data-step="2"><div class="n">02</div><h3>Un agente es un LLM con herramientas en un ciclo</h3><p>Pide una herramienta en texto; el arnés decide si la ejecuta.</p></div>
          <div class="r-c" data-step="3"><div class="n">03</div><h3>Contexto, herramientas y evals</h3><p>Las tres palancas que controlamos como profesionales de datos.</p></div>
        </div>
        <div class="r-foot">¿No viste el curso gratuito? Las tres clases están en el repo h1sort/intro-ai4data-class.</div>`,
    },
    {
      id: 'pregunta',
      title: '¿Y si el siguiente token es un número?',
      time: 120,
      class: 'middle',
      particles: { shape: 'converge', opacity: 0.3 },
      html: `
        <h2 class="q">Si un LLM predice el siguiente token… ¿qué pasa cuando el token es <em>un número</em>?</h2>
        <div class="q-seq" data-step="1"><span class="tk">El</span><span class="tk">total</span><span class="tk">es</span><span class="tk next">¿ ?</span></div>`,
    },
  ]);
})();
