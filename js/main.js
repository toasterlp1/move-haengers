// ─────────────────────────────────────────────
//  OPBASE — Main Entry Point
// ─────────────────────────────────────────────
import { supabase }          from './supabase.js';
import { state, login, getSavedUser, logout, toast, openModal, closeModal, sendDiscord } from './app.js';
import { loadSessions, createSession, rsvpSession, deleteSession, renderSessions } from './sessions.js';
import { loadPolls, createPoll, vote, deletePoll, renderPolls }                     from './polls.js';
import { loadPlayers, updateMyProfile, renderCrew, renderMyProfile }                from './players.js';
import { loadGames, addGame, deleteGame, renderLibrary }                            from './games.js';
import { loadTheme, applyTheme, renderThemeUI, getPreset, getCurrentTheme }         from './theme.js';

// ── Init ──────────────────────────────────────
(async function init() {
  loadTheme();
  renderThemeUI();

  const saved = getSavedUser();
  if (saved) {
    try {
      await login(saved);
      hideLogin();
      await loadAll();
      renderAll();
      subscribeRealtime();
    } catch { showLogin(); }
  } else {
    showLogin();
  }
})();

async function loadAll() {
  await Promise.all([loadPlayers(), loadSessions(), loadPolls(), loadGames()]);
}

function renderAll() {
  renderDashboard();
  renderSessions('sessions-list');
  renderPolls('polls-list');
  renderCrew('crew-list');
  renderMyProfile();
  renderLibrary('game-library');
  renderThemeUI();
  updateNavBadges();
}

// ── Login / Logout ────────────────────────────
function showLogin() { document.getElementById('login-screen').classList.remove('hidden'); }
function hideLogin() { document.getElementById('login-screen').classList.add('hidden'); }

document.getElementById('login-form').addEventListener('submit', async e => {
  e.preventDefault();
  const name = document.getElementById('callsign').value.trim();
  try {
    await login(name);
    hideLogin();
    await loadAll();
    renderAll();
    subscribeRealtime();
    toast(`Willkommen, ${name}!`);
  } catch (err) {
    document.getElementById('login-error').textContent = 'Fehler: ' + (err.message || 'Unbekannt');
  }
});

document.getElementById('logout-btn')?.addEventListener('click', () => {
  logout();
  location.reload();
});

// ── Navigation ────────────────────────────────
const PAGES = ['dashboard','sessions','polls','crew','library','settings'];

window.showPage = function(id) {
  PAGES.forEach(p => {
    document.getElementById(`page-${p}`)?.classList.toggle('active', p === id);
    document.getElementById(`nav-${p}`)?.classList.toggle('active', p === id);
  });
  if (id === 'settings') renderThemeUI();
};

document.querySelectorAll('[data-page]').forEach(btn => {
  btn.addEventListener('click', () => window.showPage(btn.dataset.page));
});

// ── Dashboard ─────────────────────────────────
function renderDashboard() {
  // Next session
  const upcoming = state.sessions.filter(s => new Date(s.datetime) > new Date());
  const next = upcoming[0];
  const nextEl = document.getElementById('dash-next');
  if (nextEl) {
    nextEl.innerHTML = next
      ? `<div class="dash-time">${new Date(next.datetime).toLocaleString('de-DE',{weekday:'short',day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})}</div>
         <div class="dash-label">${next.title}${next.game?' — '+next.game:''}</div>`
      : `<div class="dash-label muted">Keine Sessions geplant</div>`;
  }

  const onlineCount = state.players.filter(p => p.status === 'online').length;
  document.getElementById('dash-online')?.setAttribute('data-val', onlineCount);
  document.getElementById('dash-online-label')?.setAttribute('data-val', `von ${state.players.length}`);
  document.getElementById('dash-polls')?.setAttribute('data-val', state.polls.length);

  // Mini session list
  renderSessions('dash-sessions');
  // Mini crew list
  renderCrew('dash-crew');
}

