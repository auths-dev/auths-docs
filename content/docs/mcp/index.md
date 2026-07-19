---
title: The bounded agent
description: Put a gateway in front of any MCP server and your agent cannot exceed its scope, its budget, or its lifetime — and you can prove what it did.
product: mcp
section: Get started
order: 1
lastReviewed: "2026-07-17"
---

**auths-mcp** is the bounded-agent MCP gateway. It sits between an agent and its tools,
holds a scoped, budget-bound, instantly-revocable delegation for that agent, and refuses
any `tools/call` that exceeds it — at the protocol boundary, before the tool runs.

The cap is a seatbelt, not a setting. With a `$20` budget the agent cannot spend `$20.01`.
Not shouldn't — **cannot**: the gateway reserves each charge against the cap before the
rail is touched and refuses the call that would cross it.

```output
$ auths-mcp wrap --budget '$20' --ttl 30m -- my-mcp-server
✓ payments.charge $12.00 → allowed · spent $12.00 / $20.00 · rcpt_1a2b
✗ payments.charge $940.00 → usage-cap-exceeded · refused · rcpt_8f2a
```

The refusal is the product. Every call — allowed or refused — leaves a signed receipt,
and anyone can re-derive the spend from the receipts alone, offline, without trusting
you or us. See [receipts](/mcp/concepts/receipts).

## Where to start

{% card-group %}
{% card title="Quickstart — no money" href="/mcp/quickstart" icon="terminal" %}
Wrap a filesystem server and watch a refusal in five minutes. No card, no wallet,
nothing at risk.
{% /card %}
{% card title="Spend real money" href="/mcp/guides/spend-real-money" icon="wallet" %}
Put a real model on real rails — Stripe and on-chain USDC — behind one cap it provably
cannot cross.
{% /card %}
{% /card-group %}

## What the gate refuses

Every `tools/call` runs one gate and fails closed. A call outside the granted scope is
{% verdict code="outside-agent-scope" /%}. A call that would cross the budget is
{% verdict code="usage-cap-exceeded" /%}. A call after the delegation expires is
{% verdict code="agent-expired" /%}. A call after you revoke is
{% verdict code="revoked" /%}. On any of them, the downstream tool is never invoked.

How each bound works — and why you can check the receipts yourself — is four short
pages: [the gate](/mcp/concepts/how-it-works),
[budgets](/mcp/concepts/budgets), [custody](/mcp/concepts/custody), and
[receipts](/mcp/concepts/receipts).
