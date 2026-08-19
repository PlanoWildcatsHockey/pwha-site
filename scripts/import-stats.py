#!/usr/bin/env python3
"""
import-stats.py — merge a HockeyShift/ATT MHSHL skater and/or goalie stats
export into sources/players.csv (new-player stubs) and sources/stats.csv
(per-season stat lines).

Skater CSV columns:  #, Name, Pos, GP, G, A, Pts, PPGA, PIM, PPG, SHG, GWG
Goalie CSV columns:  #, Name, GP, W, L, T, OTL, SA, GA, GAA, Sv, Sv%, SO, MP, PIM, G, A

Name cells sometimes carry a trailing "check" artifact from copy-pasting the
stats site's table (e.g. "Hu, Kaicheck") — stripped before matching.
PIM/MP are "M:SS" text (minutes:seconds) — converted to decimal minutes.

Usage:
  python3 scripts/import-stats.py --season 2026-summer --team varsity \
      --skaters "sources/Team Stats-2.csv" --goalies "sources/Team Stats.csv"

Dry-run by default — prints a report and writes nothing. Pass --apply to
actually update sources/players.csv and sources/stats.csv.
"""

import argparse
import csv
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PLAYERS_CSV = ROOT / 'sources' / 'players.csv'
ROSTER_CSV = ROOT / 'sources' / 'roster.csv'
STATS_CSV = ROOT / 'sources' / 'stats.csv'

STATS_FIELDS = ['player_id', 'season', 'gp', 'g', 'a', 'pts', 'pim', 'ppg', 'shg', 'gwg',
                 'w', 'l', 't', 'otl', 'sa', 'ga', 'sv', 'so', 'mp']


def norm_name(s):
    return ' '.join(s.lower().strip().split())


def clean_name_cell(raw):
    # Strip a trailing "check" copy-paste artifact (case-insensitive, no space).
    return re.sub(r'check\s*$', '', raw.strip(), flags=re.IGNORECASE).strip()


def split_last_first(cell):
    last, first = [p.strip() for p in cell.split(',', 1)]
    return first, last


def minutes_seconds_to_decimal(value):
    value = (value or '').strip()
    if not value:
        return None
    if ':' not in value:
        return round(float(value), 2)
    mins, secs = value.split(':', 1)
    return round(int(mins) + int(secs) / 60, 2)


def read_csv_rows(path):
    with open(path, encoding='latin1', newline='') as f:
        return [row for row in csv.DictReader(f) if any((v or '').strip() for v in row.values())]


def load_players():
    with open(PLAYERS_CSV, encoding='latin1', newline='') as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames
        rows = list(reader)
    by_name = {norm_name(f"{r['first_name']} {r['last_name']}"): r for r in rows}
    next_id = max((int(r['id']) for r in rows), default=0) + 1
    return fieldnames, rows, by_name, next_id


def load_roster_numbers(season, team):
    if not ROSTER_CSV.exists():
        return {}
    with open(ROSTER_CSV, encoding='latin1', newline='') as f:
        rows = [row for row in csv.DictReader(f) if row['season'] == season and row['team'] == team]
    return {row['player_id']: row['jersey_number'] for row in rows}


