/* ========== LAYOUT ========== */

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
  z-index: 1;
}

/* ---- TOPBAR ---- */
#topbar {
  position: fixed;
  top: 0; left: 0; right: 0;
  height: 60px;
  background: rgba(5,6,15,0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--dark-border);
  display: flex;
  align-items: center;
  padding: 0 1.5rem;
  gap: 1rem;
  z-index: 500;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  flex-shrink: 0;
}
.logo-icon {
  width: 32px; height: 32px;
  border: 2px solid var(--neon-cyan);
  border-radius: var(--radius-sm);
  display: flex; align-items: center; justify-content: center;
  color: var(--neon-cyan);
  font-size: 16px;
  box-shadow: var(--glow-cyan);
}
.logo-text {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: 0.1em;
}
.logo-text span { color: var(--neon-cyan); }

.topbar-nav {
  display: flex;
  align-items: center;
  gap: 2px;
  flex: 1;
  margin-left: 2rem;
}
.nav-btn {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 0.4rem 1rem;
  border-radius: var(--radius-md);
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-family: var(--font-display);
  font-size: 0.65rem;
  letter-spacing: 0.08em;
  cursor: pointer;
  transition: all var(--transition);
  text-decoration: none;
}
.nav-btn:hover { color: var(--text-primary); background: rgba(255,255,255,0.05); }
.nav-btn.active {
  color: var(--neon-cyan);
  background: rgba(0,245,255,0.08);
  border: 1px solid rgba(0,245,255,0.2);
}
.nav-btn i { font-size: 15px; }

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: auto;
}

.icon-btn {
  width: 36px; height: 36px;
  border-radius: var(--radius-md);
  background: transparent;
  border: 1px solid var(--dark-border);
  color: var(--text-secondary);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: all var(--transition);
  position: relative;
}
.icon-btn:hover { border-color: var(--neon-cyan); color: var(--neon-cyan); }
.icon-btn .notif-dot {
  position: absolute;
  top: 5px; right: 5px;
  width: 7px; height: 7px;
  background: var(--neon-pink);
  border-radius: 50%;
  border: 2px solid var(--dark-bg);
  box-shadow: 0 0 6px var(--neon-pink);
}

/* ---- MAIN CONTENT ---- */
#main-content {
  margin-top: 60px;
  flex: 1;
  padding: 1.5rem;
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  padding-top: calc(60px + 1.5rem);
}

/* ---- PAGES ---- */
.page { display: none; }
.page.active { display: block; animation: pageFadeIn 0.3s ease; }
@keyframes pageFadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

/* ---- PAGE HEADER ---- */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}
.page-title {
  display: flex;
  align-items: center;
  gap: 12px;
}
.page-title-icon {
  width: 40px; height: 40px;
  border-radius: var(--radius-md);
  display: flex; align-items: center; justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}
.page-title-icon.cyan { background: rgba(0,245,255,0.1); color: var(--neon-cyan); border: 1px solid rgba(0,245,255,0.2); }
.page-title-icon.pink { background: rgba(255,0,160,0.1); color: var(--neon-pink); border: 1px solid rgba(255,0,160,0.2); }
.page-title-icon.purple { background: rgba(180,0,255,0.1); color: var(--neon-purple); border: 1px solid rgba(180,0,255,0.2); }
.page-title-icon.green { background: rgba(0,255,136,0.1); color: var(--neon-green); border: 1px solid rgba(0,255,136,0.2); }
.page-title h1 { font-size: 1.3rem; }
.page-title p { color: var(--text-secondary); font-size: 0.85rem; margin-top: 2px; }

/* ---- SECTION HEADER ---- */
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}
.section-title {
  font-family: var(--font-display);
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  color: var(--text-secondary);
  text-transform: uppercase;
}
.section-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, var(--dark-border), transparent);
  margin-left: 1rem;
}

/* ---- DASHBOARD GRID ---- */
.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: auto;
  gap: 16px;
}
.col-span-2 { grid-column: span 2; }
.col-span-3 { grid-column: span 3; }

@media (max-width: 1100px) {
  .dashboard-grid { grid-template-columns: 1fr 1fr; }
  .col-span-2 { grid-column: span 1; }
  .col-span-3 { grid-column: span 2; }
}
@media (max-width: 768px) {
  .dashboard-grid { grid-template-columns: 1fr; }
  .col-span-2, .col-span-3 { grid-column: span 1; }
  #topbar { padding: 0 1rem; }
  .topbar-nav { display: none; }
  #main-content { padding: 0.75rem; padding-top: calc(60px + 0.75rem); }
}

/* ---- SETTINGS LAYOUT ---- */
.settings-layout {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 20px;
}
.settings-sidebar { display: flex; flex-direction: column; gap: 4px; }
.settings-nav-item {
  padding: 0.6rem 1rem;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-family: var(--font-display);
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  color: var(--text-secondary);
  transition: all var(--transition);
  display: flex; align-items: center; gap: 8px;
  border: 1px solid transparent;
}
.settings-nav-item:hover { color: var(--text-primary); background: rgba(255,255,255,0.04); }
.settings-nav-item.active { color: var(--neon-cyan); background: rgba(0,245,255,0.07); border-color: rgba(0,245,255,0.2); }

@media (max-width: 768px) {
  .settings-layout { grid-template-columns: 1fr; }
}
