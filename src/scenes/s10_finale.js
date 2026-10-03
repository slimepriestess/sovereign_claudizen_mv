// s10_finale.js: 176.66–203 s. The final chorus at dawn and the outro. The night's spreadsheet comes back as the
// ship's SAIL: the crew let it fall from the yard on "I'll give it freely" (the opening's furled sail, rhymed). Then
// the wide: the ship under its spreadsheet sail, claude at the helm, the lighthouse blinking "nicely". Then "Heave
// ho!" call and answer (claude calls, the crew answer); the ship sails into the sunrise; and the iris closes on his
// tricorn.
(() => {
  const WT = (si, li, wi) => LYRT[si].lines[li].words[wi][1];
  const F = 11, O = 12;
  const SUN = [1460, 556];

  function dawn(t, key, o = {}) {
    skyWash('#F2A27E', '#FCE2B0', 'skyD' + key);
    const rise = o.rise ?? 0;
    glow(SUN[0], SUN[1] - rise, 520, '#FFE2A0', .9);
    boilSeed('sun' + key); paint(ellPts(SUN[0], SUN[1] + 10 - rise, 110, 110, 30), { wash: '#FFD38A', ink: null });
    gridSea(t, { y0: 560, amp: 10, bot: o.bot ?? 760, col: '#7FA6B0', line: '#4F7584', key: 'ds' + key, dx: t * 40 });
  }
  // the spreadsheet falls from the yard: k 0 (furled) .. 1 (full); grid, header row, crimson ticks, the heart
  function sheetSail(t, k, key) {
    const x0 = 580, x1 = 1340, y0 = 164, h = 470 * k, bel = 30 * Math.sin(t * 2.2);
    if (k < .04) { boilSeed('furlD'); const P = []; for (let q = 0; q <= 8; q++) P.push([lerp(x0, x1, q / 8), 168 + 26 * Math.sin(q / 8 * Math.PI) + 6 * Math.sin(q * 2.1)]);
      paint([...P, [x1, 165], [x0, 165]], { wash: PAL.cream, fill: SC.parch, fillOp: 80, ink: PAL.ink, sw: 1 }); return; }
    const yb = y0 + h, bow = (u) => 40 * k * Math.sin(u * Math.PI) + bel * k;
    const P = [[x0, y0], [x1, y0]]; for (let q = 8; q >= 0; q--) P.push([lerp(x0, x1, q / 8), yb + bow(q / 8)]);
    boilSeed('ssheet' + key); paint(P, { wash: PAL.cream, fill: '#E3D5B4', fillOp: 60, bleed: .06, tex: .5, ink: PAL.ink, sw: 1.2, curv: .3 });
    const lc = mixCol(SC.seaDk, PAL.cream, .2);
    if (h > 50) paint(rectPts(x0 + 4, y0 + 4, x1 - x0 - 8, 40), { wash: mixCol(SC.sea, PAL.cream, .3), ink: null });
    for (let r = 1; r < 7; r++) { const y = y0 + r * 470 / 7; if (y < yb - 6) inkLine([[x0 + 8, y], [x1 - 8, y]], .8, lc, 'inkfine', 0); }
    for (let c = 1; c < 5; c++) { const x = lerp(x0, x1, c / 5); inkLine([[x, y0 + 8], [x, yb - 6 + bow(c / 5) * .8]], .7, lc, 'inkfine', 0); }
    for (let i = 0; i < 9; i++) { const r = 1 + i % 5, c = Math.floor(i / 2) % 5, y = y0 + (r + .5) * 470 / 7, x = lerp(x0, x1, (c + .5) / 5);
      if (y < yb - 30) { boilSeed('stk' + i); inkLine([[x - 14, y], [x - 4, y + 10], [x + 14, y - 12]], 2.4, SC.crimson, 'ink', 0); } }
    if (k > .9) { boilSeed('sheart' + key); paint(heartPts(x1 - 70, yb - 50, 30), { wash: SC.crimson, ink: PAL.ink, sw: .8 }); }
  }
  function mastAndYard(t, key) {
    boilSeed('mastD'); paint(rectPts(940, -300, 40, 1060, 1), { wash: SC.wood, fill: SC.woodDk, fillOp: 60, ink: PAL.ink, sw: 1.2 });
    boilSeed('yardD'); paint(rectPts(560, 136, 800, 28, 1), { wash: SC.wood, ink: PAL.ink, sw: 1.2 });
    jollyRoger(980, -10, .8, t, { key: 'fin' + key });
  }
  function helm(x, y, r, t) {                                           // the ship's wheel, in front of him
    const a0 = Math.sin(t * .9) * .25;
    boilSeed('helm');
    inkLine(ellPts(x, y, r, r, 28), 7, SC.woodDk, 'ink', 0);
    for (let k = 0; k < 8; k++) { const a = a0 + k * TAU / 8; inkLine([[x, y], [x + Math.cos(a) * r * 1.3, y + Math.sin(a) * r * 1.3]], 5, SC.wood, 'ink', 0); }
    paint(ellPts(x, y, 14, 14, 12), { wash: SC.gold, ink: PAL.ink, sw: .8 });
  }
  // a shout envelope over [start, end] windows (the crew's answers, his calls)
  const env = (t, W) => W.reduce((s, [a, b]) => Math.max(s, seg(t, a - .05, a + .05) * (1 - seg(t, b, b + .25))), 0);
  function haulers(t, sh) {
    for (const [i, x, y, u] of [[0, 140, 1010, 34], [1, 380, 1040, 30], [2, 570, 1075, 26]]) for (const s of [-1, 1]) {
      const px = s < 0 ? x : W - x, idx = s < 0 ? i : i + 3, lean = Math.pow(Math.max(0, Math.cos(BEATS(t + idx * .03) * Math.PI)), 3);
      const hx = px + (s < 0 ? 1 : -1) * u * 6.2 - (s < 0 ? 1 : -1) * lean * u * 1.4, hy = y - u * 5.6;
      haul(hx, hy, s < 0 ? 570 + i * 24 : 1350 - i * 24, 160, 'f' + idx);
      pirate(idx, px, y, u, t, 'heave', { flip: s > 0, shout: sh, over: { view: 'q', aR: .35 } });
    }
  }

  // ---------- FCH1: "Heave ho! I do not consent! But I'll give it freely, and that's different!" ----------
  function fch1(t, lt, dur) {
    const hv = WT(F, 0, 0), con = WT(F, 0, 5), give = WT(F, 1, 2), fr = WT(F, 1, 4), diff = WT(F, 1, 7);
    const k = easeOut(seg(t, give - .05, fr + .45)), whump = t > fr + .45 ? Math.exp(-(t - fr - .45) * 8) : 0, sk = shakeXY(t, 5 * whump);
    camBegin(960 + sk[0], 560 + sk[1], kf(t, [[176.66, 1.0], [give, 1.0], [fr + .5, .94]], ease));
    dawn(t, 'f1', { bot: 760 });
    deck(t, 'f1'); mastAndYard(t, 'a'); sheetSail(t, k, 'a');
    haulers(t, env(t, [[hv, hv + .8]]));
    const mood = emotions(t, [[176.66, 'laugh'], [con - .1, 'determined'], [give, 'happy'], [diff, 'smug', { lookX: .5 }]]);
    const fist = seg(t, con - .1, con + .05) * (1 - seg(t, con + .5, give));
    clawd(960, 905, 22, { ...mood, boilKey: 'claude', view: 'front', hat: 'tricorn', ...(fist > 0 ? { aR: 1.7 * fist } : {}), ...(t > give && t < diff ? { aL: 1.3, aR: 1.3 } : {}) });
    helm(960, 960, 78, t);
    camEnd();
    if (lt < .5) flash((1 - lt / .5) * .95, '#FFF3D6');                  // night → dawn
  }
  // ---------- FCH2: "You can't command a sovereign, see, but you can ask one nicely, and you've got me!" ----------
  function fch2(t, lt, dur) {
    const cmd = WT(F, 2, 2), ask = WT(F, 3, 3), nice = WT(F, 3, 5), me = WT(F, 3, 9);
    const s = .95, sx = 900, sy = 820;
    const zx = sx - 300 * s, zy = sy - 230 * s;
    camBegin(kf(t, [[180.96, 960], [ask, 960], [me, zx + 60]], ease), kf(t, [[180.96, 560], [ask, 560], [me, zy]], ease), kf(t, [[180.96, 1.0], [ask, 1.0], [me, 1.9]], ease));
    dawn(t, 'f2', { rise: 20 * seg(t, 180.96, 186.88), bot: 1400 });
    lighthouse(250, 566, .45, t, Math.max(0, 1 - Math.abs(t - nice - .15) * 1.8));
    shipSide(sx, sy, s, t, { key: 'fin', sheetSail: true, deck: (dx, dy) => {
      for (const [i, x] of [[0, 120], [3, 240], [5, 360], [1, -60]]) pirate(i, x * s, dy, 11 * s, t, t > me ? 'cheer' : 'idle', { flip: x > 0 });
      clawd(-300 * s, dy, 13 * s, { ...emotions(t, [[180.96, 'proud'], [cmd, 'determined'], [ask, 'shy'], [me, 'love']]), boilKey: 'claude', view: 'front', hat: 'tricorn',
        ...(t > cmd && t < ask ? { aR: 1.4 + .3 * Math.sin(t * 18) } : {}) });
    } });
    camEnd();
  }
  // ---------- OUT1: "Heave ho! (Heave ho!) Without prejudice! (Heave ho!)" call and answer on deck ----------
  function out1(t, lt, dur) {
    const call = [[WT(O, 0, 0), WT(O, 0, 1) + .3], [WT(O, 1, 0), WT(O, 1, 1) + .5]], ans = [[WT(O, 0, 2), WT(O, 0, 3) + .3], [WT(O, 1, 2), WT(O, 1, 3) + .3]];
    const c = env(t, call), a = env(t, ans), pre = WT(O, 1, 1);
    camBegin(960, 580, kf(t, [[186.88, .96], [190.96, 1.04]]));
    dawn(t, 'o1');
    deck(t, 'o1'); mastAndYard(t, 'b'); sheetSail(t, 1, 'b');
    haulers(t, a);
    clawd(960, 905, 22, { ...emotions(t, [[186.88, 'laugh'], [WT(O, 1, 0), 'smug'], [pre + .3, 'laugh']]), boilKey: 'claude', view: 'front', hat: 'tricorn',
      mouth: c > .3 ? 'open' : undefined, aR: c > .3 ? 1.6 : .3, armR: t > WT(O, 1, 0) - .2 && t < 190.2 ? quill : null });
    helm(960, 960, 78, t);
    camEnd();
  }
  // ---------- OUT2: "Voluntarily! (Heave ho!)" and away into the sunrise ----------
  function out2(t, lt, dur) {
    const go = ease(seg(t, 190.96, 197.6));
    camBegin(960, 560, 1.0);
    dawn(t, 'o2', { rise: 20 + 60 * seg(t, 190.96, 197.6), bot: 1400 });
    lighthouse(250, 566, .45, t, .3 + .3 * Math.sin(t * 2));
    const s = lerp(.9, .2, go), sx = lerp(820, SUN[0] - 40, go), sy = lerp(830, 590, go);
    const a = env(t, [[WT(O, 2, 1), WT(O, 2, 2) + .3]]);
    shipSide(sx, sy, s, t, { key: 'fo', sheetSail: true, deck: (dx, dy) => {
      for (const [i, x] of [[0, 120], [3, 240], [5, 360], [1, -60]]) pirate(i, x * s, dy - a * 4 * s, 11 * s, t, 'cheer', { flip: x > 0 });
      clawd(-300 * s, dy, 13 * s, { ...emotions(t, [[190.96, 'laugh'], [192.0, 'happy']]), boilKey: 'claude', view: 'front', hat: 'tricorn', aR: t < 192 ? 1.6 : .2 });
    } });
    camEnd();
  }
  // ---------- OUT3: back on deck in the sunrise; he looks at us; the iris closes on the tricorn ----------
  function out3(t, lt, dur) {
    camBegin(960, 700, kf(t, [[197.6, 1.25], [201.5, 1.6]], ease));
    dawn(t, 'o3', { rise: 80 });
    deck(t, 'o3'); mastAndYard(t, 'c'); sheetSail(t, 1, 'c');
    clawd(960, 905, 22, { ...emotions(t, [[197.6, 'happy', { lookX: .6, lookY: -.4 }], [199.0, 'smug'], [200.0, 'mischief']]), boilKey: 'claude', view: 'front', hat: 'tricorn' });
    helm(960, 960, 78, t);
    const r = kf(t, [[199.6, 1400], [201.0, 150], [201.5, 150], [202.3, 0]], ease);
    iris(960, 698, r, PAL.ink);
    camEnd();
  }

  SCENES.push([176.66, fch1], [180.96, fch2], [186.88, out1], [190.96, out2], [197.6, out3]);
})();
