// CARDVERSE Story Engine — Kapitel 1: Der Anfang
// Format: inkjs (.ink)
// Triggered von: memory-erster-tag-001

=== anfang_chapter_1 ===

Du spielst die Karte "Der erste Tag".
Ein Moment lang hält alles inne.

Der erste Tag — war das wirklich so lange her?

* [Erinnern]
    Ja. Es war der Moment, als alles möglich schien.
    Die Stadt war neu. Die Person auch.
    +3 Emotionspunkte.
    -> erinnerung_tief

* [Weitermachen]
    Keine Zeit für Sentimentalitäten.
    Das Match läuft.
    -> match_fortgesetzt

* [Nachdenken]
    Du hältst inne. Was ist seitdem passiert?
    Viel. Zu viel. Nicht genug.
    +1 Emotionspunkt. Neue Karte gezogen.
    -> nachdenken_ende


=== erinnerung_tief ===

Ein Bild taucht auf.
Keine Worte — nur ein Gefühl.
Die Art von Erinnerung, die sich anfühlt wie ein warmer Raum.

~ emotion_power += 3
~ story_unlocked = "anfang-chapter-2"

Du hast Kapitel 2 freigeschaltet: "Die erste Nacht".
-> END


=== match_fortgesetzt ===

Manchmal ist das Beste, was man tun kann,
einfach weiterzumachen.
-> END


=== nachdenken_ende ===

Manche Fragen haben keine Antworten.
Nur Erinnerungen, die sich wie Antworten anfühlen.
-> END
