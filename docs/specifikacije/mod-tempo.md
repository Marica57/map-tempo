# Specifikacija — Mod: Tempo

Zadnje ažurirano: 2026-08-14

Vođenje kroz **tempo izvođenja vježbe**: točkica putuje po vodoravnoj liniji i pokazuje koliko
traje svaka faza pokreta. Zajednički zvuk i priprema opisani su u [Zvuk i signali](zvuk-i-signali.md).

## Unos tempa

- Polje **4 znamenke** (npr. `5210`). Svaka znamenka je trajanje jedne faze u **sekundama**.
- Redoslijed faza (standardni fitness zapis): **ekscentrična → zastoj dolje → koncentrična → zastoj gore**.
- `0` = faza se **preskače** (nema zadržavanja/trajanja, odmah se prelazi na sljedeću).
- Dozvoljene vrijednosti po znamenki: `0`–`9` (jedna znamenka po fazi). Ako trener treba dulje
  od 9 s po fazi — vidi "Otvoreno pitanje" na dnu.

## Značenje faza i gibanje točkice

Linija je vodoravna. **Lijevo = gore (početna pozicija), desno = dolje (npr. u čučnju).** Fiksno.

| Faza | Znamenka | Naziv | Gibanje točkice |
|------|----------|-------|-----------------|
| 1 | 1. | Spuštanje (ekscentrična) | lijevo → desno |
| 2 | 2. | Zastoj dolje | miruje na desnoj strani |
| 3 | 3. | Dizanje (koncentrična) | desno → lijevo |
| 4 | 4. | Zastoj gore | miruje na lijevoj strani |

Primjer `5210`:
1. 5 s lijevo→desno (spuštanje),
2. 2 s miruje desno (zadržavanje u čučnju),
3. 1 s desno→lijevo (dizanje),
4. 0 s — nema zastoja gore, odmah kreće novo ponavljanje.

Gibanje unutar faze je **linearno** (konstantna brzina), da klijent osjeti ravnomjeran tempo.
Faze s trajanjem `0` se u potpunosti izostavljaju iz ciklusa (točkica ne "skače" niti zastaje).

## Prikaz na ekranu

- **Točkica na liniji** — glavna vizualna referenca.
- **Oznaka faze** — tekst trenutne faze (npr. "Spuštanje", "Zastoj dolje", "Dizanje", "Zastoj gore").
- **Veliko odbrojavanje** — preostale sekunde tekuće faze (npr. `5 → 4 → 3 → 2 → 1`).
- **Brojač ponavljanja** — `Ponav. X / N`.

## Ponavljanja

- Polje **broj ponavljanja** `N` (npr. 8). Jedno ponavljanje = jedan puni prolaz kroz sve
  ne-nulte faze.
- Nakon `N` ponavljanja aplikacija staje i prikazuje završetak (npr. "Gotovo ✓").
- Između ponavljanja nema dodatne pauze osim faza tempa (ako 4. faza = 0, odmah novo spuštanje).

## Priprema prije početka

- Prije **prvog** ponavljanja ide odbrojavanje pripreme (default **5 s**, podesivo; može i 0).
- Vidi [Zvuk i signali](zvuk-i-signali.md) za zvučno 3-2-1 i vizualni prikaz pripreme.

## Primjeri (presetovi)

- **Nema presetova.** Tempo se **uvijek upisuje ručno** (4 znamenke) — odluka korisnika.
  (Presetovi ostaju samo u modu Disanje.)

## Kontrole

- **Pokreni / Pauza** — start i privremeni prekid (nastavlja od iste točke).
- **Reset** — vraća na početak (točkica lijevo, brojači nula).
- **Zvuk uklj./isklj.**
- Promjena tempa / ponavljanja / pripreme radi **reset** tekućeg ciklusa (da se ne miješaju stanja).

## Rubni slučajevi

- **Sve četiri znamenke 0** (`0000`) — nevažeći tempo; Pokreni onemogućen ili se traži ispravak.
- **Samo jedna ne-nulta faza** (npr. `0500`) — dopušteno; točkica se giba/miruje samo u toj fazi.
- **Prazan/nepotpun unos** — dopuniti nulama zdesna do 4 znamenke (npr. `52` → `5200`) uz vizualnu potvrdu.

## Otvoreno pitanje

- Trajanje po fazi trenutno je **jedna znamenka (0–9 s)**, kako je standardni zapis tempa (npr. 5210).
  Ako ikad zatreba dulje (npr. 12 s), prijeći na unos s odvojenim poljima po fazi umjesto 4-znamenkastog
  niza. Za sada: 0–9 po fazi.
