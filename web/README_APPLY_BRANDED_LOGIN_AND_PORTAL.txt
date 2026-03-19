
Britium Branded Login + Portal Landing Redesign Patch

Files included:
- apps/web/src/screens/LoginPage.tsx
- apps/web/src/screens/PortalLandingPage.tsx
- apps/web/src/index.css
- docs/30_branded_entry_experience.md

How to apply:
1. Copy these files into:
   /d/1803APP/britium-enterprise-deployable-system
2. Overwrite existing files.
3. Run:
   cd /d/1803APP/britium-enterprise-deployable-system
   npm run build
   npm run dev

Notes:
- This patch focuses on the entry experience only.
- It keeps bilingual support and uses safe optional auth calls.
- If your AuthProvider already has signIn, this page will use it.
- If signIn is named differently in your project, wire that one line only.
