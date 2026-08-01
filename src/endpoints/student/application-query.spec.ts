import { describe, expect, it } from "vitest";
import {
  buildApplicationQuery,
  parseApplicationFilters,
} from "./application-query";

describe("student application query", () => {
  it("normalizes reversed application date ranges", () => {
    expect(
      parseApplicationFilters({
        applied_from: "2026-07-31",
        applied_to: "2026-07-01",
      }),
    ).toMatchObject({
      appliedFrom: "2026-07-01",
      appliedTo: "2026-07-31",
    });
  });

  it("forwards supported application date filters", () => {
    const query = buildApplicationQuery({
      appliedFrom: "2026-07-01",
      appliedTo: "2026-07-31",
      page: 2,
      search: "engineering",
      status: "APPLIED",
    });
    expect(query).toContain("applied_from=2026-07-01");
    expect(query).toContain("applied_to=2026-07-31");
  });
});
