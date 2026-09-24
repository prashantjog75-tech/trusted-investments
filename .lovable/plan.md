# SIP Calculator & Goal Projection

## Outcome
Add a dedicated `/sip-calculator` experience that matches the existing navy, gold, ivory, Fraunces, and Manrope visual system. The primary navigation and unrelated pages remain unchanged.

The page will provide two keyboard-accessible modes:
- **SIP Calculator** — monthly SIP, duration, assumed annual return, and optional initial investment.
- **Goal Projection** — target amount, duration, assumed annual return, and optional initial investment, with the required monthly SIP calculated from those assumptions.

## Calculator behaviour
- Use monthly compounding and consistently assume each SIP instalment is invested **at the beginning of the month**.
- Combine the SIP future value with the separately compounded initial investment.
- Show total invested/projected contributions, estimated growth, and final estimated value.
- In Goal Projection, show a required SIP of ₹0 when the projected initial investment already meets the target.
- Treat the entered return only as an assumption. Clamp or reject invalid inputs, safely handle zero return and zero duration, and never display `NaN` or infinity.
- Format currency using Indian grouping and the rupee symbol.
- Show CAGR only for a lump-sum-only illustration, where it is mathematically meaningful. For cash-flow scenarios, show “Assumed annual return” instead and explain why CAGR is not presented.

## Page experience
- Add a focused calculator workspace with clear inputs, inline validation, and instant results.
- Add a compact output summary and a responsive projected-value chart distinguishing invested amount from estimated value.
- Include an accessible text summary for the chart so the result remains understandable without relying on colour or hover interactions.
- Label the page, result cards, and chart as **Illustration**, **Estimated**, or **Assumption-based**.
- Include the existing market-risk disclaimer, a clear statement that returns are market-linked and not guaranteed, and Prashant Jog’s distributor-only identity with ARN 83625.

## Contextual entry points
Without changing the primary navigation:
- Add a calculator link on **Services**.
- Add a calculator link on **Learn**.
- Replace the Fund Information “SIP illustration” coming-soon card with a working link to the calculator while leaving the remaining fund architecture unchanged.

## Technical approach
- Create a typed, reusable calculation module under `src/lib/calculators/` for SIP projections, goal projections, chart-series generation, validation, and Indian currency formatting.
- Create a dedicated calculator UI component separate from the formulas.
- Reuse the installed Recharts integration and existing Tabs, Input, Label, Button, cards, semantic colour tokens, shared page sections, and metadata helper.
- Add `src/routes/sip-calculator.tsx` with route-specific title, description, Open Graph, Twitter, and canonical metadata.
- Add focused unit tests covering standard SIP, SIP plus lump sum, zero-return, invalid/zero inputs, lump-sum-only CAGR, and goal projection including the ₹0-required-SIP case.

## Verification
- Run the focused calculation tests and confirm a successful project build.
- Check the new route and all three contextual links in the live preview.
- Verify instant updates, both modes, input validation, chart and summary output, disclosures, and distributor positioning.
- Check desktop and mobile layouts for overflow, clipping, keyboard usability, and console/page errors.

## Assumptions
- No backend or live fund data is needed; this is an illustration tool driven entirely by user-entered assumptions.
- Default example values will be clearly presented as editable assumptions, not fund performance or recommendations.
