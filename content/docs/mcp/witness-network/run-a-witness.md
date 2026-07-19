---
title: "Run a witness"
description: "One container, three roles, one durable volume: stand up a conformant witness node, hand your member key to a principal, and keep the anti-equivocation memory safe."
product: mcp
section: "Witness network"
order: 5
lastReviewed: "2026-07-20"
---

A witness is one operator artifact: a hardened HTTP surface, a durable anchor
store, an append-only log, and one signing identity. It reimplements no
protocol — the same acceptance rule and log code every verifier runs is what
the node serves.

## Quickstart

{% steps %}
{% step title="Boot the node" %}
```bash
git clone https://github.com/auths-dev/auths
cd auths/deploy/witness
WITNESS_SEED=$(openssl rand -hex 32) docker compose up -d
```

The compose file pins a durable volume for `/data`, mounts your registry copy
read-only, and wires a container healthcheck. Keep the seed: it **is** the
witness identity, and it must be identical on every restart.

```output
witness-node: anchor role up as `acme-w1` (member key did:key:z6Mk…)
witness-node: listening on 0.0.0.0:3333
```

Prefer bare metal? The binary takes the same shape:

```bash
witness-node serve --roles anchor,kel,cosign --bind 0.0.0.0:3333 \
  --data-dir /data --registry /registry --witness-name acme-w1
```
{% /step %}

{% step title="Hand the member key to your principal" %}
First boot prints your **member key**. Whoever's history you witness adds it
— with your public name and operator facts (operator, organization,
jurisdiction, infrastructure) — to their declared set. From then on your
cosignature counts toward their `t`-of-`N`.

Being removed from a set is the principal's one-liner, not yours: sets are
theirs to declare, signatures are yours to give.
{% /step %}

{% step title="Prove conformance" %}
```bash
cargo xtask witness-conformance --url http://127.0.0.1:3333
```

```output
witness-conformance: live endpoint http://127.0.0.1:3333 passed 4/4 transport checks
```

Passing [the harness](/mcp/witness-network/conformance) is the only entry bar
for the [public directory](https://auths.dev/network).
{% /step %}
{% /steps %}

## The three roles

| Role | What it serves | Why it exists |
| --- | --- | --- |
| `anchor` | Spend-anchor acceptance and reads | The witness network's core: monotone growth or a duplicity proof |
| `kel` | Receipt witnessing for key histories | Freshness for identity events, same posture |
| `cosign` | Transparency-log checkpoint cosigning | Countersigns log heads so log operators can't rewrite either |

Default is all three — one identity, one data dir, one hardening envelope. A
role whose requirements aren't configured refuses to start with a named
error; a partially configured witness never serves.

## The surfaces

| Endpoint | Behavior |
| --- | --- |
| `POST /v1/anchor` | Verify the party signature against their registry, enforce monotone growth, co-sign, log, return `{cosignature, inclusion}`. A fork at an existing index returns **409 with a duplicity proof** |
| `GET /v1/anchor/{seed}` | The latest co-signed anchor for a chain — the public withholding-detection read |
| `GET /health` | Liveness |

Hardening is built in, not bolted on: request bodies are capped small (an
anchor is a few KiB; anything larger is hostile), concurrency is limited, and
slow requests are timed out.

## What you must keep safe

{% callout type="danger" title="The data dir is the anti-equivocation memory" %}
The anchor store under `--data-dir` is the reason a fork gets caught: it
holds the last co-signed anchor per chain. Run it on a persistent volume,
back it up, and never wipe it — a witness with amnesia will happily co-sign
the rollback it exists to refuse. The same dir holds your append-only log;
the seed must survive restarts for the same reason.
{% /callout %}

Two operational duties round it out:

- **Keep the registry copy current.** The anchor role resolves each
  submitter's current keys from the local registry copy at `--registry`; a
  stale copy refuses legitimate anchors (fail-closed, never fail-open). The
  node refuses to start the role if the path is missing.
- **Expect to be watched.** Watchers read your log and your latest-anchor
  surface and compare them across witnesses. That's the job: being the party
  whose silence or contradiction would be visible.

Helm charts and Terraform for AWS, GCP, and Azure ship beside the compose
file in `deploy/witness/` — the same templates the first-party quorum runs.
