---
title: GitHub Actions
description: Integrate Auths with GitHub Actions
product: identity
section: Reference
order: 2
lastReviewed: "2026-07-17"
badge: soon
---

> 🚧 **Stub** — a full input/output reference hasn't been written yet. The action repos below are the current sources of truth.

Two first-party actions exist:

- **[auths-dev/verify](https://github.com/auths-dev/verify)** (`auths-dev/verify@v1`) — fail a PR or push when commits/artifacts aren't properly signed. Key inputs: `auths-version` (required — pin it; the action never resolves "latest"), `identity-bundle` (stateless verification), `fail-on-unsigned`, `post-pr-comment`.
- **[auths-dev/sign](https://github.com/auths-dev/sign)** (`auths-dev/sign@v1`) — sign commits or artifacts in CI with ephemeral, delegated keys.

```yaml
- uses: auths-dev/verify@v1
  with:
    auths-version: '0.1.2'
    identity-bundle: .auths/ci-bundle.json
```

See [Prove Provenance](/idsigning/prove-provenance) and [Build Agents](/idsigning/build-agents) for working workflows, and each action's README for the full input list.
