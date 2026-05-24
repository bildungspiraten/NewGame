// BEZIEHUNGSHYBRID — Spieldaten
// Passe Platzhalter [NAME_1], [NAME_2], [ORT], [DATUM] an eure Geschichte an.

const GAME_DATA = {

  // ─── Einstellungen ──────────────────────────────────────────────────────────
  config: {
    spieler1_name: "[Name 1]",
    spieler2_name: "[Name 2]",
    beginn_datum: "[Datum eures Kennenlernens]",
    erster_ort: "[Euer erster gemeinsamer Ort]",
    lieblingsfilm: "[Euer Lieblingsfilm zusammen]",
    lieblingsort: "[Euer Lieblingsort]"
  },

  // ─── Hybridamen ─────────────────────────────────────────────────────────────
  hybridamen: [
    {
      id: "luna",
      name: "Luna",
      etage: "Prolog",
      rolle: "Einführungsguide",
      emoji: "🌙",
      beispielsatz: "Willkommen in eurer Reise. Ich führe euch durch die ersten Schritte.",
      stimme: "sanft, mysteriös",
      farbe: "#6e48aa",
      hintergrund: "linear-gradient(135deg, #2c1654, #6e48aa)"
    },
    {
      id: "mira",
      name: "Mira",
      etage: "Erinnerungen",
      rolle: "Gedächtniswächterin",
      emoji: "📜",
      beispielsatz: "Erinnert ihr euch noch an den Moment, als ihr euch zum ersten Mal in die Augen gesehen habt?",
      stimme: "warm, nostalgisch",
      farbe: "#e67e22",
      hintergrund: "linear-gradient(135deg, #8b4513, #e67e22)"
    },
    {
      id: "nova",
      name: "Nova",
      etage: "Zukunft",
      rolle: "Traumweberin",
      emoji: "✨",
      beispielsatz: "Die Zukunft gehört denen, die von ihr träumen. Was träumt ihr gemeinsam?",
      stimme: "enthusiastisch, hell",
      farbe: "#27ae60",
      hintergrund: "linear-gradient(135deg, #1a5c38, #27ae60)"
    },
    {
      id: "aion",
      name: "Aion",
      etage: "Konflikte",
      rolle: "Brückenbauerin",
      emoji: "⚡",
      beispielsatz: "Konflikte sind keine Mauern. Sie sind Türen, die darauf warten, geöffnet zu werden.",
      stimme: "ruhig, direkt",
      farbe: "#c0392b",
      hintergrund: "linear-gradient(135deg, #6b0d0d, #c0392b)"
    },
    {
      id: "vera",
      name: "Vera",
      etage: "Vertrauen",
      rolle: "Hüterin des Vertrauens",
      emoji: "🛡️",
      beispielsatz: "Vertrauen ist kein Ort, an den man ankommt. Es ist ein Weg, den man täglich geht.",
      stimme: "fest, wärmend",
      farbe: "#2980b9",
      hintergrund: "linear-gradient(135deg, #0d3b5e, #2980b9)"
    },
    {
      id: "sonja",
      name: "Sonja",
      etage: "Träume",
      rolle: "Träumeschreiberin",
      emoji: "🌌",
      beispielsatz: "Erzählt mir von eurem schönsten gemeinsamen Traum. Ich werde ihn aufbewahren.",
      stimme: "verträumt, leise",
      farbe: "#8e44ad",
      hintergrund: "linear-gradient(135deg, #3d1a5c, #8e44ad)"
    },
    {
      id: "kai",
      name: "Kai",
      etage: "Kommunikation",
      rolle: "Brücke der Worte",
      emoji: "💬",
      beispielsatz: "Reden ist gut. Zuhören ist besser. Verstehen ist Liebe.",
      stimme: "klar, einladend",
      farbe: "#16a085",
      hintergrund: "linear-gradient(135deg, #0a3d30, #16a085)"
    }
  ],

  // ─── Etagen ─────────────────────────────────────────────────────────────────
  etagen: [
    {
      id: "prolog",
      name: "Prolog",
      hybridame_id: "luna",
      video: "videos/prolog.mp4",
      video_poster: "images/prolog-poster.jpg",
      einleitungstext: "Willkommen auf eurer gemeinsamen Reise. Bevor es losgeht, schaut euch gemeinsam dieses Video an.",
      fragen: [
        {
          id: "prolog-q1",
          text: "Was ist eurer Meinung nach das Fundament einer guten Beziehung?",
          typ: "multiple_choice",
          optionen: ["Vertrauen", "Humor", "Kommunikation", "Gemeinsame Träume"],
          richtige_antwort: null,
          feedback_richtig: "Gut beobachtet! Das ist eure Basis.",
          feedback_falsch: null
        },
        {
          id: "prolog-q2",
          text: "Wie fühlst du dich gerade — auf einer Skala von 'nervös' bis 'neugierig'?",
          typ: "regler",
          min: 1, max: 10,
          min_label: "😰 nervös",
          max_label: "🤩 neugierig",
          richtige_antwort: null,
          feedback_richtig: "Danke für deine Ehrlichkeit. Merken wir uns das."
        }
      ],
      zufallsevents: [
        {
          id: "pe1",
          text: "💫 Luna flüstert: 'Schaut euch an. So habt ihr angefangen. Mit einem ersten Blick.'",
          auswirkung: "harmonie+5"
        }
      ]
    },

    {
      id: "erinnerungen",
      name: "Kapitel 1 — Erinnerungen",
      hybridame_id: "mira",
      video: "videos/erinnerungen.mp4",
      video_poster: "images/erinnerungen-poster.jpg",
      einleitungstext: "Mira nimmt euch mit auf eine Reise in die Vergangenheit. Schaut das Video gemeinsam an.",
      fragen: [
        {
          id: "erinnerungen-q1",
          text: "Wo habt ihr euch zum ersten Mal getroffen?",
          typ: "freitext",
          richtige_antwort: null,
          feedback_richtig: "Schöne Erinnerung! Ihr wisst es noch genau.",
          placeholder: "Beschreibe den Ort..."
        },
        {
          id: "erinnerungen-q2",
          text: "Wie klar erinnerst du dich an euer erstes Date?",
          typ: "regler",
          min: 1, max: 10,
          min_label: "💭 verschwommen",
          max_label: "🔮 kristallklar",
          richtige_antwort: null,
          feedback_richtig: "Interessant! Habt ihr dasselbe Gefühl?"
        },
        {
          id: "erinnerungen-q3",
          text: "Was war das erste Geschenk, das du [NAME_PARTNER] gemacht hast?",
          typ: "multiple_choice",
          optionen: ["Ein Buch", "Blumen", "Selbstgemachtes", "Ein Erlebnis"],
          richtige_antwort: null,
          feedback_richtig: "Stimmt das überein?"
        },
        {
          id: "erinnerungen-q4",
          text: "Wärst du ausgegangen, wenn [NAME_PARTNER] 1 Stunde zu spät gekommen wäre?",
          typ: "ja_nein",
          richtige_antwort: null,
          feedback_richtig: "Ehrliche Antwort! Vergleicht sie."
        },
        {
          id: "erinnerungen-q5",
          text: "Was hat dich beim ersten Treffen am meisten überrascht?",
          typ: "freitext",
          richtige_antwort: null,
          feedback_richtig: "Schön! Erzählt euch davon.",
          placeholder: "Was hast du nicht erwartet?"
        }
      ],
      zufallsevents: [
        {
          id: "ee1",
          text: "📸 Ein altes Erinnerungsfoto taucht auf! Beschreibt gemeinsam, was ihr darin seht.",
          auswirkung: "harmonie+10"
        },
        {
          id: "ee2",
          text: "🎵 Mira fragt: 'Welches Lied würde eure erste gemeinsame Zeit beschreiben?'",
          auswirkung: "harmonie+5"
        }
      ]
    },

    {
      id: "zukunft",
      name: "Kapitel 2 — Zukunft",
      hybridame_id: "nova",
      video: "videos/zukunft.mp4",
      video_poster: "images/zukunft-poster.jpg",
      einleitungstext: "Nova öffnet das Fenster in eure gemeinsame Zukunft. Schaut euch an, bevor das Video beginnt.",
      fragen: [
        {
          id: "zukunft-q1",
          text: "Wo seht ihr euch in 5 Jahren gemeinsam?",
          typ: "multiple_choice",
          optionen: ["In einer neuen Stadt", "Im Traumhaus", "Auf Reisen", "Genau hier, aber tiefer"],
          richtige_antwort: null,
          feedback_richtig: "Habt ihr dasselbe geantwortet? Redet darüber!"
        },
        {
          id: "zukunft-q2",
          text: "Wie wichtig sind gemeinsame Träume für eure Beziehung?",
          typ: "regler",
          min: 1, max: 10,
          min_label: "🌱 nicht so sehr",
          max_label: "🚀 absolut zentral",
          richtige_antwort: null,
          feedback_richtig: "Merkt euch eure Werte."
        },
        {
          id: "zukunft-q3",
          text: "Wenn ihr einen Ort der Welt bereisen könntet — nur einer — welcher wäre das?",
          typ: "freitext",
          richtige_antwort: null,
          feedback_richtig: "Tragt das in euer Traumtagebuch ein!",
          placeholder: "Ein Ort, ein Traum..."
        },
        {
          id: "zukunft-q4",
          text: "Habt ihr dasselbe Reiseziel genannt?",
          typ: "ja_nein",
          richtige_antwort: null,
          feedback_richtig: "Schöner Moment — ob Ja oder Nein!"
        },
        {
          id: "zukunft-q5",
          text: "Was ist euer gemeinsamer Wunsch für dieses Jahr?",
          typ: "freitext",
          richtige_antwort: null,
          feedback_richtig: "Speichert diesen Wunsch als Erinnerung.",
          placeholder: "Ein Wunsch, gemeinsam formuliert..."
        }
      ],
      zufallsevents: [
        {
          id: "ze1",
          text: "⭐ Nova zeigt euch eine leere Seite: 'Schreibt gemeinsam drei Sätze über eure Zukunft.'",
          auswirkung: "harmonie+15"
        },
        {
          id: "ze2",
          text: "🗺️ Eine Weltkarte erscheint! Zeigt gleichzeitig auf den Ort, zu dem ihr wollt.",
          auswirkung: "harmonie+10"
        }
      ]
    },

    {
      id: "konflikte",
      name: "Kapitel 3 — Konflikte",
      hybridame_id: "aion",
      video: "videos/konflikte.mp4",
      video_poster: "images/konflikte-poster.jpg",
      einleitungstext: "Aion begleitet euch durch das Schwierigste: ehrliche Fragen über Konflikte und Wachstum.",
      fragen: [
        {
          id: "konflikte-q1",
          text: "Was ist eure häufigste Art zu streiten?",
          typ: "multiple_choice",
          optionen: ["Schweigen", "Zu laut reden", "Ablenken", "Direkt ansprechen"],
          richtige_antwort: null,
          feedback_richtig: "Das ist wichtig zu wissen. Vergleicht eure Antworten."
        },
        {
          id: "konflikte-q2",
          text: "Wie lange brauchst du nach einem Streit, um wieder offen zu sein?",
          typ: "regler",
          min: 1, max: 10,
          min_label: "⚡ sofort",
          max_label: "🐢 mehrere Tage",
          richtige_antwort: null,
          feedback_richtig: "Merkt euch den Unterschied zwischen euren Werten."
        },
        {
          id: "konflikte-q3",
          text: "Gibt es etwas, das du dir nach Konflikten mehr wünschen würdest?",
          typ: "freitext",
          richtige_antwort: null,
          feedback_richtig: "Das ist ein Geschenk aneinander.",
          placeholder: "Was würdest du dir wünschen..."
        },
        {
          id: "konflikte-q4",
          text: "Habt ihr eine ungeschriebene Versöhnungs-Regel?",
          typ: "ja_nein",
          richtige_antwort: null,
          feedback_richtig: "Falls nicht — erfindet jetzt eine!"
        },
        {
          id: "konflikte-q5",
          text: "Was hat euch ein Konflikt gelehrt, den ihr nicht vergessen werdet?",
          typ: "freitext",
          richtige_antwort: null,
          feedback_richtig: "Aus Konflikten wächst man. Danke für die Ehrlichkeit.",
          placeholder: "Eine Lektion aus einem schwierigen Moment..."
        }
      ],
      zufallsevents: [
        {
          id: "ke1",
          text: "🕊️ Aion fragt: 'Nennt je eine Sache, für die ihr euch beim anderen entschuldigen wollt. Jetzt. Hier.'",
          auswirkung: "harmonie+20"
        },
        {
          id: "ke2",
          text: "💌 Ein Brief erscheint: Schreibt je einen Satz, den ihr dem anderen sagen wolltet, aber nicht konntet.",
          auswirkung: "harmonie+15"
        }
      ]
    },

    {
      id: "vertrauen",
      name: "Kapitel 4 — Vertrauen",
      hybridame_id: "vera",
      video: "videos/vertrauen.mp4",
      video_poster: "images/vertrauen-poster.jpg",
      einleitungstext: "Vera hält den sichersten Raum für euch. Hier könnt ihr ehrlich sein.",
      fragen: [
        {
          id: "vertrauen-q1",
          text: "Auf einer Skala: Wie sicher fühlst du dich in dieser Beziehung?",
          typ: "regler",
          min: 1, max: 10,
          min_label: "😟 unsicher",
          max_label: "🏠 völlig sicher",
          richtige_antwort: null,
          feedback_richtig: "Das ist ein Geschenk der Ehrlichkeit."
        },
        {
          id: "vertrauen-q2",
          text: "Was stärkt dein Vertrauen am meisten?",
          typ: "multiple_choice",
          optionen: ["Verlässlichkeit", "Offene Kommunikation", "Physische Nähe", "Gemeinsame Zeit"],
          richtige_antwort: null,
          feedback_richtig: "Merkt euch gegenseitig eure Antworten."
        },
        {
          id: "vertrauen-q3",
          text: "Gibt es etwas, das du [NAME_PARTNER] noch nie gesagt hast?",
          typ: "ja_nein",
          richtige_antwort: null,
          feedback_richtig: "Falls Ja — vielleicht ist jetzt der Moment."
        },
        {
          id: "vertrauen-q4",
          text: "Was bedeutet 'Vertrauen' für dich in einem Satz?",
          typ: "freitext",
          richtige_antwort: null,
          feedback_richtig: "Lest euch gegenseitig eure Definitionen vor.",
          placeholder: "Vertrauen bedeutet für mich..."
        },
        {
          id: "vertrauen-q5",
          text: "Hat sich dein Vertrauen in [NAME_PARTNER] über die Zeit vertieft?",
          typ: "regler",
          min: 1, max: 10,
          min_label: "📉 kaum verändert",
          max_label: "📈 sehr gewachsen",
          richtige_antwort: null,
          feedback_richtig: "Das ist die Geschichte eurer Beziehung."
        }
      ],
      zufallsevents: [
        {
          id: "ve1",
          text: "🤲 Vera bittet euch: Haltet euch an den Händen und sagt dem anderen drei Dinge, die ihr an ihm liebt.",
          auswirkung: "harmonie+25"
        },
        {
          id: "ve2",
          text: "🔐 Ein Geheimnis-Raum öffnet sich: Erzählt euch je eine Sache, die ihr noch nie geteilt habt.",
          auswirkung: "harmonie+20"
        }
      ]
    },

    {
      id: "traeume",
      name: "Kapitel 5 — Träume",
      hybridame_id: "sonja",
      video: "videos/traeume.mp4",
      video_poster: "images/traeume-poster.jpg",
      einleitungstext: "Sonja bewahrt eure tiefsten Träume. Schaut das Video im Dunkeln, wenn möglich.",
      fragen: [
        {
          id: "traeume-q1",
          text: "Was ist dein größter persönlicher Traum — für dich allein?",
          typ: "freitext",
          richtige_antwort: null,
          feedback_richtig: "Danke. Das ist kostbar.",
          placeholder: "Ein Traum, der ganz meiner ist..."
        },
        {
          id: "traeume-q2",
          text: "Unterstützt du [NAME_PARTNER] bei seinen/ihren persönlichen Träumen?",
          typ: "regler",
          min: 1, max: 10,
          min_label: "🌱 könnte mehr sein",
          max_label: "🦅 voll und ganz",
          richtige_antwort: null,
          feedback_richtig: "Redet über die Unterschiede."
        },
        {
          id: "traeume-q3",
          text: "Welchen gemeinsamen Traum habt ihr noch nicht in Angriff genommen?",
          typ: "multiple_choice",
          optionen: ["Eine große Reise", "Ein eigenes Zuhause", "Etwas zusammen gründen", "Mehr gemeinsame Zeit"],
          richtige_antwort: null,
          feedback_richtig: "Wann fangt ihr damit an?"
        },
        {
          id: "traeume-q4",
          text: "Gibt es einen Traum, den du aufgegeben hast? (Nur wenn du möchtest)",
          typ: "ja_nein",
          richtige_antwort: null,
          feedback_richtig: "Manche Träume verwandeln sich. Redet darüber, wenn ihr mögt."
        },
        {
          id: "traeume-q5",
          text: "Formuliert gemeinsam einen neuen Traum in einem Satz.",
          typ: "freitext",
          richtige_antwort: null,
          feedback_richtig: "Das ist jetzt Teil eurer gemeinsamen Geschichte.",
          placeholder: "Unser neuer gemeinsamer Traum ist..."
        }
      ],
      zufallsevents: [
        {
          id: "te1",
          text: "🌌 Sonja zeigt euch den Nachthimmel: 'Jeder sucht sich einen Stern aus. Das ist euer Traum-Stern.'",
          auswirkung: "harmonie+15"
        },
        {
          id: "te2",
          text: "📖 Ein leeres Traumtagebuch erscheint. Schreibt je eine Seite — zusammen oder getrennt.",
          auswirkung: "harmonie+20"
        }
      ]
    }
  ],

  // ─── Globale Zufallsevents ───────────────────────────────────────────────────
  zufallsevents_global: [
    {
      id: "g1",
      name: "Altes Foto",
      text: "📸 Ein altes Foto erscheint! Beschreibt gemeinsam, was ihr darin seht und fühlt.",
      ausloeser: "random",
      auswirkung: "harmonie+10"
    },
    {
      id: "g2",
      name: "Geheime Frage",
      text: "🤫 Geheime Frage: Was wäre das erste, was du tun würdest, wenn du einen Tag alleine hättest?",
      ausloeser: "random",
      auswirkung: "harmonie+5"
    },
    {
      id: "g3",
      name: "Zeitkapsel",
      text: "⏰ Zeitkapsel: Schreibt je eine Nachricht an euer zukünftiges Ich — in 10 Jahren.",
      ausloeser: "random",
      auswirkung: "harmonie+15"
    },
    {
      id: "g4",
      name: "Kompliment-Runde",
      text: "💛 Sagt euch gegenseitig drei echte Komplimente — nicht die üblichen!",
      ausloeser: "random",
      auswirkung: "harmonie+20"
    },
    {
      id: "g5",
      name: "Songmoment",
      text: "🎵 Welches Lied beschreibt euren aktuellen Moment zusammen? Spielt es jetzt ab.",
      ausloeser: "random",
      auswirkung: "harmonie+10"
    },
    {
      id: "g6",
      name: "Schweige-Minute",
      text: "🤫 Eine Minute Stille. Schaut euch an. Keine Worte. Nur Anwesenheit.",
      ausloeser: "random",
      auswirkung: "harmonie+15"
    },
    {
      id: "g7",
      name: "Wunschzettel",
      text: "✉️ Schreibt je drei Wünsche auf, die ihr euch vom anderen für diesen Monat wünscht.",
      ausloeser: "random",
      auswirkung: "harmonie+10"
    },
    {
      id: "g8",
      name: "Erster Gedanke",
      text: "⚡ Schnell! Erster Gedanke: Was kommt dir bei 'wir' als erstes in den Sinn?",
      ausloeser: "random",
      auswirkung: "harmonie+5"
    },
    {
      id: "g9",
      name: "Dankbarkeits-Blitz",
      text: "🙏 Nennt abwechselnd 5 Dinge, für die ihr dem anderen dankbar seid. Los!",
      ausloeser: "random",
      auswirkung: "harmonie+20"
    },
    {
      id: "g10",
      name: "Unsinnige Frage",
      text: "🦄 Wenn eure Beziehung ein Tier wäre — welches und warum? Beide gleichzeitig antworten!",
      ausloeser: "random",
      auswirkung: "harmonie+5"
    }
  ],

  // ─── Kommunikations-Einheit ─────────────────────────────────────────────────
  kommunikation: {
    hybridame_id: "kai",
    titel: "Einheit — Kommunikation",
    einleitung: "Kai öffnet die Brücke zwischen euch. Hier geht es darum, wie ihr miteinander sprecht — nicht nur jetzt, sondern täglich.",
    plattformen: [
      {
        name: "Tägliche Sprachnachrichten",
        beschreibung: "Jeden Abend eine kurze Sprachnachricht. Nicht schreiben — sprechen.",
        emoji: "🎙️"
      },
      {
        name: "Wöchentlicher Video-Call",
        beschreibung: "Einmal pro Woche ein fester Termin — kein Scrollen, nur Gesichter.",
        emoji: "📹"
      },
      {
        name: "Gemeinsames Journal",
        beschreibung: "Ein geteiltes Notizbuch (digital oder analog) für Gedanken, die zu groß für eine Nachricht sind.",
        emoji: "📓"
      },
      {
        name: "Check-in-Karte",
        beschreibung: "Eine einfache Frage pro Woche: 'Wie geht es dir wirklich?' Ehrlich antworten.",
        emoji: "💌"
      }
    ],
    frage: {
      text: "Welche dieser Formen der Kommunikation möchtet ihr ab sofort stärken?",
      typ: "multiple_choice",
      optionen: ["Sprachnachrichten", "Video-Calls", "Gemeinsames Journal", "Check-in-Karten"],
      mehrfach: true
    }
  },

  // ─── Regeln ─────────────────────────────────────────────────────────────────
  regeln: [
    "Jede Frage muss von beiden beantwortet werden, bevor es weitergeht.",
    "Es gibt keine falschen Antworten — nur ehrliche und unehrliche.",
    "Bei Gefühls-Fragen: Vergleicht eure Antworten und redet darüber.",
    "Der LOVE-Button ❤️ ist immer da — für einen Neuanfang, wenn es nötig ist.",
    "Pausen sind erlaubt. Das Spiel wartet auf euch.",
    "Alles, was hier gesagt wird, bleibt zwischen euch."
  ],

  // ─── Video-Konzepte ─────────────────────────────────────────────────────────
  video_konzepte: [
    {
      etage: "Prolog",
      datei: "prolog.mp4",
      inhalt: "Collage aus gemeinsamen Fotos, untermalt mit einem bedeutungsvollen Lied. Endet mit der Frage: 'Wer seid ihr füreinander?'",
      dauer: "30-60 Sekunden",
      tool: "CapCut, InShot oder iMovie",
      tipps: "Nutzt eure schönsten gemeinsamen Fotos. Fangt mit dem allerersten an."
    },
    {
      etage: "Erinnerungen",
      datei: "erinnerungen.mp4",
      inhalt: "Chronologische Slideshow der ersten gemeinsamen Monate. Vielleicht mit einer Sprachmemo.",
      dauer: "60-90 Sekunden",
      tool: "Google Fotos Highlights oder CapCut",
      tipps: "Lasst die Bilder selbst sprechen. Wenig Text."
    },
    {
      etage: "Zukunft",
      datei: "zukunft.mp4",
      inhalt: "Orte, die ihr besuchen wollt. Screenshots von Wunsch-Reisen, gezeichnete Pläne, Traumhäuser.",
      dauer: "45-60 Sekunden",
      tool: "Pinterest Screenshots + CapCut",
      tipps: "Fügt handgeschriebene Notizen ein: 'Das wollen wir.'"
    },
    {
      etage: "Konflikte",
      datei: "konflikte.mp4",
      inhalt: "Etwas Ehrliches: Ein kurzes Video, in dem ihr je einen Satz sagt, was ihr vom anderen braucht.",
      dauer: "30-45 Sekunden",
      tool: "Kamera-App direkt",
      tipps: "Traut euch. Authentizität ist hier wichtiger als Qualität."
    },
    {
      etage: "Vertrauen",
      datei: "vertrauen.mp4",
      inhalt: "Stille Bilder von Momenten, in denen ihr füreinander da wart. Ruhige Musik.",
      dauer: "45-60 Sekunden",
      tool: "CapCut mit Slow-Motion",
      tipps: "Wählt Bilder, bei denen ihr both da wart — nicht Selfies, sondern Momente."
    },
    {
      etage: "Träume",
      datei: "traeume.mp4",
      inhalt: "Nacht-Ästhetik: Sterne, dunkle ruhige Bilder, Mondphasen. Eure Traum-Liste vorgelesen.",
      dauer: "60-90 Sekunden",
      tool: "CapCut mit Nacht-Filter",
      tipps: "Lest euch gegenseitig eure Traumlisten vor und filmt das."
    }
  ]
};
