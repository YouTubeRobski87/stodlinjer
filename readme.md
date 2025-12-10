# 🆘 Stödlinjer.se

En ideell informationssida som samlar svenska stödlinjer och hjälplinjer på ett ställe — för dig som behöver hjälp, eller för dig som vill hjälpa någon annan.

🌐 **Webbplats:** [stodlinjer.se](https://stodlinjer.netlify.app)

---

## 💡 Om projektet

Ibland känns livet övermäktigt. Det kan handla om ångest, depression, ensamhet, våld, missbruk eller oro för någon annan. Stödlinjer.se samlar Sveriges viktigaste stödlinjer på ett ställe — så att du snabbt kan hitta rätt nummer att ringa eller chatt att skriva till. Alla stödlinjer som listas är seriösa aktörer som erbjuder anonymt, kostnadsfritt stöd.

Byggt med **Eleventy (11ty)** och Nunjucks-mallar, med data i JSON-filer under `src/_data/`.

---

## ✨ Funktioner

- 🔍 **Sökbar lista** med 21+ svenska stödlinjer
- 🏷️ **Kategorifiltrering** — psykisk hälsa, barn & unga, våld, missbruk, äldre
- #️⃣ **Taggfiltrering** för detaljerad sökning
- 🤖 **Stödchatten (AI)** som svarar på svenska och använder innehållet på sajten + externa källor
- 🔗 **Klickbara källor** i chatbotten (artiklar, stödlinjer, externa länkar)
- 🌓 **Ljust/mörkt tema** med automatisk systempreferens
- 🔗 **URL-baserad sökning** (`?q=sökterm`) för delning och schema.org SearchAction
- 📱 **Responsiv design** för mobil, surfplatta och desktop
- ♿ **Tillgänglighetsanpassad** — skip links, ARIA-attribut, semantisk HTML
- 💬 **Motiverande citat** som slumpas vid varje sidladdning

---

## 📦 Installation & scripts

Kräver Node 18+.

```bash
npm install
```

Lokalt utvecklingsläge med live-reload:

```bash
npm run serve
```

Bygg statisk sajt (output till `site/`):

```bash
npm run build
```

Generera innehållsindexet som används av stödchatten (laddar artiklar + JSON-data till `.chatdata/content-index.json`):

```bash
npm run index:content
```

Kör gärna `npm run index:content && npm run build` innan deploy om innehållet har ändrats.

---

## 📁 Projektstruktur (Eleventy)

```
src/
├── index.njk               # Startsida (sök + grid)
├── kontakt.njk             # Kontaktformulär
├── _data/
│   ├── supportData.json     # Alla stödlinjer + chatbot-källor
│   ├── chatbot.json        # Konfiguration för stödchatten (API-url, externa källor)
│   └── quotes.json         # Motiverande citat
├── _includes/
│   ├── layouts/base.njk
│   └── partials/           # Header, footer, sektioner m.m.
└── assets/
    ├── css/                # base.css, main.css (+ komponent-partials)
    ├── js/                 # app.js, tailwind-config.js
    └── fonts/              # Ikon- och typsnitts-filer
```

Chatbotens innehållsindex skrivs till `.chatdata/content-index.json` (genereras, inte manuellt redigerad).

Output: `site/` (Eleventy skriver färdiga HTML-filer och kopierar assets).

---

## ➕ Lägg till eller ändra stödlinjer

All data finns i `src/_data/supportData.json`. Filen innehåller både de stödlinjer som visas på startsidan och de externa källor som chatbotten använder. Varje objekt följer detta format (visa värden för Mind Självmordslinjen som exempel):

```json
{
  "id": 1,
  "title": "Självmordslinjen (Mind)",
  "resource": {
    "url": "https://mind.se/sjalvmordslinjen/",
    "type": "link"
  },
  "contactTypes": ["telefon", "chatt", "webb"],
  "phone": "90101",
  "description": "För dig med suicidtankar eller oro för någon annan. Här får du anonymt, professionellt stöd dygnet runt, alla dagar.",
  "category": "psykisk-halsa",
  "urgent": true,
  "tags": ["akut", "psykisk-halsa", "suicid"],
  "availability": {
    "label": "Dygnet runt, årets alla dagar",
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

`resource.type` beskriver vilken typ av länk det är (oftast `link`). `availability` används för att visa öppettider, `lastVerified` markerar när datan senast kontrollerades och `active` kan sättas till `false` för att dölja en linje temporärt.

### Tillgängliga kategorier

| Kategori               | Värde            |
| ---------------------- | ---------------- |
| 🧠 Psykisk hälsa       | `psykisk-halsa`  |
| 👶 Barn & unga         | `barn-unga`      |
| 🛡️ Våld & utsatthet    | `vald`           |
| 🍷 Missbruk & beroende | `missbruk`       |
| 🧓 Äldre               | `aldre`          |
| 👥 Anhöriga            | `anhoriga`       |
| ℹ️ Övrigt              | `ovrigt`         |

### Tillgängliga taggar

`akut`, `psykiskhalsa`, `suicid`, `samtal`, `chatt`, `anonymt`, `anhorig`, `missbruk`, `barn-unga`, `killarman`, `hbtqi`, `stodgrupp`, `vald`, `sorg`, `trauma`, `spelproblem`, `aldre`, `angest`, `sjalvskada`, `myndighet`

### Lägg till citat

`src/_data/quotes.json` innehåller citatobjekt:

```json
{
  "text": "Det kommer en dag till.",
  "author": "Okänd"
}
```

---

## 🤖 Stödchatten

- Ligger som komponent i `src/_includes/partials/chatbot.njk` och aktiveras av `src/assets/js/chatbot.js`.
- Backend via Netlify Function `/.netlify/functions/chat` (fil: `netlify/functions/chat.js`).
- Använder ett genererat innehållsindex + `src/_data/supportData.json` för externa källor (1177, Mind m.fl.). `chatbot.json` innehåller numera bara `apiUrl` och `greetings`.
- Kräver miljövariabeln `OPENAI_API_KEY` för AI-svar. Utan nyckel visar chatten fallbackförslag från innehållsindexet.
- Källor i chatten (artiklar, stödlinjer, externa länkar) är klickbara.

### Uppdatera chatbotens index

Kör efter innehållsändringar (nya artiklar eller uppdaterade JSON-data):

```bash
npm run index:content
```

Den genererar `.chatdata/content-index.json` som laddas av frontenden.

### Konfiguration

- Redigera `src/_data/chatbot.json` för att uppdatera externa resurser som chatten kan föreslå.
- Miljövariabler (lägg i `.env` eller i Netlify/GitHub Secrets):
  - `OPENAI_API_KEY` — krävs för att anropa OpenAI i Netlify-funktionen.

---

## 🎨 Design

Webbplatsen använder ett mjukt lavendel-/grått färgschema (light/dark/calm) med fokus på tillgänglighet och läsbarhet:

- **Ljust tema:** Ljust lavendel/kräm med mjuka kontraster
- **Mörkt tema:** Dämpat mörkgrått med ljusa accenter
- **Accentfärg:** Lavendel/steel (`--accent: #8a8ec4`) och variationer per tema
- **Typografi:** Söhne (sans-serif) med optimerade vikter och radavstånd

---

## 🚀 Publicering

Static build till `site/` (Netlify-konfig i `netlify.toml`). Kör `npm run index:content && npm run build` inför deploy så att chatbotens index är uppdaterat.

---

## 📧 Kontakt

- 🌐 **Webb:** [stodlinjer.se](https://stodlinjer.netlify.app)
- 📬 **E-post:** [info@stodlinjer.se](mailto:info@stodlinjer.se)
- 👤 **Skapad av:** [Robert Claesson](https://github.com/YouTubeRobski87)

---

## 📄 Licens

Fritt att använda och anpassa för ideella ändamål. 💚

---

> _"Du är inte ensam. Hjälp finns."_
