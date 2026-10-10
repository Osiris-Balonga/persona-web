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

### Portrait type selection

The Playground portrait-type selector is disabled by default. Enable
`NEXT_PUBLIC_PERSONA_PORTRAIT_CONTEXTS_ENABLED=true` only after the configured API
deployment supports the plural `portraitContexts` CSV parameter, including an
explicit empty value. Rebuild and redeploy the site after changing this public
setting. Until deployment is confirmed, leave it unset or `false`; the selector
stays hidden and requests omit the parameter, preserving the API's historical
Standard default.

When enabled, all five offered types start selected. Clearing every checkbox
sends `portraitContexts=` and generates profiles with `picture: null`; it must
never fall back to Standard. Selection is preserved in the Playground URL. The
UI offers Standard, Doctor, Construction, Business and School pupil only, and
never sends the singular `portraitContext` alongside the plural parameter.

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
