import { backendJson, type BackendResult } from "@/lib/api-client";
import type { StudentDashboardResponse } from "@/types/student-dashboard";

export function getStudentDashboard(
  accessToken: string,
): Promise<BackendResult<StudentDashboardResponse>> {
  return backendJson<StudentDashboardResponse>("/student/dashboard", {
    accessToken,
    method: "GET",
  });
}
