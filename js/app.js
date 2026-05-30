/* =============================================
   GAMING HUB — MAIN APPLICATION
   ============================================= */

// ---- STATE ----
let currentUser = '';
let settings = {};

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  Store.cleanupOldData();
  settings = Store.getSettings();
  applySettings(settings);

  const savedUser = Store.getUser();
  if (savedUser) {
    currentUser = savedUser;
    showApp();
  }

  bindUI();
  setInterval(() => { Store.cleanupOldData(); renderAll(); }, 60 * 1000);
});

// ---- UI BINDINGS ----
function bindUI() {
  // Login
  document.getElementById('login-btn').addEventListener('click', doLogin);
  document.getElementById('login-input').addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });

  // Nav
  document.getElementById('open-settings').addEventListener('click', () => openModal('modal-settings'));
  document.getElementById('change-user-btn').addEventListener('click', () => {
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('app').classList.add('hidden');
    document.getElementById('login-input').value = '';
    setTimeout(() => document.getElementById('login-input').focus(), 100);
  });

  // Quick Actions
  document.getElementById('qa-event').addEventListener('click', () => openModal('modal-event'));
  document.getElementById('qa-poll').addEventListener('click', () => openModal('modal-poll'));
  document.getElementById('qa-game').addEventListener('click', () => openModal('modal-game'));
  document.getElementById('qa-discord').addEventListener('click', pingDiscordAll);

  // Modal closes
  document.querySelectorAll('.modal-close, .btn-cancel').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.modal;
      if (id) closeModal(id);
    });
  });
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeModal(overlay.id);
    });
  });

  // Save actions
  document.getElementById('save-event').addEventListener('click', saveEvent);
  document.getElementById('save-poll').addEventListener('click', savePoll);
  document.getElementById('save-game').addEventListener('click', saveGame);
  document.getElementById('save-settings').addEventListener('click', saveSettings);

  // Add poll option
  document.getElementById('add-poll-option').addEventListener('click', () => {
    const container = document.getElementById('poll-options-container');
    const inp = document.createElement('input');
    inp.type = 'text';
    inp.className = 'poll-option-input';
    const n = container.children.length + 1;
    inp.placeholder = `Option ${n}...`;
    container.appendChild(inp);
  });

  // Settings live
  document.getElementById('color-primary').addEventListener('input', e => {
    document.documentElement.style.setProperty('--primary', e.target.value);
    ParticleSystem.setColor(e.target.value);
  });
  document.getElementById('color-secondary').addEventListener('input', e => {
    document.documentElement.style.setProperty('--secondary', e.target.value);
  });
  document.querySelectorAll('.bg-preset').forEach(btn => {
    btn.addEventListener('click', () => applyBg(btn.dataset.bg));
  });
  document.getElementById('fx-particles').addEventListener('change', e => {
    ParticleSystem.setEnabled(e.target.checked);
  });
  document.getElementById('fx-scanlines').addEventListener('change', e => {
    document.getElementById('scanlines').classList.toggle('hidden', !e.target.checked);
  });
  document.getElementById('fx-glow').addEventListener('change', e => {
    document.body.classList.toggle('no-glow', !e.target.checked);
  });
  document.getElementById('fx-glitch').addEventListener('change', e => {
    document.querySelectorAll('.login-glitch, .hero-name').forEach(el => {
      el.classList.toggle('glitch-off', !e.target.checked);
    });
  });
}

// ---- LOGIN ----
function doLogin() {
  const inp = document.getElementById('login-input');
  const name = inp.value.trim();
  if (!name) { showToast('Gib deinen Gamertag ein!', 'error'); return; }
  if (name.length < 2) { showToast('Mindestens 2 Zeichen!', 'error'); return; }
  currentUser = name;
  Store.setUser(name);
  showApp();
}

function showApp() {
  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
  document.getElementById('nav-username-display').textContent = currentUser;
  document.getElementById('hero-greet').textContent = 'WILLKOMMEN,';
  document.getElementById('hero-name').textContent = currentUser.toUpperCase();
  const hours = new Date().getHours();
  let sub = 'Was geht heute ab?';
  if (hours < 6) sub = 'Nachtschicht? Lets go 🌙';
  else if (hours < 12) sub = 'Frühes Zocken ist das beste Zocken ☀️';
  else if (hours < 18) sub = 'Nachmittags-Session gefällig?';
  else sub = 'Abend-Runde starten? 🎮';
  document.getElementById('hero-sub').textContent = sub;
  renderAll();
  loadSettingsForm();
}

// ---- RENDER ALL ----
function renderAll() {
  renderEvents();
  renderPolls();
  renderGames();
  updateStats();
}

