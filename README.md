# Persona Web

Public documentation and interactive playground for the [Persona API](https://github.com/Osiris-Balonga/persona). This repository contains the website only; the API and its portrait catalog are maintained separately.

**Live site:** [persona-web-tau.vercel.app](https://persona-web-tau.vercel.app). Vercel deploys `main` to production and pull requests to preview environments. The beta site uses `https://persona-dev.onrender.com` as its public API origin.

## Local development

Use Node.js 24 and npm.

```sh
npm ci
npm run dev
```

Open `http://localhost:3000`. The English and French routes are `/en` and `/fr`; the root selects the browser's preferred language. The localized home, documentation, coverage table, and playground are available in both languages.

## Structure

- `src/app/[locale]`: localized pages, layouts, and metadata.
- `src/i18n` and `messages`: next-intl routing and EN/FR interface strings.
- `src/lib/docs-content.ts`: bilingual documentation content aligned with the API's public v2 contract.
- `src/lib/config.ts` and `src/lib/server-config.ts`: public URLs and server-only environment settings.
- `src/components/ui`: shadcn/ui primitives.

The playground and documentation use the public API origin from `NEXT_PUBLIC_PERSONA_API_URL`. Set it in `.env.local` to change the origin; `.env.example` contains the beta value. Vercel has the same variable configured for Development, Preview, and Production. This variable is intentionally public. `NEXT_PUBLIC_SITE_URL` controls canonical and Open Graph URLs when set. Vercel Web Analytics is included in the localized layout.

## Deployment

The [Vercel project](https://vercel.com/osiris-balongas-projects/persona) deploys `main` to [persona-web-tau.vercel.app](https://persona-web-tau.vercel.app). Pull requests get preview deployments. The [deployments page](https://vercel.com/osiris-balongas-projects/persona/deployments) shows build status, logs, and the previous production deployment, which can be restored with Instant Rollback if needed. The site currently calls the beta API on Render; change `NEXT_PUBLIC_PERSONA_API_URL` and redeploy when the production API is ready.

## Checks

```sh
npm run lint
npm run typecheck
npm test
npm run build
```

CI runs these checks on pull requests to `dev` and `main`. Add a focused test when a feature introduces logic worth testing; avoid broad suites for static pages.

## Sources and contributions

The website must reflect the API's [public v2 contract](https://github.com/Osiris-Balonga/persona/blob/dev/docs/api.md) and [country availability](https://github.com/Osiris-Balonga/persona/blob/dev/docs/country-availability.md). Content is maintained in English and French. Development happens on `dev`; only `dev` is promoted to `main` through a pull request. See [CONTRIBUTING.md](CONTRIBUTING.md) for the workflow and the [launch issue](https://github.com/Osiris-Balonga/persona-web/issues/1) for scope.
