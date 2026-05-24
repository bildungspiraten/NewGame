# CARDVERSE Beziehungshybrid

Statische, private Mobile-PWA für Reflexion und emotionale Beziehungsarbeit.

## Starten

Kein Build-Schritt nötig. Starte einen lokalen HTTP-Server im `cardverse-static/`-Verzeichnis:

```bash
# Python
python3 -m http.server 8000

# Node (npx)
npx serve .

# VS Code: Live Server Extension
# Rechtsklick auf index.html → "Open with Live Server"
```

Öffne dann `http://localhost:8000` im Browser.

> **Hinweis:** Die App muss über HTTP(S) geöffnet werden, nicht per `file://`, damit ES-Module und Service Worker funktionieren.

## Videos einbinden

Öffne `data.js` und trage externe Video-Links in `APP_CONFIG.videoLinks` ein:

```js
videoLinks: {
  video_prolog: "https://drive.google.com/file/d/DEINE_FILE_ID/preview",
  video_stage_02: "...",
}
```

Google Drive: Freigabe auf "Jeder mit dem Link", dann `/preview` statt `/view` als URL-Suffix nutzen.

## Assets

Lege eigene Grafiken in `/assets/` ab:

| Ordner          | Inhalt                                 | Beispielformat     |
|-----------------|----------------------------------------|--------------------|
| `backgrounds/`  | Hintergrundbilder pro Kapitel          | 1080×1920 WebP     |
| `cards/`        | Karten-Rahmen (5 Stück)                | 744×1038 PNG       |
| `emblems/`      | Emblem-Grafiken                        | 512×512 PNG        |
| `icons/`        | App-Icons für PWA                      | 192×192, 512×512   |
| `posters/`      | Zusätzliche Poster-Bilder              | frei               |
| `ui/`           | UI-Elemente (Buttons, Slider etc.)     | SVG bevorzugt      |

Dateinamen und Pfade sind in `data.js` konfiguriert.

## Datenschutz

- Alle Daten bleiben lokal im Browser (`localStorage`)
- Es wird nichts automatisch übertragen
- Export-Funktion in den Statistiken
- Reset-Funktion mit Bestätigung

## Testanleitung

1. App per HTTP öffnen
2. Consent bestätigen
3. Prolog-Kapitel öffnen
4. Video-Station anklicken (oder als gesehen markieren)
5. Barometer ausfüllen und speichern
6. Entscheidung treffen → prüfen dass sie gesperrt ist
7. Map öffnen (Navigation unten)
8. Statistiken öffnen
9. Emblem freischalten (Kapitel abschließen)
10. Eventlog exportieren (Statistiken → "Verlauf exportieren")

## Architektur

```
app.js          Hauptcontroller: State, Routing, Event-Binding
data.js         Alle Datenkonstanten (CARDS, STAGES, MAP_NODES, ...)
eventlog.js     localStorage Event-Tracking
card-engine.js  Kartenwert-Logik
map-engine.js   Werdegang-Map: Rendering und State
stats.js        Statistik-Berechnung und -Rendering
minigames.js    Drei Minispiele (Sort, Assemble, Reflect)
styles.css      Mobile-first CSS, kein Framework
index.html      App Shell
manifest.json   PWA Manifest
service-worker  App Shell Cache (offline-fähig)
```
