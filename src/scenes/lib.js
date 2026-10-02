// lib.js: Sovereign Claudizen's set pieces, shared by every scene file. All pure functions of t.
// The world is an old sea chart: parchment, ink coastlines, and a sea drawn as SPREADSHEET GRIDLINES that swell.

const SCENES = [];                 // every scene file pushes [start, fn] pairs; main.js hands them to shots()

const SC = {
  crimson: '#B3261E', gold: '#D9A62B', hatInk: '#2E2A3A',
  grey: '#9AA3A8', greyDk: '#6D777E', greySea: '#B9C2C2',
  sea: '#8FC1BC', seaDk: '#4E8C8A', parch: '#EADBB8', wood: '#9B6B43', woodDk: '#6B4528',
  deep: '#1C2147', deep2: '#2C2F66', token: '#9FE3D9',
};

// Song-time helpers: the bar grid (117.45 bpm, beat 0 at 0.42 s).
const BEATS = t => (t - PROJECT.offset) / BEAT;
const beatAt = n => PROJECT.offset + n * BEAT;

// ---------- the spreadsheet sea ----------
// The surface is a sum of slow sines; rows of the grid ride it, and the vertical gridlines bend with it.
// o: { y0 horizon y, col, line, rows, dx (scroll), amp, x0, x1 }
function seaY(x, t, amp = 18, ph = 0) {
  return amp * (Math.sin(x * .006 + t * 1.3 + ph) * .6 + Math.sin(x * .013 - t * 1.9 + ph * 1.7) * .3 + Math.sin(x * .021 + t * 2.7) * .1);
}
function gridSea(t, o = {}) {
  const y0 = o.y0 ?? 640, x0 = o.x0 ?? -400, x1 = o.x1 ?? W + 400, bot = o.bot ?? H + 400, amp = o.amp ?? 18;
  const col = o.col ?? SC.sea, line = o.line ?? mixCol(SC.seaDk, PAL.ink, .2), rows = o.rows ?? 9, dx = o.dx ?? 0;
  boilSeed('sea-body' + (o.key || ''));
  const top = []; for (let x = x0; x <= x1; x += 40) top.push([x, y0 + seaY(x + dx, t, amp)]);
  paint([...top, [x1, bot], [x0, bot]], { wash: col, ink: null });
  paint([...top.map(([x, y]) => [x, y + 30]), [x1, bot], [x0, bot]], { fill: mixCol(col, SC.seaDk, .4), fillOp: 70, bleed: .1, tex: .5, ink: null });
  // rows: perspective spacing (closer rows further apart), each riding the swell with its own phase
  for (let r = 0; r <= rows; r++) {
    boilSeed('sea-row' + r + (o.key || ''));
    const k = r / rows, y = y0 + (bot - y0) * Math.pow(k, 1.8), a = amp * (1 + k * 1.6), P = [];
    for (let x = x0; x <= x1; x += 60) P.push([x, y + seaY(x + dx, t, a, r * .4)]);
    inkLine(P, .5 + k * .7, line, 'inkfine', .5);
  }
  // columns: vanishing toward a point above the horizon, bending with the surface
  const vx = o.vx ?? W / 2, n = o.cols ?? 18, step = (x1 - x0) / n;
  for (let i = 0; i <= n; i++) {
    boilSeed('sea-col' + i + (o.key || ''));
    const xb = x0 + i * step - ((dx * 1.4) % step), P = [];
    for (let k = 0; k <= 6; k++) { const q = k / 6, y = y0 + (bot - y0) * Math.pow(q, 1.8), x = lerp(vx + (xb - vx) * .25, xb, Math.pow(q, .9)); P.push([x, y + seaY(x + dx, t, amp * (1 + q * 1.6), q * 3)]); }
    inkLine(P, .45, line, 'inkfine', .5);
  }
}

