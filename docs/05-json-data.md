# JSON & Data 🗃️

Data är blodet som flyter genom Stödlinjer-projektet. Stödlinjer, kontaktinformation, samlingar, konfiguration — allt lagras som strukturerad data som sedan används i mallar för att generera sidor.

Den här guiden förklarar JSON-formatet, hur Eleventy hanterar data, och hur du arbetar med data i Stödlinjer-projektet.

---

## Vad är JSON? 🤔

### JavaScript Object Notation

JSON (uttalas "jay-son" eller "jason") står för **JavaScript Object Notation**. Det är ett textformat för att lagra och överföra strukturerad data. JSON är:

- **Läsbart för människor** — Du kan öppna en JSON-fil och förstå innehållet
- **Läsbart för datorer** — Enkelt att tolka programmatiskt
- **Språkoberoende** — Fungerar med alla programmeringsspråk, inte bara JavaScript
- **Lätt** — Minimal syntax, kompakta filer

JSON har blivit internets standardformat för dataöverföring. API:er, konfigurationsfiler, databaser — JSON finns överallt.

### En liknelse 📦

Tänk dig att du ska flytta och packar kartonger. Du _kan_ slänga allt huller om buller i lådorna, men det blir kaos att packa upp. Istället organiserar du: kökssaker i en låda, böcker i en annan, märker varje låda med innehållet.

JSON är som välorganiserade, märkta flyttkartonger för data. Allt har sin plats, och det är lätt att hitta det du söker.

---

## JSON-syntax 📝

### Grundregler

JSON bygger på två strukturer:

1. **Objekt** — En samling namn/värde-par (som en uppslagslista)
2. **Array** — En ordnad lista med värden

### Objekt `{ }`

Ett objekt omges av klammerparenteser och innehåller "nycklar" (namn) kopplade till värden:

```json
{
  "name": "Självmordslinjen",
  "phone": "90101",
  "available": "Dygnet runt",
  "isActive": true
}
```

**Viktiga regler för objekt:**

- Nycklar _måste_ vara strängar med dubbla citattecken
- Nyckel och värde separeras med kolon `:`
- Par separeras med komma `,`
- Inget komma efter sista paret!

### Array `[ ]`

En array omges av hakparenteser och innehåller en lista med värden:

```json
["Stockholm", "Göteborg", "Malmö", "Uppsala"]
```

```json
[1, 2, 3, 4, 5]
```

```json
[true, false, true]
```

Arrayer kan innehålla vilken typ av värden som helst, inklusive blandade typer (även om det sällan är god praxis).

### Datatyper i JSON

JSON stödjer sex datatyper:

| Typ         | Exempel              | Beskrivning                         |
| ----------- | -------------------- | ----------------------------------- |
| **String**  | `"Hej världen"`      | Text, alltid med dubbla citattecken |
| **Number**  | `42`, `3.14`, `-17`  | Heltal eller decimaltal             |
| **Boolean** | `true`, `false`      | Sant eller falskt                   |
| **Null**    | `null`               | Inget värde / tomt                  |
| **Object**  | `{ "key": "value" }` | Nästlad struktur                    |
| **Array**   | `[1, 2, 3]`          | Lista med värden                    |

### Nästlade strukturer

JSON blir kraftfullt när du kombinerar objekt och arrayer:

```json
{
  "name": "Självmordslinjen",
  "phone": "90101",
  "hours": {
    "weekdays": "Dygnet runt",
    "weekends": "Dygnet runt"
  },
  "languages": ["Svenska", "Engelska"],
  "services": [
    {
      "type": "phone",
      "number": "90101"
    },
    {
      "type": "chat",
      "url": "https://mind.se/chatt"
    }
  ]
}
```

Här ser vi:

- Ett objekt med flera nycklar
- Ett nästlat objekt (`hours`)
- En array med strängar (`languages`)
- En array med objekt (`services`)

### ⚠️ Vanliga JSON-misstag

JSON är strikt — små fel gör hela filen ogiltig!

#### Trailing comma (extra komma)