function updateNavBadges() {
  const pollBadge = document.getElementById('polls-badge');
  if (pollBadge) {
    const unvoted = state.polls.filter(p =>
      !(p.poll_votes || []).some(v => v.player_name === state.currentUser?.name)
    ).length;
    pollBadge.textContent = unvoted || '';
    pollBadge.classList.toggle('hidden', !unvoted);
  }
}

// ── Sessions ──────────────────────────────────
document.getElementById('session-form')?.addEventListener('submit', async e => {
  e.preventDefault();
  const f = e.target;
  try {
    await createSession({
      title:    f.title.value.trim(),
      datetime: f.datetime.value,
      game:     f.game.value.trim(),
      note:     f.note.value.trim(),
    });
    renderSessions('sessions-list');
    renderDashboard();
    closeModal('session-modal');
    f.reset();
    toast('Session erstellt!');
  } catch (err) { toast('Fehler: ' + err.message, 'error'); }
});

window.rsvp = async (id, answer) => {
  try { await rsvpSession(id, answer); renderSessions('sessions-list'); renderDashboard(); }
  catch(e) { toast(e.message, 'error'); }
};

window.delSession = async (id) => {
  await deleteSession(id); renderSessions('sessions-list'); renderDashboard();
  toast('Session gelöscht.');
};

// ── Polls ─────────────────────────────────────
document.getElementById('poll-form')?.addEventListener('submit', async e => {
  e.preventDefault();
  const f = e.target;
  const opts = [f.opt1.value, f.opt2.value, f.opt3.value, f.opt4.value]
    .map(o => o.trim()).filter(Boolean);
  if (opts.length < 2) { toast('Mindestens 2 Optionen!', 'error'); return; }
  try {
    await createPoll({ question: f.question.value.trim(), options: opts });
    renderPolls('polls-list');
    updateNavBadges();
    closeModal('poll-modal');
    f.reset();
    toast('Abstimmung gestartet!');
  } catch (err) { toast('Fehler: ' + err.message, 'error'); }
});

window.castVote = async (pollId, idx) => {
  try { await vote(pollId, idx); renderPolls('polls-list'); updateNavBadges(); }
  catch(e) { toast(e.message, 'error'); }
};

window.delPoll = async (id) => {
  await deletePoll(id); renderPolls('polls-list'); updateNavBadges();
  toast('Abstimmung gelöscht.');
};

// ── Crew ──────────────────────────────────────
document.getElementById('profile-form')?.addEventListener('submit', async e => {
  e.preventDefault();
  const status = document.getElementById('status-select').value;
  const bio    = document.getElementById('bio-input').value;
  try {
    await updateMyProfile({ status, bio });
    renderCrew('crew-list');
    renderMyProfile();
    renderDashboard();
    toast('Profil gespeichert!');
  } catch (err) { toast('Fehler: ' + err.message, 'error'); }
});

// ── Library ───────────────────────────────────
document.getElementById('game-form')?.addEventListener('submit', async e => {
  e.preventDefault();
  const f = e.target;
  try {
    await addGame({
      name:        f.name.value.trim(),
      genre:       f.genre.value,
      max_players: f.max_players.value,
      platform:    f.platform.value.trim(),
    });
    renderLibrary('game-library');
    closeModal('game-modal');
    f.reset();
    toast('Spiel hinzugefügt!');
  } catch (err) { toast('Fehler: ' + err.message, 'error'); }
});

window.delGame = async (id) => {
  await deleteGame(id); renderLibrary('game-library');
  toast('Spiel gelöscht.');
};

document.getElementById('genre-filter')?.addEventListener('change', () => renderLibrary('game-library'));
document.getElementById('game-search')?.addEventListener('input',  () => renderLibrary('game-library'));

// ── Settings: Webhook ─────────────────────────
document.getElementById('webhook-form')?.addEventListener('submit', e => {
  e.preventDefault();
  const url = document.getElementById('webhook-input').value.trim();
  state.webhookUrl = url;
  localStorage.setItem('opbase_webhook', url);
  toast(url ? 'Webhook gespeichert!' : 'Webhook entfernt.');
  document.getElementById('webhook-status').textContent = url ? '✔ Webhook aktiv' : '–';
  document.getElementById('webhook-status').className = url ? 'status-ok' : '';
});

