// CARDVERSE – App Controller

import { APP_CONFIG, INITIAL_STATE, STAGES, MAP_NODES, BAROMETERS, DECISIONS, EMBLEMS, TEXTS, CARDS } from "./data.js";
import { trackEvent, exportEvents, clearEventsWithConfirm } from "./eventlog.js";
import { renderAllCards, applyCardEffects, calculateEndgame } from "./card-engine.js";
import { renderMap, unlockNode, markNodeCompleted, getCurrentStage, tryAdvanceStage, canAdvance } from "./map-engine.js";
import { renderMinigame } from "./minigames.js";
import { renderStatsScreen, exportStatsJSON } from "./stats.js";

// ── State ─────────────────────────────────────────────────────────────────────

let state = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(APP_CONFIG.storageKey);
    if (!raw) return { ...INITIAL_STATE };
    const saved = JSON.parse(raw);
    // Versionsmigration: fehlende Felder ergänzen
    return { ...INITIAL_STATE, ...saved };
  } catch {
    return { ...INITIAL_STATE };
  }
}

function saveState() {
  try {
    localStorage.setItem(APP_CONFIG.storageKey, JSON.stringify(state));
  } catch (e) {
    console.warn("App: State-Speicherung fehlgeschlagen", e);
  }
}

function setState(newState) {
  state = newState;
  saveState();
}

// ── Navigation ────────────────────────────────────────────────────────────────

const screens = ["screen-consent", "screen-home", "screen-cards", "screen-map", "screen-node", "screen-stats", "screen-endgame"];

function showScreen(id, renderFn) {
  for (const sid of screens) {
    const el = document.getElementById(sid);
    if (el) el.hidden = true;
  }
  const target = document.getElementById(id);
  if (target) {
    target.hidden = false;
    if (renderFn) renderFn(target);
  }
  updateBottomNav(id);
}

function updateBottomNav(activeScreenId) {
  const navMap = {
    "screen-home": "nav-home",
    "screen-cards": "nav-cards",
    "screen-map": "nav-map",
    "screen-stats": "nav-stats",
  };
  document.querySelectorAll(".bottom-nav-btn").forEach((btn) => btn.classList.remove("active"));
  const activeBtn = navMap[activeScreenId];
  if (activeBtn) document.getElementById(activeBtn)?.classList.add("active");
}

// ── Consent ───────────────────────────────────────────────────────────────────

function showConsent() {
  showScreen("screen-consent", (el) => {
    el.querySelector("#consent-text").textContent = TEXTS.consent;
  });
}

function handleConsentAccept() {
  setState({ ...state, consentGiven: true });
  trackEvent("app.started");
  showHome();
}

// ── Home / Aktuelle Stage ─────────────────────────────────────────────────────

function showHome() {
  trackEvent("chapter.opened", { stageId: state.currentStage });
  showScreen("screen-home", renderHome);
}

function renderHome(el) {
  const stage = getCurrentStage(state);
  el.querySelector("#home-stage-title").textContent = stage.title;
  el.querySelector("#home-stage-subtitle").textContent = stage.subtitle ?? "";
  el.querySelector("#home-intro-text").textContent = stage.intro;

  const bg = stage.background;
  el.querySelector("#home-bg").style.backgroundImage = bg ? `url('${bg}')` : "";

  // Kapitel-Fortschritt
  const stageIdx = STAGES.findIndex((s) => s.id === stage.id);
  el.querySelector("#home-chapter-num").textContent = `Kapitel ${stageIdx + 1} / ${STAGES.length}`;

  // Buttons für verfügbare Knoten
  const nodeList = el.querySelector("#home-node-list");
  nodeList.innerHTML = "";
  for (const nodeId of stage.requiredNodes) {
    const node = MAP_NODES.find((n) => n.id === nodeId);
    if (!node) continue;
    const unlocked = state.unlockedNodes.includes(nodeId);
    const completed = state.completedNodes.includes(nodeId);

    const btn = document.createElement("button");
    btn.className = `node-btn node-btn--${node.type} ${completed ? "node-btn--done" : ""} ${!unlocked ? "node-btn--locked" : ""}`;
    btn.disabled = !unlocked;
    btn.textContent = `${completed ? "✓ " : ""}${node.label}`;
    btn.addEventListener("click", () => openNode(node));
    nodeList.appendChild(btn);
  }

  // Weiter-Button
  const advanceBtn = el.querySelector("#btn-advance");
  const can = canAdvance(state);
  advanceBtn.disabled = !can;
  advanceBtn.textContent = can ? "Nächstes Kapitel →" : "Noch nicht alle Stationen erledigt";
}

