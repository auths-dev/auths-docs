---
title: "Publish your receipts"
description: "Turn the gateway's signed spend log into a published bundle anyone can re-derive — spend.jsonl, audit.json, and the registry that proves them."
product: mcp
section: Spend real money
order: 4
lastReviewed: "2026-07-18"
---

A spend log on your disk proves nothing to anyone else. Publishing it does: hand a
relying party the log, the audit manifest, and the registry it verifies against, and
they can re-derive every cent **without trusting you** — the same offline audit from
[receipts](/docs/mcp/concepts/receipts), run by someone who never saw your gateway.
This is what marketplaces and dashboards mean by "re-derived numbers": they render
what your published bundle proves, nothing else.

## What the gateway wrote

With `AUTHS_MCP_LIVE_DIR` set, the wire builds everything under one directory:

```bash
export AUTHS_MCP_LIVE_DIR="$HOME/agent-live"
# after some gated calls:
ls "$AUTHS_MCP_LIVE_DIR/registry/spend-log/"
```

```output
EOlPSYGz4TulPCcmo2FhVtQ8yiRkE3n0dGxatvCJmDbk.jsonl
```

Three things live under `registry/`:

| Piece | What it is |
| --- | --- |
| `spend-log/<agent>.jsonl` | the signed receipts — one record per gated call, back-linked |
| the registry itself | the identity history the signatures verify against |
| `budget-ledger/<agent>` | the durable cross-rail counter the audit cross-checks |

The filename under `spend-log/` is your **agent identifier** — you will need it for
the manifest below.

## The published bundle

A bundle is two files served from the same directory, any static host:

```
https://your.host/agent/spend.jsonl    ← the log, byte-for-byte
https://your.host/agent/audit.json     ← the manifest naming the verify inputs
```

`audit.json` names exactly what `verify-spend` needs:

```json
{
  "registry_git_url": "https://github.com/you/agent-registry",
  "agent": "<the spend-log filename, without .jsonl>",
  "root": "<the root identity the registry prints>"
}
```

- `registry_git_url` — anywhere a verifier can `git fetch` your registry from.
- `agent` — the identifier from the spend-log filename above.
- `root` — the root identity of the registry (the identity tooling prints it; it is
  the anchor the agent's delegation chains to).

## Commit the working files — or the audit fails

The registry's identity history lives in git refs, but the **durable budget counter
is a working file**. A verifier's copy of your registry only contains what you
committed — publish with an uncommitted counter and their audit cross-check fails
{% verdict code="budget-mismatch" /%}, because their counter reads zero against your
re-derived spend.

```bash
cd "$AUTHS_MCP_LIVE_DIR/registry"
git add -A
git commit -m "publish spend bundle"
git push <your registry remote>
```

Re-commit and re-push every time you publish a newer log: the log, the counter, and
the registry move together or the audit says so.

## What a relying party does with it

They fetch your two files and your registry, then re-run the same audit the gate
ran live:

```bash
curl -sO https://your.host/agent/spend.jsonl
git init registry && git -C registry fetch <registry_git_url> 'refs/*:refs/*'
git -C registry checkout <your published branch>
auths-mcp verify-spend --log spend.jsonl --registry ./registry \
  --agent <agent> --root <root>
```

```output
✓ verify-spend: consistent — 2 call(s), $0.03 re-derived from signed costs
```

Anything but {% verdict code="consistent" /%} is a loud, specific verdict — an edited
record is {% verdict code="tampered-proof" /%}, a removed one
{% verdict code="dropped-call" /%}, a truncated tail
{% verdict code="budget-mismatch" /%}. See
[what the audit catches](/docs/mcp/concepts/receipts#what-the-audit-catches).

Note the fetch shape: identity refs do not ride a plain `git clone`, so verifiers
fetch `refs/*` explicitly and check out your published branch to materialize the
counter. Verifier-side tooling that consumes bundles should do the same.
