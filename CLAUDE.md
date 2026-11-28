# Plano Wildcats Hockey site: notes for Claude

Eleventy 3 site (fork of Eleventy Excellent), deployed on Cloudflare from `main`
(`wrangler.toml` serves `./dist`). Frontend conventions live in the
`eleventy-excellent-frontend` skill under `.claude/skills/`.

## Roadmap

Design proposal with mockups: https://claude.ai/artifact/Dy8vBnNd8h2d17HShyr4HH

- Round 1 (rosters, player pages, Barlow Condensed): done.
- Round 2 (news card photos, rink band, game-day scoreboard): done.
- **Round 3: on hold at the user's request (2026-09-26). Don't start it until they say so.**

### Round 3 goals

1. **YouTube feed.** A "From the rink" strip on the home page with the latest
   videos, fetched at build time. The channel's public RSS feed returns 404, so
   use the YouTube Data API. Needs: a free API key created in Google Cloud and
   added to the Cloudflare build environment.
2. **Instagram feed.** Latest posts in the same strip, with thumbnails copied
   onto the site (no Meta embeds, tracking scripts or cookie banner). The
   Instagram API only works for Business or Creator accounts, and its token
   expires every 60 days (the daily build can refresh it). Needs: confirmation
   that @PlanoWildcatsHockey is a Business/Creator account, and someone with
   admin access to set up the Meta app and token. A managed feed service such
   as Behold is a lower-setup alternative.
3. **Facebook: probably skip.** Its posts mostly duplicate Instagram, and the
   Page embed is heavy and adds tracking.
4. **Daily scheduled rebuild.** Needed so TSHL reschedules (the Next Games
   cards come from the league iCal feed) and the social feeds stay current.
   Builds are triggered by Cloudflare's Git integration (pushes); no deploy
   hook exists yet (checked 2026-11-27). Needs: a deploy hook created in the
   Worker's Settings, then a scheduled GitHub Action or Cloudflare cron to
   call it.

### Game photo galleries (on hold, discussed 2026-11-27)

The user wants per-game photo galleries (first candidate: the Nov 18 varsity
Highland Park game; photos are in a Google Drive folder the user owns). On
hold until they say to start. Plan we agreed on:

- Build our own small gallery shortcode rather than adopting
  vpratz/eleventy-plugin-gallery (valentinpratz.de, 2025-05-17). That plugin
  makes you list every image by hand, outputs JPEG only, doesn't escape alt
  text (breaks on quotes such as Hudson "No Mercy" Mun), and needs JS.
- One folder per game, e.g. `src/assets/galleries/2026-11-18-highland-park/`,
  rendered with `{% gallery "2026-11-18-highland-park" %}` in the recap.
- Reuse the existing eleventy-img setup (avif/webp/jpeg) for thumbnails.
  Each thumbnail is a plain link to the large image; PhotoSwipe layers a
  lightbox on top as progressive enhancement.
- Credits/captions from an optional data file in the folder, or one shared
  credit per gallery (e.g. "Photos: Jeff Yu").
- Size: `src/assets/images` is already ~290 MB and Cloudflare builds re-process
  every image. Downsize photos to ~2000 px wide before committing. If
  galleries grow across many games, move photos to Cloudflare R2.
- Getting photos: the Drive folder isn't reachable from here; the user can
  attach a zip or connect Google Drive.

## Waiting on the user

- Four draft posts in `src/posts/2026/2026-09-26-*.md` (`draft: true`). Three
  already have cover photos in their front matter.
- Player pronunciations (last column of `sources/players.csv`) and 2026-27
  positions in `sources/roster.csv` (currently `P` for pending).
- Newer player cards not linked to anyone yet: `26-Cole-Thomas.jpg`,
  `26_Ford_Hansard.jpeg`, `26_Felix_Rivest.jpeg`, `26-Brooks-Harsila.jpg`,
  `26-Rix-Birch.jpg`.

## Gotchas

- `sources/*.csv` are CRLF + latin1. Edit bytes carefully and keep column
  counts equal.
- Player nicknames live in the last column of `sources/players.csv`
  (`nickname`, e.g. Hudson Mun = "No Mercy"). Use them now and then in
  recaps, not every time.
- Game recaps need `recap: true` in their front matter. Posts without an
  `image` get a default logo from `src/posts/posts.11tydata.js`: maroon
  (`default-logo-on-maroon.jpg`) for recaps, white for everything else.
- Goalies on TSHL score sheets aren't named; go by jersey number. Varsity:
  #1 Raudeen Roodgarmi, #35 Andrew Drake. Scholastic: #88 Ayden Shobe,
  #18 Isaac Bywater.
- eleventy-fetch returns a Buffer on cache hits; wrap it with `String()`.
- The `image`/`imageKeys` shortcode writes resized images to `.cache/@11ty/img/`
  and copies the ones each build uses into `dist/assets/images/` after the
  build. Cloudflare's build cache keeps `.cache` between builds, so unchanged
  photos aren't re-encoded (cold build ~7 min, warm ~10 s). If images look
  stale, clear the build cache in Cloudflare or delete `.cache` locally.
- Async shortcodes (`imageKeys`) need `asyncEach`. An `{% include %}` of an
  async partial placed directly inside `{% if %}` renders empty, so put the
  `if` inside the partial.
- New or changed `_data` files need a dev-server restart.
