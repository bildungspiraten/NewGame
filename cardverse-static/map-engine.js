// CARDVERSE – Map Engine

import { MAP_NODES, STAGES } from "./data.js";

const NODE_ICONS = {
  start: "★",
  video: "▶",
  decision: "◆",
  barometer: "⬤",
  minigame: "✦",
  reflection: "✎",
  emblem: "✿",
  locked: "🔒",
};

// Gibt zurück ob ein Knoten freigeschaltet ist
function isUnlocked(state, nodeId) {
  return state.unlockedNodes.includes(nodeId);
}

// Gibt zurück ob ein Knoten abgeschlossen ist
function isCompleted(state, nodeId) {
  return state.completedNodes.includes(nodeId);
}

// Schaltet einen Knoten frei (fügt ihn zu unlockedNodes hinzu)
export function unlockNode(state, nodeId) {
  if (isUnlocked(state, nodeId)) return state;
  return {
    ...state,
    unlockedNodes: [...state.unlockedNodes, nodeId],
  };
}

// Markiert einen Knoten als abgeschlossen
export function markNodeCompleted(state, nodeId) {
  if (isCompleted(state, nodeId)) return state;
  return {
    ...state,
    completedNodes: [...state.completedNodes, nodeId],
  };
}

// Gibt die aktuelle Stage zurück
export function getCurrentStage(state) {
  return STAGES.find((s) => s.id === state.currentStage) ?? STAGES[0];
}

// Bestimmt den Fortschrittsindex (0–5)
export function getCurrentPath(state) {
  const idx = STAGES.findIndex((s) => s.id === state.currentStage);
  return idx === -1 ? 0 : idx;
}

// Schaltet die nächste Stage frei, falls alle requiredNodes der aktuellen abgeschlossen sind
export function tryAdvanceStage(state) {
  const stage = getCurrentStage(state);
  const allDone = stage.requiredNodes.every((nid) => isCompleted(state, nid));
  if (!allDone) return state;
  const currentIdx = STAGES.findIndex((s) => s.id === stage.id);
  const nextStage = STAGES[currentIdx + 1];
  if (!nextStage) return state; // letztes Kapitel
  // Alle Knoten der nächsten Stage freischalten
  let newState = { ...state, currentStage: nextStage.id };
  for (const nodeId of nextStage.requiredNodes) {
    newState = unlockNode(newState, nodeId);
  }
  return newState;
}

// Rendert die vertikale Map in containerEl
export function renderMap(state, containerEl, onNodeClick) {
  containerEl.innerHTML = "";

  const mapEl = document.createElement("div");
  mapEl.className = "map-canvas";

  // Verbindungslinien zwischen Knoten (SVG)
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "map-lines");
  svg.setAttribute("viewBox", "0 0 100 100");
  svg.setAttribute("preserveAspectRatio", "none");

  // Einfache Verbindung: chronologisch aufeinander folgende Knoten
  for (let i = 1; i < MAP_NODES.length; i++) {
    const prev = MAP_NODES[i - 1];
    const curr = MAP_NODES[i];
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", prev.x);
    line.setAttribute("y1", 100 - prev.y);
    line.setAttribute("x2", curr.x);
    line.setAttribute("y2", 100 - curr.y);

    const prevDone = isCompleted(state, prev.id);
    line.setAttribute("class", prevDone ? "map-line map-line--done" : "map-line");
    svg.appendChild(line);
  }
  mapEl.appendChild(svg);

  // Knoten rendern
  for (const node of MAP_NODES) {
    const unlocked = isUnlocked(state, node.id);
    const completed = isCompleted(state, node.id);

    const btn = document.createElement("button");
    btn.className = [
      "map-node",
      `map-node--${node.type}`,
      unlocked ? "map-node--unlocked" : "map-node--locked",
      completed ? "map-node--completed" : "",
    ]
      .filter(Boolean)
      .join(" ");

    btn.style.left = `${node.x}%`;
    // y=0 ist oben im DOM; Map-Koordinaten y=0 = unten → invertieren
    btn.style.top = `${100 - node.y}%`;
    btn.setAttribute("aria-label", node.label);
    btn.disabled = !unlocked;

    const icon = completed
      ? "✓"
      : unlocked
      ? NODE_ICONS[node.type] ?? "●"
      : NODE_ICONS.locked;

    btn.innerHTML = `
      <span class="map-node-icon">${icon}</span>
      <span class="map-node-label">${node.label}</span>
    `;

    if (unlocked) {
      btn.addEventListener("click", () => onNodeClick(node));
    }
    mapEl.appendChild(btn);
  }

  containerEl.appendChild(mapEl);
}

// Gibt zurück ob der Spieler zum nächsten Kapitel kann
export function canAdvance(state) {
  const stage = getCurrentStage(state);
  return stage.requiredNodes.every((nid) => isCompleted(state, nid));
}
