// Particle field behind every slide. Particles live in stage coordinates
// (1920×1080) and spring toward the targets of the current shape.
// A shape is fn(u, t) -> [x, y], called per particle per frame; `u.i` is the
// particle index, `u.r(k)` a stable uniform random in [0,1), `u.g(k)` a stable
// gaussian. `t` is seconds since load, so shapes can move.
window.Particles = (() => {
  const W = 1920, H = 1080, TAU = Math.PI * 2;
  const N = 1800;
  const shapes = {};
  const P = [];
  let canvas, ctx, dpr = 1;
  let view = { s: 1, ox: 0, oy: 0 };
  let shape = 'scatter', opacity = 0, opTarget = 0.35;
  let frozen = false, running = false, last = 0;
  const t0 = performance.now();

  const rnd = (i, k) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
  const gauss = (i, k) => Math.sqrt(-2 * Math.log(Math.max(1e-6, rnd(i, k)))) * Math.cos(TAU * rnd(i, k + 0.5));
  const U = { i: 0, n: N, r(k) { return rnd(this.i, k); }, g(k) { return gauss(this.i, k); } };

  function define(name, fn) { shapes[name] = fn; }

  // ---- built-in shapes -----------------------------------------------------

  define('scatter', (u, t) => [
    u.r(1) * W + Math.sin(t * 0.07 + u.r(2) * TAU) * 40,
    u.r(3) * H + Math.cos(t * 0.05 + u.r(4) * TAU) * 40,
  ]);

  // Two clusters that never touch: the two OLTP databases of 2013.
  define('two', (u, t) => {
    const cx = u.i % 2 ? W * 0.72 : W * 0.28, cy = H * 0.5;
    return [cx + u.g(1) * 75 + Math.sin(t * 0.3 + u.r(5) * TAU) * 6,
            cy + u.g(2) * 75 + Math.cos(t * 0.3 + u.r(6) * TAU) * 6];
  });

  // One body: everything in one place (the warehouse).
  define('one', (u, t) => [
    W / 2 + u.g(1) * 150 + Math.sin(t * 0.25 + u.r(5) * TAU) * 8,
    H * 0.5 + u.g(2) * 150 + Math.cos(t * 0.25 + u.r(6) * TAU) * 8,
  ]);

  // Many small groups, each moving on its own path: agents.
  define('swarm', (u, t) => {
    const K = 14, k = u.i % K;
    const cx = W * (0.12 + 0.76 * rnd(k, 10)) + Math.sin(t * (0.12 + 0.1 * rnd(k, 11)) + k) * W * 0.09;
    const cy = H * (0.15 + 0.7 * rnd(k, 12)) + Math.cos(t * (0.1 + 0.1 * rnd(k, 13)) + k * 2) * H * 0.09;
    const a = u.r(1) * TAU + t * (0.5 + u.r(2) * 0.7), rad = 14 + u.r(3) * 40;
    return [cx + Math.cos(a) * rad, cy + Math.sin(a) * rad];
  });

  // Two tight clusters further apart: two confident, different answers.
  define('split', (u, t) => {
    const cx = u.i % 2 ? W * 0.76 : W * 0.24, cy = H * 0.55;
    return [cx + u.g(1) * 70 + Math.sin(t * 0.4 + u.r(5) * TAU) * 4,
            cy + u.g(2) * 70 + Math.cos(t * 0.4 + u.r(6) * TAU) * 4];
  });

  // Everything to one point: one answer.
  define('converge', (u) => [W / 2 + u.g(1) * 5, H / 2 + u.g(2) * 5]);

  // Two horizontal tracks (the double timeline), slowly flowing right.
  define('timeline', (u, t) => {
    const top = u.i % 2 === 0, span = W * 0.88;
    const x = W * 0.06 + ((u.r(1) * span + t * (top ? 18 : 10)) % span);
    return [x, (top ? H * 0.36 : H * 0.68) + u.g(2) * 3];
  });

  define('ring', (u, t) => {
    const a = u.r(1) * TAU + t * 0.04, R = 340 + u.g(2) * 6;
    return [W / 2 + Math.cos(a) * R, H / 2 + Math.sin(a) * R];
  });

  define('grid', (u) => {
    const cols = 60, rows = Math.ceil(N / cols);
    return [W * 0.08 + (u.i % cols) / (cols - 1) * W * 0.84,
            H * 0.1 + Math.floor(u.i / cols) / (rows - 1) * H * 0.8];
  });

  // Particles sample a set of points (stage coords), with a little jitter.
  function fromPoints(name, pts) {
    define(name, (u, t) => {
      const p = pts[u.i % pts.length];
      return [p[0] + u.g(1) * 1.5 + Math.sin(t * 0.8 + u.r(4) * TAU) * 1.2,
              p[1] + u.g(2) * 1.5 + Math.cos(t * 0.8 + u.r(5) * TAU) * 1.2];
    });
  }

  // Particles form text, rendered at stage center (or opts.x / opts.y).
  function fromText(name, text, opts = {}) {
    const size = opts.size || 320, x = opts.x ?? W / 2, y = opts.y ?? H / 2;
    const font = opts.font || `600 ${size}px "Helvetica Neue", Helvetica, Arial, sans-serif`;
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const g = c.getContext('2d');
    g.fillStyle = '#fff'; g.font = font; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(text, x, y);
    const data = g.getImageData(0, 0, W, H).data, pts = [], step = opts.step || 5;
    for (let py = 0; py < H; py += step)
      for (let px = 0; px < W; px += step)
        if (data[(py * W + px) * 4 + 3] > 128) pts.push([px, py]);
    for (let i = pts.length - 1; i > 0; i--) { const j = Math.floor(rnd(i, 99) * (i + 1)); [pts[i], pts[j]] = [pts[j], pts[i]]; }
    fromPoints(name, pts.length ? pts : [[x, y]]);
  }

  // ---- simulation ----------------------------------------------------------

  function init(el) {
    canvas = el; ctx = canvas.getContext('2d');
    for (let i = 0; i < N; i++) {
      U.i = i;
      P.push({ x: U.r(1) * W, y: U.r(3) * H, vx: 0, vy: 0,
               k: 0.006 + U.r(7) * 0.014, size: 1.6 + U.r(8) * 1.6, band: i % 3 });
    }
    resize();
    addEventListener('resize', resize);
  }

  function resize() {
    dpr = window.devicePixelRatio || 1;
    canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr;
    canvas.style.width = innerWidth + 'px'; canvas.style.height = innerHeight + 'px';
    draw(false);
  }

  function setView(s, ox, oy) { view = { s, ox, oy }; }

  function step(t) {
    const fn = shapes[shape] || shapes.scatter;
    for (let i = 0; i < N; i++) {
      const p = P[i]; U.i = i;
      const [tx, ty] = fn(U, t);
      p.vx = (p.vx + (tx - p.x) * p.k) * 0.88;
      p.vy = (p.vy + (ty - p.y) * p.k) * 0.88;
      p.x += p.vx; p.y += p.vy;
    }
    opacity += (opTarget - opacity) * 0.04;
  }

  const BAND_ALPHA = [1, 0.65, 0.4];

  function draw(trail) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = trail ? 'rgba(0,0,0,0.3)' : '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (opacity < 0.005) return;
    const s = view.s * dpr;
    ctx.setTransform(s, 0, 0, s, view.ox * dpr, view.oy * dpr);
    for (let b = 0; b < 3; b++) {
      ctx.fillStyle = `rgba(255,255,255,${(opacity * BAND_ALPHA[b]).toFixed(3)})`;
      for (let i = b; i < N; i += 3) {
        const p = P[i];
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      }
    }
  }

  function loop(now) {
    if (!running) return;
    if (!frozen && now - last > 14) { last = now; step((now - t0) / 1000); draw(true); }
    requestAnimationFrame(loop);
  }

  function start() { if (!running) { running = true; requestAnimationFrame(loop); } }

  // Jump straight to the settled state (screenshots).
  function settle(iterations = 600) {
    const t = (performance.now() - t0) / 1000;
    opacity = opTarget;
    for (let k = 0; k < iterations; k++) { step(t); opacity = opTarget; }
    draw(false);
  }

  // spec: 'name' | { shape: 'name', opacity: 0..1 }
  function set(spec) {
    const o = typeof spec === 'string' ? { shape: spec } : (spec || {});
    if (o.shape === 'none') { opTarget = 0; return; }
    if (o.shape) {
      if (!shapes[o.shape]) console.warn(`Particles: unknown shape "${o.shape}"`);
      shape = o.shape;
    }
    opTarget = o.opacity ?? 0.35;
  }

  function toggleFreeze() { frozen = !frozen; return frozen; }

  return { W, H, N, init, start, set, define, fromText, fromPoints, setView, settle, toggleFreeze,
           get shape() { return shape; } };
})();
