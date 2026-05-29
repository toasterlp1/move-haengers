// ============================================================
//  GamingHub — library.js
// ============================================================

console.log('GH: library.js loaded');

const Library = (() => {
  const S = () => window.GH.storage;
  const U = () => window.GH.utils;
  let filterStatus = 'all';
  let searchQuery = '';

  function render() {
    const me = S().getMe();
    document.getElementById('library-page').innerHTML = `
      <div class="page-header">
        <div class="page-title">
          <div class="page-title-icon purple"><i class="ti ti-device-gamepad"></i></div>
          <div><h1>Spielebibliothek</h1><p>Eure Spiele-Liste & Wishlist</p></div>
        </div>
        ${me ? `<button class="btn btn-purple btn-lg" onclick="Library.openAdd()"><i class="ti ti-plus"></i> Spiel hinzufügen</button>` : ''}
      </div>

      <!-- Filters -->
      <div class="flex items-center gap-3 mb-4" style="flex-wrap:wrap">
        <div style="flex:1;min-width:200px">
          <input class="input" id="lib-search" placeholder="Spiel suchen..." oninput="Library.search(this.value)" style="max-width:280px">
        </div>
        <div class="flex gap-2">
          ${['all','playing','wishlist','completed','dropped'].map(s => `
            <button class="btn btn-sm ${filterStatus === s ? 'btn-purple' : 'btn-ghost'}" onclick="Library.filter('${s}')">
              ${s === 'all' ? 'Alle' : s === 'playing' ? '▶ Aktiv' : s === 'wishlist' ? '★ Wishlist' : s === 'completed' ? '✓ Fertig' : '✗ Abgebrochen'}
            </button>
          `).join('')}
        </div>
      </div>
      <div id="lib-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:14px"></div>

      <!-- Add Modal -->
      <div class="modal-overlay" id="modal-add-game">
        <div class="modal">
          <div class="modal-header">
            <h2 class="neon-purple">Spiel hinzufügen</h2>
            <button class="icon-btn" onclick="GH.utils.closeModal('modal-add-game')"><i class="ti ti-x"></i></button>
          </div>
          <div style="display:flex;flex-direction:column;gap:14px">
            <div><label>Spieltitel</label><input class="input" id="game-title" placeholder="z.B. Elden Ring"></div>
            <div><label>Genre</label><input class="input" id="game-genre" placeholder="z.B. RPG, FPS, Sandbox..."></div>
            <div>
              <label>Status</label>
              <select class="select" id="game-status">
                <option value="wishlist">★ Wishlist</option>
                <option value="playing">▶ Spiele ich gerade</option>
                <option value="completed">✓ Abgeschlossen</option>
                <option value="dropped">✗ Abgebrochen</option>
              </select>
            </div>
            <div><label>Cover-URL (optional)</label><input class="input" id="game-cover" placeholder="https://..."></div>
            <div class="flex gap-3 justify-between mt-2">
              <button class="btn btn-ghost" onclick="GH.utils.closeModal('modal-add-game')">Abbrechen</button>
              <button class="btn btn-purple btn-lg" onclick="Library.submitAdd()"><i class="ti ti-plus"></i> Hinzufügen</button>
            </div>
          </div>
        </div>
      </div>
    `;
    renderGrid();
  }

  function renderGrid() {
    const me = S().getMe();
    let games = S().getLibrary();
    if (filterStatus !== 'all') games = games.filter(g => g.status === filterStatus);
    if (searchQuery) games = games.filter(g => U().fuzzyMatch(g.title + g.genre, searchQuery));
    games.sort((a, b) => (b.votes?.length || 0) - (a.votes?.length || 0));

    const grid = document.getElementById('lib-grid');
    if (!grid) return;
    if (games.length === 0) {
      grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><span class="empty-icon">🎮</span><p>Keine Spiele gefunden</p></div>`;
      return;
    }

    const statusColors = { playing: 'var(--neon-green)', wishlist: 'var(--neon-cyan)', completed: 'var(--neon-purple)', dropped: 'var(--text-muted)' };
    const statusLabels = { playing: '▶ Aktiv', wishlist: '★ Wishlist', completed: '✓ Fertig', dropped: '✗ Dropped' };

    grid.innerHTML = games.map(game => {
      const voted = me && (game.votes || []).includes(me.username);
      return `
        <div class="card card-purple" style="display:flex;flex-direction:column;gap:10px;cursor:pointer" onclick="Library.openDetail('${game.id}')">
          <div style="height:110px;border-radius:var(--radius-md);overflow:hidden;background:rgba(180,0,255,0.07);border:1px solid rgba(180,0,255,0.15);display:flex;align-items:center;justify-content:center">
            ${game.cover ? `<img src="${U().escHtml(game.cover)}" style="width:100%;height:100%;object-fit:cover" onerror="this.parentElement.innerHTML='<i class=\\'ti ti-device-gamepad\\' style=\\'font-size:2.5rem;color:var(--text-muted)\\'></i>'">` : `<i class="ti ti-device-gamepad" style="font-size:2.5rem;color:var(--text-muted)"></i>`}
          </div>
          <div>
            <div style="font-family:var(--font-display);font-size:0.85rem;font-weight:500;line-height:1.3;margin-bottom:4px">${U().escHtml(game.title)}</div>
            ${game.genre ? `<span class="badge badge-gray" style="font-size:0.6rem">${U().escHtml(game.genre)}</span>` : ''}
          </div>
          <div class="flex items-center justify-between mt-auto">
            <span style="font-size:0.7rem;color:${statusColors[game.status] || 'var(--text-muted)'}">${statusLabels[game.status] || game.status}</span>
            <button class="btn btn-sm ${voted ? 'btn-purple' : 'btn-ghost'}" onclick="event.stopPropagation();Library.vote('${game.id}')">
              <i class="ti ti-thumb-up" style="font-size:12px"></i> ${(game.votes || []).length}
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  function openDetail(id) {
    const game = S().getLibrary().find(g => g.id === id);
    if (!game) return;
    const me = S().getMe();
    const isOwner = me?.username === game.addedBy;
    const statusLabels = { playing: '▶ Spiele ich', wishlist: '★ Wishlist', completed: '✓ Fertig', dropped: '✗ Dropped' };
    const div = document.createElement('div');
    div.className = 'modal-overlay active';
    div.id = 'modal-game-detail-' + id;
    div.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h2>${U().escHtml(game.title)}</h2>
          <button class="icon-btn" onclick="this.closest('.modal-overlay').remove()"><i class="ti ti-x"></i></button>
        </div>
        <div style="display:flex;flex-direction:column;gap:12px">
          ${game.cover ? `<img src="${U().escHtml(game.cover)}" style="width:100%;max-height:200px;object-fit:cover;border-radius:var(--radius-md)" onerror="this.remove()">` : ''}
          <div class="flex items-center gap-2">
            ${game.genre ? `<span class="badge badge-purple">${U().escHtml(game.genre)}</span>` : ''}
            <span class="badge badge-cyan">${statusLabels[game.status] || game.status}</span>
          </div>
          <p style="color:var(--text-secondary);font-size:0.85rem">Hinzugefügt von <strong>${U().escHtml(game.addedBy)}</strong> · ${U().timeAgo(game.addedAt)}</p>
          <div>
            <div class="section-title mb-2">Wer will das spielen</div>
            <div class="flex" style="flex-wrap:wrap;gap:6px">
              ${(game.votes || []).map(u => `<div class="flex items-center gap-1">${U().renderAvatar(u,'sm')}<span style="font-size:0.8rem">${U().escHtml(u)}</span></div>`).join('') || '<span style="color:var(--text-muted);font-size:0.85rem">Noch niemand</span>'}
            </div>
          </div>
          ${isOwner ? `
            <div class="divider"></div>
            <div class="flex gap-2 justify-between">
              <select class="select" id="detail-status-${id}" style="max-width:180px">
                ${['wishlist','playing','completed','dropped'].map(s => `<option value="${s}" ${game.status === s ? 'selected' : ''}>${statusLabels[s]}</option>`).join('')}
              </select>
              <div class="flex gap-2">
                <button class="btn btn-ghost btn-sm" onclick="Library.updateStatus('${id}')">Status ändern</button>
                <button class="btn btn-danger btn-sm" onclick="Library.confirmDelete('${id}')"><i class="ti ti-trash"></i></button>
              </div>
            </div>
          ` : ''}
        </div>
      </div>`;
    document.body.appendChild(div);
    div.addEventListener('click', e => { if (e.target === div) div.remove(); });
  }

  function updateStatus(id) {
    const sel = document.getElementById('detail-status-' + id);
    if (!sel) return;
    S().updateGame(id, { status: sel.value });
    document.getElementById('modal-game-detail-' + id)?.remove();
    renderGrid();
    U().showToast('Status aktualisiert!', 'success');
  }

  function openAdd() {
    if (!S().getMe()) return U().showToast('Erstell zuerst ein Profil!', 'error');
    ['game-title','game-genre','game-cover'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    U().openModal('modal-add-game');
  }

  function submitAdd() {
    const me = S().getMe();
    if (!me) return;
    const title = document.getElementById('game-title').value.trim();
    if (!title) return U().showToast('Spieltitel angeben', 'error');
    S().addGame({
      title,
      genre: document.getElementById('game-genre').value.trim(),
      status: document.getElementById('game-status').value,
      cover: document.getElementById('game-cover').value.trim(),
      addedBy: me.username,
    });
    U().closeModal('modal-add-game');
    renderGrid();
    U().showToast('Spiel hinzugefügt!', 'success');
  }

  function vote(id) {
    const me = S().getMe();
    if (!me) return U().showToast('Erstell zuerst ein Profil!', 'error');
    S().voteGame(id, me.username);
    renderGrid();
  }

  function filter(status) {
    filterStatus = status;
    render();
  }

  function search(q) {
    searchQuery = q;
    renderGrid();
  }

  function confirmDelete(id) {
    U().confirmAction('Dieses Spiel wirklich löschen?', () => {
      S().deleteGame(id);
      document.querySelectorAll('.modal-overlay').forEach(m => m.remove());
      renderGrid();
      U().showToast('Spiel entfernt', 'info');
    });
  }

  window.Library = { render, openAdd, submitAdd, vote, filter, search, openDetail, updateStatus, confirmDelete };
})();
