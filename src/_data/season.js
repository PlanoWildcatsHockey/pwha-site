/**
 * season.js — Eleventy global data file
 *
 * Returns the single active season from seasons.csv.
 * Output shape is identical to the old season.json so no templates change.
 */

import getSeasons from './seasons.js';

export default function () {
  const active = getSeasons().find(s => s.active);
  if (!active) throw new Error('No active season found in sources/seasons.csv');
  return active;
}
