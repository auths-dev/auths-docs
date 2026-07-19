---
title: "Conformance & the directory"
description: "Who may join a witness set is answered with a test suite, not a policy document: the vectors, the live drive, and how a passing node gets listed."
product: mcp
section: "Witness network"
order: 6
lastReviewed: "2026-07-20"
---

Anyone can claim to run an honest witness. The network's answer to "who may
join a declared set" is a published test suite — pass it and you're
conformant, whoever you are, whatever you built the node from. A regulator's
in-house implementation and the shipped container clear the same bar.

## What the vectors cover

Four groups, generated from the same protocol core every verifier runs:

| Group | The obligation it proves |
| --- | --- |
| Monotone accept | A well-ordered successor is co-signed |
| Duplicity | Same index, different head is refused **and** the emitted proof verifies offline |
| Regression | A non-monotone index is rejected outright |
| Freshness ladder | `fresh`, `stale`, and `unanchored` are computed exactly as verifiers will |

## Run it

Against the shipped core, emitting the machine-readable vectors for your own
harness:

```bash
cargo xtask witness-conformance --emit ./vectors
```

```output
witness-conformance: wrote vectors to ./vectors/conformance-vectors.json
witness-conformance: 4/4 vector groups passed
```

Against a **live** node — yours, or one you're evaluating:

```bash
cargo xtask witness-conformance --url http://127.0.0.1:3333
```

```output
witness-conformance: live endpoint http://127.0.0.1:3333 passed 4/4 transport checks
```

The live drive proves the transport obligations: health answers, malformed
and unauthorized submissions are refused fail-closed, unknown chains read as
absent. Full acceptance vectors additionally need the conformance identity
provisioned in your node's registry copy — emit the vectors and drive your
own endpoint through them.

{% callout type="info" title="The vectors are the wire contract" %}
`conformance-vectors.json` is deliberately implementation-neutral: a witness
written from scratch that answers the vectors correctly is conformant. The
suite is the membership criterion, so it lives in the open repo where anyone
can hold it against us too.
{% /callout %}

## Get listed in the directory

The [public directory](https://auths.dev/network) shows each witness's name,
operator, jurisdiction, infrastructure class, and live status — the facts
principals choose sets by. Listing has one requirement: pass the harness.

Send your conformance transcript, your node's public endpoint, and your
operator facts to
[network@auths.dev](mailto:network@auths.dev?subject=Witness%20directory%20listing).
Independent operators are the point of the whole construction — the
directory exists to be filled with witnesses nobody at Auths controls.
