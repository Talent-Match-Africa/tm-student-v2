import { backendJson, type BackendResult } from "@/lib/api-client";
import type { StudentFacultyOption } from "@/types/student-profile";

export function listProfileFaculties(universityId: string): Promise<BackendResult<{ status: "success"; data: StudentFacultyOption[] }>> {
  return backendJson(`/auth/register/student/universities/${universityId}/faculties`, { method: "GET" });
}
