---
title: Authentication
description: How Auths authenticates — cryptographic identities, not API keys
product: identity
section: Guides
order: 3
lastReviewed: "2026-07-17"
---

## No API keys

Auths does **not** use API keys, secret tokens, or a dashboard. There is no `sk_live_…` to leak. Instead, authentication is based on **cryptographic identities**: you hold a private signing key, and others verify your signatures against your public identity. This is the model Auths exists to replace shared secrets with.

## Your identity

Running `auths init` creates your identity — not an account, but a verifiable **key event log (KEL)**, backed by a key stored on your machine (under `~/.auths`, protected by a passphrase):

```bash
auths init
auths whoami      # your identity
auths status      # identity + signing overview
```

You **prove** your identity by signing (`auths sign`); others **authenticate** you by verifying (`auths verify`) against a trusted copy of your public identity — entirely offline, no server in the loop. See the [quickstart](/docs/idsigning/quickstart).

## Trust instead of accounts

There's no central account to log into. Verifiers decide whom to trust by **pinning** identities:

```bash
auths trust pin --did <their-identity> --key <pubkey-hex>   # trust an identity
auths trust list
```

See [Team Identities](/docs/idsigning/team-identities) for sharing trust across a team.

## Authenticating agents and services

For AI agents, CI, and services, Auths issues a **scoped passport** — a delegated, capability-scoped, expiring, revocable identity — instead of a bearer token. The agent presents it (for the MCP server, in the HTTP `Authorization` header) and the server authorizes the call by replaying the key event log (the KEL — the signed, append-only history of an identity's keys):

- **Scoped** — limited to specific capabilities (e.g. `sign_commit`).
- **Expiring** — set a lifetime so a leaked credential dies on its own.
- **Revocable** — revocation is a logged fact, effective immediately.

See the [bounded-agent gateway](/docs/mcp).

## Security

- Keep your **private key** safe — it never leaves your machine and is passphrase-protected.
- Share only your **public identity**; it carries no secret.
- Prefer **scoped, expiring** delegation for automation over reusing a human key.

## Related

- [Quickstart](/docs/idsigning/quickstart)
- [Team Identities](/docs/idsigning/team-identities)
- [The bounded agent](/docs/mcp)
- [Identity Model](/docs/idsigning/concepts/identity-model)
