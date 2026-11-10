---
name: docs/6-schedule/01-gantt
description: 'x-cmd/draw Gantt chart (/draw/gantt). The schedule is written as text: sections, tasks, durations, dependencies. Params: m (source), scale (day/week/month), t, title, w/h.'
type: reference
---

# Core Content

core_features:

  - `/draw/gantt` — the schedule written as text
  - `m=` source: `dateFormat YYYY-MM-DD`, `section …`, one line per task
  - A task line: `Name :status, id, start, duration`
  - Status: `done` / `active` / `crit` / `milestone`; `NN%` for progress
  - `after <id>` starts a task when another one ends
  - `scale=` the time axis: `day` / `week` / `month`

# Key Information

highlights:

  - `/draw/gantt` — the schedule written as text
  - `m=` source: `dateFormat YYYY-MM-DD`, `section …`, one line per task
  - A task line: `Name :status, id, start, duration`
  - Status: `done` / `active` / `crit` / `milestone`; `NN%` for progress
  - `after <id>` starts a task when another one ends
  - `scale=` the time axis: `day` / `week` / `month`

# Use Cases

use_cases:

  - Sprint and iteration plans
  - Project timelines with milestones
  - Release schedules and launch plans
  - Onboarding and rollout plans

# Related Resources

official:
  endpoint: https://x-cmd.com/draw/gantt
  repo: https://github.com/x-cmd/draw
related:
  overview: docs/1-overview/01-what-is-draw/cn.md
  showcases: docs/9-showcases/01-github/cn.md
