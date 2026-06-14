# Fokusplan 🎯

Eine **ADHS-freundliche Webapp zur flexiblen Tagesplanung und Zielsetzung**.
Gestaltet nach Erkenntnissen aus der ADHS-Forschung – reizarm, schamfrei und
auf das *Anfangen* ausgelegt.

→ Die wissenschaftliche Grundlage und alle Design-Entscheidungen stehen in
[`CONCEPT.md`](./CONCEPT.md).

## Funktionen

- **📅 Heute – flexible Tagesplanung**
  - Aktivitäten per Drag & Drop frei umsortieren
  - Optionale Dauer, Uhrzeit und Energielevel (🪫/🔋/⚡)
  - „Jetzt dran"-Karte: hebt die nächste Aufgabe hervor und startet den Fokus
  - Sichtbarer Tagesfortschritt, „Auf morgen schieben" ohne Schuldgefühl
- **🎯 Ziele**
  - Große Ziele in winzige Schritte zerlegen
  - **Wenn-Dann-Pläne** (Implementation Intentions) je Ziel
  - „Warum"-Feld zur Verankerung der Motivation
  - Schritte direkt in den heutigen Plan übernehmen
- **⏳ Fokus-Modus**
  - Großer **visueller Countdown-Ring** gegen Zeitblindheit
  - **10-Minuten-Einstieg** gegen den Start-Widerstand
  - Pomodoro-Logik mit Pausen, eine Aufgabe pro Bildschirm
- **✨ Ich / Fortschritt**
  - Punkte, schamfreie Streaks, Wochenübersicht, Abzeichen
  - „Heute geschafft"-Rückblick zum Feiern
  - Einstellungen (Name, Fokus-/Pausendauer, Animationen reduzieren)

## Technik

- **React + TypeScript + Vite**
- **Zustand** (mit `localStorage`-Persistenz) – keine Server, kein Login
- **PWA**: installierbar und offline nutzbar (`vite-plugin-pwa`)
- **@dnd-kit** für Drag & Drop
- **Datenschutz**: alle Daten bleiben lokal im Browser

## Lokal starten

```bash
npm install
npm run dev      # Entwicklungsserver
```

Produktions-Build und Vorschau:

```bash
npm run build
npm run preview
```

Weitere Skripte: `npm run typecheck`.

---

> Fokusplan ist ein unterstützendes Werkzeug und ersetzt keine Diagnose oder
> Therapie.