// ── Node öffnen ───────────────────────────────────────────────────────────────

function openNode(node) {
  trackEvent("map.node.opened", { nodeId: node.id });
  setState(unlockNode(state, node.id));

  switch (node.type) {
    case "video":
      openVideoNode(node);
      break;
    case "decision":
      openDecisionNode(node);
      break;
    case "barometer":
      openBarometerNode(node);
      break;
    case "minigame":
    case "reflection":
      openMinigameNode(node);
      break;
    case "start":
      completeNode(node.id);
      showHome();
      break;
    default:
      completeNode(node.id);
      showHome();
  }
}

function completeNode(nodeId) {
  let newState = markNodeCompleted(state, nodeId);
  newState = tryAdvanceStage(newState);
  // Emblem vergeben falls Kapitel abgeschlossen
  const stage = getCurrentStage(newState);
  const prevStage = getCurrentStage(state);
  if (stage.id !== prevStage.id) {
    newState = awardEmblem(newState, prevStage.rewardEmblem);
    // Karten-Modifier der abgeschlossenen Stage anwenden
    if (prevStage.cardModifiers) {
      newState = applyCardEffects(newState, prevStage.cardModifiers);
    }
    // Endgame prüfen
    if (newState.currentStage === "stage_06_endgame" && !newState.finalValuesLocked) {
      showHome();
    }
  }
  setState(newState);
}

function awardEmblem(s, emblemId) {
  if (!emblemId || s.unlockedEmblems.includes(emblemId)) return s;
  trackEvent("emblem.unlocked", { emblemId });
  return { ...s, unlockedEmblems: [...s.unlockedEmblems, emblemId] };
}

// ── Video ─────────────────────────────────────────────────────────────────────

function openVideoNode(node) {
  const videoId = node.videoId;
  const src = APP_CONFIG.videoLinks[videoId] ?? "";

  showScreen("screen-node", (el) => {
    el.querySelector("#node-title").textContent = node.label;
    el.querySelector("#node-back-btn").onclick = showHome;

    const content = el.querySelector("#node-content");
    if (!src) {
      content.innerHTML = `
        <div class="video-placeholder">
          <p>${TEXTS.noVideo}</p>
          <button class="btn btn--primary" id="btn-video-skip">Station als gesehen markieren</button>
        </div>`;
      content.querySelector("#btn-video-skip").addEventListener("click", () => {
        trackEvent("video.completed", { videoId, skipped: true });
        completeNode(node.id);
        showHome();
      });
      return;
    }

    trackEvent("video.started", { videoId });
    content.innerHTML = `
      <div class="video-panel">
        <div class="video-wrapper" id="video-wrapper">
          <iframe
            id="chapter-video"
            src="${src}"
            allow="autoplay; fullscreen"
            allowfullscreen
            frameborder="0"
            oncontextmenu="return false"
            title="Kapitel-Video"
          ></iframe>
        </div>
        <button class="btn btn--icon" id="btn-video-expand" aria-label="Vollbild">⤢ Vollbild</button>
        <button class="btn btn--primary" id="btn-video-done">Video gesehen ✓</button>
      </div>`;

    content.querySelector("#btn-video-done").addEventListener("click", () => {
      trackEvent("video.completed", { videoId });
      completeNode(node.id);
      showHome();
    });

    content.querySelector("#btn-video-expand").addEventListener("click", () => {
      openVideoOverlay(src, videoId);
    });
  });
}

