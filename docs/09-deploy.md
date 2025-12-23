# Produktionssättning 🌐

Grattis — du har nått sista guiden! 🎉

Nu ska vi prata om hur du får ut sajten på riktigt internet, så att hela världen kan besöka den. Vi går igenom hur Stödlinjer-projektet redan är uppsatt med Netlify, men också alternativa sätt att publicera om du vill experimentera eller byta plattform.

---

## Vad betyder "deploy"? 🤔

"Deploy" (eller "produktionssättning" på svenska) är processen att ta din lokala kod och göra den tillgänglig på internet. Det innebär:

1. **Bygga sajten** — Omvandla källfiler till färdig HTML/CSS/JS
2. **Ladda upp filerna** — Till en server eller molntjänst
3. **Konfigurera domän** — Koppla en webbadress till filerna
4. **Aktivera HTTPS** — Säker anslutning för besökare

Med moderna verktyg som Netlify sker allt detta automatiskt — men det är bra att förstå vad som händer under huven.

---

## Nuvarande setup: Netlify + GitHub 🔗

Stödlinjer är redan konfigurerat för automatisk deploy via Netlify. Här är hur det fungerar:

### Flödet

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   DU        │     │   GITHUB    │     │   NETLIFY   │     │  INTERNET   │
│             │     │             │     │             │     │             │
│  git push   │ ──► │   main      │ ──► │   Bygger    │ ──► │  Sajten är  │
│             │     │   branch    │     │   & deploy  │     │  live!      │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

### Steg för steg

1. **Du gör ändringar** och committar lokalt
2. **Du pushar** till `main`-branchen på GitHub
3. **GitHub skickar en webhook** till Netlify
4. **Netlify klonar** repot
5. **Netlify kör** `npm install` och sedan `npm run build`
6. **Netlify publicerar** innehållet i `site/`-mappen
7. **Klart!** Sajten är uppdaterad på några sekunder

### Det enda du behöver göra

```bash
git add .
git commit -m "Beskrivande meddelande om ändringen"
git push
```

Vänta 30–60 sekunder, och dina ändringar är live! ✨

---

## Första gången: Koppla Netlify till GitHub 🔧

Om du sätter upp projektet från grunden eller behöver koppla om, här är stegen:

### 1. Skapa ett Netlify-konto

