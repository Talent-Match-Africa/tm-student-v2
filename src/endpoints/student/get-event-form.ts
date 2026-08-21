import { backendJson, type BackendResult } from "@/lib/api-client";
import type { StudentEventFormResponse } from "@/types/student-event-form";

export function getEventForm(
  accessToken: string,
): Promise<BackendResult<StudentEventFormResponse>> {
  return backendJson("/student/event-form", {
    accessToken,
    method: "GET",
  });
}
