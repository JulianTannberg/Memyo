let lastScroll = 0;
const header = document.getElementById('header');
if (header) {
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > lastScroll && currentScroll > 80) {
      header.style.top = '-110px';
    } else {
      header.style.top = '0';
    }
    lastScroll = currentScroll;
  });
}

const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    mainNav.classList.toggle('open');
  });
}

['dropdownLebensmomente','dropdownProduktwelten'].forEach((id) => {
  const dropdown = document.getElementById(id);
  if (!dropdown) return;
  const button = dropdown.querySelector('.dropbtn');
  if (!button) return;
  button.addEventListener('click', (e) => {
    if (window.innerWidth <= 900) {
      e.preventDefault();
      dropdown.classList.toggle('open');
    }
  });
});

/* Cookie-Hinweis: Zipchat wird erst nach Zustimmung oder bewusstem Klick geladen. */
(() => {
  const CONSENT_KEY = 'memyo_cookie_consent_v1';
  const ZIPCHAT_SRC = 'https://app.zipchat.ai/widget/zipchat.js?id=gigBpkuzlAtXY3b2qsdS';

  const getConsent = () => {
    try {
      return JSON.parse(localStorage.getItem(CONSENT_KEY));
    } catch (error) {
      return null;
    }
  };

  const saveConsent = (settings) => {
    const consent = {
      version: 1,
      savedAt: new Date().toISOString(),
      necessary: true,
      externalServices: Boolean(settings.externalServices)
    };

    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
    return consent;
  };

  const loadZipchat = () => {
    if (document.querySelector('script[data-memyo-service="zipchat"]')) return;

    const script = document.createElement('script');
    script.src = ZIPCHAT_SRC;
    script.defer = true;
    script.dataset.noOptimize = '1';
    script.dataset.memyoService = 'zipchat';
    document.body.appendChild(script);
  };

  const getOrCreateChatPlaceholder = () => {
    let placeholder = document.querySelector('.chat-placeholder');

    if (!placeholder) {
      placeholder = document.createElement('div');
      placeholder.className = 'chat-placeholder';

      const pips = document.querySelector('.pips');
      if (pips && pips.parentNode) {
        pips.parentNode.insertBefore(placeholder, pips);
      } else {
        document.body.appendChild(placeholder);
      }
    }

    return placeholder;
  };

  const updateChatPlaceholder = (consent) => {
    const placeholder = getOrCreateChatPlaceholder();

    if (consent && consent.externalServices) {
      placeholder.style.display = 'none';
      return;
    }

    placeholder.style.display = '';
    placeholder.innerHTML = `
      <strong>Pips kann dir helfen</strong>
      <span>Der Chat wird erst nach deinem Klick geladen.</span>
      <button class="chat-activate-button" type="button">Chat aktivieren</button>
    `;

    const activateButton = placeholder.querySelector('.chat-activate-button');
    activateButton?.addEventListener('click', () => {
      const updatedConsent = saveConsent({ externalServices: true });
      applyConsent(updatedConsent);
      closeBanner();
      closeModal();
      createSettingsButton();
      updateChatPlaceholder(updatedConsent);
    });
  };

  const applyConsent = (consent) => {
    if (consent && consent.externalServices) {
      loadZipchat();
    }
  };

  const closeBanner = () => {
    const banner = document.getElementById('cookieConsent');
    if (banner) banner.remove();
  };

  const closeModal = () => {
    const modal = document.getElementById('cookieModalBackdrop');
    if (modal) modal.classList.remove('open');
  };

  const openModal = () => {
    const modal = document.getElementById('cookieModalBackdrop');
    const consent = getConsent();
    const checkbox = document.getElementById('cookieExternalServices');

    if (checkbox) checkbox.checked = Boolean(consent && consent.externalServices);
    if (modal) modal.classList.add('open');
  };

  const createSettingsButton = () => {
    if (document.getElementById('cookieSettingsButton')) return;

    const button = document.createElement('button');
    button.id = 'cookieSettingsButton';
    button.className = 'cookie-settings-button';
    button.type = 'button';
    button.textContent = 'Cookie-Einstellungen';
    button.addEventListener('click', openModal);
    document.body.appendChild(button);
  };

  const createModal = () => {
    if (document.getElementById('cookieModalBackdrop')) return;

    const backdrop = document.createElement('div');
    backdrop.id = 'cookieModalBackdrop';
    backdrop.className = 'cookie-modal-backdrop';
    backdrop.setAttribute('role', 'dialog');
    backdrop.setAttribute('aria-modal', 'true');
    backdrop.setAttribute('aria-labelledby', 'cookieModalTitle');

    backdrop.innerHTML = `
      <div class="cookie-modal">
        <h2 id="cookieModalTitle">Cookie-Einstellungen</h2>
        <p>Hier kannst du festlegen, ob externe Dienste auf dieser Website geladen werden dürfen. Weitere Informationen findest du in der <a href="datenschutz.html">Datenschutzerklärung</a>.</p>

        <div class="cookie-option">
          <strong>Notwendige Technik</strong>
          <small>Immer aktiv. Dazu gehört die Speicherung deiner Cookie-Auswahl im Browser.</small>
        </div>

        <label class="cookie-option">
          <input type="checkbox" id="cookieExternalServices">
          <strong>Externe Dienste & Chat</strong>
          <small>Lädt Zipchat, damit Pips als Website-Chat helfen kann. Der Dienst wird erst nach deiner Zustimmung oder nach Klick auf „Chat aktivieren“ geladen.</small>
        </label>

        <div class="cookie-actions">
          <button class="cookie-button cookie-button-muted" type="button" id="cookieModalClose">Schließen</button>
          <button class="cookie-button cookie-button-secondary" type="button" id="cookieModalNecessary">Nur notwendige</button>
          <button class="cookie-button cookie-button-primary" type="button" id="cookieModalSave">Auswahl speichern</button>
        </div>
      </div>
    `;

    document.body.appendChild(backdrop);

    document.getElementById('cookieModalClose')?.addEventListener('click', closeModal);

    document.getElementById('cookieModalNecessary')?.addEventListener('click', () => {
      const consent = saveConsent({ externalServices: false });
      applyConsent(consent);
      updateChatPlaceholder(consent);
      closeBanner();
      closeModal();
      createSettingsButton();
    });

    document.getElementById('cookieModalSave')?.addEventListener('click', () => {
      const checkbox = document.getElementById('cookieExternalServices');
      const consent = saveConsent({ externalServices: Boolean(checkbox && checkbox.checked) });
      applyConsent(consent);
      updateChatPlaceholder(consent);
      closeBanner();
      closeModal();
      createSettingsButton();
    });

    backdrop.addEventListener('click', (event) => {
      if (event.target === backdrop) closeModal();
    });
  };

  const createBanner = () => {
    if (document.getElementById('cookieConsent')) return;

    const banner = document.createElement('section');
    banner.id = 'cookieConsent';
    banner.className = 'cookie-consent';
    banner.setAttribute('aria-labelledby', 'cookieConsentTitle');

    banner.innerHTML = `
      <h2 id="cookieConsentTitle">Cookie-Einstellungen</h2>
      <p>Wir nutzen notwendige Technik, damit diese Website funktioniert. Externe Dienste wie der Website-Chat von Zipchat werden erst geladen, wenn du zustimmst. Du kannst Pips auch später direkt über „Chat aktivieren“ einschalten. Mehr dazu steht in der <a href="datenschutz.html">Datenschutzerklärung</a>.</p>
      <div class="cookie-actions">
        <button class="cookie-button cookie-button-muted" type="button" id="cookieNecessary">Nur notwendige</button>
        <button class="cookie-button cookie-button-secondary" type="button" id="cookieCustomize">Auswahl</button>
        <button class="cookie-button cookie-button-primary" type="button" id="cookieAcceptAll">Alle akzeptieren</button>
      </div>
    `;

    document.body.appendChild(banner);

    document.getElementById('cookieNecessary')?.addEventListener('click', () => {
      const consent = saveConsent({ externalServices: false });
      applyConsent(consent);
      updateChatPlaceholder(consent);
      closeBanner();
      createSettingsButton();
    });

    document.getElementById('cookieCustomize')?.addEventListener('click', openModal);

    document.getElementById('cookieAcceptAll')?.addEventListener('click', () => {
      const consent = saveConsent({ externalServices: true });
      applyConsent(consent);
      updateChatPlaceholder(consent);
      closeBanner();
      createSettingsButton();
    });
  };

  document.addEventListener('DOMContentLoaded', () => {
    createModal();

    const consent = getConsent();
    updateChatPlaceholder(consent);

    if (consent) {
      applyConsent(consent);
      createSettingsButton();
    } else {
      createBanner();
    }
  });
})();

