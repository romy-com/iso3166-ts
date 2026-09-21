import { describe, expect, it } from "vitest";
import { countries, country } from "../src/index";

const italy = {
  alpha2: "IT",
  alpha3: "ITA",
  name: "Italy",
  numeric: "380",
};

describe("countries", () => {
  it("provides records for a country selector", () => {
    expect(
      countries.map(({ alpha2, name }) => ({ value: alpha2, label: name })),
    ).toContainEqual({ value: "IT", label: "Italy" });
  });

  it("includes territories", () => {
    expect(countries).toContainEqual({
      alpha2: "AX",
      alpha3: "ALA",
      name: "Åland Islands",
      numeric: "248",
    });
  });

  it("prevents callers from replacing entries in the shared list", () => {
    const original = countries[0];
    const changed = Reflect.set(countries, "0", undefined);
    if (changed) Reflect.set(countries, "0", original);
    expect(changed).toBe(false);
  });

  it("prevents callers from changing shared records", () => {
    const record = country("IT");
    if (!record) throw new Error("Italy is missing from the dataset");
    const original = record.name;
    const changed = Reflect.set(record, "name", "Changed");
    if (changed) Reflect.set(record, "name", original);
    expect(changed).toBe(false);
  });
});

describe("country", () => {
  it.each(["IT", "ITA", "380"])("looks up Italy using %s", (input) => {
    expect(country(input)).toEqual(italy);
  });

  it.each(["it", "ita", "ItA"])(
    "accepts case-insensitive codes: %s",
    (input) => {
      expect(country(input)).toEqual(italy);
    },
  );

  it.each([" IT ", "\tita\n", " 380 "])(
    "trims surrounding whitespace: %s",
    (input) => {
      expect(country(input)).toEqual(italy);
    },
  );

  it.each(["ß", "ıT", "ſR"])(
    "does not turn non-ASCII input into a country code: %s",
    (input) => {
      expect(country(input)).toBeUndefined();
    },
  );

  it("preserves leading zeroes in numeric codes", () => {
    expect(country("004")).toEqual({
      alpha2: "AF",
      alpha3: "AFG",
      name: "Afghanistan",
      numeric: "004",
    });
  });

  it.each([
    "",
    "ZZ",
    "ZZZ",
    "000",
    "999",
    "4",
    "04",
    "0004",
    "Italy",
    "UK",
    "XK",
    "__proto__",
  ])("returns undefined for unknown or unsupported input: %s", (input) => {
    expect(country(input)).toBeUndefined();
  });
});
