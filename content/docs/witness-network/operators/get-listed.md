---
title: "Get listed in the directory"
description: "Submit your node to the public directory, and what the interim admissions process means for trust."
product: witness
section: "Operators"
order: 6
lastReviewed: "2026-07-20"
---

The [public directory](https://explorer.auths.dev) lists conformant witnesses with
the facts principals pick sets by. Listing has one bar: pass the harness.

## Submit

```bash
cargo xtask witness-conformance --url https://w1.acme.example > conformance.txt
```

Send to [network@auths.dev](mailto:network@auths.dev?subject=Witness%20directory%20listing):

| Field | Example |
| --- | --- |
| Node endpoint | `https://w1.acme.example` |
| Witness name | `acme-w1` |
| Member key | `did:key:z6Mk…` (printed at first boot) |
| Operator facts | operator, organization, jurisdiction, infrastructure |
| Region | `us-west` |
| Conformance transcript | `conformance.txt` |

## How admissions work today

Entries are admitted by an **attestation signed with a single admissions key**
held by Auths. Your browser then does two checks before trusting any entry:

1. The admissions attestation re-verifies under a key **pinned into the app
   bundle at build time** — never read from the served document.
2. The exact roster bytes hash to the id that attestation commits to, so the
   attestation can't be reused over a swapped entry list.

Only a roster that passes both can supply keys to anything else on the site.

{% callout type="warning" title="This is interim governance, and it is centralized" %}
One key decides who appears. That key can add or omit an operator — the
directory says so on its face rather than implying neutrality it doesn't have.

What it **cannot** do: forge your cosignatures, or make a bad anchor verify. The
directory is a *discovery* surface. Every guarantee you rely on is re-checked
from the anchor itself, so a compromised or partial directory costs you
discoverability, never correctness.
{% /callout %}

## You don't need the directory

Listing is convenience, not permission. A principal can add your name and member
key to their declared set directly — the set is theirs to declare and your
signature is yours to give. Nothing in the protocol consults the directory.

**If your listing is refused or delayed:** the conformance transcript is the
objective part; ask for the specific check that failed and re-drive after fixing
it.
