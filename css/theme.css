@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&family=Rajdhani:wght@300;400;500;600;700&family=Share+Tech+Mono&display=swap');

:root {
  --neon-cyan: #00f5ff;
  --neon-pink: #ff00a0;
  --neon-purple: #b400ff;
  --neon-green: #00ff88;
  --neon-orange: #ff6600;
  --dark-bg: #05060f;
  --dark-surface: #0a0c1a;
  --dark-card: #0d1025;
  --dark-card2: #111430;
  --dark-border: rgba(0,245,255,0.15);
  --dark-border-hover: rgba(0,245,255,0.4);
  --text-primary: #e8f4ff;
  --text-secondary: #7a8aaa;
  --text-muted: #3a4560;
  --font-display: 'Orbitron', monospace;
  --font-body: 'Rajdhani', sans-serif;
  --font-mono: 'Share Tech Mono', monospace;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  --glow-cyan: 0 0 20px rgba(0,245,255,0.3), 0 0 40px rgba(0,245,255,0.1);
  --glow-pink: 0 0 20px rgba(255,0,160,0.3), 0 0 40px rgba(255,0,160,0.1);
  --glow-purple: 0 0 20px rgba(180,0,255,0.3), 0 0 40px rgba(180,0,255,0.1);
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html { scroll-behavior: smooth; }

body {
  font-family: var(--font-body);
  background-color: var(--dark-bg);
  color: var(--text-primary);
  min-height: 100vh;
  overflow-x: hidden;
  font-size: 16px;
  line-height: 1.6;
}

/* Custom background override */
body.custom-bg-active {
  background-image: var(--custom-bg-image);
  background-size: cover;
  background-attachment: fixed;
  background-position: center;
}

/* Scanline overlay */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0,0,0,0.03) 2px,
    rgba(0,0,0,0.03) 4px
  );
  pointer-events: none;
  z-index: 9999;
}

/* Grid background pattern */
body::after {
  content: '';
  position: fixed;
  inset: 0;
  background-image:
    linear-gradient(rgba(0,245,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,245,255,0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
  z-index: 0;
}

/* ---- SCROLLBAR ---- */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: var(--dark-bg); }
::-webkit-scrollbar-thumb { background: rgba(0,245,255,0.3); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--neon-cyan); }

/* ---- TYPOGRAPHY ---- */
h1, h2, h3, h4 { font-family: var(--font-display); letter-spacing: 0.05em; }
h1 { font-size: clamp(1.5rem, 4vw, 2.5rem); font-weight: 700; }
h2 { font-size: clamp(1.1rem, 2.5vw, 1.6rem); font-weight: 500; }
h3 { font-size: 1.1rem; font-weight: 500; }
p { font-family: var(--font-body); }

/* ---- NEON TEXT ---- */
.neon-cyan { color: var(--neon-cyan); text-shadow: 0 0 10px rgba(0,245,255,0.6); }
.neon-pink { color: var(--neon-pink); text-shadow: 0 0 10px rgba(255,0,160,0.6); }
.neon-purple { color: var(--neon-purple); text-shadow: 0 0 10px rgba(180,0,255,0.6); }
.neon-green { color: var(--neon-green); text-shadow: 0 0 10px rgba(0,255,136,0.6); }

/* ---- CARDS ---- */
.card {
  background: var(--dark-card);
  border: 1px solid var(--dark-border);
  border-radius: var(--radius-lg);
  padding: 1.25rem;
  transition: border-color var(--transition), box-shadow var(--transition);
  position: relative;
  overflow: hidden;
}
.card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(0,245,255,0.03) 0%, transparent 60%);
  pointer-events: none;
}
.card:hover {
  border-color: var(--dark-border-hover);
  box-shadow: var(--glow-cyan);
}
.card-pink:hover { border-color: rgba(255,0,160,0.4); box-shadow: var(--glow-pink); }
.card-purple:hover { border-color: rgba(180,0,255,0.4); box-shadow: var(--glow-purple); }

