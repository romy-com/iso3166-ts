import { XMLParser, XMLValidator } from "fast-xml-parser";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function attribute(
  entry: Record<string, unknown>,
  name: string,
  pattern: RegExp,
): string {
  const value = entry[`@_${name}`];
  if (typeof value !== "string" || !pattern.test(value)) {
    throw new Error(`Invalid or missing ${name} attribute`);
  }
  return value;
}

export function parseCountries(xml: string) {
  if (/<!DOCTYPE/i.test(xml)) {
    throw new Error("DOCTYPE declarations are not supported");
  }

  const validation = XMLValidator.validate(xml);
  if (validation !== true) {
    throw new Error(`Invalid XML: ${validation.err.msg}`);
  }

  const parser = new XMLParser({
    ignoreAttributes: false,
    parseAttributeValue: false,
    parseTagValue: false,
    trimValues: false,
    isArray: (name) => name === "country",
  });
  const document: unknown = parser.parse(xml);
  const entries: unknown =
    isRecord(document) && isRecord(document.countries)
      ? document.countries.country
      : undefined;

  if (!Array.isArray(entries) || entries.length === 0) {
    throw new Error("Expected a non-empty <countries> list");
  }

  const seen = new Set<string>();
  return entries.map((entry: unknown) => {
    if (!isRecord(entry)) {
      throw new Error("Expected a country with code and name attributes");
    }

    const country = {
      alpha2: attribute(entry, "alpha-2", /^[A-Z]{2}$/),
      alpha3: attribute(entry, "alpha-3", /^[A-Z]{3}$/),
      name: attribute(entry, "name", /\S/),
      numeric: attribute(entry, "country-code", /^[0-9]{3}$/),
    };

    for (const field of ["alpha2", "alpha3", "numeric"] as const) {
      const code = country[field];
      if (seen.has(code)) {
        throw new Error(`Duplicate ${field} code: ${code}`);
      }
      seen.add(code);
    }

    return country;
  });
}
