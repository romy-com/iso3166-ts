# Project conventions

- Target repository: `romy-com/iso3166-ts`. This is an independent ISO 3166-1 library.
- Keep the runtime API to `countries` (readonly array) and `country(input)` (lookup returning a record or `undefined`), plus the `Country` type.
- Use npm, TypeScript, Vitest, and tsup. Use Oxlint for linting and Oxfmt for formatting. Run `npm run check` before finishing changes.
- Follow test-first development for behavior changes. No runtime dependencies.
- `iso4217-ts/` is an untouched, ignored reference clone, not part of this package.
- Never hand-edit `src/data.ts`. Change/review the XML snapshot, then run `npm run iso:ingest-xml`.
- Keep XML provenance in `data/README.md` current. Preserve Unicode and numeric leading zeroes.
- Original code is MIT; the source and generated dataset are CC BY-SA 4.0. Preserve `NOTICE.md` and the upstream data-license notice in package artifacts.
- The npm name is provisional and the package is private. Do not publish or add release automation without confirmation.