// ---- EVENTS ----
function saveEvent() {
  const title = document.getElementById('event-title').value.trim();
  const dt = document.getElementById('event-datetime').value;
  const game = document.getElementById('event-game').value.trim();
  const desc = document.getElementById('event-desc').value.trim();
  const maxp = parseInt(document.getElementById('event-maxplayers').value) || 5;

  if (!title || !dt) { showToast('Titel & Datum sind Pflicht!', 'error'); return; }

  Store.addEvent({ title, datetime: dt, game, desc, maxPlayers: maxp, creator: currentUser, rsvps: {} });
  closeModal('modal-event');
  clearModal('modal-event');
  renderEvents();
  updateStats();
  showToast('Session erstellt! 🚀');
  sendDiscordNotification(`📅 **Neue Gaming-Session!**\n**${title}**\nvon **${currentUser}**\nSpiel: ${game || 'TBD'}\nWann: ${formatDateTime(dt)}\nMax. Spieler: ${maxp}`);
}

function renderEvents() {
  const list = document.getElementById('events-list');
  const events = Store.getEvents().sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
  document.getElementById('badge-events').textContent = events.length;

  if (!events.length) {
    list.innerHTML = '<div class="empty-state">Keine Sessions geplant.<br/>Seid ihr lazy?? 😤</div>';
    return;
  }

  list.innerHTML = events.map(ev => {
    const rsvps = ev.rsvps || {};
    const yes = Object.entries(rsvps).filter(([,v]) => v === 'yes').map(([k]) => k);
    const no = Object.entries(rsvps).filter(([,v]) => v === 'no').map(([k]) => k);
    const maybe = Object.entries(rsvps).filter(([,v]) => v === 'maybe').map(([k]) => k);
    const myRsvp = rsvps[currentUser];
    const isPast = new Date(ev.datetime) < new Date();

    return `<div class="event-card ${isPast ? 'past' : ''}">
      <div class="card-title">${escHtml(ev.title)}</div>
      <div class="card-meta">
        <span>📅 ${formatDateTime(ev.datetime)}</span>
        ${ev.game ? `<span>🎮 ${escHtml(ev.game)}</span>` : ''}
        <span>👥 Max. ${ev.maxPlayers}</span>
      </div>
      ${ev.desc ? `<div class="card-desc">${escHtml(ev.desc)}</div>` : ''}
      <div class="rsvp-area">
        <div class="rsvp-btns">
          <button class="rsvp-btn yes ${myRsvp === 'yes' ? 'active' : ''}" onclick="rsvp(${ev.id},'yes')">✓ Dabei (${yes.length})</button>
          <button class="rsvp-btn maybe ${myRsvp === 'maybe' ? 'active' : ''}" onclick="rsvp(${ev.id},'maybe')">? Vielleicht (${maybe.length})</button>
          <button class="rsvp-btn no ${myRsvp === 'no' ? 'active' : ''}" onclick="rsvp(${ev.id},'no')">✗ Nicht da (${no.length})</button>
        </div>
        ${yes.length ? `<div class="rsvp-count">✓ ${yes.join(', ')}</div>` : ''}
      </div>
      <div class="card-footer">
        <div class="card-author">von <span>${escHtml(ev.creator)}</span></div>
        ${ev.creator === currentUser ? `<button class="card-delete" onclick="deleteEvent(${ev.id})">✕ Löschen</button>` : ''}
      </div>
    </div>`;
  }).join('');
}

function rsvp(eventId, status) {
  Store.rsvpEvent(eventId, currentUser, status);
  renderEvents();
}

function deleteEvent(id) {
  if (!confirm('Session wirklich löschen?')) return;
  Store.deleteEvent(id);
  renderEvents();
  updateStats();
  showToast('Session gelöscht.');
}

// ---- POLLS ----
function savePoll() {
  const question = document.getElementById('poll-question').value.trim();
  const opts = [...document.querySelectorAll('.poll-option-input')]
    .map(i => i.value.trim()).filter(Boolean);

  if (!question) { showToast('Gib eine Frage ein!', 'error'); return; }
  if (opts.length < 2) { showToast('Mindestens 2 Optionen!', 'error'); return; }

  Store.addPoll({ question, options: opts, creator: currentUser, votes: {} });
  closeModal('modal-poll');
  clearModal('modal-poll');
  renderPolls();
  updateStats();
  showToast('Umfrage gestartet! 🗳️');
  sendDiscordNotification(`🗳️ **Neue Umfrage von ${currentUser}!**\n**${question}**\n${opts.map((o,i) => `${i+1}. ${o}`).join('\n')}\n\nJetzt abstimmen auf der GamingHub Website!`);
}