```json
// ❌ FEL — komma efter sista värdet
{
  "name": "Test",
  "value": 123
}
```

```json
// ✅ RÄTT — inget komma efter sista värdet
{
  "name": "Test",
  "value": 123
}
```

#### Enkla citattecken

```json
// ❌ FEL — enkla citattecken
{
  "name": "Test"
}
```

```json
// ✅ RÄTT — dubbla citattecken
{
  "name": "Test"
}
```

#### Kommentarer

```json
// ❌ FEL — JSON stödjer inte kommentarer!
{
  "name": "Test" // detta är en kommentar
}
```

```json
// ✅ RÄTT — inga kommentarer alls
{
  "name": "Test"
}
```

> 💡 **Tips:** Om du behöver "kommentarer" i JSON kan du lägga till en nyckel som `"_comment": "Förklaring här"`, men det är inte standard.

#### Oavslutade strukturer

```json
// ❌ FEL — saknar avslutande }
{
  "name": "Test"
```

Håll koll på att alla `{` har en matchande `}` och alla `[` har en matchande `]`.

### Validera din JSON

Om du misstänker fel i en JSON-fil, använd en validator:

- **VS Code** — Markerar fel automatiskt
- **JSONLint** — jsonlint.com (klistra in och validera)
- **Terminal** — `cat file.json | python -m json.tool`

---

## Data i Eleventy 📊

Nu när du förstår JSON-formatet, låt oss se hur Eleventy använder data.

### Data Cascade — En påminnelse

Som vi nämnde i Eleventy-guiden har Eleventy ett system kallat "data cascade" där data från olika källor slås samman. Här är källorna igen, i prioritetsordning (högst först):

1. **Frontmatter** — I själva filen
2. **Template Data Files** — JSON-fil med samma namn som mallen
3. **Directory Data Files** — JSON-fil som gäller hela mappen
4. **Global Data** — Filer i `_data/`-mappen

### Global Data (`_data/`)

Filer i `src/_data/`-mappen blir automatiskt tillgängliga i alla mallar. Filnamnet (utan ändelse) blir variabelnamnet.

```
src/_data/
├── site.json          →  {{ site }}
├── supportLines.json  →  {{ supportLines }}
├── samlingar.json     →  {{ samlingar }}
└── quotes.json        →  {{ quotes }}
```

#### Exempel: site.json

```json
{
  "name": "Stödlinjer",
  "url": "https://stodlinjer.se",
  "description": "Svenska stödlinjer och krisresurser",
  "author": "Stödlinjer-teamet",
  "language": "sv-SE",
  "themeColor": "#0f1724"
}
```

I vilken mall som helst kan du nu skriva:

```njk
<title>{{ site.name }}</title>
<meta name="description" content="{{ site.description }}">
<html lang="{{ site.language }}">
```

#### Exempel: supportLines.json

```json
[
  {
    "id": "mind-sjalvmordslinjen",
    "name": "Självmordslinjen",
    "description": "Stöd för dig som har tankar på att ta ditt liv, eller är orolig för någon annan.",
    "number": "90101",
    "available": "Dygnet runt, alla dagar",
    "url": "https://mind.se/hitta-hjalp/sjalvmordslinjen/",
    "categories": ["suicid", "kris"]
  },
  {
    "id": "bris",
    "name": "BRIS",
    "description": "Stöd för barn och unga upp till 18 år.",
    "number": "116 111",
    "available": "Vardagar 14-21, helger 14-18",
    "url": "https://bris.se",
    "categories": ["barn", "unga"]
  }
]
```

I en mall:

```njk
<ul class="support-lines">
{% for line in supportLines %}
  <li>
    <h3>{{ line.name }}</h3>
    <p>{{ line.description }}</p>
    <p>📞 {{ line.number }} ({{ line.available }})</p>
  </li>
{% endfor %}
</ul>
```

### Directory Data Files

En JSON-fil med samma namn som mappen ger standardvärden för alla filer i den mappen.

```
src/artiklar/
├── artiklar.json        ← Gäller alla filer i artiklar/
├── samtalsstod/
│   └── min-artikel.md
└── fakta-myter/
    └── annan-artikel.md
```

