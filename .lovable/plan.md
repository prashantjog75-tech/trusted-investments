# Homepage carousel and global service reach

## Scope
- Replace the homepage’s single family image with a restrained three-image carousel, retaining the current image first and the existing “Our promise” overlay.
- Add automatic 4.5-second rotation, smooth fades, previous/next controls, slide indicators, pause on pointer hover and keyboard focus, and reduced-motion support.
- Add two cohesive professional family/life-goal images that match the existing premium visual direction.
- Update all existing India-only service-coverage wording to accurately say clients are served across India and globally, without implying offices, jurisdiction-wide licensing, or additional registrations.
- Preserve branding, contact details, navigation, meeting and WhatsApp actions, the transparency page, and all fund-directory behavior.

## Verification
- Run the TypeScript check, all tests, and the production build.
- Inspect the homepage at desktop and mobile sizes, confirm carousel behavior and controls, and verify no horizontal overflow.
- Search the public content again to confirm old India-only coverage statements are gone.

## Technical details
- Implement the carousel as a focused reusable React component using the existing button design system and local bundled images.
- Keep service coverage centralized in the existing site configuration and update route metadata plus visible copy where old wording is embedded directly.
- Record the reusable carousel boundary in the project architecture notes.
