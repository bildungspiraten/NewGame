// CARDVERSE – Card Engine

import { CARDS } from "./data.js";

// Gibt den aktuellen Wert einer Karte zurück (min 1, max 10)
export function getCardValue(state, cardId) {
  return state.cardValues[cardId] ?? 1;
}

// Gibt alle Kartenwerte zurück
export function getCardValues(state) {
  const result = {};
  for (const card of CARDS) {
    result[card.id] = getCardValue(state, card.id);
  }
  return result;
}

// Erhöht den Wert einer Karte um modifier (nie unter 1, nie über 10)
export function updateCardValue(state, cardId, modifier) {
  if (state.finalValuesLocked) return state;
  const current = getCardValue(state, cardId);
  const card = CARDS.find((c) => c.id === cardId);
  if (!card) return state;
  const updated = Math.min(card.maxValue, Math.max(1, current + modifier));
  return {
    ...state,
    cardValues: { ...state.cardValues, [cardId]: updated },
  };
}

// Wendet ein cardEffect-Objekt auf den State an: { card_memory: 2, card_trust: 1 }
export function applyCardEffects(state, cardEffect) {
  if (!cardEffect) return state;
  let newState = state;
  for (const [cardId, modifier] of Object.entries(cardEffect)) {
    newState = updateCardValue(newState, cardId, modifier);
  }
  return newState;
}

// Sperrt finale Werte für das Endgame (kein weiterer Modifier möglich)
export function lockFinalValues(state) {
  return { ...state, finalValuesLocked: true };
}

// Berechnet Endgame-Auswertung: Gesamtpunktzahl und Beschreibung
export function calculateEndgame(state) {
  const values = getCardValues(state);
  const total = Object.values(values).reduce((sum, v) => sum + v, 0);
  const max = CARDS.length * 10;
  const percent = Math.round((total / max) * 100);

  let tier, description;
  if (percent >= 80) {
    tier = "Aufbruch";
    description =
      "Du hast viel Raum geschaffen. Die Karten zeigen Offenheit, Mut und Nähe.";
  } else if (percent >= 55) {
    tier = "Unterwegs";
    description =
      "Du bist auf dem Weg. Manches ist noch offen – das ist in Ordnung.";
  } else if (percent >= 35) {
    tier = "Im Prozess";
    description =
      "Dieser Weg kostet Kraft. Dass du ihn gegangen bist, zählt.";
  } else {
    tier = "Am Anfang";
    description = "Jeder Weg beginnt irgendwo. Du bist hier.";
  }

  const cards = CARDS.map((card) => ({
    ...card,
    currentValue: values[card.id],
  }));

  return { total, max, percent, tier, description, cards };
}

// Rendert eine einzelne Karte als DOM-Element und gibt es zurück
export function renderCard(state, cardId) {
  const card = CARDS.find((c) => c.id === cardId);
  if (!card) return null;
  const value = getCardValue(state, cardId);

  const el = document.createElement("div");
  el.className = "card-item";
  el.dataset.cardId = cardId;
  el.style.setProperty("--card-accent", card.accentColor);

  const dots = Array.from({ length: card.maxValue }, (_, i) =>
    i < value
      ? `<span class="card-dot card-dot--filled"></span>`
      : `<span class="card-dot"></span>`
  ).join("");

  el.innerHTML = `
    <div class="card-inner">
      <div class="card-frame-img" style="background-image:url('${card.frame}')"></div>
      <div class="card-body">
        <h3 class="card-name">${card.name}</h3>
        <p class="card-description">${card.description}</p>
        <div class="card-dots" aria-label="Wert: ${value} von ${card.maxValue}">${dots}</div>
        <div class="card-value-label">${value} / ${card.maxValue}</div>
      </div>
    </div>
  `;
  return el;
}

// Rendert alle Karten in ein Container-Element
export function renderAllCards(state, containerEl) {
  containerEl.innerHTML = "";
  for (const card of CARDS) {
    const el = renderCard(state, card.id);
    if (el) containerEl.appendChild(el);
  }
}