function renderPolls() {
  const list = document.getElementById('polls-list');
  const polls = Store.getPolls().sort((a, b) => b.createdAt - a.createdAt);
  document.getElementById('badge-polls').textContent = polls.length;

  if (!polls.length) {
    list.innerHTML = '<div class="empty-state">Keine aktiven Umfragen.<br/>Starte eine!</div>';
    return;
  }

  list.innerHTML = polls.map(poll => {
    const voteValues = Object.values(poll.votes || {}).filter(v => v && typeof v === 'object');
    const total = voteValues.length;
    const myVote = Store.getUserVoteForPoll(poll.id, currentUser);

    const optionsHtml = (poll.options || []).map((opt, i) => {
      const count = voteValues.filter(v => v.optionIndex === i).length;
      const pct = total ? Math.round(count / total * 100) : 0;
      const isVoted = myVote === i;
      return `<div class="poll-option">
        <div class="poll-option-label">
          <span>${escHtml(opt)}</span>
          <span>${count} (${pct}%)</span>
        </div>
        <div class="poll-bar-bg"><div class="poll-bar-fill" style="width:${pct}%"></div></div>
        <button class="poll-vote-btn ${isVoted ? 'voted' : ''}" onclick="votePoll(${poll.id},${i})">
          ${isVoted ? '✓ Meine Wahl' : 'Abstimmen'}
        </button>
      </div>`;
    }).join('');

    return `<div class="poll-card">
      <div class="card-title">${escHtml(poll.question)}</div>
      <div class="card-meta"><span>📊 ${total} Stimmen</span></div>
      ${optionsHtml}
      <div class="card-footer">
        <div class="card-author">von <span>${escHtml(poll.creator)}</span></div>
        ${poll.creator === currentUser ? `<button class="card-delete" onclick="deletePoll(${poll.id})">✕ Löschen</button>` : ''}
      </div>
    </div>`;
  }).join('');
}

function votePoll(pollId, optionIndex) {
  Store.votePoll(pollId, optionIndex, currentUser);
  renderPolls();
}

function deletePoll(id) {
  if (!confirm('Umfrage wirklich löschen?')) return;
  Store.deletePoll(id);
  renderPolls();
  updateStats();
  showToast('Umfrage gelöscht.');
}

// ---- GAMES ----
function saveGame() {
  const name = document.getElementById('game-name').value.trim();
  const genre = document.getElementById('game-genre').value;
  const players = document.getElementById('game-players').value.trim();
  const comment = document.getElementById('game-comment').value.trim();

  if (!name) { showToast('Gib einen Game-Namen ein!', 'error'); return; }

  Store.addGame({ name, genre, players, comment, creator: currentUser });
  closeModal('modal-game');
  clearModal('modal-game');
  renderGames();
  updateStats();
  showToast('Game vorgeschlagen! 🎮');
}

function renderGames() {
  const list = document.getElementById('games-list');
  const games = Store.getGames().sort((a, b) => (b.votes || []).length - (a.votes || []).length);
  document.getElementById('badge-games').textContent = games.length;

  if (!games.length) {
    list.innerHTML = '<div class="empty-state">Keine Games vorgeschlagen.<br/>Was zocken wir?</div>';
    return;
  }

  list.innerHTML = games.map(game => {
    const votes = game.votes || [];
    const hasVoted = votes.includes(currentUser);
    return `<div class="game-card">
      <div class="genre-badge">${escHtml(game.genre)}</div>
      <div class="card-title">${escHtml(game.name)}</div>
      ${game.players ? `<div class="card-meta"><span>👥 ${escHtml(game.players)}</span></div>` : ''}
      ${game.comment ? `<div class="card-desc">${escHtml(game.comment)}</div>` : ''}
      <div class="game-votes">
        <button class="game-vote-btn ${hasVoted ? 'voted' : ''}" onclick="voteGame(${game.id})">
          ${hasVoted ? '♥ MOCHTE ICH' : '♡ WILL ICH'}
        </button>
        <span class="game-vote-count">${votes.length}</span>
      </div>
      <div class="card-footer">
        <div class="card-author">von <span>${escHtml(game.creator)}</span></div>
        ${game.creator === currentUser ? `<button class="card-delete" onclick="deleteGame(${game.id})">✕ Löschen</button>` : ''}
      </div>
    </div>`;
  }).join('');
}

function voteGame(gameId) {
  Store.voteGame(gameId, currentUser);
  renderGames();
}

function deleteGame(id) {
  if (!confirm('Game-Vorschlag wirklich löschen?')) return;
  Store.deleteGame(id);
  renderGames();
  updateStats();
  showToast('Game entfernt.');
}

// ---- STATS ----
function updateStats() {
  document.getElementById('count-events').textContent = Store.getEvents().length;
  document.getElementById('count-polls').textContent = Store.getPolls().length;
}