`src/artiklar/artiklar.json`:

```json
{
  "layout": "layouts/post.njk",
  "tags": ["artikel"],
  "permalink": "/{{ page.filePathStem }}/",
  "pageClass": "article-shell"
}
```

Nu får **alla** artiklar automatiskt:

- Layouten `layouts/post.njk`
- Taggen `artikel`
- En permalink baserad på filsökvägen
- CSS-klassen `article-shell`

Individuella artiklar kan fortfarande _överskriva_ dessa värden i sin egen frontmatter.

### JavaScript Data Files

Förutom JSON kan du använda JavaScript för mer dynamisk data. Filen måste exportera data eller en funktion som returnerar data.

`src/_data/buildTime.js`:

```javascript
module.exports = function () {
  return new Date().toISOString();
};
```

Nu finns `{{ buildTime }}` tillgänglig och visar när sajten byggdes.

Detta är användbart när du behöver:

- Beräkna värden
- Hämta data från externa källor
- Läsa miljövariabler

---

## Stödlinjer-projektets data 📁

Låt oss titta på den faktiska datastrukturen i projektet.

### Översikt

```
src/_data/
├── site.json           # Grundläggande sajt-info
├── supportLines.json   # Alla stödlinjer
├── samlingar.json      # Artikelkategorier
├── quotes.json         # Inspirerande citat
└── chatbot.json        # Chatbot-konfiguration
```

### site.json — Sajtens identitet

```json
{
  "name": "Stödlinjer",
  "url": "https://stodlinjer.se",
  "description": "Hitta rätt stöd. Svenska stödlinjer och resurser för psykisk hälsa.",
  "author": "Stödlinjer-teamet",
  "language": "sv-SE",
  "colorScheme": "light dark",
  "themeColor": "#0f1724"
}
```

**Användning:**

- `{{ site.name }}` — I sidhuvud, titel, footer
- `{{ site.url }}` — För canonical URLs och absoluta länkar
- `{{ site.description }}` — Meta-beskrivning på startsidan
- `{{ site.language }}` — I `<html lang="">`

### supportLines.json — Stödlinjerna

Detta är projektets kärndata — alla stödlinjer med kontaktinformation.

```json
[
  {
    "id": "mind-sjalvmordslinjen",
    "name": "Självmordslinjen",
    "description": "Stöd för dig som har tankar på att ta ditt liv.",
    "number": "90101",
    "available": "Dygnet runt, alla dagar",
    "url": "https://mind.se/hitta-hjalp/sjalvmordslinjen/",
    "categories": ["suicid", "kris"],
    "contactTypes": ["phone", "chat"],
    "targetGroups": ["alla"]
  }
]
```

**Fältförklaring:**

| Fält           | Typ    | Beskrivning                          |
| -------------- | ------ | ------------------------------------ |
| `id`           | String | Unikt ID (för URL:er och kopplingar) |
| `name`         | String | Visningsnamn                         |
| `description`  | String | Kort beskrivning av tjänsten         |
| `number`       | String | Telefonnummer                        |
| `available`    | String | Öppettider                           |
| `url`          | String | Länk till hemsida                    |
| `categories`   | Array  | Kategorier för filtrering            |
| `contactTypes` | Array  | Kontaktmetoder (phone, chat, email)  |
| `targetGroups` | Array  | Målgrupper (alla, barn, unga, etc.)  |

### samlingar.json — Artikelkategorier

Definierar de olika artikelsamlingarna och deras metadata.

```json
[
  {
    "slug": "samtalsstod",
    "title": "Samtalsstöd",
    "summary": "Guider för att stötta någon som mår dåligt.",
    "description": "Längre beskrivning som kan användas på samlingssidan...",
    "icon": "fas fa-comments"
  },
  {
    "slug": "fakta-myter",
    "title": "Fakta & Myter",
    "summary": "Vanliga missförstånd om psykisk hälsa.",
    "icon": "fas fa-lightbulb"
  }
]
```

**Koppling till artiklar:**

I en artikels frontmatter:

