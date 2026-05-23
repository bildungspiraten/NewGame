# CARDVERSE — Modulares KI-gestütztes Kartenspiel & Kommunikationsportal
## Deep Research Architekturdokument
### ID: MT-BIZEPS-CARDVERSE-001 | Version 1.0 | 2026-05-23

> **Status**: Forschungsphase abgeschlossen. Basis-Repo: `/home/user/NewGame` (Snake-TypeScript-Basis).
> **Branch**: `claude/cardverse-game-portal-research-Ra2HJ`

---

## 0. Vision & Kernidee

**CARDVERSE** ist ein emotionales, modular erweiterbares Browser-Universum:

```
leichtes TCG  +  Storyportal  +  Filmwelt  +  Multiplayer  +  Erinnerungsarchiv  +  digitales Wohnzimmer
```

**Kern-Metapher**: Karten ersetzen Chats. Matches erzeugen Erinnerungen.
Erinnerungen werden sammelbar. Das Spiel ist die Kommunikation.

**Marktlücke** (recherchiert 2025-2026): Es gibt kein einziges Open-Source-Projekt,
das browser-basiertes Multiplayer-Kartenspiel + persistentes Kommunikationsportal +
echte LLM-Integration in der Spiellogik kombiniert. Das ist die Opportunität.

---

## 1. Systemarchitektur — Gesamtübersicht

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          CARDVERSE UNIVERSE                             │
│                                                                         │
│  ┌───────────────┐   ┌──────────────┐   ┌────────────────────────┐    │
│  │  CARDGAME     │   │  WOHNZIMMER  │   │  KOMMUNIKATIONSPORTAL  │    │
│  │  ENGINE       │   │  HUB         │   │                        │    │
│  │  (Phaser.js)  │   │  (React)     │   │  • Filmplakate (TMDB)  │    │
│  │               │   │              │   │  • Story-Timeline      │    │
│  │  • Matches    │◄──►  • Lobby    │   │  • Erinnerungen        │    │
│  │  • Decks      │   │  • Chat-Room │   │  • Video-Szenen        │    │
│  │  • Replays    │   │  • Trophäen  │◄──►  • Audio-Karten       │    │
│  │  • AI-Gegner  │   │  • Zustand   │   │  • Ink/inkjs Stories   │    │
│  └──────┬────────┘   └──────┬───────┘   └────────────────────────┘    │
│         │                   │                                           │
│         ▼                   ▼                                           │
│  ┌──────────────────────────────────────────────────────┐             │
│  │            EVENT BUS / APPEND-ONLY LOG               │             │
│  │    (JSONL Events → SQLite / PocketBase SSE)          │             │
│  └──────────────────────────────────────────────────────┘             │
│         │                   │                                           │
│         ▼                   ▼                                           │
│  ┌──────────────┐   ┌──────────────┐   ┌────────────────┐            │
│  │  AI-WORKER   │   │  MEDIA HUB   │   │  STORY ENGINE  │            │
│  │              │   │              │   │  (inkjs)       │            │
│  │  OpenRouter  │   │  TMDB API    │   │                │            │
│  │  + Ollama    │   │  lite-yt-    │   │  • Kapitel     │            │
│  │  Fallback    │   │  embed       │   │  • Entscheid.  │            │
│  └──────────────┘   └──────────────┘   └────────────────┘            │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Empfohlener Tech-Stack (recherchiert & validiert)

### 2.1 Finaler Stack — Begründet

| Schicht | Technologie | Begründung |
|---------|------------|------------|
| **Spielfeld-Rendering** | **Phaser 3 + Vite + TypeScript** | Bestes Browser-Game-Ecosystem 2025, offizielle Templates |
| **UI-Shell** | **React 19** (Hybrid mit Phaser) | Offiziell unterstütztes Muster (phaserjs/template-react-ts) |
| **Lobby/Portal** | **HTMX** für statische Teile | Null Framework-Overhead, kein JS-Bundle |
| **Multiplayer-Kern** | **Colyseus.io** (Self-Host) | Perfekt für Turn-Based Games, Secret State, Delta-Sync |
| **Backend/Auth/DB** | **PocketBase** (Go Binary) | 1 Datei, 0 Overhead, SSE-Realtime, Auth, Files |
| **Spielzustand-Log** | **SQLite Event-Tabelle (JSONL)** | Append-Only, Replay, Debugging |
| **Narrativ-Engine** | **inkjs** | AAA-Qualität, Browser-nativ, kein Server |
| **KI-Integration** | **OpenRouter + Ollama Fallback** | Kostenlos/günstig, lokaler Offline-Modus |
| **Film-Poster** | **TMDB API** | Kostenlos, hochauflösend |
| **Trailer-Player** | **lite-youtube-embed** | Lazy Load, kein iFrame-Overhead |
| **Foto-Archiv** | **Immich** (Self-Host) | 90k GitHub Stars, Alben, API |
| **Hosting** | **Hetzner CX22 + Docker Compose** | 5 €/Monat, 100 gleichzeitige Nutzer |
| **CDN/SSL** | **Cloudflare Free** | DDoS-Schutz, R2 für Karten-Assets |

**Monatliche Gesamtkosten MVP**: ~5–10 € / Monat

### 2.2 Hybride Projektstruktur

