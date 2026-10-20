---
x-title: sankey sankey — x-cmd/draw
x-desc: Gráficos SVG para la era de la IA: un único endpoint `/draw?type=. type=sankey.
x-sidebar: draw
x-keywords: draw, sankey, sankey, svg, chart
---

# sankey sankey

`GET /draw?type=sankey&...` — renderizar un gráfico

## Ejemplos

**pipeline**

```text
https://x-cmd.com/draw?type=sankey&t=pipeline&labels=funci%C3%B3n,correcci%C3%B3n,documentaci%C3%B3n,tareas,fusionados,cerrados,rechazados,%3C1a,1%E2%80%932a,%3E2a&links=funci%C3%B3n%3Efusionados:38;funci%C3%B3n%3Ecerrados:12;funci%C3%B3n%3Erechazados:8;correcci%C3%B3n%3Efusionados:33;correcci%C3%B3n%3Ecerrados:6;correcci%C3%B3n%3Erechazados:2;documentaci%C3%B3n%3Efusionados:16;documentaci%C3%B3n%3Ecerrados:4;tareas%3Efusionados:5;tareas%3Ecerrados:6;tareas%3Erechazados:6;fusionados%3E%3C1a:52;fusionados%3E1%E2%80%932a:28;fusionados%3E%3E2a:12;cerrados%3E%3C1a:14;cerrados%3E1%E2%80%932a:9;cerrados%3E%3E2a:5;rechazados%3E%3C1a:9;rechazados%3E1%E2%80%932a:5;rechazados%3E%3E2a:2&title=Ciclo%20de%20vida%20de%20los%20PR&unit=prs
```

![sankey pipeline](https://x-cmd.com/draw?type=sankey&t=pipeline&labels=funci%C3%B3n,correcci%C3%B3n,documentaci%C3%B3n,tareas,fusionados,cerrados,rechazados,%3C1a,1%E2%80%932a,%3E2a&links=funci%C3%B3n%3Efusionados:38;funci%C3%B3n%3Ecerrados:12;funci%C3%B3n%3Erechazados:8;correcci%C3%B3n%3Efusionados:33;correcci%C3%B3n%3Ecerrados:6;correcci%C3%B3n%3Erechazados:2;documentaci%C3%B3n%3Efusionados:16;documentaci%C3%B3n%3Ecerrados:4;tareas%3Efusionados:5;tareas%3Ecerrados:6;tareas%3Erechazados:6;fusionados%3E%3C1a:52;fusionados%3E1%E2%80%932a:28;fusionados%3E%3E2a:12;cerrados%3E%3C1a:14;cerrados%3E1%E2%80%932a:9;cerrados%3E%3E2a:5;rechazados%3E%3C1a:9;rechazados%3E1%E2%80%932a:5;rechazados%3E%3E2a:2&title=Ciclo%20de%20vida%20de%20los%20PR&unit=prs)

**fund**

```text
https://x-cmd.com/draw?type=sankey&t=fund&labels=funci%C3%B3n,correcci%C3%B3n,fusionados,cerrados,%3C1a,1%E2%80%932a&links=funci%C3%B3n%3Efusionados:50;funci%C3%B3n%3Ecerrados:20;correcci%C3%B3n%3Efusionados:30;correcci%C3%B3n%3Ecerrados:10;fusionados%3E%3C1a:52;fusionados%3E1%E2%80%932a:28;cerrados%3E%3C1a:14;cerrados%3E1%E2%80%932a:9&title=Ciclo%20de%20vida%20de%20los%20PR
```

![sankey fund](https://x-cmd.com/draw?type=sankey&t=fund&labels=funci%C3%B3n,correcci%C3%B3n,fusionados,cerrados,%3C1a,1%E2%80%932a&links=funci%C3%B3n%3Efusionados:50;funci%C3%B3n%3Ecerrados:20;correcci%C3%B3n%3Efusionados:30;correcci%C3%B3n%3Ecerrados:10;fusionados%3E%3C1a:52;fusionados%3E1%E2%80%932a:28;cerrados%3E%3C1a:14;cerrados%3E1%E2%80%932a:9&title=Ciclo%20de%20vida%20de%20los%20PR)

**base**

```text
https://x-cmd.com/draw?type=sankey&labels=funci%C3%B3n,fusionados,cerrados,%3C1a,1%E2%80%932a&links=funci%C3%B3n%3Efusionados:71;funci%C3%B3n%3Ecerrados:22;fusionados%3E%3C1a:52;fusionados%3E1%E2%80%932a:19;cerrados%3E%3C1a:14;cerrados%3E1%E2%80%932a:8&title=Ciclo%20de%20vida%20de%20los%20PR
```

![sankey base](https://x-cmd.com/draw?type=sankey&labels=funci%C3%B3n,fusionados,cerrados,%3C1a,1%E2%80%932a&links=funci%C3%B3n%3Efusionados:71;funci%C3%B3n%3Ecerrados:22;fusionados%3E%3C1a:52;fusionados%3E1%E2%80%932a:19;cerrados%3E%3C1a:14;cerrados%3E1%E2%80%932a:8&title=Ciclo%20de%20vida%20de%20los%20PR)

## Parámetros

| Parámetros | | |
|---|---|---|
| `labels=` | nodos, separados por comas | ✓ |
| `links=` | flujos `A>B:valor`, separados por ; | ✓ |
| `title=` | título | ✗ |
| `unit=` | unidad | ✗ |
| `t=` | familia de estilo | ✗ |

## `t=`

| | |
|---|---|
| `base` |
| `fund` |
| `pipeline` |

## Errores comunes

- ≤24 nodos / 60 flujos; los ciclos se rechazan
- los flujos forman un DAG — el total cuadra con labels
- codifica los espacios del título como `%20`
