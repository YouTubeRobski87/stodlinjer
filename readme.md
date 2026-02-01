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
npm install
```` 
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

telefon/chatt/webb

kategori

taggar

öppettider

senast verifierad datum

Stödlinjer kan tillfälligt döljas genom att sätta "active": false.

🤖 Stödchatten (AI)

Frontend: src/_includes/partials/chatbot.njk

JS: src/assets/js/chatbot.js

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

Typografi: Sans-serif med optimerat radavstånd

📬 Kontakt

🌐 Webb: https://stodlinjer.se

📧 E-post: info@stodlinjer.se

👤 Skapad av: Robert Claesson

📄 Licens

Fritt att använda och anpassa för ideella och icke-kommersiella ändamål. 💚

Du är inte ensam. Hjälp finns.


---

### Så gör du nu (kort påminnelse)
1. Gå till **README.md** på GitHub  
2. Klicka **Edit**
3. Radera allt
4. Klistra in texten ovan
5. Commit


