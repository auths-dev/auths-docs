---
title: "Monitor your node"
description: "Health, the signed build proof, and the console that re-verifies both in your browser."
product: witness
section: "Operators"
order: 4
lastReviewed: "2026-07-20"
---

Two endpoints, and a console that checks them for you.

```bash
curl -s localhost:3333/health
curl -s localhost:3333/build
```

```output
{"status":"ok","roles":["anchor","kel","cosign"],"witness":"acme-w1"}
{"version":"0.1.12","running_digest":"sha256:…","attestation":{…}}
```

`/build` is the node's **signed** statement of which binary it runs — checked
against the digest you deployed.

## The console

Open your node in the network console at
[auths.dev/network](https://auths.dev/network) → **node**. It reads `/health`
and `/build` and re-verifies the signed payloads **in your browser** with the
published WASM verifier. The node is treated as an untrusted data source;
trust comes from the in-browser check, never the connection.

## Container healthcheck

The image ships its own probe — no `curl` needed inside the container:

```bash
witness-node healthcheck --url http://127.0.0.1:3333/health
```

Exit `0` is healthy. Compose already wires this on a 30s interval.

## What to alert on

| Signal | Meaning |
| --- | --- |
| `/health` non-200 | Node down — your cosignature is missing from live quorums |
| `/build` digest ≠ deployed digest | You're running something you didn't deploy |
| Disk pressure on `/data` | The anchor store cannot grow — anchors will start failing |

**If it fails:** a node that answers `/health` but not `/build` was started
without a build attestation — that surface is optional, not a fault.
