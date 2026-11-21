---
name: docs/9-showcases/16-riemann-hypothesis
description: 'x-cmd/draw showcase: reading the November 2026 claim that Anthropic mathematician Levent Alpöge and Claude proved the Riemann Hypothesis. A 167-year milestone timeline (1793 Gauss, 1859 Riemann, 2000 Clay Prize, 2026 Claude results), a real-count bar chart of prime density decaying from 40% to 7.85%, and a horizontal-bar comparison of the critical-line lower bound jumping from 41.6% to 67.2% — each chart an ECharts URL with an explore page.'
type: reference
---

# Core Content

core_features:

  - The November 20, 2026 claim: Anthropic mathematician Levent Alpöge says he and Claude found a complete proof, released as 14 Lean archives rather than a readable paper, with a path to the Generalized Riemann Hypothesis
  - A milestone timeline from Gauss (1793) and Riemann (1859) through the 2000 Clay Millennium Prize to the 2026 Claude results and ongoing verification, with the actual gaps between adjacent events labeled
  - Prime-density decay from real sieve counts — the share of primes among integers up to x falls from 40% (x=10) to 7.85% (x=1,000,000)
  - The critical-line lower-bound comparison: the previous mathematicians' record of about 41.6% versus Claude's 67.2% of non-trivial zeros proven on the critical line (and simple), with the 100% target line marking what the Riemann Hypothesis requires
  - All three charts are pasteable `x-cmd.com/draw/echarts` URLs, each linking to an interactive explore page; Chinese and English article versions ship language-matched chart specs

# Key Information

highlights:

  - The Riemann Hypothesis (1859) is one of seven Clay Millennium Prize Problems with a $1 million reward; it had been open for 167 years
  - In August 2026 Claude raised the proven lower bound of zeros on the critical line from about 41.6% to 67.2%, an improvement of roughly 25 percentage points; Lamzouri posted a simpler proof of the same result on arXiv in September
  - The full proof claim exists only as Lean formalized code — a human-readable rendering could exceed 250,000 pages per Alpöge
  - Terence Tao notes the claim still needs verification and digestion; no independent peer review or readable formal paper exists yet, so the accurate framing is "a claim under verification," not a proven theorem
  - The prime-density chart uses verifiable sieve counts (e.g. 78,498 primes below 1,000,000), not estimates

# Use Cases

use_cases:

  - Explaining a century-spanning mathematics story to a general audience with a milestone timeline
  - Turning abstract number theory (prime distribution, critical-line zeros) into readable bar charts grounded in real counts
  - Showing how AI-assisted research results should be framed — proven lower bounds versus full proofs, claims versus peer-reviewed facts
  - A template for bilingual showcase articles whose ECharts specs are fully embedded in shareable URLs

# Related Resources

official:
  endpoint: https://x-cmd.com/draw
related:
  ai_coding: docs/9-showcases/11-ai-coding-era/cn.md
  reference: docs/9-showcases/12-reference-examples/cn.md
  benchmark: docs/9-showcases/15-frontier-harness/cn.md
