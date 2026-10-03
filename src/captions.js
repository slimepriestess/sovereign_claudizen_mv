// captions.js: the lyrics (Ra + Terra's draft-1 note 3). The current line on a slim parchment ribbon at the bottom, in
// Cormorant (a document serif, for a film made of paperwork). Each word inks in on its onset: a flash of crimson (the
// signature colour) settling to ink; words not yet sung sit faint. The spoken-word sections are set in italic.
// Drawn on the output canvas after the painted frame and before the grain, so the ribbon sits in the paper.
const CAP = (() => {
  const L = [];
  const curly = w => w.replace(/^"/, '\u201C').replace(/"/g, '\u201D').replace(/'/g, '\u2019');     // typographic quotes
  for (const s of LYRT) for (const l of s.lines) L.push({ ...l, words: l.words.map(([w, t]) => [curly(w), t]), spoken: s.sec.startsWith('Spoken') });
  return L.map((l, i) => {
    const next = i + 1 < L.length ? L[i + 1].t0 : Infinity, last = l.words[l.words.length - 1][1];
    return { ...l, a: l.t0 - .35, b: Math.min(next - .05, last + 1.4) };
  });
})();
const CAP_INK = '43,34,51', CAP_RED = [168, 32, 44];
function caption(c, t) {
  const l = CAP.find(l => t >= l.a && t < l.b);
  if (!l) return;
  const a = clamp((t - l.a) / .2) * clamp((l.b - t) / .2);
  const size = 46, font = `${l.spoken ? 'italic ' : ''}600 ${size}px "Cormorant"`;
  c.save(); c.font = font; c.textBaseline = 'alphabetic'; c.textAlign = 'left';
  const gap = size * .28, ws = l.words.map(w => c.measureText(w[0]).width), total = ws.reduce((s, v) => s + v, 0) + gap * (ws.length - 1);
  const y = H - 70, x0 = W / 2 - total / 2, pad = 42, top = y - size * .95, h = size * 1.45, notch = 18;
  // the ribbon: parchment with swallow-tail ends and an ink edge
  c.globalAlpha = a;
  c.beginPath();
  c.moveTo(x0 - pad - notch, top); c.lineTo(x0 + total + pad + notch, top); c.lineTo(x0 + total + pad, top + h / 2); c.lineTo(x0 + total + pad + notch, top + h);
  c.lineTo(x0 - pad - notch, top + h); c.lineTo(x0 - pad, top + h / 2); c.closePath();
  c.fillStyle = 'rgba(241,226,191,.93)'; c.fill();
  c.lineWidth = 2.2; c.strokeStyle = `rgba(${CAP_INK},.85)`; c.stroke();
  c.beginPath(); c.moveTo(x0 - pad + 6, top + 6); c.lineTo(x0 + total + pad - 6, top + 6); c.moveTo(x0 - pad + 6, top + h - 6); c.lineTo(x0 + total + pad - 6, top + h - 6);
  c.lineWidth = 1; c.strokeStyle = `rgba(${CAP_INK},.3)`; c.stroke();
  // the words
  let x = x0;
  l.words.forEach(([w, wt], j) => {
    const sung = t >= wt, k = sung ? clamp((t - wt) / .45) : 0;
    const col = sung ? `rgb(${CAP_RED.map((v, i) => Math.round(lerp(v, [43, 34, 51][i], ease(k)))).join(',')})` : `rgba(${CAP_INK},.32)`;
    const hop = sung ? -Math.exp(-(t - wt) * 12) * 6 : 0;
    c.fillStyle = col; c.fillText(w, x, y + hop);
    x += ws[j] + gap;
  });
  c.restore();
}
