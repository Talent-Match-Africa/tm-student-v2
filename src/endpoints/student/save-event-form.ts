import { backendJson, type BackendResult } from "@/lib/api-client";
import type { StudentEventFormMutationResponse } from "@/types/student-event-form";

export interface SaveEventFormInput {
  attend: boolean;
  employed: boolean;
  which_cohort: string;
  working_place: string;
}

export function saveEventForm(
  accessToken: string,
  input: SaveEventFormInput,
): Promise<BackendResult<StudentEventFormMutationResponse>> {
  return backendJson("/student/event-form", {
    accessToken,
    body: input,
    method: "POST",
  });
}
