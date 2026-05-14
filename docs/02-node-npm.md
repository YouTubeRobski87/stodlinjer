# Node.js & npm 🟢

Den här guiden förklarar vad Node.js och npm är, varför de behövs och hur du använder dem i praktiken. Det här är grunden som resten av projektet bygger på, så det är värt att ta sig tid att förstå dessa koncept ordentligt.

---

## Vad är Node.js? 🤔

### JavaScript utanför webbläsaren

Du känner säkert till JavaScript som språket som gör webbsidor interaktiva — det som får knappar att reagera på klick, formulär att valideras och animationer att spela upp. Traditionellt har JavaScript _bara_ kunnat köras inuti en webbläsare.

**Node.js ändrade på det.**

Node.js är en plattform som låter dig köra JavaScript direkt på din dator, helt utan webbläsare. Detta öppnade upp en helt ny värld av möjligheter: plötsligt kunde JavaScript användas för att bygga webbservrar, kommandoradsverktyg, byggprocesser och mycket mer.

### Varför är detta relevant för dig?

Eleventy — verktyget som bygger Stödlinjer-sajten — är skrivet i JavaScript och körs via Node.js. När du skriver `npm start` i terminalen är det Node.js som faktiskt exekverar Eleventy-koden som omvandlar alla dina Markdown- och Nunjucks-filer till en färdig webbplats.

Så även om du inte kommer skriva så mycket Node.js-kod själv, behöver du ha Node.js installerat för att överhuvudtaget kunna arbeta med projektet.

### En enkel liknelse 🎭

Tänk dig att JavaScript är ett manus för en teaterpjäs. Traditionellt kunde detta manus _bara_ framföras på en specifik teaterscen (webbläsaren). Node.js är som att ge skådespelarna förmågan att framföra pjäsen var som helst — på gatan, i ett vardagsrum, i en studio. Samma manus, men fler platser där det kan köras.

---

## Vad är npm? 📦

### Node Package Manager

npm står för **Node Package Manager** och är ett verktyg som följer med automatiskt när du installerar Node.js. npm har två huvudfunktioner:

1. **Pakethantering** — Installera, uppdatera och hantera _paket_ (färdig kod som andra har skrivit)
2. **Script-körning** — Köra kommandon definierade i projektets `package.json`

### Vad är ett paket?

Ett paket är en samling kod som någon annan har skrivit och delat med världen. Istället för att uppfinna hjulet på nytt kan du installera färdiga lösningar för vanliga problem.

Till exempel:

- **eleventy** — Paketet som bygger vår sajt
- **markdown-it** — Paketet som omvandlar Markdown till HTML
- **fast-glob** — Paketet som hittar filer baserat på mönster

Det finns _miljontals_ paket tillgängliga via npm:s register (npmjs.com). Allt från små hjälpfunktioner till kompletta ramverk.

### En liknelse för paket 🧱

Tänk dig att du ska bygga ett hus. Du _kan_ tillverka varenda tegelsten själv, men det skulle ta evigheter. Istället köper du färdiga tegelstenar, fönster, dörrar och rör från olika tillverkare och sätter ihop dem till ditt unika hus.

npm-paket fungerar likadant: färdiga byggblock som du kombinerar för att skapa din applikation.

---

## De viktiga filerna 📄

### package.json — Projektets hjärta ❤️

Varje Node.js-projekt har (eller borde ha) en fil som heter `package.json` i sin rotmapp. Detta är projektets viktigaste konfigurationsfil — dess "ID-kort" som beskriver vad projektet är och vad det behöver.

Här är en förenklad version av hur Stödlinjers `package.json` ser ut:

```json
{
  "name": "stodlinjer",
  "version": "1.0.0",
  "description": "Svenska stödlinjer och krisresurser",
  "scripts": {
    "start": "npx @11ty/eleventy --serve",
    "build": "npx @11ty/eleventy"
  },
  "dependencies": {
    "markdown-it": "^14.0.0"
  },
  "devDependencies": {
    "@11ty/eleventy": "^3.0.0"
  }
}
```

Och så här ser det faktiskt ut i projektet just nu (förkortat till det viktigaste):

```json
{
  "scripts": {
    "build": "npm run build:css && eleventy",
    "build:css": "tailwindcss -c tailwind.config.js -i ./src/assets/css/tailwind.css -o ./src/assets/css/tailwind-built.css --postcss --minify",
    "serve": "npm-run-all --parallel watch:css serve:eleventy",
    "serve:eleventy": "eleventy --serve --port=8080",
    "watch": "npm-run-all --parallel watch:css watch:eleventy",
    "watch:css": "tailwindcss -c tailwind.config.js -i ./src/assets/css/tailwind.css -o ./src/assets/css/tailwind-built.css --postcss --watch",
    "watch:eleventy": "eleventy --watch",
    "clean": "rm -rf site",
    "start": "npm run serve"
  },
  "dependencies": {
    "@11ty/eleventy": "^3.1.2",
    "fast-glob": "^3.3.3",
    "gray-matter": "^4.0.3",
    "markdown-it": "^14.1.0"
  },
  "devDependencies": {
    "tailwindcss": "^3.4.19",
    "npm-run-all": "^4.1.5",
    "postcss": "^8.5.6",
    "autoprefixer": "^10.4.22"
  }
}
```

