/**
 * coaches.js — Eleventy global data file
 *
 * Reads sources/coaches.csv (identity) and sources/coaching-staff.csv
 * (season-team-role assignments) at build time, joins them, and returns
 * the coaching staff array that templates consume as `coaches`.
 *
 * Season assignments use the same season IDs as roster.csv.
 * Role (Head Coach, Assistant Coach, Goalie Coach, Team Manager, etc.)
 * lives in coaching-staff.csv so it can change season to season.
 */

import {readFileSync} from 'node:fs';
import {parseCSV, slugify, orNull} from '../_config/utils/parse-csv.js';

export default function () {
  const seasonRecords = parseCSV(readFileSync('./sources/seasons.csv', 'latin1'));
  const seasonMap = Object.fromEntries(
    seasonRecords.map(s => [s.id, {sortOrder: parseInt(s.sort_order) || 0, name: s.name}])
  );
  const activeSeasonId = seasonRecords.find(s => s.active?.toLowerCase() === 'true')?.id;

  const coachRecords = parseCSV(readFileSync('./sources/coaches.csv', 'latin1'));
  const staffRecords = parseCSV(readFileSync('./sources/coaching-staff.csv', 'latin1'));

  return coachRecords.map(c => {
    const seasons = staffRecords
      .filter(s => s.coach_id === c.id)
      .map(s => ({
        season: s.season,
        seasonName: seasonMap[s.season]?.name ?? s.season,
        sortOrder: seasonMap[s.season]?.sortOrder ?? 0,
        team: s.team,
        role: s.role
      }));

    const currentEntry = seasons.find(s => s.season === activeSeasonId) ?? null;
    const lastEntry = seasons.at(-1) ?? null;
    const status = currentEntry ? 'current' : 'former';

    return {
      id: parseInt(c.id),
      slug: slugify(`${c.first_name} ${c.last_name}`),
      firstName: c.first_name,
      lastName: c.last_name,
      name: `${c.first_name} ${c.last_name}`,
      email: orNull(c.email),
      bio: orNull(c.bio),
      instagram: orNull(c.instagram),
      twitter: orNull(c.twitter),
      linkedin: orNull(c.linkedin),
      website: orNull(c.website),
      member: c.member?.toLowerCase() === 'true',
      listed: c.listed?.toLowerCase() !== 'false',
      status,
      team: currentEntry?.team ?? lastEntry?.team ?? null,
      role: currentEntry?.role ?? lastEntry?.role ?? null,
      seasons
    };
  }).filter(c => c.listed);
}
