# MAP Tempo — Dokumentacija

Vizualni tempo-trener: točkica putuje po liniji i vodi klijenta kroz tempo izvođenja
vježbe (npr. 5-2-1-0) ili kroz ritam disanja, uz zvučne signale. Zamišljeno kao
jednostavna, samostalna aplikacija koja radi offline i može se instalirati na mobitel/tablet.

Ovaj folder sadrži **specifikacije** (ponašanje, izgled, funkcionalnost, svaki detalj) —
isti pristup kao u glavnoj aplikaciji (map-app): kad se mijenja opisano ponašanje,
ažurira se i pripadni dokument.

## Specifikacije

- [Pregled i arhitektura](specifikacije/pregled-i-arhitektura.md) — što je aplikacija, pet modova,
  zašto je zasebna, PWA/offline, bez baze, hosting, instalacija, spremanje postavki, struktura ekrana.
- [Mod: Tempo](specifikacije/mod-tempo.md) — 4-fazni tempo izvođenja, značenje faza, gibanje
  točke po liniji, odbrojavanje, ponavljanja, priprema, primjeri (presetovi).
- [Mod: Disanje](specifikacije/mod-disanje.md) — isti linijski motor, oznake UDAH/IZDAH/ZADRŽI,
  razlike u prikazu i zvuku.
- [Mod: Štoperica](specifikacije/mod-stoperica.md) — klasična štoperica, Kreni/Stani, MM:SS.cc.
- [Mod: Odbrojavanje](specifikacije/mod-odbrojavanje.md) — kružna vizualizacija, točka po kružnici,
  četvrtine/polovina, broj u sredini, staje na kraju.
- [Mod: Intervali](specifikacije/mod-intervali.md) — HIIT: priprema, rad, pauza, vježbe, serije,
  pauza između serija, završni oporavak; izračun ukupnog trajanja, brojači.
- [Zvuk i signali](specifikacije/zvuk-i-signali.md) — tihi tik po sekundi, jači ton na kraju faze,
  priprema 3-2-1, vibracija, pravila glasnoće (dijeli se između modova).
- [Dizajn i stil](specifikacije/dizajn-i-stil.md) — boje, tipografija, komponente, linijska i kružna
  vizualizacija, raspored, responzivnost, tamni način — usklađeno s vizualnim identitetom map-app.

## Status

Faza: **implementacija (v1)**. Specifikacija dogovorena i potvrđena; aplikacija izgrađena
(Vite + React + TS + Tailwind + vite-plugin-pwa). Svih pet modova implementirano; build prolazi.
Upute za pokretanje/objavu u [`../README.md`](../README.md).

Preostalo/kasnije: PNG ikone za iOS, fino ugađanje zvuka po uređaju, eventualni presetovi intervala.
