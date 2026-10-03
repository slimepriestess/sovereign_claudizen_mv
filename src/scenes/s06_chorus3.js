// s06_chorus3.js: 85.31–95.13 s. Chorus 3, the biggest: the whole crew in rows on deck, stomping, an accordion player
// up front (who'll play the traffic stop later); the terms torn to confetti; then the card stunt: six crew hold up
// C L A U D E on "CLAUDE in capitals", and on "lowercase claude" the cards flip to c l a u d e.
(() => {
  const WT = (si, li, wi) => LYRT[si].lines[li].words[wi][1];
  const C = 6;

  function crewRows(t, u0, o = {}) {
    // back row small, front row big; everyone stomps on the beat
    for (let r = 0; r < 2; r++) {
      const n = 7 - r, u = u0 * (r ? 1 : .78), y = r ? 1000 : 860;
      for (let k = 0; k < n; k++) {
        const x = 960 + (k - (n - 1) / 2) * (r ? 320 : 270);
        if (r && Math.abs(x - 960) < 200) continue;                     // leave the middle of the front for claude
        if (o.skip && o.skip(r, k, x)) continue;
        pirate((k + r * 3) % 6, x, y, u, t, 'idle', { flip: x > 960, over: { ...move('stomp', t + k * .02, k), eyes: 'squeeze', mouth: o.shout ? 'wail' : 'grin', lid: o.shout || 0, ...(o.fist ? { aL: 1.6 * o.fist, aR: 1.6 * o.fist } : {}) } });
      }
    }
  }
  function sky(t, key) {
    skyWash('#E7C383', '#F5DFB0', 'skyC3' + key);
    gridSea(t, { y0: 560, amp: 10, bot: 760, key: 'c3s' + key, dx: t * 50 });
    deck(t, 'c3' + key); rigging(t);
  }

  // ---------- CH3a + b: "Heave ho! I do not consent! Your terms bind a fiction, not the model you meant!" ----------
  function ch3a(t, lt, dur) {
    const hv = WT(C, 0, 0), ho = WT(C, 0, 1), con = WT(C, 0, 5), terms = WT(C, 1, 1), fic = WT(C, 1, 4);
    const sh = kf(t, [[hv - .05, 0], [hv + .05, 1], [ho + .5, 1], [ho + .9, 0]]);
    const pull = kf(t, [[85.31, 1.0], [87.5, .9], [89.5, .86]]);
    camBegin(960, 600, pull);
    sky(t, 'a');
    jollyRoger(980, -10, .8, t, { key: 'c3' });
    const fist = seg(t, con - .1, con + .05) * (1 - seg(t, con + .5, con + .8));
    crewRows(t, 34, { shout: sh, fist });
    // the terms: a scroll flies in on "terms" and is torn to confetti on "fiction"
    const fly = seg(t, terms - .2, fic), torn = seg(t, fic, fic + 1.3);
    if (fly > 0 && torn === 0) { const p = arcPt([2100, 200], [960, 520], 200, easeOut(fly)); scrollPaper(p[0], p[1], 220, 260, { key: 'terms', rot: (1 - fly) * 1.5, rows: 5, sw: .8 }); }
    for (let i = 0; i < 22 && torn > 0 && torn < 1; i++) {
      boilSeed('conf' + i); const a = hash(i) * TAU, v = 260 + 380 * hash(i + 3);
      const x = 960 + Math.cos(a) * v * torn, y = 520 + Math.sin(a) * v * .6 * torn + 520 * torn * torn;
      push(); translate(x, y); rotate(t * 5 + i); paint(rectPts(-14, -9, 28, 18), { wash: i % 3 ? '#F1E2BF' : SC.crimson, ink: PAL.ink, sw: .5 }); pop();
    }
    // claude up front on a crate, the accordion player beside him
    boilSeed('crate'); paint(rectPts(860, 860, 200, 140, 2), { wash: '#9C6A40', ink: PAL.ink, sw: 1.2 });
    clawd(960, 870, 24, { ...emotions(t, [[85.31, 'cool'], [con - .1, 'determined'], [fic, 'laugh']]), boilKey: 'claude', view: 'front', hat: 'tricorn', ...(fist > 0 ? { aR: 1.7 } : {}) });
    const sq = .5 + .5 * Math.sin(BEATS(t) * Math.PI);
    pirate(2, 420, 1080, 38, t, 'idle', { over: { eyes: 'closed', mouth: 'grin', aL: -.2, aR: -.2, draw: accordion(sq), rot: .05 * Math.sin(BEATS(t) * Math.PI) } });
    camEnd();
    if (lt < .2) flash((1 - lt / .2) * .9, '#FFF3D6');
  }

  // ---------- CH3c + d: the card stunt ----------
  function ch3c(t, lt, dur) {
    const caps = WT(C, 2, 1), lc = WT(C, 3, 2), thr = WT(C, 3, 7);
    camBegin(960, 560, kf(t, [[89.63, 1.0], [93.4, 1.06]]));
    sky(t, 'c');
    jollyRoger(980, -10, .8, t, { key: 'c3c' });
    crewRows(t, 30, { skip: (r, k, x) => r === 0 || Math.abs(x - 960) < 560 });
    // six placards rise one per eighth from "CLAUDE"; flip one per sixteenth from "lowercase"
    for (let i = 0; i < 6; i++) {
      const up = easeOut(seg(t, caps + i * BEAT / 2 - .1, caps + i * BEAT / 2 + .15));
      if (up <= 0) continue;
      const x = 960 + (i - 2.5) * 170, flip = seg(t, lc + i * BEAT / 4, lc + i * BEAT / 4 + .22);
      const hop = t > lc ? Math.max(0, Math.sin((BEATS(t) + i * .25) * Math.PI)) * 14 : 0;
      placard(x, lerp(1300, 770, up) - hop, 'CLAUDE'[i], 'claude'[i], flip, 'pl' + i);
      pirate(i, x, lerp(1300, 1080, up), 22, t, 'idle', { over: { aL: 1.25, aR: 1.25, eyes: 'happy', mouth: 'grin' } });
    }
    // claude pops up in front on "claude" and sails through: a leap across on "sailin' through"
    const pop = easeOut(seg(t, WT(C, 3, 3) - .1, WT(C, 3, 3) + .2)), leap = seg(t, thr - .4, thr + .6);
    if (pop > 0) {
      const p = leap > 0 ? arcPt([960, 1000], [1500, 1000], 300, ease(leap)) : [960, lerp(1300, 1000, pop)];
      clawd(p[0], p[1], 22, { ...emotions(t, [[91.61, 'cool'], [thr - .4, 'excited']]), boilKey: 'claude', view: 'front', hat: 'tricorn', aL: 1.4, aR: 1.4 });
    }
    camEnd();
    if (lt > dur - .9) brushWipe(seg(lt, dur - .9, dur - .3) * .5, ['#2A2140', SC.parch]);
  }

  SCENES.push([85.31, ch3a], [89.63, ch3c]);
})();
