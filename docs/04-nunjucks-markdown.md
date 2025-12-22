# Nunjucks, Markdown & Frontmatter ✍️

Nu börjar vi närma oss det du faktiskt kommer arbeta med dagligen: att skriva innehåll och skapa mallar. Den här guiden täcker tre sammankopplade tekniker som tillsammans utgör grunden för hur innehåll skapas och presenteras i Stödlinjer.

- **Markdown** — För att skriva innehåll (artiklar, texter)
- **Frontmatter** — För att lägga till metadata (titel, datum, inställningar)
- **Nunjucks** — För att skapa mallar som bestämmer hur innehållet visas

Låt oss dyka in! 🏊

---

## Markdown 📝

### Vad är Markdown?

Markdown är ett enkelt sätt att formatera text utan att behöva skriva HTML-taggar. Det skapades 2004 av John Gruber med målet att vara läsbart även i sin råa form — till skillnad från HTML som snabbt blir svårläst.

Jämför själv:

**HTML:**

```html
<h1>Min rubrik</h1>
<p>Detta är ett stycke med <strong>fet text</strong> och <em>kursiv text</em>.</p>
<ul>
  <li>Första punkten</li>
  <li>Andra punkten</li>
</ul>
```

**Markdown:**

```markdown
# Min rubrik

Detta är ett stycke med **fet text** och _kursiv text_.

- Första punkten
- Andra punkten
```

Båda ger samma resultat, men Markdown är mycket lättare att skriva och läsa!

### Varför Markdown?

I Stödlinjer-projektet är alla artiklar skrivna i Markdown. Det finns flera fördelar:

- ✅ **Enkelt att lära sig** — Du kan grunderna på några minuter
- ✅ **Fokus på innehåll** — Du tänker på _vad_ du skriver, inte _hur_ det ska se ut
- ✅ **Läsbart som råtext** — Filen är begriplig även utan rendering
- ✅ **Versionskontroll** — Git hanterar textfiler utmärkt
- ✅ **Portabelt** — Kan konverteras till HTML, PDF, Word och mer

### Markdown-syntax: Det grundläggande

#### Rubriker

Använd `#` för rubriker. Fler `#` = lägre nivå.

```markdown
# Rubrik 1 (störst)

## Rubrik 2

### Rubrik 3

#### Rubrik 4

##### Rubrik 5

###### Rubrik 6 (minst)
```

> 💡 **Tips:** Använd bara en `# Rubrik 1` per artikel (det blir sidans titel). Börja sedan med `## Rubrik 2` för huvudsektioner.

#### Textstycken

Stycken separeras med en tom rad:

```markdown
Detta är första stycket. Det kan vara hur långt som helst
och fortsätta på flera rader.

Detta är andra stycket. Den tomma raden ovan skapar
ett nytt stycke i HTML-outputen.
```

Om du bara trycker Enter utan tom rad blir det samma stycke:

```markdown
Denna rad
och denna rad
blir ett enda stycke.
```

#### Fetstil och kursiv

```markdown
**Fet text** eller **också fet**

_Kursiv text_ eller _också kursiv_

**_Både fet och kursiv_** eller **_också båda_**
```

Resultat:

- **Fet text**
- _Kursiv text_
- **_Både fet och kursiv_**

#### Listor

**Punktlista** (oordnad):

```markdown
- Första punkten
- Andra punkten
  - Underpunkt (indrag med 2 mellanslag)
  - Ännu en underpunkt
- Tredje punkten
```

Du kan också använda `*` eller `+` istället för `-`.

**Numrerad lista** (ordnad):

```markdown
1. Första steget
2. Andra steget
3. Tredje steget
```

> 💡 **Tips:** Numren behöver inte vara i ordning — Markdown räknar om dem automatiskt. Många skriver `1.` på alla rader för enkelhet.

#### Länkar

```markdown
[Synlig text](https://example.com)

[Stödlinjer](https://stodlinjer.se)

[Intern länk till en annan sida](/artiklar/samtalsstod/)
```

