# Eleventy 🏗️

Nu när du förstår grunderna i Node.js och npm är det dags att dyka in i hjärtat av projektet: **Eleventy**. Det här är verktyget som faktiskt omvandlar alla dina källfiler till en färdig webbplats.

Den här guiden förklarar vad Eleventy är, hur det fungerar och hur det är konfigurerat i Stödlinjer-projektet.

---

## Vad är Eleventy? 🤔

### En statisk sidgenerator

Eleventy (ofta skrivet som **11ty**) är en _statisk sidgenerator_ — ett verktyg som tar enkla källfiler och omvandlar dem till en komplett webbplats med HTML-filer.

Men vänta, vad betyder egentligen "statisk"?

### Statiska vs dynamiska webbplatser

**Dynamisk webbplats** (t.ex. WordPress, Facebook):

- En server bygger varje sida _när någon besöker den_
- Sidan kan se olika ut för olika besökare
- Kräver en databas och server som ständigt är igång
- Mer komplex, mer som kan gå fel

**Statisk webbplats** (t.ex. Stödlinjer):

- Alla sidor byggs _i förväg_, innan sajten publiceras
- Samma HTML-filer serveras till alla besökare
- Kräver bara enkel filhosting
- Snabbare, säkrare, enklare

### En liknelse 🍕

Tänk dig två pizzerior:

**Pizzeria Dynamisk** bakar varje pizza från grunden när du beställer. Det tar tid, kräver kockar som jobbar konstant, och ibland går saker fel.

**Pizzeria Statisk** bakar alla pizzor på morgonen och lägger dem i värmeskåpet. När du beställer får du din pizza direkt — snabbt och pålitligt. Nackdelen är att du inte kan få specialbeställningar.

Eleventy är som Pizzeria Statisk: den "bakar" alla sidor i förväg så att de kan serveras blixtsnabbt.

### Varför Eleventy?

Det finns många statiska sidgeneratorer: Jekyll, Hugo, Gatsby, Next.js och fler. Eleventy utmärker sig genom att vara:

- **Enkelt** — Låg inlärningströskel, minimalt med magi
- **Flexibelt** — Stödjer många mallspråk, inga påtvingade strukturer
- **Snabbt** — Bygger sajter på några sekunder
- **JavaScript-baserat** — Samma språk som webben i övrigt

---

## Hur Eleventy fungerar 🔄

### Grundflödet

```
┌─────────────────┐         ┌─────────────┐         ┌──────────────────┐
│   KÄLLFILER     │         │   ELEVENTY  │         │  FÄRDIG SAJT     │
│                 │         │             │         │                  │
│  src/           │  ────►  │   Bygger    │  ────►  │  site/           │
│  ├── artiklar/  │         │   & slår    │         │  ├── artiklar/   │
│  ├── _data/     │         │   ihop      │         │  ├── index.html  │
│  └── _includes/ │         │             │         │  └── assets/     │
└─────────────────┘         └─────────────┘         └──────────────────┘
     (input)                   (process)                  (output)
```

1. **Input (src/)** — Dina källfiler: Markdown-artiklar, Nunjucks-mallar, JSON-data, CSS, JavaScript, bilder
2. **Process** — Eleventy läser allt, slår ihop innehåll med mallar, och genererar HTML
3. **Output (site/)** — Den färdiga sajten: ren HTML, CSS och JavaScript som kan läggas på vilken webbserver som helst

### Vad händer under bygget?

När du kör `npm run build` går Eleventy igenom ungefär dessa steg:

1. **Läser konfigurationen** (`eleventy.config.js`)
2. **Samlar in data** från `_data/`-mappen
3. **Hittar alla innehållsfiler** (Markdown, Nunjucks, etc.)
4. **Läser frontmatter** från varje fil
5. **Slår ihop data** från alla källor (data cascade)
6. **Processar innehåll** (Markdown → HTML)
7. **Applicerar layouts** (wrappar innehåll i mallar)
8. **Skriver ut filer** till output-mappen

Allt detta händer på några sekunder!

---

## Input och Output 📁

### Input-mappen (src/)

I Stödlinjer-projektet finns alla källfiler i `src/`-mappen. Detta är vad du redigerar när du arbetar med sajten.

```
src/
├── _data/              # Global data (JSON-filer)
├── _includes/          # Mallar och partials
│   ├── layouts/        # Sidlayouter
│   └── partials/       # Återanvändbara delar
├── artiklar/           # Alla artiklar (Markdown)
├── assets/             # CSS, JS, bilder, typsnitt
└── index.njk           # Startsidan
```

### Output-mappen (site/)

Den färdiga sajten hamnar i `site/`-mappen. Denna genereras automatiskt och ska **aldrig redigeras manuellt** — alla ändringar du gör där skrivs över vid nästa bygge.

