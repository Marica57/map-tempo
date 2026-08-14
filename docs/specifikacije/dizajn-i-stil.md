# Specifikacija — Dizajn i stil

Zadnje ažurirano: 2026-08-14

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

1. **Prebacivač moda** — segmentirani izbornik: Tempo / Disanje / Štoperica / Odbrojavanje / Intervali.
   Kod 5 stavki na mobitelu: skrolabilni segmenti, kompaktne ikone + tekst, ili padajući izbornik.
2. **Zona vizualizacije** (kartica) — ovisi o modu:
   - **Tempo / Disanje**: vodoravna **linija** s **točkom** (lijevo=gore, desno=dolje), male oznake
     krajeva, **oznaka faze**, **veliko odbrojavanje**, **brojač ponavljanja/ciklusa**.
   - **Štoperica**: **veliko vrijeme** (MM:SS.cc) u sredini.
   - **Odbrojavanje**: **kružnica** s **točkom** po obodu + **broj u sredini** (vidi niže).
   - **Intervali**: ista kružnica + **oznaka faze** (RAD/PAUZA/…), **Serija X/N**, **Vježba Y/M**,
     **Ukupno** (preostalo/proteklo).
3. **Kontrole** — Pokreni/Pauza (Kreni/Stani kod štoperice; primarni gumb), Reset, Zvuk uklj./isklj.
4. **Postavke** (kartica) — polja po modu:
   - Tempo: 4 znamenke (**bez presetova — uvijek ručni unos**); Disanje: Udah/Zadrži/Izdah/Zadrži
     (+ presetovi disanja); oba + Ponavljanja/Ciklusi.
   - Štoperica: nema postavki (osim reset).
   - Odbrojavanje: vrijeme (min:sek) ili brzi gumbi.
   - Intervali: priprema, trajanje rada, trajanje pauze, broj vježbi, broj serija, pauza između
     serija, vrijeme oporavka; prikaz **ukupnog trajanja**.
   - Zajedničko gdje ima smisla: **Priprema (s)** — default 5, **Primjeri** (presetovi).

- Kartice: bijela površina, meki `shadow-card`, zaobljeni rubovi — kao map-app.
- Gumbi: primarni (teal) za glavnu akciju, sekundarni (obrub) za Reset/Zvuk.

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

- **Manifest**: ime "MAP Tempo", ikona (teal, jednostavan motiv točkice/linije), tema boja
  `#2B717F`, pozadina `#F7F6F3`, `display: standalone`.
- Ikona i splash usklađeni s bojama gore.

## Otvorena pitanja za dizajn

- Točan izgled ikone aplikacije (logo).
- Treba li **prikaz cijelog tempa** kao mala vremenska traka ispod linije (pregled svih faza) —
  moguće kao "nice to have".
