---
title: CLI Reference
description: Complete reference for Auths CLI commands
---

> 🚧 **Stub** — a full per-command reference hasn't been published here yet. The CLI's own help is the source of truth:

```bash
auths --help        # everyday commands
auths --help-all    # full surface, including advanced `auths id …` commands
auths <command> --help
```

## Everyday commands

| Command | Purpose |
|---------|---------|
| `auths init` | Create your identity and set up Git signing (`--non-interactive` skips prompts) |
| `auths whoami` | Show your identity (`did:keri:…`) |
| `auths status` | Identity + signing overview |
| `auths sign <ref-or-range>` | Sign a commit or range |
| `auths verify <ref/range/file>` | Verify commits or artifacts |
| `auths trust pin / list / show / remove` | Manage trusted identity roots |
| `auths config get / set` | Configuration |
| `auths doctor` | Diagnose (and `--fix`) setup problems |

## Advanced (`auths --help-all`)

| Command | Purpose |
|---------|---------|
| `auths id show / rotate` | Inspect and rotate identity keys |
| `auths id agent add` | Delegate a scoped, expiring identity to an agent |
| `auths id export-bundle` | Export an identity bundle for stateless CI verification |
| `auths artifact sign` | Sign a build artifact (detached `.auths.json` attestation) |
| `auths device list / remove` | Manage paired devices |
| `auths pair` | Pair a mobile device over the local network |

Generated command docs also live in the main repo under [`docs/cli/commands/`](https://github.com/auths-dev/auths/tree/main/docs/cli/commands).
