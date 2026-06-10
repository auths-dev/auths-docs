---
title: Build Agents
description: Sign and verify in CI/CD with the Auths GitHub Actions — no secrets
---

## Overview

Auths signs and verifies in CI/CD using **ephemeral keys** — there are no long-lived API keys or agent tokens to store as secrets. Two GitHub Actions cover the workflow:

- **`auths-dev/sign`** — sign commits and/or build artifacts in CI.
- **`auths-dev/verify`** — verify signatures on pull requests and releases.

## Verify on every pull request

```yaml
name: Verify provenance
on: [pull_request]

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: auths-dev/verify@v1
        with:
          auths-version: '0.1.2'   # pin the CLI (the action never resolves "latest")
          fail-on-unsigned: 'true'
          post-pr-comment: 'true'
        # github-token: ${{ secrets.GITHUB_TOKEN }}   # only for the PR comment
```

## Sign artifacts on release

```yaml
name: Sign release artifacts
on:
  release:
    types: [published]

jobs:
  sign:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4
      - uses: auths-dev/sign@v1
        with:
          auths-version: '0.1.2'
          files: |
            dist/*.tar.gz
          fail-on-unanchored: 'true'
```

The sign action emits `signed-files`, `attestation-files` (the `.auths.json` sidecars), and `signed-commits` outputs you can publish as release assets.

## Stateless verification with an identity bundle

By default the verify action uses KEL-native verification. For stateless verification against a specific identity, export a bundle and pass it in:

```bash
auths id export-bundle    # advanced (auths --help-all); commit to .auths/ci-bundle.json
```

```yaml
      - uses: auths-dev/verify@v1
        with:
          identity-bundle: .auths/ci-bundle.json
          auths-version: '0.1.2'
```

## Scoped agent credentials

For an autonomous agent (not a CI step) that needs to act on its own, delegate a **scoped, expiring** passport rather than reuse a human key — see the [MCP setup guide](/docs/mcp-setup) and the [agent demo](https://github.com/auths-dev/auths-agent-demo).

## Security considerations

1. **No secrets to leak** — CI signing uses ephemeral keys.
2. **Always pin `auths-version`** — never resolve `latest` (supply-chain hardening).
3. **Publish a trust root** (`.auths/roots`) so verifiers can anchor your signatures; `fail-on-unanchored` keeps you honest.
4. **Least privilege** — give agents scoped, time-bounded delegation.

## Related

- [Sign Commits](/docs/sign-commits)
- [Prove Provenance](/docs/prove-provenance)
- [GitHub Actions reference](/docs/reference/github-actions)
- [MCP Setup](/docs/mcp-setup)
