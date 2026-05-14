# Projektstruktur 🗂️

Nu när du förstår de underliggande teknikerna är det dags att titta på hur Stödlinjer-projektet faktiskt är organiserat. Den här guiden ger dig en komplett karta över projektets alla filer och mappar — vad som finns var och varför.

Tänk på den här guiden som en uppslagsbok. Du behöver inte memorera allt, men det är bra att veta var du hittar saker när du behöver dem.

---

## Översikt på hög nivå �helicopter

Låt oss börja med helikopterperspektivet. Här är projektets huvudsakliga struktur:

```
stodlinjer/
├── 📁 src/                 # KÄLLFILER — här arbetar du
├── 📁 site/                # BYGGD SAJT — rör ej!
├── 📁 netlify/             # SERVERLESS FUNCTIONS
├── 📁 scripts/             # BYGGSCRIPTS
├── 📁 docs/                # DOKUMENTATION (denna guide!)
├── 📁 node_modules/        # INSTALLERADE PAKET — rör ej!
├── 📁 .chatdata/           # GENERERAD DATA FÖR CHATBOT
├── 📄 package.json         # PROJEKTETS KONFIGURATION
├── 📄 package-lock.json    # LÅSTA PAKETVERSIONER
├── 📄 eleventy.config.js   # ELEVENTY-KONFIGURATION
├── 📄 netlify.toml         # NETLIFY-KONFIGURATION
├── 📄 .gitignore           # FILER SOM GIT IGNORERAR
├── 📄 .env                 # MILJÖVARIABLER (lokalt, ej i Git)
└── 📄 README.md            # PROJEKTETS INTRODUKTION
```

### De tre viktigaste mapparna

| Mapp       | Vad den innehåller                                  | Redigera?     |
| ---------- | --------------------------------------------------- | ------------- |
| `src/`     | Allt källmaterial — mallar, artiklar, data, CSS, JS | ✅ Ja!        |
| `site/`    | Den färdiga, byggda sajten                          | ❌ Aldrig!    |
| `netlify/` | Serverless functions (backend)                      | ⚠️ Försiktigt |

---

## Källkoden: src/ 📂

Det här är mappen där du kommer spendera mest tid. Låt oss utforska den på djupet.

```
src/
├── 📁 _data/               # Global data (JSON)
├── 📁 _includes/           # Mallar och komponenter
│   ├── 📁 layouts/         # Sidlayouter
│   └── 📁 partials/        # Återanvändbara delar
├── 📁 artiklar/            # Alla artiklar (Markdown)
│   ├── 📁 fakta-myter/
│   ├── 📁 faq/
│   ├── 📁 fordjupning/
│   ├── 📁 handlingsguider/
│   └── 📁 samtalsstod/
├── 📁 assets/              # Statiska filer
│   ├── 📁 css/
│   ├── 📁 js/
│   ├── 📁 fonts/
│   ├── 📁 favicon/
│   └── 📁 icons/
├── 📁 samlingar/           # Samlingssidor
├── 📄 index.njk            # Startsidan
├── 📄 kontakt.njk          # Kontaktsidan
├── 📄 sok.njk              # Söksidan
└── 📄 robots.txt           # Instruktioner för sökmotorer
```

---

### \_data/ — Global data 📊

```
src/_data/
├── 📄 site.json            # Grundläggande sajtinfo
├── 📄 supportLines.json    # Alla stödlinjer
├── 📄 samlingar.json       # Artikelkategorier
├── 📄 quotes.json          # Inspirerande citat
└── 📄 chatbot.json         # Chatbot-konfiguration
```

Allt i den här mappen blir automatiskt tillgängligt i alla mallar. Filnamnet (utan `.json`) blir variabelnamnet:

| Fil                 | Variabel i mallar    |
| ------------------- | -------------------- |
| `site.json`         | `{{ site }}`         |
| `supportLines.json` | `{{ supportLines }}` |
| `samlingar.json`    | `{{ samlingar }}`    |

**När redigerar du dessa?**

- `site.json` — Sällan, bara om sajtens grundinfo ändras
- `supportLines.json` — När stödlinjer läggs till/ändras/tas bort
- `samlingar.json` — När nya artikelkategorier skapas
- `quotes.json` — När citat läggs till eller ändras
- `chatbot.json` — När chatbotens beteende ska ändras

---

### \_includes/ — Mallar och komponenter 🧩

```
src/_includes/
├── 📁 layouts/             # Sidlayouter
│   ├── 📄 base.njk         # Grundlayout (HTML-skelett)
│   ├── 📄 page.njk         # Vanliga sidor
│   ├── 📄 post.njk         # Artiklar
│   └── 📄 samling.njk      # Samlingssidor
└── 📁 partials/            # Återanvändbara komponenter
    ├── 📄 head.njk         # <head>-innehåll
    ├── 📄 header.njk       # Sidhuvud med navigation
    ├── 📄 footer.njk       # Sidfot
    ├── 📄 schema.njk       # Strukturerad data (SEO)
    ├── 📄 chatbot.njk      # Chatbot-widget
    └── 📄 article-card.njk # Artikelkort (för listningar)
```

