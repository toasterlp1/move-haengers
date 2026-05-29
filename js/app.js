// ─────────────────────────────────────────────
//  OPBASE — App State & Core Helpers
// ─────────────────────────────────────────────
import { supabase } from './supabase.js';

export const state = {
  currentUser: null,   // { id, name, status, bio, avatar_color }
  players: [],
  sessions: [],
  polls: [],
  games: [],
  webhookUrl: localStorage.getItem('opbase_webhook') || '',
};

// ── Auth ──────────────────────────────────────
export async function login(name) {
  name = name.trim();
  if (!name) throw new Error('Name required');

  // Upsert player row by name (name is unique)
  const { data, error } = await supabase
    .from('players')
    .upsert({ name, status: 'online', last_seen: new Date().toISOString() }, { onConflict: 'name' })
    .select()
    .single();

  if (error) throw error;
  state.currentUser = data;
  localStorage.setItem('opbase_user', name);
  return data;
}

export function getSavedUser() {
  return localStorage.getItem('opbase_user');
}

export function logout() {
  if (state.currentUser) {
    supabase.from('players').update({ status: 'offline' }).eq('id', state.currentUser.id);
  }
  localStorage.removeItem('opbase_user');
  state.currentUser = null;
}

// ── Toasts ────────────────────────────────────
export function toast(msg, type = 'success') {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.className = `toast toast-${type} show`;
  clearTimeout(el._timer);
  el._timer = setTimeout(() => el.classList.remove('show'), 3000);
}

// ── Modals ────────────────────────────────────
export function openModal(id) {
  document.getElementById(id)?.classList.add('open');
}
export function closeModal(id) {
  document.getElementById(id)?.classList.remove('open');
  // Close on overlay click is handled globally in main.js
}

// ── Discord Webhook ───────────────────────────
export async function sendDiscord(content) {
  const url = state.webhookUrl || localStorage.getItem('opbase_webhook');
  if (!url) return;
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, username: 'OPBASE', avatar_url: 'https://i.imgur.com/4M34hi2.png' }),
    });
  } catch (e) {
    console.warn('Discord webhook failed:', e);
  }
}

// ── Date helpers ──────────────────────────────
export function formatDateTime(iso) {
  return new Date(iso).toLocaleString('de-DE', {
    weekday: 'short', day: '2-digit', month: '2-digit',
    hour: '2-digit', minute: '2-digit',
  });
}

export function isExpired(iso) {
  return new Date(iso).getTime() < Date.now() - 3 * 24 * 60 * 60 * 1000;
}

// ── Avatar initials color ─────────────────────
const AVATAR_COLORS = ['#c8a84b','#e63946','#4caf50','#3b82f6','#bf5af2','#00c9a7','#ff6b35'];
export function avatarColor(name) {
  let h = 0;
  for (let c of name) h = (h * 31 + c.charCodeAt(0)) & 0xffff;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}
