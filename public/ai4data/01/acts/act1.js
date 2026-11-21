// Act 2 · nanoGPT: entrenamos un modelo diminuto con sumas y con transacciones.
// Every number here comes from lab-nanogpt/ (run of 21 Nov 2026, see PLAN.md §3).
(() => {
  // Val loss of the sums run, every 250 iterations (train-sumas log).
  const LOSS = [[0, 2.666], [250, 1.5746], [500, 1.5337], [750, 1.4673], [1000, 1.4142], [1250, 1.2717], [1500, 1.1654],
    [1750, 1.154], [2000, 1.1055], [2250, 1.0862], [2500, 1.078], [2750, 1.0746], [3000, 1.0703]];
  const X0 = 0, X1 = 1040, Y0 = 0, Y1 = 520, LMIN = 0.8, LMAX = 2.8;
  const px = (s) => X0 + (s / 3000) * (X1 - X0);
  const py = (l) => Y0 + ((LMAX - l) / (LMAX - LMIN)) * (Y1 - Y0);
  const path = LOSS.map(([s, l], i) => `${i ? 'L' : 'M'}${px(s).toFixed(1)} ${py(l).toFixed(1)}`).join(' ');

  // Transactions: lab-nanogpt/evaluar_transacciones.py, 300 rows, seed 1337 (run of 21 Nov 2026).
  // Rates are over all 300 rows: a malformed row fails every check.
  const TX = {
    n: 300,
    reglas: [['Forma: 7 columnas', '87.7%'], ['El cliente existe', '87.7%'], ['El método existe', '87.0%'],
      ['La fecha existe', '85.7%'], ['total = cantidad × precio', '85.0%'], ['El comercio existe', '79.0%']],
    todas: '74.0%',
    malas: [
      ['2026-02-30,CLI-0100,Farmacia del Centro,SPEI,1,224.50,224.50', 'el 30 de febrero no existe'],
      ['2026-03-07,CLI-0236,Café Tres Volco Ruiz,TDC,4,1790.50,6162.00', '4 × 1,790.50 = 7,162.00 · y el comercio no existe'],
      ['2026-05-04,CLI-0190,Ferretería Lupita,SPEI,3,47.50,142.50', 'comercio inventado: mezcla de dos reales'],
      ['2026-06-16,CLI-0013,Tortillería Lupita,TDDD,5,141.50,707.50', 'el método TDDD no existe'],
    ],
  };

  // "+" made of particles while the model learns to add.
  Particles.define('s1-plus', (u, t) => {
    const arm = u.i % 2, v = u.g(1) * 150, w = u.g(2) * 16;
    const [x, y] = arm ? [v, w] : [w, v];
    return [1500 + x + Math.sin(t * 0.7 + u.r(3) * 6.28) * 3, 470 + y + Math.cos(t * 0.6 + u.r(4) * 6.28) * 3];
  });

  Deck.css(`
    #s-nanogpt .n-l { position: absolute; left: var(--pad-x); top: 120px; width: 980px; }
    #s-nanogpt .n-files { position: absolute; left: 1220px; top: 200px; width: 580px; }
    #s-nanogpt .n-file { border: var(--stroke) solid var(--faint); border-radius: 16px; padding: 24px 28px; margin-bottom: 28px; background: rgba(0,0,0,.75); }
    #s-nanogpt .n-file .f { font-family: var(--mono); font-size: 36px; }
    #s-nanogpt .n-file .d { font-size: 28px; color: var(--dim); margin-top: 8px; }
    #s-nanogpt .n-note { margin-top: 40px; font-size: 28px; color: var(--faint); max-width: 900px; line-height: 1.35; }

    #s-experimento .e-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; margin-top: 10px; }
    #s-experimento .e-c h3 { font-size: 48px; font-weight: 500; margin: 14px 0 22px; letter-spacing: -0.02em; }
    #s-experimento pre.code { font-size: 25px; line-height: 1.5; color: var(--dim); }
    #s-experimento .e-c p { font-size: 29px; color: var(--dim); line-height: 1.35; margin: 22px 0 0; }

    #s-apuesta .ap { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; margin-top: 40px; }
    #s-apuesta .ap > div { border: var(--stroke) solid var(--faint); border-radius: 18px; padding: 30px 34px 36px; }
    #s-apuesta .ap .k { font-family: var(--mono); font-size: 24px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--accent); }
    #s-apuesta .ap .eg { font-family: var(--mono); font-size: 44px; margin: 22px 0 14px; }
    #s-apuesta .ap .d { font-size: 28px; color: var(--dim); line-height: 1.3; min-height: 76px; }
    #s-apuesta .ap .q { font-size: 110px; font-weight: 500; color: var(--faint); margin-top: 18px; letter-spacing: -0.03em; }

    #s-lab-nanogpt .lb { display: grid; grid-template-columns: 1.3fr 1fr; gap: 56px; }
    #s-lab-nanogpt pre.code { font-size: 23px; line-height: 1.55; }
    #s-lab-nanogpt pre.code .c { color: var(--faint); }
    #s-lab-nanogpt .lb-r .t-small { color: var(--dim); }
    #s-lab-nanogpt .lb-r .big { font-size: 96px; font-weight: 500; letter-spacing: -0.03em; line-height: 1; margin: 12px 0 6px; }

    #s-perdida .p-chart { position: absolute; left: 230px; top: 250px; }
    #s-perdida .p-r { position: absolute; left: 1330px; top: 260px; width: 480px; }
    #s-perdida .p-r .big { white-space: nowrap; font-size: 80px; font-weight: 500; letter-spacing: -0.03em; line-height: 1; }
    #s-perdida .p-r p { font-size: 30px; color: var(--dim); line-height: 1.35; }
    #s-perdida .p-why { position: absolute; left: var(--pad-x); right: var(--pad-x); top: 860px; font-size: 32px; }

    #s-sumas .su { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; margin-top: 16px; }
    #s-sumas .su > div { border-top: 3px solid var(--fg); padding-top: 22px; }
    #s-sumas .su .k { font-family: var(--mono); font-size: 22px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--dim); }
    #s-sumas .su .big { font-size: 150px; font-weight: 500; letter-spacing: -0.04em; line-height: 1; margin: 18px 0 8px; }
    #s-sumas .su .d { font-size: 28px; color: var(--dim); }
    #s-sumas .su .eg { font-family: var(--mono); font-size: 30px; margin-top: 18px; }
    #s-sumas .su-num { margin-top: 54px; font-size: 44px; font-weight: 500; letter-spacing: -0.01em; }

    #s-filas .fi { display: grid; grid-template-columns: 560px 1fr; gap: 70px; }
    #s-filas .fi-m { list-style: none; padding: 0; margin: 0; }
    #s-filas .fi-m li { display: flex; justify-content: space-between; padding: 14px 0; border-top: 2px solid var(--hair); font-size: 30px; }
    #s-filas .fi-m li .v { font-family: var(--mono); }
    #s-filas .fi-m li.all { border-top: 3px solid var(--accent); font-weight: 500; }
    #s-filas pre.code { font-size: 22px; line-height: 1.6; }
    #s-filas .why { font-family: var(--mono); font-size: 21px; color: var(--bad); display: block; }

    #s-leccion .le { font-size: 92px; font-weight: 500; letter-spacing: -0.03em; line-height: 1.05; max-width: 1560px; margin: 0; }
    #s-leccion .le-sub { font-size: 40px; color: var(--dim); margin-top: 48px; max-width: 1450px; line-height: 1.3; }

    #s-pausa .pa { font-size: 220px; font-weight: 500; letter-spacing: -0.05em; line-height: 1; margin: 0; }
  `);

  Deck.act(2, 'nanoGPT', [
    {
      id: 'nanogpt',
      title: 'nanoGPT',
      time: 180,
      particles: { shape: 'grid', opacity: 0.14 },
      html: `
        <div class="n-l">
          <div class="t-label">Andrej Karpathy · github.com/karpathy/nanoGPT</div>
          <h2 class="t-title" style="margin-top:18px">Un GPT completo que cabe en dos archivos</h2>
          <p class="t-sub" style="font-size:38px">La misma idea que los modelos grandes: predecir lo que sigue. En miniatura: entrena en tu laptop en minutos.</p>
          <p class="n-note">Desde noviembre de 2025 Karpathy recomienda su sucesor, nanochat. Usamos nanoGPT porque es el más chico que entrena en clase, en CPU.</p>
        </div>
        <div class="n-files">
          <div class="n-file" data-step="1"><div class="f">model.py</div><div class="d">~300 líneas · el transformer</div></div>
          <div class="n-file" data-step="2"><div class="f">train.py</div><div class="d">~300 líneas · el ciclo de entrenamiento</div></div>
          <div class="n-file" data-step="3"><div class="f accent">0.79 M</div><div class="d">parámetros en nuestro modelo de sumas</div></div>
        </div>`,
    },
    {
      id: 'experimento',
      title: 'Dos datasets',
      time: 180,
      particles: { shape: 'split', opacity: 0.16 },
      html: `
        <div class="t-label">El experimento</div>
        <h2 class="t-title">Dos datasets, generados para el curso</h2>
        <div class="e-cols">
          <div class="e-c">
            <div class="t-label accent">01 · Sumas</div>
            <h3>a + b, entre 0 y 99</h3>
<pre class="code">23+45=68
7+90=97
61+58=119</pre>
            <p>8,000 pares para entrenar. 2,000 pares <strong>escondidos</strong>: nunca los ve.</p>
          </div>
          <div class="e-c" data-step="1">
            <div class="t-label accent">02 · Transacciones</div>
            <h3>Filas de un comercio ficticio</h3>
<pre class="code">2026-01-31,CLI-0164,Tortillería Lupita,
  TDC,2,58.00,116.00</pre>
            <p>13,000 filas. Reglas verificables: el cliente existe, la fecha es válida, total = cantidad × precio.</p>
          </div>
        </div>`,
    },
    {
      id: 'apuesta',
      title: 'La apuesta',
      time: 180,
      particles: { shape: 's1-plus', opacity: 0.35 },
      html: `
        <div class="t-label">Antes de entrenar · apuesten</div>
        <h2 class="t-title">¿Qué porcentaje de sumas acierta?</h2>
        <div class="ap">
          <div><div class="k">Vistas</div><div class="eg">23+45=</div><div class="d">Pares que sí estuvieron en el entrenamiento</div><div class="q">¿%?</div></div>
          <div data-step="1"><div class="k">Escondidas</div><div class="eg">74+96=</div><div class="d">Mismo rango, combinación que nunca vio</div><div class="q">¿%?</div></div>
          <div data-step="2"><div class="k">3 cifras</div><div class="eg">359+481=</div><div class="d">Números más grandes que todo lo que vio</div><div class="q">¿%?</div></div>
        </div>`,
    },
    {
      id: 'lab-nanogpt',
      title: 'Lab · nanoGPT',
      time: 1680,
      label: 'Lab · 25 min',
      particles: { shape: 'swarm', opacity: 0.14 },
      html: `
        <div class="t-label">Lab · 25 minutos</div>
        <h2 class="t-title" style="margin-bottom:32px">Prepara, entrena, evalúa</h2>
        <div class="lb">
<pre class="code"><span class="c"># una vez, en la misma carpeta</span>
git clone https://github.com/h1sort/ai4data
git clone https://github.com/karpathy/nanoGPT
pip install torch numpy
L=$PWD/ai4data/sesiones/01/lab-nanogpt

<span class="c"># datos (semilla fija)</span>
python $L/preparar_datos.py nanoGPT

<span class="c"># entrenar y evaluar</span>
cd nanoGPT
python train.py $L/config_sumas.py
python $L/evaluar_sumas.py .</pre>
          <div class="lb-r">
            <div class="t-label">Referencia</div>
            <div class="big">4 min 19 s</div>
            <div class="t-small">entrenando sumas en una CPU de 2 núcleos. Tu laptop probablemente tarda menos.</div>
            <div class="t-small" style="margin-top:36px">Mientras entrena, abre <span class="mono accent">model.py</span> y busca dónde se predice el siguiente carácter.</div>
            <div class="t-small" style="margin-top:28px">¿Terminaste? Repite con <span class="mono">config_transacciones.py</span> y <span class="mono">evaluar_transacciones.py</span>.</div>
          </div>
        </div>`,
    },
    {
      id: 'perdida',
      title: 'La curva de pérdida',
      time: 180,
      particles: { shape: 'scatter', opacity: 0.12 },
      html: `
        <div class="t-label">Qué pasó mientras entrenaba · sumas</div>
        <h2 class="t-title">La pérdida baja… y se detiene</h2>
        <svg class="p-chart" width="${X1}" height="${Y1 + 60}" viewBox="-20 -10 ${X1 + 40} ${Y1 + 70}">
          <line class="ln-hair" x1="0" y1="${Y1}" x2="${X1}" y2="${Y1}"/>
          <line class="ln-hair" x1="0" y1="0" x2="0" y2="${Y1}"/>
          ${[1.0, 1.5, 2.0, 2.5].map((l) => `<line class="ln-hair" x1="0" y1="${py(l)}" x2="${X1}" y2="${py(l)}" stroke-dasharray="4 8"/><text class="lbl" x="-14" y="${py(l) + 8}" text-anchor="end">${l.toFixed(1)}</text>`).join('')}
          ${[0, 1000, 2000, 3000].map((s) => `<text class="lbl" x="${px(s)}" y="${Y1 + 44}" text-anchor="middle">${s}</text>`).join('')}
          <path class="ln-acc draw" pathLength="1" d="${path}"/>
          <circle class="fill-acc" cx="${px(3000)}" cy="${py(1.0703)}" r="8"/>
        </svg>
        <div class="p-r">
          <div class="t-label">Pérdida de validación</div>
          <div class="big">2.67 <span class="faint">→</span> <span class="accent">1.07</span></div>
          <p>en 3,000 iteraciones. La línea es la corrida real.</p>
        </div>
        <div class="p-why" data-step="1">¿Por qué no llega a cero? Porque <em>a</em> y <em>b</em> son al azar: solo lo que va después del <span class="mono">=</span> se puede predecir.</div>`,
    },
    {
      id: 'sumas',
      title: '92.8 · 92.0 · 0.0',
      time: 360,
      particles: { shape: 'two', opacity: 0.12 },
      html: `
        <div class="t-label">Resultado · 500 sumas por grupo</div>
        <h2 class="t-title">¿Aprendió a sumar?</h2>
        <div class="su">
          <div><div class="k">Vistas</div><div class="big">92.8%</div><div class="d">pares del entrenamiento</div><div class="eg">16+70=<span class="bad">76</span></div></div>
          <div data-step="1"><div class="k">Escondidas</div><div class="big">92.0%</div><div class="d">mismo rango, nunca vistas</div><div class="eg">74+96=<span class="bad">160</span></div></div>
          <div data-step="2"><div class="k">3 cifras</div><div class="big bad">0.0%</div><div class="d">fuera de lo que vio</div><div class="eg">359+481=<span class="bad">129</span></div></div>
        </div>
        <div class="su-num" data-step="3">Y en los tres grupos, <em>el 100% de las veces contesta con un número</em>.</div>`,
    },
    {
      id: 'filas',
      title: 'Filas inventadas',
      time: 360,
      particles: { shape: 'grid', opacity: 0.12 },
      html: () => `
        <div class="t-label">Resultado · ${TX.n} filas generadas</div>
        <h2 class="t-title">Se ven bien. ¿Pasan las reglas del negocio?</h2>
        <div class="fi">
          <ul class="fi-m">
            ${TX.reglas.map(([k, v]) => `<li><span>${k}</span><span class="v">${v}</span></li>`).join('')}
            <li class="all" data-step="1"><span>Pasa todas</span><span class="v accent">${TX.todas}</span></li>
          </ul>
          <div data-step="2">
            <div class="t-label" style="margin-bottom:16px">Se ven bien y no lo están</div>
<pre class="code">${TX.malas.map(([f, why]) => `${f}\n<span class="why">↳ ${why}</span>`).join('\n')}</pre>
          </div>
        </div>`,
    },
    {
      id: 'leccion',
      title: 'La lección',
      time: 180,
      class: 'middle',
      particles: { shape: 'converge', opacity: 0.3 },
      html: `
        <h2 class="le">Aprendió cómo <em>se ven</em> los datos. No qué es <em>verdad</em>.</h2>
        <p class="le-sub" data-step="1">Un modelo de frontera es esto mismo con más datos, más parámetros y más ajuste. Se equivoca mucho menos. Pero sigue sin decir "no sé" por su cuenta: eso se lo damos nosotros, con herramientas, contexto y evaluaciones.</p>`,
    },
    {
      id: 'pausa',
      title: 'Pausa',
      time: 600,
      class: 'center',
      label: 'Pausa',
      particles: { shape: 'ring', opacity: 0.3 },
      html: `<h2 class="pa">10 min</h2><p class="t-sub" style="margin-top:36px">Si tu entrenamiento de transacciones sigue corriendo, déjalo.</p>`,
    },
  ]);

})();
