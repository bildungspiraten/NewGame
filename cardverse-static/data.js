// CARDVERSE – Datenmodell

export const APP_CONFIG = {
  version: 1,
  appName: "CARDVERSE Beziehungshybrid",
  storageKey: "cardverse_state",
  eventlogKey: "cardverse_eventlog",
  // Externe Video-Links konfigurieren: Google Drive Format = https://drive.google.com/file/d/FILE_ID/preview
  videoLinks: {
    video_prolog: "",
    video_stage_02: "",
    video_stage_03: "",
    video_stage_04: "",
    video_stage_05: "",
    video_endgame: "",
  },
};

export const CARDS = [
  {
    id: "card_memory",
    name: "Erinnerung",
    baseValue: 1,
    maxValue: 10,
    accentColor: "#C8956C",
    frame: "assets/cards/card_frame_memory.png",
    description: "Alles, was war, gehört zu dir.",
    valueSources: ["video.completed", "node.reflected", "memory.sorted"],
  },
  {
    id: "card_trust",
    name: "Vertrauen",
    baseValue: 1,
    maxValue: 10,
    accentColor: "#6C9EB4",
    frame: "assets/cards/card_frame_trust.png",
    description: "Vertrauen wächst in kleinen Schritten.",
    valueSources: ["video.completed", "barometer.submitted"],
  },
  {
    id: "card_courage",
    name: "Mut",
    baseValue: 1,
    maxValue: 10,
    accentColor: "#C86C6C",
    frame: "assets/cards/card_frame_courage.png",
    description: "Mut bedeutet: trotzdem weitergehen.",
    valueSources: ["decision.selected", "minigame.completed", "emblem.unlocked"],
  },
  {
    id: "card_closeness",
    name: "Nähe",
    baseValue: 1,
    maxValue: 10,
    accentColor: "#8CB46C",
    frame: "assets/cards/card_frame_closeness.png",
    description: "Nähe braucht Sicherheit.",
    valueSources: ["barometer.submitted", "node.reflected", "video.completed"],
  },
  {
    id: "card_newbeginning",
    name: "Neubeginn",
    baseValue: 1,
    maxValue: 10,
    accentColor: "#A06CC8",
    frame: "assets/cards/card_frame_new_beginning.png",
    description: "Ein Neubeginn ist kein Vergessen.",
    valueSources: ["decision.selected", "emblem.unlocked", "minigame.completed"],
  },
];

export const STAGES = [
  {
    id: "stage_01_prolog",
    title: "Prolog",
    subtitle: "Wo alles beginnt",
    opponentCard: "Der Zweifel",
    background: "assets/backgrounds/bg_start.webp",
    videoId: "video_prolog",
    intro:
      "Jede Geschichte hat einen Anfang. Dieser hier beginnt mit einer Frage: Was bleibt, wenn alles gesagt wurde?",
    requiredNodes: ["node_start", "node_video_prolog", "node_decision_01"],
    rewardEmblem: "emblem_first_step",
    cardModifiers: { card_courage: 1 },
  },
  {
    id: "stage_02_memory",
    title: "Erinnerung",
    subtitle: "Was war, bleibt",
    opponentCard: "Die Vergangenheit",
    background: "assets/backgrounds/bg_cards.webp",
    videoId: "video_stage_02",
    intro: "Erinnerungen sind keine Urteile. Sie sind Spuren.",
    requiredNodes: [
      "node_video_02",
      "node_barometer_01",
      "node_decision_02",
      "node_minigame_memory",
    ],
    rewardEmblem: "emblem_memory",
    cardModifiers: { card_memory: 2, card_closeness: 1 },
  },
  {
    id: "stage_03_silence",
    title: "Stille",
    subtitle: "Was nicht gesagt wird",
    opponentCard: "Das Schweigen",
    background: "assets/backgrounds/bg_cards.webp",
    videoId: "video_stage_03",
    intro:
      "Manchmal sagt Stille mehr als tausend Worte. Und manchmal ist sie einfach Stille.",
    requiredNodes: ["node_video_03", "node_barometer_02", "node_reflection_01"],
    rewardEmblem: "emblem_silence",
    cardModifiers: { card_trust: 2, card_memory: 1 },
  },
  {
    id: "stage_04_conflict",
    title: "Konflikt",
    subtitle: "Was zählt",
    opponentCard: "Der Bruch",
    background: "assets/backgrounds/bg_cards.webp",
    videoId: "video_stage_04",
    intro:
      "Konflikte entstehen, weil etwas wichtig ist. Das ist keine Schwäche.",
    requiredNodes: ["node_video_04", "node_decision_03", "node_barometer_03"],
    rewardEmblem: "emblem_conflict",
    cardModifiers: { card_courage: 2, card_trust: 1 },
  },
  {
    id: "stage_05_trust",
    title: "Vertrauen",
    subtitle: "Eine Entscheidung",
    opponentCard: "Die Vorsicht",
    background: "assets/backgrounds/bg_cards.webp",
    videoId: "video_stage_05",
    intro: "Vertrauen ist keine Garantie. Es ist eine Entscheidung.",
    requiredNodes: [
      "node_video_05",
      "node_barometer_04",
      "node_minigame_emblem",
    ],
    rewardEmblem: "emblem_trust",
    cardModifiers: { card_trust: 3, card_closeness: 2 },
  },
  {
    id: "stage_06_endgame",
    title: "Endgame",
    subtitle: "Das offene Ende",
    opponentCard: "Das offene Ende",
    background: "assets/backgrounds/bg_endgame.webp",
    videoId: "video_endgame",
    intro:
      "Es gibt kein richtiges Ende. Nur das, was du daraus machst.",
    requiredNodes: ["node_video_endgame", "node_reflection_final"],
    rewardEmblem: "emblem_journey",
    cardModifiers: { card_newbeginning: 3 },
  },
];

