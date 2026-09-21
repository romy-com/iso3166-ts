import { countryData } from "./data";

export type Country = (typeof countryData)[number];

/** ISO 3166-1 countries and territories, in source order. */
export const countries: readonly Country[] = Object.freeze(
  countryData.map((entry) => Object.freeze(entry)),
);

/** Look up an ISO code, ignoring ASCII case and surrounding whitespace. */
export function country(input: string): Country | undefined {
  const trimmed = input.trim();
  if (!/^(?:[A-Za-z]{2,3}|[0-9]{3})$/.test(trimmed)) return undefined;

  const code = trimmed.toUpperCase();
  return countries.find(
    (entry) =>
      entry.alpha2 === code || entry.alpha3 === code || entry.numeric === code,
  );
}
