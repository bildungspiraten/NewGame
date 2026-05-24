// BEZIEHUNGSHYBRID — Spiellogik
'use strict';

// ─── Spielzustand ─────────────────────────────────────────────────────────────
const State = {
  currentSection: 'start',
  currentPlayer: 1,
  spieler1: { name: 'Spieler 1', antworten: {} },
  spieler2: { name: 'Spieler 2', antworten: {} },
  progress: 0,
  harmonie: 50,
  firedEvents: new Set(),
  completedEtagen: new Set(),
  phase: 'spieler1',   // 'spieler1' | 'spieler2' | 'vergleich'
  currentFrageIndex: 0,
  currentEtage: null,
  sessionId: Date.now().toString(36)
};

// Etagen-Reihenfolge für Fortschritt
const SECTION_ORDER = [
  'start', 'regeln', 'prolog',
  'erinnerungen', 'zukunft', 'konflikte', 'vertrauen', 'traeume',
  'kommunikation', 'ende'
];

// ─── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadSavedState();
  showSection('start');
  setupRandomEventTimer();
  buildUI();
});

function buildUI() {
  buildEtagen();
  buildKommunikation();
  buildEnde();
}

// ─── Navigation ───────────────────────────────────────────────────────────────
function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  const el = document.getElementById('sec-' + id);
  if (el) {
    el.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  State.currentSection = id;
  updateProgress();
  updatePlayerBadge();
  highlightNav(id);
}

function highlightNav(id) {
  document.querySelectorAll('.nav-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.section === id);
  });
}

// ─── Fortschritt ──────────────────────────────────────────────────────────────
function updateProgress() {
  const idx = SECTION_ORDER.indexOf(State.currentSection);
  const pct = idx < 0 ? 0 : Math.round((idx / (SECTION_ORDER.length - 1)) * 100);
  State.progress = pct;
  const bar = document.getElementById('progress-bar');
  if (bar) bar.style.width = pct + '%';
}

// ─── Spieler-Badge ────────────────────────────────────────────────────────────
function updatePlayerBadge() {
  const badge = document.getElementById('player-badge');
  if (!badge) return;
  const name = State.phase === 'spieler2'
    ? State.spieler2.name
    : State.spieler1.name;
  badge.querySelector('span').textContent = name;
}

// ─── Spiel starten ────────────────────────────────────────────────────────────
function startGame() {
  const n1 = document.getElementById('input-name1')?.value.trim();
  const n2 = document.getElementById('input-name2')?.value.trim();
  if (n1) State.spieler1.name = n1;
  if (n2) State.spieler2.name = n2;
  GAME_DATA.config.spieler1_name = State.spieler1.name;
  GAME_DATA.config.spieler2_name = State.spieler2.name;
  saveState();
  updatePlayerBadge();
  showSection('regeln');
  showToast('Willkommen, ' + State.spieler1.name + ' & ' + State.spieler2.name + '! ❤️');
}

// ─── UI dynamisch bauen ───────────────────────────────────────────────────────
function buildEtagen() {
  GAME_DATA.etagen.forEach((etage, etageIdx) => {
    const sec = document.getElementById('sec-' + etage.id);
    if (!sec) return;

    const hybridame = GAME_DATA.hybridamen.find(h => h.id === etage.hybridame_id);
    let html = '';

    // Hybridame-Card
    if (hybridame) {
      html += `
        <div class="hybridame-card" style="background: ${hybridame.hintergrund}">
          <span class="hybridame-emoji">${hybridame.emoji}</span>
          <div class="hybridame-name">${hybridame.name}</div>
          <div class="hybridame-rolle">${hybridame.rolle}</div>
          <div class="hybridame-quote">"${hybridame.beispielsatz}"</div>
        </div>`;
    }

    // Einleitungstext
    html += `<div class="card">
      <div class="card-title">${etage.name}</div>
      <p class="card-subtitle">${etage.einleitungstext}</p>`;

    // Video
    html += buildVideoBlock(etage);

    html += `</div>`;

    // Fragen (beide Spieler nacheinander)
    html += buildFragenBlock(etage, etageIdx);

    // Weiter-Button (anfangs versteckt)
    html += `
      <button class="btn btn-success" id="weiter-${etage.id}" style="display:none"
              onclick="weiterZuNaechster('${etage.id}')">
        Weiter ➜
      </button>`;

    sec.innerHTML = html;
    initRegler(etage.id);
  });
}

