---
title: Installation
description: Get the Auths CLI up and running
---

## System Requirements

- **OS**: macOS, Linux, or Windows
- **RAM**: 256 MB minimum
- **Disk Space**: 50 MB for CLI

## Install via Cargo

The recommended way to install Auths is via Cargo:

```bash
cargo install auths
```

Then verify the installation:

```bash
auths --version
```

## Install via Homebrew

For macOS users:

```bash
brew install anthropic/auths/auths
```

## Install via Package Manager

### Ubuntu/Debian

```bash
sudo apt-get update
sudo apt-get install auths
```

### Fedora/RHEL

```bash
sudo dnf install auths
```

## Install from Source

Clone the repository and build:

```bash
git clone https://github.com/anthropics/auths.git
cd auths
cargo build --release
```

The binary will be at `target/release/auths`.

## Verify Installation

Test that Auths is working:

```bash
auths --help
auths --version
auths health
```

You should see output like:
```
Auths 0.1.0
Proof of provenance for code
...
```

## First-Time Setup

After installation, initialize your configuration:

```bash
auths init
```

This will:
1. Create a configuration directory
2. Generate your first signing key
3. Set up default options

## Updating Auths

To upgrade to the latest version:

```bash
cargo install --force auths
```

Or with Homebrew:

```bash
brew upgrade auths
```

## Troubleshooting

### Command Not Found

If `auths` is not in your PATH:
- Ensure Cargo's bin directory is in your PATH
- For Cargo: `export PATH="$HOME/.cargo/bin:$PATH"`
- Restart your terminal

### Permission Denied

If you get permission errors:
- Check the file permissions: `ls -la ~/.auths/`
- Fix permissions: `chmod 600 ~/.auths/key*`

### Version Mismatch

If you have multiple versions installed:
- Find the active version: `which auths`
- Remove conflicting installations
- Reinstall using your preferred method

## Next Steps

- [Sign your first commit](/docs/sign-commits)
- [Set up team identities](/docs/team-identities)
- [Configure for CI/CD](/docs/build-agents)
