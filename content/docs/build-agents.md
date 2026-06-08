---
title: Build Agents
description: Automate code signing with agents in your CI/CD pipeline
---

## Overview

Agents are automated systems that can sign commits on behalf of your team. They're perfect for CI/CD pipelines, bots, and automated processes.

## Creating an Agent

Create a new agent:

```bash
auths agent create --name "ci-bot" --type github-actions
```

This generates an agent configuration and credentials.

## GitHub Actions Integration

### Set up GitHub Actions

Add the Auths action to your workflow:

```yaml
name: Sign Commit
on: [push]

jobs:
  sign:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: anthropics/auths-action@v1
        with:
          agent-token: ${{ secrets.AUTHS_AGENT_TOKEN }}
          signing-key: main
```

### Configure Secrets

Set up the agent token as a GitHub secret:

```bash
auths agent get-token ci-bot | \
  gh secret set AUTHS_AGENT_TOKEN --input -
```

## Agent Policies

### Restrict Agent Permissions

Limit what an agent can do:

```bash
auths agent policy set ci-bot \
  --allow-branches "main,develop" \
  --allow-paths "src/" \
  --require-review true
```

### Audit Agent Activity

View all commits signed by an agent:

```bash
auths agent audit ci-bot --since "7 days ago"
```

## Security Considerations

1. **Use separate keys** - Each agent should have its own signing key
2. **Short-lived credentials** - Use time-limited tokens when possible
3. **Minimal permissions** - Grant agents only the permissions they need
4. **Audit regularly** - Monitor agent activity for anomalies
5. **Rotate tokens** - Rotate agent credentials frequently

## Troubleshooting

### Agent Authentication Failed

If the agent fails to authenticate:
- Verify the agent token is correct
- Check that the token hasn't expired
- Ensure the agent is enabled

### Signature Invalid

If signatures are invalid:
- Verify the signing key is configured correctly
- Check the system clock
- Ensure the agent has the latest version

## Advanced Topics

- [Custom Agents](/docs/concepts/delegation)
- [Multi-step Workflows](/docs/reference/cli)
- [Integration Testing](/docs/build-agents)

## Related

- [Sign Commits](/docs/sign-commits)
- [Team Identities](/docs/team-identities)
- [CI/CD Integration](/docs/reference/github-actions)
