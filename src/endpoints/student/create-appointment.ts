import { backendJson, type BackendResult } from "@/lib/api-client";
import type { Appointment } from "@/types/student-self-service";

export interface CreateAppointmentInput {
  counselor_id: string;
  date: string;
  message: string;
  subject: string;
}

export function createAppointment(
  accessToken: string,
  input: CreateAppointmentInput,
): Promise<BackendResult<Appointment>> {
  return backendJson("/student/appointments", {
    accessToken,
    body: input,
    method: "POST",
  });
}
