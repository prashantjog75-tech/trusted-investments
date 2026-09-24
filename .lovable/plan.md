# Fund Information & Investment Tools

## What will be added
- Add a dedicated **Fund Information** directory at `/funds`, reached from contextual links on the existing Learn and Services pages without changing the current primary navigation structure.
- Add reusable scheme detail pages at `/funds/$fundSlug`, using clearly labelled sample schemes only to demonstrate the interface until a verified data source is connected.
- Give every scheme page the requested order: **Fund Overview → Key Metrics → Portfolio → Costs & Disclosures → Documents → Investment Tools**.
- Make Expense Ratio, Fund Fact Sheet, Current Portfolio / Holdings, Commission / Distributor Disclosure, KIM, SID, and SAI prominent and easy to scan through compact cards, responsive tables, tabs, and document accordions.
- Mark all unavailable values, holdings, links, and documents as placeholders or “not yet connected”; do not publish invented performance, regulatory claims, or downloadable files.

## Positioning and compliance
- Replace the remaining name placeholder with **Prashant Jog** and standardize identity copy as **“Prashant Jog — AMFI Registered Mutual Fund Distributor”** with **ARN 83625** prominently retained.
- Audit headings, page copy, FAQs, calls to action, metadata, structured data, and hidden text so nothing presents Prashant Jog as an investment adviser, financial adviser, wealth adviser, or SEBI Registered Investment Adviser.
- Preserve the market-risk disclaimer, 15+ years, 500+ families across India, and all approved contact details unchanged.
- Use neutral information language and clearly separate general scheme information from distribution assistance.

## Design and behaviour
- Reuse the existing navy, gold, ivory, typography, spacing, cards, buttons, and responsive patterns; no rebrand or visual-language change.
- Add accessible document states, labels, section navigation, mobile-friendly tables, and clear disabled/unavailable actions where source files are missing.
- Keep the data in a typed, centralized structure so verified API or database fields and document URLs can replace placeholders later without rebuilding the pages.

## Technical details
- Add a typed fund-information data module, a directory route, a dynamic scheme route, and focused reusable fund/document components.
- Use TanStack typed links for scheme navigation and route-specific metadata for both new routes.
- Keep all data local and non-persistent for now; no backend will be added because no verified fund-data source or document repository has been supplied.

## Validation
- Check desktop and mobile layouts for the fund directory and scheme page, including tabs/accordions and every requested information category.
- Verify all new links, placeholder labels, route metadata, and empty/unavailable states.
- Search the full site for prohibited adviser positioning and unresolved name placeholders, then confirm the preview remains error-free.
