// ─────────────────────────────────────────────
//  OPBASE — Game Library Module
// ─────────────────────────────────────────────
import { supabase } from './supabase.js';
import { state } from './app.js';

const GENRE_ICONS = {
  'Battle Royale': '🪂', 'FPS': '🔫', 'RPG': '⚔️',
  'Survival': '🪓', 'Racing': '🏎️', 'Strategy': '♟️',
  'Sports': '⚽', 'MMO': '🌐', 'Horror': '💀', 'Sonstiges': '🎮',
};

export async function loadGames() {
  const { data, error } = await supabase
    .from('games')
    .select('*')
    .order('name');
  if (error) { console.error(error); return; }
  state.games = data || [];
}

export async function addGame({ name, genre, max_players, platform }) {
  const { data, error } = await supabase
    .from('games')
    .insert({ name, genre, max_players: parseInt(max_players) || null, platform, added_by: state.currentUser.name })
    .select()
    .single();
  if (error) throw error;
  state.games.push(data);
  state.games.sort((a, b) => a.name.localeCompare(b.name));
  return data;
}

export async function deleteGame(id) {
  const { error } = await supabase.from('games').delete().eq('id', id);
  if (error) throw error;
  state.games = state.games.filter(g => g.id !== id);
}

export function renderLibrary(containerId = 'game-library') {
  const el = document.getElementById(containerId);
  if (!el) return;

  const filter = document.getElementById('genre-filter')?.value || 'all';
  const search = document.getElementById('game-search')?.value?.toLowerCase() || '';
  let games = state.games;
  if (filter !== 'all') games = games.filter(g => g.genre === filter);
  if (search) games = games.filter(g => g.name.toLowerCase().includes(search));

  if (!games.length) {
    el.innerHTML = `<p class="empty-state">Keine Spiele gefunden.</p>`;
    return;
  }

  el.innerHTML = `<div class="game-grid">` + games.map(g => `
    <div class="game-card">
      <div class="game-icon">${GENRE_ICONS[g.genre] || '🎮'}</div>
      <div class="game-info">
        <div class="game-name">${g.name}</div>
        <div class="game-meta">
          <span>${g.genre}</span>
          ${g.max_players ? `<span>👥 ${g.max_players}</span>` : ''}
          ${g.platform ? `<span>${g.platform}</span>` : ''}
        </div>
      </div>
      ${g.added_by === state.currentUser?.name
        ? `<button class="btn sm icon danger" onclick="window.delGame(${g.id})"><i class="ti ti-trash"></i></button>`
        : ''}
    </div>`).join('') + `</div>`;
}
