---
x-title: hbar barras horizontais — x-cmd/draw
x-desc: Gráficos SVG para a era da IA: um único endpoint `/draw?type=. type=hbar.
x-sidebar: draw
x-keywords: draw, hbar, barras horizontais, svg, chart
---

# hbar barras horizontais

`GET /draw?type=hbar&...` — renderizar um gráfico

## Exemplos

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
https://x-cmd.com/draw?type=hbar&t=xcmd&labels=S%C3%A3o%20Paulo,Rio%20de%20Janeiro,Bras%C3%ADlia&values=68,21,11&title=Maiores%20cidades
```

![hbar xcmd](https://x-cmd.com/draw?type=hbar&t=xcmd&labels=S%C3%A3o%20Paulo,Rio%20de%20Janeiro,Bras%C3%ADlia&values=68,21,11&title=Maiores%20cidades)

**xcmd-issue**

```text
https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=CLI,n%C3%BAcleo,documentaci%C3%B3n,ci,UI&series=abertas:12,8,15,4,9&series=fechadas:38,52,20,11,26&title=Issues%20por%20%C3%A1rea
```

![hbar xcmd-issue](https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=CLI,n%C3%BAcleo,documentaci%C3%B3n,ci,UI&series=abertas:12,8,15,4,9&series=fechadas:38,52,20,11,26&title=Issues%20por%20%C3%A1rea)

**rank**

```text
https://x-cmd.com/draw?type=hbar&t=rank&labels=Seg,Ter,Qua&series=2025:80,95,110&series=2026:110,85,120&title=Downloads%20semanais
```

![hbar rank](https://x-cmd.com/draw?type=hbar&t=rank&labels=Seg,Ter,Qua&series=2025:80,95,110&series=2026:110,85,120&title=Downloads%20semanais)

## Parâmetros

| Parâmetros | | |
|---|---|---|
| `labels=` | rótulos, separados por vírgula | ✓ |
| `values=` | valores, separados por vírgula | ✓ |
| `series=` | só alguns estilos: 2 séries | ✗ |
| `ref=` | valor da linha de referência | ✗ |
| `reflabel=` | texto da linha de referência | ✗ |
| `t=` | família de estilo | ✗ |

## `t=`

| | |
|---|---|
| `base` |
| `opendata` |
| `xcmd` |
| `xcmd-issue` |
| `rank` |

## Armadilhas

- ≤30 barras, por padrão uma série
- duas séries só com `t=xcmd-issue` / `t=rank`
- codifique espaços do título como `%20`