/* ---- BUTTONS ---- */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0.5rem 1.2rem;
  border-radius: var(--radius-md);
  font-family: var(--font-display);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  cursor: pointer;
  transition: all var(--transition);
  border: 1px solid transparent;
  text-decoration: none;
  white-space: nowrap;
}
.btn-primary {
  background: rgba(0,245,255,0.1);
  border-color: var(--neon-cyan);
  color: var(--neon-cyan);
}
.btn-primary:hover {
  background: rgba(0,245,255,0.2);
  box-shadow: var(--glow-cyan);
  transform: translateY(-1px);
}
.btn-pink {
  background: rgba(255,0,160,0.1);
  border-color: var(--neon-pink);
  color: var(--neon-pink);
}
.btn-pink:hover {
  background: rgba(255,0,160,0.2);
  box-shadow: var(--glow-pink);
  transform: translateY(-1px);
}
.btn-purple {
  background: rgba(180,0,255,0.1);
  border-color: var(--neon-purple);
  color: var(--neon-purple);
}
.btn-purple:hover { background: rgba(180,0,255,0.2); box-shadow: var(--glow-purple); transform: translateY(-1px); }
.btn-ghost {
  background: transparent;
  border-color: var(--dark-border-hover);
  color: var(--text-secondary);
}
.btn-ghost:hover { border-color: var(--neon-cyan); color: var(--neon-cyan); }
.btn-danger {
  background: rgba(255,50,50,0.1);
  border-color: #ff3333;
  color: #ff3333;
}
.btn-danger:hover { background: rgba(255,50,50,0.2); }
.btn-sm { padding: 0.3rem 0.8rem; font-size: 0.65rem; }
.btn-lg { padding: 0.75rem 1.8rem; font-size: 0.85rem; }
.btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none !important; }

/* ---- FORM ELEMENTS ---- */
.input, .textarea, .select {
  background: rgba(0,245,255,0.04);
  border: 1px solid var(--dark-border);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 0.95rem;
  padding: 0.55rem 0.9rem;
  transition: border-color var(--transition), box-shadow var(--transition);
  width: 100%;
  outline: none;
}
.input:focus, .textarea:focus, .select:focus {
  border-color: var(--neon-cyan);
  box-shadow: 0 0 0 2px rgba(0,245,255,0.1);
}
.input::placeholder, .textarea::placeholder { color: var(--text-muted); }
.select option { background: var(--dark-card2); color: var(--text-primary); }
.textarea { resize: vertical; min-height: 80px; }
label { font-family: var(--font-display); font-size: 0.7rem; letter-spacing: 0.08em; color: var(--text-secondary); display: block; margin-bottom: 0.35rem; }

/* ---- BADGES ---- */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 10px;
  border-radius: 20px;
  font-family: var(--font-display);
  font-size: 0.6rem;
  letter-spacing: 0.1em;
  font-weight: 500;
}
.badge-cyan { background: rgba(0,245,255,0.1); color: var(--neon-cyan); border: 1px solid rgba(0,245,255,0.3); }
.badge-pink { background: rgba(255,0,160,0.1); color: var(--neon-pink); border: 1px solid rgba(255,0,160,0.3); }
.badge-green { background: rgba(0,255,136,0.1); color: var(--neon-green); border: 1px solid rgba(0,255,136,0.3); }
.badge-orange { background: rgba(255,102,0,0.1); color: var(--neon-orange); border: 1px solid rgba(255,102,0,0.3); }
.badge-purple { background: rgba(180,0,255,0.1); color: var(--neon-purple); border: 1px solid rgba(180,0,255,0.3); }
.badge-gray { background: rgba(255,255,255,0.05); color: var(--text-secondary); border: 1px solid var(--dark-border); }

