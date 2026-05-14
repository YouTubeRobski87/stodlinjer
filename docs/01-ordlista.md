# Ordlista 📗

Den här ordlistan förklarar termer och begrepp som du kommer stöta på när du arbetar med Stödlinjer-projektet. Håll gärna den här sidan öppen i en egen flik medan du läser de andra guiderna — du kommer sannolikt att återvända hit ofta i början!

Termerna är grupperade efter kategori för att göra det lättare att hitta det du söker. Om du letar efter något specifikt kan du använda webbläsarens sökfunktion (Ctrl+F eller Cmd+F).

---

## 🟢 Node.js & npm

### Node.js (ofta bara "Node")

En plattform som låter dig köra JavaScript utanför webbläsaren — direkt på din dator. Traditionellt kunde JavaScript bara köras i webbläsare, men Node.js öppnade upp för att använda samma språk för att bygga verktyg, servrar och mycket mer. I det här projektet används Node.js för att köra Eleventy och alla byggverktyg.

### npm (Node Package Manager)

Ett verktyg som följer med Node.js och hanterar _paket_ (färdig kod som andra har skrivit). Istället för att skriva allt från grunden kan du installera paket som löser specifika problem. npm används också för att köra kommandon som `npm start` och `npm run build`.

### package.json

En fil i projektets rot som fungerar som projektets "ID-kort". Den innehåller projektets namn, vilka paket det behöver (dependencies), och vilka kommandon som finns tillgängliga (scripts). När du kör `npm install` läser npm denna fil för att veta vad som ska installeras.

### package-lock.json

En automatiskt genererad fil som "låser" exakt vilka versioner av alla paket som är installerade. Detta säkerställer att alla som arbetar med projektet får exakt samma versioner. Du behöver aldrig redigera denna fil manuellt.

### node_modules

En mapp som skapas när du kör `npm install`. Här hamnar alla paket som projektet behöver — ofta tusentals filer! Denna mapp ska _aldrig_ laddas upp till Git (den finns i `.gitignore`). Om du tar bort den kan du alltid återskapa den genom att köra `npm install` igen.

### Dependencies (beroenden)

Paket som projektet behöver för att fungera. Listas i `package.json` under `"dependencies"` (behövs i produktion) eller `"devDependencies"` (behövs bara under utveckling).

### Scripts

Kommandon definierade i `package.json` som du kan köra med `npm run [namn]`. Till exempel kör `npm run build` kommandot som bygger sajten. Vissa speciella scripts som `start` och `test` kan köras utan `run`: `npm start`.

---

## 🏗️ Eleventy

### Eleventy (11ty)

En _statisk sidgenerator_ skriven i JavaScript. Den tar enkla källfiler (Markdown, Nunjucks, JSON) och omvandlar dem till en komplett webbplats med HTML-filer. Eleventy är känt för att vara snabbt, flexibelt och ha en låg inlärningströskel.

### Statisk sidgenerator (Static Site Generator, SSG)

Ett verktyg som genererar färdiga HTML-sidor i förväg, istället för att skapa dem dynamiskt när en besökare laddar sidan. Detta ger snabbare laddtider, bättre säkerhet och enklare hosting. Motsatsen är en _dynamisk_ sajt där en server bygger varje sida vid varje besök.

### Build (bygge)

Processen där Eleventy omvandlar alla källfiler till den färdiga sajten. När du kör `npm run build` skapas en mapp (i vårt fall `site/`) med alla HTML-, CSS- och JavaScript-filer som utgör den publicerbara webbplatsen.

### eleventy.config.js

Konfigurationsfilen för Eleventy. Här definierar du saker som var källfilerna finns, var den byggda sajten ska hamna, vilka filter och genvägar som ska finnas tillgängliga, och mycket mer. Detta är hjärnan i byggprocessen.

### Input (src/)

Mappen där alla källfiler finns — det du faktiskt redigerar. I det här projektet heter den `src/`.

### Output (site/)

Mappen där den färdiga, byggda sajten hamnar. I det här projektet heter den `site/`. Denna mapp genereras automatiskt vid varje bygge och ska inte redigeras manuellt.

