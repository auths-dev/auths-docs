---
title: "Glossary"
description: "Every witness-network term, in one line each."
product: witness
section: "Glossary"
order: 1
lastReviewed: "2026-07-20"
---

| Term | Means |
| --- | --- |
| **Anchor** | One signed tuple — `{head, count, cumulative, as_of}` — submitted to witnesses. The only thing a witness ever sees. |
| **Chain** | One agent's spend history, identified by a seed id. |
| **Seed id** | The stable identifier of a chain, derived from the public delegation. Used to read a witness: `GET /v1/anchor/{seed}`. |
| **Head** | The commitment to the whole private log at a point in time. Reveals nothing about its contents. |
| **Witness** | A node that co-signs monotone growth and logs what it accepted. Sees aggregates only. |
| **Member key** | A witness's public signing key, printed at first boot. What principals put in their declared set. |
| **Witness set (𝒲)** | `N` named members plus a threshold `t`, committed by a content hash carried inside every anchor. |
| **Threshold (`t`)** | How many cosignatures finalize an anchor. `t` must collude to lie; `N − t + 1` down blocks anchoring. |
| **Finalized anchor** | An anchor carrying ≥ `t` distinct cosignatures from the declared set, each with a log-inclusion proof. |
| **Cosignature** | A witness's signature over an anchor it accepted. |
| **Inclusion proof** | Evidence that a witness put the anchor in its append-only log, rooted in a signed checkpoint. |
| **Duplicity proof** | Both signed tuples for one `(chain, index)` — a portable, offline-verifiable contradiction. |
| **Equivocation** | Showing two verifiers two different histories. What a duplicity proof catches. |
| **Withholding** | Serving a truncated history so recent records "don't exist". What freshness catches. |
| **Freshness** | A labeled result — `fresh`, `stale`, `unanchored` — reported beside the verdicts, never inside them. |
| **Stale** | A finalized anchor exists ahead of the history you were given. Not tampering — tampering fails outright. |
| **Unanchored** | No anchor reachable. Freshness unknown, which is never the same as fresh. |
| **Watcher** | Anyone reading many witness logs and comparing them. The market is one. |
| **Anchor store** | The node's durable record of the last anchor co-signed per chain — its anti-equivocation memory. |
| **Roles** | `anchor` (spend anchors), `kel` (key-history receipts), `cosign` (log checkpoints). One node serves any combination. |
| **Registry copy** | The node's local copy of parties' public identity events, used to resolve submitters' current keys. |
| **Conformance vectors** | The published, implementation-neutral test suite that defines what a witness must do. |
