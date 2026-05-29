// ============================================================
//  GamingHub — app.js
//  Entry point: router, init, global helpers
// ============================================================

window.GH = window.GH || {};

// ---- ROUTER ----
let currentPage = 'dashboard';

GH.navigate = function(page) {
  if (currentPage === 'chat') Chat.stopPolling?.();

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
    dashboard: () => Dashboard.render(),
    events:    () => Events.render(),
    polls:     () => Polls.render(),
    library:   () => Library.render(),
    chat:      () => Chat.render(),
    profiles:  () => Profiles.render(),
    settings:  () => Settings.render(),
  };
  renderers[page]?.();
  currentPage = page;

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

GH.handleProfileClick = function() {
  const me = GH.storage.getMe();
  if (me) GH.navigate('profiles');
  else { GH.navigate('profiles'); setTimeout(() => Profiles.openCreate(), 150); }
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
  const me = GH.storage.getMe();
  if (!me) return;
  if (document.hidden) {
    if (me.status === 'online') {
      me.status = 'away';
      GH.storage.saveMe(me);
    }
  } else {
    if (me.status !== 'online') {
      me.status = 'online';
      GH.storage.saveMe(me);
    }
  }
}
document.addEventListener('visibilitychange', heartbeat);

// ---- KEYBOARD SHORTCUTS ----
document.addEventListener('keydown', e => {
  if (e.altKey) {
    const shortcuts = { '1':'dashboard','2':'events','3':'polls','4':'library','5':'chat','6':'profiles','0':'settings' };
    if (shortcuts[e.key]) { e.preventDefault(); GH.navigate(shortcuts[e.key]); }
  }
});

// ---- NOTIFICATION DOT ----
function checkNotifications() {
  const me = GH.storage.getMe();
  if (!me) return;
  const settings = GH.storage.getSettings();
  const dot = document.getElementById('notif-dot');
  if (dot && !settings.discordWebhook) {
    dot.style.display = 'block';
  } else if (dot) {
    dot.style.display = 'none';
  }
}

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  // Seed demo data on first run
  GH.storage.seedIfEmpty();

  // Apply saved background settings
  Settings.initFromStorage();

  // Setup mobile nav
  setupMobileNav();

  // Update topbar profile button
  Profiles.updateTopbarProfile();

  // Check notifications
  checkNotifications();

  // Render initial page
  GH.navigate('dashboard');

  // Welcome toast
  const me = GH.storage.getMe();
  if (me) {
    setTimeout(() => GH.utils.showToast(`Willkommen zurück, ${me.username}! 🎮`, 'success'), 500);
  } else {
    setTimeout(() => GH.utils.showToast('Tipp: Alt+1-6 für schnelle Navigation', 'info'), 1000);
  }

  // Periodic cleanup (every 30 min)
  setInterval(() => {
    GH.storage.getEvents();
    GH.storage.getPolls();
    GH.storage.getChat();
  }, 30 * 60 * 1000);
});