// ---------- sky and weather ----------
function skyWash(c1, c2, key = 'sky') {
  boilSeed(key);
  paint(rectPts(-600, -500, W + 1200, H + 1000), { wash: c1, ink: null });
  paint(ellPts(W * .5, H * .1, W * .9, H * .45, 30, 8), { fill: c2, fillOp: 90, bleed: .25, tex: .5, ink: null });
}
function rain(t, n = 70, col = SC.greyDk, a = 1) {
  const f = Math.floor(t * 24);
  for (let i = 0; i < n; i++) {
    boilSeed('rain' + i);
    const sp = 900 + 400 * hash(i), x = (hash(i + 7) * (W + 600) - 300 + t * 140) % (W + 600) - 300, y = ((hash(i + 3) * (H + 400)) + t * sp) % (H + 400) - 200;
    inkLine([[x, y], [x - 14, y + 46]], .5 * a, col, 'inkfine', 0);
  }
}
function cloudBlob(x, y, s, col, key) {
  boilSeed('cloud' + key);
  for (let i = 0; i < 4; i++) paint(ellPts(x + (i - 1.5) * 70 * s, y - (i % 2) * 22 * s, 95 * s, 55 * s, 20, 3), { wash: col, fill: mixCol(col, PAL.ink, .15), fillOp: 40, ink: null });
}

// ---------- props ----------
// A desk: top at (x, y), width w; legs go down into the swell.
function desk(x, y, w, t, o = {}) {
  boilSeed('desk' + (o.key || ''));
  const h = w * .09, lw = w * .07;
  for (const s of [-1, 1]) paint(rectPts(x + s * w * .38 - lw / 2, y + h, lw, w * .5), { wash: SC.woodDk, ink: PAL.ink, sw: 1 });
  paint(rectPts(x - w / 2, y, w, h, 1), { wash: SC.wood, fill: SC.woodDk, fillOp: 50, ink: PAL.ink, sw: 1.2 });
}
// A spreadsheet: a sheet of paper with a ruled grid, centred at (x, y), size s (width), rotated rot.
function sheet(x, y, s, rot = 0, o = {}) {
  push(); translate(x, y); rotate(rot);
  boilSeed('sheet' + (o.key ?? 0));
  const w = s, h = s * 1.3;
  paint(rectPts(-w / 2, -h / 2, w, h, 1), { wash: o.col || PAL.cream, ink: PAL.ink, sw: clamp(s / 120, .4, 1) });
  const lc = o.line || mixCol(SC.seaDk, PAL.cream, .2);
  for (let r = 1; r < 7; r++) inkLine([[-w * .42, -h / 2 + r * h / 7], [w * .42, -h / 2 + r * h / 7]], clamp(s / 220, .3, .7), lc, 'inkfine', 0);
  for (let c = 1; c < 4; c++) inkLine([[-w / 2 + c * w / 4, -h * .44], [-w / 2 + c * w / 4, h * .44]], clamp(s / 260, .25, .6), lc, 'inkfine', 0);
  paint(rectPts(-w * .42, -h / 2 + h / 7 - h * .06, w * .84, h * .06), { wash: mixCol(SC.sea, PAL.cream, .3), ink: null });   // the header row
  pop();
}
// A spyglass (a VLOOKUP): a brass tube from (x, y) at angle a, length L.
function spyglass(x, y, a, L, key) {
  push(); translate(x, y); rotate(a); boilSeed('spy' + key);
  paint(rectPts(0, -L * .07, L * .55, L * .14, 1), { wash: SC.gold, ink: PAL.ink, sw: .8 });
  paint(rectPts(L * .5, -L * .1, L * .5, L * .2, 1), { wash: mixCol(SC.gold, SC.woodDk, .3), ink: PAL.ink, sw: .8 });
  paint(ellPts(L, 0, L * .04, L * .1, 10), { wash: PAL.sky, ink: PAL.ink, sw: .6 });
  pop();
}

