// ai4data · temario. Drives the CIDE particle field from page scroll: each
// section carries data-shape, and the field morphs as it comes into view.
(() => {
  document.documentElement.classList.add('js');
  const W = Particles.W, H = Particles.H;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const field = document.getElementById('field');

  // Cover the viewport with the 1920x1080 stage (the deck letterboxes; a page should not).
  function fit() {
    const s = Math.max(innerWidth / W, innerHeight / H);
    Particles.setView(s, (innerWidth - W * s) / 2, (innerHeight - H * s) / 2);
  }

  Particles.init(field);
  fit();
  addEventListener('resize', () => { fit(); if (reduce) Particles.settle(); });
  Particles.set({ shape: 'scatter', opacity: 0.32 });

  if (reduce) Particles.settle();
  else Particles.start();

  // Sections: reveal once, and the most visible one picks the particle shape.
  const blocks = [...document.querySelectorAll('[data-shape]')];
  const seen = new Map();
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      seen.set(e.target, e.intersectionRatio);
      if (e.isIntersecting && e.target.classList.contains('block')) e.target.classList.add('in');
    }
    let best = null, ratio = 0;
    for (const [el, r] of seen) if (r > ratio) { best = el; ratio = r; }
    if (best && best.dataset.shape !== Particles.shape) {
      // Modules sit behind dense cards: keep the field quieter there.
      Particles.set({ shape: best.dataset.shape, opacity: best.classList.contains('module') ? 0.22 : 0.32 });
      if (reduce) Particles.settle();
    }
  }, { threshold: [0, 0.15, 0.3, 0.5, 0.7] });
  blocks.forEach((b) => io.observe(b));
})();
