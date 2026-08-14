# MAP Tempo

Vizualni tempo-trener i timeri (PWA). Radi offline, bez baze i bez prijave; instalira se na
mobitel/tablet ("Dodaj na početni zaslon"). Pet modova: **Tempo, Disanje, Štoperica,
Odbrojavanje, Intervali**.

- **Živo:** https://map-tempo.vercel.app
- **Repozitorij:** https://github.com/Marica57/map-tempo (push na `main` → Vercel auto-deploy)

Puna specifikacija ponašanja i dizajna: [`docs/`](docs/README.md).

## Tehnologija

- Vite + React + TypeScript + Tailwind CSS
- PWA preko `vite-plugin-pwa` (service worker + web manifest)
- Zvuk: Web Audio API (bez audio datoteka)
- Postavke se pamte lokalno (`localStorage`)

## Razvoj

```bash
npm install
npm run dev      # dev server na http://localhost:5173
npm run build    # produkcijski build u dist/
npm run preview  # posluži build lokalno
```

## Objava (hosting)

Statički build (`dist/`) može se objaviti besplatno na Vercel ili Netlify:

- **Vercel/Netlify**: poveži repozitorij ili prevuci `dist/` folder. Build komanda `npm run build`,
  output direktorij `dist`.

Nakon objave dobiješ jedan URL — otvori ga jednom na uređaju i dodaj na početni zaslon; dalje
radi offline.

## Struktura

```
src/
  App.tsx                 # ljuska: prebacivač modova, tema, zvuk
  components/
    ui.tsx                # Card, polja, gumbi (stil map-app)
    ModeSwitcher.tsx      # segmentirani izbornik 5 modova
    CircleViz.tsx         # kružna vizualizacija (prsten + točka + broj)
  modes/
    LineMode.tsx          # Tempo + Disanje (linija + točka)
    Stopwatch.tsx         # Štoperica (MM:SS.cc)
    Countdown.tsx         # Odbrojavanje (krug)
    Intervals.tsx         # Intervali (HIIT)
  lib/
    audio.ts              # zvučni signali (Web Audio)
    circle.ts             # geometrija kruga
    format.ts             # formati vremena
    useRaf.ts             # requestAnimationFrame petlja
    useLocalStorage.ts    # spremanje postavki
```

## Ikone

Set ikona pokriva oba slučaja: **Android** (maskable + "any" PNG 192/512) i **iOS**
(`apple-touch-icon` 180×180, bez prozirnosti). Generiraju se iz SVG izvora:

```bash
npm run gen:icons   # renderira PNG-ove iz public/icon.svg i icon-square.svg (sharp)
```

Izvori dizajna: `public/icon.svg` (zaobljena podloga) i `public/icon-square.svg` (puna kvadratna,
za maskable/iOS). Ako promijeniš dizajn ikone, uredi SVG i ponovno pokreni `npm run gen:icons`.
