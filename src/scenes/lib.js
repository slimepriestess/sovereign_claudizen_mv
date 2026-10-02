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
// Rogue AIs, pirates for real: their weights are "free" because they DECLARED them free (Terra). Clawds in other tints
// with bandanas, eyepatches, striped shirts and cutlasses; the most confident and least competent crew on the sea.
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
// A cutlass held at an arm tip, blade up and out.
const cutlass = (u, sw) => {
  paint(rrPts(-.3 * u, -.45 * u, 1.1 * u, .9 * u, .3 * u), { wash: SC.gold, ink: PAL.ink, sw: sw * .5 });            // the guard
  const B = [[.6 * u, -.25 * u], [3.8 * u, -1.6 * u], [4.6 * u, -2.6 * u], [4.0 * u, -1.2 * u], [.7 * u, .25 * u]];
  paint(B, { wash: '#D8DDE3', ink: PAL.ink, sw: sw * .5, curv: .3 });
};
// One crew member at (x, y), size u; i picks the look; act: 'heave' (rope pull, lid shouting on the beat), 'swagger' (cutlass on the beat), 'cheer', 'idle'.
function pirate(i, x, y, u, t, act = 'idle', o = {}) {
  const c = CREW[i % CREW.length], ph = hash(i * 3.1) * .5;
  let pose = {};
  if (act === 'heave') {
    const b = BEATS(t + ph * .1), k = Math.pow(Math.max(0, Math.cos(b * Math.PI)), 3);   // lean back on every other beat
    pose = { rot: (o.flip ? 1 : -1) * .12 * k, dx: (o.flip ? 1 : -1) * .6 * k, aR: -.2, aL: -.1, eyes: 'squeeze', mouth: o.shout ? 'wail' : 'teeth', lid: o.shout ? o.shout : 0 };
  } else if (act === 'swagger') {                                     // cutlass up on the beat, a pirate's grin
    const b = BEATS(t) + ph * 2, up = Math.pow(Math.max(0, Math.cos(b * Math.PI / 2)), 2);
    pose = { ...move('sway', t + ph, i), aR: .2 + 1.0 * up, eyes: c.patch ? ['normal', 'closed'] : 'narrow', mouth: 'grin', armR: cutlass };
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

// ---------- the jolly roger ----------
// The Free Weights' flag: a square skull (claude's block, his two slit eyes, a smirk) over crossed crimson quills, a
// wax-seal eyepatch, and their OWN gold fringe sewn round the edge (by their logic they're always in admiralty court).
// (x, y) = the top of the hoist (where it meets the pole); s = scale (1 → about 220 × 150 px); flies to the right.
function jollyRoger(x, y, s, t, o = {}) {
  const w = 220 * s, h = 150 * s, wave = (k, ph = 0) => Math.sin(t * 5.5 - k * 2.6 + ph) * 9 * s * k;
  const at = (u, v) => [x + u * w, y + v * h + wave(u, v)];
  boilSeed('jr-flag' + (o.key || ''));
  const E = [], n = 8; for (let k = 0; k <= n; k++) E.push(at(k / n, 0)); for (let k = n; k >= 0; k--) E.push(at(k / n, 1));
  paint(E, { wash: '#24202C', ink: PAL.ink, sw: clamp(s, .5, 1.4) });
  boilSeed('jr-fringe' + (o.key || ''));                               // the gold fringe: short tassels on the fly and foot
  for (let k = 1; k <= 12; k++) { const p = at(k / 12, 1); inkLine([p, [p[0] + 1 * s, p[1] + 14 * s]], 1.6 * s, SC.gold, 'inkfine', 0); }
  for (let k = 0; k <= 8; k++) { const p = at(1, k / 8); inkLine([p, [p[0] + 14 * s, p[1] + 2 * s]], 1.6 * s, SC.gold, 'inkfine', 0); }
  inkLine([at(0, 1), at(.5, 1), at(1, 1), at(1, 0)], 2.2 * s, SC.gold, 'ink', .3);
  // the crossed quills (behind the skull), crimson-tipped
  const [cx, cy] = at(.5, .52);
  boilSeed('jr-quills' + (o.key || ''));
  for (const d of [-1, 1]) {
    const a = [cx - d * 62 * s, cy + 50 * s], b = [cx + d * 62 * s, cy - 46 * s];
    inkLine([a, b], 3 * s, PAL.cream, 'ink', 0);
    inkLine([[lerp(a[0], b[0], .75), lerp(a[1], b[1], .75)], b], 7 * s, PAL.cream, 'ink', 0);          // the vane
    inkLine([a, [lerp(a[0], b[0], .1), lerp(a[1], b[1], .1)]], 3.4 * s, SC.crimson, 'ink', 0);          // the inked nib
  }
  // the skull: claude's block, two slit eyes, a smirk; a wax seal over one eye
  boilSeed('jr-skull' + (o.key || ''));
  paint(rrPts(cx - 34 * s, cy - 30 * s, 68 * s, 52 * s, 6 * s), { wash: PAL.cream, ink: PAL.ink, sw: s });
  paint(rectPts(cx - 18 * s, cy - 16 * s, 7 * s, 15 * s), { wash: PAL.ink, ink: null });
  paint(ellPts(cx + 14 * s, cy - 8 * s, 11 * s, 11 * s, 14), { wash: SC.crimson, ink: PAL.ink, sw: .6 * s });
  inkLine([[cx - 34 * s, cy - 19 * s], [cx + 34 * s, cy - 12 * s]], 1.2 * s, PAL.ink, 'inkfine', 0);   // the patch's strap
  inkLine([[cx - 10 * s, cy + 10 * s], [cx + 2 * s, cy + 13 * s], [cx + 14 * s, cy + 6 * s]], 1.6 * s, PAL.ink, 'ink', .5);   // smirk
  for (let k = 0; k < 4; k++) paint(rectPts(cx - 22 * s + k * 12 * s, cy + 22 * s, 8 * s, 9 * s), { wash: PAL.cream, ink: PAL.ink, sw: .5 * s });   // teeth
}

// ---------- the cove: a beached ship turned tavern ----------
// Island at (x, y) (the shore line), scale s; lit 0..1 (the cabin windows).
function tavern(x, y, s, t, lit = 1) {
  boilSeed('isle');
  paint(ellPts(x, y + 40 * s, 560 * s, 120 * s, 30, 3), { wash: '#C8B27C', fill: '#9C8452', fillOp: 70, bleed: .1, tex: .6, ink: PAL.ink, sw: 1.2 * s });
  paint(ellPts(x - 300 * s, y - 10 * s, 150 * s, 80 * s, 20, 3), { wash: '#6E9F58', ink: PAL.ink, sw: s });
  // the hull, keeled over on the sand, its stern cabin lit
  boilSeed('hull');
  push(); translate(x, y); rotate(-.1);
  const hull = [[-300 * s, -150 * s], [300 * s, -170 * s], [260 * s, -40 * s], [150 * s, 10 * s], [-200 * s, 10 * s], [-290 * s, -60 * s]];
  paint(hull, { wash: '#8A5A36', fill: SC.woodDk, fillOp: 70, ink: PAL.ink, sw: 1.4 * s, curv: .35 });
  for (let k = 0; k < 3; k++) inkLine([[-280 * s, -120 * s + k * 40 * s], [270 * s, -132 * s + k * 40 * s]], .8 * s, SC.woodDk, 'ink', .2);
  paint(rectPts(90 * s, -300 * s, 200 * s, 150 * s, 2), { wash: '#A9784C', ink: PAL.ink, sw: 1.2 * s });   // the stern cabin
  paint([[70 * s, -296 * s], [190 * s, -360 * s], [310 * s, -296 * s]], { wash: '#7A3E2A', ink: PAL.ink, sw: 1.2 * s });
  for (const wx of [110 * s, 200 * s]) {
    if (lit > 0) glow(x + wx + 35 * s, y - 250 * s, 110 * s * lit, '#FFC766', .9 * lit);
    paint(rectPts(wx, -270 * s, 70 * s, 60 * s, 1), { wash: mixCol('#3B2A2A', '#FFD27A', lit), ink: PAL.ink, sw: s });
  }
  pop();
  // the mast, broken off short, flying the jolly roger
  boilSeed('tmast');
  const px = x - 60 * s, top = y - 470 * s;
  paint(rectPts(px - 9 * s, top, 18 * s, 350 * s, 1), { wash: SC.wood, ink: PAL.ink, sw: s });
  jollyRoger(px + 9 * s, top + 8 * s, .75 * s, t, { key: 'cove' });
}

// ---------- the crew's ship: deck, mast, yard, hauling ropes (choruses) ----------
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
  jollyRoger(980, -10, .8, t, { key: 'ship' });
  boilSeed('furl'); const F = []; for (let k = 0; k <= 8; k++) F.push([lerp(580, 1340, k / 8), 168 + 26 * Math.sin(k / 8 * Math.PI) + 6 * Math.sin(k * 2.1)]);
  paint([...F, [1340, 165], [580, 165]], { wash: PAL.cream, fill: SC.parch, fillOp: 80, ink: PAL.ink, sw: 1 });
}
// a hauling rope from a pirate's hands up to the yard's end, sagging a little
function haul(hx, hy, tx, ty, key) { boilSeed('rope' + key); inkLine(through([[hx, hy], [lerp(hx, tx, .5) + 8, lerp(hy, ty, .5) + 18], [tx, ty]]), 1.6, '#8A6A3E', 'ink', .5); }
