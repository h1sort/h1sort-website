// Act 1 · Apertura: portada, lo que medimos el sábado (números de la sala, con la fe de erratas), agenda.
(() => {
  Deck.css(`
    #s-portada .pt-l { position: absolute; left: var(--pad-x); top: 250px; width: 1000px; }
    #s-portada .pt-title { font-size: 120px; font-weight: 500; letter-spacing: -0.035em; line-height: 1.0; margin: 26px 0 28px; }
    #s-portada .pt-sub { font-size: 44px; color: var(--dim); margin: 0; }
    #s-portada .pt-qrs { position: absolute; right: var(--pad-x); top: 250px; display: grid; grid-template-columns: repeat(2, 250px); gap: 72px; }
    #s-portada .pt-qr { text-align: center; }
    #s-portada .pt-qr .tile { width: 250px; height: 250px; padding: 16px; border-radius: 20px; background: #fff; }
    #s-portada .pt-qr img { width: 100%; height: 100%; display: block; image-rendering: pixelated; }
    #s-portada .pt-qr .url { margin-top: 14px; font-family: var(--mono); font-size: 20px; white-space: nowrap; }

    #s-repaso .rp { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px 56px; margin-top: 10px; }
    #s-repaso .rp > div { border-top: 3px solid var(--fg); padding-top: 18px; }
    #s-repaso .rp .big { font-size: 84px; margin: 12px 0 10px; }
    #s-repaso .rp p { font-size: 28px; color: var(--dim); line-height: 1.3; margin: 0; }


    #s-hoy .hy { list-style: none; padding: 0; margin: 0; max-width: 1560px; }
    #s-hoy .hy li { display: grid; grid-template-columns: 90px 1fr 200px; padding: 20px 0; border-top: 2px solid var(--hair); font-size: 40px; align-items: baseline; }
    #s-hoy .hy li:last-child { border-bottom: 2px solid var(--hair); }
    #s-hoy .hy .n { font-family: var(--mono); font-size: 26px; color: var(--accent); }
    #s-hoy .hy .m { font-family: var(--mono); font-size: 24px; color: var(--dim); text-align: right; }

    #s-pregunta .q { font-size: 96px; font-weight: 500; letter-spacing: -0.03em; line-height: 1.08; max-width: 1500px; margin: 0; }
    #s-pregunta .a { font-size: 48px; color: var(--dim); max-width: 1400px; line-height: 1.3; margin-top: 56px; }
  `);

  Deck.act(1, 'Apertura', [
    {
      id: 'portada',
      title: 'Elegir modelo para datos',
      time: 60,
      particles: { shape: 'scatter', opacity: 0.2 },
      html: `
        <div class="pt-l">
          <div class="t-label">Experto en IA Agéntica para Datos · Sesión 02</div>
          <h1 class="pt-title">Elegir modelo para datos</h1>
          <p class="pt-sub">Costo, contexto y exactitud, con números propios.</p>
        </div>
        <div class="pt-qrs">
          <div class="pt-qr"><div class="tile"><img src="assets/qr-repo.svg" alt="QR del repositorio"></div><div class="url">github.com/h1sort/ai4data</div></div>
          <div class="pt-qr"><div class="tile"><img src="assets/qr-slides.svg" alt="QR de las diapositivas"></div><div class="url">h1sort.com/ai4data/02</div></div>
        </div>`,
    },
    {
      id: 'repaso',
      title: 'Lo que medimos el sábado',
      time: 240,
      particles: { shape: 'grid', opacity: 0.14 },
      html: `
        <div class="t-label">Sesión 01 · números de la sala</div>
        <h2 class="t-title">Lo que medimos el sábado</h2>
        <div class="rp">
          <div><div class="t-label">Sumas que vio</div><div class="big">84–96%</div><p>Mismo código, mismos datos: cada quien un número distinto.</p></div>
          <div data-step="1"><div class="t-label">Sumas de 3 cifras</div><div class="big accent">0%</div><p>A todos. Siempre contestó con un número, y nunca bien.</p></div>
          <div data-step="2"><div class="t-label">Transacciones válidas</div><div class="big">97.7%<span class="accent">*</span></div><p><span class="accent">*</span>No 74–77%: mi evaluador cortaba las filas. Ya está corregido: <span class="mono">git pull</span>.</p></div>
          <div data-step="3"><div class="t-label">Tokens por fila</div><div class="big">37</div><p>Nuestro caso. Diamonds: 31.8 por fila, 6,290 filas en 200 mil tokens.</p></div>
          <div data-step="4"><div class="t-label">Haiku 5.5 · 20 veces</div><div class="big">18 / 20</div><p>Iguales. Las otras dos, distintas: una dio 1,539.31.</p></div>
          <div data-step="5"><div class="t-label">Marcador v0</div><div class="big faint">pendiente</div><p>Hoy lo sacamos, para cada modelo y cada forma de responder.</p></div>
        </div>`,
    },
    {
      id: 'pregunta',
      title: '¿Qué modelo uso?',
      time: 90,
      class: 'middle',
      particles: { shape: 'ring', opacity: 0.16 },
      html: `
        <p class="q">¿Qué modelo uso para mis datos?</p>
        <p class="a" data-step="1">"Depende" no es respuesta. La respuesta es una tabla: <span class="fg">exactitud, consenso, costo y latencia</span> sobre <em>tu</em> set dorado.</p>`,
    },
    {
      id: 'hoy',
      title: 'Hoy',
      time: 60,
      particles: { shape: 'timeline', opacity: 0.14 },
      html: `
        <div class="t-label">Sesión 02</div>
        <h2 class="t-title">Hoy</h2>
        <ul class="hy">
          <li><span class="n">01</span><span>Inferencia por dentro: cómo nace un token</span><span class="m">lab 12 min</span></li>
          <li><span class="n">02</span><span>Decodificación restringida: forma, no verdad</span><span class="m">lab 12 min</span></li>
          <li><span class="n">03</span><span>Elegir modelo: familias, precios, benchmarks</span><span class="m">teoría</span></li>
          <li><span class="n">04</span><span>Tool calling por dentro · tres formas de responder</span><span class="m">lab 35 min</span></li>
          <li><span class="n">05</span><span>Dónde corre el modelo · el warehouse</span><span class="m">lab 20 min</span></li>
          <li><span class="n">06</span><span>Tu memo de selección de modelo</span><span class="m">entregable</span></li>
        </ul>`,
    },
  ]);
})();