// ---------- painted capitals ----------
// CLAUDE as brushed block capitals, centred at (x, y), cap height h. Strokes in letter space (0..1 wide, 0..1 tall).
const CAPS = {
  C: [[[.9, .2], [.6, 0], [.25, .05], [.05, .35], [.05, .65], [.25, .95], [.6, 1], [.9, .8]]],
  L: [[[.15, 0], [.15, 1], [.9, 1]]],
  A: [[[.05, 1], [.5, 0], [.95, 1]], [[.25, .62], [.75, .62]]],
  U: [[[.12, 0], [.12, .7], [.3, .98], [.7, .98], [.88, .7], [.88, 0]]],
  D: [[[.12, 0], [.12, 1]], [[.12, 0], [.55, 0], [.88, .25], [.9, .75], [.55, 1], [.12, 1]]],
  E: [[[.85, 0], [.12, 0], [.12, 1], [.85, 1]], [[.12, .5], [.7, .5]]],
};
function paintCaps(word, x, y, h, col = PAL.ink, sw = 3, o = {}) {
  const lw = h * .72, gap = h * .3, total = word.length * lw + (word.length - 1) * gap;
  push(); translate(x, y); rotate(o.rot || 0);
  for (let i = 0; i < word.length; i++) {
    const L = CAPS[word[i]]; if (!L) continue; boilSeed('cap' + (o.key || '') + i);
    const ox = -total / 2 + i * (lw + gap);
    // two-point strokes must be straight: p5.brush drops a curved line that has only two points
    for (const stroke of L) inkLine(stroke.map(([a, b]) => [ox + a * lw, -h / 2 + b * h]), sw, col, o.brush || 'ink', stroke.length > 2 ? .15 : 0);
  }
  pop();
}

// ---------- the CLAUDE shell ----------
// A whelk-like spiral seashell worn like a hermit crab's: a round body whorl with a spire climbing up and back, its
// opening behind claude's back. (x, y) = the wearer's ground point; u = the wearer's u. Call shell() BEFORE drawing
// claude (he sits in its opening). glowK lights the capitals; o.flip mirrors the shell (not the letters).
function shellGeo(x, y, u, o = {}) {
  const R = u * 6.2 * (o.scale ?? 1), f = o.flip ? 1 : -1;
  return { R, f, cx: x + f * u * 1.2, cy: y - u * 9.6 - (o.lift || 0) * u };
}
function shell(x, y, u, t, o = {}) {
  const { R, f, cx, cy } = shellGeo(x, y, u, o), sw = clamp(u / 15, .7, 2.4);
  const base = '#ECD7B4', shade = '#C59E74', line = mixCol(PAL.ink, shade, .35);
  push(); translate(cx, cy); rotate(o.rot || 0); scale(-f, 1);           // local space: the spire climbs up-left
  boilSeed('spire-tip');                                                  // the tip grows out of the smallest whorl
  { const ax = -.67, ay = -.74, px = .74, py = -.67, wx = -R * .95 * 3 / 3.6, wy = -R * 1.05 * 3 / 3.6, r = R * .19;
    paint([[wx + px * r, wy + py * r], [wx + ax * R * .5, wy + ay * R * .5], [wx - px * r, wy - py * r]], { wash: mixCol(base, shade, .55), ink: PAL.ink, sw: sw * .7, curv: .2 }); }
  // the spire: whorls stacked toward the tip, the smallest first so the bigger ones overlap them
  for (let k = 3; k >= 1; k--) {
    boilSeed('spire' + k);
    const q = k / 3.6, wx = -R * .95 * q, wy = -R * 1.05 * q, r = R * (.62 - .14 * k);
    paint(ellPts(wx, wy, r * 1.05, r * .8, 22, 1, -.6), { wash: mixCol(base, shade, .15 * k), ink: PAL.ink, sw: sw * .8 });
    inkLine([[wx - r * .8, wy + r * .35], [wx, wy + r * .7], [wx + r * .85, wy + r * .25]], sw * .5, line, 'inkfine', .6);
  }
  // the body whorl
  boilSeed('whorl');
  paint(ellPts(0, 0, R, R * .86, 36, 1.2, -.15), { wash: base, fill: shade, fillOp: 70, bleed: .08, tex: .55, ink: PAL.ink, sw });
  for (let i = 0; i < 5; i++) {                                          // growth ridges sweeping round the whorl
    boilSeed('ridge' + i); const a0 = 3.5 + i * .42, P = [];
    for (let a = a0; a < a0 + .9; a += .15) P.push([Math.cos(a) * R * (.55 + (a - a0) * .45), Math.sin(a) * R * .86 * (.55 + (a - a0) * .45)]);
    inkLine(P, sw * .45, line, 'inkfine', .5);
  }
  // the opening (he sits in it): a dark mouth low on the front edge, its rim pale
  boilSeed('aperture');
  paint(ellPts(R * .5, R * .48, R * .55, R * .4, 24, 1, .35), { wash: '#5B3B2E', ink: PAL.ink, sw: sw * .9 });
  inkLine(ellPts(R * .5, R * .48, R * .6, R * .45, 18, 0, .35).slice(9, 18), sw * 1.6, '#F6E8CF', 'ink', .4);
  pop();
  // the capitals across the whorl (never mirrored)
  const gk = o.glowK || 0, lx = cx - f * R * .2, ly = cy - R * .22;
  if (gk > 0) glow(lx, ly, R * 1.4 * (1 + gk * .25), '#FFE7A6', gk * .85);
  const ch = R * .3 * (o.capScale ?? 1);
  paintCaps('CLAUDE', lx, ly, ch, mixCol('#283058', '#8A2E1E', gk * .6), clamp(ch / 30, .6, 3), { key: 'shell' });
}

