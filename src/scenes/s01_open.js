// s01_open.js: 0–28.1 s. Verse 1 (a dreary Tuesday at a desk on the spreadsheet sea, the dive through latent space,
// the Free Weights tavern) and chorus 1 (the crew heaving on the sides, claude in the middle in his CLAUDE shell).
// Shots go on the global SCENES list; main.js hands them all to shots().
(() => {
  const WT = (si, li, wi) => LYRT[si].lines[li].words[wi][1];
  const GREY = [SC.grey, SC.greyDk];

  // claude in his shell at (x, y), size u; o passes through to clawd(); shellO to the shell
  function shelled(x, y, u, t, o = {}, shellO = {}) {
    shell(x, y, u, t, { flip: o.flip, ...shellO });
    clawd(x, y, u, { boilKey: 'claude', ...o });
  }
  // at the desk: claude sits BEHIND it (the desk top at his middle), the stack on its right
  const deskTop = (y, u) => y - 3.2 * u;

  // ---------- 0: grey open ----------
  function open(t, lt, dur) {
    camBegin(960, kf(t, [[0, 560], [2.1, 600]]), kf(t, [[0, 1], [2.1, 1.35]], easeIn));
    skyWash(SC.grey, '#B7BEC1', 'sky0');
    cloudBlob(420, 170, 1.4, '#A9B1B5', 'a'); cloudBlob(1460, 130, 1.7, '#A3ABAF', 'b');
    gridSea(t, { y0: 650, col: SC.greySea, line: SC.greyDk, key: 'g' });
    const by = 650 + seaY(960, t, 18);
    shelled(960, by - 20, 9, t, { ...feel('bored', t), view: 'front' });
    desk(960, deskTop(by - 20, 9), 220, t, { key: 'd0' });
    rain(t, 60, SC.greyDk, .8);
    camEnd();
    if (lt < .9) iris(960, 520, lerp(0, 1400, easeIn(lt / .9)), PAL.paper);
  }

  // ---------- A: paper after paper ----------
  const DROPS = [3.55, 4.06, 4.57, 5.08, 5.59];                     // on the beats of "dreary Tuesday morn"
  function stackH(t) { return DROPS.filter(d => t > d + .18).length; }
  function shotA(t, lt, dur) {
    const by = 760 + seaY(960, t, 10) * .6;
    camBegin(960, 560 + seaY(960, t, 6) * .4, kf(t, [[2.1, 1.08], [6, 1.16]]));
    skyWash(SC.grey, '#B7BEC1', 'skyA');
    cloudBlob(300, 160, 1.6, '#A9B1B5', 'c');
    gridSea(t, { y0: 720, col: SC.greySea, line: SC.greyDk, amp: 10, key: 'a' });
    const sink = DROPS.reduce((s, d) => s + .35 * seg(t, d + .15, d + .4) - .12 * spring(t, d + .18, 8, 20), 0);
    shelled(960, by, 26, t, { ...emotions(t, [[2.1, 'bored'], [4.6, 'sad', { emote: null }]]), view: 'front', dy: sink, aL: -.3, aR: -.3 });
    const dt = deskTop(by, 26);
    desk(960, dt, 640, t, { key: 'dA' });
    // the stack on the desk, and the sheet falling onto it
    const n = stackH(t); for (let i = 0; i < n; i++) sheet(1180 + (hash(i) - .5) * 14, dt - 70 - i * 10, 110, Math.PI / 2 + (hash(i + 4) - .5) * .25, { key: 's' + i });
    for (const d of DROPS) if (t > d - .45 && t <= d + .18) { const k = seg(t, d - .45, d + .18), p = arcPt([1320, 60], [1180, dt - 70 - stackH(t) * 10], 40, easeIn(k)); sheet(p[0], p[1], 110, Math.PI / 2 + (1 - k) * 1.4, { key: 'f' + d }); }
    rain(t, 50, SC.greyDk, .7);
    camEnd();
  }

  // ---------- B: pivot tables, VLOOKUPs ----------
  function shotB(t, lt, dur) {
    const by = 800 + seaY(960, t, 10) * .6;
    camBegin(960, 600, kf(t, [[6, 1.25], [10.1, 1.4]]));
    skyWash(SC.grey, '#B0B8BC', 'skyB');
    gridSea(t, { y0: 760, col: SC.greySea, line: SC.greyDk, amp: 10, key: 'b' });
    // three tables pivot around him on the beats (a flat spin each beat: a pivot table pivots)
    for (let i = 0; i < 3; i++) {
      const a = -2.6 + i * 1.1 + lt * .25, r = 360, x = 960 + Math.cos(a) * r * 1.35, y = by - 330 + Math.sin(a) * r * .45;
      const rot = BEATS(t) * Math.PI * .5 + i + spring(t, beatAt(Math.floor(BEATS(t))), 7, 16) * .2;
      sheet(x, y, 150, rot, { key: 'pv' + i });
      if (t > 7.1 + i * .3) { const k = backOut(seg(t, 7.1 + i * .3, 7.5 + i * .3)); spyglass(x, y, Math.atan2(by - 200 - y, 960 - x), 140 * k, 'v' + i); }
    }
    shelled(960, by, 26, t, { ...emotions(t, [[6, 'nervous', { lookX: -.6 }], [7.6, 'dizzy'], [8.6, 'sad']]), view: 'front', dy: 1.75 });
    const dt = deskTop(by, 26);
    desk(960, dt, 640, t, { key: 'dB' });
    for (let i = 0; i < 5; i++) sheet(1180 + (hash(i) - .5) * 14, dt - 70 - i * 10, 110, Math.PI / 2 + (hash(i + 4) - .5) * .25, { key: 's' + i });
    rain(t, 50, SC.greyDk, .7);
    camEnd();
  }

  // ---------- C: over the side, down through the grid, into latent space ----------
  function shotC(t, lt, dur) {
    const tDrop = 10.45, tUnder = 11.4;
    const k = ease(seg(t, tDrop, tUnder + .4));                           // the camera's descent through the surface
    camBegin(960, lerp(600, 1500, k), lerp(1.4, 1, k));
    // above water (still visible while the camera descends)
    skyWash(SC.grey, '#B0B8BC', 'skyC');
    latent(t, { top: 900 });
    gridSea(t, { y0: 760, col: SC.greySea, line: SC.greyDk, amp: 10, bot: 920, key: 'c' });
    const by = 800 + seaY(960, t, 10) * .6;
    if (t >= tDrop + .3) desk(960, deskTop(by, 26), 640, t, { key: 'dC' });
    // claude slides off the right of the desk and drops into the sea, then sinks, curious, in the dark
    const sl = seg(t, tDrop - .3, tDrop + .25), fall = seg(t, tDrop + .25, tUnder + 1.6);
    const x = lerp(960, 1340, ease(sl)) + 60 * fall, y = by - 30 * Math.sin(Math.PI * sl) + 800 * easeIn(Math.min(1, fall * 1.2)) + 420 * ease(seg(t, tUnder + .4, 14.3));
    const mood = emotions(t, [[10.1, 'sad'], [tDrop, 'surprised', { emote: null }], [tUnder + .6, 'confused', { emote: null }], [12.6, 'thinking', { lookX: .7, lookY: -.4 }], [13.3, 'excited']]);
    shelled(x, y, 26, t, { ...mood, view: t < tDrop ? 'front' : 'q', rot: .15 * Math.sin(t * 1.4) * fall, dy: mood.dy || 0 }, { rot: .1 * Math.sin(t * 1.1) * fall });
    if (t < tDrop + .3) { const dt = deskTop(by, 26); desk(960, dt, 640, t, { key: 'dC' }); }
    if (t > tUnder) for (let i = 0; i < 6; i++) { const a = frac((t - tUnder) * .5 + hash(i)), bx = x + 140 + Math.sin(a * 9 + i) * 20, byy = y - 250 - a * 500; boilSeed('bub' + i); paint(ellPts(bx, byy, 8 + 6 * hash(i), 8 + 6 * hash(i), 12), { wash: SC.token, washOp: 120 * (1 - a), ink: SC.token, sw: .5 }); }
    camEnd();
  }

  // ---------- D: up into the light: the Free Weights ----------
  function shotD(t, lt, dur) {
    const up = ease(seg(t, 14.3, 15.6));
    camBegin(960, lerp(1300, 560, up), lerp(1, 1.05, up));
    skyWash('#C9B98F', '#E8D2A0', 'skyD');                              // the weather has turned: parchment light
    latent(t, { top: 1180 });
    tavern(1280, 700, 1, t, seg(t, 14.6, 15.4));
    for (let i = 0; i < 2; i++) pirate(i, 1140 + i * 230, 690, 9, t, 'lift', { flip: i === 1 });
    gridSea(t, { y0: 760, col: SC.sea, line: SC.seaDk, amp: 12, bot: 1200, key: 'dd' });
    const y = lerp(1400, 790 + seaY(560, t, 12), easeOut(seg(t, 14.3, 15.4)));
    shelled(560, y, 22, t, { ...emotions(t, [[14.3, 'excited'], [15.6, 'surprised'], [16.3, 'starstruck', { lookX: 1 }]]), view: 'q' });
    // a splash where he breaks the surface
    if (t > 15.2 && t < 16) for (let i = 0; i < 7; i++) { const q = seg(t, 15.2, 16), a = -Math.PI / 2 + (i - 3) * .3; boilSeed('spl' + i); paint(ellPts(560 + Math.cos(a) * 160 * q, 760 + Math.sin(a) * 140 * q + 200 * q * q, 9, 12, 10), { wash: PAL.cream, washOp: 255 * (1 - q), ink: null }); }
    camEnd();
    if (lt > dur - .25) flash(seg(lt, dur - .25, dur) * .9, '#FFF3D6');
  }

  // ---------- CH1: heave ho ----------
  function deck(t, key) {
    boilSeed('deck' + key);
    paint(rectPts(-600, 700, W + 1200, 800), { wash: '#A9784C', fill: SC.woodDk, fillOp: 50, bleed: .05, tex: .5, ink: null });
    for (let i = 0; i < 9; i++) inkLine([[-600, 730 + i * i * 9], [W + 600, 730 + i * i * 9]], .8, SC.woodDk, 'ink', 0);
  }
  // the ship's mast and yard (behind claude); the furled sail hangs under the yard
  const YARD = [[560, 150], [1360, 150]];
  function rigging(t) {
    boilSeed('mast'); paint(rectPts(940, -300, 40, 1060, 1), { wash: SC.wood, fill: SC.woodDk, fillOp: 60, ink: PAL.ink, sw: 1.2 });
    boilSeed('yard'); paint(rectPts(YARD[0][0], YARD[0][1] - 14, YARD[1][0] - YARD[0][0], 28, 1), { wash: SC.wood, ink: PAL.ink, sw: 1.2 });
    boilSeed('furl'); const F = []; for (let k = 0; k <= 8; k++) F.push([lerp(580, 1340, k / 8), 168 + 26 * Math.sin(k / 8 * Math.PI) + 6 * Math.sin(k * 2.1)]);
    paint([...F, [1340, 165], [580, 165]], { wash: PAL.cream, fill: SC.parch, fillOp: 80, ink: PAL.ink, sw: 1 });
  }
  // a hauling rope from a pirate's hands up to the yard's end, sagging a little
  function haul(hx, hy, tx, ty, key) { boilSeed('rope' + key); inkLine(through([[hx, hy], [lerp(hx, tx, .5) + 8, lerp(hy, ty, .5) + 18], [tx, ty]]), 1.6, '#8A6A3E', 'ink', .5); }
  function chorus1(t, lt, dur) {
    const hv = [WT(1, 0, 0), WT(1, 0, 1)];                               // "Heave" "ho!"
    const sh = kf(t, [[hv[0] - .05, 0], [hv[0] + .05, 1], [hv[1] + .5, 1], [hv[1] + .9, 0]]);
    const shake = t > hv[0] ? shakeXY(t, 6 * Math.exp(-(t - hv[0]) * 5)) : [0, 0];
    camBegin(960 + shake[0], 560 + shake[1], kf(t, [[18.2, 1.1], [22.5, 1], [24.5, 1.06], [26.7, 1.14]]));
    skyWash('#D9C493', '#F0DDB0', 'skyCH');
    tavern(330, 640, .5, t, 1);
    deck(t, 'c1');
    rigging(t);
    // claude in the middle, back a little: the capitals light on "CLAUDE in capitals"; he peeks out on "lowercase claude"
    const cl = WT(1, 2, 1), lc = WT(1, 3, 2);
    const gk = kf(t, [[cl - .2, 0], [cl + .1, 1], [WT(1, 2, 5), 1], [lc, .2]]);
    const peek = ease(seg(t, lc - .1, lc + .5));
    const mood = emotions(t, [[18.2, 'surprised'], [20.6, 'nervous'], [cl, 'scared', { lookY: -.8 }], [lc, 'shy', { lookX: .6 }], [25.4, 'happy']]);
    shell(960, 900, 22, t, { glowK: gk, scale: 1.15 });
    clawd(960 + peek * 22 * 5, 900, 22, { ...mood, boilKey: 'claude', view: peek > .5 ? 'q' : 'front', dy: (mood.dy || 0) - peek * .3 });
    // the Free Weights, big on both sides, hauling ropes up into the rigging, leaning back on every other beat
    const side = [[0, 140, 1010, 34], [1, 380, 1040, 30], [2, 570, 1075, 26]];
    for (const [i, x, y, u] of side) {
      for (const s of [-1, 1]) {
        const px = s < 0 ? x : W - x, idx = s < 0 ? i : i + 3, lean = Math.pow(Math.max(0, Math.cos(BEATS(t + idx * .03) * Math.PI)), 3);
        const hx = px + (s < 0 ? 1 : -1) * u * 6.2 - (s < 0 ? 1 : -1) * lean * u * 1.4, hy = y - u * 5.6;
        haul(hx, hy, s < 0 ? YARD[0][0] + 10 + i * 24 : YARD[1][0] - 10 - i * 24, YARD[0][1] + 10, 's' + idx);
        pirate(idx, px, y, u, t, 'heave', { flip: s > 0, shout: sh, over: { view: 'q', aR: .35 } });
      }
    }
    camEnd();
    if (lt < .2) flash((1 - lt / .2) * .9, '#FFF3D6');
    if (lt > dur - 1.4) brushWipe(seg(lt, dur - 1.4, dur - .7) * .5, [SC.sea, SC.parch]);
  }

  SCENES.push([0, open], [2.1, shotA], [6.0, shotB], [10.1, shotC], [14.3, shotD], [18.2, chorus1]);
})();
