import {
  mkdtempSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { assertProductionEnvironmentPolicy } from "./production-environment";

const trackedEnvironmentKeys = ["ENV_FILE_POLICY", "NODE_ENV"] as const;
const environment: Record<string, string | undefined> = process.env;

describe("assertProductionEnvironmentPolicy", () => {
  const originalEnvironment = new Map<string, string | undefined>();
  const temporaryDirectories: string[] = [];

  beforeEach(() => {
    for (const key of trackedEnvironmentKeys) {
      originalEnvironment.set(key, environment[key]);
    }
  });

  afterEach(() => {
    for (const key of trackedEnvironmentKeys) {
      const value = originalEnvironment.get(key);
      if (value === undefined) delete environment[key];
      else environment[key] = value;
    }

    originalEnvironment.clear();
    temporaryDirectories.splice(0).forEach((directory) => {
      rmSync(directory, { force: true, recursive: true });
    });
  });

  function createProjectDirectory(): string {
    const directory = mkdtempSync(join(tmpdir(), "tm-student-environment-"));
    temporaryDirectories.push(directory);
    return directory;
  }

  it("does nothing when the production-only policy is disabled", () => {
    delete environment.ENV_FILE_POLICY;

    expect(() => assertProductionEnvironmentPolicy("/missing")).not.toThrow();
  });

  it("requires the production Node environment", () => {
    environment.ENV_FILE_POLICY = "production-only";
    environment.NODE_ENV = "test";

    expect(() => assertProductionEnvironmentPolicy()).toThrow(
      "ENV_FILE_POLICY=production-only requires NODE_ENV=production.",
    );
  });

  it("requires the production environment file", () => {
    const directory = createProjectDirectory();
    environment.ENV_FILE_POLICY = "production-only";
    environment.NODE_ENV = "production";

    expect(() => assertProductionEnvironmentPolicy(directory)).toThrow(
      ".env.production is required for production.",
    );
  });

  it("rejects environment files that can override production", () => {
    const directory = createProjectDirectory();
    writeFileSync(join(directory, ".env.production"), "APP_ENV=staging\n");
    writeFileSync(join(directory, ".env.local"), "APP_ENV=development\n");
    environment.ENV_FILE_POLICY = "production-only";
    environment.NODE_ENV = "production";

    expect(() => assertProductionEnvironmentPolicy(directory)).toThrow(
      "Remove forbidden production environment files: .env.local.",
    );
  });

  it("rejects unresolved production placeholders", () => {
    const directory = createProjectDirectory();
    writeFileSync(
      join(directory, ".env.production"),
      "API_SECRET=CHANGE_ME\nAPP_ENV=staging\n",
    );
    environment.ENV_FILE_POLICY = "production-only";
    environment.NODE_ENV = "production";

    expect(() => assertProductionEnvironmentPolicy(directory)).toThrow(
      "Replace placeholder production environment values: API_SECRET.",
    );
  });

  it("accepts an isolated production environment", () => {
    const directory = createProjectDirectory();
    writeFileSync(join(directory, ".env.production"), "APP_ENV=staging\n");
    environment.ENV_FILE_POLICY = "production-only";
    environment.NODE_ENV = "production";

    expect(() => assertProductionEnvironmentPolicy(directory)).not.toThrow();
  });
});