#### Layouts — Sidans skelett

Layouts definierar den övergripande strukturen. De ärver från varandra:

```
base.njk          ← HTML-dokumentet, <head>, <body>
    ↑
page.njk          ← Wrapper för vanliga sidor
    ↑
post.njk          ← Artikelspecifik layout
```

**base.njk** — Grundlayouten som alla andra ärver från:

```njk
<!DOCTYPE html>
<html lang="{{ site.language }}">
<head>
  {% include "partials/head.njk" %}
</head>
<body class="{{ pageClass }}">
  {% include "partials/header.njk" %}

  <main>
    {{ content | safe }}
  </main>

  {% include "partials/footer.njk" %}
  {% include "partials/chatbot.njk" %}
</body>
</html>
```

**post.njk** — Layout för artiklar:

```njk
---
layout: layouts/base.njk
---

<article class="article">
  <header>
    <h1>{{ title }}</h1>
    <p class="lead">{{ description }}</p>
  </header>

  <div class="content">
    {{ content | safe }}
  </div>
</article>
```

#### Partials — Återanvändbara bitar

Partials är mindre komponenter som inkluderas där de behövs:

| Partial            | Används för                              |
| ------------------ | ---------------------------------------- |
| `head.njk`         | Meta-taggar, CSS-länkar, favicons        |
| `header.njk`       | Logo, huvudnavigation                    |
| `footer.njk`       | Sidfot med länkar och info               |
| `schema.njk`       | JSON-LD för sökmotorer                   |
| `chatbot.njk`      | Chatbot-widgeten                         |
| `article-card.njk` | Kort som visar artikelförhandsgranskning |

---

### artiklar/ — Allt innehåll 📝

```
src/artiklar/
├── 📄 artiklar.json         # Directory data för alla artiklar
├── 📁 fakta-myter/          # Artiklar om vanliga missförstånd
│   └── 📄 2025-01-15-depression-ar-inte-latja.md
├── 📁 faq/                  # Vanliga frågor
│   └── 📄 2025-02-01-hur-hittar-jag-ratt-stod.md
├── 📁 fordjupning/          # Längre, djupgående artiklar
│   └── 📄 2025-01-20-forsta-angest.md
├── 📁 handlingsguider/      # Praktiska steg-för-steg-guider
│   └── 📄 2025-03-01-trygghetsplan.md
└── 📁 samtalsstod/          # Guider för att stötta andra
    └── 📄 2025-02-15-vad-sager-jag.md
```

#### Filnamnskonvention

Artiklar följer mönstret: `YYYY-MM-DD-url-slug.md`

- **Datum** — Används för sortering och visas som publiceringsdatum
- **URL-slug** — Blir sidans URL (utan datumet)

Exempel:

- Fil: `2025-03-15-konsten-att-lyssna.md`
- URL: `/artiklar/samtalsstod/konsten-att-lyssna/`

#### artiklar.json — Gemensamma inställningar

Denna fil ger standardvärden för _alla_ artiklar:

```json
{
  "layout": "layouts/post.njk",
  "tags": ["artikel"],
  "permalink": "/{{ page.filePathStem }}/",
  "pageClass": "article-shell",
  "header": {
    "icon": "fas fa-book-open",
    "label": "Kunskap & artiklar"
  }
}
```

Det betyder att du _inte_ behöver upprepa detta i varje artikels frontmatter.

#### En typisk artikel

```markdown
---
title: Vad säger jag när någon mår dåligt?
description: En guide för att stötta någon som har det svårt genom aktivt lyssnande.
date: 2025-12-15
samling: samtalsstod
tags:
  - kommunikation
  - stöd
---

När någon berättar att de mår dåligt är det naturligt att
känna sig osäker...

## Lyssna aktivt

Det viktigaste första steget är att...
```

---

### assets/ — Statiska filer 🎨

```
src/assets/
├── 📁 css/
│   └── 📄 main.css         # Huvudstilmall
├── 📁 js/
│   ├── 📄 app.js           # Huvud-JavaScript
│   ├── 📄 chatbot.js       # Chatbot-logik
│   └── 📄 tailwind-config.js
├── 📁 fonts/               # Typsnitt (om lokala)
├── 📁 favicon/             # Favicons för olika enheter
│   ├── 📄 favicon.ico
│   ├── 📄 favicon.svg
│   ├── 📄 apple-touch-icon.png
│   └── 📄 site.webmanifest
└── 📁 icons/               # Ikoner och grafik
```

