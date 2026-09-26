# Risk Profile and Personalized Projection

## Build
- Add centralized typed questionnaire choices, deterministic scores, profile bands, explanations, and an intentionally empty future product-mapping interface.
- Add reusable scoring, projection, goal-progress, and report-formatting modules with safe validation and Indian currency formatting.
- Build `/risk-profile` as a six-step accessible questionnaire with progress, required selections, back/next, edit, restart, transparent result breakdown, and educational-only disclosures.
- Continue within the flow to a personalized projection using the existing monthly SIP utility, with inputs, live summary, chart, goal progress, and consistent beginning-of-month convention.
- Add a print-friendly report containing the entered assumptions, profile result, score breakdown, projection outputs, date, and market-risk disclosures; provide Print, browser Share where supported, and copy-link fallback.
- Add contextual links from Services, Learn, Fund Information, and the SIP calculator without changing primary navigation.

## Verification
- Add unit coverage for every score band and boundaries, missing/invalid answers, combined lump sum and SIP projections, safe zero/invalid values, goal progress, target-already-reached behavior, and report generation.
- Run the focused tests, TypeScript verification, and full build.
- Exercise questionnaire → result → projection → report on desktop and mobile; check keyboard-accessible controls, chart updates, print/share controls, disclosures, wording, links, console/runtime errors, broken requests, and horizontal overflow.

## Technical details
- Keep browser state inside the dedicated flow; no account, database, PDF service, or fund recommendation logic is added.
- Use existing semantic tokens, Buttons, RadioGroup, Progress, Inputs, Recharts wrappers, SEO helper, SIP calculations, and site identity/disclaimer configuration.
- Assumption: the projection and report are steps within `/risk-profile`, avoiding unnecessary persistence or cross-route state while still providing a dedicated reusable experience.
