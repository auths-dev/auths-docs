---
title: "Onboard as a seller"
description: "The whole path in one page: create an identity, publish your KEL to your witnesses, anchor your witness set in your KEL, then export and publish a witnessed attestation."
product: witness
section: "Users"
order: 5
lastReviewed: "2026-07-21"
---

Five steps, in order. Each later step verifies against the earlier ones, so
skipping one shows up as a failed verification — never as a silently weaker
listing.

**Before you start:** the URL of at least one witness you trust — the
first-party node is `https://network.auths.dev` — and the CLI installed.

## 1. Create your identity

```bash
auths init
```

This incepts your KEL locally. Your identifier is derived from the content of
that first event itself — nobody can register it for you, and no registry
account exists to create.

## 2. Designate your witnesses and publish your KEL

```bash
auths witness add --url https://network.auths.dev
auths witness publish
```

`witness add` resolves the node's member key from `/health` and pins it —
future receipts must verify under exactly that key. `witness publish` submits
every event of your KEL to each configured witness, which validates it
cryptographically, stores it under your prefix in the registry it serves, and
returns a signed receipt. Submission is idempotent: republishing after adding
a witness (or after a rotation while offline) is always safe.

From this point, anyone can resolve you from your witnesses:

```bash
git fetch https://network.auths.dev '+refs/auths/*:refs/auths/*'
```

There is no registration call anywhere in this step — the signatures on your
events are the authorization. A witness accepts an event because the math
checks, or refuses it because it doesn't.

## 3. Anchor your witness set in your KEL

```bash
auths witness-set declare \
  --member "network.auths.dev=<member key>" \
  --threshold 1
```

This computes the content hash (SAID) of the set and anchors it in your KEL
with an interaction event. It is what stops a counterfeit "witness set" from
being presented alongside your name: a verifier resolves the set's SAID from
YOUR KEL, so a set you never anchored is rejected outright.

## 4. Export a witnessed attestation

```bash
auths-mcp export-attestation \
  --live-dir ./live \
  --agent <agent-did> --root <root-did> \
  --out ./public/activity.json \
  --anchor-to https://network.auths.dev \
  --witness "network.auths.dev=<member key>" \
  --witness-threshold 1
```

The export collects cosignatures to your threshold and embeds the finalized
anchor inside `activity.json`. It fails outright below threshold — there is no
silent unanchored fallback. See
[Anchor your attestation](/witness-network/users/anchor-your-attestation)
for every flag.

## 5. Publish at your listing's attestation URL

Host `activity.json` (and `audit.json` if you publish per-call receipts) at a
stable HTTPS URL, and set that URL as your listing's `attestationUrl`. Buyers
and the market verify everything offline from those files plus your witnesses:
your keys from your KEL, your witness set from your KEL, the anchor from the
cosignatures, freshness from the latest anchor your witnesses serve.

## What each step protects

| Step | Without it |
| --- | --- |
| Publish your KEL | Nobody can resolve your current keys — every verification of you fails closed. |
| Anchor the witness set | A presented set is only self-consistent; an attacker could present a different "set" for you to different verifiers. |
| Anchored export | Your history's growth is unwitnessed — rollback of the recent past stays deniable. |
| Stable attestation URL | Buyers have nothing to verify against; the listing renders unverified. |