Låt oss gå igenom de viktigaste delarna:

#### `"name"` och `"version"`

Grundläggande info om projektet. Namnet måste vara unikt om du publicerar paketet, men för privata projekt spelar det mindre roll.

#### `"scripts"` — Dina genvägar 🚀

Det här är en av de viktigaste delarna! Här definierar du kommandon som du kan köra via npm:

```json
"scripts": {
  "start": "npx @11ty/eleventy --serve",
  "build": "npx @11ty/eleventy"
}
```

Detta betyder att:

- `npm start` kör kommandot `npx @11ty/eleventy --serve` (startar utvecklingsservern)
- `npm run build` kör kommandot `npx @11ty/eleventy` (bygger sajten)

Du behöver alltså inte komma ihåg de långa kommandona — bara de korta genvägarna!

> **Tips:** Scriptet `start` är speciellt och kan köras med bara `npm start`. Alla andra scripts kräver `npm run` före namnet, till exempel `npm run build`.

#### `"dependencies"` — Paket för produktion

Paket som behövs för att sajten ska fungera, även i produktion. Dessa installeras alltid.

#### `"devDependencies"` — Paket för utveckling

Paket som bara behövs under utveckling — byggverktyg, testramverk och liknande. Eleventy hamnar här eftersom det bara behövs för att _bygga_ sajten, inte för att _köra_ den färdiga sajten.

### package-lock.json — Låsfilen 🔒

Den här filen genereras automatiskt och innehåller _exakt_ vilka versioner av alla paket (och deras beroenden) som är installerade. Detta säkerställer att alla som arbetar med projektet får identiska versioner.

**Du ska aldrig redigera denna fil manuellt!** Den uppdateras automatiskt när du installerar eller uppdaterar paket.

Varför är detta viktigt? Tänk dig att du installerar paket A version 2.1 och allt fungerar. Sex månader senare installerar din kollega samma projekt men får version 2.4 (som har en bugg). Utan lock-filen hade ni fått olika resultat från samma kod! Lock-filen förhindrar detta.

### node_modules — Paketmappen 📁

När du kör `npm install` skapas mappen `node_modules/`. Här hamnar alla paket som projektet behöver — plus alla paket som _de_ paketen behöver, och så vidare.

Denna mapp kan bli **enorm** — ofta hundratals megabyte med tusentals filer, även för små projekt. Det är helt normalt och inget att oroa sig för.

**Viktigt att veta om node_modules:**

- 🚫 **Committa aldrig till Git** — Mappen finns i `.gitignore` och ska aldrig laddas upp till GitHub
- 🗑️ **Kan alltid återskapas** — Om du tar bort mappen kan du återskapa den genom att köra `npm install`
- 🔄 **Projekt-specifik** — Varje projekt har sin egen `node_modules`

### Hur hänger filerna ihop? 🧩

```
package.json          →  Beskriver VAD som behövs
        ↓
npm install           →  Läser package.json, laddar ner paket
        ↓
node_modules/         →  Innehåller alla nedladdade paket
package-lock.json     →  Låser exakta versioner
```

---

## Vanliga npm-kommandon 💻

Här är de kommandon du kommer använda mest. Alla körs i terminalen från projektets rotmapp.

### `npm install` (eller bara `npm i`)

Installerar alla paket som listas i `package.json`. **Detta är alltid första steget** när du klonar ett nytt projekt eller när `node_modules` saknas.

```bash
npm install
```

Du kommer se en massa text rulla förbi medan npm laddar ner paket. När det är klart finns en ny (eller uppdaterad) `node_modules`-mapp.

### `npm start`

Kör scriptet definierat som `"start"` i `package.json`. I Stödlinjer-projektet startar detta Eleventys utvecklingsserver.

```bash
npm start
```

Efter några sekunder bör du se något i stil med:

```
[11ty] Watching…
[11ty] Server at http://localhost:8080/
```

Nu kan du öppna `http://localhost:8080` i din webbläsare och se sajten! Servern körs tills du stoppar den med `Ctrl+C`.

### `npm run build`

Kör scriptet definierat som `"build"`. I vårt fall bygger detta den färdiga sajten till `site/`-mappen.

```bash
npm run build
```

Detta används innan deploy, eller för att testa att bygget fungerar.

### `npm run [script-namn]`

Kör valfritt script definierat i `package.json`. Byt ut `[script-namn]` mot det faktiska namnet.

### `npm install [paketnamn]`

Installerar ett nytt paket och lägger till det i `package.json`. Du behöver sällan göra detta i ett befintligt projekt, men det är bra att känna till.

```bash
npm install lodash              # Lägger till i dependencies
npm install eslint --save-dev   # Lägger till i devDependencies
```

### `npm update`

