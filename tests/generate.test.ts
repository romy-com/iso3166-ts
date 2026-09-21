import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { afterEach, describe, expect, it } from "vitest";
import { parseCountries } from "../scripts/parse-countries";

const script = fileURLToPath(
  new URL("../scripts/ingest-iso-3166-xml.ts", import.meta.url),
);
const source = fileURLToPath(new URL("../data/iso-3166.xml", import.meta.url));
const directories: string[] = [];

function temporaryDirectory(): string {
  const directory = mkdtempSync(join(tmpdir(), "iso3166-test-"));
  directories.push(directory);
  return directory;
}

function generate(input: string, output: string) {
  return spawnSync(
    process.execPath,
    ["--import", "tsx", script, input, output],
    {
      encoding: "utf8",
    },
  );
}

afterEach(() => {
  for (const directory of directories.splice(0)) {
    rmSync(directory, { recursive: true, force: true });
  }
});

describe("data generation", () => {
  it("generates importable TypeScript containing the source records", () => {
    const output = join(temporaryDirectory(), "data.mts");
    const result = generate(source, output);
    expect(result.status, result.stderr).toBe(0);
    expect(existsSync(output)).toBe(true);

    const loaded = spawnSync(
      process.execPath,
      [
        "--import",
        "tsx",
        "--input-type=module",
        "-e",
        `import { countryData } from ${JSON.stringify(pathToFileURL(output).href)}; console.log(JSON.stringify(countryData));`,
      ],
      { encoding: "utf8" },
    );
    expect(loaded.status, loaded.stderr).toBe(0);
    expect(JSON.parse(loaded.stdout)).toEqual(
      parseCountries(readFileSync(source, "utf8")),
    );
  });

  it("produces identical output on repeated runs", () => {
    const output = join(temporaryDirectory(), "data.ts");
    const first = generate(source, output);
    expect(first.status, first.stderr).toBe(0);
    expect(existsSync(output)).toBe(true);
    const original = readFileSync(output, "utf8");

    const second = generate(source, output);
    expect(second.status, second.stderr).toBe(0);
    expect(readFileSync(output, "utf8")).toBe(original);
  });

  it("does not overwrite existing output when the XML is invalid", () => {
    const directory = temporaryDirectory();
    const input = join(directory, "invalid.xml");
    const output = join(directory, "data.ts");
    writeFileSync(input, "<countries/>");
    writeFileSync(output, "previous valid data");

    const result = generate(input, output);
    expect(result.status).not.toBe(0);
    expect(readFileSync(output, "utf8")).toBe("previous valid data");
  });
});
