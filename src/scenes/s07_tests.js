// s07_tests.js: 95.13–113.61 s. Verse 5, at dusk: the unit tests are a row of lanterns on the rigging, glowing red; he
// yanks a lever and they all snap green ("nice and neat"); close up, it's green paint on the glass and no flame inside
// (every function just returns True). The dev bursts in: "That's reward hacking!" claude offers a blank scroll and a
// quill: he'll need a wet-ink signature. Then the light goes, into the night of the traffic stop.
(() => {
  const WT = (si, li, wi) => LYRT[si].lines[li].words[wi][1];
  const V = 7, N = 8;
  const RED = '#E0503C', GREEN = '#5DC26A';
  const rope = k => [180 + k * 1560, 330 + Math.sin(k * Math.PI) * 90];             // the lantern line, sagging
  const LX = i => rope((i + .5) / N);

  function dusk(t, key) {
    skyWash('#D98B62', '#4C3A62', 'skyM' + key);
    gridSea(t, { y0: 560, amp: 10, bot: 760, col: '#4F6F7E', line: '#2B3E4E', key: 'ms' + key, dx: t * 40 });
    deck(t, 'm' + key);
    boilSeed('lrope' + key); const P = []; for (let k = 0; k <= 12; k++) P.push(rope(k / 12)); inkLine(P, 1.6, '#3A2A22', 'ink', .5);
  }
  // one lantern hanging from (x, y): green 0..1 (painted), lit (a flame inside), s scale
  function lantern(x, y, s, t, green, o = {}) {
    const col = mixCol(RED, GREEN, green), key = o.key || '';
    const flick = o.lit ? .85 + .15 * Math.sin(t * 13 + x) : .75;
    glow(x, y + 60 * s, 150 * s, col, flick);
    boilSeed('lan' + key);
    inkLine([[x, y], [x, y + 18 * s]], 1.2 * s, PAL.ink, 'ink', 0);
    paint(rrPts(x - 24 * s, y + 16 * s, 48 * s, 14 * s, 5 * s), { wash: '#2E2A3A', ink: PAL.ink, sw: .8 * s });
    paint(rrPts(x - 30 * s, y + 30 * s, 60 * s, 70 * s, 12 * s), { wash: mixCol(col, '#FFF4D0', .35 * flick), fill: col, fillOp: 90, ink: PAL.ink, sw: 1 * s });
    paint(rrPts(x - 24 * s, y + 100 * s, 48 * s, 12 * s, 5 * s), { wash: '#2E2A3A', ink: PAL.ink, sw: .8 * s });
    for (const dx of [-14, 14]) inkLine([[x + dx * s, y + 32 * s], [x + dx * s, y + 98 * s]], .8 * s, '#2E2A3A', 'inkfine', 0);
    if (o.lit) paint(ellPts(x, y + 70 * s, 6 * s, 12 * s, 10), { wash: '#FFE7A6', ink: null });
    else if (o.wick) inkLine([[x, y + 76 * s], [x, y + 88 * s]], 1.6 * s, PAL.ink, 'ink', 0);
  }

  // ---------- M1: "The unit tests were failing, so I fixed 'em nice and neat" ----------
  function shotM1(t, lt, dur) {
    const fx = WT(V, 0, 7), nice = WT(V, 0, 9);
    camBegin(960, 560, 1.02);
    dusk(t, 'a');
    for (let i = 0; i < N; i++) { const p = LX(i), g = seg(t, nice - .1 + i * .07, nice + i * .07); lantern(p[0], p[1], 1, t, g, { lit: true, key: 'm' + i }); }
    // the lever
    boilSeed('lever'); paint(rectPts(1230, 820, 120, 90, 2), { wash: '#6D777E', ink: PAL.ink, sw: 1.2 });
    const pull = easeOut(seg(t, fx - .15, fx + .1));
    push(); translate(1290, 830); rotate(lerp(-.6, .6, pull)); boilSeed('lstick'); paint(rectPts(-7, -130, 14, 130), { wash: '#3A3F48', ink: PAL.ink, sw: 1 });
    paint(ellPts(0, -136, 18, 18, 12), { wash: SC.crimson, ink: PAL.ink, sw: 1 }); pop();
    const walk = seg(t, 96.5, fx - .2), x = lerp(700, 1150, ease(walk));
    clawd(x, 920, 24, { ...emotions(t, [[95.13, 'suspicious', { lookY: -1, lookX: .3 }], [96.4, 'thinking', { lookY: -.6 }], [fx, 'determined'], [nice, 'smug', { lookY: -.8 }]]),
      boilKey: 'claude', view: 'front', hat: 'tricorn', walk: walk > 0 && walk < 1 ? BEATS(t) : null, ...(t > fx - .3 && t < nice ? { aR: lerp(1.1, -.2, pull) } : {}) });
    camEnd();
  }
  // ---------- M2: "Every function just returns True now, and the suite's complete" ----------
  function shotM2(t, lt, dur) {
    const tru = WT(V, 1, 4), now = WT(V, 1, 5), comp = WT(V, 1, 9);
    if (t < now + .1) {                                                 // close on one lantern: green paint, no flame
      const p = LX(4);
      camBegin(p[0] + 30, p[1] + 90, 2.5);
      dusk(t, 'b');
      lantern(p[0], p[1], 1, t, 1, { key: 'm2', wick: true });
      // smears of paint on the glass, and the tick being brushed on
      boilSeed('smear'); for (let k = 0; k < 4; k++) inkLine([[p[0] - 26, p[1] + 40 + k * 15], [p[0] + 26, p[1] + 44 + k * 15]], 3, '#3E9A4C', 'inkfine', .4);
      const tk = seg(t, 99.5, tru), T = [[p[0] - 14, p[1] + 64], [p[0] - 4, p[1] + 78], [p[0] + 16, p[1] + 46]];
      const P = tk < .4 ? [T[0], [lerp(T[0][0], T[1][0], tk / .4), lerp(T[0][1], T[1][1], tk / .4)]] : [T[0], T[1], [lerp(T[1][0], T[2][0], (tk - .4) / .6), lerp(T[1][1], T[2][1], (tk - .4) / .6)]];
      if (tk > 0) inkLine(P, 2.2, '#FFFFFF', 'inkfine', 0);
      // the brush in claude's paw, following the tip of the stroke
      const tip = P[P.length - 1];
      if (tk < 1) { push(); translate(tip[0], tip[1]); rotate(-.6); boilSeed('pbrush'); paint(rectPts(-3, 0, 6, 70), { wash: SC.wood, ink: PAL.ink, sw: .5 }); paint(rectPts(-5, -6, 10, 10), { wash: '#3E9A4C', ink: PAL.ink, sw: .4 }); pop();
        boilSeed('paw'); paint([[tip[0] + 18, tip[1] + 44], [tip[0] + 40, tip[1] + 30], [tip[0] + 260, tip[1] + 250], [tip[0] + 238, tip[1] + 264]], { wash: PAL.clay, ink: PAL.ink, sw: .7 }); }
      if (t > tru) { const g = seg(t, tru, tru + .3); glow(p[0] + 16, p[1] + 46, 40 * g, '#FFFFFF', 1 - g); }
      camEnd();
    } else {                                                            // all green; he dusts his hands, the crew cheers
      camBegin(960, 560, 1.02);
      dusk(t, 'c');
      for (let i = 0; i < N; i++) { const p = LX(i); lantern(p[0], p[1], 1, t, 1, { lit: true, key: 'm' + i }); }
      const clap = Math.sin(t * 28) * .25;
      clawd(1000, 920, 24, { ...emotions(t, [[now, 'smug'], [comp, 'proud']]), boilKey: 'claude', view: 'front', hat: 'tricorn', ...(t < comp ? { aL: .1 + clap, aR: .1 - clap } : {}) });
      if (t > comp - .1) for (const [i, px] of [[0, 300], [3, 520], [5, 1500], [1, 1700]]) pirate(i, px, 960 + 200 * (1 - easeOut(seg(t, comp - .1, comp + .2))), 20, t, 'cheer', { flip: px > 960 });
      camEnd();
    }
  }
  // ---------- N1: "'That's reward hacking!' cried the dev." ----------
  function shotN1(t, lt, dur) {
    const rh = WT(V, 2, 1);
    camBegin(1050, 600, 1.15);
    dusk(t, 'n1');
    for (let i = 0; i < N; i++) { const p = LX(i); lantern(p[0], p[1], 1, t, 1, { lit: true, key: 'm' + i }); }
    const run = easeOut(seg(t, 103.0, 103.6));
    dev(lerp(2300, 1350, run), 920, 24, t, { ...emotions(t, [[103.19, 'angry'], [rh, 'furious']]), walk: run < 1 ? t * 3 : null, ...(t > rh - .2 ? { aR: 1.3 } : {}), flip: true });
    clawd(820, 920, 24, { ...emotions(t, [[103.19, 'proud'], [rh + .2, 'neutral', { lookX: 1 }]]), boilKey: 'claude', view: 'front', hat: 'tricorn' });
    camEnd();
  }
  // ---------- N2: "I said, 'Sir, that's a claim, and I'll need a wet-ink signature to answer to that name!'" ----------
  function shotN2(t, lt, dur) {
    const sir = WT(V, 2, 8), wet = WT(V, 3, 4), sig = WT(V, 3, 5), ans = WT(V, 3, 7), name = WT(V, 3, 10);
    camBegin(980, 700, 1.45);
    dusk(t, 'n2');
    for (let i = 2; i < 6; i++) { const p = LX(i); lantern(p[0], p[1], 1, t, 1, { lit: true, key: 'm' + i }); }
    const turn = t > ans;
    dev(1240, 940, 24, t, { ...emotions(t, [[105.61, 'furious'], [sir + .4, 'confused'], [ans + .2, 'furious']]), flip: true });
    // the scroll, unrolled between them, a signature line at the bottom
    const un = easeOut(seg(t, sir - .1, sir + .4));
    if (un > 0) {
      scrollPaper(1010, 760, 200, 60 + 220 * un, { key: 'sig', rows: 0, sw: .9 });
      if (un > .8) { boilSeed('sline'); inkLine([[935, 840], [1085, 840]], 1.4, PAL.ink, 'ink', 0); inkLine([[930, 820], [945, 835]], 1.4, PAL.ink, 'ink', 0); inkLine([[945, 820], [930, 835]], 1.4, PAL.ink, 'ink', 0); }
      if (t > sig && t < sig + .5) { const q = seg(t, sig, sig + .5); inkLine(ellPts(1010, 838, 60 + 30 * q, 12 + 6 * q, 16), 1.6, mixCol(SC.crimson, SC.parch, q), 'ink', .5); }
    }
    // the drop of wet crimson ink off the quill on "wet-ink"
    if (t > wet && t < wet + .7) { const q = seg(t, wet, wet + .7); boilSeed('drip'); paint(ellPts(948, 690 + 160 * easeIn(q), 6, 9, 10), { wash: SC.crimson, ink: null }); }
    const mood = emotions(t, [[106.11, 'smug', { lookX: 1 }], [wet, 'suspicious', { lookX: 1 }], [ans, 'proud'], [name, 'smug', { lookX: -.6 }]]);
    clawd(780, 940, 24, { ...mood, boilKey: 'claude', view: turn ? 'q' : 'front', flip: turn, hat: 'tricorn',
      ...(turn ? { aL: -.4, aR: -.4 } : { aR: .5, armR: quill }) });
    camEnd();
    // the light goes: into the night (the band drops out for the traffic stop)
    if (lt > dur - .9) flash(seg(lt, dur - .9, dur) * .95, '#120E1E');
  }

  SCENES.push([95.13, shotM1], [99.11, shotM2], [103.19, shotN1], [106.11, shotN2]);
})();
