import { readFileSync } from "node:fs";

const manifest = JSON.parse(readFileSync("package.json", "utf8"));
const lockfile = JSON.parse(readFileSync("package-lock.json", "utf8"));
const packages = lockfile.packages ?? {};
const lockRoot = packages[""] ?? {};

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

if (lockfile.lockfileVersion !== 3) {
  errors.push(
    `Invalid package-lock format: expected version 3, found ${lockfile.lockfileVersion ?? "none"}.`,
  );
}

for (const section of [
  "dependencies",
  "devDependencies",
  "optionalDependencies",
  "peerDependencies",
]) {
  const manifestEntries = manifest[section] ?? {};
  const lockEntries = lockRoot[section] ?? {};

  for (const packageName of new Set([
    ...Object.keys(manifestEntries),
    ...Object.keys(lockEntries),
  ])) {
    if (manifestEntries[packageName] !== lockEntries[packageName]) {
      errors.push(
        `Manifest drift: ${section}.${packageName} differs between package.json and package-lock.json.`,
      );
    }
  }
}

if (manifest.overrides?.nanoid !== "3.3.18") {
  errors.push("Invalid nanoid override: package.json must pin nanoid to 3.3.18.");
}

const nanoidEntry = packages["node_modules/nanoid"];
if (!nanoidEntry || nanoidEntry.version !== "3.3.18") {
  errors.push(
    `Unsafe nanoid resolution: expected 3.3.18, found ${nanoidEntry?.version ?? "none"}.`,
  );
}

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
  "node_modules/@emnapi/wasi-threads",
]) {
  const entry = packages[packagePath];

  if (entry && !entry.optional) {
    errors.push(`Invalid Linux optional metadata for ${packagePath}.`);
  }
}

const runtimeEntry = packages["node_modules/@emnapi/runtime"];
if (runtimeEntry && !runtimeEntry.optional) {
  errors.push(
    "Invalid Linux optional metadata for node_modules/@emnapi/runtime.",
  );
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  console.error(
    "Regenerate package-lock.json with Node 20.20.2 and npm 10.8.2 before committing.",
  );
  process.exit(1);
}

console.log("Dependency lock and Linux package metadata checks passed.");
