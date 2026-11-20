// Act 2 · Cierre: the average lies; thanks; sources.
(() => {
  Deck.css(`
    #s-cierre h2 { font-size: 150px; font-weight: 500; letter-spacing: -0.045em; line-height: 1; margin: 0 0 50px; }
    #s-cierre .six { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: 1fr 1fr; column-gap: 64px; }
    #s-cierre .six li { display: grid; grid-template-columns: 70px 1fr; align-items: baseline; padding: 14px 0; border-top: 2px solid var(--hair); font-size: 34px; line-height: 1.2; }
    #s-cierre .six .n { font-family: var(--mono); font-size: 22px; letter-spacing: 0.14em; color: var(--accent); }
    #s-cierre .six li span:last-child small { display: block; font-size: 24px; color: var(--dim); margin-top: 4px; }
    #s-cierre .last { margin-top: 44px; font-size: 44px; letter-spacing: -0.015em; line-height: 1.2; }

    #s-gracias .qrs { position: absolute; right: var(--pad-x); top: var(--pad-y); display: grid; grid-template-columns: repeat(2, 360px); gap: 24px 40px; }
    #s-gracias .qr { text-align: center; }
    #s-gracias .qr .tile { width: 360px; height: 360px; padding: 22px; border-radius: 20px; background: #fff; }
    #s-gracias .qr img { width: 100%; height: 100%; display: block; image-rendering: pixelated; }
    #s-gracias .qr .u { margin-top: 12px; font-family: var(--mono); font-size: 26px; color: var(--fg); }
    #s-gracias .url { font-family: var(--mono); font-size: 52px; letter-spacing: 0.01em; margin-top: 36px; }
    #s-gracias .who { margin-top: 56px; line-height: 1.5; }

    #s-fuentes h2 { font-size: 56px; font-weight: 500; margin: 0 0 24px; letter-spacing: -0.02em; }
    #s-fuentes ul { list-style: none; margin: 0; padding: 0; columns: 2; column-gap: 56px; }
    #s-fuentes li { font-size: 25px; line-height: 1.32; padding: 8px 0; border-top: 1.5px solid var(--hair); break-inside: avoid; color: var(--dim); }
    #s-fuentes li b { color: var(--fg); font-weight: 500; }
  `);

  Deck.act(2, 'Cierre', [
    {
      id: 'cierre',
      title: 'Cierre · el promedio engaña',
      time: 60,
      class: 'middle',
      particles: [{ shape: 'u-six', opacity: 0.25 }, { shape: 'u-six', opacity: 0.25 }, { shape: 'split', opacity: 0.3 }],
      html: `
        <h2>El promedio <em>engaña</em>.</h2>
        <ol class="six">
          <li><span class="n">01</span><span>La adopción es ancha y poco profunda<small>promedio de usuarios</small></span></li>
          <li><span class="n">04</span><span>El valor se mueve de producir a juzgar<small>promedio de tareas</small></span></li>
          <li><span class="n">02</span><span>Se abarata la tarea, no el puesto<small>promedio de puestos</small></span></li>
          <li><span class="n">05</span><span>Lo serio se centraliza<small>promedio de quién construye</small></span></li>
          <li><span class="n">03</span><span>El ajuste cae en el primer escalón<small>promedio de empleo</small></span></li>
          <li><span class="n">06</span><span>La entrada pone el techo<small>promedio de precisión</small></span></li>
        </ol>
        <div class="last" data-step="1">Lo interesante siempre está en la <em>estratificación</em>.</div>`,
    },
    {
      id: 'gracias',
      title: 'Gracias',
      time: 20,
      class: 'middle',
      particles: { shape: 'scatter', opacity: 0.3 },
      html: `
        <div>
          <div class="t-label" style="margin-bottom:28px">Hechos estilizados del mundo de la IA</div>
          <h2 class="t-hero" style="font-size:230px">Gracias</h2>
          <div class="url accent">h1sort.com/udlap</div>
          <div class="who t-small dim">Carlos Haro<br>3er Congreso Nacional de Ciencia de Datos · 20 nov 2026</div>
        </div>
        <div class="qrs">
          <div class="qr"><div class="tile"><img src="assets/qr-linkedin.svg" alt="QR LinkedIn"></div><div class="u">linkedin.com/in/h1sort</div></div>
          <div class="qr"><div class="tile"><img src="assets/qr-x.svg" alt="QR X"></div><div class="u">x.com/h1sort</div></div>
          <div class="qr"><div class="tile"><img src="assets/qr-github.svg" alt="QR GitHub"></div><div class="u">github.com/h1sort</div></div>
          <div class="qr"><div class="tile"><img src="assets/qr-slides.svg" alt="QR diapositivas"></div><div class="u">h1sort.com/udlap</div></div>
        </div>`,
    },
    {
      id: 'fuentes',
      title: 'Fuentes (para el PDF, no proyectar)',
      time: 0,
      particles: { shape: 'scatter', opacity: 0.1 },
      label: 'Fuentes',
      html: `
        <h2>Fuentes</h2>
        <ul>
          <li><b>Hechos estilizados.</b> Kaldor, N. (1961), «Capital Accumulation and Economic Growth», en Lutz y Hague (eds.), The Theory of Capital.</li>
          <li><b>01 · Usuarios de ChatGPT.</b> OpenAI: 900 M semanales y 50 M+ suscriptores (feb. 2026); 1,000 M semanales (ago. 2026).</li>
          <li><b>01 · Usuarios que pagan.</b> Menlo Ventures, 2025: The State of Consumer AI (≈3%; encuesta a 5,031 adultos en EE. UU., extrapolada). 50 M / 900 M ≈ 6% para ChatGPT.</li>
          <li><b>02 y 03 · Empleo.</b> Brynjolfsson, E., Chandar, B. y Chen, R. (2025), «Canaries in the Coal Mine? Six Facts about the Recent Employment Effects of Artificial Intelligence», Stanford Digital Economy Lab. Datos de nómina de ADP, EE. UU.</li>
          <li><b>02 · Puesto de análisis.</b> Descomposición en tareas ilustrativa.</li>
          <li><b>04.</b> Observación propia del autor.</li>
          <li><b>05 · Ramp Glass.</b> Anuncio de E. Glyman (13 oct. 2026): 323 empleados, 6,500+ ediciones, 350+ skills. Cifras reportadas por la empresa.</li>
          <li><b>06 · OCR.</b> CodeSOTA, OCR capabilities (texto impreso &lt;1% CER; escaneos degradados 5–20% CER); Kargaran et al. (2026), GlotOCR Bench: todos los modelos caen con imágenes degradadas.</li>
        </ul>`,
    },
  ]);
})();
