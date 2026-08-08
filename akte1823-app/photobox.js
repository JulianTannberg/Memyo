(() => {
  "use strict";

  const OVERLAY_READY = "akteOverlayReady";
  const modalState = {
    root: null,
    stream: null,
    facingMode: "environment",
    mode: "station",
    stationId: null,
    targetInputId: "cameraInput",
    meta: null,
    resultBlob: null,
    busy: false
  };

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function crewName() {
    return document.querySelector(".crew-code")?.textContent?.trim() || "Crew";
  }

  function currentStationId() {
    const band = document.querySelector(".station-band")?.textContent || "";
    const match = band.match(/Akte\s+(\d+)/i);
    return match ? Number(match[1]) : null;
  }

  function currentStationTitle() {
    const title = document.querySelector(".station-title")?.textContent?.trim();
    return title && !/unbekannt/i.test(title) ? title : "Beweisfoto";
  }

  function currentPhotoTask() {
    return document.querySelector(".optional-photo > p")?.textContent?.trim() ||
      "Haltet euren Fundort als Beweisfoto fest.";
  }

  function getMeta(mode) {
    const date = new Date().toLocaleDateString("de-DE");
    const crew = crewName();
    if (mode === "final") {
      return {
        kicker: "AKTE 1823 · ABSCHLUSSFOTO",
        title: "Fall gelöst!",
        subtitle: crew,
        task: "Jetzt gehört die ganze Crew aufs Bild. Dieses Foto kommt auf eure Urkunde und in die Ermittlungskarte.",
        footer: `Leer · ${date}`
      };
    }
    const stationId = currentStationId();
    return {
      kicker: `AKTE ${String(stationId || "").padStart(2, "0")} · FOTOAUFGABE`,
      title: currentStationTitle(),
      subtitle: crew,
      task: currentPhotoTask(),
      footer: `Leer · ${date}`
    };
  }

  function stopCamera() {
    if (modalState.stream) {
      modalState.stream.getTracks().forEach((track) => track.stop());
    }
    modalState.stream = null;
    const video = document.getElementById("aktePhotoVideo");
    if (video) video.srcObject = null;
  }

  function closeModal() {
    stopCamera();
    modalState.resultBlob = null;
    modalState.busy = false;
    modalState.root?.remove();
    modalState.root = null;
    document.body.classList.remove("akte-photobox-open");
  }

  function liveOverlay(meta, mode) {
    if (mode === "final") {
      return `
        <div class="akte-photo-live-overlay final">
          <div class="akte-photo-small">AKTE 1823</div>
          <div class="akte-photo-final-title">FALL GELÖST</div>
          <div class="akte-photo-script">${escapeHtml(meta.subtitle)}</div>
          <div class="akte-photo-footer">${escapeHtml(meta.footer)}</div>
          <div class="akte-photo-stamp">AKTE<br>GESCHLOSSEN</div>
        </div>`;
    }
    return `
      <div class="akte-photo-live-overlay">
        <div class="akte-photo-small">${escapeHtml(meta.kicker)} · ${escapeHtml(meta.footer)}</div>
        <div class="akte-photo-title">${escapeHtml(meta.title)}</div>
        <div class="akte-photo-subtitle">Crew ${escapeHtml(meta.subtitle)}</div>
      </div>`;
  }

  function openModal(mode) {
    closeModal();
    modalState.mode = mode;
    modalState.stationId = mode === "station" ? currentStationId() : null;
    modalState.targetInputId = mode === "final" ? "finalCrewCameraInput" : "cameraInput";
    modalState.facingMode = mode === "final" ? "user" : "environment";
    modalState.meta = getMeta(mode);

    const root = document.createElement("div");
    root.id = "aktePhotoBooth";
    root.className = "akte-photo-booth";
    root.innerHTML = `
      <div class="akte-photo-shell">
        <button id="aktePhotoClose" class="akte-photo-close" type="button" aria-label="Fotobox schließen">×</button>

        <section id="aktePhotoIntro" class="akte-photo-card">
          <div class="akte-photo-mark">⌕</div>
          <p class="akte-photo-kicker">${escapeHtml(modalState.meta.kicker)}</p>
          <h2>${escapeHtml(mode === "final" ? "Crew-Fotobox" : "Stadtspiel-Fotobox")}</h2>
          <p class="akte-photo-task">${escapeHtml(modalState.meta.task)}</p>
          <div class="akte-photo-preview-label">
            <strong>${escapeHtml(modalState.meta.title)}</strong>
            <span>${mode === "final" ? "Crew " : ""}${escapeHtml(modalState.meta.subtitle)}</span>
          </div>
          <p class="akte-photo-orientation">Im <strong>Querformat</strong> passt das Foto am besten in Urkunde und Ermittlungskarte.</p>
          <button id="aktePhotoStart" class="btn btn-primary akte-photo-main" type="button">Fotobox starten</button>
          <button id="aktePhotoFallback" class="btn btn-text" type="button">Normale Handykamera verwenden</button>
        </section>

        <section id="aktePhotoCamera" class="akte-photo-camera" hidden>
          <div class="akte-photo-viewfinder">
            <video id="aktePhotoVideo" autoplay muted playsinline></video>
            ${liveOverlay(modalState.meta, mode)}
            <div id="aktePhotoCountdown" class="akte-photo-countdown" aria-live="assertive"></div>
          </div>
          <div class="akte-photo-controls">
            <button id="aktePhotoSwitch" class="akte-photo-round" type="button" aria-label="Kamera wechseln">↺</button>
            <button id="aktePhotoShoot" class="akte-photo-shutter" type="button" aria-label="Foto aufnehmen"><span></span></button>
            <button id="aktePhotoCancel" class="akte-photo-round" type="button" aria-label="Abbrechen">×</button>
          </div>
          <p class="akte-photo-help">10 Sekunden Vorlauf – das passende Akte-1823-Overlay wird automatisch ins Foto gesetzt.</p>
        </section>

        <section id="aktePhotoResultStage" class="akte-photo-card akte-photo-result" hidden>
          <p class="akte-photo-kicker">BEWEISFOTO</p>
          <h2>So bleibt es in eurer Akte</h2>
          <div class="akte-photo-result-frame"><img id="aktePhotoResult" alt="Vorschau des fertigen Fotos"></div>
          <div class="akte-photo-result-actions">
            <button id="aktePhotoRetake" class="btn btn-secondary" type="button">Nochmal</button>
            <button id="aktePhotoUse" class="btn btn-primary" type="button">Foto verwenden</button>
          </div>
        </section>
      </div>`;

    document.body.appendChild(root);
    document.body.classList.add("akte-photobox-open");
    modalState.root = root;

    root.querySelector("#aktePhotoClose")?.addEventListener("click", closeModal);
    root.querySelector("#aktePhotoCancel")?.addEventListener("click", closeModal);
    root.querySelector("#aktePhotoStart")?.addEventListener("click", startCamera);
    root.querySelector("#aktePhotoSwitch")?.addEventListener("click", switchCamera);
    root.querySelector("#aktePhotoShoot")?.addEventListener("click", countdownAndCapture);
    root.querySelector("#aktePhotoRetake")?.addEventListener("click", retake);
    root.querySelector("#aktePhotoUse")?.addEventListener("click", useResult);
    root.querySelector("#aktePhotoFallback")?.addEventListener("click", () => {
      const inputId = modalState.targetInputId;
      closeModal();
      document.getElementById(inputId)?.click();
    });
  }

  async function startCamera() {
    if (modalState.busy) return;
    if (!navigator.mediaDevices?.getUserMedia) {
      alert("Die integrierte Fotobox wird von diesem Browser nicht unterstützt. Bitte nutzt die normale Handykamera.");
      return;
    }
    modalState.busy = true;
    stopCamera();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: { ideal: modalState.facingMode },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      modalState.stream = stream;
      const intro = document.getElementById("aktePhotoIntro");
      const camera = document.getElementById("aktePhotoCamera");
      const result = document.getElementById("aktePhotoResultStage");
      if (intro) intro.hidden = true;
      if (result) result.hidden = true;
      if (camera) camera.hidden = false;
      const video = document.getElementById("aktePhotoVideo");
      if (!video) throw new Error("Kameravorschau fehlt.");
      video.srcObject = stream;
      video.classList.toggle("front", modalState.facingMode === "user");
      await video.play();
    } catch (error) {
      console.warn("Akte-1823-Fotobox:", error);
      const intro = document.getElementById("aktePhotoIntro");
      const camera = document.getElementById("aktePhotoCamera");
      if (intro) intro.hidden = false;
      if (camera) camera.hidden = true;
      alert("Die Kamera konnte nicht geöffnet werden. Ihr könnt stattdessen die normale Handykamera verwenden.");
    } finally {
      modalState.busy = false;
    }
  }

  async function switchCamera() {
    if (modalState.busy) return;
    modalState.facingMode = modalState.facingMode === "user" ? "environment" : "user";
    await startCamera();
  }

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function countdownAndCapture() {
    if (modalState.busy || !modalState.stream) return;
    modalState.busy = true;
    const countdown = document.getElementById("aktePhotoCountdown");
    const shoot = document.getElementById("aktePhotoShoot");
    const switcher = document.getElementById("aktePhotoSwitch");
    if (shoot) shoot.disabled = true;
    if (switcher) switcher.disabled = true;
    try {
      for (let n = 10; n >= 1; n -= 1) {
        if (countdown) countdown.textContent = String(n);
        await wait(1000);
      }
      if (countdown) {
        countdown.textContent = "Bitte lächeln!";
        countdown.classList.add("smile");
      }
      await wait(700);
      await capture();
    } catch (error) {
      console.error(error);
      alert("Das Foto konnte nicht aufgenommen werden. Bitte versucht es noch einmal.");
    } finally {
      if (countdown) {
        countdown.textContent = "";
        countdown.classList.remove("smile");
      }
      modalState.busy = false;
    }
  }

  function drawSource(ctx, source, width, height, mirror = false) {
    const sw = source.videoWidth || source.naturalWidth || source.width;
    const sh = source.videoHeight || source.naturalHeight || source.height;
    if (!sw || !sh) throw new Error("Bildgröße fehlt.");
    const targetRatio = width / height;
    const sourceRatio = sw / sh;
    let sx = 0;
    let sy = 0;
    let cropW = sw;
    let cropH = sh;
    if (sourceRatio > targetRatio) {
      cropW = sh * targetRatio;
      sx = (sw - cropW) / 2;
    } else if (sourceRatio < targetRatio) {
      cropH = sw / targetRatio;
      sy = (sh - cropH) / 2;
    }
    ctx.save();
    if (mirror) {
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(source, sx, sy, cropW, cropH, 0, 0, width, height);
    ctx.restore();
  }

  function fitFont(ctx, text, maxWidth, startSize, family, weight = "700", style = "normal") {
    let size = startSize;
    while (size > 18) {
      ctx.font = `${style} ${weight} ${size}px ${family}`;
      if (ctx.measureText(text).width <= maxWidth) return size;
      size -= 2;
    }
    return size;
  }

  function drawOverlay(ctx, width, height, mode, meta, stationId) {
    const scale = Math.max(0.75, Math.min(2.2, Math.min(width, height) / 900));
    const bandHeight = mode === "final" ? Math.max(205 * scale, height * 0.25) : Math.max(155 * scale, height * 0.19);
    const y = height - bandHeight;
    const pad = Math.max(30 * scale, width * 0.032);
    ctx.save();
    ctx.fillStyle = "rgba(16,54,45,.94)";
    ctx.fillRect(0, y, width, bandHeight);
    ctx.fillStyle = "#b08a45";
    ctx.fillRect(0, y, width, Math.max(7, 7 * scale));
    ctx.textBaseline = "alphabetic";

    if (mode === "final") {
      ctx.fillStyle = "#f5ead6";
      ctx.font = `700 ${Math.max(30 * scale, width * 0.034)}px Georgia, serif`;
      ctx.fillText("AKTE 1823 · FALL GELÖST", pad, y + bandHeight * 0.32);
      const crewText = `Crew ${meta.subtitle}`;
      fitFont(ctx, crewText, width * 0.62, Math.max(44 * scale, width * 0.048), '"Segoe Script", "Brush Script MT", cursive', "700", "italic");
      ctx.fillText(crewText, pad, y + bandHeight * 0.65);
      ctx.font = `600 ${Math.max(18 * scale, width * 0.020)}px Georgia, serif`;
      ctx.fillStyle = "#d9c8a9";
      ctx.fillText(meta.footer, pad, y + bandHeight * 0.87);

      const stampW = Math.min(width * 0.26, 250 * scale);
      const stampH = bandHeight * 0.60;
      ctx.save();
      ctx.translate(width - pad - stampW / 2, y + bandHeight * 0.50);
      ctx.rotate(-0.08);
      ctx.strokeStyle = "#c8675d";
      ctx.lineWidth = Math.max(4, 5 * scale);
      ctx.strokeRect(-stampW / 2, -stampH / 2, stampW, stampH);
      ctx.fillStyle = "#d77a70";
      ctx.textAlign = "center";
      ctx.font = `800 ${Math.max(17 * scale, width * 0.020)}px Georgia, serif`;
      ctx.fillText("AKTE", 0, -4 * scale);
      ctx.font = `800 ${Math.max(15 * scale, width * 0.017)}px Georgia, serif`;
      ctx.fillText("GESCHLOSSEN", 0, 25 * scale, stampW * 0.86);
      ctx.restore();
    } else {
      ctx.fillStyle = "#d9c8a9";
      ctx.font = `700 ${Math.max(17 * scale, width * 0.018)}px Georgia, serif`;
      ctx.fillText(`AKTE ${String(stationId || "").padStart(2, "0")} · BEWEISFOTO · ${meta.footer}`, pad, y + bandHeight * 0.28);
      ctx.fillStyle = "#f5ead6";
      fitFont(ctx, meta.title.toUpperCase(), width - pad * 2, Math.max(34 * scale, width * 0.038), "Georgia, serif");
      ctx.fillText(meta.title.toUpperCase(), pad, y + bandHeight * 0.62);
      ctx.font = `italic ${Math.max(20 * scale, width * 0.022)}px Georgia, serif`;
      ctx.fillStyle = "#f0dfc5";
      ctx.fillText(`Crew ${meta.subtitle}`, pad, y + bandHeight * 0.85, width - pad * 2);
    }
    ctx.restore();
  }

  function canvasBlob(canvas) {
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Bild konnte nicht erstellt werden.")), "image/jpeg", 0.92);
    });
  }

  async function capture() {
    const video = document.getElementById("aktePhotoVideo");
    if (!video?.videoWidth || !video?.videoHeight) throw new Error("Kamerabild ist noch nicht bereit.");
    const canvas = document.createElement("canvas");
    const width = Math.min(1800, Math.max(1200, video.videoWidth));
    canvas.width = width;
    canvas.height = Math.round(width * 3 / 4);
    const ctx = canvas.getContext("2d");
    drawSource(ctx, video, canvas.width, canvas.height, modalState.facingMode === "user");
    drawOverlay(ctx, canvas.width, canvas.height, modalState.mode, modalState.meta, modalState.stationId);
    modalState.resultBlob = await canvasBlob(canvas);
    stopCamera();

    const camera = document.getElementById("aktePhotoCamera");
    const resultStage = document.getElementById("aktePhotoResultStage");
    const result = document.getElementById("aktePhotoResult");
    if (camera) camera.hidden = true;
    if (resultStage) resultStage.hidden = false;
    if (result) result.src = URL.createObjectURL(modalState.resultBlob);
  }

  async function retake() {
    modalState.resultBlob = null;
    document.getElementById("aktePhotoResult")?.removeAttribute("src");
    document.getElementById("aktePhotoResultStage")?.setAttribute("hidden", "");
    await startCamera();
  }

  function setInputFile(input, blob, filename) {
    const file = blob instanceof File ? blob : new File([blob], filename, { type: blob.type || "image/jpeg" });
    try {
      const dt = new DataTransfer();
      dt.items.add(file);
      input.files = dt.files;
      return true;
    } catch (error) {
      console.warn("DataTransfer nicht verfügbar:", error);
      return false;
    }
  }

  function dispatchReadyChange(input) {
    input.dataset[OVERLAY_READY] = "1";
    input.dispatchEvent(new Event("change", { bubbles: true }));
  }

  async function useResult() {
    if (!modalState.resultBlob || modalState.busy) return;
    modalState.busy = true;
    const inputId = modalState.targetInputId;
    const mode = modalState.mode;
    const stationId = modalState.stationId;
    const input = document.getElementById(inputId);
    const blob = modalState.resultBlob;
    if (!input) {
      modalState.busy = false;
      alert("Das Fotoziel konnte nicht gefunden werden.");
      return;
    }
    const filename = mode === "final" ? "akte-1823-abschlussfoto.jpg" : `akte-1823-station-${stationId}.jpg`;
    if (!setInputFile(input, blob, filename)) {
      modalState.busy = false;
      alert("Dieses Gerät kann das fertige Foto nicht automatisch an die App übergeben. Bitte nutzt die normale Handykamera.");
      return;
    }
    closeModal();
    dispatchReadyChange(input);
  }

  async function fileToDrawable(file) {
    if (window.createImageBitmap) {
      try { return await createImageBitmap(file); } catch { /* fallback */ }
    }
    const url = URL.createObjectURL(file);
    try {
      return await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
      });
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  async function overlaySelectedFile(input, file) {
    const finalMode = input.id.startsWith("finalCrew");
    const mode = finalMode ? "final" : "station";
    const stationId = finalMode ? null : currentStationId();
    const meta = getMeta(mode);
    const drawable = await fileToDrawable(file);
    try {
      const sw = drawable.width || drawable.naturalWidth;
      const width = Math.min(1800, Math.max(1200, sw || 1200));
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = Math.round(width * 3 / 4);
      const ctx = canvas.getContext("2d");
      drawSource(ctx, drawable, canvas.width, canvas.height, false);
      drawOverlay(ctx, canvas.width, canvas.height, mode, meta, stationId);
      return await canvasBlob(canvas);
    } finally {
      if (drawable && typeof drawable.close === "function") drawable.close();
    }
  }

  const photoInputIds = new Set(["cameraInput", "galleryInput", "finalCrewCameraInput", "finalCrewGalleryInput"]);

  document.addEventListener("click", (event) => {
    const button = event.target.closest?.("#takePhotoButton, #takeFinalPhotoButton");
    if (!button) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    openModal(button.id === "takeFinalPhotoButton" ? "final" : "station");
  }, true);

  document.addEventListener("change", (event) => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement) || !photoInputIds.has(input.id)) return;

    if (input.dataset[OVERLAY_READY] === "1") {
      delete input.dataset[OVERLAY_READY];
      return;
    }

    const file = input.files?.[0];
    if (!file) return;

    event.stopPropagation();
    event.stopImmediatePropagation();

    (async () => {
      try {
        const blob = await overlaySelectedFile(input, file);
        const suffix = input.id.startsWith("finalCrew") ? "abschlussfoto" : `station-${currentStationId() || "foto"}`;
        if (!setInputFile(input, blob, `akte-1823-${suffix}.jpg`)) throw new Error("Datei konnte nicht ersetzt werden.");
      } catch (error) {
        console.warn("Akte-Overlay konnte nicht gesetzt werden; Original wird verwendet:", error);
      } finally {
        dispatchReadyChange(input);
      }
    })();
  }, true);
})();