```
site/
├── artiklar/
│   └── [alla artiklar som HTML]
├── assets/
│   └── [kopierade CSS, JS, bilder]
└── index.html
```

### Mappar som börjar med \_

Du kanske märker att vissa mappar börjar med understreck: `_data`, `_includes`. Detta är en Eleventy-konvention som betyder att dessa mappar är "speciella" och inte ska generera egna sidor.

- **\_data/** — Innehåller data som blir tillgänglig i alla mallar
- **\_includes/** — Innehåller mallar och partials som kan inkluderas i andra filer

---

## Konfigurationsfilen: eleventy.config.js ⚙️

Hjärtat i varje Eleventy-projekt är konfigurationsfilen `eleventy.config.js`. Här definierar du hur Eleventy ska bete sig.

Låt oss gå igenom Stödlinjer-projektets konfiguration bit för bit:

### Grundstrukturen

```javascript
module.exports = function (eleventyConfig) {
  // All konfiguration här inne

  return {
    dir: {
      input: 'src',
      output: 'site'
    }
  };
};
```

Filen exporterar en funktion som tar emot `eleventyConfig` — ett objekt med metoder för att konfigurera Eleventy. I slutet returnerar funktionen ett objekt med grundinställningar.

### Definiera input och output

```javascript
return {
  dir: {
    input: 'src', // Källfiler finns i src/
    output: 'site' // Byggd sajt hamnar i site/
  },
  htmlTemplateEngine: 'njk', // Använd Nunjucks för HTML
  markdownTemplateEngine: 'njk' // Använd Nunjucks i Markdown
};
```

### Passthrough Copy — Kopiera filer rakt av

Vissa filer ska inte processas, bara kopieras till output-mappen som de är. Det gäller till exempel bilder, CSS och JavaScript.

```javascript
eleventyConfig.addPassthroughCopy('src/assets');
```

Detta kopierar hela `src/assets/`-mappen till `site/assets/`. Eleventy rör inte innehållet — det kopieras exakt som det är.

Du kan också kopiera och byta namn samtidigt:

```javascript
eleventyConfig.addPassthroughCopy({ 'src/_data': 'data' });
```

Detta kopierar innehållet i `src/_data/` till `site/data/`.

### Filter — Transformera data i mallar

Filter är funktioner som omvandlar data. Du skapar dem i konfigurationen och använder dem sedan i mallar.

```javascript
eleventyConfig.addFilter('formatDate', (value) => {
  const date = new Date(value);
  return new Intl.DateTimeFormat('sv-SE', {
    dateStyle: 'long'
  }).format(date);
});
```

I en mall använder du sedan filtret med pipe-syntax:

```njk
{{ article.date | formatDate }}
<!-- Resultat: "15 december 2025" -->
```

Stödlinjer-projektet har flera filter:

| Filter        | Vad det gör                 | Exempel                           |
| ------------- | --------------------------- | --------------------------------- |
| `formatDate`  | Formaterar datum på svenska | `2025-12-15` → `15 december 2025` |
| `isoDate`     | Datum i ISO-format          | `2025-12-15` → `2025-12-15`       |
| `readingTime` | Beräknar lästid             | `"lång text..."` → `5` (minuter)  |
| `json`        | Omvandlar till JSON         | objekt → `{"key": "value"}`       |
| `getSamling`  | Hämtar samling från slug    | `"fakta-myter"` → samlingsobjekt  |

### Collections — Gruppera innehåll

Collections är grupper av relaterat innehåll. Du kan skapa dem baserat på taggar eller med egen logik.

```javascript
eleventyConfig.addCollection('articles', (collectionApi) => {
  return collectionApi
    .getFilteredByTag('artikel') // Alla med taggen "artikel"
    .filter((item) => !item.data.draft) // Exkludera utkast
    .sort((a, b) => b.date - a.date); // Sortera nyast först
});
```

I mallar kan du sedan loopa över collectionen:

```njk
{% for article in collections.articles %}
  <h2>{{ article.data.title }}</h2>
{% endfor %}
```

### Global Data

Du kan lägga till data som är tillgänglig i alla mallar:

```javascript
eleventyConfig.addGlobalData('baseUrl', '/stodlinjer');
```

Nu kan alla mallar använda `{{ baseUrl }}`.

### Events — Köra kod vid specifika tillfällen

Du kan köra egen kod vid olika punkter i byggprocessen:

```javascript
eleventyConfig.on('eleventy.before', async () => {
  // Körs innan bygget startar
  await generateContentIndex();
});

eleventyConfig.on('eleventy.after', async () => {
  // Körs efter att bygget är klart
});
```

I Stödlinjer körs `generateContentIndex()` innan varje bygge för att generera data till chatboten.

---

## Hur innehåll blir HTML 📝

Låt oss följa en artikel genom hela processen för att se hur Eleventy omvandlar den till HTML.

### Steg 1: Markdown-filen

Du har en artikel i `src/artiklar/samtalsstod/vad-sager-jag.md`:

```markdown
---
title: Vad säger jag när någon mår dåligt?
description: En guide för att stötta någon som har det svårt.
date: 2025-12-15
layout: layouts/post.njk
samling: samtalsstod
tags: artikel
---

När någon berättar att de mår dåligt är det naturligt
att känna sig osäker på vad man ska säga...
```

### Steg 2: Frontmatter läses

Eleventy läser YAML-blocket mellan `---` och skapar ett dataobjekt:

```javascript
{
  title: "Vad säger jag när någon mår dåligt?",
  description: "En guide för att stötta någon som har det svårt.",
  date: "2025-12-15",
  layout: "layouts/post.njk",
  samling: "samtalsstod",
  tags: "artikel"
}
```

### Steg 3: Markdown blir HTML

Innehållet under frontmatter processas och blir HTML:

```html
<p>
  När någon berättar att de mår dåligt är det naturligt att känna sig osäker på vad man ska säga...
</p>
```

### Steg 4: Layout appliceras

Eftersom frontmatter säger `layout: layouts/post.njk` läser Eleventy den filen och placerar innehållet där `{{ content | safe }}` finns:

```njk
{# src/_includes/layouts/post.njk #}
<!DOCTYPE html>
<html>
<head>
  <title>{{ title }}</title>
</head>
<body>
  <h1>{{ title }}</h1>
  <p>{{ description }}</p>
  {{ content | safe }}
</body>
</html>
```

### Steg 5: Färdig HTML

Eleventy kombinerar allt och skriver ut filen till `site/artiklar/samtalsstod/vad-sager-jag/index.html`:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Vad säger jag när någon mår dåligt?</title>
  </head>
  <body>
    <h1>Vad säger jag när någon mår dåligt?</h1>
    <p>En guide för att stötta någon som har det svårt.</p>
    <p>
      När någon berättar att de mår dåligt är det naturligt att känna sig osäker på vad man ska
      säga...
    </p>
  </body>
</html>
```

### Permalinks — Bestämma URL:en

Som standard skapar Eleventy URL:er baserat på filens sökväg. Men du kan styra detta med `permalink` i frontmatter:

```yaml
---
permalink: /om-oss/
---
```

I Stödlinjer används en permalink-mall i `src/artiklar/artiklar.json` som gäller alla artiklar:

```json
{
  "permalink": "/{{ page.filePathStem }}/"
}
```

`page.filePathStem` är filens sökväg utan filändelse. Eleventy tar också bort datum-prefix automatiskt, så:

- Fil: `src/artiklar/samtalsstod/2025-12-15-min-artikel.md`
- URL: `/artiklar/samtalsstod/min-artikel/`

---

## Data Cascade — Varifrån kommer datan? 🌊

En av Eleventys mest kraftfulla funktioner är **data cascade** — systemet för hur data flödar och slås samman från olika källor.

### Datakällor (i prioritetsordning)

Data kan komma från många ställen. Här är de i ordning från **högst** till **lägst** prioritet:

1. **Frontmatter** — Data i filen själv
2. **Template Data Files** — En JSON-fil med samma namn som mallen
3. **Directory Data Files** — JSON-fil som gäller hela mappen
4. **Global Data** — Filer i `_data/`-mappen
5. **Computed Data** — Data som beräknas i konfigurationen

Om samma variabel definieras på flera ställen "vinner" källan med högst prioritet.

### Exempel på data cascade

Låt säga att du har:

**src/\_data/site.json** (global data):

```json
{
  "author": "Stödlinjer-teamet"
}
```

**src/artiklar/artiklar.json** (directory data):

```json
{
  "author": "Artikelförfattare",
  "layout": "layouts/post.njk"
}
```

**src/artiklar/min-artikel.md** (frontmatter):

```yaml
---
title: Min artikel
author: Johanna Fagerås
---
```

Resultatet för `min-artikel.md`:

- `title` = "Min artikel" (från frontmatter)
- `author` = "Johanna Fagerås" (frontmatter vinner över directory data)
- `layout` = "layouts/post.njk" (från directory data)

Men för en _annan_ artikel utan `author` i frontmatter:

- `author` = "Artikelförfattare" (från directory data)

### Directory Data Files — Smart standardisering

En av de mest användbara funktionerna! Om du skapar en JSON-fil med samma namn som en mapp gäller dess innehåll för _alla_ filer i mappen.

I Stödlinjer finns `src/artiklar/artiklar.json`:

```json
{
  "layout": "layouts/post.njk",
  "tags": ["artikel"]
}
```

Nu får **alla** Markdown-filer i `src/artiklar/` automatiskt:

- Layouten `layouts/post.njk`
- Taggen `artikel`

Du slipper upprepa detta i varje fils frontmatter!

---

## Utvecklingsservern 🖥️

När du kör `npm start` startar Eleventy en lokal utvecklingsserver. Detta ger dig flera fördelar:

### Hot Reload

Servern övervakar dina filer och bygger automatiskt om sajten när du sparar ändringar. Webbläsaren uppdateras också automatiskt — du slipper trycka F5!

### Lokal testning

Du kan se exakt hur sajten kommer se ut innan du publicerar den. Adressen är vanligtvis `http://localhost:8080`.

### Snabb feedback

Eftersom bygget bara tar några sekunder ser du resultatet av dina ändringar nästan omedelbart.

### Vad visas i terminalen?

```
[11ty] Writing site/index.html from src/index.njk
[11ty] Writing site/artiklar/min-artikel/index.html from src/artiklar/min-artikel.md
[11ty] Wrote 42 files in 0.58 seconds
[11ty] Watching…
[11ty] Server at http://localhost:8080/
```

Du ser:

- Vilka filer som genereras
- Hur lång tid bygget tog
- Att servern nu "bevakar" filer för ändringar
- Adressen till den lokala sajten

---

## Vanliga Eleventy-mönster 🧩

### Layout-kedja

Layouts kan ärva från andra layouts:

```
base.njk          ← Grundläggande HTML-struktur
    ↑
page.njk          ← Lägger till sidspecifik styling
    ↑
post.njk          ← Lägger till artikelspecifika element
```

I praktiken:

```njk
{# layouts/post.njk #}
---
layout: layouts/base.njk
---
<article>
  <h1>{{ title }}</h1>
  {{ content | safe }}
</article>
```

### Inkludera partials

Återanvändbara delar läggs i `_includes/partials/`:

```njk
{% include "partials/header.njk" %}
{% include "partials/footer.njk" %}
```

### Loopa över collections

```njk
<ul>
{% for article in collections.articles %}
  <li>
    <a href="{{ article.url }}">{{ article.data.title }}</a>
  </li>
{% endfor %}
</ul>
```

### Villkorlig rendering

```njk
{% if description %}
  <meta name="description" content="{{ description }}">
{% endif %}
```

---

## Felsökning och tips 🔧

### Bygget misslyckas

Läs felmeddelandet noggrant! Eleventy är bra på att berätta vad som är fel och i vilken fil. Vanliga orsaker:

- **Syntax-fel i frontmatter** — Kontrollera YAML-syntax (indrag!)
- **Saknad layout** — Finns filen som `layout` pekar på?
- **Nunjucks-fel** — Omatchade `{% %}` eller `{{ }}`

### Ändringar syns inte

1. Kontrollera att utvecklingsservern fortfarande körs
2. Testa en "hard refresh" i webbläsaren (Ctrl+Shift+R)
3. Kolla att du redigerar rätt fil (src/, inte site/)
4. Stoppa servern och kör `npm start` igen

### Se vad Eleventy har tillgång till

Du kan dumpa all data för felsökning:

```njk
<pre>{{ collections.articles | json }}</pre>
```

Eller i utvecklingsläge:

```njk
{% debug %}
```

### Prestandaproblem

Om bygget är långsamt:

- Undvik tunga operationer i filter
- Använd `pagination` för stora mängder sidor
- Kolla om något filter körs i onödan

---

## Sammanfattning 📝

| Koncept                | Förklaring                                              |
| ---------------------- | ------------------------------------------------------- |
| **Eleventy**           | Statisk sidgenerator som bygger HTML från källfiler     |
| **Input/Output**       | `src/` innehåller källfiler, `site/` den färdiga sajten |
| **eleventy.config.js** | Konfigurationsfil som styr Eleventys beteende           |
| **Passthrough Copy**   | Kopierar filer utan att processa dem                    |
| **Filter**             | Funktioner som transformerar data i mallar              |
| **Collections**        | Grupper av relaterat innehåll                           |
| **Data Cascade**       | System för hur data slås samman från olika källor       |
| **Layout**             | Mall som wrappar innehåll                               |
| **Permalink**          | Bestämmer URL:en för en sida                            |

### Det viktigaste att komma ihåg 🌟

1. **Redigera i src/, aldrig i site/** — Output-mappen skrivs över vid varje bygge
2. **Data cascade är din vän** — Använd directory data files för att undvika upprepning
3. **Kolla frontmatter först** — De flesta fel börjar där
4. **Använd utvecklingsservern** — Hot reload sparar massor av tid

---

Nästa steg är att lära dig mallspråket Nunjucks och hur du skriver innehåll i Markdown! ✍️

---

**Gå tillbaka till:** [Node.js & npm](02-node-npm.md)
**eller gå vidare till:** [Nunjucks, Markdown & Frontmatter](04-nunjucks-markdown.md)
