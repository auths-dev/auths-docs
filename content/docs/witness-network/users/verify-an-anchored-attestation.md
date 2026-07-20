---
title: "Verify an anchored attestation"
description: "One SDK call checks the signature, the delegation, and the whole quorum — then read the freshness result beside the verdicts."
product: witness
section: "Users"
order: 4
lastReviewed: "2026-07-20"
---

One call verifies everything, including the embedded anchor.

```js
const sdk = require('@auths-dev/sdk')
const check = JSON.parse(sdk.verifyActivityAttestation(doc, registryDir))

check.ok      // false if ANY part fails — including a bad embedded anchor
check.anchor  // null when unanchored, else the verified quorum:
// { tier: 'witness', threshold: 2, witnesses: 3, cosigners: 2,
//   seedId: 'c6ec71d2…', witnessSetSaid: 'EHSPi3…' }
```

Two rules worth knowing:

- **A present-but-bad anchor fails the whole document.** There is no "signature
  was fine but the anchor wasn't" middle ground.
- **`anchor` restates only what was just re-verified** — never a claim read out
  of the document.

## The freshness ladder

Freshness sits *beside* the verdicts, never inside them. A perfectly authorized
history can still be an old view.

| Status | Meaning | What to do |
| --- | --- | --- |
| `fresh` | What you hold extends the best finalized anchor | Nothing — good state |
| `stale` | A finalized anchor exists **ahead** of what you were given | Fetch the current view, and ask why you got an old one |
| `unanchored` | No anchor at all | Judge on the other evidence tiers |

`stale` is not tampering — tampering fails verification outright. Stale means the
math checked out on a view someone chose not to update.

## Check for withholding

Ask any declared witness for the latest anchor it co-signed:

```bash
curl https://w1.example.com/v1/anchor/<seed-id>
```

If the newest anchor any witness holds is days old while the seller claims live
activity, you're being shown a gap.

**If it fails:** `ok: false` with `anchor: null` on a document that should be
anchored usually means the publisher's export fell back — treat it as
unanchored, not as broken.

**Next:** [Handle a duplicity proof](/witness-network/users/handle-a-duplicity-proof).
