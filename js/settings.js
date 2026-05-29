// ============================================================
//  GamingHub — settings.js
// ============================================================

const Settings = (() => {
  const S = () => window.GH.storage;
  const U = () => window.GH.utils;
  let activeSection = 'appearance';

  const PRESETS = [
    { id: 'default',    label: 'Default',       preview: 'linear-gradient(135deg,#05060f 0%,#0a0c1a 100%)' },
    { id: 'void',       label: 'Void',          preview: 'linear-gradient(135deg,#000000 0%,#0d001a 100%)' },
    { id: 'matrix',     label: 'Matrix',        preview: 'linear-gradient(135deg,#000d00 0%,#001a00 100%)' },
    { id: 'deep-space', label: 'Deep Space',    preview: 'linear-gradient(135deg,#000010 0%,#0a0020 100%)' },
    { id: 'inferno',    label: 'Inferno',       preview: 'linear-gradient(135deg,#1a0000 0%,#200800 100%)' },
    { id: 'ocean',      label: 'Ocean',         preview: 'linear-gradient(135deg,#000d1a 0%,#001020 100%)' },
    { id: 'nordic',     label: 'Nordic',        preview: 'linear-gradient(135deg,#0d0d10 0%,#101520 100%)' },
    { id: 'sakura',     label: 'Sakura',        preview: 'linear-gradient(135deg,#1a0010 0%,#150018 100%)' },
  ];

  const EFFECTS = [
    { id: 'none',       label: 'Kein Effekt' },
    { id: 'scanlines',  label: 'Scanlines' },
    { id: 'grid',       label: 'Grid' },
    { id: 'noise',      label: 'Rauschen' },
    { id: 'particles',  label: 'Partikel' },
    { id: 'rain',       label: 'Cyber-Regen' },
  ];

  function render() {
    const settings = S().getSettings();
    const me = S().getMe();

    document.getElementById('settings-page').innerHTML = `
      <div class="page-header">
        <div class="page-title">
          <div class="page-title-icon cyan"><i class="ti ti-settings"></i></div>
          <div><h1>Einstellungen</h1><p>Personalisiere deinen GamingHub</p></div>
        </div>
      </div>
      <div class="settings-layout">
        <div class="settings-sidebar card" style="padding:0.75rem;height:fit-content">
          ${[
            { id:'appearance', icon:'ti-palette',  label:'Aussehen' },
            { id:'notifications', icon:'ti-bell',  label:'Benachrichtigungen' },
            { id:'account',   icon:'ti-user',      label:'Account' },
            { id:'data',      icon:'ti-database',  label:'Daten' },
          ].map(item => `
            <button class="settings-nav-item ${activeSection === item.id ? 'active' : ''}" onclick="Settings.switchSection('${item.id}')">
              <i class="ti ${item.icon}"></i> ${item.label}
            </button>
          `).join('')}
        </div>
        <div id="settings-content"></div>
      </div>
    `;
    renderSection(settings, me);
  }

  function switchSection(section) {
    activeSection = section;
    const settings = S().getSettings();
    const me = S().getMe();
    document.querySelectorAll('.settings-nav-item').forEach(btn => {
      btn.classList.toggle('active', btn.textContent.trim().toLowerCase().includes(section) || btn.getAttribute('onclick')?.includes(section));
    });
    renderSection(settings, me);
  }

  function renderSection(settings, me) {
    const content = document.getElementById('settings-content');
    if (!content) return;
    const sections = {
      appearance:    renderAppearance,
      notifications: renderNotifications,
      account:       renderAccount,
      data:          renderData,
    };
    (sections[activeSection] || renderAppearance)(content, settings, me);
  }

  function renderAppearance(el, settings) {
    el.innerHTML = `
      <div class="card" style="display:flex;flex-direction:column;gap:1.5rem">
        <div>
          <h3 class="neon-cyan" style="margin-bottom:1rem;font-size:0.9rem">Voreingestellte Themes</h3>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:10px">
            ${PRESETS.map(p => `
              <div onclick="Settings.applyPreset('${p.id}')" style="cursor:pointer;border-radius:var(--radius-md);overflow:hidden;border:2px solid ${settings.bgPreset === p.id ? 'var(--neon-cyan)' : 'var(--dark-border)'};transition:all 0.2s">
                <div style="height:60px;background:${p.preview}"></div>
                <div style="padding:4px 8px;font-family:var(--font-display);font-size:0.6rem;color:${settings.bgPreset === p.id ? 'var(--neon-cyan)' : 'var(--text-secondary)'};background:var(--dark-card)">${p.label}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="divider"></div>

        <div>
          <h3 class="neon-pink" style="margin-bottom:1rem;font-size:0.9rem">Eigene Hintergrundfarbe</h3>
          <div class="flex items-center gap-3" style="flex-wrap:wrap">
            <div>
              <label>Primärfarbe</label>
              <input type="color" id="bg-color1" value="${settings.bgColor1 || '#05060f'}" style="width:44px;height:44px;border-radius:var(--radius-md);border:1px solid var(--dark-border);background:none;cursor:pointer;padding:2px">
            </div>
            <div>
              <label>Sekundärfarbe</label>
              <input type="color" id="bg-color2" value="${settings.bgColor2 || '#0a0c1a'}" style="width:44px;height:44px;border-radius:var(--radius-md);border:1px solid var(--dark-border);background:none;cursor:pointer;padding:2px">
            </div>
            <div>
              <label>Richtung</label>
              <select class="select" id="bg-direction" style="max-width:150px">
                ${['135deg','to right','to bottom','to bottom right','45deg','225deg'].map(d => `<option value="${d}" ${settings.bgDirection === d ? 'selected' : ''}>${d}</option>`).join('')}
              </select>
            </div>
            <button class="btn btn-pink" onclick="Settings.applyCustomColor()"><i class="ti ti-check"></i> Anwenden</button>
          </div>
        </div>

        <div class="divider"></div>

        <div>
          <h3 class="neon-purple" style="margin-bottom:1rem;font-size:0.9rem">Hintergrundeffekte</h3>
          <div style="display:flex;flex-wrap:wrap;gap:8px">
            ${EFFECTS.map(e => `
              <button class="btn btn-sm ${settings.bgEffect === e.id ? 'btn-purple' : 'btn-ghost'}" onclick="Settings.applyEffect('${e.id}')">${e.label}</button>
            `).join('')}
          </div>
        </div>

        <div class="divider"></div>

        <div>
          <h3 style="margin-bottom:1rem;font-size:0.9rem;color:var(--text-secondary)">Bild-URL als Hintergrund</h3>
          <div class="flex gap-2">
            <input class="input" id="bg-image-url" placeholder="https://..." value="${settings.bgImageUrl || ''}" style="flex:1">
            <button class="btn btn-primary" onclick="Settings.applyImageUrl()"><i class="ti ti-photo"></i> Setzen</button>
          </div>
        </div>

        <div class="flex justify-between mt-2">
          <button class="btn btn-ghost" onclick="Settings.resetBackground()"><i class="ti ti-refresh"></i> Zurücksetzen</button>
          <span style="font-size:0.8rem;color:var(--text-muted)">Einstellungen werden lokal gespeichert</span>
        </div>
      </div>
    `;
  }

  function renderNotifications(el, settings) {
    el.innerHTML = `
      <div class="card" style="display:flex;flex-direction:column;gap:1.25rem">
        <h3 class="neon-cyan" style="font-size:0.9rem">Discord Webhook</h3>
        <p style="color:var(--text-secondary);font-size:0.85rem">
          Trage einen Discord Webhook ein, damit deine Freunde Benachrichtigungen erhalten wenn du eine neue Session oder Umfrage erstellst.
          <a href="https://support.discord.com/hc/en-us/articles/228383668" target="_blank" style="color:var(--neon-cyan)">Wie erstelle ich einen Webhook?</a>
        </p>
        <div>
          <label>Webhook-URL</label>
          <input class="input" id="discord-webhook" type="url" placeholder="https://discord.com/api/webhooks/..." value="${settings.discordWebhook || ''}">
        </div>
        <div class="flex items-center gap-3">
          <label style="font-size:0.85rem;margin-bottom:0;cursor:pointer;display:flex;align-items:center;gap:8px">
            <input type="checkbox" id="discord-enabled" ${settings.discordNotifications !== false ? 'checked' : ''} style="accent-color:var(--neon-cyan);width:16px;height:16px">
            Discord-Benachrichtigungen aktiviert
          </label>
        </div>
        <div class="flex gap-3">
          <button class="btn btn-primary" onclick="Settings.saveNotifications()"><i class="ti ti-device-floppy"></i> Speichern</button>
          <button class="btn btn-ghost" onclick="Settings.testWebhook()"><i class="ti ti-send"></i> Test senden</button>
        </div>
        <div class="divider"></div>
        <div>
          <h3 style="font-size:0.9rem;margin-bottom:0.75rem;color:var(--text-secondary)">Wann benachrichtigen?</h3>
          <div style="display:flex;flex-direction:column;gap:8px">
            ${[
              { id: 'notif-new-event',  label: 'Neue Gaming-Session' },
              { id: 'notif-new-poll',   label: 'Neue Umfrage' },
            ].map(n => `
              <label style="font-size:0.85rem;cursor:pointer;display:flex;align-items:center;gap:8px;color:var(--text-secondary)">
                <input type="checkbox" checked style="accent-color:var(--neon-cyan);width:16px;height:16px">
                ${n.label}
              </label>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  function renderAccount(el, settings, me) {
    el.innerHTML = `
      <div class="card" style="display:flex;flex-direction:column;gap:1.25rem">
        <h3 class="neon-cyan" style="font-size:0.9rem">Mein Account</h3>
        ${me ? `
          <div class="flex items-center gap-3">
            ${U().renderAvatar(me.username, 'lg')}
            <div>
              <div style="font-family:var(--font-display);font-size:1rem">${U().escHtml(me.username)}</div>
              <div style="color:var(--text-secondary);font-size:0.85rem">${me.bio || 'Keine Bio'}</div>
            </div>
          </div>
          <button class="btn btn-primary" onclick="GH.navigate('profiles');setTimeout(()=>Profiles.openEdit(),100)"><i class="ti ti-edit"></i> Profil bearbeiten</button>
          <div class="divider"></div>
          <div>
            <h3 style="font-size:0.9rem;margin-bottom:0.75rem;color:var(--text-secondary)">Gefahrenzone</h3>
            <button class="btn btn-danger" onclick="Profiles.confirmDelete()"><i class="ti ti-trash"></i> Profil löschen</button>
          </div>
        ` : `
          <p style="color:var(--text-secondary)">Kein Profil gefunden.</p>
          <button class="btn btn-primary" onclick="GH.navigate('profiles');setTimeout(()=>Profiles.openCreate(),100)"><i class="ti ti-user-plus"></i> Profil erstellen</button>
        `}
      </div>
    `;
  }

  function renderData(el) {
    el.innerHTML = `
      <div class="card" style="display:flex;flex-direction:column;gap:1.25rem">
        <h3 class="neon-cyan" style="font-size:0.9rem">Daten & Datenschutz</h3>
        <p style="color:var(--text-secondary);font-size:0.85rem">Alle Daten werden lokal in deinem Browser (localStorage) gespeichert. Es werden keine Daten an externe Server gesendet (außer optionalen Discord-Webhooks).</p>
        <div style="background:rgba(0,245,255,0.05);border:1px solid rgba(0,245,255,0.15);border-radius:var(--radius-md);padding:1rem">
          <div id="data-stats" style="display:flex;flex-direction:column;gap:6px;font-family:var(--font-mono);font-size:0.8rem;color:var(--text-secondary)"></div>
        </div>
        <div class="divider"></div>
        <h3 style="font-size:0.9rem;color:var(--neon-pink)">Daten exportieren / importieren</h3>
        <div class="flex gap-3" style="flex-wrap:wrap">
          <button class="btn btn-ghost" onclick="Settings.exportData()"><i class="ti ti-download"></i> Backup exportieren</button>
          <button class="btn btn-ghost" onclick="Settings.importData()"><i class="ti ti-upload"></i> Backup importieren</button>
          <input type="file" id="import-file" accept=".json" style="display:none" onchange="Settings.handleImport(this)">
        </div>
        <div class="divider"></div>
        <h3 style="font-size:0.9rem;color:var(--text-muted)">Gefahrenzone</h3>
        <button class="btn btn-danger" onclick="Settings.confirmClearAll()"><i class="ti ti-trash"></i> Alle Daten löschen</button>
      </div>
    `;
    // Fill stats
    const stats = document.getElementById('data-stats');
    if (stats) {
      const items = [
        ['Events', S().getEvents().length],
        ['Umfragen', S().getPolls().length],
        ['Chat-Nachrichten', S().getChat().length],
        ['Spiele in Bibliothek', S().getLibrary().length],
        ['Profile', S().getProfiles().length],
      ];
      stats.innerHTML = items.map(([k,v]) => `<span><span style="color:var(--neon-cyan)">${v}</span> ${k}</span>`).join('');
    }
  }

  // ---- APPLY BACKGROUND ----
  function applyPreset(id) {
    const preset = PRESETS.find(p => p.id === id);
    if (!preset) return;
    const settings = S().getSettings();
    settings.bgPreset = id;
    settings.bgType = 'preset';
    settings.bgGradient = preset.preview;
    S().saveSettings(settings);
    applyBackgroundToDOM(settings);
    render();
    U().showToast(`Theme "${preset.label}" aktiviert`, 'success');
  }

  function applyCustomColor() {
    const c1 = document.getElementById('bg-color1')?.value || '#05060f';
    const c2 = document.getElementById('bg-color2')?.value || '#0a0c1a';
    const dir = document.getElementById('bg-direction')?.value || '135deg';
    const gradient = `linear-gradient(${dir},${c1} 0%,${c2} 100%)`;
    const settings = S().getSettings();
    settings.bgType = 'custom';
    settings.bgGradient = gradient;
    settings.bgColor1 = c1;
    settings.bgColor2 = c2;
    settings.bgDirection = dir;
    settings.bgPreset = null;
    S().saveSettings(settings);
    applyBackgroundToDOM(settings);
    U().showToast('Hintergrundfarbe gesetzt!', 'success');
  }

  function applyEffect(effectId) {
    const settings = S().getSettings();
    settings.bgEffect = effectId;
    S().saveSettings(settings);
    applyEffectToDOM(effectId);
    render();
    U().showToast(`Effekt "${EFFECTS.find(e=>e.id===effectId)?.label}" aktiviert`, 'success');
  }

  function applyImageUrl() {
    const url = document.getElementById('bg-image-url')?.value.trim();
    const settings = S().getSettings();
    if (url) {
      settings.bgType = 'image';
      settings.bgImageUrl = url;
      settings.bgPreset = null;
    } else {
      settings.bgType = 'preset';
      settings.bgImageUrl = '';
    }
    S().saveSettings(settings);
    applyBackgroundToDOM(settings);
    U().showToast('Hintergrundbild gesetzt!', 'success');
  }

  function resetBackground() {
    const settings = S().getSettings();
    settings.bgType = 'default';
    settings.bgGradient = '';
    settings.bgImageUrl = '';
    settings.bgPreset = 'default';
    settings.bgEffect = 'scanlines';
    S().saveSettings(settings);
    applyBackgroundToDOM(settings);
    applyEffectToDOM('scanlines');
    render();
    U().showToast('Hintergrund zurückgesetzt', 'info');
  }

  function applyBackgroundToDOM(settings) {
    const body = document.body;
    if (settings.bgType === 'image' && settings.bgImageUrl) {
      body.style.backgroundImage = `url('${settings.bgImageUrl}')`;
      body.style.backgroundSize = 'cover';
      body.style.backgroundAttachment = 'fixed';
      body.style.backgroundPosition = 'center';
      body.style.backgroundColor = '';
    } else if (settings.bgGradient) {
      body.style.backgroundImage = settings.bgGradient;
      body.style.backgroundColor = '';
    } else {
      body.style.backgroundImage = '';
      body.style.backgroundColor = 'var(--dark-bg)';
    }
  }

  function applyEffectToDOM(effectId) {
    // Remove existing effect style
    document.getElementById('gh-effect-style')?.remove();
    const style = document.createElement('style');
    style.id = 'gh-effect-style';
    const effects = {
      none: '',
      scanlines: `body::before { background: repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.04) 2px,rgba(0,0,0,0.04) 4px) !important; }`,
      grid: `body::after { background-image: linear-gradient(rgba(0,245,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.05) 1px, transparent 1px) !important; background-size: 32px 32px !important; }`,
      noise: `body::before { background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E") !important; background-size: 256px !important; opacity:1; }`,
      particles: ``,
      rain: ``,
    };
    style.textContent = effects[effectId] || '';
    document.head.appendChild(style);

    if (effectId === 'particles') startParticles();
    else if (effectId === 'rain') startRain();
    else { stopParticles(); stopRain(); }
  }

  // ---- NOTIFICATIONS ----
  function saveNotifications() {
    const settings = S().getSettings();
    settings.discordWebhook = document.getElementById('discord-webhook')?.value.trim() || '';
    settings.discordNotifications = document.getElementById('discord-enabled')?.checked ?? true;
    S().saveSettings(settings);
    U().showToast('Benachrichtigungseinstellungen gespeichert!', 'success');
  }

  async function testWebhook() {
    const url = document.getElementById('discord-webhook')?.value.trim();
    if (!url) return U().showToast('Bitte zuerst einen Webhook eintragen', 'error');
    const ok = await U().sendDiscordNotification('🎮 **GamingHub Test** — Verbindung erfolgreich! Dein Discord-Webhook funktioniert.', url);
    U().showToast(ok ? 'Test-Nachricht gesendet! ✓' : 'Fehler: Ungültiger Webhook', ok ? 'success' : 'error');
  }

  // ---- DATA ----
  function exportData() {
    const data = {
      exported: new Date().toISOString(),
      events:   S().getEvents(),
      polls:    S().getPolls(),
      chat:     S().getChat(),
      library:  S().getLibrary(),
      profiles: S().getProfiles(),
      settings: S().getSettings(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `gaminghub-backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    U().showToast('Backup exportiert!', 'success');
  }

  function importData() {
    document.getElementById('import-file')?.click();
  }

  function handleImport(input) {
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.events)   localStorage.setItem('gh_events',   JSON.stringify(data.events));
        if (data.polls)    localStorage.setItem('gh_polls',    JSON.stringify(data.polls));
        if (data.chat)     localStorage.setItem('gh_chat',     JSON.stringify(data.chat));
        if (data.library)  localStorage.setItem('gh_library',  JSON.stringify(data.library));
        if (data.profiles) localStorage.setItem('gh_profiles', JSON.stringify(data.profiles));
        if (data.settings) localStorage.setItem('gh_settings', JSON.stringify(data.settings));
        U().showToast('Backup importiert! Seite wird neu geladen...', 'success');
        setTimeout(() => location.reload(), 1500);
      } catch { U().showToast('Ungültige Backup-Datei', 'error'); }
    };
    reader.readAsText(file);
  }

  function confirmClearAll() {
    U().confirmAction('ALLE Daten löschen? Das kann nicht rückgängig gemacht werden!', () => {
      ['gh_events','gh_polls','gh_chat','gh_library','gh_profiles','gh_settings','gh_me'].forEach(k => localStorage.removeItem(k));
      U().showToast('Alle Daten gelöscht', 'info');
      setTimeout(() => location.reload(), 1000);
    });
  }

  // ---- PARTICLE / RAIN EFFECTS ----
  let particleCanvas = null;
  let rainCanvas = null;
  let rafId = null;

  function stopParticles() {
    particleCanvas?.remove();
    particleCanvas = null;
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
  }

  function stopRain() {
    rainCanvas?.remove();
    rainCanvas = null;
  }

  function startParticles() {
    stopParticles(); stopRain();
    particleCanvas = document.createElement('canvas');
    Object.assign(particleCanvas.style, { position:'fixed', inset:'0', pointerEvents:'none', zIndex:'1', opacity:'0.4' });
    document.body.appendChild(particleCanvas);
    const ctx = particleCanvas.getContext('2d');
    const resize = () => { particleCanvas.width = innerWidth; particleCanvas.height = innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    const particles = Array.from({length:80}, () => ({
      x: Math.random()*innerWidth, y: Math.random()*innerHeight,
      r: Math.random()*2+0.5, vx: (Math.random()-0.5)*0.4, vy: (Math.random()-0.5)*0.4,
      color: ['#00f5ff','#ff00a0','#b400ff','#00ff88'][Math.floor(Math.random()*4)],
    }));
    function loop() {
      if (!particleCanvas) return;
      ctx.clearRect(0,0,particleCanvas.width,particleCanvas.height);
      particles.forEach(p => {
        p.x = (p.x+p.vx+particleCanvas.width) % particleCanvas.width;
        p.y = (p.y+p.vy+particleCanvas.height) % particleCanvas.height;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle = p.color; ctx.fill();
      });
      rafId = requestAnimationFrame(loop);
    }
    loop();
  }

  function startRain() {
    stopParticles(); stopRain();
    rainCanvas = document.createElement('canvas');
    Object.assign(rainCanvas.style, { position:'fixed', inset:'0', pointerEvents:'none', zIndex:'1', opacity:'0.15' });
    document.body.appendChild(rainCanvas);
    const ctx = rainCanvas.getContext('2d');
    const resize = () => { rainCanvas.width = innerWidth; rainCanvas.height = innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    const drops = Array.from({length:100}, () => ({
      x: Math.random()*innerWidth, y: Math.random()*innerHeight,
      speed: Math.random()*3+2, length: Math.random()*15+10,
    }));
    function loop() {
      if (!rainCanvas) return;
      ctx.clearRect(0,0,rainCanvas.width,rainCanvas.height);
      ctx.strokeStyle = '#00f5ff'; ctx.lineWidth = 1;
      drops.forEach(d => {
        ctx.beginPath(); ctx.moveTo(d.x,d.y); ctx.lineTo(d.x-1,d.y+d.length); ctx.stroke();
        d.y += d.speed;
        if (d.y > rainCanvas.height) { d.y = -d.length; d.x = Math.random()*rainCanvas.width; }
      });
      rafId = requestAnimationFrame(loop);
    }
    loop();
  }

  // ---- INIT (apply saved settings on load) ----
  function initFromStorage() {
    const settings = S().getSettings();
    applyBackgroundToDOM(settings);
    applyEffectToDOM(settings.bgEffect || 'scanlines');
  }

  window.Settings = {
    render, switchSection,
    applyPreset, applyCustomColor, applyEffect, applyImageUrl, resetBackground,
    saveNotifications, testWebhook,
    exportData, importData, handleImport, confirmClearAll,
    initFromStorage,
  };
})();
