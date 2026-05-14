# Netlify & Backend ☁️

Hittills har vi fokuserat på det som händer lokalt på din dator — källfiler, byggen och utvecklingsservern. Men en webbplats som bara finns på din dator är inte till mycket nytta för världen!

Den här guiden handlar om **Netlify** — tjänsten som gör Stödlinjer tillgänglig på internet. Vi går igenom vad Netlify är, hur det fungerar, och tittar särskilt på de delar som kräver lite extra förståelse: **serverless functions** och **miljövariabler**.

---

## Vad är Netlify? 🌐

### Hosting för moderna webbplatser

Netlify är en molntjänst som specialiserat sig på att hosta statiska webbplatser och JAMstack-applikationer. Men "statisk" betyder inte "begränsad" — Netlify erbjuder en hel del kraftfulla funktioner.

### Vad Netlify gör för Stödlinjer

| Funktion                 | Beskrivning                                      |
| ------------------------ | ------------------------------------------------ |
| **Hosting**              | Serverar den byggda sajten till besökare         |
| **Automatiska byggen**   | Bygger om sajten när du pushar till GitHub       |
| **HTTPS**                | Gratis SSL-certifikat för säker anslutning       |
| **CDN**                  | Distribuerar sajten globalt för snabba laddtider |
| **Serverless Functions** | Kör backend-kod utan egen server                 |
| **Miljövariabler**       | Lagrar hemligheter som API-nycklar säkert        |

### En liknelse 🏠

Tänk dig att du bygger ett hus (din webbplats):

- **Din dator** är verkstaden där du snickar och målar
- **GitHub** är ritningsarkivet där alla ritningar sparas
- **Netlify** är tomten där det färdiga huset står, med el, vatten och postlåda

När du ändrar ritningarna (pushar till GitHub) river Netlify det gamla huset och bygger ett nytt enligt de nya ritningarna — automatiskt, på några sekunder.

---

## Hur Netlify-flödet fungerar 🔄

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   DU         │      │   GITHUB     │      │   NETLIFY    │
│              │      │              │      │              │
│  Gör         │ push │  Sparar      │ hook │  Bygger      │
│  ändringar   │ ───► │  koden       │ ───► │  sajten      │
│              │      │              │      │              │
│  Lokalt      │      │  I molnet    │      │  Publicerar  │
└──────────────┘      └──────────────┘      └──────────────┘
                                                   │
                                                   ▼
                                           ┌──────────────┐
                                           │  BESÖKARE    │
                                           │              │
                                           │  Ser sajten  │
                                           │  på webben   │
                                           └──────────────┘
```

### Steg för steg

1. **Du gör ändringar** lokalt och pushar till GitHub
2. **GitHub tar emot** koden och meddelar Netlify (via en "webhook")
3. **Netlify klonar** repot och kör byggkommandot (`npm run build`)
4. **Netlify publicerar** den byggda sajten (`site/`-mappen)
5. **Besökare** ser den uppdaterade sajten på några sekunder

Allt detta sker automatiskt — du behöver bara pusha din kod!

---

## Netlify-konfiguration: netlify.toml 📄

Projektets Netlify-inställningar definieras i filen `netlify.toml` i projektets rot:

```toml
[functions]
  directory = "netlify/functions"

[build]
  publish = "site"
  command = "npm run build"
```

### Vad betyder detta?

#### [build] — Bygginställningar

```toml
[build]
  publish = "site"             # Mappen som ska publiceras
  command = "npm run build"    # Kommandot som bygger sajten
  # (functions-katalogen anges ovan)
