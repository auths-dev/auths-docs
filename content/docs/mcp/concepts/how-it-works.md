---
title: How the gate works
description: Stock MCP in, stock MCP out — and one gate on every tools/call that checks five bounds and fails closed.
product: mcp
section: Core ideas
order: 1
lastReviewed: "2026-07-17"
---

The gateway speaks ordinary MCP up to your agent and down to the wrapped server,
proxying `tools/list` and `tools/call`. Nothing about your client or your server
changes. What changes is that **every `tools/call` runs one gate** before it is
forwarded.

```
agent ──tools/call──▶ gateway ──tools/call──▶ downstream server
                         │
                         │  scope ⊆ parent · budget · expiry · revocation · authenticity
                         │  forwards ONLY on allowed; fails closed on anything else
                         ▼
                      one signed receipt per call
```

## The five bounds

| Bound | Refusal | When |
| --- | --- | --- |
| scope ⊆ parent | `outside-agent-scope` | a call for a capability the grant never gave |
| budget | `usage-cap-exceeded` | the reservation would cross the cap — refused before the rail is charged |
| expiry | `agent-expired` | the delegation has a TTL; past it, nothing signs |
| revocation | `revoked` | you recorded a revocation; every verifier honors it on the next call |
| authenticity | `proof-unauthentic` | the signature does not verify against the agent's key |

Two properties hold everywhere:

- **Fail closed.** On any verdict but {% verdict code="allowed" /%}, the downstream
  tool is never invoked. There is no "log and forward" mode.
- **Scope only narrows.** The agent's delegation is issued by your root identity, and
  its scope can only ever narrow what the parent granted — never widen it.

## What makes it stick

Three mechanisms carry those bounds, each with its own page:

- **A delegation, not a token.** The agent holds a delegated identity with its scope,
  budget, and expiry fixed at issue time — not a bearer token that anyone who copies
  it can replay. The key material stays on the machine that created it.
- **One durable budget across every rail** — the [cross-rail cap](/docs/mcp/concepts/budgets).
- **A signed receipt per call**, re-checkable by anyone — [receipts](/docs/mcp/concepts/receipts).

And because the gateway [custodies the downstream credential](/docs/mcp/concepts/custody),
an agent that bypasses the gateway reaches the raw server with no credential at all —
the boundary is unbypassable for credentialed resources.

## A non-auths client still works

A client that knows nothing about auths can still call the wrapped server:
unauthenticated calls pass through the same scope gate without a receipt, so adoption
is incremental — you can wrap first and roll out signing after.
