// CARDVERSE – Statistiken

import { getEvents } from "./eventlog.js";
import { CARDS, STAGES, EMBLEMS } from "./data.js";

export function calculateProgress(state) {
  const total = state.unlockedNodes.length + state.completedNodes.length;
  // Annäherungsweise: max = alle Knoten * 2 (freigeschaltet + abgeschlossen)
  const maxNodes = 18; // MAP_NODES.length
  const percent = Math.min(100, Math.round((state.completedNodes.length / maxNodes) * 100));
  return { completed: state.completedNodes.length, total: maxNodes, percent };
}

export function calculateCompletedVideos() {
  const events = getEvents("video.completed");
  const unique = new Set(events.map((e) => e.payload?.videoId).filter(Boolean));
  return { count: unique.size, videoIds: [...unique] };
}

export function calculateDecisionTimes() {
  const opened = getEvents("decision.opened");
  const locked = getEvents("decision.locked");
  const times = [];
  for (const lock of locked) {
    const open = opened
      .filter(
        (o) =>
          o.payload?.decisionId === lock.payload?.decisionId &&
          o.timestamp <= lock.timestamp
      )
      .sort((a, b) => b.timestamp - a.timestamp)[0];
    if (open) {
      times.push({
        decisionId: lock.payload.decisionId,
        seconds: Math.round((lock.timestamp - open.timestamp) / 1000),
      });
    }
  }
  const avg =
    times.length > 0
      ? Math.round(times.reduce((s, t) => s + t.seconds, 0) / times.length)
      : 0;
  return { times, averageSeconds: avg };
}

export function calculateBarometerHistory(state) {
  return state.barometers.map((b) => ({
    barometerId: b.barometerId,
    value: b.value,
    timestamp: b.timestamp,
  }));
}

export function calculateUnlockedEmblems(state) {
  return EMBLEMS.filter((e) => state.unlockedEmblems.includes(e.id));
}

export function calculateCardValues(state) {
  return CARDS.map((card) => ({
    ...card,
    currentValue: state.cardValues[card.id] ?? 1,
  }));
}

export function renderStatsScreen(state, containerEl) {
  const progress = calculateProgress(state);
  const videos = calculateCompletedVideos();
  const decisions = calculateDecisionTimes();
  const emblems = calculateUnlockedEmblems(state);
  const cards = calculateCardValues(state);
  const pauseCount = getEvents("pause.used").length;
  const loveCount = getEvents("love_button.used").length;

  containerEl.innerHTML = `
    <div class="stats-screen">
      <h2 class="stats-heading">Dein Verlauf</h2>

      <div class="stats-block">
        <h3>Fortschritt</h3>
        <div class="stats-progress-bar">
          <div class="stats-progress-fill" style="width:${progress.percent}%"></div>
        </div>
        <p>${progress.completed} von ${progress.total} Stationen abgeschlossen (${progress.percent}%)</p>
      </div>

      <div class="stats-block">
        <h3>Videos</h3>
        <p>${videos.count} von 6 Videos angesehen</p>
      </div>

      <div class="stats-block">
        <h3>Karten</h3>
        <div class="stats-cards">
          ${cards
            .map(
              (c) => `
            <div class="stats-card-row">
              <span class="stats-card-name">${c.name}</span>
              <div class="stats-card-bar">
                <div class="stats-card-fill" style="width:${(c.currentValue / c.maxValue) * 100}%; background:${c.accentColor}"></div>
              </div>
              <span class="stats-card-val">${c.currentValue}</span>
            </div>`
            )
            .join("")}
        </div>
      </div>

      <div class="stats-block">
        <h3>Entscheidungen</h3>
        <p>${Object.keys(state.lockedDecisions).length} Entscheidung(en) getroffen</p>
        ${
          decisions.averageSeconds > 0
            ? `<p>Ø Bedenkzeit: ${decisions.averageSeconds} Sekunden</p>`
            : ""
        }
      </div>

      <div class="stats-block">
        <h3>Barometer</h3>
        <p>${state.barometers.length} Barometer-Messung(en) gespeichert</p>
      </div>

      <div class="stats-block">
        <h3>Embleme</h3>
        <p>${emblems.length} von ${EMBLEMS.length} Emblemen freigeschaltet</p>
      </div>

      <div class="stats-block">
        <h3>Pausen & Fürsorge</h3>
        <p>Pause genutzt: ${pauseCount}×</p>
        <p>LOVE-Button: ${loveCount}×</p>
      </div>

      <div class="stats-actions">
        <button class="btn btn--secondary" id="btn-export-stats">Verlauf exportieren (JSON)</button>
        <button class="btn btn--danger" id="btn-reset-all">App zurücksetzen</button>
      </div>
    </div>
  `;
}

export function exportStatsJSON(state) {
  const data = {
    exportedAt: new Date().toISOString(),
    progress: calculateProgress(state),
    cardValues: calculateCardValues(state),
    barometers: calculateBarometerHistory(state),
    unlockedEmblems: calculateUnlockedEmblems(state),
    decisions: state.lockedDecisions,
    eventlog: getEvents(),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `cardverse_stats_${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