function buildVideoBlock(etage) {
  const hasVideo = etage.video && etage.video !== '';
  if (hasVideo) {
    return `
      <div class="video-wrap">
        <video controls preload="none" poster="${etage.video_poster || ''}">
          <source src="${etage.video}" type="video/mp4">
          Euer Browser unterstützt kein Video.
        </video>
      </div>`;
  }
  return `
    <div class="video-wrap">
      <div class="video-placeholder">
        <span class="icon">🎬</span>
        <strong>Hier kommt euer Video hin</strong>
        <small>Datei: <code>${etage.video || 'video.mp4'}</code></small>
      </div>
    </div>`;
}

function buildFragenBlock(etage, etageIdx) {
  let html = `<div id="fragen-block-${etage.id}">`;

  // Spieler-1-Phase
  html += `<div id="phase-s1-${etage.id}" class="card">
    <div class="spieler-indikator">
      <div class="spieler-chip aktiv" id="chip-s1-${etage.id}">
        👤 <span id="name-s1-${etage.id}">Spieler 1</span>
      </div>
      <div class="spieler-chip inaktiv" id="chip-s2-${etage.id}">
        👤 <span id="name-s2-${etage.id}">Spieler 2</span>
      </div>
    </div>`;

  etage.fragen.forEach((frage, i) => {
    html += buildFrageHTML(frage, i, etage.id, 1);
  });

  html += `
    <button class="btn btn-primary" id="btn-s1-${etage.id}"
            onclick="abschliessen('${etage.id}', 1)">
      ✅ ${State.spieler1.name || 'Spieler 1'} ist fertig
    </button>
  </div>`;

  // Spieler-2-Phase (erst sichtbar nach S1)
  html += `<div id="phase-s2-${etage.id}" class="card" style="display:none">
    <div class="spieler-indikator">
      <div class="spieler-chip inaktiv" id="chip-s1b-${etage.id}">
        👤 <span>${State.spieler1.name || 'Spieler 1'}</span> ✓
      </div>
      <div class="spieler-chip aktiv" id="chip-s2b-${etage.id}">
        👤 <span id="name-s2b-${etage.id}">Spieler 2</span>
      </div>
    </div>
    <p class="text-muted text-center mt-12 mb-0">
      📵 Gerät an ${State.spieler2.name || 'Spieler 2'} weitergeben!
    </p>
    <hr class="divider">`;

  etage.fragen.forEach((frage, i) => {
    html += buildFrageHTML(frage, i, etage.id, 2);
  });

  html += `
    <button class="btn btn-primary" id="btn-s2-${etage.id}"
            onclick="abschliessen('${etage.id}', 2)">
      ✅ ${State.spieler2.name || 'Spieler 2'} ist fertig
    </button>
  </div>`;

  // Vergleich (erst sichtbar nach S2)
  html += `<div id="phase-vergleich-${etage.id}" class="card" style="display:none">
    <div class="card-title">🔍 Vergleicht eure Antworten</div>
    <div id="vergleich-inhalt-${etage.id}"></div>
  </div>`;

  html += `</div>`;
  return html;
}

function buildFrageHTML(frage, i, etageId, spielerNr) {
  const prefix = `${etageId}-s${spielerNr}-q${i}`;
  const letters = ['A','B','C','D'];
  let html = `
    <div class="frage-block" id="frage-${prefix}">
      <div class="frage-num">Frage ${i + 1}</div>
      <div class="frage-text">${replacePlaceholder(frage.text)}</div>`;

  switch (frage.typ) {
    case 'freitext':
      html += `<textarea class="frage-input" id="input-${prefix}"
                 placeholder="${frage.placeholder || 'Deine Antwort...'}"></textarea>`;
      break;

    case 'regler':
      html += `
        <div class="regler-wrap">
          <div class="regler-labels">
            <span>${frage.min_label}</span>
            <span>${frage.max_label}</span>
          </div>
          <input type="range" id="input-${prefix}"
                 min="${frage.min}" max="${frage.max}" value="${Math.round((frage.min + frage.max) / 2)}"
                 oninput="updateReglerVal(this, '${prefix}')">
          <div class="regler-value" id="val-${prefix}">
            ${Math.round((frage.min + frage.max) / 2)}/${frage.max}
          </div>
        </div>`;
      break;

    case 'multiple_choice':
      html += `<div class="mc-options">`;
      frage.optionen.forEach((opt, oi) => {
        html += `
          <button class="mc-option" id="mc-${prefix}-${oi}"
                  onclick="selectMC('${prefix}', ${oi}, this)">
            <span class="mc-letter">${letters[oi]}</span>
            ${opt}
          </button>`;
      });
      html += `</div>
      <input type="hidden" id="input-${prefix}" value="">`;
      break;

    case 'ja_nein':
      html += `
        <div class="ja-nein-wrap">
          <button class="ja-btn" id="ja-${prefix}"
                  onclick="selectJaNein('${prefix}', 'Ja', this)">
            ✅ Ja
          </button>
          <button class="nein-btn" id="nein-${prefix}"
                  onclick="selectJaNein('${prefix}', 'Nein', this)">
            ❌ Nein
          </button>
        </div>
        <input type="hidden" id="input-${prefix}" value="">`;
      break;
  }

  // Feedback
  if (frage.feedback_richtig) {
    html += `<div class="feedback info" id="fb-${prefix}">${frage.feedback_richtig}</div>`;
  }

  html += `</div>`;
  return html;
}