```

- **command** — Det kommando Netlify kör för att bygga sajten
- **publish** — Mappen som innehåller den färdiga sajten
- **functions** — Mappen där serverless functions finns (se blocket `[functions]` ovan)

---

## Serverless Functions 🔧

### Vad är serverless?

"Serverless" betyder inte att det inte finns någon server — det betyder att **du inte behöver hantera servern**. Netlify sköter allt det tekniska; du skriver bara koden.

Traditionellt, om du ville ha backend-logik (som att prata med ett API), behövde du:

1. Sätta upp en server
2. Installera och konfigurera programvara
3. Hantera säkerhet, uppdateringar, skalning...

Med serverless functions skriver du en funktion, laddar upp den, och Netlify hanterar resten.

### Varför behöver Stödlinjer serverless functions?

Chatboten behöver kommunicera med OpenAI:s API. Men det finns ett problem: **API-nyckeln måste hållas hemlig**.

Om vi anropade OpenAI direkt från webbläsaren skulle API-nyckeln vara synlig för alla besökare (via webbläsarens utvecklarverktyg). Vem som helst kunde stjäla nyckeln och använda den för egen del — på vår bekostnad!

**Lösningen:** En serverless function som mellanhand.

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│  WEBBLÄSARE  │      │  NETLIFY     │      │  OPENAI      │
│              │      │  FUNCTION    │      │              │
│  Skickar     │ ───► │  Tar emot    │ ───► │  Svarar      │
│  meddelande  │      │  + lägger    │      │  med AI-     │
│              │ ◄─── │  till API-   │ ◄─── │  genererat   │
│  Får svar    │      │  nyckel      │      │  svar        │
└──────────────┘      └──────────────┘      └──────────────┘
                            │
                            │ API-nyckeln finns
                            │ bara här (säkert!)
```

### Stödlinjers chat-function

Funktionen finns i `netlify/functions/chat.js`. Här är en förenklad version:

```javascript
// netlify/functions/chat.js

export async function handler(event) {
  // 1. Kontrollera att det är en POST-förfrågan
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method not allowed'
    };
  }

  // 2. Läs API-nyckeln från miljövariabler (säkert!)
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return {
      statusCode: 500,
      body: 'API key not configured'
    };
  }

  // 3. Tolka inkommande data
  const { messages, context } = JSON.parse(event.body);

  // 4. Skicka förfrågan till OpenAI
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}` // Nyckeln läggs till här
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [{ role: 'system', content: 'Du är en hjälpsam assistent...' }, ...messages]
    })
  });

  const data = await response.json();

  // 5. Skicka tillbaka svaret till webbläsaren
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      answer: data.choices[0].message.content
    })
  };
}
```

### Anatomin av en serverless function

Varje function exporterar en `handler`-funktion:

```javascript
export async function handler(event, context) {
  // event  — Information om förfrågan (headers, body, etc.)
  // context — Information om körningen (valfritt att använda)

  return {
    statusCode: 200,        // HTTP-statuskod
    headers: { ... },       // Svars-headers
    body: '...'             // Svarskroppen (oftast JSON)
  };
}
```

#### Event-objektet

`event` innehåller all information om förfrågan:

| Egenskap                      | Beskrivning                  |
| ----------------------------- | ---------------------------- |
| `event.httpMethod`            | HTTP-metod (GET, POST, etc.) |
| `event.body`                  | Förfrågans body (som sträng) |
| `event.headers`               | Förfrågans headers           |
| `event.queryStringParameters` | URL-parametrar               |
| `event.path`                  | URL-sökvägen                 |

#### Return-objektet

Det du returnerar blir HTTP-svaret:

```javascript
return {
  statusCode: 200, // Obligatoriskt
  headers: {
    // Valfritt
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ message: 'OK' }) // Obligatoriskt
};
```

### Vanliga statuskoder

| Kod | Betydelse             | När den används                  |
| --- | --------------------- | -------------------------------- |
| 200 | OK                    | Allt gick bra                    |
| 400 | Bad Request           | Klienten skickade ogiltig data   |
| 401 | Unauthorized          | Autentisering krävs/misslyckades |
| 404 | Not Found             | Resursen finns inte              |
| 405 | Method Not Allowed    | Fel HTTP-metod                   |
| 500 | Internal Server Error | Något gick fel på servern        |

---

## Miljövariabler 🔐

### Vad är miljövariabler?

Miljövariabler (environment variables) är värden som definieras **utanför koden** och läses in vid körning. De är perfekta för:

- **Hemligheter** — API-nycklar, lösenord, tokens
- **Konfiguration** — Värden som skiljer mellan miljöer (utveckling vs produktion)
- **Känslig data** — Allt som inte ska ligga i Git

### Varför inte bara skriva nyckeln i koden?

```javascript
// ❌ ALDRIG GÖR SÅ HÄR!
const apiKey = 'sk-abc123hemlig456nyckel789';
```

Om du gör detta och pushar till GitHub:

1. Nyckeln blir offentlig (även i privata repon kan den läcka)
2. Den finns kvar i Git-historiken för alltid (även om du tar bort den)
3. Vem som helst kan använda din nyckel
4. Du får betala för andras användning!

### Hur miljövariabler fungerar

Istället för att hårdkoda värdet läser du det från miljön:

```javascript
// ✅ Så här gör man
const apiKey = process.env.OPENAI_API_KEY;
```

`process.env` är ett objekt i Node.js som innehåller alla miljövariabler.

### Miljövariabler lokalt (.env)

För lokal utveckling lagrar du miljövariabler i en `.env`-fil:

```
# .env (i projektets rot)
OPENAI_API_KEY=sk-din-hemliga-nyckel-här
ANOTHER_SECRET=något-annat-hemligt
DEBUG_MODE=true
```

Denna fil:

- ✅ Finns på din dator
- ✅ Läses av utvecklingsservern
- ❌ Finns **inte** i Git (den är listad i `.gitignore`)
- ❌ Laddas **inte** upp till GitHub eller Netlify

### Miljövariabler på Netlify

På Netlify konfigureras miljövariabler via webbgränssnittet:

1. Logga in på [netlify.com](https://netlify.com)
2. Välj din sajt
3. Gå till **Site settings** → **Environment variables**
4. Klicka **Add a variable**
5. Ange namn (`OPENAI_API_KEY`) och värde (`sk-...`)
6. Spara

```
┌─────────────────────────────────────────────────────────────┐
│  Netlify Dashboard → Site settings → Environment variables  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Key                    Value                               │
│  ─────────────────────  ──────────────────────────────────  │
│  OPENAI_API_KEY         sk-abc123...                        │
│  NODE_VERSION           20                                  │
│                                                             │
│  [Add a variable]                                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Sammanfattning: Var finns vad?