Dessa filer kopieras direkt till `site/assets/` vid bygge — de processas inte av Eleventy.

#### CSS-struktur

`main.css` innehåller all styling. Projektet använder en kombination av:

- **Tailwind CSS** — Utility-klasser (laddas från CDN)
- **Custom CSS** — Projektspecifika stilar

#### JavaScript-filer

| Fil                  | Ansvar                            |
| -------------------- | --------------------------------- |
| `app.js`             | Generell funktionalitet, söklogik |
| `chatbot.js`         | Chatbot-widgetens logik           |
| `tailwind-config.js` | Tailwind-konfiguration            |

---

### Övriga sidor 📄

Utöver artiklar finns några enskilda sidor i `src/`:

```
src/
├── 📄 index.njk      # Startsidan
├── 📄 kontakt.njk    # Kontaktsidan
├── 📄 sok.njk        # Söksidan
└── 📄 robots.txt     # För sökmotorer
```

#### index.njk — Startsidan

```njk
---
layout: layouts/base.njk
title: Hitta rätt stöd
description: Svenska stödlinjer och resurser för psykisk hälsa.
permalink: /
pageClass: home-shell
---

<section class="hero">
  <h1>{{ title }}</h1>
  <p>{{ description }}</p>
</section>

<section class="support-lines">
  {% for line in supportLines %}
    {# Visa stödlinjer #}
  {% endfor %}
</section>
```

---

## Backend: netlify/ ☁️

```
netlify/
└── 📁 functions/
    └── 📄 chat.js          # Chatbot-API
```

Denna mapp innehåller _serverless functions_ — kod som körs på servern (Netlify) istället för i webbläsaren.

### chat.js — Chatbot-backend

Denna funktion tar emot meddelanden från chatboten och kommunicerar med OpenAI:s API:

```javascript
// Förenklad struktur
exports.handler = async (event) => {
  const { messages, context } = JSON.parse(event.body);

  // Skicka till OpenAI
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    // ...
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ answer: response.choices[0].message.content })
  };
};
```

> 💡 Mer om serverless functions i guiden [Netlify & Backend](08-netlify-backend.md).

---

## Byggscripts: scripts/ 🔧

```
scripts/
└── 📄 generate-content-index.js
```

### generate-content-index.js

Detta script körs automatiskt innan varje bygge och genererar en sökbar index över allt innehåll för chatboten:

- Läser alla artiklar och extraherar text
- Läser data från JSON-filer
- Skapar en sammanslagen JSON-fil i `.chatdata/`

Scriptet anropas från `eleventy.config.js`:

```javascript
eleventyConfig.on('eleventy.before', async () => {
  await generateContentIndex();
});
```

---

## Konfigurationsfiler ⚙️

### eleventy.config.js

Eleventys huvudkonfiguration. Definierar:

- Input/output-mappar
- Filter (som `formatDate`, `getSamling`)
- Collections (som `articles`, `samlingar`)
- Passthrough copies
- Build hooks

```javascript
module.exports = function (eleventyConfig) {
  // Kopiera assets direkt
  eleventyConfig.addPassthroughCopy('src/assets');

  // Lägg till filter
  eleventyConfig.addFilter('formatDate', (value) => {
    /* ... */
  });

  // Skapa collections
  eleventyConfig.addCollection('articles', (api) => {
    /* ... */
  });

  // Kör script innan bygge
  eleventyConfig.on('eleventy.before', async () => {
    await generateContentIndex();
  });

  return {
    dir: { input: 'src', output: 'site' }
  };
};
```

### netlify.toml

Konfiguration för Netlify-hosting:

```toml
[build]
  command = "npm run build"
  publish = "site"
  functions = "netlify/functions"

[functions]
  node_bundler = "esbuild"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

**Vad betyder detta?**

- `command` — Kommandot som bygger sajten
- `publish` — Mappen som ska publiceras
- `functions` — Var serverless functions finns
- `redirects` — URL-omskrivningar

### package.json

Projektets npm-konfiguration:

```json
{
  "name": "stodlinjer",
  "scripts": {
    "start": "npx @11ty/eleventy --serve",
    "build": "npx @11ty/eleventy"
  },
  "devDependencies": {
    "@11ty/eleventy": "^3.0.0"
  },
  "dependencies": {
    "markdown-it": "^14.0.0",
    "gray-matter": "^4.0.3",
    "fast-glob": "^3.3.0"
  }
}
```

### .gitignore

Filer som Git ska ignorera:

```
# Beroenden
node_modules/

# Byggd sajt
site/

# Genererad data
.chatdata/

# Miljövariabler
.env

