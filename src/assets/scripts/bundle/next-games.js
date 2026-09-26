// Next-game cards ship a few upcoming games from build time. Show the first
// one that hasn't ended yet, so the card stays current between rebuilds,
// then label it with a countdown ("Tomorrow", "In 3 days") and switch the
// card to its game-day look on the day of the game.
const now = Date.now();

// Calendar days between today and the game, counted in the league's time
// zone so a 9 PM game doesn't read as "tomorrow" for a late-night visitor.
const dayKey = date => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Chicago',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  }).formatToParts(date);
  const get = type => Number(parts.find(p => p.type === type).value);
  return Date.UTC(get('year'), get('month') - 1, get('day'));
};
const daysUntil = start => Math.round((dayKey(start) - dayKey(now)) / 86400000);

const countdownLabel = (start, days) => {
  if (start <= now) return 'Live now';
  if (days <= 0) return 'Game day';
  if (days === 1) return 'Tomorrow';
  return `In ${days} days`;
};

document.querySelectorAll('[data-next-game]').forEach(card => {
  const games = card.querySelectorAll('[data-game-end]');
  const next = [...games].find(game => Date.parse(game.dataset.gameEnd) > now);

  games.forEach(game => (game.hidden = game !== next));

  const empty = card.querySelector('[data-next-game-empty]');
  if (empty) empty.hidden = Boolean(next);

  const pill = card.querySelector('[data-countdown]');
  if (!next || !pill) return;

  const start = Date.parse(next.dataset.gameStart);
  const days = daysUntil(start);
  pill.textContent = countdownLabel(start, days);
  pill.hidden = false;
  if (days <= 0) card.dataset.gameday = '';
});
