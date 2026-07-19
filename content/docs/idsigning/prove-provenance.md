---
title: Prove Provenance
description: Verify the authenticity and origin of commits and build artifacts
product: identity
section: Guides
order: 7
lastReviewed: "2026-07-17"
---

## What is code provenance?

Code provenance is a verifiable chain of custody for your code — proof of **who** produced an artifact or commit, **when**, and that it **hasn't been altered** since. Auths proves this cryptographically and **offline**: verification is a local check against trusted identity roots, with no central authority to call.

## Verify commits

Verify the latest commit, a specific commit, or a range:

```bash
auths verify HEAD
auths verify <commit-sha>
auths verify HEAD~10..HEAD
```

`auths verify` confirms each signature resolves to a trusted identity and that the commit is unmodified. To trust a signer first, pin them with `auths trust pin --did <their-identity> --key <pubkey-hex>` (see [Sign Commits](/idsigning/sign-commits)).

## Verify build artifacts

Signing an artifact produces a detached **attestation** file (`<file>.auths.json`) that travels alongside it. Verifying checks the artifact's bytes against that attestation:

```bash
auths verify ./dist/app.tar.gz
```

Attestations are the same mechanism the [verify widget](https://github.com/auths-dev/auths) uses to render a "Verified" badge from a repository's published release assets.

## Enforce verification in CI

Use the **verify** GitHub Action to fail a pull request when commits (or artifacts) aren't properly signed. It uses ephemeral verification against the signer's key event log (KEL) — no secrets to manage:

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
          auths-version: '0.1.2'   # pin a version (the action never resolves "latest")
          fail-on-unsigned: 'true'
          post-pr-comment: 'true'
        # github-token: ${{ secrets.GITHUB_TOKEN }}   # only needed for the PR comment
```

For stateless verification against a specific identity, pass an `identity-bundle` (generate one with the advanced command `auths id export-bundle`). The companion **sign** action (`auths-dev/sign@v1`) signs commits or artifacts in CI with ephemeral keys.

> See the [GitHub Actions reference](/idsigning/reference/github-actions) for the full input list.

## Best practices

1. **Sign everything you release** — commits and artifacts.
2. **Verify before you ship** — gate merges and releases on `auths-dev/verify`.
3. **Pin the CLI version** in CI (`auths-version`) — never resolve `latest`.
4. **Distribute trust roots** so verifiers can anchor your signatures (see [Team Identities](/idsigning/team-identities)).

## Advanced topics

- [Delegation](/idsigning/concepts/delegation)
- [Key Rotation](/idsigning/concepts/key-rotation)
- [Identity Model](/idsigning/concepts/identity-model)

## Related

- [Sign Commits](/idsigning/sign-commits)
- [Build Agents](/idsigning/build-agents)
- [Team Identities](/idsigning/team-identities)
