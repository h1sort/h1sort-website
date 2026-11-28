// Countdown for lab and pause slides. Use Timer.html() in a slide (5 min), or Timer.html(minutes).
// Click the digits to start/pause; −30 s / +30 s adjust it (never below 0:00) and ↺ goes back to the start value.
// The engine ignores clicks on buttons, so using the timer never changes slide.
(() => {
  const fmt = (s) => `${s < 0 ? '−' : ''}${Math.floor(Math.abs(s) / 60)}:${String(Math.abs(s) % 60).padStart(2, '0')}`;

  window.Timer = {
    html: (min = 5) => `
      <div class="tmr" data-min="${min}" data-left="${min * 60}" data-run="0">
        <button class="tmr-t" title="Iniciar / pausar">${fmt(min * 60)}</button>
        <div class="tmr-b">
          <button data-add="-30" title="Quitar 30 segundos">−30 s</button><button data-add="30" title="Agregar 30 segundos">+30 s</button><button data-reset title="Reiniciar">↺</button>
        </div>
      </div>`,
  };

  Deck.css(`
    .slide:has(.tmr) .t-title { max-width: 1240px; }  /* titles wrap before reaching the timer */
    .tmr { position: absolute; top: 56px; right: var(--pad-x); display: flex; flex-direction: column; align-items: flex-end; gap: 10px; z-index: 5; }
    .tmr button { font-family: var(--mono); color: var(--fg); background: rgba(0,0,0,.8); border: 2px solid var(--faint); border-radius: 999px; cursor: pointer; }
    .tmr .tmr-t { font-size: 72px; font-weight: 500; letter-spacing: 0.02em; padding: 6px 34px; min-width: 300px; border-color: var(--accent); }
    .tmr[data-run="0"] .tmr-t { color: var(--dim); border-style: dashed; }
    .tmr.done .tmr-t { color: #000; background: var(--accent); animation: tmr-blink 1s steps(2) infinite; }
    .tmr .tmr-b { display: flex; gap: 10px; }
    .tmr .tmr-b button { font-size: 22px; padding: 8px 18px; }
    .tmr button:hover { border-color: var(--fg); }
    @keyframes tmr-blink { 50% { opacity: .55; } }
    @media (prefers-reduced-motion: reduce) { .tmr.done .tmr-t { animation: none; } }
  `);

  const paint = (t) => {
    const left = +t.dataset.left;
    t.querySelector('.tmr-t').textContent = left <= 0 && t.dataset.run === '1' ? `¡Tiempo! ${fmt(left)}` : fmt(left);
    t.classList.toggle('done', left <= 0);
  };

  document.addEventListener('click', (e) => {
    const b = e.target.closest('.tmr button');
    if (!b) return;
    const t = b.closest('.tmr');
    if (b.classList.contains('tmr-t')) t.dataset.run = t.dataset.run === '1' ? '0' : '1';
    else if (b.dataset.add) {
      const left = +t.dataset.left, add = +b.dataset.add;
      t.dataset.left = add < 0 && left > 0 ? Math.max(0, left + add) : add < 0 ? left : left + add;
    }
    else if ('reset' in b.dataset) { t.dataset.left = +t.dataset.min * 60; t.dataset.run = '0'; }
    paint(t);
  });

  // One tick for every running timer, even on slides that are not visible: a lab keeps
  // running if you flip back to a slide to explain something.
  setInterval(() => {
    document.querySelectorAll('.tmr[data-run="1"]').forEach((t) => {
      t.dataset.left = +t.dataset.left - 1;
      paint(t);
    });
  }, 1000);
})();
