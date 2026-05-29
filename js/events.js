// ============================================================
//  GamingHub — events.js
// ============================================================

const Events = (() => {
  const S = () => window.GH.storage;
  const U = () => window.GH.utils;

  function render() {
    const me = S().getMe();
    const events = S().getEvents();
    const upcoming = events.filter(e => U().isUpcoming(e.datetime));
    const past = events.filter(e => !U().isUpcoming(e.datetime));

    document.getElementById('events-page').innerHTML = `
      <div class="page-header">
        <div class="page-title">
          <div class="page-title-icon cyan"><i class="ti ti-calendar-event"></i></div>
          <div>
            <h1>Sessions</h1>
            <p>Plant eure nächsten Gaming-Abende</p>
          </div>
        </div>
        ${me ? `<button class="btn btn-primary btn-lg" onclick="Events.openCreate()"><i class="ti ti-plus"></i> Session erstellen</button>` : ''}
      </div>

      <!-- Upcoming -->
      <div class="section-header">
        <span class="section-title">Upcoming</span>
        <div class="section-line"></div>
      </div>

      ${upcoming.length === 0 ? `<div class="empty-state"><span class="empty-icon">📅</span><p>Keine Sessions geplant. Erstell eine!</p></div>` : ''}
      <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:2rem">
        ${upcoming.map(e => renderEventCard(e, me)).join('')}
      </div>

      <!-- Past -->
      ${past.length > 0 ? `
        <div class="section-header">
          <span class="section-title">Vergangen</span>
          <div class="section-line"></div>
        </div>
        <div style="display:flex;flex-direction:column;gap:12px;opacity:0.6">
          ${past.map(e => renderEventCard(e, me, true)).join('')}
        </div>
      ` : ''}

      <!-- Create Modal -->
      <div class="modal-overlay" id="modal-create-event">
        <div class="modal">
          <div class="modal-header">
            <h2 class="neon-cyan">Session erstellen</h2>
            <button class="icon-btn" onclick="GH.utils.closeModal('modal-create-event')"><i class="ti ti-x"></i></button>
          </div>
          <div style="display:flex;flex-direction:column;gap:14px">
            <div><label>Titel</label><input class="input" id="ev-title" placeholder="z.B. Valorant Ranked Night"></div>
            <div><label>Spiel</label><input class="input" id="ev-game" placeholder="Welches Spiel?"></div>
            <div class="grid-2">
              <div><label>Datum & Uhrzeit</label><input class="input" type="datetime-local" id="ev-datetime"></div>
              <div><label>Max. Spieler</label><input class="input" type="number" id="ev-maxplayers" min="2" max="32" placeholder="z.B. 5"></div>
            </div>
            <div><label>Beschreibung (optional)</label><textarea class="textarea" id="ev-desc" placeholder="Infos, Regeln, Discord-Link..."></textarea></div>
            <div class="flex gap-3 justify-between mt-2">
              <button class="btn btn-ghost" onclick="GH.utils.closeModal('modal-create-event')">Abbrechen</button>
              <button class="btn btn-primary btn-lg" onclick="Events.submitCreate()"><i class="ti ti-device-gamepad-2"></i> Erstellen & Benachrichtigen</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Detail Modal -->
      <div class="modal-overlay" id="modal-event-detail"><div class="modal" id="event-detail-content"></div></div>
    `;
  }

  function renderEventCard(ev, me, isPast = false) {
    const going = (ev.attendees || []).filter(a => a.status === 'going').length;
    const myRsvp = me ? (ev.attendees || []).find(a => a.username === me.username)?.status : null;
    const color = isPast ? 'var(--text-muted)' : 'var(--neon-cyan)';

    return `
      <div class="card" style="cursor:pointer" onclick="Events.openDetail('${ev.id}')">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div style="width:44px;height:44px;border-radius:var(--radius-md);background:rgba(0,245,255,0.07);border:1px solid rgba(0,245,255,0.2);display:flex;align-items:center;justify-content:center;color:${color};font-size:20px;flex-shrink:0">
              <i class="ti ti-device-gamepad-2"></i>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 style="font-size:1rem">${U().escHtml(ev.title)}</h3>
                ${myRsvp === 'going' ? '<span class="badge badge-green">✓ Dabei</span>' : ''}
                ${myRsvp === 'maybe' ? '<span class="badge badge-orange">? Vielleicht</span>' : ''}
              </div>
              <div class="flex items-center gap-3 mt-1">
                <span class="badge badge-cyan">${U().escHtml(ev.game)}</span>
                <span style="color:var(--text-secondary);font-size:0.8rem"><i class="ti ti-clock" style="font-size:12px"></i> ${U().formatDateTime(ev.datetime)}</span>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-3 hide-mobile">
            <div style="text-align:right">
              <div style="font-family:var(--font-display);font-size:1.2rem;color:var(--neon-cyan)">${going}</div>
              <div style="font-size:0.7rem;color:var(--text-muted)">DABEI</div>
            </div>
            ${!isPast ? `<div style="font-family:var(--font-display);font-size:0.75rem;color:var(--neon-green);min-width:60px;text-align:right">${U().countdownText(ev.datetime)}</div>` : ''}
          </div>
        </div>
        ${ev.description ? `<p style="color:var(--text-secondary);font-size:0.85rem;margin-top:10px;padding-top:10px;border-top:1px solid var(--dark-border)">${U().escHtml(ev.description)}</p>` : ''}
      </div>
    `;
  }

  function openDetail(id) {
    const ev = S().getEvents().find(e => e.id === id);
    if (!ev) return;
    const me = S().getMe();
    const going = (ev.attendees || []).filter(a => a.status === 'going');
    const maybe = (ev.attendees || []).filter(a => a.status === 'maybe');
    const myRsvp = me ? (ev.attendees || []).find(a => a.username === me.username)?.status : null;
    const isHost = me?.username === ev.host;
    const upcoming = U().isUpcoming(ev.datetime);

    document.getElementById('event-detail-content').innerHTML = `
      <div class="modal-header">
        <div>
          <h2>${U().escHtml(ev.title)}</h2>
          <div class="flex items-center gap-2 mt-1">
            <span class="badge badge-cyan">${U().escHtml(ev.game)}</span>
            <span style="color:var(--text-secondary);font-size:0.8rem">von ${U().escHtml(ev.host)}</span>
          </div>
        </div>
        <button class="icon-btn" onclick="GH.utils.closeModal('modal-event-detail')"><i class="ti ti-x"></i></button>
      </div>
      <div style="display:flex;flex-direction:column;gap:14px">
        <div class="card" style="padding:0.75rem">
          <div class="grid-2" style="text-align:center">
            <div>
              <div style="font-family:var(--font-mono);color:var(--neon-cyan);font-size:0.9rem">${U().formatDateTime(ev.datetime)}</div>
              <div style="font-size:0.7rem;color:var(--text-muted);margin-top:2px">DATUM & UHRZEIT</div>
            </div>
            <div>
              <div style="font-family:var(--font-display);color:var(--neon-green);font-size:1.1rem">${upcoming ? U().countdownText(ev.datetime) : 'Vorbei'}</div>
              <div style="font-size:0.7rem;color:var(--text-muted);margin-top:2px">COUNTDOWN</div>
            </div>
          </div>
        </div>
        ${ev.description ? `<p style="color:var(--text-secondary)">${U().escHtml(ev.description)}</p>` : ''}
        ${ev.maxPlayers ? `<p style="font-size:0.85rem;color:var(--text-muted)">Max. ${ev.maxPlayers} Spieler</p>` : ''}

        <!-- Attendees -->
        <div>
          <div class="section-header"><span class="section-title">Dabei (${going.length})</span><div class="section-line"></div></div>
          <div class="flex" style="flex-wrap:wrap;gap:8px;margin-bottom:0.75rem">
            ${going.length === 0 ? '<span style="color:var(--text-muted);font-size:0.85rem">Noch niemand</span>' : going.map(a => `<div class="flex items-center gap-2">${U().renderAvatar(a.username,'sm')}<span style="font-size:0.85rem">${U().escHtml(a.username)}</span></div>`).join('')}
          </div>
          ${maybe.length > 0 ? `
            <div class="section-header"><span class="section-title">Vielleicht (${maybe.length})</span><div class="section-line"></div></div>
            <div class="flex" style="flex-wrap:wrap;gap:8px">
              ${maybe.map(a => `<div class="flex items-center gap-2">${U().renderAvatar(a.username,'sm')}<span style="font-size:0.85rem">${U().escHtml(a.username)}</span></div>`).join('')}
            </div>
          ` : ''}
        </div>

        <!-- RSVP buttons -->
        ${me && upcoming ? `
          <div class="flex gap-3 mt-2">
            <button class="btn ${myRsvp === 'going' ? 'btn-primary' : 'btn-ghost'} flex-1" onclick="Events.rsvp('${ev.id}','going')"><i class="ti ti-check"></i> Ich bin dabei</button>
            <button class="btn ${myRsvp === 'maybe' ? 'btn-pink' : 'btn-ghost'} flex-1" onclick="Events.rsvp('${ev.id}','maybe')">? Vielleicht</button>
            ${myRsvp ? `<button class="btn btn-ghost" onclick="Events.rsvp('${ev.id}','no')"><i class="ti ti-x"></i></button>` : ''}
          </div>
        ` : ''}
        ${isHost ? `
          <div class="divider"></div>
          <div class="flex gap-2 justify-between">
            <button class="btn btn-ghost btn-sm" onclick="Events.openEdit('${ev.id}')"><i class="ti ti-edit"></i> Bearbeiten</button>
            <button class="btn btn-danger btn-sm" onclick="Events.confirmDelete('${ev.id}')"><i class="ti ti-trash"></i> Löschen</button>
          </div>
        ` : ''}
      </div>
    `;
    U().openModal('modal-event-detail');
  }

  function openCreate() {
    if (!S().getMe()) return U().showToast('Erstell zuerst ein Profil!', 'error');
    // Set default datetime to tomorrow 20:00
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(20, 0, 0, 0);
    const iso = tomorrow.toISOString().slice(0, 16);
    document.getElementById('ev-datetime').value = iso;
    U().openModal('modal-create-event');
  }

  async function submitCreate() {
    const me = S().getMe();
    if (!me) return;
    const title = document.getElementById('ev-title').value.trim();
    const game = document.getElementById('ev-game').value.trim();
    const datetime = document.getElementById('ev-datetime').value;
    if (!title || !game || !datetime) return U().showToast('Titel, Spiel und Datum sind Pflicht', 'error');
    const event = S().addEvent({
      title, game, datetime,
      host: me.username,
      description: document.getElementById('ev-desc').value.trim(),
      maxPlayers: parseInt(document.getElementById('ev-maxplayers').value) || null,
    });
    S().rsvpEvent(event.id, me.username, 'going');
    U().closeModal('modal-create-event');
    render();
    U().showToast('Session erstellt!', 'success');
    const sent = await U().notifyEvent(event);
    if (sent) U().showToast('Discord-Benachrichtigung gesendet ✓', 'success');
  }

  function rsvp(eventId, status) {
    const me = S().getMe();
    if (!me) return U().showToast('Erstell zuerst ein Profil!', 'error');
    if (status === 'no') {
      const ev = S().getEvents().find(e => e.id === eventId);
      if (ev) {
        ev.attendees = (ev.attendees || []).filter(a => a.username !== me.username);
        S().updateEvent(eventId, { attendees: ev.attendees });
      }
    } else {
      S().rsvpEvent(eventId, me.username, status);
    }
    render();
    openDetail(eventId);
    U().showToast(status === 'going' ? 'Du bist dabei!' : status === 'maybe' ? 'Als "Vielleicht" eingetragen' : 'RSVP entfernt', 'success');
  }

  function openEdit(id) {
    const ev = S().getEvents().find(e => e.id === id);
    if (!ev) return;
    U().closeModal('modal-event-detail');
    document.getElementById('ev-title').value = ev.title;
    document.getElementById('ev-game').value = ev.game;
    document.getElementById('ev-datetime').value = ev.datetime.slice(0,16);
    document.getElementById('ev-desc').value = ev.description || '';
    document.getElementById('ev-maxplayers').value = ev.maxPlayers || '';
    const btn = document.querySelector('#modal-create-event .btn-primary');
    btn.textContent = 'Speichern';
    btn.onclick = () => submitEdit(id);
    U().openModal('modal-create-event');
  }

  function submitEdit(id) {
    const title = document.getElementById('ev-title').value.trim();
    const game = document.getElementById('ev-game').value.trim();
    const datetime = document.getElementById('ev-datetime').value;
    if (!title || !game || !datetime) return U().showToast('Alle Pflichtfelder ausfüllen', 'error');
    S().updateEvent(id, { title, game, datetime, description: document.getElementById('ev-desc').value.trim(), maxPlayers: parseInt(document.getElementById('ev-maxplayers').value) || null });
    U().closeModal('modal-create-event');
    render();
    U().showToast('Session aktualisiert!', 'success');
  }

  function confirmDelete(id) {
    U().confirmAction('Diese Session wirklich löschen?', () => {
      S().deleteEvent(id);
      U().closeModal('modal-event-detail');
      render();
      U().showToast('Session gelöscht', 'info');
    });
  }

  window.Events = { render, openDetail, openCreate, submitCreate, rsvp, openEdit, confirmDelete };
})();