# OS-filer
.DS_Store
Thumbs.db
```

### .env (lokal, ej i Git)

Miljövariabler för lokal utveckling:

```
OPENAI_API_KEY=sk-din-hemliga-nyckel-här
```

> ⚠️ Denna fil ska **aldrig** committas till Git!

---

## Output: site/ 🏗️

```
site/
├── 📁 artiklar/
│   ├── 📁 samtalsstod/
│   │   └── 📁 vad-sager-jag/
│   │       └── 📄 index.html
│   └── 📄 index.html
├── 📁 assets/
│   ├── 📁 css/
│   ├── 📁 js/
│   └── 📁 favicon/
├── 📁 chatdata/
│   └── 📄 content-index.json
├── 📄 index.html
├── 📄 kontakt/index.html
└── 📄 robots.txt
```

**Kom ihåg:** Denna mapp genereras automatiskt vid varje bygge. Redigera **aldrig** filer här — alla ändringar skrivs över!

---

## Visuell översikt 🗺️

Här är ett förenklat flödesschema över hur allt hänger ihop:

```
┌─────────────────────────────────────────────────────────────────┐
│                         KÄLLFILER                               │
├─────────────────────────────────────────────────────────────────┤
│  src/_data/*.json         →  Global data                        │
│  src/_includes/layouts/   →  Sidmallar                          │
│  src/_includes/partials/  →  Komponenter                        │
│  src/artiklar/**/*.md     →  Artikelinnehåll                    │
│  src/assets/**/*          →  CSS, JS, bilder                    │
│  src/*.njk                →  Enskilda sidor                     │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      ELEVENTY (bygge)                           │
│                                                                 │
│  1. Läser eleventy.config.js                                    │
│  2. Kör generate-content-index.js                               │
│  3. Samlar in all data                                          │
│  4. Processar Markdown → HTML                                   │
│  5. Applicerar layouts                                          │
│  6. Kopierar assets                                             │
│  7. Skriver output                                              │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                       FÄRDIG SAJT                               │
├─────────────────────────────────────────────────────────────────┤
│  site/                    →  Redo för publicering               │
│  site/index.html          →  Startsidan                         │
│  site/artiklar/**/*.html  →  Alla artiklar                      │
│  site/assets/**/*         →  Statiska filer                     │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        NETLIFY                                  │
├─────────────────────────────────────────────────────────────────┤
│  Hosting av site/                                               │
│  Kör netlify/functions/ som API                                 │
│  Hanterar miljövariabler                                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## Var gör jag vad? 🤔

### Lägga till en ny artikel

1. Skapa en ny `.md`-fil i rätt mapp under `src/artiklar/`
2. Följ namnkonventionen: `YYYY-MM-DD-url-slug.md`
3. Lägg till frontmatter med title, description, date, samling
4. Skriv innehållet i Markdown

### Ändra en stödlinje

1. Öppna `src/_data/supportLines.json`
2. Hitta rätt objekt och gör ändringen
3. Spara filen

### Ändra sajtens utseende

- **Layout/struktur** → `src/_includes/layouts/`
- **Header/footer** → `src/_includes/partials/`
- **CSS** → `src/assets/css/main.css`
- **Färger/typsnitt** → CSS-variabler i `main.css`

### Ändra startsidan

1. Öppna `src/index.njk`
2. Gör ändringar i HTML/Nunjucks
3. Spara filen

### Lägga till en ny samling

1. Lägg till samlingen i `src/_data/samlingar.json`
2. Skapa en ny mapp i `src/artiklar/`
3. (Valfritt) Skapa en samlingssida i `src/samlingar/`

---

## Sammanfattning 📝

| Mapp/Fil             | Syfte               | Redigera?     |
| -------------------- | ------------------- | ------------- |
| `src/`               | All källkod         | ✅ Ja         |
| `src/_data/`         | Global JSON-data    | ✅ Ja         |
| `src/_includes/`     | Mallar och partials | ✅ Ja         |
| `src/artiklar/`      | Artikelinnehåll     | ✅ Ja         |
| `src/assets/`        | CSS, JS, bilder     | ✅ Ja         |
| `site/`              | Byggd output        | ❌ Aldrig     |
| `node_modules/`      | npm-paket           | ❌ Aldrig     |
| `netlify/functions/` | Backend-kod         | ⚠️ Försiktigt |
| `eleventy.config.js` | Byggkonfiguration   | ⚠️ Försiktigt |

### Tumregler 👍

1. **Arbeta alltid i `src/`** — Det är där källfilerna finns
2. **Rör aldrig `site/`** — Den genereras automatiskt
3. **Rör aldrig `node_modules/`** — Den återskapas med `npm install`
4. **Lägg aldrig `.env` i Git** — Den innehåller hemligheter

---

Nu vet du var allt finns! Nästa guide tar dig igenom hur du får projektet att köra lokalt på din dator. 🚀

---

**Gå tillbaka till:** [JSON & data](05-json-data.md)
**eller gå vidare till:** [Kom igång](07-kom-igang.md)
