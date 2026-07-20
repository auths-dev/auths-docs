---
title: "Acceptance rules & shapes"
description: "What a witness enforces, how a set and a finalized anchor are structured, and the guarantee ceiling that follows."
product: witness
section: "Reference"
order: 3
lastReviewed: "2026-07-20"
---

## What a witness enforces

A witness keeps one durable record per chain: the last anchor it co-signed.
Against that it checks every submission.

| Rule | On violation |
| --- | --- |
| Index strictly increases | Refused |
| Cumulative total never decreases | Refused |
| Timestamp never goes backwards | Refused |
| Same index, **different head** | Refused **with a duplicity proof** |
| Signature verifies under the party's current keys | Refused (keys resolved from the local registry copy) |

The check is fail-closed: a signature the witness cannot verify is never
accepted.

## What a witness sees

The anchor tuple only — `{head, count, cumulative, as_of}` plus the set
reference and the party signature. Never a per-call row, a counterparty, or a
tool name. The private log stays on the publisher's infrastructure.

## The witness set

`N` named members plus a threshold `t`. Each member carries a public name, a
member key, and operator facts (operator, organization, jurisdiction,
infrastructure).

Structural rules, enforced at declaration:

- at least one member
- unique names, unique keys
- `1 ≤ t ≤ N`

The set is committed by a **content hash carried inside every anchor**, so
members can't be swapped after the fact — each anchor names exactly the set it
was submitted under.

## Finalization

An anchor is finalized once it carries **≥ `t` distinct cosignatures from
members of the declared set**, each with that witness's log-inclusion proof. A
verifier re-checks all of it offline:

- every cosigner is in the declared set
- cosignatures are distinct (one member can't count twice)
- the count reaches `t`
- each inclusion proof roots in that witness's signed checkpoint

## The guarantee ceiling

A finalized anchor proves `t` declared witnesses saw this exact tuple and found
it a monotone extension. What bounds that:

- `t` witnesses must **collude** to co-sign a rollback.
- `N − t + 1` must be **down** before you cannot anchor at all.
- Three nodes run by one operator are **one** witness with three signatures —
  independence, not node count, is the real number.

## The freshness ladder

Computed from the best finalized anchor a verifier can reach, and reported
*beside* the verdicts — never inside them.

| Status | Condition |
| --- | --- |
| `fresh` | The history held extends the best finalized anchor |
| `stale` | A finalized anchor exists ahead of the history held |
| `unanchored` | No anchor reachable |

## Duplicity proofs

Self-contained: both signed tuples for one `(chain, index)`. Verifies offline
with no trust in the emitting witness — the contradiction is in the submitter's
own signatures. Portable by design, so a watcher can publish one and anyone can
re-check it.

## Changing sets over time

Future anchors may declare a new set; past anchors keep verifying against the
set they named. A verifier reading a history sees each era under the quorum that
actually signed it.
