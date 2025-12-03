# 🆘 Stödlinjer.se

En ideell informationssida som samlar svenska stödlinjer och hjälplinjer på ett ställe — för dig som behöver hjälp, eller för dig som vill hjälpa någon annan.

🌐 **Webbplats:** [stodlinjer.se](https://stodlinjer.se)

---

## 💡 Om projektet

Ibland känns livet övermäktigt. Det kan handla om ångest, depression, ensamhet, våld, missbruk eller oro för någon annan. Stödlinjer.se samlar Sveriges viktigaste stödlinjer på ett ställe — så att du snabbt kan hitta rätt nummer att ringa eller chatt att skriva till.

Alla stödlinjer som listas är seriösa aktörer som erbjuder anonymt, kostnadsfritt stöd.

---

## ✨ Funktioner

- 🔍 **Sökbar lista** med 21+ svenska stödlinjer
- 🏷️ **Kategorifiltrering** — psykisk hälsa, barn & unga, våld, missbruk, anhöriga, äldre
- #️⃣ **Taggfiltrering** för detaljerad sökning
- 🌓 **Ljust/mörkt tema** med automatisk systempreferens
- 🔗 **URL-baserad sökning** (`?q=sökterm`) för delning och schema.org SearchAction
- 📱 **Responsiv design** för mobil, surfplatta och desktop
- ♿ **Tillgänglighetsanpassad** — skip links, ARIA-attribut, semantisk HTML
- 💬 **Motiverande citat** som slumpas vid varje sidladdning

---

## 📁 Projektstruktur

```
stodlinjer/
├── index.html                 # Startsida med sökning och alla stödlinjer
├── anhoriga.html              # Sida för anhöriga och närstående
├── kontakt.html               # Kontaktformulär och info
├── data/
│   ├── support-lines.json     # All data för stödlinjer (21+ linjer)
│   └── quotes.json            # Motiverande citat
├── assets/
│   ├── css/
│   │   ├── base.css           # Grundstilar, CSS-variabler, typografi
│   │   └── components.css     # Komponentstilar (kort, knappar, header, footer)
│   ├── js/
│   │   ├── app.js             # Huvudapplikationslogik (sökning, filtrering, tema)
│   │   └── tailwind-config.js # Tailwind CDN-konfiguration
│   ├── fonts/                 # Font Awesome ikonfiler
│   └── imgs/
│       └── og-image-generator.html
└── README.md
```

---

## 🛠️ Teknisk stack

| Teknik                 | Användning                                                |
| ---------------------- | --------------------------------------------------------- |
| **HTML5**              | Semantisk markup med Schema.org strukturerade data        |
| **Tailwind CSS**       | Via CDN med anpassad konfiguration                        |
| **Athletics**          | Premium typsnitt från Family Type för modern, varm känsla |
| **GT Pressura**        | Monospace-typsnitt för telefonnummer                      |
| **Font Awesome**       | Ikoner (lokalt hostade)                                   |
| **Vanilla JavaScript** | ES6+ för interaktivitet, ingen build-process              |

---

## 📞 Akuta nummer

| Linje                        | Nummer     | När               |
| ---------------------------- | ---------- | ----------------- |
| 🚨 **SOS Alarm**             | 112        | Akut fara för liv |
| 💚 **Mind Självmordslinjen** | 90101      | Dygnet runt       |
| 🛡️ **Kvinnofridslinjen**     | 020-505050 | Dygnet runt       |
| 📞 **Hjälplinjen**           | 90390      | Dygnet runt       |

---

## ➕ Lägg till eller ändra stödlinjer

All data finns i `data/support-lines.json`. Varje stödlinje följer detta format:

```json
{
  "id": 1,
  "name": "Namn på stödlinjen",
  "url": "https://exempel.se/",
  "number": "020-12 34 56",
  "description": "Kort beskrivning av vem linjen hjälper.",
  "category": "psykiskhalsa",
  "available": "Dygnet runt, alla dagar",
  "urgent": true,
  "tags": ["akut", "samtal", "anonymt"]
}
```

### Tillgängliga kategorier

| Kategori               | Värde          |
| ---------------------- | -------------- |
| 🧠 Psykisk hälsa       | `psykiskhalsa` |
| 👶 Barn & unga         | `barn-unga`    |
| 🛡️ Våld & utsatthet    | `vald`         |
| 🍷 Missbruk & beroende | `missbruk`     |
| 👨‍👩‍👧 Anhöriga            | `anhoriga`     |
| 🧓 Äldre               | `aldre`        |

### Tillgängliga taggar

`akut`, `psykiskhalsa`, `suicid`, `samtal`, `chatt`, `anonymt`, `valdbrott`, `sorgtrauma`, `anhorig`, `missbruk`, `barn-unga`, `killarman`, `hbtqi`, `stodgrupp`

---

## 🎨 Design

Webbplatsen använder ett varmt, lugnt färgschema med fokus på tillgänglighet och läsbarhet:

- **Ljust tema:** Krämvit bakgrund med varma accenter
- **Mörkt tema:** Djupgrå/svart bakgrund med mjukare accenter
- **Accentfärg:** Varm orange/terrakotta (`#d97757`)
- **Typografi:** Athletics (sans-serif) med optimerade vikter och radavstånd

---

## 🚀 Publicering

Sidan publiceras via **GitHub Pages** på domänen [stodlinjer.se](https://stodlinjer.se).

För att köra lokalt, öppna bara `index.html` i en webbläsare — ingen build-process krävs.

---

## 📧 Kontakt

- 🌐 **Webb:** [stodlinjer.se](https://stodlinjer.se)
- 📬 **E-post:** [info@stodlinjer.se](mailto:info@stodlinjer.se)
- 👤 **Skapad av:** [Robert Claesson](https://github.com/YouTubeRobski87)

---

## 📄 Licens

Fritt att använda och anpassa för ideella ändamål. 💚

---

> _"Du är inte ensam. Hjälp finns."_
