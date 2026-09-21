# Country data attribution

This package includes data adapted from **ISO-3166 Countries with Regional
Codes**, by [lukes](https://github.com/lukes) and contributors.

- Source: https://github.com/lukes/ISO-3166-Countries-with-Regional-Codes
- License: [Creative Commons Attribution-ShareAlike 4.0 International](https://creativecommons.org/licenses/by-sa/4.0/)
- Original license notice: [data/LICENSE.md](data/LICENSE.md)
- Snapshot provenance: [data/README.md](data/README.md)

The original XML snapshot is unchanged. The generated dataset in `src/data.ts`,
and its copies in the compiled JavaScript, declarations, and source maps, are
adapted as follows:

- Keep only the country name and ISO 3166-1 alpha-2, alpha-3, and numeric codes.
- Rename `alpha-2` to `alpha2`, `alpha-3` to `alpha3`, and `country-code` to `numeric`.
- Decode XML attributes and serialize the records as TypeScript/JavaScript.
- Preserve source order, names, Unicode, and three-character numeric strings.

The adapted dataset is distributed under **CC BY-SA 4.0**, including its
attribution and ShareAlike requirements. The library code's MIT license does
not replace the data license. No endorsement by the upstream authors or ISO
is implied.
