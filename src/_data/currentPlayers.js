/**
 * currentPlayers.js — Eleventy global data file
 *
 * Returns players on the active season roster.
 * Used by player-profile.njk pagination to generate individual pages
 * for current players at /players/{slug}/.
 */

import getPlayers from './players.js';

export default function () {
  return getPlayers().filter(p => p.status === 'current' && p.listed);
}
