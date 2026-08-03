import { describe, expect, it } from "vitest";
import { buildAppointmentsQuery, parseAppointmentFilters } from "./utils";

describe("student appointment filters", () => {
  it("normalizes reversed scheduled date ranges", () => {
    expect(
      parseAppointmentFilters({
        date_from: "2026-08-31",
        date_to: "2026-08-01",
        schedule_scope: "past",
      }),
    ).toMatchObject({
      dateFrom: "2026-08-01",
      dateTo: "2026-08-31",
      scheduleScope: "PAST",
    });
  });

  it("forwards student-safe appointment filters", () => {
    const query = buildAppointmentsQuery({
      dateFrom: "2026-08-01",
      dateTo: "2026-08-31",
      ordering: "date",
      page: 2,
      scheduleScope: "UPCOMING",
      search: "career",
      status: "CONFIRMED",
    });
    expect(query).toContain("date_from=2026-08-01");
    expect(query).toContain("date_to=2026-08-31");
    expect(query).toContain("schedule_scope=UPCOMING");
    expect(query).not.toContain("university");
  });
});
