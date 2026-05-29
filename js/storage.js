// ============================================================
//  GamingHub — storage.js
//  Centralised read/write layer with 3-day expiry for events
// ============================================================

const KEYS = {
  EVENTS:    'gh_events',
  POLLS:     'gh_polls',
  CHAT:      'gh_chat',
  LIBRARY:   'gh_library',
  PROFILES:  'gh_profiles',
  SETTINGS:  'gh_settings',
  ME:        'gh_me',
};

const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

function load(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); }
  catch (e) { console.warn('Storage write failed:', e); }
}

// ---- EVENTS ----
function getEvents() {
  const events = load(KEYS.EVENTS) || [];
  const now = Date.now();
  // Remove events older than 3 days past their date
  const fresh = events.filter(e => {
    const eventTime = new Date(e.datetime).getTime();
    return (now - eventTime) < THREE_DAYS_MS;
  });
  if (fresh.length !== events.length) save(KEYS.EVENTS, fresh);
  return fresh.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
}

function addEvent(event) {
  const events = getEvents();
  event.id = 'ev_' + Date.now();
  event.createdAt = new Date().toISOString();
  event.attendees = [];
  events.push(event);
  save(KEYS.EVENTS, events);
  return event;
}

function updateEvent(id, patch) {
  const events = load(KEYS.EVENTS) || [];
  const idx = events.findIndex(e => e.id === id);
  if (idx === -1) return null;
  events[idx] = { ...events[idx], ...patch };
  save(KEYS.EVENTS, events);
  return events[idx];
}

function deleteEvent(id) {
  const events = load(KEYS.EVENTS) || [];
  save(KEYS.EVENTS, events.filter(e => e.id !== id));
}

function rsvpEvent(eventId, username, status) {
  const events = load(KEYS.EVENTS) || [];
  const ev = events.find(e => e.id === eventId);
  if (!ev) return;
  ev.attendees = ev.attendees || [];
  const existing = ev.attendees.find(a => a.username === username);
  if (existing) existing.status = status;
  else ev.attendees.push({ username, status });
  save(KEYS.EVENTS, events);
}

