# Retorn al Territori

**Retorn al Territori** és un joc geogràfic i d'exploració del patrimoni de Catalunya basat en fotografies històriques. A cada ronda, el jugador ha d'identificar al mapa el lloc on es va fer la fotografia i posar a prova el seu coneixement del territori. El projecte té una finalitat educativa i divulgativa i convida a descobrir l'evolució del paisatge i dels espais patrimonials catalans.

## Llicència

El codi propi d'aquest projecte es distribueix sota la llicència [MIT](LICENSE).

Les fotografies i les seves metadades s'inclouen amb finalitats exclusivament educatives, culturals i divulgatives, sense ànim de lucre ni finalitat comercial. Els drets corresponents poden pertànyer als seus autors o a les institucions titulars i poden estar subjectes a condicions específiques de llicència i atribució segons la font original. Aquest projecte no autoritza la reutilització, reproducció o explotació comercial d'aquests materials. Consulta sempre l'enllaç de procedència i les condicions aplicables abans de reutilitzar qualsevol fotografia o dada.

## Modes de joc

- **Repte Diari** — 3 fotografies fixes per dia, iguals per a tothom: una de nivell 1, una de nivell 2 i una de nivell 3, sempre en aquest ordre. Cada fotografia té assignat el camp `challengeDate` (`DD/MM/AAAA`). Les fotografies sense data queden reservades per a futurs reptes.

## Stack tecnològic

