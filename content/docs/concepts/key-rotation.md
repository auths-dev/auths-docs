---
title: Key Rotation
description: Best practices for rotating signing keys
product: identity
section: Concepts
order: 2
lastReviewed: "2026-07-17"
badge: soon
---

> 🚧 **Stub** — this page hasn't been written yet. The links below are the current sources of truth.

Auths uses pre-rotation: each key event commits to the *next* key in advance, so rotating to a new key (`auths id rotate`) extends the same identity — old signatures remain valid because verification replays the key event log at the time of signing.

For what exists today:

- [Sign Commits → Key management](/docs/sign-commits#key-management)
- `auths id rotate --help` — the rotation command
