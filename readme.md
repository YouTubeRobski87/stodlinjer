# 🆘 Stödlinjer.se

En ideell informationssida som samlar svenska stödlinjer och hjälplinjer på ett ställe —  
för dig som behöver hjälp, eller för dig som vill hjälpa någon annan.

🌐 Webbplats: https://stodlinjer.se

---

## 💡 Om projektet

Ibland känns livet övermäktigt. Det kan handla om ångest, depression, ensamhet, våld,
missbruk eller oro för någon annan. **Stödlinjer.se** samlar Sveriges viktigaste
stödlinjer på ett ställe — så att du snabbt kan hitta rätt nummer att ringa eller
chatt att skriva till.

Alla stödlinjer som listas är seriösa aktörer som erbjuder anonymt och kostnadsfritt stöd.

Projektet är ideellt och skapat med fokus på tillgänglighet, tydlighet och trygghet.

---

## ✨ Funktioner

- 🔍 Sökbar lista med 20+ svenska stödlinjer  
- 🧠 Kategorier: psykisk hälsa, barn & unga, våld, missbruk, äldre, anhöriga  
- 🏷️ Taggfiltrering för mer detaljerad sökning  
- 🤖 Stödchatt (AI) som svarar på svenska och använder innehåll från sajten + externa källor  
- 🔗 Klickbara källor i chatbotten (artiklar, stödlinjer, externa länkar)  
- 🌗 Ljust/mörkt tema med automatisk systempreferens  
- 🔎 URL-baserad sökning (`?q=sökterm`) för delning och SearchAction (schema.org)  
- 📱 Responsiv design för mobil, surfplatta och desktop  
- ♿ Tillgänglighetsanpassad (ARIA, semantisk HTML, skip-links)  
- 💬 Motiverande citat som slumpas vid varje sidladdning  

---

## 🛠️ Teknik

- Eleventy (11ty)  
- Nunjucks-mallar  
- Tailwind CSS / PostCSS  
- JSON-baserad datamodell  
- Vercel (deploy)  
- Node.js 18+  

---

## 📦 Installation

Kräver **Node.js 18+**

```bash

```
npm install
Lokalt utvecklingsläge med live-reload:

npm run serve
Bygg statisk sajt (output till site/):

npm run build
Bygg endast CSS:

npm run build:css
Generera innehållsindex för stödchatten:

npm run index:content
Rekommenderat inför deploy:
npm run index:content && npm run build

📁 Projektstruktur (Eleventy)
src/
├── index.njk              # Startsida (sök + grid)
├── kontakt.njk            # Kontakt
├── _data/
│   ├── supportData.json   # Alla stödlinjer + chatbot-källor
│   ├── chatbot.json       # Chatbot-konfiguration
│   └── quotes.json        # Motiverande citat
├── _includes/
│   ├── layouts/base.njk
│   └── partials/          # Header, footer, komponenter
└── assets/
    ├── css/
    ├── js/
    └── fonts/
Output genereras till:

site/
➕ Lägg till eller ändra stödlinjer
All data finns i:

src/_data/supportData.json
Varje stödlinje innehåller bl.a.:

titel

beskrivning

telefon / chatt / webb

kategori

taggar

öppettider

senast verifierad datum

Stödlinjer kan tillfälligt döljas genom att sätta "active": false.

🤖 Stödchatten (AI)
Frontend: src/_includes/partials/chatbot.njk

JavaScript: src/assets/js/chatbot.js

Backend: Vercel Function /api/chat

Chatten använder:

Genererat innehållsindex

supportData.json

Externa källor (t.ex. 1177, Mind)

Miljövariabel (krävs för AI-svar):

OPENAI_API_KEY
Utan nyckel visas fallback-förslag från innehållsindexet.

🎨 Design
Mjukt lavendel-/grått färgschema

Light / Dark / Calm-teman

Accentfärg: lavendel / steel

Fokus på lugn, läsbarhet och kontrast

Sans-serif-typografi med optimerat radavstånd

📬 Kontakt
🌐 Webb: https://stodlinjer.se
📧 E-post: info@stodlinjer.se
👤 Skapad av: Robert Claesson

📄 Licens
Fritt att använda och anpassa för ideella och icke-kommersiella ändamål. 💚

Du är inte ensam. Hjälp finns.


---

När du klistrat in och committat:  
– om något ändå skulle se konstigt ut, skicka en skärmdump så pekar jag exakt var.  
Det här är nu en stabil README som inte ska bråka igen.â”‚   â”œâ”€â”€ chatbot.json        # Konfiguration fÃ¶r stÃ¶dchatten (API-url, externa kÃ¤llor)
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