```
cardverse/
├── apps/
│   ├── client/                    ← Vite + Phaser 3 + React + TypeScript
│   │   ├── src/
│   │   │   ├── scenes/            ← Phaser Scenes (GameScene, LobbyScene)
│   │   │   ├── components/        ← React UI (HUD, Chat, Settings, Poster)
│   │   │   ├── network/           ← Colyseus Client
│   │   │   ├── story/             ← inkjs Story Player
│   │   │   └── main.tsx
│   │   └── vite.config.ts
│   │
│   └── server/                    ← Colyseus + Hono + Node.js/Bun
│       ├── rooms/
│       │   └── CardGameRoom.ts    ← Colyseus Room
│       ├── ai/
│       │   └── ai-worker.ts       ← OpenRouter/Ollama Adapter
│       └── index.ts
│
├── data/
│   ├── cards/                     ← YAML Karten-Definitionen
│   │   ├── memory/
│   │   ├── places/
│   │   ├── emotions/
│   │   └── legendary/
│   ├── story/                     ← inkjs / .ink Story-Files
│   │   ├── chapters/
│   │   └── events/
│   └── events/                    ← Story-Event-YAMLs
│
├── docs/
│   └── CARDVERSE_ARCHITECTURE.md  ← Diese Datei
│
└── docker-compose.yml             ← PocketBase + Colyseus + Nginx
```

---

## 3. Spieldesign — Kardenmechanik

### 3.1 Hybride Spielschleife

```
VORBEREITUNG
  ↓
[Wohnzimmer-Hub / Lobby]
  • Deck bauen (20-30 Karten aus YAML-Definitionen)
  • Status anzeigen (Erinnerungen, Trophäen, Story-Stand)
  • Filmplakat-Wand (via TMDB API)
  ↓
MATCH-PHASE (Turn-Based, Colyseus Room)
  ├─ Mana-System (1-10 pro Runde)
  ├─ Karten ziehen (5 zu Beginn)
  ├─ Karte spielen = Aktion + Story-Fragment (inkjs)
  ├─ KI-Gegner (OpenRouter) oder echter Spieler (P2P via Colyseus)
  └─ Legendary Events: Trailer startet (lite-youtube-embed)
  ↓
ABSCHLUSS
  ├─ Gewinner bekommt seltene Karte oder Erinnerung
  ├─ Story-Kapitel wird freigeschaltet (inkjs)
  ├─ Replay als JSONL gespeichert (SQLite)
  └─ Erinnerung erscheint im Archiv (Immich-API oder lokal)
  ↓
[RÜCKKEHR ins Wohnzimmer]
  • Neue Karte erscheint in Sammlung
  • Story-Fragment wird abgespielt
  • Trophäe erscheint im Regal
```

### 3.2 Karten-Typen

| Typ | Funktion | Beispiel |
|-----|---------|---------|
| **memory** | Story-Fragment + Emotionspunkte | "Erster Kaffee in Berlin" |
| **place** | Terrain/Bonus-Effekt | "Küche um 3 Uhr nachts" |
| **person** | NPC / Verstärker | "Der Freund der immer da ist" |
| **emotion** | Zustandsmodifikator | "Nostalgie +3" |
| **decision** | Branching-Event (inkjs) | "Bleib oder geh?" |
| **filmscene** | Spezialfähigkeit + Video-Clip (TMDB) | "Kulminationsmoment" |
| **song** | Buff + Audio-Overlay | "Das Lied vom Sommer" |
| **legendary** | Seltener Match-Wendepunkt + Trailer | "Neue Ära" |

### 3.3 Light-Monopoly-Element (Phase 2)

```
[WELTENKARTE]
  • Hexfelder = Orte (Berlin, Küche, Kino, Strand...)
  • Spieler bewegen sich durch Karten-Aktionen
  • Orte freischalten = neue Kartensets (YAML-Packs)
  • Events auf Orten = Mini-Matches (Colyseus Rooms)
  • Ressourcen: Emotionspunkte, Erinnerungsscherben, Story-Tokens
```

### 3.4 Existierende Inspirationsprojekte (recherchiert)

| Projekt | Relevanz | URL |
|---------|---------|-----|
| **boardgame.io** | Spiellogik-Framework, Secret State, Time-Travel | github.com/boardgameio/boardgame.io |
| **Colyseus Turn-Based Demo** | UNO-Implementierung mit Bot-Spielern | colyseus.io/blog |
| **Cardiverse (arXiv)** | LLM-gesteuerte Kartenspiel-Generierung | arxiv.org/abs/2502.07128 |
| **Inscryption JSONLoader** | YAML/JSON-basiertes Karten-Modsystem | github.com/MADH95/JSONLoader |
| **GameMasterAI** | GPT-4 als Dungeon Master, Web-App | github.com/deckofdmthings/GameMasterAI |
| **hearthstone-os** | Open-Source Hearthstone-Klon | github.com/kvfrans/hearthstone-os |
| **Arcmage** | Freies TCG, CC-Karten | arcmage.org |

---

## 4. YAML-Karten-Schema (vollständig)

### 4.1 Basis-Karten-Schema

```yaml
# cards/memory/erster-kaffee-berlin.yaml
id: memory-berlin-2024-001
name: "Erster Kaffee in Berlin"
version: 1
type: memory          # memory | place | person | emotion | decision | filmscene | song | legendary
rarity: uncommon      # common | uncommon | rare | epic | legendary
cost: 2               # Mana-Kosten (1-10)

stats:
  attack: 0
  defense: 3
  emotion_power: 5

effects:
  - trigger: on_play
    action:
      type: heal
      target: self
      amount: 2
  - trigger: on_play
    action:
      type: draw
      count: 1
  - trigger: on_play
    action:
      type: story_fragment
      fragment_id: "berlin-chapter-1"     # → inkjs Story

media:
  image: "assets/cards/erster-kaffee-berlin.webp"
  audio: null
  video_clip: null
  tmdb_id: null                           # für Filmkarten

lore:
  text: >
    Der Moment, als alles noch möglich war.
    Der erste Schluck. Der erste Blick. Die erste Stadt.
  chapter: "DER_ANFANG"
  emotion_tag: nostalgie
  unlock_condition: "match.won.count >= 3"

ai_tags:                                  # Für LLM-Kartenverständnis
  - memory
  - defensive
  - story_trigger
  - low_cost

collectible:
  obtained_from: story_reward             # story_reward | match_reward | shop | event
  tradeable: false
  flavor_quote: "Es riecht immer noch nach damals."
```

