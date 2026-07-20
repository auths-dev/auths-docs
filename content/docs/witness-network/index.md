---
title: "Witness network"
description: "Independent witnesses co-sign your history's growth, so hiding or rewriting the recent past stops being deniable."
product: witness
section: "Overview"
order: 1
lastReviewed: "2026-07-20"
---

Receipts verify offline, forever. The one thing an offline check **cannot** prove
is that you are looking at the *latest* history.

Two attacks exploit that gap, and both are free:

| Attack | What it looks like |
| --- | --- |
| **Withholding** | Recent records "don't exist" — you get a truncated history that verifies cleanly |
| **Equivocation** | Two verifiers are shown two different histories, each internally consistent |

Witnesses co-sign every step forward. Rolling history back then means
contradicting signatures sitting in append-only logs — the rollback stops being
a deletion and becomes evidence.

## Start here

{% card-group %}
{% card title="I publish attestations" href="/witness-network/users/do-i-need-this" %}
Anchor your aggregate so a rollback is attributable.
{% /card %}
{% card title="I verify attestations" href="/witness-network/users/verify-an-anchored-attestation" %}
Check an anchor and read the freshness result.
{% /card %}
{% card title="I want to run a witness" href="/witness-network/operators/run-a-node" %}
One container, five minutes.
{% /card %}
{% /card-group %}

Two things never change:

- **Verification stays offline and free.** An anchor adds one labeled fact —
  `fresh`, `stale`, or `unanchored` — *beside* the verdicts, never inside them.
- **Witnesses see aggregates only.** No per-call rows, no counterparties, no
  tool names. Your private log never leaves your infrastructure.
