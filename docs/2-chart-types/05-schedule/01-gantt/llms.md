---
name: docs/2-chart-types/05-schedule/01-gantt
description: 'x-cmd/draw Gantt chart (/draw/gantt). Schedule as text: sections, tasks, durations, dependencies. Params: m (source), scale (day/week/month), t, title, w/h.'
type: reference
---

# Core Content

core_features:

  - `/draw/gantt` — schedule written as text
  - `m=` source: `dateFormat …`, `section …`, then `Name :status, id, start, duration`
  - Task status: `done` / `active` / `crit` / `milestone`
  - `after <id>` chains one task after another

# Key Information

highlights:

  - `/draw/gantt` — schedule written as text
  - `m=` source: `dateFormat …`, `section …`, then `Name :status, id, start, duration`
  - Task status: `done` / `active` / `crit` / `milestone`
  - `after <id>` chains one task after another

# Use Cases

use_cases:

  - Sprint and iteration plans
  - Project timelines with milestones
  - Release schedules and launch checklists
  - Onboarding and rollout plans

# Related Resources

official:
  endpoint: https://x-cmd.com/draw/gantt
  repo: https://github.com/x-cmd/draw
related:
  overview: docs/1-overview/01-what-is-draw/cn.md
  showcases: docs/6-showcases/01-github/cn.md
