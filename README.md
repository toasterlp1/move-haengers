# 🎮 GamingHub

Eine wilde, animierte Gaming-Koordinations-Website für deine Squad.

## Features
- 📅 **Sessions planen** – Datum, Uhrzeit, Spiel, RSVP (Dabei / Vielleicht / Nicht da)
- 🗳️ **Umfragen** – Abstimmen was als nächstes gezockt wird
- 🎮 **Game Pool** – Games vorschlagen & dafür voten
- 📣 **Discord Pings** – Webhook-Benachrichtigungen bei neuen Events & Umfragen
- 🎨 **Hintergrund anpassen** – Preset-Themes oder eigene Farben + Effekte
- 🧹 **Auto-Cleanup** – Events/Umfragen/Games verschwinden nach 3 Tagen

## Hosting auf GitHub Pages

### 1. Repo erstellen
1. Gehe zu [github.com](https://github.com) → **New repository**
2. Name: z.B. `gaming-hub`
3. Visibility: **Public** (für GitHub Pages kostenlos)
4. Repository erstellen

### 2. Dateien hochladen
**Option A – GitHub Web-Interface:**
1. Im Repo auf **"uploading an existing file"** klicken
2. Alle Dateien aus diesem Ordner hochladen (Ordnerstruktur beachten!)
3. Commit: "Initial commit"

**Option B – Git CLI:**
```bash
cd gaming-hub
git init
git add .
git commit -m "Initial commit: GamingHub"
git branch -M main
git remote add origin https://github.com/DEIN_USERNAME/gaming-hub.git
git push -u origin main
```

### 3. GitHub Pages aktivieren
1. Im Repo auf **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: **main** / **root**
4. Save → Nach ~1 Minute läuft die Seite unter:
   `https://DEIN_USERNAME.github.io/gaming-hub`

## Discord Webhook einrichten

1. Deinen Discord Server öffnen
2. Server-Einstellungen → Integrationen → **Webhooks**
3. **Neuer Webhook** → Name z.B. "GamingHub" → Kanal auswählen
4. **Webhook URL kopieren**
5. Auf der Website: **SETTINGS** → Discord Webhook URL einfügen → Speichern

Jetzt bekommen alle im Kanal eine Benachrichtigung wenn jemand:
- Eine neue Session plant
- Eine Umfrage startet  
- Alle pingt (der "ALLE PINGEN"-Button)

## Technik

- Reines HTML/CSS/JavaScript – kein Framework, kein Build-System
- Daten werden im **localStorage** gespeichert (jeder Browser speichert lokal)
- Für geteilte Daten über mehrere Geräte: Daten werden **pro Browser** gespeichert

> **Hinweis zu den Daten:** Da die Website statisch ist (GitHub Pages), werden Daten im lokalen Browser gespeichert. Jeder Nutzer sieht seine eigenen eingegebenen Daten. Wenn du Echtzeit-Synchronisation zwischen Geräten willst, braucht es ein Backend (z.B. Firebase).

## Dateistruktur

```
gaming-hub/
├── index.html          # Hauptdatei
├── README.md           # Diese Datei
├── css/
│   └── style.css       # Gesamtes Styling
└── js/
    ├── storage.js      # Datenspeicherung (localStorage)
    ├── particles.js    # Partikel-Animation
    └── app.js          # Haupt-App-Logik
```