// ---- POLLS ----
function getPolls() {
  const polls = load(KEYS.POLLS) || [];
  const now = Date.now();
  const fresh = polls.filter(p => {
    if (!p.expiresAt) return true;
    return new Date(p.expiresAt).getTime() > now;
  });
  if (fresh.length !== polls.length) save(KEYS.POLLS, fresh);
  return fresh.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function addPoll(poll) {
  const polls = load(KEYS.POLLS) || [];
  poll.id = 'poll_' + Date.now();
  poll.createdAt = new Date().toISOString();
  poll.votes = {};
  polls.push(poll);
  save(KEYS.POLLS, polls);
  return poll;
}

function votePoll(pollId, username, optionIndex) {
  const polls = load(KEYS.POLLS) || [];
  const poll = polls.find(p => p.id === pollId);
  if (!poll) return;
  poll.votes[username] = optionIndex;
  save(KEYS.POLLS, polls);
  return poll;
}

function deletePoll(id) {
  const polls = load(KEYS.POLLS) || [];
  save(KEYS.POLLS, polls.filter(p => p.id !== id));
}

// ---- CHAT ----
function getChat() {
  const messages = load(KEYS.CHAT) || [];
  const now = Date.now();
  // Keep last 200 messages or within 3 days
  return messages
    .filter(m => (now - new Date(m.timestamp).getTime()) < THREE_DAYS_MS)
    .slice(-200);
}

function addMessage(msg) {
  const messages = load(KEYS.CHAT) || [];
  msg.id = 'msg_' + Date.now();
  msg.timestamp = new Date().toISOString();
  messages.push(msg);
  // Keep only last 200
  const trimmed = messages.slice(-200);
  save(KEYS.CHAT, trimmed);
  return msg;
}

function deleteMessage(id) {
  const messages = load(KEYS.CHAT) || [];
  save(KEYS.CHAT, messages.filter(m => m.id !== id));
}

// ---- LIBRARY / WISHLIST ----
function getLibrary() {
  return load(KEYS.LIBRARY) || [];
}

function addGame(game) {
  const lib = getLibrary();
  game.id = 'game_' + Date.now();
  game.addedAt = new Date().toISOString();
  game.votes = [];
  lib.push(game);
  save(KEYS.LIBRARY, lib);
  return game;
}

function updateGame(id, patch) {
  const lib = load(KEYS.LIBRARY) || [];
  const idx = lib.findIndex(g => g.id === id);
  if (idx === -1) return null;
  lib[idx] = { ...lib[idx], ...patch };
  save(KEYS.LIBRARY, lib);
  return lib[idx];
}

function deleteGame(id) {
  const lib = load(KEYS.LIBRARY) || [];
  save(KEYS.LIBRARY, lib.filter(g => g.id !== id));
}

function voteGame(gameId, username) {
  const lib = load(KEYS.LIBRARY) || [];
  const game = lib.find(g => g.id === gameId);
  if (!game) return;
  game.votes = game.votes || [];
  const idx = game.votes.indexOf(username);
  if (idx === -1) game.votes.push(username);
  else game.votes.splice(idx, 1);
  save(KEYS.LIBRARY, lib);
  return game;
}

// ---- PROFILES ----
function getProfiles() {
  return load(KEYS.PROFILES) || [];
}

function getProfile(username) {
  return getProfiles().find(p => p.username === username) || null;
}

function saveProfile(profile) {
  const profiles = load(KEYS.PROFILES) || [];
  const idx = profiles.findIndex(p => p.username === profile.username);
  if (idx === -1) profiles.push(profile);
  else profiles[idx] = profile;
  save(KEYS.PROFILES, profiles);
  return profile;
}

function deleteProfile(username) {
  const profiles = load(KEYS.PROFILES) || [];
  save(KEYS.PROFILES, profiles.filter(p => p.username !== username));
}

// ---- MY PROFILE (active user) ----
function getMe() {
  return load(KEYS.ME);
}

function saveMe(profile) {
  save(KEYS.ME, profile);
  saveProfile(profile);
}

// ---- SETTINGS ----
function getSettings() {
  return load(KEYS.SETTINGS) || {
    bgType: 'default',
    bgValue: '',
    bgEffect: 'scanlines',
    discordWebhook: '',
    discordNotifications: true,
  };
}

function saveSettings(settings) {
  save(KEYS.SETTINGS, settings);
}

// ---- SEED DEMO DATA (first run) ----
function seedIfEmpty() {
  if (getEvents().length === 0) {
    const future1 = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().slice(0,16);
    const future2 = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().slice(0,16);
    addEvent({ title: 'Valorant Ranked Night', game: 'Valorant', datetime: future1, host: 'CyberGhost', description: 'Ranked grind, bring your A-game!', maxPlayers: 5, attendees: [{username:'CyberGhost',status:'going'},{username:'NeonBlade',status:'going'}] });
    addEvent({ title: 'Minecraft Build Battle', game: 'Minecraft', datetime: future2, host: 'NeonBlade', description: 'Creative mode, best build wins a pizza bet.', maxPlayers: 8, attendees: [{username:'NeonBlade',status:'going'}] });
  }
  if (getPolls().length === 0) {
    addPoll({ question: 'Was zocken wir am Wochenende?', options: ['Valorant', 'CS2', 'Minecraft', 'League of Legends'], createdBy: 'CyberGhost', expiresAt: new Date(Date.now() + 2*24*60*60*1000).toISOString(), votes: { NeonBlade: 0, PixelRaider: 2 } });
  }
  if (getLibrary().length === 0) {
    addGame({ title: 'Valorant', genre: 'FPS', status: 'playing', addedBy: 'CyberGhost', cover: '', votes: ['CyberGhost','NeonBlade'] });
    addGame({ title: 'Minecraft', genre: 'Sandbox', status: 'playing', addedBy: 'NeonBlade', cover: '', votes: ['NeonBlade'] });
    addGame({ title: 'Elden Ring', genre: 'RPG', status: 'wishlist', addedBy: 'PixelRaider', cover: '', votes: ['PixelRaider','CyberGhost'] });
    addGame({ title: 'Hell Divers 2', genre: 'Co-op Shooter', status: 'wishlist', addedBy: 'CyberGhost', cover: '', votes: ['CyberGhost'] });
  }
  if (getProfiles().length === 0) {
    saveProfile({ username: 'CyberGhost', bio: 'FPS addict. Headshots only.', status: 'online', color: '#00f5ff', joinedAt: new Date().toISOString() });
    saveProfile({ username: 'NeonBlade', bio: 'Casual gamer, hardcore vibes.', status: 'away', color: '#ff00a0', joinedAt: new Date().toISOString() });
    saveProfile({ username: 'PixelRaider', bio: 'RPG enjoyer. 300h in every game.', status: 'offline', color: '#b400ff', joinedAt: new Date().toISOString() });
  }
  if (getChat().length === 0) {
    const msgs = [
      { author: 'CyberGhost', text: 'yo wer ist heute Abend dabei?', timestamp: new Date(Date.now()-60*60*1000).toISOString() },
      { author: 'NeonBlade', text: 'bin dabei! welche map?', timestamp: new Date(Date.now()-55*60*1000).toISOString() },
      { author: 'PixelRaider', text: 'Pearl oder Bind, mir egal', timestamp: new Date(Date.now()-50*60*1000).toISOString() },
    ];
    msgs.forEach(m => { m.id = 'msg_' + Math.random(); save(KEYS.CHAT, load(KEYS.CHAT) ? [...load(KEYS.CHAT), m] : [m]); });
  }
}

// Export
window.GH = window.GH || {};
window.GH.storage = {
  getEvents, addEvent, updateEvent, deleteEvent, rsvpEvent,
  getPolls, addPoll, votePoll, deletePoll,
  getChat, addMessage, deleteMessage,
  getLibrary, addGame, updateGame, deleteGame, voteGame,
  getProfiles, getProfile, saveProfile, deleteProfile,
  getMe, saveMe,
  getSettings, saveSettings,
  seedIfEmpty,
};
