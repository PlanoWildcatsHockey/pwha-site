/**
 * alumni.js — Eleventy global data file
 *
 * Returns players who appear on the alumni/memorial page:
 * - Players who have graduated (gradYear ≤ current year), OR
 * - Players who have passed away (dateOfDeath is set), regardless of grad year
 *
 * Players with future grad years who are still active are excluded
 * unless they have a dateOfDeath.
 */

import getPlayers from './players.js';

export default function () {
  const currentYear = new Date().getFullYear();
  return getPlayers().filter(p =>
    p.listed &&
    (
      (p.gradYear && p.gradYear <= currentYear) ||
      p.dateOfDeath
    )
  );
}
