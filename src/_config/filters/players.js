/**
 * Player filters for src/_data/players.json.
 *
 * The single players.json feeds three template surfaces:
 *   - /teams/varsity/         current Varsity roster
 *   - /teams/junior-varsity/  current JV roster
 *   - /history/players/       full database (no filtering needed; renders all)
 *   - /history/alumni/        former players grouped by graduation year
 *
 * These filters keep template logic minimal — Nunjucks calls them as
 * `{{ players | filterCurrentTeam("varsity") }}` etc.
 */

/**
 * Players currently rostered on a given team.
 * @param {Array} players - the full list (typically Eleventy's `players` global)
 * @param {string} teamSlug - "varsity" or "junior-varsity"
 * @returns {Array} matching players, original order preserved
 */
export const filterCurrentTeam = (players, teamSlug) => {
  if (!Array.isArray(players)) return [];
  return players.filter(p => p.status === 'current' && p.team === teamSlug);
};

/**
 * Players matching a given status.
 * @param {Array} players
 * @param {string} status - "current" or "alumni"
 * @returns {Array}
 */
export const filterStatus = (players, status) => {
  if (!Array.isArray(players)) return [];
  return players.filter(p => p.status === status);
};

/**
 * Group players by graduation year, sorted newest-first.
 *
 * Returns an Array of `{ year, players }` objects rather than a plain
 * keyed Object — JavaScript auto-sorts numeric object keys ascending,
 * which would force oldest-first iteration. Returning an array lets
 * us control the order explicitly.
 *
 * Template usage:
 *   {% set byYear = alums | groupByYear %}
 *   {% for entry in byYear %}
 *     <h2>Class of {{ entry.year }}</h2>
 *     {% for p in entry.players %} ... {% endfor %}
 *   {% endfor %}
 *
 * @param {Array} players
 * @returns {Array<{year: string|number, players: Array}>}
 */
export const groupByYear = players => {
  if (!Array.isArray(players)) return [];
  const grouped = {};
  for (const p of players) {
    const year = p.year ?? 'Unknown';
    if (!grouped[year]) grouped[year] = [];
    grouped[year].push(p);
  }
  return Object.entries(grouped)
    .sort((a, b) => {
      // Numeric desc; "Unknown" or non-numeric goes last
      const aNum = Number(a[0]);
      const bNum = Number(b[0]);
      if (Number.isNaN(aNum)) return 1;
      if (Number.isNaN(bNum)) return -1;
      return bNum - aNum;
    })
    .map(([year, players]) => ({year, players}));
};
