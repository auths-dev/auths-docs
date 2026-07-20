---
title: "Anchor your attestation"
description: "Add the anchor leg to export-attestation: collect cosignatures to your threshold and publish an aggregate whose rollback is evidence."
product: witness
section: "Users"
order: 3
lastReviewed: "2026-07-20"
---

Three flags on the `export-attestation` you already run.

**Before you start:** your witnesses' names and member keys, and their URLs.

```bash
auths-mcp export-attestation \
  --live-dir ./live \
  --agent <agent-did> --root <root-did> \
  --out ./public/activity.json \
  --anchor-to https://w1.example.com \
  --anchor-to https://w2.example.net \
  --witness "w1=<w1 member key>" \
  --witness "w2=<w2 member key>" \
  --witness-threshold 2
```

You should see:

```output
export-attestation: anchored — 2 cosignature(s), threshold 2
export-attestation: head a470be04c3b4f6af… count 412 cumulative 15c → ./public/activity.json
```

The finalized anchor is embedded **inside** `activity.json`. Publish it exactly
as before — verifiers that predate the network ignore the extra field.

{% callout type="warning" title="Below threshold, the export fails" %}
If cosignatures don't reach `--witness-threshold`, the whole export fails and
nothing is written. There is no silent fallback to an unanchored publish once
you asked for anchoring.
{% /callout %}

## The flags

| Flag | Meaning |
| --- | --- |
| `--anchor-to <URL>` | A witness endpoint. Repeat per witness. |
| `--witness "<name>=<key>"` | A declared member — the name and member key the operator gave you. Repeat per member. |
| `--witness-threshold <t>` | How many cosignatures finalize. Default `1`. |

**If it fails:**

- *"below threshold"* — check each witness answers `GET /health`, and that every
  `--witness` key matches the key that node actually cosigns with.
- *refused by a witness* — your submission wasn't a monotone extension, or that
  witness's registry copy is stale. See
  [acceptance rules](/witness-network/reference/acceptance-rules).

## The payoff

The market derives its tier from the verified anchor, never from anything the
document claims. Your listing badge upgrades from market-witnessed to
**quorum-anchored (t-of-N)**.
