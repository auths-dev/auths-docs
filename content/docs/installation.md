---
title: Installation
description: Get the Auths CLI up and running
---

## System Requirements

- **OS**: macOS or Linux (Windows via WSL or build-from-source)
- **RAM**: 256 MB minimum
- **Disk Space**: 50 MB for CLI
- **Pre-built binaries**: Linux `x86_64`/`aarch64` and macOS `aarch64` (Apple Silicon). Intel Macs (`x86_64`) install via Homebrew or build from source.

## Install via Homebrew (recommended)

The recommended way to install Auths on macOS (Intel **and** Apple Silicon) and Linux:

```bash
brew tap auths-dev/auths-cli
brew install auths
```

Or as a single command:

```bash
brew install auths-dev/auths-cli/auths
```

This installs the `auths`, `auths-sign`, and `auths-verify` binaries. Then verify:

```bash
auths --version
```

## Install via curl

> **Coming soon.** The one-line installer below points at `get.auths.dev`, which is not yet deployed. Until it goes live, use **Homebrew** (above) or **build from source** (below). Pre-built binaries are not available for macOS `x86_64` (Intel) — Intel Mac users should use Homebrew.

```bash
curl -fsSL https://get.auths.dev | sh
```

For the security-conscious, download and inspect the script before running it:

```bash
curl -fsSL https://get.auths.dev -o auths-install.sh
less auths-install.sh   # review
sh auths-install.sh
```

## Build from source (advanced)

Requires a [Rust toolchain](https://rustup.rs). Auths is not yet published to crates.io, so install from git:

```bash
cargo install --git https://github.com/auths-dev/auths.git auths-cli
```

Or clone and build:

```bash
git clone https://github.com/auths-dev/auths.git
cd auths
cargo build --release
```

The binaries will be at `target/release/auths` (and `auths-sign`, `auths-verify`).

## Verify Installation

Test that Auths is working:

```bash
auths --help
auths --version
auths doctor
```

`auths doctor` runs environment checks and reports your install health. `auths --version` prints the installed version (matching the latest release).

## First-Time Setup

After installation, initialize your identity:

```bash
auths init
```

This guided wizard will:
1. Create a configuration directory
2. Generate your first signing key
3. Set up default options

> New here? Follow the [5-minute quickstart](/docs/quickstart) to sign and verify your first commit.

## Updating Auths

With Homebrew:

```bash
brew upgrade auths
```

If you built from source, re-run the `cargo install --git …` command above to pull the latest.

## Troubleshooting

### Command Not Found

If `auths` is not in your PATH:
- **Homebrew**: ensure `brew` is on your PATH (`brew --version`); Homebrew links binaries automatically.
- **curl installer**: it installs to `~/.auths/bin` — add it to your PATH: `export PATH="$HOME/.auths/bin:$PATH"`
- **Cargo**: ensure Cargo's bin directory is on your PATH: `export PATH="$HOME/.cargo/bin:$PATH"`
- Restart your terminal.

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

- [5-minute quickstart](/docs/quickstart)
- [Sign your first commit](/docs/sign-commits)
- [Set up team identities](/docs/team-identities)
- [Configure for CI/CD](/docs/build-agents)
