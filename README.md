# Persona Web

Public documentation and interactive playground for the [Persona API](https://github.com/Osiris-Balonga/persona). This repository contains the website only; the API and its portrait catalog are maintained separately.

## Local development

Use Node.js 24 and npm.

```sh
npm ci
npm run dev
```

Open `http://localhost:3000`. The English and French routes are `/en` and `/fr`.

The playground will call the public API directly from the browser. Set `NEXT_PUBLIC_PERSONA_API_URL` in `.env.local` when working on that feature; `.env.example` contains the current beta origin. This variable is intentionally public.

## Checks

```sh
npm run lint
npm run typecheck
npm run build
```

CI runs these checks on pull requests to `main`. Add a focused test when a feature introduces logic worth testing; avoid broad suites for static pages.

## Sources and contributions

The website must reflect the API's [public v2 contract](https://github.com/Osiris-Balonga/persona/blob/dev/docs/api.md) and [country availability](https://github.com/Osiris-Balonga/persona/blob/dev/docs/country-availability.md). Content is maintained in English and French. See [CONTRIBUTING.md](CONTRIBUTING.md) for the lightweight workflow and the [launch issue](https://github.com/Osiris-Balonga/persona-web/issues/1) for scope.
