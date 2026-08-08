// Öffentliche Konfiguration der App.
// Niemals den service_role-/Secret-Key hier eintragen.
window.AKTE1823_CONFIG = {
  supabaseUrl: "https://ypqpumbjuhzvvpokrckt.supabase.co",
  supabaseAnonKey: "sb_publishable_UPpX42hzOlk652iwFXplvQ_nmFhYQmk",

  // Derzeit ohne CAPTCHA, damit die anonyme Gruppen-Anmeldung stabil getestet werden kann.
  // In Supabase muss CAPTCHA Protection dafür ebenfalls ausgeschaltet sein.
  captchaEnabled: false
};
