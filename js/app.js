// ============================================================
//  GamingHub — app.js
//  Entry point: router, init, global helpers
// ============================================================

// ============================================================
//  DEBUG: Check all modules loaded
// ============================================================
console.log('GH: app.js loaded');
console.log('GH modules check:', {
  Dashboard: typeof window.Dashboard,
  Events: typeof window.Events,
  Polls: typeof window.Polls,
  Library: typeof window.Library,
  Chat: typeof window.Chat,
  Profiles: typeof window.Profiles,
  Settings: typeof window.Settings,
  storage: typeof window.GH?.storage,
  utils: typeof window.GH?.utils,
});

window.GH = window.GH || {};

// ---- ROUTER ----
let currentPage = 'dashboard';

GH.navigate = function(page) {
  if (currentPage === 'chat') window.Chat?.stopPolling?.();

  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

  // Show target
  const target = document.getElementById(`${page}-page`);
  if (target) target.classList.add('active');

  // Update nav buttons
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  const navBtn = document.getElementById(`nav-${page}`);
  if (navBtn) navBtn.classList.add('active');

  // Update mobile nav
  document.querySelectorAll('[id^="mobnav-"]').forEach(btn => {
    btn.style.color = 'var(--text-secondary)';
  });
  const mobBtn = document.getElementById(`mobnav-${page}`);
  if (mobBtn) mobBtn.style.color = 'var(--neon-cyan)';

  // Render page
  const renderers = {
    dashboard: () => window.Dashboard.render(),
    events:    () => window.Events.render(),
    polls:     () => window.Polls.render(),
    library:   () => window.Library.render(),
    chat:      () => window.Chat.render(),
    profiles:  () => window.Profiles.render(),
    settings:  () => window.Settings.render(),
  };
  renderers[page]?.();
  currentPage = page;

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

GH.handleProfileClick = function() {
  const me = window.GH.storage.getMe();
  if (me) window.GH.navigate('profiles');
  else { window.GH.navigate('profiles'); setTimeout(() => window.Profiles.openCreate(), 150); }
};

// ---- MOBILE DETECTION ----
function setupMobileNav() {
  const mobileNav = document.getElementById('mobile-nav');
  if (!mobileNav) return;
  if (window.innerWidth <= 768) {
    mobileNav.style.display = 'flex';
    document.getElementById('main-content').style.paddingBottom = '70px';
  } else {
    mobileNav.style.display = 'none';
    document.getElementById('main-content').style.paddingBottom = '';
  }
}
window.addEventListener('resize', setupMobileNav);

// ---- ACTIVE USER HEARTBEAT ----
function heartbeat() {
  const me = window.GH.storage.getMe();
  if (!me) return;
  if (document.hidden) {
    if (me.status === 'online') {
      me.status = 'away';
      window.GH.storage.saveMe(me);
    }
  } else {
    if (me.status !== 'online') {
      me.status = 'online';
      window.GH.storage.saveMe(me);
    }
  }
}
document.addEventListener('visibilitychange', heartbeat);

// ---- KEYBOARD SHORTCUTS ----
document.addEventListener('keydown', e => {
  if (e.altKey) {
    const shortcuts = { '1':'dashboard','2':'events','3':'polls','4':'library','5':'chat','6':'profiles','0':'settings' };
    if (shortcuts[e.key]) { e.preventDefault(); window.GH.navigate(shortcuts[e.key]); }
  }
});

// ---- NOTIFICATION DOT ----
function checkNotifications() {
  const me = window.GH.storage.getMe();
  if (!me) return;
  const settings = window.GH.storage.getSettings();
  const dot = document.getElementById('notif-dot');
  if (dot && !settings.discordWebhook) {
    dot.style.display = 'block';
  } else if (dot) {
    dot.style.display = 'none';
  }
}

// ---- INIT ----
function ghInit() {
  try {
    window.GH.storage.seedIfEmpty();
  } catch(e) { console.error('seed error', e); }

  try {
    window.Settings.initFromStorage();
  } catch(e) { console.error('settings init error', e); }

  setupMobileNav();

  try {
    window.Profiles.updateTopbarProfile();
  } catch(e) { console.error('profile btn error', e); }

  checkNotifications();

  try {
    window.GH.navigate('dashboard');
  } catch(e) {
    console.error('navigate error', e);
    // Fallback: show raw error on page
    const main = document.getElementById('main-content');
    if (main) main.innerHTML = '<div style="padding:2rem;color:#ff3333;font-family:monospace">Init error: ' + e.message + '<br><br>' + e.stack + '</div>';
  }

  const me = window.GH.storage.getMe();
  if (me) {
    setTimeout(() => window.GH.utils.showToast('Willkommen zurück, ' + me.username + '! 🎮', 'success'), 500);
  } else {
    setTimeout(() => window.GH.utils.showToast('Tipp: Alt+1-6 für schnelle Navigation', 'info'), 1000);
  }

  setInterval(() => {
    try { window.GH.storage.getEvents(); window.GH.storage.getPolls(); window.GH.storage.getChat(); } catch(e) {}
  }, 30 * 60 * 1000);
}

ghInit();
