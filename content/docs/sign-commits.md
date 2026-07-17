---
title: Sign Commits
description: Cryptographically sign and verify your Git commits with Auths
product: identity
section: Guides
order: 4
lastReviewed: "2026-07-17"
---

Signing a commit proves that **you** authored it — provably, offline, with no central server or API key. This guide assumes you've already installed Auths and run `auths init` (see the [quickstart](/docs/quickstart)).

## Sign a commit

Auths signs an existing commit. Make your commit with Git as usual, then sign it:

```bash
git add .
git commit -m "Add new feature"
auths sign HEAD
```

You should see:

```text
✔ Signed: HEAD
  Verify with `auths verify HEAD` or `git log --show-signature`.
```

`auths sign` auto-detects its target. You can also pass a **commit range** to sign several at once:

```bash
auths sign HEAD~3..HEAD
```

## Verify a signature

```bash
auths verify HEAD
```

`auths verify` defaults to `HEAD`; pass a commit, range, or attestation to check something else:

```bash
auths verify <commit-sha>
auths verify HEAD~5..HEAD
```

A successful verification confirms the signature resolves to a trusted identity and the commit hasn't been altered.

## Trusting other signers

Verification checks signatures against your **trusted identity roots**. Pin a teammate's identity (they share their DID and public key, e.g. from `auths whoami` and `auths id show`) so their commits verify on your machine:

```bash
auths trust pin --did did:keri:E... --key <pubkey-hex>   # pin an identity as trusted
auths trust list                                         # show pinned identities
auths trust show did:keri:E...                           # details for one identity
```

See [Team Identities](/docs/team-identities) for sharing identities across a team.

## Configuration

Auths stores configuration with `auths config`. For example, to control how long your passphrase is cached:

```bash
auths config set passphrase.cache always
auths config get passphrase.cache
```

Run `auths config --help` for available keys.

## Key management

Your signing key is created and managed by `auths init`. Rotation, additional keys, and identity inspection live under the advanced identity commands (`auths id …`, visible via `auths --help-all`) — for example `auths id rotate`. See [Key Rotation](/docs/concepts/key-rotation) for the model behind pre-rotation and why old signatures stay valid after a rotation.

## Troubleshooting

### Verification failed

If verification fails, check that:
- The signer's identity is pinned (`auths trust list`)
- The commit hasn't been modified since signing
- Your local clock is roughly correct

### Run a health check

```bash
auths doctor
```

`auths doctor` reports common setup problems (and `auths doctor --fix` repairs what it can).

## Next steps

- [Prove provenance](/docs/prove-provenance) — verify ranges, artifacts, and CI builds
- [Team identities](/docs/team-identities) — share and trust identities across a team
- [Key rotation](/docs/concepts/key-rotation) — how rotation preserves historical validity