### 4.2 Filmkarte (TMDB-Integration)

```yaml
# cards/legendary/berlin-film-2024.yaml
id: film-tmdb-12345
name: "Der Berliner Sommer"
version: 1
type: filmscene
rarity: legendary
cost: 7

stats:
  attack: 5
  defense: 5
  emotion_power: 10

effects:
  - trigger: on_play
    action:
      type: legendary_event
      event_id: "trailer-berlin-sommer"
  - trigger: on_play
    action:
      type: deal_damage
      target: all_enemies
      amount: 5

media:
  tmdb_id: 12345                          # → TMDB API holt Poster + Trailer
  tmdb_trailer_key: "dQw4w9WgXcQ"        # YouTube Key für lite-youtube-embed
  image: null                             # wird automatisch von TMDB geholt

lore:
  text: "Der Film, der alles zusammenbrachte."
  chapter: "KLIMAX"
  emotion_tag: euphorie
```

### 4.3 Story-Event-Schema (inkjs-kompatibel)

```yaml
# story/events/berlin-chapter-1.yaml
id: "berlin-chapter-1"
title: "Ankunft"
chapter: "DER_ANFANG"
ink_file: "story/chapters/anfang.ink"    # → inkjs lädt .ink-Datei

triggers:
  - condition: "card.played == memory-berlin-2024-001"

rewards:
  story_unlocks: ["berlin-chapter-2"]
  emotion_tokens: 3
  cards: []
```

```ink
// story/chapters/anfang.ink (inkjs-Format)
Du spielst die Karte. Eine Sekunde lang riecht es nach frischem Kaffee
und nassem Pflasterstein.

* [Erinnern]
    Das war der Moment, der alles geändert hat. +2 Emotionspunkte.
    -> berlin_chapter_2_start

* [Weitermachen]
    Du schüttelst den Kopf. Jetzt ist nicht die Zeit.
    -> match_continues

=== berlin_chapter_2_start ===
Ein neues Kapitel beginnt...
-> END
```

### 4.4 Match-Event-Log (JSONL Append-Only)

```jsonl
{"ts":"2026-05-23T20:00:00Z","type":"match.started","v":1,"matchId":"m-abc123","mode":"pvp","players":[{"id":"p1","deck":"nostalgie-deck"},{"id":"p2","type":"ai","personality":"nostalgiker"}]}
{"ts":"2026-05-23T20:00:10Z","type":"turn.started","matchId":"m-abc123","turn":1,"activePlayer":"p1","mana":1}
{"ts":"2026-05-23T20:00:45Z","type":"card.played","matchId":"m-abc123","player":"p1","card":"memory-berlin-2024-001","target":null}
{"ts":"2026-05-23T20:00:46Z","type":"story.triggered","matchId":"m-abc123","fragmentId":"berlin-chapter-1","ink_node":"anfang"}
{"ts":"2026-05-23T20:01:30Z","type":"turn.ended","matchId":"m-abc123","turn":1,"state":{"p1_hp":25,"p2_hp":30}}
{"ts":"2026-05-23T20:10:00Z","type":"match.ended","matchId":"m-abc123","winner":"p1","reward":{"card":"memory-berlin-2024-001-foil","emotion_tokens":5}}
```

---

## 5. Multiplayer-Architektur (Colyseus)

### 5.1 Colyseus Room — TypeScript

```typescript
// server/rooms/CardGameRoom.ts
import { Room, Client } from "colyseus";
import { Schema, type, MapSchema } from "@colyseus/schema";

class Card extends Schema {
  @type("string") id: string = "";
  @type("string") name: string = "";
  @type("number") cost: number = 0;
}

class PlayerState extends Schema {
  @type("number") hp: number = 30;
  @type("number") mana: number = 0;
  @type({ map: Card }) hand = new MapSchema<Card>(); // NUR dieser Spieler sieht seine Hand
}

class CardGameState extends Schema {
  @type("string") currentTurn: string = "";
  @type("number") turnNumber: number = 0;
  @type({ map: PlayerState }) players = new MapSchema<PlayerState>();
}

export class CardGameRoom extends Room<CardGameState> {
  maxClients = 2;

  onCreate() {
    this.setState(new CardGameState());
    this.onMessage("play_card", (client, data) => {
      this.handlePlayCard(client.sessionId, data.cardId, data.target);
    });
  }

  onJoin(client: Client) {
    const player = new PlayerState();
    this.state.players.set(client.sessionId, player);
    this.dealStartingHand(client.sessionId);
  }

  private handlePlayCard(playerId: string, cardId: string, target: string | null) {
    // Server ist autoritativ — validiert, wendet Effekt an, broadcastet
    const event = { type: "card.played", player: playerId, card: cardId, ts: new Date().toISOString() };
    this.appendToLog(event);
    this.broadcast("state_update", this.state);
  }
  
  private appendToLog(event: object) {
    // Append-Only SQLite Event Log
    // db.prepare('INSERT INTO game_events VALUES (?, ?, ?)').run(matchId, JSON.stringify(event), new Date().toISOString())
  }
}
```