Uppdaterar alla paket till senaste tillåtna version (inom de ramar som anges i `package.json`).

```bash
npm update
```

> **Varning:** Uppdateringar kan ibland introducera buggar eller breaking changes. Var försiktig och testa ordentligt efter uppdateringar.

### `npm outdated`

Visar vilka paket som har nyare versioner tillgängliga.

```bash
npm outdated
```

---

## Versionshantering i package.json 🔢

Du kanske har noterat att versionsnummer i `package.json` ofta har ett `^` framför sig:

```json
"dependencies": {
  "markdown-it": "^14.0.0"
}
```

Detta tecken styr vilka versioner npm får installera vid uppdateringar:

| Prefix | Betydelse                             | Exempel: `^14.0.0` tillåter                    |
| ------ | ------------------------------------- | ---------------------------------------------- |
| `^`    | Tillåt minor- och patch-uppdateringar | 14.0.0, 14.1.0, 14.2.3, etc. (men inte 15.0.0) |
| `~`    | Tillåt endast patch-uppdateringar     | 14.0.0, 14.0.1, 14.0.9, etc. (men inte 14.1.0) |
| Ingen  | Exakt version                         | Endast 14.0.0                                  |

De flesta projekt använder `^` som en bra balans mellan att få buggfixar och att undvika oväntade ändringar.

### Vad betyder versionsnumren?

Versionsnummer följer ofta **Semantic Versioning** (SemVer): `MAJOR.MINOR.PATCH`

- **MAJOR** (14.x.x) — Stora ändringar som kan kräva att du ändrar din kod
- **MINOR** (x.1.x) — Nya funktioner som är bakåtkompatibla
- **PATCH** (x.x.1) — Buggfixar som inte ändrar funktionalitet

---

## npx — Kör paket direkt ⚡

Du kommer ibland se kommandot `npx` istället för `npm`. npx är ett verktyg som följer med npm och låter dig _köra_ paket direkt, utan att först installera dem globalt.

Till exempel:

```bash
npx @11ty/eleventy
```

Detta kör Eleventy direkt. npx hittar paketet i `node_modules` om det finns där, eller laddar ner det temporärt om det behövs.

I praktiken möter du oftast npx inuti scripts i `package.json`, så du behöver sällan skriva det själv.

---

## Vanliga problem och lösningar 🔧

### "command not found: npm"

Node.js är inte installerat, eller inte tillagt i din PATH. Lösning: Installera (eller ominstallera) Node.js från [nodejs.org](https://nodejs.org/).

### "npm WARN" vid installation

Varningar (WARN) är oftast ofarliga — de informerar om saker som _kan_ vara problem men som inte hindrar installationen. Läs dem, men panika inte.

Fel (ERR!) är däremot allvarligare och hindrar ofta installationen. Läs felmeddelandet noga för ledtrådar.

### "EACCES: permission denied"

Behörighetsproblem, vanligast på Mac/Linux. Undvik att köra npm med `sudo`! Bättre lösningar:

1. Installera Node via **nvm** (Node Version Manager)
2. Ändra npm:s default-katalog (se npm:s dokumentation)

### node_modules verkar korrupt

Ibland kan `node_modules` hamna i ett konstigt tillstånd. Den säkraste lösningen är att ta bort mappen och installera om:

```bash
rm -rf node_modules
npm install
```

På Windows:

```bash
rmdir /s /q node_modules
npm install
```

### Versionskonflikt

Om du får fel om inkompatibla versioner, prova:

```bash
rm -rf node_modules package-lock.json
npm install
```

Detta tar bort både paket och lock-filen och gör en helt färsk installation.

---

## Sammanfattning 📝

Låt oss sammanfatta det viktigaste:

| Koncept               | Förklaring                                                                    |
| --------------------- | ----------------------------------------------------------------------------- |
| **Node.js**           | Plattform som kör JavaScript utanför webbläsaren                              |
| **npm**               | Verktyg för att hantera paket och köra scripts                                |
| **package.json**      | Projektets konfiguration — vilka paket som behövs och vilka scripts som finns |
| **package-lock.json** | Låser exakta versioner (rör den inte!)                                        |
| **node_modules**      | Mappen med installerade paket (lägg aldrig i Git!)                            |
| **npm install**       | Installera paket                                                              |
| **npm start**         | Starta utvecklingsservern                                                     |
| **npm run build**     | Bygg den färdiga sajten                                                       |

### Det allra viktigaste att komma ihåg 🌟

1. **Kör alltid `npm install` först** när du klonar ett projekt
2. **node_modules kan alltid återskapas** — var inte rädd för att ta bort den vid problem
3. **Läs felmeddelanden** — de innehåller ofta lösningen
4. **package.json är din vän** — titta där för att se vilka scripts som finns tillgängliga

---

Nu har du koll på grunderna! I nästa guide tittar vi på Eleventy — verktyget som faktiskt bygger sajten. 🏗️

---

**Gå tillbaka till:** [Ordlista](01-ordlista.md)
**eller gå vidare till:** [Eleventy](03-eleventy.md)
