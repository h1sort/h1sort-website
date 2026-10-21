// Act 1 · Scorecard de 2023 (300 s): slides 4-6. See CONTRACT.md.
(() => {
  Deck.css(`
    #s-julio-2023 .a1-head, #s-scorecard .a1-head { margin-bottom: 28px; }
    #s-julio-2023 .a1-title, #s-scorecard .a1-title { font-size: 76px; font-weight: 500; letter-spacing: -0.02em; line-height: 1.05; margin: 0 0 32px; }
    #s-julio-2023 .a1-claims { border-top: var(--stroke) solid var(--hair); }
    #s-julio-2023 .a1-claim { display: grid; grid-template-columns: 110px 1fr; align-items: baseline; padding: 30px 0;
      border-bottom: var(--stroke) solid var(--hair); font-size: 50px; letter-spacing: -0.01em; line-height: 1.15; }
    #s-julio-2023 .a1-claim .n { font-family: var(--mono); font-size: 24px; letter-spacing: 0.2em; color: var(--faint); }
    #s-julio-2023 .a1-claim small { display: block; margin-top: 8px; font-size: 30px; color: var(--dim); letter-spacing: 0; }

    #s-scorecard .a1-rows { border-top: var(--stroke) solid var(--hair); }
    #s-scorecard .a1-row { display: grid; grid-template-columns: 420px 1fr; align-items: baseline; padding: 14px 0;
      border-bottom: var(--stroke) solid var(--hair); }
    #s-scorecard .a1-v { font-family: var(--mono); font-size: 26px; letter-spacing: 0.18em; text-transform: uppercase; }
    #s-scorecard .a1-v b { display: inline-block; width: 44px; font-weight: 400; font-size: 36px; letter-spacing: 0; }
    #s-scorecard .a1-t { font-size: 48px; letter-spacing: -0.01em; line-height: 1.15; }
    #s-scorecard .a1-t small { display: block; margin-top: 6px; font-size: 30px; color: var(--dim); letter-spacing: 0; }
    #s-scorecard .a1-row.hot { border: var(--stroke) solid var(--accent); border-radius: 18px; margin: 10px -28px; padding: 22px 28px; }
    #s-scorecard .a1-row.hot .a1-t { font-size: 56px; }
    #s-scorecard .a1-row.hot .a1-t small { font-size: 36px; color: var(--fg); }
    #s-scorecard .a1-row.hot .a1-t small s { color: var(--faint); text-decoration-thickness: 2px; }

    #s-puente .a1-big { font-size: 96px; font-weight: 500; line-height: 1.08; letter-spacing: -0.025em; margin: 0; }
    #s-puente .a1-big + .a1-big { margin-top: 28px; }
    #s-puente .a1-q { font-size: 76px; line-height: 1.12; letter-spacing: -0.02em; max-width: 1500px; margin-top: 84px; }
  `);

  Deck.act(1, 'Acto 1 · Scorecard 2023', [
    {
      id: 'julio-2023',
      title: 'Lo que les dije en julio de 2023',
      time: 90,
      class: 'middle',
      particles: { shape: 'scatter', opacity: 0.2 },
      html: `
        <div class="a1-head t-label">Julio 2023 · lo que dije</div>
        <h1 class="a1-title">Lo que les dije</h1>
        <div class="a1-claims focus-last">
          <div class="a1-claim" data-step="1"><span class="n">01</span><span>El Modern Data Stack es marketing.</span></div>
          <div class="a1-claim" data-step="2"><span class="n">02</span><span>DuckDB: el retador “de juguete”.</span></div>
          <div class="a1-claim" data-step="3"><span class="n">03</span><span>No migres porque algo es nuevo.<small>Migrar cuesta años.</small></span></div>
          <div class="a1-claim" data-step="4"><span class="n">04</span><span>Riggan puede tomar todas las decisiones erróneas… y aun así triunfar.</span></div>
        </div>`,
    },
    {
      id: 'scorecard',
      title: 'La calificación',
      time: 150,
      class: 'middle',
      particles: { shape: 'scatter', opacity: 0.2 },
      html: `
        <div class="a1-head t-label">Scorecard · 2023 → 2026</div>
        <h1 class="a1-title">La calificación</h1>
        <div class="a1-rows">
          <div class="a1-row" data-step="1"><div class="a1-v good"><b>✓</b>Acerté</div>
            <div class="a1-t">El MDS era marketing.<small>Ya ni lo decimos.</small></div></div>
          <div class="a1-row" data-step="2"><div class="a1-v good"><b>✓</b>Acerté</div>
            <div class="a1-t">DuckDB.<small>El “juguete” ya no es de juguete.</small></div></div>
          <div class="a1-row" data-step="3"><div class="a1-v bad"><b>✗</b>Fallé</div>
            <div class="a1-t">dbt.<small>Tres años después, todavía no en producción en algunos lugares.</small></div></div>
          <div class="a1-row hot" data-step="4"><div class="a1-v accent"><b>↻</b>Ya no es cierto</div>
            <div class="a1-t">“Migrar cuesta años.”<small><s>años</s> &rarr; <em>meses</em></small></div></div>
          <div class="a1-row" data-step="5"><div class="a1-v accent"><b>!</b>No lo vi venir</div>
            <div class="a1-t">Los agentes.</div></div>
        </div>`,
    },
    {
      id: 'puente',
      title: 'Puente: ¿cambió el stack?',
      time: 60,
      class: 'middle',
      particles: { shape: 'scatter', opacity: 0.3 },
      html: `
        <p class="a1-big">Hoy nadie habla de stacks.</p>
        <p class="a1-big" data-step="1">Todo el mundo habla de agentes.</p>
        <p class="a1-q" data-step="2">¿Cambió el stack, o cambió <em>otra cosa</em>?</p>`,
    },
  ]);
})();
