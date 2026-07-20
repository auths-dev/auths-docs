---
title: "Deploy for real"
description: "Helm, Terraform, or systemd — with a pinned image digest and a durable anchor store."
product: witness
section: "Operators"
order: 2
lastReviewed: "2026-07-20"
---

The same templates the first-party quorum runs ship in `deploy/witness/`.

## Helm

```bash
helm install acme-w1 ./deploy/witness/helm \
  --set image.digest=sha256:<digest> \
  --set seed.existingSecret=acme-w1-seed \
  --set anchorStore.size=10Gi
```

## Terraform

```bash
cd deploy/witness/terraform/aws
terraform init
terraform apply -var image_digest=sha256:<digest> -var witness_seed=$WITNESS_SEED
```

`terraform/` has `aws`, `gcp`, and `azure`. Running your quorum across providers
is how a fleet spans distinct infrastructure and jurisdictions.

## systemd

```bash
cp docs/deployment/witness/witness-node.service /etc/systemd/system/
systemctl enable --now witness-node
```

## Non-negotiables

| Rule | Why |
| --- | --- |
| **Pin the image by digest** | A tag is not reproducible. Verifiers can check which binary you ran. |
| **Durable volume for `/data`** | It's the anti-equivocation memory — never `tmpfs`, never wiped. |
| **Back up `/data` and the seed** | Losing either makes you a new witness with no memory. |
| **One writer** | Single replica, `Recreate` strategy, `ReadWriteOnce`. Two writers can co-sign a fork. |

{% callout type="warning" title="Restore is not a fresh start" %}
If you restore `/data` from a backup that is *behind* your real position, you
can co-sign an index you already signed differently. Restore the newest state
you have, or rotate to a new identity.
{% /callout %}

**If it fails:** a pod that starts and immediately exits is usually a missing
`WITNESS_SEED` secret or an unmountable data volume — check the named startup
error before anything else.

**Next:** [Keep the registry synced](/witness-network/operators/keep-the-registry-synced).
