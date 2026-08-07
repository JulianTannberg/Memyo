(() => {
  "use strict";

  const APP_VERSION = "3.1.0";
  const STORAGE_KEY = "akte1823.game";
  const SNAPSHOT_KEY = "akte1823.game.snapshot";
  const RECENT_GAMES_KEY = "akte1823.recentGames";
  const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const PHOTO_DB_NAME = "akte1823-photos";
  const PHOTO_STORE_NAME = "photos";
  const PHOTO_DB_VERSION = 1;

  const DEFAULT_SETUP = {
    crewName: ""
  };

  const DEFAULT_ROUTE = {};

  const STATIONS = [
    {
      id: 1,
      title: "Teelke",
      kicker: "Die Spur des Tees",
      location: { name: "Teelke", address: "Ecke Brunnenstraße / Mühlenstraße, 26789 Leer", lat: 53.229167, lon: 7.451389 },
      destinationAnswers: ["Teelke", "Teelke Statue", "Teelke Figur", "Teefrau", "Teemädchen"],
      arrivalClue: "Findet eine bronzene Frau, die seit Jahrzehnten mit Tee auf Gäste wartet. Sie steht dort, wo Brunnenstraße und Mühlenstraße aufeinandertreffen.",
      arrivalHint: "Sie trägt einen kurzen ostfriesischen Namen und wurde vom Teehandelshaus Bünting gestiftet.",
      taskTitle: "Was trägt die Teefrau?",
      task: () => `
        <p>Schaut euch die Bronzefigur genau an.</p>
        <p><strong>Welche zwei Dinge hält sie bei sich?</strong></p>
      `,
      taskPlaceholder: "z. B. … und …",
      taskHint: "Beides gehört unmittelbar zur ostfriesischen Teestunde.",
      taskAnswers: () => [
        "Tasse und Kanne", "Kanne und Tasse", "Teetasse und Teekanne", "Teekanne und Teetasse",
        "Tasse Kanne", "Kanne Tasse", "Teetasse Teekanne", "Teekanne Teetasse",
        "Tasse und Teekanne", "Teekanne und Tasse", "Teetasse und Kanne", "Kanne und Teetasse"
      ],
      // Beide Gegenstände müssen erkannt werden. Dabei gelten Tasse/Teetasse und Kanne/Teekanne gleichwertig.
      // Die allgemeine tolerante Prüfung erlaubt zusätzlich ganze Sätze, Reihenfolgewechsel und kleine Tippfehler.
      taskGroups: [
        ["Tasse", "Teetasse", "Tee-Tasse", "Tässchen", "Taesschen"],
        ["Kanne", "Teekanne", "Tee-Kanne"]
      ],
      taskSolution: () => "Tasse und Kanne",
      evidence: {
        fragment: "11",
        label: "Beweisstück 1",
        explanation: "Der erste Aktenstreifen liefert den Tag des entscheidenden Datums."
      },
      insideInfo: "Ganz in der Nähe erzählt das Bünting-Teemuseum die Geschichte des Tees, der ostfriesischen Teekultur und des Leeraner Handelshauses Bünting.",
      photo: "Macht ein Foto, das Tee und Leer verbindet – mit der Figur, einem Detail der Umgebung oder eurer Crew im Hintergrund.",
      nextClue: "Sucht nun ein Schiff, das niemals Wasser berührt. Es dreht sich hoch über den Dächern im Wind – auf dem höchsten Kirchturm der Stadt.",
      nextHint: "Das dreimastige Schiff heißt „Schepken Christi“ und gehört zu einer großen reformierten Kirche."
    },
    {
      id: 2,
      title: "Große Kirche",
      kicker: "Das Schiff über den Dächern",
      location: { name: "Große Kirche", address: "Kirchstraße 14, 26789 Leer", lat: 53.228589, lon: 7.449089 },
      destinationAnswers: ["Große Kirche", "Grosse Kirche", "Große Kirche Leer", "Kirche", "Kirche Leer", "Reformierte Kirche", "Große reformierte Kirche", "Evangelisch reformierte Kirche", "Evangelisch-reformierte Kirche"],
      taskTitle: "Ganz nach oben schauen",
      task: () => `
        <p>Bleibt draußen und betrachtet den Turm bis zur Spitze.</p>
        <p><strong>Was dreht sich dort oben als Windfahne?</strong></p>
      `,
      taskPlaceholder: "Was seht ihr auf der Turmspitze?",
      taskHint: "Es hat Masten und würde normalerweise aufs Wasser gehören.",
      taskAnswers: () => [
        "Schiff", "Schiffchen", "Segelschiff", "Segelboot", "Boot", "dreimastiges Segelschiff",
        "dreimastiges Schiff", "Dreimaster", "Schepken Christi"
      ],
      taskSolution: () => "ein dreimastiges Segelschiff / Schepken Christi",
      evidence: {
        fragment: "JULI",
        label: "Beweisstück 2",
        explanation: "Der zweite Aktenstreifen ergänzt den Monat."
      },
      insideInfo: "Drinnen gibt es unter anderem eine ungewöhnliche Predigtuhr und die große historische Orgel zu entdecken. Die Predigtuhr erinnert daran, dass Predigten einst zeitlich begrenzt werden sollten.",
      photo: "Fotografiert den Turm so, dass das Schiff auf der Spitze möglichst gut zu erkennen ist – gern zusammen mit eurer Crew.",
      nextClue: "Wo früher Waren in einem Speicher lagen, werden heute Geschichten, Wissen und Erinnerungen gesammelt. Sucht das historische Gebäude mit dem Namen eines Mannes an der Fassade.",
      nextHint: "Heute befindet sich dort die Stadtbibliothek. Der Gebäudename beginnt mit „Hermann“.",
    },
    {
      id: 3,
      title: "Stadtbibliothek · Hermann-Tempel-Haus",
      kicker: "Vom Speicher zum Wissen",
      location: { name: "Stadtbibliothek / Hermann-Tempel-Haus", address: "Wilhelminengang 2, 26789 Leer", lat: 53.227240, lon: 7.451810 },
      destinationAnswers: ["Stadtbibliothek", "Bibliothek", "Bücherei", "Buecherei", "Stadtbibliothek Leer", "Hermann Tempel Haus", "Hermann-Tempel-Haus", "Hermann Tempel", "Tempel Haus"],
      taskTitle: "Der Name an der Fassade",
      task: () => `
        <p>Für diese Aufgabe müsst ihr nicht hinein. Sucht den Namen des historischen Gebäudes außen.</p>
        <p><strong>Wie heißt das Haus?</strong></p>
      `,
      taskPlaceholder: "Name des Gebäudes",
      taskHint: "Der vollständige Name besteht aus einem Vor- und Nachnamen plus „Haus“.",
      taskAnswers: () => ["Hermann-Tempel-Haus", "Hermann Tempel Haus", "Hermann Tempel", "Hermann-Tempel", "Tempel Haus", "Hermann Tempelhaus"],
      taskSolution: () => "Hermann-Tempel-Haus",
      evidence: {
        fragment: "1823",
        label: "Beweisstück 3",
        explanation: "Der dritte Aktenstreifen liefert das Jahr."
      },
      insideInfo: "Heute ist das Hermann-Tempel-Haus die Stadtbibliothek und ein Kulturort. In dem historischen Speicher werden Bücher, Medien und Veranstaltungen statt Waren gelagert.",
      photo: "Sucht ein markantes Detail der Speicherfassade und macht daraus ein möglichst rätselhaftes Beweisfoto.",
      nextClue: "Weiter geht es zu einem Haus, das den Namen eines außergewöhnlich starken Mannes trägt. An seiner Geschichte hängt auch ein Löwe.",
      nextHint: "Der Namensgeber ist eine biblische Figur. Das Haus steht in der Rathausstraße.",
    },
    {
      id: 4,
      title: "Haus Samson",
      kicker: "Der starke Mann und der Löwe",
      location: { name: "Haus Samson", address: "Rathausstraße 18, 26789 Leer", lat: 53.227058, lon: 7.450967 },
      destinationAnswers: ["Haus Samson", "Samson", "Wein Wolff", "Weinhandlung Wolff"],
      taskTitle: "Das Tier des starken Mannes",
      task: () => `
        <p>Untersucht die Außenseite und die Hinweise am Haus.</p>
        <p><strong>Welches Tier gehört zur Darstellung des starken Samson?</strong></p>
      `,
      taskPlaceholder: "Tier",
      taskHint: "Es gilt als König der Tiere.",
      taskAnswers: () => ["Löwe", "Loewe", "Löwen", "Loewen"],
      taskSolution: () => "Löwe",
      evidence: {
        fragment: "GEORG IV.",
        label: "Beweisstück 4",
        explanation: "Der vierte Aktenstreifen nennt den König."
      },
      insideInfo: "Im Erdgeschoss befindet sich eine traditionsreiche Weinhandlung. In den oberen Etagen verbirgt sich eine historische Sammlung zur ostfriesischen Wohnkultur.",
      photo: "Macht vor dem Haus ein Gruppenfoto im Stil eines alten, möglichst ernst blickenden Familienporträts – oder fotografiert ein besonderes Fassadendetail.",
      nextClue: "Nun sucht das Gebäude, das heute wie kaum ein anderes zeigt, dass Leer eine Stadt ist. Sein Turm überragt die Altstadt – zur Zeit der Stadtrechte stand es aber noch nicht.",
      nextHint: "Hier arbeiten Rat und Verwaltung; das Gebäude liegt nur wenige Schritte vom Hafen entfernt.",
    },
    {
      id: 5,
      title: "Historisches Rathaus",
      kicker: "Die Stadt im Wappen",
      location: { name: "Historisches Rathaus", address: "Rathausstraße 1, 26789 Leer", lat: 53.226609, lon: 7.450649 },
      destinationAnswers: ["Historisches Rathaus", "Rathaus", "Rathaus Leer", "Leeraner Rathaus", "Rathaus Leer Ostfriesland"],
      taskTitle: "Ein Buchstabe für Leer",
      task: () => `
        <p>Sucht draußen am oder rund um das Rathaus nach dem Leeraner Stadtwappen.</p>
        <p><strong>Welcher einzelne Buchstabe steht im Zentrum des Wappens?</strong></p>
      `,
      taskPlaceholder: "Ein Buchstabe",
      taskHint: "Der Buchstabe ist zugleich der Anfangsbuchstabe der Stadt.",
      taskAnswers: () => ["L", "Buchstabe L", "L wie Leer"],
      taskSolution: () => "L",
      evidence: {
        fragment: "FLECKEN LEER",
        label: "Beweisstück 5",
        explanation: "Der fünfte Aktenstreifen nennt den Ort im historischen Schlusssatz."
      },
      insideInfo: "Im Inneren des Historischen Rathauses sind bei Führungen unter anderem Wand- und Deckenmalereien, das Treppenhaus und der Festsaal sehenswert. Das Rathaus selbst wurde erst 1889 bis 1894 erbaut.",
      photo: "Macht ein Gruppenfoto mit dem Rathaus im Hintergrund – so, dass das Gebäude klar erkennbar bleibt.",
      nextClue: "Für das Finale geht es ans Wasser. Sucht das Gebäude, an dem früher Waren gewogen wurden. Über den Eingängen erinnert das passende Arbeitsgerät noch heute daran.",
      nextHint: "Das Ziel steht unmittelbar am Museumshafen und heißt nach seiner früheren Funktion.",
    },
    {
      id: 6,
      title: "Alte Waage & Museumshafen",
      kicker: "Das Finale am Wasser",
      location: { name: "Alte Waage", address: "Neue Straße 1, 26789 Leer", lat: 53.226400, lon: 7.451719 },
      destinationAnswers: ["Alte Waage", "Waage", "Historische Waage", "Museumshafen", "Alte Waage und Museumshafen", "Alte Waage & Museumshafen"],
      taskTitle: "Was verrät die alte Funktion?",
      task: () => `
        <p>Schaut euch die Fassade von draußen genau an.</p>
        <p><strong>Welches Arbeitsgerät ist über den Eingängen dargestellt und verrät die frühere Funktion des Gebäudes?</strong></p>
      `,
      taskPlaceholder: "Arbeitsgerät",
      taskHint: "Damit wurde bestimmt, wie schwer die Waren waren.",
      taskAnswers: () => ["Waage", "Waagschalen", "Waagschale", "Schalenwaage", "Balkenwaage", "bekrönte Waagschalen", "Waage mit Schalen"],
      taskSolution: () => "Waage / Waagschalen",
      evidence: {
        fragment: "RECHTE EINER STADT",
        label: "Beweisstück 6",
        explanation: "Der letzte Aktenstreifen vervollständigt die historische Aussage."
      },
      insideInfo: "Das Gebäude erinnert an Leers lange Handelsgeschichte. Heute wird die Alte Waage gastronomisch genutzt; direkt davor und daneben bildet der Museumshafen den passenden Abschluss der Route.",
      photo: "Macht euer Abschlussfoto am Hafen – mit Alter Waage, Wasser oder historischen Schiffen als Kulisse.",
      nextClue: "",
      nextHint: ""
    }
  ];


  const ARCHIVE_NOTES = {
    1: "Teelke steht für die ostfriesische Teekultur und den traditionsreichen Leeraner Teehandel.",
    2: "Auf der Großen Kirche dreht sich das Schepken Christi – ein dreimastiges Schiff hoch über den Dächern Leers.",
    3: "Das Hermann-Tempel-Haus war einst ein Speicher. Heute werden dort in der Stadtbibliothek Wissen, Bücher und Geschichten gesammelt.",
    4: "Haus Samson erinnert mit Samson und dem Löwen an alte Handelswege und die Geschichte eines der bekanntesten Häuser der Altstadt.",
    5: "Im Stadtwappen steht das L für Leer. Das Historische Rathaus entstand erst Jahrzehnte nach der Stadterhebung.",
    6: "Die Alte Waage erzählt vom Handel am Wasser. Waagschalen an der Fassade erinnern daran, dass hier Waren gewogen wurden."
  };

  const state = {
    client: null,
    user: null,
    game: null,
    channel: null,
    busy: false,
    revealHint: false,
    setupOpen: false,
    turnstileWidgetId: null,
    photoFile: null,
    photoUrl: "",
    photoStationId: null,
    compassStationId: null,
    compassWatchId: null,
    compassHeading: null,
    compassPosition: null,
    compassOrientationHandler: null,
    compassActive: false,
    connecting: false,
    lastConnectionError: null,
    memoryOutputUrl: "",
    memoryVideoUrl: "",
    slideshowTimer: null
  };

  const app = document.getElementById("app");
  const toast = document.getElementById("toast");
  const connectionBadge = document.getElementById("connectionBadge");
  const homeButton = document.getElementById("homeButton");

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function normalizeSetup(setup) {
    return { ...DEFAULT_SETUP, ...(setup || {}) };
  }

  function normalizeRoute() {
    return { ...DEFAULT_ROUTE, ...(window.AKTE1823_CONFIG?.route || {}) };
  }

  function normalizeAnswers(answers) {
    return answers && typeof answers === "object" ? answers : {};
  }

  function normalizeGuess(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ß/g, "ss")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }

  const ANSWER_STOP_WORDS = new Set([
    "und", "oder", "ein", "eine", "einer", "einem", "einen", "der", "die", "das", "den", "dem", "des",
    "im", "in", "am", "an", "auf", "mit", "von", "zu", "zum", "zur", "ist", "sind", "es", "da", "dort", "oben"
  ]);

  function editDistance(a, b) {
    if (a === b) return 0;
    if (!a.length) return b.length;
    if (!b.length) return a.length;
    const previous = Array.from({ length: b.length + 1 }, (_, index) => index);
    for (let i = 1; i <= a.length; i += 1) {
      let diagonal = previous[0];
      previous[0] = i;
      for (let j = 1; j <= b.length; j += 1) {
        const old = previous[j];
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        previous[j] = Math.min(previous[j] + 1, previous[j - 1] + 1, diagonal + cost);
        diagonal = old;
      }
    }
    return previous[b.length];
  }

  function answerTokenMatches(guessToken, solutionToken) {
    if (guessToken === solutionToken) return true;
    if (solutionToken.length >= 4 && guessToken.includes(solutionToken)) return true;
    if (guessToken.length >= 4 && solutionToken.includes(guessToken)) return true;
    const minLength = Math.min(guessToken.length, solutionToken.length);
    if (minLength < 4) return false;
    const tolerance = Math.max(guessToken.length, solutionToken.length) >= 8 ? 2 : 1;
    return editDistance(guessToken, solutionToken) <= tolerance;
  }

  function inputMatches(value, acceptedValues) {
    const guess = normalizeGuess(value);
    if (!guess) return false;
    const guessTokens = guess.split(" ").filter(Boolean);

    return (acceptedValues || []).some((accepted) => {
      const solution = normalizeGuess(accepted);
      if (!solution) return false;
      if (guess === solution) return true;

      const solutionTokens = solution.split(" ").filter(Boolean);
      if (/^\d+$/.test(solution)) return guessTokens.includes(solution);
      if (solution.length === 1) return guessTokens.includes(solution);

      // Ganze richtige Begriffe dürfen auch in einem normalen Satz stehen.
      if (solution.length >= 4 && guess.includes(solution)) return true;

      // Bei einem einzelnen Lösungswort sind kleine Tippfehler und Wortformen erlaubt.
      if (solutionTokens.length === 1) {
        return guessTokens.some((token) => answerTokenMatches(token, solutionTokens[0]));
      }

      // Bei mehrteiligen Antworten müssen alle wichtigen Begriffe vorkommen,
      // Reihenfolge, Füllwörter und kleine Tippfehler spielen aber keine Rolle.
      const requiredTokens = solutionTokens.filter((token) => !ANSWER_STOP_WORDS.has(token) && token.length > 1);
      if (!requiredTokens.length) return false;
      return requiredTokens.every((solutionToken) =>
        guessTokens.some((guessToken) => answerTokenMatches(guessToken, solutionToken))
      );
    });
  }

  function getStationProgress(stationId) {
    const raw = normalizeAnswers(state.game?.answers)[String(stationId)];
    if (raw && typeof raw === "object" && !Array.isArray(raw)) return raw;
    if (typeof raw === "string" && raw.trim()) return { taskAnswer: raw.trim() };
    return {};
  }

  function answersWithStationPatch(stationId, patch) {
    const answers = { ...normalizeAnswers(state.game.answers) };
    answers[String(stationId)] = { ...getStationProgress(stationId), ...patch };
    return answers;
  }

  function unlockedEvidence() {
    return STATIONS.filter((station) => getStationProgress(station.id).taskSolved).map((station) => station.evidence);
  }

  function renderEvidenceCards(evidenceItems = unlockedEvidence()) {
    if (!evidenceItems.length) return `<p class="help">Noch keine Beweisstücke geöffnet.</p>`;
    return `<div class="evidence-grid">${evidenceItems.map((evidence) => `
      <div class="evidence-card">
        <span>${escapeHtml(evidence.label)}</span>
        <strong>${escapeHtml(evidence.fragment)}</strong>
      </div>
    `).join("")}</div>`;
  }


  function showToast(message, duration = 2600) {
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => {
      toast.hidden = true;
    }, duration);
  }

  function setBusy(value) {
    state.busy = value;
    document.querySelectorAll("button, input, textarea").forEach((element) => {
      if (element.dataset.keepEnabled === "true") return;
      element.disabled = value;
    });
  }

  function setConnection(text, mode = "") {
    connectionBadge.textContent = text;
    connectionBadge.className = `connection-badge ${mode}`.trim();
  }

  function configIsReady() {
    const config = window.AKTE1823_CONFIG || {};
    return Boolean(
      config.supabaseUrl &&
      config.supabaseAnonKey &&
      !config.supabaseUrl.includes("DEINE_") &&
      !config.supabaseAnonKey.includes("DEIN_")
    );
  }

  function captchaIsConfigured() {
    const siteKey = window.AKTE1823_CONFIG?.turnstileSiteKey || "";
    return Boolean(siteKey && !siteKey.includes("DEIN_"));
  }

  function waitForTurnstile(timeoutMs = 10000) {
    return new Promise((resolve, reject) => {
      if (window.turnstile?.render) {
        resolve(window.turnstile);
        return;
      }

      const started = Date.now();
      const timer = window.setInterval(() => {
        if (window.turnstile?.render) {
          window.clearInterval(timer);
          resolve(window.turnstile);
        } else if (Date.now() - started >= timeoutMs) {
          window.clearInterval(timer);
          reject(new Error("Turnstile konnte nicht geladen werden."));
        }
      }, 100);
    });
  }

  function renderCaptchaGate(message = "Bitte bestätigt kurz, dass ihr keine automatisierte Anfrage seid.") {
    app.innerHTML = `
      <section class="hero">
        <p class="eyebrow">Sicherheitsprüfung</p>
        <h1>Akte 1823</h1>
        <p>${escapeHtml(message)}</p>
      </section>
      <section class="panel captcha-panel">
        <h2>Verbindung vorbereiten</h2>
        <div id="turnstileWidget" class="turnstile-slot" aria-label="Cloudflare Turnstile Sicherheitsprüfung"></div>
        <p id="captchaStatus" class="help" aria-live="polite">Die Prüfung startet automatisch.</p>
      </section>
    `;
  }

  async function getCaptchaToken() {
    if (!captchaIsConfigured()) {
      throw new Error("Turnstile Site Key fehlt in config.js.");
    }

    renderCaptchaGate();
    setConnection("Prüfung …");
    const turnstile = await waitForTurnstile();
    const container = document.getElementById("turnstileWidget");
    const status = document.getElementById("captchaStatus");

    return new Promise((resolve, reject) => {
      let settled = false;

      const fail = (message) => {
        if (settled) return;
        settled = true;
        if (status) status.textContent = message;
        reject(new Error(message));
      };

      try {
        state.turnstileWidgetId = turnstile.render(container, {
          sitekey: window.AKTE1823_CONFIG.turnstileSiteKey,
          theme: "light",
          action: "anonymous-signin",
          callback: (token) => {
            if (settled) return;
            settled = true;
            if (status) status.textContent = "Prüfung erfolgreich. Anmeldung läuft …";
            resolve(token);
          },
          "error-callback": () => fail("Die Sicherheitsprüfung ist fehlgeschlagen. Bitte die Seite neu laden."),
          "expired-callback": () => {
            if (status) status.textContent = "Die Prüfung ist abgelaufen. Bitte erneut bestätigen.";
            if (state.turnstileWidgetId !== null) turnstile.reset(state.turnstileWidgetId);
          }
        });
      } catch (error) {
        fail(error?.message || "Die Sicherheitsprüfung konnte nicht gestartet werden.");
      }
    });
  }

  function generateCode(length = 6) {
    const values = new Uint32Array(length);
    crypto.getRandomValues(values);
    return Array.from(values, (value) => CODE_CHARS[value % CODE_CHARS.length]).join("");
  }

  function cleanGameCode(value) {
    return String(value || "").toUpperCase().replace(/[^A-Z2-9]/g, "").slice(0, 6);
  }

  function codeFromUrl() {
    try {
      return cleanGameCode(new URL(location.href).searchParams.get("code"));
    } catch {
      return "";
    }
  }

  function getRecentGames() {
    const items = safeJsonParse(localStorage.getItem(RECENT_GAMES_KEY));
    return Array.isArray(items) ? items.filter((item) => item?.id) : [];
  }

  function storeRecentGames(items) {
    localStorage.setItem(RECENT_GAMES_KEY, JSON.stringify(items.slice(0, 8)));
  }

  function rememberRecentGame(game) {
    if (!game?.id) return;
    const normalizedGame = {
      ...game,
      setup: normalizeSetup(game.setup),
      answers: normalizeAnswers(game.answers)
    };
    const currentStation = Number(normalizedGame.current_station || 0);
    const entry = {
      id: normalizedGame.id,
      code: normalizedGame.code,
      crewName: normalizedGame.setup.crewName || "Crew",
      currentStation,
      completed: currentStation >= 7,
      updatedAt: Date.now(),
      snapshot: normalizedGame
    };
    const items = getRecentGames().filter((item) => item.id !== entry.id);
    items.unshift(entry);
    storeRecentGames(items);
  }

  function saveGameSnapshot(game) {
    if (!game?.id) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ id: game.id, code: game.code }));
    localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(game));
    rememberRecentGame(game);
  }

  function clearStoredGame() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(SNAPSHOT_KEY);
  }

  function recentGamesMarkup() {
    const items = getRecentGames();
    if (!items.length) return "";
    return `
      <section class="panel recent-games-panel">
        <h2>Spiele auf diesem Handy</h2>
        <p class="help">Abgeschlossene Runden bleiben hier erhalten. Eine neue Runde bekommt einen eigenen Spielcode.</p>
        <div class="recent-game-list">
          ${items.map((item) => {
            const status = item.completed
              ? "Abgeschlossen"
              : item.currentStation > 0
                ? `Akte ${Math.min(item.currentStation, 6)} von 6`
                : "Noch nicht gestartet";
            const date = item.updatedAt ? new Date(item.updatedAt).toLocaleDateString("de-DE") : "";
            return `
              <article class="recent-game-card">
                <div>
                  <strong>${escapeHtml(item.crewName || "Crew")}</strong>
                  <span>Code ${escapeHtml(item.code || "–")} · ${escapeHtml(status)}${date ? ` · ${escapeHtml(date)}` : ""}</span>
                </div>
                <div class="recent-game-actions">
                  <button class="btn btn-secondary open-recent-game" type="button" data-game-id="${escapeHtml(item.id)}">Öffnen</button>
                  <button class="btn btn-text delete-recent-game" type="button" data-game-id="${escapeHtml(item.id)}">Löschen</button>
                </div>
              </article>
            `;
          }).join("")}
        </div>
      </section>
    `;
  }

  function deleteRecentGame(gameId) {
    const item = getRecentGames().find((entry) => entry.id === gameId);
    if (!item) return;

    const crewName = item.crewName || "Crew";
    const code = item.code || "–";
    const confirmed = window.confirm(
      `Spiel „${crewName}“ (Code ${code}) nur von diesem Handy löschen?\n\n` +
      "Der gemeinsame Spielstand in Supabase und die Spiele auf anderen Handys bleiben erhalten."
    );
    if (!confirmed) return;

    storeRecentGames(getRecentGames().filter((entry) => entry.id !== gameId));

    const stored = safeJsonParse(localStorage.getItem(STORAGE_KEY));
    if (stored?.id === gameId) clearStoredGame();

    renderHome();
    showToast("Spiel wurde von diesem Handy gelöscht.");
  }

  async function openRecentGame(gameId) {
    const item = getRecentGames().find((entry) => entry.id === gameId);
    if (!item) return;

    if (state.client && state.user) {
      setBusy(true);
      try {
        const { data, error } = await state.client
          .from("games")
          .select("*")
          .eq("id", gameId)
          .maybeSingle();
        if (!error && data) {
          await enterGame(data);
          return;
        }
      } finally {
        setBusy(false);
      }
    }

    if (item.snapshot) {
      state.game = {
        ...item.snapshot,
        setup: normalizeSetup(item.snapshot.setup),
        answers: normalizeAnswers(item.snapshot.answers)
      };
      saveGameSnapshot(state.game);
      renderGame();
      setConnection("Gespeicherter Stand", "offline");
      showToast("Gespeicherter Spielstand geöffnet. Änderungen brauchen eine Live-Verbindung.", 5000);
    }
  }

  function restoreCachedGameView() {
    const snapshot = safeJsonParse(localStorage.getItem(SNAPSHOT_KEY));
    if (!snapshot?.id) return false;
    state.game = {
      ...snapshot,
      setup: normalizeSetup(snapshot.setup),
      answers: normalizeAnswers(snapshot.answers)
    };
    renderGame();
    setConnection("Verbinden …");
    return true;
  }

  function renderOpening(message = "Die gemeinsame Ermittlungsakte wird geöffnet …") {
    app.innerHTML = `
      <section class="hero">
        <p class="eyebrow">Historisches Stadtspiel durch Leer</p>
        <h1>Akte 1823</h1>
        <p>${escapeHtml(message)}</p>
      </section>
      <section class="panel">
        <p class="help">Einen Augenblick – Spielstand und Sicherheitsprüfung werden vorbereitet.</p>
      </section>
    `;
  }

  async function initSupabase() {
    if (state.connecting) return;
    state.connecting = true;
    state.lastConnectionError = null;

    try {
      if (!configIsReady()) {
        renderMissingConfig();
        setConnection("Noch nicht eingerichtet", "offline");
        return;
      }

      if (!window.supabase?.createClient) {
        throw new Error("Die Supabase-Bibliothek konnte nicht geladen werden.");
      }

      const { supabaseUrl, supabaseAnonKey } = window.AKTE1823_CONFIG;
      if (!state.client) {
        state.client = window.supabase.createClient(supabaseUrl, supabaseAnonKey, {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: false
          }
        });
      }

      setConnection("Verbindung prüfen …");
      let { data: sessionData, error: sessionError } = await state.client.auth.getSession();
      if (sessionError) throw sessionError;

      if (!sessionData.session) {
        setConnection("Anmelden …");
        const captchaEnabled = Boolean(window.AKTE1823_CONFIG?.captchaEnabled);
        let result;
        if (captchaEnabled) {
          const captchaToken = await getCaptchaToken();
          result = await state.client.auth.signInAnonymously({
            options: { captchaToken }
          });
        } else {
          result = await state.client.auth.signInAnonymously();
        }
        if (result.error) throw result.error;
        sessionData = { session: result.data.session };
      }

      if (!sessionData.session?.user) {
        throw new Error("Es konnte keine anonyme Sitzung erstellt werden.");
      }

      state.user = sessionData.session.user;
      setConnection(navigator.onLine ? "Online" : "Offline", navigator.onLine ? "online" : "offline");

      const sharedCode = codeFromUrl();
      if (sharedCode) {
        await joinGame(sharedCode, { fromLink: true });
        return;
      }

      await restoreGame();
    } catch (error) {
      state.lastConnectionError = error;
      console.error(error);
      setConnection("Verbindung gestört", "offline");
      if (state.game) {
        renderGame();
        showToast("Der gespeicherte Spielstand ist geöffnet. Die Live-Verbindung fehlt gerade.", 5000);
      } else {
        renderHome();
        showToast(connectionMessage(error), 6000);
      }
    } finally {
      state.connecting = false;
    }
  }

  async function restoreGame() {
    const stored = safeJsonParse(localStorage.getItem(STORAGE_KEY));
    if (!stored?.id) {
      renderHome();
      return;
    }

    const { data, error } = await state.client
      .from("games")
      .select("*")
      .eq("id", stored.id)
      .maybeSingle();

    if (error) {
      if (!state.game) restoreCachedGameView();
      throw error;
    }

    if (!data) {
      clearStoredGame();
      state.game = null;
      renderHome();
      return;
    }

    await enterGame(data);
  }

  function safeJsonParse(value) {
    try { return JSON.parse(value); } catch { return null; }
  }

  async function createGame() {
    if (!state.client || !state.user) {
      showToast("Die Verbindung wird noch vorbereitet. Bitte gleich erneut versuchen.");
      return;
    }
    setBusy(true);
    try {
      let game = null;
      let lastError = null;

      for (let attempt = 0; attempt < 5 && !game; attempt += 1) {
        const code = generateCode();
        const { data, error } = await state.client.rpc("create_game", { p_code: code });
        if (!error && data) {
          game = Array.isArray(data) ? data[0] : data;
          break;
        }
        lastError = error;
        if (!String(error?.message || "").toLowerCase().includes("duplicate")) break;
      }

      if (!game) throw lastError || new Error("Spiel konnte nicht erstellt werden.");
      await enterGame(game);
      showToast(`Spiel ${game.code} wurde erstellt.`);
    } catch (error) {
      handleError(error, "Das Spiel konnte nicht erstellt werden.");
    } finally {
      setBusy(false);
    }
  }

  async function joinGame(code, options = {}) {
    const cleanCode = cleanGameCode(code);
    if (cleanCode.length !== 6) {
      showToast("Bitte den sechsstelligen Spielcode eingeben.");
      return false;
    }

    if (!state.client || !state.user) {
      showToast("Die Verbindung wird noch vorbereitet. Bitte gleich erneut versuchen.");
      return false;
    }

    setBusy(true);
    try {
      const { data, error } = await state.client.rpc("join_game_by_code", { p_code: cleanCode });
      if (error) throw error;
      const game = Array.isArray(data) ? data[0] : data;
      if (!game) throw new Error("Der Spielcode wurde nicht gefunden.");
      await enterGame(game);
      if (options.fromLink) {
        const cleanUrl = new URL(location.href);
        cleanUrl.searchParams.delete("code");
        history.replaceState({}, "", cleanUrl);
      }
      showToast(`Mit Spiel ${game.code} verbunden.`);
      return true;
    } catch (error) {
      if (options.fromLink) {
        renderHome();
        const panel = document.getElementById("joinPanel");
        const input = document.getElementById("joinCode");
        if (panel) panel.hidden = false;
        if (input) input.value = cleanCode;
      }
      handleError(error, "Der Spielcode wurde nicht gefunden oder ist nicht mehr gültig.");
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function enterGame(game) {
    state.game = {
      ...game,
      setup: normalizeSetup(game.setup),
      answers: normalizeAnswers(game.answers)
    };
    state.revealHint = false;
    state.setupOpen = false;
    saveGameSnapshot(state.game);
    await subscribeToGame(game.id);
    renderGame();
  }

  async function subscribeToGame(gameId) {
    if (state.channel) {
      await state.client.removeChannel(state.channel);
      state.channel = null;
    }

    state.channel = state.client
      .channel(`akte1823-${gameId}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "games", filter: `id=eq.${gameId}` },
        (payload) => {
          state.game = {
            ...payload.new,
            setup: normalizeSetup(payload.new.setup),
            answers: normalizeAnswers(payload.new.answers)
          };
          state.revealHint = false;
          saveGameSnapshot(state.game);
          renderGame();
          showToast("Der gemeinsame Spielstand wurde aktualisiert.", 1500);
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") setConnection("Live verbunden", "online");
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") setConnection("Verbindung gestört", "offline");
      });
  }

  async function updateGame(patch, successMessage = "") {
    if (!state.game) return;
    setBusy(true);
    try {
      const { data, error } = await state.client
        .from("games")
        .update(patch)
        .eq("id", state.game.id)
        .select("*")
        .single();
      if (error) throw error;
      state.game = {
        ...data,
        setup: normalizeSetup(data.setup),
        answers: normalizeAnswers(data.answers)
      };
      saveGameSnapshot(state.game);
      renderGame();
      if (successMessage) showToast(successMessage);
      return true;
    } catch (error) {
      handleError(error, "Die Änderung konnte nicht gespeichert werden.");
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function saveSetup(form) {
    const data = new FormData(form);
    const crewName = data.get("crewName")?.trim() || "";
    if (!crewName) {
      showToast("Bitte zuerst einen Crew-Namen eingeben.");
      return false;
    }
    const setup = normalizeSetup({ crewName });
    return updateGame({ setup }, "Crew-Name gespeichert.");
  }

  async function saveAnswer(stationId, value) {
    const answers = { ...normalizeAnswers(state.game.answers), [String(stationId)]: String(value || "").trim() };
    await updateGame({ answers }, "Antwort gespeichert.");
  }

  async function goToStation(stationNumber) {
    const target = Math.max(0, Math.min(7, Number(stationNumber)));
    stopCompass();
    clearPhotoState();
    await updateGame({ current_station: target }, target === 7 ? "Abschlussakte geöffnet." : "Nächste Station geöffnet.");
  }

  async function leaveGame() {
    stopCompass();
    if (state.game) rememberRecentGame(state.game);
    if (state.channel && state.client) {
      await state.client.removeChannel(state.channel);
      state.channel = null;
    }
    state.game = null;
    clearStoredGame();
    renderHome();
    showToast("Spiel auf diesem Handy verlassen. Der Stand bleibt unten gespeichert.");
  }

  async function startSeparateGame() {
    if (state.game) rememberRecentGame(state.game);
    if (state.channel && state.client) {
      await state.client.removeChannel(state.channel);
      state.channel = null;
    }
    state.game = null;
    clearStoredGame();
    renderHome();
    await createGame();
  }

  async function returnHomeKeepingGame() {
    if (state.game) rememberRecentGame(state.game);
    if (state.channel && state.client) {
      await state.client.removeChannel(state.channel);
      state.channel = null;
    }
    state.game = null;
    clearStoredGame();
    renderHome();
  }

  function renderMissingConfig() {
    app.innerHTML = `
      <section class="hero">
        <p class="eyebrow">Einrichtung erforderlich</p>
        <h1>Akte 1823</h1>
        <p>Die App ist gebaut, aber noch nicht mit deinem Supabase-Projekt verbunden.</p>
      </section>
      <section class="panel">
        <h2>Supabase ist noch nicht vollständig verbunden</h2>
        <p>Trage in <code>config.js</code> noch den <strong>Publishable Key</strong> ein. Project URL und Turnstile Site Key sind bereits vorbereitet.</p>
        <p class="help">Den geheimen service_role-Schlüssel niemals in die Datei eintragen.</p>
      </section>
    `;
  }

  function renderFatal(message) {
    renderConnectionProblem(new Error(message));
  }

  function connectionMessage(error) {
    const raw = String(error?.message || "").toLowerCase();
    if (raw.includes("captcha") || raw.includes("turnstile")) {
      return "Die CAPTCHA-Einstellung in Supabase passt noch nicht zur App. CAPTCHA bitte vorübergehend ausschalten.";
    }
    if (raw.includes("rate limit") || raw.includes("too many requests") || raw.includes("429")) {
      return "Es wurden zu viele Anmeldeversuche durchgeführt. Bitte später erneut versuchen.";
    }
    if (raw.includes("anonymous sign-ins are disabled")) {
      return "Anonyme Anmeldungen sind in Supabase ausgeschaltet.";
    }
    if (!navigator.onLine) return "Dieses Gerät ist gerade offline.";
    return "Die Live-Verbindung konnte gerade nicht hergestellt werden.";
  }

  function renderConnectionProblem(error) {
    app.innerHTML = `
      <section class="hero">
        <p class="eyebrow">Akte 1823</p>
        <h1>Verbindung erneut versuchen</h1>
        <p>${escapeHtml(connectionMessage(error))}</p>
      </section>
      <section class="panel">
        <p>Die App selbst ist geöffnet. Für den gemeinsamen Spielstand braucht dieses Gerät noch eine erfolgreiche Verbindung.</p>
        <div class="actions">
          <button id="retryConnectionButton" class="btn btn-primary" type="button">Erneut verbinden</button>
          <button id="showHomeAnywayButton" class="btn btn-secondary" type="button">Startseite anzeigen</button>
        </div>
        <p class="help">Hilft das nicht, die Seite einmal direkt in Chrome oder Safari öffnen und VPN oder Werbeblocker testweise ausschalten.</p>
      </section>
    `;
    document.getElementById("retryConnectionButton")?.addEventListener("click", () => {
      renderOpening("Die Verbindung wird erneut aufgebaut …");
      initSupabase();
    });
    document.getElementById("showHomeAnywayButton")?.addEventListener("click", renderHome);
  }

  function renderHome() {
    state.game = null;
    app.innerHTML = `
      <section class="hero">
        <p class="eyebrow">Historisches Stadtspiel durch Leer</p>
        <h1>Akte 1823</h1>
        <p>Sechs zusammenhängende Spuren führen zu Fuß durch Leers Altstadt bis zum Museumshafen. Jede gelöste Aufgabe öffnet ein Beweisstück – und erst das erratene nächste Ziel öffnet die folgende Akte.</p>
        ${state.lastConnectionError ? `
          <div class="callout">
            <strong>Die Live-Verbindung fehlt gerade.</strong> ${escapeHtml(connectionMessage(state.lastConnectionError))}
            <button id="homeRetryButton" class="btn btn-secondary compact-button" type="button">Verbindung erneut versuchen</button>
          </div>
        ` : !state.user ? `<p class="callout"><strong>Verbindung wird vorbereitet.</strong> Die Startseite bleibt dabei benutzbar.</p>` : ""}
        <div class="actions two">
          <button id="createGameButton" class="btn btn-primary" type="button" ${state.user ? "" : "disabled"}>Neues Spiel starten</button>
          <button id="showJoinButton" class="btn btn-secondary" type="button">Mit Code beitreten</button>
        </div>
      </section>

      <section id="joinPanel" class="panel" hidden>
        <h2>Spielcode eingeben</h2>
        <div class="join-row">
          <label class="field" style="margin-top:0">
            <span>Sechsstelliger Code</span>
            <input id="joinCode" class="code-input" inputmode="text" autocomplete="one-time-code" maxlength="6" placeholder="ABC234">
          </label>
          <button id="joinButton" class="btn btn-primary" type="button" style="align-self:end" ${state.user ? "" : "disabled"}>Beitreten</button>
        </div>
      </section>

      ${recentGamesMarkup()}

      <section class="panel">
        <h2>Gemeinsam spielen</h2>
        <p>Eine Person startet das Spiel und legt den Crew-Namen fest. Weitere Mitspielende öffnen den geteilten Link oder treten mit dem Code bei. Alle verbundenen Geräte sehen denselben Fortschritt. Jede neue Runde erhält einen eigenen Spielcode; ältere Runden bleiben auf diesem Handy erhalten.</p>
      </section>
    `;

    document.getElementById("createGameButton")?.addEventListener("click", createGame);
    document.getElementById("homeRetryButton")?.addEventListener("click", () => {
      state.lastConnectionError = null;
      renderHome();
      initSupabase();
    });
    document.getElementById("showJoinButton")?.addEventListener("click", () => {
      const panel = document.getElementById("joinPanel");
      panel.hidden = !panel.hidden;
      if (!panel.hidden) document.getElementById("joinCode")?.focus();
    });
    document.getElementById("joinButton")?.addEventListener("click", () => joinGame(document.getElementById("joinCode")?.value));
    document.getElementById("joinCode")?.addEventListener("input", (event) => {
      event.target.value = event.target.value.toUpperCase().replace(/[^A-Z2-9]/g, "").slice(0, 6);
    });
    document.getElementById("joinCode")?.addEventListener("keydown", (event) => {
      if (event.key === "Enter") joinGame(event.currentTarget.value);
    });
    document.querySelectorAll(".open-recent-game").forEach((button) => {
      button.addEventListener("click", () => openRecentGame(button.dataset.gameId));
    });
    document.querySelectorAll(".delete-recent-game").forEach((button) => {
      button.addEventListener("click", () => deleteRecentGame(button.dataset.gameId));
    });
  }

  function renderGameHeader() {
    const current = Number(state.game.current_station || 0);
    const steps = STATIONS.map((station) => {
      const progress = getStationProgress(station.id);
      const complete = Boolean(progress.taskSolved && (station.id === 6 || progress.destinationSolved));
      const className = complete || current > station.id ? "done" : current === station.id ? "current" : "";
      return `<div class="progress-step ${className}" aria-label="Akte ${station.id}">${complete || current > station.id ? "✓" : station.id}</div>`;
    }).join("");

    const crewName = normalizeSetup(state.game.setup).crewName || "Crew";

    return `
      <section class="game-head">
        <div class="game-head-top compact-game-head">
          <div class="crew-summary">
            <div class="game-label">Crew</div>
            <div class="game-code crew-code">${escapeHtml(crewName)}</div>
          </div>
          <details class="game-code-details">
            <summary>Spielcode anzeigen</summary>
            <div class="game-code-panel">
              <div class="game-code-main">
                <div class="game-label">Spielcode</div>
                <div class="game-code game-code-visible">${escapeHtml(state.game.code)}</div>
                <div class="game-code-help">Diesen Code könnt ihr vorlesen oder unter „Mit Code beitreten“ eingeben.</div>
              </div>
              <div class="game-share-actions">
                <button id="copyCodeButton" class="btn btn-secondary" type="button">Code kopieren</button>
                <button id="shareLinkButton" class="btn btn-secondary" type="button">Link teilen</button>
              </div>
            </div>
          </details>
        </div>
        <div class="progress-wrap"><div class="progress-list">${steps}</div></div>
      </section>
    `;
  }

  function renderGame() {
    if (!state.game) return renderHome();
    const current = Number(state.game.current_station || 0);
    const isHost = state.game.host_user_id === state.user?.id;

    if (state.photoStationId !== current) clearPhotoState();

    let content = renderGameHeader();
    if (current === 0) content += renderLobby(isHost);
    else if (current >= 1 && current <= 6) content += renderStation(STATIONS[current - 1]);
    else content += renderFinal();

    content += `
      <div class="actions" style="margin-top:1rem">
        <button id="leaveGameButton" class="btn btn-text" type="button">Spiel auf diesem Handy verlassen</button>
      </div>
    `;

    app.innerHTML = content;
    bindGameCommonEvents();

    if (current === 0) bindLobbyEvents(isHost);
    else if (current >= 1 && current <= 6) bindStationEvents(current);
    else bindFinalEvents();
  }

  function renderLobby(isHost) {
    const setup = normalizeSetup(state.game.setup);

    if (!isHost) {
      return `
        <section class="waiting">
          <div class="waiting-icon" aria-hidden="true">⌛</div>
          <h2>Die Ermittlungsakte wird vorbereitet</h2>
          <p>Die Person, die das Spiel gestartet hat, legt noch den Crew-Namen fest und öffnet anschließend die Auftaktspur.</p>
        </section>
      `;
    }

    return `
      <section class="panel">
        <h2>Neue Spurensuche starten</h2>
        <p>Gebt nur einen Crew-Namen ein. Danach erhält die ganze Gruppe dieselbe Auftaktspur. Weitere Geräte können jederzeit mit dem sechsstelligen Spielcode beitreten.</p>
        <form id="setupForm" class="setup-grid">
          <label class="field">
            <span>Crew-Name</span>
            <input name="crewName" value="${escapeHtml(setup.crewName)}" placeholder="z. B. Hafenfüchse" maxlength="40" required>
          </label>
          <div class="setup-actions">
            <button id="startRouteButton" class="btn btn-primary" type="submit">Auftaktspur öffnen</button>
          </div>
        </form>
      </section>
    `;
  }

  function renderCompassHelp(targetStation, summaryText = "Kompass & Navigation öffnen") {
    return `
      <details class="location-details compact-help">
        <summary>${escapeHtml(summaryText)}</summary>
        <p>Die Kompassnadel zeigt ungefähr in Richtung des gesuchten Ziels, ohne seinen Namen zu verraten.</p>
        <button id="startCompassButton" class="btn btn-secondary" data-target-station="${targetStation.id}" type="button">Kompass-Hilfe starten</button>
        <div id="compassPanel" class="compass-panel" hidden>
          <p class="compass-warning"><strong>Nur zur Orientierung:</strong> GPS, Handysensoren, Gebäude und Metall können die Anzeige verfälschen. Achtet auf Straßenschilder und den Verkehr.</p>
          <div class="compass-dial" aria-label="Kompassnadel zum Ziel">
            <div class="compass-cardinal north">N</div>
            <div class="compass-cardinal east">O</div>
            <div class="compass-cardinal south">S</div>
            <div class="compass-cardinal west">W</div>
            <div id="compassNeedle" class="compass-needle" aria-hidden="true"><span>▲</span></div>
            <div class="compass-center" aria-hidden="true"></div>
          </div>
          <p id="compassStatus" class="compass-status" aria-live="polite">Standort und Kompass werden vorbereitet …</p>
          <div class="compass-values">
            <div><strong id="compassDistance">–</strong><span>Entfernung</span></div>
            <div><strong id="compassDirection">–</strong><span>Zielrichtung</span></div>
            <div><strong id="compassAccuracy">–</strong><span>GPS-Genauigkeit</span></div>
          </div>
          <button id="stopCompassButton" class="btn btn-text" type="button">Kompass beenden</button>
        </div>
        <details class="emergency-address">
          <summary>Adresse & Karten-Navigation</summary>
          <p><strong>${escapeHtml(targetStation.location.name)}</strong><br>${escapeHtml(targetStation.location.address)}</p>
          <a class="btn btn-secondary map-link" href="https://www.google.com/maps/dir/?api=1&destination=${targetStation.location.lat},${targetStation.location.lon}&travelmode=walking" target="_blank" rel="noopener noreferrer">Zu Fuß navigieren</a>
        </details>
        <p class="help">Der Standort bleibt auf diesem Handy und wird nicht in Supabase gespeichert.</p>
      </details>
    `;
  }

  function renderDestinationPuzzle(sourceStation, targetStation, mode) {
    const isOpening = mode === "arrival";
    const clue = isOpening ? targetStation.arrivalClue : sourceStation.nextClue;
    const hint = isOpening ? targetStation.arrivalHint : sourceStation.nextHint;
    const progress = getStationProgress(sourceStation.id);
    const previousGuess = isOpening ? (progress.arrivalGuess || "") : (progress.destinationGuess || "");
    const prefix = isOpening ? "arrival" : "destination";

    return `
      <section class="section clue-section">
        <h2 class="section-title"><span aria-hidden="true">⌕</span> ${isOpening ? "Auftaktspur" : "Letzte Aufgabe dieser Akte"}</h2>
        <div class="clue-card">
          <span class="clue-label">${isOpening ? "Findet den ersten Fundort" : "Erratet das nächste Ziel"}</span>
          <p>${escapeHtml(clue)}</p>
        </div>
        <label class="field">
          <span>Welcher Ort ist gesucht?</span>
          <input id="${prefix}Guess" value="${escapeHtml(previousGuess)}" autocomplete="off" placeholder="Name des Ortes">
        </label>
        <p class="answer-help">Ihr müsst den Namen nicht exakt treffen. Gängige Kurzformen und kleine Tippfehler werden akzeptiert.</p>
        <button id="check${isOpening ? "Arrival" : "Destination"}Button" class="btn btn-primary full-button" type="button">Ziel prüfen</button>
        <details class="hint-details">
          <summary>Hinweis zum Rätsel</summary>
          <p>${escapeHtml(hint)}</p>
        </details>
        ${renderCompassHelp(targetStation)}
        <button id="reveal${isOpening ? "Arrival" : "Destination"}Button" class="btn btn-danger full-button" type="button">Ziel aufdecken und weiterspielen</button>
      </section>
    `;
  }

  function renderPhotoSection(station) {
    return `
      <details class="optional-photo">
        <summary>Fotoaufgabe</summary>
        <p>${escapeHtml(station.photo)}</p>
        <div class="photo-actions">
          <button id="takePhotoButton" class="btn btn-primary" type="button">Kamera öffnen</button>
          <button id="choosePhotoButton" class="btn btn-secondary" type="button">Bild auswählen</button>
        </div>
        <input id="cameraInput" type="file" accept="image/*" capture="environment" hidden>
        <input id="galleryInput" type="file" accept="image/*" hidden>
        <div id="photoPreview" class="photo-preview" hidden>
          <img id="photoPreviewImage" alt="Vorschau des aufgenommenen Fotos">
          <div class="photo-preview-actions">
            <button id="sharePhotoButton" class="btn btn-secondary" type="button">Foto speichern oder teilen</button>
            <a id="downloadPhotoLink" class="btn btn-text" download>Als Datei herunterladen</a>
          </div>
          <p class="help">Die Fotoaufgabe blockiert das Spiel nicht. Das Foto wird nicht hochgeladen und auf diesem Gerät für Urkunde, Ermittlungskarte und Slideshow gespeichert.</p>
        </div>
      </details>
    `;
  }

  function renderFinalPuzzle() {
    return `
      <section class="section final-puzzle">
        <h2 class="section-title"><span aria-hidden="true">✦</span> Abschlussakte zusammensetzen</h2>
        <p>Alle sechs Beweisstücke sind geöffnet. Setzt daraus Datum, König und Verleihung zusammen.</p>
        ${renderEvidenceCards(STATIONS.map((station) => station.evidence))}
        <div class="final-input-grid">
          <label class="field"><span>Tag</span><input id="finalDay" inputmode="numeric" placeholder="TT"></label>
          <label class="field"><span>Monat</span><input id="finalMonth" placeholder="Monat"></label>
          <label class="field"><span>Jahr</span><input id="finalYear" inputmode="numeric" placeholder="JJJJ"></label>
        </div>
        <label class="field"><span>Welcher König?</span><input id="finalKing" placeholder="Name und Ordnungszahl"></label>
        <label class="field"><span>Was wurde Leer verliehen?</span><input id="finalRights" placeholder="…"></label>
        <button id="checkFinalPuzzleButton" class="btn btn-primary full-button" type="button">Abschlusslösung prüfen</button>
        <details class="hint-details">
          <summary>Hinweis zur Abschlussakte</summary>
          <p>Der Satz beginnt mit: „Am … verlieh König … dem Flecken Leer …“</p>
        </details>
        <button id="revealFinalPuzzleButton" class="btn btn-danger full-button" type="button">Auflösung anzeigen</button>
      </section>
    `;
  }

  function renderStation(station) {
    const route = normalizeRoute();
    const progress = getStationProgress(station.id);
    const isOpening = station.id === 1 && !progress.arrivalSolved;

    if (isOpening) {
      return `
        <article class="station-card">
          <div class="station-band">Auftakt · Akte 1 von 6</div>
          <div class="station-body">
            <h1 class="station-title unknown-title">Fundort unbekannt</h1>
            <p class="station-kicker">Die erste Spur muss entschlüsselt werden.</p>
            ${renderDestinationPuzzle(station, station, "arrival")}
          </div>
        </article>
      `;
    }

    const taskAnswer = progress.taskAnswer || "";
    const nextStation = station.id < 6 ? STATIONS[station.id] : null;

    return `
      <article class="station-card">
        <div class="station-band">Akte ${station.id} von 6</div>
        <div class="station-body">
          <div class="solved-location"><span>Fundort entschlüsselt</span></div>
          <h1 class="station-title">${escapeHtml(station.title)}</h1>
          <p class="station-kicker">${escapeHtml(station.kicker)}</p>

          ${!progress.taskSolved ? `
            <section class="section">
              <h2 class="section-title"><span aria-hidden="true">✎</span> ${escapeHtml(station.taskTitle)}</h2>
              ${station.task(route)}
              <label class="field">
                <span>Eure Lösung</span>
                <input id="taskAnswer" value="${escapeHtml(taskAnswer)}" autocomplete="off" placeholder="${escapeHtml(station.taskPlaceholder)}">
              </label>
              <p class="answer-help">Schreibt einfach, was ihr erkannt habt. Groß-/Kleinschreibung, Wortreihenfolge und kleine Tippfehler sind kein Problem.</p>
              <button id="checkTaskButton" class="btn btn-primary full-button" type="button">Lösung prüfen</button>
              <details class="hint-details">
                <summary>Hinweis zur Aufgabe</summary>
                <p>${escapeHtml(station.taskHint)}</p>
              </details>
              ${renderCompassHelp(station, "Kompass & Navigation zum Fundort")}
              <button id="revealTaskButton" class="btn btn-danger full-button" type="button">Lösung aufdecken und weiterspielen</button>
            </section>
          ` : `
            <section class="section stage-complete">
              <h2 class="section-title"><span aria-hidden="true">✓</span> Aufgabe gelöst</h2>
              <p class="solution-note">Eure Lösung: <strong>${escapeHtml(progress.taskAnswer || station.taskSolution(route))}</strong>${progress.taskRevealed ? ` <span class="assisted-mark">mit Notfallhilfe</span>` : ""}</p>
              <div class="evidence-unlock">
                <span>${escapeHtml(station.evidence.label)} geöffnet</span>
                <strong>${escapeHtml(station.evidence.fragment)}</strong>
                <p>${escapeHtml(station.evidence.explanation)}</p>
              </div>
              ${station.insideInfo ? `
                <details class="inside-info">
                  <summary>Was gibt es drinnen zu entdecken?</summary>
                  <p>${escapeHtml(station.insideInfo)}</p>
                </details>
              ` : ""}
              ${renderPhotoSection(station)}
            </section>
            ${station.id < 6 ? renderDestinationPuzzle(station, nextStation, "next") : renderFinalPuzzle()}
          `}
        </div>
      </article>
    `;
  }

  function renderFinal() {
    const setup = normalizeSetup(state.game.setup);
    const answers = normalizeAnswers(state.game.answers);
    const finalState = answers.final && typeof answers.final === "object" ? answers.final : {};
    const assistedSteps = STATIONS.reduce((count, station) => {
      const progress = getStationProgress(station.id);
      return count + Number(Boolean(progress.taskRevealed)) + Number(Boolean(progress.arrivalRevealed || progress.destinationRevealed));
    }, 0) + Number(Boolean(finalState.revealed));

    return `
      <section class="final-card memory-finale">
        <p class="eyebrow">Akte geschlossen</p>
        <h1 class="final-title">Fall gelöst!</h1>
        <div class="final-statement">
          Am <strong>11. Juli 1823</strong> verlieh König <strong>Georg IV.</strong> dem Flecken Leer die Rechte einer Stadt.
        </div>
        <p>Die Spurensuche der Crew <strong class="crew-script-inline">${escapeHtml(setup.crewName || "Crew")}</strong> ist abgeschlossen.</p>
        ${assistedSteps ? `<p class="assistance-summary">${assistedSteps} Lösung${assistedSteps === 1 ? " wurde" : "en wurden"} mithilfe der Notfallauflösung geöffnet. Die Erinnerungen können trotzdem vollständig erstellt werden.</p>` : `<p class="assistance-summary success">Alle entscheidenden Schritte wurden ohne Aufdecken gelöst.</p>`}

        <section class="section memory-step">
          <div class="memory-step-number">1</div>
          <div>
            <h2 class="memory-heading">Gemeinsames Abschlussfoto</h2>
            <p>Zum Schluss braucht die Urkunde ein Foto der ganzen Crew. Nehmt jetzt eines auf oder wählt ein vorhandenes Foto aus.</p>
          </div>
          <div id="finalCrewPhotoCard" class="final-photo-card">
            <div id="finalCrewPhotoPlaceholder" class="final-photo-placeholder">
              <span aria-hidden="true">◎</span>
              <strong>Noch kein Abschlussfoto</strong>
            </div>
            <img id="finalCrewPhotoPreview" alt="Abschlussfoto der Crew" hidden>
          </div>
          <div class="photo-actions">
            <button id="takeFinalPhotoButton" class="btn btn-primary" type="button">Abschlussfoto aufnehmen</button>
            <button id="chooseFinalPhotoButton" class="btn btn-secondary" type="button">Aus Galerie wählen</button>
          </div>
          <input id="finalCrewCameraInput" type="file" accept="image/*" capture="environment" hidden>
          <input id="finalCrewGalleryInput" type="file" accept="image/*" hidden>
          <p class="help">Das Foto wird nicht hochgeladen. Es wird nur auf diesem Gerät für eure Erinnerungen gespeichert.</p>
        </section>

        <section class="section memory-step">
          <div class="memory-step-number">2</div>
          <div>
            <h2 class="memory-heading">Beweisfotos prüfen</h2>
            <p>Stationsfotos, die auf diesem Handy aufgenommen wurden, erscheinen automatisch. Fehlende Fotos könnt ihr jetzt aus der Galerie ergänzen.</p>
          </div>
          <div id="memoryPhotoChecklist" class="memory-photo-checklist">
            ${STATIONS.map((station) => `
              <div class="memory-photo-row" data-memory-station="${station.id}">
                <div class="memory-photo-number">${station.id}</div>
                <div class="memory-photo-copy">
                  <strong>${escapeHtml(station.title)}</strong>
                  <span id="memoryPhotoStatus-${station.id}">Foto wird geprüft …</span>
                </div>
                <button class="btn btn-secondary memory-add-photo" type="button" data-memory-station="${station.id}">Foto ergänzen</button>
                <input id="memoryPhotoInput-${station.id}" data-memory-station="${station.id}" type="file" accept="image/*" hidden>
              </div>
            `).join("")}
          </div>
        </section>

        <section class="section memory-step">
          <div class="memory-step-number">3</div>
          <div>
            <h2 class="memory-heading">Eure Erinnerungen</h2>
            <p>Der Crew-Name wird auf Urkunde und Ermittlungskarte in Schreibschrift gesetzt. Die Dokumente werden direkt auf diesem Gerät erzeugt.</p>
          </div>
          <div class="memory-choice-grid">
            <button id="createCertificateButton" class="memory-choice" type="button" disabled>
              <span class="memory-choice-icon">✦</span>
              <strong>Urkunde erstellen</strong>
              <small>mit Crew-Foto, historischem Schlusssatz und Siegel</small>
            </button>
            <button id="createCaseMapButton" class="memory-choice" type="button" disabled>
              <span class="memory-choice-icon">⌘</span>
              <strong>Ermittlungskarte erstellen</strong>
              <small>alle 6 Stationen, Beweise, Geschichte und Fotos</small>
            </button>
            <button id="openSlideshowButton" class="memory-choice" type="button" disabled>
              <span class="memory-choice-icon">▶</span>
              <strong>Slideshow / Video</strong>
              <small>Hochformat für eine kurze Erinnerung zum Teilen</small>
            </button>
          </div>
        </section>

        <section id="generatedMemoryPanel" class="section generated-memory" hidden>
          <h2 id="generatedMemoryTitle" class="memory-heading">Erinnerung</h2>
          <img id="generatedMemoryImage" alt="Erstellte Erinnerung" hidden>
          <video id="generatedMemoryVideo" controls playsinline hidden></video>
          <div class="actions two">
            <a id="downloadMemoryButton" class="btn btn-primary" download>Speichern</a>
            <button id="shareMemoryButton" class="btn btn-secondary" type="button">Teilen</button>
          </div>
        </section>

        <section id="slideshowPanel" class="section slideshow-panel" hidden>
          <h2 class="memory-heading">Akte 1823 – Slideshow</h2>
          <div class="slideshow-stage">
            <canvas id="slideshowCanvas" width="720" height="1280" aria-label="Vorschau der Slideshow"></canvas>
          </div>
          <p id="slideshowStatus" class="help">Die Vorschau läuft automatisch ohne Musik.</p>
          <div class="actions two">
            <button id="replaySlideshowButton" class="btn btn-secondary" type="button">Nochmal ansehen</button>
            <button id="createVideoButton" class="btn btn-primary" type="button">Video speichern</button>
          </div>
          <p class="help">Je nach Browser wird das Video als MP4 oder WebM erzeugt. Falls Videoexport auf diesem Handy nicht unterstützt wird, bleibt die Slideshow-Vorschau nutzbar.</p>
        </section>

        <div class="actions two final-nav-actions">
          <button id="newSeparateGameButton" class="btn btn-primary" type="button">Neues Spiel anlegen</button>
          <button id="finalHomeButton" class="btn btn-secondary" type="button">Zur Startseite</button>
        </div>
        <p class="help">Diese abgeschlossene Runde bleibt unter „Spiele auf diesem Handy“ erhalten.</p>
      </section>
    `;
  }

  function bindGameCommonEvents() {
    document.getElementById("copyCodeButton")?.addEventListener("click", copyGameCode);
    document.getElementById("shareLinkButton")?.addEventListener("click", shareGameLink);
    document.getElementById("leaveGameButton")?.addEventListener("click", () => {
      if (confirm("Dieses Handy vom Spiel trennen? Die gemeinsame Runde bleibt erhalten.")) leaveGame();
    });
  }

  function bindLobbyEvents(isHost) {
    if (!isHost) return;
    document.getElementById("setupForm")?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const saved = await saveSetup(event.currentTarget);
      if (saved) await goToStation(1);
    });
  }

  async function checkArrival(station) {
    const input = document.getElementById("arrivalGuess");
    const guess = input?.value || "";
    if (!inputMatches(guess, station.destinationAnswers)) {
      showToast("Das ist noch nicht der gesuchte Fundort. Nutzt bei Bedarf den Hinweis.");
      return;
    }
    const answers = answersWithStationPatch(station.id, { arrivalGuess: guess.trim(), arrivalSolved: true });
    await updateGame({ answers }, "Erster Fundort richtig entschlüsselt.");
  }

  async function revealArrival(station) {
    if (!confirm(`Den ersten Fundort „${station.title}“ aufdecken? Die Spurensuche kann danach normal weitergehen.`)) return;
    const answers = answersWithStationPatch(station.id, { arrivalGuess: station.title, arrivalSolved: true, arrivalRevealed: true });
    await updateGame({ answers }, "Fundort mit Notfallhilfe geöffnet.");
  }

  async function checkTask(station) {
    const route = normalizeRoute();
    const input = document.getElementById("taskAnswer");
    const answer = input?.value || "";
    const accepted = station.taskAnswers(route).filter(Boolean);
    if (!accepted.length) {
      showToast("Diese Bibliothekslösung ist noch nicht in config.js eingerichtet.", 4200);
      return;
    }
    const groupMatch = Array.isArray(station.taskGroups) && station.taskGroups.length
      ? station.taskGroups.every((group) => inputMatches(answer, group))
      : null;
    const answerMatches = groupMatch === null ? inputMatches(answer, accepted) : groupMatch;
    if (!answerMatches) {
      showToast("Die Lösung passt noch nicht. Prüft den Fundort und nutzt bei Bedarf den Hinweis.");
      return;
    }
    const answers = answersWithStationPatch(station.id, { taskAnswer: answer.trim(), taskSolved: true });
    await updateGame({ answers }, `${station.evidence.label} wurde geöffnet.`);
  }

  async function revealTask(station) {
    const route = normalizeRoute();
    const solution = station.taskSolution(route);
    if (!confirm(`Die Lösung „${solution}“ aufdecken? Das Beweisstück wird markiert als mit Notfallhilfe gelöst.`)) return;
    const answers = answersWithStationPatch(station.id, { taskAnswer: solution, taskSolved: true, taskRevealed: true });
    await updateGame({ answers }, "Aufgabe mit Notfallhilfe geöffnet.");
  }

  async function checkDestination(station) {
    const target = STATIONS[station.id];
    const input = document.getElementById("destinationGuess");
    const guess = input?.value || "";
    if (!target || !inputMatches(guess, target.destinationAnswers)) {
      showToast("Das ist noch nicht das nächste Ziel. Lest die Spur noch einmal genau.");
      return;
    }
    const answers = answersWithStationPatch(station.id, { destinationGuess: guess.trim(), destinationSolved: true });
    await updateGame({ answers, current_station: target.id }, `Richtig: ${target.title} wurde als nächste Akte geöffnet.`);
  }

  async function revealDestination(station) {
    const target = STATIONS[station.id];
    if (!target) return;
    if (!confirm(`Das nächste Ziel „${target.title}“ aufdecken und die nächste Akte öffnen?`)) return;
    const answers = answersWithStationPatch(station.id, { destinationGuess: target.title, destinationSolved: true, destinationRevealed: true });
    await updateGame({ answers, current_station: target.id }, "Nächstes Ziel mit Notfallhilfe geöffnet.");
  }

  function finalPuzzleIsCorrect() {
    const day = normalizeGuess(document.getElementById("finalDay")?.value);
    const month = normalizeGuess(document.getElementById("finalMonth")?.value);
    const year = normalizeGuess(document.getElementById("finalYear")?.value);
    const king = normalizeGuess(document.getElementById("finalKing")?.value);
    const rights = normalizeGuess(document.getElementById("finalRights")?.value);
    const dayOk = day === "11";
    const monthOk = month === "juli" || month === "7" || month === "07";
    const yearOk = year === "1823";
    const kingOk = king.includes("georg") && (king.includes("iv") || king.split(" ").includes("4") || king.includes("vier"));
    const rightsOk = rights.includes("stadt");
    return dayOk && monthOk && yearOk && kingOk && rightsOk;
  }

  async function finishFinalPuzzle(revealed = false) {
    const answers = { ...normalizeAnswers(state.game.answers), final: { solved: true, revealed } };
    await updateGame({ answers, current_station: 7 }, revealed ? "Abschlussakte mit Notfallhilfe geöffnet." : "Abschlussakte vollständig gelöst.");
  }

  function bindPhotoEvents(stationId) {
    document.getElementById("takePhotoButton")?.addEventListener("click", () => document.getElementById("cameraInput")?.click());
    document.getElementById("choosePhotoButton")?.addEventListener("click", () => document.getElementById("galleryInput")?.click());
    document.getElementById("cameraInput")?.addEventListener("change", (event) => handlePhotoSelected(event, stationId));
    document.getElementById("galleryInput")?.addEventListener("change", (event) => handlePhotoSelected(event, stationId));
    document.getElementById("sharePhotoButton")?.addEventListener("click", sharePhoto);
    if (state.photoFile && state.photoStationId === stationId) showPhotoPreview();
    else loadStoredStationPhoto(stationId);
  }

  function bindCompassEvents() {
    const button = document.getElementById("startCompassButton");
    button?.addEventListener("click", () => startCompass(Number(button.dataset.targetStation)));
    document.getElementById("stopCompassButton")?.addEventListener("click", stopCompass);
  }

  function bindStationEvents(stationId) {
    const station = STATIONS[stationId - 1];
    const progress = getStationProgress(stationId);
    bindCompassEvents();

    if (stationId === 1 && !progress.arrivalSolved) {
      document.getElementById("checkArrivalButton")?.addEventListener("click", () => checkArrival(station));
      document.getElementById("revealArrivalButton")?.addEventListener("click", () => revealArrival(station));
      document.getElementById("arrivalGuess")?.addEventListener("keydown", (event) => {
        if (event.key === "Enter") checkArrival(station);
      });
      return;
    }

    if (!progress.taskSolved) {
      document.getElementById("checkTaskButton")?.addEventListener("click", () => checkTask(station));
      document.getElementById("revealTaskButton")?.addEventListener("click", () => revealTask(station));
      document.getElementById("taskAnswer")?.addEventListener("keydown", (event) => {
        if (event.key === "Enter") checkTask(station);
      });
      return;
    }

    bindPhotoEvents(stationId);

    if (stationId < 6) {
      document.getElementById("checkDestinationButton")?.addEventListener("click", () => checkDestination(station));
      document.getElementById("revealDestinationButton")?.addEventListener("click", () => revealDestination(station));
      document.getElementById("destinationGuess")?.addEventListener("keydown", (event) => {
        if (event.key === "Enter") checkDestination(station);
      });
    } else {
      document.getElementById("checkFinalPuzzleButton")?.addEventListener("click", () => {
        if (finalPuzzleIsCorrect()) finishFinalPuzzle(false);
        else showToast("Die Abschlussakte passt noch nicht vollständig. Prüft alle sechs Beweisstücke.", 4200);
      });
      document.getElementById("revealFinalPuzzleButton")?.addEventListener("click", () => {
        if (confirm("Die vollständige Abschlusslösung anzeigen?")) finishFinalPuzzle(true);
      });
    }
  }

  function bindFinalEvents() {
    document.getElementById("newSeparateGameButton")?.addEventListener("click", () => {
      if (confirm("Ein neues Spiel mit einem neuen Code anlegen? Die abgeschlossene Runde bleibt erhalten.")) {
        startSeparateGame();
      }
    });
    document.getElementById("finalHomeButton")?.addEventListener("click", returnHomeKeepingGame);

    document.getElementById("takeFinalPhotoButton")?.addEventListener("click", () => document.getElementById("finalCrewCameraInput")?.click());
    document.getElementById("chooseFinalPhotoButton")?.addEventListener("click", () => document.getElementById("finalCrewGalleryInput")?.click());
    document.getElementById("finalCrewCameraInput")?.addEventListener("change", handleFinalCrewPhotoSelected);
    document.getElementById("finalCrewGalleryInput")?.addEventListener("change", handleFinalCrewPhotoSelected);

    document.querySelectorAll(".memory-add-photo").forEach((button) => {
      button.addEventListener("click", () => document.getElementById(`memoryPhotoInput-${button.dataset.memoryStation}`)?.click());
    });
    document.querySelectorAll("[id^='memoryPhotoInput-']").forEach((input) => {
      input.addEventListener("change", handleMemoryStationPhotoSelected);
    });

    document.getElementById("createCertificateButton")?.addEventListener("click", createCertificateMemory);
    document.getElementById("createCaseMapButton")?.addEventListener("click", createCaseMapMemory);
    document.getElementById("openSlideshowButton")?.addEventListener("click", openSlideshowPanel);
    document.getElementById("replaySlideshowButton")?.addEventListener("click", playSlideshowPreview);
    document.getElementById("createVideoButton")?.addEventListener("click", createMemoryVideo);
    document.getElementById("shareMemoryButton")?.addEventListener("click", shareGeneratedMemory);

    refreshMemoryPhotoStatus();
  }

  function normalizeDegrees(value) {
    return ((Number(value) % 360) + 360) % 360;
  }

  function toRadians(value) {
    return Number(value) * Math.PI / 180;
  }

  function calculateBearing(fromLat, fromLon, toLat, toLon) {
    const lat1 = toRadians(fromLat);
    const lat2 = toRadians(toLat);
    const deltaLon = toRadians(toLon - fromLon);
    const y = Math.sin(deltaLon) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLon);
    return normalizeDegrees(Math.atan2(y, x) * 180 / Math.PI);
  }

  function calculateDistance(fromLat, fromLon, toLat, toLon) {
    const earthRadius = 6371000;
    const deltaLat = toRadians(toLat - fromLat);
    const deltaLon = toRadians(toLon - fromLon);
    const lat1 = toRadians(fromLat);
    const lat2 = toRadians(toLat);
    const a = Math.sin(deltaLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) ** 2;
    return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  function formatDistance(metres) {
    if (!Number.isFinite(metres)) return "–";
    if (metres < 1000) return `${Math.max(0, Math.round(metres / 5) * 5)} m`;
    return `${(metres / 1000).toFixed(1).replace(".", ",")} km`;
  }

  function compassDirection(degrees) {
    const directions = ["N", "NO", "O", "SO", "S", "SW", "W", "NW"];
    return directions[Math.round(normalizeDegrees(degrees) / 45) % 8];
  }

  function readDeviceHeading(event) {
    if (typeof event.webkitCompassHeading === "number") {
      return normalizeDegrees(event.webkitCompassHeading);
    }
    if (typeof event.alpha !== "number") return null;
    const screenAngle = Number(screen.orientation?.angle ?? window.orientation ?? 0);
    return normalizeDegrees(360 - event.alpha + screenAngle);
  }

  function updateCompassDisplay() {
    const station = STATIONS.find((item) => item.id === state.compassStationId);
    const needle = document.getElementById("compassNeedle");
    const distanceElement = document.getElementById("compassDistance");
    const directionElement = document.getElementById("compassDirection");
    const accuracyElement = document.getElementById("compassAccuracy");
    const statusElement = document.getElementById("compassStatus");
    if (!station || !needle || !distanceElement || !directionElement || !accuracyElement || !statusElement) return;

    if (!state.compassPosition) {
      statusElement.textContent = "Warte auf den aktuellen Standort …";
      return;
    }

    const { latitude, longitude, accuracy } = state.compassPosition.coords;
    const targetBearing = calculateBearing(latitude, longitude, station.location.lat, station.location.lon);
    const distance = calculateDistance(latitude, longitude, station.location.lat, station.location.lon);
    const relativeBearing = state.compassHeading === null
      ? targetBearing
      : normalizeDegrees(targetBearing - state.compassHeading);

    needle.style.transform = `translate(-50%, -88%) rotate(${relativeBearing}deg)`;
    distanceElement.textContent = formatDistance(distance);
    directionElement.textContent = `${compassDirection(targetBearing)} · ${Math.round(targetBearing)}°`;
    accuracyElement.textContent = Number.isFinite(accuracy) ? `± ${Math.round(accuracy)} m` : "–";

    if (distance <= Math.max(20, accuracy || 0)) {
      statusElement.textContent = "Ihr seid sehr nah am Ziel. Schaut euch jetzt in der Umgebung um.";
    } else if (state.compassHeading === null) {
      statusElement.textContent = "Standort gefunden. Der Richtungssensor liefert noch keine Werte. Bewegt das Handy kurz in Form einer Acht und haltet es möglichst waagerecht.";
    } else {
      statusElement.textContent = "Die rote Spitze zeigt ungefähr zum Ziel. Haltet das Handy möglichst waagerecht.";
    }
  }

  async function requestCompassPermission() {
    if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
      const result = await DeviceOrientationEvent.requestPermission();
      if (result !== "granted") throw new Error("Kompassfreigabe wurde nicht erteilt.");
    }
  }

  async function startCompass(stationId) {
    const station = STATIONS.find((item) => item.id === stationId);
    const panel = document.getElementById("compassPanel");
    const button = document.getElementById("startCompassButton");
    const status = document.getElementById("compassStatus");
    if (!station || !panel || !status) return;

    stopCompass(false);
    state.compassStationId = stationId;
    state.compassActive = true;
    panel.hidden = false;
    if (button) button.textContent = "Kompass neu starten";
    status.textContent = "Standort und Kompass werden vorbereitet …";

    try {
      await requestCompassPermission();
    } catch (error) {
      state.compassHeading = null;
      status.textContent = "Die Kompassfreigabe fehlt. Die App kann trotzdem Entfernung und Himmelsrichtung anzeigen.";
    }

    if (typeof DeviceOrientationEvent !== "undefined") {
      state.compassOrientationHandler = (event) => {
        const heading = readDeviceHeading(event);
        if (heading === null) return;
        state.compassHeading = heading;
        updateCompassDisplay();
      };
      window.addEventListener("deviceorientationabsolute", state.compassOrientationHandler, true);
      window.addEventListener("deviceorientation", state.compassOrientationHandler, true);
    }

    if (!navigator.geolocation) {
      status.textContent = "Dieses Gerät stellt keinen Standort bereit. Nutzt bitte die Karten-App als Notlösung.";
      return;
    }

    state.compassWatchId = navigator.geolocation.watchPosition(
      (position) => {
        state.compassPosition = position;
        updateCompassDisplay();
      },
      (error) => {
        const messages = {
          1: "Der Standort wurde nicht freigegeben. Erlaubt den Standort in den Browser-Einstellungen oder nutzt die Karten-App.",
          2: "Der Standort konnte gerade nicht bestimmt werden. Geht möglichst nach draußen und versucht es erneut.",
          3: "Die Standortbestimmung dauert zu lange. Versucht es erneut oder nutzt die Karten-App."
        };
        status.textContent = messages[error.code] || "Der Standort konnte nicht bestimmt werden.";
      },
      { enableHighAccuracy: true, maximumAge: 3000, timeout: 15000 }
    );
  }

  function stopCompass(hidePanel = true) {
    if (state.compassWatchId !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(state.compassWatchId);
    }
    if (state.compassOrientationHandler) {
      window.removeEventListener("deviceorientationabsolute", state.compassOrientationHandler, true);
      window.removeEventListener("deviceorientation", state.compassOrientationHandler, true);
    }
    state.compassWatchId = null;
    state.compassOrientationHandler = null;
    state.compassHeading = null;
    state.compassPosition = null;
    state.compassActive = false;
    if (hidePanel) {
      document.getElementById("compassPanel")?.setAttribute("hidden", "");
    }
  }

  function clearPhotoState() {
    if (state.photoUrl) URL.revokeObjectURL(state.photoUrl);
    state.photoFile = null;
    state.photoUrl = "";
    state.photoStationId = null;
  }

  async function handlePhotoSelected(event, stationId) {
    const file = event.target.files?.[0];
    if (!file) return;
    clearPhotoState();
    state.photoFile = file;
    state.photoUrl = URL.createObjectURL(file);
    state.photoStationId = stationId;
    try {
      await saveMemoryPhoto("station", stationId, file);
      showToast("Foto für eure Abschluss-Erinnerung gespeichert.", 2600);
    } catch (error) {
      console.warn("Foto konnte nicht dauerhaft gespeichert werden:", error);
      showToast("Foto ist geöffnet, konnte aber nicht dauerhaft im Browser gespeichert werden.", 4200);
    }
    showPhotoPreview();
  }

  function showPhotoPreview() {
    const panel = document.getElementById("photoPreview");
    const image = document.getElementById("photoPreviewImage");
    const download = document.getElementById("downloadPhotoLink");
    if (!panel || !image || !download || !state.photoFile || !state.photoUrl) return;
    image.src = state.photoUrl;
    download.href = state.photoUrl;
    const extension = state.photoFile.name?.split(".").pop() || "jpg";
    download.download = `akte-1823-station-${state.photoStationId}.${extension}`;
    panel.hidden = false;
  }

  async function sharePhoto() {
    if (!state.photoFile) return;
    try {
      const shareData = {
        files: [state.photoFile],
        title: `Akte 1823 – Station ${state.photoStationId}`,
        text: "Foto aus dem Leeraner Stadtspiel"
      };
      if (navigator.canShare?.({ files: shareData.files }) && navigator.share) {
        await navigator.share(shareData);
      } else {
        document.getElementById("downloadPhotoLink")?.click();
        showToast("Das Foto wurde als Datei gespeichert.");
      }
    } catch (error) {
      if (error?.name !== "AbortError") {
        document.getElementById("downloadPhotoLink")?.click();
        showToast("Teilen war nicht möglich. Das Foto wurde als Datei angeboten.");
      }
    }
  }


  function openPhotoDatabase() {
    return new Promise((resolve, reject) => {
      if (!window.indexedDB) {
        reject(new Error("IndexedDB wird auf diesem Gerät nicht unterstützt."));
        return;
      }
      const request = indexedDB.open(PHOTO_DB_NAME, PHOTO_DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(PHOTO_STORE_NAME)) {
          db.createObjectStore(PHOTO_STORE_NAME, { keyPath: "key" });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error("Fotospeicher konnte nicht geöffnet werden."));
    });
  }

  function memoryPhotoKey(kind, stationId = "final") {
    return `${state.game?.id || "unknown"}:${kind}:${stationId}`;
  }

  async function saveMemoryPhoto(kind, stationId, blob) {
    const db = await openPhotoDatabase();
    const key = memoryPhotoKey(kind, stationId);
    return new Promise((resolve, reject) => {
      const tx = db.transaction(PHOTO_STORE_NAME, "readwrite");
      tx.objectStore(PHOTO_STORE_NAME).put({
        key,
        gameId: state.game?.id || "",
        kind,
        stationId,
        blob,
        updatedAt: Date.now()
      });
      tx.oncomplete = () => { db.close(); resolve(true); };
      tx.onerror = () => { db.close(); reject(tx.error || new Error("Foto konnte nicht gespeichert werden.")); };
    });
  }

  async function getMemoryPhoto(kind, stationId = "final") {
    let db;
    try {
      db = await openPhotoDatabase();
    } catch {
      return null;
    }
    const key = memoryPhotoKey(kind, stationId);
    return new Promise((resolve) => {
      const tx = db.transaction(PHOTO_STORE_NAME, "readonly");
      const request = tx.objectStore(PHOTO_STORE_NAME).get(key);
      request.onsuccess = () => resolve(request.result?.blob || null);
      request.onerror = () => resolve(null);
      tx.oncomplete = () => db.close();
    });
  }

  async function loadStoredStationPhoto(stationId) {
    const blob = await getMemoryPhoto("station", stationId);
    if (!blob || state.photoFile || state.photoStationId === stationId) return;
    clearPhotoState();
    const file = new File([blob], `akte-1823-station-${stationId}.jpg`, { type: blob.type || "image/jpeg" });
    state.photoFile = file;
    state.photoUrl = URL.createObjectURL(file);
    state.photoStationId = stationId;
    showPhotoPreview();
  }

  async function handleFinalCrewPhotoSelected(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      await saveMemoryPhoto("final", "crew", file);
      await refreshMemoryPhotoStatus();
      showToast("Abschlussfoto gespeichert.");
    } catch (error) {
      console.error(error);
      showToast("Das Abschlussfoto konnte auf diesem Gerät nicht gespeichert werden.", 4200);
    }
  }

  async function handleMemoryStationPhotoSelected(event) {
    const file = event.target.files?.[0];
    const stationId = Number(event.currentTarget?.dataset.memoryStation);
    if (!file || !stationId) return;
    try {
      await saveMemoryPhoto("station", stationId, file);
      await refreshMemoryPhotoStatus();
      showToast(`Foto für Akte ${stationId} gespeichert.`);
    } catch (error) {
      console.error(error);
      showToast("Das Foto konnte auf diesem Gerät nicht gespeichert werden.", 4200);
    }
  }

  async function refreshMemoryPhotoStatus() {
    if (!state.game || Number(state.game.current_station || 0) < 7) return;
    const finalPhoto = await getMemoryPhoto("final", "crew");
    const finalPreview = document.getElementById("finalCrewPhotoPreview");
    const finalPlaceholder = document.getElementById("finalCrewPhotoPlaceholder");
    if (finalPhoto && finalPreview) {
      if (finalPreview.dataset.objectUrl) URL.revokeObjectURL(finalPreview.dataset.objectUrl);
      const url = URL.createObjectURL(finalPhoto);
      finalPreview.dataset.objectUrl = url;
      finalPreview.src = url;
      finalPreview.hidden = false;
      if (finalPlaceholder) finalPlaceholder.hidden = true;
    } else {
      if (finalPreview) finalPreview.hidden = true;
      if (finalPlaceholder) finalPlaceholder.hidden = false;
    }

    for (const station of STATIONS) {
      const blob = await getMemoryPhoto("station", station.id);
      const status = document.getElementById(`memoryPhotoStatus-${station.id}`);
      const button = document.querySelector(`.memory-add-photo[data-memory-station="${station.id}"]`);
      if (status) status.textContent = blob ? "Beweisfoto vorhanden" : "Noch kein Foto auf diesem Handy";
      if (button) button.textContent = blob ? "Ersetzen" : "Foto ergänzen";
    }

    document.querySelectorAll("#createCertificateButton, #createCaseMapButton, #openSlideshowButton").forEach((button) => {
      button.disabled = !finalPhoto;
    });
  }

  function dateLabel() {
    return new Date().toLocaleDateString("de-DE");
  }

  function canvasFont(size, family = "serif", weight = "normal", style = "normal") {
    return `${style} ${weight} ${size}px ${family}`;
  }

  function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 20) {
    const words = String(text || "").split(/\s+/).filter(Boolean);
    let line = "";
    let lines = 0;
    for (let i = 0; i < words.length; i += 1) {
      const test = line ? `${line} ${words[i]}` : words[i];
      if (ctx.measureText(test).width > maxWidth && line) {
        ctx.fillText(line, x, y + lines * lineHeight);
        line = words[i];
        lines += 1;
        if (lines >= maxLines) return y + lines * lineHeight;
      } else {
        line = test;
      }
    }
    if (line && lines < maxLines) {
      ctx.fillText(line, x, y + lines * lineHeight);
      lines += 1;
    }
    return y + lines * lineHeight;
  }

  function drawParchment(ctx, width, height) {
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#fbf5e7");
    gradient.addColorStop(0.52, "#eee0c4");
    gradient.addColorStop(1, "#f7eedc");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    ctx.save();
    ctx.globalAlpha = 0.08;
    for (let i = 0; i < 750; i += 1) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const r = 0.5 + Math.random() * 2.2;
      ctx.fillStyle = i % 3 === 0 ? "#7b2833" : "#6f5a33";
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawDecorativeBorder(ctx, width, height, inset = 28) {
    ctx.save();
    ctx.strokeStyle = "#173f35";
    ctx.lineWidth = 18;
    ctx.strokeRect(inset, inset, width - inset * 2, height - inset * 2);
    ctx.strokeStyle = "#b08a45";
    ctx.lineWidth = 5;
    ctx.strokeRect(inset + 18, inset + 18, width - (inset + 18) * 2, height - (inset + 18) * 2);
    ctx.strokeStyle = "rgba(123,40,51,.55)";
    ctx.lineWidth = 2;
    ctx.strokeRect(inset + 30, inset + 30, width - (inset + 30) * 2, height - (inset + 30) * 2);
    ctx.restore();
  }

  async function blobToImage(blob) {
    if (!blob) return null;
    const url = URL.createObjectURL(blob);
    try {
      const image = await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
      });
      return image;
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  function drawCoverImage(ctx, image, x, y, width, height) {
    if (!image) return;
    const scale = Math.max(width / image.width, height / image.height);
    const sw = width / scale;
    const sh = height / scale;
    const sx = (image.width - sw) / 2;
    const sy = (image.height - sh) / 2;
    ctx.drawImage(image, sx, sy, sw, sh, x, y, width, height);
  }

  function roundRectPath(ctx, x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + width, y, x + width, y + height, r);
    ctx.arcTo(x + width, y + height, x, y + height, r);
    ctx.arcTo(x, y + height, x, y, r);
    ctx.arcTo(x, y, x + width, y, r);
    ctx.closePath();
  }

  function drawFramedPhoto(ctx, image, x, y, width, height) {
    ctx.save();
    ctx.fillStyle = "rgba(255,255,255,.68)";
    roundRectPath(ctx, x - 12, y - 12, width + 24, height + 24, 12);
    ctx.fill();
    ctx.strokeStyle = "#b08a45";
    ctx.lineWidth = 4;
    ctx.stroke();
    roundRectPath(ctx, x, y, width, height, 7);
    ctx.clip();
    if (image) {
      drawCoverImage(ctx, image, x, y, width, height);
    } else {
      ctx.fillStyle = "#e7dcc8";
      ctx.fillRect(x, y, width, height);
      ctx.fillStyle = "#6e746f";
      ctx.font = canvasFont(Math.max(22, width * 0.05), "sans-serif", "bold");
      ctx.textAlign = "center";
      ctx.fillText("Beweisfoto nicht vorhanden", x + width / 2, y + height / 2);
    }
    ctx.restore();
  }

  async function canvasToBlob(canvas, type = "image/png", quality = 0.94) {
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Bild konnte nicht erstellt werden.")), type, quality);
    });
  }

  async function createCertificateMemory() {
    const finalBlob = await getMemoryPhoto("final", "crew");
    if (!finalBlob) {
      showToast("Bitte zuerst ein gemeinsames Abschlussfoto aufnehmen.");
      return;
    }
    setBusy(true);
    try {
      const image = await blobToImage(finalBlob);
      const canvas = document.createElement("canvas");
      canvas.width = 1240;
      canvas.height = 1754;
      const ctx = canvas.getContext("2d");
      drawParchment(ctx, canvas.width, canvas.height);
      drawDecorativeBorder(ctx, canvas.width, canvas.height, 24);

      ctx.textAlign = "center";
      ctx.fillStyle = "#173f35";
      ctx.font = canvasFont(92, "Georgia, serif", "bold");
      ctx.fillText("AKTE 1823", 620, 175);
      ctx.fillStyle = "#7b2833";
      ctx.font = canvasFont(66, "Georgia, serif", "normal");
      ctx.fillText("Urkunde", 620, 250);

      ctx.fillStyle = "#24332d";
      ctx.font = canvasFont(30, "Georgia, serif");
      ctx.fillText("Diese Crew hat die Spuren durch Leer erfolgreich verfolgt", 620, 312);
      ctx.fillText("und die Akte 1823 gelöst.", 620, 352);

      const crewName = normalizeSetup(state.game.setup).crewName || "Crew";
      ctx.fillStyle = "#173f35";
      ctx.font = canvasFont(78, '"Brush Script MT", "Segoe Script", cursive', "normal", "italic");
      ctx.fillText(crewName, 620, 455);

      drawFramedPhoto(ctx, image, 165, 520, 910, 520);

      ctx.fillStyle = "#173f35";
      ctx.font = canvasFont(30, "Georgia, serif", "bold");
      ctx.fillText("6 Spuren verfolgt  •  6 Beweise gesichert  •  Fall gelöst", 620, 1105);

      ctx.fillStyle = "rgba(255,255,255,.35)";
      roundRectPath(ctx, 145, 1160, 950, 250, 26);
      ctx.fill();
      ctx.strokeStyle = "rgba(23,63,53,.45)";
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.fillStyle = "#6f222d";
      ctx.font = canvasFont(38, "Georgia, serif", "bold");
      ctx.fillText("Am 11. Juli 1823 verlieh", 620, 1230);
      ctx.fillText("König Georg IV. dem Flecken Leer", 620, 1285);
      ctx.fillText("die Rechte einer Stadt.", 620, 1340);

      ctx.textAlign = "left";
      ctx.fillStyle = "#3b403d";
      ctx.font = canvasFont(24, "Georgia, serif");
      ctx.fillText("Datum", 165, 1500);
      ctx.font = canvasFont(31, '"Brush Script MT", "Segoe Script", cursive', "normal", "italic");
      ctx.fillText(dateLabel(), 165, 1543);

      ctx.save();
      ctx.translate(620, 1515);
      ctx.fillStyle = "#7b2833";
      ctx.strokeStyle = "#5b1721";
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.arc(0, 0, 100, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = "#d2aa62";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, 80, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "#f2dfb5";
      ctx.textAlign = "center";
      ctx.font = canvasFont(27, "Georgia, serif", "bold");
      ctx.fillText("AKTE", 0, -10);
      ctx.fillText("GESCHLOSSEN", 0, 30);
      ctx.restore();

      ctx.textAlign = "right";
      ctx.fillStyle = "rgba(76,67,54,.62)";
      ctx.font = canvasFont(25, "Georgia, serif", "bold");
      ctx.fillText("ARCHIV 1823 · LEER", 1065, 1540);

      const blob = await canvasToBlob(canvas, "image/png");
      showGeneratedMemory("Urkunde – Akte 1823", blob, `Akte-1823-Urkunde-${safeFileName(crewName)}.png`, "image");
    } catch (error) {
      console.error(error);
      showToast("Die Urkunde konnte auf diesem Gerät nicht erstellt werden.", 4500);
    } finally {
      setBusy(false);
    }
  }

  function shortStationTitle(station) {
    if (station.id === 3) return "HERMANN-TEMPEL-HAUS";
    if (station.id === 6) return "ALTE WAAGE / HAFEN";
    return station.title.toUpperCase();
  }

  async function createCaseMapMemory() {
    const finalBlob = await getMemoryPhoto("final", "crew");
    if (!finalBlob) {
      showToast("Bitte zuerst ein gemeinsames Abschlussfoto aufnehmen.");
      return;
    }
    setBusy(true);
    try {
      const finalImage = await blobToImage(finalBlob);
      const stationImages = [];
      for (const station of STATIONS) {
        stationImages.push(await blobToImage(await getMemoryPhoto("station", station.id)));
      }

      const canvas = document.createElement("canvas");
      canvas.width = 1600;
      canvas.height = 2200;
      const ctx = canvas.getContext("2d");
      drawParchment(ctx, canvas.width, canvas.height);
      drawDecorativeBorder(ctx, canvas.width, canvas.height, 24);

      const crewName = normalizeSetup(state.game.setup).crewName || "Crew";
      ctx.textAlign = "left";
      ctx.fillStyle = "#173f35";
      ctx.font = canvasFont(66, "Georgia, serif", "bold");
      ctx.fillText("ERMITTLUNGSKARTE", 85, 125);
      ctx.fillStyle = "#7b2833";
      ctx.font = canvasFont(58, "Georgia, serif", "bold");
      ctx.fillText("AKTE 1823", 1015, 125);
      ctx.fillStyle = "#28342f";
      ctx.font = canvasFont(28, "Georgia, serif");
      ctx.fillText("DER CREW", 88, 182);
      ctx.font = canvasFont(48, '"Brush Script MT", "Segoe Script", cursive', "normal", "italic");
      ctx.fillStyle = "#173f35";
      ctx.fillText(crewName, 245, 185);
      ctx.textAlign = "right";
      ctx.font = canvasFont(26, "Georgia, serif");
      ctx.fillText(`DATUM: ${dateLabel()}`, 1505, 182);

      const marginX = 82;
      const gapX = 34;
      const cardW = (canvas.width - marginX * 2 - gapX) / 2;
      const cardH = 505;
      const startY = 245;
      const gapY = 30;

      for (let i = 0; i < STATIONS.length; i += 1) {
        const station = STATIONS[i];
        const col = i % 2;
        const row = Math.floor(i / 2);
        const x = marginX + col * (cardW + gapX);
        const y = startY + row * (cardH + gapY);

        ctx.save();
        ctx.fillStyle = "rgba(255,250,238,.78)";
        ctx.strokeStyle = "rgba(97,76,47,.42)";
        ctx.lineWidth = 2;
        roundRectPath(ctx, x, y, cardW, cardH, 18);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#7b2833";
        ctx.beginPath();
        ctx.arc(x + 48, y + 48, 31, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#fff7e7";
        ctx.font = canvasFont(28, "Georgia, serif", "bold");
        ctx.textAlign = "center";
        ctx.fillText(String(station.id), x + 48, y + 58);

        ctx.textAlign = "left";
        ctx.fillStyle = "#28342f";
        ctx.font = canvasFont(28, "Georgia, serif", "bold");
        ctx.fillText(shortStationTitle(station), x + 95, y + 57);

        drawFramedPhoto(ctx, stationImages[i], x + 28, y + 92, 285, 240);

        ctx.fillStyle = "#4c4a42";
        ctx.font = canvasFont(22, "Georgia, serif");
        wrapCanvasText(ctx, ARCHIVE_NOTES[station.id], x + 345, y + 112, cardW - 375, 30, 7);

        ctx.fillStyle = "#5f5b50";
        ctx.font = canvasFont(18, "Georgia, serif", "bold");
        ctx.fillText("FUND VOR ORT", x + 28, y + 372);
        ctx.fillStyle = "#3f4843";
        ctx.font = canvasFont(22, "Georgia, serif");
        wrapCanvasText(ctx, station.taskSolution(normalizeRoute()), x + 28, y + 402, cardW - 56, 28, 2);
        ctx.fillStyle = "#7b2833";
        ctx.font = canvasFont(18, "Georgia, serif", "bold");
        ctx.fillText("BEWEISSTÜCK FÜR DIE ABSCHLUSSAKTE", x + 28, y + 458);
        ctx.fillStyle = "#173f35";
        ctx.font = canvasFont(30, '"Brush Script MT", "Segoe Script", cursive', "bold", "italic");
        wrapCanvasText(ctx, station.evidence.fragment, x + 28, y + 488, cardW - 56, 34, 1);
        ctx.restore();
      }

      const bottomY = startY + 3 * (cardH + gapY) + 10;
      ctx.fillStyle = "rgba(123,40,51,.10)";
      roundRectPath(ctx, 82, bottomY, 1436, 180, 20);
      ctx.fill();
      ctx.strokeStyle = "rgba(123,40,51,.35)";
      ctx.stroke();
      ctx.textAlign = "left";
      ctx.fillStyle = "#7b2833";
      ctx.font = canvasFont(24, "Georgia, serif", "bold");
      ctx.fillText("BEWEISE ZUSAMMENGESETZT", 110, bottomY + 42);
      ctx.fillStyle = "#173f35";
      ctx.font = canvasFont(30, "Georgia, serif", "bold");
      wrapCanvasText(ctx, "11  +  JULI  +  1823  +  GEORG IV.  +  FLECKEN LEER  +  RECHTE EINER STADT", 110, bottomY + 92, 1350, 42, 2);

      const finalY = bottomY + 220;
      drawFramedPhoto(ctx, finalImage, 1045, finalY, 425, 275);
      ctx.textAlign = "left";
      ctx.fillStyle = "#173f35";
      ctx.font = canvasFont(44, '"Brush Script MT", "Segoe Script", cursive', "normal", "italic");
      ctx.fillText(crewName, 1060, finalY + 330);

      ctx.fillStyle = "#7b2833";
      ctx.font = canvasFont(38, "Georgia, serif", "bold");
      ctx.fillText("6 Spuren verfolgt", 110, finalY + 55);
      ctx.fillText("6 Beweise gesichert", 110, finalY + 110);
      ctx.fillText("Fall gelöst!", 110, finalY + 165);
      ctx.fillStyle = "#28342f";
      ctx.font = canvasFont(27, "Georgia, serif", "bold");
      wrapCanvasText(ctx, "Am 11. Juli 1823 verlieh König Georg IV. dem Flecken Leer die Rechte einer Stadt.", 110, finalY + 235, 820, 40, 3);

      const blob = await canvasToBlob(canvas, "image/png");
      showGeneratedMemory("Ermittlungskarte – Akte 1823", blob, `Akte-1823-Ermittlungskarte-${safeFileName(crewName)}.png`, "image");
    } catch (error) {
      console.error(error);
      showToast("Die Ermittlungskarte konnte auf diesem Gerät nicht erstellt werden.", 4500);
    } finally {
      setBusy(false);
    }
  }

  function safeFileName(value) {
    return String(value || "Crew").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/^-+|-+$/g, "") || "Crew";
  }

  function clearGeneratedUrls() {
    if (state.memoryOutputUrl) URL.revokeObjectURL(state.memoryOutputUrl);
    if (state.memoryVideoUrl) URL.revokeObjectURL(state.memoryVideoUrl);
    state.memoryOutputUrl = "";
    state.memoryVideoUrl = "";
  }

  function showGeneratedMemory(title, blob, filename, kind = "image") {
    clearGeneratedUrls();
    const panel = document.getElementById("generatedMemoryPanel");
    const titleEl = document.getElementById("generatedMemoryTitle");
    const image = document.getElementById("generatedMemoryImage");
    const video = document.getElementById("generatedMemoryVideo");
    const download = document.getElementById("downloadMemoryButton");
    if (!panel || !download) return;

    const url = URL.createObjectURL(blob);
    if (kind === "video") state.memoryVideoUrl = url;
    else state.memoryOutputUrl = url;
    panel.dataset.blobType = blob.type || "application/octet-stream";
    panel.dataset.filename = filename;
    panel._generatedBlob = blob;
    if (titleEl) titleEl.textContent = title;
    download.href = url;
    download.download = filename;

    if (image) {
      image.hidden = kind !== "image";
      if (kind === "image") image.src = url;
    }
    if (video) {
      video.hidden = kind !== "video";
      if (kind === "video") {
        video.src = url;
        video.load();
      }
    }
    panel.hidden = false;
    panel.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function shareGeneratedMemory() {
    const panel = document.getElementById("generatedMemoryPanel");
    const blob = panel?._generatedBlob;
    const filename = panel?.dataset.filename || "Akte-1823-Erinnerung";
    if (!blob) return;
    const file = new File([blob], filename, { type: blob.type || "application/octet-stream" });
    try {
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "Akte 1823", text: "Unsere Erinnerung an die Spurensuche durch Leer" });
      } else {
        document.getElementById("downloadMemoryButton")?.click();
        showToast("Direktes Teilen wird hier nicht unterstützt. Die Datei wurde zum Speichern geöffnet.");
      }
    } catch (error) {
      if (error?.name !== "AbortError") showToast("Teilen war nicht möglich. Bitte die Datei speichern und anschließend teilen.");
    }
  }

  async function getSlideshowSlides() {
    const slides = [];
    for (const station of STATIONS) {
      slides.push({
        title: `Akte ${station.id} · ${station.title}`,
        subtitle: station.evidence.fragment,
        note: ARCHIVE_NOTES[station.id],
        image: await blobToImage(await getMemoryPhoto("station", station.id))
      });
    }
    slides.push({
      title: "FALL GELÖST",
      subtitle: normalizeSetup(state.game.setup).crewName || "Crew",
      note: "Am 11. Juli 1823 verlieh König Georg IV. dem Flecken Leer die Rechte einer Stadt.",
      image: await blobToImage(await getMemoryPhoto("final", "crew")),
      final: true
    });
    return slides;
  }

  function drawSlideshowSlide(ctx, canvas, slide, progress = 1) {
    drawParchment(ctx, canvas.width, canvas.height);
    ctx.save();
    ctx.globalAlpha = Math.max(0.05, Math.min(1, progress));
    ctx.fillStyle = "#173f35";
    ctx.fillRect(0, 0, canvas.width, 122);
    ctx.fillStyle = "#f7f1e6";
    ctx.textAlign = "center";
    ctx.font = canvasFont(38, "Georgia, serif", "bold");
    ctx.fillText("AKTE 1823 · LEER", canvas.width / 2, 75);

    drawFramedPhoto(ctx, slide.image, 72, 205, 576, 650);
    ctx.fillStyle = slide.final ? "#7b2833" : "#173f35";
    ctx.font = canvasFont(slide.final ? 58 : 42, "Georgia, serif", "bold");
    ctx.fillText(slide.title, canvas.width / 2, 950);
    ctx.fillStyle = "#7b2833";
    ctx.font = canvasFont(42, '"Brush Script MT", "Segoe Script", cursive', "bold", "italic");
    wrapCanvasText(ctx, slide.subtitle, canvas.width / 2, 1010, 600, 48, 2);
    ctx.fillStyle = "#37443e";
    ctx.font = canvasFont(27, "Georgia, serif");
    ctx.textAlign = "center";
    wrapCenteredCanvasText(ctx, slide.note, canvas.width / 2, 1115, 600, 38, 4);
    ctx.restore();
  }

  function wrapCenteredCanvasText(ctx, text, centerX, y, maxWidth, lineHeight, maxLines = 10) {
    const words = String(text || "").split(/\s+/).filter(Boolean);
    let line = "";
    let lines = 0;
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        ctx.fillText(line, centerX, y + lines * lineHeight);
        line = word;
        lines += 1;
        if (lines >= maxLines) return;
      } else line = test;
    }
    if (line && lines < maxLines) ctx.fillText(line, centerX, y + lines * lineHeight);
  }

  async function openSlideshowPanel() {
    const panel = document.getElementById("slideshowPanel");
    if (panel) {
      panel.hidden = false;
      panel.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    await playSlideshowPreview();
  }

  async function playSlideshowPreview() {
    const canvas = document.getElementById("slideshowCanvas");
    const status = document.getElementById("slideshowStatus");
    if (!canvas) return;
    if (state.slideshowTimer) {
      clearTimeout(state.slideshowTimer);
      state.slideshowTimer = null;
    }
    const ctx = canvas.getContext("2d");
    const slides = await getSlideshowSlides();
    let index = 0;
    const showNext = () => {
      drawSlideshowSlide(ctx, canvas, slides[index], 1);
      if (status) status.textContent = `${index + 1} von ${slides.length} · ohne Musik`;
      index += 1;
      if (index < slides.length) state.slideshowTimer = setTimeout(showNext, index === slides.length - 1 ? 1700 : 1450);
      else if (status) status.textContent = "Slideshow beendet. Ihr könnt sie erneut ansehen oder als Video erzeugen.";
    };
    showNext();
  }

  function preferredVideoMimeType() {
    if (!window.MediaRecorder) return "";
    const candidates = [
      "video/mp4;codecs=avc1.42E01E",
      "video/mp4",
      "video/webm;codecs=vp9",
      "video/webm;codecs=vp8",
      "video/webm"
    ];
    return candidates.find((type) => MediaRecorder.isTypeSupported?.(type)) || "";
  }

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function createMemoryVideo() {
    const canvas = document.getElementById("slideshowCanvas");
    const status = document.getElementById("slideshowStatus");
    if (!canvas || !canvas.captureStream || !window.MediaRecorder) {
      showToast("Dieser Browser kann die Slideshow anzeigen, aber kein Video daraus exportieren.", 5000);
      return;
    }
    const mimeType = preferredVideoMimeType();
    if (!mimeType) {
      showToast("Auf diesem Gerät wird kein passendes Videoformat unterstützt.", 5000);
      return;
    }
    setBusy(true);
    try {
      const slides = await getSlideshowSlides();
      const ctx = canvas.getContext("2d");
      const stream = canvas.captureStream(24);
      const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 4_500_000 });
      const chunks = [];
      recorder.ondataavailable = (event) => { if (event.data?.size) chunks.push(event.data); };
      const stopped = new Promise((resolve, reject) => {
        recorder.onstop = resolve;
        recorder.onerror = () => reject(recorder.error || new Error("Videoexport fehlgeschlagen."));
      });
      recorder.start(250);
      for (let i = 0; i < slides.length; i += 1) {
        drawSlideshowSlide(ctx, canvas, slides[i], 1);
        if (status) status.textContent = `Video wird erstellt: ${i + 1} von ${slides.length}`;
        await wait(slides[i].final ? 2300 : 1450);
      }
      recorder.stop();
      await stopped;
      stream.getTracks().forEach((track) => track.stop());
      const blob = new Blob(chunks, { type: recorder.mimeType || mimeType });
      const extension = blob.type.includes("mp4") ? "mp4" : "webm";
      const crew = safeFileName(normalizeSetup(state.game.setup).crewName || "Crew");
      showGeneratedMemory("Slideshow-Video – Akte 1823", blob, `Akte-1823-${crew}.${extension}`, "video");
      if (status) status.textContent = "Video fertig. Es enthält absichtlich keine Musik.";
    } catch (error) {
      console.error(error);
      showToast("Das Video konnte auf diesem Gerät nicht erstellt werden. Die Slideshow bleibt verfügbar.", 5000);
    } finally {
      setBusy(false);
    }
  }

  async function copyGameCode() {
    const code = state.game?.code || "";
    if (!code) return;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(code);
        showToast(`Spielcode ${code} wurde kopiert.`);
      } else {
        showToast(`Spielcode: ${code}`, 6000);
      }
    } catch {
      showToast(`Spielcode: ${code}`, 6000);
    }
  }

  async function shareGameLink() {
    const crewName = normalizeSetup(state.game.setup).crewName || "Crew";
    const code = state.game.code;
    const text = `Akte 1823 – ${crewName}\nSpielcode: ${code}\nÖffnet den Link oder gebt den Code unter „Mit Code beitreten“ ein.`;
    const shareUrl = new URL(location.href);
    shareUrl.search = "";
    shareUrl.hash = "";
    shareUrl.searchParams.set("code", code);
    try {
      if (navigator.share) {
        await navigator.share({ title: "Akte 1823", text, url: shareUrl.toString() });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(`${text}\n${shareUrl}`);
        showToast("Spielcode und Einladungslink wurden kopiert.");
      } else {
        showToast(`Spielcode: ${code}`, 6000);
      }
    } catch (error) {
      if (error?.name !== "AbortError") showToast(`Spielcode: ${code}`, 6000);
    }
  }

  function handleError(error, fallbackMessage) {
    console.error(error);
    const raw = String(error?.message || "");
    let message = fallbackMessage;
    if (raw.includes("Anonymous sign-ins are disabled")) {
      message = "Anonyme Anmeldungen sind in Supabase noch nicht aktiviert.";
    } else if (raw.toLowerCase().includes("game not found")) {
      message = "Dieser Spielcode wurde nicht gefunden.";
    } else if (raw.toLowerCase().includes("captcha") || raw.toLowerCase().includes("turnstile")) {
      message = "Die Sicherheitsprüfung konnte nicht abgeschlossen werden. Bitte die Seite neu laden.";
    } else if (raw.toLowerCase().includes("row-level security")) {
      message = "Die Supabase-Datenbankregeln sind noch nicht vollständig eingerichtet.";
    }
    showToast(message, 4500);
  }

  homeButton.addEventListener("click", () => {
    if (state.game) {
      renderGame();
    } else {
      renderHome();
      if (!state.user) initSupabase();
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("online", () => {
    setConnection(state.game ? "Live verbunden" : "Online", "online");
    if (!state.user) initSupabase();
  });
  window.addEventListener("offline", () => setConnection("Offline", "offline"));
  window.addEventListener("pagehide", () => stopCompass(false));

  window.addEventListener("load", () => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("./sw.js").catch((error) => console.warn("Service Worker:", error));
    }

    const sharedCode = codeFromUrl();
    const cachedGameShown = !sharedCode && restoreCachedGameView();
    if (!cachedGameShown) renderHome();
    initSupabase();
  });

  console.info(`Akte 1823 v${APP_VERSION}`);
})();
