# Specifikacija — Dizajn i stil

Zadnje ažurirano: 2026-08-17

MAP Tempo prati **vizualni identitet map-app** radi dosljednosti. Vrijednosti su preuzete iz
`map-app/tailwind.config.ts`.

## Boje

| Uloga | Svijetla tema | Tamna tema |
|-------|---------------|------------|
| Primarna (točkica, akcenti, gumbi) | `#2B717F` | `#2B9CAD` |
| Primarna hover | `#235F6B` | — |
| Pozadina ekrana | `#F7F6F3` | `#0F172A` |
| Površina (kartice) | `#FFFFFF` | `#1E293B` |
| Rub | `#E2E8F0` | `#334155` |
| Tekst primarni | `#0F172A` | `#F1F5F9` |
| Tekst sekundarni | `#64748B` | `#94A3B8` |
| Uspjeh (npr. "Gotovo") | `#10B981` | isto |
| Upozorenje | `#F59E0B` | isto |

- **Točka** je u primarnoj boji (teal). **Linija/kružnica** je u boji ruba/sekundarnoj, deblja i zaobljena.
- **Faze intervala bojom (elegantno, BEZ bojanja cijelog ekrana)**: boju nose samo
  **prsten (kružnica) + broj u sredini + mala oznaka faze (pill/badge)**; pozadina/ekran ostaju mirni.
  - RAD = primarna (teal), PAUZA = neutralna (sekundarna/rub), OPORAVAK = mirna (`success` zelena ili
    prigušena), PRIPREMA = upozorenje/žuta.
  - Prijelaz boje neka bude blag (kratka animacija), ne nagli bljesak cijelog ekrana.
- Tamni način prati `darkMode: 'class'` kao u map-app (može slijediti sistemsku postavku uređaja).

## Tipografija

- Font: **Plus Jakarta Sans** (kao map-app), fallback `system-ui, sans-serif`.
- **Veliko odbrojavanje**: dominantan element, veliki font, `tabular-nums` (da broj ne "skače").
- **Oznaka faze**: srednje veličine, sekundarna boja; u Disanje modu (`UDAH`/`IZDAH`) može biti veća.

## Komponente i raspored

Jedan ekran, okomiti raspored (odozgo prema dolje). Sadržaj zone vizualizacije i postavki mijenja
se prema modu:

0. **Zaglavlje (header)** — naslov "MAP **Tempo**" (teal), te s desne strane: **mute** (🔊/🔇),
   **klizač glasnoće** (0–100%) i **prebacivač teme** (☀️/🌙). Vidi [Zvuk i signali](zvuk-i-signali.md).
1. **Prebacivač moda** — segmentirani izbornik: Tempo / Disanje / Štoperica / Odbrojavanje / Intervali.
   As-built: **vodoravno skrolabilni segmenti** (na uske ekrane), aktivni segment ispunjen teal bojom.
2. **Zona vizualizacije** (kartica) — ovisi o modu:
   - **Tempo / Disanje**: vodoravna **linija** s **točkom** (lijevo=gore, desno=dolje), male oznake
     krajeva, **oznaka faze**, **veliko odbrojavanje** (~44px), i **veliki, uočljiv brojač
     ponavljanja/ciklusa** (~30px, podebljan, teal — čitljiv s udaljenosti).
   - **Štoperica**: **veliko vrijeme** (MM:SS.cc) u sredini.
   - **Odbrojavanje**: **kružnica** s **točkom** po obodu + **broj u sredini**; iznad kruga oznaka
     "Priprema" (žuta) tijekom pripreme (vidi niže).
   - **Intervali**: ista kružnica + **oznaka faze** (RAD/PAUZA/…), **Serija X/N**, **Vježba Y/M**,
     **Ukupno** (preostalo/proteklo).
3. **Kontrole** — Pokreni/Pauza (Kreni/Stani kod štoperice; primarni teal gumb), Reset. As-built
   koriste se tekstualni simboli (▶ / ❙❙ / ↺). Zvuk je u zaglavlju (klizač + mute).
4. **Postavke** (kartica) — polja po modu:
   - Tempo: 4 znamenke (**bez presetova — uvijek ručni unos**) + Ponavljanja + Priprema.
   - Disanje: Udah/Zadrži/Izdah/Zadrži (4 znamenke) + presetovi disanja + Ciklusi + Priprema.
   - Štoperica: nema postavki (osim Reset).
   - Odbrojavanje: **brzi gumbi** (0:30, 0:45, 1:00, 1:30, 2:00) + **Min / Sek / Priprema (s)**.
   - Intervali: priprema, trajanje rada, trajanje pauze, broj vježbi, broj serija, pauza između
     serija, vrijeme oporavka; prikaz **ukupnog trajanja**.

