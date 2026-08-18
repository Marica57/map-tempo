# Specifikacija — Zvuk i signali

Zadnje ažurirano: 2026-08-18

Zvuk je **ključan** dio aplikacije: klijent ne može uvijek gledati u ekran, pa mora **čuti**
gdje je u fazi. Pravila vrijede za oba moda ([Tempo](mod-tempo.md) i [Disanje](mod-disanje.md)),
uz manje razlike opisane niže. Zvuk se generira u kodu (Web Audio API), bez audio datoteka.

## Osnovni princip po fazi (Tempo i Disanje)

> Ovaj princip (tik svake sekunde) vrijedi **samo za linijske modove — Tempo i Disanje**.
> Odbrojavanje i Intervali **nemaju tik svake sekunde** — vidi "Razlike po modu" niže.

Dok faza traje, čuju se **tihi tikovi svake sekunde**, a **kraj faze** označava **jači/viši ton**.

Primjer faze koja traje **5 s**:
- na proteklih 1, 2, 3, 4 s → **tihi tik** (blaži, niži ton),
- na 5. s (kraj faze) → **jači ton** (glasniji, viši) — signal da faza prelazi u sljedeću.

Pravila:
- Tihi tik: kratak (~90 ms), niži ton (npr. ~440 Hz), niska glasnoća.
- Kraj faze: dulji (~280 ms), viši ton (npr. ~880 Hz), veća glasnoća.
- Faza trajanja **1 s** → samo jači ton na kraju (nema prethodnih tihih tikova).
- Faza trajanja **0 s** → preskače se, nema zvuka.

## Priprema (odbrojavanje prije početka)

- Prije **prvog** ponavljanja/ciklusa ide priprema, default **5 s**, korisnik podesivo (uklj. 0 = bez pripreme).
- Zadnje **3 sekunde** pripreme čuju se kao **3-2-1** (tihi tikovi), a **start** (prijelaz u prvo
  ponavljanje) označava **jači ton** — isti "kraj faze" signal.
- Vizualno tijekom pripreme: veliko odbrojavanje (`5…4…3…2…1`) i oznaka "Priprema".
- Ako je priprema dulja od 3 s, prvih nekoliko sekundi može biti bez zvuka (ili vrlo tihi tik),
  a naglašeno 3-2-1 na kraju. (Detalj za dotjerivanje u implementaciji.)

## Završni signali (zadnje ponavljanje i kraj serije)

> Cilj: klijent koji ne gleda u ekran mora **po uhu** znati kada je **zadnje ponavljanje**
> i kada je **serija/vježba gotova** — ti se trenuci ne smiju čuti isto kao običan kraj faze.

- **Najava zadnjeg ponavljanja** (`lastRep`): **dvostruki visoki "beep-beep"** (~1245 Hz ×2).
  - Tempo/Disanje: okida se na prijelazu u **zadnji ciklus/ponavljanje** (umjesto običnog "kraj faze").
  - Intervali: okida se na ulasku u **zadnju radnu fazu** (zadnja vježba zadnje serije), uz `RAD` ton.
  - Vibracija: kratki uzorak `[40, 60, 40]`.
- **Kraj serije / vježbe** (`finish`): **uzlazna fanfara od 3 tona** (~660 → 990 → 1320 Hz).
  - Namjerno **drukčija od svih jednotonskih signala** (tik, kraj faze, rad, pauza) da se jasno čuje "gotovo".
  - Koristi se na stvarnom kraju u **svim modovima**: Tempo, Disanje, Odbrojavanje, Intervali.
  - Vibracija: uzorak `[80, 50, 160]`.
- Common: "kraj faze" (`strong`, ~880 Hz) i dalje označava prijelaze **unutar** vježbe; završni
  signali su rezervirani isključivo za zadnje ponavljanje i kraj.

## Vibracija (mobitel/tablet)

- Uz zvuk, na kraju faze i na "start" okinuti **kratku vibraciju** (Vibration API, gdje je podržano).
- Vibracija je **pomoćna** (ne zamjena za zvuk) i može se isključiti zajedno sa zvukom ili zasebno
  (odluka: zasebni prekidač je "nice to have", nije nužan za prvu verziju).

## Kontrola zvuka

- **Prekidač Zvuk uklj./isklj.** (mute) u zaglavlju; stanje se pamti u `localStorage` (`mt:sound`).
- **Klizač glasnoće** (master volume 0–100%) u zaglavlju; pamti se (`mt:vol`, default 0.8).
  - Množi se sa svim signalima (relativne razine: tik ~0.4, polovica ~0.6, kraj/rad ~1.0, pauza ~0.85).
  - Povlačenjem klizača gore zvuk se **automatski uključi** (ako je bio mutiran); mute-gumb je zaseban
    i čuva razinu glasnoće (ne postavlja je na 0).
  - Na otpuštanju klizača svira kratki **preview ton** da se čuje odabrana glasnoća.
- Zbog pravila preglednika, **AudioContext se pokreće tek na prvu korisničku akciju** (klik na
  Pokreni/Zvuk). To je normalno i očekivano ponašanje.

## Razlike po modu

- **Tempo mod**: zvuk kao gore (jasni tikovi, izražen kraj faze) — klijent često radi dinamično.
- **Disanje mod**: **suptilniji/tiši** tonovi (opuštanje, često zatvorenih očiju).
  - Otvoreno (za dotjerivanje): različit ton za **UDAH** (viši) i **IZDAH** (niži) da se faza
    prepozna bez gledanja u ekran.
- **Odbrojavanje**: **BEZ** tika svake sekunde. Samo:
  - **tihi zvuk na četvrtinama** (kad točka prođe 1/4 i 3/4) i **malo naglašeniji na polovici** (1/2),
  - **zadnjih par sekundi naglašeno** (npr. 3-2-1),
  - **završna fanfara na 0** (`finish`, uzlazna 3 tona). Staje na kraju.
- **Intervali**: **BEZ** tika svake sekunde. Samo:
  - **jači ton na svakom prijelazu faze** (rad↔pauza↔serija↔oporavak),
  - **zadnjih par sekundi faze naglašeno** (3-2-1) da klijent zna da faza istječe,
  - poželjno **različit signal za prijelaz u RAD vs u PAUZU** (npr. viši ton = rad, niži = odmor),
    da bez gledanja zna počinje li rad ili odmor,
  - **najava zadnje radne faze** (`lastRep`, dvostruki beep) i **završna fanfara** (`finish`) na kraju.
- **Štoperica**: bez obaveznog zvuka; eventualno diskretan klik/vibracija na gumb.

## Zaključane odluke

- Tihi tik svake sekunde + jači/viši ton na kraju faze — **da**.
- Poseban **završni signal** (uzlazna fanfara) za kraj serije + **najava zadnjeg ponavljanja**
  (dvostruki beep), da se po uhu razlikuju od običnog kraja faze — **da**.
- Priprema default **5 s**, podesivo, sa zvučnim **3-2-1** na kraju — **da**.
- Vibracija kao pomoćni signal — **da** (gdje je podržano).
- Fino ugađanje frekvencija/glasnoće/razlike UDAH-IZDAH — u fazi implementacije, uz probu na uređaju.
