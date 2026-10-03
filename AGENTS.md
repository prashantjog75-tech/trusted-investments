<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep risk questionnaire definitions, scoring, projection enrichment, and report formatting in separate typed modules so the UI remains reusable and product mapping stays disabled.
- Keep mutual-fund providers, normalization, persistence, domain mapping, and UI reads separate so source adapters remain replaceable and failed refreshes preserve verified values.
- Keep `/funds` browser-only using a bundled official AMFI snapshot; never add runtime data fetching or guessed scheme-document URLs because GitHub Pages must serve it statically.
- Group Regular Plan option variants by fund identity in the directory so each fund has one card and selectable options.
- Keep official document links in a static, verified registry (AMC → fund → variant scope, most specific wins) separate from the directory UI, so links can be added fund house by fund house without guessed URLs.
- Route every public fund read (static snapshot and database scheme pages) through the single allowlist in `src/lib/fund-data/public-scope.ts`, and keep the full AMFI rows in `amfi-snapshot-full.ts` unimported, so excluded fund houses never reach the browser bundle and the scope cannot drift.
- Riskometer data is generated monthly by scripts/riskometer/refresh.mjs (GitHub Actions) into src/lib/fund-data/riskometer-data.ts from official sources listed in scripts/riskometer/sources.json; exact-name matches only, failures keep prior values, because the site is static and levels must never be inferred.
- Keep the website risk profiler's questions, points and profile thresholds in src/lib/risk-profiler/config.ts and email delivery behind the isolated submission adapter, because bands are provisional and the static site cannot hold private keys.
