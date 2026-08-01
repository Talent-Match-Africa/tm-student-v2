import { backendJson, type BackendResult } from "@/lib/api-client";
import type { StudentUniversityOption } from "@/types/student-profile";

export function listProfileUniversities(): Promise<BackendResult<{ status: "success"; data: StudentUniversityOption[] }>> {
  return backendJson("/auth/register/student/universities", { method: "GET" });
}
