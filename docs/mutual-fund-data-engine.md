# Mutual-Fund Data Engine

## Data model

The database separates providers, fund houses, schemes, field-level values, NAV history, holdings, allocations, documents, sync runs, failures, and immutable source metadata. Imported records carry their provider, official source URL, fetch time, effective date, sync run, status, and optional checksum.

## Provider lifecycle

Providers implement a typed `DataProvider` contract: fetch, validate, normalize, then persist. The frontend reads normalized domain records and never provider payloads. A refresh creates a sync run before fetching. New values are promoted only after validation; omitted fields and failed refreshes do not erase the last successful value. Run statistics and restricted failure details are retained.

## Connected and pending sources

- **Connected:** official AMFI Complete NAV Report at `https://portal.amfiindia.com/spages/NAVAll.txt`. It supplies scheme identity, plan/option, NAV, and NAV date.
- **Configuration required:** SEBI filing metadata. No stable machine-readable filing endpoint is claimed.
- **Configuration required:** AMC factsheets, portfolios, SID, KIM, SAI, Scheme Summary Documents, and other disclosures. Each AMC needs verified official URLs and a source-specific adapter.

## Freshness and status

AMFI uses a 48-hour configurable freshness threshold. A valid timestamp inside the threshold is live; an older timestamp is stale; missing data is unavailable. Document availability requires both a validated official URL and a successful fetch timestamp. Freshness indicates recency, not suitability.

## Scheduling and security

The external refresh endpoint is `/api/public/fund-sync` and accepts POST only. It requires the server-held `LOVABLE_CRON_SECRET` in the `x-cron-secret` header. No public write or manual-sync control is exposed. Provider schedules are configuration metadata until a Cloud Job is configured against this endpoint. Detailed failure rows and source snapshots are not publicly readable.

## Public presentation

`/funds` and `/funds/$fundSlug` read normalized database records and preserve demonstration pages as an explicit fallback until a successful official sync exists. `/data-status` exposes only safe provider, freshness, and aggregate run information. Every page retains the site's distributor-only positioning and market-risk disclaimer.