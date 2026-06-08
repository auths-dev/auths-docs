---
title: Prove Provenance
description: Verify the authenticity and origin of code commits
---

## What is Code Provenance?

Code provenance is the complete chain of custody for your code. It proves:
- **Who** wrote the code
- **When** it was written
- **Where** it came from
- **Why** it was changed

With Auths, you can cryptographically prove all of these facts.

## Verifying a Commit

To verify that a commit is authentic:

```bash
auths verify-commit <commit-hash>
```

This will check:
1. The signature is valid
2. The signing key is trusted
3. The commit hasn't been modified

## Checking Commit History

Verify an entire branch:

```bash
auths verify-branch main
```

This checks all commits and reports:
- Total commits
- Signed vs. unsigned
- Any invalid signatures
- Key information

## Building a Proof

Generate a proof document for a release:

```bash
auths prove --ref v1.0.0 --output proof.json
```

The proof includes:
- Commit hash
- Author identity
- Timestamp
- Signature
- Chain of custody

## Publishing Proof

Share proof with stakeholders:

```bash
auths proof publish proof.json --to team
```

This allows others to independently verify the code's authenticity.

## Verification in CI/CD

Enforce signature verification in your pipeline:

```yaml
- name: Verify Commits
  run: auths verify-branch --require-signed
```

This will fail the build if any unsigned commits are found.

## Best Practices

1. **Sign all commits** - Make it mandatory
2. **Verify before release** - Check all commits before deploying
3. **Archive proofs** - Keep proof documents for compliance
4. **Rotate keys** - Regularly update signing keys
5. **Audit access** - Monitor who can sign commits

## Advanced Topics

- [Delegation](/docs/concepts/delegation)
- [Key Rotation](/docs/concepts/key-rotation)
- [Supply Chain Security](/docs/concepts/identity-model)

## Related

- [Sign Commits](/docs/sign-commits)
- [Build Agents](/docs/build-agents)
- [Team Identities](/docs/team-identities)
