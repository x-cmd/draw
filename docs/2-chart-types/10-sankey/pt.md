---
x-title: sankey sankey — x-cmd/draw
x-desc: Gráficos SVG para a era da IA: um único endpoint `/draw?type=. type=sankey.
x-sidebar: draw
x-keywords: draw, sankey, sankey, svg, chart
---

# sankey sankey

`GET /draw?type=sankey&...` — renderizar um gráfico

## Exemplos

**pipeline**

```text
https://x-cmd.com/draw?type=sankey&t=pipeline&labels=fun%C3%A7%C3%A3o,fix,documenta%C3%A7%C3%A3o,tarefas,mesclados,fechados,rejeitados,%3C1a,1%E2%80%932a,%3E2a&links=fun%C3%A7%C3%A3o%3Emesclados:38;fun%C3%A7%C3%A3o%3Efechados:12;fun%C3%A7%C3%A3o%3Erejeitados:8;fix%3Emesclados:33;fix%3Efechados:6;fix%3Erejeitados:2;documenta%C3%A7%C3%A3o%3Emesclados:16;documenta%C3%A7%C3%A3o%3Efechados:4;tarefas%3Emesclados:5;tarefas%3Efechados:6;tarefas%3Erejeitados:6;mesclados%3E%3C1a:52;mesclados%3E1%E2%80%932a:28;mesclados%3E%3E2a:12;fechados%3E%3C1a:14;fechados%3E1%E2%80%932a:9;fechados%3E%3E2a:5;rejeitados%3E%3C1a:9;rejeitados%3E1%E2%80%932a:5;rejeitados%3E%3E2a:2&title=Ciclo%20de%20vida%20dos%20PRs&unit=prs
```

![sankey pipeline](https://x-cmd.com/draw?type=sankey&t=pipeline&labels=fun%C3%A7%C3%A3o,fix,documenta%C3%A7%C3%A3o,tarefas,mesclados,fechados,rejeitados,%3C1a,1%E2%80%932a,%3E2a&links=fun%C3%A7%C3%A3o%3Emesclados:38;fun%C3%A7%C3%A3o%3Efechados:12;fun%C3%A7%C3%A3o%3Erejeitados:8;fix%3Emesclados:33;fix%3Efechados:6;fix%3Erejeitados:2;documenta%C3%A7%C3%A3o%3Emesclados:16;documenta%C3%A7%C3%A3o%3Efechados:4;tarefas%3Emesclados:5;tarefas%3Efechados:6;tarefas%3Erejeitados:6;mesclados%3E%3C1a:52;mesclados%3E1%E2%80%932a:28;mesclados%3E%3E2a:12;fechados%3E%3C1a:14;fechados%3E1%E2%80%932a:9;fechados%3E%3E2a:5;rejeitados%3E%3C1a:9;rejeitados%3E1%E2%80%932a:5;rejeitados%3E%3E2a:2&title=Ciclo%20de%20vida%20dos%20PRs&unit=prs)

**fund**

```text
https://x-cmd.com/draw?type=sankey&t=fund&labels=fun%C3%A7%C3%A3o,fix,mesclados,fechados,%3C1a,1%E2%80%932a&links=fun%C3%A7%C3%A3o%3Emesclados:50;fun%C3%A7%C3%A3o%3Efechados:20;fix%3Emesclados:30;fix%3Efechados:10;mesclados%3E%3C1a:52;mesclados%3E1%E2%80%932a:28;fechados%3E%3C1a:14;fechados%3E1%E2%80%932a:9&title=Ciclo%20de%20vida%20dos%20PRs
```

![sankey fund](https://x-cmd.com/draw?type=sankey&t=fund&labels=fun%C3%A7%C3%A3o,fix,mesclados,fechados,%3C1a,1%E2%80%932a&links=fun%C3%A7%C3%A3o%3Emesclados:50;fun%C3%A7%C3%A3o%3Efechados:20;fix%3Emesclados:30;fix%3Efechados:10;mesclados%3E%3C1a:52;mesclados%3E1%E2%80%932a:28;fechados%3E%3C1a:14;fechados%3E1%E2%80%932a:9&title=Ciclo%20de%20vida%20dos%20PRs)

**base**

```text
https://x-cmd.com/draw?type=sankey&labels=fun%C3%A7%C3%A3o,mesclados,fechados,%3C1a,1%E2%80%932a&links=fun%C3%A7%C3%A3o%3Emesclados:71;fun%C3%A7%C3%A3o%3Efechados:22;mesclados%3E%3C1a:52;mesclados%3E1%E2%80%932a:19;fechados%3E%3C1a:14;fechados%3E1%E2%80%932a:8&title=Ciclo%20de%20vida%20dos%20PRs
```

![sankey base](https://x-cmd.com/draw?type=sankey&labels=fun%C3%A7%C3%A3o,mesclados,fechados,%3C1a,1%E2%80%932a&links=fun%C3%A7%C3%A3o%3Emesclados:71;fun%C3%A7%C3%A3o%3Efechados:22;mesclados%3E%3C1a:52;mesclados%3E1%E2%80%932a:19;fechados%3E%3C1a:14;fechados%3E1%E2%80%932a:8&title=Ciclo%20de%20vida%20dos%20PRs)

## Parâmetros

| Parâmetros | | |
|---|---|---|
| `labels=` | nós, separados por vírgula | ✓ |
| `links=` | fluxos `A>B:valor`, separados por ; | ✓ |
| `title=` | título | ✗ |
| `unit=` | unidade | ✗ |
| `t=` | família de estilo | ✗ |

## `t=`

| | |
|---|---|
| `base` |
| `fund` |
| `pipeline` |

## Armadilhas

- ≤24 nós / 60 fluxos; ciclos são rejeitados
- os fluxos formam um DAG — o total fecha com labels
- codifique espaços do título como `%20`