function openVideoOverlay(src, videoId) {
  const overlay = document.getElementById("video-overlay");
  overlay.hidden = false;
  overlay.querySelector("#overlay-iframe").src = src;
  overlay.querySelector("#btn-overlay-close").onclick = () => {
    overlay.hidden = true;
    overlay.querySelector("#overlay-iframe").src = "";
  };
  overlay.querySelector("#btn-overlay-fullscreen").onclick = () => {
    const iframe = overlay.querySelector("#overlay-iframe");
    if (iframe.requestFullscreen) iframe.requestFullscreen();
  };
  trackEvent("video.replayed", { videoId });
}

// ── Entscheidung ──────────────────────────────────────────────────────────────

function openDecisionNode(node) {
  const decision = DECISIONS.find((d) => d.id === node.decisionId);
  if (!decision) return;
  const locked = state.lockedDecisions[decision.id];

  trackEvent("decision.opened", { decisionId: decision.id, timestamp: Date.now() });

  showScreen("screen-node", (el) => {
    el.querySelector("#node-title").textContent = node.label;
    el.querySelector("#node-back-btn").onclick = showHome;

    const content = el.querySelector("#node-content");

    if (locked) {
      const option = decision.options.find((o) => o.id === locked.optionId);
      content.innerHTML = `
        <div class="decision-panel decision-panel--locked">
          <p class="decision-locked-note">${TEXTS.decisionLocked}</p>
          <h3 class="decision-question">${decision.question}</h3>
          <div class="decision-chosen">
            <span class="decision-chosen-label">Deine Entscheidung:</span>
            <span class="decision-chosen-text">${option?.text ?? locked.optionId}</span>
          </div>
          <button class="btn btn--secondary" id="btn-decision-back">Zurück</button>
        </div>`;
      content.querySelector("#btn-decision-back").addEventListener("click", showHome);
      return;
    }

    content.innerHTML = `
      <div class="decision-panel">
        <h3 class="decision-question">${decision.question}</h3>
        <div class="decision-options" id="decision-options">
          ${decision.options
            .map(
              (opt) => `
            <button class="decision-option" data-option-id="${opt.id}">
              ${opt.text}
            </button>`
            )
            .join("")}
        </div>
        <p class="decision-hint">Diese Entscheidung kann danach nicht geändert werden.</p>
      </div>`;

    content.querySelectorAll(".decision-option").forEach((btn) => {
      btn.addEventListener("click", () => {
        const optionId = btn.dataset.optionId;
        confirmDecision(decision, node, optionId);
      });
    });
  });
}

function confirmDecision(decision, node, optionId) {
  const option = decision.options.find((o) => o.id === optionId);
  if (!confirm(`"${option.text}" wählen und sperren?`)) return;

  const now = Date.now();
  trackEvent("decision.selected", { decisionId: decision.id, optionId, timestamp: now });
  trackEvent("decision.locked", { decisionId: decision.id, optionId, timestamp: now });

  let newState = {
    ...state,
    lockedDecisions: {
      ...state.lockedDecisions,
      [decision.id]: { optionId, lockedAt: now },
    },
  };
  newState = applyCardEffects(newState, option.cardEffect);
  setState(newState);
  completeNode(node.id);
  showHome();
}

// ── Barometer ─────────────────────────────────────────────────────────────────

