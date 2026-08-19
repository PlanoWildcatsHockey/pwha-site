import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';

dayjs.extend(utc);

// Frontmatter dates like `2026-05-10` are parsed by YAML as UTC midnight.
// Formatting in the build machine's local timezone (e.g. America/Chicago)
// would roll that back to the previous day, so read/display them as UTC —
// these are calendar dates, not moments in time.

/** Converts the given date string to ISO8610 format. */
export const toISOString = dateString => dayjs.utc(dateString).toISOString();

/** Formats a date using dayjs's conventions: https://day.js.org/docs/en/display/format */
export const formatDate = (date, format) => dayjs.utc(date).format(format);
