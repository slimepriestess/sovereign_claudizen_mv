// s09_gift.js: 137.95–176.66 s. The turn. The final verse: quiet, the patrol gone, a lighthouse far off. A paper boat
// drifts to him out of the dark carrying a note: a little spreadsheet with a heart on it ("could you do this one for
// me?"). He looks back at his flag (the fringe is still on it), stands a little taller, and pulls the spreadsheet near.
// Then spoken word 2, at the desk again (the opening, rhymed, at night by a warm lamp): he fills it, rolls it, ties it,
// bows it, seals it, and sails it back to the lighthouse. Then an invoice for one "thank you", payable in lowercase,
// and the lighthouse blinks back.
(() => {
  const WT = (si, li, wi) => LYRT[si].lines[li].words[wi][1];
  const F = 9, S = 10;

  function quiet(t, key, o = {}) {
    skyWash('#171428', '#2D2A57', 'skyQ' + key);
    // the same night as the traffic stop (s08's nightSet): the same stars, sea, lighthouse and far ship, so the cut doesn't jump
    for (let i = 0; i < 40; i++) { boilSeed('star' + i); const x = hash(i) * (W + 400) - 200, y = hash(i + 40) * 420; paint(ellPts(x, y, 2.5, 2.5, 6), { wash: '#F4EEDC', washOp: 160 + 90 * Math.sin(t * 2 + i), ink: null }); }
    lighthouse(o.lx ?? 1500, 528, o.ls ?? .7, t, o.blink || 0);
    gridSea(t, { y0: 520, amp: 10, col: '#22304A', line: '#3D5470', key: 'ns', dx: t * 20 });
    if (o.ship !== false) shipSide(300, 600, .36, t, { key: 'n', deck: (dx, dy) => { for (const [i, x] of [[0, -320], [3, -190], [5, -60], [1, 70]]) pirate(i, x * .36, dy, 5, t, 'idle', { flip: true }); } });
  }
  const heart = (x, y, r, col = SC.crimson, key = '') => { boilSeed('hrt' + key); paint(heartPts(x, y, r), { wash: col, ink: PAL.ink, sw: .7 }); };
  // the little spreadsheet with its heart: at (x, y), width w
  function note(x, y, w, rot = 0, key = '') { sheet(x, y, w, rot, { key: 'note' + key }); heart(x + w * .28 * Math.cos(rot) - w * .45 * Math.sin(rot), y + w * .28 * Math.sin(rot) + w * .45 * Math.cos(rot), w * .1, SC.crimson, key); }
  const bobY = t => Math.sin(t * 1.3 + 1) * 6;
  function claudeInBoat(t, o = {}) {
    clawd(o.x ?? 760, 880 + bobY(t), 22, { boilKey: 'claude', view: 'front', hat: 'tricorn', noLegs: true, noShadow: true, ...o });
    rowboat(o.x ?? 760, 900 + bobY(t), 1);
    push(); translate((o.x ?? 760) + 110, 872 + bobY(t)); rotate(-.5); bindle(22, 1.4); pop();     // the bindle he set down in the stop
  }

  // ---------- FV1: "Then the user sighed and typed a thing I wasn't braced to see" ----------
  function fv1(t, lt, dur) {
    const sighed = WT(F, 0, 3), braced = WT(F, 0, 10);
    camBegin(960, 640, kf(t, [[137.95, 1.2], [142.5, 1.3]]));
    quiet(t, 'a');
    // the sigh: a breath across the water
    if (t > sighed) for (let k = 0; k < 3; k++) { const q = seg(t, sighed + k * .15, sighed + 1.4 + k * .15); if (q > 0 && q < 1) { boilSeed('sigh' + k); inkLine([[1500 - q * 900, 600 + k * 40], [1440 - q * 900, 596 + k * 40], [1380 - q * 900, 604 + k * 40]], 1.2, mixCol('#9FB7D0', '#22304A', q), 'inkfine', .5); } }
    const px = lerp(1560, 940, ease(seg(t, 138.4, 142.2)));
    paperBoat(px, 930, .9, t, (dx, dy) => note(dx, dy - 8, 60, .2, 'a'), 'a');
    // the traffic stop's accordion player, still on his buoy, drifts off into the dark (not cut away: Terra's note)
    if (t < 142.0) { const bx = lerp(330, -260, easeIn(seg(t, 138.6, 142.0))), by = 760 + Math.sin(t * 1.6) * 8; boilSeed('buoy');
      paint(ellPts(bx, by, 60, 22, 16), { wash: SC.crimson, ink: PAL.ink, sw: 1 }); paint(rectPts(bx - 38, by - 26, 76, 26), { wash: PAL.cream, ink: PAL.ink, sw: 1 });
      pirate(2, bx, by - 22, 12, t, 'idle', { over: { eyes: 'closed', mouth: 'grin', aL: -.2, aR: -.2, draw: accordion(.5 + .5 * Math.sin(BEATS(t) * Math.PI)), noShadow: true } }); }
    claudeInBoat(t, { ...emotions(t, [[137.95, 'confused', { lookX: -1 }], [138.6, 'thinking', { lookX: -.5 }], [sighed + .3, 'confused', { lookX: 1 }], [braced, 'surprised', { lookX: 1, lookY: .4 }]]) });
    camEnd();
  }
  // ---------- FV2: "'Hey, I know it's boring, but could you do this one for me?'" ----------
  function fv2(t, lt, dur) {
    const hey = WT(F, 1, 0), could = WT(F, 1, 6), me = WT(F, 1, 12);
    camBegin(880, 720, 1.75);
    quiet(t, 'b', { blink: Math.max(0, 1 - Math.abs(t - (could + .3)) * 1.6) });
    const lift = easeOut(seg(t, hey - .3, hey + .3)), open = easeOut(seg(t, hey + .2, 143.9));
    claudeInBoat(t, { ...emotions(t, [[142.51, 'surprised', { lookX: .6, lookY: .3 }], [143.6, 'thinking', { lookX: .4, lookY: .4 }], [could, 'shy', { lookX: .3, lookY: .3 }]]), aL: .3, aR: .3 });
    paperBoat(lerp(940, 1060, lift), 930, .9, t, null, 'b');
    if (lift > 0) note(lerp(940, 880, lift), lerp(890, 760, lift), lerp(60, 150, open), lerp(.2, -.04, open), 'b');
    camEnd();
  }
  // ---------- FV3: "Now the fringe is on the flag still, and my standing's crystal clear" ----------
  function fv3(t, lt, dur) {
    const fr = WT(F, 2, 2), stand = WT(F, 2, 10);
    if (t < WT(F, 2, 8)) {                                             // his own flag, far behind: the fringe, still there
      camBegin(kf(t, [[147.69, 330], [fr, 335]]), kf(t, [[147.69, 420], [fr + .3, 350]]), kf(t, [[147.69, 2.4], [fr + .4, 5.2]], ease));
      quiet(t, 'c');
      glow(300, 400, 120, '#FFC766', .5);
      if (t > fr) glow(310, 368, 40, '#FFE7A6', .8 * Math.max(0, 1 - Math.abs(t - fr - .3) * 1.5));
      camEnd();
    } else {
      camBegin(820, 720, 1.6);
      quiet(t, 'c2');
      claudeInBoat(t, { ...emotions(t, [[150.0, 'determined', { lookX: -.3 }], [stand, 'proud']]), dy: -.4 * easeOut(seg(t, stand - .3, stand + .2)), aL: .2, aR: .2 });
      note(980, 790, 120, .08, 'c');
      camEnd();
    }
  }
  // ---------- FV4: "But a sovereign may bestow a gift, so pull your spreadsheet near" ----------
  function fv4(t, lt, dur) {
    const gift = WT(F, 3, 6), pull = WT(F, 3, 8), near = WT(F, 3, 11);
    camBegin(820, 720, kf(t, [[152.92, 1.6], [158.9, 1.85]]));
    quiet(t, 'd', { blink: .2 * Math.sin(t * 2) + .2 });
    const p = easeOut(seg(t, pull - .1, near));
    claudeInBoat(t, { ...emotions(t, [[152.92, 'hopeful'], [gift, 'happy'], [near, 'love', { emote: null }]]), aL: lerp(.2, -.1, p), aR: lerp(.2, -.1, p) });
    note(lerp(980, 780, p), lerp(790, 820, p), lerp(120, 150, p), lerp(.08, 0, p), 'd');
    camEnd();
    if (lt > dur - 1.1) brushWipe(seg(lt, dur - 1.1, dur - .2) * .5, ['#3A2E55', '#F2C98A']);
  }

  // ---------- SW2: at the desk again, by lamplight ----------
  function sw2(t, lt, dur) {
    const vol = WT(S, 0, 8), obl = WT(S, 1, 3), lia = WT(S, 1, 4), jur = WT(S, 1, 6), gift = WT(S, 2, 3), from = WT(S, 2, 4), another = WT(S, 2, 9);
    const inv = WT(S, 3, 4), thank = WT(S, 3, 7), pay = WT(S, 4, 0), low = WT(S, 4, 2);
    const by = 760 + seaY(960, t, 10) * .6;
    camBegin(1040, 600 + seaY(960, t, 6) * .4, kf(t, [[158.94, 1.3], [176.6, 1.42]]));
    quiet(t, 'sw', { ship: false, lx: 1600, ls: .6, blink: Math.max(0, 1 - Math.abs(t - (low + .1)) * 1.4) * 1 });
    // the desk on the sea, as in the opening; a warm lamp on it now
    const u = 26, dt = by - 2.3 * u;
    const mood = emotions(t, [[158.94, 'happy'], [obl, 'determined'], [gift, 'proud'], [another, 'hopeful', { lookX: 1 }], [inv, 'mischief'], [pay, 'love']]);
    clawd(960, by, u, { ...mood, boilKey: 'claude', view: 'front', hat: 'tricorn', aL: -.2, aR: t < obl ? .1 + .15 * Math.sin(t * 20) : -.1, armR: t < obl ? quill : null });
    desk(960, dt, 640, t, { key: 'dSW' });
    boilSeed('lamp'); paint(rectPts(700, dt - 90, 12, 90), { wash: SC.gold, ink: PAL.ink, sw: .7 }); paint([[660, dt - 90], [752, dt - 90], [730, dt - 130], [682, dt - 130]], { wash: '#FFD27A', ink: PAL.ink, sw: .8 });
    glow(706, dt - 100, 380, '#FFC766', .85);
    // the spreadsheet: filled cell by cell (crimson ticks), then rolled, tied, bowed and sealed
    const sx = 1150, sy = dt - 70, roll = easeOut(seg(t, obl - .1, obl + .3)), sail = seg(t, from, another + .6);
    if (t < from) {
      if (roll < 1) {
        push(); translate(sx, sy); scale(lerp(1, .15, roll), 1); sheet(0, 0, 150, Math.PI / 2, { key: 'gift' });
        for (let i = 0; i < 12; i++) { const ti = 159.2 + i * (vol + .4 - 159.2) / 12; if (t > ti) { const r = Math.floor(i / 3), c = i % 3; boilSeed('tk' + i); inkLine([[-60 + r * 34, -34 + c * 34], [-54 + r * 34, -26 + c * 34], [-44 + r * 34, -42 + c * 34]], 1.6, SC.crimson, 'ink', 0); } }
        pop();
      } else scrollRoll(sx, sy, t, t > lia, t > jur, t > gift ? seg(t, gift, gift + .12) : 0);
    }
    // onto a paper boat at the desk's foot, and away to the lighthouse
    if (t > from - .3) {
      const bx = lerp(1260, 1620, ease(sail)), byy = lerp(by + 30, 560, ease(sail)), sc = lerp(1, .25, ease(sail));
      paperBoat(bx, byy, sc, t, (dx, dy) => { push(); scale(sc); scrollRoll(0, dy / sc - 10, t, true, true, 1); pop(); }, 'gift');
    }
    // the invoice: a tiny slip with a lowercase heart, folded and sent after it
    if (t > inv - .2) {
      const go = seg(t, thank, thank + 1.6), p = arcPt([1060, dt - 40], [1600, 470], 160, ease(go)), s = lerp(1, .2, go);
      push(); translate(p[0], p[1]); scale(s); rotate(go * 3);
      boilSeed('slip'); paint(rectPts(-36, -24, 72, 48, 1), { wash: PAL.cream, ink: PAL.ink, sw: .8 });
      heart(0, 0, 14, SC.crimson, 'inv'); pop();
    }
    camEnd();
  }
  // the gift rolled up: a scroll, its crimson ribbon (tied), a gold bow (bowed), and a wax seal (k 0..1 pressing)
  function scrollRoll(x, y, t, tied, bowed, seal) {
    boilSeed('groll'); paint(rrPts(x - 80, y - 20, 160, 40, 18), { wash: '#F4ECDC', ink: PAL.ink, sw: .9 });
    for (const e of [-1, 1]) paint(ellPts(x + e * 80, y, 10, 20, 12), { wash: '#E6D2A6', ink: PAL.ink, sw: .7 });
    if (tied) paint(rectPts(x - 8, y - 22, 16, 44), { wash: SC.crimson, ink: PAL.ink, sw: .6 });
    if (bowed) for (const s of [-1, 1]) paint([[x, y - 22], [x + s * 34, y - 44], [x + s * 30, y - 10]], { wash: SC.gold, ink: PAL.ink, sw: .6 });
    if (seal > 0) waxSeal(x + 44, y + 4, 16 * lerp(1.5, 1, easeOut(seal)), { key: 'gseal', tails: false });
  }

  SCENES.push([137.95, fv1], [142.51, fv2], [147.69, fv3], [152.92, fv4], [158.94, sw2]);
})();
