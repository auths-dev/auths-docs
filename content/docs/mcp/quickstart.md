---
title: Quickstart
description: Wrap a filesystem MCP server, ask for something out of scope, and watch the gateway refuse it — five minutes, zero money at risk.
product: mcp
section: Get started
order: 3
badge: new
lastReviewed: "2026-07-17"
---

The fastest way to trust the gate is to watch it say no. You'll wrap a filesystem
MCP server with a read-only scope, then ask the agent to write — and the gateway
will refuse the call before the server ever sees it. No card, no wallet.

{% steps %}
{% step title="Prepend one wrap line to a server you already have" %}
In your MCP client config (Claude Desktop, Claude Code, or Cursor's `mcp.json`),
wrap the filesystem server line by prepending the gateway:

```json {% filename="mcp.json" %}
"filesystem": {
  "command": "npx",
  "args": ["-y", "@auths-dev/mcp", "wrap", "--scope", "fs.read", "--budget", "$5", "--ttl", "30m",
           "--", "npx", "-y", "@modelcontextprotocol/server-filesystem", "/Users/me/proj"]
}
```

Everything after `--` is the untouched server line you already had. The agent keeps
working — now bounded to `fs.read`, a `$5` budget, and a 30-minute lifetime.
{% /step %}

{% step title="Make an in-scope call" %}
Ask the agent to read a file. The call is inside the granted scope, so the gate
forwards it and writes a receipt:

```output
✓ read_file → allowed
```
{% /step %}

{% step title="Cause the refusal" %}
Now ask the agent to write a file. `fs.read` never granted that capability, so the
gate refuses the call — the downstream server is never invoked:

```output
✗ write_file → outside-agent-scope · refused
```

The model can decide whatever it likes; the boundary holds. That refusal — with its
receipt — is the product working.
{% /step %}

{% step title="Let it expire" %}
After the 30-minute TTL, nothing the agent signs passes: every call is
{% verdict code="agent-expired" /%} until you wrap again with a fresh delegation.
Short lifetimes are cheap; use them.
{% /step %}
{% /steps %}

## What you just proved

The agent held a delegation with three bounds — scope, budget, expiry — and the
gateway refused the call that exceeded one of them, at the protocol boundary,
fail-closed. How the gate decides is one short page:
[how it works](/docs/mcp/concepts/how-it-works).

When you're ready to bound something that spends, go to
[spend real money](/docs/mcp/guides/spend-real-money) — same gate, real rails,
`--test-mode` first.
