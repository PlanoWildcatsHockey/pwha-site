/**
 * Minimal iCalendar (RFC 5545) parser for league schedule feeds.
 * Handles line folding, escaped text, and UTC / floating / all-day DTSTART
 * values — enough for the DigitalShift game feeds, not a general-purpose
 * calendar library (no RRULE, no TZID lookup).
 *
 * Usage: import { parseICS } from '../utils/parse-ics.js'
 * Returns [{ uid, start: Date, end: Date|null, summary, location }]
 */

const unescapeText = str =>
  str
    .replace(/\\n/gi, '\n')
    .replace(/\\([,;\\])/g, '$1');

// 20260928T004500Z → UTC; 20260928T004500 (floating) and 20260928 (all-day)
// are treated as UTC too, which is close enough for "is this game upcoming?"
const parseDate = value => {
  const m = value.match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2}))?/);
  if (!m) return null;
  const [, y, mo, d, h = '0', mi = '0', s = '0'] = m;
  return new Date(Date.UTC(+y, +mo - 1, +d, +h, +mi, +s));
};

export const parseICS = text => {
  const lines = text
    .replace(/\r\n/g, '\n')
    .replace(/\n[ \t]/g, '') // unfold continuation lines
    .split('\n');

  const events = [];
  let event = null;

  for (const line of lines) {
    if (line === 'BEGIN:VEVENT') {
      event = {};
      continue;
    }
    if (line === 'END:VEVENT') {
      if (event?.start) events.push(event);
      event = null;
      continue;
    }
    if (!event) continue;

    const colon = line.indexOf(':');
    if (colon === -1) continue;
    const name = line.slice(0, colon).split(';')[0].toUpperCase();
    const value = line.slice(colon + 1);

    if (name === 'UID') event.uid = value;
    else if (name === 'DTSTART') event.start = parseDate(value);
    else if (name === 'DTEND') event.end = parseDate(value);
    else if (name === 'SUMMARY') event.summary = unescapeText(value).trim();
    else if (name === 'LOCATION') event.location = unescapeText(value).trim();
  }

  return events.sort((a, b) => a.start - b.start);
};