/* ---- AVATAR ---- */
.avatar {
  width: 40px; height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--dark-border);
}
.avatar-initials {
  width: 40px; height: 40px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-display);
  font-size: 0.75rem;
  font-weight: 700;
  border: 2px solid var(--neon-cyan);
  color: var(--neon-cyan);
  background: rgba(0,245,255,0.08);
  flex-shrink: 0;
}
.avatar-lg { width: 56px; height: 56px; font-size: 1rem; }
.avatar-sm { width: 30px; height: 30px; font-size: 0.6rem; }

/* ---- STATUS DOT ---- */
.status-dot {
  width: 9px; height: 9px;
  border-radius: 50%;
  border: 2px solid var(--dark-card);
  flex-shrink: 0;
}
.status-online { background: var(--neon-green); box-shadow: 0 0 6px var(--neon-green); }
.status-away { background: var(--neon-orange); box-shadow: 0 0 6px var(--neon-orange); }
.status-busy { background: var(--neon-pink); box-shadow: 0 0 6px var(--neon-pink); }
.status-offline { background: var(--text-muted); box-shadow: none; }

/* ---- DIVIDER ---- */
.divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--dark-border), transparent);
  margin: 1rem 0;
}

/* ---- MODAL ---- */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.75);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--transition);
}
.modal-overlay.active { opacity: 1; pointer-events: all; }
.modal {
  background: var(--dark-card2);
  border: 1px solid var(--dark-border-hover);
  border-radius: var(--radius-xl);
  padding: 1.5rem;
  width: 100%;
  max-width: 520px;
  max-height: 85vh;
  overflow-y: auto;
  transform: translateY(20px) scale(0.97);
  transition: transform var(--transition);
  position: relative;
}
.modal-overlay.active .modal { transform: translateY(0) scale(1); }
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}

/* ---- TOAST ---- */
#toast-container {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 9000;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.toast {
  background: var(--dark-card2);
  border: 1px solid var(--dark-border-hover);
  border-radius: var(--radius-md);
  padding: 0.75rem 1rem;
  font-family: var(--font-body);
  font-size: 0.9rem;
  min-width: 260px;
  max-width: 380px;
  animation: toastIn 0.3s ease;
  box-shadow: var(--glow-cyan);
}
.toast.toast-success { border-color: rgba(0,255,136,0.4); box-shadow: 0 0 15px rgba(0,255,136,0.2); }
.toast.toast-error { border-color: rgba(255,50,50,0.4); box-shadow: 0 0 15px rgba(255,50,50,0.2); }
@keyframes toastIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }

/* ---- EMPTY STATE ---- */
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text-muted);
}
.empty-state .empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  display: block;
  opacity: 0.4;
}
.empty-state p { font-family: var(--font-body); font-size: 1rem; }

/* ---- PROGRESS BAR ---- */
.progress-bar {
  height: 6px;
  background: rgba(255,255,255,0.06);
  border-radius: 3px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  border-radius: 3px;
  background: linear-gradient(90deg, var(--neon-cyan), var(--neon-purple));
  transition: width 0.5s ease;
}

/* ---- UTILITIES ---- */
.flex { display: flex; }
.flex-col { display: flex; flex-direction: column; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.justify-center { justify-content: center; }
.gap-1 { gap: 4px; }
.gap-2 { gap: 8px; }
.gap-3 { gap: 12px; }
.gap-4 { gap: 16px; }
.gap-6 { gap: 24px; }
.w-full { width: 100%; }
.text-sm { font-size: 0.85rem; }
.text-xs { font-size: 0.75rem; }
.text-muted { color: var(--text-secondary); }
.font-mono { font-family: var(--font-mono); }
.truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.mt-1 { margin-top: 4px; }
.mt-2 { margin-top: 8px; }
.mt-3 { margin-top: 12px; }
.mt-4 { margin-top: 16px; }
.mb-1 { margin-bottom: 4px; }
.mb-2 { margin-bottom: 8px; }
.mb-3 { margin-bottom: 12px; }
.mb-4 { margin-bottom: 16px; }
.grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.hidden { display: none !important; }

@media (max-width: 768px) {
  .grid-2, .grid-3 { grid-template-columns: 1fr; }
  .hide-mobile { display: none; }
}