function buildKommunikation() {
  const k = GAME_DATA.kommunikation;
  const sec = document.getElementById('sec-kommunikation');
  if (!sec) return;

  const hm = GAME_DATA.hybridamen.find(h => h.id === k.hybridame_id);
  let html = '';

  if (hm) {
    html += `
      <div class="hybridame-card" style="background: ${hm.hintergrund}">
        <span class="hybridame-emoji">${hm.emoji}</span>
        <div class="hybridame-name">${hm.name}</div>
        <div class="hybridame-rolle">${hm.rolle}</div>
        <div class="hybridame-quote">"${hm.beispielsatz}"</div>
      </div>`;
  }

  html += `<div class="card">
    <div class="card-title">${k.titel}</div>
    <p class="card-subtitle">${k.einleitung}</p>
    <div class="plattform-list">`;

  k.plattformen.forEach(p => {
    html += `
      <div class="plattform-item">
        <div class="plattform-icon">${p.emoji}</div>
        <div class="plattform-info">
          <h4>${p.name}</h4>
          <p>${p.beschreibung}</p>
        </div>
      </div>`;
  });

  html += `</div></div>`;

  // Frage
  html += `<div class="card">
    <div class="frage-text">${k.frage.text}</div>
    <div class="mc-options">`;

  k.frage.optionen.forEach((opt, i) => {
    html += `
      <button class="mc-option" onclick="toggleKommMC(this)">
        <span class="mc-letter">${['A','B','C','D'][i]}</span> ${opt}
      </button>`;
  });

  html += `</div>
    <button class="btn btn-success mt-12" onclick="showSection('traeume')">
      Zum letzten Kapitel ➜
    </button>
  </div>`;

  sec.innerHTML = html;
}

function buildEnde() {
  const sec = document.getElementById('sec-ende');
  if (!sec) return;

  sec.innerHTML = `
    <div class="ende-hero">
      <div class="confetti">🎉</div>
      <h2>Ihr habt es geschafft!</h2>
      <p>Das war eure Reise. Jetzt beginnt der echte Teil.</p>
    </div>
    <div class="card">
      <div class="card-title">📊 Eure Statistiken</div>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value" id="stat-harmonie">50</div>
          <div class="stat-label">Harmonie %</div>
        </div>
        <div class="stat-card">
          <div class="stat-value" id="stat-etagen">0</div>
          <div class="stat-label">Kapitel</div>
        </div>
        <div class="stat-card">
          <div class="stat-value" id="stat-antworten">0</div>
          <div class="stat-label">Antworten</div>
        </div>
        <div class="stat-card">
          <div class="stat-value" id="stat-events">0</div>
          <div class="stat-label">Zufallsevents</div>
        </div>
      </div>
      <div class="harmonie-bar">
        <div class="harmonie-fill" id="harmonie-fill" style="width:50%"></div>
      </div>
    </div>
    <div class="card">
      <div class="card-title">💌 Eure Antworten</div>
      <div id="alle-antworten"></div>
    </div>
    <button class="btn btn-primary" onclick="exportAntworten()">
      📤 Antworten exportieren
    </button>
    <button class="btn btn-ghost mt-12" onclick="neuStarten()">
      🔄 Neu starten
    </button>`;
}

