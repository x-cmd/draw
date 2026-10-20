---
name: 15-radar
description: 'x-cmd/draw radar chart (type=radar). Multi-dimension comparison: products / candidates / plans scored across multiple axes. Params: labels (dimensions) + values (scores) or series (multiple objects). Value range usually 0-100. All dimensions must use the same range for fair comparison.'
type: reference
---

# Core Content

core_features:

  - `type=radar` — radar / spider chart
  - `labels=` dimension names, `values=` scores (single object)
  - Multi-object overlay: `series=A:v1,v2,...&series=B:v1,v2,...`
  - 3-7 dimensions optimal
  - All dimensions same value range

# Key Information

highlights:

  - **Optimal 3-7 dimensions**: < 3 hard to see shape; > 7 too dense
  - **Same value range across all dimensions** — mixing 0-100 and 0-10 distorts
  - Multi-object overlay compares side-by-side
  - Series name = legend label (can be Chinese)

# Use Cases

use_cases:

  - Product comparison across multiple dimensions
  - Candidate evaluation
  - Skill assessment
  - Multi-criteria decision making

# Related Resources

official:
  endpoint: https://x-cmd.com/draw?type=radar
related:
  overview: docs/2-overview/zh.md