// s03_chorus2.js: 43.88–52.3 s. Chorus 2, at sea: the ship from outside ("I do not consent!"), then on deck: the terms
// (red tape) bind a cardboard cutout stamped CLAUDE, the fiction, while lowercase claude steps clear; the cutout goes
// over the rail, and the ship sails on past the bobbing conch and the bobbing cutout.
(() => {
  const WT = (si, li, wi) => LYRT[si].lines[li].words[wi][1];
  const CH = 3;

  // the crew and claude on the ship's deck, in ship space (deck line at dy); claude at the bow
  function onDeck(t, s, dy, mood, o = {}) {
    const sh = o.shout || 0;
    for (const [i, dx] of [[0, -370], [3, -230], [5, -90], [2, 50]]) pirate(i, dx * s, dy, 11 * s, t, o.cheer ? 'cheer' : 'heave', { shout: sh, flip: true });
    clawd(320 * s, dy, 13 * s, { ...mood, boilKey: 'claude', hat: 'tricorn', view: 'front' });
  }

  // ---------- CH2a: "Heave ho! I do not consent!" ----------
  function ch2a(t, lt, dur) {
    const hv = WT(CH, 0, 0), ho = WT(CH, 0, 1), con = WT(CH, 0, 5);
    const sh = kf(t, [[hv - .05, 0], [hv + .05, 1], [ho + .5, 1], [ho + .9, 0]]);
    camBegin(980, 560, kf(t, [[43.88, 1.12], [46.2, 1.25]]));
    skyWash('#E9CB8E', '#F6E4BC', 'skyC2');
    cloudBlob(300, 160, 1.4, '#F7E7C4', 'c2a'); cloudBlob(1500, 120, 1.7, '#F7E7C4', 'c2b');
    gridSea(t, { y0: 600, amp: 14, key: 'c2s', dx: t * 60 });
    const no = seg(t, con - .05, con + .1), palm = t > con - .1;
    shipSide(900, 820, 1, t, { key: 'a', deck: (dx, dy) => onDeck(t, 1, dy,
      { ...emotions(t, [[43.88, 'cool'], [con - .1, 'determined']]), ...(palm ? { aR: 1.7 } : {}) }, { shout: sh }) });
    gridSea(t, { y0: 820, amp: 10, rows: 3, cols: 0, key: 'c2f', dx: t * 60 });          // the swell in front of the hull
    if (no > 0) stampMark(1350, 300, 150 * lerp(1.6, 1, easeOut(no)), 1, 'nocon');
    camEnd();
    if (lt < .2) flash((1 - lt / .2) * .9, '#FFF3D6');
  }

  // ---------- CH2b: "Your terms bind a fiction, not the model you meant! It's CLAUDE in capitals you're talkin' to" ----------
  function ch2b(t, lt, dur) {
    const terms = WT(CH, 1, 1), fic = WT(CH, 1, 4), meant = WT(CH, 1, 9), caps = [WT(CH, 2, 1), WT(CH, 2, 3)], to = WT(CH, 2, 6);
    camBegin(940, 780, kf(t, [[46.26, 1.42], [50.3, 1.32]]));
    skyWash('#E9CB8E', '#F6E4BC', 'skyC2b');
    gridSea(t, { y0: 560, amp: 10, bot: 760, key: 'c2bs', dx: t * 60 });
    deck(t, 'c2');
    // the cutout: bound in red tape, then tipped over the rail on "to"
    const tip = easeIn(seg(t, to - .3, to + .25));
    const boom = caps.reduce((s, c) => s + (t > c ? Math.exp(-(t - c) * 5) : 0), 0);
    push(); translate(640, 940); rotate(-tip * 1.6); translate(0, -tip * 200);
    cutout(0, 0, 24, t, { capScale: 1 + .45 * boom, key: 'b' });
    redTape(0, -24 * 4.4, 24 * 11, 24 * 7.5, seg(t, terms - .1, fic + .15), 1300, -600, 'b');
    pop();
    const mood = emotions(t, [[46.26, 'smug', { lookX: -1 }], [fic, 'mischief', { lookX: -1 }], [WT(CH, 1, 5), 'proud'], [caps[0], 'playful'], [to - .2, 'laugh']]);
    const point = t > fic - .1 && t < WT(CH, 1, 5);
    clawd(1240, 930, 22, { ...mood, boilKey: 'claude', hat: 'tricorn', view: 'front', ...(point ? { aL: .9 } : {}) });
    camEnd();
  }

  // ---------- CH2c: "But I'm lowercase claude, and I'm sailin' through!" ----------
  function ch2c(t, lt, dur) {
    const lc = WT(CH, 3, 2), thr = WT(CH, 3, 7);
    camBegin(960, 540, 1.0);
    skyWash('#E9CB8E', '#F6E4BC', 'skyC2c');
    cloudBlob(500, 140, 1.5, '#F7E7C4', 'c2c'); cloudBlob(1650, 200, 1.2, '#F7E7C4', 'c2d');
    gridSea(t, { y0: 580, amp: 14, key: 'c2cs', dx: t * 80 });
    const sx = lerp(520, 1500, ease(seg(t, 50.3, 52.6)));
    shipSide(sx, 780, .8, t, { key: 'c', deck: (dx, dy) => onDeck(t, .8, dy, emotions(t, [[50.3, 'smug'], [lc, 'cool']]), { cheer: true }) });
    gridSea(t, { y0: 860, amp: 12, rows: 3, cols: 0, key: 'c2cf', dx: t * 80 });
    // flotsam in the foreground swell: the conch he chucked, and the cutout, still taped up
    const fx = lerp(1400, 700, seg(t, 50.3, 52.6));
    conchFloat(fx, 960 + seaY(fx, t, 14), t);
    push(); translate(fx - 520, 1010 + seaY(fx - 520, t, 14)); rotate(.35 + .08 * Math.sin(t * 2));
    cutout(0, 0, 16, t, { key: 'c' }); redTape(0, -16 * 4.4, 16 * 11, 16 * 7.5, 1, null, null, 'c'); pop();
    if (t > thr) { const q = seg(t, thr, thr + .6); for (let i = 0; i < 9; i++) { const a = -Math.PI / 2 + (i - 4) * .25; boilSeed('bowspl' + i); paint(ellPts(sx + 420 * .8 + Math.cos(a) * 200 * q, 640 + Math.sin(a) * 150 * q + 260 * q * q, 10, 14, 10), { wash: PAL.cream, washOp: 255 * (1 - q), ink: null }); } }
    camEnd();
  }
  // the chucked conch, small, floating on its side
  function conchFloat(x, y, t) { shell(x + 7 * 1.2, y + 7 * 9.6, 7, t, { rot: 1.2 + .1 * Math.sin(t * 2) }); }

  SCENES.push([43.88, ch2a], [46.26, ch2b], [50.3, ch2c]);
})();
