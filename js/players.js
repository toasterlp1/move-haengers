// ─────────────────────────────────────────────
//  OPBASE — Players / Crew Module
// ─────────────────────────────────────────────
import { supabase } from './supabase.js';
import { state, avatarColor } from './app.js';

export async function loadPlayers() {
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .order('name');
  if (error) { console.error(error); return; }
  state.players = data || [];
}

export async function updateMyProfile({ status, bio }) {
  const { error } = await supabase
    .from('players')
    .update({ status, bio, last_seen: new Date().toISOString() })
    .eq('id', state.currentUser.id);
  if (error) throw error;
  state.currentUser = { ...state.currentUser, status, bio };
  await loadPlayers();
}

export function playerAvatar(name, size = 36) {
  const color = avatarColor(name);
  const initials = name.slice(0, 2).toUpperCase();
  return `<div class="avatar" style="width:${size}px;height:${size}px;background:${color}22;border:1px solid ${color};color:${color};font-size:${Math.round(size*0.38)}px;">${initials}</div>`;
}

export function statusBadge(status) {
  const map = { online: ['green-badge', 'Online'], busy: ['amber-badge', 'Busy'], offline: ['gray-badge', 'Offline'] };
  const [cls, label] = map[status] || map.offline;
  return `<span class="badge ${cls}">${label}</span>`;
}

export function renderCrew(containerId = 'crew-list') {
  const el = document.getElementById(containerId);
  if (!el) return;
  if (!state.players.length) {
    el.innerHTML = `<p class="empty-state">Noch keine Spieler.</p>`;
    return;
  }
  el.innerHTML = state.players.map(p => `
    <div class="player-row">
      ${playerAvatar(p.name)}
      <div class="player-info">
        <div class="player-name">${p.name}${p.name === state.currentUser?.name ? ' <span class="you-tag">DU</span>' : ''}</div>
        ${p.bio ? `<div class="player-bio">${p.bio}</div>` : ''}
      </div>
      ${statusBadge(p.status)}
    </div>`).join('');
}

export function renderMyProfile() {
  const el = document.getElementById('my-profile');
  if (!el || !state.currentUser) return;
  const u = state.currentUser;
  el.innerHTML = `
    <div class="profile-hero">
      ${playerAvatar(u.name, 56)}
      <div>
        <div class="profile-name">${u.name}</div>
        ${statusBadge(u.status)}
      </div>
    </div>`;
  document.getElementById('status-select').value = u.status;
  document.getElementById('bio-input').value = u.bio || '';
}
