# MULTITOOLIGAN – Mermaid-Diagramme

Diese Datei enthält Diagramme für Obsidian, VS Code (Markdown Preview Mermaid) und andere Tools.
Kopiere einzelne Blöcke in dein bevorzugtes Tool.

---

## 1. Whiteboard-Überblick

```mermaid
mindmap
  root((MULTITOOLIGAN))
    1-TIMELINE
      Ereignisse
      Vereinbarungen
      Eskalationen
      Hoffnungsphasen
      Kontaktabbrüche
    2-CLUSTER
      Kommunikation
      Grenzen
      Vereinbarungen
      Wohnsituation
      Emotionen
      Konflikt
      Organisation
    3-CHAT-ANALYSE
      Themenwechsel
      Muster
      Wiederholungen
      Unbeantwortete Fragen
      Eskalationspunkte
    4-APP-KONZEPT
      Timeline-Modul
      Reflexions-Modul
      Gesprächs-Modul
      Dokument-Ablage
      Export
    5-GESPRAECH
      Offene Fragen
      Grenzen
      Bedürfnisse
      Trigger
      Formulierungen
    6-DOKUMENTE
      Briefe
      Chat-Exporte
      Notizen
      Fotos
      PDFs
    7-SELBSTREFLEXION
      Relativierungen
      Muster
      Fehlende Kontexte
      Zurückgestellte Bedürfnisse
```

---

## 2. Ereignis-Fluss / Kommunikationsmuster

```mermaid
flowchart TD
    A([Ereignis]) --> B{Typ?}
    B -->|Vereinbarung| C[📋 Vereinbarungs-Karte]
    B -->|Konflikt| D[⚡ Konflikt-Karte]
    B -->|Klärungsversuch| E[💬 Klärungskarte]
    B -->|Kontaktabbruch| F[🔇 Pause-Karte]
    B -->|Hoffnungsphase| G[✨ Hoffnungs-Karte]

    C --> H[Cluster zuordnen]
    D --> I[Auslöser dokumentieren]
    E --> J[Ergebnis dokumentieren]
    F --> K[Dauer + Kontext]
    G --> K

    H & I & J & K --> L[Tags vergeben]
    L --> M[Verlässlichkeit markieren]
    M --> N[Timeline-Eintrag fertig]
```

---

## 3. Cluster-Verbindungen

```mermaid
graph LR
    KOMM([Kommunikation])
    VEREI([Vereinbarungen])
    GREN([Grenzen])
    KONF([Konflikt])
    WOHN([Wohnsituation])
    EMOT([Emotionen])
    REFLE([Selbstreflexion])
    APP([App-Konzept])

    KOMM <--> VEREI
    KOMM <--> KONF
    KOMM <--> GREN
    VEREI <--> KONF
    GREN <--> KONF
    KONF <--> EMOT
    EMOT <--> REFLE
    WOHN <--> KONF
    WOHN <--> VEREI
    REFLE <--> KOMM
    REFLE <--> GREN
    APP -.->|Werkzeug für| KOMM
    APP -.->|Werkzeug für| REFLE
```

---

## 4. Dokument-System

```mermaid
flowchart LR
    subgraph INPUT
        A[Brief]
        B[Chat-Export]
        C[Notiz]
        D[Sprachmemo]
        E[Foto / Screenshot]
    end

    subgraph SYSTEM
        F[Dokument-ID vergeben]
        G[Tags + Priorität]
        H[Zeitbezug]
        I[Querverweis zu Ereignis]
    end

    subgraph OUTPUT
        J[Dokument-Index]
        K[Export JSON]
        L[Export PDF]
    end

    A & B & C & D & E --> F
    F --> G --> H --> I
    I --> J --> K & L
```

---

## 5. App-Modul-Übersicht

```mermaid
graph TD
    subgraph KERN
        T[Timeline-Modul]
        C[Cluster-Modul]
        R[Reflexions-Modul]
    end

    subgraph INTERAKTION
        G[Gesprächs-Modul]
        CH[Chat-Analyse]
    end

    subgraph ABLAGE
        D[Dokumente]
        EX[Export / Bericht]
    end

    subgraph SCHUTZ
        N[Notfall-Modus]
        PR[Privat-Modus]
    end

    T --> C
    T --> EX
    C --> R
    R --> G
    CH --> T
    CH --> C
    D --> EX
    N --> R
    PR --> D

    style KERN fill:#1a1a35
    style INTERAKTION fill:#12122a
    style ABLAGE fill:#12122a
    style SCHUTZ fill:#2a1a1a
```

---

## 6. Selbstreflexions-Zyklus

```mermaid
flowchart LR
    A[Ereignis beobachten] --> B[Sachlich beschreiben]
    B --> C{Habe ich relativiert?}
    C -->|Ja| D[Was genau? Ergänzen.]
    C -->|Nein| E[Kontext vollständig?]
    D --> E
    E -->|Nein| F[Fehlenden Kontext ergänzen]
    E -->|Ja| G[Muster erkennbar?]
    F --> G
    G -->|Ja| H[Muster dokumentieren]
    G -->|Nein| I[Ereignis abschließen]
    H --> I
    I --> J[Bedürfnis zurückgestellt?]
    J -->|Ja| K[Bedürfnis benennen]
    J -->|Nein| L[✓ Reflexion vollständig]
    K --> L
```

---

## 7. Gesprächsvorbereitung

```mermaid
flowchart TD
    A[Gesprächsthema] --> B[Eigene Bedürfnisse]
    A --> C[Eigene Grenzen]
    A --> D[Offene Fragen]
    A --> E[Dinge nicht vergessen]
    A --> F[Mögliche Trigger]

    B & C & D & E & F --> G[Gesprächsleitfaden]
    G --> H[Formulierungen überprüfen]
    H --> I{Sachlich?}
    I -->|Nein| J[Umformulieren]
    I -->|Ja| K[Deeskalationsstrategien ergänzen]
    J --> K
    K --> L[✓ Bereit]
```
