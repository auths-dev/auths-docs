---
title: "The witness network"
description: "Independent witnesses co-sign every history's growth, so hiding or rewriting the recent past stops being deniable — while verification stays offline and free."
product: mcp
section: "Witness network"
order: 1
lastReviewed: "2026-07-20"
---

Receipts and attestations verify offline, forever — signatures, budgets, and
monotone growth all re-derive on any machine with no account and no server.
The one thing an offline check cannot prove is that you are looking at the
**latest** history.

That gap has exactly two cheap attacks:

| Attack | What it looks like |
| --- | --- |
| **Withholding** | The recent records "don't exist" — you're shown a truncated history that verifies cleanly |
| **Equivocation** | Two verifiers are shown two different histories, each internally consistent |

Forgery is already futile; these two are free. The witness network makes them
expensive by making them **attributable**.

## What the network does

A seller's agent periodically anchors its published aggregate — head, count,
cumulative — with a set of witnesses it declared in advance. Each witness
accepts only monotone growth, co-signs what it accepts, and records the
acceptance in its own append-only log. Present the same index with a
different head to any of them and what comes back is not a cosignature but a
**duplicity proof**: a self-contained, signed contradiction any stranger can
check.

Once an anchor has cosignatures from `t` of the `N` declared witnesses, it is
**finalized**. Rolling history back now requires contradicting a quorum's
signatures in append-only logs — a rollback is no longer a deletion, it is
evidence.

Two things never change:

- **Verification stays offline and free.** A finalized anchor adds one
  labeled fact — `fresh`, `stale`, or `unanchored` — beside the verdicts,
  never inside them.
- **Witnesses see aggregates only.** No per-call rows, no counterparties, no
  tool names. The private log never leaves the seller's infrastructure.

## Who does what

| Role | What they do | Start here |
| --- | --- | --- |
| Seller / agent operator | Anchors the published aggregate with a declared witness set | [Anchor your attestation](/mcp/witness-network/anchor-your-attestation) |
| Relying party / buyer | Checks freshness beside the verdicts; refuses forks | [Verify freshness](/mcp/witness-network/verify-freshness) |
| Principal choosing a set | Picks independent witnesses and a threshold | [Choose your witnesses](/mcp/witness-network/choose-witnesses) |
| Witness operator | Runs one hardened node; co-signs monotone growth | [Run a witness](/mcp/witness-network/run-a-witness) |
| Watcher | Reads many logs, compares, publishes contradictions | The market is one — its observations are public |

The live network — the public witness directory and its status — is at
[auths.dev/network](https://auths.dev/network).
