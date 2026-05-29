// ============================================================
//  GamingHub — profiles.js
// ============================================================

console.log('GH: profiles.js loaded');

const Profiles = (() => {
  const S = () => window.GH.storage;
  const U = () => window.GH.utils;

  function render() {
    const me = S().getMe();
    const profiles = S().getProfiles();

    document.getElementById('profiles-page').innerHTML = `
      <div class="page-header">
        <div class="page-title">
          <div class="page-title-icon cyan"><i class="ti ti-users"></i></div>
          <div><h1>Squad</h1><p>Deine Gaming-Gruppe</p></div>
        </div>
        ${!me ? `<button class="btn btn-primary btn-lg" onclick="Profiles.openCreate()"><i class="ti ti-user-plus"></i> Profil erstellen</button>` : `<button class="btn btn-ghost" onclick="Profiles.openEdit()"><i class="ti ti-edit"></i> Mein Profil</button>`}
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:16px">
        ${profiles.length === 0 ? `<div class="empty-state" style="grid-column:1/-1"><span class="empty-icon">👾</span><p>Noch keine Profile. Sei der Erste!</p></div>` : profiles.map(p => renderProfileCard(p, me)).join('')}
      </div>

      <!-- Create/Edit Modal -->
      <div class="modal-overlay" id="modal-profile">
        <div class="modal">
          <div class="modal-header">
            <h2 class="neon-cyan" id="profile-modal-title">Profil erstellen</h2>
            <button class="icon-btn" onclick="GH.utils.closeModal('modal-profile')"><i class="ti ti-x"></i></button>
          </div>
          <div style="display:flex;flex-direction:column;gap:14px">
            <div><label>Benutzername</label><input class="input" id="prof-username" placeholder="Dein Gaming-Name" maxlength="20"></div>
            <div><label>Bio</label><textarea class="textarea" id="prof-bio" placeholder="Ein kurzer Satz über dich..." maxlength="120" style="min-height:60px"></textarea></div>
            <div><label>Avatar-URL (optional)</label><input class="input" id="prof-avatar" placeholder="https://..."></div>
            <div>
              <label>Status</label>
              <select class="select" id="prof-status">
                <option value="online">🟢 Online</option>
                <option value="away">🟡 Abwesend</option>
                <option value="busy">🔴 Beschäftigt</option>
                <option value="offline">⚫ Offline</option>
              </select>
            </div>
            <div>
              <label>Profilfarbe</label>
              <div class="flex gap-2 items-center">
                ${['#00f5ff','#ff00a0','#b400ff','#00ff88','#ff6600','#ffcc00'].map(c => `
                  <button onclick="Profiles.setColor('${c}')" data-color="${c}" style="width:28px;height:28px;border-radius:50%;background:${c};border:3px solid transparent;cursor:pointer;transition:all 0.2s" title="${c}"></button>
                `).join('')}
                <input type="color" id="prof-color" value="#00f5ff" style="width:28px;height:28px;border-radius:50%;border:none;background:none;cursor:pointer;padding:0" oninput="Profiles.setColor(this.value)">
              </div>
            </div>
            <div class="flex gap-3 justify-between mt-2">
              <button class="btn btn-ghost" onclick="GH.utils.closeModal('modal-profile')">Abbrechen</button>
              <button class="btn btn-primary btn-lg" id="prof-submit-btn" onclick="Profiles.submitCreate()">Erstellen</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderProfileCard(profile, me) {
    const isMe = me?.username === profile.username;
    const events = S().getEvents();
    const eventsGoing = events.filter(e => (e.attendees || []).some(a => a.username === profile.username && a.status === 'going')).length;

    return `
      <div class="card ${isMe ? '' : ''}" style="${isMe ? 'border-color:' + (profile.color || 'var(--neon-cyan)') + ';box-shadow:0 0 20px ' + (profile.color || 'var(--neon-cyan)') + '22' : ''}">
        <div class="flex items-center gap-3 mb-3">
          <div style="position:relative">
            ${U().renderAvatar(profile.username, 'lg')}
            <div style="position:absolute;bottom:2px;right:2px">${U().renderStatusDot(profile.status)}</div>
          </div>
          <div style="flex:1;overflow:hidden">
            <div class="flex items-center gap-2">
              <h3 style="font-size:1rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${U().escHtml(profile.username)}</h3>
              ${isMe ? '<span class="badge badge-cyan" style="font-size:0.55rem">ICH</span>' : ''}
            </div>
            <div style="font-size:0.75rem;color:var(--text-secondary);margin-top:1px">${{online:'🟢 Online',away:'🟡 Abwesend',busy:'🔴 Beschäftigt',offline:'⚫ Offline'}[profile.status] || 'Offline'}</div>
          </div>
        </div>
        ${profile.bio ? `<p style="color:var(--text-secondary);font-size:0.85rem;line-height:1.4;margin-bottom:10px">${U().escHtml(profile.bio)}</p>` : ''}
        <div class="divider"></div>
        <div class="flex justify-between" style="font-size:0.75rem;color:var(--text-muted)">
          <span><i class="ti ti-calendar-event" style="font-size:12px"></i> ${eventsGoing} Sessions</span>
          <span>Dabei seit ${U().formatDate(profile.joinedAt || new Date().toISOString())}</span>
        </div>
        ${isMe ? `
          <div class="divider"></div>
          <div class="flex gap-2">
            <button class="btn btn-primary btn-sm flex-1" onclick="Profiles.openEdit()"><i class="ti ti-edit"></i> Bearbeiten</button>
            <button class="btn btn-danger btn-sm" onclick="Profiles.confirmDelete()"><i class="ti ti-trash"></i></button>
          </div>
        ` : ''}
      </div>
    `;
  }

  let currentColor = '#00f5ff';

  function openCreate() {
    document.getElementById('profile-modal-title').textContent = 'Profil erstellen';
    document.getElementById('prof-submit-btn').textContent = 'Erstellen';
    document.getElementById('prof-submit-btn').onclick = () => submitCreate();
    ['prof-username','prof-bio','prof-avatar'].forEach(id => { const el = document.getElementById(id); if(el) el.value=''; });
    document.getElementById('prof-status').value = 'online';
    setColor('#00f5ff');
    U().openModal('modal-profile');
  }

  function openEdit() {
    const me = S().getMe();
    if (!me) return;
    document.getElementById('profile-modal-title').textContent = 'Profil bearbeiten';
    document.getElementById('prof-submit-btn').textContent = 'Speichern';
    document.getElementById('prof-submit-btn').onclick = () => submitEdit();
    document.getElementById('prof-username').value = me.username;
    document.getElementById('prof-username').disabled = true;
    document.getElementById('prof-bio').value = me.bio || '';
    document.getElementById('prof-avatar').value = me.avatarUrl || '';
    document.getElementById('prof-status').value = me.status || 'online';
    setColor(me.color || '#00f5ff');
    U().openModal('modal-profile');
  }

  function setColor(color) {
    currentColor = color;
    document.querySelectorAll('[data-color]').forEach(btn => {
      btn.style.borderColor = btn.dataset.color === color ? color : 'transparent';
    });
    const colorInput = document.getElementById('prof-color');
    if (colorInput) colorInput.value = color;
  }

  function submitCreate() {
    const username = document.getElementById('prof-username').value.trim();
    if (!username) return U().showToast('Benutzername angeben', 'error');
    if (S().getProfile(username)) return U().showToast('Benutzername bereits vergeben!', 'error');
    const profile = {
      username,
      bio: document.getElementById('prof-bio').value.trim(),
      avatarUrl: document.getElementById('prof-avatar').value.trim() || null,
      status: document.getElementById('prof-status').value,
      color: currentColor,
      joinedAt: new Date().toISOString(),
    };
    S().saveMe(profile);
    U().closeModal('modal-profile');
    render();
    U().showToast(`Willkommen, ${username}! 🎮`, 'success');
    updateTopbarProfile();
  }

  function submitEdit() {
    const me = S().getMe();
    if (!me) return;
    const updated = {
      ...me,
      bio: document.getElementById('prof-bio').value.trim(),
      avatarUrl: document.getElementById('prof-avatar').value.trim() || null,
      status: document.getElementById('prof-status').value,
      color: currentColor,
    };
    document.getElementById('prof-username').disabled = false;
    S().saveMe(updated);
    U().closeModal('modal-profile');
    render();
    U().showToast('Profil aktualisiert!', 'success');
    updateTopbarProfile();
  }

  function confirmDelete() {
    U().confirmAction('Dein Profil wirklich löschen? Alle deine Daten gehen verloren.', () => {
      const me = S().getMe();
      if (!me) return;
      S().deleteProfile(me.username);
      localStorage.removeItem('gh_me');
      render();
      U().showToast('Profil gelöscht', 'info');
      updateTopbarProfile();
    });
  }

  function updateTopbarProfile() {
    const me = S().getMe();
    const btn = document.getElementById('topbar-profile-btn');
    if (!btn) return;
    if (me) {
      btn.innerHTML = U().renderAvatar(me.username, 'sm');
      btn.title = me.username;
    } else {
      btn.innerHTML = '<i class="ti ti-user"></i>';
    }
  }

  window.Profiles = { render, openCreate, openEdit, setColor, submitCreate, submitEdit, confirmDelete, updateTopbarProfile };
})();
