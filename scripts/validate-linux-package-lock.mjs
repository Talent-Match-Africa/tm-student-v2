import { readFileSync } from "node:fs";

const lockfile = JSON.parse(readFileSync("package-lock.json", "utf8"));
const packages = lockfile.packages ?? {};

const requiredPackages = new Map([
  ["node_modules/@emnapi/core", "1.11.3"],
  ["node_modules/@emnapi/runtime", "1.11.3"],
  ["node_modules/@emnapi/wasi-threads", "1.2.3"],
  [
    "node_modules/@unrs/resolver-binding-wasm32-wasi/node_modules/@emnapi/core",
    "1.10.0",
  ],
  [
    "node_modules/@unrs/resolver-binding-wasm32-wasi/node_modules/@emnapi/runtime",
    "1.10.0",
  ],
  [
    "node_modules/@unrs/resolver-binding-wasm32-wasi/node_modules/@emnapi/wasi-threads",
    "1.2.1",
  ],
]);

const errors = [];

for (const [packagePath, expectedVersion] of requiredPackages) {
  const entry = packages[packagePath];

  if (!entry) {
    errors.push(`Missing Linux lock entry: ${packagePath}`);
    continue;
  }

  if (entry.version !== expectedVersion) {
    errors.push(
      `Invalid Linux lock entry: ${packagePath} must be ${expectedVersion}, found ${entry.version}.`,
    );
  }
}

for (const packagePath of [
  "node_modules/@emnapi/core",
  "node_modules/@emnapi/runtime",
  "node_modules/@emnapi/wasi-threads",
]) {
  const entry = packages[packagePath];

  if (entry && (!entry.optional || !entry.peer)) {
    errors.push(`Invalid Linux optional peer metadata for ${packagePath}.`);
  }
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("Linux package-lock integrity check passed.");
