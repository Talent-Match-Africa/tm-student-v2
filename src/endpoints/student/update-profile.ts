import { backendJson, type BackendResult } from "@/lib/api-client";
import type { StudentProfile } from "@/types/student-self-service";

export function updateProfile(
  accessToken: string,
  input: Record<string, unknown>,
): Promise<BackendResult<StudentProfile>> {
  return backendJson("/student/profile", {
    accessToken,
    body: input,
    method: "PATCH",
  });
}
