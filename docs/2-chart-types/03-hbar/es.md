---
x-title: hbar barras horizontales — x-cmd/draw
x-desc: Gráficos SVG para la era de la IA: un único endpoint `/draw?type=. type=hbar.
x-sidebar: draw
x-keywords: draw, hbar, barras horizontales, svg, chart
---

# hbar barras horizontales

`GET /draw?type=hbar&...` — renderizar un gráfico

## Ejemplos

**base**

```text
https://x-cmd.com/draw?type=hbar&labels=CLI,n%C3%BAcleo,documentaci%C3%B3n,UI&values=42,31,18,9&title=Commits%20por%20%C3%A1rea
```

![hbar base](https://x-cmd.com/draw?type=hbar&labels=CLI,n%C3%BAcleo,documentaci%C3%B3n,UI&values=42,31,18,9&title=Commits%20por%20%C3%A1rea)

**opendata**

```text
https://x-cmd.com/draw?type=hbar&t=opendata&labels=CLI,n%C3%BAcleo,documentaci%C3%B3n,UI&values=8,6,9,4&ref=7&reflabel=SLA&title=Commits%20por%20%C3%A1rea
```

![hbar opendata](https://x-cmd.com/draw?type=hbar&t=opendata&labels=CLI,n%C3%BAcleo,documentaci%C3%B3n,UI&values=8,6,9,4&ref=7&reflabel=SLA&title=Commits%20por%20%C3%A1rea)

**xcmd**

```text
https://x-cmd.com/draw?type=hbar&t=xcmd&labels=Madrid,Barcelona,Valencia&values=68,21,11&title=Mayores%20ciudades
```

![hbar xcmd](https://x-cmd.com/draw?type=hbar&t=xcmd&labels=Madrid,Barcelona,Valencia&values=68,21,11&title=Mayores%20ciudades)

**xcmd-issue**

```text
https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=CLI,n%C3%BAcleo,documentaci%C3%B3n,ci,UI&series=abiertos:12,8,15,4,9&series=cerrados:38,52,20,11,26&title=Issues%20por%20%C3%A1rea
```

![hbar xcmd-issue](https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=CLI,n%C3%BAcleo,documentaci%C3%B3n,ci,UI&series=abiertos:12,8,15,4,9&series=cerrados:38,52,20,11,26&title=Issues%20por%20%C3%A1rea)

**rank**

```text
https://x-cmd.com/draw?type=hbar&t=rank&labels=Lun,Mar,Mi%C3%A9&series=2025:80,95,110&series=2026:110,85,120&title=Descargas%20semanales
```

![hbar rank](https://x-cmd.com/draw?type=hbar&t=rank&labels=Lun,Mar,Mi%C3%A9&series=2025:80,95,110&series=2026:110,85,120&title=Descargas%20semanales)

## Parámetros

| Parámetros | | |
|---|---|---|
| `labels=` | etiquetas, separadas por comas | ✓ |
| `values=` | valores, separados por comas | ✓ |
| `series=` | solo ciertos estilos: 2 series | ✗ |
| `ref=` | valor de la línea de referencia | ✗ |
| `reflabel=` | texto de la línea de referencia | ✗ |
| `t=` | familia de estilo | ✗ |

## `t=`

| | |
|---|---|
| `base` |
| `opendata` |
| `xcmd` |
| `xcmd-issue` |
| `rank` |

## Errores comunes

- ≤30 barras, por defecto una serie
- dos series solo con `t=xcmd-issue` / `t=rank`
- codifica los espacios del título como `%20`
