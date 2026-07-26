import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const PRODUCTION_ONLY_ENV_POLICY = "production-only";
const PRODUCTION_ENV_FILE = ".env.production";
const FORBIDDEN_PRODUCTION_ENV_FILES = [
  ".env",
  ".env.local",
  ".env.production.local",
] as const;

export function assertProductionEnvironmentPolicy(cwd = process.cwd()): void {
  if (process.env.ENV_FILE_POLICY !== PRODUCTION_ONLY_ENV_POLICY) return;

  if (process.env.NODE_ENV !== "production") {
    throw new Error(
      "ENV_FILE_POLICY=production-only requires NODE_ENV=production.",
    );
  }

  const productionPath = resolve(cwd, PRODUCTION_ENV_FILE);
  if (!existsSync(productionPath)) {
    throw new Error(`${PRODUCTION_ENV_FILE} is required for production.`);
  }

  const forbidden = FORBIDDEN_PRODUCTION_ENV_FILES.filter((file) =>
    existsSync(resolve(cwd, file)),
  );
  if (forbidden.length) {
    throw new Error(
      `Remove forbidden production environment files: ${forbidden.join(", ")}.`,
    );
  }

  assertNoPlaceholderValues(readFileSync(productionPath, "utf8"));
}

function assertNoPlaceholderValues(contents: string): void {
  const unresolved = contents
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#") && line.includes("="))
    .map((line) => {
      const separator = line.indexOf("=");
      return [line.slice(0, separator).trim(), line.slice(separator + 1)] as const;
    })
    .filter(([, value]) => value.includes("CHANGE_ME"))
    .map(([key]) => key)
    .sort();

  if (unresolved.length) {
    throw new Error(
      `Replace placeholder production environment values: ${unresolved.join(", ")}.`,
    );
  }
}
