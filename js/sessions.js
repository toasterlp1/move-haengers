// ─────────────────────────────────────────────
//  OPBASE — Sessions Module
// ─────────────────────────────────────────────
import { supabase } from './supabase.js';
import { state, toast, sendDiscord, formatDateTime, isExpired } from './app.js';

export async function loadSessions() {
  const { data, error } = await supabase
    .from('sessions')
    .select('*, rsvps(*)')
    .order('datetime', { ascending: true });
  if (error) { console.error(error); return; }
  // Filter out sessions older than 3 days
  state.sessions = (data || []).filter(s => !isExpired(s.datetime));
}

export async function createSession({ title, datetime, game, note }) {
  const { data, error } = await supabase
    .from('sessions')
    .insert({ title, datetime, game, note, created_by: state.currentUser.name })
    .select()
    .single();
  if (error) throw error;
  await loadSessions();

  const dtStr = formatDateTime(datetime);
  await sendDiscord(
    `🎮 **NEUE SESSION** — geplant von **${state.currentUser.name}**\n` +
    `📌 **${title}**\n🕐 ${dtStr}` +
    (game ? `\n🎯 Spiel: ${game}` : '') +
    (note ? `\n📝 ${note}` : '') +
    `\n\n👉 Jetzt auf OPBASE einloggen und RSVP abgeben!`
  );
  return data;
}

export async function rsvpSession(sessionId, answer) {
  const { error } = await supabase
    .from('rsvps')
    .upsert({ session_id: sessionId, player_name: state.currentUser.name, answer },
             { onConflict: 'session_id,player_name' });
  if (error) throw error;
  await loadSessions();
}

export async function deleteSession(id) {
  const { error } = await supabase.from('sessions').delete().eq('id', id);
  if (error) throw error;
  state.sessions = state.sessions.filter(s => s.id !== id);
}

export function renderSessions(containerId = 'sessions-list') {
  const el = document.getElementById(containerId);
  if (!el) return;

  if (!state.sessions.length) {
    el.innerHTML = `<p class="empty-state">Keine Sessions geplant — leg eine an!</p>`;
    return;
  }

  el.innerHTML = state.sessions.map(s => {
    const rsvps = s.rsvps || [];
    const yes = rsvps.filter(r => r.answer === 'yes').length;
    const no  = rsvps.filter(r => r.answer === 'no').length;
    const mine = rsvps.find(r => r.player_name === state.currentUser?.name)?.answer;
    const isPast = new Date(s.datetime) < new Date();

    return `
    <div class="session-card ${isPast ? 'past' : ''}" data-id="${s.id}">
      <div class="session-time">${formatDateTime(s.datetime)}</div>
      <div class="session-body">
        <div class="session-title">${s.title}</div>
        ${s.game ? `<div class="session-meta">🎯 ${s.game}</div>` : ''}
        ${s.note ? `<div class="session-meta note">${s.note}</div>` : ''}
        <div class="session-stats">
          <span class="stat-yes">✔ ${yes} dabei</span>
          <span class="stat-no">✘ ${no} nein</span>
          <span class="stat-creator">von ${s.created_by}</span>
        </div>
      </div>
      <div class="session-actions">
        <button class="btn sm ${mine === 'yes' ? 'active-yes' : ''}" onclick="window.rsvp(${s.id}, 'yes')">Dabei</button>
        <button class="btn sm ${mine === 'no'  ? 'active-no'  : ''}" onclick="window.rsvp(${s.id}, 'no')">Nein</button>
        ${s.created_by === state.currentUser?.name
          ? `<button class="btn sm icon danger" onclick="window.delSession(${s.id})"><i class="ti ti-trash"></i></button>`
          : ''}
      </div>
    </div>`;
  }).join('');
}
