/**
 * nextGames.js — Eleventy global data file
 *
 * Upcoming games for each team in the active season, pulled at build time
 * from the league's iCal feed (season.varsity.calendarUrl etc.).
 *
 * The site is static, so the home page ships the next few games and a small
 * script hides any that have already ended. Rebuilds only matter for league
 * reschedules. If a feed can't be fetched (and there's no cached copy), that
 * team's card is simply left out — a flaky feed never breaks the build.
 */

import EleventyFetch from '@11ty/eleventy-fetch';
import getSeason from './season.js';
import {parseICS} from '../_config/utils/parse-ics.js';

const TIME_ZONE = 'America/Chicago';
const GAMES_PER_TEAM = 5; // buffer so the client script can skip past games

const dateFormat = new Intl.DateTimeFormat('en-US', {
  timeZone: TIME_ZONE,
  weekday: 'short',
  month: 'short',
  day: 'numeric'
});
const timeFormat = new Intl.DateTimeFormat('en-US', {
  timeZone: TIME_ZONE,
  hour: 'numeric',
  minute: '2-digit'
});

// Our team is whichever name appears in every game ("Plano Senior VB").
const findOwnTeam = games => {
  const counts = new Map();
  for (const {summary} of games) {
    for (const side of summary.split(' @ ')) {
      counts.set(side, (counts.get(side) || 0) + 1);
    }
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
};

// Feed names carry a division suffix ("Frisco VB"); drop it for display.
const stripSuffix = (name, suffix) =>
  suffix && name.endsWith(` ${suffix}`) ? name.slice(0, -suffix.length - 1) : name;

// "Frisco / FR - Stars Rink, 2601 Avenue of the Stars, Frisco, 75034"
const parseLocation = location => {
  if (!location) return {venue: null, address: null};
  const [facility, ...addressParts] = location.split(',').map(s => s.trim());
  const [place, rink] = facility.split(' / ').map(s => s.trim());
  const rinkName = rink?.replace(/^[A-Z]{2,4} - /, ''); // "FR - Stars Rink" → "Stars Rink"
  return {
    venue: rinkName ? `${place} — ${rinkName}` : place,
    address: addressParts.join(', ') || null
  };
};

const toGame = (event, ownTeam, suffix) => {
  const [away, home] = event.summary.split(' @ ');
  const isHome = home === ownTeam;
  const opponent = isHome ? away : home;
  const {venue, address} = parseLocation(event.location);
  // Assume a one-hour slot when the feed omits DTEND.
  const end = event.end || new Date(event.start.getTime() + 60 * 60 * 1000);
  return {
    id: event.uid,
    start: event.start.toISOString(),
    end: end.toISOString(),
    dateLabel: dateFormat.format(event.start),
    timeLabel: timeFormat.format(event.start),
    isHome,
    opponent: stripSuffix(opponent || event.summary, suffix),
    venue,
    address,
    mapUrl: address
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
      : null
  };
};

const loadTeam = async (key, label, links) => {
  if (!links?.calendarUrl) return null;
  try {
    // A cache miss returns a string, but a cache hit comes back as a Buffer.
    const text = await EleventyFetch(links.calendarUrl, {
      duration: '1h',
      type: 'text'
    });
    const events = parseICS(String(text)).filter(e => e.summary?.includes(' @ '));
    const ownTeam = findOwnTeam(events);
    const suffix = ownTeam?.split(' ').at(-1);
    const now = Date.now();
    const games = events
      .map(e => toGame(e, ownTeam, suffix))
      .filter(g => Date.parse(g.end) > now)
      .slice(0, GAMES_PER_TEAM);
    return {key, label, scheduleUrl: links.scheduleUrl, games};
  } catch (err) {
    console.warn(`[nextGames] Could not load ${label} calendar: ${err.message}`);
    return null;
  }
};

export default async function () {
  const season = getSeason();
  const teams = await Promise.all([
    loadTeam('varsity', 'Varsity', season.varsity),
    loadTeam('scholastic', 'Scholastic', season.juniorVarsity)
  ]);
  return teams.filter(Boolean);
}
