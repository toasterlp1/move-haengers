/* =============================================
   GAMING HUB — SUPABASE STORAGE
   ============================================= */

const SUPABASE_URL = 'https://cfrbvllagteihxbfswvp.supabase.co';
const SUPABASE_KEY = 'sb_publishable_0rHIRheDwibV3EcARZipGw_VfQHso-d';

const headers = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation'
};

const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

async function sb(path, options = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: { ...headers, ...(options.headers || {}) },
    ...options
  });
  if (!res.ok) { const err = await res.text(); throw new Error(err); }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

function cutoff() {
  return new Date(Date.now() - THREE_DAYS_MS).toISOString();
}

const Store = {

  // ---- EVENTS ----
  async getEvents() {
    return await sb(`events?created_at=gte.${cutoff()}&order=datetime.asc`);
  },
  async addEvent(ev) {
    return await sb('events', {
      method: 'POST',
      body: JSON.stringify({ title: ev.title, datetime: ev.datetime, game: ev.game || null, description: ev.desc || null, max_players: ev.maxPlayers || 5, creator: ev.creator, rsvps: {} })
    });
  },
  async deleteEvent(id) { return await sb(`events?id=eq.${id}`, { method: 'DELETE' }); },
  async rsvpEvent(eventId, username, status) {
    const events = await sb(`events?id=eq.${eventId}`);
    if (!events || !events.length) return;
    const rsvps = events[0].rsvps || {};
    rsvps[username] = status;
    return await sb(`events?id=eq.${eventId}`, { method: 'PATCH', body: JSON.stringify({ rsvps }) });
  },

  // ---- POLLS ----
  async getPolls() { return await sb(`polls?created_at=gte.${cutoff()}&order=created_at.desc`); },
  async addPoll(poll) {
    return await sb('polls', {
      method: 'POST',
      body: JSON.stringify({ question: poll.question, options: poll.options, votes: {}, creator: poll.creator })
    });
  },
  async deletePoll(id) { return await sb(`polls?id=eq.${id}`, { method: 'DELETE' }); },
  async votePoll(pollId, optionIndex, username) {
    const polls = await sb(`polls?id=eq.${pollId}`);
    if (!polls || !polls.length) return;
    const votes = polls[0].votes || {};
    Object.keys(votes).forEach(k => { if (votes[k] && votes[k].username === username) delete votes[k]; });
    votes[`${optionIndex}_${username}_${Date.now()}`] = { optionIndex, username };
    return await sb(`polls?id=eq.${pollId}`, { method: 'PATCH', body: JSON.stringify({ votes }) });
  },
  getUserVoteForPoll(poll, username) {
    if (!poll || !poll.votes) return null;
    const entry = Object.values(poll.votes).find(v => v && v.username === username);
    return entry ? entry.optionIndex : null;
  },

  // ---- GAMES ----
  async getGames() { return await sb(`games?created_at=gte.${cutoff()}&order=created_at.desc`); },
  async addGame(game) {
    return await sb('games', {
      method: 'POST',
      body: JSON.stringify({ name: game.name, genre: game.genre || null, players: game.players || null, comment: game.comment || null, creator: game.creator, votes: [] })
    });
  },
  async deleteGame(id) { return await sb(`games?id=eq.${id}`, { method: 'DELETE' }); },
  async voteGame(gameId, username) {
    const games = await sb(`games?id=eq.${gameId}`);
    if (!games || !games.length) return;
    let votes = games[0].votes || [];
    votes = votes.includes(username) ? votes.filter(u => u !== username) : [...votes, username];
    return await sb(`games?id=eq.${gameId}`, { method: 'PATCH', body: JSON.stringify({ votes }) });
  },

  // ---- ONLINE USERS ----
  async heartbeat(username) {
    try {
      await sb('online_users', {
        method: 'POST',
        headers: { ...headers, 'Prefer': 'resolution=merge-duplicates,return=representation' },
        body: JSON.stringify({ username, last_seen: new Date().toISOString() })
      });
    } catch(e) {}
  },
  async getOnlineUsers() {
    try {
      const since = new Date(Date.now() - 2 * 60 * 1000).toISOString();
      return await sb(`online_users?last_seen=gte.${since}`);
    } catch(e) { return []; }
  },
  async goOffline(username) {
    try {
      await sb(`online_users?username=eq.${encodeURIComponent(username)}`, { method: 'DELETE' });
    } catch(e) {}
  },

  // ---- SETTINGS ----
  getSettings() {
    try {
      return JSON.parse(localStorage.getItem('gh_settings')) || {
        bg: 'rooftop', primaryColor: '#00ff88', secondaryColor: '#ff0066',
        fxParticles: true, fxScanlines: false, fxGlow: true, fxGlitch: true,
        discordWebhook: 'https://discord.com/api/webhooks/1510344494199865405/dG6X7OmsKN9ox38lYHaGMgZeLKAIpncwFMdOtdamxFKOJB_YMKh2q_qKQ8j2KF0HGitW'
      };
    } catch { return {}; }
  },
  saveSettings(s) { localStorage.setItem('gh_settings', JSON.stringify(s)); },

  // ---- USER ----
  getUser() { return localStorage.getItem('gh_user') || ''; },
  setUser(name) { localStorage.setItem('gh_user', name); }
};
