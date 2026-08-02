# Akte 1823 – Spurensuche durch Leer

Mobile PWA für eine gemeinsame historische Stadtrallye. Eine Person startet das Spiel und erhält einen sechsstelligen Code. Weitere Personen treten mit dem Code bei. Station, Antworten und Fortschritt werden über Supabase in Echtzeit synchronisiert.

## Enthalten

- Starten und Beitreten per Spielcode
- anonyme Teilnahme ohne Benutzerkonto
- gemeinsamer Live-Spielstand auf mehreren Handys
- sechs vorbereitete Stationen
- editierbare Vorbereitung für Bibliotheksbuch, Teemuseum und Schluss-Hinweis
- gemeinsame Antwortnotizen
- Notfall-Hinweise und Fotoaufgaben
- PWA-Installation auf dem Startbildschirm

## 1. Supabase vorbereiten

1. In Supabase ein Projekt öffnen.
2. **Authentication → Sign In / Providers → Anonymous** aktivieren.
3. **SQL Editor → New query** öffnen.
4. Den vollständigen Inhalt von `supabase-setup.sql` einfügen und ausführen.
5. Unter **Project Settings → API** diese beiden Werte kopieren:
   - Project URL
   - Publishable Key oder Anon Key
6. Die Werte in `config.js` eintragen.

Wichtig: Niemals den `service_role`-Schlüssel in `config.js` eintragen.

## 2. Lokal testen

Die Dateien müssen über einen kleinen Webserver geöffnet werden, nicht direkt per Doppelklick.

Beispiel mit Python:

```bash
python -m http.server 8080
```

Dann im Browser öffnen: `http://localhost:8080`

## 3. GitHub Pages

Am saubersten ist ein eigenes Repository, zum Beispiel `akte-1823`.

1. Alle Dateien dieses Ordners in das Repository hochladen.
2. In GitHub unter **Settings → Pages** als Quelle `Deploy from a branch` wählen.
3. Branch `main`, Ordner `/ (root)` auswählen.
4. Zunächst die GitHub-Pages-Adresse testen.

## 4. Subdomain unter memyo.de

Empfehlung: `spiel.memyo.de`.

1. In den GitHub-Pages-Einstellungen `spiel.memyo.de` als Custom Domain eintragen.
2. Bei STRATO einen CNAME-Eintrag anlegen:
   - Host/Name: `spiel`
   - Ziel: `juliantannberg.github.io`
3. Nach erfolgreicher DNS-Prüfung in GitHub **Enforce HTTPS** aktivieren.
4. Optional eine Datei namens `CNAME` mit dem Inhalt `spiel.memyo.de` ins Repository legen.

## Noch offen vor dem echten Spiel

- das genaue historische Bibliotheksbuch sowie Seite/Zeile/Wort eintragen
- Suchaufgabe im Teemuseum nach dem Probelauf präzisieren
- prüfen, wo das Datum der Stadtrechte an Station 6 zuverlässig gefunden wird
- alte Hafenfotos später als Bilddateien ergänzen
