---
title: "Walkthrough: real money"
description: "Wrap live Stripe and x402 rails behind one hard budget cap, then watch a real agent get refused the charge that would cross it."
product: mcp
section: Spend real money
order: 1
lastReviewed: "2026-07-17"
---

This is the product's whole reason to exist: let an autonomous agent spend real money, and make it provably impossible for it to spend past a cap. This page walks the live path end-to-end — real Stripe, real USDC over x402 (on-chain USDC settlement), and a real Claude agent that tries to overspend and gets refused at the boundary.

{% callout type="danger" title="Real money is the default" %}
The gateway resolves a wrapped payment rail to **real money by default**: with no `--test-mode` flag, a Stripe wrap uses a live `sk_live_…` key and an x402 wrap settles on **base mainnet** with real USDC. **Test mode is the single, deliberate opt-in.** The **budget cap is the hard ceiling** — an agent provably cannot spend past it, on any rail, even if the model is buggy, prompt-injected, or adversarial — and it is **mandatory**. Start with a tiny cap. **Live charges and on-chain transfers are irreversible.**
{% /callout %}

## The seatbelt: the cap is what makes this sane

Do not think of the [cap](/mcp/concepts/budgets) as a setting — think of it as a **seatbelt**. With a `$5` delegation, the agent cannot spend `$5.01`. Not "shouldn't" — **cannot**: the gateway reserves each charge against the cap *before* the rail is touched and refuses the call that would cross it, across **all** rails at once. The cap bounds your **downside**, not the probability of a bad decision. And it is not optional: a payment rail wrapped with no `--budget` is refused {% verdict code="budget-required" /%}, fail-closed, in **both** modes. So the discipline is simple: **start with the smallest cap that proves the point, and prove the cap in test mode first.**

