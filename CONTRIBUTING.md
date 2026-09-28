# Contributing to Persona Web

- Work from a short-lived branch and open a pull request to protected `main`. Link the relevant GitHub issue and state the checks you ran.
- Keep repository docs and identifiers in English. Translate user-facing content into both English and French.
- Use the public Persona API v2 contract as the source of truth. Do not add undocumented filters or copy raw geographic datasets and portrait files into this repository.
- Run `npm run lint`, `npm run typecheck`, and `npm run build` before merging. Add a focused test for logic with meaningful failure modes, and check affected routes in a browser.
- Keep secrets out of Git. `NEXT_PUBLIC_*` values are exposed to browsers and must contain only public configuration.
