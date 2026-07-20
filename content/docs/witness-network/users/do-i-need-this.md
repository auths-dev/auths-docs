---
title: "Do I need this?"
description: "A yes/no decision: what anchoring adds over an unanchored attestation, and when it is worth it."
product: witness
section: "Users"
order: 1
lastReviewed: "2026-07-20"
---

**Yes — if someone reads your attestation to make a decision, and you can't
afford them doubting it.**

| | Unanchored | Anchored |
| --- | --- | --- |
| Signature is authentic | ✅ | ✅ |
| Growth is monotone | ✅ | ✅ |
| You quietly published an older version | deniable | **attributable** |
| You showed two buyers two histories | deniable | **attributable** |

Anchoring is one flag on the command you already run, and it costs verifiers
nothing — they still check offline, for free.

## Skip it

- You're in development, or nothing consumes your attestation yet.

## Do it

- A buyer, market, or regulator reads your attestation.
- You want the `quorum-anchored (t-of-N)` badge instead of market-witnessed.

**Next:** [Choose your witnesses](/witness-network/users/choose-your-witnesses),
then [Anchor your attestation](/witness-network/users/anchor-your-attestation).
