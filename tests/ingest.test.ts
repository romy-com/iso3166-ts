import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { parseCountries } from "../scripts/parse-countries";

const afghanistan =
  '<country name="Afghanistan" alpha-2="AF" alpha-3="AFG" country-code="004" region="Asia"/>';
const italy =
  '<country name="Italy" alpha-2="IT" alpha-3="ITA" country-code="380"/>';

function xml(...entries: string[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?><countries>${entries.join("")}</countries>`;
}

describe("XML ingestion", () => {
  it("maps only the four public fields, preserving numeric strings", () => {
    expect(parseCountries(xml(afghanistan))).toEqual([
      { alpha2: "AF", alpha3: "AFG", name: "Afghanistan", numeric: "004" },
    ]);
  });

  it("preserves the source's ordering", () => {
    expect(
      parseCountries(xml(italy, afghanistan)).map(({ alpha2 }) => alpha2),
    ).toEqual(["IT", "AF"]);
  });

  it("preserves Unicode and decodes XML entities", () => {
    expect(
      parseCountries(
        xml(
          '<country name="Åland &amp; &quot;Islands&quot;" alpha-2="AX" alpha-3="ALA" country-code="248"/>',
        ),
      ),
    ).toEqual([
      {
        alpha2: "AX",
        alpha3: "ALA",
        name: 'Åland & "Islands"',
        numeric: "248",
      },
    ]);
  });

  it("reads the full source snapshot", () => {
    const source = readFileSync(
      new URL("../data/iso-3166.xml", import.meta.url),
      "utf8",
    );
    const records = parseCountries(source);
    expect(records).toHaveLength(249);
    expect(records).toContainEqual({
      alpha2: "TR",
      alpha3: "TUR",
      name: "Türkiye",
      numeric: "792",
    });
  });

  it.each(["", "<countries><country></countries>", "<html/>", "<countries/>"])(
    "rejects malformed or empty input: %s",
    (input) => {
      expect(() => parseCountries(input)).toThrow();
    },
  );

  it.each(["name", "alpha-2", "alpha-3", "country-code"])(
    "rejects records missing %s",
    (attribute) => {
      const entry = afghanistan.replace(
        new RegExp(` ${attribute}="[^"]*"`),
        "",
      );
      expect(() => parseCountries(xml(entry))).toThrow(attribute);
    },
  );

  it.each([
    ['name="Afghanistan"', 'name=" "'],
    ['alpha-2="AF"', 'alpha-2="af"'],
    ['alpha-3="AFG"', 'alpha-3="AF"'],
    ['country-code="004"', 'country-code="4"'],
  ])("rejects invalid attributes: %s → %s", (original, replacement) => {
    expect(() =>
      parseCountries(xml(afghanistan.replace(original, replacement))),
    ).toThrow();
  });

  it.each([
    ['alpha-2="IT"', 'alpha-2="AF"'],
    ['alpha-3="ITA"', 'alpha-3="AFG"'],
    ['country-code="380"', 'country-code="004"'],
  ])("rejects duplicate codes: %s → %s", (original, replacement) => {
    expect(() =>
      parseCountries(xml(afghanistan, italy.replace(original, replacement))),
    ).toThrow(/duplicate/i);
  });

  it("rejects DTDs instead of expanding custom entities", () => {
    const input =
      '<!DOCTYPE countries [<!ENTITY label "Afghanistan">]>' +
      xml(afghanistan.replace("Afghanistan", "&label;")).replace(
        '<?xml version="1.0" encoding="UTF-8"?>',
        "",
      );
    expect(() => parseCountries(input)).toThrow(/DOCTYPE/i);
  });
});