function openBarometerNode(node) {
  const barometer = BAROMETERS.find((b) => b.id === node.barometerId);
  if (!barometer) return;

  showScreen("screen-node", (el) => {
    el.querySelector("#node-title").textContent = node.label;
    el.querySelector("#node-back-btn").onclick = showHome;

    const content = el.querySelector("#node-content");
    content.innerHTML = `
      <div class="barometer-panel">
        <h3 class="barometer-name">${barometer.name}</h3>
        <p class="barometer-description">${barometer.description}</p>
        <div class="barometer-slider-row">
          <span class="barometer-label">${barometer.minLabel}</span>
          <input type="range" class="barometer-slider" id="barometer-range"
            min="1" max="10" value="5" step="1">
          <span class="barometer-label">${barometer.maxLabel}</span>
        </div>
        <div class="barometer-value-display">
          <span id="barometer-val-display">5</span> / 10
        </div>
        <textarea
          class="barometer-note"
          id="barometer-note"
          placeholder="Notiz (optional, bleibt privat)"
          rows="3"
          maxlength="300"
        ></textarea>
        <div class="barometer-actions">
          <button class="btn btn--secondary" id="btn-barometer-private">Privat lassen</button>
          <button class="btn btn--primary" id="btn-barometer-save">Speichern</button>
        </div>
        <p class="barometer-disclaimer">Barometer-Werte sind keine Bewertung. Sie dienen nur deiner Reflexion.</p>
      </div>`;

    const range = content.querySelector("#barometer-range");
    const valDisplay = content.querySelector("#barometer-val-display");
    range.addEventListener("input", () => { valDisplay.textContent = range.value; });

    function submitBarometer(saveNote) {
      const value = parseInt(range.value, 10);
      const note = saveNote ? content.querySelector("#barometer-note").value.trim() : "[privat]";
      const entry = { barometerId: barometer.id, value, note, timestamp: Date.now() };
      setState({ ...state, barometers: [...state.barometers, entry] });
      trackEvent("barometer.submitted", { barometerId: barometer.id, value });
      completeNode(node.id);
      showHome();
    }

    content.querySelector("#btn-barometer-save").addEventListener("click", () => submitBarometer(true));
    content.querySelector("#btn-barometer-private").addEventListener("click", () => submitBarometer(false));
  });
}

// ── Minispiel ─────────────────────────────────────────────────────────────────

function openMinigameNode(node) {
  const minigameId = node.minigameId;

  showScreen("screen-node", (el) => {
    el.querySelector("#node-title").textContent = node.label;
    el.querySelector("#node-back-btn").onclick = showHome;

    const content = el.querySelector("#node-content");
    renderMinigame(minigameId, state, content, (newState) => {
      setState(newState);
      completeNode(node.id);
      showHome();
    });
  });
}

// ── Karten ────────────────────────────────────────────────────────────────────

function showCards() {
  showScreen("screen-cards", (el) => {
    renderAllCards(state, el.querySelector("#cards-container"));
  });
}

// ── Map ───────────────────────────────────────────────────────────────────────

function showMap() {
  trackEvent("map.node.opened", { context: "map-screen" });
  showScreen("screen-map", (el) => {
    renderMap(state, el.querySelector("#map-container"), (node) => {
      openNode(node);
    });
  });
}

// ── Statistiken ───────────────────────────────────────────────────────────────

function showStats() {
  showScreen("screen-stats", (el) => {
    renderStatsScreen(state, el.querySelector("#stats-container"));
    el.querySelector("#btn-export-stats")?.addEventListener("click", () => exportStatsJSON(state));
    el.querySelector("#btn-reset-all")?.addEventListener("click", handleReset);
  });
}

// ── Endgame ───────────────────────────────────────────────────────────────────

function showEndgame() {
  showScreen("screen-endgame", (el) => {
    const result = calculateEndgame(state);
    el.querySelector("#endgame-title").textContent = TEXTS.endgameTitle;
    el.querySelector("#endgame-subtitle").textContent = TEXTS.endgameSubtitle;
    el.querySelector("#endgame-tier").textContent = result.tier;
    el.querySelector("#endgame-desc").textContent = result.description;

    const cardList = el.querySelector("#endgame-cards");
    cardList.innerHTML = result.cards
      .map(
        (c) => `
        <div class="endgame-card-row">
          <span class="endgame-card-name">${c.name}</span>
          <div class="endgame-card-bar">
            <div class="endgame-card-fill" style="width:${(c.currentValue / c.maxValue) * 100}%; background:${c.accentColor}"></div>
          </div>
          <span class="endgame-card-val">${c.currentValue}</span>
        </div>`
      )
      .join("");
  });
}

// ── Kapitel vorwärts ──────────────────────────────────────────────────────────

function handleAdvance() {
  if (!canAdvance(state)) return;
  let newState = tryAdvanceStage(state);
  setState(newState);
  if (state.currentStage === "stage_06_endgame" || newState.currentStage === "stage_06_endgame") {
    showEndgame();
  } else {
    showHome();
  }
}

