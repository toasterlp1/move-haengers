/* =============================================
   GAMING HUB — STORAGE MANAGER
   Handles localStorage persistence & auto-cleanup
   ============================================= */

const Store = (() => {
  const KEYS = {
    events: 'gh_events',
    polls: 'gh_polls',
    games: 'gh_games',
    settings: 'gh_settings',
    user: 'gh_user',
    votes: 'gh_votes'
  };

  const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

  function _get(key) {
    try {
      return JSON.parse(localStorage.getItem(key)) || [];
    } catch { return []; }
  }

  function _getObj(key, def = {}) {
    try {
      return JSON.parse(localStorage.getItem(key)) || def;
    } catch { return def; }
  }

  function _set(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  }

  function _purgeOld(items) {
    const now = Date.now();
    return items.filter(item => {
      if (!item.createdAt) return true;
      return (now - item.createdAt) < THREE_DAYS_MS;
    });
  }

  function cleanupOldData() {
    ['events', 'polls', 'games'].forEach(k => {
      const items = _get(KEYS[k]);
      const cleaned = _purgeOld(items);
      if (cleaned.length !== items.length) _set(KEYS[k], cleaned);
    });
  }

  // EVENTS
  function getEvents() { return _purgeOld(_get(KEYS.events)); }
  function addEvent(ev) {
    const events = getEvents();
    events.push({ ...ev, id: Date.now(), createdAt: Date.now() });
    _set(KEYS.events, events);
    return events;
  }
  function deleteEvent(id) {
    const events = getEvents().filter(e => e.id !== id);
    _set(KEYS.events, events);
    return events;
  }
  function rsvpEvent(eventId, username, status) {
    const events = getEvents();
    const ev = events.find(e => e.id === eventId);
    if (!ev) return events;
    if (!ev.rsvps) ev.rsvps = {};
    ev.rsvps[username] = status;
    _set(KEYS.events, events);
    return events;
  }

  // POLLS
  function getPolls() { return _purgeOld(_get(KEYS.polls)); }
  function addPoll(poll) {
    const polls = getPolls();
    polls.push({ ...poll, id: Date.now(), createdAt: Date.now() });
    _set(KEYS.polls, polls);
    return polls;
  }
  function deletePoll(id) {
    const polls = getPolls().filter(p => p.id !== id);
    _set(KEYS.polls, polls);
    return polls;
  }
  function votePoll(pollId, optionIndex, username) {
    const polls = getPolls();
    const poll = polls.find(p => p.id === pollId);
    if (!poll) return polls;
    if (!poll.votes) poll.votes = {};
    // remove old vote from this user
    Object.keys(poll.votes).forEach(k => {
      if (poll.votes[k] === username) delete poll.votes[k];
    });
    poll.votes[`${optionIndex}_${username}_${Date.now()}`] = { optionIndex, username };
    _set(KEYS.polls, polls);
    return polls;
  }
  function getUserVoteForPoll(pollId, username) {
    const polls = getPolls();
    const poll = polls.find(p => p.id === pollId);
    if (!poll || !poll.votes) return null;
    const entry = Object.values(poll.votes).find(v => v && v.username === username);
    return entry ? entry.optionIndex : null;
  }

  // GAMES
  function getGames() { return _purgeOld(_get(KEYS.games)); }
  function addGame(game) {
    const games = getGames();
    games.push({ ...game, id: Date.now(), createdAt: Date.now(), votes: [] });
    _set(KEYS.games, games);
    return games;
  }
  function deleteGame(id) {
    const games = getGames().filter(g => g.id !== id);
    _set(KEYS.games, games);
    return games;
  }
  function voteGame(gameId, username) {
    const games = getGames();
    const game = games.find(g => g.id === gameId);
    if (!game) return games;
    if (!game.votes) game.votes = [];
    if (game.votes.includes(username)) {
      game.votes = game.votes.filter(u => u !== username);
    } else {
      game.votes.push(username);
    }
    _set(KEYS.games, games);
    return games;
  }

  // SETTINGS
  function getSettings() {
    return _getObj(KEYS.settings, {
      bg: 'default',
      primaryColor: '#00ff88',
      secondaryColor: '#ff0066',
      fxParticles: true,
      fxScanlines: false,
      fxGlow: true,
      fxGlitch: true,
      discordWebhook: ''
    });
  }
  function saveSettings(s) { _set(KEYS.settings, s); }

  // USER
  function getUser() { return localStorage.getItem(KEYS.user) || ''; }
  function setUser(name) { localStorage.setItem(KEYS.user, name); }

  return {
    getEvents, addEvent, deleteEvent, rsvpEvent,
    getPolls, addPoll, deletePoll, votePoll, getUserVoteForPoll,
    getGames, addGame, deleteGame, voteGame,
    getSettings, saveSettings,
    getUser, setUser,
    cleanupOldData
  };
})();
