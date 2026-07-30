import { describe, expect, it } from "vitest";
import { isStudentSidebarLinkActive } from "./student-sidebar-utils";

describe("isStudentSidebarLinkActive", () => {
  it("keeps the dashboard exact", () => {
    expect(
      isStudentSidebarLinkActive("/dashboard/details", {
        label: "Dashboard",
        href: "/dashboard",
        icon: [] as never,
        exact: true,
      }),
    ).toBe(false);
  });

  it("activates feature detail routes", () => {
    expect(
      isStudentSidebarLinkActive("/opportunities/jobs/record", {
        label: "Opportunities",
        href: "/opportunities",
        icon: [] as never,
      }),
    ).toBe(true);
  });
});
