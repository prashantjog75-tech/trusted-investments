# Visitor-focused navigation and fund directory structure

## What will change
- Replace the primary navigation with Home, Funds, Explore, Resources, About, and Contact, while keeping Book a Meeting prominent.
- Add an Explore hub for goal-led journeys and Prashant Jog’s investment assistance.
- Add a Resources hub for investor education, calculators, risk profiling, FAQs, documents, disclosures, and data information.
- Add a compact quick-access section on Home with Explore Funds, Understand Mutual Funds, Investment Assistance, and Book a Meeting.
- Keep Services focused on assistance offered by Prashant Jog and remove its fund-directory positioning.
- Update the Funds directory so each underlying Regular Plan fund appears once, with an option selector where variants exist and a unique-fund count.
- Prioritize Home, Funds, Resources, and Contact in the mobile menu, while retaining access to Explore and About.
- Update footer navigation to match the new visitor-intent structure.

## Technical details
- Reuse TanStack Start route files and existing shared Header, Footer, Section, Button, and metadata utilities.
- Add `/explore` and `/resources` as static content routes; preserve existing routes and links for compatibility.
- Group the existing local AMFI snapshot in the browser by fund identity and collapse option variants into one displayed card.
- Keep all scheme records Regular Plan only and add no runtime data fetching or server dependency.
- Do not modify `vite.config.ts`, deployment configuration, backend logic, branding tokens, or unrelated pages.

## Verification
- Confirm every primary and mobile navigation link works directly and after refresh.
- Confirm Funds search and filters update a unique-fund count and never produce duplicate cards for option variants.
- Confirm the page has no horizontal scrolling on mobile and Book a Meeting remains highly visible.
- Check project tests and the latest preview build status.
