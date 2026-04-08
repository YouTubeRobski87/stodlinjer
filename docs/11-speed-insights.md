# Vercel Speed Insights 📊

Den här guiden förklarar hur Vercel Speed Insights är konfigurerat i Stödlinjer-projektet och hur det fungerar tillsammans med Eleventy.

## Vad är Vercel Speed Insights?

Vercel Speed Insights är ett prestandaövervakningstool från Vercel som mäter och rapporterar användarcentrerad prestandadata från din webbplats. Det hjälper dig att:

- **Övervaka prestanda i realtid** – Se hur din sajt presterar för riktiga användare
- **Identifiera flaskhalsar** – Hitta sidor och komponenter som är långsamma
- **Förbättra användarupplevelsen** – Få data-driven insikter för optimering
- **Respektera integritet** – Vercel följer strikt privacy-regler (Se [Vercel Privacy Policy](https://vercel.com/legal/privacy-policy))

Speed Insights rapporterar Web Vitals och andra prestandamätvärden från verklig trafikdata.

## Förutsättningar

För att använda Vercel Speed Insights behöver du:

- ✅ Ett Vercel-konto (gratis på [vercel.com/signup](https://vercel.com/signup))
- ✅ Ett Vercel-projekt (länkat eller skapat på [vercel.com/new](https://vercel.com/new))
- ✅ Vercel CLI installerad (för lokal utveckling):

```bash
# Installera Vercel CLI med ditt pakethanteringssystem
pnpm i vercel
# eller
yarn add vercel
# eller
npm install vercel
# eller
bun add vercel
```

## Aktuell konfiguration i Stödlinjer

Speed Insights är redan konfigurerat i detta projekt:

### 1. Paketberoende

Paketet `@vercel/speed-insights` är redan installerat som en dependency i `package.json`:

```json
{
  "dependencies": {
    "@vercel/speed-insights": "^1.3.1"
  }
}
```

### 2. Script-tag i HTML

Speed Insights-skriptet är inkluderat i `_includes/partials/head.njk`:

```html
<script defer src="/_vercel/speed-insights/script.js"></script>
```

Detta är rätt approach för statiska webbplatser och Eleventy-projekt. Skriptet:
- Läses in asynkront (`defer` attribut)
- Automatiskt injiceras av Vercel under deployment
- Samlar prestandadata utan att påverka sidladdningen

## Aktivera Speed Insights på Vercel

För att börja se prestandadata behöver du aktivera Speed Insights på ditt Vercel-projekt:

### Steg 1: Gå till projektinställningarna

1. Logga in på [Vercel Dashboard](https://vercel.com/dashboard)
2. Välj ditt Stödlinjer-projekt
3. Navigera till fliken **Speed Insights**

### Steg 2: Aktivera funktionen

Klicka på **Enable** i dialogen. Du kommer att se ett meddelande:

> **💡 Notering:** Aktivering av Speed Insights lägger till nya vägar (scoped till `/_vercel/speed-insights/*`) efter din nästa deployment.

### Steg 3: Driftsätt ditt projekt

Push en ny version av koden för att aktivera Speed Insights:

```bash
git push origin main
```

Vercel kommer automatiskt att bygga och driftsätta din sajt. Efter driftsättningen börjar Speed Insights-skriptet samla prestandadata.

## Visa data i instrumentpanelen

När Speed Insights är aktiverat och några användare har besökt din sajt:

1. Öppna [Vercel Dashboard](https://vercel.com/dashboard)
2. Välj ditt projekt
3. Klicka på fliken **Speed Insights**

Du ser då:
- **Real User Monitoring (RUM)** – Prestandadata från riktiga användare
- **Web Vitals** – Largest Contentful Paint (LCP), First Input Delay (FID), Cumulative Layout Shift (CLS)
- **Geografisk data** – Var dina användare är lokaliserade
- **Länktrender** – Hur prestanda utvecklas över tid

## Konfiguration för Eleventy-projekt

För Eleventy-projekt (statiska webbplatser) är konfigurationen minimal:

### ✅ Vad är redan gjort

- Speed Insights-skriptet är inkluderat i `_includes/partials/head.njk`
- Paketet är installerat i `package.json`
- Inga extra komponenter eller konfigurering krävs

### 📝 Anpassningar (valfritt)

Om du vill rensa känslig information från URL:er före rapportering kan du lägga till en `speedInsightsBeforeSend`-funktion i din globala window-objekt:

```html
<!-- I din layout eller head -->
<script>
  window.speedInsightsBeforeSend = function(data) {
    // Rensa känsliga parametrar från URL
    if (data.url && data.url.includes('?')) {
      data.url = data.url.split('?')[0];
    }
    return data;
  };
</script>
```

Speed Insights-skriptet kommer automatiskt att anropa denna funktion före rapportering.

## Lokal utveckling

Under lokal utveckling (när du kör `npm run serve`):

- Speed Insights-skriptet läses in men rapporterar ingen data
- Ingen påverkan på lokal prestanda
- Du kan testa att skriptet är korrekt inkluderat genom att öppna DevTools och söka efter `/_vercel/speed-insights/script.js`

## Driftsättning och övervakning

### Automatisk övervakning

När du driftsätter till Vercel:

1. Vercel bygger din Eleventy-sajt
2. Speed Insights-skriptet injiceras automatiskt
3. Data börjar samlas från användarvisningar

### Kontrollera injektionen

För att verifiera att Speed Insights är korrekt injicerat:

1. Öppna din live-sajt på Vercel
2. Öppna **DevTools** (F12 eller högerklick → Inspect)
3. Gå till fliken **Network**
4. Sök efter `/_vercel/speed-insights/`
5. Du bör se flera requests för `script.js` och datainsamling

## Nästa steg

- 📊 [Lär dig mer om Speed Insights](https://vercel.com/docs/speed-insights)
- 📈 [Förstå Web Vitals](https://vercel.com/docs/speed-insights/metrics)
- 🔒 [Läs om integritet och compliance](https://vercel.com/docs/speed-insights/privacy-policy)
- 💰 [Priser och begränsningar](https://vercel.com/docs/speed-insights/limits-and-pricing)
- 🆘 [Felsöking](https://vercel.com/docs/speed-insights/troubleshooting)

## Tips för prestandaoptimering

Baserat på Speed Insights-data kan du optimera din sajt:

- **Minimera render-blocking resurser** – Kontrollera CSS och JavaScript
- **Optimera bilder** – Använd moderna format som WebP
- **Minska JavaScript-bundles** – Splitta koden för kritiska vägar
- **Förbättra Core Web Vitals** – Fokusera på LCP, FID och CLS
- **Aktivera caching** – Använd Vercel CDN för statisk innehål

## Referens

| Länk | Beskrivning |
|------|-------------|
| [Vercel Speed Insights Docs](https://vercel.com/docs/speed-insights) | Officiell dokumentation |
| [Web Vitals](https://web.dev/vitals/) | Google's guide till Web Vitals |
| [Eleventy](https://www.11ty.dev/) | Eleventy statisk sidgenerator |
| [Vercel Dashboard](https://vercel.com/dashboard) | Instrumentpanel för övervakning |

---

**Senast uppdaterad:** 2025-12-23