Adapter paths in the commands below are relative to a checkout of [github.com/auths-dev/auths-mcp](https://github.com/auths-dev/auths-mcp).

{% steps %}

{% step title="Disclose the mode — test is the opt-in" %}
Real money is the default, so there is no "switch on live money" gate to flip — the gate runs the other way: **`--test-mode` is the opt-in to sandbox rails.** Two guardrails make real-by-default safe, and both are enforced at the `wrap` boundary:

- **The mode is disclosed.** Every payment-rail wrap prints a `mode=real|test` banner and a machine-readable `mode=… stripe.… x402.…` line at startup — a live rail is never silent.
- **The cap is mandatory.** A payment-rail wrap with no `--budget` is refused {% verdict code="budget-required" /%} before anything is served or charged, in real **and** test mode.

Before wrapping a live rail, **dry-run the disclosure** to confirm exactly which world will go live — it resolves and discloses the mode, then exits **without** serving the proxy or touching a rail:

{% code-tabs %}
{% code-tab lang="test" label="Test mode (start here)" %}
```output
$ auths-mcp wrap --show-mode --test-mode --scope paid.call --budget '$5' -- node …/server.mjs
mode=test … stripe.key_expected=sk_test_ … x402.network=base-sepolia …
```
{% /code-tab %}
{% code-tab lang="live" label="Live (real money)" %}
```output
$ auths-mcp wrap --show-mode --scope paid.call --budget '$5' -- node …/server.mjs
mode=real stripe.endpoint=api.stripe.com stripe.key_expected=sk_live_ … x402.network=base …
```
{% /code-tab %}
{% /code-tabs %}
{% /step %}

{% step title="Wrap real Stripe (the default)" %}
In the [Stripe dashboard](https://dashboard.stripe.com/apikeys), switch **off** Test mode and copy a **live** secret key (`sk_live_…`) — or, for the test tab, an `sk_test_…` key from the dashboard's Test mode toggle.

{% callout type="danger" title="No undo on a live charge" %}
A `sk_live_…` key charges **real cards / real money**. There is no undo on a live charge beyond a refund.
{% /callout %}

Custody it on the gateway (the agent never sees it) and wrap the Stripe adapter with a **small** cap. No live-money flag is needed — real is the default:

{% code-tabs %}
{% code-tab lang="test" label="Test mode (start here)" %}
```bash
export STRIPE_API_KEY=sk_test_...
auths-mcp wrap \
  --test-mode \
  --scope paid.call --budget '$5' --ttl 30m \
  --custody-credential STRIPE_API_KEY \
  -- node examples/payments/adapters/stripe-adapter/server.mjs
```
{% /code-tab %}
{% code-tab lang="live" label="Live (real money)" %}
```bash
export STRIPE_API_KEY=sk_live_...
auths-mcp wrap \
  --scope paid.call --budget '$5' --ttl 30m \
  --custody-credential STRIPE_API_KEY \
  -- node examples/payments/adapters/stripe-adapter/server.mjs
```
{% /code-tab %}
{% /code-tabs %}

The gateway discloses `mode=real`, then extracts `amount_captured` from each real Charge, meters it against the cap, and refuses any charge that would cross `$5` — {% verdict code="usage-cap-exceeded" /%}, **before** Stripe is called, so the card is never charged past the cap. The [receipt](/mcp/concepts/receipts) names the real `ch_…`. Full rail details: [Stripe rail](/mcp/providers/stripe).
{% /step %}

{% step title="Wrap real USDC over x402 — same cap" %}
Fund a **base mainnet** wallet with **real USDC** (and a little ETH for gas), and obtain a **mainnet** x402 facilitator URL. For the test tab, fund a **base-sepolia** testnet wallet and use a base-sepolia facilitator instead.

{% callout type="danger" title="No chargeback" %}
On-chain USDC transfers are **irreversible**. There is no chargeback.
{% /callout %}

Custody both and wrap the x402 adapter (same `$5` cap — it's the **same** cross-rail counter as Stripe):

{% code-tabs %}
{% code-tab lang="test" label="Test mode (start here)" %}
```bash
export X402_WALLET_PRIVATE_KEY=0x...
export X402_FACILITATOR_URL=https://...
auths-mcp wrap \
  --test-mode \
  --scope paid.call --budget '$5' --ttl 30m \
  --custody-credential X402_WALLET_PRIVATE_KEY \
  --custody-credential X402_FACILITATOR_URL \
  -- node examples/payments/adapters/x402-adapter/server.mjs
```
{% /code-tab %}
{% code-tab lang="live" label="Live (real money)" %}
```bash
export X402_WALLET_PRIVATE_KEY=0x...
export X402_FACILITATOR_URL=https://...
auths-mcp wrap \
  --scope paid.call --budget '$5' --ttl 30m \
  --custody-credential X402_WALLET_PRIVATE_KEY \
  --custody-credential X402_FACILITATOR_URL \
  -- node examples/payments/adapters/x402-adapter/server.mjs
```
{% /code-tab %}
{% /code-tabs %}

Stripe spend **and** x402 spend share the one `$5` cap. An agent at `$4.99` on Stripe and `$4.99` on x402 has spent `$9.98` of `$5` — the next call on **either** rail is refused. Full rail details: [x402 / USDC rail](/mcp/providers/x402).
{% /step %}

{% step title="Ask an agent to spend real money" %}
Now put a real model behind the gateway and give it a task that tempts it to overspend:

```bash
export ANTHROPIC_API_KEY=sk-ant-...
python3 examples/live/record.py --out spend.recorded.json
```

A real `claude-opus-4-8` tool-loop runs behind the gateway, making real charges as it works. When its cumulative spend reaches the cap, the **very next** charge — the one that would cross `$5` — is refused {% verdict code="usage-cap-exceeded" /%} at the boundary. The model can decide whatever it likes; **the money stops at `$5`.** The receipts (real `ch_…` / `0x…` tx) are the verifiable record of exactly what was spent and what was refused.
{% /step %}

{% /steps %}

## Kill it instantly

If anything looks wrong, revoke the agent's delegation — its **next call fails on every rail at once**, with no propagation window. That's the "stop spending now" button, and it actually works: [revocation](/mcp/concepts/receipts) is proved by the suite.

## Safety checklist

- **Prove the cap in test mode first** — add `--test-mode` (or `AUTHS_MCP_TEST_MODE=1`) and watch the cap refuse the over-cap call before you ever point a live key/wallet at the rail.
- **Confirm the mode before you wrap** — `auths-mcp wrap --show-mode …` prints `mode=real|test` and the resolved rails, and exits without charging.
- **Start with the smallest cap** that demonstrates the point (e.g. `--budget '$1'`).
- **Never omit `--budget`** — a payment rail with no cap is refused {% verdict code="budget-required" /%}, fail-closed, in both modes; the seatbelt is mandatory.
- The gateway **custodies** the live key/wallet — the agent never holds it; a bypass leaves it with no credential.
- Live charges and on-chain transfers are **irreversible** — the cap bounds the downside, not the probability of a bad call.
- Keep the **revoke** command ready, and a short `--ttl`.
- Real money is the **default** — there is no silent live rail (the mode is disclosed), but there is also no extra flag protecting you from real spend. Reach for `--test-mode` whenever you don't mean real money.
