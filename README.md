# ◆ OPBASE — Gaming Hub

> Dark Military / GTA-vibes Gaming Coordination Hub für deine Crew.

## Features
- 👤 Name-Login (kein Passwort nötig)
- 📅 Session-Planer mit RSVP (Ja/Nein) + Auto-Cleanup nach 3 Tagen
- 🗳️ Spiele-Abstimmungen mit Live-Ergebnissen
- 👥 Spieler-Profile mit Status (Online / Busy / Offline)
- 📚 Game-Bibliothek mit Genre-Filter und Suche
- 🔔 Discord Webhook — automatische Benachrichtigungen bei neuen Sessions & Abstimmungen
- 🎨 Hintergrund-Customizer (7 Preset-Themes + Custom Color Picker + 5 Effekte)
- ⚡ Realtime — alle Änderungen landen sofort bei allen ohne Reload

---

## Setup (10 Minuten)

### 1. Supabase Projekt anlegen
1. Geh auf [supabase.com](https://supabase.com) → "New project"
2. Projekt-Name, Datenbank-Passwort, Region (z.B. `eu-central-1`) wählen
3. Warten bis das Projekt startet (~1 Minute)

### 2. Datenbank einrichten
1. Im Supabase-Dashboard: **SQL Editor** → **New query**
2. Den Inhalt von `supabase_schema.sql` komplett reinkopieren → **Run**
3. Fertig — alle Tabellen und RLS-Policies sind gesetzt

### 3. API-Keys eintragen
1. Im Supabase-Dashboard: **Project Settings** → **API**
2. Kopiere `Project URL` und `anon public key`
3. Öffne `js/supabase.js` und ersetze:
   ```js
   const SUPABASE_URL = 'https://DEINE_ID.supabase.co';
   const SUPABASE_ANON_KEY = 'DEIN_ANON_KEY';
   ```

### 4. Auf GitHub hosten
1. Neues GitHub Repository erstellen (z.B. `opbase`)
2. Dateien hochladen (oder per CLI):
   ```bash
   git init
   git add .
   git commit -m "Initial OPBASE deploy"
   git remote add origin https://github.com/DEIN_USERNAME/opbase.git
   git push -u origin main
   ```
3. Im Repository: **Settings** → **Pages** → Source: `Deploy from branch` → Branch: `main` → Folder: `/ (root)` → **Save**
4. Nach ~1 Minute ist die Site unter `https://DEIN_USERNAME.github.io/opbase` live!

### 5. Discord Webhook einrichten (optional)
1. In deinem Discord-Server: **Servereinstellungen** → **Integrationen** → **Webhooks** → **Neuer Webhook**
2. Kanal wählen, Namen eingeben (z.B. "OPBASE") → **Webhook-URL kopieren**
3. Auf der Website: **Settings** → **Discord Webhook** → URL einfügen → **Speichern**
4. Mit **Test senden** testen

---

## Datei-Struktur
```
opbase/
├── index.html              # Haupt-HTML (alle Pages)
├── css/
│   └── style.css           # Komplettes Stylesheet
├── js/
│   ├── supabase.js         # ← Hier deine Keys eintragen
│   ├── app.js              # State, Auth, Helpers
│   ├── sessions.js         # Sessions CRUD + Render
│   ├── polls.js            # Polls CRUD + Render
│   ├── players.js          # Crew CRUD + Render
│   ├── games.js            # Bibliothek CRUD + Render
│   ├── theme.js            # Theme/Customizer
│   └── main.js             # Orchestrierung, Events, Realtime
├── supabase_schema.sql     # ← In Supabase SQL Editor ausführen
└── README.md
```

---

## Auto-Cleanup
Sessions und Polls die älter als 3 Tage sind werden **clientseitig** nicht mehr angezeigt. Für serverseitiges Cleanup kannst du in Supabase den auskommentierten `pg_cron`-Job am Ende des SQL-Schemas aktivieren.

---

## Realtime
Alle Tabellen haben Realtime aktiviert. Das bedeutet: wenn jemand eine Session erstellt, eine Abstimmung startet oder seinen Status ändert, sehen alle anderen das **sofort** ohne zu refreshen.
