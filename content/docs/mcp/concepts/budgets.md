---
title: Budgets
description: One durable cap across every rail, reserved before the rail is touched — real money by default, test mode the single opt-in.
product: mcp
section: Core ideas
order: 2
lastReviewed: "2026-07-17"
---

{% callout type="danger" title="Real money is the default" %}
With no `--test-mode` flag, a wrapped payment rail spends real money — live Stripe
(an `sk_live_…` key) and x402 on base mainnet (real USDC). The `--budget` cap is the
hard ceiling and it is mandatory. Prove the cap in test mode before you point a live
key or a funded wallet at a rail.
{% /callout %}

The budget is a seatbelt, not a setting. With a `$5` cap the agent cannot spend
`$5.01` — the gateway **reserves** each charge against the cap *before* the rail is
touched, settles the actual amount from the rail's own response after, and refuses
the call that would cross the cap with {% verdict code="usage-cap-exceeded" /%}.
The rail is never charged past the budget.

## One cap, every rail

The cap is a **durable, cross-rail counter**, not an in-memory per-session tally.
Stripe spend and x402 spend meter into the same counter:

```output
# one $5 cap, two rails
✓ stripe charge  $4.99 → allowed · spent $4.99 / $5.00
✗ x402 settle    $4.99 → usage-cap-exceeded · refused
```

An agent at `$4.99` on Stripe cannot move to a second rail for fresh headroom —
`$4.99 + $4.99` is `$9.98` of a `$5` cap, so the next call on **either** rail is
refused. Two siloed per-rail budgets would each wave that call through; the one
cross-rail counter refuses it. The counter survives the session: it is held by the
verifier and re-derived by the [offline audit](/docs/mcp/concepts/receipts), so an
operator cannot quietly reset it.

## The cap is mandatory

A payment rail wrapped with no `--budget` is refused —
{% verdict code="budget-required" /%}, fail-closed, before anything is served or
charged, in **both** modes. Real-money-by-default with a skippable cap would be a
foot-gun aimed at a live card; that shape is simply not allowed.

## Modes

| Mode | Trigger | Rails |
| --- | --- | --- |
| Real *(default)* | no flag | live Stripe (`sk_live_…` at `api.stripe.com`) + x402 base mainnet — real money |
| Test | `--test-mode` (or `AUTHS_MCP_TEST_MODE=1`) | Stripe `sk_test_…` + x402 base-sepolia — no real money |

The mode is always disclosed: every payment-rail wrap prints a `mode=real|test`
banner at startup, so a live rail is never silent.

## The habit: disclose before you wrap

`--show-mode` resolves and discloses the mode — and enforces the mandatory cap —
then exits without serving the proxy or touching a rail:

```bash
auths-mcp wrap --show-mode --scope paid.call --budget '$5' -- <downstream server>
```

Run it before every live wrap. When the output says `mode=real`, you know exactly
which world goes live — and when you don't mean real money, `--test-mode` is the
single opt-in. The full live path is the
[walkthrough](/docs/mcp/guides/spend-real-money).
