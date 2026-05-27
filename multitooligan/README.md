# MULTITOOLIGAN – Whiteboard-System

Strukturiertes, lokales Analyse- und Visualisierungssystem für Übersicht, Reflexion und Gesprächsvorbereitung.

**Keine Diagnosen. Keine Schuldzuschreibungen. Kein Upload. Alles lokal.**

---

## Schnellstart

### Lokales HTML-Board (empfohlen)

```bash
# im multitooligan/board/ Verzeichnis:
python3 -m http.server 8000
# → http://localhost:8000
```

Oder einfach `board/index.html` direkt im Browser öffnen — funktioniert auch ohne HTTP-Server (keine ES-Module).

### Obsidian Canvas

1. `whiteboard.canvas` in dein Obsidian-Vault kopieren
2. In Obsidian öffnen → Canvas-View
3. Karten befüllen, neue Karten via Rechtsklick hinzufügen

### Mermaid-Diagramme

`diagrams/overview.md` enthält alle Diagramme. Öffne die Datei in:
- Obsidian (Mermaid nativ unterstützt)
- VS Code + Markdown Preview Mermaid Support Extension
- [mermaid.live](https://mermaid.live) (lokal aus dem Diagramm-Code)

---

## Struktur

```
multitooligan/
  README.md                    ← Diese Datei
  whiteboard.canvas            ← Obsidian Canvas (öffnen in Obsidian)
  board/
    index.html                 ← Lokales HTML-Board (lauffähig im Browser)
  diagrams/
    overview.md                ← Mermaid-Diagramme (7 Diagramme)
  schema/
    event-schema.yaml          ← Vorlage für Ereignisse / Timeline-Einträge
    cluster-schema.yaml        ← Themencluster + vordefinierte Cluster
    document-schema.yaml       ← Dokumenten- / Artefakt-Vorlage
    app-module-schema.yaml     ← App-Modul-Konzepte
  data/
    tags.json                  ← Tag-System mit Farbcodes
    example-data.json          ← Datenstruktur-Beispiel (ausfüllen!)
```

---

## HTML-Board – Bedienung

| Aktion | Beschreibung |
|--------|-------------|
| Sidebar → Neue Karte | Karte eines bestimmten Typs erstellen |
| Karte ziehen | Position auf dem Board verschieben |
| Karte klicken | Karte auswählen (zeigt Bearbeiten/Löschen-Buttons) |
| Scrollrad / Pinch | Zoom |
| Mittlere Maustaste / freie Fläche ziehen | Panning |
| Board / Zeitstrahl / Liste | Ansicht wechseln |
| Suche oben | Karten nach Titel, Inhalt oder Tags filtern |
| Export JSON | Alle Karten als JSON speichern |
| Import JSON | Exportierten Stand laden |

**Karten-Typen:** Ereignis · Vereinbarung · Konflikt · Eskalation · Deeskalation · Kontaktabbruch · Hoffnungsphase · Beobachtung · Zitat · Reflexion · Offene Frage · Dokument

**Verlässlichkeit:** Jede Karte trägt einen Verlässlichkeits-Marker (Sicher · Wahrscheinlich · Vermutung · Direktes Zitat · Unklar).

---

## Datenprinzipien

- Alle Einträge als **Beobachtung**, **Ereignis**, **Zitat**, **Reflexion** oder **offene Frage** kennzeichnen
- Keine Diagnosen
- Keine Schuldzuschreibungen
- Keine Überinterpretation
- Verlässlichkeit immer markieren
- Kontext immer mitschreiben

---

## Export-Formate

| Format | Tool | Beschreibung |
|--------|------|-------------|
| JSON | HTML-Board | Alle Karten mit vollständigen Metadaten |
| `.canvas` | Obsidian | Visuelles Canvas-Layout |
| Mermaid | Obsidian, VS Code, mermaid.live | Diagramme |
| YAML | Jeder Texteditor | Schemas und strukturierte Daten |

---

## Import-Ideen

- **Obsidian Canvas**: `whiteboard.canvas` direkt in Vault-Ordner legen
- **Excalidraw**: JSON-Export als Basis, Karten als Rechtecke nachbauen
- **Miro / FigJam**: Mermaid-Diagramme als Bild exportieren, einfügen
- **Trello**: JSON-Export manuell in Trello-Boards überführen (eine Karte = eine Trello-Karte)
- **Taskade**: YAML-Schemas als Outline-Struktur verwenden
