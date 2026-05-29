// ============================================================
//  GamingHub — chat.js
// ============================================================

const Chat = (() => {
  const S = () => window.GH.storage;
  const U = () => window.GH.utils;
  let pollInterval = null;
  let lastCount = 0;

  function render() {
    const me = S().getMe();

    document.getElementById('chat-page').innerHTML = `
      <div class="page-header">
        <div class="page-title">
          <div class="page-title-icon green"><i class="ti ti-message-circle"></i></div>
          <div><h1>Chat</h1><p>Redet, plant, trogt</p></div>
        </div>
        <div class="flex items-center gap-2">
          <span class="badge badge-green" id="chat-online-badge"></span>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 260px;gap:16px;height:calc(100vh - 200px);min-height:400px">
        <!-- Messages -->
        <div style="display:flex;flex-direction:column">
          <div class="card" style="flex:1;overflow-y:auto;padding:1rem;display:flex;flex-direction:column;gap:8px;margin-bottom:12px" id="chat-messages-container"></div>
          ${me ? `
            <div class="flex gap-2">
              <input class="input" id="chat-input" placeholder="Nachricht eingeben..." style="flex:1" maxlength="500" onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();Chat.send()}">
              <button class="btn btn-primary" onclick="Chat.send()"><i class="ti ti-send"></i></button>
            </div>
            <div style="font-size:0.75rem;color:var(--text-muted);margin-top:4px">Enter zum Senden · Nachrichten verschwinden nach 3 Tagen</div>
          ` : `<div class="card" style="text-align:center;padding:1rem;color:var(--text-secondary)">Erstell ein Profil um zu chatten</div>`}
        </div>
        <!-- Online users sidebar -->
        <div>
          <div class="card" style="position:sticky;top:80px">
            <div class="section-header" style="margin-bottom:0.75rem">
              <span class="section-title">Online</span>
              <div class="section-line"></div>
            </div>
            <div id="chat-users-list" style="display:flex;flex-direction:column;gap:8px"></div>
          </div>
        </div>
      </div>
    `;

    renderMessages();
    renderUserList();
    startPolling();
  }

  function renderMessages() {
    const me = S().getMe();
    const messages = S().getChat();
    const container = document.getElementById('chat-messages-container');
    if (!container) return;

    if (messages.length === 0) {
      container.innerHTML = `<div class="empty-state" style="padding:2rem"><span class="empty-icon" style="font-size:2rem">💬</span><p>Noch nichts. Fang an zu reden!</p></div>`;
      return;
    }

    let html = '';
    let prevAuthor = null;
    messages.forEach(msg => {
      const isMe = me?.username === msg.author;
      const showAvatar = msg.author !== prevAuthor;
      prevAuthor = msg.author;

      html += `
        <div style="display:flex;flex-direction:${isMe ? 'row-reverse' : 'row'};gap:8px;align-items:flex-end;${!showAvatar ? 'margin-top:-4px' : ''}">
          ${showAvatar ? `<div style="flex-shrink:0">${U().renderAvatar(msg.author, 'sm')}</div>` : `<div style="width:30px;flex-shrink:0"></div>`}
          <div style="max-width:70%">
            ${showAvatar ? `<div style="font-size:0.75rem;color:var(--text-secondary);margin-bottom:3px;${isMe ? 'text-align:right' : ''}">${U().escHtml(msg.author)} <span style="color:var(--text-muted)">${U().timeAgo(msg.timestamp)}</span></div>` : ''}
            <div style="background:${isMe ? 'rgba(0,245,255,0.1)' : 'rgba(255,255,255,0.05)'};border:1px solid ${isMe ? 'rgba(0,245,255,0.25)' : 'var(--dark-border)'};border-radius:${isMe ? '12px 12px 4px 12px' : '12px 12px 12px 4px'};padding:0.5rem 0.85rem;font-size:0.9rem;word-break:break-word;position:relative;group">
              ${U().escHtml(msg.text)}
              ${(isMe || me?.username === msg.author) ? `<button onclick="Chat.deleteMsg('${msg.id}')" style="position:absolute;top:4px;right:4px;background:none;border:none;color:var(--text-muted);cursor:pointer;opacity:0;transition:opacity 0.2s;font-size:11px" class="del-btn"><i class="ti ti-x"></i></button>` : ''}
            </div>
          </div>
        </div>
      `;
    });
    container.innerHTML = html;
    container.scrollTop = container.scrollHeight;

    // Show delete buttons on hover
    container.querySelectorAll('.del-btn').forEach(btn => {
      const parent = btn.closest('div[style*="max-width"]');
      parent?.addEventListener('mouseenter', () => btn.style.opacity = '1');
      parent?.addEventListener('mouseleave', () => btn.style.opacity = '0');
    });
  }

  function renderUserList() {
    const profiles = S().getProfiles();
    const el = document.getElementById('chat-users-list');
    if (!el) return;
    const sorted = [...profiles].sort((a, b) => {
      const order = { online: 0, away: 1, busy: 2, offline: 3 };
      return (order[a.status] || 3) - (order[b.status] || 3);
    });
    el.innerHTML = sorted.map(p => `
      <div class="flex items-center gap-2" style="padding:0.3rem 0">
        <div style="position:relative">
          ${U().renderAvatar(p.username, 'sm')}
          <div style="position:absolute;bottom:0;right:0">${U().renderStatusDot(p.status)}</div>
        </div>
        <div style="overflow:hidden">
          <div style="font-size:0.85rem;font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${U().escHtml(p.username)}</div>
        </div>
      </div>
    `).join('');

    const online = profiles.filter(p => p.status === 'online').length;
    const badge = document.getElementById('chat-online-badge');
    if (badge) badge.textContent = `${online} online`;
  }

  function send() {
    const me = S().getMe();
    if (!me) return;
    const input = document.getElementById('chat-input');
    const text = input?.value.trim();
    if (!text) return;
    S().addMessage({ author: me.username, text });
    input.value = '';
    renderMessages();
  }

  function deleteMsg(id) {
    const me = S().getMe();
    const msg = S().getChat().find(m => m.id === id);
    if (!msg || msg.author !== me?.username) return;
    S().deleteMessage(id);
    renderMessages();
  }

  function startPolling() {
    if (pollInterval) clearInterval(pollInterval);
    pollInterval = setInterval(() => {
      const msgs = S().getChat();
      if (msgs.length !== lastCount) {
        lastCount = msgs.length;
        renderMessages();
      }
      renderUserList();
    }, 5000);
  }

  function stopPolling() {
    if (pollInterval) clearInterval(pollInterval);
  }

  window.Chat = { render, send, deleteMsg, stopPolling };
})();
