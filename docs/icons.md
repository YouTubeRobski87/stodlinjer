# Stödlinjer Icon System

This document explains the icon system in Stödlinjer.se.

---

## Quick Start

```nunjucks
{# In Nunjucks templates #}
{% from "partials/icon.njk" import icon %}

{{ icon("search") }}              {# Line icon with hover swap #}
{{ icon("search", "solid") }}     {# Solid icon only #}
{{ icon("fa-search") }}           {# FA prefix auto-stripped #}
```

```javascript
// In JavaScript (after init)
renderIcon('search')              // Line icon with hover swap
renderIcon('search', 'solid')     // Solid icon only
```

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                     SINGLE SOURCE OF TRUTH                          │
│                                                                     │
│                    /src/_data/icons.json                            │
│                    ├── paths (SVG file locations)                   │
│                    ├── aliases (FA name → symbol name)              │
│                    └── available (list of all symbols)              │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Nunjucks (icon.njk)          JavaScript (app.js)                   │
│  └── reads icons.json         └── fetches /data/icons.json          │
│      directly via Eleventy        at runtime                        │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  SVG Sprites                  CSS                                   │
│  ├── st-line.svg              ├── stodlinjer-line.css               │
│  └── st-solid.svg             └── stodlinjer-solid.css              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Files

| File | Purpose |
|------|---------|
| `/src/_data/icons.json` | **Single source of truth** - paths, aliases, available symbols |
| `/src/assets/symbols/st-line.svg` | SVG sprite sheet (line/outlined icons) |
| `/src/assets/symbols/st-solid.svg` | SVG sprite sheet (solid/filled icons) |
| `/src/_includes/partials/icon.njk` | Nunjucks macro for templates |
| `/src/assets/js/app.js` | JavaScript `renderIcon()` function |
| `/src/assets/css/fonts/stodlinjer-line.css` | Line icon styles + swap logic |
| `/src/assets/css/fonts/stodlinjer-solid.css` | Solid icon styles |

---

## The Dual-Icon Swap Effect

Icons use a "swap" effect: line icons become solid on hover/focus/active.

### How It Works

The `.icon-duo` wrapper contains both line and solid SVGs:

```html
<span class="icon-duo">
  <svg class="stl icon-line">...</svg>   <!-- Visible by default -->
  <svg class="sts icon-solid">...</svg>  <!-- Shown on interaction -->
</span>
```

### Enabling the Swap

**Option 1: Add `data-icon-swap` attribute (Recommended)**

```html
<a href="..." data-icon-swap>{{ icon("search") }} Search</a>
<button data-icon-swap>{{ icon("phone") }} Call</button>
```

**Option 2: Use existing component classes**

Many components have built-in swap support:
- `.header-link`, `.footer-link`
- `.category-btn`, `.card-number`, `.card-title`
- `.pagination-link`, `.read-more`
- Generic `a`, `button`, `.is-active`

---

## Configuration (icons.json)

```json
{
  "paths": {
    "line": "/assets/symbols/st-line.svg",
    "solid": "/assets/symbols/st-solid.svg"
  },
  "aliases": {
    "magnifying-glass": "search",
    "heart": "heart-1",
    "check": "check-mark-bold"
  },
  "available": [
    "search", "phone", "heart-1", "brain", ...
  ]
}
```

### Paths

Where the SVG sprite sheets are located. Change these if you move the files.

### Aliases

Maps legacy names (Font Awesome style) to actual symbol IDs. This allows:
- `{{ icon("magnifying-glass") }}` → uses `symbol-search`
- `{{ icon("fa-heart") }}` → uses `symbol-heart-1`

### Available

List of all symbol IDs in the sprite sheets (without `symbol-` prefix).

---

## Adding a New Icon

### 1. Add to SVG Sprites

Add a `<symbol>` to both `st-line.svg` and `st-solid.svg`:

```xml
<symbol id="symbol-my-icon" viewBox="0 0 24 24">
  <!-- Your SVG paths -->
</symbol>
```

### 2. Update icons.json

Add to the `available` array:

```json
{
  "available": [..., "my-icon"]
}
```

### 3. (Optional) Add an Alias

If you want `{{ icon("some-other-name") }}` to work:

```json
{
  "aliases": {
    "some-other-name": "my-icon"
  }
}
```

### 4. Use It

```nunjucks
{{ icon("my-icon") }}
```

---

## Adding a New Alias

If you're using icons with Font Awesome names and want them to map to your symbols:

1. Edit `/src/_data/icons.json`
2. Add to the `aliases` object:

```json
{
  "aliases": {
    "fa-name": "symbol-name"
  }
}
```

That's it! Both Nunjucks and JavaScript will pick up the change automatically.

---

## CSS Classes

| Class | Purpose |
|-------|---------|
| `.stl` | Line icon SVG |
| `.sts` | Solid icon SVG |
| `.icon-duo` | Wrapper for dual-icon swap |
| `.icon-line` | Line icon within `.icon-duo` |
| `.icon-solid` | Solid icon within `.icon-duo` |

### Stroke Helpers

```html
<svg class="stl stroke-1">...</svg>  <!-- 1px stroke -->
<svg class="stl stroke-3">...</svg>  <!-- 3px stroke -->
<svg class="stl stroke-round">...</svg>  <!-- Rounded corners -->
```

### Custom Colors

```css
.my-element {
  --symbol-color-primary: blue;
  --symbol-color-secondary: red;
}
```

---

## Available Icons (212)

<details>
<summary>Click to expand full list</summary>

```
0, 1, 2, 3, 4, 5, 6, 7, 8, 9
alarm-clock, alarm, alert-high, alert-low, alert-medium
anchor, archive, arrow-down-bold, arrow-down, arrow-left-bold
arrow-left, arrow-right-bold, arrow-right, arrow-up-bold, arrow-up
asterisk, award-winner, badge-star, bandage, beer, bell
bird, bluesky, bolt, book-dictionary, book-open, book-search
book, bookmark, books, brain, brightness, butterfly
calendar-check, calendar-month, calendar, chat-bubble-dots
chat-bubble-heart, chat-bubble-phone, chat-bubble-question
chat-bubble-text, chat-bubble, check-mark-bold, check-mark
check-shield, chevron-down, chevron-left, chevron-right
chevron-up, child, circle-notch, clipboard-check, clipboard
clock, compass-circle, compass, contract-sign, contract
cookie, copy-file, copy-paste, cresent-moon, cross-shield-1
cross-shield-2, cross-square, delete, earth, envelope-check
envelope-letter, envelope, facebook-1, facebook-2, family-2
family, feather, female, field, file-text, file, files-text
files, flag, floppy-disk, folder-open, folder, fork-left
fork-right, friendship, github, google, graduation-cap
grid-2x2, grid-3x3, group, hand-holding-cross
hands-holding-cross, handshake, hashtag, headset-1, headset-2
healthcare-cross, heart-1, heart-2, heart-shield, hierarchy-1
hierarchy-2, home, hourglass, house, incognito
information-circle, information, life-ring-1, life-ring-2
lightbulb-idea, lightbulb-on, lightbulb, lighthouse, linkedin
list-check, list-unordered, location-pin-medical, location-pin
lock-locked, lock-shield, lock-unlocked, male, man-holding-baby
medical-cross, medical-ribbon, megaphone, mental-disorder, moon
mountains, newsletter, newspaper, notebook, notepad
old-person-cane, old-person-walker, paper-plane, pencil
phone-alert, phone-emergency, phone-heart, phone-ringing
phone-voice, phone, pinterest, potted-plant, psychology
pushpin, puzzle-1, puzzle-2, question-circle, question
quotation, rainbow, reddit, ribbon, rocket, scale, script
search-text, search, seedling, share-heart, share, shield-user
shield, sign, sketchpad, sleep, sos, spa, sparkles, sprout
stroller, sun, sunset-1, sunset-2, support-24h, tablet
target-bullseye, target-location, target, team, telescope
test-tube, thermometer, tiktok, traffic-cone, traffic-light
triangle-split-right, triangle-split-up-1, triangle-split-up-2
twitter, umbrella, under-construction, user-shield, users
volcano, warning-circle, warning-triangle, web, wine-glass-1
wine-glass-2, wine, woman-holding-baby, x, yin-yang
```

</details>

---

## Troubleshooting

### Icon Not Showing

1. Check the symbol exists in both SVG files
2. Check for typos in the icon name
3. Look for 404 errors in browser console
4. Verify `icons.json` alias if using legacy name

### Swap Not Working

1. Make sure icon is inside `.icon-duo` wrapper
2. Add `data-icon-swap` to the interactive parent
3. Or check if parent has built-in swap support

### Wrong Size

Icons are `1.25em × 1.25em` by default. Override with CSS:

```css
.my-element .stl,
.my-element .sts {
  height: 2em;
  width: 2em;
}
```

---

*Last updated: December 2024*