// ---- SETTINGS ----
function loadSettingsForm() {
  const s = Store.getSettings();
  document.getElementById('color-primary').value = s.primaryColor || '#00ff88';
  document.getElementById('color-secondary').value = s.secondaryColor || '#ff0066';
  document.getElementById('fx-particles').checked = s.fxParticles !== false;
  document.getElementById('fx-scanlines').checked = !!s.fxScanlines;
  document.getElementById('fx-glow').checked = s.fxGlow !== false;
  document.getElementById('fx-glitch').checked = s.fxGlitch !== false;
  document.getElementById('discord-webhook').value = s.discordWebhook || '';
  document.querySelectorAll('.bg-preset').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.bg === s.bg);
  });
}

function saveSettings() {
  const s = {
    bg: document.querySelector('.bg-preset.active')?.dataset.bg || 'default',
    primaryColor: document.getElementById('color-primary').value,
    secondaryColor: document.getElementById('color-secondary').value,
    fxParticles: document.getElementById('fx-particles').checked,
    fxScanlines: document.getElementById('fx-scanlines').checked,
    fxGlow: document.getElementById('fx-glow').checked,
    fxGlitch: document.getElementById('fx-glitch').checked,
    discordWebhook: document.getElementById('discord-webhook').value.trim()
  };
  Store.saveSettings(s);
  settings = s;
  applySettings(s);
  closeModal('modal-settings');
  showToast('Einstellungen gespeichert ✓');
}

function applySettings(s) {
  document.documentElement.style.setProperty('--primary', s.primaryColor || '#00ff88');
  document.documentElement.style.setProperty('--secondary', s.secondaryColor || '#ff0066');

  applyBg(s.bg || 'default', false);

  ParticleSystem.setColor(s.primaryColor || '#00ff88');
  ParticleSystem.setEnabled(s.fxParticles !== false);

  document.getElementById('scanlines').classList.toggle('hidden', !s.fxScanlines);
  document.body.classList.toggle('no-glow', !s.fxGlow && s.fxGlow !== undefined);

  document.querySelectorAll('.login-glitch, .hero-name').forEach(el => {
    el.classList.toggle('glitch-off', s.fxGlitch === false);
  });
}

function applyBg(bg, updateBtn = true) {
  const overlay = document.getElementById('bg-overlay');
  const bgMap = {
    default: 'radial-gradient(ellipse at 30% 20%, rgba(0,255,136,0.04) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(0,204,255,0.04) 0%, transparent 60%)',
    neon: 'radial-gradient(ellipse at 20% 50%, rgba(150,0,255,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, rgba(0,100,255,0.08) 0%, transparent 60%)',
    forest: 'radial-gradient(ellipse at 50% 0%, rgba(0,200,50,0.08) 0%, transparent 70%)',
    blood: 'radial-gradient(ellipse at 50% 100%, rgba(200,0,30,0.1) 0%, transparent 60%)',
    gold: 'radial-gradient(ellipse at 50% 0%, rgba(255,180,0,0.08) 0%, transparent 70%)',
    void: 'none'
  };
  overlay.style.background = bgMap[bg] || bgMap.default;

  if (updateBtn) {
    document.querySelectorAll('.bg-preset').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.bg === bg);
    });
  }
}

// ---- DISCORD WEBHOOK ----
async function sendDiscordNotification(message) {
  const s = Store.getSettings();
  if (!s.discordWebhook) return;
  try {
    await fetch(s.discordWebhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: message, username: 'GamingHub 🎮' })
    });
  } catch (e) {
    console.warn('Discord webhook failed:', e);
  }
}

async function pingDiscordAll() {
  const s = Store.getSettings();
  if (!s.discordWebhook) {
    showToast('Zuerst Discord Webhook in Settings eintragen!', 'error');
    openModal('modal-settings');
    return;
  }
  const msg = `🎮 **@everyone – ${currentUser} ruft zum Zocken!**\nKommt auf Discord, Zeit für eine Runde! 🔥`;
  await sendDiscordNotification(msg);
  showToast('Alle wurden gepingt! 📣', 'info');
}

// ---- MODALS ----
function openModal(id) {
  document.getElementById(id).classList.remove('hidden');
  if (id === 'modal-settings') loadSettingsForm();
}

function closeModal(id) {
  document.getElementById(id).classList.add('hidden');
}

function clearModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.querySelectorAll('input[type="text"], input[type="number"], textarea').forEach(el => el.value = '');
  if (modalId === 'modal-event') {
    document.getElementById('event-maxplayers').value = '5';
  }
  if (modalId === 'modal-poll') {
    const c = document.getElementById('poll-options-container');
    c.innerHTML = `<input type="text" class="poll-option-input" placeholder="Option 1..." />
                   <input type="text" class="poll-option-input" placeholder="Option 2..." />`;
  }
}

// ---- TOAST ----
function showToast(msg, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'toast-out 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ---- HELPERS ----
function escHtml(str) {
  if (!str) return '';
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function formatDateTime(dtStr) {
  if (!dtStr) return '';
  try {
    return new Date(dtStr).toLocaleString('de-DE', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  } catch { return dtStr; }
}