- Kartice: bijela površina, meki `shadow-card`, zaobljeni rubovi — kao map-app.
- Gumbi: primarni (teal) za glavnu akciju, sekundarni (obrub) za Reset.

## Brojčana polja (unos)

Sva brojčana polja koriste zajedničku "pametnu" komponentu (`NumberField`):

- Dok korisnik tipka, polje **ne mijenja unos** i može biti privremeno **prazno** (ne iskače na 1).
- Vrijednost se **provjeri/potvrdi tek na izlasku iz polja** (blur) ili tipkom Enter.
- **Prazno/neispravno** na izlasku → **vrati prethodnu vrijednost**.
- **Izvan raspona** → svede na **min/max** (npr. ponavljanja 1–99, priprema 0–60 s).
- Promjena parametra radi reset tekućeg ciklusa i (gdje ima smisla) ponovni izračun ukupnog vremena.

## Linijska vizualizacija (Tempo, Disanje)

- Točka se giba **linearno** unutar faze (konstantna brzina), da tempo bude ravnomjeran.
- Faze s `0` se ne prikazuju (nema skoka/zastoja).
- Na kraju faze — kratki vizualni naglasak (bljesak/blagi puls točke) uz zvučni signal.
- Odbrojavanje prikazuje **cijele sekunde** (zaokruženo prema gore), sinkronizirano s tikovima.

## Kružna vizualizacija (Odbrojavanje, Intervali)

- **Prsten (kružnica)** sa **točkom** koja kreće **s vrha (12 h)** i putuje **u smjeru kazaljke**,
  konstantnom kutnom brzinom; puni krug = trajanje faze.
- **Oznake**: četvrtine (12/3/6/9 h) i polovina (6 h). **Vrlo suptilne** — tanke, kratke crtice ili
  točkice niskog kontrasta (hairline), da ne "razbijaju" krug. Polovina (6 h) tek **neznatno** jače
  (malo dulja/tamnija), ne dominantna. Cilj je elegancija, ne izraženi biljezi.
- **Napredak**: prijeđeni luk može se blago obojati (boja faze); ostatak je neutralan.
- **Broj u sredini**: veliko preostalo vrijeme (cijele sekunde; `M:SS` za dulja).
- Na kraju: puni obojani krug + zvučni signal; **staje** (bez auto-ponavljanja).
- Kod Intervala boja prstena/broja prati **boju faze** (RAD/PAUZA/OPORAVAK/PRIPREMA).

## Štoperica

- **Veliko vrijeme** u sredini, `tabular-nums`, format MM:SS.cc.
- Ispod: glavni gumb Kreni→Stani→Nastavi + Reset (vidi [Mod: Štoperica](mod-stoperica.md)).

## Responzivnost

- **Mobitel** (primarno): sve stane na jedan ekran bez skrolanja gdje god je moguće; velika
  točkica i odbrojavanje čitljivi iz daljine (trener drži uređaj, klijent gleda).
- **Tablet/desktop**: isti raspored, više praznog prostora; linija šira.
- Podržati **portret i pejzaž**; u pejzažu linija se dodatno produžuje.
- Ciljati čitljivost s udaljenosti (klijent 1–3 m od ekrana): veliki brojevi i jasan kontrast.

## PWA izgled

- **Manifest**: ime "MAP Tempo", tema boja `#2B717F`, pozadina `#F7F6F3`, `display: standalone`,
  `orientation: any`.
- **Ikone (as-built)**: generiraju se iz SVG izvora (`public/icon.svg` zaobljena, `icon-square.svg`
  kvadratna) skriptom `npm run gen:icons` (sharp):
  - Android: `pwa-192x192.png`, `pwa-512x512.png` ("any") + `maskable-icon-512x512.png` (maskable).
  - iOS: `apple-touch-icon-180x180.png` (bez prozirnosti, iOS sam zaokružuje).
  - Motiv: teal podloga + kružnica/linija + točka.

## Otvorena pitanja za dizajn

- Eventualno dotjerati sam **logo/ikonu** (trenutni motiv je jednostavan placeholder).
- Treba li **prikaz cijelog tempa** kao mala vremenska traka ispod linije (pregled svih faza) —
  moguće kao "nice to have".
