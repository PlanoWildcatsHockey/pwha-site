# Plano Wildcats Hockey Association — Project Plan

Last updated: 2026-05-16. Owner: Eric Wallace.

## For AI assistants picking this up

Skill at `.claude/skills/eleventy-excellent-frontend/SKILL.md` — read before any frontend changes.
Brand maroon: #641529 (maroon-800 token). Run `npm run colors` after editing colorsBase.json.

## Completed (as of 2026-05-16)

### Design system
- Inter + Lexend via Google Fonts (fonts.json + preloads.njk)
- h1/h2/h3: uppercase + italic (global-styles.css)
- Border radius: 0 (borderRadius.json)
- Sticky header, 2px maroon bottom border
- Nav: uppercase, 0.08em letter-spacing, 4px active underline
- Cards: brutalist 5/8px hard offset box-shadow (local/custom-card.css)
- Hero: maroon bg, left-aligned, brutalist CTAs + stat bar (blocks/hero.css)

### Data pipeline (CSV → Eleventy, no intermediate JSON)
- sources/players.csv + sources/roster.csv → src/_data/players.js (`players` global)
- sources/coaches.csv + sources/coaching-staff.csv → src/_data/coaches.js (`coaches` global)
- src/_data/alumni.js — alumni subset for pagination
- src/_config/utils/parse-csv.js — shared utility (Excel encoding, CRLF, latin1)
- src/_data/season.json — active season ID + league + official ATT MHSHL URLs
- Eleventy watches sources/*.csv

### Current data
- 66 players: 36 current (2026-summer), 30 alumni
- 9 coaches: 6 current (head coaches, assistants, managers for V + JV), 3 former
- Filters: filterCurrentTeam, filterCurrentStaff, filterStatus, groupByYear

## Open tasks

- [ ] Team pages: real roster (sorted by #) + coaching staff (filterCurrentStaff) #1 #pwha
      Files: src/pages/teams/varsity.njk, junior-varsity.njk

- [ ] Alumni profile pages: /history/alumni/{slug}/ via Eleventy pagination #2 #pwha
      Create: src/pages/history/alumni-profile.njk + blocks/player-profile.css
      Members get college, hockey, social links sections.

- [ ] Alumni listing: link to profiles, use gradYear, group by year #3 #pwha
      File: src/pages/history/alumni.njk

- [ ] Player database: new schema (gradYear, number, position, school, status) #4 #pwha
      File: src/pages/history/players.njk

- [ ] Officers page: sources/officers.csv + src/_data/officers.js #5 #pwha
      Source: sources/25-26 Board.md → update src/pages/about/officers.md

- [ ] Blog post audit: image shortcodes, descriptions, OG images #6 #pwha
      Dir: src/posts/2026/

- [ ] Data questions (needs Eric): #7 #pwha
  - Derrick Deraleau: coaches id 5 AND players id 55 — player-coach?
      - Gatewood (35) + Veyan (36): no roster entries — current or alumni?
      - Iverson Herr (20): dual V+JV for 2026-summer — intentional?

- [ ] Visual QA: fonts, headings, cards, hero, dark mode, mobile nav #8 #pwha

## CSV schemas

players.csv: id, first_name, last_name, grad_year, position, shoots, school,
  college, college_hockey, college_hockey_level, post_hs_hockey,
  facebook, instagram, twitter, linkedin, website, member, listed, notes

roster.csv: player_id, season, team, jersey_number

coaches.csv: id, first_name, last_name, email, bio,
  instagram, twitter, linkedin, website, member, listed, notes

coaching-staff.csv: coach_id, season, team, role

Season IDs: 2026-summer (active), 2025-2026, 2025-summer,
  2026-texas-cup, 2025-leveling-festival, 2024-2025

## Still open (original Phase 2)
- Replace OG default image (src/assets/images/template/opengraph-default.jpg)
- Replace Store URL in navigation.js (currently example.com)
- Connect Netlify + DNS for planowildcatshockey.com
- Sponsors data file → support.md
- Run npm run favicons (confirm favicon set exists)
