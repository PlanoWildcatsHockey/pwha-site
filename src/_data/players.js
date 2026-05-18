/**
 * players.js — Eleventy global data file
 *
 * Reads sources/players.csv (identity) and sources/roster.csv (season
 * memberships) at build time, joins them, and returns the player array
 * that all templates consume as `players`.
 *
 * The dev server watches sources/*.csv and rebuilds when either file changes.
 */

import {readFileSync} from 'node:fs';
import {parseCSV, slugify, orNull} from '../_config/utils/parse-csv.js';

export default function () {
  const seasonRecords = parseCSV(readFileSync('./sources/seasons.csv', 'latin1'));
  const seasonMap = Object.fromEntries(
    seasonRecords.map(s => [s.id, {sortOrder: parseInt(s.sort_order) || 0, name: s.name}])
  );
  const activeSeasonId = seasonRecords.find(s => s.active?.toLowerCase() === 'true')?.id;

  const playerRecords = parseCSV(readFileSync('./sources/players.csv', 'latin1'));
  const rosterRecords = parseCSV(readFileSync('./sources/roster.csv', 'latin1'));

  return playerRecords.map(p => {
    const seasons = rosterRecords
      .filter(r => r.player_id === p.id)
      .map(r => ({
        season: r.season,
        seasonName: seasonMap[r.season]?.name ?? r.season,
        sortOrder: seasonMap[r.season]?.sortOrder ?? 0,
        team: r.team,
        number: parseInt(r.jersey_number) || null,
        captain: orNull(r.captain) // "C", "A", or null
      }));

    const currentEntry = seasons.find(s => s.season === activeSeasonId) ?? null;
    const lastEntry = seasons.at(-1) ?? null;
    const status = currentEntry ? 'current' : 'alumni';

    return {
      id: parseInt(p.id),
      slug: slugify(`${p.first_name} ${p.last_name}`),
      firstName: p.first_name,
      lastName: p.last_name,
      name: `${p.first_name} ${p.last_name}`,
      gradYear: parseInt(p.grad_year) || null,
      year: parseInt(p.grad_year) || null, // alias — keeps existing filters working
      position: orNull(p.position),
      shoots: orNull(p.shoots),
      school: orNull(p.school),
      college: orNull(p.college),
      collegeHockey: orNull(p.college_hockey),
      collegeHockeyLevel: orNull(p.college_hockey_level),
      postHsHockey: orNull(p.post_hs_hockey),
      facebook: orNull(p.facebook),
      instagram: orNull(p.instagram),
      twitter: orNull(p.twitter),
      linkedin: orNull(p.linkedin),
      website: orNull(p.website),
      member: p.member?.toLowerCase() === 'true',
      listed: p.listed?.toLowerCase() !== 'false', // default true when blank
      notes: orNull(p.notes),
      dateOfDeath: orNull(p.date_of_death),
      status,
      team: currentEntry?.team ?? lastEntry?.team ?? null,
      number: currentEntry?.number ?? lastEntry?.number ?? null,
      captain: currentEntry?.captain ?? null, // current season captain designation
      seasons
    };
  }).filter(p => p.listed);
}