def load_stats():
    if not STATS_CSV.exists() or STATS_CSV.stat().st_size == 0:
        return {}
    with open(STATS_CSV, encoding='latin1', newline='') as f:
        rows = list(csv.DictReader(f))
    return {(r['player_id'], r['season']): r for r in rows}


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--season', required=True, help='season id, e.g. 2026-summer')
    ap.add_argument('--team', required=True, choices=['varsity', 'junior-varsity'])
    ap.add_argument('--skaters', help='path to skater stats CSV')
    ap.add_argument('--goalies', help='path to goalie stats CSV')
    ap.add_argument('--apply', action='store_true', help='write changes (default: dry run / report only)')
    args = ap.parse_args()

    if not args.skaters and not args.goalies:
        ap.error('pass at least one of --skaters / --goalies')

    fieldnames, player_rows, players_by_name, next_id = load_players()
    roster_numbers = load_roster_numbers(args.season, args.team)
    stats_by_key = load_stats()

    new_players = []
    warnings = []
    stat_lines = {}  # player_id -> dict of stat fields for this run

    def resolve_player(name_cell, number_cell):
        name = clean_name_cell(name_cell)
        first, last = split_last_first(name)
        key = norm_name(f'{first} {last}')
        existing = players_by_name.get(key)
        if existing:
            pid = existing['id']
            roster_num = roster_numbers.get(pid)
            if roster_num and number_cell and roster_num != number_cell.strip():
                warnings.append(
                    f'{name}: sheet jersey #{number_cell.strip()} does not match '
                    f'roster.csv #{roster_num} for {args.season}/{args.team}'
                )
            return pid
        nonlocal next_id
        pid = str(next_id)
        next_id += 1
        stub = {f: '' for f in fieldnames}
        stub.update({'id': pid, 'first_name': first, 'last_name': last, 'listed': 'TRUE'})
        player_rows.append(stub)
        players_by_name[key] = stub
        new_players.append((pid, name))
        warnings.append(f'{name}: no match in players.csv — created stub id={pid} (needs grad_year, etc.)')
        return pid

    if args.skaters:
        for row in read_csv_rows(args.skaters):
            pid = resolve_player(row['Name'], row.get('#', ''))
            stat_lines.setdefault(pid, {}).update({
                'gp': row.get('GP', ''),
                'g': row.get('G', ''),
                'a': row.get('A', ''),
                'pts': row.get('Pts', ''),
                'pim': minutes_seconds_to_decimal(row.get('PIM', '')),
                'ppg': row.get('PPG', ''),
                'shg': row.get('SHG', ''),
                'gwg': row.get('GWG', ''),
            })

    if args.goalies:
        for row in read_csv_rows(args.goalies):
            pid = resolve_player(row['Name'], row.get('#', ''))
            line = stat_lines.setdefault(pid, {})
            line.update({
                'gp': row.get('GP', line.get('gp', '')),
                'w': row.get('W', ''),
                'l': row.get('L', ''),
                't': row.get('T', ''),
                'otl': row.get('OTL', ''),
                'sa': row.get('SA', ''),
                'ga': row.get('GA', ''),
                'sv': row.get('Sv', ''),
                'so': row.get('SO', ''),
                'mp': minutes_seconds_to_decimal(row.get('MP', '')),
                'pim': minutes_seconds_to_decimal(row.get('PIM', '')) or line.get('pim'),
                'g': row.get('G', line.get('g', '')),
                'a': row.get('A', line.get('a', '')),
            })

    # Merge into the stats table (upsert by player_id+season).
    upserts, appends = 0, 0
    for pid, fields in stat_lines.items():
        key = (pid, args.season)
        record = stats_by_key.get(key)
        if record is None:
            record = {f: '' for f in STATS_FIELDS}
            record['player_id'] = pid
            record['season'] = args.season
            stats_by_key[key] = record
            appends += 1
        else:
            upserts += 1
        for f, v in fields.items():
            if v not in (None, ''):
                record[f] = v

    # ---- report ----
    print(f'Season: {args.season}   Team: {args.team}')
    print(f'Skater rows: {len(read_csv_rows(args.skaters)) if args.skaters else 0}')
    print(f'Goalie rows: {len(read_csv_rows(args.goalies)) if args.goalies else 0}')
    print(f'Stat lines resolved: {len(stat_lines)}')
    print(f'  -> {appends} new stats.csv rows, {upserts} updated existing rows')
    if new_players:
        print(f'\nNew player stubs ({len(new_players)}):')
        for pid, name in new_players:
            print(f'  id={pid}  {name}')
    if warnings:
        print(f'\nWarnings ({len(warnings)}):')
        for w in warnings:
            print(f'  - {w}')

    if not args.apply:
        print('\nDry run — no files written. Re-run with --apply to write changes.')
        return

    # ---- write players.csv ----
    with open(PLAYERS_CSV, 'w', encoding='latin1', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(player_rows)

    # ---- write stats.csv ----
    with open(STATS_CSV, 'w', encoding='latin1', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=STATS_FIELDS)
        writer.writeheader()
        for key in sorted(stats_by_key, key=lambda k: (k[1], int(k[0]))):
            writer.writerow(stats_by_key[key])

    print(f'\nWrote {PLAYERS_CSV.relative_to(ROOT)} and {STATS_CSV.relative_to(ROOT)}.')


if __name__ == '__main__':
    main()
