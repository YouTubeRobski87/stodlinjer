# Bonusguide för PC-användare 🖥️

Kör du projektet på Windows? Då är den här bonusen för dig. Det mesta fungerar likadant som på Mac/Linux, men några småsaker är bra att ha koll på så du slipper onödiga hinder.

## Vad du behöver 🧰

- **Node.js LTS** – installera från https://nodejs.org (välj LTS). Starta om terminalen efteråt.
- **Git** – installera från https://git-scm.com (standardinställningar funkar fint).
- **VS Code** (rekommenderas) – https://code.visualstudio.com. Lägg gärna till tilläggen för Nunjucks, Markdown och GitLens.
- **Netlify CLI** (valfritt, för lokala functions) – `npm install -g netlify-cli`
- **Windows Terminal** (trevligare än klassisk cmd/PowerShell) – finns i Microsoft Store.

## Vilken terminal? 💬

- **PowerShell** eller **Windows Terminal** med en PowerShell-flik är enklast.
- **WSL** (Linux på Windows) är ett alternativ om du vill ha bash-miljö. Praktiskt men inte nödvändigt för det här projektet.

## Snabbinstallation med Chocolatey (valfritt) ⚡

Har du Chocolatey kan du ta en genväg:

```powershell
choco install -y nodejs-lts git
```

Starta om terminalen efteråt.

## Köra npm-scripts 🔁

I PowerShell från projektroten:

```powershell
npm install
npm start        # startar dev-servern på http://localhost:8080
npm run build    # bygger till site/
```

## Miljövariabler och .env 🔒

- Skapa `.env` i projektroten (UTF-8, gärna LF-radslut) och lägg in:

```
OPENAI_API_KEY=din-egen-nyckel
```

- Tillfälligt i en PowerShell-session:

```powershell
$env:OPENAI_API_KEY="din-egen-nyckel"
```

- `netlify dev` läser `.env` automatiskt när du kör via Netlify CLI.

## Radslut (CRLF vs LF) 🧭

- Git på Windows kan konvertera radslut. För färre onödiga diffs:

```powershell
git config --global core.autocrlf input
```

- Kolla längst ned till höger i VS Code (CRLF/LF) och byt till LF om projektet förväntar sig det.

## Vanliga Windows-knep 🛠️

- Port upptagen (t.ex. 8080)? Sätt `PORT=8081` i samma PowerShell-fönster innan `npm start`.
- Antivirus/OneDrive som låser filer? Kör terminalen som vanlig användare och håll projektet utanför synkade mappar.
- Rättighetsproblem vid globala installationer? Öppna terminalen som administratör eller använd lokalt (`npx netlify-cli`).
- Undvik mellanslag i sökvägar till projektet – det sparar krångel med vissa kommandon.

## WSL om du vill 🐧

- Installera med `wsl --install` (kräver omstart).
- Installera Node.js i WSL separat (t.ex. via nvm).
- Kör projektet inne i WSL-filsystemet (`/home/<du>/...`) för bäst prestanda.

---

**Gå tillbaka till:** [Produktionssättning](09-deploy.md)