// ─── Interaktion ──────────────────────────────────────────────────────────────
function updateReglerVal(el, prefix) {
  const valEl = document.getElementById('val-' + prefix);
  const max = el.getAttribute('max') || 10;
  if (valEl) valEl.textContent = el.value + '/' + max;
}

function selectMC(prefix, idx, btn) {
  // Deselektiere alle Optionen in dieser Gruppe
  const allBtns = btn.closest('.mc-options').querySelectorAll('.mc-option');
  allBtns.forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  const inp = document.getElementById('input-' + prefix);
  if (inp) inp.value = btn.textContent.trim();

  // Feedback anzeigen
  const fb = document.getElementById('fb-' + prefix);
  if (fb) fb.classList.add('show');
}

function selectJaNein(prefix, val, btn) {
  const wrap = btn.closest('.ja-nein-wrap');
  wrap.querySelectorAll('button').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  const inp = document.getElementById('input-' + prefix);
  if (inp) inp.value = val;

  const fb = document.getElementById('fb-' + prefix);
  if (fb) fb.classList.add('show');
}

function toggleKommMC(btn) {
  btn.classList.toggle('selected');
}

// ─── Spieler abschließen ──────────────────────────────────────────────────────
function abschliessen(etageId, spielerNr) {
  const etage = GAME_DATA.etagen.find(e => e.id === etageId);
  if (!etage) return;

  // Antworten sammeln
  const antworten = {};
  etage.fragen.forEach((frage, i) => {
    const prefix = `${etageId}-s${spielerNr}-q${i}`;
    const inp = document.getElementById('input-' + prefix);
    antworten[frage.id] = inp ? inp.value : '';
  });

  if (spielerNr === 1) {
    State.spieler1.antworten[etageId] = antworten;
    // Spieler-2-Phase zeigen
    document.getElementById(`phase-s1-${etageId}`).style.display = 'none';
    document.getElementById(`phase-s2-${etageId}`).style.display = 'block';
    // Namen aktualisieren
    const n = document.getElementById(`name-s2b-${etageId}`);
    if (n) n.textContent = State.spieler2.name;
    State.phase = 'spieler2';
    updatePlayerBadge();
    showToast('🎉 ' + State.spieler1.name + ' fertig! Jetzt ' + State.spieler2.name + '!');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    State.spieler2.antworten[etageId] = antworten;
    // Beide fertig → Vergleich
    document.getElementById(`phase-s2-${etageId}`).style.display = 'none';
    document.getElementById(`phase-vergleich-${etageId}`).style.display = 'block';
    showVergleich(etageId);
    State.completedEtagen.add(etageId);
    State.phase = 'spieler1';
    updatePlayerBadge();
    saveState();

    // Weiter-Button einblenden
    const weiter = document.getElementById('weiter-' + etageId);
    if (weiter) weiter.style.display = 'flex';

    // Zufallsevent?
    if (Math.random() < 0.4) triggerRandomEvent(etage.zufallsevents);
  }
}

function showVergleich(etageId) {
  const etage = GAME_DATA.etagen.find(e => e.id === etageId);
  const container = document.getElementById(`vergleich-inhalt-${etageId}`);
  if (!etage || !container) return;

  let html = '';
  etage.fragen.forEach((frage, i) => {
    const a1 = State.spieler1.antworten[etageId]?.[frage.id] || '—';
    const a2 = State.spieler2.antworten[etageId]?.[frage.id] || '—';
    const gleich = a1.toLowerCase() === a2.toLowerCase() && a1 !== '—';

    html += `
      <div style="margin-bottom:14px">
        <div class="frage-num" style="margin-bottom:6px">${gleich ? '✅' : '💬'} Frage ${i + 1}</div>
        <div style="font-size:14px;margin-bottom:8px;color:var(--text-muted)">${frage.text}</div>
        <div class="vergleich-wrap">
          <div class="vergleich-item">
            <div class="spieler-label">${State.spieler1.name}</div>
            <div class="spieler-antwort">${formatAntwort(frage, a1)}</div>
          </div>
          <div class="vergleich-item">
            <div class="spieler-label">${State.spieler2.name}</div>
            <div class="spieler-antwort">${formatAntwort(frage, a2)}</div>
          </div>
        </div>
        ${gleich ? '<div class="feedback correct show">🎉 Ihr habt gleich geantwortet!</div>' : ''}
      </div>`;

    if (gleich) {
      State.harmonie = Math.min(100, State.harmonie + 5);
    }
  });

  container.innerHTML = html;
}

