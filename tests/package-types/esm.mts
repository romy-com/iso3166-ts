import { countries, country } from "@romy-com/iso3166-ts";
import type { Country } from "@romy-com/iso3166-ts";

const records: readonly Country[] = countries;
const result: Country | undefined = country("IT");
const numeric: string | undefined = result?.numeric;
void records;
void numeric;

// @ts-expect-error The shared array cannot be mutated.
countries.pop();

if (result) {
  // @ts-expect-error Country records cannot be mutated.
  result.alpha2 = "IT";
}

// @ts-expect-error Unknown lookups must be handled before accessing a record.
country("ZZ").name;

// @ts-expect-error Numeric inputs must be three-character strings.
country(380);

// @ts-expect-error Code types retain the supported literal values.
const unsupported: Country["alpha2"] = "ZZ";
void unsupported;
