---
title: Install
description: One line in front of any MCP server — npx today, brew and uvx as fast-follows.
product: mcp
section: Get started
order: 2
lastReviewed: "2026-07-17"
---

The gateway ships as a launcher that resolves a prebuilt binary for your platform.
There is no toolchain to install and nothing to build.

## Prerequisites

- Node 18 or newer.
- A downstream MCP server to wrap (any stock MCP server works — the gateway speaks
  ordinary MCP up to your agent and down to the server).

## The one line

{% code-tabs %}
{% code-tab lang="npx" label="npx" %}
```bash
npx -y @auths-dev/mcp wrap --scope fs.read --budget '$5' --ttl 30m -- <downstream server>
```
{% /code-tab %}
{% code-tab lang="brew" label="brew" %}
```bash
# fast-follow — not yet published
brew install auths-mcp
```
{% /code-tab %}
{% code-tab lang="uvx" label="uvx" %}
```bash
# fast-follow — not yet published
uvx auths-mcp
```
{% /code-tab %}
{% /code-tabs %}

{% callout type="warning" title="Availability" %}
`@auths-dev/mcp` is publishing now; prebuilt binaries ship for linux-x64, linux-arm64,
and darwin-arm64. If `npx` cannot resolve the package yet, build the gateway from
source ([github.com/auths-dev/auths](https://github.com/auths-dev/auths)) and point
`GATEWAY_BIN` at `target/release/auths-mcp-gateway`. The `brew` and `uvx` forms are
fast-follows.
{% /callout %}

In these docs, commands use `auths-mcp` — the installed binary name. The no-install
form is the same command through `npx`: `npx -y @auths-dev/mcp wrap …`.

## The wrap shape

One shape for every downstream — everything after `--` is the untouched server
command you already had:

| Flag | Value | Meaning |
| --- | --- | --- |
| `--scope` | `CAP` (repeatable) | a capability granted to the agent, e.g. `fs.read`, `paid.call` |
| `--budget` | `$5` or `20calls` | the cross-rail spend cap — mandatory when the scope grants `paid.call` |
| `--ttl` | `30m` | the delegation lifetime |
| `--rail` | `stripe` or `x402` | the payment rail the wrapped downstream settles on; when set, every call is metered on this rail from the rail's own response |
| `--test-mode` | flag | opt into sandbox rails; real money is the default. Env twin: `AUTHS_MCP_TEST_MODE=1` |
| `--show-mode` | flag | resolve and disclose the payment mode, then exit — no proxy, no charge |
| `--custody-credential` | `NAME[=VALUE]` (repeatable) | a downstream secret the gateway holds; bare `NAME` adopts it from the gateway's environment |
| `-- <DOWNSTREAM>` | required | the wrapped MCP server command |

## Verify without touching anything

`--show-mode` resolves what a wrap *would* do — the payment mode and the rails it
names — then exits without serving the proxy or touching a rail:

```bash
auths-mcp wrap --show-mode --scope fs.read --budget '$5' -- <downstream server>
```

That's the whole install. Next: [wrap your first server](/docs/mcp/quickstart) —
no money, five minutes.
