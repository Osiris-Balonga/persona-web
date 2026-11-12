# Vendored shadcn stylesheet

`shadcn.css` is the unmodified `dist/tailwind.css` distributed in the
[`shadcn` 4.21.0 npm package](https://www.npmjs.com/package/shadcn/v/4.21.0),
from [shadcn-ui/ui](https://github.com/shadcn-ui/ui/tree/main/packages/shadcn).
Its MIT license is preserved in `shadcn.LICENSE`.

The application uses these Tailwind variants and utilities, but does not run
the shadcn CLI. Keeping the stylesheet here avoids installing the CLI and its
unneeded dependency tree. Preserve the stylesheet's contents and license when
updating it, and verify the built UI after an upstream update.
