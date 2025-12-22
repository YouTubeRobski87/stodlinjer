# ðŸ†˜ StÃ¶dlinjer.se

En ideell informationssida som samlar svenska stÃ¶dlinjer och hjÃ¤lplinjer pÃ¥ ett stÃ¤lle â€” fÃ¶r dig som behÃ¶ver hjÃ¤lp, eller fÃ¶r dig som vill hjÃ¤lpa nÃ¥gon annan.

ðŸŒ **Webbplats:** [stodlinjer.se](https://stodlinjer.se)

---

## ðŸ’¡ Om projektet

Ibland kÃ¤nns livet Ã¶vermÃ¤ktigt. Det kan handla om Ã¥ngest, depression, ensamhet, vÃ¥ld, missbruk eller oro fÃ¶r nÃ¥gon annan. StÃ¶dlinjer.se samlar Sveriges viktigaste stÃ¶dlinjer pÃ¥ ett stÃ¤lle â€” sÃ¥ att du snabbt kan hitta rÃ¤tt nummer att ringa eller chatt att skriva till. Alla stÃ¶dlinjer som listas Ã¤r seriÃ¶sa aktÃ¶rer som erbjuder anonymt, kostnadsfritt stÃ¶d.

Byggt med **Eleventy (11ty)** och Nunjucks-mallar, med data i JSON-filer under `_data/`.

---

## âœ¨ Funktioner

- ðŸ” **SÃ¶kbar lista** med 21+ svenska stÃ¶dlinjer
- ðŸ·ï¸ **Kategorifiltrering** â€” psykisk hÃ¤lsa, barn & unga, vÃ¥ld, missbruk, Ã¤ldre
- #ï¸âƒ£ **Taggfiltrering** fÃ¶r detaljerad sÃ¶kning
- ðŸ¤– **StÃ¶dchatten (AI)** som svarar pÃ¥ svenska och anvÃ¤nder innehÃ¥llet pÃ¥ sajten + externa kÃ¤llor
- ðŸ”— **Klickbara kÃ¤llor** i chatbotten (artiklar, stÃ¶dlinjer, externa lÃ¤nkar)
- ðŸŒ“ **Ljust/mÃ¶rkt tema** med automatisk systempreferens
- ðŸ”— **URL-baserad sÃ¶kning** (`?q=sÃ¶kterm`) fÃ¶r delning och schema.org SearchAction
- ðŸ“± **Responsiv design** fÃ¶r mobil, surfplatta och desktop
- â™¿ **TillgÃ¤nglighetsanpassad** â€” skip links, ARIA-attribut, semantisk HTML
- ðŸ’¬ **Motiverande citat** som slumpas vid varje sidladdning

---

## ðŸ“¦ Installation & scripts

KrÃ¤ver Node 18+.

```bash
npm install
```

Lokalt utvecklingslÃ¤ge med live-reload:

```bash
npm run serve
```

Bygg statisk sajt (output till `site/`):

```bash
npm run build
```

Generera innehÃ¥llsindexet som anvÃ¤nds av stÃ¶dchatten (laddar artiklar + JSON-data till `.chatdata/content-index.json`):

```bash
npm run index:content
```

KÃ¶r gÃ¤rna `npm run index:content && npm run build` innan deploy om innehÃ¥llet har Ã¤ndrats.

---

## ðŸ“ Projektstruktur (Eleventy)

```
./
â”œâ”€â”€ index.njk               # Startsida (sÃ¶k + grid)
â”œâ”€â”€ kontakt.njk             # KontaktformulÃ¤r
â”œâ”€â”€ _data/
â”‚   â”œâ”€â”€ support-lines.json  # Alla stÃ¶dlinjer
â”‚   â”œâ”€â”€ chatbot.json        # Konfiguration fÃ¶r stÃ¶dchatten (API-url, externa kÃ¤llor)
â”‚   â””â”€â”€ quotes.json         # Motiverande citat
â”œâ”€â”€ _includes/
â”‚   â”œâ”€â”€ layouts/base.njk
â”‚   â””â”€â”€ partials/           # Header, footer, sektioner m.m.
â””â”€â”€ assets/
    â”œâ”€â”€ css/                # base.css, main.css (+ komponent-partials)
    â”œâ”€â”€ js/                 # app.js, tailwind-config.js
    â””â”€â”€ fonts/              # Ikon- och typsnitts-filer
```

Chatbotens innehÃ¥llsindex skrivs till `.chatdata/content-index.json` (genereras, inte manuellt redigerad).

Output: `site/` (Eleventy skriver fÃ¤rdiga HTML-filer och kopierar assets).

---

## âž• LÃ¤gg till eller Ã¤ndra stÃ¶dlinjer

All data finns i `_data/support-lines.json`. Varje stÃ¶dlinje fÃ¶ljer detta format:

```json
{
  "id": 1,
  "name": "Namn pÃ¥ stÃ¶dlinjen",
  "url": "https://exempel.se/",
  "number": "020-12 34 56",
  "description": "Kort beskrivning av vem linjen hjÃ¤lper.",
  "category": "psykiskhalsa",
  "available": "Dygnet runt, alla dagar",
  "urgent": true,
  "tags": ["akut", "samtal", "anonymt"]
}
```

### TillgÃ¤ngliga kategorier

| Kategori               | VÃ¤rde          |
| ---------------------- | -------------- |
| ðŸ§  Psykisk hÃ¤lsa       | `psykiskhalsa` |
| ðŸ‘¶ Barn & unga         | `barn-unga`    |
| ðŸ›¡ï¸ VÃ¥ld & utsatthet    | `vald`         |
| ðŸ· Missbruk & beroende | `missbruk`     |
| ðŸ§“ Ã„ldre               | `aldre`        |

### TillgÃ¤ngliga taggar

`akut`, `psykiskhalsa`, `suicid`, `samtal`, `chatt`, `anonymt`, `valdbrott`, `sorgtrauma`, `anhorig`, `missbruk`, `barn-unga`, `killarman`, `hbtqi`, `stodgrupp`

### LÃ¤gg till citat

`_data/quotes.json` innehÃ¥ller citatobjekt:

```json
{
  "text": "Det kommer en dag till.",
  "author": "OkÃ¤nd"
}
```

---

## ðŸ¤– StÃ¶dchatten

- Ligger som komponent i `_includes/partials/chatbot.njk` och aktiveras av `assets/js/chatbot.js`.
- Backend via Vercel Function `/api/chat` (fil: `api/chat.js`).
- AnvÃ¤nder ett genererat innehÃ¥llsindex + `_data/chatbot.json` fÃ¶r externa kÃ¤llor (1177, Mind m.fl.).
- KrÃ¤ver miljÃ¶variabeln `OPENAI_API_KEY` fÃ¶r AI-svar. Utan nyckel visar chatten fallbackfÃ¶rslag frÃ¥n innehÃ¥llsindexet.
- KÃ¤llor i chatten (artiklar, stÃ¶dlinjer, externa lÃ¤nkar) Ã¤r klickbara.

### Uppdatera chatbotens index

KÃ¶r efter innehÃ¥llsÃ¤ndringar (nya artiklar eller uppdaterade JSON-data):

```bash
npm run index:content
```

Den genererar `.chatdata/content-index.json` som laddas av frontenden.

### Konfiguration

- Redigera `_data/chatbot.json` fÃ¶r att uppdatera externa resurser som chatten kan fÃ¶reslÃ¥.
- MiljÃ¶variabler (lÃ¤gg i `.env` eller i Vercel Environment Variables):
  - `OPENAI_API_KEY` â€” krÃ¤vs fÃ¶r att anropa OpenAI i Vercel-funktionen.

---

## ðŸŽ¨ Design

Webbplatsen anvÃ¤nder ett mjukt lavendel-/grÃ¥tt fÃ¤rgschema (light/dark/calm) med fokus pÃ¥ tillgÃ¤nglighet och lÃ¤sbarhet:

- **Ljust tema:** Ljust lavendel/krÃ¤m med mjuka kontraster
- **MÃ¶rkt tema:** DÃ¤mpat mÃ¶rkgrÃ¥tt med ljusa accenter
- **AccentfÃ¤rg:** Lavendel/steel (`--accent: #8a8ec4`) och variationer per tema
- **Typografi:** SÃ¶hne (sans-serif) med optimerade vikter och radavstÃ¥nd

---

## ðŸš€ Publicering

Static build till `site/` (Vercel-konfig i `vercel.json`). KÃ¶r `npm run index:content && npm run build` infÃ¶r deploy sÃ¥ att chatbotens index Ã¤r uppdaterat.

---

## ðŸ“§ Kontakt

- ðŸŒ **Webb:** [stodlinjer.se](https://stodlinjer.se)
- ðŸ“¬ **E-post:** [info@stodlinjer.se](mailto:info@stodlinjer.se)
- ðŸ‘¤ **Skapad av:** [Robert Claesson](https://github.com/YouTubeRobski87)

---

## ðŸ“„ Licens

Fritt att anvÃ¤nda och anpassa fÃ¶r ideella Ã¤ndamÃ¥l. ðŸ’š

---

> _"Du Ã¤r inte ensam. HjÃ¤lp finns."_


