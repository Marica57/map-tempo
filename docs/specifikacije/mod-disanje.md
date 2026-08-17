# Specifikacija — Mod: Disanje

Zadnje ažurirano: 2026-08-17

Vođenje kroz **ritam disanja**. Koristi **isti 4-fazni motor** kao [Mod: Tempo](mod-tempo.md),
ali s drugim oznakama i naglaskom na disanje. Zajednički zvuk/priprema: [Zvuk i signali](zvuk-i-signali.md).

## Zašto isti motor

Dogovoreno: ne kompliciramo posebnim tipovima disanja. Disanje se opisuje kroz **iste 4 faze**,
a gdje faza nije potrebna stavi se `0`. Time se pokriva:

- **Udah–izdah** (2 faze): npr. `6060` → 6 s udah, 0 zastoj, 6 s izdah, 0 zastoj.
- **Box breathing** (4 faze): npr. `4444` → udah 4 / zadrži 4 / izdah 4 / zadrži 4.
- **Udah–zadrži–izdah**: npr. `4700`/`4-7-8` obrasci → udah / zadrži / izdah / (0).

## Značenje faza (oznake za disanje)

Gibanje točkice je isto kao u Tempo modu (lijevo=gore, desno=dolje, fiksno), ali **tekstualne
oznake** su prilagođene disanju:

| Faza | Gibanje točkice | Oznaka (Tempo mod) | Oznaka (Disanje mod) |
|------|-----------------|--------------------|----------------------|
| 1 | lijevo → desno | Spuštanje | **UDAH** |
| 2 | miruje desno | Zastoj dolje | **ZADRŽI** |
| 3 | desno → lijevo | Dizanje | **IZDAH** |
| 4 | miruje lijevo | Zastoj gore | **ZADRŽI** |

Napomena: smjer gibanja ostaje isti radi dosljednosti motora; mijenja se samo prikazani tekst.
Ako se u testiranju pokaže da je za disanje intuitivnije da "udah = širenje" ima drukčiju
vizualnu metaforu (npr. rastuća kružnica), to je zasebno otvoreno pitanje — vidi dno.

## Unos

- Ista logika kao Tempo: **4 znamenke** (npr. `4444`, `6060`, `4780`), `0` = preskoči fazu.
- Prijedlog: u Disanje modu polja mogu biti prikazana kao **Udah / Zadrži / Izdah / Zadrži**
  radi jasnoće, ali interno je to isti 4-znamenkasti tempo.

## Prikaz na ekranu

- **Točkica na liniji** (kao Tempo).
- **Velika oznaka faze**: `UDAH` / `ZADRŽI` / `IZDAH` / `ZADRŽI`.
- **Veliko odbrojavanje** preostalih sekundi faze.
- **Brojač ciklusa** — `Ciklus X / N`; prikazan **velik i uočljiv** (podebljan, teal), čitljiv s udaljenosti.

## Ponavljanja i priprema

- Broj ciklusa disanja `N` (npr. 10).
- Priprema prije prvog ciklusa (default 5 s, podesivo) — vidi [Zvuk i signali](zvuk-i-signali.md).

## Primjeri (presetovi disanja)

Padajući izbornik s uobičajenim obrascima (bez naziva "vježbe", samo brojevi/oznake):

- `6-0-6-0` — sporo udah/izdah,
- `4-4-4-4` — box breathing,
- `4-7-8-0` — smirujuće disanje,
- `5-0-5-0` — koherentno disanje.

## Zvuk u modu disanja

- Isti princip (tik po sekundi + jači ton na kraju faze), ali **suptilniji/tiši** jer se disanje
  često radi zatvorenih očiju i opušteno.
- Otvoreno: eventualno različit ton za UDAH vs IZDAH (viši za udah, niži za izdah) da se prati
  bez gledanja. Detalji u [Zvuk i signali](zvuk-i-signali.md).

## Otvoreno pitanje

- Vizualna metafora za disanje: zadržati **istu liniju + točkicu** (dosljedno s Tempo modom) ili
  ponuditi alternativni prikaz (npr. kružnica koja se širi na udah, skuplja na izdah). Za sada:
  **ista linija + točkica**, samo s oznakama UDAH/IZDAH/ZADRŽI.
