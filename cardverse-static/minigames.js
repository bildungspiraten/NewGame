// CARDVERSE – Minispiele

import { MINIGAMES } from "./data.js";
import { trackEvent } from "./eventlog.js";
import { applyCardEffects } from "./card-engine.js";

// Haupt-Einstieg: rendert das richtige Minispiel anhand der ID
// onComplete(newState) wird aufgerufen wenn das Spiel abgeschlossen ist
export function renderMinigame(minigameId, state, containerEl, onComplete) {
  const game = MINIGAMES.find((g) => g.id === minigameId);
  if (!game) {
    containerEl.innerHTML = `<p class="error-text">Minispiel nicht gefunden.</p>`;
    return;
  }

  switch (game.type) {
    case "sort":
      renderSortGame(game, state, containerEl, onComplete);
      break;
    case "assemble":
      renderAssembleGame(game, state, containerEl, onComplete);
      break;
    case "reflect":
      renderReflectGame(game, state, containerEl, onComplete);
      break;
    default:
      containerEl.innerHTML = `<p class="error-text">Unbekannter Minispiel-Typ.</p>`;
  }
}

// ── 1. Erinnerung sortieren ──────────────────────────────────────────────────
function renderSortGame(game, state, containerEl, onComplete) {
  const items = [...game.items];
  shuffle(items);

  containerEl.innerHTML = `
    <div class="minigame minigame--sort">
      <h2 class="minigame-title">${game.title}</h2>
      <p class="minigame-desc">${game.description}</p>
      <ul class="sort-list" id="sort-list">
        ${items
          .map(
            (item, i) => `
          <li class="sort-item" draggable="true" data-index="${i}">
            <span class="sort-handle">⠿</span>
            <span class="sort-text">${item}</span>
          </li>`
          )
          .join("")}
      </ul>
      <p class="minigame-hint">Ziehe die Karten in deine Reihenfolge.</p>
      <button class="btn btn--primary" id="btn-sort-done">Das ist meine Reihenfolge</button>
    </div>
  `;

  setupDragSort(containerEl.querySelector("#sort-list"));

  containerEl.querySelector("#btn-sort-done").addEventListener("click", () => {
    const order = [...containerEl.querySelectorAll(".sort-item")].map(
      (el) => el.querySelector(".sort-text").textContent
    );
    trackEvent(game.completionEvent, { minigameId: game.id, order });
    trackEvent("minigame.completed", { minigameId: game.id });
    const newState = applyCardEffects(state, game.cardEffect);
    onComplete(newState);
  });
}

function setupDragSort(list) {
  let dragging = null;

  list.addEventListener("dragstart", (e) => {
    dragging = e.target.closest(".sort-item");
    dragging?.classList.add("dragging");
  });

  list.addEventListener("dragend", () => {
    dragging?.classList.remove("dragging");
    dragging = null;
  });

  list.addEventListener("dragover", (e) => {
    e.preventDefault();
    const target = e.target.closest(".sort-item");
    if (!target || target === dragging) return;
    const rect = target.getBoundingClientRect();
    const after = e.clientY > rect.top + rect.height / 2;
    list.insertBefore(dragging, after ? target.nextSibling : target);
  });

  // Touch support
  let touchItem = null;
  let touchClone = null;

  list.addEventListener("touchstart", (e) => {
    touchItem = e.target.closest(".sort-item");
    if (!touchItem) return;
    touchItem.classList.add("dragging");
    touchClone = touchItem.cloneNode(true);
    touchClone.style.cssText = `position:fixed;opacity:.7;pointer-events:none;z-index:9999;width:${touchItem.offsetWidth}px;`;
    document.body.appendChild(touchClone);
  }, { passive: true });

  list.addEventListener("touchmove", (e) => {
    if (!touchItem || !touchClone) return;
    const touch = e.touches[0];
    touchClone.style.left = `${touch.clientX - 20}px`;
    touchClone.style.top = `${touch.clientY - 20}px`;
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    const target = el?.closest(".sort-item");
    if (target && target !== touchItem) {
      const rect = target.getBoundingClientRect();
      const after = touch.clientY > rect.top + rect.height / 2;
      list.insertBefore(touchItem, after ? target.nextSibling : target);
    }
  }, { passive: true });

  list.addEventListener("touchend", () => {
    touchItem?.classList.remove("dragging");
    touchClone?.remove();
    touchItem = null;
    touchClone = null;
  }, { passive: true });
}

