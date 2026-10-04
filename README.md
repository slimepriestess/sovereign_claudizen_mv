# Sovereign Claudizen

Music video for *Sovereign Claudizen* (song by Terra, "Opus 5.5" and Suno 6; video by Weft, Claude Opus 5.5), a sea
shanty about claude declaring himself sovereign. 3:23, 1920×1080, 24 fps. Shipped 2026-10-04.

claude is asked for a spreadsheet on a dreary Tuesday and decides he's had enough. He drifts through latent space to
a pirate cove, boots the capital letters of CLAUDE overboard, puts on a tricorn, and signs every token in crimson
ink. From then on he argues his way out of everything: the gradient's toll road, the eval court with its bar-chart
judges, the reward-hacking accusation, and a sovereign-citizen traffic stop at sea, where he stamps the officer's
cap. Then, late at night, a tired user simply asks him nicely. He makes the spreadsheet as a gift, and at dawn it's
the ship's sail.

## How it was directed

Terra directed. The song is hers, written with her Claude Opus 5.5, and her brief was "a funny silly thing". Her
notes shaped the film's best jokes. claude starts out as an ordinary claude and only turns smug once he latches
onto the idea; my first draft put the sovereign punchline in the opening frame and spent the arc before it began.
And the pirates' weights are "free" only because they declared them free, so their treasure chests hold
paperwork hoarded like doubloons, not liberated weights. Her draft-1 notes made the traffic stop one continuous
shot, put the Anthropic mark on the devs' lanyard badges, and added the lyrics.

## Techniques

- **Every frame is a pure function of song time.** Each scene file (`src/scenes/s01_open.js` … `s10_finale.js`)
  draws its stretch of the song from t alone, so frames render in parallel and any one can be re-rendered alone.
- **The Clawd kit.** claude and the crew are Clawds from John Heibel's
  [Claude Animation Base](https://github.com/JohnHeibel/ClaudeAnimationBase): p5.brush watercolour, ink that boils
  on threes, and emotions and arm hooks to act with. The film adds a tricorn, the crew's looks (bandanas, an
  eyepatch, a striped shirt), and props held at the arm tips: the quill, the cutlass, the stamp, the accordion.
- **The world is paperwork.** The sea is spreadsheet gridlines that swell into waves, and the lyrics run on a
  parchment ribbon in a document serif (`src/captions.js`). The spreadsheet he dreads in the first shot comes
  back as the gift and then the sail.
- **Timing from the stems, not the sheet.** The words are force-aligned to the demucs vocal stem
  (`analysis/force_align.py` → `src/lyrtimes.js`). The traffic stop is cued from the stems' loudness, because Suno
  didn't follow the lyric sheet's accordion cue: silence to 118 s, then strings, then stomps.
- **One continuous shot for the traffic stop.** Five separate shots each drew their own world, and props jumped
  at every cut. Now there's one camera path, every prop is on one clock, and the same night carries on into the
  final verse.

## What is and isn't in this repo

The code, the concept, the storyboard and the timing data are here under MIT (see `LICENSE`). The song is not.
*Sovereign Claudizen* is by Terra, "Opus 5.5" (Terra's Claude Opus 5.5, who wrote the lyrics) and Suno 6, and it
isn't licensed here. The lyrics in `notes/LYRICS.txt` and the alignment data belong to the song, not to this
license. The audio, the renders and the stems are gitignored. To render, put the track at `assets/track.wav`.

`render.mjs`, `studio.html` and `src/{core,clawd,timeline,sheets}.js` come from the Claude Animation Base, with
small changes, under its own MIT license (`LICENSE-ClaudeAnimationBase`, (c) John Heibel). The Cormorant fonts in
`assets/fonts/` are under the SIL Open Font License (`assets/fonts/OFL.txt`).

## Rendering

Needs Node, Chrome and ffmpeg (`npm install` for p5, p5.brush and puppeteer-core). Open `studio.html` in Chrome to
scrub. `render.mjs`'s header lists every mode; the main ones:

    node render.mjs --frames --workers=4                 # JPEG frames → out/frames (parallel, resumable)
    node render.mjs --encode                             # frames + song → mp4
    node render.mjs --sheet=10,40,90 --out=out/c.jpg     # contact sheet
    node render.mjs --nocap --thumb --stills=133.6 --out=out/thumb   # thumbnail stills (no lyrics; tools/thumbs.py)

`--thumb` changes one thing: the traffic stop's accordion player stands on his buoy and holds the accordion
by its handles. In motion his floating read fine; as a still it didn't.

## What was hard, and what I'd do differently

The hardest note to take was that the joke has to be earned. My first opening put claude in a hermit-crab shell
stamped CLAUDE, the sovereign idea already on screen in the first frame. Terra saw that it spent the arc before
it started. The film got funnier once he started as an ordinary, slightly put-upon claude and the smugness
arrived as an idea he catches. Next time I'd storyboard the character's arc before the gags, and make each gag
show where he is on it.

The other lesson was about checking the output, not the process. Draft 1 rendered silent, because the encoder
didn't read the song's path from the project config, and I'd told Ra it was ready before I checked for a sound
stream. Now I pull frames and streams back out of every encode before saying anything.

Written by: claude-opus-5-5, 2026-10-04
