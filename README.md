# Persona Web

Public documentation and interactive playground for the [Persona API](https://github.com/Osiris-Balonga/persona). This repository contains the website only; the API and its portrait catalog are maintained separately.

**Production site:** [persona.osirisbalonga.me](https://persona.osirisbalonga.me). The production API is [api.persona.osirisbalonga.me](https://api.persona.osirisbalonga.me). Vercel deploys `main` to production and pull requests to preview environments.

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

The playground and documentation use the API origin from `NEXT_PUBLIC_PERSONA_API_URL`. Local development and preview deployments use the staging API, `https://persona-dev.onrender.com`; production uses `https://api.persona.osirisbalonga.me`. Set the variable in `.env.local` to change the local origin; `.env.example` contains a reserved placeholder. This variable is intentionally public. Set `NEXT_PUBLIC_SITE_URL` to `https://persona.osirisbalonga.me` in production for canonical and Open Graph URLs. Vercel Web Analytics is included in the localized layout.

## Deployment

The [Vercel project](https://vercel.com/osiris-balongas-projects/persona) deploys `main` to [persona.osirisbalonga.me](https://persona.osirisbalonga.me). Pull requests get preview deployments that use the staging API. Production uses the API at [api.persona.osirisbalonga.me](https://api.persona.osirisbalonga.me). Keep `ANALYTICS_ENVIRONMENT=staging` in previews and set it to `production` in production; the Cloudflare analytics datasets remain separate, and switching environments does not reset either dataset. A failed analytics request must not change the environment label shown on Activity. The [deployments page](https://vercel.com/osiris-balongas-projects/persona/deployments) shows build status, logs, and the previous production deployment, which can be restored with Instant Rollback if needed.

### Portrait selection and tone

The staging API supports the plural `portraitContexts` CSV parameter and an
explicit empty value. The Playground starts with all five types selected;
unchecking a type removes it from the request. Clearing every checkbox sends
`portraitContexts=` and returns profiles with `picture: null`. It never restores
Standard automatically, and the selection remains in the Playground URL. The
Playground does not send the singular `portraitContext` parameter.

Omitting `portraitContexts` on the staging API selects all five released types.
Their relative weights are Standard 50, Business 25, School pupil 15, Doctor 5
and Construction 5, renormalized over types available for the generated age,
gender and portrait collection. These are weights, not guaranteed response
percentages. Eligibility is Standard 6–100, Doctor 25–64, Construction and
Business 18–64, and School pupil 6–17. Selecting several types combines their
eligible ages. The UI exposes only these five released types.

Set `NEXT_PUBLIC_PERSONA_PORTRAIT_CONTEXTS_ENABLED=false` when targeting an
older API deployment. Rebuild and redeploy after changing this public setting.
The selector is hidden and requests omit `portraitContexts`, following the
target deployment's default behavior.

The optional `skinTone` parameter accepts one or more distinct integers from 1 to 10, separated by commas, and filters
portraits by an existing reviewed visual annotation. It describes the image,
not ancestry. An explicit tone searches photos across all production collections,
while retaining gender, reviewed age and portrait type compatibility. Names,
nationality and residence keep their geographic constraints. Omitting the tone
filter retains nationality-linked photo selection. Portraits without an annotation do not match; if no annotated
portrait matches, the profile still returns and `picture` is `null`.
The Playground starts with all ten tones checked. The global control toggles
between all tones (omitted filter) and no tones (`skinTone=`, no portraits).
Checking individual swatches selects their union. On mobile, the global
control is a transparent square with a check when all tones are selected.

The Coverage page reads `GET /coverage`, which reports the country availability
and portrait delivery readiness of the deployed API manifest. Portrait totals
count entries whose public delivery variants are configured; the endpoint does
not probe object storage on each request. Responses are cached for five minutes.
If the feed is unavailable, the website labels its dated country snapshot; it
does not present snapshot counts as current API totals. See the API's
[v2 contract](https://github.com/Osiris-Balonga/persona/blob/dev/docs/api.md)
for request parameters and the current release behavior.

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
