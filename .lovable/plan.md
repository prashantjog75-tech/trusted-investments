# Automatic Mutual-Fund Data Engine

## Build
- Add a normalized Lovable Cloud schema for AMCs, schemes, source-aware values, allocations, holdings, documents, providers, sync runs, failures, and immutable source snapshots, with public read-only policies and server-only writes.
- Add typed domain, repository, normalization, freshness, and ingestion modules. New data is validated and promoted atomically; missing or failed fields retain their last valid value, with every outcome traceable to a sync run.
- Implement the official AMFI text-report adapter using the documented `NAVAll.txt` format and exact official source URL. Keep SEBI and AMC document adapters configuration-driven and disabled until verifiable source-specific URLs are supplied.
- Add a secured scheduled-sync endpoint contract and provider schedules. Because no admin authentication or shared scheduler secret exists yet, expose no public write control; document the required configuration and show a disabled control in the safe read-only status page.
- Convert `/funds` and `/funds/$fundSlug` to database-backed reads while preserving the current hierarchy and clearly distinguished live, stale, unavailable, and demonstration states. Existing demonstration URLs remain readable until verified records replace them.
- Add a public read-only `/data-status` page showing safe provider and freshness information without exposing failure payloads or write controls.

## Verification
- Test AMFI parsing, normalization, valid/idempotent upserts, omitted-field preservation, failure retention, freshness, document availability, disabled/unconfigured providers, malformed payloads, invalid NAV/dates, and sync statistics.
- Run database linting, focused tests, TypeScript checks, and the production build.
- Verify fund pages and data status on desktop/mobile, labels, source URLs/timestamps, navigation preservation, no fabricated live data, broken requests, runtime errors, or overflow.

## Source and operational status
- Connected in code: official AMFI complete NAV text report (`https://portal.amfiindia.com/spages/NAVAll.txt`).
- Configuration-only: official SEBI filing metadata and each AMC's document feeds, because no stable machine-readable endpoints or verified AMC URLs have been supplied.
- Scheduling remains configured but inactive until an administrator sets a shared sync secret and creates the Cloud Job against the secured endpoint.
