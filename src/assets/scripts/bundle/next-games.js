// Next-game cards ship a few upcoming games from build time. Show the first
// one that hasn't ended yet, so the card stays current between rebuilds.
const now = Date.now();

document.querySelectorAll('[data-next-game]').forEach(card => {
  const games = card.querySelectorAll('[data-game-end]');
  const next = [...games].find(game => Date.parse(game.dataset.gameEnd) > now);

  games.forEach(game => (game.hidden = game !== next));

  const empty = card.querySelector('[data-next-game-empty]');
  if (empty) empty.hidden = Boolean(next);
});
