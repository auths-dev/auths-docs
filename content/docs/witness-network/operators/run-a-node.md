---
title: "Run a node in 5 minutes"
description: "One container, three roles, one identity seed — up and answering /health."
product: witness
section: "Operators"
order: 1
lastReviewed: "2026-07-20"
---

**Before you start:** just Docker. A fresh witness boots on an empty registry
and grows as it receipts events — you only need the parties' registry once you
want to *anchor for* them (see [Keep the registry synced](/witness-network/operators/keep-the-registry-synced)).

```bash
git clone https://github.com/auths-dev/auths
cd auths/deploy/witness

export WITNESS_SEED=$(openssl rand -hex 32)   # this IS your identity — keep it
export WITNESS_NAME=acme-w1
# Optional — where to keep the parties' registry (defaults to ./registry beside
# the compose file). Sync it before you expect to anchor for those parties.
export WITNESS_REGISTRY=./registry

docker compose up -d
```

Confirm it's up:

```bash
curl -s localhost:3333/health
```

```output
{"status":"ok","witness_did":"did:key:z6Mk…","first_seen_count":0,"receipt_count":0}
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

- *anchors 404 though `/health` is green* — the node is up but hasn't synced the
  parties' registry, so it can't resolve their keys yet. Sync it (see [Keep the
  registry synced](/witness-network/operators/keep-the-registry-synced)); a
  fresh node is "up" before it's "useful" for a given party.
- *a role refuses to start* — a role whose config is genuinely missing fails
  closed with a named error (e.g. the `registry` role needs the `git` binary on
  PATH), rather than serving a half-configured witness.

**Next:** [Deploy for real](/witness-network/operators/deploy-for-real).
