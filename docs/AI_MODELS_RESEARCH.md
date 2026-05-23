# KI-Modelle für CARDVERSE — Recherche 2025/2026
## Kostenlose und budgetfreundliche Optionen

---

## OpenRouter — Kostenlose Modelle (Stand Mai 2026)

OpenRouter bietet derzeit **28 kostenlose Modelle** (`:free`-Suffix).

### Empfohlene Free-Tier-Modelle

| Modell | Kontext | Tool Calling | Beste Spielaufgabe |
|--------|---------|-------------|-------------------|
| `meta-llama/llama-3.3-70b-instruct:free` | 131K | ✅ OpenAI-Format | Erzähler, NPC-Dialog, Game Master |
| `deepseek/deepseek-v4-flash:free` | 1M (!) | ✅ | Komplexe Logik, langer Kontext |
| `qwen/qwen-2.5-7b-instruct:free` | 32K | ✅ | Gegner-KI, Flavor-Texte (schnell) |
| `google/gemma-3-12b-it:free` | 131K | ✅ | NPC-Dialog, multimodal |
| `mistralai/mistral-7b-instruct:free` | 32K | ✅ | Allgemein, einfache Dialoge |
| `mistralai/mistral-nemo:free` | 128K | ✅ | Lange Dialoge, Instruktionsbefolgung |

**Free-Tier Rate Limits**: ~20 Anfragen/Minute, ~200 Anfragen/Tag (je nach Modell und Serverauslastung).

### Günstige bezahlte Optionen (bei Überschreitung Free Tier)

| Modell | Input $/1M | Output $/1M | Empfehlung |
|--------|-----------|------------|-----------|
| `mistralai/mistral-nemo` | $0.02 | $0.03 | Story-Narration (bestes Preis-Qualität) |
| `mistralai/mistral-small` | $0.10 | $0.30 | Allgemein |
| `deepseek/deepseek-v3` | $0.32 | $0.89 | Game Master, Reasoning |
| `meta-llama/llama-3.3-70b-instruct` | $0.12 | $0.40 | Premium-Qualität |

**Praxis-Kalkulation**: Bei 500 Token/Anfrage und 1.000 Anfragen/Tag
= $0.06/Tag mit Mistral Nemo = **~$1.80/Monat** — praktisch gratis.

---

## Lokale Modelle via Ollama (8 GB RAM/VRAM)

### Empfohlene Modelle

| Modell | RAM | Tokens/Sek (GPU) | Qualität |
|--------|-----|-----------------|---------|
| `gemma3:12b` (Q4_K_M) | ~7.5 GB | 20–30 | ⭐⭐⭐⭐⭐ NPC, Story |
| `qwen2.5:7b` | ~4.5 GB | 30–45 | ⭐⭐⭐⭐ Gegner-KI (schnell) |
| `llama3.2:8b` | ~5.5 GB | 25–40 | ⭐⭐⭐⭐ Allround |
| `mistral:7b` | ~4.5 GB | 30–40 | ⭐⭐⭐ Allgemein |
| `phi4-mini:3.8b` | ~2.5 GB | 50–80 | ⭐⭐⭐ Sehr schnell, einfache Tasks |

**Wichtig**: `OLLAMA_KEEP_ALIVE=-1` setzen, sonst 5–30 Sek Kaltstart pro Anfrage!

```bash
# Installation:
ollama pull gemma3:12b   # Für NPC-Dialog + Story (bestes lokales Modell)
ollama pull qwen2.5:7b   # Für Gegner-KI (schnellstes lokales Modell)
ollama pull phi4-mini    # Für einfache Entscheidungen (ultra-schnell)

# Starten mit permanentem Keepalive:
OLLAMA_KEEP_ALIVE=-1 ollama serve
```

---

## Modell-Routing nach Spielaufgabe

### Entscheidungsmatrix