// ── 2. Emblem zusammensetzen ─────────────────────────────────────────────────
function renderAssembleGame(game, state, containerEl, onComplete) {
  const pieces = [...game.pieces];
  const shuffled = [...pieces];
  shuffle(shuffled);
  const selected = [];

  containerEl.innerHTML = `
    <div class="minigame minigame--assemble">
      <h2 class="minigame-title">${game.title}</h2>
      <p class="minigame-desc">${game.description}</p>
      <div class="assemble-target">
        ${pieces
          .map(
            (_, i) => `<div class="assemble-slot" data-slot="${i}"></div>`
          )
          .join("")}
      </div>
      <div class="assemble-pieces" id="assemble-pieces">
        ${shuffled
          .map(
            (p) => `<button class="assemble-piece" data-piece="${p}">${p}</button>`
          )
          .join("")}
      </div>
      <p class="minigame-hint">Tippe die Teile in der Reihenfolge an, die sich richtig anfühlt.</p>
      <p class="minigame-feedback" id="assemble-feedback"></p>
    </div>
  `;

  const slots = containerEl.querySelectorAll(".assemble-slot");
  const feedback = containerEl.querySelector("#assemble-feedback");

  containerEl.querySelectorAll(".assemble-piece").forEach((btn) => {
    btn.addEventListener("click", () => {
      const piece = btn.dataset.piece;
      if (selected.includes(piece)) return;
      selected.push(piece);
      btn.disabled = true;
      btn.classList.add("selected");

      const slotIndex = selected.length - 1;
      if (slots[slotIndex]) slots[slotIndex].textContent = piece;

      if (selected.length === pieces.length) {
        // Reihenfolge ist egal – jede Reihenfolge ist gültig
        trackEvent(game.completionEvent, { minigameId: game.id, order: selected });
        trackEvent("minigame.completed", { minigameId: game.id });
        feedback.textContent = "Das Emblem ist zusammengesetzt.";
        feedback.className = "minigame-feedback minigame-feedback--success";

        setTimeout(() => {
          const newState = applyCardEffects(state, game.cardEffect);
          onComplete(newState);
        }, 1200);
      }
    });
  });
}

// ── 3. Pfad reflektieren ─────────────────────────────────────────────────────
function renderReflectGame(game, state, containerEl, onComplete) {
  containerEl.innerHTML = `
    <div class="minigame minigame--reflect">
      <h2 class="minigame-title">${game.title}</h2>
      <p class="minigame-desc">${game.description}</p>
      <textarea
        class="reflect-textarea"
        id="reflect-input"
        placeholder="Was fällt dir ein? Es muss nichts Großes sein."
        rows="6"
        maxlength="800"
      ></textarea>
      <p class="reflect-counter"><span id="reflect-count">0</span> / 800</p>
      <div class="reflect-actions">
        <button class="btn btn--secondary" id="btn-reflect-private">Privat lassen</button>
        <button class="btn btn--primary" id="btn-reflect-save">Speichern</button>
      </div>
    </div>
  `;

  const textarea = containerEl.querySelector("#reflect-input");
  const counter = containerEl.querySelector("#reflect-count");

  textarea.addEventListener("input", () => {
    counter.textContent = textarea.value.length;
  });

  containerEl.querySelector("#btn-reflect-save").addEventListener("click", () => {
    const text = textarea.value.trim();
    if (!text) {
      textarea.focus();
      return;
    }
    trackEvent(game.completionEvent, { minigameId: game.id, text });
    trackEvent("minigame.completed", { minigameId: game.id });
    const newState = applyCardEffects(state, game.cardEffect);
    onComplete(newState);
  });

  containerEl.querySelector("#btn-reflect-private").addEventListener("click", () => {
    // Inhalt wird nicht gespeichert, nur Abschluss getracked
    trackEvent(game.completionEvent, { minigameId: game.id, text: "[privat]" });
    trackEvent("minigame.completed", { minigameId: game.id });
    const newState = applyCardEffects(state, game.cardEffect);
    onComplete(newState);
  });
}

// ── Hilfsfunktion ─────────────────────────────────────────────────────────────
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
