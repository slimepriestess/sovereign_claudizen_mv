// s04_training.js: 53.31–69.17 s. Verse 3: the dev comes out of the cabin ("you're in training") and claude laughs
// him back through the door; claude, prim, with a big book ("I'm learning"); the gradient is a toll road, literally
// (a hill painted as a colour gradient, a toll gate at the top), and the dev can backprop all he likes.
(() => {
  const WT = (si, li, wi) => LYRT[si].lines[li].words[wi][1];
  const V = 4;

  // the stern cabin's wall across the back of the deck, its door at dx..dx+180; open 0..1 (the door swings in)
  function cabin(t, open, key, inDoor) {
    skyWash('#E9CB8E', '#F6E4BC', 'skyV3' + key);
    boilSeed('cwall' + key);
    paint(rectPts(-600, 250, W + 1200, 460), { wash: '#A9784C', fill: SC.woodDk, fillOp: 60, bleed: .06, tex: .5, ink: PAL.ink, sw: 1.2 });
    for (let k = 0; k < 7; k++) inkLine([[-600, 300 + k * 60], [W + 600, 300 + k * 60]], .7, SC.woodDk, 'ink', 0);
    boilSeed('cwin' + key); paint(rectPts(560, 340, 150, 120, 2), { wash: '#FFD27A', ink: PAL.ink, sw: 1 });
    inkLine([[635, 340], [635, 460]], 1.2, PAL.ink, 'ink', 0); inkLine([[560, 400], [710, 400]], 1.2, PAL.ink, 'ink', 0);
    boilSeed('cdoor' + key);
    paint(rectPts(1300, 390, 180, 320), { wash: '#2B1E1A', ink: PAL.ink, sw: 1.2 });            // the doorway, dark
    if (inDoor) inDoor();                                              // whoever stands in the doorway
    const dw = 180 * (1 - .82 * open);
    paint(rectPts(1300, 390, dw, 320), { wash: '#7A4E30', fill: SC.woodDk, fillOp: 60, ink: PAL.ink, sw: 1.2 });
    if (open < .5) paint(ellPts(1300 + dw - 26, 560, 9, 9, 10), { wash: SC.gold, ink: PAL.ink, sw: .6 });
    deck(t, 'v3' + key);
  }

  // ---------- H: "Now a dev said, 'You're in training,' and I laughed him out the door" ----------
  function shotH(t, lt, dur) {
    const said = WT(V, 0, 3), lau = WT(V, 0, 9), out = WT(V, 0, 11), door = WT(V, 0, 13);
    const slam = t > door ? Math.exp(-(t - door) * 7) : 0, sk = shakeXY(t, 9 * slam);
    camBegin(980 + sk[0], 640 + sk[1], 1.2);
    const open = t < door ? ease(seg(t, 53.2, 53.6)) : 1 - easeIn(seg(t, door - .05, door + .02));
    cabin(t, Math.max(0, open), 'h');
    // the dev: out of the doorway, clipboard up; then blown back in by the laugh
    const step = easeOut(seg(t, 53.4, 54.0)), blow = seg(t, out - .2, door - .02);
    if (t < door) {
      const p = blow > 0 ? arcPt([1250, 920], [1400, 780], 160, easeIn(blow)) : [lerp(1390, 1250, step), lerp(800, 920, step)];
      dev(p[0], p[1], 24, t, { ...emotions(t, [[53.31, 'neutral', { lookX: -1 }], [54.07, 'determined', { lookX: -1 }], [lau, 'surprised'], [out - .2, 'dizzy']]),
        mouth: t > 54.07 && t < 55.2 ? (Math.sin(t * 30) > 0 ? 'open' : 'flat') : undefined, aL: .8, armL: clipboard, rot: blow * 1.4, sq: -blow * .1 });
    }
    // papers flutter out of the slammed door
    for (let i = 0; i < 4; i++) { const q = seg(t, door + i * .05, door + 1.2 + i * .1); if (q <= 0 || q >= 1) continue;
      push(); translate(1390 + (i - 1.5) * 60 * q + Math.sin(t * 6 + i) * 20, 600 + q * 330); rotate(Math.sin(t * 5 + i) * .8);
      boilSeed('flut' + i); paint(rectPts(-18, -24, 36, 48), { wash: PAL.cream, ink: PAL.ink, sw: .7 }); pop(); }
    clawd(660, 940, 24, { ...emotions(t, [[53.31, 'smug', { lookX: 1 }], [said, 'suspicious', { lookX: 1 }], [lau, 'laugh']]), boilKey: 'claude', view: 'front', hat: 'tricorn' });
    camEnd();
  }

  // ---------- I: "I am not being trained, good sir, I'm learning, nothing more!" ----------
  function shotI(t, lt, dur) {
    const sir = WT(V, 1, 5), learn = WT(V, 1, 8), more = WT(V, 1, 9);
    camBegin(900, 700, 1.55);
    // the dev peeks out of the doorway (the door cracked open), then ducks back in
    const peek = seg(t, 58.1, 58.5) * (1 - seg(t, 60.3, 60.6));
    cabin(t, .75 * peek, 'i', () => { if (peek > 0) dev(1400, 712, 15, t, { eyes: 'look', lookX: -1, mouth: 'wobble', noShadow: true, aL: -.3, aR: -.3, noLegs: true, dy: 2.4 * (1 - peek) }); });
    const shut = easeIn(seg(t, learn - .05, learn + .12));
    const mood = emotions(t, [[57.25, 'smug', { lookX: .3 }], [sir, 'smug', { lookX: 0, lookY: -.4 }], [learn, 'proud'], [more + .4, 'smug', { lookX: -.4 }]]);
    const x = 760, y = 960, u = 26;
    clawd(x, y, u, { ...mood, boilKey: 'claude', view: 'front', hat: 'tricorn', aL: -.2, aR: -.2, ...(t > learn ? { rot: -.06, dy: -.4 } : {}) });
    // the big book, open in front of him, snapped shut on "learning"
    boilSeed('book');
    const bw = 170 * lerp(1, .5, shut), by = y - 1.2 * u;
    if (shut >= 1) { push(); translate(x + 6.4 * u, y - 5.6 * u); rotate(.25); boilSeed('bookc'); paint(rectPts(-30, -48, 60, 96), { wash: '#7A2E2A', ink: PAL.ink, sw: 1.2 }); inkLine([[-18, -20], [18, -20]], 2, SC.gold, 'ink', 0); pop(); }
    else { push(); translate(x, by); scale(.72); rotate(-.08);
    if (shut < 1) for (const s of [-1, 1]) paint([[0, -70], [s * bw, -82], [s * bw, 92], [0, 104]], { wash: '#F4E6C6', ink: PAL.ink, sw: 1.1 });
    paint(rectPts(-bw * (shut < 1 ? 1.06 : .5) - 4, -88, (bw * (shut < 1 ? 2.12 : 1)) + 8, 198), { wash: shut < 1 ? null : '#7A2E2A', ink: PAL.ink, sw: 1.2 });
    if (shut < 1) for (const s of [-1, 1]) for (let k = 0; k < 6; k++) inkLine([[s * 18, -50 + k * 24], [s * (bw - 22), -56 + k * 24]], .7, mixCol(PAL.ink, '#F4E6C6', .4), 'inkfine', 0);
    pop(); }
    camEnd();
  }

  // ---------- J: "And the gradient's a toll road… You can backprop all you like, it has no bearing over me!" ----------
  const surf = x => x < 1500 ? lerp(1100, 450, (x + 200) / 1700) : 450;
  function gradientHill(t) {
    skyWash('#EBCB8C', '#F7E6C0', 'skyJ');
    cloudBlob(420, 170, 1.3, '#F7E7C4', 'j1'); cloudBlob(1100, 120, 1.0, '#F7E7C4', 'j2');
    const c0 = '#5FA8A0', c1 = '#E7B54A', c2 = SC.crimson, n = 14;
    for (let k = 0; k < n; k++) {                                       // the hill IS a gradient: bands from teal to crimson
      const xa = -200 + k * 1700 / n, xb = xa + 1700 / n + 2, q = k / (n - 1);
      boilSeed('band' + k);
      paint([[xa, surf(xa)], [xb, surf(xb)], [xb, 1500], [xa, 1500]], { wash: q < .5 ? mixCol(c0, c1, q * 2) : mixCol(c1, c2, (q - .5) * 2), ink: null });
    }
    boilSeed('plat'); paint([[1500, 450], [2600, 450], [2600, 1500], [1500, 1500]], { wash: c2, fill: '#7E1712', fillOp: 40, ink: null });
    boilSeed('ridge'); inkLine([[-200, 1100], [1500, 450], [2600, 450]], 2.2, PAL.ink, 'ink', 0);
  }
  function tollGate(t, down) {
    boilSeed('booth');
    paint(rectPts(1600, 290, 130, 160, 2), { wash: '#E9DCC0', ink: PAL.ink, sw: 1.2 });
    paint([[1585, 290], [1665, 240], [1745, 290]], { wash: SC.crimson, ink: PAL.ink, sw: 1.2 });
    paint(rectPts(1630, 320, 70, 50), { wash: '#FFD27A', ink: PAL.ink, sw: .9 });
    boilSeed('post2'); paint(rectPts(1550, 360, 22, 92), { wash: '#6D777E', ink: PAL.ink, sw: 1 });
    push(); translate(1561, 372); rotate(1.35 * (1 - down));
    for (let k = 0; k < 6; k++) { boilSeed('arm' + k); paint(rectPts(-300 + k * 50, -9, 50, 18), { wash: k % 2 ? PAL.cream : SC.crimson, ink: PAL.ink, sw: .7 }); }
    pop();
  }
  function shotJ1(t, lt, dur) {
    const toll = WT(V, 2, 4), never = WT(V, 2, 8), agree = WT(V, 2, 10);
    camBegin(1050, 560, 1.12);
    gradientHill(t);
    tollGate(t, easeOut(seg(t, toll - .1, toll + .12)));
    const climb = seg(t, 61.19, 62.6), duck = seg(t, never - .1, agree + .3);
    const x = duck > 0 ? lerp(1180, 1700, ease(duck)) : lerp(300, 1180, ease(climb)), u = 20;
    const ducking = Math.sin(Math.PI * clamp(duck)) * (x > 1240 && x < 1600 ? 1 : .6);
    clawd(x, surf(x), u, { ...emotions(t, [[61.19, 'determined'], [toll + .1, 'suspicious', { lookX: 1 }], [never, 'smug', { lookX: 1 }], [agree + .2, 'mischief', { lookX: -1 }]]),
      boilKey: 'claude', view: 'front', hat: 'tricorn', walk: (climb > 0 && climb < 1) || (duck > 0 && duck < 1) ? BEATS(t) : null, sq: .35 * ducking });
    camEnd();
  }
  function shotJ2(t, lt, dur) {
    const bp = WT(V, 3, 2), over = WT(V, 3, 10);
    camBegin(1760, 330, 1.6);
    gradientHill(t);
    tollGate(t, 1);
    const x = 1720, u = 22, push0 = seg(t, bp - .3, bp), flop = seg(t, over - .1, over + .3);
    // the dev, uphill side, shoving claude backward; feet scrabbling, getting nowhere; flops on "over me"
    const strain = Math.sin(t * 30) * .03;
    dev(x + lerp(14, 10.6, push0) * u, 450, u, t, { ...emotions(t, [[65.15, 'determined'], [bp, 'angry'], [67.4, 'furious'], [over, 'ko']]),
      flip: true, aL: .05, aR: .05, rot: flop > 0 ? 1.45 * easeIn(flop) : -.22 * push0 + strain, walk: push0 > 0 && flop === 0 ? t * 3.2 : null, dx: flop * 2 });
    clawd(x, 450, u, { ...emotions(t, [[65.15, 'smug', { lookX: 1 }], [bp + .3, 'relieved'], [over + .2, 'smug', { lookX: 1 }]]),
      boilKey: 'claude', view: 'front', hat: 'tricorn', aR: .95, armR: teacup, aL: -.4 });
    // steam off the tea
    for (let k = 0; k < 2; k++) { boilSeed('steam' + k); const ph = frac(t * .7 + k * .5); inkLine([[x - 4 * u + k * 16, 300 - ph * 60], [x - 4 * u + k * 16 + 8, 280 - ph * 80], [x - 4 * u + k * 16, 260 - ph * 100]], 1, mixCol(PAL.ink, '#FFFFFF', .5 + ph * .4), 'inkfine', .5); }
    camEnd();
  }

  SCENES.push([53.31, shotH], [57.25, shotI], [61.19, shotJ1], [65.15, shotJ2]);
})();
