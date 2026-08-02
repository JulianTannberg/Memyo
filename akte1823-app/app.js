(() => {
  "use strict";

  const APP_VERSION = "1.1.0";
  const STORAGE_KEY = "akte1823.game";
  const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  const DEFAULT_SETUP = {
    brideName: "Bettina",
    libraryTitle: "",
    libraryPage: "",
    libraryLine: "",
    libraryWord: "",
    libraryNote: "Das vorbereitete Buch liegt für euch bereit.",
    teaMuseumTask: "Findet heraus, wer 1806 in Leer einen Laden eröffnete und womit dort gehandelt wurde.",
    finalDateHint: "Sucht an der letzten Station nach dem vollständigen Datum der Stadtrechte."
  };

  const STATIONS = [
    {
      id: 1,
      title: "Stadtbibliothek",
      kicker: "Die Spur im alten Speicher",
      riddle: "Sucht ein Gebäude, in dem früher Waren lagerten und heute Geschichten, Wissen und Erinnerungen gesammelt werden.",
      task: (setup) => {
        const details = [];
        if (setup.libraryTitle) details.push(`<li><strong>Titel:</strong> ${escapeHtml(setup.libraryTitle)}</li>`);
        if (setup.libraryPage) details.push(`<li><strong>Seite:</strong> ${escapeHtml(setup.libraryPage)}</li>`);
        if (setup.libraryLine) details.push(`<li><strong>Zeile:</strong> ${escapeHtml(setup.libraryLine)}</li>`);
        if (setup.libraryWord) details.push(`<li><strong>Gesuchtes Wort:</strong> ${escapeHtml(setup.libraryWord)}</li>`);
        return `
          <p>${escapeHtml(setup.libraryNote || DEFAULT_SETUP.libraryNote)}</p>
          ${details.length ? `<ul>${details.join("")}</ul>` : `<p class="callout">Die genaue Buchstelle wird nach dem Anruf bei der Bibliothek ergänzt.</p>`}
          <p>Notiert das gefundene Wort oder den gefundenen Namen.</p>
        `;
      },
      hint: "Das Gebäude liegt in der Altstadt und ist heute öffentlich zugänglich.",
      photo: (name) => `${name} als historische Ermittlerin mit Buch und Notizzettel.`,
      next: "Der nächste Hinweis hängt in einer Kirche an der Wand und erinnert an zu lange Predigten."
    },
    {
      id: 2,
      title: "Große Kirche",
      kicker: "Die Uhr gegenüber der Kanzel",
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
      photo: (name) => `${name} hält eine feierliche Predigt, während die anderen demonstrativ auf die Uhr schauen.`,
      next: "Weiter geht es zu einem alten Haus mit dem Namen eines besonders starken Mannes und einem ungewöhnlichen Glücksbringer."
    },
    {
      id: 3,
      title: "Haus Samson",
      kicker: "Der ungewöhnliche Glücksbringer",
      riddle: "Gesucht ist ein altes Haus, das den Namen eines besonders starken Mannes trägt. Im Erdgeschoss wird mit etwas Genussvollem gehandelt. Im Inneren versteckt sich ein Glücksbringer, in dem eigentlich gefiederte Bewohner leben könnten.",
      task: () => `
        <p>Findet das Haus und beantwortet:</p>
        <p><strong>Welcher Gegenstand sollte den Bewohnern Glück bringen?</strong></p>
      `,
      hint: "Der Hausname erinnert an eine biblische Figur – nicht an den zotteligen Bewohner aus der Sesamstraße.",
      photo: (name) => `Ein vornehmes historisches Familienporträt mit ${name} vor oder im Haus.`,
      next: "Eine bronzene Frau mit Tasse und Kanne führt euch zur nächsten Spur."
    },
    {
      id: 4,
      title: "Teelke & Bünting-Teemuseum",
      kicker: "Die Spur des Tees",
      riddle: "Findet zuerst die bronzene Frau, die seit Jahren eine volle Tasse hält, ohne daraus zu trinken. Untersucht die Figur genau und folgt anschließend der Spur des Tees ins Museum.",
      task: (setup) => `
        <ol>
          <li>Welche Jahreszahl gehört zur Figur?</li>
          <li>${escapeHtml(setup.teaMuseumTask || DEFAULT_SETUP.teaMuseumTask)}</li>
          <li>Welche Jahreszahl gehört zum Beginn des Geschäfts?</li>
        </ol>
      `,
      hint: "Nicht das Getränk ist die Lösung. Sucht nach Namen, Jahreszahlen und der Geschichte des Geschäfts.",
      photo: (name) => `${name} und die Gruppe stellen ein altes Foto nach – alternativ eine feierliche ostfriesische Tee-Pose.`,
      next: "Nun sucht das Gebäude, das heute wie kein anderes zeigt, dass Leer eine Stadt ist."
    },
    {
      id: 5,
      title: "Historisches Rathaus",
      kicker: "Ein Gebäude mit falscher Spur",
      riddle: "Findet das Gebäude, das heute wie kein anderes für die Stadt Leer steht. Doch Vorsicht: Es ist deutlich jünger als die Verleihung der Stadtrechte.",
      task: () => `
        <p><strong>In welchen Jahren wurde das Historische Rathaus errichtet?</strong></p>
        <p>Notiert die Bauzeit. Das gesuchte Jahr der Stadtrechte liegt deutlich davor.</p>
      `,
      hint: "Sucht nach einer Informationstafel am oder nahe dem Gebäude – oder fragt vor Ort nach der Bauzeit.",
      photo: (name) => `${name} als Bürgermeisterin auf der Rathaustreppe.`,
      next: "Zum Schluss geht es dorthin, wo Handel, Wasser und Gewichte zusammenkamen."
    },
    {
      id: 6,
      title: "Alte Waage & Museumshafen",
      kicker: "Der entscheidende Beweis",
      riddle: "Schon bevor Leer offiziell eine Stadt wurde, machten Handel, Hafen und Schifffahrt den Ort bedeutend. Findet den Platz, an dem Waren gewogen wurden und historische Schiffe liegen.",
      task: (setup) => `
        <ol>
          <li>In welchem Jahr wurde die Alte Waage erbaut?</li>
          <li>Welche Gegenstände sind über ihren Eingängen dargestellt?</li>
          <li>${escapeHtml(setup.finalDateHint || DEFAULT_SETUP.finalDateHint)}</li>
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
    turnstileWidgetId: null
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
    } catch (error) {
      handleError(error, "Die Änderung konnte nicht gespeichert werden.");
    } finally {
      setBusy(false);
    }
  }

  async function saveSetup(form) {
    const data = new FormData(form);
    const setup = normalizeSetup({
      brideName: data.get("brideName")?.trim() || DEFAULT_SETUP.brideName,
      libraryTitle: data.get("libraryTitle")?.trim() || "",
      libraryPage: data.get("libraryPage")?.trim() || "",
      libraryLine: data.get("libraryLine")?.trim() || "",
      libraryWord: data.get("libraryWord")?.trim() || "",
      libraryNote: data.get("libraryNote")?.trim() || DEFAULT_SETUP.libraryNote,
      teaMuseumTask: data.get("teaMuseumTask")?.trim() || DEFAULT_SETUP.teaMuseumTask,
      finalDateHint: data.get("finalDateHint")?.trim() || DEFAULT_SETUP.finalDateHint
    });
    await updateGame({ setup }, "Vorbereitung gespeichert.");
  }

  async function saveAnswer(stationId, value) {
    const answers = { ...normalizeAnswers(state.game.answers), [String(stationId)]: String(value || "").trim() };
    await updateGame({ answers }, "Antwort gespeichert.");
  }

  async function goToStation(stationNumber) {
    const target = Math.max(0, Math.min(7, Number(stationNumber)));
    await updateGame({ current_station: target }, target === 7 ? "Abschlussakte geöffnet." : "Nächste Station geöffnet.");
  }

  async function leaveGame() {
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
        <p class="eyebrow">Historische Stadtrallye</p>
        <h1>Akte 1823</h1>
        <p>Sechs Stationen, eine gemeinsame Spur und ein Spielstand, der auf allen drei Handys gleichzeitig weiterläuft.</p>
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
        <h2>So funktioniert es</h2>
        <p>Eine Person tippt auf <strong>Spiel starten</strong> und erhält einen Code. Die beiden anderen geben denselben Code ein. Ab dann sehen alle dieselbe Station, dieselben Antworten und denselben Fortschritt.</p>
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

    return `
      <section class="game-head">
        <div class="game-head-top">
          <div>
            <div class="game-label">Gemeinsamer Spielcode</div>
            <div class="game-code">${escapeHtml(state.game.code)}</div>
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
          <h2>Das Spiel wird vorbereitet</h2>
          <p>Die Person, die das Spiel gestartet hat, ergänzt noch die letzten Angaben und öffnet anschließend Station 1.</p>
        </section>
      `;
    }

    return `
      <section class="panel">
        <h2>Spiel vorbereiten</h2>
        <p>Die Route ist bereits angelegt. Hier kannst du die noch offenen Angaben nach dem Anruf bei der Bibliothek oder nach deinem Probelauf ergänzen.</p>
        <form id="setupForm" class="setup-grid">
          <label class="field">
            <span>Name der Braut</span>
            <input name="brideName" value="${escapeHtml(setup.brideName)}">
          </label>
          <label class="field">
            <span>Bibliothek: Buchtitel</span>
            <input name="libraryTitle" value="${escapeHtml(setup.libraryTitle)}" placeholder="wird noch festgelegt">
          </label>
          <label class="field">
            <span>Bibliothek: Seite</span>
            <input name="libraryPage" value="${escapeHtml(setup.libraryPage)}" inputmode="numeric">
          </label>
          <label class="field">
            <span>Bibliothek: Zeile</span>
            <input name="libraryLine" value="${escapeHtml(setup.libraryLine)}" inputmode="numeric">
          </label>
          <label class="field">
            <span>Bibliothek: welches Wort?</span>
            <input name="libraryWord" value="${escapeHtml(setup.libraryWord)}" placeholder="z. B. das 3. Wort">
          </label>
          <label class="field">
            <span>Bibliothek: Zusatzhinweis</span>
            <textarea name="libraryNote">${escapeHtml(setup.libraryNote)}</textarea>
          </label>
          <label class="field">
            <span>Teemuseum: genaue Suchaufgabe</span>
            <textarea name="teaMuseumTask">${escapeHtml(setup.teaMuseumTask)}</textarea>
          </label>
          <label class="field">
            <span>Letzte Station: Hinweis zum Stadtrechtsdatum</span>
            <textarea name="finalDateHint">${escapeHtml(setup.finalDateHint)}</textarea>
          </label>
          <div class="setup-actions">
            <button class="btn btn-secondary" type="submit">Vorbereitung speichern</button>
            <button id="startRouteButton" class="btn btn-primary" type="button">Station 1 öffnen</button>
          </div>
        </form>
      </section>
    `;
  }

  function renderStation(station) {
    const setup = normalizeSetup(state.game.setup);
    const answer = normalizeAnswers(state.game.answers)[String(station.id)] || "";
    const name = setup.brideName || DEFAULT_SETUP.brideName;
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
            ${station.task(setup)}
          </section>

          <section class="section">
            <h2 class="section-title"><span aria-hidden="true">✓</span> Eure Antwort</h2>
            <div class="answer-box">
              <label class="field" style="margin-top:0">
                <span>Notizen dieser Station</span>
                <textarea id="stationAnswer" placeholder="Antwort oder Fundstück notieren …">${escapeHtml(answer)}</textarea>
              </label>
              <button id="saveAnswerButton" class="btn btn-secondary" type="button">Antwort für alle speichern</button>
              <div class="answer-status">Die Antwort erscheint anschließend auf allen verbundenen Handys.</div>
            </div>
          </section>

          <section class="section">
            <h2 class="section-title"><span aria-hidden="true">▣</span> Fotoaufgabe</h2>
            <p>${escapeHtml(station.photo(name))}</p>
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
        <p>Damit ist eure historische Spurensuche abgeschlossen, ${escapeHtml(setup.brideName || DEFAULT_SETUP.brideName)}.</p>

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
    document.getElementById("setupForm")?.addEventListener("submit", (event) => {
      event.preventDefault();
      saveSetup(event.currentTarget);
    });
    document.getElementById("startRouteButton")?.addEventListener("click", async () => {
      const form = document.getElementById("setupForm");
      await saveSetup(form);
      await goToStation(1);
    });
  }

  function bindStationEvents(stationId) {
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

  async function shareCode() {
    const text = `Akte 1823 – Spielcode: ${state.game.code}`;
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
