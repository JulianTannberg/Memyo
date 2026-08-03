// Öffentliche Konfiguration der App.
// Niemals den service_role-/Secret-Key hier eintragen.
window.AKTE1823_CONFIG = {
  supabaseUrl: "https://ypqpumbjuhzvvpokrckt.supabase.co",
  supabaseAnonKey: "sb_publishable_UPpX42hzOlk652iwFXplvQ_nmFhYQmk",
  turnstileSiteKey: "0x4AAAAAAEEncwDipUDZ2fQL",
  captchaEnabled: false,

  // Diese Angaben gelten für alle Spielrunden und werden nur einmal ergänzt.
  // Das Bibliothekswort ist die exakte Lösung, die die erste Aufgabe freischaltet.
  route: {
    libraryTitle: "",
    libraryPage: "",
    libraryLine: "",
    libraryWord: "",
    libraryNote: "Das vorbereitete Buch liegt in der Stadtbibliothek bereit.",
    teaMuseumTask: "Findet heraus, wer 1806 in Leer einen Laden eröffnete und womit dort gehandelt wurde.",
    finalDateHint: "Sucht an der letzten Station nach dem vollständigen Datum der Stadtrechte."
  }
};
