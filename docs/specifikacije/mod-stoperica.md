# Specifikacija — Mod: Štoperica

Zadnje ažurirano: 2026-08-14

Najjednostavniji mod: klasična štoperica koja mjeri proteklo vrijeme.

## Ponašanje

- Na sredini ekrana **veliko vrijeme** i **jedan glavni gumb**.
- Gumb u početku piše **Kreni**; nakon pokretanja postaje **Stani** (pauza), a pored njega
  se pojavi **Reset**.
- Dok radi, vrijeme teče prema gore od `00:00.00`.
- **Stani** zaustavlja (zamrzne vrijeme); ponovni pritisak (**Nastavi**) nastavlja od iste točke.
- **Reset** vraća na `00:00.00` (dostupan kad je zaustavljeno ili u radu).

## Prikaz vremena

- Format **MM:SS.cc** (minute : sekunde : stotinke), npr. `01:23.45`.
- Vrijeme je dominantan element, `tabular-nums` (znamenke ne "skaču" u širini).
- Za mjerenja dulja od sat vremena format prelazi u `H:MM:SS.cc` (rijedak slučaj).

## Kontrole

| Stanje | Glavni gumb | Sporedni gumb |
|--------|-------------|---------------|
| Na nuli, zaustavljeno | **Kreni** | — |
| U radu | **Stani** | Reset |
| Pauzirano (nije nula) | **Nastavi** | Reset |

## Zvuk

- Štoperica **nema** obavezni zvuk (samo mjeri). Klik na gumb može imati diskretan zvuk/vibraciju.
- (Opcionalno, kasnije) "međuvrijeme" (lap) — bilježenje trenutka bez zaustavljanja. Nije u prvoj
  verziji osim ako se zatraži.

## Tehnički detalj

- Mjeriti preko stvarnog vremena (`performance.now()` / timestamp razlika), ne zbrajanjem tikova,
  da mjerenje bude točno i kad se kartica na tren uspori.