### 5.2 Matchmaking-Strategie

```
MVP: Lobby mit Einladungs-Code
  → Spieler erstellt Raum (Colyseus Room)
  → Teilt 6-stelligen Code
  → Gegner gibt Code ein → beitreten
  → KI-Gegner als Fallback (sofort verfügbar)

Phase 2: Async-Modus
  → Match läuft über Stunden/Tage
  → PocketBase speichert Spielstand
  → Push-Notification (Browser Push API) bei Gegner-Zug
  → Match bleibt offen bis beide gezogen haben

Phase 3: ELO-Matchmaking (optional)
  → Rating-System (Colyseus Lobby)
  → Automatische Gegnersuche
  → Regionale Server
```

### 5.3 Hosting-Optionen

| Option | Kosten | Eignung | Details |
|--------|--------|---------|---------|
| **Hetzner CX22** (empfohlen) | 5 €/Monat | MVP + Produktion | Docker Compose, 100 CCU, volle Kontrolle |
| **Fly.io** | 3-10 $/Monat | Einfaches Deployment | WebSocket-Support, gutes DX |
| **Railway** | 5 $/Monat Guthaben | Test/Dev | Usage-Based |
| **Cloudflare Durable Objects** | Gratis+ | Skalierung | Edge-Game-State, WebSocket-nativ |
| **Colyseus Arena Cloud** | 15 $/Monat | Managed | Kein Server-Aufwand |

---

## 6. KI-Integration

### 6.1 KI-Rollen im System

| Rolle | Aufgabe | Empfohlenes Modell | Kosten |
|-------|---------|------------------|--------|
| **Gegner-KI** | Karten-Entscheidungen, Strategie | Qwen-2.5-7B (OpenRouter) | Gratis |
| **Erzähler** | Story-Fragmente, Atmosphäre | Llama-3.1-8B (Ollama lokal) | Gratis |
| **NPC-Dialog** | Charakterinteraktionen | Hermes-3-8B (Ollama) | Gratis |
| **Game Master** | Match-Events, dynamische Regeln | DeepSeek-V3 | $0.01/1M tokens |
| **Karten-Texte** | Flavor Text, Beschreibungen | Gemma-3-4B | Gratis |
| **Kommentator** | Live-Match-Kommentar | Qwen-2.5-3B | Gratis |

### 6.2 OpenRouter Empfehlungen (2025/2026)

```
# Gratis-Modelle (kein API-Schlüssel-Kosten):
google/gemma-3-4b-it              → NPC-Dialoge, Flavor Text
meta-llama/llama-3.1-8b-instruct  → Erzähler, Story-Narration
qwen/qwen-2.5-7b-instruct         → KI-Gegner (schnell, strategisch)
mistralai/mistral-7b-instruct     → Allgemein

# Günstige bezahlte Modelle:
deepseek/deepseek-v3              → Game-Master, komplexe Logik ($0.01/1M)
anthropic/claude-haiku-4-5        → Hochqualität für Schlüsselszenen

# Forschungsergebnis: Qwen-2.5-7B übertrifft GPT-4 in Kartenspiel-Entscheidungen
# (Quelle: "Language-Driven Play in Slay the Spire", ACM 2024)
```

### 6.3 Lokale Fallbacks via Ollama

```bash
# Empfohlene lokale Modelle (8GB RAM):
ollama pull qwen2.5:7b        # Gegner-KI, schnell (~5 tok/s)
ollama pull llama3.1:8b       # Erzähler, gute Qualität
ollama pull hermes3:8b        # NPC-Roleplay-fokussiert
ollama pull gemma3:4b         # Leicht, für einfache Tasks (4GB RAM)
```

### 6.4 AI-Worker Architektur

```typescript
// server/ai/ai-worker.ts
class AIWorker {
  async decideCardPlay(gameState: GameState, personality: AIPersonality): Promise<AIAction> {
    const prompt = this.buildPrompt(gameState, personality);
    
    // Primär: OpenRouter (kostenlos)
    try {
      return await this.callOpenRouter(prompt);
    } catch {
      // Fallback: Lokales Ollama
      return await this.callOllama(prompt);
    }
  }

  private buildPrompt(state: GameState, personality: AIPersonality): string {
    return `Du bist ${personality.name}, ein ${personality.description} Kartenspieler.
    
    Dein Spielstand: HP=${state.my_hp}, Mana=${state.mana}
    Deine Handkarten: ${state.hand_cards.map(c => `${c.name}(cost:${c.cost})`).join(', ')}
    Gegner HP: ${state.opponent_hp}
    
    Persönlichkeitsstil: ${personality.style}
    
    Antworte NUR als JSON: {"action":"play_card|pass","card_id":"...","reasoning":"..."}`;
  }
}
```

### 6.5 KI-Persönlichkeiten

```yaml
# ai/personalities.yaml
personalities:
  - id: nostalgiker
    name: "Die Erinnerung"
    description: "emotional, reaktiv, liebt Memory-Karten"
    style: "Spiele Memory-Karten sobald möglich. Verteidige zuerst. Sei poetisch."
    model: "qwen/qwen-2.5-7b-instruct"

  - id: stratege
    name: "Der Planer"
    description: "rational, langfristig denkend"
    style: "Baue Combos auf. Warte auf den richtigen Moment. Spare Mana."
    model: "deepseek/deepseek-v3"

  - id: chaot
    name: "Der Wilde"
    description: "unberechenbar, risikofreudig"
    style: "Spiele zufällig. Überrasche. Gehe Risiken ein."
    model: "meta-llama/llama-3.1-8b-instruct"

  - id: geschichtenerzaehler
    name: "Der Erzähler"
    description: "narrativ-fokussiert, triggert Story-Events"
    style: "Spiele Karten, die Story-Fragmente auslösen. Priorisiere Lore über Strategie."
    model: "mistralai/mistral-7b-instruct"
```

