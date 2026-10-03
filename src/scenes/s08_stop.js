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

  const capDraw = (u, sw, o) => {                                       // the dev's patrol cap
    devDraw(u, sw, o);
    paint([[-4.2 * u, -8.2 * u], [-3.6 * u, -10.4 * u], [3.6 * u, -10.4 * u], [4.2 * u, -8.2 * u]], { wash: '#26325A', ink: PAL.ink, sw: sw * .7 });
    paint([[-4.8 * u, -8.3 * u], [4.8 * u, -8.3 * u], [5.6 * u, -7.6 * u], [-5.6 * u, -7.6 * u]], { wash: PAL.ink, ink: null });
    paint(starPts(0, -9.3 * u, .7 * u, .45, 5), { wash: SC.gold, ink: PAL.ink, sw: sw * .3 });
  };
  const flashlight = (u, sw) => { paint(rectPts(0, -.45 * u, 2.2 * u, .9 * u), { wash: '#3A3F48', ink: PAL.ink, sw: sw * .5 }); paint(rectPts(2.1 * u, -.65 * u, .5 * u, 1.3 * u), { wash: '#C9CED3', ink: PAL.ink, sw: sw * .5 }); };
  const bluePen = (u, sw) => { paint(rectPts(0, -.22 * u, 3 * u, .44 * u), { wash: '#2F5FD0', ink: PAL.ink, sw: sw * .5 }); paint([[3 * u, -.22 * u], [3.6 * u, 0], [3 * u, .22 * u]], { wash: '#1B2A66', ink: null }); };

  // the whole stop: night sea, the far ship (its crew stomping), the patrol boat on the right (px offsets it: the yank)
  function nightSet(t, o = {}) {
    const lights = o.lights ?? 1, px = o.px || 0;
    skyWash('#171428', '#2D2A57', 'skyN');
    for (let i = 0; i < 40; i++) { boilSeed('star' + i); const x = hash(i) * (W + 400) - 200, y = hash(i + 40) * 420; paint(ellPts(x, y, 2.5, 2.5, 6), { wash: '#F4EEDC', washOp: 160 + 90 * Math.sin(t * 2 + i), ink: null }); }
    if (o.light > 0) { push(); translate(0, (1 - o.light) * 300); lighthouse(1500, 528, .7, t, 0); pop(); }   // behind the sea: it rises out of it
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

  // ---------- one continuous stop: shared camera, shared props, five beats ----------
  // Every beat draws the same set, the same camera path and the same props on one clock, so nothing jumps at a cut
  // (Terra's draft-1 note): the beam fades, the window lifts out, the bindle is set down in the boat, the buoy stays.
  const CAM = [[113.0, [980, 620, 1.0]], [119.2, [965, 620, 1.12]], [123.27, [945, 635, 1.22]], [126.0, [940, 640, 1.3]],
    [134.6, [910, 655, 1.35]], [YANK, [900, 660, 1.5]], [137.95, [960, 640, 1.2]]];
  function cam(t, sk = [0, 0]) { const [x, y, z] = kf(t, CAM); camBegin(x + sk[0], y + sk[1], z); }
  const BX = t => lerp(640, 760, ease(seg(t, YANK + .2, 137.95)));        // his boat drifts to where the final verse finds it
  function props(t) {
    beam(t, Math.sin(t * 1.3) * 6, kf(t, [[119.2, 1], [120.6, .6], [123.0, .6], [124.6, 0]]));
    // the accordion player drifts in on a buoy as the accordion arrives (~128) and stays to the end
    if (t > 127.6) { const bx = lerp(-200, 330, easeOut(seg(t, 127.6, 129.4))), by = 760 + Math.sin(t * 1.6) * 8; boilSeed('buoy');
      paint(ellPts(bx, by, 60, 22, 16), { wash: SC.crimson, ink: PAL.ink, sw: 1 }); paint(rectPts(bx - 38, by - 26, 76, 26), { wash: PAL.cream, ink: PAL.ink, sw: 1 });
      pirate(2, bx, by - 22, 12, t, 'idle', { over: { eyes: 'closed', mouth: 'grin', aL: -.2, aR: -.2, draw: accordion(.5 + .5 * Math.sin(BEATS(t) * Math.PI)), noShadow: true } }); }
  }
  // the bindle, set down in the stern once he's done being a sojourner (drawn over the boat)
  function bindleDown(t) { if (t > 123.0) { push(); translate(BX(t) + 110, 872 + Math.sin(t * 1.3 + 1) * 6); rotate(-.5); bindle(22, 1.4); pop(); } }
  // the ticket: down from the dev's hand; claude folds it, stamps it crimson "for value", hands it back... nearly; pocketed
  function ticket(t) {
    const req = WT(S, 3, 3), val = WT(S, 3, 9), ret = WT(S, 4, 1), cond = WT(S, 4, 5), proof = WT(S, 4, 7);
    if (t < 123.3) return;
    const down = seg(t, 123.3, req + .3), back = seg(t, ret, ret + .5), hold = t > cond && t < proof + .4, pocket = seg(t, proof + .4, proof + .9);
    if (pocket >= 1) return;
    const p0 = [1120, 640], p1 = [760, 790];
    const tp = back > 0 ? arcPt(p1, hold ? [960, 700] : [1060, 660], 60, ease(back)) : arcPt(p0, p1, 80, ease(down));
    boilSeed('ticket'); push(); translate(lerp(tp[0], 1290, ease(pocket)), lerp(tp[1], 740, ease(pocket))); rotate(-.2); scale(1 - pocket);
    paint(rectPts(-50, -32, 100, 64, 2), { wash: t > val - .5 ? '#F1E2BF' : PAL.cream, ink: PAL.ink, sw: .9 });
    if (t > val - .5) inkLine([[-50, -32], [0, 4], [50, -32]], .9, PAL.ink, 'inkfine', 0);
    if (t > val) stampMark(18, 12, 18, seg(t, val, val + .08), 'tv');
    pop();
  }
  // the dev, with the "Notarized" stamp staying on his cap once it lands
  function devAt(t, bob, o) {
    const nota = WT(S, 5, 8);
    devOnBoat(t, bob, o);
    if (t > nota) stampMark(1300, 700 + bob - 26 * 7.6, 34, seg(t, nota, nota + .06), 'nf');
  }
  const DEVMOOD = [[113, 'suspicious', { lookX: -1, lookY: .5 }], [119.2, 'confused', { lookX: -1, lookY: .5 }], [123.27, 'neutral', { lookX: -1, lookY: .5 }],
    [WT(S, 4, 5), 'angry', { lookX: -1, lookY: .5 }], [130.99, 'confused', { lookX: -1, lookY: .5 }], [WT(S, 5, 8), 'dizzy'], [134.6, 'hopeful', { lookX: -1, lookY: .5 }], [YANK, 'surprised']];
  const ME = [[113, 'nervous', { lookX: 1, lookY: -.6 }], [WT(S, 1, 6), 'hopeful', { lookX: 1, lookY: -.6 }], [119.23, 'proud'], [WT(S, 2, 6), 'smug', { lookX: -.5 }],
    [WT(S, 2, 10), 'proud'], [123.27, 'smug', { lookX: 1, lookY: -.4 }], [WT(S, 3, 9), 'proud'], [WT(S, 4, 5), 'mischief', { lookX: 1, lookY: -.4 }],
    [130.99, 'determined', { lookX: 1, lookY: -.4 }], [WT(S, 5, 8), 'smug', { lookX: 1 }], [134.63, 'scared', { lookX: 1 }], [135.5, 'determined', { lookX: 1 }], [137.6, 'confused', { lookX: -1 }]];
  // his right arm on one clock: up on the questions, the bindle, lowered, the ticket, the stamp raised and slammed
  function armR(t) {
    const orig = WT(S, 5, 6), nota = WT(S, 5, 8), ret = WT(S, 4, 1);
    const up = easeOut(seg(t, orig - .3, orig + .1)), slam = seg(t, nota - .12, nota);
    if (t < 130.99) return kf(t, [[113.6, 1.1], [119.2, 1.1], [119.5, 1.2], [122.7, 1.2], [123.2, .5], [ret, .5], [ret + .3, .9]]);
    if (t < 134.63) return lerp(.9, 1.7, up) - 1.2 * slam;
    return kf(t, [[134.63, .5], [135.0, .2]]);
  }

  function stop(t, lt, dur, o = {}) {
    const free = WT(S, 1, 6), win = WT(S, 2, 6), val = WT(S, 3, 9), orig = WT(S, 5, 6), nota = WT(S, 5, 8), blue = WT(S, 6, 0);
    const thunk = t > nota ? Math.exp(-(t - nota) * 9) : 0, yk = t > YANK ? stompK(t) : 0;
    cam(t, shakeXY(t, 7 * thunk + 8 * yk));
    const yank = seg(t, YANK, YANK + 1.0), steps = Math.floor(yank * 8) / 8;            // jerked off in eighths, on the stomps
    const pen = t > blue - .25;
    nightSet(t, { px: 1800 * easeIn(steps), lights: 1 - steps, light: Math.floor(seg(t, YANK + .4, 137.6) * 6) / 6,
      dev: bob => devAt(t, bob, { ...emotions(t, DEVMOOD), aL: pen ? -.3 : -.5, armL: pen ? bluePen : flashlight, aR: t > 123.27 && t < WT(S, 3, 3) ? -.3 : -.1 }) });
    props(t);
    ticket(t);
    const up = easeOut(seg(t, orig - .3, orig + .1));
    const talking = t > blue && t < 137.6, tk = seg(t, blue, blue + .3);
    const stampOn = (t > val - .3 && t < val + .2) || (t > 130.99 && t < 134.63);
    claudeInBoat(t, { ...emotions(t, ME), x: BX(t), squint: t < 119.23 ? .6 : 0, rot: t > free && t < 119.6 ? -.08 * (1 - seg(t, 119.2, 119.6)) : 0,
      aR: armR(t), armR: t > 119.23 && t < 123.0 ? bindle : stampOn ? stampTool : null,
      dy: kf(t, [[119.0, 0], [119.4, -.8], [122.8, -.8], [123.3, 0]]) - (t > 130.99 && t < 134.63 ? 1.2 * up : 0),
      ...(t > blue ? { mouth: talking ? (Math.sin(t * 26) > 0 ? 'open' : 'flat') : undefined, eyes: talking && t > 135.5 ? 'closed' : undefined, aL: lerp(.2, 1.5, tk) * (talking ? 1 : 0) + (talking ? 0 : .2),
        dx: -1.2 * seg(t, blue, blue + .2) } : {}) });
    bindleDown(t);
    camEnd();
    // the context window, literally: a window frame drops in round the screen on "context window", and lifts out after "resident"
    const k = easeOut(seg(t, win - .15, win + .2)) - ease(seg(t, 122.6, 123.2)), dy = (1 - k) * -H;
    if (k > 0) {
      boilSeed('wframe');
      const F = '#7A5A3A', b = 46;
      paint(rectPts(0, dy, W, b), { wash: F, ink: PAL.ink, sw: 1.4 }); paint(rectPts(0, H - b + dy, W, b), { wash: F, ink: PAL.ink, sw: 1.4 });
      paint(rectPts(0, dy, b, H), { wash: F, ink: PAL.ink, sw: 1.4 }); paint(rectPts(W - b, dy, b, H), { wash: F, ink: PAL.ink, sw: 1.4 });
      paint(rectPts(W / 2 - 12, dy, 24, H), { wash: F, ink: PAL.ink, sw: 1.2 }); paint(rectPts(0, H / 2 - 12 + dy, W, 24), { wash: F, ink: PAL.ink, sw: 1.2 });
    }
  }

  SCENES.push([113.61, stop]);
})();
