/**
 * officers.js — Eleventy global data file
 *
 * Reads sources/officers.csv and returns PWHA board officers.
 * Officers serve by org year (e.g. 2025-2026), not by hockey season,
 * so "current" is whoever appears in the most recent season in the CSV.
 */

import {readFileSync} from 'node:fs';
import {parseCSV, orNull} from '../_config/utils/parse-csv.js';

export default function () {
  const records = parseCSV(readFileSync('./sources/officers.csv', 'latin1'))
    .filter(r => r.listed?.toLowerCase() !== 'false');

  // All seasons represented, sorted newest first
  const seasons = [...new Set(records.map(r => r.season))].sort().reverse();
  const currentSeason = seasons[0] ?? null;

  const current = records
    .filter(r => r.season === currentSeason)
    .map(r => ({
      role: r.role,
      firstName: r.first_name,
      lastName: r.last_name,
      name: `${r.first_name} ${r.last_name}`,
      email: orNull(r.email)
    }));

  return {
    currentSeason,
    current,
    bySeason: seasons.map(s => ({
      season: s,
      officers: records
        .filter(r => r.season === s)
        .map(r => ({
          role: r.role,
          name: `${r.first_name} ${r.last_name}`,
          email: orNull(r.email)
        }))
    }))
  };
}
