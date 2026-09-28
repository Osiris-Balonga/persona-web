<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Persona Web

- This public repository is for the Persona website. The API remains in `Osiris-Balonga/persona`; follow its public v2 contract instead of inventing API behavior.
- Keep public content complete in English and French. Place interface messages in `messages/` and longer guides in localized MDX files.
- Default to Server Components. Use client components for interactive controls only, and install shadcn/ui primitives only as needed.
- Do not commit secrets, raw API data, the user's reference screenshots, or portrait binaries. Public approved portrait URLs can be displayed at runtime.
- Keep checks lean: lint, typecheck, build, and focused tests for meaningful logic. Link work to the relevant issue and use pull requests to `main`.
