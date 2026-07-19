# Witness-network docs — coverage plan

**Date:** 2026-07-20 · **Section:** `content/docs/mcp/witness-network/` ·
**Nav:** one collapsible "Witness network" group in the auths-mcp sidebar
(large topics collapse to a single row; sub-pages show on expand).

## The two audiences, and what each must be able to do

### Users of the network

**A seller / agent operator (the anchoring side)** must be able to:
- Say why they'd anchor at all: an unanchored attestation proves authenticity
  and monotonicity to whoever fetched it — but rolling it back or showing two
  verifiers two histories is deniable. Anchoring makes both attributable.
- Declare a witness set (name = member key pairs, threshold) and understand
  what the threshold trades off (liveness vs. how many operators must collude).
- Anchor at export time (`export-attestation --anchor-to …`) and read the
  outcome: cosignatures collected to the threshold, the finalized anchor
  embedded in `activity.json`, and the fail-closed rule — below threshold, the
  export fails rather than silently publishing unanchored.
- Know the privacy line: a witness sees the aggregate tuple only, never a
  per-call row, never a counterparty.
- Know the payoff: the market credits a `witness`-tier observation only from a
  verified embedded anchor; the listing badge upgrades to quorum-anchored.

**A relying party / buyer (the verifying side)** must be able to:
- Read the freshness ladder — `fresh`, `stale`, `unanchored` — and know it is
  reported beside the authorization verdicts, never folded into them.
- Verify an anchored attestation with one SDK call and interpret the returned
  anchor summary (threshold, set size, cosigners); know that a present-but-bad
  anchor fails the whole document.
- Understand duplicity proofs: what one contains, that it verifies offline by
  strangers, and that its existence is disqualifying evidence.
- Check for withholding: read a witness's latest anchor for a chain and
  compare its timestamp against now.
- Name the trust model plainly: verification needs no account and no Auths
  service; the guarantee ceiling is the independence of the declared set.

### Operators (running a witness)

Must be able to:
- Stand a node up (compose quickstart; or the bare binary) and keep it up:
  one artifact, three roles (`anchor`, `kel`, `cosign`), one identity seed,
  one durable data dir — with the warning that the anchor store is the node's
  anti-equivocation memory and must never be wiped.
- Serve the right surfaces: `POST /v1/anchor`, `GET /v1/anchor/{seed}`,
  `/health`; know the built-in hardening (body cap, concurrency limit,
  request timeout) and the fail-closed startup rule (a role missing its
  adapters refuses to serve).
- Keep the registry copy current: the anchor role resolves the submitting
  party's current keys from a local registry copy; a stale copy refuses
  legitimate anchors.
- Custody the seed: stable across restarts, never exported; what rotation and
  removal from a declared set mean for the operator.
- Prove conformance (`witness-conformance` vectors + live drive) and get
  listed in the public directory (auths.dev/network).
- Deploy for real: the shipped compose/Helm/Terraform templates, health
  probes, and what watchers will observe about the node.

## Page map (6 pages, one nav dropdown)

| Page | File | Audience | Order |
|---|---|---|---|
| The witness network (overview: the freshness problem, the anchor loop, who does what, page index) | `index.md` | both | 1 |
| Anchor your attestation | `anchor-your-attestation.md` | sellers | 2 |
| Verify freshness | `verify-freshness.md` | relying parties | 3 |
| Choose your witnesses | `choose-witnesses.md` | sellers | 4 |
| Run a witness | `run-a-witness.md` | operators | 5 |
| Conformance & the directory | `conformance.md` | operators | 6 |

Reading order doubles as a journey: users first (anchor → verify → choose),
operators after — mirroring how someone meets the network (as a consumer of
its guarantees before a supplier of them).

## Navigation design

- New sidebar capability: a section may be **collapsible** — one row with a
  chevron, expanded automatically when the active page is inside it. Config
  lives beside `SECTION_ORDER` in `lib/content.ts` (the one hand-maintained
  nav input), so the nav still can never disagree with the files on disk.
- "Witness network" is the first collapsible section; existing sections stay
  flat. This keeps the mcp sidebar at four visual groups instead of ten rows
  of new pages.

## Writing constraints (enforced by `scripts/check-docs.mjs`)

- Copy lint: no protocol jargon (the identity layer is "key history" /
  "identity registry"), no hype vocabulary.
- Verdict lint: freshness statuses are plain words; never place a hyphenated
  non-verdict token in verdict position after an arrow.
- Every claim traced to code in the `auths` workspace (witness-node serve
  flags, gateway `export-attestation` flags, conformance harness behavior,
  SDK anchor summary) — nothing aspirational presented as shipped; the cloud
  tiers are mentioned only as "operated service, later" with a pointer to
  auths.dev/network.
- Frontmatter contract: `product: mcp`, `section: Witness network`,
  ascending `order`, fresh `lastReviewed`.
