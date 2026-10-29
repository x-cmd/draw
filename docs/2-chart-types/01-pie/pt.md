---
x-title: pie pizza — x-cmd/draw
x-desc: Gráficos SVG para a era da IA: um único endpoint `/draw?type=. type=pie.
x-sidebar: draw
x-keywords: draw, pie, pizza, svg, chart
---

# pie pizza

`GET /draw?type=pie&...` — renderizar um gráfico

## Exemplos

**opendata**

```text
https://x-cmd.com/draw?type=pie&title=Maiores%20cidades&unit=mi&labels=S%C3%A3o%20Paulo,Rio%20de%20Janeiro,Bras%C3%ADlia,Salvador&values=12.3,6.7,3,2.9
```

![pie opendata](https://x-cmd.com/draw?type=pie&title=Maiores%20cidades&unit=mi&labels=S%C3%A3o%20Paulo,Rio%20de%20Janeiro,Bras%C3%ADlia,Salvador&values=12.3,6.7,3,2.9)

**evil**

```text
https://x-cmd.com/draw?type=pie&t=evil&title=Maiores%20cidades&unit=mi&labels=S%C3%A3o%20Paulo,Rio%20de%20Janeiro,Bras%C3%ADlia,Salvador&values=12.3,6.7,3,2.9
```

![pie evil](https://x-cmd.com/draw?type=pie&t=evil&title=Maiores%20cidades&unit=mi&labels=S%C3%A3o%20Paulo,Rio%20de%20Janeiro,Bras%C3%ADlia,Salvador&values=12.3,6.7,3,2.9)

**evil-mono**

```text
https://x-cmd.com/draw?type=pie&t=evil-mono&title=Maiores%20cidades&unit=mi&labels=S%C3%A3o%20Paulo,Rio%20de%20Janeiro,Bras%C3%ADlia,Salvador&values=12.3,6.7,3,2.9
```

![pie evil-mono](https://x-cmd.com/draw?type=pie&t=evil-mono&title=Maiores%20cidades&unit=mi&labels=S%C3%A3o%20Paulo,Rio%20de%20Janeiro,Bras%C3%ADlia,Salvador&values=12.3,6.7,3,2.9)

**market-mono**

```text
https://x-cmd.com/draw?type=pie&t=market-mono&title=Maiores%20cidades&unit=mi&labels=S%C3%A3o%20Paulo,Rio%20de%20Janeiro,Bras%C3%ADlia,Salvador&values=12.3,6.7,3,2.9
```

![pie market-mono](https://x-cmd.com/draw?type=pie&t=market-mono&title=Maiores%20cidades&unit=mi&labels=S%C3%A3o%20Paulo,Rio%20de%20Janeiro,Bras%C3%ADlia,Salvador&values=12.3,6.7,3,2.9)

**progress**

```text
https://x-cmd.com/draw?type=pie&t=progress&title=Maiores%20cidades&unit=mi&labels=S%C3%A3o%20Paulo,Rio%20de%20Janeiro,Bras%C3%ADlia,Salvador&values=12.3,6.7,3,2.9
```

![pie progress](https://x-cmd.com/draw?type=pie&t=progress&title=Maiores%20cidades&unit=mi&labels=S%C3%A3o%20Paulo,Rio%20de%20Janeiro,Bras%C3%ADlia,Salvador&values=12.3,6.7,3,2.9)

**revenue**

```text
https://x-cmd.com/draw?type=pie&t=revenue&title=Maiores%20cidades&unit=mi&labels=S%C3%A3o%20Paulo,Rio%20de%20Janeiro,Bras%C3%ADlia,Salvador&values=12.3,6.7,3,2.9
```

![pie revenue](https://x-cmd.com/draw?type=pie&t=revenue&title=Maiores%20cidades&unit=mi&labels=S%C3%A3o%20Paulo,Rio%20de%20Janeiro,Bras%C3%ADlia,Salvador&values=12.3,6.7,3,2.9)

## Parâmetros

| Parâmetros | | |
|---|---|---|
| `labels=` | rótulos, separados por vírgula | ✓ |
| `values=` | valores, separados por vírgula | ✓ |
| `title=` | título | ✗ |
| `unit=` | unidade | ✗ |
| `donut=` | 0 = pizza sólida | ✗ |
| `t=` | família de estilo | ✗ |

## `t=`

| | |
|---|---|
| `opendata` |
| `evil` |
| `evil-mono` |
| `market-mono` |
| `progress` |
| `revenue` |

## Armadilhas

- ≤100 classes; acima de 9 agrupa em Other
- pizza sólida vs. anel é só `donut=` — não troque de estilo
- o contraste de alguns estilos muda no modo escuro
- codifique espaços do título como `%20`