document.getElementById('webhook-test')?.addEventListener('click', async () => {
  if (!state.webhookUrl) { toast('Kein Webhook konfiguriert!', 'error'); return; }
  await sendDiscord('🟢 **OPBASE** — Verbindungstest erfolgreich! Die Basis ist aktiv.');
  toast('Test-Nachricht gesendet!');
});

// ── Settings: Theme ───────────────────────────
window.applyPreset = (id) => {
  const p = getPreset(id);
  if (!p) return;
  applyTheme({ ...p, effect: getCurrentTheme().effect });
  renderThemeUI();
};

window.setFx = (fx) => {
  applyTheme({ ...getCurrentTheme(), effect: fx });
  renderThemeUI();
};

document.getElementById('custom-theme-form')?.addEventListener('submit', e => {
  e.preventDefault();
  const bg     = document.getElementById('bg-picker').value;
  const accent = document.getElementById('accent-picker').value;
  // derive surface from bg
  const num = parseInt(bg.slice(1), 16);
  const shift = n => Math.min(255, n + 14);
  const r = shift((num >> 16) & 0xff);
  const g = shift((num >> 8) & 0xff);
  const b = shift(num & 0xff);
  const surface = '#' + [r,g,b].map(x=>x.toString(16).padStart(2,'0')).join('');
  applyTheme({ bg, surface, accent, effect: getCurrentTheme().effect });
  renderThemeUI();
  toast('Theme angewendet!');
});

// ── Settings: Reset ───────────────────────────
document.getElementById('reset-btn')?.addEventListener('click', async () => {
  if (!confirm('Alle Sessions, Polls und Bibliotheks-Daten löschen?')) return;
  await Promise.all([
    supabase.from('sessions').delete().neq('id', 0),
    supabase.from('polls').delete().neq('id', 0),
    supabase.from('games').delete().neq('id', 0),
  ]);
  await loadAll(); renderAll();
  toast('Daten zurückgesetzt.');
});

// ── Modals (global) ───────────────────────────
document.querySelectorAll('.modal-overlay').forEach(m => {
  m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open'); });
});
document.querySelectorAll('[data-modal-open]').forEach(btn => {
  btn.addEventListener('click', () => openModal(btn.dataset.modalOpen));
});
document.querySelectorAll('[data-modal-close]').forEach(btn => {
  btn.addEventListener('click', () => closeModal(btn.dataset.modalClose));
});

// ── Realtime Subscriptions ────────────────────
function subscribeRealtime() {
  supabase.channel('opbase-live')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'sessions' }, async () => {
      await loadSessions(); renderSessions('sessions-list'); renderDashboard();
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'rsvps' }, async () => {
      await loadSessions(); renderSessions('sessions-list'); renderDashboard();
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'polls' }, async () => {
      await loadPolls(); renderPolls('polls-list'); updateNavBadges();
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'poll_votes' }, async () => {
      await loadPolls(); renderPolls('polls-list');
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'players' }, async () => {
      await loadPlayers(); renderCrew('crew-list'); renderDashboard();
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'games' }, async () => {
      await loadGames(); renderLibrary('game-library');
    })
    .subscribe();
}

// Heartbeat — update last_seen so others see you as online
setInterval(() => {
  if (state.currentUser) {
    supabase.from('players')
      .update({ last_seen: new Date().toISOString() })
      .eq('id', state.currentUser.id);
  }
}, 60_000);

// Mark offline on tab close
window.addEventListener('beforeunload', () => {
  if (state.currentUser) {
    navigator.sendBeacon('/api/offline', JSON.stringify({ id: state.currentUser.id }));
    supabase.from('players').update({ status: 'offline' }).eq('id', state.currentUser.id);
  }
});
