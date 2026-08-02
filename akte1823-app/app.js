(() => {
  "use strict";

  const APP_VERSION = "1.3.0";
  const STORAGE_KEY = "akte1823.game";
  const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  const DEFAULT_SETUP = {
    crewName: ""
  };

  const DEFAULT_ROUTE = {
    libraryTitle: "",
    libraryPage: "",
    libraryLine: "",
    libraryWord: "",
    libraryNote: "Das vorbereitete Buch liegt in der Stadtbibliothek bereit.",
    teaMuseumTask: "Findet heraus, wer 1806 in Leer einen Laden eröffnete und womit dort gehandelt wurde.",
    finalDateHint: "Sucht an der letzten Station nach dem vollständigen Datum der Stadtrechte."
  };

  const STATIONS = [
    {
      id: 1,
      title: "Stadtbibliothek",
      kicker: "Die Spur im alten Speicher",
      location: { name: "Stadtbibliothek Leer", address: "Wilhelminengang 2, 26789 Leer", lat: 53.22724, lon: 7.45181 },
      riddle: "Sucht ein Gebäude, in dem früher Waren lagerten und heute Geschichten, Wissen und Erinnerungen gesammelt werden.",
      task: (setup) => {
        const details = [];
        if (setup.libraryTitle) details.push(`<li><strong>Titel:</strong> ${escapeHtml(setup.libraryTitle)}</li>`);
        if (setup.libraryPage) details.push(`<li><strong>Seite:</strong> ${escapeHtml(setup.libraryPage)}</li>`);
        if (setup.libraryLine) details.push(`<li><strong>Zeile:</strong> ${escapeHtml(setup.libraryLine)}</li>`);
        if (setup.libraryWord) details.push(`<li><strong>Gesuchtes Wort:</strong> ${escapeHtml(setup.libraryWord)}</li>`);
        return `
          <p>${escapeHtml(setup.libraryNote || DEFAULT_ROUTE.libraryNote)}</p>
          ${details.length ? `<ul>${details.join("")}</ul>` : `<p class="callout">Die genaue Buchstelle wird nach dem Anruf bei der Bibliothek ergänzt.</p>`}
          <p>Notiert das gefundene Wort oder den gefundenen Namen.</p>
        `;
      },
      hint: "Das Gebäude liegt in der Altstadt und ist heute öffentlich zugänglich.",
      photo: () => "Fotografiert eure Crew an einem markanten Detail des alten Speichers – so, als hättet ihr gerade eine wichtige Spur entdeckt.",
      next: "Der nächste Hinweis hängt in einer Kirche an der Wand und erinnert an zu lange Predigten."
    },
    {
      id: 2,
      title: "Große Kirche",
      kicker: "Die Uhr gegenüber der Kanzel",
      location: { name: "Große Kirche", address: "Kirchstraße 14, 26789 Leer", lat: 53.228589, lon: 7.449089 },
      riddle: "Findet die Kirche, in der eine Uhr nicht nur die Zeit anzeigt, sondern an eine königliche Vorschrift erinnert.",
      task: () => `
        <ol>
          <li>Welcher König erließ die Vorschrift?</li>
          <li>In welchem Jahr?</li>
          <li>Wie lange durfte eine Predigt höchstens dauern?</li>
        </ol>
        <p class="callout"><strong>Achtung:</strong> Dieser König ist nicht der König, der Leer die Stadtrechte verlieh.</p>
      `,
      hint: "Schaut gegenüber der Kanzel nach oben – oder fragt die anwesende Person nach der Geschichte der Uhr.",
      photo: () => "Eine Person hält eine feierliche Ansprache, während die anderen demonstrativ auf die Uhr schauen.",
      next: "Weiter geht es zu einem alten Haus mit dem Namen eines besonders starken Mannes und einem ungewöhnlichen Glücksbringer."
    },
    {
      id: 3,
      title: "Haus Samson",
      kicker: "Der ungewöhnliche Glücksbringer",
      location: { name: "Haus Samson", address: "Rathausstraße 18, 26789 Leer", lat: 53.227058, lon: 7.450967 },
      riddle: "Gesucht ist ein altes Haus, das den Namen eines besonders starken Mannes trägt. Im Erdgeschoss wird mit etwas Genussvollem gehandelt. Im Inneren versteckt sich ein Glücksbringer, in dem eigentlich gefiederte Bewohner leben könnten.",
      task: () => `
        <p>Findet das Haus und beantwortet:</p>
        <p><strong>Welcher Gegenstand sollte den Bewohnern Glück bringen?</strong></p>
      `,
      hint: "Der Hausname erinnert an eine biblische Figur – nicht an den zotteligen Bewohner aus der Sesamstraße.",
      photo: () => "Stellt vor dem Haus ein möglichst ernstes historisches Gruppenporträt nach.",
      next: "Eine bronzene Frau mit Tasse und Kanne führt euch zur nächsten Spur."
    },
    {
      id: 4,
      title: "Teelke & Bünting-Teemuseum",
      kicker: "Die Spur des Tees",
      location: { name: "Teelke", address: "Brunnenstraße, nahe Bünting-Teemuseum, 26789 Leer", lat: 53.229384, lon: 7.451559 },
      riddle: "Findet zuerst die bronzene Frau, die seit Jahren eine volle Tasse hält, ohne daraus zu trinken. Untersucht die Figur genau und folgt anschließend der Spur des Tees ins Museum.",
      task: (setup) => `
        <ol>
          <li>Welche Jahreszahl gehört zur Figur?</li>
          <li>${escapeHtml(setup.teaMuseumTask || DEFAULT_ROUTE.teaMuseumTask)}</li>
          <li>Welche Jahreszahl gehört zum Beginn des Geschäfts?</li>
        </ol>
      `,
      hint: "Nicht das Getränk ist die Lösung. Sucht nach Namen, Jahreszahlen und der Geschichte des Geschäfts.",
      photo: () => "Macht ein Gruppenfoto mit Teelke oder stellt ein altes Foto der Umgebung möglichst genau nach.",
      next: "Nun sucht das Gebäude, das heute wie kein anderes zeigt, dass Leer eine Stadt ist."
    },
    {
      id: 5,
      title: "Historisches Rathaus",
      kicker: "Ein Gebäude mit falscher Spur",
      location: { name: "Historisches Rathaus", address: "Rathausstraße 1, 26789 Leer", lat: 53.226609, lon: 7.450649 },
      riddle: "Findet das Gebäude, das heute wie kein anderes für die Stadt Leer steht. Doch Vorsicht: Es ist deutlich jünger als die Verleihung der Stadtrechte.",
      task: () => `
        <p><strong>In welchen Jahren wurde das Historische Rathaus errichtet?</strong></p>
        <p>Notiert die Bauzeit. Das gesuchte Jahr der Stadtrechte liegt deutlich davor.</p>
      `,
      hint: "Sucht nach einer Informationstafel am oder nahe dem Gebäude – oder fragt vor Ort nach der Bauzeit.",
      photo: () => "Eine Person übernimmt auf der Rathaustreppe die Rolle des Stadtoberhaupts; die Crew bildet den feierlichen Empfang.",
      next: "Zum Schluss geht es dorthin, wo Handel, Wasser und Gewichte zusammenkamen."
    },
    {
      id: 6,
      title: "Alte Waage & Museumshafen",
      kicker: "Der entscheidende Beweis",
      location: { name: "Alte Waage", address: "Neue Straße 1, 26789 Leer", lat: 53.2264, lon: 7.451719 },
      riddle: "Schon bevor Leer offiziell eine Stadt wurde, machten Handel, Hafen und Schifffahrt den Ort bedeutend. Findet den Platz, an dem Waren gewogen wurden und historische Schiffe liegen.",
      task: (setup) => `
        <ol>
          <li>In welchem Jahr wurde die Alte Waage erbaut?</li>
          <li>Welche Gegenstände sind über ihren Eingängen dargestellt?</li>
          <li>${escapeHtml(setup.finalDateHint || DEFAULT_ROUTE.finalDateHint)}</li>
          <li>Welcher König verlieh Leer die Stadtrechte?</li>
        </ol>
        <p>Stellt außerdem ein altes Hafenfoto möglichst genau nach.</p>
      `,
      hint: "Der entscheidende Satz beginnt mit: Am … verlieh König … dem Flecken Leer die Rechte einer Stadt.",
      photo: () => "Gemeinsames Abschlussfoto an der Waage oder am Museumshafen – möglichst aus derselben Perspektive wie ein altes Foto.",
      next: "Ihr habt alle Beweise. Öffnet nun die Abschlussakte."
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
    compassActive: false
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

  async function initSupabase() {
    if (!configIsReady()) {
      renderMissingConfig();
      setConnection("Noch nicht eingerichtet", "offline");
      return;
    }

    if (!window.supabase?.createClient) {
      renderFatal("Die Supabase-Bibliothek konnte nicht geladen werden. Prüfe die Internetverbindung.");
      return;
    }

    const { supabaseUrl, supabaseAnonKey } = window.AKTE1823_CONFIG;
    state.client = window.supabase.createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false
      }
    });

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

    await restoreGame();
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

    if (error || !data) {
      localStorage.removeItem(STORAGE_KEY);
      renderHome();
      return;
    }

    await enterGame(data);
  }

  function safeJsonParse(value) {
    try { return JSON.parse(value); } catch { return null; }
  }

  async function createGame() {
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

  async function joinGame(code) {
    const cleanCode = String(code || "").toUpperCase().replace(/[^A-Z2-9]/g, "").slice(0, 6);
    if (cleanCode.length !== 6) {
      showToast("Bitte den sechsstelligen Spielcode eingeben.");
      return;
    }

    setBusy(true);
    try {
      const { data, error } = await state.client.rpc("join_game_by_code", { p_code: cleanCode });
      if (error) throw error;
      const game = Array.isArray(data) ? data[0] : data;
      if (!game) throw new Error("Der Spielcode wurde nicht gefunden.");
      await enterGame(game);
      showToast(`Mit Spiel ${game.code} verbunden.`);
    } catch (error) {
      handleError(error, "Der Spielcode wurde nicht gefunden oder ist nicht mehr gültig.");
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ id: game.id, code: game.code }));
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
    localStorage.removeItem(STORAGE_KEY);
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
    app.innerHTML = `<div class="error-box"><strong>Fehler:</strong> ${escapeHtml(message)}</div>`;
  }

  function renderHome() {
    state.game = null;
    app.innerHTML = `
      <section class="hero">
        <p class="eyebrow">Historisches Stadtspiel durch Leer</p>
        <h1>Akte 1823</h1>
        <p>Sechs Stationen führen durch Leers Geschichte. Eine Crew startet die Runde, alle weiteren Geräte treten mit demselben Spielcode bei.</p>
        <div class="actions two">
          <button id="createGameButton" class="btn btn-primary" type="button">Spiel starten</button>
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
          <button id="joinButton" class="btn btn-primary" type="button" style="align-self:end">Beitreten</button>
        </div>
      </section>

      <section class="panel">
        <h2>Gemeinsam spielen</h2>
        <p>Eine Person startet das Spiel und legt den Crew-Namen fest. Weitere Mitspielende geben den angezeigten Code ein. Stationen, Antworten und Fortschritt werden anschließend gemeinsam synchronisiert.</p>
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
      const className = current > station.id ? "done" : current === station.id ? "current" : "";
      return `<div class="progress-step ${className}" aria-label="Station ${station.id}">${current > station.id ? "✓" : station.id}</div>`;
    }).join("");

    const crewName = normalizeSetup(state.game.setup).crewName || "Crew";

    return `
      <section class="game-head">
        <div class="game-head-top">
          <div>
            <div class="game-label">${escapeHtml(crewName)}</div>
            <div class="game-code">${escapeHtml(state.game.code)}</div>
            <div class="game-label">Gemeinsamer Spielcode</div>
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
          <h2>Die Runde wird vorbereitet</h2>
          <p>Die Person, die das Spiel gestartet hat, legt noch den Crew-Namen fest und öffnet anschließend Station 1.</p>
        </section>
      `;
    }

    return `
      <section class="panel">
        <h2>Neue Runde starten</h2>
        <p>Für jede Runde wird nur ein Crew-Name benötigt. Die Aufgaben der Route bleiben unverändert.</p>
        ${libraryReady ? "" : `<p class="callout"><strong>Hinweis:</strong> Die genaue Bibliotheksaufgabe ist noch nicht dauerhaft in <code>config.js</code> eingetragen.</p>`}
        <form id="setupForm" class="setup-grid">
          <label class="field">
            <span>Crew-Name</span>
            <input name="crewName" value="${escapeHtml(setup.crewName)}" placeholder="z. B. Hafenfüchse" maxlength="40" required>
          </label>
          <div class="setup-actions">
            <button id="startRouteButton" class="btn btn-primary" type="submit">Station 1 öffnen</button>
          </div>
        </form>
      </section>
    `;
  }

  function renderStation(station) {
    const route = normalizeRoute();
    const answer = normalizeAnswers(state.game.answers)[String(station.id)] || "";
    const isLast = station.id === 6;

    return `
      <article class="station-card">
        <div class="station-band">Station ${station.id} von 6</div>
        <div class="station-body">
          <h1 class="station-title">${escapeHtml(station.title)}</h1>
          <p class="station-kicker">${escapeHtml(station.kicker)}</p>

          <section class="section">
            <h2 class="section-title"><span aria-hidden="true">⌕</span> Findet den Ort</h2>
            <p class="riddle">${escapeHtml(station.riddle)}</p>
          </section>

          <section class="section">
            <h2 class="section-title"><span aria-hidden="true">✎</span> Aufgabe vor Ort</h2>
            ${station.task(route)}
          </section>

          <section class="section">
            <h2 class="section-title"><span aria-hidden="true">✓</span> Eure Antwort</h2>
            <div class="answer-box">
              <label class="field" style="margin-top:0">
                <span>Notizen dieser Station</span>
                <textarea id="stationAnswer" placeholder="Antwort oder Fundstück notieren …">${escapeHtml(answer)}</textarea>
              </label>
              <button id="saveAnswerButton" class="btn btn-secondary" type="button">Antwort für alle speichern</button>
              <div class="answer-status">Die Antwort erscheint anschließend auf allen verbundenen Geräten.</div>
            </div>
          </section>

          <section class="section compass-help-section">
            <h2 class="section-title"><span aria-hidden="true">🧭</span> Orientierungshilfe</h2>
            <p>Kommt ihr nicht weiter, zeigt euch die Kompassnadel ungefähr die Richtung zum Ziel.</p>
            <button id="startCompassButton" class="btn btn-secondary" type="button">Kompass-Hilfe starten</button>
            <div id="compassPanel" class="compass-panel" hidden>
              <p class="compass-warning"><strong>Wichtig:</strong> Nur als Orientierung nutzen. GPS, Handysensoren, Gebäude und Metall können die Anzeige verfälschen. Achtet auf Straßenschilder und den Verkehr.</p>
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
            <details class="location-details">
              <summary>Adresse und Karten-App als Notlösung</summary>
              <p><strong>${escapeHtml(station.location.name)}</strong><br>${escapeHtml(station.location.address)}</p>
              <a class="btn btn-secondary map-link" href="https://www.google.com/maps/dir/?api=1&destination=${station.location.lat},${station.location.lon}&travelmode=walking" target="_blank" rel="noopener noreferrer">Fußweg in Karten öffnen</a>
            </details>
            <p class="help">Der aktuelle Standort bleibt auf diesem Handy und wird nicht in der gemeinsamen Datenbank gespeichert.</p>
          </section>

          <section class="section">
            <h2 class="section-title"><span aria-hidden="true">▣</span> Fotoaufgabe</h2>
            <p>${escapeHtml(station.photo())}</p>
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
              <p class="help">Das Foto wird nicht in die gemeinsame Datenbank hochgeladen. Es bleibt auf diesem Gerät.</p>
            </div>
          </section>

          <section class="section">
            <button id="toggleHintButton" class="btn btn-secondary" type="button">${state.revealHint ? "Hinweis ausblenden" : "Notfall-Hinweis anzeigen"}</button>
            ${state.revealHint ? `<div class="reveal">${escapeHtml(station.hint)}</div>` : ""}
          </section>

          <section class="section">
            <h2 class="section-title"><span aria-hidden="true">➜</span> Nächste Spur</h2>
            <p>${escapeHtml(station.next)}</p>
          </section>

          <div class="station-nav">
            <button id="previousStationButton" class="btn btn-secondary" type="button">Zurück</button>
            <button id="nextStationButton" class="btn btn-primary" type="button">${isLast ? "Abschlussakte öffnen" : "Station abschließen"}</button>
          </div>
        </div>
      </article>
    `;
  }

  function renderFinal() {
    const setup = normalizeSetup(state.game.setup);
    const answers = normalizeAnswers(state.game.answers);
    const summary = STATIONS.map((station) => `
      <div>
        <strong>Station ${station.id}: ${escapeHtml(station.title)}</strong>
        <span>${escapeHtml(answers[String(station.id)] || "Keine Notiz gespeichert")}</span>
      </div>
    `).join("");

    return `
      <section class="final-card">
        <p class="eyebrow">Akte vollständig</p>
        <h1 class="final-title">Der entscheidende Satz</h1>
        <div class="final-statement">
          Am <strong>11. Juli 1823</strong> verlieh König <strong>Georg IV.</strong> dem Flecken Leer die Rechte einer Stadt.
        </div>
        <p>Das heutige Historische Rathaus konnte dabei noch nicht dort stehen: Es wurde erst von <strong>1889 bis 1894</strong> erbaut.</p>
        <p>Damit ist die historische Spurensuche für <strong>${escapeHtml(setup.crewName || "eure Crew")}</strong> abgeschlossen.</p>

        <section class="section">
          <h2 class="section-title">Gesammelte Notizen</h2>
          <div class="answer-summary">${summary}</div>
        </section>

        <div class="actions two">
          <button id="backToStationSixButton" class="btn btn-secondary" type="button">Zurück zu Station 6</button>
          <button id="restartGameButton" class="btn btn-primary" type="button">Runde zurücksetzen</button>
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

  function bindStationEvents(stationId) {
    document.getElementById("startCompassButton")?.addEventListener("click", () => startCompass(stationId));
    document.getElementById("stopCompassButton")?.addEventListener("click", stopCompass);

    document.getElementById("takePhotoButton")?.addEventListener("click", () => document.getElementById("cameraInput")?.click());
    document.getElementById("choosePhotoButton")?.addEventListener("click", () => document.getElementById("galleryInput")?.click());
    document.getElementById("cameraInput")?.addEventListener("change", (event) => handlePhotoSelected(event, stationId));
    document.getElementById("galleryInput")?.addEventListener("change", (event) => handlePhotoSelected(event, stationId));
    document.getElementById("sharePhotoButton")?.addEventListener("click", sharePhoto);
    if (state.photoFile && state.photoStationId === stationId) showPhotoPreview();

    document.getElementById("saveAnswerButton")?.addEventListener("click", () => {
      saveAnswer(stationId, document.getElementById("stationAnswer").value);
    });
    document.getElementById("toggleHintButton")?.addEventListener("click", () => {
      state.revealHint = !state.revealHint;
      renderGame();
    });
    document.getElementById("previousStationButton")?.addEventListener("click", () => goToStation(Math.max(0, stationId - 1)));
    document.getElementById("nextStationButton")?.addEventListener("click", async () => {
      const answer = document.getElementById("stationAnswer").value;
      if (answer.trim()) {
        const answers = { ...normalizeAnswers(state.game.answers), [String(stationId)]: answer.trim() };
        const target = stationId === 6 ? 7 : stationId + 1;
        await updateGame({ answers, current_station: target }, stationId === 6 ? "Abschlussakte geöffnet." : "Nächste Station geöffnet.");
      } else {
        const proceed = confirm("Ihr habt noch keine Antwort notiert. Station trotzdem abschließen?");
        if (proceed) await goToStation(stationId === 6 ? 7 : stationId + 1);
      }
    });
  }

  function bindFinalEvents() {
    document.getElementById("backToStationSixButton")?.addEventListener("click", () => goToStation(6));
    document.getElementById("restartGameButton")?.addEventListener("click", () => {
      if (confirm("Fortschritt und Antworten der Runde wirklich zurücksetzen?")) {
        updateGame({ current_station: 0, answers: {} }, "Runde wurde zurückgesetzt.");
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
    try {
      if (navigator.share) {
        await navigator.share({ title: "Akte 1823", text, url: location.href });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(`${text}\n${location.href}`);
        showToast("Code und Link wurden kopiert.");
      } else {
        showToast(text, 4500);
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
    if (state.game) renderGame();
    else renderHome();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("online", () => setConnection(state.game ? "Live verbunden" : "Online", "online"));
  window.addEventListener("offline", () => setConnection("Offline", "offline"));
  window.addEventListener("pagehide", () => stopCompass(false));

  window.addEventListener("load", async () => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("./sw.js").catch((error) => console.warn("Service Worker:", error));
    }

    try {
      await initSupabase();
    } catch (error) {
      console.error(error);
      renderFatal("Die Verbindung zur gemeinsamen Datenbank konnte nicht hergestellt werden.");
      setConnection("Fehler", "offline");
    }
  });

  console.info(`Akte 1823 v${APP_VERSION}`);
})();
