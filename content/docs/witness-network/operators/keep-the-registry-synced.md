---
title: "Keep the registry synced"
description: "The anchor role resolves submitters' keys from your local registry copy — a stale copy refuses legitimate anchors."
product: witness
section: "Operators"
order: 3
lastReviewed: "2026-07-20"
---

`--registry` points at your own copy of the parties' **public** identity
registry. The anchor role reads it to resolve each submitter's current keys.

```bash
git -C /var/lib/auths-registry pull --ff-only
```

Run it on a timer:

```bash
*/5 * * * * git -C /var/lib/auths-registry pull --ff-only
```

## Why it matters

A submitter who rotated keys since your last sync will fail signature
verification, and you'll refuse an anchor that was perfectly valid. The node
**fails closed** — it never accepts a signature it cannot check.

| Symptom | Cause |
| --- | --- |
| A specific party's anchors are refused, others work | Stale copy — that party rotated |
| The anchor role won't start | `--registry` path missing |
| Everything is refused | You're pointing at the wrong registry |

{% callout type="info" title="Public data only" %}
The registry holds public identity events. Nothing secret lives here, and a
witness never sees a per-call row, counterparty, or tool name — only the
aggregate tuple.
{% /callout %}

**If it fails:** confirm the path is a real checkout and readable by the node
user (compose mounts it read-only), then re-run the failing submission.
