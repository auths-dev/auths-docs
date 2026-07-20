---
title: "Run a node in 5 minutes"
description: "One container, three roles, one identity seed — up and answering /health."
product: witness
section: "Operators"
order: 1
lastReviewed: "2026-07-20"
---

**Before you start:** Docker, and a local copy of the parties' public identity
registry (see [Keep the registry synced](/witness-network/operators/keep-the-registry-synced)).

```bash
git clone https://github.com/auths-dev/auths
cd auths/deploy/witness

export WITNESS_SEED=$(openssl rand -hex 32)   # this IS your identity — keep it
export WITNESS_REGISTRY=/path/to/registry     # required; mounted read-only
export WITNESS_NAME=acme-w1

docker compose up -d
```

Confirm it's up:

```bash
curl -s localhost:3333/health
```

```output
{"status":"ok","roles":["anchor","kel","cosign"],"witness":"acme-w1"}
```

Your **member key** is printed at first boot — that's what principals add to
their declared set:

```bash
docker compose logs | grep 'member key'
```

```output
witness-node: anchor role up as `acme-w1` (member key did:key:z6Mk…)
```

{% callout type="danger" title="Two things will silently break trust" %}
- **`WITNESS_SEED` must be identical on every restart.** A changed seed is a
  *new witness* — your cosignatures stop counting toward anyone's threshold.
- **`/data` must be a durable volume.** It holds the last anchor you co-signed
  per chain. A witness with amnesia will happily co-sign the rollback it exists
  to refuse.
{% /callout %}

## Without Docker

```bash
witness-node serve --roles anchor,kel,cosign --bind 0.0.0.0:3333 \
  --data-dir /var/lib/auths-witness \
  --registry /var/lib/auths-registry \
  --witness-name acme-w1
```

`WITNESS_SEED` is read from the environment. Full flags:
[witness-node CLI](/witness-network/reference/witness-node-cli).

**If it fails:**

- *`set WITNESS_REGISTRY…`* — compose requires it; there is no default.
- *a role refuses to start* — that role's required config is missing. The node
  fails closed with a named error rather than serving a half-configured witness.

**Next:** [Deploy for real](/witness-network/operators/deploy-for-real).
