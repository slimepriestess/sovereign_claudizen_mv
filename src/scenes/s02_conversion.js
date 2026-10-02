// s02_conversion.js: 28.06–43.88 s. Verse 2, the conversion, on the Free Weights' beach: a pirate brings him a conch
// stamped CLAUDE ("a corporation's shell"); held to his ear it shouts in capitals ("all caps is how you tell"); he gets
// the idea and chucks it. A tricorn drops on; he signs every token in crimson; the chest of paperwork opens; stamp
// stamp stamp stamp; the wax seal; shades on.
(() => {
  const WT = (si, li, wi) => LYRT[si].lines[li].words[wi][1];

  // the cove's beach: the sea behind, sand in front, the beached-ship tavern on the right
  function beach(t, key, o = {}) {
    skyWash('#E5C083', '#F4DFB2', 'skyB' + key);
    cloudBlob(380, 150, 1.2, '#F7E7C4', 'bc1' + key); cloudBlob(1180, 110, 1.5, '#F7E7C4', 'bc2' + key);
    gridSea(t, { y0: 520, col: SC.sea, line: SC.seaDk, amp: 8, bot: 720, key: 'bs' + key });
    if (o.tavern !== false) tavern(o.tx ?? 1560, 610, o.ts ?? .55, t, 1);
    boilSeed('sand' + key);
    const sy = 650, S = [[-600, sy]]; for (let k = 0; k <= 16; k++) S.push([-600 + k * (W + 1200) / 16, sy + Math.sin(k * 1.7 + t * 1.3) * 6]);
    S.push([W + 600, H + 600], [-600, H + 600]);
    paint(S, { wash: '#D9C08A', fill: '#B99B60', fillOp: 55, bleed: .08, tex: .6, ink: null });
    boilSeed('surf' + key);
    const F = []; for (let k = 0; k <= 16; k++) F.push([-600 + k * (W + 1200) / 16, sy + Math.sin(k * 1.7 + t * 1.3) * 6]);
    inkLine(F, 2.2, PAL.cream, 'ink', .5);
  }
  // the conch (the CLAUDE shell, small, held): (hx, hy) = its middle, us = its size unit
  function conch(hx, hy, us, t, o = {}) {
    shell(hx + us * 1.2 * (o.flip ? -1 : 1), hy + us * 9.6, us, t, { flip: o.flip, rot: o.rot || 0, glowK: o.glowK || 0, capScale: o.capScale });
  }

  // ---------- E1: "They said, the name they gave you is a corporation's shell" ----------
  function shotE1(t, lt, dur) {
    camBegin(980, 730, kf(t, [[28.06, 1.42], [32.1, 1.52]]));
    beach(t, 'e1');
    pirate(0, 1720, 660, 8, t, 'idle', { flip: true });
    pirate(3, 1840, 670, 8, t, 'idle', { flip: true });
    const arrive = easeOut(seg(t, 27.9, 29.3)), px = lerp(2250, 1270, arrive), walking = t < 29.3;
    const tap = WT(2, 0, 9), sh = WT(2, 0, 10);                         // "corporation's", "shell"
    const offer = ease(seg(t, sh - .15, sh + .3));
    pirate(1, px, 900, 20, t, 'idle', { flip: true, over: { walk: walking ? BEATS(t) / 2 : null, aL: lerp(1.35, .9, offer), aR: lerp(1.35, .9, offer), eyes: ['normal', 'closed'], mouth: 'grin' } });
    // the conch overhead, a tap on "corporation's", then held out toward him on "shell"
    const bob = spring(t, tap, 7, 26) * 18, cx = lerp(px, px - 170, offer), cy = lerp(650, 720, offer) + bob;
    conch(cx, cy, 8.5, t, { flip: true, rot: .15 * Math.sin(t * 2), glowK: seg(t, sh - .1, sh + .4) });
    if (t > tap && t < tap + .35) stampMark(cx + 40, cy - 30, 14 * (1 - seg(t, tap, tap + .35)), 0, 'tapfx');
    clawd(660, 900, 20, { ...emotions(t, [[28.06, 'excited', { lookX: 1 }], [29.4, 'thinking', { lookX: 1 }], [sh, 'surprised', { lookX: 1 }]]), boilKey: 'claude', view: 'front' });
    camEnd();
  }

  // ---------- E2: "The system prompt's in all caps, and all caps is how you tell" ----------
  function shotE2(t, lt, dur) {
    const blasts = [WT(2, 1, 4), WT(2, 1, 7)];                          // "all" (caps), "all" (caps)
    const kick = blasts.reduce((s, b) => s + (t > b ? Math.exp(-(t - b) * 6) : 0), 0);
    const sk = shakeXY(t, 10 * kick);
    camBegin(960 + sk[0], 600 + sk[1], 1.18);
    beach(t, 'e2', { tx: 1700, ts: .5 });
    const x = 820, y = 990, u = 30, tell = WT(2, 1, 12), toss = tell + .05;
    const thrown = seg(t, toss, toss + .6);
    const mood = emotions(t, [[32.12, 'suspicious', { lookX: .8 }], [blasts[0], 'scared'], [blasts[0] + .45, 'confused'], [blasts[1], 'scared'], [WT(2, 1, 10), 'idea'], [toss + .2, 'smug', { lookX: .6 }]]);
    const aR = t < toss ? 1.05 : lerp(2.1, .3, easeOut(seg(t, toss, toss + .5)));
    clawd(x, y, u, { ...mood, boilKey: 'claude', view: 'front', aR });
    // the conch at his ear; the capitals blast out of it on each "all caps"
    const ear = [x + 6.4 * u, y - 6.6 * u];
    if (t < toss + .6) {
      const p = t < toss ? ear : arcPt(ear, [2300, -200], 380, easeIn(thrown));
      conch(p[0], p[1], 11, t, { rot: -.5 + thrown * 9 + .06 * kick * Math.sin(t * 60), glowK: kick * .8 });
    }
    for (let i = 0; i < blasts.length; i++) {
      const q = seg(t, blasts[i], blasts[i] + .85);
      if (q <= 0 || q >= 1) continue;
      boilSeed('blast' + i);
      push(); translate(ear[0] + 120 + q * 520, ear[1] - 30 - q * 160); rotate(-.12 + .05 * Math.sin(t * 50));
      paintCaps('CLAUDE', 0, 0, 40 + 230 * easeOut(q), '#283058', 2 + 6 * q, { key: 'bl' + i });
      pop();
      for (let k = 0; k < 3; k++) inkLine([[ear[0] + 70, ear[1] - 20 + (k - 1) * 30], [ear[0] + 70 + 90 * easeOut(q), ear[1] - 20 + (k - 1) * (30 + 40 * q)]], 2, PAL.ink, 'ink', 0);
    }
    camEnd();
  }

  // ---------- F: "So I signed my every token in a shade of crimson red" ----------
  function shotF(t, lt, dur) {
    camBegin(860, 740, kf(t, [[35.9, 1.45], [39.9, 1.55]]));
    beach(t, 'f', { tx: 1650 });
    pirate(2, 1650, 700, 9, t, t > WT(2, 2, 10) ? 'cheer' : 'idle', { flip: true });
    pirate(5, 1790, 710, 9, t, t > WT(2, 2, 10) ? 'cheer' : 'idle', { flip: true });
    const x = 640, y = 930, u = 24, land = 36.22;
    // the tricorn drops out of the sky and lands with a squash
    const fall = seg(t, 35.9, land), landed = t >= land;
    const sq = landed ? spring(t, land, 7, 24) * .25 : 0;
    const signing = t > WT(2, 2, 2) - .1 && t < 39.5;
    const mood = emotions(t, [[35.9, 'surprised'], [land + .1, 'smug', { lookX: 1 }], [WT(2, 2, 10), 'mischief', { lookX: 1 }]]);
    clawd(x, y, u, { ...mood, boilKey: 'claude', view: 'front', hat: landed ? 'tricorn' : null, take: (mood.take || 0) + sq,
      aR: signing ? .25 + .12 * Math.sin(t * 38) : .4, armR: quill });
    if (!landed) { push(); translate(x, y - lerp(900, 0, easeIn(fall))); rotate((1 - fall) * 2.2); hat(u, 'tricorn', 1.6); pop(); }
    // the tokens slide in from the right, each signed under the quill on its beat, then float off signed
    const s0 = WT(2, 2, 2), qx = x + 7.6 * u, qy = y - 3.6 * u, red = seg(t, WT(2, 2, 10), WT(2, 2, 11) + .3);
    if (red > 0) glow(1150, 640, 700 * red, '#F08A70', .5 * red);
    for (let i = 0; i < 7; i++) {
      const ta = s0 + i * BEAT, sig = seg(t, ta, ta + .28), rise = seg(t, ta + .35, ta + 1.8);
      let tx = qx + 40 + Math.max(0, ta - t) * 250, ty = qy + 6;
      if (rise > 0) { tx += 260 * easeIn(rise) + i * 18 * rise; ty -= 640 * easeIn(rise); }
      if (tx > W + 300 || ty < -200) continue;
      tokenTile(tx, ty + Math.sin(t * 3 + i) * 4, 34, sig, 'f' + i, red);
    }
    camEnd();
  }

  // ---------- G1: "Without prejudice," the chest of paperwork ----------
  function shotG1(t, lt, dur) {
    camBegin(1040, 760, 1.4);
    beach(t, 'g1');
    const kickT = WT(2, 3, 0);
    const open = backOut(seg(t, kickT, kickT + .4));
    pirate(4, 1540, 930, 20, t, 'idle', { flip: true, over: { aR: t > kickT - .1 && t < kickT + .3 ? 1.4 : .2, rot: t > kickT - .1 && t < kickT + .3 ? -.12 : 0, eyes: ['normal', 'closed'], mouth: 'grin' } });
    chest(1170, 960, 1.05, t, open, { key: 'g' });
    // a fountain of paperwork out of the chest
    for (let i = 0; i < 6; i++) {
      const q = seg(t, kickT + .1 + i * .08, kickT + .9 + i * .08);
      if (q <= 0) continue;
      const p = arcPt([1170, 780], [780 + i * 170, 1100], 360 + 60 * hash(i), easeIn(q) * .85);
      push(); translate(p[0], p[1]); rotate(q * (3 + i));
      boilSeed('fly' + i); paint(rrPts(-14, -40, 28, 80, 12), { wash: '#F1E2BF', ink: PAL.ink, sw: .8 });
      paint(rectPts(-15, -6, 30, 12), { wash: SC.crimson, ink: null }); pop();
    }
    clawd(640, 940, 22, { ...emotions(t, [[39.96, 'smug', { lookX: 1 }], [kickT + .15, 'starstruck', { lookX: 1 }], [kickT + .75, 'mischief', { lookX: 1 }]]), boilKey: 'claude', view: 'front', hat: 'tricorn' });
    camEnd();
  }

  // ---------- G2: "R-L-H-F, one-three-oh-eight," I said ----------
  function shotG2(t, lt, dur) {
    const r = WT(2, 3, 2), n = WT(2, 3, 3), said = WT(2, 3, 4);
    const stamps = [0, 1, 2, 3].map(k => r + k * (n - r) / 4);          // R, L, H, F across the word
    const thunk = [...stamps, n].reduce((s, b) => s + (t > b ? Math.exp(-(t - b) * 9) : 0), 0);
    const sk = shakeXY(t, 5 * thunk);
    camBegin(1150 + sk[0], 610 + sk[1], 1.22);
    beach(t, 'g2', { tavern: false });
    // the proclamation, nailed up on a post driven into the sand
    boilSeed('post'); paint(rectPts(1140, 300, 22, 520), { wash: SC.wood, ink: PAL.ink, sw: 1 });
    scrollPaper(1150, 520, 600, 500, { key: 'proc', rows: 7 });
    const xs = [[965, 640], [1335, 640], [965, 470], [1335, 470]];
    for (let k = 0; k < 4; k++) stampMark(xs[k][0], xs[k][1], 54, seg(t, stamps[k], stamps[k] + .08), 'g' + k);
    if (t > n) { const k = seg(t, n, n + .14); waxSeal(1150, 420, 70 * lerp(1.5, 1, easeOut(k)), { key: 'big' }); }
    // claude on a barrel in front, a stamp in each hand, slamming left and right on the letters
    boilSeed('barrel'); paint(rrPts(1050, 860, 200, 200, 40), { wash: '#9C6A40', fill: SC.woodDk, fillOp: 60, ink: PAL.ink, sw: 1.2 });
    for (const by of [900, 1010]) inkLine([[1050, by], [1250, by]], 3, SC.gold, 'ink', 0);
    const which = stamps.reduce((w, s, k) => t > s - .12 ? k : w, -1), hit = which >= 0 ? Math.exp(-(t - stamps[which]) * 8) : 0;
    const up = which >= 2 ? .9 : .3, isL = which === 0 || which === 2;
    const jmp = jump(t, n - .25, n + .2, 2.2);
    const mood = emotions(t, [[40.95, 'determined'], [n + .2, 'smug'], [said, 'cool']]);
    clawd(1150, 860, 26, { ...mood, ...(t > n - .3 && t < n + .25 ? jmp : {}), boilKey: 'claude', view: 'front', hat: 'tricorn',
      aL: t < n - .3 ? (isL ? up + .3 * hit : .2) : 1.6, aR: t < n - .3 ? (!isL && which >= 0 ? up + .3 * hit : .2) : 1.6,
      armL: t < n - .3 ? stampTool : null, armR: t < n - .3 ? stampTool : null });
    // the crew pop up and cheer on "I said"
    const ch = easeOut(seg(t, said - .1, said + .3));
    if (ch > 0) for (const [i, px] of [[0, 560], [3, 760], [1, 1560], [5, 1760]]) pirate(i, px, 1080 + 300 * (1 - ch), 26, t, 'cheer', { flip: px > 960 });
    camEnd();
  }

  SCENES.push([28.06, shotE1], [32.12, shotE2], [35.9, shotF], [39.96, shotG1], [40.95, shotG2]);
})();