| Miljö                | Var definieras variabler? | Vem har tillgång? |
| -------------------- | ------------------------- | ----------------- |
| Lokalt (utveckling)  | `.env`-fil                | Bara du           |
| Netlify (produktion) | Netlify Dashboard         | Bara teamet       |
| GitHub               | Aldrig!                   | —                 |

---

## Testa functions lokalt 🧪

Du kan testa serverless functions lokalt innan du pushar till Netlify.

### Installera Netlify CLI

```bash
npm install -g netlify-cli
```

### Kör lokal utvecklingsserver

Istället för `npm start`, kör:

```bash
netlify dev
```

Detta startar:

- Eleventy-utvecklingsservern (som vanligt)
- En lokal version av Netlify Functions
- Automatisk inläsning av `.env`-filen

Nu kan du testa chatboten lokalt med din riktiga API-nyckel!

### Skillnader mot npm start

|            | `npm start` | `netlify dev` |
| ---------- | ----------- | ------------- |
| Eleventy   | ✅          | ✅            |
| Hot reload | ✅          | ✅            |
| Functions  | ❌          | ✅            |
| Läser .env | ❌          | ✅            |
| Port       | 8080        | 8888          |

> 💡 **Tips:** Använd `netlify dev` när du arbetar med chatboten eller andra functions.

---

## Loggar och debugging 🔍

### Se loggar på Netlify

Om något går fel i produktion kan du se loggar i Netlify Dashboard:

1. Gå till din sajt på Netlify
2. Klicka på **Functions** i menyn
3. Välj funktionen (t.ex. `chat`)
4. Se loggar och felmeddelanden

