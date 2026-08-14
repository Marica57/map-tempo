# Specifikacija — Mod: Odbrojavanje

Zadnje ažurirano: 2026-08-14

Odbrojavanje od zadanog vremena prema nuli, s **kružnom** vizualizacijom: točka putuje po
kružnici i dođe do kraja (puni krug) točno kad istekne vrijeme.

## Unos

- **Vrijeme odbrojavanja** — trajanje u sekundama/minutama (npr. 30 s, 1:00, 2:30).
  Prijedlog unosa: polja **min : sek**, ili brzi gumbi (15 s, 30 s, 45 s, 1 min, …). Detalj za implementaciju.

## Kružna vizualizacija

- **Kružnica** (prsten) sa **točkom** koja kreće **s vrha (12 sati)** i putuje **u smjeru
  kazaljke na satu**.
- Ako je postavljeno npr. 30 s, točki treba **točno 30 s** da napravi **puni krug** (konstantna
  kutna brzina).
- Na kružnici su **vrlo suptilno** označene četvrtine (12, 3, 6, 9 sati) i **tek neznatno** jače
  polovina (6 sati) — kao diskretna orijentacija. Oznake su tanke/kratke, niskog kontrasta
  (hairline), da ne dominiraju nad krugom (vidi [Dizajn](dizajn-i-stil.md)).
- Prijeđeni dio kružnice može se blago obojati (napredak), po ukusu — vidi [Dizajn](dizajn-i-stil.md).

## Prikaz broja

- U **sredini kruga** veliko **preostalo vrijeme** (odbrojava prema nuli).
- Format: cijele sekunde (npr. `30 → 29 … → 1 → 0`); za dulja vremena `M:SS`.

## Kraj

- Na **kraju** (kad točka zatvori krug / vrijeme dođe na 0): **zvučni signal** (jači ton) +
  vibracija, i odbrojavanje **staje** (ne ponavlja se automatski).
- Vizualni završetak (npr. puni obojani krug + oznaka "Gotovo").

## Kontrole

- **Pokreni / Pauza / Reset** (Pauza zamrzne točku i broj; Reset vraća na početno vrijeme).

## Zvuk

- **BEZ tika svake sekunde.** Zvuk samo na:
  - **četvrtinama** — tihi zvuk kad točka prođe 1/4 i 3/4 kruga,
  - **polovici** — malo naglašeniji tihi zvuk na 1/2 (poklapa se s jače naglašenom oznakom na 6 h),
  - **zadnjih par sekundi** — naglašeno (npr. 3-2-1),
  - **kraj (0)** — jači ton.
- Zvuk (i vibracija) se mogu isključiti. Detalji: [Zvuk i signali](zvuk-i-signali.md).

## Zaključane odluke

- Broj **u sredini** kruga, odbrojavanje **staje na kraju** (bez auto-ponavljanja).
- Smjer: **kazaljka na satu, start s vrha**. Konstantna kutna brzina.
- Četvrtine suptilne, polovina malo jače naglašena (i vizualno i zvučno).
- **Nema zvuka svake sekunde** — samo četvrtine/polovica + naglašene zadnje sekunde + kraj.