### Passthrough Copy

En Eleventy-funktion som kopierar filer direkt till output-mappen utan att bearbeta dem. Används för saker som bilder, typsnitt och CSS som inte behöver transformeras.

### Collection

En grupp av innehåll i Eleventy, till exempel alla artiklar eller alla sidor med en viss tagg. Collections skapas automatiskt från taggar i frontmatter eller manuellt i konfigurationen.

### Filter

En funktion i Eleventy som transformerar data i mallar. Till exempel kan ett filter `formatDate` omvandla "2025-12-15" till "15 december 2025". Filter används i Nunjucks med pipe-syntax: `{{ date | formatDate }}`.

### Shortcode

En genväg i Eleventy för att infoga återanvändbart innehåll eller HTML. Fungerar som ett makro du kan använda i dina mallar.

---

## ✍️ Templating & innehåll

### Template (mall)

En fil som definierar strukturen för hur innehåll ska presenteras. Mallar innehåller platshållare för dynamiskt innehåll som fylls i vid byggtid. Till exempel kan en och samma artikelmall användas för hundratals olika artiklar.

### Nunjucks

Ett _mallspråk_ (templating language) skapat av Mozilla. Det låter dig skriva HTML-mallar med dynamiskt innehåll, loopar, villkor och mer. Filerna har ändelsen `.njk`. Nunjucks är kraftfullt men har en syntax som är lätt att lära sig.

### Markdown

Ett enkelt textformat för att skriva innehåll. Istället för HTML-taggar använder du symboler: `# Rubrik`, `**fetstil**`, `*kursiv*`, `- lista`. Markdown-filer (`.md`) omvandlas automatiskt till HTML av Eleventy. De flesta artiklarna på Stödlinjer är skrivna i Markdown.

### Frontmatter

Metadata i början av en Markdown- eller Nunjucks-fil, inramad av tre streck (`---`). Här definierar du saker som titel, beskrivning, datum och vilken layout filen ska använda. Frontmatter skrivs i YAML-format.

Exempel:

```yaml
---
title: Min artikel
description: En kort beskrivning
date: 2025-12-15
layout: layouts/post.njk
tags: artikel
---
```

### YAML

Ett dataformat som används i frontmatter. YAML är designat för att vara läsbart för människor och använder indrag (mellanslag) för att visa struktur. Var noga med indragen — de är betydelsefulla!

### Layout

En mall som definierar den övergripande strukturen för en sida — header, footer, navigation och var huvudinnehållet ska placeras. Enskilda sidor "ärver" en layout via frontmatter.

### Partial (delfil)

En liten mall-del som kan inkluderas i andra mallar. Används för återkommande element som header, footer eller navigering. I det här projektet finns partials i `src/_includes/partials/`.

### Include

En Nunjucks-funktion för att infoga innehållet från en annan fil. Till exempel: `{% include "partials/header.njk" %}` infogar header-filen på den platsen.

### Block

En Nunjucks-funktion för att definiera utbytbara sektioner i layouts. En layout kan definiera ett block som child-mallar sedan kan fylla med sitt eget innehåll.

---

## 🗃️ Data & JSON

### JSON (JavaScript Object Notation)

Ett dataformat för strukturerad information. JSON är läsbart för både människor och datorer och används flitigt för att lagra data, konfiguration och för att skicka information mellan system. I det här projektet lagras stödlinjerna och annan data i JSON-filer.

Exempel:

```json
{
  "name": "Självmordslinjen",
  "phone": "90101",
  "available": "Dygnet runt"
}
```

### Data Cascade

Eleventys system för hur data flödar ner genom mallar. Data kan komma från många källor (frontmatter, JSON-filer, JavaScript) och slås samman i en prioritetsordning. Data i frontmatter har högst prioritet och "vinner" över global data.

### Global Data

Data som är tillgänglig i alla mallar. I Eleventy placeras global data i `_data`-mappen. Till exempel, en fil `src/_data/site.json` blir tillgänglig som variabeln `site` i alla mallar.

### Directory Data