### Logga från din function

Använd `console.log()` i din function — det dyker upp i Netlify-loggarna:

```javascript
export async function handler(event) {
  console.log('Received request:', event.httpMethod);
  console.log('Body:', event.body);

  // ... resten av koden

  console.log('Sending response');
  return { statusCode: 200, body: '...' };
}
```

### Vanliga fel och lösningar

#### "Function invocation failed"

**Möjliga orsaker:**

- Syntax-fel i function-koden
- Saknad miljövariabel
- Timeout (funktionen tar för lång tid)

**Felsökning:**

1. Kolla Netlify-loggarna för detaljer
2. Testa lokalt med `netlify dev`
3. Lägg till console.log för att spåra problemet

#### "API key not configured"

**Orsak:** Miljövariabeln `OPENAI_API_KEY` saknas.

**Lösning:**

- Lokalt: Kontrollera att `.env` finns och innehåller nyckeln
- Netlify: Lägg till variabeln i Dashboard → Site settings → Environment variables

#### CORS-fel i webbläsaren

**Orsak:** Webbläsaren blockerar anrop mellan olika domäner.

**Lösning:** Lägg till CORS-headers i svaret:

```javascript
return {
  statusCode: 200,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
};
```

---

## Deploy-processen 🚀

### Automatisk deploy

När du pushar till `main`-branchen på GitHub bygger och publicerar Netlify automatiskt:

1. Du kör `git push`
2. GitHub meddelar Netlify
3. Netlify hämtar koden
4. Netlify kör `npm run build`
5. Netlify publicerar `site/`-mappen
6. Klart! Sajten är uppdaterad

### Se deploy-status

I Netlify Dashboard kan du se alla deploys:

```
┌─────────────────────────────────────────────────────────────┐
│  Deploys                                                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ✅ Production: main@abc123f                                │
│     Published 2 minutes ago · Deploy time: 45s              │
│                                                             │
│  ✅ Production: main@def456g                                │
│     Published yesterday · Deploy time: 52s                  │
│                                                             │
│  ❌ Failed: main@ghi789h                                    │
│     Build failed · See logs for details                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Om ett bygge misslyckas

1. Klicka på den misslyckade deployen
2. Läs build-loggarna
3. Hitta felet (ofta tydligt markerat)
4. Fixa felet lokalt
5. Pusha igen

**Vanliga byggfel:**

- Syntax-fel i mallar eller JavaScript
- Saknad fil som refereras
- npm-paket som inte installerades korrekt

---

## Sammanfattning 📝

### Netlify-koncept

| Koncept                  | Beskrivning                               |
| ------------------------ | ----------------------------------------- |
| **Hosting**              | Serverar din byggda sajt till världen     |
| **Automatiska byggen**   | Bygger om vid varje push till GitHub      |
| **Serverless Functions** | Backend-kod utan att hantera servrar      |
| **Miljövariabler**       | Säker lagring av hemligheter              |
| **netlify.toml**         | Konfigurationsfil för bygge och functions |

### Serverless Functions

```javascript
// Grundstruktur
export async function handler(event) {
  // Läs från event.body, event.headers, etc.
  // Använd process.env för miljövariabler

  return {
    statusCode: 200,
    body: JSON.stringify({ data: '...' })
  };
}
```

### Miljövariabler

| Var        | Hur                                                       |
| ---------- | --------------------------------------------------------- |
| Lokalt     | `.env`-fil i projektets rot                               |
| Produktion | Netlify Dashboard → Site settings → Environment variables |

### Kommandon

```bash
# Lokal utveckling med functions
netlify dev

# Manuell deploy (om automatisk inte fungerar)
netlify deploy --prod
```

---

Nu förstår du hur Stödlinjer lever på internet! Sista guiden handlar om olika sätt att publicera sajten till produktion. 🌐

---

**Gå tillbaka till:** [Kom igång](07-kom-igang.md)
**eller gå vidare till:** [Produktionssättning](09-deploy.md)