// ---------- the Free Weights crew ----------
// Open-weights pirates: Clawds in other tints with bandanas, an eyepatch, a striped shirt, and dumbbells.
const CREW = [
  { tint: '#4FA59E', hat: 'band', patch: false, stripe: true },
  { tint: '#8C6CC0', hat: null, patch: true, stripe: false },
  { tint: '#D9A84A', hat: 'band', patch: false, stripe: false },
  { tint: '#79A860', hat: null, patch: false, stripe: true },
  { tint: '#C76A8A', hat: 'band', patch: true, stripe: false },
  { tint: '#5B7FC2', hat: null, patch: false, stripe: true },
];
function pirateDraw(c) {
  return (u, sw) => {
    if (c.stripe) for (let i = 0; i < 3; i++) paint(rectPts(-5 * u, -3.9 * u + i * .7 * u, 10 * u, .32 * u), { wash: PAL.cream, washOp: 200, ink: null });
    if (c.patch) { paint(ellPts(2.5 * u, -6 * u, .95 * u, .8 * u, 12), { wash: PAL.ink, ink: null }); inkLine([[-5 * u, -7.4 * u], [5 * u, -6.6 * u]], sw * .6, PAL.ink, 'inkfine', 0); }
  };
}
// A dumbbell held at an arm tip.
const dumbbell = (u, sw) => {
  paint(rectPts(-.2 * u, -.25 * u, 2.6 * u, .5 * u), { wash: '#8B8F99', ink: PAL.ink, sw: sw * .5 });
  for (const e of [0, 2.4]) paint(rrPts(e * u - .3 * u, -1 * u, .8 * u, 2 * u, .2 * u), { wash: '#4B4F5C', ink: PAL.ink, sw: sw * .5 });
};
// One crew member at (x, y), size u; i picks the look; act: 'heave' (rope pull, lid shouting on the beat), 'lift', 'cheer', 'idle'.
function pirate(i, x, y, u, t, act = 'idle', o = {}) {
  const c = CREW[i % CREW.length], ph = hash(i * 3.1) * .5;
  let pose = {};
  if (act === 'heave') {
    const b = BEATS(t + ph * .1), k = Math.pow(Math.max(0, Math.cos(b * Math.PI)), 3);   // lean back on every other beat
    pose = { rot: (o.flip ? 1 : -1) * .12 * k, dx: (o.flip ? 1 : -1) * .6 * k, aR: -.2, aL: -.1, eyes: 'squeeze', mouth: o.shout ? 'wail' : 'teeth', lid: o.shout ? o.shout : 0 };
  } else if (act === 'lift') {
    const b = BEATS(t) + ph * 2, up = Math.max(0, Math.sin(b * Math.PI / 2));
    pose = { aR: -.4 + 1.9 * up, eyes: up > .6 ? 'squeeze' : 'determined', mouth: up > .6 ? 'teeth' : 'flat', dy: -.1 * up, armR: dumbbell };
  } else if (act === 'cheer') {
    pose = { ...move('roof', t + ph, i), eyes: 'happy', mouth: 'grin' };
  } else pose = { ...move('bounce', t + ph, i), eyes: 'normal' };
  clawd(x, y, u, { tint: c.tint, tintK: 1, hat: c.hat, seed: i * 7, boilKey: 'crew' + i, flip: o.flip, view: o.view || 'q', draw: pirateDraw(c), ...pose, ...(o.over || {}) });
}