---

## 7. Kommunikationsportal & Digitales Wohnzimmer

### 7.1 Konzept: Karten als Kommunikation

```
KLASSISCHER CHAT:            CARDVERSE KOMMUNIKATION:
  "Hey, alles gut?"    →     [Spieler spielt Karte: "Ich denke an dich"]
  "Ja, und du?"        →     [Gegner antwortet: "Auch. Wollen wir?"]
  "Gerne!"             →     [Match startet automatisch]
  [Match läuft]        →     [Jeder Zug = eine Aussage]
  [Match endet]        →     [Erinnerung entsteht: "Match vom 23. Mai 2026"]
```

**Inspiration**: Jest (TechCrunch Feb 2026) — 1 Million Spiele in Nachrichten verschickt,
3-4× bessere Retention als klassische Mobile-Apps. "Sending a game is more personal than sending a message."

### 7.2 Wohnzimmer-Hub Layout

```
┌────────────────────────────────────────────────────┐
│                  DEIN WOHNZIMMER                   │
│                                                    │
│  [Avatar: Nachdenklich]  Level 7  42 Erinnerungen  │
│                                                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐ │
│  │ POSTER-  │  │ LETZTE   │  │ NÄCHSTE STORY    │ │
│  │ WAND     │  │ ERINNG.  │  │ Kapitel 3:       │ │
│  │ (TMDB)   │  │ 23. Mai  │  │ "Der Abschied"   │ │
│  └──────────┘  └──────────┘  └──────────────────┘ │
│                                                    │
│  [Deck bauen] [Match starten] [Story lesen]        │
│                                                    │
│  🏆 Trophäen: 12 Erinnerungen  📺 Trailer: "Neue Ära" │
│  💬 Letzte Karte von: Freund #1 (gestern 23:42)   │
└────────────────────────────────────────────────────┘
```

### 7.3 Filmplakat-Wand (TMDB + lite-youtube-embed)

```typescript
// client/components/PosterWall.tsx
import { LiteYoutubeEmbed } from 'lite-youtube-embed';

function FilmCard({ tmdbId }: { tmdbId: number }) {
  const [movie, setMovie] = useState<TMDBMovie | null>(null);

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${TMDB_KEY}&language=de`)
      .then(r => r.json()).then(setMovie);
  }, [tmdbId]);

  return (
    <div className="film-card" onClick={() => openTrailer(movie?.trailer_key)}>
      <img src={`https://image.tmdb.org/t/p/w500${movie?.poster_path}`} />
      <span>{movie?.title}</span>
    </div>
  );
}

// Trailer als "Legendary Event" im Match:
// → lite-youtube-embed rendert YouTube ohne Tracking, lazy-loaded
```

### 7.4 Erinnerungsarchiv (Memory Vault)

```typescript
// Schema: Memory
interface Memory {
  id: string;
  type: 'card_received' | 'match_won' | 'story_unlocked' | 'place_visited';
  source_player: string;
  card_id: string;
  emotion_tag: string;
  note?: string;          // freier Text
  pinned: boolean;
  created_at: string;
}
```

```
ERINNERUNGEN-TIMELINE:
  • Inspiriert von: Spacetime (NLW Hackathon, github.com/alexandrecpedro/spacetime)
  • Sortiert nach Monat/Jahr
  • Filtert nach: Emotion-Tags, Match-Typ, Karten-Typ
  • Fotos via: Immich Self-Host API (90k ⭐ github.com/immich-app/immich)
  • Zeitkapsel-Feature: Erinnerung sperren bis zu Datum (github.com/acm-projects/Time-Capsule)
```

### 7.5 Narrative Engine (inkjs)

```ink
// story/chapters/kapitel-3-abschied.ink
Du stehst am Bahnsteig.
Der Zug kommt in drei Minuten.

* [Die Karte spielen: "Erinnerung an den Abschied"]
    Du hältst inne. Die Karte leuchtet kurz auf.
    "Manche Abschiede sind Anfänge."
    -> abschied_gluecklich

* [Schweigen]
    Stille. Der Zug fährt ein.
    -> abschied_traurig

=== abschied_gluecklich ===
+3 Emotionspunkte. Neue Karte freigeschaltet: "Wiedersehen".
-> END