1. Gå till [netlify.com](https://www.netlify.com/)
2. Klicka **Sign up**
3. Välj **Sign up with GitHub** (enklast!)
4. Godkänn att Netlify får tillgång till dina repon

### 2. Skapa en ny sajt

1. Klicka **Add new site** → **Import an existing project**
2. Välj **GitHub** som källa
3. Sök efter och välj **stodlinjer**-repot
4. Konfigurera bygginställningar:

```
Branch to deploy:    main
Build command:       npm run build
Publish directory:   site
```

5. Klicka **Deploy site**

### 3. Vänta på första bygget

Netlify kör nu första bygget. Du kan följa processen i realtid:

```
9:15:00 AM: Build ready to start
9:15:02 AM: Fetching cached dependencies
9:15:05 AM: npm install
9:15:15 AM: npm run build
9:15:22 AM: Build successful
9:15:25 AM: Deploying to main site
9:15:30 AM: Published ✓
```

### 4. Konfigurera miljövariabler

Efter första deploy måste du lägga till API-nyckeln:

1. Gå till **Site settings** → **Environment variables**
2. Klicka **Add a variable**
3. Lägg till:
   - Key: `OPENAI_API_KEY`
   - Value: `sk-din-nyckel-här`
4. Klicka **Save**
5. **Trigga ett nytt bygge** (Site overview → Trigger deploy)

### 5. Anpassa domänen (valfritt)

Netlify ger dig en gratis subdomän som `amazing-lamport-123456.netlify.app`. Du kan:

- **Byta till snyggare namn:** Site settings → Domain management → Edit site name
- **Koppla egen domän:** Site settings → Domain management → Add custom domain

---

## Manuell deploy 📤

Ibland vill du deploya utan att pusha till GitHub — kanske för att testa något snabbt.

### Via Netlify CLI

```bash
# Installera CLI (om du inte redan har)
npm install -g netlify-cli

# Logga in
netlify login

# Bygg lokalt
npm run build

# Deploya till preview (testar utan att påverka produktion)
netlify deploy

# Deploya till produktion
netlify deploy --prod
```

### Via drag-and-drop

1. Kör `npm run build` lokalt
2. Gå till [app.netlify.com/drop](https://app.netlify.com/drop)
3. Dra `site/`-mappen till webbläsaren
4. Klart! (Dock utan serverless functions)

> ⚠️ **OBS:** Drag-and-drop-deploy inkluderar inte serverless functions. Använd bara för snabbtester av statiska delar.

---

## Deploy-förhandsvisning (Preview Deploys) 👀

En av Netlify's bästa funktioner! Varje pull request får sin egen förhandsvisnings-URL.

### Hur det fungerar

1. Du skapar en pull request på GitHub
2. Netlify bygger automatiskt en preview
3. Du får en unik URL som `deploy-preview-42--stodlinjer.netlify.app`
4. Du kan testa ändringarna utan att påverka produktionssajten
5. När du mergar PR:en uppdateras produktionen

### Varför är detta användbart?

- **Testa innan du publicerar** — Se exakt hur ändringen ser ut
- **Dela med andra** — Skicka länken för feedback
- **Granska kod** — Se resultatet tillsammans med koden i PR:en
- **Undvik misstag** — Upptäck problem innan de når produktion

---

## Rollbacks — Ångra en deploy 🔙

Råkade deploya något trasigt? Ingen panik!

### Via Netlify Dashboard

1. Gå till **Deploys**
2. Hitta en tidigare fungerande deploy
3. Klicka på den
4. Klicka **Publish deploy**

Produktionen rullas tillbaka till den valda versionen — på sekunder!

### Netlify sparar allt

Varje deploy sparas permanent (inom rimliga gränser). Du kan när som helst gå tillbaka till vilken tidigare version som helst.

---

## Alternativa deploy-plattformar 🌍

Netlify är inte det enda alternativet. Här är några andra populära val:

### Vercel

**Liknande Netlify, från skaparna av Next.js**

```bash
# Installera
npm install -g vercel

# Deploya
vercel
```

**Fördelar:**

- ✅ Mycket snabba byggen
- ✅ Bra integration med React/Next.js
- ✅ Generös gratis-plan

**Nackdelar:**

- ⚠️ Serverless functions fungerar lite annorlunda
- ⚠️ Kräver anpassning av funktionskoden

### GitHub Pages

**Gratis hosting direkt från GitHub**

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install and Build
        run: |
          npm install
          npm run build

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./site
```

**Fördelar:**

- ✅ Helt gratis
- ✅ Integrerat med GitHub
- ✅ Enkelt för statiska sajter

**Nackdelar:**

- ❌ Inga serverless functions
- ❌ Chatboten fungerar inte utan extern backend
- ⚠️ Kräver GitHub Actions för automatisk deploy

### Cloudflare Pages

**Snabb global hosting med extra funktioner**

```bash
# Via Cloudflare Dashboard eller CLI
npm install -g wrangler
wrangler pages deploy site
```

**Fördelar:**

- ✅ Extremt snabbt globalt CDN
- ✅ Generös gratis-plan
- ✅ Cloudflare Workers för serverless

**Nackdelar:**

- ⚠️ Workers har annan syntax än Netlify Functions
- ⚠️ Kräver omskrivning av chat-funktionen

### Jämförelse

| Plattform        | Gratis-plan    | Functions       | Svårighetsgrad |
| ---------------- | -------------- | --------------- | -------------- |
| **Netlify**      | ✅ Generös     | ✅ Ja           | ⭐ Lätt        |
| **Vercel**       | ✅ Generös     | ✅ Ja           | ⭐ Lätt        |
| **GitHub Pages** | ✅ Helt gratis | ❌ Nej          | ⭐⭐ Medel     |
| **Cloudflare**   | ✅ Generös     | ✅ Ja (Workers) | ⭐⭐ Medel     |

### Rekommendation

För Stödlinjer rekommenderar jag att **stanna med Netlify**:

- Projektet är redan konfigurerat för Netlify
- Serverless functions fungerar utan ändringar
- Automatisk deploy är uppsatt
- Det finns ingen anledning att byta om det fungerar!

Men om du vill experimentera är Vercel det enklaste alternativet att testa.

---

## Domänhantering 🏠

### Netlify-subdomän (gratis)

Varje Netlify-sajt får en gratis subdomän:

```
https://stodlinjer.netlify.app
```

Du kan anpassa namnet under **Site settings** → **Domain management** → **Edit site name**.

### Egen domän

Om du har en egen domän (t.ex. `stodlinjer.se`):

1. **I Netlify:**

   - Site settings → Domain management → Add custom domain
   - Skriv in din domän
   - Följ instruktionerna

2. **Hos din domänregistrar:**

   - Lägg till en CNAME-post som pekar på Netlify
   - Eller ändra nameservers till Netlify DNS

3. **HTTPS:**
   - Netlify fixar SSL-certifikat automatiskt (gratis!)
   - Kan ta några minuter första gången

### DNS-inställningar

```
# Exempel på DNS-poster för stodlinjer.se

# För apex-domänen (stodlinjer.se)
A     @    75.2.60.5

# För www-subdomänen (www.stodlinjer.se)
CNAME www  stodlinjer.netlify.app
```

> 💡 **Tips:** Netlify DNS (gratis) hanterar allt detta automatiskt om du låter Netlify hantera din domäns DNS.

---

## Checklista för deploy ✅

Innan du deployer en större ändring:

### Innan du pushar

- [ ] Kör `npm start` och testa lokalt
- [ ] Kontrollera att inga fel visas i terminalen
- [ ] Testa i flera webbläsare (Chrome, Firefox, Safari)
- [ ] Testa på mobil (eller använd responsive mode i DevTools)
- [ ] Kör `npm run build` och kontrollera att det lyckas
- [ ] Granska dina ändringar: `git diff`

### Efter du pushat

- [ ] Kolla Netlify Dashboard att bygget lyckades
- [ ] Besök produktionssajten och verifiera ändringarna
- [ ] Testa chatboten (om relevant)
- [ ] Kolla att inga konsolfel finns i webbläsarens DevTools

### Vid problem

- [ ] Läs build-loggen på Netlify
- [ ] Rollback till tidigare version om nödvändigt
- [ ] Fixa felet lokalt och deploya igen

---

## Vanliga deploy-problem 🔧

### "Build failed"

**Symptom:** Netlify visar rött kryss, sajten uppdateras inte.

**Felsökning:**

1. Klicka på den misslyckade deployen
2. Läs build-loggen
3. Leta efter rader med "error" eller röd text
4. Fixa felet lokalt och pusha igen

**Vanliga orsaker:**

- Syntax-fel i mallar eller JavaScript
- Saknad fil som refereras
- Fel i package.json

### "Function invocation failed"

**Symptom:** Sajten fungerar men chatboten ger fel.

**Felsökning:**

1. Gå till **Functions** i Netlify Dashboard
2. Klicka på `chat`-funktionen
3. Läs loggarna

**Vanliga orsaker:**

- `OPENAI_API_KEY` saknas i miljövariabler
- API-nyckeln är ogiltig eller har gått ut
- OpenAI API har driftstörning

### "Page not found" (404)

**Symptom:** Vissa sidor ger 404-fel.

**Möjliga orsaker:**

- Permalink i frontmatter är fel
- Filen saknas eller är felnamnad
- Redirect-regel i netlify.toml är felkonfigurerad

### "Mixed content" varning

**Symptom:** Webbläsaren varnar om osäkert innehåll.

**Orsak:** Du laddar HTTP-resurser på en HTTPS-sida.

**Lösning:** Se till att alla URL:er använder `https://` eller relativa sökvägar (`/assets/...`).

---

## Sammanfattning 📝

### Det viktigaste att komma ihåg

```bash
# Allt du behöver för att deploya:
git add .
git commit -m "Beskrivande meddelande"
git push

# Vänta ~30 sekunder, klart!
```

### Deploy-alternativ

| Metod                   | När                           |
| ----------------------- | ----------------------------- |
| `git push`              | Normal deploy (rekommenderat) |
| `netlify deploy --prod` | Manuell deploy via CLI        |
| Drag-and-drop           | Snabbtest utan functions      |
| Preview deploy          | Testa pull requests           |

### Om något går fel

1. Läs Netlify-loggarna
2. Rollback till tidigare version om nödvändigt
3. Fixa lokalt
4. Deploya igen

---

## Avslutning 🎬

**Du har nu gått igenom hela dokumentationen!** 🎉

Låt oss sammanfatta vad du lärt dig:

| Guide                                | Vad du lärde dig                        |
| ------------------------------------ | --------------------------------------- |
| **Ordlista**                         | Alla termer och begrepp                 |
| **Node & npm**                       | Plattformen som driver allt             |
| **Eleventy**                         | Hur sajten byggs                        |
| **Nunjucks, Markdown & Frontmatter** | Hur innehåll skapas                     |
| **JSON & Data**                      | Hur data struktureras och används       |
| **Projektstruktur**                  | Var allt finns                          |
| **Kom igång**                        | Hur du sätter upp projektet             |
| **Netlify & Backend**                | Serverless functions och miljövariabler |
| **Produktionssättning**              | Hur du publicerar till internet         |

### Nästa steg

1. **Experimentera!** — Gör små ändringar och se vad som händer
2. **Läs källkoden** — Det bästa sättet att förstå är att läsa
3. **Bygg något** — Lägg till en artikel eller funktion
4. **Fråga om hjälp** — Ingen fråga är för dum

### Du klarar detta! 💪

Det kan kännas överväldigande med alla nya koncept, men kom ihåg:

- Alla var nybörjare en gång
- Det är okej att inte förstå allt direkt
- Google och dokumentation är dina vänner
- Misstag är det bästa sättet att lära sig

Lycka till med Stödlinjer! Du kommer göra fantastiska saker. 🌟

---

_Har du frågor eller feedback på dokumentationen? Hör av dig!_

---

**Gå tillbaka till:** [Netlify & backend](08-netlify-backend.md)
**eller gå vidare till:** [Bonusguide för PC-användare](10-pc-checklista.md)