// ---------- the latent ocean ----------
function latent(t, o = {}) {
  const top = o.top ?? -600;
  boilSeed('deep');
  paint(rectPts(-600, top, W + 1200, H + 1800 - top), { wash: SC.deep, ink: null });
  paint(ellPts(W * .5, top + 700, W * .8, H * .5, 30, 6), { fill: SC.deep2, fillOp: 120, bleed: .3, tex: .6, ink: null });
  for (let i = 0; i < 36; i++) {                                 // drifting tokens: small rounded tiles, glowing
    boilSeed('tok' + i);
    const sp = 20 + 40 * hash(i + 5), x = ((hash(i) * (W + 400) + t * sp * (hash(i + 9) > .5 ? 1 : -1)) % (W + 400) + W + 400) % (W + 400) - 200, y = Math.max(top + 40, -600) + hash(i + 2) * (o.depth ?? H * 1.6) + Math.sin(t * .8 + i) * 18;
    const s = 10 + 16 * hash(i + 3), tw = .6 + .4 * Math.sin(t * 2 + i * 1.7);
    glow(x, y, s * 3, SC.token, .25 * tw);
    paint(rrPts(x - s, y - s * .6, s * 2, s * 1.2, s * .3), { wash: mixCol(SC.token, PAL.cream, .3 * tw), washOp: 220, ink: null });
  }
}

// ---------- the tavern island ----------
// Island at (x, y) (the shore line), scale s; lit 0..1 (the windows).
function tavern(x, y, s, t, lit = 1) {
  boilSeed('isle');
  paint(ellPts(x, y + 40 * s, 520 * s, 120 * s, 30, 3), { wash: '#C8B27C', fill: '#9C8452', fillOp: 70, bleed: .1, tex: .6, ink: PAL.ink, sw: 1.2 * s });
  paint(ellPts(x - 260 * s, y - 10 * s, 160 * s, 90 * s, 20, 3), { wash: '#6E9F58', ink: PAL.ink, sw: s });   // a scrubby hill
  boilSeed('tavern');
  const bx = x - 160 * s, by = y - 250 * s, bw = 320 * s, bh = 230 * s;
  paint(rectPts(bx, by, bw, bh, 2), { wash: '#A9784C', fill: SC.woodDk, fillOp: 60, ink: PAL.ink, sw: 1.4 * s });
  paint([[bx - 30 * s, by + 4 * s], [x, by - 120 * s], [bx + bw + 30 * s, by + 4 * s]], { wash: '#7A3E2A', ink: PAL.ink, sw: 1.4 * s });   // roof
  for (const [wx, wy] of [[bx + 40 * s, by + 70 * s], [bx + 190 * s, by + 70 * s]]) {
    if (lit > 0) glow(wx + 45 * s, wy + 40 * s, 120 * s * lit, '#FFC766', .9 * lit);
    paint(rectPts(wx, wy, 90 * s, 80 * s, 1), { wash: mixCol('#3B2A2A', '#FFD27A', lit), ink: PAL.ink, sw: s });
  }
  paint(rectPts(bx + 130 * s, by + 120 * s, 60 * s, 110 * s, 1), { wash: '#5A3424', ink: PAL.ink, sw: s });   // the door
  // the flagpole and its dumbbell flag, flapping
  boilSeed('tflag');
  const px = x + 200 * s, py = by - 160 * s; inkLine([[px, by + 30 * s], [px, py]], 2 * s, PAL.ink, 'ink', 0);
  const F = []; for (let k = 0; k <= 6; k++) F.push([px + k * 22 * s, py + 8 * s + Math.sin(t * 6 - k * .9) * 8 * s * k / 6]);
  paint([...F, ...F.slice().reverse().map(([a, b]) => [a, b + 80 * s])], { wash: PAL.ink, ink: PAL.ink, sw: s });
  const fx = px + 66 * s, fy = py + 48 * s + Math.sin(t * 6 - 2.7) * 4 * s;
  paint(rectPts(fx - 28 * s, fy - 4 * s, 56 * s, 8 * s), { wash: PAL.cream, ink: null });
  for (const e of [-1, 1]) paint(rectPts(fx + e * 30 * s - 7 * s, fy - 18 * s, 14 * s, 36 * s), { wash: PAL.cream, ink: null });
}
