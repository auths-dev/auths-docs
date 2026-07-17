---
title: Quickstart
description: Install Auths, create an identity, and verify your first signed commit in five minutes
product: identity
section: Guides
order: 1
lastReviewed: "2026-07-17"
badge: new
---

Go from zero to a **verified, signed commit** in about five minutes — entirely offline, no account or server required.

> **Before you start, you'll need:**
> - **macOS or Linux** (Windows via WSL). Intel Macs are supported via Homebrew.
> - **Homebrew** installed ([brew.sh](https://brew.sh)).
> - A **Git repository with at least one commit** — this guide signs your latest commit (`HEAD`).
>
> `auths init` will ask you to set a **passphrase** that protects your signing key. For non-interactive environments (CI), set `AUTHS_PASSPHRASE` instead. Keys are stored under `~/.auths`.

## 1. Install

```bash
brew install auths-dev/auths-cli/auths
```

Confirm it's on your PATH:

```bash
auths --version
```

You should see the installed version printed. (Other install methods — curl, build-from-source — are on the [installation page](/docs/installation).)

## 2. Create your identity

```bash
auths init
```

This guided wizard generates your signing key, sets up Git signing, and stores everything under `~/.auths`. You'll be prompted for a passphrase. To skip the prompts entirely:

```bash
auths init --non-interactive
```

Check who you are:

```bash
auths whoami
```

You should see your new identity — a `did:keri:…` identifier: a decentralized ID backed by a *key event log* (KEL), a tamper-evident history of your keys. No account, no server.

## 3. Sign a commit

Make sure you have a commit to sign, then sign your latest one:

```bash
auths sign HEAD
```

You should see output like:

```text
✔ Signed: HEAD
  Verify with `auths verify HEAD` or `git log --show-signature`.
```

> Already have staged changes? `auths sign` also accepts a commit range or an artifact file path — it auto-detects what you gave it.

## 4. Verify it

```bash
auths verify HEAD
```

A successful verification is the **payoff** — it confirms the commit's signature resolves to your identity, checked locally with no network call:

```text
✔ Verified: HEAD
  Signer: did:keri:…
  Signature valid.
```

That's it — you've produced and verified offline provenance for a commit. 🎉

> **Tip:** run `auths status` for an overview of your identity and signing setup, or `auths demo` for a zero-config offline sign-and-verify you can run anywhere.

## See it in the browser (optional)

Auths can render a **"Verified" badge** for a repository's releases using the embeddable [verify widget](https://github.com/auths-dev/auths). This is an optional next step — the badge resolves a published release attestation (a signed statement binding an artifact to an identity), so it lights up green once a repo publishes one. Your terminal `auths verify` above is the source of truth and works today with no extra setup.

## Next steps

- **[Give an AI agent a scoped passport](/docs/mcp-setup)** — set up Auths for a Claude or Cursor MCP agent.
- **[Agent hello-world (`auths-agent-demo`)](https://github.com/auths-dev/auths-agent-demo)** — the canonical agent/SDK demo: an operator delegates scoped, time-bounded authority to AI agents, and a server verifies it (Python SDK; install from source with `pip install -e .`).
- **[Sign commits in depth](/docs/sign-commits)** — signing ranges, CI, and team workflows.
- **[Concepts](/docs/concepts/identity-model)** — how identities, keys, and verification work under the hood.