```yaml
---
samling: samtalsstod
---
```

I en mall kan du hämta samlingens metadata:

```njk
{% set samlingData = samling | getSamling %}
<span class="category">{{ samlingData.title }}</span>
```

### quotes.json — Inspirerande citat

```json
[
  {
    "text": "Det är aldrig för sent att börja om.",
    "author": "Bodil Malmsten"
  },
  {
    "text": "Du är starkare än du tror.",
    "author": "Okänd"
  }
]
```

Används för att visa slumpmässiga citat på sajten.

### chatbot.json — Chatbot-konfiguration

```json
{
  "apiUrl": "/.netlify/functions/chat",
  "greetings": [
    "Hej!👋 Hur är det med dig?",
    "Hej!👋 Vad har du på hjärtat idag?",
    "Hej!👋 Hur mår du just nu?"
  ],
  "externalSources": []
}
```

Konfigurerar chatbotens beteende och hälsningsfraser.

---

## Arbeta med data i mallar 🛠️

### Loopa över arrayer

Det vanligaste mönstret — gå igenom en lista och generera HTML för varje element:

```njk
{% for line in supportLines %}
  <article class="support-line-card">
    <h2>{{ line.name }}</h2>
    <p>{{ line.description }}</p>

    <dl>
      <dt>Telefon</dt>
      <dd>{{ line.number }}</dd>

      <dt>Tillgänglighet</dt>
      <dd>{{ line.available }}</dd>
    </dl>

    <a href="{{ line.url }}">Besök webbplats →</a>
  </article>
{% endfor %}
```

### Filtrera data

Visa bara vissa element baserat på villkor:

```njk
<h2>Stödlinjer för barn och unga</h2>
<ul>
{% for line in supportLines %}
  {% if "barn" in line.targetGroups or "unga" in line.targetGroups %}
    <li>{{ line.name }}: {{ line.number }}</li>
  {% endif %}
{% endfor %}
</ul>
```

### Sortera data

Nunjucks har ett inbyggt `sort`-filter:

```njk
{# Sortera alfabetiskt efter namn #}
{% for line in supportLines | sort(attribute="name") %}
  <p>{{ line.name }}</p>
{% endfor %}

{# Sortera omvänt (Z-A) #}
{% for line in supportLines | sort(reverse=true, attribute="name") %}
  <p>{{ line.name }}</p>
{% endfor %}
```

### Begränsa antal

Visa bara de första N elementen:

```njk
<h2>Några stödlinjer</h2>
{% for line in supportLines.slice(0, 3) %}
  <p>{{ line.name }}</p>
{% endfor %}
```

### Räkna element

```njk
<p>Vi listar {{ supportLines | length }} stödlinjer.</p>
```

### Kontrollera om data finns

```njk
{% if supportLines and supportLines.length %}
  {# Visa listan #}
{% else %}
  <p>Inga stödlinjer hittades.</p>
{% endif %}
```

### Slå upp i objekt

Om du har data organiserad som ett objekt (istället för array):

```json
{
  "suicid": {
    "title": "Suicidprevention",
    "color": "red"
  },
  "angest": {
    "title": "Ångest",
    "color": "blue"
  }
}
```

```njk
{{ categories.suicid.title }}
{{ categories["angest"].color }}
```

Hakparentesnotation är användbar när nyckeln kommer från en variabel:

```njk
{% set categoryKey = "suicid" %}
{{ categories[categoryKey].title }}
```

---

## Tips för att strukturera data 💡

### Använd konsekvent namngivning

Bestäm dig för en stil och håll dig till den:

```json
// ✅ BRA — konsekvent camelCase
{
  "firstName": "Anna",
  "lastName": "Andersson",
  "phoneNumber": "070-123 45 67"
}

// ❌ DÅLIGT — blandade stilar
{
  "first_name": "Anna",
  "LastName": "Andersson",
  "phone-number": "070-123 45 67"
}
```

### Använd arrayer för listor av samma typ

