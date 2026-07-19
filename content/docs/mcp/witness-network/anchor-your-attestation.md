---
title: "Anchor your attestation"
description: "Add the anchor leg to export-attestation: declare a witness set, collect cosignatures to the threshold, and publish an aggregate whose rollback would be evidence."
product: mcp
section: "Witness network"
order: 2
lastReviewed: "2026-07-20"
---

`export-attestation` publishes one signed aggregate of your agent's private
spend log — `{head, count, cumulative_cents, as_of}` — at a public URL. The
market re-verifies it and credits growth it witnessed itself. No per-call row
ever leaves your infrastructure.

Unanchored, that aggregate proves authenticity and monotonicity to whoever
fetched it. What it cannot prove is that you didn't quietly publish an older
version, or show a different one to someone else. **Anchoring closes exactly
that gap** — and it is one flag on the command you already run.

{% steps %}
{% step title="Declare your witness set" %}
A set is `N` named members and a threshold `t`. Each member is a witness's
public name and member key — the operator hands you both (a node prints its
member key at first boot). Pick witnesses from the
[public directory](https://auths.dev/network), or
[run your own](/mcp/witness-network/run-a-witness) to start.

The set travels inside every anchor as a content hash, so a verifier always
knows exactly which `t`-of-`N` was promised. How to pick members and a
threshold: [Choose your witnesses](/mcp/witness-network/choose-witnesses).
{% /step %}

{% step title="Export with the anchor leg" %}
```bash
auths-mcp export-attestation \
  --live-dir ./live \
  --agent <agent-did> --root <root-did> \
  --out ./public/activity.json \
  --registry-url https://github.com/you/registry \
  --anchor-to https://w1.example.com \
  --anchor-to https://w2.example.net \
  --witness "w1=<w1 member key>" \
  --witness "w2=<w2 member key>" \
  --witness-threshold 2
```

The gateway signs the aggregate, submits the anchor tuple to every
`--anchor-to` endpoint, and collects cosignatures:

```output
export-attestation: anchored — 2 cosignature(s), threshold 2
export-attestation: head a470be04c3b4f6af… count 412 cumulative 15c → ./public/activity.json
```

The finalized anchor — tuple, resolved set, cosignatures, and each witness's
log-inclusion proof — is embedded in `activity.json` itself. The gateway
re-verifies the finalization locally before writing, so it never publishes an
anchor a stranger would refuse.
{% /step %}

{% step title="Publish as usual" %}
Nothing changes downstream: host `activity.json` (and the `audit.json`
sibling written by `--registry-url`) at your listing's attestation URL. The
anchor rides inside the same document; verifiers that predate the network
simply ignore it.
{% /step %}
{% /steps %}

{% callout type="warning" title="Below threshold, the export fails" %}
Unreachable or refusing witnesses are reported per endpoint, and if the
collected cosignatures don't reach the declared threshold the whole export
fails — there is no silent fallback to an unanchored publish once you asked
for anchoring. Fix the witness (or the set) and re-run.
{% /callout %}

## What each witness checks

A witness keeps one durable record per spend chain: the last anchor it
co-signed. Against that it enforces:

| Rule | On violation |
| --- | --- |
| Index strictly increases | Refused |
| Cumulative total never decreases | Refused |
| Timestamp never goes backwards | Refused |
| Same index, **different head** | Refused **with a duplicity proof** — a signed, portable contradiction |
| Signature verifies under your agent's current keys | Refused (the witness resolves them from your public registry) |

That last row is why the witness needs no trust in you, and you none in it:
everything it asserts, anyone can re-check.

## The payoff

The market's receipts worker verifies embedded anchors and derives its tier
from them — never from anything the document claims about itself. A verified
anchor turns your listing's observation into a `witness`-tier record, and the
badge upgrades from market-witnessed to **quorum-anchored (t-of-N)**. One
market's memory can be doubted; a quorum of independent operators across
jurisdictions is a different conversation.
