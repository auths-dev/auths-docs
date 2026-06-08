---
title: Team Identities
description: Manage multiple identities and signing keys for your team
---

## Overview

Team identities allow you to manage multiple signing keys for different team members and purposes. This guide shows how to set up and manage identities.

## Creating an Identity

Create a new identity for a team member:

```bash
auths identity create --name "alice" --email "alice@example.com"
```

This generates:
- A public key
- A private key (stored securely)
- An identity configuration

## Managing Team Keys

### List all identities

```bash
auths identity list
```

Output:
```
ID              Name    Email                 Created
abc123          alice   alice@example.com     2024-01-15
def456          bob     bob@example.com       2024-01-16
```

### Export a public key

```bash
auths identity export-public-key alice
```

### Add a team member's public key

```bash
auths identity add-public-key alice alice-public.pem
```

## Delegation

Grant other team members permission to sign on your behalf:

```bash
auths delegation create alice --delegate bob
```

This allows Bob to sign commits on Alice's behalf with proper attribution.

## Team Policies

### Require Code Review

Enforce that all commits must be reviewed before merging:

```bash
auths policy set code-review-required true
```

### Key Rotation Schedule

Set a key rotation policy:

```bash
auths policy set key-rotation-days 90
```

## Best Practices

1. **One key per person** - Each team member should have their own signing key
2. **Regular rotation** - Rotate keys every 3-6 months
3. **Secure storage** - Store private keys in a secure location
4. **Share public keys** - Distribute public keys through your team's secure channels
5. **Audit access** - Regularly review who has access to signing keys

## Troubleshooting

### Identity Not Found

If you get an "identity not found" error:
- Verify the identity name is correct
- List all identities with `auths identity list`
- Check the configuration file

### Key Mismatch

If signing fails with a key mismatch:
- Ensure you're using the correct identity
- Verify the private key file exists
- Check file permissions (should be 600)

## Related Topics

- [Sign Commits](/docs/sign-commits)
- [Delegation](/docs/concepts/delegation)
- [Key Rotation](/docs/concepts/key-rotation)
