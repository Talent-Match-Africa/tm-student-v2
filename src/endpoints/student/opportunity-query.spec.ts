import { describe, expect, it } from "vitest";
import {
  buildOpportunityApiHref,
  buildOpportunityQuery,
  parseOpportunityFilters,
} from "./opportunity-query";

describe("student opportunity query", () => {
  it("bounds unsupported URL filters", () => {
    expect(
      parseOpportunityFilters({
        page: "-1",
        search: "ab",
        status: "DELETED",
        ordering: "salary",
        work_flexibility: "FLEXIBLE",
      }),
    ).toMatchObject({
      page: 1,
      search: null,
      status: "ACTIVE",
      ordering: "-created_at",
      workFlexibility: null,
    });
  });

  it("builds only supported API query fields", () => {
    const query = buildOpportunityQuery({
      page: 2,
      createdFrom: "2026-07-01",
      createdTo: "2026-07-31",
      search: "engineering",
      status: "OPEN",
      ordering: "deadline",
      workFlexibility: "REMOTE",
      industrySector: null,
      location: "Kigali",
    });
    expect(query).toContain("page=2");
    expect(query).toContain("page_size=24");
    expect(query).toContain("search=engineering");
    expect(query).toContain("created_from=2026-07-01");
    expect(query).toContain("created_to=2026-07-31");
    expect(query).not.toContain("owner_id");
  });

  it("builds a same-origin URL for progressive result loading", () => {
    expect(
      buildOpportunityApiHref("internships", {
        page: 3,
        createdFrom: null,
        createdTo: null,
        search: null,
        status: "ACTIVE",
        ordering: "-created_at",
        workFlexibility: null,
        industrySector: null,
        location: null,
      }),
    ).toContain("/api/student/opportunities/internships?page=3");
  });
});