| Spielaufgabe | Cloud (Free) | Lokal (Ollama) | Max Tokens |
|-------------|-------------|---------------|-----------|
| **Gegner-KI Entscheidung** | `qwen/qwen-2.5-7b-instruct:free` | `phi4-mini:3.8b` | 100 |
| **NPC-Dialog (kurz)** | `llama-3.3-70b:free` | `gemma3:12b` | 150 |
| **Story-Narration** | `llama-3.3-70b:free` | `mistral-nemo:12b` | 400 |
| **Karten-Flavor-Text** | `mistral-7b:free` | `qwen2.5:7b` | 80 |
| **Game Master** | `deepseek-v3` (paid) | `llama3.2:8b` | 500 |
| **Emotionale Szenen** | `mistral-nemo-celeste` | `gemma3:12b` | 300 |

### Forschungsergebnis

> "Qwen-2.5-7B übertrifft GPT-4 in Kartenspiel-Entscheidungen, da größere Modelle zur
> Überanalyse neigen." — *Language-Driven Play in Slay the Spire*, ACM 2024

---

## LiteLLM Router: OpenRouter → Ollama Fallback

```python
# server/ai/litellm_config.py
import litellm

# Automatischer Fallback wenn Free-Tier exhausted oder offline
litellm.fallbacks = [
    {
        "model": "openrouter/meta-llama/llama-3.3-70b-instruct:free",
        "fallbacks": [
            "openrouter/mistralai/mistral-nemo",  # bezahlt aber günstig
            "ollama_chat/llama3.2:8b"             # lokal, kostenlos
        ]
    },
    {
        "model": "openrouter/qwen/qwen-2.5-7b-instruct:free",
        "fallbacks": ["ollama_chat/qwen2.5:7b"]
    }
]

async def ai_decide_card(game_state: dict, personality: dict) -> dict:
    response = await litellm.acompletion(
        model=personality["model_cloud"],
        messages=[
            {"role": "system", "content": build_system_prompt(personality)},
            {"role": "user", "content": format_game_state(game_state)}
        ],
        response_format={"type": "json_object"},
        max_tokens=100,
        temperature=personality.get("temperature", 0.7)
    )
    return parse_ai_decision(response.choices[0].message.content)
```

### Kostenschätzung: 100 gleichzeitige Spieler

```
Annahmen:
  • 10 Anfragen/Match-Stunde (KI-Gegner)
  • 50% der Matches vs. AI
  • 100 CCU = 50 AI-Matches gleichzeitig

Täglich:
  • 50 Matches × 8h × 10 Req/h = 4.000 Anfragen
  • Free Tier: 200 Req/Tag → nur erste 5% kostenlos
  • Restliche 3.800 Req via Mistral Nemo: 3.800 × 500 Token × $0.025/1M = $0.048/Tag

Monatliche KI-Kosten bei 100 CCU: ~$1.44/Monat
```

---

## Spezielle Fine-Tunes (HuggingFace)

| Modell | Quelle | Beschreibung |
|--------|--------|-------------|
| `Gemma3NPC` | HuggingFace | Für Live-NPC-Interaktionen in Spielen |
| `mn-celeste-12b` | OpenRouter | Mistral Nemo, für kreative/emotionale Narrative |
| `hermes-3:8b` | Ollama | Roleplay-fokussiert, starke Charakterkonsistenz |

---

## Alternativer Setup: Mistral La Plateforme (kostenlos)

Mistral bietet **1 Milliarde Token/Monat kostenlos** direkt auf ihrer Plattform.
Für ein kleines Kartenspiel reicht das dauerhaft aus.

```python
# Direktzugriff via OpenAI-kompatiblem Endpoint:
client = OpenAI(
    base_url="https://api.mistral.ai/v1",
    api_key=MISTRAL_API_KEY  # kostenloser Key auf console.mistral.ai
)
```

---

*Recherchiert: 2026-05-23 | Quellen: OpenRouter Docs, Ollama Hub, arXiv 2509.01328, ACM 2024*
