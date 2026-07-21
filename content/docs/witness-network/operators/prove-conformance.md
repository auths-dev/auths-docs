---
title: "Prove conformance"
description: "Run the published test suite against your node — the only entry bar for the directory."
product: witness
section: "Operators"
order: 5
lastReviewed: "2026-07-20"
---

Drive your live node through the published suite:

```bash
cargo xtask witness-conformance --url http://127.0.0.1:3333
```

The first run compiles the `xtask` crate — expect a few minutes of Rust build
before any output; subsequent runs are instant.

```output
witness-conformance: live endpoint http://127.0.0.1:3333 passed 4/4 transport checks — certified did:key:z6Mk…
```

Emit the machine-readable vectors to drive your own harness (or a node you built
from scratch):

```bash
cargo xtask witness-conformance --emit ./vectors
```

```output
witness-conformance: wrote vectors to ./vectors/conformance-vectors.json
witness-conformance: 4/4 vector groups passed
```

## What the vectors cover

| Group | The obligation it proves |
| --- | --- |
| Monotone accept | A well-ordered successor is co-signed |
| Duplicity | Same index, different head is refused **and** the emitted proof verifies offline |
| Regression | A non-monotone index is rejected outright |
| Freshness ladder | `fresh`, `stale`, `unanchored` computed exactly as verifiers will |

The live drive proves the transport obligations: health answers, malformed and
unauthorized submissions are refused fail-closed, unknown chains read as absent.

{% callout type="info" title="The vectors are the wire contract" %}
`conformance-vectors.json` is implementation-neutral. A witness written from
scratch that answers the vectors correctly is conformant — the suite lives in
the open repo so anyone can hold it against us too.
{% /callout %}

**If it fails:** full acceptance vectors need the conformance identity present in
your registry copy. Emit the vectors, provision that identity, then re-drive.

**Next:** [Get listed in the directory](/witness-network/operators/get-listed).
