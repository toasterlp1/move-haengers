// ─────────────────────────────────────────────
//  OPBASE — Theme Customizer
// ─────────────────────────────────────────────

const PRESETS = [
  { id: 'military', name: 'Military',   bg: '#0a0c0e', surface: '#111417', accent: '#c8a84b' },
  { id: 'bloodred', name: 'Blood Red',  bg: '#0e0808', surface: '#1a0f0f', accent: '#e63946' },
  { id: 'matrix',   name: 'Matrix',     bg: '#040d08', surface: '#0a1a10', accent: '#00e676' },
  { id: 'ghost',    name: 'Ghost',      bg: '#0d0d0f', surface: '#151518', accent: '#8b9baa' },
  { id: 'neon',     name: 'Neon',       bg: '#060312', surface: '#0f0820', accent: '#bf5af2' },
  { id: 'deepblue', name: 'Deep Blue',  bg: '#060a14', surface: '#0a1020', accent: '#3b82f6' },
  { id: 'rust',     name: 'Rust',       bg: '#0e0a06', surface: '#1a1208', accent: '#e07b39' },
];

const EFFECTS = {
  none:      () => '',
  scanlines: () => `repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.07) 2px,rgba(0,0,0,0.07) 4px)`,
  grid:      (accent) => `linear-gradient(${accent}18 1px,transparent 1px),linear-gradient(90deg,${accent}18 1px,transparent 1px)`,
  hexagons:  (accent) => `radial-gradient(circle,${accent}12 1px,transparent 1px)`,
  noise:     () => `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E")`,
};

const EFFECT_SIZES = { grid: '32px 32px', hexagons: '24px 24px', noise: '256px 256px' };

let currentTheme = { bg: '#0a0c0e', surface: '#111417', accent: '#c8a84b', effect: 'scanlines' };

export function applyTheme({ bg, surface, accent, effect }) {
  const root = document.documentElement;
  root.style.setProperty('--bg', bg);
  root.style.setProperty('--surface', surface);
  root.style.setProperty('--surface2', adjustHex(surface, 8));
  root.style.setProperty('--accent', accent);
  root.style.setProperty('--accent-dim', accent + '33');
  root.style.setProperty('--border', accent + '22');

  const layer = document.getElementById('fx-layer');
  if (layer) {
    const fn = EFFECTS[effect] || EFFECTS.none;
    const bg2 = fn(accent);
    layer.style.background = bg2;
    layer.style.backgroundSize = EFFECT_SIZES[effect] || '';
  }

  currentTheme = { bg, surface, accent, effect };
  saveTheme();
}

export function saveTheme() {
  localStorage.setItem('opbase_theme', JSON.stringify(currentTheme));
}

export function loadTheme() {
  try {
    const saved = JSON.parse(localStorage.getItem('opbase_theme'));
    if (saved) { applyTheme(saved); return saved; }
  } catch {}
  applyTheme(currentTheme);
  return currentTheme;
}

export function renderThemeUI() {
  const presetEl = document.getElementById('theme-presets');
  if (presetEl) {
    presetEl.innerHTML = PRESETS.map(p => `
      <button class="theme-swatch ${currentTheme.accent === p.accent ? 'active' : ''}"
        style="background:${p.bg}; border-color:${p.accent};"
        title="${p.name}"
        onclick="window.applyPreset('${p.id}')">
        <span style="background:${p.accent};" class="swatch-dot"></span>
      </button>`).join('');
  }

  const effEl = document.getElementById('effect-btns');
  if (effEl) {
    effEl.innerHTML = Object.keys(EFFECTS).map(e => `
      <button class="btn sm ${currentTheme.effect === e ? 'active' : ''}" onclick="window.setFx('${e}')">
        ${e.charAt(0).toUpperCase() + e.slice(1)}
      </button>`).join('');
  }

  const bgPicker = document.getElementById('bg-picker');
  const accentPicker = document.getElementById('accent-picker');
  if (bgPicker) bgPicker.value = currentTheme.bg;
  if (accentPicker) accentPicker.value = currentTheme.accent;
}

export function getPreset(id) { return PRESETS.find(p => p.id === id); }
export function getCurrentTheme() { return { ...currentTheme }; }

function adjustHex(hex, amount) {
  const num = parseInt(hex.slice(1), 16);
  const clamp = x => Math.min(255, Math.max(0, x));
  const r = clamp(((num >> 16) & 0xff) + amount);
  const g = clamp(((num >> 8) & 0xff) + amount);
  const b = clamp((num & 0xff) + amount);
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}
