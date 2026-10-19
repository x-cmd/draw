# draw — Des graphiques SVG avec les données dans l’URL

> [English](../README.md) | **Français**

[![JSR score](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fapi.jsr.io%2Fscopes%2Fx-cmd%2Fpackages%2Fdraw&query=%24.score&label=JSR%20score&color=yellowgreen)](https://jsr.io/@x-cmd/draw/score)
[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/x-cmd/draw/badge)](https://securityscorecards.dev/viewer/?uri=github.com/x-cmd/draw)

Des graphiques SVG pour l’ère de l’IA : un seul endpoint `/draw?type=...`, les données dans l’URL et un `<metadata>` lisible par machine dans chaque sortie. Le système de styles suit une spec de design, avec plusieurs variantes par type de graphique.

## Aperçu

Toutes les données vivent dans l’URL — ouvrez-la dans un navigateur, intégrez-la en `<img>` ou collez-la dans votre README : le SVG se génère aussitôt.

### Sankey — cycle de vie des PR (`type=sankey&t=pipeline`)

```text
https://x-cmd.com/draw?type=sankey&t=pipeline&labels=feat,fix,docs,chore,merged,closed,rejected,0-1y,1-2y,2y%2B&links=feat%3Emerged:38;feat%3Eclosed:12;feat%3Erejected:8;fix%3Emerged:33;fix%3Eclosed:6;fix%3Erejected:2;docs%3Emerged:16;docs%3Eclosed:4;chore%3Emerged:5;chore%3Eclosed:6;chore%3Erejected:6;merged%3E0-1y:52;merged%3E1-2y:28;merged%3E2y%2B:12;closed%3E0-1y:14;closed%3E1-2y:9;closed%3E2y%2B:5;rejected%3E0-1y:9;rejected%3E1-2y:5;rejected%3E2y%2B:2&title=Pull%20requests%20lifecycle&unit=prs
```

![Sankey — cycle de vie des PR](https://x-cmd.com/draw?type=sankey&t=pipeline&labels=feat,fix,docs,chore,merged,closed,rejected,0-1y,1-2y,2y%2B&links=feat%3Emerged:38;feat%3Eclosed:12;feat%3Erejected:8;fix%3Emerged:33;fix%3Eclosed:6;fix%3Erejected:2;docs%3Emerged:16;docs%3Eclosed:4;chore%3Emerged:5;chore%3Eclosed:6;chore%3Erejected:6;merged%3E0-1y:52;merged%3E1-2y:28;merged%3E2y%2B:12;closed%3E0-1y:14;closed%3E1-2y:9;closed%3E2y%2B:5;rejected%3E0-1y:9;rejected%3E1-2y:5;rejected%3E2y%2B:2&title=Pull%20requests%20lifecycle&unit=prs)

### Hbar — débit du runtime (mesuré) (`type=hbar; draw() ops/s : deno 7238 · node 6553 · bun 4972, Apple Silicon`)

```text
https://x-cmd.com/draw?type=hbar&labels=deno,node,bun&values=7238,6553,4972&title=Runtime%20throughput&unit=ops%2Fs
```

![Hbar — débit du runtime (mesuré)](https://x-cmd.com/draw?type=hbar&labels=deno,node,bun&values=7238,6553,4972&title=Runtime%20throughput&unit=ops%2Fs)

### Radar — comparaison de trois éditeurs (`type=radar&t=evil`)

```text
https://x-cmd.com/draw?type=radar&t=evil&labels=startup,ecosystem,extensibility,memory,ease&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Editor%20comparison
```

![Radar — comparaison de trois éditeurs](https://x-cmd.com/draw?type=radar&t=evil&labels=startup,ecosystem,extensibility,memory,ease&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Editor%20comparison)

### Combiné — téléchargements et croissance (`type=combo`)

```text
https://x-cmd.com/draw?type=combo&labels=Lun,Mar,Mer,Jeu,Ven,Sam,Dim&series=T%C3%A9l%C3%A9chargements:120,180,150,210,240,200,260&line=Croissance:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=T%C3%A9l%C3%A9chargements%20hebdo&unit=dl
```

![Combiné — téléchargements et croissance](https://x-cmd.com/draw?type=combo&labels=Lun,Mar,Mer,Jeu,Ven,Sam,Dim&series=T%C3%A9l%C3%A9chargements:120,180,150,210,240,200,260&line=Croissance:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=T%C3%A9l%C3%A9chargements%20hebdo&unit=dl)

### Hbar — issues ouvertes/fermées (papillon) (`type=hbar&t=xcmd-issue`)

```text
https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=cli,core,docs,ci,ui&series=ouvertes:12,8,15,4,9&series=ferm%C3%A9es:38,52,20,11,26&title=Issues%20par%20domaine
```

![Hbar — issues ouvertes/fermées (papillon)](https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=cli,core,docs,ci,ui&series=ouvertes:12,8,15,4,9&series=ferm%C3%A9es:38,52,20,11,26&title=Issues%20par%20domaine)

### Anneau — plus grandes villes (`type=pie&t=market-mono`)

```text
https://x-cmd.com/draw?type=pie&t=market-mono&title=Plus%20grandes%20villes&unit=M%20hab.&labels=Paris,Marseille,Lyon,Toulouse&values=2.1,0.9,0.5,0.5
```

![Anneau — plus grandes villes](https://x-cmd.com/draw?type=pie&t=market-mono&title=Plus%20grandes%20villes&unit=M%20hab.&labels=Paris,Marseille,Lyon,Toulouse&values=2.1,0.9,0.5,0.5)

## Trois façons de l’utiliser

**Service hébergé (zéro installation)** — `https://x-cmd.com/draw?type=pie&labels=A,B&values=3,2`

**Bibliothèque npm + CLI (hors ligne, synchrone)** (`npm i -g @x-cmd/draw` / `npx`):

```sh
npm install @x-cmd/draw
```
```ts
import { draw } from '@x-cmd/draw';
const { svg } = draw({ type: 'pie', labels: 'A,B', values: '3,2', t: 'evil', scheme: 'dark' });
// chaîne de requête acceptée aussi : draw('?type=bar&labels=Lun,Mar&values=3,5')
// tableaux = paramètres répétés (libellés avec virgules)
draw({ type: 'bar', labels: ['Q1, 2024', 'Q2'], values: [1, 2] })
```
```sh
draw --type pie --labels "A,B,C" --values "3,2,1" --out pie.svg
draw "?type=hbar&labels=a,b,c&values=3,2,1&t=xcmd"   # chaîne de requête brute
```

**Auto-hébergement**:

```sh
git clone https://github.com/x-cmd/draw && cd draw && npm install
npm run serve      # serveur Node local :8787 avec page démo
npm run dev        # wrangler dev
bash scripts/setup.sh   # déploiement en un clic sur votre compte Cloudflare
```

Variables d’environnement (Node) : `PORT` (8787) · `BASE_PATH` · `DATA_REPO`/`DATA_BRANCH`/`GITHUB_TOKEN` (active les liens courts POST).

**Deno** — le cœur de rendu est pur, sans réseau — le sandbox sans permission est la frontière de sécurité:

```ts
import { draw } from "jsr:@x-cmd/draw";
const { svg } = draw({ type: "pie", labels: "A,B", values: "3,2" });
```

## Endpoints

**`GET /draw?type=<pie|bar|hbar|line|area|radar|gauge|scatter|combo|sankey|qr>`** — rendre un graphique

| type | | |
|---|---|---|
| `pie` | Donut ; `donut=0` = camembert plein<br><br>**<u>≤100 classes (>9 → Other)</u>** | <a href="https://x-cmd.com/draw?type=pie&labels=TS,Py,Go,Rust&values=4821,2312,980,645&title=%C3%89toiles%20par%20langage"><img src="https://x-cmd.com/draw?type=pie&labels=TS,Py,Go,Rust&values=4821,2312,980,645&title=%C3%89toiles%20par%20langage" width="360" alt="example"></a> |
| `bar` | Colonnes groupées ; `stack=1` empilées<br><br>**<u>≤30 groupes</u>** | <a href="https://x-cmd.com/draw?type=bar&labels=Lun,Mar,Mer&series=dev:12,18,9&series=ci:8,11,6"><img src="https://x-cmd.com/draw?type=bar&labels=Lun,Mar,Mer&series=dev:12,18,9&series=ci:8,11,6" width="360" alt="example"></a> |
| `hbar` | Barres horizontales (classements)<br><br>**<u>≤30 barres</u>** | <a href="https://x-cmd.com/draw?type=hbar&labels=cli,core,docs,ui&values=42,31,18,9&title=Commits%20par%20domaine"><img src="https://x-cmd.com/draw?type=hbar&labels=cli,core,docs,ui&values=42,31,18,9&title=Commits%20par%20domaine" width="360" alt="example"></a> |
| `line` | Courbe lisse + dégradé / multicourbes<br><br>**<u>≤60 points</u>** | <a href="https://x-cmd.com/draw?type=line&labels=Jan,F%C3%A9v,Mar,Avr,Mai,Juin&values=12,19,15,25,22,30&title=%C3%89toiles%20par%20langage"><img src="https://x-cmd.com/draw?type=line&labels=Jan,F%C3%A9v,Mar,Avr,Mai,Juin&values=12,19,15,25,22,30&title=%C3%89toiles%20par%20langage" width="360" alt="example"></a> |
| `area` | Aire / multi-aires<br><br>**<u>≤60 points</u>** | <a href="https://x-cmd.com/draw?type=area&labels=Q1,Q2,Q3,Q4&values=8,14,23,37&title=T%C3%A9l%C3%A9chargements"><img src="https://x-cmd.com/draw?type=area&labels=Q1,Q2,Q3,Q4&values=8,14,23,37&title=T%C3%A9l%C3%A9chargements" width="360" alt="example"></a> |
| `radar` | Radar<br><br>**<u>3–12 axes</u>** | <a href="https://x-cmd.com/draw?type=radar&t=evil&labels=startup,ecosystem,extensibility,memory,ease&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Editor%20comparison"><img src="https://x-cmd.com/draw?type=radar&t=evil&labels=startup,ecosystem,extensibility,memory,ease&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Editor%20comparison" width="360" alt="example"></a> |
| `gauge` | Jauge (arc 240°, valeur centrale)<br><br>**<u>value+max ; anneaux ≤8</u>** | <a href="https://x-cmd.com/draw?type=gauge&title=Taux%20de%20CI&value=87&max=100"><img src="https://x-cmd.com/draw?type=gauge&title=Taux%20de%20CI&value=87&max=100" width="360" alt="example"></a> |
| `scatter` | Nuage de points, deux axes numériques, négatifs ok<br><br>**<u>x=&y=, ≤200 points</u>** | <a href="https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=Latence"><img src="https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=Latence" width="360" alt="example"></a> |
| `combo` | Colonnes (`series=`) + ligne (`line=`) ; double axe au-delà de 5× d’écart<br><br>**<u>≤30 groupes, ≤6 séries</u>** | <a href="https://x-cmd.com/draw?type=combo&labels=Lun,Mar,Mer,Jeu,Ven,Sam,Dim&series=T%C3%A9l%C3%A9chargements:120,180,150,210,240,200,260&line=Croissance:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=T%C3%A9l%C3%A9chargements%20hebdo&unit=dl"><img src="https://x-cmd.com/draw?type=combo&labels=Lun,Mar,Mer,Jeu,Ven,Sam,Dim&series=T%C3%A9l%C3%A9chargements:120,180,150,210,240,200,260&line=Croissance:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=T%C3%A9l%C3%A9chargements%20hebdo&unit=dl" width="360" alt="example"></a> |
| `sankey` | Diagramme de flux pondéré<br><br>**<u>labels=+links=A>B:30, ≤24 nœuds</u>** | <a href="https://x-cmd.com/draw?type=sankey&t=pipeline&labels=feat,fix,docs,chore,merged,closed,rejected,0-1y,1-2y,2y%2B&links=feat%3Emerged:38;feat%3Eclosed:12;feat%3Erejected:8;fix%3Emerged:33;fix%3Eclosed:6;fix%3Erejected:2;docs%3Emerged:16;docs%3Eclosed:4;chore%3Emerged:5;chore%3Eclosed:6;chore%3Erejected:6;merged%3E0-1y:52;merged%3E1-2y:28;merged%3E2y%2B:12;closed%3E0-1y:14;closed%3E1-2y:9;closed%3E2y%2B:5;rejected%3E0-1y:9;rejected%3E1-2y:5;rejected%3E2y%2B:2&title=Pull%20requests%20lifecycle&unit=prs"><img src="https://x-cmd.com/draw?type=sankey&t=pipeline&labels=feat,fix,docs,chore,merged,closed,rejected,0-1y,1-2y,2y%2B&links=feat%3Emerged:38;feat%3Eclosed:12;feat%3Erejected:8;fix%3Emerged:33;fix%3Eclosed:6;fix%3Erejected:2;docs%3Emerged:16;docs%3Eclosed:4;chore%3Emerged:5;chore%3Eclosed:6;chore%3Erejected:6;merged%3E0-1y:52;merged%3E1-2y:28;merged%3E2y%2B:12;closed%3E0-1y:14;closed%3E1-2y:9;closed%3E2y%2B:5;rejected%3E0-1y:9;rejected%3E1-2y:5;rejected%3E2y%2B:2&title=Pull%20requests%20lifecycle&unit=prs" width="360" alt="example"></a> |
| `qr` | QR code<br><br>**<u>d≤1000 caractères, fg/bg, title/unit</u>** | <a href="https://x-cmd.com/draw?type=qr&d=https://github.com/x-cmd/draw&title=scannez"><img src="https://x-cmd.com/draw?type=qr&d=https://github.com/x-cmd/draw&title=scannez" width="360" alt="example"></a> |

**`GET /draw`** — page démo · **`POST /draw?type=...`** — un body JSON/CSV crée un lien court permanent · **`GET /draw/c/<hash>`** — rendu du lien court (immuable)

## Styles (`?t=`)

| type | |
|---|---|
| `pie` | opendata (défaut) · evil · evil-mono · market-mono · progress · revenue |
| `bar` | evil (défaut) · base · grid |
| `hbar` | base (défaut) · opendata (ref=) · xcmd · xcmd-issue · rank |
| `line` | shadcn (défaut) · evil · evil-glow · evil-mono · opendata |
| `area` | evil (défaut) · star · opendata · pixel · polka |
| `radar` | base (défaut) · evil · xcmd |
| `sankey` | base (défaut) · fund · pipeline |
| `gauge` | base (défaut) · gradient · reliability |
| `scatter/combo/qr` | base (combo a aussi evil) |

## Transmettre les données

```text
https://x-cmd.com/draw?type=pie&title=%C3%89toiles%20par%20langage&labels=TypeScript,Python,Go&values=4821,2312,980
```

Libellés avec virgules : répétez le paramètre (`labels=Q1, 2024&labels=Q2`). Données complexes : `?d=` + JSON encodé URL :

```json
{"title":"...","data":[{"label":"A","value":1}]}
```

## Liens courts

POST génère un lien court permanent adressé par le contenu (dépôt GitHub comme stockage) :

- mêmes données → même hash (idempotent, dédupliqué)
- limite 30 requêtes/min/IP
- stockage public — rien de sensible

## Versionnage

- sans `v` : dernière version, cache 300 s
- `v=N` : version épinglée, cache 1 jour
- `immutable` uniquement pour `/c/<hash>`

## Adapté à l’IA

Chaque SVG embarque du JSON : `{generator, template, version, spec}` — données et paramètres font l’aller-retour directement ; le texte est du vrai `<text>`.

## Auto-hébergement en une étape

```sh
curl -fsSL https://raw.githubusercontent.com/x-cmd/draw/main/scripts/setup.sh | bash
```

Le script clone, connecte wrangler, déploie et affiche votre URL `*.workers.dev`. Les liens courts (POST) s’activent via `DATA_REPO` + `GITHUB_TOKEN`.

## Développement

```sh
npm install
npm run dev      # wrangler dev
npm test         # vitest (120)
npm run check    # tsc ×3
npm run build    # dist/
```

## Licence

Code Apache-2.0 ; polices OFL — [LICENSE](../LICENSE) · Documentation complète: [README (EN)](../README.md)
