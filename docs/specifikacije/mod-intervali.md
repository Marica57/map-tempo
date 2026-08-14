# Specifikacija — Mod: Intervali

Zadnje ažurirano: 2026-08-14

Intervalni trening (npr. HIIT/tabata): naizmjence **rad** i **pauza**, kroz više **vježbi** i
više **serija**, s pripremom na početku i završnim **oporavkom**. Sustav vodi kroz sve faze,
broji serije/vježbe i pokazuje **ukupno trajanje**.

## Parametri (koje korisnik postavlja)

| Parametar | Značenje |
|-----------|----------|
| **Priprema** | Odbrojavanje prije samog početka (default 5 s, podesivo). |
| **Trajanje rada** | Koliko traje jedan interval rada (npr. 30 s). |
| **Trajanje pauze** | Odmor **između vježbi** unutar serije (npr. 15 s). |
| **Broj vježbi** | Koliko vježbi (radnih intervala) ima jedna serija. |
| **Broj serija** | Koliko puta se serija ponavlja. |
| **Pauza između serija** | Odmor **između serija** (obično dulji od pauze između vježbi). |
| **Vrijeme oporavka** | **Završni** odmor (cooldown) nakon zadnje serije (odvojeno od pauze između serija). |

## Struktura (redoslijed faza)

```
Priprema
  za svaku SERIJU (1 … Broj serija):
      za svaku VJEŽBU (1 … Broj vježbi):
          RAD (Trajanje rada)
          ako VJEŽBA nije zadnja u seriji:
              PAUZA (Trajanje pauze)        ← zadnja pauza u seriji se PRESKAČE
      ako SERIJA nije zadnja:
          PAUZA IZMEĐU SERIJA
  OPORAVAK (Vrijeme oporavka)               ← jednom, na kraju svega
Gotovo
```

Zaključane odluke ugrađene u strukturu:
- **Zadnja pauza u seriji se preskače** — nakon zadnje vježbe ide odmah pauza između serija
  (ili oporavak/kraj), bez dvostrukog odmora.
- **Vrijeme oporavka** je **završni** odmor, poseban od pauze između serija; javlja se **jednom**.
- Ako je neki parametar `0` (npr. pauza između serija = 0, ili oporavak = 0), ta se faza izostavlja.

## Izračun ukupnog trajanja

```
Ukupno =
    Priprema
  + Broj serija × Broj vježbi × Trajanje rada
  + Broj serija × (Broj vježbi − 1) × Trajanje pauze
  + (Broj serija − 1) × Pauza između serija
  + Vrijeme oporavka
```

Ukupno se prikazuje **prije pokretanja** (da trener zna koliko traje) i tijekom rada kao
**preostalo/proteklo ukupno vrijeme**.

## Prikaz tijekom rada

- **Velika oznaka faze**: `PRIPREMA` / `RAD` / `PAUZA` / `IZMEĐU SERIJA` / `OPORAVAK` / `GOTOVO`.
  - **Boja jasno razlikuje rad od pauze, ali elegantno — NE boja se cijeli ekran.** Boju nose samo
    **prsten + broj u sredini + oznaka faze (pill/badge)**: RAD = teal, PAUZA = neutralno,
    OPORAVAK = mirna/zelena, PRIPREMA = žuta. Prijelaz boje blag. Vidi [Dizajn](dizajn-i-stil.md).
- **Odbrojavanje tekuće faze** — velike sekunde u sredini kruga (koristi **kružnu vizualizaciju**
  kao [Odbrojavanje](mod-odbrojavanje.md): točka po kružnici za trajanje faze).
- **Serija X / N** i **Vježba Y / M** — brojači.
- **Ukupno** — preostalo (ili proteklo) vrijeme cijelog treninga.
- (Nice to have) **Sljedeće:** kratka najava iduće faze (npr. "Sljedeće: Pauza 15 s").

## Zvuk

- **BEZ tika svake sekunde.** Zvuk samo na:
  - **prijelazima faza** — jači ton (rad↔pauza↔serija↔oporavak),
  - **zadnjih par sekundi faze** — naglašeno (3-2-1) da klijent zna da faza istječe,
  - poželjno **različit signal za prijelaz u RAD vs u PAUZU** (npr. viši ton = rad, niži = odmor),
    da bez gledanja zna počinje li rad ili odmor.
- Vibracija na prijelazima gdje je podržana. Detalji: [Zvuk i signali](zvuk-i-signali.md).

## Kontrole

- **Pokreni / Pauza / Reset**.
- Promjena bilo kojeg parametra radi **reset** i ponovni izračun ukupnog vremena.
- (Opcionalno) **Preskoči fazu** — gumb za ručni prelazak na sljedeću fazu. Nice to have.

## Spremanje

- Zadnje korišteni parametri intervala pamte se u `localStorage`.
- (Opcionalno) nekoliko spremljenih intervalnih postavki kao presetovi. Nije ključno za prvu verziju.

## Rubni slučajevi

- **Broj vježbi = 1** → nema pauza unutar serije (jer se jedina/zadnja pauza preskače).
- **Broj serija = 1** → nema pauze između serija; ide priprema → serija → oporavak.
- Svi parametri moraju biti ≥ 0; rad mora biti ≥ 1 s da faza ima smisla (inače upozorenje).
