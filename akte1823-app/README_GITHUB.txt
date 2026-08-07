CHAOS CREW FOTOBOX v2

Für GitHub:
1. Den Inhalt dieses Ordners in das bestehende Fotobox-Repository hochladen.
2. Die vorhandene index.html ersetzen.
3. Den Ordner assets mit hochladen.
4. Den Ordner audio mit hochladen. Eigene MP3-Dateien dort ablegen.

Änderungen in dieser Version:
- „Album: Allgemein“ entfernt.
- Startseite für Hoch- und Querformat neu aufgebaut; Zeichnung und START-Button überdecken sich nicht mehr.
- Neuer animierter Zwischenbildschirm vor dem Live-View.
- Mehrere zufällige Texte: „Bitte lächeln!“, „Cheese!“, „Gleich geht’s los!“, „Bereit?“, „Chaos Crew!“.
- Keine künstliche Browser-Stimme.
- Eigene optionale MP3-Dateien im Ordner /audio/.
- Countdown behält nur die kurzen Plopp-Töne bei den letzten drei Sekunden.
- Ergebnisansicht mit Teilen, Speichern, E-Mail, Drucken und optionalem QR-Code.
- Foto wird in der Ergebnisansicht vollständig angezeigt (object-fit: contain), auch im Querformat.
- Bestehende lokale Einstellungen werden aus chaosCrewSettings übernommen; Ausgabe-Buttons werden beim ersten Start dieser Version wieder aktiviert.
- Bestehende IndexedDB chaosCrewFotobox / Upload-Warteschlange wird weiter verwendet.

Hinweis:
Supabase-Zugangsdaten werden nicht in diese Datei eingebaut. Bereits im Browser gespeicherte Einstellungen bleiben erhalten. Auf einem neuen Gerät müssen sie einmal unter Einstellungen eingetragen werden.

UPDATE v2.1 – QR-Code
- In der Ergebnisansicht gibt es jetzt einen eigenen Button „QR-Code“.
- Der Button wird aktiv, sobald der Supabase-Upload einen öffentlichen Foto-Link geliefert hat.
- Der QR-Code öffnet sich groß in einem separaten Fenster und verdeckt das Foto nicht.
- Ohne erfolgreichen Upload kann kein QR-Code für ein anderes Handy erzeugt werden; das Foto bleibt trotzdem lokal erhalten.
