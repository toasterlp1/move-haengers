// ============================================================
//  GamingHub — utils.js
//  Toast, modals, time helpers, Discord notifications
// ============================================================

console.log('GH: utils.js loaded');

// ---- TOAST ----
function showToast(message, type = 'info', duration = 3500) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  const icons = { success: '✓', error: '✗', info: '◈', warning: '⚠' };
  toast.innerHTML = `<span style="margin-right:8px;color:var(--neon-${type === 'success' ? 'green' : type === 'error' ? 'pink' : 'cyan'})">${icons[type] || '◈'}</span>${message}`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(20px)';
    toast.style.transition = '0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ---- MODAL ----
function openModal(id) {
  const overlay = document.getElementById(id);
  if (overlay) overlay.classList.add('active');
}

function closeModal(id) {
  const overlay = document.getElementById(id);
  if (overlay) overlay.classList.remove('active');
}

// Close modal on overlay click
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('active');
  }
});

// Close on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
  }
});

// ---- TIME HELPERS ----
function formatDateTime(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' })
    + ' · ' + d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return 'gerade eben';
  const m = Math.floor(s / 60);
  if (m < 60) return `vor ${m} Min.`;
  const h = Math.floor(m / 60);
  if (h < 24) return `vor ${h} Std.`;
  const dy = Math.floor(h / 24);
  return `vor ${dy} Tag${dy > 1 ? 'en' : ''}`;
}

function isUpcoming(iso) {
  return new Date(iso) > new Date();
}

function daysUntil(iso) {
  const diff = new Date(iso) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function countdownText(iso) {
  const diff = new Date(iso) - new Date();
  if (diff < 0) return 'Vorbei';
  const h = Math.floor(diff / (1000 * 60 * 60));
  if (h < 1) {
    const m = Math.floor(diff / (1000 * 60));
    return `in ${m} Min.`;
  }
  if (h < 24) return `in ${h} Std.`;
  const d = Math.floor(h / 24);
  return `in ${d} Tag${d > 1 ? 'en' : ''}`;
}

// ---- AVATAR ----
function getInitials(name) {
  return name.slice(0, 2).toUpperCase();
}

function avatarColor(username) {
  const profile = window.GH?.storage?.getProfile(username);
  if (profile?.color) return profile.color;
  const colors = ['#00f5ff','#ff00a0','#b400ff','#00ff88','#ff6600'];
  let hash = 0;
  for (const c of username) hash = (hash * 31 + c.charCodeAt(0)) & 0xffffffff;
  return colors[Math.abs(hash) % colors.length];
}

function renderAvatar(username, size = 'md') {
  const profile = window.GH?.storage?.getProfile(username);
  const color = avatarColor(username);
  const sizeClass = size === 'sm' ? 'avatar-sm' : size === 'lg' ? 'avatar-lg' : '';
  if (profile?.avatarUrl) {
    return `<img src="${profile.avatarUrl}" class="avatar ${sizeClass}" alt="${username}" style="border-color:${color}">`;
  }
  return `<div class="avatar-initials ${sizeClass}" style="border-color:${color};color:${color};background:${color}18">${getInitials(username)}</div>`;
}

function renderStatusDot(status) {
  const cls = { online: 'status-online', away: 'status-away', busy: 'status-busy', offline: 'status-offline' }[status] || 'status-offline';
  return `<span class="status-dot ${cls}"></span>`;
}

// ---- DISCORD WEBHOOK ----
async function sendDiscordNotification(message, webhook) {
  const url = webhook || window.GH?.storage?.getSettings()?.discordWebhook;
  if (!url || !url.startsWith('https://discord.com/api/webhooks/')) return false;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'GamingHub 🎮',
        avatar_url: 'https://i.imgur.com/4M34hi2.png',
        content: message,
      }),
    });
    return res.ok;
  } catch { return false; }
}

async function notifyPoll(poll) {
  const settings = window.GH?.storage?.getSettings();
  if (!settings?.discordNotifications) return;
  const msg = `🗳️ **Neue Umfrage von ${poll.createdBy}!**\n> **${poll.question}**\n${poll.options.map((o,i) => `${['1️⃣','2️⃣','3️⃣','4️⃣'][i] || (i+1)+'.'} ${o}`).join('\n')}\n\nJetzt abstimmen auf **GamingHub** 🎮`;
  return sendDiscordNotification(msg, settings.discordWebhook);
}

async function notifyEvent(event) {
  const settings = window.GH?.storage?.getSettings();
  if (!settings?.discordNotifications) return;
  const msg = `📅 **Neue Gaming-Session!**\n> **${event.title}** — ${event.game}\n🕹️ Host: ${event.host}\n🗓️ ${formatDateTime(event.datetime)}\n${event.description ? '💬 ' + event.description + '\n' : ''}\nJetzt RSVP auf **GamingHub** 🎮`;
  return sendDiscordNotification(msg, settings.discordWebhook);
}

// ---- CONFIRM DIALOG ----
function confirmAction(message, onConfirm) {
  const id = 'confirm-modal-' + Date.now();
  const div = document.createElement('div');
  div.id = id;
  div.className = 'modal-overlay active';
  div.innerHTML = `
    <div class="modal" style="max-width:380px">
      <div style="text-align:center;padding:1rem 0">
        <div style="font-size:2rem;margin-bottom:0.75rem">⚠️</div>
        <h3 style="margin-bottom:0.5rem">Sicher?</h3>
        <p style="color:var(--text-secondary);font-size:0.9rem">${message}</p>
        <div class="flex gap-3 justify-center mt-4">
          <button class="btn btn-ghost" onclick="document.getElementById('${id}').remove()">Abbrechen</button>
          <button class="btn btn-danger" id="${id}-confirm">Löschen</button>
        </div>
      </div>
    </div>`;
  document.body.appendChild(div);
  document.getElementById(`${id}-confirm`).onclick = () => {
    div.remove();
    onConfirm();
  };
}

// ---- ESCAPE HTML ----
function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}

// ---- SEARCH/FILTER ----
function fuzzyMatch(text, query) {
  return text.toLowerCase().includes(query.toLowerCase());
}

// Export
window.GH = window.GH || {};
window.GH.utils = {
  showToast, openModal, closeModal,
  formatDateTime, formatDate, timeAgo, isUpcoming, daysUntil, countdownText,
  renderAvatar, renderStatusDot, avatarColor,
  sendDiscordNotification, notifyPoll, notifyEvent,
  confirmAction, escHtml, fuzzyMatch,
};