function formatAntwort(frage, val) {
  if (frage.typ === 'regler') return `${val}/${frage.max}`;
  return val || '—';
}

// ─── Weiter-Navigation ────────────────────────────────────────────────────────
function weiterZuNaechster(etageId) {
  const idx = GAME_DATA.etagen.findIndex(e => e.id === etageId);
  if (idx < GAME_DATA.etagen.length - 1) {
    showSection(GAME_DATA.etagen[idx + 1].id);
  } else {
    showSection('kommunikation');
  }
}

// ─── Zufallsevents ────────────────────────────────────────────────────────────
function triggerRandomEvent(localEvents) {
  // Kombiniere lokale + globale Events, wähle ein noch nicht getriggertes
  const alle = [...(localEvents || []), ...GAME_DATA.zufallsevents_global];
  const unused = alle.filter(e => !State.firedEvents.has(e.id));
  if (unused.length === 0) return;

  const event = unused[Math.floor(Math.random() * unused.length)];
  State.firedEvents.add(event.id);

  // Harmonie-Bonus
  const bonus = parseInt((event.auswirkung || '').replace('harmonie+', '')) || 0;
  if (bonus > 0) State.harmonie = Math.min(100, State.harmonie + bonus);

  // Overlay anzeigen
  const overlay = document.getElementById('event-overlay');
  document.getElementById('event-icon').textContent = event.text.match(/^[^\s]+/)?.[0] || '🎲';
  document.getElementById('event-name').textContent = event.name || 'Zufallsevent';
  document.getElementById('event-text').textContent = event.text.replace(/^[^\s]+\s/, '');
  document.getElementById('event-auswirkung').textContent = bonus > 0 ? `+${bonus}% Harmonie` : '✨';
  overlay.classList.add('show');
  saveState();
}

function closeEvent() {
  document.getElementById('event-overlay').classList.remove('show');
}

function setupRandomEventTimer() {
  // Alle 5 Minuten zufälliges globales Event
  setInterval(() => {
    if (State.currentSection !== 'start' && State.currentSection !== 'ende') {
      if (Math.random() < 0.3) triggerRandomEvent([]);
    }
  }, 5 * 60 * 1000);
}

// ─── LOVE-Button ──────────────────────────────────────────────────────────────
function loveBtnClicked() {
  const overlay = document.getElementById('love-overlay');
  overlay.classList.add('show');
}

function closeLove(action) {
  document.getElementById('love-overlay').classList.remove('show');
  if (action === 'pause') {
    showToast('⏸️ Pause. Ihr könnt jederzeit weitermachen.');
  } else if (action === 'neustart') {
    neuStarten();
  }
}

function neuStarten() {
  if (!confirm('Wirklich neu starten? Alle Antworten gehen verloren.')) return;
  localStorage.removeItem('beziehungshybrid_state');
  location.reload();
}

// ─── Regler initialisieren ────────────────────────────────────────────────────
function initRegler(etageId) {
  const etage = GAME_DATA.etagen.find(e => e.id === etageId);
  if (!etage) return;
  etage.fragen.forEach((frage, i) => {
    if (frage.typ === 'regler') {
      [1, 2].forEach(spielerNr => {
        const prefix = `${etageId}-s${spielerNr}-q${i}`;
        const el = document.getElementById('input-' + prefix);
        if (el) updateReglerVal(el, prefix);
      });
    }
  });
}

// ─── Spielernamen aktualisieren ───────────────────────────────────────────────
function updateNamen() {
  document.querySelectorAll('[id^="name-s1-"]').forEach(el => {
    el.textContent = State.spieler1.name;
  });
  document.querySelectorAll('[id^="name-s2-"]').forEach(el => {
    el.textContent = State.spieler2.name;
  });
  document.querySelectorAll('[id^="btn-s1-"]').forEach(el => {
    el.textContent = '✅ ' + State.spieler1.name + ' ist fertig';
  });
  document.querySelectorAll('[id^="btn-s2-"]').forEach(el => {
    el.textContent = '✅ ' + State.spieler2.name + ' ist fertig';
  });
}

// ─── Platzhalter ersetzen ─────────────────────────────────────────────────────
function replacePlaceholder(text) {
  if (!text) return '';
  return text
    .replace(/\[NAME_PARTNER\]/g, State.spieler2.name || 'deinem Partner')
    .replace(/\[NAME_1\]/g, State.spieler1.name)
    .replace(/\[NAME_2\]/g, State.spieler2.name)
    .replace(/\[ORT\]/g, GAME_DATA.config.erster_ort)
    .replace(/\[DATUM\]/g, GAME_DATA.config.beginn_datum);
}