#### Bilder

```markdown
![Alternativ text](sökväg/till/bild.jpg)

![En beskrivande text för skärmläsare](/assets/images/hero.jpg)
```

Den alternativa texten är viktig för tillgänglighet — den läses upp av skärmläsare och visas om bilden inte kan laddas.

#### Citat (blockquotes)

```markdown
> Detta är ett citat. Det kan vara flera rader långt
> och fortsätter så länge raderna börjar med >.
>
> En tom rad med > skapar ett nytt stycke inom citatet.
```

Resultat:

> Detta är ett citat. Det kan vara flera rader långt och fortsätter så länge raderna börjar med >.
>
> En tom rad med > skapar ett nytt stycke inom citatet.

#### Horisontell linje

```markdown
---
```

Eller `***` eller `___`. Skapar en horisontell avdelare.

---

#### Kod

**Inline-kod** (i löpande text):

```markdown
Använd `npm install` för att installera paket.
```

Resultat: Använd `npm install` för att installera paket.

**Kodblock** (flera rader):

````markdown
```javascript
function hello() {
  console.log('Hej världen!');
}
```
````

Språket efter de tre backtickarna (` ``` `) aktiverar syntaxmarkering.

#### Tabeller

```markdown
| Namn  | Ålder | Stad      |
| ----- | ----- | --------- |
| Anna  | 28    | Stockholm |
| Erik  | 35    | Göteborg  |
| Maria | 42    | Malmö     |
```

Resultat:

| Namn  | Ålder | Stad      |
| ----- | ----- | --------- |
| Anna  | 28    | Stockholm |
| Erik  | 35    | Göteborg  |
| Maria | 42    | Malmö     |

> 💡 **Tips:** Kolumnerna behöver inte vara perfekt justerade — det är bara för läsbarhet. Många texteditorer har plugins som auto-formaterar tabeller.

### Markdown i Stödlinjer

Alla artiklar i projektet ligger i `src/artiklar/` och dess undermappar. En typisk artikelfil ser ut så här:

```markdown
---
title: Vad säger jag när någon mår dåligt?
description: En guide för att stötta någon som har det svårt.
date: 2025-12-15
samling: samtalsstod
---

När någon berättar att de mår dåligt är det naturligt att
känna sig osäker på vad man ska säga. Den här artikeln ger
dig konkreta verktyg.

## Lyssna aktivt

Det viktigaste du kan göra är att **verkligen lyssna**...

## Undvik att ge råd direkt

Många gör misstaget att genast...
```

Toppen av filen (mellan `---`) är _frontmatter_ — mer om det snart!

---

## Frontmatter 📋

### Vad är frontmatter?

Frontmatter är ett block med metadata i början av en fil, inramat av tre streck (`---`). Det skrivs i YAML-format och innehåller information _om_ innehållet — titel, datum, beskrivning, inställningar och mer.

```markdown
---
title: Min artikel
description: En kort sammanfattning
date: 2025-12-15
layout: layouts/post.njk
tags: artikel
draft: false
---

Här börjar själva innehållet...
```

### Varför frontmatter?

Frontmatter låter dig separera _data_ från _innehåll_. Datan kan sedan användas i mallar för att:

- Visa titeln i `<title>`-taggen
- Generera meta-beskrivningar för SEO
- Sortera artiklar efter datum
- Filtrera innehåll baserat på taggar
- Visa/dölja utkast

### YAML-syntax

Frontmatter skrivs i YAML (YAML Ain't Markup Language). Här är de viktigaste reglerna:

#### Enkla värden

```yaml
---
title: Min titel
count: 42
published: true
---
```

- **Text** behöver vanligtvis inga citattecken
- **Nummer** skrivs utan citattecken
- **Boolean** skrivs som `true` eller `false`

#### När behövs citattecken?

Använd citattecken om texten innehåller specialtecken:

```yaml
---
title: 'Vad säger jag? En guide'
subtitle: 'Artikel: Del 1'
---
```

Kolon, frågetecken och vissa andra tecken kan annars tolkas som YAML-syntax.

#### Listor

```yaml
---
tags:
  - artikel
  - samtalsstod
  - psykisk-halsa
---
```

Eller på en rad:

```yaml
---
tags: [artikel, samtalsstod, psykisk-halsa]
---
```

#### Nästlade objekt

```yaml
---
author:
  name: Johanna Fagerås
  email: johanna@gmail.com
header:
  icon: fas fa-book
  label: Artiklar
---
```

Indrag (mellanslag, inte tab!) visar hierarki.

#### Längre text

För längre text kan du använda `|` eller `>`:

```yaml
---
description: |
  Detta är en längre beskrivning
  som sträcker sig över flera rader.
  Radbrytningar bevaras.
---
```

```yaml
---
description: >
  Detta är också en längre beskrivning
  men här slås raderna ihop till
  ett enda stycke.
---
```

### ⚠️ Vanliga YAML-misstag

YAML är känsligt för formatering. Här är de vanligaste felen:

#### Fel indrag

```yaml
# ❌ FEL — blandar mellanslag och tabs
---
header:
	icon: fas fa-book    # Tab-tecken!
  label: Artiklar      # Mellanslag
---
```

```yaml
# ✅ RÄTT — konsekvent med mellanslag
---
header:
  icon: fas fa-book
  label: Artiklar
---
```

> 💡 **Tips:** Konfigurera din editor att alltid använda mellanslag istället för tabs. I VS Code: "Tab Size: 2" och "Insert Spaces: true".

#### Glömt citattecken

```yaml
# ❌ FEL — kolon i text utan citattecken
---
title: Frågor & svar: En guide
---
```

```yaml
# ✅ RÄTT — citattecken runt text med specialtecken
---
title: 'Frågor & svar: En guide'
---
```

#### Fel boolean-värde

```yaml
# ❌ FEL — "yes" är inte samma som true
---
draft: yes
---
```

```yaml
# ✅ RÄTT — använd true/false
---
draft: true
---
```

### Frontmatter i Stödlinjer

Här är de vanligaste frontmatter-fälten som används i projektets artiklar:

| Fält          | Obligatoriskt | Beskrivning                                     |
| ------------- | ------------- | ----------------------------------------------- |
| `title`       | ✅ Ja         | Artikelns titel                                 |
| `description` | ✅ Ja         | Kort beskrivning (för SEO och listningar)       |
| `date`        | ✅ Ja         | Publiceringsdatum (YYYY-MM-DD)                  |
| `samling`     | ✅ Ja         | Vilken samling artikeln tillhör                 |
| `tags`        | Nej           | Extra taggar för kategorisering                 |
| `draft`       | Nej           | `true` för att dölja artikeln                   |
| `layout`      | Nej           | Annan layout (standard sätts via artiklar.json) |

Exempel på en komplett artikel:

```markdown
---
title: Vad säger jag när någon mår dåligt?
description: En guide för att stötta någon som har det svårt genom aktivt lyssnande och empatisk närvaro.
date: 2025-12-15
samling: samtalsstod
tags:
  - kommunikation
  - stöd
---

Artikelns innehåll börjar här...
```

---

## Nunjucks 🎨

### Vad är Nunjucks?

Nunjucks är ett _mallspråk_ (templating language) skapat av Mozilla. Det låter dig skriva HTML-mallar med dynamiskt innehåll — du kan infoga variabler, skapa loopar, använda villkor och mycket mer.

Filerna har ändelsen `.njk` och ser ut som HTML med speciella "taggar" för dynamiskt innehåll.

### Varför mallspråk?

Utan mallspråk skulle du behöva upprepa samma HTML-kod på varje sida — header, footer, navigation, etc. Med Nunjucks skriver du den koden en gång och återanvänder den överallt.

### Nunjucks-syntax: Grunderna

Det finns tre typer av speciella taggar i Nunjucks:

| Syntax  | Användning              | Exempel                 |
| ------- | ----------------------- | ----------------------- |
| `{{ }}` | Skriva ut värden        | `{{ title }}`           |
| `{% %}` | Logik och kontrollflöde | `{% if %}`, `{% for %}` |
| `{# #}` | Kommentarer             | `{# Detta syns inte #}` |

### Skriva ut värden med `{{ }}`

Det vanligaste: infoga ett värde i HTML:en.

```njk
<h1>{{ title }}</h1>
<p>Publicerad: {{ date }}</p>
```

Om `title` är "Min artikel" och `date` är "2025-12-15", blir resultatet:

```html
<h1>Min artikel</h1>
<p>Publicerad: 2025-12-15</p>
```

#### Nästlade värden

Om datan är ett objekt använder du punkt-notation:

```njk
<p>Författare: {{ author.name }}</p>
<p>Email: {{ author.email }}</p>
```

#### Filter

Filter transformerar värden. De appliceras med pipe-tecknet `|`:

```njk
{{ title | upper }}          {# GÖR TEXTEN VERSAL #}
{{ date | formatDate }}      {# Formaterar datum snyggt #}
{{ content | safe }}         {# Tillåter HTML i innehållet #}
{{ items | length }}         {# Antal element i en lista #}
```

Du kan kedja flera filter:

```njk
{{ title | trim | upper }}
```

##### Viktigt: `safe`-filtret

Som standard _escapar_ Nunjucks HTML-tecken för säkerhet. Det betyder att `<p>Hej</p>` visas som text, inte som en paragraf.

När du vill att HTML ska renderas (som artikelinnehåll), använd `| safe`:

```njk
{{ content | safe }}
```

⚠️ Använd bara `safe` på innehåll du litar på — aldrig på användarinput!

### Villkor med `{% if %}`

Visa olika saker beroende på data:

```njk
{% if description %}
  <meta name="description" content="{{ description }}">
{% endif %}
```

Med `else`:

```njk
{% if draft %}
  <span class="badge">Utkast</span>
{% else %}
  <span class="badge">Publicerad</span>
{% endif %}
```

Med `elif` (else if):

```njk
{% if status == "draft" %}
  <span>Utkast</span>
{% elif status == "review" %}
  <span>Under granskning</span>
{% else %}
  <span>Publicerad</span>
{% endif %}
```

#### Jämförelseoperatorer

| Operator   | Betydelse                         |
| ---------- | --------------------------------- |
| `==`       | Lika med                          |
| `!=`       | Inte lika med                     |
| `<`, `>`   | Mindre/större än                  |
| `<=`, `>=` | Mindre/större än eller lika       |
| `and`      | Båda villkoren måste vara sanna   |
| `or`       | Minst ett villkor måste vara sant |
| `not`      | Negerar villkoret                 |

Exempel:

```njk
{% if age >= 18 and hasLicense %}
  <p>Du får köra bil.</p>
{% endif %}

{% if not draft %}
  {# Visa bara om draft är false/undefined #}
{% endif %}
```

### Loopar med `{% for %}`

Gå igenom en lista och upprepa HTML för varje element:

```njk
<ul>
{% for article in collections.articles %}
  <li>
    <a href="{{ article.url }}">{{ article.data.title }}</a>
  </li>
{% endfor %}
</ul>
```

#### Loop-variabler

Inuti en loop finns speciella variabler:

```njk
{% for item in items %}
  {{ loop.index }}      {# 1, 2, 3, ... (börjar på 1) #}
  {{ loop.index0 }}     {# 0, 1, 2, ... (börjar på 0) #}
  {{ loop.first }}      {# true för första elementet #}
  {{ loop.last }}       {# true för sista elementet #}
  {{ loop.length }}     {# Totalt antal element #}
{% endfor %}
```

Praktiskt exempel — lägg till komma mellan element, men inte efter sista:

```njk
{% for tag in tags %}
  {{ tag }}{% if not loop.last %}, {% endif %}
{% endfor %}
```

#### Tom lista

Hantera fallet när listan är tom:

```njk
{% for article in articles %}
  <p>{{ article.title }}</p>
{% else %}
  <p>Inga artiklar hittades.</p>
{% endfor %}
```

### Include — Infoga andra filer

Med `{% include %}` kan du infoga innehållet från en annan fil:

```njk
{% include "partials/header.njk" %}

<main>
  {{ content | safe }}
</main>

{% include "partials/footer.njk" %}
```

Filerna letas efter i `_includes/`-mappen som standard.

#### Skicka med data till en include

```njk
{% include "partials/card.njk" %}
```

Alla variabler i nuvarande scope är tillgängliga i den inkluderade filen.

### Layouts och block — Template inheritance

En av Nunjucks mest kraftfulla funktioner! Layouts låter dig definiera en "skelett"-struktur som andra mallar fyller i.

#### Base-layouten

```njk
{# _includes/layouts/base.njk #}
<!DOCTYPE html>
<html lang="sv">
<head>
  <title>{% block title %}{{ title }}{% endblock %} | Stödlinjer</title>
  {% block head %}{% endblock %}
</head>
<body>
  {% include "partials/header.njk" %}

  <main>
    {% block content %}{% endblock %}
  </main>

  {% include "partials/footer.njk" %}

  {% block scripts %}{% endblock %}
</body>
</html>
```

`{% block %}` definierar utbytbara sektioner.

#### En child-layout

```njk
{# _includes/layouts/post.njk #}
---
layout: layouts/base.njk
---

{% block content %}
  <article>
    <h1>{{ title }}</h1>
    <time>{{ date | formatDate }}</time>
    {{ content | safe }}
  </article>
{% endblock %}

{% block scripts %}
  <script src="/assets/js/article.js"></script>
{% endblock %}
```

Denna layout _ärver_ från `base.njk` och fyller i blocken `content` och `scripts`.

#### Kedjan i praktiken

```
base.njk              Definierar grundstrukturen
    ↑
post.njk              Fyller i content-blocket
    ↑
min-artikel.md        Fyller post.njk med artikeltext
```

### Set — Skapa variabler

Du kan skapa egna variabler i mallar:

```njk
{% set greeting = "Hej" %}
{% set fullName = firstName + " " + lastName %}

<p>{{ greeting }}, {{ fullName }}!</p>
```

Användbart för att förenkla komplexa uttryck eller återanvända beräknade värden.

### Macro — Återanvändbara funktioner

Macros är som funktioner — återanvändbar kod med parametrar:

```njk
{# Definiera macrot #}
{% macro button(text, url, style="primary") %}
  <a href="{{ url }}" class="btn btn-{{ style }}">
    {{ text }}
  </a>
{% endmacro %}

{# Använd macrot #}
{{ button("Läs mer", "/artiklar/") }}
{{ button("Ladda ner", "/download/", "secondary") }}
```

För att använda macros från en annan fil:

```njk
{% from "macros/buttons.njk" import button %}

{{ button("Klicka här", "/") }}
```

### Kommentarer

Kommentarer i Nunjucks syns inte i den genererade HTML:en:

```njk
{# Detta är en kommentar som inte renderas #}

{#
   Kommentarer kan också
   sträcka sig över
   flera rader
#}
```

---

## Allt tillsammans: En komplett artikel 🎯

Nu ser vi hur allt hänger ihop i praktiken.

### 1. Artikelfilen (Markdown + Frontmatter)

`src/artiklar/samtalsstod/2025-12-15-lyssna-aktivt.md`:

```markdown
---
title: Konsten att lyssna aktivt
description: Aktivt lyssnande är en av de viktigaste färdigheterna för att stötta någon som mår dåligt. Lär dig tekniken här.
date: 2025-12-15
samling: samtalsstod
tags:
  - kommunikation
  - stöd
---

Att verkligen lyssna är svårare än det låter. De flesta av oss
lyssnar för att svara — inte för att förstå.

## Vad är aktivt lyssnande?

Aktivt lyssnande handlar om att...

## Tre nycklar

1. **Var närvarande** — Lägg bort telefonen
2. **Ställ öppna frågor** — "Hur känns det?"
3. **Reflektera tillbaka** — "Det låter som att..."
```

### 2. Directory data (gäller alla artiklar)

`src/artiklar/artiklar.json`:

```json
{
  "layout": "layouts/post.njk",
  "tags": ["artikel"],
  "permalink": "/{{ page.filePathStem }}/"
}
```

### 3. Artikel-layouten (Nunjucks)

`src/_includes/layouts/post.njk`:

```njk
---
layout: layouts/base.njk
---

<article class="article">
  <header class="article-header">
    <h1>{{ title }}</h1>

    {% if description %}
      <p class="lead">{{ description }}</p>
    {% endif %}

    <div class="meta">
      <time datetime="{{ date | isoDate }}">
        {{ date | formatDate }}
      </time>

      {% if samling %}
        {% set samlingData = samling | getSamling %}
        <span class="category">{{ samlingData.title }}</span>
      {% endif %}
    </div>
  </header>

  <div class="article-content">
    {{ content | safe }}
  </div>

  {% if tags %}
    <footer class="article-footer">
      <div class="tags">
        {% for tag in tags %}
          <span class="tag">{{ tag }}</span>
        {% endfor %}
      </div>
    </footer>
  {% endif %}
</article>
```

### 4. Base-layouten (Nunjucks)

`src/_includes/layouts/base.njk`:

```njk
<!DOCTYPE html>
<html lang="sv">
<head>
  {% include "partials/head.njk" %}
</head>
<body>
  {% include "partials/header.njk" %}

  <main>
    {{ content | safe }}
  </main>

  {% include "partials/footer.njk" %}
</body>
</html>
```

### 5. Resultatet

Allt detta kombineras till en färdig HTML-sida i `site/artiklar/samtalsstod/lyssna-aktivt/index.html`.

---

## Tips och best practices 💡

### Markdown

- ✅ Använd rubriker hierarkiskt (h1 → h2 → h3)
- ✅ Skriv beskrivande länktexter ("Läs guiden", inte "Klicka här")
- ✅ Lämna tomma rader före och efter listor och kodblock
- ❌ Hoppa inte över rubriknivåer (h1 → h3)
- ❌ Använd inte fetstil för rubriker — använd #

### Frontmatter

- ✅ Använd alltid ISO-format för datum: `2025-12-15`
- ✅ Håll description under 160 tecken (för SEO)
- ✅ Var konsekvent med hur du namnger fält
- ❌ Glöm inte citattecken runt text med specialtecken
- ❌ Blanda inte tabs och mellanslag

### Nunjucks

- ✅ Använd `{% include %}` för återkommande element
- ✅ Håll mallar fokuserade — en uppgift per fil
- ✅ Använd `{{ value | safe }}` endast på betrott innehåll
- ✅ Kommentera komplex logik
- ❌ Lägg inte för mycket logik i mallar — flytta till filter eller JavaScript

---

## Sammanfattning 📝

| Teknik          | Fil-ändelse  | Användning             |
| --------------- | ------------ | ---------------------- |
| **Markdown**    | `.md`        | Skriva artikelinnehåll |
| **Frontmatter** | (i .md/.njk) | Metadata om innehållet |
| **Nunjucks**    | `.njk`       | Mallar och layouts     |

### Kom ihåg 🌟

1. **Markdown** för innehåll — enkelt och läsbart
2. **Frontmatter** för data — title, date, description, etc.
3. **Nunjucks** för presentation — hur datan visas
4. **`{{ }}` skriver ut**, **`{% %}` är logik**, **`{# #}` är kommentarer**
5. **`| safe`** behövs för att rendera HTML i content

---

Nästa guide handlar om hur du strukturerar och använder JSON-data i projektet! 🗃️

---

**Gå tillbaka till:** [Eleventy](03-eleventy.md)
**eller gå vidare till:** [JSON & data](05-json-data.md)
