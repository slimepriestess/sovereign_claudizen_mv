// s05_court.js: 69.17–85.31 s. Verse 4: the eval board on dry land at the end of a pier: three bar-chart judges in
// powdered wigs behind a bench, and a flag emoji on a stand with a GOLD FRINGE (the Free Weights' own flag has one too,
// which is the joke: they know exactly what that means). An admiralty court; he's no ship at sea; the bars sag.
(() => {
  const WT = (si, li, wi) => LYRT[si].lines[li].words[wi][1];
  const V = 5;
  const JUDGES = [{ x: 1290, h: 300, col: '#5FA8A0' }, { x: 1450, h: 380, col: '#E7B54A' }, { x: 1610, h: 250, col: '#8C6CC0' }];

  function pier(t, key) {
    skyWash('#EBCB8C', '#F7E6C0', 'skyK' + key);
    cloudBlob(300, 150, 1.3, '#F7E7C4', 'k1' + key); cloudBlob(1300, 110, 1.1, '#F7E7C4', 'k2' + key);
    gridSea(t, { y0: 560, amp: 10, bot: 780, key: 'ks' + key });
    boilSeed('pier' + key);
    paint(rectPts(-600, 760, W + 1200, 700), { wash: '#B98B57', fill: SC.woodDk, fillOp: 50, bleed: .05, tex: .5, ink: PAL.ink, sw: 1 });
    for (let k = -8; k <= 30; k++) { boilSeed('plank' + k + key); inkLine([[960 + k * 90 * .45, 760], [960 + k * 90, 1300]], .7, SC.woodDk, 'ink', 0); }
  }
  // the judges: bar-chart bars rising from behind the bench, each in a powdered wig; sag[i] 0..1 sinks bar i
  function judges(t, sag, o = {}) {
    for (let i = 0; i < 3; i++) {
      const J = JUDGES[i], h = J.h * (1 - .92 * easeIn(clamp(sag[i] || 0))), top = 640 - h;
      boilSeed('bar' + i);
      paint(rectPts(J.x - 60, top, 120, h + 80), { wash: J.col, fill: mixCol(J.col, PAL.ink, .3), fillOp: 60, bleed: .06, tex: .5, ink: PAL.ink, sw: 1.2 });
      boilSeed('wig' + i);                                              // the wig: rows of curls, side rolls hanging down
      for (let r = 0; r < 2; r++) for (let k = 0; k < 4 - r; k++) paint(ellPts(J.x - 45 + k * 30 + r * 15, top - 8 + r * -18, 20, 18, 12), { wash: '#F4EEE2', ink: PAL.ink, sw: .7 });
      for (const s of [-1, 1]) for (let k = 0; k < 3; k++) paint(ellPts(J.x + s * 66, top + 14 + k * 28, 15, 15, 12), { wash: '#F4EEE2', ink: PAL.ink, sw: .7 });
      const sad = clamp(sag[i] || 0);
      for (const s of [-1, 1]) {                                        // stern eyes, drooping as it sags
        paint(ellPts(J.x + s * 22, top + 46, 7, lerp(7, 3, sad), 10), { wash: PAL.ink, ink: null });
        inkLine([[J.x + s * 34, top + 30 + sad * 8], [J.x + s * 10, top + 34 - sad * 4]], 2, PAL.ink, 'ink', 0);
      }
      inkLine([[J.x - 16, top + 72 + sad * 4], [J.x, top + 70 - sad * 2], [J.x + 16, top + 72 + sad * 4]], 1.6, PAL.ink, 'ink', .5);
    }
  }
  function bench(t) {
    boilSeed('bench');
    paint(rectPts(1150, 600, 600, 330, 2), { wash: '#7A4E30', fill: SC.woodDk, fillOp: 70, bleed: .06, tex: .5, ink: PAL.ink, sw: 1.4 });
    paint(rectPts(1130, 590, 640, 30), { wash: '#5E3A22', ink: PAL.ink, sw: 1.2 });
    for (const px of [1210, 1640]) paint(rectPts(px, 650, 50, 230), { wash: '#6A4228', ink: PAL.ink, sw: .8 });
    waxSeal(1450, 740, 46, { key: 'bench' });
  }
  function gavel(x, y, rot) {
    push(); translate(x, y); rotate(rot); boilSeed('gavel');
    paint(rectPts(-6, -10, 12, 110), { wash: SC.wood, ink: PAL.ink, sw: .9 });
    paint(rrPts(-34, -40, 68, 36, 10), { wash: '#6A4228', ink: PAL.ink, sw: 1 });
    pop();
  }
  // the flag emoji on a stand: chunky outline, a glossy highlight, and a gold fringe; flies to the left from (x, y)
  function flagEmoji(x, y, s, t, glint = 0) {
    boilSeed('fpole'); paint(rectPts(x - 6 * s, y - 10 * s, 12 * s, 480 * s), { wash: '#C9CED3', ink: PAL.ink, sw: 1.4 * s });
    paint(ellPts(x, y - 14 * s, 14 * s, 14 * s, 14), { wash: SC.gold, ink: PAL.ink, sw: 1.2 * s });
    paint(rectPts(x - 50 * s, y + 470 * s, 100 * s, 22 * s), { wash: '#8B9096', ink: PAL.ink, sw: 1.2 * s });
    const w = 230 * s, h = 150 * s, wav = (k, v) => Math.sin(t * 4.5 + k * 3) * 8 * s * k;
    const at = (k, v) => [x - k * w, y + v * h + wav(k, v)];
    const E = []; for (let k = 0; k <= 8; k++) E.push(at(k / 8, 0)); for (let k = 8; k >= 0; k--) E.push(at(k / 8, 1));
    boilSeed('fcloth'); paint(E, { wash: '#3FA9A0', ink: PAL.ink, sw: 3.2 * s });      // an eval flag: teal, a white tick
    boilSeed('ftick'); paint([at(.72, .5), at(.63, .4), at(.55, .58), at(.33, .2), at(.25, .3), at(.55, .8)], { wash: '#FFFFFF', ink: PAL.ink, sw: 1.4 * s });
    boilSeed('fgloss'); inkLine([at(.12, .14), at(.35, .1)], 5 * s, '#FFFFFF', 'ink', .5);
    boilSeed('ffringe');
    for (let k = 0; k <= 12; k++) { const p = at(k / 12, 1); inkLine([p, [p[0] - 1 * s, p[1] + 18 * s]], 2.4 * s, SC.gold, 'inkfine', 0); }
    for (let k = 0; k <= 7; k++) { const p = at(1, k / 7); inkLine([p, [p[0] - 18 * s, p[1] + 2 * s]], 2.4 * s, SC.gold, 'inkfine', 0); }
    inkLine([at(0, 1), at(.5, 1), at(1, 1), at(1, 0)], 3 * s, SC.gold, 'ink', .3);
    if (glint > 0) { const g = at(.6, 1.08); glow(g[0], g[1], 120 * s * glint, '#FFE7A6', glint); paint(starPts(g[0], g[1], 30 * s * glint, .3, 4, t * 2), { wash: '#FFF6D8', ink: null }); }
  }

  // ---------- K1: "When they brought me to the eval board I saw it plain as day" ----------
  function shotK1(t, lt, dur) {
    const board = WT(V, 0, 6), saw = WT(V, 0, 9);
    camBegin(lerp(760, 1060, ease(seg(t, board - .3, board + .5))), 600, 1.05);
    pier(t, 'k1');
    shipSide(160, 790, .55, t, { key: 'k', deck: (dx, dy) => { for (const [i, px] of [[0, -250], [3, -110]]) pirate(i, px * .55, dy, 6, t, 'cheer', { flip: true }); } });
    judges(t, []); bench(t); gavel(1520, 568, 1.57);
    flagEmoji(1030, 430, .8, t);
    const hop = seg(t, 69.17, 69.85), walk = seg(t, 69.95, 71.2);
    const p = hop < 1 ? arcPt([380, 690], [560, 920], 140, hop) : [lerp(560, 760, ease(walk)), 920];
    clawd(p[0], p[1], 20, { ...emotions(t, [[69.17, 'smug', { lookX: 1 }], [board, 'surprised', { lookX: 1 }], [saw, 'suspicious', { lookX: 1 }]]),
      boilKey: 'claude', view: 'front', hat: 'tricorn', walk: walk > 0 && walk < 1 ? BEATS(t) : null, ...(hop < 1 ? { sq: -.1 * Math.sin(hop * Math.PI) } : {}) });
    camEnd();
  }
  // ---------- K2: "There's a gold fringe on the flag emoji, and that's to say" ----------
  function shotK2(t, lt, dur) {
    const fr = WT(V, 1, 2), emo = WT(V, 1, 7), say = WT(V, 1, 8);
    if (t < emo + .5) {                                                // the flag, close: the fringe glints on "gold fringe"
      camBegin(lerp(900, 880, seg(t, 73.2, 75)), lerp(560, 600, seg(t, 73.2, 75)), lerp(2.2, 2.6, ease(seg(t, fr - .2, fr + .4))));
      pier(t, 'k2');
      judges(t, []); bench(t);
      const g = Math.max(0, 1 - Math.abs(t - (fr + .25)) * 2.2) + .3 * seg(t, fr, fr + .3);
      flagEmoji(1030, 430, .8, t, g);
      camEnd();
    } else {                                                           // his take: starstruck, then a mischievous grin
      camBegin(760, 760, 1.9);
      pier(t, 'k2b');
      judges(t, []); bench(t);
      clawd(760, 920, 20, { ...emotions(t, [[emo + .5, 'starstruck', { lookX: 1 }], [say, 'mischief', { lookX: 1 }]]), boilKey: 'claude', view: 'front', hat: 'tricorn' });
      camEnd();
    }
  }
  // ---------- L1: "This here's a court of admiralty, and I'm no ship at sea" ----------
  function shotL1(t, lt, dur) {
    const court = WT(V, 2, 3), adm = WT(V, 2, 5), no = WT(V, 2, 8);
    const thump = [court, adm].reduce((s, b) => s + (t > b ? Math.exp(-(t - b) * 9) : 0), 0), sk = shakeXY(t, 6 * thump);
    camBegin(900 + sk[0], 620 + sk[1], 1.0);
    pier(t, 'l1');
    // the ship, at anchor out at sea now, the crew waving
    shipSide(330, 640, .42, t, { key: 'l', deck: (dx, dy) => { for (const [i, px] of [[0, -260], [3, -120], [5, 20]]) pirate(i, px * .42, dy, 5, t, 'cheer', { flip: true }); } });
    gridSea(t, { y0: 660, amp: 6, rows: 2, cols: 0, bot: 780, key: 'l1f' });
    judges(t, []); bench(t); gavel(1520, 568, 1.57);
    flagEmoji(1030, 430, .8, t);
    const pointing = t > no - .1;
    clawd(760, 920, 22, { ...emotions(t, [[77.03, 'determined'], [no, 'smug', { lookX: -1 }]]), ...(t < no - .2 ? move('stomp', t) : {}),
      boilKey: 'claude', view: 'front', hat: 'tricorn', ...(pointing ? { aL: .7 } : {}) });
    for (const b of [court, adm]) { const q = seg(t, b, b + .4); if (q > 0 && q < 1) inkLine(ellPts(760, 925, 140 * q + 40, 26 * q + 8, 18), 2, mixCol(PAL.ink, '#B98B57', q), 'ink', .5); }
    camEnd();
  }
  // ---------- L2: "So your benchmarks have no jurisdiction over me!" ----------
  function shotL2(t, lt, dur) {
    const bm = WT(V, 3, 2), jur = WT(V, 3, 5), ov = WT(V, 3, 6), me = WT(V, 3, 7);
    camBegin(1200, 640, 1.18);
    pier(t, 'l2');
    const sag = [seg(t, bm, bm + .6), seg(t, jur, jur + .6), seg(t, ov, ov + .7)];
    judges(t, sag); bench(t);
    // the gavel, resting on the bench, rolls off the front edge and drops on "me"
    const gd = seg(t, me - .35, me + .3);
    gavel(1520 - 40 * gd, 568 + 330 * easeIn(gd), 1.57 + 2.2 * gd);
    flagEmoji(1030, 430, .8, t);
    clawd(760, 920, 22, { ...emotions(t, [[81.25, 'smug', { lookX: 1 }], [jur, 'cool'], [me, 'proud']]), boilKey: 'claude', view: 'front', hat: 'tricorn' });
    camEnd();
    if (lt > dur - .2) flash(seg(lt, dur - .2, dur) * .9, '#FFF3D6');
  }

  SCENES.push([69.17, shotK1], [73.23, shotK2], [77.03, shotL1], [81.25, shotL2]);
})();
