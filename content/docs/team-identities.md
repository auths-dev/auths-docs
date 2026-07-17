---
title: Team Identities
description: Share and trust identities across a team, and delegate to agents
product: identity
section: Guides
order: 5
lastReviewed: "2026-07-17"
---

## Overview

Each developer and machine has its own Auths identity. Working as a team means **establishing trust** between those identities and, where needed, **delegating** scoped authority to CI and agents. Auths has no central account system — trust is pinned locally and proven cryptographically.

## Your identity

Every member creates their own identity once:

```bash
auths init
auths whoami      # show your identity
auths status      # identity + signing overview
```

## Trusting teammates

To verify a teammate's commits, pin their identity as a trusted root. They share their DID (from `auths whoami`) and their public key (from `auths id show`), then:

```bash
auths trust pin --did <their-identity> --key <pubkey-hex>   # pin a teammate as trusted
auths trust list                                            # all pinned identities
auths trust show <their-identity>                           # details
auths trust remove <their-identity>                         # unpin
```

Once pinned, `auths verify` accepts that identity's signatures. Commit a checked-in trust root (e.g. under `.auths/`) so the whole team and CI share the same trusted set.

## Identity bundles for CI

For stateless verification in CI (no local identity store), export an identity bundle and hand it to the verify action:

```bash
auths id export-bundle            # advanced command (auths --help-all)
```

Pass the result to `auths-dev/verify` via its `identity-bundle` input — see [Build Agents](/docs/build-agents).

## Delegating to agents

Rather than share a human's key, delegate **scoped, expiring, revocable** authority to an agent or CI bot. This uses the same delegation mechanism that powers agent passports:

```bash
auths id agent add \
  --label ci-bot \
  --key my-key \
  --scope sign_commit \
  --expires-in 86400
```

See the [bounded-agent gateway](/docs/mcp) for the full delegation, scoping, and revocation workflow.

## Best practices

1. **One identity per person and per machine** — never share private keys.
2. **Delegate, don't share** — give agents scoped, expiring credentials instead of a human key.
3. **Check in your trust roots** so everyone (and CI) verifies against the same set.
4. **Rotate regularly** — see [Key Rotation](/docs/concepts/key-rotation).

> **Note:** team-wide *policy enforcement* (mandatory review, rotation schedules) is not yet a CLI surface — see [Delegation](/docs/concepts/delegation) for the model.

## Troubleshooting

### A teammate's commit won't verify

- Confirm their identity is pinned: `auths trust list`
- Confirm they signed the commit: `auths verify <commit>`
- Run `auths doctor` to check your local setup

## Related topics

- [Sign Commits](/docs/sign-commits)
- [The bounded agent](/docs/mcp)
- [Delegation](/docs/concepts/delegation)
- [Key Rotation](/docs/concepts/key-rotation)
