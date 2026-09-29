# Contributing to Persona Web

## Branches and pull requests

Create a short-lived branch from `dev` using `feature/`, `fix/`, `chore/`, `docs/`, `refactor/`, or `test/`, then open a focused pull request to `dev`. Only `dev` may target `main`, through a pull request when the site is ready to release. Do not push directly to either protected branch. Link the issue and report the checks actually run.

For parallel work, give each contributor or agent its own worktree and branch. From a local clone, for example:

```sh
git fetch origin
git worktree add ../persona-web-playground -b feature/playground origin/dev
```

Run commands for that feature inside its worktree. Do not switch the branch of a directory another contributor is using.

## Checks and content

Run `npm run lint`, `npm run typecheck`, and `npm run build` before merging. Add a focused test only for logic with meaningful failure modes, and check affected routes in a browser.

Keep repository docs and identifiers in English; translate user-facing content into both English and French. Use the public Persona API v2 contract as the source of truth. Do not add undocumented filters or copy raw geographic datasets and portrait files into this repository.

Keep secrets, generated builds, and local drafts out of Git. `NEXT_PUBLIC_*` values are exposed to browsers and must contain only public configuration.