- **Vite 7** + **Vue 3.5** + **TypeScript 5.6**
- **TailwindCSS 3.4** — disseny i estils
- **MapLibre GL JS 5** — mapa interactiu (tiles d'OpenStreetMap)
- **Pinia / Zustand** — gestió d'estat
- **GitHub Actions** — desplegament automàtic a GitHub Pages

---

## Posada en marxa local

```bash
git clone https://github.com/CatMAPPs/carto-guesser.git
cd carto-guesser
npm install
npm run dev
```

L'app estarà disponible a `http://localhost:3000`

### Altres comandes

```bash
npm run build      # Genera el build de producció a dist/
npm run preview    # Previsualitza el build localment
npm run lint       # Comprova i corregeix el codi
```

---

## Desplegament (GitHub Pages)
git add .
git commit -m "el teu missatge"
git push

El desplegament és automàtic: cada push a la branca `main` llança el workflow de GitHub Actions que fa el build i publica a GitHub Pages.

URL pública: **https://catmapps.github.io/carto-guesser/**

Per activar-ho per primer cop:
1. Ves a **Settings → Pages** del repositori
2. A *Source*, selecciona **GitHub Actions**
3. Fes un push a `main`

---

## Com afegir fotografies

Les fotografies i les seves metadades es gestionen amb dos fitxers a la carpeta `public/`:

### 1. Afegir la imatge

Copia el fitxer d'imatge (`.jpg`, `.png`, `.webp`) a:

```
public/images/nom_del_fitxer.jpg
```

Recomanacions:
- Amplada màxima: **1200 px** (per no alentir la càrrega)
- Format preferit: **JPEG** amb qualitat 80–85%
- Nom de fitxer sense espais ni accents (ex: `girona_catedral.jpg`)

### 2. Afegir l'entrada al JSON

Obre `public/figures.json` i afegeix una entrada al final de l'array:

```json
{
  "id": "7",
  "nom": "Catedral de Girona",
  "nom_fitxer": "girona_catedral.jpg",
  "autor": "Autor desconegut",
  "lat": 41.9873,
  "lon": 2.8251,
  "any_foto": 1920,
  "descripcio": "Vista de la Catedral de Girona des de la plaça."
}
```

| Camp | Tipus | Descripció |
|---|---|---|
| `id` | string | Identificador únic (número correllatiu) |
| `nom` | string | Nom del lloc o descripció breu |
| `nom_fitxer` | string | Nom del fitxer a `public/images/` |
| `autor` | string | Autor de la fotografia |
| `lat` | number | Latitud decimal (ex: `41.9873`) |
| `lon` | number | Longitud decimal (ex: `2.8251`) |
| `any_foto` | number | Any aproximat de la fotografia |
| `descripcio` | string | Descripció mostrada a la pantalla de resultats |

> Per obtenir les coordenades: obre [Google Maps](https://maps.google.com), fes clic dret sobre el punt exacte → *"Quines són les coordenades d'aquí?"*

### 3. Publicar els canvis

```bash
git add public/images/girona_catedral.jpg public/figures.json
git commit -m "Afegir fotografia de la Catedral de Girona"
git push
```

El workflow redesplegarà automàticament.

---

## Paràmetres configurables

### Puntuació per distància

**Fitxer:** `src/lib/scoring/spatialScore.ts`

```typescript
const score = Math.max(0, Math.round(800 - distance * 8))
```

La fórmula és lineal: `800 punts - (distància_km × multiplicador)`.

| Multiplicador | 0 punts a... | Exemple: 50 km |
|---|---|---|
| `* 4` | 200 km | 600 pts |
| `* 5` | 160 km | 550 pts |
| `* 8` *(actual)* | 100 km | 400 pts |
| `* 10` | 80 km | 300 pts |

Per fer el joc més generós, **redueix** el multiplicador. Per fer-lo més estricte, **augmenta'l**.

---

### Nombre de rondes del repte diari

**Fitxer:** `src/views/DailyChallengeView.vue`

Canvia la constant `DAILY_ROUNDS` per ajustar el nombre de fotografies:

```html
const DAILY_ROUNDS = 3
```

El repte diari es configura mitjançant el camp `challengeDate` de `public/figures.json`, amb el format `DD/MM/AAAA`. Cada data ha de tenir exactament tres fotografies: una de `level: 1`, una de `level: 2` i una de `level: 3`. La funció `getDailyChallengeFigures` filtra les fotografies per `challengeDate`, les ordena per nivell i les retorna sempre en l'ordre 1 → 2 → 3.

Exemple per a l'1 de setembre de 2026:

```json
[
  { "level": 1, "challengeDate": "01/09/2026" },
  { "level": 2, "challengeDate": "01/09/2026" },
  { "level": 3, "challengeDate": "01/09/2026" }
]
```

Les fotografies amb `"challengeDate": null` queden reservades per a futurs reptes. Si la data actual encara no té un repte assignat, el sistema mostra tres d'aquestes fotografies reservades, seleccionades de manera estable.

---

### Rang d'anys de les fotografies (TimelineSlider)

**Fitxer:** `src/components/game/TimelineSlider.vue`

```typescript
const MIN_YEAR = 1839  // any de la invenció de la fotografia
const MAX_YEAR = 2025
```

---

### Mapa: zoom i centre inicial

**Fitxer:** `src/composables/useMap.ts`

```typescript
const defaultOptions = {
  center: [20, 0],  // [lat, lon] — centre del món per defecte
  zoom: 2,
  minZoom: 2,
  maxZoom: 18,
}
```

Per centrar el mapa a Catalunya per defecte, canvia `center` a `[41.7, 1.8]` i `zoom` a `7`.

---

### Línia entre pins (revelació)

**Fitxer:** `src/composables/useMap.ts` — funció `showCorrectLocation`

```typescript
paint: {
  'line-color': '#000000',  // color de la línia
  'line-width': 4,          // gruix en píxels
  'line-opacity': 0.9,
  'line-dasharray': [4, 4], // [longitud guió, longitud espai]
}
```

---

### Colors i tema visual

**Fitxer:** `tailwind.config.js`

```js
colors: {
  noir: {
    bg:      '#0e0d0d',   // fons principal
    surface: '#1b1918',   // targetes i panells
    text:    '#EDE0CE',   // text principal
    red:     '#6b1414',   // botó primari
    gold:    '#D4A843',   // accents i or
    muted:   '#2a2826',   // elements atenuats
  }
}
```

---

## Estructura del projecte

```
public/
├── figures.json          # Dades de totes les fotografies
├── images/               # Imatges de les fotografies
└── logos/                # Logos del projecte

src/
├── components/
│   ├── game/             # Components de joc (mapa, foto, puntuació...)
│   └── ui/               # Components d'interfície (menú, botons, modal...)
├── composables/
│   └── useMap.ts         # Lògica del mapa MapLibre GL JS
├── lib/
│   ├── scoring/          # Càlcul de puntuació
│   │   └── spatialScore.ts
│   └── geography/        # Càlcul de distàncies (Haversine)
├── stores/               # Estat global (Zustand/Pinia)
├── views/                # Pàgines principals
├── router/               # Configuració de Vue Router
├── types/                # Definicions TypeScript
└── styles/               # CSS global i Tailwind
```

---

