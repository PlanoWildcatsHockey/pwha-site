/**
 * Shared CSV parsing utilities for Eleventy data files.
 * Handles Excel-exported CSVs: CRLF line endings, Windows-1252 / Mac Roman
 * encoding artifacts, quoted fields, and empty trailing rows.
 *
 * Usage: import { parseCSV, slugify, orNull } from '../utils/parse-csv.js'
 * Read files with { encoding: 'latin1' } so bytes are preserved before fixing.
 */

import {existsSync} from 'node:fs';
import path from 'node:path';

export const fixEncoding = str =>
  str
    .replace(/\xd5/g, "'")   // Mac Roman left single quote (O'Neill)
    .replace(/\x92/g, "'")   // Windows-1252 right single quote
    .replace(/\x91/g, "'")   // Windows-1252 left single quote
    .replace(/\x85/g, '...') // Windows-1252 ellipsis
    .replace(/[\x80-\xff]/g, ''); // strip remaining non-ASCII stray bytes

export const parseCSV = text => {
  const lines = text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .filter(l => l.replace(/,/g, '').trim());
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  return lines.slice(1).map(line => {
    const values = [];
    let current = '';
    let inQuotes = false;
    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    return Object.fromEntries(
      headers.map((h, i) => [h, fixEncoding((values[i] ?? '').trim())])
    );
  }).filter(row => Object.values(row).some(v => v));
};

export const slugify = str =>
  str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const orNull = v => (v && v.trim()) ? v.trim() : null;

export const orBool = (v, defaultVal = false) =>
  v == null ? defaultVal : v.toLowerCase() === 'true';

/**
 * Normalizes a CSV image filename (or already-absolute web path) to an
 * absolute /assets/images/... path, and confirms the file actually exists
 * on disk — a filename entered in a CSV before the file is uploaded
 * shouldn't break the whole site build.
 */
export const imagePath = filename => {
  const file = orNull(filename);
  if (!file) return null;
  const webPath = file.startsWith('/') ? file : `/assets/images/${file}`;
  return existsSync(path.join('./src', webPath)) ? webPath : null;
};
