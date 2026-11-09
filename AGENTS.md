# Project Rules

- Scope public-page visual refinements under page wrappers in global CSS to override the reference-shell reset without changing unrelated pages.

- Keep coupon definitions and validation centralized in `src/lib/coupons.ts` so checkout screens and pricing tests use one source of truth.
- Menu item photos render through `src/components/FoodImage.tsx` (placeholder fallback) so every role's view handles missing or broken images the same way.
- Site-wide public reader features (search, shortcuts, back-to-top, bottom nav, inspect deterrent) mount once in `MarketingLayout`; per-page features live in `src/components/public/`.
- Offline support uses vite-plugin-pwa registered only via `src/pwa.ts`, which refuses dev, iframes and preview hosts so the editor preview is never cached.
