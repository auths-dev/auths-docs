---
title: "Verify freshness"
description: "Read the freshness ladder beside the verdicts, verify an embedded anchor with one SDK call, and know what a duplicity proof obliges you to do."
product: mcp
section: "Witness network"
order: 3
lastReviewed: "2026-07-20"
---

Freshness is a separate, labeled fact. It sits **beside** the authorization
verdicts, never inside them — a perfectly authorized history can still be an
old view, and you deserve to know which one you're looking at.

## The ladder

| Status | Meaning | What to do |
| --- | --- | --- |
| `fresh` | The history you hold extends the best finalized anchor | Nothing — this is the good state |
| `stale` | A finalized anchor exists **ahead** of the history you were given | You're looking at an old view; fetch the current one, and ask why you were handed a stale one |
| `unanchored` | No anchor at all | Judge by the other tiers of evidence; growth may still be market-witnessed |

`stale` is not tampering — tampering fails verification outright. Stale means
the math checked out on a view someone chose not to update.

## Verify an anchored attestation

One call does everything: signature under the agent's current keys, the
delegation to the claimed root, and — when an anchor is embedded — the full
finalization: the set's content hash, threshold, each cosignature, and each
witness's log-inclusion proof.

```js
const sdk = require('@auths-dev/sdk')
const check = JSON.parse(sdk.verifyActivityAttestation(doc, registryDir))

check.ok      // false if ANY part fails — including a bad embedded anchor
check.anchor  // null, or the verified quorum shape:
// { tier: 'witness', threshold: 2, witnesses: 3, cosigners: 2,
//   seedId: 'c6ec71d2…', witnessSetSaid: 'EHSPi3…' }
```

Two properties worth naming:

- **A present-but-bad anchor fails the whole document.** There is no "the
  signature was fine but the anchor wasn't" gray zone — an anchored document
  either proves its quorum or proves nothing.
- **`anchor` restates verified facts only.** The tier is derived from
  cryptography the SDK just re-checked, never from a claim inside the
  document. (The field ships in SDK releases after 0.1.12; older builds omit
  it, and consumers treat absence as unanchored.)

## Duplicity proofs

A duplicity proof is what a witness emits instead of a cosignature when the
same chain presents the same index with two different heads. It contains both
signed tuples, verifies offline, and requires no trust in the witness that
emitted it — the contradiction is in the submitter's own signatures.

Treat one as disqualifying. There is no innocent reading of two histories at
one index, and the proof is portable: attach it to a dispute, publish it,
hand it to a counterparty. Watchers (the market among them) scan witness logs
for exactly these collisions.

## Check for withholding

Every witness answers for the latest anchor it co-signed on a chain:

```bash
curl https://w1.example.com/v1/anchor/<seed-id>
```

If the newest anchor any declared witness holds is days old while the seller
claims live activity, you are being shown a gap. Anchoring cadence is a
promise its absence breaks visibly.

## What you trust, spelled out

Nothing new. Verification still runs on your machine from public inputs: the
attestation, the seller's public registry, and the anchor riding in the
document. The network's guarantee has a ceiling — the independence of the
declared witnesses, which is [the chooser's problem](/mcp/witness-network/choose-witnesses)
— but every input to that judgment (operators, jurisdictions, threshold) is
in the anchor for you to read.
