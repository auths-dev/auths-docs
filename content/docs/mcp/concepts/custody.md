---
title: Credential custody
description: The gateway holds the provider secret; the agent holds only its delegation. Bypassing the gateway leaves the agent with no credential at all.
product: mcp
section: Core ideas
order: 3
lastReviewed: "2026-07-17"
---

The gateway is a **credential-custody broker**, not just a proxy. It holds the
downstream provider's secret — a Stripe key, a wallet, an API token — and injects it
into the wrapped server's process. The agent holds only its scoped, budget-bound
delegation. It never sees the secret.

That makes the boundary unbypassable by construction: an agent that goes around the
gateway reaches the raw downstream with **no credential**, so the call fails. There
is no configuration in which the bypass path works.

## Handing the gateway a secret

`--custody-credential` takes the secret in one of two shapes:

```bash
# bare NAME — the gateway ADOPTS the value from its own environment;
# the secret never appears on the agent-visible command line
export STRIPE_API_KEY=sk_test_...
auths-mcp wrap --custody-credential STRIPE_API_KEY -- <downstream server>

# NAME=VALUE — inject an explicit value
auths-mcp wrap --custody-credential SOME_TOKEN=abc123 -- <downstream server>
```

Repeat the flag for each secret the downstream needs (the x402 rail, for example,
custodies both a wallet key and a facilitator URL).

## Where the secret never goes

The value is injected into the **downstream process only**. It never touches the MCP
wire, never appears in receipts, and is never logged or echoed — a malformed
`--custody-credential` is reported by NAME alone. The agent-side surface carries
exactly one thing: the delegation, whose scope, budget, and expiry the
[gate](/docs/mcp/concepts/how-it-works) checks on every call.

Replacing a leaked long-lived key with a bounded delegation is the point: if the
agent's delegation leaks, it is scoped, capped, expiring, and
[revocable in one step](/docs/mcp/concepts/receipts) — none of which is true of the
provider secret it replaced.
