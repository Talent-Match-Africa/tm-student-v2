import { describe, expect, it } from "vitest";
import { mapApiError } from "./api-error";

describe("mapApiError", () => {
  it("preserves safe validation details", () => {
    expect(
      mapApiError(
        {
          code: "student_request_validation_failed",
          message: "Review the submitted values.",
          errors: { subject: ["Subject is required."] },
        },
        400,
      ),
    ).toMatchObject({
      code: "student_request_validation_failed",
      message: "Review the submitted values.",
      errors: { subject: ["Subject is required."] },
    });
  });

  it("replaces internal backend details", () => {
    expect(
      mapApiError(
        { message: "Prisma database exception in node_modules" },
        500,
      ).message,
    ).toBe("Talent Match could not process this request right now.");
  });

  it("uses student-specific session messages", () => {
    expect(mapApiError(null, 401).message).toContain("student session");
  });
});