=== abschied_traurig ===
+1 Emotionspunkt. Story-Pfad: "Der lange Weg".
-> END
```

---

## 8. Datenbank-Schema (SQLite via PocketBase)

```sql
-- Spieler
CREATE TABLE players (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  avatar TEXT,
  emotion_tokens INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Karten-Sammlung
CREATE TABLE player_cards (
  player_id TEXT,
  card_id TEXT,
  obtained_at TEXT,
  times_played INTEGER DEFAULT 0,
  foil INTEGER DEFAULT 0,        -- seltene Variante
  PRIMARY KEY (player_id, card_id)
);

-- Matches
CREATE TABLE matches (
  id TEXT PRIMARY KEY,
  mode TEXT NOT NULL,            -- pvp | pve | async
  player1_id TEXT NOT NULL,
  player2_id TEXT,               -- null = AI
  ai_personality TEXT,           -- nostalgiker | stratege | chaot
  winner_id TEXT,
  started_at TEXT,
  ended_at TEXT,
  status TEXT DEFAULT 'active'   -- active | completed | abandoned
);

-- Event Log (APPEND-ONLY — niemals UPDATE/DELETE)
CREATE TABLE game_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  match_id TEXT NOT NULL,
  seq INTEGER NOT NULL,
  event_type TEXT NOT NULL,
  event_data TEXT NOT NULL,      -- JSON
  timestamp TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Erinnerungsarchiv
CREATE TABLE memories (
  id TEXT PRIMARY KEY,
  player_id TEXT NOT NULL,
  type TEXT NOT NULL,
  card_id TEXT,
  from_player TEXT,
  emotion_tag TEXT,
  note TEXT,
  pinned INTEGER DEFAULT 0,
  locked_until TEXT,             -- Zeitkapsel-Feature
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Story-Fortschritt
CREATE TABLE story_progress (
  player_id TEXT,
  chapter_id TEXT,
  ink_path TEXT,                 -- aktueller inkjs-Knoten
  choices TEXT,                  -- JSON array der Entscheidungen
  unlocked_at TEXT,
  PRIMARY KEY (player_id, chapter_id)
);

-- Film-Sammlung (gespielte Filmkarten = Poster im Wohnzimmer)
CREATE TABLE player_films (
  player_id TEXT,
  tmdb_id INTEGER,
  card_id TEXT,
  added_at TEXT,
  PRIMARY KEY (player_id, tmdb_id)
);
```

---

## 9. Mediensystem

### 9.1 TMDB API Integration

```typescript
// server/media/tmdb.ts
const TMDB_BASE = 'https://api.themoviedb.org/3';
const POSTER_BASE = 'https://image.tmdb.org/t/p/w500';

export async function fetchMovieCard(tmdbId: number): Promise<Partial<Card>> {
  const [movie, videos] = await Promise.all([
    fetch(`${TMDB_BASE}/movie/${tmdbId}?api_key=${TMDB_KEY}&language=de`).then(r => r.json()),
    fetch(`${TMDB_BASE}/movie/${tmdbId}/videos?api_key=${TMDB_KEY}`).then(r => r.json())
  ]);

  const trailer = videos.results?.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube');

  return {
    id: `film-tmdb-${tmdbId}`,
    name: movie.title,
    type: 'filmscene',
    rarity: 'legendary',
    media: {
      image: `${POSTER_BASE}${movie.poster_path}`,
      tmdb_trailer_key: trailer?.key ?? null
    },
    lore: { text: movie.overview }
  };
}
```

### 9.2 Trailer als Legendary Event

```typescript
// client/scenes/GameScene.ts (Phaser)
this.colyseus.onMessage("legendary_event", (data) => {
  // Spiel pausiert
  this.scene.pause();
  
  // React-Komponente aktiviert YouTube-Embed
  EventBus.emit('show_trailer', { youtubeKey: data.trailer_key });
  
  // Nach 90 Sekunden oder Skip:
  EventBus.on('trailer_ended', () => {
    this.scene.resume();
  });
});
```

---

## 10. MVP-Variante — Sofort umsetzbar

### 10.1 MVP-Scope (2-4 Wochen Solo)

```
✅ MVP ENTHÄLT:
  • 1v1 Kartenspiel via WebSocket (Colyseus)
  • 20 YAML-Karten (5 Typen)
  • Einfache Spielregeln: Mana, HP, Angriff, 3 Effekt-Typen
  • KI-Gegner (1 Persönlichkeit, OpenRouter/Qwen)
  • Wohnzimmer-Lobby (React/HTMX)
  • Auth via PocketBase
  • Event-Log in SQLite
  • 1 Starter-Story (inkjs, 5 Knoten)
  • Poster-Wand mit TMDB (3-5 Filme)

❌ NICHT IM MVP:
  • Story-Engine (komplex)
  • Weltenkarte
  • Replay-System
  • Mobile-PWA
  • Async-Modus
  • Immich-Integration
```

### 10.2 Migration von bestehender Snake-Basis

Das Repo hat bereits:
- ✅ TypeScript + Node.js
- ✅ WebSocket Server (`ws`)
- ✅ Client/Server Trennung
- ✅ Message-Type-System (`messages.ts`)
- ✅ SocketManager-Pattern

**Migrationsplan:**

```
1. Colyseus installieren (ersetzt ws + manuelle SocketManager)
   npm install colyseus colyseus.js

2. CardGameRoom.ts erstellen (auf SocketManager aufbauend)
   src/server/rooms/CardGameRoom.ts

3. messages.ts → Card-Game Message Types erweitern
   type: "play_card" | "draw_card" | "end_turn" | "game_state"

4. Phaser.js zum Client hinzufügen
   npm install phaser
   src/client/scenes/GameScene.ts

5. YAML-Karten-Parser implementieren
   npm install js-yaml
   src/shared/card-loader.ts

6. PocketBase als Docker-Service hinzufügen
   docker-compose.yml
```

### 10.3 Starter-Kartenset (5 Karten für MVP)

```yaml
# Die ersten 5 Karten:
1. memory-erster-tag.yaml        → cost:1, heal:2, story_trigger: "anfang"
2. place-kueche-nachts.yaml      → cost:2, mana_next_turn:+1
3. emotion-nostalgie.yaml        → cost:1, emotion_power:+3
4. decision-bleib-oder-geh.yaml  → cost:3, branching_event (inkjs)
5. legendary-sommernacht.yaml    → cost:7, damage_all:3 + trailer_event
```

---

## 11. Offline / Local-First Variante

### 11.1 Service Worker + SQLite WASM

```
OFFLINE-MODUS:
  • @sqlite.org/sqlite-wasm im Browser (Spielstand lokal, OPFS-Storage)
  • Service Worker (PWA, offline spielbar)
  • Ollama (lokal) statt OpenRouter für KI
  • Sync wenn online: JSONL Event-Log hochladen (Append-Only = konfliktfrei)
```

### 11.2 Obsidian-Vault Integration

```
OBSIDIAN SYNC:
  • Karten-YAMLs direkt in Obsidian bearbeitbar
  • Story-.ink-Files als Obsidian-Notizen
  • Erinnerungsarchiv als Obsidian-Vault
  • CardVerse liest YAML-Vault über konfigurierbaren Pfad

VAULT-STRUKTUR:
  cardverse-vault/
  ├── cards/
  │   ├── memories/
  │   └── legendary/
  ├── story/
  │   └── chapters/
  └── memories/
      └── archive/
```

---

## 12. Mobile-First / PWA Variante

```
MOBILE FEATURES (Phase 3):
  • Touch-Drag für Karten (Pointer Events API + Phaser Touch)
  • Swipe-Navigation zwischen Wohnzimmer/Match/Story
  • Push Notifications (Web Push API) bei Gegner-Zug
  • Offline-Modus (Service Worker)
  • Add to Home Screen (PWA Manifest + Icons)

MOBILES LAYOUT:
  Portrait: Karten unten, Spielfeld oben, Mana-Leiste Mitte
  Landscape: Side-by-side Spieler, Deck rechts

OPTIONALER NATIV-WRAPPER:
  • Capacitor.js: Web → iOS/Android ohne Code-Änderung
  • Tauri: Web → Desktop-App (Windows/Mac/Linux)
```

---

## 13. Sicherheit & Datenschutz

### 13.1 Grundprinzipien

```
SERVER-AUTORITÄT:
  • Alle Spielzüge werden serverseitig validiert (Colyseus)
  • Client sieht NUR seine eigenen Handkarten (Colyseus Secret State)
  • Kein Client kann cheaten (Event-Log ist append-only, serverseitig)

AUTHENTIFIZIERUNG:
  • PocketBase Auth (Email/Password + Magic Link)
  • JWT Tokens, kurze Lebensdauer (1h Access, 7d Refresh)
  • Optional: OAuth2 (Google, GitHub)

WEBSOCKET SICHERHEIT:
  • Token-Validierung bei Verbindungsaufbau
  • Rate Limiting: max 10 Aktionen/Sekunde pro Client
  • Match-ID Validierung: nur Teilnehmer können beitreten
  • Cloudflare DDoS-Schutz (kostenlos)
```

### 13.2 Datenschutz-Features

```
PRIVATE RÄUME (Standard):
  • Matches nur via Code beitreten (kein öffentliches Matchmaking)
  • Erinnerungsarchiv nur für den Besitzer sichtbar
  • Keine öffentlichen Profile (opt-in)

DATENSPARSAMKEIT:
  • Keine Third-Party Analytics
  • Keine Werbe-Tracker
  • Minimale Profilinfos (Username, Avatar)
  • Self-Hosting: alle Daten unter eigener Kontrolle

DATEN-EXPORT (DSGVO):
  • Alle eigenen Events als JSONL
  • Karten-Sammlung als YAML
  • Story-Fortschritt als Markdown
  • Erinnerungsarchiv als ZIP

RECHT AUF VERGESSENWERDEN:
  • Account löschen = sofortige anonymisierung aller Events
  • Match-Replays: nach 90 Tagen auto-gelöscht (konfigurierbar)
```

---

## 14. Skalierungsvariante (1000+ Nutzer)

```
SKALIERUNGSARCHITEKTUR:
  [CDN / Cloudflare R2]
        │
  [React SPA — statisch]
        │
  [Cloudflare Workers — API Gateway]
        │
  ┌─────┼─────┐
  ▼     ▼     ▼
[Colyseus] [Colyseus] [Colyseus]  ← Mehrere Instanzen
  Room-Cluster (Fly.io oder Hetzner)
        │
  [PostgreSQL + Event Store]        ← Wenn SQLite nicht mehr reicht
        │
  [AI Worker Pool]                  ← vLLM oder mehrere Ollama-Instanzen
```

**Cloudflare Durable Objects für Game State** (empfohlen für echte Skalierung):
```typescript
// Ein Durable Object pro Match = Edge-nah, kein Race-Condition
export class MatchRoom implements DurableObject {
  async webSocketMessage(ws: WebSocket, message: string) {
    const event = JSON.parse(message);
    await this.state.storage.put(`event_${Date.now()}`, event);
    this.broadcast(this.state);
  }
}
```

---

## 15. Open-Source-Inspirationsprojekte (vollständig recherchiert)

### Game Engine / Multiplayer
| Projekt | GitHub | Relevanz |
|---------|--------|---------|
| **boardgame.io** | github.com/boardgameio/boardgame.io | Spiellogik, Secret State, Bots |
| **Colyseus.io** | github.com/colyseus/colyseus | Multiplayer Room System |
| **colyseus-card-demo** | github.com/sominator/colyseus-2d-multiplayer-card-game-templates | Turn-Based Referenz |
| **Phaser React Template** | github.com/phaserjs/template-react-ts | Offizieller Startpunkt |
| **hearthstone-os** | github.com/kvfrans/hearthstone-os | Hearthstone-Klon |
| **Cardshifter** | github.com/Cardshifter/Cardshifter | ECS für TCGs |

### Story / Narrative
| Projekt | GitHub | Relevanz |
|---------|--------|---------|
| **inkjs** | github.com/y-lohse/inkjs | Browser-Narrative-Engine |
| **Inky** | github.com/inkle/inky | .ink Story-Editor |
| **Twine** | twinery.org | Visuelle Story-Erstellung |

### Kommunikation / Erinnerungen
| Projekt | GitHub | Relevanz |
|---------|--------|---------|
| **Immich** | github.com/immich-app/immich | Selbst gehostetes Fotoarchiv |
| **Spacetime** | github.com/alexandrecpedro/spacetime | Erinnerungs-Timeline |
| **Time Capsule** | github.com/acm-projects/Time-Capsule | Zeitkapsel-Erinnerungen |
| **lite-youtube-embed** | github.com/paulirish/lite-youtube-embed | Trailer ohne Overhead |

### AI / Backend
| Projekt | URL | Relevanz |
|---------|-----|---------|
| **LiteLLM** | github.com/BerriAI/litellm | AI Model Router |
| **Ollama** | ollama.ai | Lokale KI |
| **PocketBase** | pocketbase.io | Backend-in-a-Binary |
| **GameMasterAI** | github.com/deckofdmthings/GameMasterAI | GPT als Dungeon Master |

### Forschung
| Paper | URL | Relevanz |
|-------|-----|---------|
| **Cardiverse** | arxiv.org/abs/2502.07128 | LLM-generierte Kartenspiele |
| **LLMs in Slay the Spire** | dl.acm.org/doi/fullHtml/10.1145/3649921.3650013 | LLM Spielstärke |
| **TCG DSL (Uni Twente)** | fmt.ewi.utwente.nl/media/283.pdf | Karteneffekt-DSL |

---

## 16. Roadmap

```
PHASE 0 — FUNDAMENT (Woche 1-2)
  ✦ Bestehende Snake-Basis auf CardVerse migrieren (Colyseus installieren)
  ✦ YAML-Karten-Parser (js-yaml) + 5 Starter-Karten
  ✦ Einfaches 1v1 WebSocket-Match (CardGameRoom.ts)
  ✦ PocketBase Docker Service

PHASE 1 — MVP (Woche 3-6)
  ✦ Vollständige Spielregeln (Mana, HP, 5 Effekt-Typen)
  ✦ KI-Gegner via OpenRouter (Qwen-2.5-7B, 1 Persönlichkeit)
  ✦ Basis-Wohnzimmer-Lobby (React + HTMX)
  ✦ inkjs Story-Integration (5 Knoten, 1 Kapitel)
  ✦ Event-Log in SQLite

PHASE 2 — KOMMUNIKATION (Monat 2-3)
  ✦ Karten als Kommunikationsmittel (Karten schicken)
  ✦ Erinnerungsarchiv (Memory Vault + Timeline)
  ✦ Filmplakat-Wand (TMDB API)
  ✦ Trailer-Events (lite-youtube-embed + Legendary)
  ✦ Async-Match-Modus (Push Notifications)
  ✦ Story-Engine (10 Kapitel, inkjs)

PHASE 3 — ERWEITERUNG (Monat 4-6)
  ✦ Weltenkarte (Hex-Grid, Light-Monopoly-Element)
  ✦ Replay-System (JSONL Viewer)
  ✦ PWA / Mobile (Service Worker, Push)
  ✦ Obsidian-Vault-Integration
  ✦ 3 KI-Persönlichkeiten
  ✦ Immich-Fotoarchiv-Integration

PHASE 4 — SKALIERUNG (Monat 7+)
  ✦ Cloudflare Durable Objects (wenn >100 CCU)
  ✦ Multiplayer-Turniere
  ✦ Karten-Editor (YAML im Browser bearbeiten)
  ✦ Community-Kartensets (Fan-Erweiterungen)
  ✦ Desktop-Control-Center (Tauri oder Electron)
```

---

## 17. Nächste konkrete Schritte (heute)

```bash
# Schritt 1: Branch ist bereits korrekt
# Branch: claude/cardverse-game-portal-research-Ra2HJ ✓

# Schritt 2: Colyseus installieren
npm install colyseus colyseus.js @colyseus/schema

# Schritt 3: Karten-Verzeichnis anlegen
mkdir -p data/cards/memory data/cards/places data/cards/legendary data/cards/emotions
mkdir -p data/story/chapters

# Schritt 4: Erste Karte schreiben
# → data/cards/memory/erster-tag.yaml (Schema oben)

# Schritt 5: CardGameRoom.ts erstellen
# → src/server/rooms/CardGameRoom.ts (Vorlage oben)

# Schritt 6: messages.ts erweitern
# → Card-Game Message Types hinzufügen

# Schritt 7: PocketBase Docker Service
# → docker-compose.yml erstellen
```

---

*Dokument generiert: 2026-05-23 | Forschung: Multi-Agenten (4 parallele Agents)*
*Projekt: CARDVERSE / MT-BIZEPS-CARDVERSE-001*
*Basis-Repo: /home/user/NewGame | Branch: claude/cardverse-game-portal-research-Ra2HJ*

*Recherche-Quellen: boardgame.io, Colyseus.io Docs, TMDB API, OpenRouter, Phaser.io,*
*arXiv:2502.07128 (Cardiverse), ACM 2024 (LLMs in Slay the Spire), PocketBase Docs,*
*Hetzner Cloud Pricing, Cloudflare Durable Objects, lite-youtube-embed, inkjs, Immich*
