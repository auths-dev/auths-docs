---
title: "witness-node CLI"
description: "Every flag on serve and healthcheck, and what each role requires."
product: witness
section: "Reference"
order: 1
lastReviewed: "2026-07-20"
---

## `witness-node serve`

```bash
witness-node serve --roles anchor,kel,cosign --bind 0.0.0.0:3333 \
  --data-dir /var/lib/auths-witness \
  --registry /var/lib/auths-registry \
  --witness-name acme-w1
```

| Flag | Default | Meaning |
| --- | --- | --- |
| `--roles <list>` | `anchor,kel,cosign` | Comma-separated roles to serve. |
| `--bind <addr>` | `127.0.0.1:3333` | Bind address. Use `0.0.0.0:3333` in a container. |
| `--data-dir <dir>` | *required* | Durable anchor store **and** append-only log. Must be a persistent volume. |
| `--registry <dir>` | *required* | Local copy of the parties' public identity registry, used to resolve submitters' current keys. |
| `--witness-name <name>` | *required* | Public name carried in cosignatures and checkpoints. |
| `--seed <hex>` | env `WITNESS_SEED` | 64-hex Ed25519 seed. One key serves cosignatures **and** log checkpoints. |

`WITNESS_SEED` is read from the environment so the value never lands in
`ps`/shell history.

## `witness-node healthcheck`

```bash
witness-node healthcheck --url http://127.0.0.1:3333/health
```

| Flag | Meaning |
| --- | --- |
| `--url <url>` | Health URL to probe. Exit `0` iff the response is 200. |

A dependency-free HTTP/1.0 probe over a plain socket — it runs inside the
distroless image where no HTTP tooling exists.

## The roles

| Role | Serves | Requires |
| --- | --- | --- |
| `anchor` | Spend-anchor acceptance and reads | `--data-dir`, `--registry` |
| `kel` | Receipt witnessing for key histories | `--data-dir` |
| `cosign` | Transparency-log checkpoint cosigning | `--data-dir` |

All roles share one identity seed, one data dir, and one hardening envelope. A
role whose requirements aren't configured **refuses to start with a named
error** — a partially configured witness never serves.

## Identity

The seed *is* the witness. Changing it produces a different member key, which
stops counting toward any principal's threshold. The member key is printed at
first boot:

```output
witness-node: anchor role up as `acme-w1` (member key did:key:z6Mk…)
```
