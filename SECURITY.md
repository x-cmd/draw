# Security Policy

## Supported versions

Only the latest release line (`0.2.x`) receives security fixes.

## Reporting a vulnerability

Please use [GitHub private vulnerability reporting](https://github.com/x-cmd/draw/security/advisories/new)
(preferred), or email the maintainers listed on the npm package page.

Do not open public issues for suspected vulnerabilities. We aim to respond
within 72 hours.

## Supply-chain guarantees

- npm and JSR releases are published exclusively by
  [publish.yml](.github/workflows/publish.yml) from this repository via
  OIDC trusted publishing — no long-lived tokens are stored anywhere.
- Every npm release carries a SLSA provenance attestation, verifiable with
  `npm audit signatures` (also linked from each
  [GitHub Release](https://github.com/x-cmd/draw/releases)).
- Security posture is continuously scanned by OpenSSF Scorecard; see the
  badge in the README.
