// ============================================================
//  GamingHub — dashboard.js
// ============================================================

console.log('GH: dashboard.js loaded');

const Dashboard = (() => {
  const S = () => window.GH.storage;
  const U = () => window.GH.utils;

  function render() {
    const me = S().getMe();
    const events = S().getEvents().filter(e => U().isUpcoming(e.datetime)).slice(0, 3);
    const polls = S().getPolls().slice(0, 2);
    const profiles = S().getProfiles();
    const library = S().getLibrary();
    const chat = S().getChat().slice(-5);
    const onlineCount = profiles.filter(p => p.status === 'online').length;
    const playingGames = library.filter(g => g.status === 'playing');

    document.getElementById('dashboard-page').innerHTML = `
      <!-- Welcome banner -->
      <div style="margin-bottom:1.5rem">
        ${me ? `
          <div class="flex items-center gap-3">
            ${U().renderAvatar(me.username, 'lg')}
            <div>
              <h1 style="font-size:1.4rem">Hey, <span class="neon-cyan">${U().escHtml(me.username)}</span> 👾</h1>
              <p style="color:var(--text-secondary);font-size:0.9rem">${events.length > 0 ? `${events.length} Session${events.length>1?'s':''} ausstehend` : 'Keine Sessions geplant'} · ${onlineCount} online</p>
            </div>
          </div>
        ` : `
          <div class="card" style="text-align:center;padding:2rem;background:linear-gradient(135deg,rgba(0,245,255,0.05),rgba(180,0,255,0.05));border-color:rgba(0,245,255,0.3)">
            <div style="font-size:3rem;margin-bottom:0.75rem">🎮</div>
            <h2 style="margin-bottom:0.5rem">Willkommen bei GamingHub!</h2>
            <p style="color:var(--text-secondary);margin-bottom:1.25rem">Erstell dein Profil und starte mit deiner Squad.</p>
            <button class="btn btn-primary btn-lg" onclick="GH.navigate('profiles');setTimeout(()=>Profiles.openCreate(),100)"><i class="ti ti-user-plus"></i> Profil erstellen</button>
          </div>
        `}
      </div>

      <!-- Stats row -->
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:1.5rem">
        ${[
          { label:'Online',      value: onlineCount,        color:'var(--neon-green)',  icon:'ti-circle-filled' },
          { label:'Sessions',    value: events.length,      color:'var(--neon-cyan)',   icon:'ti-calendar-event' },
          { label:'Umfragen',    value: polls.length,       color:'var(--neon-pink)',   icon:'ti-chart-bar' },
          { label:'Spiele',      value: library.length,     color:'var(--neon-purple)', icon:'ti-device-gamepad' },
        ].map(s => `
          <div style="background:var(--dark-card);border:1px solid var(--dark-border);border-radius:var(--radius-lg);padding:1rem;text-align:center">
            <i class="ti ${s.icon}" style="font-size:1.5rem;color:${s.color};display:block;margin-bottom:6px"></i>
            <div style="font-family:var(--font-display);font-size:1.6rem;font-weight:700;color:${s.color}">${s.value}</div>
            <div style="font-size:0.7rem;color:var(--text-muted);font-family:var(--font-display);letter-spacing:0.1em">${s.label}</div>
          </div>
        `).join('')}
      </div>

      <div class="dashboard-grid">
        <!-- Upcoming Events -->
        <div class="card col-span-2">
          <div class="section-header mb-3">
            <span class="section-title">Nächste Sessions</span>
            <div class="section-line"></div>
            <button class="btn btn-ghost btn-sm" onclick="GH.navigate('events')">Alle <i class="ti ti-arrow-right" style="font-size:12px"></i></button>
          </div>
          ${events.length === 0 ? `
            <div class="empty-state" style="padding:1.5rem">
              <span class="empty-icon" style="font-size:2rem">📅</span>
              <p>Keine Sessions geplant</p>
              ${me ? `<button class="btn btn-primary btn-sm mt-3" onclick="GH.navigate('events');setTimeout(()=>Events.openCreate(),100)">Session erstellen</button>` : ''}
            </div>
          ` : events.map(e => `
            <div onclick="GH.navigate('events');setTimeout(()=>Events.openDetail('${e.id}'),100)" style="cursor:pointer;padding:0.75rem;border-radius:var(--radius-md);border:1px solid var(--dark-border);margin-bottom:8px;display:flex;align-items:center;gap:12px;transition:border-color 0.2s" onmouseenter="this.style.borderColor='rgba(0,245,255,0.4)'" onmouseleave="this.style.borderColor='var(--dark-border)'">
              <div style="width:36px;height:36px;border-radius:var(--radius-md);background:rgba(0,245,255,0.08);border:1px solid rgba(0,245,255,0.2);display:flex;align-items:center;justify-content:center;color:var(--neon-cyan);flex-shrink:0">
                <i class="ti ti-device-gamepad-2"></i>
              </div>
              <div style="flex:1;overflow:hidden">
                <div style="font-family:var(--font-display);font-size:0.8rem;margin-bottom:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${U().escHtml(e.title)}</div>
                <div style="color:var(--text-secondary);font-size:0.75rem">${U().escHtml(e.game)} · ${U().formatDateTime(e.datetime)}</div>
              </div>
              <div style="font-family:var(--font-display);font-size:0.75rem;color:var(--neon-green);flex-shrink:0">${U().countdownText(e.datetime)}</div>
            </div>
          `).join('')}
        </div>

        <!-- Squad Status -->
        <div class="card">
          <div class="section-header mb-3">
            <span class="section-title">Squad</span>
            <div class="section-line"></div>
            <button class="btn btn-ghost btn-sm" onclick="GH.navigate('profiles')">Alle <i class="ti ti-arrow-right" style="font-size:12px"></i></button>
          </div>
          ${profiles.length === 0 ? `<div class="empty-state" style="padding:1rem"><span class="empty-icon" style="font-size:1.5rem">👾</span><p>Noch keine Profile</p></div>` : ''}
          <div style="display:flex;flex-direction:column;gap:8px">
            ${profiles.slice(0, 6).map(p => `
              <div class="flex items-center gap-2">
                <div style="position:relative">
                  ${U().renderAvatar(p.username, 'sm')}
                  <div style="position:absolute;bottom:0;right:0">${U().renderStatusDot(p.status)}</div>
                </div>
                <div style="flex:1;overflow:hidden">
                  <div style="font-size:0.85rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${U().escHtml(p.username)}</div>
                  ${p.bio ? `<div style="font-size:0.7rem;color:var(--text-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${U().escHtml(p.bio)}</div>` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Active Poll -->
        ${polls.length > 0 ? `
          <div class="card card-pink">
            <div class="section-header mb-3">
              <span class="section-title">Aktive Umfrage</span>
              <div class="section-line"></div>
              <button class="btn btn-ghost btn-sm" onclick="GH.navigate('polls')">Alle <i class="ti ti-arrow-right" style="font-size:12px"></i></button>
            </div>
            ${renderMiniPoll(polls[0])}
          </div>
        ` : `
          <div class="card card-pink">
            <div class="section-header mb-3"><span class="section-title">Umfragen</span><div class="section-line"></div></div>
            <div class="empty-state" style="padding:1rem"><span class="empty-icon" style="font-size:1.5rem">🗳️</span><p>Keine aktiven Umfragen</p>${me ? `<button class="btn btn-pink btn-sm mt-3" onclick="GH.navigate('polls');setTimeout(()=>Polls.openCreate(),100)">Erstellen</button>` : ''}</div>
          </div>
        `}

        <!-- Now Playing -->
        <div class="card card-purple">
          <div class="section-header mb-3">
            <span class="section-title">Aktive Spiele</span>
            <div class="section-line"></div>
            <button class="btn btn-ghost btn-sm" onclick="GH.navigate('library')">Library <i class="ti ti-arrow-right" style="font-size:12px"></i></button>
          </div>
          ${playingGames.length === 0 ? `<div class="empty-state" style="padding:1rem"><span class="empty-icon" style="font-size:1.5rem">🎮</span><p>Keine aktiven Spiele</p></div>` : ''}
          <div style="display:flex;flex-direction:column;gap:8px">
            ${playingGames.slice(0, 4).map(g => `
              <div class="flex items-center gap-2 cursor-pointer" onclick="GH.navigate('library')">
                <div style="width:32px;height:32px;border-radius:var(--radius-sm);background:rgba(180,0,255,0.08);border:1px solid rgba(180,0,255,0.2);display:flex;align-items:center;justify-content:center;flex-shrink:0">
                  ${g.cover ? `<img src="${U().escHtml(g.cover)}" style="width:100%;height:100%;object-fit:cover;border-radius:var(--radius-sm)" onerror="this.parentElement.innerHTML='<i class=\\'ti ti-device-gamepad\\' style=\\'font-size:14px;color:var(--text-muted)\\'></i>'">` : `<i class="ti ti-device-gamepad" style="font-size:14px;color:var(--text-muted)"></i>`}
                </div>
                <div style="flex:1;overflow:hidden">
                  <div style="font-size:0.85rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${U().escHtml(g.title)}</div>
                  ${g.genre ? `<div style="font-size:0.7rem;color:var(--text-muted)">${U().escHtml(g.genre)}</div>` : ''}
                </div>
                <span style="font-size:0.7rem;color:var(--neon-green)">▶ Aktiv</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Recent Chat -->
        <div class="card col-span-3">
          <div class="section-header mb-3">
            <span class="section-title">Letzter Chat</span>
            <div class="section-line"></div>
            <button class="btn btn-ghost btn-sm" onclick="GH.navigate('chat')">Chat öffnen <i class="ti ti-arrow-right" style="font-size:12px"></i></button>
          </div>
          ${chat.length === 0 ? `<div class="empty-state" style="padding:1rem"><span class="empty-icon" style="font-size:1.5rem">💬</span><p>Noch keine Nachrichten</p></div>` : `
            <div style="display:flex;flex-direction:column;gap:6px">
              ${chat.map(msg => `
                <div class="flex items-center gap-2">
                  ${U().renderAvatar(msg.author, 'sm')}
                  <span style="font-family:var(--font-display);font-size:0.7rem;color:var(--text-secondary);flex-shrink:0">${U().escHtml(msg.author)}</span>
                  <span style="font-size:0.85rem;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${U().escHtml(msg.text)}</span>
                  <span style="font-size:0.7rem;color:var(--text-muted);flex-shrink:0">${U().timeAgo(msg.timestamp)}</span>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      </div>
    `;
  }

  function renderMiniPoll(poll) {
    const me = S().getMe();
    const totalVotes = Object.keys(poll.votes || {}).length;
    const myVote = me ? poll.votes?.[me.username] : null;

    return `
      <p style="font-size:0.9rem;margin-bottom:10px;line-height:1.4">${U().escHtml(poll.question)}</p>
      <div style="display:flex;flex-direction:column;gap:6px">
        ${poll.options.slice(0,4).map((opt, i) => {
          const votes = Object.values(poll.votes||{}).filter(v=>v===i).length;
          const pct = totalVotes > 0 ? Math.round((votes/totalVotes)*100) : 0;
          const selected = myVote === i;
          return `
            <button onclick="Polls.vote('${poll.id}',${i});Dashboard.render()" style="background:${selected?'rgba(255,0,160,0.12)':'rgba(255,255,255,0.03)'};border:1px solid ${selected?'var(--neon-pink)':'var(--dark-border)'};border-radius:var(--radius-md);padding:0.4rem 0.75rem;width:100%;text-align:left;color:var(--text-primary);font-family:var(--font-body);font-size:0.85rem;cursor:${me?'pointer':'default'};display:flex;justify-content:space-between;align-items:center">
              <span>${U().escHtml(opt)}</span>
              ${myVote !== null && myVote !== undefined ? `<span style="font-family:var(--font-display);font-size:0.7rem;color:${selected?'var(--neon-pink)':'var(--text-muted)'}">${pct}%</span>` : ''}
            </button>
          `;
        }).join('')}
      </div>
      <div style="font-size:0.7rem;color:var(--text-muted);margin-top:6px">${totalVotes} Stimme${totalVotes!==1?'n':''}</div>
    `;
  }

  window.Dashboard = { render };
})();