// ─── Ende & Statistiken ───────────────────────────────────────────────────────
function showEnde() {
  showSection('ende');
  updateStats();
  buildAlleAntworten();
}

function updateStats() {
  const totalAntworten = Object.values(State.spieler1.antworten)
    .reduce((sum, obj) => sum + Object.keys(obj).length, 0);

  document.getElementById('stat-harmonie').textContent = State.harmonie;
  document.getElementById('stat-etagen').textContent = State.completedEtagen.size;
  document.getElementById('stat-antworten').textContent = totalAntworten * 2;
  document.getElementById('stat-events').textContent = State.firedEvents.size;
  document.getElementById('harmonie-fill').style.width = State.harmonie + '%';
}

function buildAlleAntworten() {
  const container = document.getElementById('alle-antworten');
  if (!container) return;

  let html = '';
  GAME_DATA.etagen.forEach(etage => {
    if (!State.spieler1.antworten[etage.id]) return;
    html += `<div style="margin-bottom:16px">
      <div class="frage-num">${etage.name}</div>`;
    etage.fragen.forEach(frage => {
      const a1 = State.spieler1.antworten[etage.id]?.[frage.id] || '—';
      const a2 = State.spieler2.antworten[etage.id]?.[frage.id] || '—';
      html += `
        <div style="font-size:13px;color:var(--text-muted);margin:8px 0 4px">${frage.text}</div>
        <div class="vergleich-wrap">
          <div class="vergleich-item">
            <div class="spieler-label">${State.spieler1.name}</div>
            <div class="spieler-antwort" style="font-size:13px">${a1}</div>
          </div>
          <div class="vergleich-item">
            <div class="spieler-label">${State.spieler2.name}</div>
            <div class="spieler-antwort" style="font-size:13px">${a2}</div>
          </div>
        </div>`;
    });
    html += `</div>`;
  });

  container.innerHTML = html || '<p class="text-muted">Noch keine Antworten.</p>';
}

function exportAntworten() {
  const data = {
    datum: new Date().toLocaleDateString('de-DE'),
    spieler1: State.spieler1.name,
    spieler2: State.spieler2.name,
    harmonie: State.harmonie + '%',
    antworten: {
      [State.spieler1.name]: State.spieler1.antworten,
      [State.spieler2.name]: State.spieler2.antworten
    }
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `beziehungshybrid-${data.datum.replace(/\./g, '-')}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('📥 Exportiert!');
}

// ─── Sprachsteuerung (optional) ──────────────────────────────────────────────
function startSpeech(inputId) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { showToast('Sprachsteuerung nicht verfügbar'); return; }

  const rec = new SR();
  rec.lang = 'de-DE';
  rec.interimResults = false;
  rec.maxAlternatives = 1;

  rec.onresult = e => {
    const el = document.getElementById(inputId);
    if (el) el.value = e.results[0][0].transcript;
  };

  rec.onerror = () => showToast('Spracherkennung fehlgeschlagen');
  rec.start();
  showToast('🎙️ Höre zu...');
}

// ─── Toast ────────────────────────────────────────────────────────────────────
let toastTimer = null;
function showToast(msg, duration = 2500) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), duration);
}

// ─── State persistieren ───────────────────────────────────────────────────────
function saveState() {
  const toSave = {
    spieler1: State.spieler1,
    spieler2: State.spieler2,
    harmonie: State.harmonie,
    completedEtagen: [...State.completedEtagen],
    firedEvents: [...State.firedEvents]
  };
  try {
    localStorage.setItem('beziehungshybrid_state', JSON.stringify(toSave));
  } catch (e) { /* localStorage nicht verfügbar */ }
}

function loadSavedState() {
  try {
    const saved = localStorage.getItem('beziehungshybrid_state');
    if (!saved) return;
    const data = JSON.parse(saved);
    if (data.spieler1) State.spieler1 = data.spieler1;
    if (data.spieler2) State.spieler2 = data.spieler2;
    if (data.harmonie) State.harmonie = data.harmonie;
    if (data.completedEtagen) State.completedEtagen = new Set(data.completedEtagen);
    if (data.firedEvents) State.firedEvents = new Set(data.firedEvents);
  } catch (e) { /* ignorieren */ }
}
