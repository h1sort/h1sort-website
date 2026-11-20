// Act 0 · Apertura: title, who, Kaldor. Deck shell from h1sort/cide (datapub engine).
(() => {
  const TAU = Math.PI * 2;
  // Six clusters on a ring: six stylized facts.
  Particles.define('u-six', (u, t) => {
    const k = u.i % 6, a = -Math.PI / 2 + k * TAU / 6 + t * 0.02;
    return [1420 + Math.cos(a) * 250 + u.g(1) * 22 + Math.sin(t * 0.5 + u.r(5) * TAU) * 3,
            560 + Math.sin(a) * 250 + u.g(2) * 22 + Math.cos(t * 0.5 + u.r(6) * TAU) * 3];
  });

  Deck.css(`
    #s-title .a0-ep { margin-bottom: 40px; color: var(--accent); font-size: 26px; }
    #s-title .a0-name { font-size: 150px; font-weight: 500; line-height: 0.98; letter-spacing: -0.04em; margin: 0 0 30px; max-width: 1300px; }
    #s-title .a0-sub { font-size: 44px; color: var(--dim); margin: 0 0 56px; letter-spacing: -0.01em; }
    #s-title .a0-by { display: flex; gap: 28px; align-items: center; flex-wrap: wrap; }
    #s-title .a0-by .bar { width: 64px; height: 2px; background: var(--faint); }

    #s-quien .a0-who-l { position: absolute; left: var(--pad-x); top: var(--pad-y); width: 860px; }
    #s-quien .a0-title { font-family: var(--mono); font-size: 72px; font-weight: 500; letter-spacing: -0.02em; margin: 0; }
    #s-quien .a0-id { display: flex; align-items: center; gap: 40px; margin-top: 56px; }
    #s-quien .a0-portrait { flex: none; width: 260px; height: 260px; border-radius: 50%; overflow: hidden;
      border: var(--stroke) solid var(--faint); box-shadow: 0 0 0 10px #000, 0 0 0 12px var(--hair); }
    #s-quien .a0-portrait img { width: 100%; height: 100%; object-fit: cover; display: block; filter: grayscale(1); }
    #s-quien .a0-nm { font-size: 68px; font-weight: 500; letter-spacing: -0.02em; line-height: 1.05; }
    #s-quien .a0-role { font-size: 34px; line-height: 1.3; margin-top: 14px; }
    #s-quien .a0-stats { display: flex; gap: 80px; margin-top: 64px; }
    #s-quien .a0-stats .big { font-size: 120px; font-weight: 500; letter-spacing: -0.03em; line-height: 1; }
    #s-quien .a0-stats .cap { font-size: 32px; color: var(--dim); margin-top: 12px; }
    #s-quien .a0-take { margin-top: 56px; }
    #s-quien .a0-take .txt { font-size: 38px; line-height: 1.25; margin-top: 10px; }
    #s-quien .a0-qrs { position: absolute; right: var(--pad-x); top: var(--pad-y); display: grid; grid-template-columns: repeat(2, 360px); gap: 24px 40px; }
    #s-quien .a0-qr { text-align: center; }
    #s-quien .a0-qr .tile { width: 360px; height: 360px; padding: 22px; border-radius: 20px; background: #fff; }
    #s-quien .a0-qr img { width: 100%; height: 100%; display: block; image-rendering: pixelated; }
    #s-quien .a0-qr .url { margin-top: 12px; font-family: var(--mono); font-size: 26px; color: var(--fg); }

    #s-kaldor .k-l { position: absolute; left: var(--pad-x); top: 110px; width: 900px; }
    #s-kaldor .k-l .t-label { color: var(--accent); }
    #s-kaldor h2 { font-size: 84px; font-weight: 500; letter-spacing: -0.03em; line-height: 1.02; margin: 18px 0 28px; }
    #s-kaldor .k-def { font-size: 38px; line-height: 1.28; color: var(--dim); margin: 0; }
    #s-kaldor .k-def b { color: var(--fg); font-weight: 500; }
    #s-kaldor .k-list { position: absolute; left: 1080px; right: var(--pad-x); top: 120px; list-style: none; margin: 0; padding: 0; }
    #s-kaldor .k-list li { display: grid; grid-template-columns: 60px 1fr; padding: 14px 0; border-top: 2px solid var(--hair); font-size: 29px; line-height: 1.25; color: var(--dim); }
    #s-kaldor .k-list li:last-child { border-bottom: 2px solid var(--hair); }
    #s-kaldor .k-list .n { font-family: var(--mono); font-size: 22px; color: var(--faint); letter-spacing: 0.1em; }
    #s-kaldor .k-list { transition: opacity .6s var(--ease); }
    #s-kaldor[data-at="2"] .k-list { opacity: 0.15; }
    #s-kaldor .k-now { position: absolute; left: var(--pad-x); right: var(--pad-x); top: 640px; font-size: 76px; font-weight: 500; letter-spacing: -0.03em; line-height: 1.06; }
    #s-kaldor .k-now small { display: block; font-size: 36px; font-weight: 400; color: var(--dim); letter-spacing: 0; margin-top: 18px; }
  `);

  Deck.act(0, 'Apertura', [
    {
      id: 'title',
      title: 'Hechos estilizados del mundo de la IA',
      time: 20,
      class: 'middle',
      particles: [{ shape: 'scatter', opacity: 0.3 }],
      label: '',
      html: `
        <div class="t-label a0-ep">Panel · El mercado laboral antes y después de OpenAI</div>
        <h1 class="a0-name">Hechos estilizados del mundo de la <em>IA</em></h1>
        <p class="a0-sub">Seis regularidades, antes de tener la teoría.</p>
        <div class="a0-by t-label"><span>Carlos Haro</span><span class="bar"></span><span>3er Congreso Nacional de Ciencia de Datos</span><span class="bar"></span><span>20 nov 2026</span></div>`,
    },
    {
      id: 'quien',
      title: 'who_is_this_dude?',
      time: 40,
      class: 'middle',
      particles: { shape: 'scatter', opacity: 0.2 },
      html: `
        <div class="a0-who-l">
          <h1 class="a0-title">who_is_this_dude?</h1>
          <div class="a0-id">
            <div class="a0-portrait"><img src="assets/carlos-portrait.jpg" alt="Carlos Haro"></div>
            <div>
              <div class="a0-nm">Carlos Haro</div>
              <div class="a0-role">AI Engineer<br>Santander México <span class="dim">· Data &amp; AI</span></div>
            </div>
          </div>
          <div class="a0-stats">
            <div><div class="big">~10</div><div class="cap">años lidiando con datos</div></div>
            <div><div class="big">@h1sort</div><div class="cap">en todos lados</div></div>
          </div>
          <div class="a0-take"><div class="t-label">Mi take</div>
            <div class="txt">La educación es el 2do mejor motor de cambio de una sociedad.</div></div>
        </div>
        <div class="a0-qrs">
          <div class="a0-qr"><div class="tile"><img src="assets/qr-linkedin.svg" alt="QR LinkedIn"></div><div class="url">linkedin.com/in/h1sort</div></div>
          <div class="a0-qr"><div class="tile"><img src="assets/qr-x.svg" alt="QR X"></div><div class="url">x.com/h1sort</div></div>
          <div class="a0-qr"><div class="tile"><img src="assets/qr-github.svg" alt="QR GitHub"></div><div class="url">github.com/h1sort</div></div>
          <div class="a0-qr"><div class="tile"><img src="assets/qr-slides.svg" alt="QR diapositivas"></div><div class="url">h1sort.com/udlap</div></div>
        </div>`,
    },
    {
      id: 'kaldor',
      title: 'Kaldor, 1961',
      time: 60,
      particles: [{ shape: 'grid', opacity: 0.12 }, { shape: 'grid', opacity: 0.12 }, { shape: 'u-six', opacity: 0.55 }],
      html: `
        <div class="k-l">
          <div class="t-label">Nicholas Kaldor, 1961</div>
          <h2>Hechos estilizados</h2>
          <p class="k-def"><b>Regularidades amplias</b> que se ven en los datos antes de tener el modelo que las explica. Simplifican a propósito.</p>
        </div>
        <ol class="k-list" data-step="1">
          <li><span class="n">01</span>La producción por trabajador crece a una tasa estable</li>
          <li><span class="n">02</span>El capital por trabajador también crece</li>
          <li><span class="n">03</span>La tasa de retorno del capital es estable</li>
          <li><span class="n">04</span>La razón capital-producto es estable</li>
          <li><span class="n">05</span>Las participaciones del trabajo y el capital en el ingreso son estables</li>
          <li><span class="n">06</span>El crecimiento varía mucho entre países</li>
        </ol>
        <div class="k-now" data-step="2">Hoy: seis hechos estilizados del mundo de la IA.
          <small>Casi todos con datos públicos. Uno, desde adentro de un banco. Ninguno explica la causa.</small></div>`,
    },
  ]);
})();