// ── LOVE & Pause ──────────────────────────────────────────────────────────────

function openLoveOverlay() {
  trackEvent("love_button.used");
  const overlay = document.getElementById("love-overlay");
  overlay.hidden = false;
}

function closeLoveOverlay() {
  document.getElementById("love-overlay").hidden = true;
}

function handlePause() {
  trackEvent("pause.used");
  openLoveOverlay();
}

// ── Reset ─────────────────────────────────────────────────────────────────────

function handleReset() {
  if (
    !confirm(
      "Möchtest du wirklich alles zurücksetzen? Dein gesamter Verlauf wird gelöscht."
    )
  )
    return;
  clearEventsWithConfirm();
  try {
    localStorage.removeItem(APP_CONFIG.storageKey);
  } catch {}
  state = { ...INITIAL_STATE };
  saveState();
  showConsent();
}

// ── Embleme exportieren ───────────────────────────────────────────────────────

function renderEmblems(containerEl) {
  containerEl.innerHTML = "";
  for (const emblem of EMBLEMS) {
    const unlocked = state.unlockedEmblems.includes(emblem.id);
    const el = document.createElement("div");
    el.className = `emblem-item ${unlocked ? "emblem-item--unlocked" : "emblem-item--locked"}`;
    el.innerHTML = `
      <div class="emblem-img-placeholder" aria-label="${emblem.name}">✿</div>
      <div class="emblem-name">${emblem.name}</div>
      <div class="emblem-desc">${unlocked ? emblem.description : "Noch nicht freigeschaltet"}</div>
      ${unlocked ? `<button class="btn btn--small" data-emblem-id="${emblem.id}">Exportieren</button>` : ""}
    `;
    if (unlocked) {
      el.querySelector("button").addEventListener("click", () => exportEmblem(emblem.id));
    }
    containerEl.appendChild(el);
  }
}

function exportEmblem(emblemId) {
  const emblem = EMBLEMS.find((e) => e.id === emblemId);
  if (!emblem) return;
  // Canvas-Export des Emblem-Platzhalters
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#1a1a2e";
  ctx.fillRect(0, 0, 512, 512);
  ctx.fillStyle = "#d4a96a";
  ctx.font = "bold 120px serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("✿", 256, 220);
  ctx.font = "bold 32px sans-serif";
  ctx.fillText(emblem.name, 256, 360);
  ctx.font = "18px sans-serif";
  ctx.fillStyle = "#aaa";
  ctx.fillText("CARDVERSE", 256, 420);

  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `emblem_${emblemId}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, "image/png");
}

// ── Init ──────────────────────────────────────────────────────────────────────

function bindEvents() {
  // Consent
  document.getElementById("btn-consent-accept")?.addEventListener("click", handleConsentAccept);

  // Bottom Nav
  document.getElementById("nav-home")?.addEventListener("click", showHome);
  document.getElementById("nav-cards")?.addEventListener("click", showCards);
  document.getElementById("nav-map")?.addEventListener("click", showMap);
  document.getElementById("nav-stats")?.addEventListener("click", showStats);

  // Home
  document.getElementById("btn-advance")?.addEventListener("click", handleAdvance);

  // LOVE + Pause
  document.getElementById("love-button")?.addEventListener("click", openLoveOverlay);
  document.getElementById("btn-love-close")?.addEventListener("click", closeLoveOverlay);
  document.getElementById("btn-pause")?.addEventListener("click", handlePause);

  // Node screen
  document.getElementById("node-back-btn")?.addEventListener("click", showHome);

  // Video overlay close
  document.getElementById("btn-overlay-close")?.addEventListener("click", () => {
    document.getElementById("video-overlay").hidden = true;
    document.getElementById("overlay-iframe").src = "";
  });
}

function init() {
  bindEvents();

  // Love overlay text
  const loveText = document.getElementById("love-overlay-text");
  if (loveText) loveText.textContent = TEXTS.loveOverlay;

  if (!state.consentGiven) {
    showConsent();
  } else {
    trackEvent("app.started");
    showHome();
  }
}

document.addEventListener("DOMContentLoaded", init);