// x, y in % relativ zur Map (0 = unten, 100 = oben)
export const MAP_NODES = [
  { id: "node_start", type: "start", label: "Beginn", stageId: "stage_01_prolog", x: 50, y: 92 },
  { id: "node_video_prolog", type: "video", label: "Prolog-Video", stageId: "stage_01_prolog", videoId: "video_prolog", x: 50, y: 84 },
  { id: "node_decision_01", type: "decision", label: "Erste Entscheidung", stageId: "stage_01_prolog", decisionId: "decision_01", x: 50, y: 76 },
  { id: "node_video_02", type: "video", label: "Erinnerung-Video", stageId: "stage_02_memory", videoId: "video_stage_02", x: 50, y: 68 },
  { id: "node_barometer_01", type: "barometer", label: "Nähe messen", stageId: "stage_02_memory", barometerId: "barometer_closeness", x: 30, y: 61 },
  { id: "node_decision_02", type: "decision", label: "Vergangenheit", stageId: "stage_02_memory", decisionId: "decision_02", x: 70, y: 61 },
  { id: "node_minigame_memory", type: "minigame", label: "Erinnerung sortieren", stageId: "stage_02_memory", minigameId: "minigame_memory_sort", x: 50, y: 53 },
  { id: "node_video_03", type: "video", label: "Stille-Video", stageId: "stage_03_silence", videoId: "video_stage_03", x: 50, y: 46 },
  { id: "node_barometer_02", type: "barometer", label: "Gesprächsbereitschaft", stageId: "stage_03_silence", barometerId: "barometer_communication", x: 50, y: 39 },
  { id: "node_reflection_01", type: "reflection", label: "Reflexion: Stille", stageId: "stage_03_silence", minigameId: "minigame_path_reflect", x: 50, y: 32 },
  { id: "node_video_04", type: "video", label: "Konflikt-Video", stageId: "stage_04_conflict", videoId: "video_stage_04", x: 50, y: 25 },
  { id: "node_decision_03", type: "decision", label: "Nach dem Konflikt", stageId: "stage_04_conflict", decisionId: "decision_03", x: 30, y: 19 },
  { id: "node_barometer_03", type: "barometer", label: "Belastung messen", stageId: "stage_04_conflict", barometerId: "barometer_stress", x: 70, y: 19 },
  { id: "node_video_05", type: "video", label: "Vertrauen-Video", stageId: "stage_05_trust", videoId: "video_stage_05", x: 50, y: 13 },
  { id: "node_barometer_04", type: "barometer", label: "Vertrauen messen", stageId: "stage_05_trust", barometerId: "barometer_trust", x: 30, y: 7 },
  { id: "node_minigame_emblem", type: "minigame", label: "Emblem zusammensetzen", stageId: "stage_05_trust", minigameId: "minigame_emblem_assemble", x: 70, y: 7 },
  { id: "node_video_endgame", type: "video", label: "Endgame-Video", stageId: "stage_06_endgame", videoId: "video_endgame", x: 50, y: 3 },
  { id: "node_reflection_final", type: "reflection", label: "Abschluss-Reflexion", stageId: "stage_06_endgame", minigameId: "minigame_path_reflect", x: 50, y: 1 },
];

export const BAROMETERS = [
  {
    id: "barometer_closeness",
    name: "Nähe – Distanz",
    description: "Wie nah oder fern fühlt ihr euch gerade?",
    minLabel: "Sehr weit",
    maxLabel: "Sehr nah",
  },
  {
    id: "barometer_communication",
    name: "Gesprächsbereitschaft",
    description: "Wie offen bist du gerade für ein Gespräch?",
    minLabel: "Möchte Stille",
    maxLabel: "Bereit zu reden",
  },
  {
    id: "barometer_stress",
    name: "Belastung",
    description: "Wie belastet fühlst du dich gerade?",
    minLabel: "Kaum belastet",
    maxLabel: "Sehr belastet",
  },
  {
    id: "barometer_trust",
    name: "Vertrauen",
    description: "Wie stark vertraust du gerade?",
    minLabel: "Unsicher",
    maxLabel: "Sicher",
  },
];

