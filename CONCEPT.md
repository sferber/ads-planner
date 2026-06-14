# Fokusplan – Konzept & wissenschaftliche Grundlage

Fokusplan ist eine Tagesplanungs-Webapp speziell für Menschen mit
Aufmerksamkeitsdefizit­(-/Hyperaktivitäts-)störung (ADHS/ADS). Sie ist bewusst
**nicht** als weiterer überladener Produktivitäts-Manager gestaltet, sondern
orientiert sich an den Besonderheiten exekutiver Funktionen bei ADHS.

## Leitprinzipien aus der Forschung

### 1. Zeitblindheit sichtbar machen
Menschen mit ADHS nehmen Zeit anders wahr („time blindness", Russell Barkley):
Der zeitliche Horizont ist kürzer, Deadlines tauchen oft erst auf, wenn es zu
spät ist. Schlussfolgerung für das Produkt:

- **Visueller Timer** (sich leerender Ring) statt nur abstrakter Uhrzeiten.
- **Geschätzte Dauer** pro Aktivität als sichtbarer Chip.
- Restzeit des Tages („noch ~X geplant") wird explizit angezeigt.

### 2. Task Initiation – der Start ist die Hürde
Nicht das Durchhalten, sondern das *Anfangen* ist bei ADHS das eigentliche
Problem. Bewährte Strategien:

- **10-Minuten-Regel**: prominenter „Starte einfach 10 Minuten"-Einstieg im
  Fokus-Modus und auf der „Jetzt dran"-Karte. Einmal in Bewegung, trägt der
  Schwung weiter.
- **„Eine Sache. Jetzt."** – der Fokus-Modus zeigt genau eine Aufgabe.
- **Absurd kleine Schritte**: Ziele werden in winzige, sofort machbare Schritte
  zerlegt, sodass die exekutive Dysfunktion keinen Widerstand aufbauen kann.

### 3. Implementation Intentions (Wenn-Dann-Pläne)
„If-then plans" nach Peter Gollwitzer sind eine der am besten belegten
Selbstregulations­strategien und verbessern nachweislich exekutive Funktionen
und Inhibitionskontrolle bei Kindern mit ADHS. Deshalb hat jedes Ziel einen
eigenen Bereich für Pläne der Form **„Wenn X passiert, dann mache ich Y."**

### 4. Goal Management & das „Warum"
Ein rein zielorientierter Ansatz erzeugt noch keine Handlung. Goal Management
Training betont das Herunterbrechen in konkrete Alltagsschritte und das
Verankern der Motivation. Jedes Ziel speichert deshalb ein optionales „Warum",
das die persönliche Bedeutung sichtbar hält.

### 5. Dopamin & schamfreie Gamification
Das ADHS-Gehirn produziert für monotone Aufgaben weniger Dopamin.
Gamification kann das ausgleichen – aber nur, wenn sie **Handlung belohnt und
Untätigkeit nie bestraft**:

- Punkte für erledigte Aktivitäten und Schritte (Quick Wins).
- **Streaks ohne Scham**: eine Lücke setzt nur den Zähler zurück, ohne den
  Menschen abzuwerten („du fängst nie bei null an").
- Abzeichen für Meilensteine, nicht für lückenlose Perfektion.
- Täglicher „Heute geschafft"-Rückblick zum Feiern statt zum Bewerten.

### 6. Reizarme, fokussierte Oberfläche
Überladene Interfaces erhöhen die Ablenkbarkeit. Designentscheidungen:

- Eine klare Hauptaktion pro Bildschirm, viel Weißraum, große Tap-Flächen.
- Ruhige Farbpalette, dezente Animationen (per Schalter reduzierbar).
- Schnelles Erfassen: ein Titel genügt, alles andere ist optional.

### 7. Flexibilität statt starrem Stundenplan
ADHS-Tage verlaufen selten nach Plan. Deshalb:

- Aktivitäten sind **per Drag & Drop frei umsortierbar**.
- Uhrzeiten sind optionale Anker, keine Pflicht.
- „Auf morgen schieben" mit einem Tipp, ohne Schuldgefühl.
- Energielevel-Angabe (🪫/🔋/⚡), um Aufgaben realistisch zur Tagesform zu
  planen.

## Datenschutz
Alle Daten bleiben ausschließlich lokal im Browser (localStorage). Es gibt
keinen Server, kein Konto und kein Tracking. Die App ist als installierbare
PWA offline nutzbar.

## Quellen (Auswahl)
- Russell Barkley zu Zeitwahrnehmung und exekutiven Funktionen bei ADHS.
- Gollwitzer & Kollegen: Implementation Intentions / If-Then Plans;
  „If-Then Plans Benefit Executive Functions in Children with ADHD".
- Goal Management Training als kognitives Remediationsverfahren bei ADHS
  (u. a. NCBI/PMC: „Improvement of anxiety in ADHD following goal-focused
  cognitive remediation").
- Praxis-/Designliteratur zu ADHS-freundlichem App-Design, Body-Doubling und
  Gamification (ADDA, Gravitywell u. a.).

> Hinweis: Fokusplan ist ein unterstützendes Werkzeug und ersetzt keine
> Diagnose oder Therapie.
