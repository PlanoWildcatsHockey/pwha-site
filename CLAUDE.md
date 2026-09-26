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
   Needs: how Cloudflare builds are triggered (Git integration vs. a deploy
   hook URL), then a scheduled GitHub Action or Cloudflare cron to trigger it.

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
- eleventy-fetch returns a Buffer on cache hits; wrap it with `String()`.
- Async shortcodes (`imageKeys`) need `asyncEach`. An `{% include %}` of an
  async partial placed directly inside `{% if %}` renders empty, so put the
  `if` inside the partial.
- New or changed `_data` files need a dev-server restart.
