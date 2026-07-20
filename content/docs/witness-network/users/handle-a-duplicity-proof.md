---
title: "Handle a duplicity proof"
description: "What a duplicity proof is, how to check one, and what it obliges you to do."
product: witness
section: "Users"
order: 5
lastReviewed: "2026-07-20"
---

A **duplicity proof** is what a witness returns instead of a cosignature when a
chain presents the same index with two different heads. It contains both signed
tuples, so the contradiction is in the submitter's *own* signatures.

You get one from a `POST /v1/anchor` that conflicts:

```output
409 Conflict
{ "duplicity": { "seedId": "c6ec71d2…", "index": 412, "a": {…}, "b": {…} } }
```

## Check it

```bash
auths artifact verify --offline duplicity.json
```

It verifies with **no trust in the witness that emitted it** and no network — the
proof is self-contained.

{% callout type="danger" title="Treat one as disqualifying" %}
There is no innocent reading of two histories at one index. The proof is
portable: attach it to a dispute, publish it, hand it to a counterparty.
{% /callout %}

## Where they come from

Watchers — the market among them — scan witness logs for exactly these
collisions and publish what they find. You don't have to be the one who catches
it.

**If it doesn't verify:** a proof that fails offline verification proves nothing;
it may be a malformed or fabricated artifact. Discard it.
