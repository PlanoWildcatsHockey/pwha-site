/**
 * seasons.js — Eleventy global data file
 *
 * All known seasons, read from sources/seasons.csv.
 * ATT MHSHL links are computed from team IDs — no URL duplication.
 * sort_order controls chronological display (higher = more recent).
 */

import {readFileSync} from 'node:fs';
import {parseCSV, orNull} from '../_config/utils/parse-csv.js';

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
    league: {
      name: orNull(s.league_name),
      shortName: orNull(s.league_short),
      division: orNull(s.division)
    },
    varsity: teamLinks(orNull(s.att_league_id), orNull(s.varsity_team_id)),
    juniorVarsity: teamLinks(orNull(s.att_league_id), orNull(s.jv_team_id))
  }));
}
