# ISO 3166-1 source data

`iso-3166.xml` is an unmodified snapshot of `all/all.xml` from
[ISO-3166 Countries with Regional Codes](https://github.com/lukes/ISO-3166-Countries-with-Regional-Codes)
by [lukes](https://github.com/lukes) and contributors.

- Update URL: https://raw.githubusercontent.com/lukes/ISO-3166-Countries-with-Regional-Codes/refs/heads/master/all/all.xml
- Verified snapshot: https://raw.githubusercontent.com/lukes/ISO-3166-Countries-with-Regional-Codes/99cdae15c839bb4f94a23db4e47b4a4c590dec61/all/all.xml
- Last upstream change to this XML: 2024-06-19.
- SHA-256: `773abeca0c6d7935a35dfefd935f6475d0625c3705744337c5808fdc699f90a7`.
- Records: 249 countries and territories.

The upstream repository combines ISO 3166-1 data from Wikipedia with UN M49
regional data. It explicitly describes the data as non-authoritative and
recommends independently checking accuracy. Downloading this snapshot does not
establish that it reflects every subsequent change to the standard.

## Public record mapping

| XML attribute  | TypeScript property |
| -------------- | ------------------- |
| `alpha-2`      | `alpha2`            |
| `alpha-3`      | `alpha3`            |
| `name`         | `name`              |
| `country-code` | `numeric`           |

Preserve names, Unicode, and three-digit numeric strings exactly as supplied;
for example, Afghanistan's numeric code is `"004"`, not `4`.

The additional regional attributes remain in the source snapshot but are not
part of the agreed public API. The `iso_3166-2` attribute is a reference to a
country's subdivision standard, not a list of subdivisions.

The agreed API is a readonly `countries` array and
`country(input: string): Country | undefined`. Lookup accepts alpha-2,
alpha-3, or three-digit numeric codes, with ASCII case-insensitive alphabetic
codes and surrounding whitespace ignored. Unknown inputs return `undefined`.
Runtime data is generated from this snapshot with `npm run iso:ingest-xml`;
consumers do not need an XML parser or network access.

## Data license and attribution

The upstream work is licensed under
[Creative Commons Attribution-ShareAlike 4.0 International](https://creativecommons.org/licenses/by-sa/4.0/).
The original notice is preserved in [LICENSE.md](LICENSE.md).

Retain attribution, the source and license links, and a description of any
changes when distributing this data. Adapted datasets must comply with the
license's ShareAlike terms. Do not describe this dataset as MIT-licensed based
on the license of a reference library or of this project's code.

This snapshot is unchanged. The generated four-field dataset is a mapped subset,
as described in [NOTICE.md](../NOTICE.md). The data attribution and license notice
are included in the package alongside the compiled dataset.
