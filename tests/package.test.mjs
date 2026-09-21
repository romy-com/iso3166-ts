import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { test } from "node:test";

const require = createRequire(import.meta.url);
const modules = [
  ["ESM", await import("iso3166-ts")],
  ["CommonJS", require("iso3166-ts")],
];

for (const [format, api] of modules) {
  test(`${format}: exposes only the agreed runtime API`, () => {
    assert.deepEqual(Object.keys(api).sort(), ["countries", "country"]);
  });

  test(`${format}: every country can be looked up through all three codes`, () => {
    assert.equal(api.countries.length, 249);
    for (const record of api.countries) {
      assert.deepEqual(Object.keys(record).sort(), [
        "alpha2",
        "alpha3",
        "name",
        "numeric",
      ]);
      for (const code of [record.alpha2, record.alpha3, record.numeric]) {
        assert.deepEqual(api.country(code), record);
      }
    }
    assert.equal(api.country("ZZ"), undefined);
    assert.equal(api.country("004")?.numeric, "004");
  });
}
