import iso3166 = require("@romy-com/iso3166-ts");
import type { Country } from "@romy-com/iso3166-ts";

const records: readonly Country[] = iso3166.countries;
const result: Country | undefined = iso3166.country("ITA");
const numeric: string | undefined = result?.numeric;
void records;
void numeric;

// @ts-expect-error The CommonJS declarations also expose a readonly array.
iso3166.countries.pop();

if (result) {
  // @ts-expect-error The CommonJS records are readonly too.
  result.name = "Italy";
}

// @ts-expect-error Unknown lookups must be handled before accessing a record.
iso3166.country("ZZ").alpha3;
