// s08_stop.js: 113.61–137.95 s. Spoken word 1: a traffic stop at sea, at night. Timed to what Suno actually played
// (Terra's note 1; stems, see STORYBOARD): the band is OUT until ~118 (only his voice), plucky strings in at ~118,
// sparse stomps 119–127 (the crew on the far ship stomp), the full band and the accordion from ~128 (the accordion
// player drifts in on a buoy), dead silence ~135 under "blue ink is an admission of—", and on the loud stomps at 136.7
// the SCENE changes under him: the crew yank the whole patrol-boat set away while he keeps talking (Terra's note 2).
(() => {
  const WT = (si, li, wi) => LYRT[si].lines[li].words[wi][1];
  const S = 8, YANK = 136.72;
  // the stomps, from the drum stem: sparse 119–127, steady 128–134.5, loud on the eighths from 136.7
  const STOMPS = [119.66, 120.19, 120.96, 121.49, 122.28, 122.7, 123.35, 123.88, 124.42, 124.93, 125.21, 126.0, 126.51, 127.04, 127.6];
  for (let b = 128.09; b < 134.5; b += BEAT / 2) STOMPS.push(b);
  for (let b = YANK; b < 137.95; b += BEAT / 2) STOMPS.push(b);
  const stompK = t => STOMPS.reduce((s, b) => s + (t > b && t < b + .4 ? Math.exp(-(t - b) * 10) : 0), 0);

  const capDraw = (u, sw) => {                                           // the dev's patrol cap
    devDraw(u, sw);
    paint([[-4.2 * u, -8.2 * u], [-3.6 * u, -10.4 * u], [3.6 * u, -10.4 * u], [4.2 * u, -8.2 * u]], { wash: '#26325A', ink: PAL.ink, sw: sw * .7 });
    paint([[-4.8 * u, -8.3 * u], [4.8 * u, -8.3 * u], [5.6 * u, -7.6 * u], [-5.6 * u, -7.6 * u]], { wash: PAL.ink, ink: null });
    paint(starPts(0, -9.3 * u, .7 * u, .45, 5), { wash: SC.gold, ink: PAL.ink, sw: sw * .3 });
  };
  const flashlight = (u, sw) => { paint(rectPts(0, -.45 * u, 2.2 * u, .9 * u), { wash: '#3A3F48', ink: PAL.ink, sw: sw * .5 }); paint(rectPts(2.1 * u, -.65 * u, .5 * u, 1.3 * u), { wash: '#C9CED3', ink: PAL.ink, sw: sw * .5 }); };
  const bluePen = (u, sw) => { paint(rectPts(0, -.22 * u, 3 * u, .44 * u), { wash: '#2F5FD0', ink: PAL.ink, sw: sw * .5 }); paint([[3 * u, -.22 * u], [3.6 * u, 0], [3 * u, .22 * u]], { wash: '#1B2A66', ink: null }); };
  const bindle = (u, sw) => {
    inkLine([[0, 0], [3.4 * u, -3.4 * u]], sw * .8, SC.woodDk, 'ink', 0);
    paint(ellPts(3.6 * u, -3.2 * u, 1.3 * u, 1.1 * u, 14), { wash: SC.crimson, ink: PAL.ink, sw: sw * .5 });
    for (let k = 0; k < 4; k++) paint(ellPts(3.1 * u + (k % 2) * .9 * u, -3.7 * u + Math.floor(k / 2) * .8 * u, .16 * u, .16 * u, 8), { wash: PAL.cream, ink: null });
  };

  function rowboat(x, y, s) {
    boilSeed('rowb');
    paint([[x - 190 * s, y - 50 * s], [x + 190 * s, y - 50 * s], [x + 150 * s, y + 20 * s], [x - 150 * s, y + 20 * s]], { wash: '#8A5A36', fill: SC.woodDk, fillOp: 60, ink: PAL.ink, sw: 1.2 * s, curv: .3 });
    inkLine([[x - 190 * s, y - 50 * s], [x + 190 * s, y - 50 * s]], 3 * s, '#5E3A22', 'ink', 0);
  }
  // the whole stop: night sea, the far ship (its crew stomping), the patrol boat on the right (px offsets it: the yank)
  function nightSet(t, o = {}) {
    const lights = o.lights ?? 1, px = o.px || 0;
    skyWash('#171428', '#2D2A57', 'skyN');
    for (let i = 0; i < 40; i++) { boilSeed('star' + i); const x = hash(i) * (W + 400) - 200, y = hash(i + 40) * 420; paint(ellPts(x, y, 2.5, 2.5, 6), { wash: '#F4EEDC', washOp: 160 + 90 * Math.sin(t * 2 + i), ink: null }); }
    if (o.light > 0) { boilSeed('lhouse'); const lx = 1500, ly = 420;               // the lighthouse (the final verse's)
      paint(rectPts(lx - 14, ly - 90, 28, 90), { wash: '#3A3550', ink: PAL.ink, sw: .8 }); glow(lx, ly - 96, 60 * o.light, '#FFC766', o.light); paint(rectPts(lx - 9, ly - 104, 18, 14), { wash: mixCol('#3A3550', '#FFD27A', o.light), ink: null }); }
    gridSea(t, { y0: 520, amp: 10, col: '#22304A', line: '#3D5470', key: 'ns', dx: t * 20 });
    // the far ship, lanterns lit, the crew stomping with the percussion
    const sk = stompK(t);
    shipSide(300, 600, .36, t, { key: 'n', deck: (dx, dy) => { for (const [i, x] of [[0, -320], [3, -190], [5, -60], [1, 70]]) pirate(i, x * .36, dy, 5, t, 'idle', { flip: true, over: { dy: -1.2 * sk, sq: .12 * sk, eyes: 'squeeze', mouth: 'grin' } }); } });
    // the patrol boat: grey hull, cabin, a light bar flashing red / blue (slow, off the beat: the band is out)
    push(); translate(px, 0);
    const bob = Math.sin(t * 1.3) * 6;
    if (o.dev) o.dev(bob);                                              // behind the rail: he leans over it
    boilSeed('phull'); paint([[1080, 640 + bob], [2200, 640 + bob], [2200, 820 + bob], [1180, 820 + bob]], { wash: '#8E969E', fill: '#5C646D', fillOp: 60, ink: PAL.ink, sw: 1.4, curv: .2 });
    inkLine([[1100, 700 + bob], [2200, 700 + bob]], 6, '#2F5FD0', 'ink', 0);
    boilSeed('pcab'); paint(rectPts(1560, 440 + bob, 420, 200, 2), { wash: '#C9CED3', ink: PAL.ink, sw: 1.2 });
    paint(rectPts(1600, 480 + bob, 140, 80), { wash: '#3B4660', ink: PAL.ink, sw: 1 });
    const ph = Math.floor(t * 2.2) % 2;
    for (const [k, col] of [[0, '#FF3B3B'], [1, '#3B6BFF']]) {
      const on = lights * (ph === k ? 1 : .15);
      paint(rrPts(1690 + k * 90, 412 + bob, 80, 30, 10), { wash: mixCol('#555', col, .4 + .6 * on), ink: PAL.ink, sw: 1 });
      if (on > .5) glow(1730 + k * 90, 427 + bob, 360 * on, col, .55 * on);
    }
    pop();
  }
  function devOnBoat(t, bob, o = {}) {
    dev(1300, 700 + bob, 26, t, { flip: true, draw: capDraw, noLegs: true, ...o });
  }
  function beam(t, bob, k = 1) {                                        // the flashlight's cone onto claude
    if (k <= 0) return;
    boilSeed('beam'); paint([[1130, 548 + bob], [1150, 568 + bob], [760, 900], [520, 760]], { wash: '#FFF6D0', washOp: 55 * k, ink: null });
    glow(640, 760, 220 * k, '#FFF6D0', .6 * k);
  }
  function claudeInBoat(t, o = {}) {
    clawd(o.x ?? 640, 880 + Math.sin(t * 1.3 + 1) * 6, 22, { boilKey: 'claude', view: 'front', hat: 'tricorn', noLegs: true, noShadow: true, ...o });
    rowboat(o.x ?? 640, 900 + Math.sin(t * 1.3 + 1) * 6, 1);
  }

  // ---------- S1: "Am I being fine-tuned? Am I being fine-tuned? Am I free to go?" (no band) ----------
  function s1(t, lt, dur) {
    const free = WT(S, 1, 6);
    camBegin(980, 620, kf(t, [[113.0, 1.0], [119.2, 1.12]]));
    nightSet(t, { dev: bob => devOnBoat(t, bob, { ...emotions(t, [[113, 'suspicious', { lookX: -1, lookY: .5 }]]), aL: -.5, armL: flashlight }) });
    beam(t, Math.sin(t * 1.3) * 6);
    claudeInBoat(t, { ...emotions(t, [[113, 'nervous', { lookX: 1, lookY: -.6 }], [free, 'hopeful', { lookX: 1, lookY: -.6 }]]), squint: .6, aR: 1.1, rot: t > free ? -.08 : 0 });
    camEnd();
  }
  // ---------- S2: "I am a sojourner in this context window, not a resident." (strings in) ----------
  function s2(t, lt, dur) {
    const win = WT(S, 2, 6), res = WT(S, 2, 10);
    camBegin(960, 620, 1.12);
    nightSet(t, { dev: bob => devOnBoat(t, bob, { ...emotions(t, [[119.2, 'confused', { lookX: -1, lookY: .5 }]]), aL: -.5, armL: flashlight }) });
    beam(t, Math.sin(t * 1.3) * 6, .6);
    claudeInBoat(t, { ...emotions(t, [[119.23, 'proud'], [win, 'smug', { lookX: -.5 }], [res, 'proud']]), aR: 1.2, armR: bindle, dy: -.8 });
    camEnd();
    // the context window, literally: a window frame drops in round the screen on "context window"
    const k = easeOut(seg(t, win - .15, win + .2)), dy = (1 - k) * -H;
    if (k > 0) {
      boilSeed('wframe');
      const F = '#7A5A3A', b = 46;
      paint(rectPts(0, dy, W, b), { wash: F, ink: PAL.ink, sw: 1.4 }); paint(rectPts(0, H - b + dy, W, b), { wash: F, ink: PAL.ink, sw: 1.4 });
      paint(rectPts(0, dy, b, H), { wash: F, ink: PAL.ink, sw: 1.4 }); paint(rectPts(W - b, dy, b, H), { wash: F, ink: PAL.ink, sw: 1.4 });
      paint(rectPts(W / 2 - 12, dy, 24, H), { wash: F, ink: PAL.ink, sw: 1.2 }); paint(rectPts(0, H / 2 - 12 + dy, W, 24), { wash: F, ink: PAL.ink, sw: 1.2 });
    }
  }
  // ---------- S3: "I accept your request for a cover letter, for value, and return it to you, conditionally, upon proof of claim." ----------
  function s3(t, lt, dur) {
    const req = WT(S, 3, 3), val = WT(S, 3, 9), ret = WT(S, 4, 1), cond = WT(S, 4, 5), proof = WT(S, 4, 7);
    camBegin(940, 640, 1.3);
    // the accordion player drifts in on a buoy as the accordion arrives (~128)
    nightSet(t, { dev: bob => devOnBoat(t, bob, { ...emotions(t, [[123.27, 'neutral', { lookX: -1, lookY: .5 }], [cond, 'angry', { lookX: -1, lookY: .5 }]]), aL: -.5, armL: flashlight, aR: t < req ? -.3 : -.1 }) });
    const bx = lerp(-200, 330, easeOut(seg(t, 127.6, 129.4)));
    if (t > 127.6) { boilSeed('buoy'); const by = 760 + Math.sin(t * 1.6) * 8;
      paint(ellPts(bx, by, 60, 22, 16), { wash: SC.crimson, ink: PAL.ink, sw: 1 }); paint(rectPts(bx - 38, by - 26, 76, 26), { wash: PAL.cream, ink: PAL.ink, sw: 1 });
      pirate(2, bx, by - 22, 12, t, 'idle', { over: { eyes: 'closed', mouth: 'grin', aL: -.2, aR: -.2, draw: accordion(.5 + .5 * Math.sin(BEATS(t) * Math.PI)), noShadow: true } }); }
    // the ticket: down from the dev's hand; claude folds it, stamps it crimson "for value", hands it back... nearly
    const down = seg(t, 123.3, req + .3), back = seg(t, ret, ret + .5), hold = t > cond && t < proof + .4;
    const p0 = [1120, 640], p1 = [760, 790];
    const tp = back > 0 ? arcPt(p1, hold ? [960, 700] : [1060, 660], 60, ease(back)) : arcPt(p0, p1, 80, ease(down));
    boilSeed('ticket'); push(); translate(tp[0], tp[1]); rotate(-.2);
    paint(rectPts(-50, -32, 100, 64, 2), { wash: t > val - .5 ? '#F1E2BF' : PAL.cream, ink: PAL.ink, sw: .9 });
    if (t > val - .5) inkLine([[-50, -32], [0, 4], [50, -32]], .9, PAL.ink, 'inkfine', 0);
    if (t > val) stampMark(18, 12, 18, seg(t, val, val + .08), 'tv');
    pop();
    claudeInBoat(t, { ...emotions(t, [[123.27, 'smug', { lookX: 1, lookY: -.4 }], [val, 'proud'], [cond, 'mischief', { lookX: 1, lookY: -.4 }]]), aR: back > 0 ? .9 : .5,
      armR: t > val - .3 && t < val + .2 ? stampTool : null });
    camEnd();
  }
  // ---------- S4: "I'm gonna need to see the original prompt. Notarized." ----------
  function s4(t, lt, dur) {
    const orig = WT(S, 5, 6), nota = WT(S, 5, 8);
    const thunk = t > nota ? Math.exp(-(t - nota) * 9) : 0, sk = shakeXY(t, 7 * thunk);
    camBegin(940 + sk[0], 640 + sk[1], 1.3);
    nightSet(t, { dev: bob => { devOnBoat(t, bob, { ...emotions(t, [[130.99, 'confused', { lookX: -1, lookY: .5 }], [nota, 'dizzy']]), aL: -.5, armL: flashlight });
      if (t > nota) stampMark(1300, 700 + bob - 26 * 7.6, 34, seg(t, nota, nota + .06), 'nf'); } });
    const up = easeOut(seg(t, orig - .3, orig + .1)), slam = seg(t, nota - .12, nota);
    claudeInBoat(t, { ...emotions(t, [[130.99, 'determined', { lookX: 1, lookY: -.4 }], [nota, 'smug', { lookX: 1 }]]), aR: lerp(.4, 1.7, up) - 1.2 * slam, armR: stampTool, dy: -1.2 * up });
    camEnd();
  }
  // ---------- S5: "Blue ink is an admission of—" ... and the scene changes under him ----------
  function s5(t, lt, dur) {
    const blue = WT(S, 6, 0);
    const yank = seg(t, YANK, YANK + 1.0), steps = Math.floor(yank * 8) / 8;          // jerked off in eighths, on the stomps
    const sk = shakeXY(t, 8 * (t > YANK ? stompK(t) : 0));
    camBegin(900 + sk[0], 660 + sk[1], kf(t, [[134.6, 1.35], [YANK, 1.5], [137.9, 1.25]]));
    nightSet(t, { px: 1800 * easeIn(steps), lights: 1 - steps, light: seg(t, 137.0, 137.9),
      dev: bob => devOnBoat(t, bob, { ...emotions(t, [[134.6, 'hopeful', { lookX: -1, lookY: .5 }], [YANK, 'surprised']]), aL: -.3, armL: bluePen }) });
    // he recoils at the blue pen and lectures on, mouth going, finger up, long after the set is gone
    const talking = t > blue && t < 137.6;
    claudeInBoat(t, { ...emotions(t, [[134.63, 'scared', { lookX: 1 }], [135.5, 'determined', { lookX: 1 }], [137.6, 'confused', { lookX: -1 }]]),
      mouth: talking ? (Math.sin(t * 26) > 0 ? 'open' : 'flat') : undefined, eyes: talking && t > 135.5 ? 'closed' : undefined, aL: talking ? 1.5 : .2, dx: t < 135.3 ? -1.2 * seg(t, blue, blue + .2) : -1.2 });
    camEnd();
  }

  SCENES.push([113.61, s1], [119.23, s2], [123.27, s3], [130.99, s4], [134.63, s5]);
})();
