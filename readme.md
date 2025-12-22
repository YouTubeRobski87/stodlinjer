# ðŸ†˜ StÃ¶dlinjer.se

En ideell informationssida som samlar svenska stÃ¶dlinjer och hjÃ¤lplinjer pÃ¥ ett stÃ¤lle â€” fÃ¶r dig som behÃ¶ver hjÃ¤lp, eller fÃ¶r dig som vill hjÃ¤lpa nÃ¥gon annan.

ðŸŒ **Webbplats:** [stodlinjer.se](https://stodlinjer.se)

---

## ðŸ’¡ Om projektet

Ibland kÃ¤nns livet Ã¶vermÃ¤ktigt. Det kan handla om Ã¥ngest, depression, ensamhet, vÃ¥ld, missbruk eller oro fÃ¶r nÃ¥gon annan. StÃ¶dlinjer.se samlar Sveriges viktigaste stÃ¶dlinjer pÃ¥ ett stÃ¤lle â€” sÃ¥ att du snabbt kan hitta rÃ¤tt nummer att ringa eller chatt att skriva till. Alla stÃ¶dlinjer som listas Ã¤r seriÃ¶sa aktÃ¶rer som erbjuder anonymt, kostnadsfritt stÃ¶d.

Byggt med **Eleventy (11ty)** och Nunjucks-mallar, med data i JSON-filer under `src/_data/`.

ðŸ“š **Dokumentation:** Se `docs/` â†’ [docs/index](docs/00-index.md) fÃ¶r lÃ¤sordning och guider.

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

(`serve` kÃ¶r bÃ¥de Tailwind --watch och Eleventy-servern.)

Bygg statisk sajt (output till `site/`):

```bash
npm run build
```

Bygg enbart stilarna (genererar `src/assets/css/tailwind-built.css`):

```bash
npm run build:css
```

Generera innehÃ¥llsindexet som anvÃ¤nds av stÃ¶dchatten (laddar artiklar + JSON-data till `.chatdata/content-index.json`):

```bash
npm run index:content
```

KÃ¶r gÃ¤rna `npm run index:content && npm run build` innan deploy om innehÃ¥llet har Ã¤ndrats.

---

## ðŸ“ Projektstruktur (Eleventy)

```
src/
â”œâ”€â”€ index.njk               # Startsida (sÃ¶k + grid)
â”œâ”€â”€ kontakt.njk             # KontaktformulÃ¤r
â”œâ”€â”€ _data/
â”‚   â”œâ”€â”€ supportData.json     # Alla stÃ¶dlinjer + chatbot-kÃ¤llor
â”‚   â”œâ”€â”€ chatbot.json        # Konfiguration fÃ¶r stÃ¶dchatten (API-url, externa kÃ¤llor)
â”‚   â””â”€â”€ quotes.json         # Motiverande citat
â”œâ”€â”€ _includes/
â”‚   â”œâ”€â”€ layouts/base.njk
â”‚   â””â”€â”€ partials/           # Header, footer, sektioner m.m.
â””â”€â”€ assets/
    â”œâ”€â”€ css/                # base.css, themes.css, components/, tailwind.css (entry -> tailwind-built.css)
    â”œâ”€â”€ js/                 # app.js, chatbot.js
    â””â”€â”€ fonts/              # Ikon- och typsnitts-filer
```

Tailwind/PostCSS-konfiguration: `tailwind.config.js`, `postcss.config.js`

Chatbotens innehÃ¥llsindex skrivs till `.chatdata/content-index.json` (genereras, inte manuellt redigerad).

Output: `site/` (Eleventy skriver fÃ¤rdiga HTML-filer och kopierar assets).

---

## ðŸ–¼ï¸ Ikoner (SVG symbols)

- Ikonfonten Ã¤r ersatt av SVG-sprites: `src/assets/symbols/st-line.svg` (outline) och `src/assets/symbols/st-solid.svg` (solid). De exponeras pÃ¥ sajten som `/assets/symbols/st-line.svg` och `/assets/symbols/st-solid.svg`.
- AnvÃ¤nd `<svg class="stl"><use href="/assets/symbols/st-line.svg#symbol-fork-right"></use></svg>` fÃ¶r linjeikoner och `<svg class="sts"><use href="/assets/symbols/st-solid.svg#symbol-fork-right"></use></svg>` fÃ¶r solid-varianten. Symbol-id:n matchar de gamla ikonfont-namnen.
- Ikoner Ã¤r 1em hÃ¶ga/breda som standard och Ã¤rver textfÃ¤rgen (`currentColor`). SÃ¤tt `--symbol-color-primary`/`--symbol-color-secondary` pÃ¥ elementet fÃ¶r tvÃ¥fÃ¤rgade ikoner.
- Stroke-hjÃ¤lpare: `.stroke-1` â€¦ `.stroke-4` samt `.stroke-round` (rundade hÃ¶rn/Ã¤ndar) kan lÃ¤ggas pÃ¥ `<svg>`-elementet.

---

## âž• LÃ¤gg till eller Ã¤ndra stÃ¶dlinjer

All data finns i `src/_data/supportData.json`. Filen innehÃ¥ller bÃ¥de de stÃ¶dlinjer som visas pÃ¥ startsidan och de externa kÃ¤llor som chatbotten anvÃ¤nder. Varje objekt fÃ¶ljer detta format (visa vÃ¤rden fÃ¶r SjÃ¤lvmordslinjen som exempel):

```json
{
  "id": 1,
  "title": "SjÃ¤lvmordslinjen",
  "resource": {
    "url": "https://mind.se/sjalvmordslinjen/",
    "type": "link"
  },
  "contactTypes": ["telefon", "chatt", "webb"],
  "phone": "90101",
  "description": "FÃ¶r dig med suicidtankar eller oro fÃ¶r nÃ¥gon annan. HÃ¤r fÃ¥r du anonymt, professionellt stÃ¶d dygnet runt, alla dagar.",
  "category": "psykisk-halsa",
  "urgent": true,
  "tags": ["akut", "psykisk-halsa", "suicid"],
  "availability": {
    "label": "Dygnet runt, Ã¥rets alla dagar",
    "timezone": "Europe/Stockholm",
    "openingHours": [
      {
        "days": ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
        "open": "00:00",
        "close": "24:00",
        "channels": ["telefon", "chatt"]
      }
    ]
  },
  "lastVerified": "2025-12-10",
  "active": true
}
```

`resource.type` beskriver vilken typ av lÃ¤nk det Ã¤r (oftast `link`). `availability` anvÃ¤nds fÃ¶r att visa Ã¶ppettider, `lastVerified` markerar nÃ¤r datan senast kontrollerades och `active` kan sÃ¤ttas till `false` fÃ¶r att dÃ¶lja en linje temporÃ¤rt.

### TillgÃ¤ngliga kategorier

| Kategori               | VÃ¤rde           |
| ---------------------- | --------------- |
| ðŸ§  Psykisk hÃ¤lsa       | `psykisk-halsa` |
| ðŸ‘¶ Barn & unga         | `barn-unga`     |
| ðŸ›¡ï¸ VÃ¥ld & utsatthet    | `vald`          |
| ðŸ· Missbruk & beroende | `missbruk`      |
| ðŸ§“ Ã„ldre               | `aldre`         |
| ðŸ‘¥ AnhÃ¶riga            | `anhoriga`      |
| â„¹ï¸ Ã–vrigt              | `ovrigt`        |

### TillgÃ¤ngliga taggar

`akut`, `psykiskhalsa`, `suicid`, `samtal`, `chatt`, `anonymt`, `anhorig`, `missbruk`, `barn-unga`, `killarman`, `hbtqi`, `stodgrupp`, `vald`, `sorg`, `trauma`, `spelproblem`, `aldre`, `angest`, `sjalvskada`, `myndighet`

### LÃ¤gg till citat

`src/_data/quotes.json` innehÃ¥ller citatobjekt:

```json
{
  "text": "Det kommer en dag till.",
  "author": "OkÃ¤nd"
}
```

---

## ðŸ¤– StÃ¶dchatten

- Ligger som komponent i `src/_includes/partials/chatbot.njk` och aktiveras av `src/assets/js/chatbot.js`.
- Backend via Vercel Function `/api/chat` (fil: `api/chat.js`).
- AnvÃ¤nder ett genererat innehÃ¥llsindex + `src/_data/supportData.json` fÃ¶r externa kÃ¤llor (1177, Mind m.fl.). `chatbot.json` innehÃ¥ller numera bara `apiUrl` och `greetings`.
- KrÃ¤ver miljÃ¶variabeln `OPENAI_API_KEY` fÃ¶r AI-svar. Utan nyckel visar chatten fallbackfÃ¶rslag frÃ¥n innehÃ¥llsindexet.
- KÃ¤llor i chatten (artiklar, stÃ¶dlinjer, externa lÃ¤nkar) Ã¤r klickbara.

### Uppdatera chatbotens index

KÃ¶r efter innehÃ¥llsÃ¤ndringar (nya artiklar eller uppdaterade JSON-data):

```bash
npm run index:content
```

Den genererar `.chatdata/content-index.json` som laddas av frontenden.

### Konfiguration

- Redigera `src/_data/chatbot.json` fÃ¶r att uppdatera externa resurser som chatten kan fÃ¶reslÃ¥.
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

