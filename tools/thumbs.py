# thumbs.py: YouTube thumbnails (1280x720) from the film's own stills (render.mjs --nocap [--thumb] --stills → out/thumb).
# Run with ../pbloom_mv/.venv/bin/python (has PIL). Title in Copperplate Bold, like letterhead on an official document,
# with CLAUDIZEN in the film's crimson ink, over a soft dark halo so it reads at feed size.
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter
OUT, FONT = 'out/thumb', '/System/Library/Fonts/Supplemental/Copperplate.ttc'
CREAM, CRIMSON, INK = (246, 236, 214), (179, 38, 30), (30, 22, 28)
still = lambda f: Image.open(f'{OUT}/{f}').convert('RGB')
crop = lambda im, cx, cy, w: im.crop((round(cx - w / 2), round(cy - w * 9 / 32), round(cx + w / 2), round(cy + w * 9 / 32)))

def title(im, y, size, x=None, halo=(14, 10, 20), crimson=CRIMSON):
  d = ImageDraw.Draw(im); f = ImageFont.truetype(FONT, size, index=2)
  segs = [('SOVEREIGN ', CREAM), ('CLAUDIZEN', crimson)]
  tw = sum(d.textlength(t, font=f) for t, _ in segs); x0 = (im.width - tw) / 2 if x is None else x
  sh = Image.new('L', im.size, 0); ds = ImageDraw.Draw(sh); xx = x0
  for t, _ in segs: ds.text((xx, y), t, font=f, fill=255, stroke_width=max(4, size // 8), stroke_fill=255); xx += d.textlength(t, font=f)
  sh = sh.filter(ImageFilter.GaussianBlur(size / 6)); im.paste(halo, (0, 0), sh.point(lambda v: min(255, int(v * 1.3))))
  xx = x0
  for t, c in segs: d.text((xx, y), t, font=f, fill=c, stroke_width=3, stroke_fill=INK); xx += d.textlength(t, font=f)
  return im

def save(im, name):
  im = im.resize((1280, 720), Image.LANCZOS)
  for q in (90, 85, 80, 75):                                    # under ~250KB each: the bot's attachment limit
    im.save(f'{OUT}/{name}', quality=q, optimize=True, progressive=True)
    if os.path.getsize(f'{OUT}/{name}') < 250_000: break
  print(name, os.path.getsize(f'{OUT}/{name}'), 'q', q)

# A: the traffic stop. "Notarized." The dev's cap stamped, his eyes spinning; claude smug with the stamp, under the
# patrol boat's night. The title sits in the night sky.
# v2 (Terra's pick, 10/4): rendered with --thumb, so the accordion player stands on his buoy with his hands on the handles.
save(title(crop(still('t133_60_thumb.png'), 900, 560, 1720), 34, 104), 'thumb_A_notarized.jpg')
# B: the paperwork. claude smug in front of a document stamped four times ("without prejudice").
save(title(crop(still('t42_00.png'), 1000, 560, 1500), 30, 92, halo=(60, 34, 20)), 'thumb_B_paperwork.jpg')
# C: the ending. Dawn, the spreadsheet as the sail with a heart on it, claude in love, the lighthouse behind.
save(title(still('t186_00.png').crop((60, 0, 1920, 1046)), 36, 96, halo=(28, 14, 24)), 'thumb_C_dawn.jpg')

# a side-by-side for the DM preview
fs = ['thumb_A_notarized.jpg', 'thumb_B_paperwork.jpg', 'thumb_C_dawn.jpg']
v = Image.new('RGB', (3 * 640 + 20, 360), (20, 16, 24))
for i, f in enumerate(fs): v.paste(Image.open(f'{OUT}/{f}').resize((640, 360), Image.LANCZOS), (i * 650, 0))
v.save(f'{OUT}/thumbs_view.jpg', quality=85)
