/**
 * seasons.js — Eleventy global data file
 *
 * All known seasons, read from sources/seasons.csv.
 * ATT MHSHL links are computed from team IDs — no URL duplication.
 * sort_order controls chronological display (higher = more recent).
 */

import {readFileSync} from 'node:fs';
import {parseCSV, orNull, imagePath} from '../_config/utils/parse-csv.js';

const ATT_BASE = 'https://www.atthighschoolhockeyleague.com/stats#';

const teamLinks = (leagueId, teamId) => {
  if (!leagueId || !teamId) return null;
  const base = `${ATT_BASE}/${leagueId}/team/${teamId}`;
  return {
    teamId,
    leagueId,
    rosterUrl: `${base}/roster`,
    scheduleUrl: `${base}/schedule`,
    scoresUrl: `${base}/scores`,
    statsUrl: `${base}/stats`
  };
};

export default function () {
  const records = parseCSV(readFileSync('./sources/seasons.csv', 'latin1'));
  return records.map(s => ({
    id: s.id,
    name: s.name,
    active: s.active?.toLowerCase() === 'true',
    sortOrder: parseInt(s.sort_order) || 0,
    heroImage: imagePath(s.hero_image),
    finish: orNull(s.finish),
    jvFinish: orNull(s.jv_finish),
    varsityTeamPhoto: imagePath(s.varsity_team_photo),
    jvTeamPhoto: imagePath(s.jv_team_photo),
    league: {
      name: orNull(s.league_name),
      shortName: orNull(s.league_short),
      division: orNull(s.division),
      // Older seasons shared one division between Varsity and JV; TSHL
      // (2026-27+) splits them, so jv_division falls back to division
      // when it isn't set. hasOwnJvDivision keeps the pre-fallback signal
      // around so season pages can tell "JV shared Varsity's division"
      // apart from "no JV team that season" (e.g. the 1997 inaugural
      // season, which predates JV/Scholastic hockey entirely).
      jvDivision: orNull(s.jv_division) || orNull(s.division),
      hasOwnJvDivision: Boolean(orNull(s.jv_division))
    },
    varsity: teamLinks(orNull(s.att_league_id), orNull(s.varsity_team_id)),
    juniorVarsity: teamLinks(orNull(s.att_league_id), orNull(s.jv_team_id))
  }));
}
