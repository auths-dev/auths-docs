---
title: Identity Model
description: Understanding Auths' identity and signing model
---

> 🚧 **Stub** — this page hasn't been written yet. The links below are the current sources of truth.

In short: your identity is a `did:keri:…` — a self-certifying identifier backed by a key event log (KEL), a signed, append-only history of your keys. Devices and agents get their own delegated identifiers anchored by your root. There is no account and no server; everything verifies locally from the log.

For what exists today:

- [Quickstart](/docs/quickstart) — create an identity and see it in action
- [Authentication](/docs/authentication) — how identities authenticate agents and services
- [Sign Commits](/docs/sign-commits) — how identity binds to Git commits
