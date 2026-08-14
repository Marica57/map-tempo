# Specifikacija — Pregled i arhitektura

Zadnje ažurirano: 2026-08-14

## Svrha aplikacije

MAP Tempo je skup alata za **tempiranje i mjerenje vremena u treningu**. Polazna ideja: klijentu je
teško sam procijeniti trajanje (npr. čučanj "5 sekundi spuštanja" naprave za 2 s; "udah 6 sekundi"
naprave za 3 s). Aplikacija to rješava **vizualno** (točka putuje po liniji/kružnici točno onoliko
koliko faza traje), uz **zvučne signale** da klijent ne mora stalno gledati u ekran.

Aplikacija ima **pet modova**:

| Mod | Vizualizacija | Namjena |
|-----|---------------|---------|
| **Tempo** | vodoravna linija + točka | tempo izvođenja vježbe (npr. 5-2-1-0) — [spec](mod-tempo.md) |
| **Disanje** | vodoravna linija + točka | ritam disanja, oznake UDAH/IZDAH/ZADRŽI — [spec](mod-disanje.md) |
| **Štoperica** | veliko vrijeme | mjerenje proteklog vremena (MM:SS.cc) — [spec](mod-stoperica.md) |
| **Odbrojavanje** | krug + točka po kružnici | odbrojavanje do 0 — [spec](mod-odbrojavanje.md) |
| **Intervali** | krug + točka po kružnici | HIIT: rad/pauza, serije, oporavak — [spec](mod-intervali.md) |

Tempo i Disanje dijele isti "linijski" motor; Odbrojavanje i Intervali dijele isti "kružni"
motor; Štoperica je samostalna. Zvuk i priprema su zajednički ([Zvuk i signali](zvuk-i-signali.md)).

## Zašto zasebna aplikacija (a ne dio map-app)

Odluka: **zasebna aplikacija**, folder `C:\MAP GRADNJA\map-tempo\` (pored `map-app`).

- **Bez prijave.** Klijenti si je mogu sami instalirati i koristiti; ne smiju trebati račun
  ni lozinku, niti dobiti pristup CRM-u. Glavna app traži autentikaciju na svakoj stranici.
- **Bez baze i servera.** Alat je čisto offline; nema Prisma/PostgreSQL, cron poslova, PDF-ova.
- **Neovisno održavanje.** Izmjene na timeru ne smiju dirati glavnu aplikaciju.
- Kasnije se (opcionalno) može dodati link na MAP Tempo iz glavne app, ali kod ostaje odvojen.

## Tehnologija (prijedlog — potvrditi prije kodiranja)

- **PWA (Progressive Web App)** — instalira se na početni ekran, radi offline, cijeli ekran.
- **Statička aplikacija**, bez backenda i baze. Predloženi stack: **Vite + React + TypeScript + Tailwind**
  (isti Tailwind/font kao map-app radi dosljednog stila i lakšeg održavanja).
- **Service worker** za offline rad (cache app ljuske); **Web App Manifest** (ime, ikona, boje,
  `display: standalone`, `orientation`).
- **Zvuk** preko Web Audio API (bez audio datoteka — tonovi se generiraju u kodu).
- **Hosting**: besplatni statički hosting (Vercel ili Netlify). Rezultat je jedan URL koji se
  otvori jednom i doda na ekran; nakon toga radi bez interneta.

> Napomena o radu u pozadini: PWA na mobitelu ne jamči pouzdano odbrojavanje kad je ekran
> zaključan ili je aplikacija u pozadini. Za ovaj alat to nije potrebno — koristi se dok je
> otvoren i vidljiv. Ako se ikad zatraži pozadinski rad sa zvonjavom, to bi tražilo nativnu app.

## Instalacija i korištenje

- **Trener**: otvori URL na svom mobitelu/tabletu i "Dodaj na početni zaslon". Koristi pred klijentom.
- **Klijent (opcionalno)**: dobije isti URL, sam doda na ekran; koristi kod kuće.
- Nema logina, nema sinkronizacije — sve što se spremi ostaje na tom uređaju.

## Spremanje postavki (bez baze)

Sve se pamti lokalno na uređaju preko `localStorage` (nije "baza", ne treba postavljati):

- zadnji korišteni tempo i broj ponavljanja,
- vrijeme pripreme (default 5 s),
- stanje zvuka (uklj./isklj.) i glasnoća,
- odabrani mod (Tempo / Disanje / Štoperica / Odbrojavanje / Intervali),
- zadnje korišteni parametri svakog moda (tempo, trajanja disanja, vrijeme odbrojavanja, parametri intervala),
- (opcionalno) male liste presetova (primjeri tempa/disanja/intervala) **bez naziva vježbe**.

Presetovi su kratki pa memorija nije problem; liste primjera su stvar udobnosti, nisu ključne.

## Struktura ekrana (visoka razina)

Jedan glavni ekran; sadržaj se mijenja prema odabranom modu:

1. **Prebacivač moda** — Tempo / Disanje / Štoperica / Odbrojavanje / Intervali.
2. **Zona vizualizacije** — ovisno o modu:
   - linija + točka (Tempo, Disanje),
   - veliko vrijeme (Štoperica),
   - krug + točka po kružnici + broj u sredini (Odbrojavanje, Intervali).
   Uz to: oznaka faze i brojači (ponavljanja / serije / vježbe / ukupno vrijeme) gdje ima smisla.
3. **Kontrole** — Pokreni/Pauza (Kreni/Stani kod štoperice), Reset, Zvuk uklj./isklj.
4. **Postavke** — polja specifična za mod (tempo, trajanja disanja, vrijeme odbrojavanja,
   parametri intervala), vrijeme pripreme, odabir primjera.

Detaljan raspored, boje i responzivnost: [Dizajn i stil](dizajn-i-stil.md).

## Fiksne odluke (zaključano)

- **Linijski modovi** (Tempo, Disanje): linija je **uvijek vodoravna**, **lijevo = gore, desno = dolje**.
- **Kružni modovi** (Odbrojavanje, Intervali): točka kreće **s vrha, u smjeru kazaljke**; četvrtine
  suptilne, polovina malo jače naglašena; broj u sredini; **staje na kraju** (bez auto-ponavljanja).
- Tempo se unosi kao **4 znamenke**; `0` znači "preskoči tu fazu, odmah dalje".
- **Priprema prije početka**: default **5 s**, korisnik može postaviti proizvoljno (vrijedi za
  modove koji je koriste: Tempo, Disanje, Intervali; Odbrojavanje po želji).
- **Štoperica**: format **MM:SS.cc** (sa stotinkama); mjeri stvarno proteklo vrijeme.
- **Intervali**: zadnja pauza u seriji se **preskače**; **vrijeme oporavka** je **završni** odmor;
  sustav prikazuje **ukupno trajanje** i broji serije/vježbe.
- **Zvuk**: tihi tik svake sekunde + jači ton na kraju faze; priprema 3-2-1 (gdje mod koristi zvuk).
- Vizualni stil prati **map-app** (teal `#2B717F`, Plus Jakarta Sans, svijetla/tamna tema).
