---
title: "Anchor HTTP API"
description: "The endpoints a witness serves, their responses, and the hardening applied to all of them."
product: witness
section: "Reference"
order: 2
lastReviewed: "2026-07-20"
---

## `POST /v1/anchor`

Submit one anchor. The witness verifies the party signature against its registry
copy, enforces monotone growth, co-signs, logs, and returns the cosignature with
its log-inclusion proof.

```output
200 OK
{ "cosignature": { "witness": "acme-w1", "signature": "…" },
  "inclusion":   { "checkpoint": {…}, "proof": [ … ] } }
```

A fork at an existing index returns a duplicity proof instead:

```output
409 Conflict
{ "duplicity": { "seedId": "c6ec71d2…", "index": 412, "a": {…}, "b": {…} } }
```

| Status | Meaning |
| --- | --- |
| `200` | Co-signed |
| `409` | Duplicity — same index, different head. Body is the proof. |
| `4xx` | Refused: bad signature, non-monotone, unknown party, or malformed body |

## `GET /v1/anchor/{seed}`

The latest co-signed anchor for a chain — the public withholding-detection read.

```bash
curl https://w1.example.com/v1/anchor/<seed-id>
```

| Status | Meaning |
| --- | --- |
| `200` | The latest anchor this witness co-signed |
| `404` | This witness has never co-signed this chain |

## `GET /health`

Liveness. `200` with `{status, witness_did, first_seen_count, receipt_count}`
(the KEL role's shape; an anchor-only node returns `{up, roles, witness_name}`).
`witness_did` is the node's member key — the value principals add to their set.

## `GET /build`

The node's signed statement of which binary it runs (`version`,
`running_digest`, `attestation`). Absent — `404` — when the node was started
without a build attestation; that surface is optional.

## `POST /add-checkpoint`

Served by the `cosign` role: countersigns a transparency-log head after checking
consistency.

## Hardening

Applied to every route, not bolted on per-handler:

| Control | Behaviour |
| --- | --- |
| Body cap | Small — an anchor is a few KiB; larger is treated as hostile |
| Concurrency limit | Bounded in-flight requests |
| Timeout | Slow requests answered `408` |

## Trust posture

Everything a witness asserts is re-checkable by anyone: it needs no trust in the
submitter, and the submitter needs none in it. Clients should treat a node as an
**untrusted data source** and verify signed payloads themselves — which is what
the network console does in-browser.
