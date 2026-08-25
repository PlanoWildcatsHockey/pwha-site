/**
 * Player filters for src/_data/players.json.
 *
 * The single players.json feeds three template surfaces:
 *   - /teams/varsity/         current Varsity roster
 *   - /teams/junior-varsity/  current JV roster
 *   - /players/               full database (no filtering needed; renders all)
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
 * Coaching staff currently assigned to a given team.
 * @param {Array} coaches - the full coaches list (Eleventy's `coaches` global)
 * @param {string} teamSlug - "varsity" or "junior-varsity"
 * @returns {Array}
 */
/**
 * Players who have passed away — used for the In Memoriam section.
 * @param {Array} players
 * @returns {Array}
 */
export const filterDeceased = players => {
  if (!Array.isArray(players)) return [];
  return players.filter(p => p.dateOfDeath);
};

export const filterCurrentStaff = (coaches, teamSlug) => {
  if (!Array.isArray(coaches)) return [];
  return coaches
    .filter(c => c.status === 'current' && c.currentAssignments?.some(a => a.team === teamSlug))
    .map(c => ({
      ...c,
      role: c.currentAssignments.find(a => a.team === teamSlug)?.role ?? c.role
    }));
};

/**
 * Players rostered for a given season, optionally restricted to one team.
 * Each returned player carries a `seasonEntry` field — that season's own
 * jersey number/team/captain designation, since those can differ from the
 * player's current-season values on historical season pages.
 * @param {Array} players
 * @param {string} seasonId - season id, e.g. "2025-2026"
 * @param {string} [teamSlug] - "varsity" or "junior-varsity"
 * @returns {Array} players sorted by that season's jersey number
 */
export const playersInSeason = (players, seasonId, teamSlug) => {
  if (!Array.isArray(players)) return [];
  return players
    .map(p => {
      const seasonEntry = p.seasons.find(s => s.season === seasonId && (!teamSlug || s.team === teamSlug));
      return seasonEntry ? {...p, seasonEntry} : null;
    })
    .filter(Boolean)
    .sort((a, b) => (a.seasonEntry.number ?? Infinity) - (b.seasonEntry.number ?? Infinity));
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
