(() => {
  "use strict";

  const APP_VERSION = "2.1.0";
  const STORAGE_KEY = "akte1823.game";
  const SNAPSHOT_KEY = "akte1823.game.snapshot";
  const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  const DEFAULT_SETUP = {
    crewName: ""
  };

  const DEFAULT_ROUTE = {
    libraryTitle: "",
    libraryPage: "",
    libraryLine: "",
    libraryWord: "",
    libraryNote: "Das vorbereitete Buch liegt in der Stadtbibliothek bereit."
  };

  const STATIONS = [
    {
      id: 1,
      title: "Stadtbibliothek",
      kicker: "Die Spur im alten Speicher",
      location: { name: "Stadtbibliothek Leer", address: "Wilhelminengang 2, 26789 Leer", lat: 53.22724, lon: 7.45181 },
      destinationAnswers: ["Stadtbibliothek", "Bibliothek", "Hermann Tempel Haus", "Hermann-Tempel-Haus"],
      arrivalClue: "Wo früher Waren in einem Speicher lagerten, werden heute Geschichten, Wissen und Erinnerungen gesammelt. Findet diesen Ort und gebt seinen Namen ein.",
      arrivalHint: "Gesucht ist eine öffentliche Einrichtung im historischen Hermann-Tempel-Haus.",
      taskTitle: "Das vorbereitete Buch",
      task: (route) => {
        const details = [];
        if (route.libraryTitle) details.push(`<li><strong>Titel:</strong> ${escapeHtml(route.libraryTitle)}</li>`);
        if (route.libraryPage) details.push(`<li><strong>Seite:</strong> ${escapeHtml(route.libraryPage)}</li>`);
        if (route.libraryLine) details.push(`<li><strong>Zeile:</strong> ${escapeHtml(route.libraryLine)}</li>`);
        return `
          <p>${escapeHtml(route.libraryNote || DEFAULT_ROUTE.libraryNote)}</p>
          ${details.length ? `<ul>${details.join("")}</ul>` : `<p class="callout"><strong>Noch offen:</strong> Buch, Seite und Zeile müssen einmalig in <code>config.js</code> eingetragen werden.</p>`}
          <p><strong>Welches Wort findet ihr an der vorbereiteten Stelle?</strong></p>
        `;
      },
      taskPlaceholder: "Gefundenes Wort",
      taskHint: "Kontrolliert Titel, Seite und Zeile genau. Groß- und Kleinschreibung spielen keine Rolle.",
      taskAnswers: (route) => route.libraryWord ? [route.libraryWord] : [],
      taskSolution: (route) => route.libraryWord || "Bibliothekswort noch nicht eingerichtet",
      evidence: {
        fragment: "FLECKEN LEER",
        label: "Beweisstück 1",
        explanation: "Der erste versiegelte Aktenstreifen gehört in den Schlusssatz."
      },
      photo: "Fotografiert ein markantes Detail des alten Speichergebäudes – so, als hättet ihr dort gerade eine wichtige Spur entdeckt.",
      nextClue: "Euer nächstes Ziel ist ein Gotteshaus, in dem eine Uhr nicht nur die Zeit zeigte. Sie sollte dafür sorgen, dass eine Predigt nicht endlos dauerte.",
      nextHint: "Die gesuchte Kirche ist ein großer reformierter Zentralbau in der Altstadt."
    },
    {
      id: 2,
      title: "Große Kirche",
      kicker: "Die Uhr gegenüber der Kanzel",
      location: { name: "Große Kirche", address: "Kirchstraße 14, 26789 Leer", lat: 53.228589, lon: 7.449089 },
      destinationAnswers: ["Große Kirche", "Grosse Kirche", "Große Kirche Leer", "Reformierte Kirche", "Evangelisch reformierte Kirche"],
      taskTitle: "Der königliche Erlass",
      task: () => `
        <p>Gegenüber der Kanzel befindet sich eine Uhr. Ein Erlass von 1751 begrenzte die Dauer der Predigt.</p>
        <p><strong>Wie lange durfte eine Predigt höchstens dauern?</strong></p>
      `,
      taskPlaceholder: "z. B. 60 Minuten",
      taskHint: "Gesang und Gebet wurden bei dieser Höchstdauer nicht mitgerechnet.",
      taskAnswers: () => ["60", "60 Minuten", "eine Stunde", "1 Stunde", "1h"],
      taskSolution: () => "60 Minuten / eine Stunde",
      evidence: {
        fragment: "GEORG IV.",
        label: "Beweisstück 2",
        explanation: "Friedrich II. gehört zur Predigtuhr – der Stadtrechtskönig war ein anderer."
      },
      photo: "Eine Person hält eine feierliche Ansprache, während die anderen deutlich auf die Uhr zeigen.",
      nextClue: "Sucht nun ein prächtiges Haus, das den Namen eines biblischen Kraftprotzes trägt. Im Erdgeschoss wird bis heute mit Genussvollem gehandelt.",
      nextHint: "Der Namensgeber verlor seine Kraft, nachdem ihm die Haare geschnitten worden waren."
    },
    {
      id: 3,
      title: "Haus Samson",
      kicker: "Das Haus des starken Mannes",
      location: { name: "Haus Samson", address: "Rathausstraße 18, 26789 Leer", lat: 53.227058, lon: 7.450967 },
      destinationAnswers: ["Haus Samson", "Samson", "Wein Wolff", "Weinhandlung Wolff"],
      taskTitle: "Die Jahreszahl an der Fassade",
      task: () => `
        <p>Untersucht die Straßenfassade des Hauses genau.</p>
        <p><strong>Welche Jahreszahl ist dort zu erkennen?</strong></p>
      `,
      taskPlaceholder: "Vierstellige Jahreszahl",
      taskHint: "Die Jahreszahl gehört zur heute sichtbaren Fassade und beginnt mit 16.",
      taskAnswers: () => ["1643"],
      taskSolution: () => "1643",
      evidence: {
        fragment: "11",
        label: "Beweisstück 3",
        explanation: "Der dritte Aktenstreifen enthält den Tag des entscheidenden Datums."
      },
      photo: "Stellt vor dem Haus ein möglichst ernstes historisches Gruppenporträt nach.",
      nextClue: "Eine bronzene Frau hält Tasse und Kanne, trinkt aber seit Jahren keinen Schluck. Findet sie und folgt anschließend der Geschichte des Tees.",
      nextHint: "Die Figur heißt Teelke und steht in der Nähe eines Teemuseums."
    },
    {
      id: 4,
      title: "Teelke & Bünting-Teemuseum",
      kicker: "Die Spur des Tees",
      location: { name: "Teelke und Bünting-Teemuseum", address: "Brunnenstraße 33, 26789 Leer", lat: 53.229384, lon: 7.451559 },
      destinationAnswers: ["Teelke", "Teelke Statue", "Bünting Teemuseum", "Buenting Teemuseum", "Teemuseum", "Teelke und Bünting Teemuseum"],
      taskTitle: "Der Anfang des Handels",
      task: () => `
        <p>In der Brunnenstraße begann 1806 die Geschichte eines bekannten Leeraner Handelshauses.</p>
        <p><strong>Wie hieß der Gründer des damaligen Kolonialwarenladens?</strong></p>
      `,
      taskPlaceholder: "Vor- und Nachname",
      taskHint: "Sein Nachname steht noch heute auf Tee aus Ostfriesland.",
      taskAnswers: () => ["Johann Bünting", "Johann Buenting", "Bünting", "Buenting"],
      taskSolution: () => "Johann Bünting",
      evidence: {
        fragment: "JULI",
        label: "Beweisstück 4",
        explanation: "Der vierte Aktenstreifen nennt den Monat des entscheidenden Datums."
      },
      photo: "Macht ein Gruppenfoto mit Teelke oder stellt eine besonders feierliche ostfriesische Tee-Szene nach.",
      nextClue: "Gesucht ist nun das bekannteste repräsentative Gebäude der Stadt. Sein Turm überragt die Altstadt – doch zur Zeit der Stadtrechte stand es noch nicht.",
      nextHint: "Dort tagen heute Rat und Verwaltung; viele Trauungen finden ebenfalls dort statt."
    },
    {
      id: 5,
      title: "Historisches Rathaus",
      kicker: "Die zeitlich falsche Spur",
      location: { name: "Historisches Rathaus", address: "Rathausstraße 1, 26789 Leer", lat: 53.226609, lon: 7.450649 },
      destinationAnswers: ["Historisches Rathaus", "Rathaus", "Rathaus Leer", "Leeraner Rathaus"],
      taskTitle: "Jünger als die Stadtrechte",
      task: () => `
        <p>Das Rathaus wurde erst lange nach der Erhebung Leers zur Stadt fertiggestellt.</p>
        <p><strong>In welchem Jahr wurde das Historische Rathaus eingeweiht?</strong></p>
      `,
      taskPlaceholder: "Vierstellige Jahreszahl",
      taskHint: "Die gesuchte Jahreszahl liegt im letzten Jahrzehnt des 19. Jahrhunderts.",
      taskAnswers: () => ["1894"],
      taskSolution: () => "1894",
      evidence: {
        fragment: "1823",
        label: "Beweisstück 5",
        explanation: "Der fünfte Aktenstreifen nennt das Jahr, das deutlich vor dem Rathausbau liegt."
      },
      photo: "Eine Person übernimmt auf der Rathaustreppe die Rolle des Stadtoberhaupts; die Crew bildet den feierlichen Empfang.",
      nextClue: "Zum letzten Fundort geht es dorthin, wo Waren am Wasser gewogen wurden. Bekrönte Waagschalen erinnern noch heute an diese Aufgabe.",
      nextHint: "Das barocke Gebäude steht unmittelbar am Museumshafen."
    },
    {
      id: 6,
      title: "Alte Waage & Museumshafen",
      kicker: "Der letzte Fundort",
      location: { name: "Alte Waage", address: "Neue Straße 1, 26789 Leer", lat: 53.2264, lon: 7.451719 },
      destinationAnswers: ["Alte Waage", "Waage", "Historische Waage", "Museumshafen", "Alte Waage und Museumshafen"],
      taskTitle: "Das Gebäude am Wasser",
      task: () => `
        <p>Über den Eingängen erinnern bekrönte Waagschalen an die frühere Funktion des Gebäudes.</p>
        <p><strong>In welchem Jahr wurde die Alte Waage erbaut?</strong></p>
      `,
      taskPlaceholder: "Vierstellige Jahreszahl",
      taskHint: "Die Jahreszahl liegt am Beginn des 18. Jahrhunderts.",
      taskAnswers: () => ["1714"],
      taskSolution: () => "1714",
      evidence: {
        fragment: "RECHTE EINER STADT",
        label: "Beweisstück 6",
        explanation: "Der letzte Aktenstreifen vervollständigt die historische Aussage."
      },
      photo: "Macht ein gemeinsames Abschlussfoto an der Waage oder am Museumshafen – möglichst wie auf einer alten Aufnahme.",
      nextClue: "",
      nextHint: ""
    }
  ];

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
    lastConnectionError: null
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

  function inputMatches(value, acceptedValues) {
    const guess = normalizeGuess(value);
    if (!guess) return false;
    return (acceptedValues || []).some((accepted) => {
      const solution = normalizeGuess(accepted);
      if (!solution) return false;
      if (guess === solution) return true;
      if (/^\d+$/.test(solution)) return guess.split(" ").includes(solution);
      return solution.length >= 5 && guess.includes(solution);
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

  function saveGameSnapshot(game) {
    if (!game?.id) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ id: game.id, code: game.code }));
    localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(game));
  }

  function clearStoredGame() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(SNAPSHOT_KEY);
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
        const captchaToken = await getCaptchaToken();
        setConnection("Anmelden …");
        const result = await state.client.auth.signInAnonymously({
          options: { captchaToken }
        });
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
        showToast("Der gespeicherte Spielstand ist geöffnet. Die Live-Verbindung wird erneut versucht.", 5000);
      } else {
        renderConnectionProblem(error);
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
    if (state.channel && state.client) {
      await state.client.removeChannel(state.channel);
      state.channel = null;
    }
    state.game = null;
    clearStoredGame();
    renderHome();
    showToast("Spiel auf diesem Handy verlassen.");
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
      return "Die Sicherheitsprüfung konnte auf diesem Gerät nicht abgeschlossen werden.";
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
        <p>Sechs zusammenhängende Spuren führen durch Leers Geschichte. Jede gelöste Aufgabe öffnet ein Beweisstück – und erst das erratene nächste Ziel öffnet die folgende Akte.</p>
        ${state.user ? "" : `<p class="callout"><strong>Verbindung wird vorbereitet.</strong> Sobald oben „Online“ steht, kann das Spiel gestartet oder betreten werden.</p>`}
        <div class="actions two">
          <button id="createGameButton" class="btn btn-primary" type="button" ${state.user ? "" : "disabled"}>Spiel starten</button>
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

      <section class="panel">
        <h2>Gemeinsam spielen</h2>
        <p>Eine Person startet das Spiel und legt den Crew-Namen fest. Weitere Mitspielende treten mit dem Code bei. Lösungen, Beweisstücke und der geöffnete Ermittlungsstand werden gemeinsam synchronisiert.</p>
      </section>
    `;

    document.getElementById("createGameButton").addEventListener("click", createGame);
    document.getElementById("showJoinButton").addEventListener("click", () => {
      const panel = document.getElementById("joinPanel");
      panel.hidden = !panel.hidden;
      if (!panel.hidden) document.getElementById("joinCode").focus();
    });
    document.getElementById("joinButton").addEventListener("click", () => joinGame(document.getElementById("joinCode").value));
    document.getElementById("joinCode").addEventListener("input", (event) => {
      event.target.value = event.target.value.toUpperCase().replace(/[^A-Z2-9]/g, "").slice(0, 6);
    });
    document.getElementById("joinCode").addEventListener("keydown", (event) => {
      if (event.key === "Enter") joinGame(event.currentTarget.value);
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
        <div class="game-head-top">
          <div>
            <div class="game-label">Crew</div>
            <div class="game-code crew-code">${escapeHtml(crewName)}</div>
            <div class="game-label">Spielcode ${escapeHtml(state.game.code)}</div>
          </div>
          <button id="shareCodeButton" class="btn btn-secondary" type="button">Code teilen</button>
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
    const route = normalizeRoute();
    const libraryReady = Boolean(route.libraryTitle && route.libraryPage && route.libraryLine && route.libraryWord);

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
        <p>Die Crew erhält zunächst nur ein Rätsel. Erst das richtige Ziel öffnet die erste Aufgabe.</p>
        ${libraryReady ? "" : `<p class="callout"><strong>Bibliothek noch nicht fertig:</strong> Buch, Seite, Zeile und Lösungswort fehlen noch in <code>config.js</code>. Zum Testen kann die Notfallauflösung genutzt werden.</p>`}
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

  function renderCompassHelp(targetStation, summaryText = "Orientierungshilfe öffnen") {
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
          <summary>Adresse und Karten-App als letzte Notlösung</summary>
          <p><strong>${escapeHtml(targetStation.location.name)}</strong><br>${escapeHtml(targetStation.location.address)}</p>
          <a class="btn btn-secondary map-link" href="https://www.google.com/maps/dir/?api=1&destination=${targetStation.location.lat},${targetStation.location.lon}&travelmode=walking" target="_blank" rel="noopener noreferrer">Fußweg in Karten öffnen</a>
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
        <summary>Optionale Fotoaufgabe</summary>
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
          <p class="help">Das Foto wird nicht hochgeladen. Es bleibt auf diesem Gerät.</p>
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
              <button id="checkTaskButton" class="btn btn-primary full-button" type="button">Lösung prüfen</button>
              <details class="hint-details">
                <summary>Hinweis zur Aufgabe</summary>
                <p>${escapeHtml(station.taskHint)}</p>
              </details>
              ${renderCompassHelp(station, "Seid ihr am richtigen Fundort?")}
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
      <section class="final-card">
        <p class="eyebrow">Akte vollständig</p>
        <h1 class="final-title">Der entscheidende Satz</h1>
        <div class="final-statement">
          Am <strong>11. Juli 1823</strong> verlieh König <strong>Georg IV.</strong> dem Flecken Leer die Rechte einer Stadt.
        </div>
        <p>Das Historische Rathaus konnte damals noch nicht dort stehen: Es wurde erst 1894 eingeweiht.</p>
        <p>Die Spurensuche der Crew <strong>${escapeHtml(setup.crewName || "Unbekannt")}</strong> ist abgeschlossen.</p>
        ${assistedSteps ? `<p class="assistance-summary">${assistedSteps} Lösung${assistedSteps === 1 ? " wurde" : "en wurden"} mithilfe der Notfallauflösung geöffnet. Das Spiel ist trotzdem vollständig abgeschlossen.</p>` : `<p class="assistance-summary success">Alle entscheidenden Schritte wurden ohne Aufdecken gelöst.</p>`}

        <section class="section">
          <h2 class="section-title">Gesammelte Beweisstücke</h2>
          ${renderEvidenceCards(STATIONS.map((station) => station.evidence))}
        </section>

        <div class="actions">
          <button id="restartGameButton" class="btn btn-primary" type="button">Neue Runde starten</button>
        </div>
      </section>
    `;
  }

  function bindGameCommonEvents() {
    document.getElementById("shareCodeButton")?.addEventListener("click", shareCode);
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
    if (!inputMatches(answer, accepted)) {
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
    document.getElementById("restartGameButton")?.addEventListener("click", () => {
      if (confirm("Fortschritt und Beweisstücke dieser Runde wirklich zurücksetzen?")) {
        updateGame({ current_station: 0, answers: {} }, "Neue Runde vorbereitet.");
      }
    });
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

  function handlePhotoSelected(event, stationId) {
    const file = event.target.files?.[0];
    if (!file) return;
    clearPhotoState();
    state.photoFile = file;
    state.photoUrl = URL.createObjectURL(file);
    state.photoStationId = stationId;
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

  async function shareCode() {
    const crewName = normalizeSetup(state.game.setup).crewName || "Crew";
    const text = `Akte 1823 – ${crewName} – Spielcode: ${state.game.code}`;
    const shareUrl = new URL(location.href);
    shareUrl.search = "";
    shareUrl.hash = "";
    shareUrl.searchParams.set("code", state.game.code);
    try {
      if (navigator.share) {
        await navigator.share({ title: "Akte 1823", text, url: shareUrl.toString() });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(`${text}\n${shareUrl}`);
        showToast("Code und direkter Spieleinstieg wurden kopiert.");
      } else {
        showToast(`${text} – ${shareUrl}`, 6000);
      }
    } catch (error) {
      if (error?.name !== "AbortError") showToast(text, 4500);
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
    } else if (state.user) {
      renderHome();
    } else {
      renderOpening("Die Verbindung wird erneut aufgebaut …");
      initSupabase();
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
    if (!cachedGameShown) {
      renderOpening(sharedCode ? `Das Spiel ${sharedCode} wird geöffnet …` : "Die App wird geöffnet …");
    }
    initSupabase();
  });

  console.info(`Akte 1823 v${APP_VERSION}`);
})();
