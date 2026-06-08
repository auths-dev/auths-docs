---
title: MCP Setup
description: Give a Claude or Cursor agent a scoped, expiring, revocable Auths passport
---

This guide explains how Auths secures an **MCP (Model Context Protocol) agent** — a Claude Desktop, Cursor, or Claude Code agent — with a **scoped passport** instead of a long-lived API key.

> **Preview — tooling not yet shipped.** The streamlined, copy-paste setup (a one-command `auths passport present` helper and ready-made client configs) lands with the MCP tooling work (roadmap **G2.4**). This page describes the model and the current building blocks so you can understand it now; the snippets below are **illustrative**, not yet copy-paste-runnable. It will be upgraded to a working walkthrough when G2.4 ships.

## What is an agent passport?

An Auths agent is a **KERI delegated identity** — its own `did:keri:…` incepted under (and anchored by) a human or org identity, carrying a **scope seal** that grants specific capabilities (for example `sign_commit`) with an optional expiry. There are **no bearer tokens**: authority is provable by replaying the key event log, and it's **revocable** at any time.

That makes it a good fit for an AI agent's credential:

- **Scoped** — the agent can only do what its scope seal allows.
- **Expiring** — grant `--expires-in` so a leaked credential dies on its own.
- **Revocable** — revocation is a logged fact; signatures after it stop verifying.

## How the MCP server authorizes a tool call

Auths ships an MCP server (`auths-mcp-server`) that runs as a local HTTP service (default `:8080`). Each tool is mapped to a required capability, so a passport scoped to one capability can't invoke another:

| MCP tool | Required capability |
|----------|---------------------|
| `read_file` | `fs:read` |
| `write_file` | `fs:write` |
| `deploy` | `deploy:staging` |

When the agent calls a protected tool (`POST /mcp/tools/{tool}`), it presents its passport in the HTTP **`Authorization`** header. The server replays the passport's KEL, checks the capability against the table above, and confirms the credential hasn't expired or been revoked before running the tool. (`GET /mcp/tools` and `/health` are public.)

## Least-privilege checklist

Scoping is the whole point — keep it tight:

- **Start from the minimal scope** the agent actually needs (e.g. `sign_commit` only). Add capabilities when a task first requires one, not preemptively.
- **Never grant wildcard/omnibus scopes** ("all", "full-access"). Broad grants enlarge the blast radius and make revocation disruptive.
- **Always set an expiry** (`--expires-in`) for agent credentials.
- **Bind to one audience.** A credential minted for the auths MCP server should not be accepted elsewhere.
- **Review before approving.** A local MCP server runs with your privileges — read the exact command and the requested scope before you approve it in your client.
- **Never paste secrets into a checked-in config.** Use your client's `env`/secret mechanism, and don't commit a project `.mcp.json` containing a credential.

## Where the client config lives

All three clients use the same top-level `mcpServers` object; only the file location differs:

- **Claude Desktop** — `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) / `%APPDATA%\Claude\claude_desktop_config.json` (Windows). **Restart Claude Desktop** after editing.
- **Cursor** — `.cursor/mcp.json` in your project (or `~/.cursor/mcp.json` global). Picks up changes automatically.
- **Claude Code** — a project `.mcp.json`, or `claude mcp add`.

## What the config will look like

Because the auths MCP server speaks HTTP, the client entry will use the remote (`url` + `headers`) form, presenting the passport in the `Authorization` header:

```jsonc
// ILLUSTRATIVE — pending the G2.4 header helper; not yet copy-paste-runnable
{
  "mcpServers": {
    "auths": {
      "type": "http",
      "url": "http://localhost:8080/mcp",
      "headers": {
        "Authorization": "Bearer <agent-passport-presentation>"
      }
    }
  }
}
```

The missing piece today is a one-command way to mint `<agent-passport-presentation>` for the header — that helper is what G2.4 delivers.

## Provisioning a scoped agent today (advanced)

The underlying delegation already works via the advanced identity commands. To delegate a `sign_commit`-scoped agent that expires in a day:

```bash
auths id agent add \
  --label mcp-agent \
  --key my-key \
  --scope sign_commit \
  --expires-in 86400
```

Revoke it at any time:

```bash
auths id agent revoke did:keri:EAgent… --key my-key
```

> These `auths id agent …` commands are advanced/in-flux. G2.4 promotes this into a streamlined `auths passport` workflow plus the header helper and the ready-made client configs above.

## What changes when G2.4 ships

- A one-command `auths passport present --header` (or equivalent) that prints the exact `Authorization` value to paste.
- Copy-paste, validated configs for Claude Desktop, Cursor, and Claude Code.
- A scoped-passport `create / list / revoke` workflow that persists the agent DID for you.

This page becomes the working, copy-paste walkthrough at that point.

## Next steps

- **[Quickstart](/docs/quickstart)** — get an identity and verify a signed commit first.
- **[Delegation](/docs/concepts/delegation)** — how scoped, revocable delegation works under the hood.
