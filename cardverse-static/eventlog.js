// CARDVERSE – Event Log

import { APP_CONFIG } from "./data.js";

function readLog() {
  try {
    const raw = localStorage.getItem(APP_CONFIG.eventlogKey);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeLog(log) {
  try {
    localStorage.setItem(APP_CONFIG.eventlogKey, JSON.stringify(log));
  } catch (e) {
    console.warn("EventLog: localStorage nicht verfügbar", e);
  }
}

export function trackEvent(type, payload = {}) {
  const log = readLog();
  log.push({ type, payload, timestamp: Date.now() });
  writeLog(log);
}

export function getEvents(filterType) {
  const log = readLog();
  return filterType ? log.filter((e) => e.type === filterType) : log;
}

export function clearEventsWithConfirm() {
  if (
    !confirm(
      "Möchtest du wirklich den gesamten Verlauf löschen? Diese Aktion kann nicht rückgängig gemacht werden."
    )
  ) {
    return false;
  }
  try {
    localStorage.removeItem(APP_CONFIG.eventlogKey);
    return true;
  } catch {
    return false;
  }
}

export function exportEvents() {
  const log = readLog();
  const blob = new Blob([JSON.stringify(log, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `cardverse_eventlog_${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Rekonstruiert Kerndaten aus dem Eventlog (für Debugging / Migration)
export function rebuildStateFromEvents() {
  const log = readLog();
  const result = {
    completedVideos: new Set(),
    madeDecisions: {},
    submittedBarometers: [],
    completedMinigames: new Set(),
    unlockedEmblems: new Set(),
    pauseCount: 0,
  };
  for (const event of log) {
    switch (event.type) {
      case "video.completed":
        result.completedVideos.add(event.payload.videoId);
        break;
      case "decision.selected":
        result.madeDecisions[event.payload.decisionId] = event.payload.optionId;
        break;
      case "barometer.submitted":
        result.submittedBarometers.push(event.payload);
        break;
      case "minigame.completed":
        result.completedMinigames.add(event.payload.minigameId);
        break;
      case "emblem.unlocked":
        result.unlockedEmblems.add(event.payload.emblemId);
        break;
      case "pause.used":
        result.pauseCount++;
        break;
    }
  }
  return result;
}
