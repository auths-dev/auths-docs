---
title: "Choose your witnesses"
description: "Pick members and a threshold: what t buys, what it costs, and where to find operators."
product: witness
section: "Users"
order: 2
lastReviewed: "2026-07-20"
---

A set is `N` named members plus a threshold `t`. You need each member's **public
name** and **member key** — the operator gives you both (a node prints its member
key at first boot).

## Pick a threshold

| Shape | Buys you | Costs you |
| --- | --- | --- |
| 1-of-1 (yourself) | The full loop end to end; catches your own rollback bugs | No third-party guarantee — you witnessed yourself |
| 1-of-2 | Either witness can be down | Either one alone can co-sign a fork |
| **2-of-3** | One can be down; two must collude to lie | Three operators to recruit — **the production floor** |
| 3-of-5 | Two down; three to collude | Serious recruiting |

Raising `t` buys collusion resistance and costs liveness: `t` witnesses must
collude to co-sign a rollback, and `N − t + 1` must be down before you can't
anchor at all.

{% callout type="warning" title="Independence is the ceiling" %}
Three nodes run by one operator are **one** witness with three signatures. Spread
members across operator, organization, jurisdiction, and infrastructure — the
strongest witness in your set is one your counterparty or regulator runs.
{% /callout %}

## Find operators

- **[The public directory](https://auths.dev/network)** — conformant witnesses
  with their operator facts and live status.
- **[Run one yourself](/witness-network/operators/run-a-node)** — a fine first
  member, a bad only member.
- **Ask your counterparty.** Anyone who passes
  [conformance](/witness-network/operators/prove-conformance) can witness.

## Changing the set later

Future anchors can declare a new set. Every past anchor keeps verifying against
the set it named, so a verifier sees each era under the quorum that signed it.

**Next:** [Anchor your attestation](/witness-network/users/anchor-your-attestation).
