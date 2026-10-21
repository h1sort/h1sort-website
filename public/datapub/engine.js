// Deck engine: slide registry, navigation, build steps, chrome (label,
// counter, progress), speaker notes and presenter window. See CONTRACT.md.
window.Deck = (() => {
  const W = 1920, H = 1080;
  const acts = [];
  const slides = [];
  const qs = new URLSearchParams(location.search);
  const SHOT = qs.has('shot');
  const PUBLIC = document.documentElement.hasAttribute('data-public'); // web copy: no notes, no presenter
  const ctx = { shot: SHOT, W, H, particles: window.Particles };
  let idx = -1, step = 0, els = [];
  let presenter = null, clockStart = null;
  let gotoBuf = '';

  const $ = (s) => document.querySelector(s);
  const pick = (v, s) => (Array.isArray(v) ? v[Math.min(s, v.length - 1)] : v);
  const fmt = (sec) => {
    const neg = sec < 0; sec = Math.abs(Math.round(sec));
    return `${neg ? '−' : ''}${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
  };

  function act(n, label, list) { acts.push({ n, label, list }); }

  // Per-act styles; scope selectors to your slide ids (#s-<id>) or an act prefix.
  function css(text) { const st = document.createElement('style'); st.textContent = text; document.head.appendChild(st); }

  // ---- build ---------------------------------------------------------------

  function start() {
    acts.sort((a, b) => a.n - b.n);
    const skip = (document.documentElement.dataset.skip || '').split(/\s+/).filter(Boolean); // web copies can drop slides
    for (const a of acts) for (const s of a.list) if (!skip.includes(s.id)) slides.push({ ...s, actN: a.n, actLabel: a.label });

    const stage = $('#stage');
    slides.forEach((s, k) => {
      const el = document.createElement('section');
      el.className = 'slide' + (s.class ? ' ' + s.class : '');
      el.id = 's-' + (s.id || k + 1);
      el.innerHTML = typeof s.html === 'function' ? s.html(ctx) : (s.html || '');
      const maxStep = Math.max(0, ...[...el.querySelectorAll('[data-step],[data-step-only],[data-step-hide]')]
        .map((n) => +(n.dataset.step || n.dataset.stepOnly || n.dataset.stepHide)));
      s.steps = s.steps ?? maxStep;
      stage.appendChild(el);
      els.push(el);
    });

    if (SHOT) document.documentElement.classList.add('shot');
    Particles.init($('#field'));
    fit();
    addEventListener('resize', fit);
    addEventListener('keydown', onKey);
    addEventListener('hashchange', () => { const [i, s] = parseHash(); if (i !== idx || s !== step) go(i, s); });
    // Tap/click: left 30% of the screen goes back, the rest goes forward.
    $('#stage').addEventListener('click', (e) => {
      if (e.target.closest('a,button,video,input')) return;
      if (e.clientX < innerWidth * 0.3) prev(); else next();
    });
    addSwipeNav();
    if (PUBLIC) { addWheelNav(); showTouchHint(); } // not while presenting: a stray scroll mustn't skip
    hideCursorWhenIdle();

    const [i, s] = parseHash();
    go(i, s);
    if (SHOT) Particles.settle(); else Particles.start();
  }

  function fit() {
    // Screenshots always render the stage at 1:1, whatever headless reports.
    const s = SHOT ? 1 : Math.min(innerWidth / W, innerHeight / H);
    const ox = SHOT ? 0 : (innerWidth - W * s) / 2, oy = SHOT ? 0 : (innerHeight - H * s) / 2;
    $('#stage').style.transform = `translate(${ox}px, ${oy}px) scale(${s})`;
    $('#chrome').style.transform = `translate(${ox}px, ${oy}px) scale(${s})`;
    Particles.setView(s, ox, oy);
  }

  // ---- navigation ----------------------------------------------------------

  // #/12/2 (1-based slide, step) or #/@slide-id/2
  function parseHash() {
    const byId = location.hash.match(/^#\/@([\w-]+)(?:\/(\d+))?/);
    if (byId) { const i = slides.findIndex((s) => s.id === byId[1]); return [Math.max(0, i), +(byId[2] || 0)]; }
    const m = location.hash.match(/^#\/(\d+)(?:\/(\d+))?/);
    return m ? [Math.max(0, Math.min(slides.length - 1, +m[1] - 1)), +(m[2] || 0)] : [0, 0];
  }

  function go(i, s = 0) {
    i = Math.max(0, Math.min(slides.length - 1, i));
    s = Math.max(0, Math.min(slides[i].steps, s));
    if (i !== idx) {
      if (idx >= 0) {
        els[idx].classList.remove('active');
        els[idx].querySelectorAll('video').forEach((v) => v.pause());
        slides[idx].onLeave?.(els[idx], ctx);
      }
      idx = i; step = s;
      applyStep();
      els[idx].classList.add('active');
      slides[idx].onEnter?.(els[idx], ctx, step);
    } else {
      step = s;
      applyStep();
    }
    slides[idx].onStep?.(els[idx], step, ctx);
    updateChrome();
    history.replaceState(null, '', `${location.pathname}${location.search}#/${idx + 1}/${step}`);
  }

  function next() {
    if (clockStart === null) clockStart = Date.now();
    if (step < slides[idx].steps) go(idx, step + 1);
    else if (idx < slides.length - 1) go(idx + 1, 0);
  }

  function prev() {
    if (step > 0) go(idx, step - 1);
    else if (idx > 0) go(idx - 1, slides[idx - 1].steps);
  }

  function applyStep() {
    const el = els[idx];
    el.dataset.at = step; // not data-step: that attribute means "reveal at"
    el.querySelectorAll('[data-step]').forEach((n) => n.classList.toggle('shown', +n.dataset.step <= step));
    el.querySelectorAll('[data-step-only]').forEach((n) => n.classList.toggle('shown', +n.dataset.stepOnly === step));
    el.querySelectorAll('[data-step-hide]').forEach((n) => n.classList.toggle('gone', +n.dataset.stepHide <= step));
  }

  // Particles inherit from the last slide that declared them.
  function particlesFor(i, s) {
    for (let j = i; j >= 0; j--) {
      const p = slides[j].particles;
      if (p !== undefined) return pick(p, j === i ? s : Infinity);
    }
    return 'scatter';
  }

  function updateChrome() {
    const s = slides[idx];
    Particles.set(particlesFor(idx, step));

    const label = s.label ?? s.actLabel;
    $('#label').textContent = label || '';

    const counter = pick(s.counter, step);
    const box = $('#counter');
    if (counter) {
      const val = box.querySelector('.value');
      if (val.textContent !== counter) {
        val.textContent = counter;
        box.classList.remove('flash'); void box.offsetWidth; box.classList.add('flash');
      }
      box.classList.add('on');
    } else box.classList.remove('on');

    $('#progress').style.width = `${(idx / Math.max(1, slides.length - 1)) * 100}%`;
    renderNotes();
    renderPresenter();
  }

  // ---- keys ----------------------------------------------------------------

  function onKey(e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key;
    if (/^[0-9]$/.test(k)) { gotoBuf += k; return; }
    if (k === 'Enter' && gotoBuf) { go(+gotoBuf - 1, 0); gotoBuf = ''; return; }
    gotoBuf = '';
    if (['ArrowRight', 'ArrowDown', ' ', 'PageDown', 'Enter'].includes(k)) { e.preventDefault(); next(); }
    else if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'].includes(k)) { e.preventDefault(); prev(); }
    else if (k === 'Home') go(0, 0);
    else if (k === 'End') go(slides.length - 1, 0);
    else if (k === 'b' || k === 'B' || k === '.') $('#black').classList.toggle('on');
    else if (k === 'f' || k === 'F') Particles.toggleFreeze();
    else if (PUBLIC) return;
    else if (k === 'n' || k === 'N') { $('#notes').classList.toggle('on'); renderNotes(); }
    else if (k === 'p' || k === 'P') openPresenter();
    else if (k === 't' || k === 'T') { clockStart = Date.now(); renderPresenter(); }
  }

  // Swipe left/up = next, right/down = prev (like scrolling a feed).
  function addSwipeNav() {
    let x0 = null, y0 = null;
    addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; } else x0 = null;
    }, { passive: true });
    addEventListener('touchend', (e) => {
      if (x0 === null) return;
      const t = e.changedTouches[0], dx = t.clientX - x0, dy = t.clientY - y0;
      x0 = null;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 40) return; // a tap: the click handler takes it
      if (Math.abs(dx) > Math.abs(dy) ? dx < 0 : dy < 0) next(); else prev();
    }, { passive: true });
  }

  // One step per wheel/trackpad gesture: a gesture ends after 250 ms without wheel events.
  function addWheelNav() {
    let acc = 0, last = 0, spent = false;
    addEventListener('wheel', (e) => {
      e.preventDefault();
      const now = Date.now();
      if (now - last > 250) { acc = 0; spent = false; }
      last = now;
      if (spent) return;
      acc += Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (Math.abs(acc) >= 50) { spent = true; if (acc > 0) next(); else prev(); }
    }, { passive: false });
  }

  function showTouchHint() {
    if (!matchMedia('(pointer: coarse)').matches || SHOT) return;
    const h = document.createElement('div');
    h.id = 'hint';
    h.textContent = innerHeight > innerWidth ? 'Gira el teléfono · desliza o toca para avanzar' : 'Desliza o toca para avanzar';
    document.body.appendChild(h);
    const hide = () => h.classList.add('gone');
    setTimeout(hide, 5000);
    addEventListener('touchend', hide, { once: true });
  }

  function hideCursorWhenIdle() {
    let t;
    addEventListener('mousemove', () => {
      document.body.classList.remove('idle');
      clearTimeout(t); t = setTimeout(() => document.body.classList.add('idle'), 2000);
    });
  }

  // ---- notes & presenter ---------------------------------------------------

  const plannedBefore = (i) => slides.slice(0, i).reduce((a, s) => a + (s.time || 0), 0);
  const totalPlanned = () => plannedBefore(slides.length);

  function renderNotes() {
    const box = $('#notes');
    if (!box.classList.contains('on')) return;
    const s = slides[idx];
    box.innerHTML = `<div class="meta">${idx + 1}/${slides.length} · ${s.title || s.id || ''}` +
      `${s.steps ? ` · paso ${step}/${s.steps}` : ''}</div><div class="body">${s.notes || '—'}</div>`;
  }

  function openPresenter() {
    if (presenter && !presenter.closed) { presenter.focus(); return; }
    presenter = window.open('', 'datapub-presenter', 'width=1200,height=800');
    if (!presenter) return;
    const d = presenter.document;
    d.open();
    d.write(`<!doctype html><meta charset="utf-8"><title>Presenter · datapub</title>
<style>
  body{margin:0;background:#0b0b0b;color:#eee;font:22px/1.45 "Helvetica Neue",Helvetica,Arial,sans-serif;display:grid;grid-template-rows:auto 1fr auto;height:100vh}
  header,footer{display:flex;gap:32px;align-items:baseline;padding:16px 28px;font-family:"SF Mono",Menlo,monospace;font-size:20px;color:#aaa;border-bottom:1px solid #222}
  footer{border-top:1px solid #222;border-bottom:0}
  #clock{font-size:44px;color:#fff}#delta.late{color:#ff6b5f}#delta.early{color:#7ee0a1}
  main{overflow:auto;padding:24px 28px}h1{font-size:30px;margin:0 0 12px}
  #notes{font-size:26px;max-width:72ch}#notes p{margin:0 0 .7em}
</style>
<header><span id="clock">0:00</span><span id="delta"></span><span id="pos"></span><span id="stepinfo"></span></header>
<main><h1 id="title"></h1><div id="notes"></div></main>
<footer><span>Siguiente →</span><span id="next"></span></footer>`);
    d.close();
    presenter.addEventListener('keydown', onKey);
    setInterval(renderPresenter, 1000);
    renderPresenter();
  }

  function renderPresenter() {
    if (!presenter || presenter.closed) return;
    const d = presenter.document, s = slides[idx], n = slides[idx + 1];
    const elapsed = clockStart ? (Date.now() - clockStart) / 1000 : 0;
    const delta = elapsed - plannedBefore(idx);
    d.getElementById('clock').textContent = fmt(elapsed);
    const del = d.getElementById('delta');
    del.textContent = `plan ${fmt(plannedBefore(idx))} / ${fmt(totalPlanned())} · ${delta >= 0 ? '+' : ''}${fmt(delta)}`;
    del.className = delta > 30 ? 'late' : delta < -30 ? 'early' : '';
    d.getElementById('pos').textContent = `${idx + 1}/${slides.length} · ${s.label ?? s.actLabel ?? ''}`;
    d.getElementById('stepinfo').textContent = s.steps ? `paso ${step}/${s.steps}` : '';
    d.getElementById('title').textContent = s.title || s.id || '';
    d.getElementById('notes').innerHTML = s.notes || '—';
    d.getElementById('next').textContent = n ? (n.title || n.id) : 'fin';
  }

  return { act, css, start, go, next, prev, ctx, get slides() { return slides; }, get index() { return idx; } };
})();