En JSON-fil som ger standardvärden för alla filer i samma mapp. Exempelvis ger `src/artiklar/artiklar.json` alla artiklar samma layout utan att varje fil behöver specificera det i sin frontmatter.

---

## ☁️ Hosting & deployment

### Hosting

Tjänsten som gör din webbplats tillgänglig på internet. Hostingen lagrar dina filer och serverar dem till besökare. För statiska sajter finns många enkla (och gratis) alternativ som Netlify, Vercel och GitHub Pages.

### Netlify

En molntjänst för hosting av webbplatser. Netlify kan automatiskt bygga din sajt från ett Git-repo, hantera formulär, köra serverless functions och mycket mer. Stödlinjer hostas på Netlify.

### Deploy (deployment)

Processen att publicera din sajt så att den blir tillgänglig på internet. Med Netlify sker detta automatiskt varje gång du pushar ändringar till GitHub.

### Serverless Functions

Små kodbitar som körs på servern utan att du behöver hantera någon server själv. I det här projektet används en serverless function för chatboten. Funktionerna finns i `netlify/functions/`-mappen.

### Miljövariabel (Environment Variable)

En variabel som definieras utanför koden, ofta för känslig information som API-nycklar. Miljövariabler hålls hemliga och läggs aldrig i Git. I det här projektet finns till exempel `OPENAI_API_KEY` som miljövariabel.

### .env-fil

En lokal fil för att lagra miljövariabler under utveckling. Denna fil ska _aldrig_ committas till Git (den finns i `.gitignore`). Du skapar en egen `.env`-fil lokalt med dina egna nycklar.

### API-nyckel (API Key)

En hemlig kod som identifierar dig mot en extern tjänst. Ungefär som ett lösenord. I det här projektet används en API-nyckel för att kommunicera med OpenAI:s API.

---

## 🔧 Versionshantering

### Git

Ett versionshanteringssystem som håller koll på alla ändringar i dina filer över tid. Git låter dig se historiken, ångra ändringar och samarbeta med andra utan att skriva över varandras arbete.

### Repository (repo)

En "behållare" för ett projekt i Git. Innehåller alla filer och hela ändringshistoriken. Kan finnas lokalt på din dator och/eller på en tjänst som GitHub.

### GitHub

En webbplattform för att lagra Git-repositories online. Gör det enkelt att samarbeta, dela kod och koppla ihop med tjänster som Netlify för automatisk deployment.

### Clone (klona)

Att skapa en lokal kopia av ett repository från GitHub till din dator. Detta är ofta första steget när du börjar arbeta med ett befintligt projekt.

### Commit

En "sparad punkt" i Git — en samling ändringar med ett beskrivande meddelande. Commits bygger upp projektets historik och låter dig gå tillbaka till tidigare versioner.

### Push

Att skicka dina lokala commits till GitHub (eller annan fjärrserver). Efter en push är dina ändringar tillgängliga för andra — och om Netlify är kopplat startar automatiskt ett nytt bygge.

### Pull

Att hämta de senaste ändringarna från GitHub till din lokala kopia. Viktigt att göra regelbundet om flera personer arbetar med samma projekt.

### Branch (gren)

En separat "arbetslinje" i Git där du kan experimentera utan att påverka huvudkoden. Huvudgrenen heter oftast `main` eller `master`.

### .gitignore

En fil som talar om för Git vilka filer och mappar som _inte_ ska versionshanteras. Används för saker som `node_modules/`, `.env` och byggda filer.

---

## 🖥️ Utvecklingsmiljö

### Terminal (kommandorad)

Ett textbaserat gränssnitt för att interagera med datorn genom att skriva kommandon. Här kör du saker som `npm install` och `npm start`. På Mac heter programmet "Terminal", på Windows kan du använda "PowerShell" eller "Command Prompt".

### CLI (Command Line Interface)

Ett program som styrs via terminalen istället för ett grafiskt gränssnitt. Eleventy och npm är exempel på CLI-verktyg.

### IDE (Integrated Development Environment)

Ett program för att skriva kod med funktioner som syntaxmarkering, autokomplettering och inbyggd terminal. Visual Studio Code (VS Code) är ett populärt och gratis alternativ som rekommenderas för det här projektet.

