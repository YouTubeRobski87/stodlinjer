# Stödlinjer — Dokumentation 📚

Välkommen! 👋

Den här guiden är skriven speciellt för dig som ska ta över och vidareutveckla Stödlinjer-projektet. Målet är att du ska känna dig trygg med att förstå hur allt hänger ihop, kunna göra ändringar och bygga vidare på sajten.

Guiden förutsätter att du har grundläggande kunskaper i HTML, CSS och JavaScript, men är ny på moderna webbutvecklingsverktyg som Node.js, npm och statiska sidgeneratorer. Oroa dig inte om det känns överväldigande till en början — det är helt normalt! Alla har varit nybörjare någon gång, och den här guiden tar dig igenom allt steg för steg.

## Vad är Stödlinjer? 💜

Stödlinjer är en webbplats som samlar svenska stödlinjer, krisresurser och information kring psykisk hälsa. Sajten riktar sig till människor som mår dåligt eller som vill hjälpa någon i sin närhet, och presenterar information på ett lugnt, tillgängligt och icke-stigmatiserande sätt.

Tekniskt sett är sajten byggd med **Eleventy** — en så kallad _statisk sidgenerator_ som omvandlar enkla textfiler till en komplett webbplats. Den hostas sedan på **Netlify**, en molntjänst som både bygger och publicerar sajten automatiskt varje gång du sparar ändringar.

Men mer om det senare! Först ska vi gå igenom grunderna.

## Innehåll 📖

Dokumentationen är uppdelad i tio separata guider, plus en bonus för PC/Windows. Jag rekommenderar starkt att du läser dem i ordning första gången du går igenom materialet — varje guide bygger på kunskaper från de tidigare. Därefter fungerar de utmärkt som uppslagsverk när du behöver fräscha upp minnet om något specifikt.

| #   | Guide                                                       | Beskrivning                                                   |
| --- | ----------------------------------------------------------- | ------------------------------------------------------------- |
| 1   | [Ordlista](01-ordlista.md)                                  | 📗 Förklaringar av alla termer och begrepp du kommer stöta på |
| 2   | [Node.js & npm](02-node-npm.md)                             | 🟢 Den grundläggande plattformen som allt annat bygger på     |
| 3   | [Eleventy](03-eleventy.md)                                  | 🏗️ Hur sajten byggs från källfiler till färdig HTML           |
| 4   | [Nunjucks, Markdown & Frontmatter](04-nunjucks-markdown.md) | ✍️ Hur mallar och innehåll fungerar tillsammans               |
| 5   | [JSON & data](05-json-data.md)                              | 🗃️ Hur data struktureras och används i projektet              |
| 6   | [Projektstruktur](06-projektstruktur.md)                    | 🗂️ En detaljerad karta över hur detta projekt är organiserat  |
| 7   | [Kom igång](07-kom-igang.md)                                | 🚀 Steg-för-steg: från att klona repot till en körande sajt   |
| 8   | [Netlify & backend](08-netlify-backend.md)                  | ☁️ Serverless functions, miljövariabler och API-nycklar       |
| 9   | [Produktionssättning](09-deploy.md)                         | 🌐 Så publicerar du sajten live för hela världen              |
| 10  | [Bonus: PC/Windows-checklista](10-pc-checklista.md)         | 🖥️ Verktyg och tips om du jobbar på Windows                   |

## Snabbstart ⚡

Är du otålig och vill bara köra igång så fort som möjligt? Då kan du hoppa direkt till [Kom igång](07-kom-igang.md) för att få sajten att köra lokalt på din dator.

Men ett ärligt råd: ta dig tid att åtminstone skumma igenom **Ordlistan** och **Node.js & npm**-guiden först. Det tar kanske 15–20 minuter extra, men sparar dig potentiellt timmar av förvirring senare. Många av de fel och problem man stöter på som nybörjare beror på att man inte riktigt förstår vad de underliggande verktygen faktiskt gör.

## Tips för din inlärningsresa 🎯

Här är några råd som kommer att göra din resa mycket smidigare:

### 🧪 Experimentera modigt

Det absolut bästa sättet att lära sig är att ändra saker och se vad som händer. Bryt saker! (Du kan alltid ångra med Git.) Testa att ändra en färg, en text, eller en inställning — och se resultatet. Den typen av "learning by doing" fastnar mycket bättre än att bara läsa.

### 🔍 Läs felmeddelanden noggrant

Felmeddelanden i terminalen kan se skrämmande ut med sin röda text och tekniska jargong. Men de innehåller nästan alltid exakt den information du behöver för att lösa problemet. Ta för vana att läsa dem uppifrån och ner, och leta efter radnummer och filnamn — de pekar oftast direkt på var problemet finns.

### 🧩 En sak i taget

Det är lätt att känna sig överväldigad när man möter många nya koncept samtidigt. Försök inte förstå allt på en gång. Fokusera på en guide, ett koncept, ett verktyg i taget. Det är okej att inte förstå allt direkt — förståelsen växer fram gradvis.

### 📗 Använd ordlistan flitigt

Stöter du på ett ord eller en term du inte känner igen? Kolla i [ordlistan](01-ordlista.md) först! Den är skriven just för detta projekt och förklarar begreppen i rätt kontext. Håll den öppen i en egen flik medan du läser de andra guiderna.

### ☕ Ta pauser

Hjärnan behöver tid att processa ny information. Om något känns omöjligt att förstå, ta en paus och kom tillbaka senare. Det är förvånansvärt ofta som saker plötsligt "klickar" efter en kopp kaffe eller en natts sömn.

## Externa resurser och dokumentation 🔗

Även om den här guiden är skriven för att vara så komplett som möjligt för just detta projekt, kommer du ibland behöva gräva djupare i de officiella dokumentationerna. Här är de viktigaste:

- **Eleventy** — https://www.11ty.dev/docs/
  Den officiella dokumentationen för Eleventy. Väldigt välskriven och full av exempel.

- **Nunjucks** — https://mozilla.github.io/nunjucks/templating.html
  Referens för mallspråket vi använder. Bra för att slå upp specifik syntax.

- **Netlify** — https://docs.netlify.com/
  Allt om hosting, serverless functions och deployment.

- **MDN Web Docs** — https://developer.mozilla.org/
  Den bästa referensen för HTML, CSS och JavaScript. Om du undrar hur något fungerar i webben generellt, börja här.

## Frågor och problem? 🤔

Om du kör fast eller har frågor är det bara att höra av dig! Ingen fråga är för dum att ställa — det är så vi alla lär oss.

Lycka till med projektet! Du kommer att göra ett fantastiskt jobb. 💪

---

_Senast uppdaterad: 11 december 2025_

---

**Gå vidare till:** [Ordlista](01-ordlista.md)
