---
title: Sign Commits
description: Learn how to cryptographically sign your commits with Auths
---

## Getting Started

Commit signing is the foundation of code provenance. By signing your commits, you prove that you are the author and authorize the changes being made.

### Prerequisites

- Auths CLI installed and configured
- A Git repository
- A valid signing key

## Installation

First, install the Auths CLI:

```bash
cargo install auths
```

Verify the installation:

```bash
auths --version
```

## Signing Your First Commit

To sign a commit, use the `sign-commit` command:

```bash
auths sign-commit
```

This command will:
1. Read your staged changes
2. Generate a signature using your private key
3. Add metadata to your commit message

### Example Workflow

```bash
# Make changes to your code
git add .

# Sign and commit
auths sign-commit -m "Add new feature"

# View the signed commit
git log --oneline -1
```

## Verifying Signatures

To verify that a commit was signed correctly:

```bash
auths verify-commit <commit-hash>
```

This will validate the signature against the public key and confirm the commit's authenticity.

## Configuration

### Set Your Default Key

Configure which key to use for signing:

```bash
auths config set signing-key <key-name>
```

### Enable Automatic Signing

To automatically sign all commits:

```bash
auths config set auto-sign true
```

## Advanced Topics

### Multiple Keys

You can manage multiple signing keys:

```bash
auths key list
auths key add <new-key>
auths key remove <old-key>
```

### Key Rotation

Rotate your signing key regularly for security:

```bash
auths key rotate
```

## Troubleshooting

### Signature Verification Failed

If verification fails, check that:
- The correct public key is available
- The commit hasn't been modified
- Your local clock is synchronized

### Permission Denied

If you get permission errors:
- Ensure your key file has correct permissions (600)
- Check that you have read access to the key file
- Verify the key path in your config

## Best Practices

1. **Sign all commits** - Make signing a standard part of your workflow
2. **Rotate keys regularly** - Update your signing keys every 6-12 months
3. **Secure key storage** - Keep private keys in a safe location
4. **Share public keys** - Distribute your public key through secure channels
5. **Verify critical commits** - Always verify signatures on production releases

## Next Steps

- Learn about [team identities](/docs/team-identities)
- Explore [key rotation](/docs/concepts/key-rotation)
- Set up [build agents](/docs/build-agents) for CI/CD