### Localhost

Din egen dator när den agerar som en lokal webbserver. När du kör `npm start` startar en utvecklingsserver som gör sajten tillgänglig på `http://localhost:8080` — men bara på din egen dator.

### Hot Reload

En funktion där webbläsaren automatiskt uppdateras när du sparar ändringar i koden. Sparar tid genom att du slipper manuellt ladda om sidan hela tiden.

### Port

En siffra som identifierar en specifik tjänst på en dator. Utvecklingsservern kör på port 8080, så adressen blir `localhost:8080`. Om den porten är upptagen kan du få en annan, som `localhost:8081`.

---

## 🤖 API & integration

### API (Application Programming Interface)

Ett sätt för olika program att prata med varandra. I det här projektet använder chatboten ett API för att skicka frågor till OpenAI och få svar tillbaka. API:er kommunicerar ofta via HTTP med JSON-data.

### REST API

En vanlig typ av API som använder standard HTTP-metoder (GET, POST, PUT, DELETE) för att hämta och skicka data. De flesta moderna webbtjänster erbjuder REST API:er.

### HTTP-metod

Typ av förfrågan till en server. De vanligaste är:

- **GET** — Hämta data (t.ex. ladda en webbsida)
- **POST** — Skicka data (t.ex. skicka ett formulär eller ett chattmeddelande)

### Endpoint

En specifik URL som ett API lyssnar på. Till exempel kan `/api/chat` vara en endpoint som tar emot chattmeddelanden.

### Request (förfrågan)

Ett meddelande som skickas _till_ ett API. Innehåller ofta data som API:et ska bearbeta.

### Response (svar)

Ett meddelande som kommer _tillbaka_ från ett API efter en request. Innehåller resultatet eller eventuella felmeddelanden.

---

## 📄 Filformat

### .njk

Nunjucks-mallfiler. Innehåller HTML blandat med Nunjucks-syntax för dynamiskt innehåll.

### .md

Markdown-filer. Innehåller text med enkel formatering som omvandlas till HTML.

### .json

JSON-datafiler. Innehåller strukturerad data i JavaScript Object Notation.

### .js

JavaScript-filer. Kan vara konfiguration (som `eleventy.config.js`) eller kod som körs i webbläsaren.

### .css

Stilmallar som definierar hur HTML-element ska se ut — färger, typsnitt, layout med mera.

### .svg

Skalbar vektorgrafik. Ett bildformat baserat på XML som kan skalas utan kvalitetsförlust. Används ofta för ikoner och logotyper.

---

## 💡 Bra att veta

### Syntax

Reglerna för hur kod eller markup ska skrivas för att vara giltig. Varje språk (HTML, CSS, JavaScript, Nunjucks, YAML) har sin egen syntax.

### Indrag/indentering

Mellanslag eller tabbar i början av rader för att visa struktur och hierarki. I YAML och Python är indraget _meningsfullt_ — fel indrag ger fel. I andra språk är det "bara" för läsbarhet.

### Kommentar

Text i koden som ignoreras av datorn, skriven för människor. Används för att förklara vad koden gör. Olika syntax i olika språk:

- HTML: `<!-- kommentar -->`
- CSS: `/* kommentar */`
- JavaScript: `// kommentar` eller `/* kommentar */`
- Nunjucks: `{# kommentar #}`

### Debugging

Processen att hitta och fixa fel (buggar) i kod. Innebär ofta att läsa felmeddelanden, lägga till console.log och systematiskt testa hypoteser.

### Console.log

En JavaScript-funktion som skriver ut meddelanden till webbläsarens utvecklarkonsol. Ovärderlig för debugging — du kan se värden på variabler och spåra kodens flöde.

### Cache

Temporärt lagrad data för snabbare åtkomst. Webbläsare cachar filer för att slippa ladda ner dem igen. Ibland behöver du tömma cachen (hard refresh) för att se dina ändringar.

---

_Saknar du något begrepp? Hör av dig så lägger vi till det!_ ✨

---

**Gå tillbaka till:** [Index](00-index.md)
**eller gå vidare till:** [Node.js & npm](02-node-npm.md)
