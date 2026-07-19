---
title: "Choose your witnesses"
description: "A quorum is only as honest as its operators are independent: how to pick members, set a threshold, and read the guarantee ceiling you just bought."
product: mcp
section: "Witness network"
order: 4
lastReviewed: "2026-07-20"
---

Your declared set is the whole strength of your anchors. The cryptography is
identical whether you declare one witness or seven — what changes is a single
number: **how many independent parties must collude to lie about your
history.**

## What a set is

`N` named members plus a threshold `t`. Each member carries its public name,
its member key, and its operator facts — operator, organization,
jurisdiction, infrastructure. The set is committed by a content hash that
travels inside every anchor, so no one can quietly swap members after the
fact: each anchor names exactly the set it was submitted under.

Structural rules, enforced at declaration: at least one member, unique names,
unique keys, `1 ≤ t ≤ N`.

## The guarantee ceiling

A finalized anchor proves that `t` declared witnesses saw this exact tuple
and found it a monotone extension. The ceiling on that guarantee is
independence:

- Three nodes run by **one** operator are one witness with three signatures.
- `t` witnesses must collude to co-sign a rollback; `N − t + 1` must be down
  before you can't anchor at all.

So diversity is not a compliance nicety — it is the number the whole
construction rests on. Spread members across the four axes (operator,
organization, jurisdiction, infrastructure), and prefer witnesses whose
operators have nothing to gain from your books looking good. **The strongest
witness in your set is one your counterparty — or your regulator — runs.**

## Picking a threshold

| Shape | What it buys | What it costs |
| --- | --- | --- |
| 1-of-1 (yourself) | The full loop, end to end; catches your own rollback bugs | No third-party guarantee — you witnessed yourself |
| 1-of-2 | Either witness can be down | Either witness alone can co-sign a fork |
| 2-of-3 | One witness can be down; two must collude to lie | Three operators to recruit — the production floor |
| 3-of-5 | Two down; three to collude | Serious quorum, serious recruiting |

Raising `t` buys collusion resistance and costs liveness. Start at 1-of-1 in
development, ship at 2-of-3 across genuinely distinct operators, and grow the
set as counterparties who care about your books appear — they are your best
recruits.

## Where witnesses come from

- **The public directory** at [auths.dev/network](https://auths.dev/network)
  lists conformant witnesses with the facts above and their live status.
- **Run one yourself** — [it's one container](/mcp/witness-network/run-a-witness);
  a self-run witness is a fine first member and a bad only member.
- **Ask your counterparty.** Anyone who passes
  [the conformance harness](/mcp/witness-network/conformance) can witness;
  handing a counterparty a seat in your set converts their suspicion into
  your guarantee.

## Changing the set

Sets aren't forever. Future anchors can declare a new set; every past anchor
keeps verifying against the set it named. A verifier reading your history
sees each era under the quorum that actually signed it.