```json
// ✅ BRA — array för flera av samma sak
{
  "categories": ["suicid", "kris", "ångest"]
}

// ❌ DÅLIGT — numrerade nycklar
{
  "category1": "suicid",
  "category2": "kris",
  "category3": "ångest"
}
```

### Ge varje objekt ett unikt ID

```json
[
  {
    "id": "mind-sjalvmordslinjen",
    "name": "Självmordslinjen"
  }
]
```

ID:n är användbara för:

- URL:er och ankare
- Att referera till objektet från annan data
- CSS-klasser och JavaScript

### Separera data från presentation

Data ska beskriva _vad_ något är, inte _hur_ det ska visas:

```json
// ✅ BRA — ren data
{
  "status": "active",
  "priority": 1
}

// ❌ DÅLIGT — presentation i data
{
  "statusColor": "green",
  "priorityLabel": "★★★"
}
```

Presentation hanteras i mallar och CSS.

### Undvik djup nästling

Håll strukturen så platt som möjligt:

```json
// ✅ BRA — relativt platt
{
  "contact": {
    "phone": "90101",
    "email": "info@example.com"
  }
}

// ❌ DÅLIGT — onödigt djupt
{
  "data": {
    "contact": {
      "information": {
        "details": {
          "phone": "90101"
        }
      }
    }
  }
}
```

---

## Debugging och felsökning 🔧

### Visa rådata i mallen

När något inte fungerar som förväntat, dumpa datan:

```njk
<pre>{{ supportLines | dump(2) }}</pre>
```

`dump`-filtret (om tillgängligt) visar JSON-formaterad data. Alternativt:

```njk
<pre>{{ supportLines | json }}</pre>
```

### Kontrollera datatyper

Ibland är problemet att data har fel typ:

```njk
{# Är det en array? #}
<p>Är array: {{ supportLines.length !== undefined }}</p>

{# Är det definierat? #}
{% if supportLines %}
  <p>supportLines finns</p>
{% else %}
  <p>supportLines saknas!</p>
{% endif %}
```

### Vanliga problem

#### "undefined" visas

Variabeln finns inte eller är felstavad:

```njk
{# Om "titl" istället för "title" #}
{{ titl }}  →  visar ingenting eller "undefined"
```

Kontrollera stavningen och att datan verkligen finns.

#### Loopen körs inte

Arrayen är tom eller inte en array:

```njk
{% for item in items %}
  <p>{{ item }}</p>
{% else %}
  <p>Inga items! (items = {{ items | json }})</p>
{% endfor %}
```

#### Data från JSON läses inte

- Kontrollera att JSON-filen är giltig (inga syntaxfel)
- Kontrollera att filen ligger i rätt mapp (`_data/`)
- Kontrollera filnamnet (det blir variabelnamnet)

---

## Sammanfattning 📝

| Koncept            | Beskrivning                                        |
| ------------------ | -------------------------------------------------- |
| **JSON**           | Dataformat med objekt `{}` och arrayer `[]`        |
| **Global Data**    | JSON i `_data/` → tillgängligt överallt            |
| **Directory Data** | JSON med mappens namn → gäller alla filer i mappen |
| **Data Cascade**   | System för hur data slås samman från olika källor  |

### Viktiga regler för JSON

- ✅ Dubbla citattecken för strängar och nycklar
- ✅ Inget komma efter sista elementet
- ✅ Inga kommentarer
- ✅ Validera vid problem

### Vanliga mönster i mallar

```njk
{# Loopa #}
{% for item in items %}{% endfor %}

{# Filtrera #}
{% if condition in item.array %}{% endif %}

{# Sortera #}
{% for item in items | sort(attribute="name") %}{% endfor %}

{# Räkna #}
{{ items | length }}

{# Debugga #}
<pre>{{ items | json }}</pre>
```

---

Nu har du koll på hur data fungerar! Nästa guide tar en detaljerad titt på hur just Stödlinjer-projektet är strukturerat. 🗂️

---

**Gå tillbaka till:** [Nunjucks, Markdown & Frontmatter](04-nunjucks-markdown.md)
**eller gå vidare till:** [Projektstruktur](06-projektstruktur.md)
