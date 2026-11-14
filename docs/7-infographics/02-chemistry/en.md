---
x-title: Chemistry — one SMILES string, one molecule
x-desc: 'x-cmd/draw chemistry (`/draw/chem`): SMILES to a structural formula, laid out by smilesdrawer (ships with the service — no external API). Params: `smiles=` (required, alias `s=`), `w=` (120–1600), `h=` (120–1200), `theme=dark|light`. Try CCO for ethanol, aspirin, paracetamol.'
x-sidebar: draw chemistry
x-keywords: chemical structure, molecule diagram, SMILES, chemistry, draw, svg, aspirin, ethanol
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw chemistry'
      inLanguage: 'en'
      about: 'x-cmd/draw 02-chemistry'
---

# Chemistry — one SMILES string, one molecule

Hand it a SMILES string, get the molecule back: `/draw/chem?smiles=CCO` is ethanol.
Layout is smilesdrawer (MIT) and the picture is drawn by the service — no external
chemistry API, and the ~200 KB layout library loads lazily: only this endpoint
pays for it.

Two palettes ship with the site: dark (default) pads a dark card, light leaves
the page white. Atoms carry element colours (oxygen red, nitrogen blue, sulfur
yellow, …) and the explore page lets you click an atom to see its name.

## Parameters

| param | meaning | default |
|---|---|---|
| `smiles=` | the SMILES string (required; alias `s=`) | — |
| `w=` / `h=` | canvas size (w: 120–1600; h: 120–1200) | 400×360 |
| `theme=` | `dark` / `light` | dark |

`scheme=light` is equivalent to `theme=light`.

## Examples

### Ethanol

```text
https://x-cmd.com/draw/chem?smiles=CCO&w=560&h=420
```

[![Ethanol](https://x-cmd.com/draw/chem?smiles=CCO&w=560&h=420)](https://x-cmd.com/draw/explore/chem?smiles=CCO&w=560&h=420)

### Aspirin

```text
https://x-cmd.com/draw/chem?smiles=CC%28%3DO%29Oc1ccccc1C%28%3DO%29O&w=560&h=420
```

[![Aspirin](https://x-cmd.com/draw/chem?smiles=CC%28%3DO%29Oc1ccccc1C%28%3DO%29O&w=560&h=420)](https://x-cmd.com/draw/explore/chem?smiles=CC%28%3DO%29Oc1ccccc1C%28%3DO%29O&w=560&h=420)

### Paracetamol

```text
https://x-cmd.com/draw/chem?smiles=CC%28%3DO%29NC1%3DCC%3DC(C%3DC1)O&w=560&h=420
```

[![Paracetamol](https://x-cmd.com/draw/chem?smiles=CC%28%3DO%29NC1%3DCC%3DC(C%3DC1)O&w=560&h=420)](https://x-cmd.com/draw/explore/chem?smiles=CC%28%3DO%29NC1%3DCC%3DC(C%3DC1)O&w=560&h=420)

### More molecules (gallery links)

[Benzene](https://x-cmd.com/draw/chem?smiles=c1ccccc1) ·
[Acetic acid](https://x-cmd.com/draw/chem?smiles=CC%28%3DO%29O) ·
[Caffeine](https://x-cmd.com/draw/chem?smiles=Cn1cnc2c1c%28%3DO%29n%28C%29c%28%3DO%29n2C) ·
[Ibuprofen](https://x-cmd.com/draw/chem?smiles=CC%28C%29Cc1ccc%28cc1%29C%28C%29C%28%3DO%29O) ·
[Nicotine](https://x-cmd.com/draw/chem?smiles=CN1CCCC1c2cccnc2) ·
[Dopamine](https://x-cmd.com/draw/chem?smiles=NCCc1ccc%28O%29c%28O%29c1) ·
[Glucose](https://x-cmd.com/draw/chem?smiles=OC%5BC%40H%5D1OC%28O%29%5BC%40H%5D%28O%29%5BC%40%40H%5D%28O%29%5BC%40%40H%5D1O) ·
[Sucrose](https://x-cmd.com/draw/chem?smiles=OCC1OC%28CO%29C%28O%29C%28O%29C1O) ·
[Penicillin](https://x-cmd.com/draw/chem?smiles=CC1%28C%29S%5BC%40%40H%5D2%5BC%40H%5D%28NC%28%3DO%29Cc3ccccc3%29C%28%3DO%29N2%5BC%40H%5D1C%28%3DO%29O) ·
[Cholesterol](https://x-cmd.com/draw/chem?smiles=CC%28C%29CCCC%28C%29C1CCC2C3CC%3DC4CC%28O%29CCC4%28C%29C3CCC12C) ·
[ATP](https://x-cmd.com/draw/chem?smiles=NC1%3DNC%3DNC2%3DC1N%3DCN2%5BC%40%40H%5D1O%5BC%40H%5D%28COP%28%3DO%29%28O%29OP%28%3DO%29%28O%29OP%28%3DO%29%28O%29OC2%5BC%40H%5D%28O%29%5BC%40%40H%5D%28O%29%5BC%40H%5D%28O%29%5BC%40H%5D2O)

## Limits

- **The SMILES must parse.** A bad string returns 400 with smilesdrawer's own
  error; remember to URL-encode characters like spaces, `#` and `%` (`%3DO`
  is the encoded `=O`).
- **Big molecules crowd.** Dozens of atoms (cholesterol, ATP) get dense; give
  them a bigger canvas (`w=760&h=560`) than the default.
- **`theme` follows the page.** Default dark for a dark README; `theme=light`
  (or `scheme=light`) for a white document page.

## How it differs from the other kinds

This is not a statistics chart, it is a **structure diagram**: the data is not
"values" but "how the atoms connect". And since a SMILES string is one line of
text, the whole picture is one URL — drug leaflets, chemistry courseware, a
molecule sketch in a README, all paste-and-go.

More in the gallery: [/draw/demo/chem](https://x-cmd.com/draw/demo/chem).
