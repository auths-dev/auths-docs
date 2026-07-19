---
title: Receipts
description: Every gated call is signed and logged; anyone can re-derive the spend offline — and tampering with the log is caught, byte for byte.
product: mcp
section: Core ideas
order: 4
lastReviewed: "2026-07-18"
---

A log is a claim the operator makes about themselves. A receipt is a claim you can
check **against** them. Every gated call — allowed or refused — is canonicalized,
signed by the agent's delegated key, and appended to a spend log. From those
receipts alone, a party who never ran the agent can re-derive exactly what it did.

## Prove it yourself

{% steps %}
{% step title="Re-derive the spend, offline" %}
`verify-spend` re-verifies every signed proof through the same verifier the live
gate uses and re-derives the spend — no account, no server, no trust in the operator
that produced the log:

```bash
auths-mcp verify-spend --log spend.jsonl --registry ./registry \
  --agent <agent> --root <root>
```

```output
✓ verify-spend: consistent — 2 call(s), $12.00 re-derived from signed costs
```

It exits non-zero on any verdict but {% verdict code="consistent" /%}.
{% /step %}

{% step title="Tamper with it and watch the audit catch it" %}
Flip one byte of a signed proof and re-run — the altered record fails verification:

```output
✗ verify-spend: tampered-proof — 51017ad1… failed verification (exit 1)
```

A doctored log cannot audit clean.
{% /step %}
{% /steps %}

## What the audit catches

The verdicts on the live gate and in the offline audit are exact strings — these,
and no others:

| Verdict | Meaning |
| --- | --- |
| `allowed` | in bounds; forwarded, receipt written |
| `usage-cap-exceeded` | would cross the budget cap — refused before the rail is touched |
| `outside-agent-scope` | a capability the grant never gave |
| `agent-expired` | past the delegation TTL |
| `revoked` | a revocation is recorded; honored on the next call, every rail |
| `budget-required` | a payment rail wrapped with no `--budget` — fail-closed, both modes |
| `proof-unauthentic` | the signature does not verify against the agent's key |
| `consistent` | the clean audit: every proof verifies, the spend re-derives |
| `tampered-proof` | a signed proof was altered — caught offline |
| `dropped-call` | a record was removed from the log — each receipt back-links to the prior one |
| `budget-mismatch` | the durable cross-rail counter disagrees with the log (e.g. a truncated tail) |

The last three are why handing you the log is not an act of trust: an **edited**
record breaks its signature, a **removed** record breaks the back-link chain, and a
**truncated** log disagrees with the durable counter. Each forgery has a distinct
verdict, and the audit fails loudly on all of them.

## Publishing the log

A log on your disk convinces nobody. Published as a bundle — the log, an
`audit.json` naming the verify inputs (`registry_git_url`, `agent`, `root`), and a
pushed registry — it convinces anyone: a relying party re-runs the audit above from
your published pieces alone and renders only what re-derives. Two contract details
matter on the consuming side: identity refs do not ride a plain `git clone`
(verifiers fetch `refs/*` and check out the published branch, which also
materializes the durable counter), and the machine-readable success line is exactly
`consistent — N call(s), $X re-derived from signed costs`. The full walkthrough,
including the commit-your-working-files step that keeps the counter and the log in
agreement: [Publish your receipts](/mcp/guides/publish-receipts).

## Revocation

If anything looks wrong, revoke the agent's delegation. The revocation is a signed
event in your identity's history — the agent's **next call fails on every rail at
once** with {% verdict code="revoked" /%}, no propagation window, and the other
agents keep working. Keep the revoke step ready whenever real money is live; the
[walkthrough](/mcp/guides/spend-real-money) treats it as the kill switch.
