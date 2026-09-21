# @romy-com/iso3166-ts

ISO 3166-1 countries and territories for TypeScript. Zero runtime dependencies;
no XML parsing or network access at runtime.

Repository: [romy-com/iso3166-ts](https://github.com/romy-com/iso3166-ts).

## API

```ts
import { countries, country } from "@romy-com/iso3166-ts";
import type { Country } from "@romy-com/iso3166-ts";

country("IT");
// { alpha2: "IT", alpha3: "ITA", name: "Italy", numeric: "380" }

country("ITA")?.alpha2; // "IT"
country("380")?.alpha3; // "ITA"
country("it")?.name; // "Italy"
country(" IT ")?.numeric; // "380"

country("004")?.name; // "Afghanistan"
country("ZZ"); // undefined
```

There are only two runtime exports:

- **`countries`** — a readonly array of all 249 records in the current snapshot,
  including territories, in source order. The array and records are also frozen
  at runtime. Copy the array before sorting it.
- **`country(input: string): Country | undefined`** — lookup by alpha-2, alpha-3,
  or three-digit numeric code. Alphabetic codes are ASCII case-insensitive;
  surrounding whitespace is ignored. Unknown or unsupported strings return
  `undefined`.

Each record has readonly `alpha2`, `alpha3`, `name`, and `numeric` properties.
The `Country` type is derived from the generated data, retaining literal code
values. For example, `Country["alpha2"]` is a union of the supported alpha-2 codes.

Numeric codes are strings: use `"004"`, not `"4"` or a JavaScript number.
Names are preserved from the source, including Unicode. Country names, aliases
such as `"UK"`, unofficial codes, subdivisions, and historic codes are not lookup
inputs.

### Country selection

```ts
const options = [...countries]
  .sort((a, b) => a.name.localeCompare(b.name, "en"))
  .map(({ alpha2, name }) => ({
    value: alpha2,
    label: name,
  }));

// Store the alpha-2 code, and look up submitted values before using them.
const selected = country(submittedValue);
if (selected) {
  console.log(selected.alpha2, selected.name);
}
```

## Development

Use Node.js 24 LTS and npm. The built library supports both ESM and CommonJS and
uses ES2022 features; the development tools require a recent Node.js version.
Both JavaScript builds are minified, with source maps and TypeScript declarations
included. The license banner is preserved.

```sh
npm ci
npm run lint
npm run format:check
npm test
npm run typecheck
npm run build
npm run check
```

`npm run check` runs Oxlint, Oxfmt checks, tests, typechecking, both builds, and
package-entry-point smoke tests. CI runs the same command.

- `npm run lint` checks hand-maintained code with Oxlint; warnings fail the check.
- `npm run lint:fix` applies safe automatic lint fixes.
- `npm run format` formats hand-maintained files with Oxfmt.
- `npm run format:check` checks formatting without writing files.
- `npm run test:watch` watches the tests.

Lint and format settings live in `.oxlintrc.json` and `.oxfmtrc.json`. Generated
`src/data.ts` is excluded from both; the XML snapshot and original data-license
notice are also excluded from formatting. Typechecking remains a separate
`tsc` step.

### Regenerate the data

The checked-in `src/data.ts` is generated from `data/iso-3166.xml`:

```sh
npm run iso:ingest-xml
```

The generator validates the XML, required fields, code formats, and code
uniqueness before writing output. It preserves leading zeroes, names, and source
order. It rejects malformed/empty inputs and DTDs. Repeated runs are deterministic.

Optional input and output paths are supported for validating a candidate snapshot:

```sh
npm run iso:ingest-xml -- /path/to/candidate.xml /path/to/candidate.ts
```

To update the dataset, review a new XML snapshot from the source documented in
[data/README.md](data/README.md), update its provenance there, regenerate the
TypeScript, and run `npm run check`. Commit the XML and generated data together.
CI also checks that regeneration leaves `src/data.ts` unchanged.

### Dependencies

All dependencies are development-only. The esbuild override selects a patched
version rather than the vulnerable 0.27.x version requested by the build tooling.

## Publishing to npm

The first successful publish creates `@romy-com/iso3166-ts` on npm. There is no
separate website creation step. From this directory, authenticate with an npm
account authorized to publish packages in the `romy-com` npm organization:

```sh
npm login --auth-type=web
npm publish --access public
```

The `prepack` hook runs all checks before publishing.

After the first publish, configure npm
[trusted publishing](https://docs.npmjs.com/trusted-publishers/) for owner
`romy-com`, repository `iso3166-ts`, and workflow `publish.yml`.

Versions use month-based CalVer: `YEAR.MONTH.PATCH`, using the UTC release month
without leading zeros. For example, `2026.9.0` is the first September 2026
release; subsequent releases that month are `2026.9.1`, `2026.9.2`, and so on.
The first release in October becomes `2026.10.0`.

For subsequent releases, set the version explicitly with `npm version <version>`,
push the resulting commit and tag, and publish a GitHub release for that tag.
The workflow installs dependencies, typechecks, tests, builds, and runs
`npm publish --access public`. It does not calculate or change the version.
Each npm publication requires a new version.

## Data provenance and licenses

The dataset comes from
[lukes/ISO-3166-Countries-with-Regional-Codes](https://github.com/lukes/ISO-3166-Countries-with-Regional-Codes),
not directly from ISO. The XML snapshot was last changed upstream on
**2024-06-19**. The upstream project describes its data as non-authoritative;
this library does not claim that the snapshot reflects every subsequent change.

- Original library code: [MIT](LICENSE).
- Source data and generated country data: [CC BY-SA 4.0](data/LICENSE.md).

See [NOTICE.md](NOTICE.md) for attribution, the changes made to the data, and the
license link. Attribution and data-license notices are included in the package.