export const DECISIONS = [
  {
    id: "decision_01",
    question: "Was trägt diesen Moment?",
    options: [
      { id: "d01_a", text: "Neugier", cardEffect: { card_courage: 1 } },
      { id: "d01_b", text: "Hoffnung", cardEffect: { card_newbeginning: 1 } },
      { id: "d01_c", text: "Erinnerung", cardEffect: { card_memory: 1 } },
    ],
  },
  {
    id: "decision_02",
    question: "Wie gehst du mit dem Vergangenen um?",
    options: [
      { id: "d02_a", text: "Ich trage es mit mir", cardEffect: { card_memory: 2 } },
      { id: "d02_b", text: "Ich lerne daraus", cardEffect: { card_courage: 1, card_trust: 1 } },
      { id: "d02_c", text: "Ich brauche Abstand", cardEffect: { card_closeness: 1 } },
    ],
  },
  {
    id: "decision_03",
    question: "Was brauchst du nach einem Konflikt?",
    options: [
      { id: "d03_a", text: "Zeit für mich", cardEffect: { card_closeness: 1 } },
      { id: "d03_b", text: "Ein klärendes Gespräch", cardEffect: { card_trust: 2 } },
      { id: "d03_c", text: "Eine kleine Geste", cardEffect: { card_newbeginning: 2 } },
    ],
  },
];

export const VIDEOS = [
  { id: "video_prolog", title: "Prolog" },
  { id: "video_stage_02", title: "Erinnerung" },
  { id: "video_stage_03", title: "Stille" },
  { id: "video_stage_04", title: "Konflikt" },
  { id: "video_stage_05", title: "Vertrauen" },
  { id: "video_endgame", title: "Das offene Ende" },
];

export const EMBLEMS = [
  { id: "emblem_first_step", name: "Erster Schritt", description: "Du hast den Anfang gewagt.", stageId: "stage_01_prolog" },
  { id: "emblem_memory", name: "Erinnerungshüter", description: "Du hast dich deiner Vergangenheit gestellt.", stageId: "stage_02_memory" },
  { id: "emblem_silence", name: "Stille kennen", description: "Du hast die Stille als Raum erkannt.", stageId: "stage_03_silence" },
  { id: "emblem_conflict", name: "Brücke bauen", description: "Du hast einen Konflikt nicht gemieden.", stageId: "stage_04_conflict" },
  { id: "emblem_trust", name: "Vertrauen wählen", description: "Du hast Vertrauen als Entscheidung erlebt.", stageId: "stage_05_trust" },
  { id: "emblem_journey", name: "Wegbegleiter", description: "Du hast den ganzen Weg mitgemacht.", stageId: "stage_06_endgame" },
];

export const MINIGAMES = [
  {
    id: "minigame_memory_sort",
    type: "sort",
    title: "Erinnerung sortieren",
    description:
      "Bringe diese Momente in eine Reihenfolge, die sich für dich stimmig anfühlt.",
    completionEvent: "memory.sorted",
    cardEffect: { card_memory: 1 },
    items: [
      "Ein Schweigen, das okay war",
      "Ein Lachen, das überraschte",
      "Eine Frage, die blieb",
      "Ein Moment der Nähe",
      "Etwas, das veränderte",
    ],
  },
  {
    id: "minigame_emblem_assemble",
    type: "assemble",
    title: "Emblem zusammensetzen",
    description: "Tippe die vier Teile in der richtigen Reihenfolge an.",
    completionEvent: "emblem.assembled",
    cardEffect: { card_courage: 1 },
    pieces: ["Anfang", "Weg", "Entscheidung", "Weitergehen"],
  },
  {
    id: "minigame_path_reflect",
    type: "reflect",
    title: "Pfad reflektieren",
    description:
      "Schreibe auf, was dir auf diesem Weg begegnet ist. Es muss nichts Großes sein.",
    completionEvent: "node.reflected",
    cardEffect: { card_closeness: 1 },
  },
];

export const TEXTS = {
  consent:
    "Diese App speichert deinen Verlauf lokal auf diesem Gerät: angesehene Kapitel, Videoabschluss, Entscheidungen, Barometer, Embleme und Statistiken. Es wird nichts automatisch übertragen. Du kannst den Verlauf exportieren oder löschen.",
  loveOverlay:
    "Ich bin da.\nKein Kampf.\nKein Druck.\nDu kannst jederzeit pausieren.",
  noVideo:
    "Für dieses Kapitel ist noch kein Video hinterlegt. Trage den Link in data.js unter APP_CONFIG.videoLinks ein.",
  decisionLocked:
    "Diese Entscheidung wurde bereits getroffen und kann nicht geändert werden. Du kannst sie jederzeit erneut ansehen.",
  endgameTitle: "Dein Weg",
  endgameSubtitle: "Das ist es, was du mitgenommen hast.",
};

export const INITIAL_STATE = {
  version: 1,
  currentStage: "stage_01_prolog",
  consentGiven: false,
  unlockedNodes: ["node_start"],
  completedNodes: [],
  lockedDecisions: {},
  barometers: [],
  cardValues: {
    card_memory: 1,
    card_trust: 1,
    card_courage: 1,
    card_closeness: 1,
    card_newbeginning: 1,
  },
  unlockedEmblems: [],
  finalValuesLocked: false,
};
